import { redirect } from "next/navigation";
import { actionPlanUrl } from "@/lib/actionPlan";
import { decodeReportCode } from "@/lib/quiz/reportCode";
import { computeResults } from "@/lib/quiz/scoring";

/**
 * The Action Plan is now bought on the client's own site, one checkout page per
 * edition, so this page no longer sells anything — it only forwards.
 *
 * It stays because report links handed out before the change point here, and
 * because the demo card form that used to live on it has no business being
 * reachable now that real money moves elsewhere. A report code still names a
 * primary gap, so an old link lands on exactly the edition it always meant.
 *
 * Without a readable result there is no gap, and therefore no correct edition
 * to sell: those visitors are sent to take the assessment rather than guessed at.
 */
export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const answers = decodeReportCode(typeof params.r === "string" ? params.r : "");
  redirect(answers ? actionPlanUrl(computeResults(answers).primaryGap) : "/quiz");
}
