# Client requirements vs. what is built — 18 Sep 2026

Source: the full Upwork thread with Md Raziur Rahman (Fancy Funnel) — the interview room
(12–14 Sep, 32 messages) and the contract room (14–17 Sep, 93 messages) — matched against
the code on `main` at `e5f75cb` and the app running at `localhost:3000`.

This supersedes nothing. `static-site/REQUIREMENTS-AUDIT.md` audits the **static HTML**
build against the client's asset drop. This document audits the **shipped Next.js app**
against what the client has actually asked for in writing.

---

## A. Asked for in writing, not built

### A1. The landing-page opt-in pop-up never reaches GoHighLevel
**Client, 17 Sep 12:51:** *"when someone submits the pop-up on the registration page, how
can I track them? When someone submits the pop-up I want to add a TAG:
visibility-codes-optin"*

`src/components/StartQuizLink.tsx` validates name/email/phone, writes them to
`localStorage` via `saveLead()`, and routes to `/quiz-cover`. That is all it does.

Verified live: filling the pop-up and submitting fires **zero** network requests. No
contact is created, no tag is set. Anyone who opts in but abandons the quiz is invisible
to the client — which is the exact case the tag was for.

Also note the pop-up collects a **phone number** that is currently thrown away.

**Needs:** an opt-in route (mirror `src/app/api/waitlist/route.ts`) that upserts the
contact with `visibility-codes-optin` as a managed tag, called before the redirect.

### A2. No iframe embed codes delivered
**Client, 17 Sep 10:20–10:21:** *"Create an embed code for the registration page"* …
*"Then create another embed for the survey and survey results page"* — because *"I want to
keep the domain in GHL"* (also raised 14 Sep 06:17 and 07:44).

Nothing in the repo addresses embedding. No embed snippets, no `X-Frame-Options` /
`frame-ancestors` handling in `next.config.ts`, no height-messaging script. Dropping a
Railway URL into a GHL iframe today will work only by luck, and the inner page's
scroll/height will not sync with the GHL page.

**Needs:** three snippets, plus a `postMessage` height reporter, plus a frame-ancestors
policy that allows the GHL domains.

### A3. No GoHighLevel workflows or follow-up automation
The job post lists **"Basic follow-up automation/workflows"** and **"Necessary
workflows/automation"** as deliverables. `VISIBILITY_QUIZ_COMPLETED` is written as a tag
and documented as *"use it as the GHL workflow trigger"* — but the workflow itself does
not appear to exist. Unverified from here; needs a look inside the sub-account.

### A4. The client's own GHL form is unused
**Client, 16 Sep 05:19:** *"I have created a form in GHL for the pop-up titled: Visibility
Codes Optin"*. Our pop-up is fully custom and ignores it. That is probably the right call
technically, but the client thinks their form is in the funnel. Worth stating plainly so
it is a decision, not a surprise.

### A5. Check-out cannot take money
`src/app/checkout/Purchase.tsx` runs in **demo mode** — `NEXT_PUBLIC_STRIPE_KEY` is unset,
`ALLOW_DEMO = true`, and four fixed test card numbers are accepted. The PaymentIntent
route named in its own comments does not exist. The $35 Visibility Action Plan is the
funnel's only revenue step.

### A6. The paid PDFs are free to anyone who guesses a URL
`public/plans/<edition>-<on|not-on>-waitlist.pdf` is a public static path, and it is
exactly the path the thank-you page builds. Ten $35 products, downloadable without paying.
(Carried over from the static-site audit §4.7 — still true in the Next app.)

---

## B. Newest client material not yet in hand

These were sent in the final 30 hours and are **not** in `C:\Users\User\Downloads`, so I
cannot confirm the build matches them. Each one is a live risk of having built to a
superseded spec.

| Sent | What | Where |
|---|---|---|
| 17 Sep 16:31 | `LAYOUT - FINAL WEB DESIGN - 18.9.26.pdf` — *"final version of the full-page layout… It's urgent"* | Upwork attachment |
| 17 Sep 12:08 & 12:59 | *"some modifications for the top HERO section"* + the hero image | Drive `1QCvHI1-Wpx1JM9LkxbULi51TyHIEdA2p` |
| 17 Sep 15:33 | *"For the **new section**, you can get the image text here"* | Drive `1hYS_p-j3yzBuUN1lH82rNn_h5egy1uro` |
| 16 Sep 06:37 | `NEW RESULTS PAGE (1).png` | Upwork attachment |
| 16 Sep 07:34 | Icon set | Drive `17ksz5j5n4EdsPO6kbZpXAW5R39W1o7L1` |

