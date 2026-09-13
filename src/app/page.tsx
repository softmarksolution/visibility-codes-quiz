import Link from "next/link";
import { HeaderBanner, SiteFooter } from "@/components/SiteChrome";
import { Icon } from "@/components/Icon";
import { brand, landing } from "@/content/site";
import RefCapture from "./RefCapture";
import styles from "./page.module.css";

const SAMPLE_SCORE = 88;

export default function HomePage() {
  return (
    <>
      <HeaderBanner />
      <main className={styles.main}>
        <section className={styles.hero}>
          <div className={styles.copy}>
            <p className={styles.eyebrow}>{brand.tagline}</p>
            <h1 className={styles.heading}>{landing.heading}</h1>
            <p className={styles.body}>{landing.body}</p>
            <ul className={styles.bullets}>
              {landing.bullets.map((b) => (
                <li key={b.strong}>
                  <Icon name={b.icon} size={40} className={styles.bulletIcon} />
                  <span>
                    <strong>{b.strong}</strong>
                    {b.rest}
                  </span>
                </li>
              ))}
            </ul>
            <p className={styles.secondary}>{landing.secondary}</p>
            <Link href="/quiz" className={`btn-gold ${styles.cta}`}>
              {landing.button}
            </Link>
          </div>

          <aside className={styles.preview} aria-label={`${landing.previewCaption}: ${SAMPLE_SCORE} out of 100`}>
            <p className={styles.previewTitle}>{landing.previewTitle}</p>
            <Gauge value={SAMPLE_SCORE} />
            <p className={styles.previewScore}>
              {SAMPLE_SCORE}
              <span>/100</span>
            </p>
            <p className={styles.previewCaption}>{landing.previewCaption}</p>
          </aside>
        </section>
      </main>
      <SiteFooter />
      <RefCapture />
    </>
  );
}

function Gauge({ value }: { value: number }) {
  const cx = 120;
  const cy = 120;
  const r = 96;
  const point = (v: number, radius = r) => {
    const angle = Math.PI - (v / 100) * Math.PI;
    return `${(cx + radius * Math.cos(angle)).toFixed(2)} ${(cy - radius * Math.sin(angle)).toFixed(2)}`;
  };
  const arc = (from: number, to: number) => `M ${point(from)} A ${r} ${r} 0 0 1 ${point(to)}`;
  return (
    <svg viewBox="0 0 240 132" className={styles.gauge} aria-hidden="true">
      <path d={arc(0, 49)} stroke="var(--gauge-light)" strokeWidth="18" fill="none" />
      <path d={arc(51, 74)} stroke="var(--gauge-mid)" strokeWidth="18" fill="none" />
      <path d={arc(76, 100)} stroke="var(--gauge-dark)" strokeWidth="18" fill="none" />
      <line x1={cx} y1={cy} x2={point(value, 74).split(" ")[0]} y2={point(value, 74).split(" ")[1]} stroke="var(--ink)" strokeWidth="3" strokeLinecap="round" />
      <circle cx={cx} cy={cy} r="7" fill="var(--ink)" />
    </svg>
  );
}
