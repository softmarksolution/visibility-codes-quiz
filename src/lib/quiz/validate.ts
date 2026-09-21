import { formatUsPhone } from "../phone";
import { QUESTIONS, type Answers, type Question } from "./questions";

const DEFAULT_TEXT_MAX = 500;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export interface Lead {
  firstName: string;
  email: string;
  /** NANP numbers normalised to +1 (XXX) XXX-XXXX; anything else as typed. */
  phone: string;
}

export function isAnswered(q: Question, value: unknown): boolean {
  const validId = (v: unknown) => typeof v === "string" && q.options.some((o) => o.id === v);
  switch (q.type) {
    case "single":
      return validId(value);
    case "multi":
      return Array.isArray(value) && value.length > 0 && new Set(value).size === value.length && value.every(validId);
    case "text": {
      if (typeof value !== "string") return false;
      const length = value.trim().length;
      return length > 0 && length <= (q.maxLength ?? DEFAULT_TEXT_MAX);
    }
  }
}

/** Checks every question is answered; returns a cleaned copy with only known questions. */
export function validateAnswers(input: unknown): { ok: true; answers: Answers } | { ok: false; error: string } {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    return { ok: false, error: "Answers are missing." };
  }
  const record = input as Record<string, unknown>;
  const answers: Answers = {};
  for (const q of QUESTIONS) {
    const raw = record[String(q.id)];
    if (!isAnswered(q, raw)) return { ok: false, error: `Question ${q.id} needs a valid answer.` };
    answers[q.id] = q.type === "text" ? (raw as string).trim() : q.type === "multi" ? [...(raw as string[])] : (raw as string);
  }
  return { ok: true, answers };
}

export function validateLead(input: unknown): { ok: true; lead: Lead } | { ok: false; error: string } {
  if (!input || typeof input !== "object") return { ok: false, error: "Please enter your details." };
  const { firstName, email, phone } = input as Record<string, unknown>;
  const name = typeof firstName === "string" ? firstName.trim() : "";
  if (name.length < 1 || name.length > 80) return { ok: false, error: "Please enter your first name." };
  const mail = typeof email === "string" ? email.trim().toLowerCase() : "";
  if (mail.length > 254 || !EMAIL_RE.test(mail)) return { ok: false, error: "Please enter a valid email address." };
  /* Length is checked before formatting: formatUsPhone returns non-NANP input
     untouched, so without a cap an arbitrarily long string would reach the CRM. */
  const rawPhone = typeof phone === "string" ? phone.trim() : "";
  if (rawPhone.length < 1 || rawPhone.length > 40) return { ok: false, error: "Please enter your phone number." };
  return { ok: true, lead: { firstName: name, email: mail, phone: formatUsPhone(rawPhone) } };
}
