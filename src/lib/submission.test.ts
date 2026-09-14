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
  const sync = vi.fn<(payload: GhlLeadPayload) => Promise<SyncResult>>(async () => result);
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
    // Keys match the fields in the Katrina Kavvalos International GHL sub-account.
    expect(payload.fields).toEqual({
      direction_percent: 100,
      recognition_percent: 100,
      connection_percent: 100,
      consistency_percent: 100,
      opportunity_percent: 100,
      visibility_score: 100,
      visibility_gap: 0,
      visibility_level_quiz: "Chosen Expert",
      strongest_code: "Direction",
      weakest_code: "Direction",
      q2_desired_outcome: "Other",
      q3_perceived_problem: "Other",
      primary_visibility_problem: "Other",
      q4_primary_platform: "Other",
      inner_visibility_blocker: "Other",
      q25_years_experience: "More than 15 years",
      what_have_you_already_done_to_try_to_become_more_visible: [
        "Posted more consistently on social media",
        "Been a guest on podcasts or interview shows",
      ],
      q27_intent_level:
        "Increasing my visibility is a major priority and I am willing to invest in the right strategy or support",
      q28_written_response: "I overthink everything.",
      referral_code: res.body.referralCode,
      visibility_report_url: `https://quiz.test/results?r=${res.body.reportCode}&c=${res.body.referralCode}`,
      referred_by: undefined,
    });
  });

  it("saves readable answer text into the existing GHL answer fields", async () => {
    const d = deps();
    await processSubmission(body({ answers: { ...answers(), 2: "C", 3: "B", 4: "D", 19: "E", 25: "B", 27: "A" } }), d);
    expect(d.sync.mock.calls[0]![0].fields).toMatchObject({
      q2_desired_outcome: "Get more media, TV, magazine or press opportunities",
      q3_perceived_problem: "I do not stand out enough from others in my industry",
      primary_visibility_problem: "I do not stand out enough from others in my industry",
      q4_primary_platform: "LinkedIn",
      inner_visibility_blocker: "I overthink things, second guess myself or wait until everything feels perfect",
      q25_years_experience: "1 to 3 years",
      q27_intent_level: "I am interested, but it is not a major priority right now",
    });
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
