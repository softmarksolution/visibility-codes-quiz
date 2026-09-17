# The Visibility Codes — landing page, assessment and results

A standalone, static site: landing page → lead-capture modal → 28-question
assessment → personalised results report. No build step, no dependencies.

```bash
cd ~/Desktop/visibility-codes-site && python3 -m http.server 4173
```

## Files

```
index.html            landing page + lead-capture modal
quiz-cover.html       quiz page 1 — intro + START QUIZ
quiz.html             assessment shell     quiz.js      question runner
results.html          report shell         results.js   report renderer
checkout.html         $35 Action Plan      checkout.js  edition, order, payment
thank-you.html        post-purchase        thank-you.js three states
waitlist.html         "You're on the waitlist" confirmation
privacy-policy.html   \
terms-of-use.html      > static legal pages, no JS needed
terms-of-purchase.html/
quiz-data.js   the 28 questions, scoring rules and results copy (shared)
styles.css     landing page + modal      pages.css     quiz, results, legal
assets/        13 images (652 KB total)
```

## The flow

1. Any of the four CTAs on the landing page opens the **lead modal** instead of
   navigating. Name, email and phone are validated inline.
2. On submit the lead is written to `localStorage` and the visitor goes to
   `quiz-cover.html` — page 1 of the quiz, with the client's intro copy and a
   START QUIZ button. Opening the cover or the quiz without a lead bounces back
   to the landing page.
3. **28 questions**, one per screen. Single-choice auto-advances; multi-select and
   the closing free-text question have a Continue button. Answers are saved as you
   go, and Back re-shows your answer.
4. On the last question the score is computed and the visitor lands on
   `results.html#r=<token>` — the token holds the first name and the 19 scored
   answers, so **Copy my report link** produces a URL that reproduces the exact
   report on any device. Free-text answers are never put in the URL.

### Quiz cover page

**This page deliberately departs from the brand cards**, at the client's request
and matching an approved screenshot:

| | Cover page | Rest of site (per brand cards) |
|---|---|---|
| Tagline + fact pills | Playfair Display, serif caps | Montserrat Medium 500 |
| CTA label | Playfair Display | Montserrat SemiBold 600 |
| CTA background | client button gradient | client button gradient |
| Header banner | full height, never cropped | full height |
| Body copy | 14.5px | 16px |

Everything else — colours, the header banner itself — still follows the cards.
The overrides are scoped to `body.cover` / `.cv__*`, so no other page is
affected; delete that block to revert to the card spec.

**The banner is never cropped on this page.** Getting the CTA above the fold is
done purely with type: 34px heading (constrained to 620px so it keeps its
three-line break), 13px tagline and pills, 14.5px body, 18px button. Two
height-based tiers shrink the type further on shorter screens — the banner is
left alone at every size.

### Checkout

`results` → **Unlock my personalised action plan** → `checkout.html#r=<token>`.
The token carries the buyer's scored answers, so the checkout recomputes their
**primary visibility gap** and shows the matching edition — one of the five
Action Plan covers from `8. SALES PAGE/IMAGES ON CHECK OUT PAGE/`. A Direction
gap gets the Direction Edition, an Opportunity gap the Opportunity Edition, and
so on; the page title, heading and artwork all follow.

Copy is verbatim from `VISIBILITY ACTION PLAN - CHECK OUT PAGE COPY.docx`:
$35 USD, seven inclusions, the closing line, and the Masterclass Priority
Waitlist as a free add-on placed bottom-right under the category, as the doc
specifies. `TERMS OF PURCHASE.docx` is published at `terms-of-purchase.html`
and linked from the pay button.

Opened without a usable report the page says so and points back to the
assessment, rather than guessing an edition.

### Exit intent

The brief pairs exit intent with the *same* opt-in pop-up — the asset is named
"HERO PAGE OPT IN POP UP / EXIT INTENT POP UP - EXAMPLE" — so it reuses the
lead modal rather than adding a second one. It is deliberately restrained:

