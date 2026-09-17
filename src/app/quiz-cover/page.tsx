import type { Metadata } from "next";
import Link from "next/link";
import { HeaderBanner, SiteFooter } from "@/components/SiteChrome";
import { quizCover } from "@/content/site";
import styles from "./quiz-cover.module.css";

export const metadata: Metadata = {
  title: "The Visibility Codes Quiz | Start Your Assessment",
  description: quizCover.title,
};

export default function QuizCoverPage() {
  return (
    <>
      <HeaderBanner variant="compact" />
      <main className={styles.page}>
        <p className={styles.eyebrow}>{quizCover.eyebrow}</p>
        <h1 className={styles.title}>{quizCover.title}</h1>

        <ul className={styles.stats}>
          {quizCover.stats.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>

        <div className={styles.copy}>
          {quizCover.paragraphs.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>

        <Link href="/quiz" className={styles.button}>
          {quizCover.button}
        </Link>

        <p className={styles.footnote}>{quizCover.footnote}</p>
      </main>
      <SiteFooter />
    </>
  );
}
