import type { Metadata } from "next";
import Link from "next/link";
import { Fragment } from "react";
import { Icon } from "@/components/Icon";
import { HeaderBanner, SiteFooter } from "@/components/SiteChrome";
import { type ThankYouCard, type ThankYouState, thankYouCopy } from "@/content/site";
import { type PillarId } from "@/lib/quiz/questions";
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

function Spark() {
  return (
    <span className={styles.spark} aria-hidden="true">
      <i />
      <Icon name="sparkle" size={13} />
      <i />
    </span>
  );
}

export default async function ThankYouPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const paid = one(params.paid) === "1";
  const onWaitlist = one(params.waitlist) === "1";
  const reportCode = one(params.r);
  const raw = one(params.edition);
  const edition = EDITIONS.includes(raw as PillarId) ? (raw as PillarId) : null;

  const state: ThankYouState = paid
    ? onWaitlist
      ? thankYouCopy.paidOnWaitlist
      : thankYouCopy.paid
    : thankYouCopy.notPaid;

  /* The plan PDFs ship in public/plans, so the download works out of the box.
     The file name is per edition and per waitlist state, matching the client's
     two delivery folders.

     These paths are guessable, so anyone can fetch a paid plan by typing the
     URL and a buyer's link keeps working for whoever they forward it to. Set
     PLANS_BASE_URL to a host that issues signed, expiring links and the button
     points there instead, with no code change. */
  const plansBase = process.env.PLANS_BASE_URL?.replace(/\/$/, "") ?? "";
  const planFile = edition ? `${edition}-${onWaitlist ? "on" : "not-on"}-waitlist.pdf` : null;
  const planHref = planFile ? `${plansBase || "/plans"}/${planFile}` : null;

  function hrefFor(target: NonNullable<ThankYouCard["cta"]>["href"]) {
    if (target === "waitlist") return "/waitlist";
    if (target === "results") return reportCode ? `/results?r=${encodeURIComponent(reportCode)}` : "/quiz";
    return planHref;
  }

  return (
    <>
      <HeaderBanner variant="compact" />
      <main className={styles.page}>
        <h1 className={styles.title}>
          {state.titleLines.map((line) => (
            <Fragment key={line}>
              {line}
              <br />
            </Fragment>
          ))}
          {state.titleEm && <em>{state.titleEm}</em>}
        </h1>

        <Spark />

        {state.lead && <p className={styles.lead}>{state.lead}</p>}
        <div className={styles.body}>
          {state.body.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>
        <p className={styles.tag}>{thankYouCopy.tagline}</p>

        <div className={styles.cards}>
          {state.cards.map((card) => {
            const href = card.cta ? hrefFor(card.cta.href) : null;
            return (
              <section key={card.title} className={`${styles.card} ${card.small ? styles.cardSmall : ""}`}>
                <span className={styles.icon} aria-hidden="true">
                  <Icon name={card.icon} size={26} />
                </span>
                <div className={styles.cardBody}>
                  {card.eyebrow && <p className={styles.eyebrow}>{card.eyebrow}</p>}
                  <h2 className={styles.cardTitle}>{card.title}</h2>
                  {card.paras.map((p) => (
                    <p key={p} className={styles.para}>
                      {p}
                    </p>
                  ))}

                  {card.cta &&
                    (href ? (
                      card.cta.href === "plan" ? (
                        <a className={styles.button} href={href} download>
                          {card.cta.label}
                        </a>
                      ) : (
                        <Link className={styles.button} href={href}>
                          {card.cta.label}
                        </Link>
                      )
                    ) : (
                      <p className={styles.para}>{thankYouCopy.byEmail}</p>
                    ))}

                  {card.note && <p className={styles.note}>{card.note}</p>}

                  {card.strip && (
                    <div className={styles.strip}>
                      <span className={styles.stripIcon} aria-hidden="true">
                        <Icon name="crown" size={16} />
                      </span>
                      <div>
                        <p className={styles.stripHead}>{card.strip.head}</p>
                        <p className={styles.stripText}>{card.strip.text}</p>
                      </div>
                    </div>
                  )}
                </div>
              </section>
            );
          })}
        </div>

        <Spark />
        <p className={styles.closeA}>{state.closeA}</p>
        {state.closeB && <p className={styles.closeB}>{state.closeB}</p>}
        {state.closeTag && <p className={`${styles.tag} ${styles.tagEnd}`}>{thankYouCopy.tagline}</p>}

        <p className={styles.follow}>
          <a href={thankYouCopy.instagram} target="_blank" rel="noopener noreferrer">
            <Icon name="instagram" size={17} />
            {thankYouCopy.follow}
          </a>
        </p>
      </main>
      <SiteFooter />
    </>
  );
}
