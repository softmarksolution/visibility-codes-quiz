import { describe, expect, it } from "vitest";
import { SCORED_QUESTIONS, type Answers } from "./questions";
import { decodeReportCode, encodeReportCode } from "./reportCode";
import { computeResults } from "./scoring";

function sampleAnswers(): Answers {
  const answers: Answers = { 1: "B", 26: ["A"], 28: "Time" };
  SCORED_QUESTIONS.forEach((q, i) => {
    answers[q.id] = q.options[i % q.options.length]!.id;
  });
  return answers;
}

describe("report code", () => {
  it("encodes one letter per scored question with a version prefix", () => {
    const code = encodeReportCode(sampleAnswers());
    expect(code).toMatch(/^v1[A-G]{19}$/);
  });

  it("round-trips to the same results", () => {
    const answers = sampleAnswers();
    const decoded = decodeReportCode(encodeReportCode(answers));
    expect(decoded).not.toBeNull();
    expect(computeResults(decoded!)).toEqual(computeResults(answers));
  });

  it("never includes unscored answers", () => {
    const decoded = decodeReportCode(encodeReportCode(sampleAnswers()))!;
    expect(decoded[1]).toBeUndefined();
    expect(decoded[28]).toBeUndefined();
  });

  it.each([
    ["missing", undefined],
    ["empty", ""],
    ["wrong version", "v2" + "A".repeat(19)],
    ["too short", "v1" + "A".repeat(18)],
    ["too long", "v1" + "A".repeat(20)],
    ["lowercase", "v1" + "a".repeat(19)],
    ["option not on question (Q5 has A-D)", "v1E" + "A".repeat(18)],
  ])("rejects %s", (_label, code) => {
    expect(decodeReportCode(code)).toBeNull();
  });

  it("throws when encoding incomplete answers", () => {
    const answers = sampleAnswers();
    delete answers[24];
    expect(() => encodeReportCode(answers)).toThrow(/Q24/);
  });
});
