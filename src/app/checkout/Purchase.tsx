"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/Icon";
import { checkoutCopy } from "@/content/site";
import type { PillarId } from "@/lib/quiz/questions";
import styles from "./checkout.module.css";

/* =============================================================================
   PAYMENT

   Two modes, and neither is switched by hand:

     STRIPE_KEY empty  ->  DEMO PAYMENT. A card box that accepts four fixed test
                           numbers so the funnel can be walked end to end.
                           Nothing is stored, sent, or charged.
     STRIPE_KEY set    ->  LIVE PAYMENT. Stripe mounts its own iframe, card data
                           never touches this page, and the demo card is gone.

   TO GO LIVE
     1. put the publishable key in NEXT_PUBLIC_STRIPE_KEY
     2. add a route that creates a PaymentIntent for the amount below and
        returns its client_secret, then confirm the payment against it here

   ALLOW_DEMO = false turns the demo off even while no key is set.
   ============================================================================= */
const STRIPE_KEY = process.env.NEXT_PUBLIC_STRIPE_KEY ?? "";
const ALLOW_DEMO = true;
const demoMode = ALLOW_DEMO && !STRIPE_KEY;

/* Accepts nothing but these. Nothing is stored, nothing is transmitted, and
   autocomplete is off so the browser never offers a real saved card. */
const DEMO_CARDS: Record<string, { ok: boolean; msg?: string }> = {
  "4242424242424242": { ok: true },
  "4000000000000002": { ok: false, msg: "Your card was declined. (demo)" },
  "4000000000009995": { ok: false, msg: "Insufficient funds. (demo)" },
  "4000000000000069": { ok: false, msg: "Your card has expired. (demo)" },
};
const DEMO_BUTTONS = [
  { label: "Approve", num: "4242424242424242" },
  { label: "Decline", num: "4000000000000002" },
  { label: "No funds", num: "4000000000009995" },
  { label: "Expired", num: "4000000000000069" },
];

