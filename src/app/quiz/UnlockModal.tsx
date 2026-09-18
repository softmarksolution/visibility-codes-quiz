"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { unlock } from "@/content/site";
import type { Answers } from "@/lib/quiz/questions";
import { computeResults } from "@/lib/quiz/scoring";
import { clearProgress, readLead, readRef, saveName } from "@/lib/storage";
import styles from "./quiz.module.css";

interface Props {
  answers: Answers;
  onClose: () => void;
}

export default function UnlockModal({ answers, onClose }: Props) {
  const router = useRouter();
  const results = useMemo(() => computeResults(answers), [answers]);
  /* The opt-in before the quiz already took a name, email and phone, so this
     second ask is pre-filled from it rather than made to be re-typed. Read
     lazily: readLead() is storage-guarded and returns null on the server, and
     this modal only mounts after the last question is answered, so its first
     render is client-side. */
  const [firstName, setFirstName] = useState(() => readLead()?.name.trim().split(/\s+/)[0] ?? "");
  const [email, setEmail] = useState(() => readLead()?.email ?? "");
  const [website, setWebsite] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const firstInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    /* preventScroll: the field is already on screen inside a fixed overlay, and
       scrolling the quiz behind the dialog to "reveal" it moves the layout as
       the dialog opens. */
    firstInput.current?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    /* The scroll container is <html>, not <body>. */
    const previousOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = previousOverflow;
    };
  }, [onClose]);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (submitting) return;
    setError(null);
    if (!firstName.trim()) return setError("Please enter your first name.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) return setError("Please enter a valid email address.");

    setSubmitting(true);
    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, email, answers, ref: readRef() ?? undefined, website }),
      });
      const data = (await res.json().catch(() => null)) as
        | { ok: true; reportCode: string; referralCode: string }
        | { ok: false; error: string }
        | null;
      if (!res.ok || !data || !data.ok) {
        setError(data && !data.ok ? data.error : unlock.genericError);
        setSubmitting(false);
        return;
      }
      saveName(firstName.trim(), data.reportCode);
      clearProgress();
      router.push(`/results?r=${encodeURIComponent(data.reportCode)}&c=${encodeURIComponent(data.referralCode)}`);
    } catch {
      setError(unlock.genericError);
      setSubmitting(false);
    }
  }

  return (
    <div className={styles.overlay}>
      <div className={styles.modal} role="dialog" aria-modal="true" aria-labelledby="unlock-title">
        <button type="button" className={styles.close} onClick={onClose} aria-label="Back to questions">
          ×
        </button>
        <p className={styles.scored}>You scored {results.score}/100.</p>
        <h2 id="unlock-title" className={styles.modalTitle}>
          {unlock.headline[results.level]}
        </h2>
        <p className={styles.modalBody}>{unlock.body}</p>

        <form className={styles.modalForm} onSubmit={handleSubmit} noValidate>
          <label htmlFor="first-name" className="sr-only">
            {unlock.firstNameLabel}
          </label>
          <input
            ref={firstInput}
            id="first-name"
            className={styles.field}
            placeholder={unlock.firstNameLabel}
            autoComplete="given-name"
            maxLength={80}
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
          <label htmlFor="email" className="sr-only">
            {unlock.emailLabel}
          </label>
          <input
            id="email"
            type="email"
            className={styles.field}
            placeholder={unlock.emailLabel}
            autoComplete="email"
            inputMode="email"
            maxLength={254}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <div className={styles.honeypot} aria-hidden="true">
            <label htmlFor="website">Website</label>
            <input id="website" tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} />
          </div>

          {error && (
            <p className={styles.error} role="alert">
              {error}
            </p>
          )}

          <button type="submit" className={`btn-gold ${styles.unlockButton}`} disabled={submitting}>
            {submitting ? unlock.sending : unlock.button}
          </button>
        </form>
        <p className={styles.smallPrint}>{unlock.smallPrint}</p>
      </div>
    </div>
  );
}
