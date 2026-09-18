import type { Metadata } from "next";
import Image, { getImageProps } from "next/image";
import Link from "next/link";
import { Fragment } from "react";
import { Icon } from "@/components/Icon";
import StartQuizLink from "@/components/StartQuizLink";
import { brand, landing } from "@/content/site";
import RefCapture from "./RefCapture";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "The Visibility Codes | Get Your Visibility Score Free",
  description: landing.hero.body.replace(/\n/g, " "),
};

/* The layout PDF's own line breaks, marked "\n" in site.ts. They become <br>
   elements that exist only at desktop widths (see .brk); phones wrap naturally. */
function withBreaks(text: string) {
  const lines = text.split("\n");
  return lines.map((line, i) => (
    <Fragment key={line}>
      {i > 0 && <br className={styles.brk} aria-hidden="true" />}
      {i > 0 ? " " + line : line}
    </Fragment>
  ));
}

export default function HomePage() {
  const { hero, score, why, who, gaps, meet, gallery, final } = landing;

  return (
    <div className={styles.page}>
      <main>
        <section className={styles.hero}>
          <div className={styles.heroInner}>
            <HeroArt />
            <div className={styles.heroCard}>
              {/* The client's gold frame artwork (glints top, right and bottom);
                  sized so its frame line sits on the card bounds and its glow
                  overhangs them. Decorative only. */}
              <Image
                src="/landing/hero-frame-e9a617a1.webp"
                alt=""
                width={1182}
                height={1330}
                priority
                aria-hidden="true"
                className={styles.heroFrame}
              />
              <h1 className={styles.heroTitle}>{hero.title}</h1>
              <span className={styles.shortRule} aria-hidden="true" />
              <p className={styles.heroBody}>{withBreaks(hero.body)}</p>
              <p className={styles.heroTagline}>{hero.tagline}</p>
              <StartQuizLink className={`${styles.brightButton} ${styles.heroButton}`}>
                {/* Desktop face: the client's gold-foil button artwork (label
                    baked in); the live label below stays for screen readers
                    and becomes the visible mobile button. */}
                {/* Rebuilt from the supplied image: interior flattened opaque and
                    the alpha cut as a clean rounded rect, because the original's
                    white-matte edge fringe rendered as a grey rim when scaled. */}
                <Image
                  src="/landing/hero-button-73ff0acf.webp"
                  alt=""
                  width={1935}
                  height={294}
                  priority
                  aria-hidden="true"
                  className={styles.heroButtonArt}
                />
                <span className={styles.heroButtonLabel}>{hero.button}</span>
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
              <p className={styles.scoreBody}>{withBreaks(score.body)}</p>
            </div>

            <ul className={styles.benefits}>
              {score.bullets.map((b) => (
                <li key={b.strong}>
                  <Icon name={b.icon} size={42} className={styles.benefitIcon} />
                  <span>
                    <strong>{b.strong}</strong>
                    {withBreaks(b.rest)}
                  </span>
                </li>
              ))}
            </ul>

            <div className={styles.scoreFoot}>
              <Divider />
              <p>{withBreaks(score.after)}</p>
              <StartQuizLink className={`${styles.matteButton} ${styles.scoreButton}`}>
                {score.button}
              </StartQuizLink>
            </div>

            {/* The dial is the client's own artwork from the 18.9 asset drop
                ("3./3A.png"), cropped to its panel. Its title, scale, range row
                and pill are drawn into the picture, so the alt text carries all
                of that wording. */}
            <div className={styles.gaugeCard}>
              <Image
                className={styles.gaugeArt}
                src="/landing/score-gauge-94632983.webp"
                alt={`${score.gaugeTitle}: an example score of ${score.sample} out of 100, on a scale running from ${score.rangeFrom} to ${score.rangeTo}. ${score.pill}`}
                width={629}
                height={658}
                sizes="(max-width: 1100px) 92vw, 42vw"
              />
            </div>
          </div>
        </section>

        {/* WHY THE VISIBILITY CODES WORK — the photo is the layout's own art
            band, cut with its beige wash baked in so it dissolves into the
            text field the way the 18.9.26 layout blends the two halves. */}
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
                  <p key={text.slice(0, 32)}>{withBreaks(text)}</p>
                ))}
              </div>
              <ul className={styles.stats}>
                {why.stats.map((s) => (
                  <li key={s.note} className={styles.stat}>
                    <Icon name={s.icon} size={30} className={styles.statIcon} />
                    <p className={styles.statLead}>
                      {"leadAfter" in s && s.leadAfter ? (
                        <>
                          <span className={styles.statRest}>{s.rest}</span> <b>{s.lead}</b>
                        </>
                      ) : (
                        <>
                          {s.lead ? <b>{s.lead}</b> : null} <span className={styles.statRest}>{s.rest}</span>
                        </>
                      )}
                    </p>
                    <p className={styles.statNote}>{s.note}</p>
                  </li>
                ))}
              </ul>
              <p className={styles.whyFoot}>{withBreaks(why.footnote)}</p>
            </div>
          </div>
        </section>

        <section className={styles.who}>
          <div className={styles.whoInner}>
            <Image
              src="/landing/who-photo-23e7fa6d.webp"
              alt={who.photoAlt}
              width={1700}
              height={1792}
              sizes="(max-width: 1100px) 100vw, 44vw"
              className={styles.whoPhoto}
            />
            <div className={styles.whoText}>
              <h2 className={styles.capsTitle}>{who.title}</h2>
              <Divider className={styles.dividerWide} />
              <ul className={styles.whoList}>
                {who.bullets.map((text) => (
                  <li key={text.slice(0, 32)}>{withBreaks(text)}</li>
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
            <p className={styles.gapsBody}>{withBreaks(gaps.body)}</p>
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
              src="/landing/meet-katrina-c6503f1f.webp"
              alt={meet.photoAlt}
              width={942}
              height={1096}
              sizes="(max-width: 1100px) 100vw, 50vw"
              className={styles.meetPhoto}
            />
            <div className={styles.meetText}>
              <h2 className={styles.capsTitle}>{meet.title}</h2>
              <Divider className={styles.dividerWide} />
              {meet.paragraphs.map((text) => (
                <p key={text.slice(0, 32)}>{withBreaks(text)}</p>
              ))}
              {/* The 18.9.26 layout closes the bio with the same line-star-line rule. */}
              <Divider className={`${styles.dividerWide} ${styles.meetRule}`} />
            </div>
          </div>
        </section>

        <PressLogos className={styles.pressMobile} />

        <section className={styles.gallery} aria-label={landing.galleryLabel}>
          <ul>
            {gallery.map((photo, i) => (
              <li key={photo.id} className={i < 3 ? styles.galleryLarge : styles.gallerySmall}>
                <Image
                  src={`/landing/${photo.file}`}
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
          <p className={styles.finalBody}>{withBreaks(final.body)}</p>
          <StartQuizLink className={`${styles.brightButton} ${styles.finalButton}`}>
            {final.button}
            <LongArrow className={styles.finalArrow} />
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
              {/* The 18.9.26 layout labels this "Terms and Conditions"; the page
                  behind it is /terms-of-use. */}
              <Link href={brand.termsUrl}>Terms and Conditions</Link>
            </p>
          </div>
          <div className={styles.footerBrand}>
            <Image src="/brand/footer-logo-v3.webp" alt="The Visibility Codes" width={350} height={135} />
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
  } = getImageProps({ alt, src: "/landing/hero-desktop-556377b9.webp", width: 1920, height: 1077, sizes: "100vw" });
  const {
    props: { srcSet: mobile, ...rest },
  } = getImageProps({ alt, src: "/landing/hero-mobile-a8cd2f4a.webp", width: 941, height: 828, sizes: "100vw", priority: true });
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
              src={`/landing/${logo.file}`}
              alt={logo.name}
              width={logo.w}
              height={logo.h}
              style={{ "--dw": logo.dw, height: "auto" } as React.CSSProperties}
            />
          </li>
        ))}
      </ul>
    </section>
  );
}

/** The long thin arrow the 18.9.26 layout draws inside the final CTA button
    — a shaft far longer than any icon glyph. */
function LongArrow({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 56 12" width="56" height="12" fill="none" aria-hidden="true" className={className}>
      <path d="M1 6h53M49 1.5L54.5 6 49 10.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
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
