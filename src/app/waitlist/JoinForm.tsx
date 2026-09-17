"use client";

import Link from "next/link";
import { useState } from "react";
import styles from "./waitlist.module.css";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export default function JoinForm() {
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!firstName.trim()) return setError("Please enter your first name.");
    if (!EMAIL.test(email.trim())) return setError("Please enter a valid email address.");
    setError("");
    setBusy(true);
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName: firstName.trim(), email: email.trim() }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) throw new Error(data.error || "Something went wrong. Please try again.");
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setBusy(false);
    }
  }

  if (done) {
    return (
      <div className={styles.done}>
        <h2 className={styles.doneTitle}>You&rsquo;re on the Priority Waitlist</h2>
        <p className={styles.body}>
          You&rsquo;ll be first to know when doors open, with early updates, priority bonuses and launch
          pricing reserved for waitlist members.
        </p>
        <p className={styles.back}>
          <Link href="/">Back to the home page</Link>
        </p>
      </div>
    );
  }

  return (
    <form className={styles.form} onSubmit={submit} noValidate>
      <label className={styles.field}>
        <span>First name</span>
        <input value={firstName} onChange={(e) => setFirstName(e.target.value)} autoComplete="given-name" />
      </label>
      <label className={styles.field}>
        <span>Email</span>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
      </label>
      {error && <p className={styles.error}>{error}</p>}
      <button type="submit" className={styles.button} disabled={busy}>
        {busy ? "Joining…" : "Join the priority waitlist free"}
      </button>
    </form>
  );
}
