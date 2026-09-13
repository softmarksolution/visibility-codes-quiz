import { describe, expect, it, vi } from "vitest";
import type { GhlLeadPayload, SyncResult } from "./ghl";
import { QUESTIONS, type Answers } from "./quiz/questions";
import { ALL_QUIZ_TAGS, COMPLETED_TAG } from "./quiz/tags";
import { processSubmission } from "./submission";

function answers(): Answers {
  const a: Answers = {};
  for (const q of QUESTIONS) {
    if (q.type === "single") a[q.id] = q.options[q.options.length - 1]!.id; // highest score / "Other"
    if (q.type === "multi") a[q.id] = ["A", "C"];
    if (q.type === "text") a[q.id] = "I overthink everything.";
  }
  return a;
}

function body(overrides: Record<string, unknown> = {}) {
  return { firstName: "Emma", email: "Emma@Example.com", answers: answers(), website: "", ...overrides };
}

function deps(result: SyncResult = { synced: true, contactId: "c1" }) {
  const sync = vi.fn(async (_payload: GhlLeadPayload) => result);
  return { sync, siteUrl: "https://quiz.test" };
}

describe("processSubmission", () => {
  it("recomputes results and sends the full lead to GHL", async () => {
    const d = deps();
    const res = await processSubmission(body(), d);
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ ok: true, synced: true });
    if (!res.body.ok) throw new Error("expected ok");
    expect(res.body.reportCode).toMatch(/^v1[A-G]{19}$/);
    expect(res.body.referralCode).toMatch(/^emma-[a-z0-9]{5}$/);

    const payload = d.sync.mock.calls[0]![0];
    expect(payload.email).toBe("emma@example.com");
    expect(payload.tags).toContain("ROLE_OTHER");
    expect(payload.tags).toContain(COMPLETED_TAG);
    expect(payload.managedTags).toEqual(ALL_QUIZ_TAGS);
    expect(payload.fields).toMatchObject({
      direction_percent: 100,
      recognition_percent: 100,
      connection_percent: 100,
      consistency_percent: 100,
      opportunity_percent: 100,
      visibility_score: 100,
      visibility_gap: 0,
      visibility_level: "Chosen Expert",
      strongest_visibility_area: "Direction",
      primary_visibility_gap: "Direction",
      visibility_actions_tried: "Posted more consistently on social media; Been a guest on podcasts or interview shows",
      biggest_visibility_obstacle: "I overthink everything.",
      referral_code: res.body.referralCode,
      visibility_report_url: `https://quiz.test/results?r=${res.body.reportCode}&c=${res.body.referralCode}`,
    });
    expect(payload.fields.referred_by).toBeUndefined();
  });

  it("ignores client-sent scores", async () => {
    const d = deps();
    await processSubmission(body({ score: 3, visibility_score: 3 }), d);
    expect(d.sync.mock.calls[0]![0].fields.visibility_score).toBe(100);
  });

  it("stores a valid incoming referral and drops a malformed one", async () => {
    const good = deps();
    await processSubmission(body({ ref: "Sam-ab12c" }), good);
    expect(good.sync.mock.calls[0]![0].fields.referred_by).toBe("sam-ab12c");

    const bad = deps();
    await processSubmission(body({ ref: "<script>" }), bad);
    expect(bad.sync.mock.calls[0]![0].fields.referred_by).toBeUndefined();
  });

  it("reports synced false when GHL fails, but still succeeds for the visitor", async () => {
    const res = await processSubmission(body(), deps({ synced: false, reason: "error" }));
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ ok: true, synced: false });
  });

  it("silently drops honeypot submissions", async () => {
    const d = deps();
    const res = await processSubmission(body({ website: "spam.example" }), d);
    expect(res.status).toBe(200);
    expect(d.sync).not.toHaveBeenCalled();
  });

  it.each([
    ["non-object body", "nope"],
    ["missing email", body({ email: "" })],
    ["bad answers", body({ answers: { ...answers(), 5: "Z" } })],
  ])("rejects %s with 400", async (_label, input) => {
    const d = deps();
    const res = await processSubmission(input, d);
    expect(res.status).toBe(400);
    expect(d.sync).not.toHaveBeenCalled();
  });
});