- armed only after 5 seconds on the page;
- shown at most **once per visitor** (`vc_exit_shown` in `localStorage`);
- **never** shown to anyone who has already given their details;
- desktop pointer-leaves-the-top, plus a fast flick-to-top for trackpads.

All four guards are covered by tests in the browser.

### Payment

**Complete my purchase** opens a payment panel with the order summary, the
buyer's name and email pre-filled from their lead, and a card field.

**No card inputs exist on this site.** `#payCard` is an empty mount point that
the processor renders its own iframe into, so card numbers never touch this
page or its DOM — which keeps the site out of PCI scope. Writing our own card
`<input>` would have been the wrong thing to do.

Two lines make it live, both at the top of `checkout.js` under `PAYMENT`:

```js
var STRIPE_KEY = '';                          // pk_live_… or pk_test_…
var INTENT_URL = '/api/create-payment-intent'; // returns { clientSecret }
```

Set the key and Stripe.js loads on demand, mounts a Card Element, and the
button enables itself. The submit handler POSTs the order to `INTENT_URL`,
confirms the payment, and on success redirects to the thank-you page. Using
GoHighLevel's order form instead? Ignore both and point the `openPay` handler
at the order-form URL.

Until a key is set the button stays disabled with a visible "not connected"
notice, and submitting logs the assembled order to the console — so the flow is
testable without charging anything.

### Walking the site end to end

Just open the site and go. No query strings, no test page:

    index.html -> Start Quiz -> opt-in pop-up -> quiz cover -> 28 questions
      -> results -> Access my action plan -> checkout -> Complete my purchase
      -> demo card -> thank-you -> download the Action Plan PDF

Verified as one automated run: all 13 steps, finishing on a real
`plans/direction-on-waitlist.pdf` at HTTP 200.

### Demo payment, and swapping in the real one

The payment box has exactly two modes and you never toggle them by hand:

| `STRIPE_KEY` | what the buyer sees |
|---|---|
| empty (now) | **demo card** — four fixed test numbers, banner reading "Demo payment — no card is charged" |
| set | **Stripe** — the processor's own iframe, demo card gone |

| Demo number | Result |
|---|---|
| `4242 4242 4242 4242` | approved → thank-you page |
| `4000 0000 0000 0002` | declined |
| `4000 0000 0000 9995` | insufficient funds |
| `4000 0000 0000 0069` | expired card |

Four buttons fill these in; expiry and CVC are not validated. **Any other number
is refused**, so a real card cannot be taken even by accident. Nothing is stored
or transmitted, `autocomplete` is off, the fields carry a dashed amber border,
and the "card details go straight to the payment provider" line is replaced with
an accurate one while the demo is active.

**To go live:** put your publishable key in `STRIPE_KEY` and point `INTENT_URL`
at an endpoint returning a `clientSecret`. That is the entire switch-over — the
demo disappears on its own because `demoMode = ALLOW_DEMO && !STRIPE_KEY`, so a
site with a real key can never serve it. `ALLOW_DEMO = false` kills the demo even
without a key.

This is the only place card-shaped inputs exist on the site; in live mode card
data never touches the page.

Gotcha worth knowing: `.pay__form .field input{width:100%}` outranks a bare
`.dcard__sm`, which collapsed the card-number field to 30px. The demo-card rules
are scoped `.pay__form .field .dcard input` for that reason.

### The Action Plan PDFs

`plans/` holds the client's ten deliverables, named
`<edition>-<on|not-on>-waitlist.pdf`, which is what `thank-you.js` builds. They
are the real files from `8. SALES PAGE/`, ~146 MB in total.

> **These are publicly guessable.** Anyone who types
> `/plans/direction-on-waitlist.pdf` downloads a $35 product without paying, and
> nothing stops a buyer sharing the link. Before launch they need to move behind
> signed, expiring URLs or emailed delivery. Flagged in the audit.

