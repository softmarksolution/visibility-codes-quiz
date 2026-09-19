import { describe, expect, it } from "vitest";
import { ALL_QUIZ_TAGS, COMPLETED_TAG, OPTIN_TAG, collectTags } from "./tags";

describe("collectTags", () => {
  it("collects tags from tagged questions plus the completion tag", () => {
    const tags = collectTags({ 1: "B", 2: "A", 3: "C", 4: "D", 5: "A", 19: "E", 25: "C", 26: ["A"], 27: "D", 28: "x" });
    expect(tags).toEqual([
      "ROLE_COACH",
      "GOAL_CLIENTS_INCOME",
      "PROBLEM_RECOGNITION",
      "PLATFORM_LINKEDIN",
      "BLOCKER_OVERTHINKING",
      "EXPERIENCE_4_7",
      "INTENT_HIGH",
      "READY_FOR_ACTION",
      "READY_TO_INVEST",
      COMPLETED_TAG,
    ]);
  });

  it("does not duplicate tags", () => {
    const tags = collectTags({ 27: "C" });
    expect(tags.filter((t) => t === "INTENT_HIGH")).toHaveLength(1);
  });

  it("lists every possible quiz tag once", () => {
    expect(ALL_QUIZ_TAGS).toContain("BLOCKER_STRATEGY_ONLY");
    expect(ALL_QUIZ_TAGS).toContain(COMPLETED_TAG);
    expect(new Set(ALL_QUIZ_TAGS).size).toBe(ALL_QUIZ_TAGS.length);
  });

  /* ALL_QUIZ_TAGS is the set the completion sync is allowed to DELETE. If the
     opt-in tag ever lands in it, finishing the quiz would strip the tag that
     records the visitor opted in — the very thing it exists to record. */
  it("keeps the opt-in tag out of the set the quiz may remove", () => {
    expect(ALL_QUIZ_TAGS).not.toContain(OPTIN_TAG);
    expect(collectTags({ 1: "B", 27: "D" })).not.toContain(OPTIN_TAG);
    expect(OPTIN_TAG).not.toBe(COMPLETED_TAG);
  });
});
