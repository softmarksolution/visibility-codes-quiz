import type { Metadata } from "next";
import Image from "next/image";
import { HeaderBanner, SiteFooter } from "@/components/SiteChrome";
import { checkoutCopy } from "@/content/site";
import { PILLAR_NAMES } from "@/lib/quiz/questions";
import { decodeReportCode } from "@/lib/quiz/reportCode";
import { computeResults } from "@/lib/quiz/scoring";
import Purchase from "./Purchase";
import styles from "./checkout.module.css";

export const metadata: Metadata = {
  title: "Your Personalised Visibility Action Plan | The Visibility Codes",
  description: checkoutCopy.closing,
  robots: { index: false, follow: false },
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function CheckoutPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const reportCode = typeof params.r === "string" ? params.r : "";
  const answers = decodeReportCode(reportCode);
  const results = answers ? computeResults(answers) : null;
  const edition = results ? PILLAR_NAMES[results.primaryGap] : null;

  return (
    <>
      <HeaderBanner variant="compact" />
      <main className={`${styles.page} ${results ? "" : styles.noResult}`}>
        <header className={styles.head}>
          <p className={styles.eyebrow}>{checkoutCopy.eyebrow}</p>
          <h1 className={styles.title}>{checkoutCopy.title}</h1>
          {!results && <p className={styles.headBody}>{checkoutCopy.noResultBody}</p>}
        </header>

        <div className={styles.grid}>
          <figure className={styles.art}>
            <Image
              src={`/plans/${results ? results.primaryGap : "direction"}.webp`}
              alt={checkoutCopy.coverAlt(edition ?? "Direction")}
              width={1024}
              height={1536}
              sizes="(max-width: 860px) 60vw, 360px"
              priority
            />
            <figcaption>{checkoutCopy.personalised}</figcaption>
          </figure>

          <Purchase
            edition={edition}
            editionId={results ? results.primaryGap : null}
            reportCode={results ? reportCode : ""}
          />
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
