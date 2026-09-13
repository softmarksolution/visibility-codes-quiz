import { QUESTIONS, type Answers } from "./questions";

/** Added to every submission; use it as the GHL workflow trigger. */
export const COMPLETED_TAG = "VISIBILITY_QUIZ_COMPLETED";

export const ALL_QUIZ_TAGS: readonly string[] = [
  ...new Set([...QUESTIONS.flatMap((q) => q.options.flatMap((o) => o.tags ?? [])), COMPLETED_TAG]),
];

export function collectTags(answers: Answers): string[] {
  const tags = new Set<string>();
  for (const q of QUESTIONS) {
    if (q.type !== "single") continue;
    const option = q.options.find((o) => o.id === answers[q.id]);
    option?.tags?.forEach((t) => tags.add(t));
  }
  tags.add(COMPLETED_TAG);
  return [...tags];
}
