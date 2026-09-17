// Browser-only localStorage helpers. Every access is wrapped because storage can
// be unavailable (private mode, blocked site data).

import { QUESTIONS, type Answers } from "@/lib/quiz/questions";

const PROGRESS_KEY = "vc_quiz_progress_v1";
const NAME_KEY = "vc_first_name";
const REF_KEY = "vc_ref";

export interface Progress {
  answers: Answers;
  index: number;
}

function read(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function write(key: string, value: string | null) {
  try {
    if (value === null) window.localStorage.removeItem(key);
    else window.localStorage.setItem(key, value);
  } catch {
    // Storage unavailable: the quiz still works, it just won't survive a reload.
  }
}

/**
 * Restores a run that was interrupted, so a reload or a closed tab does not cost
 * someone the answers they already gave. Anything unreadable falls back to a
 * fresh start rather than throwing.
 *
 * This is only for *continuing* a run. Starting the quiz from the landing page
 * is a deliberate restart and clears the saved progress first, so a new run is
 * never scored against leftover answers from the previous one.
 */
export function loadProgress(): Progress {
  const empty: Progress = { answers: {}, index: 0 };
  const raw = read(PROGRESS_KEY);
  if (!raw) return empty;
  try {
    const parsed = JSON.parse(raw) as Partial<Progress>;
    const index =
      Number.isInteger(parsed.index) && parsed.index! >= 0 && parsed.index! < QUESTIONS.length ? parsed.index! : 0;
    const answers =
      parsed.answers && typeof parsed.answers === "object" && !Array.isArray(parsed.answers) ? parsed.answers : {};
    return { answers, index };
  } catch {
    return empty;
  }
}

export const saveProgress = (progress: Progress) => write(PROGRESS_KEY, JSON.stringify(progress));
/** Called when a run ends and when the landing page starts a new one. */
export const clearProgress = () => write(PROGRESS_KEY, null);

/** The name is tied to one report so a shared link never shows this device's name. */
export const saveName = (name: string, reportCode: string) => write(NAME_KEY, JSON.stringify({ name, reportCode }));

export function readNameFor(reportCode: string): string | null {
  try {
    const stored = JSON.parse(read(NAME_KEY) ?? "null") as { name?: unknown; reportCode?: unknown } | null;
    return stored?.reportCode === reportCode && typeof stored.name === "string" ? stored.name : null;
  } catch {
    return null;
  }
}

export const readRef = () => read(REF_KEY);
export const saveRef = (ref: string) => write(REF_KEY, ref);
