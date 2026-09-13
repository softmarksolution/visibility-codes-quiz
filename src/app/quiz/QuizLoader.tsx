"use client";

import dynamic from "next/dynamic";
import styles from "./quiz.module.css";

// Client-only: progress is restored from localStorage on first render.
const Quiz = dynamic(() => import("./Quiz"), {
  ssr: false,
  loading: () => <div className={styles.card} aria-busy="true" style={{ minHeight: 480 }} />,
});

export default function QuizLoader() {
  return <Quiz />;
}