### Checkout without a result

The Action Plan is personalised to the buyer's gap, so there is nothing to sell
without one. Opening `checkout.html` with no result does **not** offer a
purchase: the price, add-on and total are hidden, the cover is dimmed and
captioned "Personalised to your result" rather than naming an edition, and the
button becomes **Take the 3-minute assessment**. The payment panel cannot open
in this state.

### Thank-you page

`thank-you.html` renders all three states from the brief, chosen by query
string:

| URL | State |
|---|---|
| `?paid=1&waitlist=1&edition=direction` | bought + joined the waitlist |
| `?paid=1&waitlist=0&edition=direction` | bought, no waitlist |
| `?paid=0` | did not buy — results only |

**The Action Plan PDFs are not bundled.** The ten files in `8. SALES PAGE/` are
10–22MB each. `thank-you.js` → `planUrl()` builds
`plans/<edition>-<on|not-on>-waitlist.pdf`; host them there, or return whatever
gated URL the delivery email uses.

### Returning to the quiz

There are only two outcomes, which makes this easy to reason about:

| State when `quiz.html` opens | What happens |
|---|---|
| No lead captured | Bounces to the landing page so the modal can run |
| All 28 answered | Goes straight to the report — never a question |
| **Anything else** | A clean run from **Question 1** |

"Anything else" includes a part-finished answer set, and those stored answers are
**discarded rather than resumed**. The quiz deliberately has no resume: resuming
was what dropped people into the middle of a retake (question 6, say), and it
also risked scoring a new run against leftover answers from the previous one.
The trade-off is that refreshing mid-run restarts you at question 1.

`quiz.html?restart=1` is the same clean start, but it also works when the set is
already complete — that's what **Retake the quiz** on the results page uses, and
it keeps the lead so the modal isn't shown a second time.

### Double-click protection

Single-choice answers auto-advance after 260ms. Without a guard the second half
of a double-click landed on the *next* question's button in the same screen
position and advanced again, silently skipping a question — and because the
skipped one was usually scored, finishing then bounced you back to it (the
"redirect to question 6/7" bug). Two things prevent it now:

- only one advance is ever in flight, so re-clicking within 260ms just changes
  the answer and restarts the countdown;
- every control ignores input for 300ms after a question change, which covers
  the rest of the double-click window.

Total settle time is ~560ms, well under how long anyone takes to read a new
question. Verified by running all 28 with a deliberate double-click on every
single question: 28/28 answered, no gaps, straight through to the report.

## Where the numbers come from

Questions, pillars and per-answer scores are transcribed from the client's
*FINAL QUESTIONS TABLE PILLARS TAGS SCORES*; the maths follows *HOW TO WORK OUT
% SCORES* — score each pillar as a percentage of its maximum, then average the
five percentages.

| Pillar | Questions | Max |
|---|---|---|
| Direction | 5–9 | 15 |
| Recognition | 10–14 | 15 |
| Connection | 15–18 | 12 |
| Consistency | 20, 21 | 6 |
| Opportunity | 22–24 | 9 |

Levels: 90+ Chosen Expert · 75+ Recognised · 50+ Building Recognition ·
25+ Emerging Visibility · under 25 Hidden Potential.

**One assumption to confirm.** The client had not defined the *Visibility Gap
Rating* bands (the old repo hides that row for exactly this reason), but the
approved mock-up shows it. Bands are set in `quiz-data.js` → `GAP_RATINGS` as
75+ Critical · 50+ Significant · 25+ Moderate · 10+ Minor · under 10 Minimal,
which makes a 52% gap read "Significant" as the mock-up does. Change that one
array if the real bands differ.

## How the landing page layout works

The source design is a single 595.5 × 2636 pt artwork, so the CSS keeps the
design's own unit:

```css
:root{ --s: calc(min(100vw, 1440px) / 595.5); }   /* 1 design point -> px */
```

