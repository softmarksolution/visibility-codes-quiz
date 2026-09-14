import Image from "next/image";
import Link from "next/link";
import { brand } from "@/content/site";
import styles from "./SiteChrome.module.css";

/** "compact" is the 800px-wide banner used on the quiz and results pages. */
export function HeaderBanner({ variant = "default" }: { variant?: "default" | "compact" }) {
  return (
    <header className={styles.banner}>
      <Link href="/" aria-label="The Visibility Codes home">
        <Image
          src="/brand/header-banner-hd.webp"
          alt="The Visibility Codes"
          width={3402}
          height={578}
          priority
          sizes={variant === "compact" ? "(max-width: 800px) 100vw, 800px" : "100vw"}
          className={`${styles.bannerImage} ${variant === "default" ? "" : styles[`banner_${variant}`]}`}
        />
      </Link>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerInner}>
        <div className={styles.footerLeft}>
          <p>{brand.copyright}</p>
          <p className={styles.legal}>
            <Link href={brand.privacyUrl}>Privacy Policy</Link>
            <span aria-hidden="true">|</span>
            <Link href={brand.termsUrl}>Terms of Use</Link>
          </p>
        </div>
        <Image src="/brand/footer-logo-v2.webp" alt="The Visibility Codes" width={231} height={140} className={styles.footerLogo} />
        <p className={styles.footerRight}>
          <span>{brand.instagramHandle}</span>
          <span aria-hidden="true">|</span>
          <span>{brand.hashtag}</span>
          <span aria-hidden="true">|</span>
          <a href={brand.websiteUrl}>{brand.websiteLabel}</a>
        </p>
      </div>
    </footer>
  );
}
