import { describe, expect, it } from "vitest";
import { QUESTIONS, type Answers } from "./questions";
import { isAnswered, validateAnswers, validateLead } from "./validate";

function completeAnswers(): Answers {
  const answers: Answers = {};
  for (const q of QUESTIONS) {
    if (q.type === "single") answers[q.id] = q.options[0]!.id;
    if (q.type === "multi") answers[q.id] = [q.options[0]!.id, q.options[2]!.id];
    if (q.type === "text") answers[q.id] = "  Not enough time.  ";
  }
  return answers;
}

describe("validateAnswers", () => {
  it("accepts a complete set and trims text", () => {
    const result = validateAnswers(completeAnswers());
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.answers[28]).toBe("Not enough time.");
  });

  it("accepts answers keyed by strings (as parsed from JSON)", () => {
    const parsed = JSON.parse(JSON.stringify(completeAnswers()));
    expect(validateAnswers(parsed).ok).toBe(true);
  });

  it("strips unknown question keys", () => {
    const result = validateAnswers({ ...completeAnswers(), 99: "A", evil: "x" });
    expect(result.ok).toBe(true);
    if (result.ok) expect(Object.keys(result.answers)).toHaveLength(28);
  });

  it.each([
    ["not an object", null],
    ["missing a question", (() => { const a = completeAnswers(); delete a[3]; return a; })()],
    ["invalid single option", { ...completeAnswers(), 5: "Z" }],
    ["array for single question", { ...completeAnswers(), 5: ["A"] }],
    ["empty multi", { ...completeAnswers(), 26: [] }],
    ["duplicate multi", { ...completeAnswers(), 26: ["A", "A"] }],
    ["invalid multi option", { ...completeAnswers(), 26: ["A", "Z"] }],
    ["blank text", { ...completeAnswers(), 28: "   " }],
    ["text too long", { ...completeAnswers(), 28: "x".repeat(501) }],
  ])("rejects %s", (_label, input) => {
    expect(validateAnswers(input).ok).toBe(false);
  });
});

describe("isAnswered", () => {
  it("checks each question type", () => {
    const [single, multi, text] = [QUESTIONS[0]!, QUESTIONS[25]!, QUESTIONS[27]!];
    expect(isAnswered(single, "A")).toBe(true);
    expect(isAnswered(single, undefined)).toBe(false);
    expect(isAnswered(multi, [])).toBe(false);
    expect(isAnswered(multi, ["B"])).toBe(true);
    expect(isAnswered(text, "  ")).toBe(false);
    expect(isAnswered(text, "Fear")).toBe(true);
  });
});

describe("validateLead", () => {
  it("normalises name, email and phone", () => {
    expect(validateLead({ firstName: "  Emma ", email: " Emma@Example.COM ", phone: "347-428-0292" })).toEqual({
      ok: true,
      lead: { firstName: "Emma", email: "emma@example.com", phone: "+1 (347) 428-0292" },
    });
  });

  /* This audience is largely Australian and an Australian mobile is also ten
     digits, so anything that is not a NANP number is kept exactly as typed
     rather than rewritten into an unreachable US number. */
  it("keeps a non-NANP number as typed", () => {
    const result = validateLead({ firstName: "Emma", email: "a@b.co", phone: " 0412 345 678 " });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.lead.phone).toBe("0412 345 678");
  });

  it.each([
    [{ firstName: "", email: "a@b.co", phone: "0412345678" }],
    [{ firstName: "x".repeat(81), email: "a@b.co", phone: "0412345678" }],
    [{ firstName: "Emma", email: "not-an-email", phone: "0412345678" }],
    [{ firstName: "Emma", email: "a@b", phone: "0412345678" }],
    [{ firstName: "Emma", phone: "0412345678" }],
    [{ firstName: "Emma", email: "a@b.co" }],
    [{ firstName: "Emma", email: "a@b.co", phone: "   " }],
    [{ firstName: "Emma", email: "a@b.co", phone: "x".repeat(41) }],
    ["nope"],
  ])("rejects %j", (input) => {
    expect(validateLead(input).ok).toBe(false);
  });
});
