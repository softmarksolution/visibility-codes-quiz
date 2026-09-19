import { describe, expect, it } from "vitest";
import { ACTION_PLAN_URLS, actionPlanUrl } from "./actionPlan";
import { PILLAR_NAMES, QUESTIONS, type Answers, type PillarId } from "./quiz/questions";
import { computeResults } from "./quiz/scoring";

const PILLARS = Object.keys(PILLAR_NAMES) as PillarId[];

describe("actionPlanUrl", () => {
  it("has a page for all five pillars and no others", () => {
    expect(Object.keys(ACTION_PLAN_URLS).sort()).toEqual([...PILLARS].sort());
  });

  /* The five URLs the client supplied, verbatim. Anything that silently
     rewrites one of these sends a paying visitor to a 404. */
  it("points each pillar at its own page on the client's site", () => {
    expect(ACTION_PLAN_URLS).toEqual({
      direction: "https://thevisibilitycodes.com/action-plan-direction",
      recognition: "https://thevisibilitycodes.com/action-plan-recognition",
      consistency: "https://thevisibilitycodes.com/action-plan-consistency",
      connection: "https://thevisibilitycodes.com/action-plan-connection",
      opportunity: "https://thevisibilitycodes.com/action-plan-opportunity",
    });
  });

  it("never sends two pillars to the same page", () => {
    const urls = Object.values(ACTION_PLAN_URLS);
    expect(new Set(urls).size).toBe(urls.length);
  });

  /* The whole point of the hand-off: the edition sold must be the one the
     result calls for, which is the LOWEST scoring pillar. Answer every question
     at its best option except one pillar's, answered at its worst, and that
     pillar must be the one whose page the visitor is sent to. */
  it.each(PILLARS)("sends a visitor whose weakest pillar is %s to that pillar's page", (weakest) => {
    const answers: Answers = {};
    for (const q of QUESTIONS) {
      if (q.type === "text") answers[q.id] = "x";
      else if (q.type === "multi") answers[q.id] = [q.options[0]!.id];
      // Options run worst to best, so the first is the lowest score available.
      else answers[q.id] = (q.pillar === weakest ? q.options[0]! : q.options.at(-1)!).id;
    }

    const results = computeResults(answers);
    expect(results.primaryGap).toBe(weakest);
    expect(actionPlanUrl(results.primaryGap)).toBe(ACTION_PLAN_URLS[weakest]);
  });
});
