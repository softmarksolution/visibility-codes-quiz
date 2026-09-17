import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import Image, { getImageProps } from "next/image";
import Link from "next/link";
import { Fragment } from "react";
import { Icon } from "@/components/Icon";
import StartQuizLink from "@/components/StartQuizLink";
import { brand, landing } from "@/content/site";
import RefCapture from "./RefCapture";
import styles from "./page.module.css";

// Montserrat is the body face on the brand's master typography card; headings use
// Playfair Display, which layout.tsx already loads for every page.
const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-montserrat",
  display: "swap",
});

export const metadata: Metadata = {
  title: "The Visibility Codes | Get Your Visibility Score Free",
  description: landing.hero.body,
};

export default function HomePage() {
  const { hero, score, why, who, gaps, meet, gallery, final } = landing;

  return (
    <div className={`${styles.page} ${montserrat.variable}`}>
      <main>
        <section className={styles.hero}>
          <HeroArt />
          <div className={styles.heroInner}>
            <div className={styles.heroCard}>
              <h1 className={styles.heroTitle}>{hero.title}</h1>
              <span className={styles.shortRule} aria-hidden="true" />
              <p className={styles.heroBody}>{hero.body}</p>
              <p className={styles.heroTagline}>{hero.tagline}</p>
              <StartQuizLink className={`${styles.brightButton} ${styles.heroButton}`}>
                {hero.button}
                <span className={styles.chevron} aria-hidden="true">
                  ›
                </span>
              </StartQuizLink>
            </div>
            <p className={styles.journey}>
              {hero.journey.map((step, i) => (
                <Fragment key={step}>
                  {i > 0 && <Icon name="arrowRight" size={20} className={styles.journeyArrow} />}
                  <span>{step}</span>
                </Fragment>
              ))}
            </p>
          </div>
        </section>

        <PressLogos className={styles.pressDesktop} />

        <section className={styles.scoreWrap}>
          <div className={styles.scoreCard}>
            <div className={styles.scoreHead}>
              <Divider />
              <h2 className={styles.scoreTitle}>{score.title}</h2>
              <p className={styles.scoreBody}>{score.body}</p>
            </div>

            <ul className={styles.benefits}>
              {score.bullets.map((b) => (
                <li key={b.strong}>
                  <Icon name={b.icon} size={42} className={styles.benefitIcon} />
                  <span>
                    <strong>{b.strong}</strong>
                    {b.rest}
                  </span>
                </li>
              ))}
            </ul>

            <div className={styles.scoreFoot}>
              <Divider />
              <p>{score.after}</p>
              <StartQuizLink className={`${styles.matteButton} ${styles.scoreButton}`}>
                {score.button}
              </StartQuizLink>
            </div>

            <div className={styles.gaugeCard}>
              <Divider />
              <p className={styles.gaugeTitle}>{score.gaugeTitle}</p>
              <Divider />
              <Gauge value={score.sample} />
              <span className={`${styles.star} ${styles.gaugeStar}`} aria-hidden="true" />
              <p className={styles.gaugeRange}>
                <span>{score.rangeFrom}</span>
                <Icon name="arrowRight" size={26} className={styles.gaugeArrow} />
                <span>{score.rangeTo}</span>
              </p>
              <p className={styles.gaugePill}>
                <span className={styles.star} aria-hidden="true" />
                {score.pill}
                <span className={styles.star} aria-hidden="true" />
              </p>
            </div>
          </div>
        </section>

        {/* WHY THE VISIBILITY CODES WORK — the photo is a cut of the client's
            master at the exact aspect of its CSS box, so `cover` crops nothing;
            at the wrong aspect it clipped the top of Katrina's head. */}
        <section className={styles.why}>
          <div className={styles.whyPhoto} aria-label={why.photoAlt} role="img" />
          <div className={styles.whyInner}>
            <div className={styles.whyContent}>
              <p className={styles.eyebrow}>
                {why.eyebrow}
                <span className={styles.eyebrowLine} aria-hidden="true" />
              </p>
              <h2 className={styles.whyTitle}>
                {why.titleStart} <em>{why.titleGold}</em>
              </h2>
              <div className={styles.whyCopy}>
                {why.paragraphs.map((text) => (
                  <p key={text}>{text}</p>
                ))}
              </div>
              <ul className={styles.stats}>
                {why.stats.map((s) => (
                  <li key={s.note} className={styles.stat}>
                    <Icon name={s.icon} size={30} className={styles.statIcon} />
                    <p className={styles.statLead}>
                      {"leadAfter" in s && s.leadAfter ? (
                        <>
                          {s.rest} <b>{s.lead}</b>
                        </>
                      ) : (
                        <>
                          {s.lead ? <b>{s.lead}</b> : null} {s.rest}
                        </>
                      )}
                    </p>
                    <p className={styles.statNote}>{s.note}</p>
                  </li>
                ))}
              </ul>
              <p className={styles.whyFoot}>{why.footnote}</p>
            </div>
          </div>
        </section>

        <section className={styles.who}>
          <div className={styles.whoInner}>
            <Image
              src="/landing/who-photo.webp"
              alt={who.photoAlt}
              width={514}
              height={529}
              sizes="(max-width: 760px) 100vw, 620px"
              className={styles.whoPhoto}
            />
            <div className={styles.whoText}>
              <h2 className={styles.capsTitle}>{who.title}</h2>
              <Divider className={styles.dividerWide} />
              <ul className={styles.whoList}>
                {who.bullets.map((text) => (
                  <li key={text}>{text}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className={styles.gapsWrap}>
          <div className={styles.gapsCard}>
            <Divider />
            <h2 className={styles.gapsTitle}>
              {gaps.titleStart} <span className={styles.goldWord}>{gaps.titleGold}</span>
            </h2>
            <p className={styles.gapsBody}>{gaps.body}</p>
            <ol className={styles.gapList}>
              {gaps.items.map((gap, i) => (
                <li key={gap.name}>
                  <p className={styles.gapLabel}>Gap {i + 1}</p>
                  <h3>{gap.name}</h3>
                  <p>{gap.text}</p>
                </li>
              ))}
            </ol>
            <StartQuizLink className={`${styles.matteButton} ${styles.gapsButton}`}>
              {gaps.button}
            </StartQuizLink>
          </div>
        </section>

        <section className={styles.meetWrap}>
          <div className={styles.meetCard}>
            <Image
              src="/landing/meet-katrina.webp"
              alt={meet.photoAlt}
              width={440}
              height={505}
              sizes="(max-width: 760px) 100vw, 560px"
              className={styles.meetPhoto}
            />
            <div className={styles.meetText}>
              <h2 className={styles.capsTitle}>{meet.title}</h2>
              <Divider className={styles.dividerWide} />
              {meet.paragraphs.map((text) => (
                <p key={text.slice(0, 32)}>{text}</p>
              ))}
            </div>
          </div>
        </section>

        <PressLogos className={styles.pressMobile} />

        <section className={styles.gallery} aria-label={landing.galleryLabel}>
          <ul>
            {gallery.map((photo, i) => (
              <li key={photo.id} className={i < 3 ? styles.galleryLarge : styles.gallerySmall}>
                <Image
                  src={`/landing/gallery-${photo.id}.webp`}
                  alt={photo.alt}
                  width={photo.w}
                  height={photo.h}
                  sizes="(max-width: 760px) 50vw, 380px"
                />
              </li>
            ))}
          </ul>
        </section>

        <section className={styles.final}>
          <h2 className={styles.finalTitle}>
            <span>{final.lines[0]}</span> <span>{final.lines[1]}</span>
          </h2>
          <Divider className={styles.dividerWide} />
          <p className={styles.finalBody}>{final.body}</p>
          <StartQuizLink className={`${styles.brightButton} ${styles.finalButton}`}>
            {final.button}
            <Icon name="arrowRight" size={22} />
          </StartQuizLink>
        </section>
      </main>

      <footer className={styles.footer}>
        <Divider className={styles.footerRule} />
        <div className={styles.footerGrid}>
          <div className={styles.footerLegal}>
            <p>{brand.copyright}</p>
            <p>
              <Link href={brand.privacyUrl}>Privacy Policy</Link>
              <span aria-hidden="true">|</span>
              <Link href={brand.termsUrl}>Terms of Use</Link>
            </p>
          </div>
          <div className={styles.footerBrand}>
            <Image src="/brand/footer-logo-v2.webp" alt="The Visibility Codes" width={231} height={140} />
            <p>{brand.tagline}</p>
          </div>
          <ul className={styles.footerLinks}>
            <li>
              <Icon name="instagram" size={26} />
              <a href={`https://www.instagram.com/${brand.instagramHandle.replace("@", "")}`}>{brand.instagramHandle}</a>
            </li>
            <li>
              <Icon name="hash" size={26} />
              <span>{brand.hashtag}</span>
            </li>
            <li>
              <Icon name="globe" size={26} />
              <a href={brand.websiteUrl}>{brand.websiteLabel}</a>
            </li>
          </ul>
        </div>
      </footer>
      <RefCapture />
    </div>
  );
}

/** Photo with the gold "The Visibility Codes" lettering; a portrait crop is served on phones. */
function HeroArt() {
  const alt = landing.hero.imageAlt;
  const {
    props: { srcSet: desktop },
  } = getImageProps({ alt, src: "/landing/hero-desktop.webp", width: 722, height: 668, sizes: "60vw" });
  const {
    props: { srcSet: mobile, ...rest },
  } = getImageProps({ alt, src: "/landing/hero-mobile.webp", width: 390, height: 341, sizes: "100vw", priority: true });
  return (
    <picture className={styles.heroArt}>
      <source media="(min-width: 761px)" srcSet={desktop} />
      <source media="(max-width: 760px)" srcSet={mobile} />
      <img {...rest} src={rest.src} alt={alt} />
    </picture>
  );
}

function PressLogos({ className = "" }: { className?: string }) {
  return (
    <section className={`${styles.press} ${className}`} aria-label="As featured in">
      <ul>
        {landing.press.map((logo) => (
          <li key={logo.id}>
            <Image
              src={`/landing/press-${logo.id}.webp`}
              alt={logo.name}
              width={logo.w}
              height={logo.h}
              style={{ width: Math.round(logo.w * 1.2), height: "auto" }}
            />
          </li>
        ))}
      </ul>
    </section>
  );
}

/** Gold line, four-point star, gold line. */
function Divider({ className = "" }: { className?: string }) {
  return (
    <span className={`${styles.divider} ${className}`} aria-hidden="true">
      <span className={styles.star} />
    </span>
  );
}

/** Example score dial: beige to gold to black band, dotted scale, gold needle. */
function Gauge({ value }: { value: number }) {
  const cx = 230;
  const cy = 216;
  const rOut = 168;
  const rIn = 106;
  const pt = (pct: number, r: number): [number, number] => {
    const a = Math.PI * (1 - pct / 100);
    return [cx + r * Math.cos(a), cy - r * Math.sin(a)];
  };
  const f = (n: number) => n.toFixed(1);
  const band = (from: number, to: number) => {
    const [x1, y1] = pt(from, rOut);
    const [x2, y2] = pt(to, rOut);
    const [x3, y3] = pt(to, rIn);
    const [x4, y4] = pt(from, rIn);
    return `M${f(x1)} ${f(y1)} A${rOut} ${rOut} 0 0 1 ${f(x2)} ${f(y2)} L${f(x3)} ${f(y3)} A${rIn} ${rIn} 0 0 0 ${f(x4)} ${f(y4)}Z`;
  };
  const [dotStartX, dotStartY] = pt(0, 190);
  const [dotEndX, dotEndY] = pt(100, 190);
  const tip = pt(value, 150);
  const baseL = pt(value + 3.2, 104);
  const baseR = pt(value - 3.2, 104);

  return (
    <svg viewBox="0 -26 460 330" className={styles.gauge} role="img" aria-label={`Example score: ${value} out of 100`}>
      <defs>
        <linearGradient id="gaugeHot" x1="230" y1="0" x2="398" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#ecdcbd" />
          <stop offset="0.5" stopColor="#d3ad6b" />
          <stop offset="0.78" stopColor="#6b4e22" />
          <stop offset="1" stopColor="#141210" />
        </linearGradient>
      </defs>
      <path
        d={`M${f(dotStartX)} ${f(dotStartY)} A190 190 0 0 1 ${f(dotEndX)} ${f(dotEndY)}`}
        fill="none"
        stroke="#b9a988"
        strokeWidth="2"
        strokeDasharray="0.1 7"
        strokeLinecap="round"
      />
      <path d={band(0, 50)} fill="#efe6d7" />
      <path d={band(50, 100)} fill="url(#gaugeHot)" />
      <circle cx={cx} cy={cy} r="100" fill="#fffdf8" stroke="#e2cfa6" strokeWidth="1.5" />
      {[0, 25, 50, 75, 100].map((tick) => {
        const [dx, dy] = pt(tick, 190);
        const [lx, ly] = pt(tick, 214);
        return (
          <g key={tick}>
            <circle cx={f(dx)} cy={f(dy)} r="4" fill="#d09a3c" />
            <text x={f(lx)} y={f(ly)} className={styles.gaugeTick} textAnchor="middle" dominantBaseline="middle">
              {tick}
            </text>
          </g>
        );
      })}
      <polygon points={`${f(tip[0])},${f(tip[1])} ${f(baseL[0])},${f(baseL[1])} ${f(baseR[0])},${f(baseR[1])}`} fill="#d6a74f" />
      <text x={cx} y={cy - 6} textAnchor="middle" className={styles.gaugeValue}>
        {value}
      </text>
      <text x={cx} y={cy + 42} textAnchor="middle" className={styles.gaugeOutOf}>
        /100
      </text>
    </svg>
  );
}
