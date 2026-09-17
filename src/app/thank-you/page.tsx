import type { Metadata } from "next";
import Link from "next/link";
import { Icon } from "@/components/Icon";
import { HeaderBanner, SiteFooter } from "@/components/SiteChrome";
import { thankYouCopy } from "@/content/site";
import { PILLAR_NAMES, type PillarId } from "@/lib/quiz/questions";
import styles from "./thank-you.module.css";

export const metadata: Metadata = {
  title: "Thank You | The Visibility Codes",
  robots: { index: false, follow: false },
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

const EDITIONS: PillarId[] = ["direction", "recognition", "connection", "consistency", "opportunity"];

function one(v: string | string[] | undefined) {
  return typeof v === "string" ? v : "";
}

export default async function ThankYouPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const paid = one(params.paid) === "1";
  const onWaitlist = one(params.waitlist) === "1";
  const reportCode = one(params.r);
  const raw = one(params.edition);
  const edition = EDITIONS.includes(raw as PillarId) ? (raw as PillarId) : null;

  /* The plans are the paid product and this repository is public, so the PDFs
     are not committed here. PLANS_BASE_URL points at wherever they are hosted —
     which needs to be signed or expiring URLs, since the file names are
     guessable and a buyer's link would otherwise work for anyone they forward
     it to. Until it is set, the page does not offer a download at all: the copy
     already tells the buyer their plan is on its way by email. */
  const plansBase = process.env.PLANS_BASE_URL?.replace(/\/$/, "") ?? "";
  const planHref =
    plansBase && edition
      ? `${plansBase}/${edition}-${onWaitlist ? "on" : "not-on"}-waitlist.pdf`
      : null;

  return (
    <>
      <HeaderBanner variant="compact" />
      <main className={styles.page}>
        {paid ? (
          <>
            <header className={styles.head}>
              <span className={styles.tick} aria-hidden="true">
                <Icon name="sparkle" size={26} />
              </span>
              <h1 className={styles.title}>{thankYouCopy.paidTitle}</h1>
              <p className={styles.body}>{thankYouCopy.paidBody}</p>
            </header>

            <div className={styles.cards}>
              <section className={styles.card}>
                <p className={styles.cardEyebrow}>
                  {edition ? `${PILLAR_NAMES[edition]} Edition` : "Your Action Plan"}
                </p>
                <h2 className={styles.cardTitle}>Your Visibility Action Plan</h2>
                {planHref ? (
                  <a className={styles.button} href={planHref} download>
                    {thankYouCopy.downloadButton}
                  </a>
                ) : (
                  <p className={styles.body}>{thankYouCopy.byEmail}</p>
                )}
              </section>

              {onWaitlist ? (
                <section className={styles.card}>
                  <p className={styles.cardEyebrow}>{thankYouCopy.waitlistCardTitle}</p>
                  <h2 className={styles.cardTitle}>The Visibility Codes Masterclass</h2>
                  <p className={styles.body}>{thankYouCopy.waitlistCardBody}</p>
                </section>
              ) : (
                <section className={styles.card}>
                  <p className={styles.cardEyebrow}>{thankYouCopy.joinTitle}</p>
                  <h2 className={styles.cardTitle}>The Visibility Codes Masterclass</h2>
                  <p className={styles.body}>{thankYouCopy.joinBody}</p>
                  <Link className={styles.button} href="/waitlist">
                    {thankYouCopy.joinButton}
                  </Link>
                </section>
              )}
            </div>
          </>
        ) : (
          <>
            <header className={styles.head}>
              <h1 className={styles.title}>{thankYouCopy.notPaidTitle}</h1>
              <p className={styles.body}>{thankYouCopy.notPaidBody}</p>
            </header>
            <div className={styles.cards}>
              <section className={styles.card}>
                <h2 className={styles.cardTitle}>Your Visibility Action Plan</h2>
                <Link className={styles.button} href={reportCode ? `/checkout?r=${reportCode}` : "/quiz"}>
                  {thankYouCopy.notPaidButton}
                </Link>
              </section>
              <section className={styles.card}>
                <p className={styles.cardEyebrow}>{thankYouCopy.joinTitle}</p>
                <h2 className={styles.cardTitle}>The Visibility Codes Masterclass</h2>
                <p className={styles.body}>{thankYouCopy.joinBody}</p>
                <Link className={styles.button} href="/waitlist">
                  {thankYouCopy.joinButton}
                </Link>
              </section>
            </div>
          </>
        )}

        <p className={styles.back}>
          <Link href="/">{thankYouCopy.backHome}</Link>
        </p>
      </main>
      <SiteFooter />
    </>
  );
}