Every desktop measurement is `calc(<design points> * var(--s))`, making the page
a true scale model of the artwork. Rendered height at 1440px: **6326px** vs the
design's **6375px**. Below 1180px the layout stacks and `--s` becomes a fluid
type unit instead. The quiz and results pages use ordinary px sizing.

## Links that still need a destination

Everything internal resolves. One external destination is a stand-in:

- **Access my action plan** → `plans/<edition>-<on|not-on>-waitlist.pdf`,
  which does not exist yet. See "Delivering the Action Plan" below.

The four landing-page CTAs point at `quiz-cover.html` rather than a bare
`/quiz`: the modal intercepts a normal click and takes the visitor's details
first, but a middle-click, a new tab or a visitor with JavaScript off now lands
on a real page instead of a 404.

## Delivering the Action Plan

**Access my action plan** on the thank-you page builds
`plans/<edition>-<on|not-on>-waitlist.pdf` from the buyer's gap and waitlist
choice. Those ten files are in `8. SALES PAGE/` and are **not bundled** — they
are 10–22MB each, over 140MB together.

**Do not simply drop them in `plans/`.** The path is guessable, so anyone could
download a $35 product without paying. Deliver them the way the design already
implies — by email, or behind a signed/expiring URL — and return that URL from
`planUrl()` in `thank-you.js`.

The two variants are not cosmetic: the **on-waitlist** PDF ends with "You're on
the Priority Waitlist" and no button, while the **not-on-waitlist** PDF ends
with a **JOIN PRIORITY WAITLIST** button. That button should point at
`waitlist.html`.

## Legal pages

`privacy-policy.html` and `terms-of-use.html` are **generated from the client's
own text**, not written here — the copy was transcribed from katrinakavvalos.com
and already lived in the Next.js repo at `src/content/legal.ts`. The Privacy
Policy is 13 sections (last updated 13 August 2019); the Terms of Use are 17
sections (last revised 28 August 2019).

Both are plain static HTML with the text inline, so they render without
JavaScript — which matters for documents people may need to read or print. If
the client revises either document, update `src/content/legal.ts` in the Next.js
repo and regenerate, so the two sites can't drift apart.

**Worth checking before launch:** both documents are dated 2019 and are written
in the first person for katrinakavvalos.com. They predate this assessment, so
they don't mention the quiz, the Visibility Score, or the phone number the
lead-capture modal now collects. That's a question for the client's lawyer, not
something to fix in markup.

## Header banner and brand lockup

The masthead on the quiz, cover, results and legal pages is the **client's own
header banner**, `header-banner-hd.jpeg` (3402 x 578), copied in byte-for-byte —
no re-encode, nothing cropped. At a 1440px layout that is 2.4x oversampled, so
it stays sharp on 2x displays. Its glow, rays and base bar are part of the
artwork, so the masthead adds no decoration of its own.

Below 760px the full 5.89:1 banner would shrink the wordmark to almost nothing,
so the image switches to a taller centre crop (`object-fit: cover`, 104px then
88px) — the sides are only rays and black, so nothing meaningful is lost.

The **footer** wordmark is still live type, not a bitmap: Playfair Display with
a gold gradient, a translucent V watermark, a radial glow and a faint ray burst,
scaled by one custom property:

```css
.foot__logo .lockup { --lk: calc(17*var(--s)) }   /* wordmark cap height */
```

The glow and rays are wider than the lockup itself, so `.foot` sets
`overflow: hidden` — without it they push the page sideways on a phone.
`3. GRAPHICS/BANNERS/FOOTER.png` is the client's matching footer banner if you
would rather use artwork there too; it does not suit the current three-column
footer, which is why the live lockup stayed.

## Assets

Everything photographic is now cut from the **highest-resolution original the
client folder contains**, not from the flattened design PDF.

