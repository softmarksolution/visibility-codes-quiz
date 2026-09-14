import Link from "next/link";
import type { LegalDoc } from "@/content/legal";
import { HeaderBanner, SiteFooter } from "@/components/SiteChrome";
import styles from "./LegalPage.module.css";

/** Renders a full legal document (Privacy Policy, Terms of Use) on its own page. */
export function LegalPage({ doc }: { doc: LegalDoc }) {
  return (
    <>
      <HeaderBanner variant="compact" />
      <main className={styles.main}>
        <article className={styles.doc}>
          <h1 className={styles.title}>{doc.title}</h1>

          {doc.sections.map((section) => (
            <section key={section.heading} className={styles.section}>
              <h2 className={styles.heading}>{section.heading}</h2>
              {section.blocks.map((block, i) => (
                <p key={i} className={block.kind === "li" ? styles.bullet : styles.para}>
                  {block.text}
                </p>
              ))}
            </section>
          ))}

          <p className={styles.updated}>{doc.lastUpdated}</p>

          <Link href="/" className={styles.back}>
            Back to the quiz
          </Link>
        </article>
      </main>
      <SiteFooter />
    </>
  );
}
