import Image from "next/image";
import Link from "next/link";
import { brand } from "@/content/site";
import styles from "./SiteChrome.module.css";

export function HeaderBanner() {
  return (
    <header className={styles.banner}>
      <Link href="/" aria-label="The Visibility Codes home">
        <Image
          src="/brand/header-banner.webp"
          alt="The Visibility Codes"
          width={2400}
          height={408}
          priority
          sizes="100vw"
          className={styles.bannerImage}
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
            <a href={brand.privacyUrl}>Privacy Policy</a>
            <span aria-hidden="true">|</span>
            <a href={brand.termsUrl}>Terms and Conditions</a>
          </p>
        </div>
        <Image src="/brand/footer-logo.webp" alt="The Visibility Codes" width={231} height={140} className={styles.footerLogo} />
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
