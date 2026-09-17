// Browser-only localStorage helpers. Every access is wrapped because storage can
// be unavailable (private mode, blocked site data).

import { QUESTIONS, type Answers } from "@/lib/quiz/questions";

const PROGRESS_KEY = "vc_quiz_progress_v1";
const NAME_KEY = "vc_first_name";
const REF_KEY = "vc_ref";
const LEAD_KEY = "vc_lead";

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

/**
 * The opt-in taken before the quiz starts.
 *
 * The brief captures a lead twice: name, email and phone on the landing page,
 * then first name and email again after Q28 to unlock the report. Keeping the
 * first one lets the second be pre-filled, so nobody is asked to type the same
 * details a second time.
 */
export interface Lead {
  name: string;
  email: string;
  phone: string;
}

export function saveLead(lead: Lead) {
  write(LEAD_KEY, JSON.stringify(lead));
}

export function readLead(): Lead | null {
  const raw = read(LEAD_KEY);
  if (!raw) return null;
  try {
    const v = JSON.parse(raw) as Partial<Lead>;
    if (typeof v?.email !== "string") return null;
    return { name: v.name ?? "", email: v.email, phone: v.phone ?? "" };
  } catch {
    return null;
  }
}

/**
 * True only when storage is readable AND holds no opt-in.
 *
 * The difference matters: the quiz cover sends people back to the landing page
 * when they have not opted in, but storage can also be unavailable (private
 * mode, blocked site data). Treating "unreadable" as "not opted in" would trap
 * those visitors in a redirect they can never satisfy, so it returns false.
 */
export function isMissingLead(): boolean {
  try {
    window.localStorage.setItem("vc_probe", "1");
    window.localStorage.removeItem("vc_probe");
  } catch {
    return false;
  }
  return readLead() === null;
}