"**New section**" is the one to worry about — it implies a section that may not exist on
the page at all.

The three Loom videos (`da6771a8`, `4fa64775`, `925c682e`) are narrated in Bengali; the
auto-transcript is poor and Loom gates the full text behind a login. Only fragments were
recoverable: funnel name "Visibility Codes 2026", the pop-up submit handing off to the
survey cover page, and a mention of Playfair. **If these carry revision requests, they are
currently unaccounted for.**

---

## C. Divergences the client has not agreed to

| # | Built | Client said | Note |
|---|---|---|---|
| C1 | Results CTA → internal `/checkout?r=…` | *"Unlocked My Personalised Action Plan CTA link: https://thevisibilitycodes.com/action-plan"* (16 Sep 06:38) | Functionally equivalent, but he named a URL on his own domain. Ties into A2. |
| C2 | Playfair Display headings, Montserrat body, Inter in `layout.tsx` | *"Use Cormorant Garamond font for the headline/questions etc… Montserrat font for the other text"* (13 Sep 11:55) | His later brand card says Playfair. The card was followed; he never re-confirmed. Inter is still loaded globally and is on neither list. |
| C3 | Lead captured **twice** — pop-up before the quiz, unlock modal after Q28 | Both exist in his assets | Matches the brief, but doubles the friction and the first capture is the one that does not sync (A1). |
| C4 | Two parallel implementations in the repo: `src/` (Next.js, deployed) and `static-site/` (plain HTML) | — | Which one ships? They will drift. |

---

## D. Still blocked on the client

0. **Was the purchase path ever in scope?** Raised 18 Sep — the $35 check-out, thank-you
   pages and waitlist were built by a team member, and it is not clear the client asked
   for them. Nothing in the **Upwork thread** commissions a check-out. But his own Drive
   drop (linked 16 Sep 04:00, *"You can download all the images and elements from this
   section"*) contains the whole thing:

   ```
   6. QUIZ /6. CHECK OUT PAGE/VISIBILITY ACTION PLAN - CHECK OUT PAGE COPY.docx
   6. QUIZ /6. CHECK OUT PAGE/TERMS OF PURCHASE.docx
   6. QUIZ /7. THANK YOU PAGES/PURCHASE CONFIRMATION - WITH WAITLIST.png
   6. QUIZ /7. THANK YOU PAGES/NEW - PURCHASE CONFIRMATION - DID NOT SELECT TO BE ADDED TO WAITLIST.png
   6. QUIZ /7. THANK YOU PAGES/DID NOT PURCHASE ANYTHING .png
   8. SALES PAGE/{DIRECTION,RECOGNITION,CONNECTION,CONSISTENCY,OPPOERTUNITY}.png
   6. QUIZ /5. VISIBILITY ACTION PLANS/VISIBILITY ACTION STEP PDFs/
   ```

   The copy doc opens *"CHECK OUT PAGE COPY - $35 USD (USED WHEN THEY CLICK BUTTON ON
   RESULTS PAGE)"*, and on 16 Sep 06:38 he gave that button a destination:
   `https://thevisibilitycodes.com/action-plan`. So the assets commission it even though
   the messages never do.

   **Decision pending with the client. No code changed.** If he confirms it is in scope,
   A5 (payment) and A6 (unprotected PDFs) become launch blockers. If he says it is out of
   scope, the cheapest safe move is to drop the results-page CTA and leave the rest in the
   repo rather than delete it.

1. **Visibility Gap Rating bands** — `HOW TO WORK OUT % SCORES.docx` §8 says *"Do not guess
   this logic."* The row is removed from the results page pending his definition.
2. **Legal pages** are dated 2019, written for katrinakavvalos.com, and mention neither the
   quiz nor the phone number the pop-up collects. `TERMS OF PURCHASE.docx` exists but the
   $35 sale has no published terms.
3. **Deployment domain** — the build assumes `https://thevisibilitycodes.com` for canonical
   tags and share cards. He wants the domain to live in GHL (A2), which changes the answer.
4. **Gallery image `gallery-a3`** — no high-resolution original anywhere in the asset drop.

---

## E. Funnel walk-through — 18 Sep, `localhost:3000` at 1440px and 375px

**The order of steps is correct.** Landing → opt-in pop-up (name/email/phone) →
`/quiz-cover` → `/quiz` Q1–Q28 → unlock modal (first name/email, prefilled from the
pop-up) → `/results?r=…&c=…`. Walked end to end, console clean.