| asset | was | now | source |
|---|---|---|---|
| `hero-banner.jpg` | 1920x1077, 179 KB | 1920x1077, 513 KB | lossless PNG inside `FINAL BANNER 5.pdf` |
| `hero-banner-mobile.jpg` | 941x1672, 271 KB | 941x1672, 405 KB | `2. MOBILE VIEW/1B.png` |
| `plan-*.jpg` (5) | 620x930 | **1024x1536** | `8. SALES PAGE/IMAGES ON CHECK OUT PAGE/*.png` |
| `gallery-a1,a2` | 372x316 | **744x632** | `1. MAIN WEBSITE SECTIONS/7/3_.png`, `6_.png` |
| `gallery-b1..b4` | ~277x296 | **556x592** | `7/1_.png`, `5_.png`, `7_.png`, `4_.png` |
| `why-photo.jpg` | 566x1084 (wrong aspect) | **638x1136** | lossless PNG inside `FINAL.pdf` |
| `katrina-photo.jpg` | 961x1094 (wrong aspect) | **942x1096** | lossless PNG inside `FINAL.pdf` |
| `who-photo.jpg` | 925x968, stray bullets | **850x896** | lossless PNG inside `FINAL.pdf` |

**Resolution is capped at 1920 by the source, not by the cut.** Both
`FINAL.pdf` and `FINAL BANNER 5.pdf` embed a 1920-wide raster (1920x8266 and
1920x1077); the large file sizes are a lossless PNG sitting beside the JPEG, not
extra pixels. So the hero cannot go past 1920 and will still be ~1.33x on a
1440px layout. What did improve is **generation loss**: the hero is now cut from
the lossless PNG and encoded once at q94 with 4:4:4 chroma, which is what the
gold gradients and serif edges were losing to double JPEG compression.

The gallery sources in `7/` were matched to the site crops by normalised
cross-correlation, then the crop rectangle was recovered the same way
(corr 0.99+ on all six) so the framing is **unchanged** — only the pixel count
moved. `.gallery img` is `object-fit:cover` inside a fixed `aspect-ratio`, so
intrinsic size cannot shift the layout.

### The WHY photo — why the aspect ratio matters

`.why__photo` is a fixed box: `width:calc(202*var(--s) + ...)` by the section's
own height, which renders **488x869 (aspect 0.562)** at a 1440px viewport. The
background is `right center / cover`.

The original asset was 566x1084 — **aspect 0.522, narrower than the box.**
`cover` therefore scaled it to match the box *width* (488/566 = 0.862), making it
935px tall against an 869px box, and centred the overflow. That silently clipped
33px off the top: **Katrina's head.** Nothing in the CSS was wrong; the asset
simply had the wrong shape.

The fix is to cut the asset at the box's aspect so `cover` is an exact fit and
crops nothing. The cream band of the WHY section in the `FINAL.pdf` master was
measured by scanning for the cream-to-black transition — rows **2128-3264**
(352 design units, not the 339 the old CSS comment claimed) — and the photo
taken from the right edge at `1136 x 0.562 = 638px` wide.

That cut also restores the handwritten gold script **"Visibility Creates
Opportunity"**, which is part of the approved design and appears in the client's
own reference. The clean plate at `3A/1. FINAL BANNER TEMPLATE 1.png` does not
carry it, so it is *not* the right source for this section despite being a
larger file.

**If the copy in this section is ever re-worded**, the body text may wrap to a
different number of lines, changing the section height and therefore the box
aspect. Re-cut `why-photo.jpg` at the new aspect, or `cover` will start clipping
again. Measure with:

    document.querySelector('.why__photo').getBoundingClientRect()

### The MEET KATRINA section

Three defects, all found by measuring the client's `2./6/MEET KATRINA.png`
(1672x941) rather than eyeballing it:

