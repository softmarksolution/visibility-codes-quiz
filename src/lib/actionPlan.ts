import type { PillarId } from "./quiz/questions";

/**
 * The paid Action Plan is sold on the client's own site, one checkout page per
 * edition. Which one somebody is sent to is decided by their primary gap — the
 * lowest-scoring of the five pillars — so the page they land on sells the
 * edition their result actually calls for.
 *
 * These pages carry the price, the inclusions, the billing form, the masterclass
 * waitlist question and the payment itself, so nothing about the purchase
 * happens on this site any more. This map is the whole hand-off.
 *
 * Typed as a full Record, so adding a pillar without adding its page is a
 * compile error rather than a visitor sent nowhere.
 */
export const ACTION_PLAN_URLS: Record<PillarId, string> = {
  direction: "https://thevisibilitycodes.com/action-plan-direction",
  recognition: "https://thevisibilitycodes.com/action-plan-recognition",
  consistency: "https://thevisibilitycodes.com/action-plan-consistency",
  connection: "https://thevisibilitycodes.com/action-plan-connection",
  opportunity: "https://thevisibilitycodes.com/action-plan-opportunity",
};

/** The checkout page for the edition matching this primary gap. */
export function actionPlanUrl(primaryGap: PillarId): string {
  return ACTION_PLAN_URLS[primaryGap];
}