Two independent confirmations that the cover page belongs between the pop-up and the
questions: the client's Loom narration (*"I've made a new survey cover page"*, and the
pop-up submit going to it), and the **empty** `HERO PAGE OPT IN BOX & EXIT INTENT POP
UP/THANK YOU PAGE/` folder in his asset drop — there is no interstitial he is expecting
instead.

### Flow defects

| # | Defect | Evidence |
|---|---|---|
| E1 | **`/quiz` is not gated.** `/quiz-cover` redirects to `/` with no lead in storage; `/quiz` does not. Typing it skips the pop-up *and* the cover page. | Cleared storage, `/quiz-cover` → `/`, `/quiz` → "Which best describes what you do?" |
| E2 | **Opening the pop-up scrolls the page down 152px and does not restore it on close.** `firstField.current?.focus()` scrolls the Name field into view; the lock sets `overflow:hidden` on `body` while `html` is the scroll container. | `scrollY` 0 → 152 on open, still 152 after Escape; `htmlOverflow: "visible"` |
| E3 | **Strongest area and primary gap can be the same pillar.** A tied profile renders "Strongest Visibility Area: DIRECTION" under "Primary Visibility Blocker: DIRECTION GAP" in one card. | All-A run, score 0/100 |
| E4 | The Q28 modal has a `×` close; `POP UP AFTER Q28.png` has none. Not a leak — closing returns to Q28. | Clicked `×`, landed back on Q28 with Back/Next |

### Design mismatches

| # | Built | Client's design |
|---|---|---|
| E5 | **Body text is Inter everywhere except the landing page.** `globals.css:43` → `--font-sans: var(--font-inter)`; Montserrat is opted into only in `page.tsx`. Cover copy Inter 14.5px, quiz answers Inter 16px. | Montserrat. Inter is on neither brand card, and he asked for Montserrat body text on 13 Sep 11:55. |
| E6 | **Cover page runs ~30–40% under the designed type scale.** 860px container, headline **34px**, body **14.5px**. | `QUIZ COVER PAGE.png`, 960px canvas: headline ≈50px, body ≈22–23px. Near-identical column width, far bigger type. |
| E7 | ~~**START ASSESSMENT overflows its button at 375px.**~~ **Fixed 18 Sep** — was `width:86%` with no horizontal padding (261px label in a 255px box). Now `width:100%` + `padding-inline:10px`; overflow 0 at 375 and 393. Only ever bit at ≤375px (SE/mini). | — |
| E8 | ~~**Mobile hero cropped to `941/700`**, cutting Katrina off at the chest.~~ **Fixed 18 Sep** — see below. | `2. MOBILE VIEW/1._` |

### E8 — mobile hero, resolved

The client's mobile master is `1. OPTIN PAGE/2. MOBILE VIEW/1._`, a 941×1672 **whole-screen**
mockup: artwork on top, then the card, button and journey pill, which we render in HTML. Scanning
that file for its card border puts the cut at **y=828**, so the artwork alone is **941×828
(ratio 1.136)**.

The old `hero-mobile-9c6ec4bd.webp` was the full 941×1672 slide forced into a `941/700` box with
`object-fit: cover`. Now `hero-mobile-a8cd2f4a.webp` is the 941×828 crop taken straight from the
client's master, and `.heroArt` carries its own ratio, so nothing is cropped at all.

Measured at 393×852: art 0–311, card 299–623, button 538–604 (overflow 0), journey pill 635–669 —
the whole first screen above the fold, matching the master.

**The Drive folder `1QCvHI1…` ("1A - FINAL") did not contain a mobile hero.** It holds
`FINAL FINAL FINAL .jpg` (1920×1077 — the **desktop** banner, 1127KB original vs the 145KB
flattened-PDF crop we ship), three `BORDER` graphics and a divider bar. Swapping the desktop
original in is an easy quality win, still to do.

Still open from the static-site audit §3b: the cover page's eyebrow, fact pills and CTA
are Playfair; `COVER PAGE FONT CARD.png` calls for Montserrat on all three.

---

## Suggested order

1. A1 (opt-in → GHL + tag) — smallest, and it is the thing he asked about most recently.
2. B — get the 18.9 layout PDF and the two Drive folders, diff against the page, then
   decide whether a section is missing.
3. A2 (embed codes) — it is the shape of the whole delivery, and he has repeated it three
   times.
4. A5/A6 before any launch that takes money — **but settle D0 first**, since they only
   matter if the purchase path is in scope at all.
