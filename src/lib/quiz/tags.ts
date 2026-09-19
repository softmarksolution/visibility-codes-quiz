import { QUESTIONS, type Answers } from "./questions";

/**
 * Added the moment the opt-in pop-up is submitted, before a single question is
 * answered. Use it as the GHL workflow trigger for "started but has not
 * finished" — every completed lead carries it too, so pair it with
 * COMPLETED_TAG to tell the two apart.
 *
 * It is deliberately NOT in ALL_QUIZ_TAGS: that list is what the quiz is
 * allowed to REMOVE on a later sync, and stripping the opt-in tag when someone
 * finishes would destroy exactly the signal it exists to carry. There is a test
 * on this.
 */
export const OPTIN_TAG = "VISIBILITY_QUIZ_OPTIN";

/** Added to every completed submission; use it as the GHL workflow trigger. */
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
