import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Icon, type IconName } from "@/components/Icon";
import { HeaderBanner, SiteFooter } from "@/components/SiteChrome";
import { PILLAR_DISPLAY_ORDER, badgeTone, masterclass, pillarCopy, referral, resultsCopy } from "@/content/site";
import { googleCalendarUrl } from "@/lib/calendar";
import { PILLAR_NAMES, type PillarId } from "@/lib/quiz/questions";
import { decodeReportCode } from "@/lib/quiz/reportCode";
import { badgeFor, computeResults } from "@/lib/quiz/scoring";
import { sanitizeRef } from "@/lib/referral";
import { CopyField, Greeting, ReportLinkButton, RetakeButton } from "./ClientBits";
import styles from "./results.module.css";

export const metadata: Metadata = {
  title: "Your Visibility Results | The Visibility Codes",
  robots: { index: false, follow: false },
};

const PILLAR_ICON: Record<PillarId, IconName> = {
  direction: "compass",
  recognition: "rosette",
  consistency: "cycle",
  connection: "rings",
  opportunity: "key",
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function ResultsPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const reportCode = typeof params.r === "string" ? params.r : "";
  const answers = decodeReportCode(reportCode);
  if (!answers) return <InvalidReport />;

  const results = computeResults(answers);
  const ownReferral = sanitizeRef(params.c);
  const strongestName = PILLAR_NAMES[results.strongest];
  const gapName = PILLAR_NAMES[results.primaryGap];
  const [meansBefore = "", meansAfter = ""] = resultsCopy.whatThisMeans[results.level].split("{gap}");
  const action = pillarCopy[results.primaryGap].action;
  const bonus = resultsCopy.bonus(gapName);

  return (
    <>
      <HeaderBanner variant="compact" />
      <main className={styles.main}>
        <section className={styles.intro}>
          <p className={styles.eyebrow}>{resultsCopy.eyebrow}</p>
          <h1 className={styles.title}>
            <Greeting reportCode={reportCode} />
          </h1>
          <p className={styles.lead}>
            {resultsCopy.intro[0]}
            <span className={styles.goldText}>{resultsCopy.intro[1]}</span>
            {resultsCopy.intro[2]}
          </p>
        </section>

        <section className={`${styles.card} ${styles.scoreCard}`} aria-labelledby="score-title">
          <div className={styles.scoreGrid}>
            <div className={styles.scoreLeft}>
              <h2 id="score-title" className={styles.scoreTitle}>
                {resultsCopy.scoreTitle}
              </h2>
              <p className={styles.scoreValue}>
                <span className={styles.scoreNumber} data-testid="score">
                  {results.score}
                </span>
                <span className={styles.scoreOutOf}>/100</span>
              </p>
              <p className={styles.levelBadge} data-testid="level">
                {results.level}
              </p>
            </div>
            <dl className={styles.stats}>
              <Stat icon="compass" label={resultsCopy.gapLabel} value={`${results.gap}%`} />
              {/* Visibility Gap Rating intentionally hidden until the client defines its bands. */}
              <Stat icon="alert" label={resultsCopy.blockerLabel} value={`${gapName} Gap`} />
              <Stat icon="rosette" label={resultsCopy.strongestLabel} value={strongestName} />
            </dl>
          </div>

          <div className={styles.means}>
            <Image src="/brand/icon-lightbulb.webp" alt="" width={96} height={96} className={styles.blendIcon} />
            <div>
              <h3 className={styles.meansTitle}>{resultsCopy.whatThisMeansTitle}</h3>
              <p>
                {meansBefore}
                <span className={styles.goldText}>{gapName} Gap</span>
                {meansAfter}
              </p>
            </div>
          </div>
        </section>

        {/* "You have your results. Now take the next step." — the dark, gold-framed
            box the client's NEW RESULTS PAGE.png places straight after the score card:
            compass left, gold caps title, three gold-check lines, gold button. */}
        <section className={styles.nextStep} aria-labelledby="next-step-title">
          <Image src="/brand/icon-compass.webp" alt="" width={120} height={120} className={styles.nextStepIcon} />
          <div className={styles.nextStepBody}>
            <h2 id="next-step-title" className={styles.nextStepTitle}>
              {resultsCopy.nextStep.title}
            </h2>
            <p className={styles.nextStepLead}>{resultsCopy.nextStep.body}</p>
            <p className={styles.nextStepIntro}>{resultsCopy.nextStep.listIntro}</p>
            <ul className={styles.nextStepList}>
              {resultsCopy.nextStep.items.map((item) => (
                <li key={item}>
                  <svg viewBox="0 0 20 20" width="20" height="20" aria-hidden="true">
                    <circle cx="10" cy="10" r="9" fill="#d9ad4f" />
                    <path d="M6 10.3l2.6 2.6L14.4 7.3" fill="none" stroke="#1a1207" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
            <p className={styles.nextStepCta}>
              <span className={styles.nextStepRule} aria-hidden="true" />
              <Link href={`/checkout?r=${encodeURIComponent(reportCode)}`} className={styles.nextStepButton}>
                {resultsCopy.nextStep.button}
              </Link>
              <span className={styles.nextStepRule} aria-hidden="true" />
            </p>
          </div>
        </section>

        <section className={styles.section} aria-labelledby="breakdown-title">
          <h2 id="breakdown-title" className={styles.sectionTitle}>
            {resultsCopy.breakdownTitle}
          </h2>
          <p className={styles.sectionSub}>{resultsCopy.breakdownSubtitle}</p>
          <ul className={styles.pillarGrid}>
            {PILLAR_DISPLAY_ORDER.map((id) => {
              const badge = badgeFor(results, id);
              return (
                <li key={id} className={styles.pillarCard}>
                  <Image src={`/brand/icon-${id}.webp`} alt="" width={84} height={84} className={styles.blendIcon} />
                  <h3 className={styles.pillarName}>{PILLAR_NAMES[id]}</h3>
                  <p className={styles.pillarPercent}>
                    {results.pillars[id].display}
                    <span>%</span>
                  </p>
                  <p className={`${styles.badge} ${styles[`badge_${badgeTone[badge]}`]}`}>{badge}</p>
                  <p className={styles.pillarDesc}>{pillarCopy[id].description}</p>
                </li>
              );
            })}
          </ul>
        </section>

        <section className={styles.panels}>
          <Panel
            title={resultsCopy.strongestPanelTitle}
            pillar={results.strongest}
            percent={results.pillars[results.strongest].display}
            text={pillarCopy[results.strongest].strongest}
          />
          <Panel
            title={resultsCopy.gapPanelTitle}
            pillar={results.primaryGap}
            percent={results.pillars[results.primaryGap].display}
            text={pillarCopy[results.primaryGap].gap}
          />
        </section>

        <section className={`${styles.card} ${styles.action}`} aria-labelledby="action-title">
          <div className={styles.actionMain}>
            <span className={styles.actionIcon}>
              <Icon name="target" size={44} />
            </span>
            <div>
              <h2 id="action-title" className={styles.actionTitle}>
                {resultsCopy.quickActionTitle}
              </h2>
              <p className={styles.actionLead}>{action.title}</p>
              <p className={styles.actionSteps}>{action.steps}</p>
              <p className={styles.actionClosing}>{action.closing}</p>
            </div>
          </div>
          <div className={styles.bonus}>
            <Image src="/brand/icon-gift.webp" alt="" width={96} height={96} className={styles.blendIcon} />
            <p>{bonus.before}</p>
            <Link href={`/checkout?r=${encodeURIComponent(reportCode)}`} className={styles.bonusCta}>
              {bonus.button}
            </Link>
          </div>
        </section>

        <section className={styles.masterclass} aria-labelledby="masterclass-title">
          <div className={styles.mcGrid}>
            <div>
              <h2 id="masterclass-title" className={styles.mcTitle}>
                {masterclass.title}
              </h2>
              <p className={styles.mcSubtitle}>{masterclass.subtitle}</p>
              <p className={styles.mcBio}>{masterclass.bio}</p>
              <p className={styles.mcLearnIntro}>{masterclass.learnIntro}</p>
              <ul className={styles.learn}>
                {masterclass.learn.map((item) => (
                  <li key={item.title}>
                    <Icon name={item.icon} size={34} />
                    <strong>{item.title}</strong>
                    <span>{item.text}</span>
                  </li>
                ))}
              </ul>
            </div>
            <ul className={styles.dates}>
              {masterclass.dates.map((d) => (
                <li key={d.date}>
                  <Icon name={d.icon} size={40} />
                  <div>
                    {d.lines.map((line) => (
                      <span key={line} className={styles.dateLine}>
                        {line}
                      </span>
                    ))}
                    <strong className={styles.dateValue}>{d.date}</strong>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className={styles.mcButtons}>
            <a
              className={`btn-gold ${styles.mcButton}`}
              href={googleCalendarUrl(masterclass.calendarEvent)}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Icon name="calendar" size={22} />
              {masterclass.googleButton}
            </a>
            <a className={styles.outlineButton} href="/api/calendar">
              <Icon name="apple" size={22} />
              {masterclass.icsButton}
            </a>
          </div>
        </section>

        {ownReferral && (
          <section className={`${styles.card} ${styles.refer}`} aria-labelledby="refer-title">
            <div className={styles.referHead}>
              <span className={styles.roundIcon}>
                <Icon name="people" size={38} />
              </span>
              <div>
                <h2 id="refer-title" className={styles.referTitle}>
                  {referral.title}
                </h2>
                <p className={styles.referBody}>{referral.body}</p>
                <CopyField
                  value={`${referral.baseUrl}?ref=${ownReferral}`}
                  label="Your referral link"
                  buttonLabel={referral.button}
                />
              </div>
            </div>
            <ul className={styles.perks}>
              {referral.perks.map((perk) => (
                <li key={perk.title}>
                  <Icon name={perk.icon} size={40} />
                  <h3>{perk.title}</h3>
                  <p>{perk.text}</p>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className={`${styles.card} ${styles.reportLink}`}>
          <span className={styles.docIcon}>
            <Icon name="document" size={30} />
          </span>
          <div>
            <p>{resultsCopy.reportLinkText}</p>
            <ReportLinkButton label={resultsCopy.reportLinkButton} />
          </div>
        </section>

        <p className={styles.retake}>
          <RetakeButton label={resultsCopy.retake} />
        </p>
      </main>
      <SiteFooter />
    </>
  );
}

function Stat({ icon, label, value }: { icon: IconName; label: string; value: string }) {
  return (
    <div className={styles.stat}>
      <dt>
        <Icon name={icon} size={26} className={styles.statIcon} />
        <span>{label}</span>
      </dt>
      <dd>{value}</dd>
    </div>
  );
}

function Panel({ title, pillar, percent, text }: { title: string; pillar: PillarId; percent: number; text: string }) {
  return (
    <article className={styles.darkPanel}>
      <h2 className={styles.panelEyebrow}>{title}</h2>
      <Icon name={PILLAR_ICON[pillar]} size={44} className={styles.panelIcon} />
      <h3 className={styles.panelName}>{PILLAR_NAMES[pillar]}</h3>
      <p className={styles.panelPercent}>{percent}%</p>
      <div className={styles.glow} aria-hidden="true" />
      <p className={styles.panelText}>{text}</p>
    </article>
  );
}

function InvalidReport() {
  return (
    <>
      <HeaderBanner variant="compact" />
      <main className={styles.main}>
        <section className={`${styles.card} ${styles.invalid}`}>
          <h1 className={styles.invalidTitle}>{resultsCopy.invalidTitle}</h1>
          <p>{resultsCopy.invalidBody}</p>
          <Link href="/quiz" className="btn-gold">
            {resultsCopy.invalidButton}
          </Link>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
