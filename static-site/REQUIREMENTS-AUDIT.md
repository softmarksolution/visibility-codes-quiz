# Client brief vs. what is built

Audit of `1. OPTIN PAGE/` (the client's full asset drop) against the static site
in this folder. Sources are named so every point can be checked.

---

## 1. Fixed in this pass

| # | Finding | Source | Action taken |
|---|---|---|---|
| 1 | **Wrong fonts.** Body was Jost, caps headings were Cinzel. | `5. BRANDING CARDS/1. MAIN BRANDING.png` — "Use only **TWO** font families across the brand: **Playfair Display** for headings, **Montserrat** for everything else" | Swapped to Playfair Display + Montserrat sitewide; Google Fonts link updated. |
| 1b | **Weights and tracking** did not follow the per-element spec. | `6. QUIZ/1. QUIZ COVER PAGE - PAGE 1/COVER PAGE FONT CARD.png` | Small labels/taglines -> Montserrat **Medium 500**, uppercase, **0.2em**; body -> **Regular 400** (was Light 300 in 10 places); short CTAs -> **0.3em** tracking; cover heading tracking -> **normal**. |
| 2 | **Wrong colours.** Black `#000000`, gold `#C9962E`, cream `#F6F3EE`. | `5. BRANDING CARDS/HERO BANNER COLOURS & FONTS.png` — deep black `#0B0B0B`, gold `#D4AF37`, glow `#8A6A2D`, cream `#F6F4EE` | Palette replaced. Buttons now gold-gradient in `#D4AF37` tones, `#0B0B0B` text, 10px radius, per the "Button Style" panel. |
| 3 | **Visibility Gap Rating was invented.** I had guessed the bands. | `6. QUIZ/2. QUIZ QUESTIONS/HOW TO WORK OUT % SCORES.docx` §8 — "the rating bands have not been defined yet. **Do not guess this logic.** Leave it until the rating bands are confirmed." | Row removed from the results page and the band table deleted. Both files carry a note showing exactly what to restore once the client confirms. |
| 4 | Hero was missing the **Overlooked → Recognised → Chosen** progression pill. | Hero mock in `HERO BANNER COLOURS & FONTS.png` | Added; overlays the hero on desktop, stacks under the card on mobile. |

## 2. Confirmed correct

- **28 questions**, wording, options, tags and per-answer scores — match `FINAL QUESTIONS TABLE PILLARS TAGS SCORES.docx` exactly.
- **Pillar maxima** Direction 15 / Recognition 15 / Connection 12 / Consistency 6 / Opportunity 9, and "do not score Q1–4, Q19, Q25–28".
- **Score method**: each pillar as a percentage, then the five percentages averaged — not a raw total.
- **Score bands**: 0–24 Hidden Potential · 25–49 Emerging Visibility · 50–74 Building Recognition · 75–89 Recognised · 90–100 Chosen Expert.
- **Results page** layout, copy and the strongest/gap logic match `6. QUIZ/4. RESULTS PAGE/NEW RESULTS PAGE.png`.
- **Who this is for** and **Meet Katrina** copy match their `.docx` sources.

## 3. Funnel coverage

Every page the brief actually designs is now built. One designed piece is held
back on purpose — see §4.1.

| Stage | Asset in the brief | Status |
|---|---|---|
| Opt-in page (hero, press, score, gaps, Katrina, gallery, CTA) | `1. MAIN WEBSITE SECTIONS/` | **Built** |
| Start-assessment pop-up (name, email, phone) | `1./HERO PAGE OPT IN BOX…/2. CLICK ON START ASSESSMENT` | **Built** |
| Exit-intent pop-up | same folder — "EXIT INTENT POP UP" | **Built** — reuses the opt-in modal, as the asset name implies |
| Quiz cover page (page 1, intro copy + START QUIZ) | `6. QUIZ/1. QUIZ COVER PAGE - PAGE 1/` | **Built** |
| Quiz Q1–Q28 | `6. QUIZ/2. QUIZ QUESTIONS/` | **Built** |
| Pop-up after Q28 (score teaser + first name/email → "Unlock my full report") | `6. QUIZ/3. POP UP BOX/POP UP AFTER Q28.png` | **Held** — blocked on §4.1 |
| Results page | `6. QUIZ/4. RESULTS PAGE/` | **Built** |
| Check-out page ($35 Visibility Action Plan + free masterclass waitlist) | `6. QUIZ/6. CHECK OUT PAGE/` | **Built** — payment hook not wired |
| Thank-you pages (3 variants) | `6. QUIZ/7. THANK YOU PAGES/` | **Built** |
| Sales page | — | **No such page exists in the brief.** `8. SALES PAGE/` holds only the ten Action Plan PDFs (the product) and the five checkout images, both already used. Nothing to build unless the client supplies a design. |
| Email sequence | `6. EMAIL SEQUENCE/EMAIL SEQUENCE.docx` | Not a web deliverable |

## 3b. Deliberate departures from the brand cards

The quiz cover page was restyled to match an approved screenshot rather than the
font cards: serif (Playfair) tagline, fact pills and CTA label, and a flat tan
`#C7A87E` button in place of the gold gradient. `COVER PAGE FONT CARD.png` calls
for Montserrat on all three, and the brand card calls for a gold-gradient button.
The overrides are scoped to `body.cover`, so the rest of the site is unaffected.
Worth confirming the client wants the cover page to differ from their own cards.

## 3c. Waitlist confirmation page

`6. QUIZ/5. VISIBILITY ACTION PLANS/BUTTON AT BOTTOM OF PDF ... .png` is not a
button — it is a **fully designed page**, "You're on the waitlist", and it is
what the empty `7. THANK YOU PAGE - ADDED ONTO WAITLIST/` folder was for. Built
as `waitlist.html`. It is the destination for both the **Join the priority
waitlist free** buttons on the thank-you pages and the **JOIN PRIORITY
WAITLIST** button inside the not-on-waitlist Action Plan PDFs.

## 4. Decisions the client needs to make

**4.1** **Where the lead is captured.** The brief captures it **twice** — name/email/phone before the quiz, then first name/email again after Q28 to unlock the report. This site asks once, up front. The Next.js app on Railway does the opposite: no opt-in before, unlock modal after. One of the three needs to win.
2. **Visibility Gap Rating bands** — blocked until defined (§1.3).
3. ~~"29 QUESTIONS" vs 28~~ — **settled.** `QUIZ COVER PAGE.png` renders "28 QUESTIONS"; the `.docx` saying 29 is a typo. The page uses 28.
4. **Legal pages predate this funnel.** Both are dated 2019 and written for katrinakavvalos.com; neither mentions the quiz, the score, or the **phone number** the opt-in pop-up collects. The $35 check-out also has its own `TERMS OF PURCHASE.docx`, not yet published.
5. **The live domain is assumed.** Favicon/Open Graph work needed absolute URLs, so it uses
   `https://thevisibilitycodes.com` — the address printed in the client's own footer artwork and
   already linked from every page. Nothing in the brief states the deployment domain. Confirm it, or
   the share card and canonical tags point at the wrong host.
6. **Two images need the client.** `gallery-a3` (red carpet, patterned jacket) has **no** high-resolution
   copy anywhere in the folder and is now the only soft image in its row — request the original. And
   `who-photo` has a ~2x version (`4. /1. _FINAL.png`) that re-frames the group; confirm whether the
   sharper-but-reframed version is preferred over the `FINAL.pdf` framing currently shipped.
7. **The Action Plan PDFs sit at guessable public paths.** `plans/<edition>-<on|not-on>-waitlist.pdf`
   is exactly what the thank-you page builds, so anyone can download a paid $35 product by typing the
   URL, and a buyer's link works for anyone they forward it to. Needs signed expiring URLs or email
   delivery before launch.
8. **GoHighLevel.** `HOW TO WORK OUT % SCORES.docx` §4–6 specifies GHL quiz categories, five `*_percent` CRM fields and a workflow that averages them. This site computes the score in the browser; nothing is posted to GHL yet.

## 5. Assets rebuilt from `1A - FINAL` and `2. MOBILE VIEW`

`FINAL.pdf` turned out to be the whole opt-in page at **1920 x 8266** — 1.6x the
resolution of the PDF the site was first built from. Everything photographic has
been re-cut from it, and the hero was rebuilt entirely:

- **The final hero is mirrored.** `FINAL.pdf` and `FINAL BANNER 2` put the
  artwork on the **left** and the opt-in card on the **right**; the earlier
  design had them the other way round. The site now matches FINAL.
- **`FINAL BANNER 5` has an empty card frame**, so it is used as the hero image
  and the card copy sits inside that frame as live HTML — no baked-in text.
  Frame position in the source: x 1227–1834, y 138–929 of 1920 x 1077, expressed
  as percentages so it holds at every width. Card text is sized in `cqw` units
  against the card itself, so it stays put in the frame as the page scales.
- **Mobile uses `2. MOBILE VIEW/1B.png`** — the same artwork with no card at all
  — cropped to the band the mobile mock-up shows, with the card overlapping
  beneath it and the progression pill under that, per `1._`.
- Press strip, why/who/Katrina photos all re-cut from `FINAL.pdf`.

**The gallery was deliberately left on the older crops.** `FINAL.pdf`'s gallery
is four photos on a cream background with large empty areas — it reads as still
in progress, whereas the earlier design's 3 + 4 gold-bordered tiles on black are
finished. Worth confirming which the client intends.

**Button weight conflict:** `COVER PAGE FONT CARD.png` says the button is
Montserrat **Medium**; `1. MAIN BRANDING.png` and `HERO BANNER COLOURS & FONTS.png`
both say **SemiBold**. Two of three say SemiBold and it is the global rule, so
buttons are 600. Change `.btn{font-weight}` if the client wants Medium.

**Button label conflict:** `FINAL.pdf` and `FINAL BANNER 2` say **START QUIZ**;
`2. MOBILE VIEW/1._` says **START ASSESSMENT**; `3. GRAPHICS/BUTTONS/` contains
artwork for both. The site uses "Start Quiz" from the FINAL desktop banner.

Still unused: `3. GRAPHICS/BUTTONS/` and `IMAGES/` hold the client's own button
and icon artwork; the site uses CSS gradients and inline SVG equivalents, which
stay sharp at any size.
