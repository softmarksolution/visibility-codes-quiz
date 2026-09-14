import type { GhlLeadPayload, SyncResult } from "./ghl";
import { PILLAR_NAMES, getQuestion, type Answers } from "./quiz/questions";
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

  const { firstName, email } = lead.lead;
  const answers = checked.answers;
  const results = computeResults(answers);
  const reportCode = encodeReportCode(answers);
  const ownCode = referralCode(firstName, email);
  const siteUrl = deps.siteUrl.replace(/\/+$/, "");

  const payload: GhlLeadPayload = {
    firstName,
    email,
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
      q2_desired_outcome: optionLabel(answers, 2),
      q3_perceived_problem: optionLabel(answers, 3),
      primary_visibility_problem: optionLabel(answers, 3),
      q4_primary_platform: optionLabel(answers, 4),
      inner_visibility_blocker: optionLabel(answers, 19),
      q25_years_experience: optionLabel(answers, 25),
      what_have_you_already_done_to_try_to_become_more_visible: optionLabels(answers, 26),
      q27_intent_level: optionLabel(answers, 27),
      q28_written_response: answers[28] as string,
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