1. **The copy was being clipped.** `.meet` is a fixed `height:calc(347*var(--s))`
   (839px) with `overflow:hidden`. The text block rendered 848px, so the last
   line of the final paragraph was cut off. The cause was type size, not a short
   section: the reference's body line pitch is **11.40 design units**, i.e.
   **8.14 at line-height 1.4**, where the site was using 10 — 23% too large.
   Paragraphs sit ~23.5 units apart, so `margin-bottom` is 12 units, not 5.
   The block now fills 76.2% of the section against the reference's 76.4%, with
   14.5% clearance above (reference 14.5%) and 9.3% below (reference 9.1%).

2. **The heading is SMALL CAPS, not upper case.** The shared `.h-caps` rule
   applies `text-transform:uppercase`, which flattens "Meet Katrina" into
   uniform capitals. The client sets full-height M and K over small-cap
   "eet"/"atrina". Measured off the reference: cap height 17.8 units
   (font-size ~25.4 at Playfair's ~.70 cap ratio) and a total ink width of
   **183.8 units**, which `letter-spacing:.125em` reproduces to within 0.2.

3. **Same aspect bug as the WHY photo.** `.meet__photo` renders 721x839
   (aspect 0.859); the asset was 961x1094 (0.878), so `cover` cropped 16px
   horizontally. Re-cut to 942x1096 from the master's MEET band (rows
   **5344-6439**, located by scanning the right-hand column for pure black).

Note the master has **no copy** in this section — `FINAL.pdf` shows the photo
against empty black. The wording only exists in `MEET KATRINA.png` and
`6/MEET KATRINA - COPY.docx`.

### The WHO THIS IS FOR section

The old crop of `who-photo.jpg` ran to master x1105, but the text column's gold
**bullet diamonds start at x1028** — so six of them were baked into the right
edge of the photo and rendered as stray gold marks floating beside it. Re-cut to
master `x 170-1020, y 3264-4160`, which stops short of the bullets and keeps the
whole SYDNEY HOST / KATRINA KAVVALOS / STEVEN BARTLETT | TONY ROBBINS nameplate.

The section's geometry and type were guesses and ran ~30% oversized. All of it
is now measured off the `FINAL.pdf` master (black band rows **3264-4264**):

| | design | built |
|---|---|---|
| section height | 310 units | 309.9 |
| photo left edge | 52.7 units | 52.7 |
| photo width | 263.6 units | 263.6 |
| text column left | 318.8 units | 318.7 |
| text column width | 211.9 units | 212.0 |
| heading ink width | 212.8 units | 212.4 |

