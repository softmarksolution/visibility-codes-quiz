import type { Metadata } from "next";
import { HeaderBanner } from "@/components/SiteChrome";
import QuizLoader from "./QuizLoader";
import styles from "./quiz.module.css";

export const metadata: Metadata = {
  title: "Visibility Assessment | The Visibility Codes",
};

export default function QuizPage() {
  return (
    <div className={styles.page}>
      <HeaderBanner />
      <main className={styles.main}>
        <QuizLoader />
      </main>
    </div>
  );
}
