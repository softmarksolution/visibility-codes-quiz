import { describe, expect, it } from "vitest";
import { QUESTIONS, SCORED_QUESTIONS, type Answers, type PillarId } from "./questions";
import { badgeFor, computeResults, levelForScore, PILLAR_MAX } from "./scoring";

/** Build answers choosing, for each scored question, the option id that gives `points`. */
function answersWithPoints(points: Partial<Record<PillarId, number[]>>): Answers {
  const answers: Answers = {};
  const cursor: Partial<Record<PillarId, number>> = {};
  for (const q of SCORED_QUESTIONS) {
    const pillar = q.pillar!;
    const idx = cursor[pillar] ?? 0;
    cursor[pillar] = idx + 1;
    const wanted = points[pillar]?.[idx] ?? 0;
    const opt = q.options.find((o) => o.score === wanted);
    if (!opt) throw new Error(`Q${q.id} has no option worth ${wanted}`);
    answers[q.id] = opt.id;
  }
  return answers;
}

describe("question data", () => {
  it("has 28 questions numbered 1 to 28", () => {
    expect(QUESTIONS.map((q) => q.id)).toEqual(Array.from({ length: 28 }, (_, i) => i + 1));
  });

  it("scores exactly Q5-18 and Q20-24", () => {
    expect(SCORED_QUESTIONS.map((q) => q.id)).toEqual([5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 20, 21, 22, 23, 24]);
  });

  it("pillar maximums match the calculation guide", () => {
    expect(PILLAR_MAX).toEqual({ direction: 15, recognition: 15, connection: 12, consistency: 6, opportunity: 9 });
  });
});

describe("computeResults", () => {
  it("averages the five pillar percentages (not total points)", () => {
    // Direction 9/15=60, Recognition 12/15=80, Connection 9/12=75, Consistency 3/6=50, Opportunity 4/9=44.44
    const r = computeResults(
      answersWithPoints({
        direction: [3, 3, 3, 0, 0],
        recognition: [3, 3, 3, 3, 0],
        connection: [3, 3, 3, 0],
        consistency: [3, 0],
        opportunity: [2, 2, 0],
      }),
    );
    expect(r.pillars.direction.percent).toBeCloseTo(60);
    expect(r.pillars.opportunity.percent).toBeCloseTo(44.444, 2);
    expect(r.pillars.opportunity.display).toBe(44);
    expect(r.score).toBe(62); // (60+80+75+50+44.44)/5 = 61.89
    expect(r.gap).toBe(38);
    expect(r.level).toBe("Building Recognition");
    expect(r.strongest).toBe("recognition");
    expect(r.primaryGap).toBe("opportunity");
  });

  it("handles all-zero answers", () => {
    const r = computeResults(answersWithPoints({}));
    expect(r.score).toBe(0);
    expect(r.gap).toBe(100);
    expect(r.level).toBe("Hidden Potential");
    expect(r.strongest).toBe("direction");
    expect(r.primaryGap).toBe("direction");
  });

  it("handles all-max answers", () => {
    const r = computeResults(
      answersWithPoints({
        direction: [3, 3, 3, 3, 3],
        recognition: [3, 3, 3, 3, 3],
        connection: [3, 3, 3, 3],
        consistency: [3, 3],
        opportunity: [3, 3, 3],
      }),
    );
    expect(r.score).toBe(100);
    expect(r.gap).toBe(0);
    expect(r.level).toBe("Chosen Expert");
  });

  it("breaks ties by doc pillar order", () => {
    // Recognition and Connection both 100%, Direction and Consistency both 0%.
    const r = computeResults(
      answersWithPoints({
        recognition: [3, 3, 3, 3, 3],
        connection: [3, 3, 3, 3],
        opportunity: [1, 1, 1],
      }),
    );
    expect(r.strongest).toBe("recognition");
    expect(r.primaryGap).toBe("direction");
  });

  it("counts Q13 and Q20 options that share a score", () => {
    const answers = answersWithPoints({});
    answers[13] = "G"; // More than 500,000 = 3
    answers[20] = "E"; // Multiple times a day = 3
    const r = computeResults(answers);
    expect(r.pillars.recognition.points).toBe(3);
    expect(r.pillars.consistency.points).toBe(3);
  });

  it("ignores unscored questions", () => {
    const base = answersWithPoints({});
    const withExtras: Answers = { ...base, 1: "A", 19: "C", 26: ["A", "B"], 28: "Time" };
    expect(computeResults(withExtras)).toEqual(computeResults(base));
  });

  it("throws when a scored question is missing or invalid", () => {
    const missing = answersWithPoints({});
    delete missing[12];
    expect(() => computeResults(missing)).toThrow(/Q12/);
    const invalid = answersWithPoints({});
    invalid[5] = "E";
    expect(() => computeResults(invalid)).toThrow(/Q5/);
  });
});

describe("levelForScore", () => {
  it.each([
    [0, "Hidden Potential"],
    [24, "Hidden Potential"],
    [25, "Emerging Visibility"],
    [49, "Emerging Visibility"],
    [50, "Building Recognition"],
    [74, "Building Recognition"],
    [75, "Recognised"],
    [89, "Recognised"],
    [90, "Chosen Expert"],
    [100, "Chosen Expert"],
  ])("%i -> %s", (score, level) => {
    expect(levelForScore(score)).toBe(level);
  });
});

describe("badgeFor", () => {
  it("labels strongest and primary gap first, then by band", () => {
    const r = computeResults(
      answersWithPoints({
        direction: [1, 1, 1, 1, 1], // 33
        recognition: [3, 2, 2, 2, 2], // 73
        connection: [2, 2, 1, 1], // 50
        consistency: [2, 1], // 50
        opportunity: [2, 1, 1], // 44
      }),
    );
    expect(badgeFor(r, "direction")).toBe("Primary Blocker");
    expect(badgeFor(r, "recognition")).toBe("Strongest Area");
    expect(badgeFor(r, "connection")).toBe("Building");
    expect(badgeFor(r, "opportunity")).toBe("Developing");
  });
});