Heading is 18.2 units (cap height 12.7 at Playfair's ~.70 ratio) with
`letter-spacing:.21em`; body is **7.27 units at line-height 1.45**, from a
measured line pitch of 10.55 units. The heading needs `white-space:nowrap` on
desktop because its 212.8-unit ink is a hair wider than the 212-unit column and
it otherwise breaks onto two lines — but that is **desktop only**. On a phone the
mobile rule restores `white-space:normal` and `.125em`; with nowrap left in place
the tracked heading pushed the document to 464px against a 390px viewport.

### A font conflict the client needs to settle

`4. WHO IS THIS FOR - BRANDING CARD.png` names **Trajan Pro** as the heading
font. The master `1. MAIN BRANDING.png` ("SIMPLE TYPOGRAPHY BRAND CARD") instead
specifies **Playfair Display** 500-700 for main and section headings, and
**Montserrat** 300-400 for body. The site follows the master card. Trajan Pro is
also a licensed Adobe typeface with no free web equivalent and has no lower case
at all, so adopting it would mean buying a web licence and reworking every
title-case heading. Flagged, not actioned.

### Deliberately not swapped

- **`gallery-a3.jpg` stays 372x316.** No high-resolution copy of that photo
  (red carpet, patterned jacket) exists anywhere in the client folder — the
  closest matches are gold bullet graphics scoring against a dark signature.
  It is now the only soft image in its row. **Ask the client for the original.**
- **`who-photo.jpg` stays 925x968.** `4. /1. _FINAL.png` is the same artwork at
  1939x1868 (a genuine ~2x), but it is a *different rendering*: neither a crop
  (corr 0.85) nor a letterboxed fit (corr 0.80) reproduces the current framing,
  so swapping it would visibly re-frame the group. The current cut comes from
  `FINAL.pdf`, the approved full-page design. **Client's call** — the
  higher-resolution version is available if the reframe is acceptable.
- **`katrina-photo.jpg` is already at the ceiling.** Its best source
  (`6/MEET KATRINA.png`, 1672x941) is *shorter* than the existing 961x1094 cut,
  so swapping it would be a downgrade.
- **The footer lockup stays live HTML.** `8/FOOTER LOGO.png` (2102x748) is the
  client's lockup artwork, but the footer was deliberately rebuilt as text so it
  would stop "looking like a picture". `assets/footer-logo.png` is an unused
  leftover.

Images are referenced without a `?v=` cache-buster, so a browser that already
loaded the old files will keep them until a hard reload.

## To wire up before launch

- **Leads are only stored in the browser.** `script.js` → the `form.submit`
  handler is where to POST to GoHighLevel / your CRM.
- **Answers are only stored in the browser.** `quiz.js` → `finish()` is where to
  send the completed assessment.
- **Payment needs a key and a server endpoint.** See "Payment" below.
- **Confirm the live domain.** Social and canonical tags hard-code
  `https://thevisibilitycodes.com`; see "Favicon and social sharing".
- **Button gold is sampled from the client's own artwork**
  (`3. GRAPHICS/BUTTONS/START QUIZ BUTTON.png`), not invented: a horizontal
  brushed-metal sheen, darker at both ends, highlights near 25% and 68% and a
  dip at 50%, with a faint vertical overlay. It lives in `--btn`, so every gold
  button on the site shares it.

- Typography follows the client's font cards exactly:

  | Element | Font | Weight | Case | Tracking |
  |---|---|---|---|---|
  | Main / section headings | Playfair Display | 500–700 | Title case or caps | normal |
  | Body and supporting text | Montserrat | 400 | Sentence case | normal |
  | Bold phrases in body | Montserrat | 600 | Sentence case | normal |
  | Buttons / CTAs | Montserrat | 600 | UPPERCASE | 0.11em, 0.3em on short labels |
  | Small labels / eyebrows | Montserrat | 500 | UPPERCASE | 0.2em |

  Only those two families are used anywhere. Colours come from the hero brand
  card: deep black `#0B0B0B`, gold `#D4AF37`, glow `#8A6A2D`, cream `#F6F4EE`.
  Both fonts load from Google Fonts, so the page wants a network connection.

## Verified

- No horizontal overflow at 320 / 390 / 768 / 1024 / 1180 / 1280 / 1440 / 1920px
  on all three pages; no console errors.
- All four CTAs open the modal; validation blocks bad input and stores nothing.
- Full 28-question run completes and produces a shareable report link.
- Every re-entry state above behaves as the table describes, checked with
  part-finished sets at Q5 and Q20, a complete set, and `?restart=1`.
- Local CSS/JS are referenced with a `?v=` query so a browser can't serve a
  stale copy after an update — bump it in every HTML file when you deploy.
- Both legal pages render with no horizontal overflow at 320 / 390 / 768 /
  1280px, and every internal link across the five pages resolves.
- A shared report link renders the full report with no local data at all;
  a truncated one shows the "link isn't valid" message rather than breaking.
- Motion respects `prefers-reduced-motion`; landing reveals un-hide themselves
  after 2.5s and work with JavaScript disabled.

## Copy notes

Two fixes against the design artwork: "opportuntties" → "opportunities", and the
third paragraph of the "Why the Visibility Codes work" section — which the
artwork cuts off mid-word behind the photo — is completed as "…the obvious
choice." Results copy marked DRAFT in the client's source (headline and
narrative text for levels other than *Emerging Visibility*) is carried over
as-is and still needs their sign-off.
