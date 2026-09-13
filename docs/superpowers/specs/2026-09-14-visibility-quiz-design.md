# The Visibility Codes Quiz: Design

Date: 2026-09-14
Status: Approved (design approved in chat; spec written from that approval)

## Goal

A branded, custom-coded quiz for The Visibility Codes (Katrina Kavvalos International).
Visitors answer 28 questions, enter first name and email, and get a personalised
results page. Every lead is created or updated in GoHighLevel (GHL) with tags,
pillar percentages and the Visibility Score.

## Sources

- `FINAL QUESTIONS TABLE PILLARS TAGS SCORES.docx`: questions, answers, tags, scores.
- `HOW TO WORK OUT % SCORES.docx`: scoring maths, score bands, results logic.
- `REULST PAGE - AA (2).pdf`: results page design (one tall page).
- Font card, Page/Pop-up brand card, quiz screenshot, logo banner (images in chat).

## Decisions

| Topic | Decision |
|---|---|
| Build | Custom Next.js app + GHL sync by API. Not GHL's native quiz builder. |
| Hosting | Railway (Node, `output: standalone`). Private GitHub repo. |
| Storage | No database. GHL holds contacts. Report link encodes answer letters only. |
| Fonts | Playfair Display (headings, numbers) + Inter (everything else). |
| Logo/icons | Cropped from the results PDF render (`public/brand/`). Small line icons are inline SVG. |
| Copy | Pillar and level copy drafted by developer in one content file, marked DRAFT for client review. |
| Gap Rating | Hidden. Bands not defined; doc says do not guess. |
| Referrals | Share link only (`?ref=code`) plus capture of incoming `ref`. No discount/commission tracking. |

## User flow

1. **Landing `/`** (cream). Logo banner, "Get Your Visibility Score Free", body copy,
   three benefit bullets, secondary copy, gold "Get your free score" CTA.
   Captures `?ref=` into localStorage.
2. **Quiz `/quiz`** (dark card, from screenshot). One question per screen,
   "Question N of 28", gold progress bar, Back / Next. Next disabled until answered.
   Q26 multi-select. Q28 required text (max 500 chars). Progress persisted in localStorage.
3. **Unlock pop-up** (white card on cream, from brand card). "You scored XX/100.",
   level headline, short copy, First name + Email, "Unlock my full report" button,
   small print "Your personalised Visibility Report will be sent straight to your inbox."
   Submits to `/api/submit`, then routes to results.
4. **Results `/results?r=<code>&c=<referralCode>`**, matching the PDF top to bottom:
   header banner; "YOUR PERSONALISED VISIBILITY RESULTS"; "{Name}, here are your results."
   (name from localStorage; "Here are your results." otherwise); score card with score,
   level badge, Visibility Gap %, Primary Visibility Blocker, Strongest Visibility Area;
   What This Means; Visibility Breakdown (5 pillar cards); Where You're Strongest and
   Your Biggest Visibility Gap (dark panels); Quick Action Step + masterclass bonus;
   So What Now (masterclass bio, 5 learn-how items, 3 dates, Google Calendar button,
   Apple/Outlook `.ics` button); Refer a Friend (share link + Copy, Save/Go Free/Earn);
   Copy My Report Link; Retake the quiz; footer.

## Scoring (from the calculation guide)

- Scored questions: Direction Q5-Q9 (max 15), Recognition Q10-Q14 (15),
  Connection Q15-Q18 (12), Consistency Q20-Q21 (6), Opportunity Q22-Q24 (9).
- Pillar % = points / max x 100 (kept unrounded for maths).
- Visibility Score = average of the five pillar %, rounded to nearest whole number.
- Visibility Gap = 100 - Visibility Score.
- Displayed pillar % rounded to nearest whole number.
- Level bands: 0-24 Hidden Potential, 25-49 Emerging Visibility, 50-74 Building
  Recognition, 75-89 Recognised, 90-100 Chosen Expert.
- Strongest area = highest pillar %. Primary gap = lowest pillar %.
  Ties go to the pillar earliest in doc order (Direction, Recognition, Connection,
  Consistency, Opportunity). If all five are equal, strongest and gap are both
  Direction; the page then shows the same pillar in both panels (acceptable edge case).
- Pillar badges: lowest = PRIMARY BLOCKER, highest = STRONGEST AREA, others by %:
  under 50 DEVELOPING, 50-74 BUILDING, 75+ STRONG. (Assumption matching the PDF; confirm with client.)
