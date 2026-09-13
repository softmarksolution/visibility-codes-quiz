// The report link carries only the scored answer letters, never a name or email.

import { SCORED_QUESTIONS, type Answers } from "./questions";

const VERSION = "v1";

export function encodeReportCode(answers: Answers): string {
  const letters = SCORED_QUESTIONS.map((q) => {
    const value = answers[q.id];
    if (typeof value !== "string" || !q.options.some((o) => o.id === value)) {
      throw new Error(`Q${q.id} is missing a valid answer`);
    }
    return value;
  });
  return VERSION + letters.join("");
}

export function decodeReportCode(code: string | null | undefined): Answers | null {
  if (!code || !code.startsWith(VERSION)) return null;
  const letters = code.slice(VERSION.length);
  if (letters.length !== SCORED_QUESTIONS.length) return null;
  const answers: Answers = {};
  for (const [i, q] of SCORED_QUESTIONS.entries()) {
    const letter = letters[i]!;
    if (!q.options.some((o) => o.id === letter)) return null;
    answers[q.id] = letter;
  }
  return answers;
}
