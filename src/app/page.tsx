import type { Metadata } from "next";
import { Jost } from "next/font/google";
import Link from "next/link";
import { HeaderBanner, SiteFooter } from "@/components/SiteChrome";
import { landing } from "@/content/site";
import RefCapture from "./RefCapture";
import styles from "./page.module.css";

// Futura-style font for the cover page body text, matching the client's design.
// Loaded here so the quiz and results pages don't download it.
const jost = Jost({ subsets: ["latin"], variable: "--font-jost", display: "swap" });

export const metadata: Metadata = {
  title: "The Visibility Codes Quiz | Get Your Personalised Visibility Score",
  description:
    "In 3 minutes, identify what is really getting in the way, where your visibility is breaking down, and exactly what to shift so the right people begin to see, recognise and choose you.",
};

export default function HomePage() {
  return (
    <>
      <HeaderBanner variant="cover" />
      <main className={`${styles.main} ${jost.variable}`}>
        <section className={styles.cover}>
          <p className={styles.eyebrow}>{landing.eyebrow}</p>
          <h1 className={styles.heading}>
            {landing.headingLines.map((line, i) => (
              <span key={line}>
                {i > 0 && " "}
                <span className={styles.headingLine}>{line}</span>
              </span>
            ))}
          </h1>

          <ul className={styles.pills}>
            {landing.pills.map((pill) => (
              <li key={pill}>{pill}</li>
            ))}
          </ul>

          <div className={styles.copy}>
            {landing.paragraphs.map((text) => (
              <p key={text.slice(0, 24)}>{text}</p>
            ))}
          </div>

          <Link href="/quiz" className={styles.start}>
            {landing.button}
          </Link>

          <p className={styles.reminder}>
            {landing.reminder.map((line, i) => (
              <span key={line}>
                {i > 0 && " "}
                <span className={styles.reminderLine}>{line}</span>
              </span>
            ))}
          </p>
        </section>
      </main>
      <SiteFooter />
      <RefCapture />
    </>
  );
}