- Q1-4, Q19, Q25-28 are never scored.

## Report link

`r` = `v1` + one letter per scored question (19 letters, A-G), e.g. `v1ABCD...`.
Invalid or missing code shows a friendly "link not valid" state with a retake button.
No name or email is ever placed in the URL. `c` is the visitor's own public referral code.

## GHL sync (`POST /api/submit`)

Request: `{ firstName, email, answers, ref?, website }` (`website` is a honeypot).

Server:
1. Validate: first name 1-80 chars, valid email, every question answered with a valid
   option, Q28 1-500 chars. Honeypot filled => respond 200 without syncing.
   Simple in-memory rate limit: 10 submissions per IP per 10 minutes.
2. Recompute all results server-side (client scores are never trusted).
3. Referral code = slug(first name) + "-" + first 5 base36 chars of sha256(lowercased email).
   Stable across retakes.
4. If `GHL_PRIVATE_TOKEN` / `GHL_LOCATION_ID` are missing: skip sync, log, return `synced: false`.
5. Load location custom fields (`GET /locations/{id}/customFields`), map `fieldKey` to id
   (cached 10 minutes). Missing fields are logged by name; present ones still sync.
6. `POST /contacts/upsert` (email match) with first name, email, source, custom fields.
7. Remove stale quiz tags from a previous attempt (tags from the known quiz tag list that
   are on the contact but not in this attempt), then `POST /contacts/{id}/tags` with the new tags.
8. Any GHL failure is retried once, then logged. The visitor still gets results
   (`synced: false`).

Response: `{ ok: true, reportCode, referralCode, synced }`.

Concurrency: double-submit or retry upserts the same contact by email with identical
values; tag add/remove is idempotent. No money or auth involved.

### GHL custom fields to create (Contact object)

| Field name | Key | Type |
|---|---|---|
| Direction % | `direction_percent` | Number |
| Recognition % | `recognition_percent` | Number |
| Connection % | `connection_percent` | Number |
| Consistency % | `consistency_percent` | Number |
| Opportunity % | `opportunity_percent` | Number |
| Visibility Score | `visibility_score` | Number |
| Visibility Gap | `visibility_gap` | Number |
| Visibility Level | `visibility_level` | Single line |
| Strongest Visibility Area | `strongest_visibility_area` | Single line |
| Primary Visibility Gap | `primary_visibility_gap` | Single line |
| Visibility Actions Tried (Q26) | `visibility_actions_tried` | Multi line |
| Biggest Visibility Obstacle (Q28) | `biggest_visibility_obstacle` | Multi line |
| Visibility Report URL | `visibility_report_url` | Single line |
| Referral Code | `referral_code` | Single line |
| Referred By | `referred_by` | Single line |

Tags: the answer tags from the questions doc (Q1-4, Q19, Q25, Q27) plus
`visibility_quiz_completed` (use as the GHL workflow trigger). GHL stores tags lowercase.
No GHL workflow maths is needed: the app computes the score.

## Code layout

```
src/lib/quiz/questions.ts     all 28 questions (single source of truth)
src/lib/quiz/scoring.ts       computeResults(answers) -> pillar %, score, level, strongest, gap
src/lib/quiz/reportCode.ts    encode/decode report link code
src/lib/quiz/validate.ts      answer + lead validation (shared client/server)
src/lib/ghl.ts                GHL client (fields map, upsert, tags)
src/lib/referral.ts           referral code
src/content/results.ts        all results copy + masterclass config (DRAFT copy flagged)
src/app/page.tsx              landing
src/app/quiz/                 quiz + unlock pop-up
src/app/results/              results page
src/app/api/submit/route.ts   submit + GHL sync
src/app/api/calendar/route.ts .ics download
```

## Testing

- Vitest: scoring (doc example, all zero, all max, ties, bands edges), report code
  round-trip and rejection, validation, referral code, GHL sync with mocked fetch
  (field mapping, stale tag removal, retry, not-configured).
- Playwright: complete quiz end to end (GHL not configured), results shown, report link reopens.
- Manual browser check at 1440px and 390px, console clean.
- CI (GitHub Actions): lint, typecheck, unit tests, build, e2e.

## Not in scope

Gap Rating bands, referral reward tracking, emailing the report (GHL workflow can do this
from the `visibility_quiz_completed` tag and `visibility_report_url` field), admin UI.
