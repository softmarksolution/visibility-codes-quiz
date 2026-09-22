import type { GhlLeadPayload, SyncResult } from "./ghl";
import { PILLAR_NAMES, QUESTIONS, getQuestion, type Answers } from "./quiz/questions";
import { encodeReportCode } from "./quiz/reportCode";
import { computeResults } from "./quiz/scoring";
import { ALL_QUIZ_TAGS, collectTags } from "./quiz/tags";
import { validateAnswers, validateLead } from "./quiz/validate";
import { referralCode, sanitizeRef } from "./referral";

export interface SubmissionDeps {
  sync: (payload: GhlLeadPayload) => Promise<SyncResult>;
  siteUrl: string;
}

export type SubmissionResponse =
  | { status: 200; body: { ok: true; reportCode: string; referralCode: string; synced: boolean } }
  | { status: 400; body: { ok: false; error: string } };

const bad = (error: string): SubmissionResponse => ({ status: 400, body: { ok: false, error } });

export async function processSubmission(input: unknown, deps: SubmissionDeps): Promise<SubmissionResponse> {
  if (!input || typeof input !== "object" || Array.isArray(input)) return bad("Invalid submission.");
  const body = input as Record<string, unknown>;

  // Honeypot: real visitors never see or fill this field.
  if (typeof body.website === "string" && body.website.trim() !== "") {
    return { status: 200, body: { ok: true, reportCode: "", referralCode: "", synced: false } };
  }

  const lead = validateLead(body);
  if (!lead.ok) return bad(lead.error);
  const checked = validateAnswers(body.answers);
  if (!checked.ok) return bad(checked.error);

  const { firstName, email, phone } = lead.lead;
  const answers = checked.answers;
  const results = computeResults(answers);
  const reportCode = encodeReportCode(answers);
  const ownCode = referralCode(firstName, email);
  const siteUrl = deps.siteUrl.replace(/\/+$/, "");

  const payload: GhlLeadPayload = {
    firstName,
    email,
    phone,
    tags: collectTags(answers),
    managedTags: ALL_QUIZ_TAGS,
    // Keys match the contact custom fields in the Katrina Kavvalos International GHL
    // sub-account (see README "GoHighLevel setup").
    fields: {
      direction_percent: results.pillars.direction.display,
      recognition_percent: results.pillars.recognition.display,
      connection_percent: results.pillars.connection.display,
      consistency_percent: results.pillars.consistency.display,
      opportunity_percent: results.pillars.opportunity.display,
      visibility_score: results.score,
      visibility_gap: results.gap,
      visibility_level_quiz: results.level,
      strongest_code: PILLAR_NAMES[results.strongest],
      weakest_code: PILLAR_NAMES[results.primaryGap],
      ...answerFields(answers),
      // Q3 again under the name the client's GHL workflows were first built on.
      primary_visibility_problem: optionLabel(answers, 3),
      visibility_report_url: `${siteUrl}/results?r=${reportCode}&c=${ownCode}`,
      referral_code: ownCode,
      referred_by: sanitizeRef(body.ref),
    },
  };

  let synced = false;
  try {
    synced = (await deps.sync(payload)).synced;
  } catch (err) {
    console.error("[submit] sync threw", err);
  }

  return { status: 200, body: { ok: true, reportCode, referralCode: ownCode, synced } };
}

/**
 * The GHL contact field each question's answer is written to, one per question.
 *
 * The keys for Q2-4, Q19 and Q25-28 predate the rest and are kept exactly as
 * they were, because the client's sub-account already has those fields and may
 * have workflows reading them. Every key must exist as a contact custom field in
 * GHL, or the sync skips it (see README "GoHighLevel setup").
 */
export const ANSWER_FIELD_KEYS: Readonly<Record<number, string>> = {
  1: "q1_role",
  2: "q2_desired_outcome",
  3: "q3_perceived_problem",
  4: "q4_primary_platform",
  5: "q5_goal_clarity",
  6: "q6_who_can_help",
  7: "q7_where_to_show_up",
  8: "q8_visibility_focus",
  9: "q9_efforts_working",
  10: "q10_what_makes_you_different",
  11: "q11_brand_perception",
  12: "q12_proof_online",
  13: "q13_audience_size",
  14: "q14_sought_for_advice",
  15: "q15_key_industry_people",
  16: "q16_right_rooms",
  17: "q17_following_up_connections",
  18: "q18_connecting_without_agenda",
  19: "inner_visibility_blocker",
  20: "q20_posting_frequency",
  21: "q21_reviewing_what_works",
  22: "q22_last_inbound_opportunity",
  23: "q23_how_opportunities_came",
  24: "q24_building_on_opportunities",
  25: "q25_years_experience",
  26: "what_have_you_already_done_to_try_to_become_more_visible",
  27: "q27_intent_level",
  28: "q28_written_response",
};

/** Every answer keyed by its GHL field: option wording, a list for multi-select, the text as typed. */
function answerFields(answers: Answers): Record<string, string | string[] | undefined> {
  const fields: Record<string, string | string[] | undefined> = {};
  for (const q of QUESTIONS) {
    const key = ANSWER_FIELD_KEYS[q.id];
    if (!key) throw new Error(`Q${q.id} has no GHL field key`);
    const value = answers[q.id];
    fields[key] = q.type === "text" ? (value as string) : q.type === "multi" ? optionLabels(answers, q.id) : optionLabel(answers, q.id);
  }
  return fields;
}

/** Wording of the chosen option(s), matching the option labels on the GHL fields. */
function optionLabels(answers: Answers, questionId: number): string[] {
  const question = getQuestion(questionId);
  const value = answers[questionId];
  const ids = Array.isArray(value) ? value : typeof value === "string" ? [value] : [];
  return ids.map((id) => question?.options.find((o) => o.id === id)?.label ?? id);
}

function optionLabel(answers: Answers, questionId: number): string | undefined {
  return optionLabels(answers, questionId)[0];
}
