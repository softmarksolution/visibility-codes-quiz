"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { optIn } from "@/content/site";
import { clearProgress, saveLead } from "@/lib/storage";
import styles from "./LeadModal.module.css";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/**
 * Every "start" button on the landing page.
 *
 * The brief puts an opt-in between the button and the quiz: the button opens a
 * pop-up for name, email and phone, which hands off to the quiz cover page and
 * only then to the questions. It used to link straight to /quiz, skipping both.
 *
 * Starting is always a deliberate restart, so whatever was saved from an earlier
 * run is dropped before moving on. Without that, someone who abandoned the quiz
 * and came back to begin again landed in the middle of it and was scored partly
 * on their old answers. Reloading /quiz itself still resumes — that is the case
 * the saved progress is for.
 */
export default function StartQuizLink({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const opener = useRef<HTMLButtonElement | null>(null);
  const firstField = useRef<HTMLInputElement | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    /* The scroll container is <html>, not <body>, so locking body alone left the
       page scrollable behind the dialog. */
    const previousOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    /* preventScroll because the field is already on screen inside a fixed
       overlay. Without it the browser scrolled the page down to "reveal" it,
       which moved the whole layout under the pointer as the dialog opened and
       left the visitor further down the page once they closed it. */
    const t = window.setTimeout(() => firstField.current?.focus({ preventScroll: true }), 60);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = previousOverflow;
      window.clearTimeout(t);
      opener.current?.focus({ preventScroll: true });
    };
  }, [open]);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return setError("Please enter your name.");
    if (!EMAIL.test(email.trim())) return setError("Please enter a valid email address.");
    if (!phone.trim()) return setError("Please enter your phone number.");
    setError("");
    saveLead({ name: name.trim(), email: email.trim(), phone: phone.trim() });
    clearProgress();
    router.push("/quiz-cover");
  }

  return (
    <>
      <button
        type="button"
        className={className}
        onClick={(e) => {
          opener.current = e.currentTarget;
          setOpen(true);
        }}
      >
        {children}
      </button>

      {open && (
        <div className={styles.wrap}>
          <button
            type="button"
            className={styles.backdrop}
            aria-label={optIn.close}
            onClick={() => setOpen(false)}
          />
          <div className={styles.modal} role="dialog" aria-modal="true" aria-labelledby="optin-title">
            <button type="button" className={styles.close} onClick={() => setOpen(false)} aria-label={optIn.close}>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M4 4 20 20M20 4 4 20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
              </svg>
            </button>

            <h2 id="optin-title" className={styles.title}>
              {optIn.titleLines.map((line, i) => (
                <span key={line} className={i === 1 ? styles.gold : undefined}>
                  {line}
                </span>
              ))}
            </h2>
            <p className={styles.body}>{optIn.body}</p>

            <form onSubmit={submit} noValidate className={styles.form}>
              <input
                ref={firstField}
                className={styles.field}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={optIn.namePlaceholder}
                aria-label={optIn.namePlaceholder}
                autoComplete="name"
              />
              <input
                className={styles.field}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={optIn.emailPlaceholder}
                aria-label={optIn.emailPlaceholder}
                autoComplete="email"
              />
              <input
                className={styles.field}
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder={optIn.phonePlaceholder}
                aria-label={optIn.phonePlaceholder}
                autoComplete="tel"
              />
              {error && <p className={styles.error}>{error}</p>}
              <button type="submit" className={styles.submit}>
                {optIn.button}
              </button>
            </form>

            <p className={styles.note}>{optIn.note}</p>
          </div>
        </div>
      )}
    </>
  );
}