const money = (cents: number) => `$${(cents / 100).toFixed(2)}`;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export default function Purchase({
  edition,
  editionId,
  reportCode,
}: {
  edition: string | null;
  editionId: PillarId | null;
  reportCode: string;
}) {
  const [waitlist, setWaitlist] = useState(true);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [card, setCard] = useState("");
  const [busy, setBusy] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; email?: string; card?: string }>({});
  const opener = useRef<HTMLElement | null>(null);
  const router = useRouter();

  const total = checkoutCopy.priceCents;
  const hasResult = Boolean(editionId);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      opener.current?.focus();
    };
  }, [open]);

  function fill(num: string) {
    setCard(num.replace(/(.{4})/g, "$1 ").trim());
    setErrors((e) => ({ ...e, card: undefined }));
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const next: typeof errors = {};
    if (!name.trim()) next.name = "Please enter your name.";
    if (!EMAIL.test(email.trim())) next.email = "Please enter a valid email address.";
    if (Object.keys(next).length) {
      setErrors(next);
      return;
    }

    const digits = card.replace(/\D/g, "");
    if (demoMode) {
      if (!digits) {
        setErrors({ card: "Enter a demo card, or press one of the buttons." });
        return;
      }
      const match = DEMO_CARDS[digits];
      if (!match) {
        setErrors({ card: "Demo mode only accepts the four test cards above." });
        return;
      }
      setErrors({});
      setBusy(true);
      window.setTimeout(() => {
        if (match.ok) {
          const q = new URLSearchParams({
            paid: "1",
            edition: editionId ?? "",
            waitlist: waitlist ? "1" : "0",
          });
          if (reportCode) q.set("r", reportCode);
          router.push(`/thank-you?${q.toString()}`);
          return;
        }
        setBusy(false);
        setErrors({ card: match.msg });
      }, 900);
      return;
    }

    setErrors({ card: "Payments are not connected yet — set NEXT_PUBLIC_STRIPE_KEY." });
  }

  if (!hasResult) {
    return (
      <div className={styles.panel}>
        <p className={styles.noResultLead}>{checkoutCopy.noResultBody}</p>
        <Link href="/quiz" className={styles.buy}>
          {checkoutCopy.noResultButton}
        </Link>
        <p className={styles.back}>
          <Link href="/">Back to the home page</Link>
        </p>
      </div>
    );
  }

  return (
    <div className={styles.panel}>
      <p className={styles.price}>
        <b>{money(total)}</b> <span>{checkoutCopy.currency}</span>
        <em>One-off</em>
      </p>

      <p className={styles.inside}>{checkoutCopy.inside}</p>
      <ul className={styles.bullets}>
        {checkoutCopy.bullets.map((b) => (
          <li key={b}>
            <Icon name="sparkle" size={16} />
            <span>{b}</span>
          </li>
        ))}
      </ul>
      <p className={styles.closing}>{checkoutCopy.closing}</p>

      {/* The client's copy marks this "ADD TO YOUR PURCHASE - MUST SAY FREE" */}
      <div className={styles.addOn}>
        <label className={styles.addOnHead}>
          <input type="checkbox" checked={waitlist} onChange={(e) => setWaitlist(e.target.checked)} />
          <span className={styles.addOnLabel}>{checkoutCopy.addOnLabel}</span>
          <span className={styles.addOnFree}>{checkoutCopy.addOnFree}</span>
        </label>
        <p className={styles.addOnTitle}>{checkoutCopy.addOnTitle}</p>
        <p className={styles.addOnSubtitle}>{checkoutCopy.addOnSubtitle}</p>
        <p className={styles.addOnBody}>{checkoutCopy.addOnBody}</p>
        <p className={styles.addOnBody}>{checkoutCopy.addOnJoin}</p>
      </div>

      <button
        type="button"
        className={styles.buy}
        onClick={(e) => {
          opener.current = e.currentTarget;
          setOpen(true);
        }}
      >
        {checkoutCopy.buyButton}
      </button>
      <p className={styles.back}>
        <Link href={reportCode ? `/results?r=${reportCode}` : "/quiz"}>{checkoutCopy.backToResults}</Link>
      </p>

      {open && (
        <div className={styles.modal}>
          <button
            type="button"
            className={styles.backdrop}
            aria-label="Close"
            onClick={() => setOpen(false)}
          />
          <div className={styles.dialog} role="dialog" aria-modal="true" aria-labelledby="pay-title">
            {demoMode && <p className={styles.demoBanner}>Demo payment — no card is charged</p>}
            <h2 id="pay-title" className={styles.dialogTitle}>
              Complete your purchase
            </h2>

            <div className={styles.summary}>
              <p>
                <span>
                  Visibility Action Plan — {edition} Edition
                </span>
                <b>{money(total)}</b>
              </p>
              {waitlist && (
                <p className={styles.summaryFree}>
                  <span>Masterclass Priority Waitlist</span>
                  <b>Free</b>
                </p>
              )}
              <p className={styles.summaryTotal}>
                <span>Total</span>
                <b>
                  {money(total)} {checkoutCopy.currency}
                </b>
              </p>
            </div>

            <form className={styles.form} onSubmit={submit} noValidate>
              <label className={styles.field}>
                <span>Full name</span>
                <input value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" />
                {errors.name && <em>{errors.name}</em>}
              </label>
              <label className={styles.field}>
                <span>Email for delivery</span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                />
                {errors.email && <em>{errors.email}</em>}
              </label>

              <div className={styles.field}>
                <span>Card details</span>
                {demoMode ? (
                  <>
                    {/* Real card fields never exist on this site: in live mode the
                        processor renders its own iframe here. */}
                    <div className={styles.demoCard}>
                      <input
                        className={styles.demoNum}
                        value={card}
                        inputMode="numeric"
                        autoComplete="off"
                        spellCheck={false}
                        maxLength={19}
                        placeholder="4242 4242 4242 4242"
                        aria-label="Demo card number"
                        onChange={(e) => {
                          const d = e.target.value.replace(/\D/g, "").slice(0, 16);
                          setCard(d.replace(/(.{4})/g, "$1 ").trim());
                          setErrors((x) => ({ ...x, card: undefined }));
                        }}
                      />
                      <input className={styles.demoSm} defaultValue="" placeholder="12 / 34" aria-label="Demo expiry" autoComplete="off" />
                      <input className={styles.demoSm} defaultValue="" placeholder="123" aria-label="Demo CVC" autoComplete="off" />
                    </div>
                    <div className={styles.demoPick}>
                      {DEMO_BUTTONS.map((b) => (
                        <button key={b.num} type="button" onClick={() => fill(b.num)}>
                          {b.label}
                        </button>
                      ))}
                    </div>
                    <p className={styles.demoNote}>
                      Demo only — these buttons fill a test number. Never enter a real card.
                    </p>
                  </>
                ) : (
                  <div id="card-element" className={styles.cardMount} />
                )}
                {errors.card && <em>{errors.card}</em>}
              </div>

              <button type="submit" className={styles.pay} disabled={busy}>
                {busy ? "Processing…" : checkoutCopy.payButton(`${money(total)} ${checkoutCopy.currency}`)}
              </button>
            </form>

            <p className={styles.secure}>
              {demoMode
                ? "Demo mode — no payment provider is connected. Nothing you type here is stored or sent anywhere, and no money can move."
                : "Secure payment — your card details go straight to the payment provider and are never stored on this site."}
            </p>
            <p className={styles.terms}>
              {checkoutCopy.terms} <Link href="/terms-of-purchase">{checkoutCopy.termsLink}</Link>.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
