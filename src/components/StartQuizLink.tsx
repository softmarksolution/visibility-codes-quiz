"use client";

import Link from "next/link";
import { clearProgress } from "@/lib/storage";

/**
 * The landing page's way into the quiz.
 *
 * Every "start quiz" button is a deliberate start, so it drops whatever was
 * saved from an earlier run before navigating. Without this, someone who
 * abandoned the quiz and came back to begin again landed in the middle of the
 * assessment and was scored partly on their old answers. Reloading `/quiz`
 * itself still resumes — that is the case the saved progress is for.
 */
export default function StartQuizLink({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Link href="/quiz" className={className} onClick={clearProgress}>
      {children}
    </Link>
  );
}
