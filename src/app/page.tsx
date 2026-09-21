import type { Metadata } from "next";
import { HeaderBanner } from "@/components/SiteChrome";
import QuizLoader from "./QuizLoader";
import styles from "./quiz.module.css";

export const metadata: Metadata = {
  title: "Visibility Assessment | The Visibility Codes",
  description:
    "Take the 3-minute Visibility Assessment to find your visibility score, your primary gap and what to shift next.",
};

export default function HomePage() {
  return (
    <div className={styles.page}>
      <HeaderBanner variant="compact" />
      <main className={styles.main}>
        <QuizLoader />
      </main>
    </div>
  );
}
