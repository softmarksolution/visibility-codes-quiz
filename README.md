# The Visibility Codes Quiz

A 28-question Visibility Assessment for The Visibility Codes (Katrina Kavvalos International).
Visitors answer the quiz, unlock their report with first name and email, and get a personalised
results page. Every lead is created or updated in GoHighLevel (GHL).

Built with Next.js 16 and TypeScript. No database: GHL stores the leads, and the report link carries
only the scored answer letters (no personal data).

## Pages

| Path | What it is |
|---|---|
| `/` | Landing page. Captures `?ref=` referral codes. |
| `/quiz` | The quiz. Progress is saved in the browser, so a reload picks up where you left off; starting again from the landing page clears it. The unlock pop-up appears after question 28. |
| `/results?r=…&c=…` | The results report. Works on any device from the copied link. |
| `/api/submit` | Validates, scores and sends the lead to GHL. |
| `/api/calendar` | `.ics` file for Apple / Outlook calendars. |

## Local setup

```bash
npm install
cp .env.example .env
npm run dev
```

Without GHL credentials the quiz still works end to end; the submission is simply not synced.

## Scripts

| Command | Runs |
|---|---|
| `npm run dev` | Dev server |
| `npm run lint` | ESLint |
| `npm run typecheck` | Route type generation + `tsc --noEmit` |
| `npm test` | Unit tests (Vitest) |
| `npm run build` | Production build |
| `npm run e2e` | Browser tests at 1440px and 390px (needs `npm run build` first) |

## Environment variables

| Name | Purpose |
|---|---|
| `GHL_PRIVATE_TOKEN` | GHL Private Integration token. Scopes: contacts write/read, custom fields read. |
| `GHL_LOCATION_ID` | GHL sub-account (location) ID. |
| `NEXT_PUBLIC_SITE_URL` | Public site URL, e.g. `https://quiz.thevisibilitycodes.com`. Used in the report link saved to GHL. |

## GoHighLevel setup

These **Contact** custom fields are set up in the Katrina Kavvalos International sub-account
(created or mapped on 2026-09-14). The app looks fields up by **key** (GHL shows it as
`contact.<key>`). A field that doesn't exist is skipped and logged; the rest still sync.

| Quiz data | GHL field | Key | Type | Origin |
|---|---|---|---|---|
| Direction % | Direction Percent | `direction_percent` | Number | Created |
| Recognition % | Recognition Percent | `recognition_percent` | Number | Created |
| Connection % | Connection Percent | `connection_percent` | Number | Created |
| Consistency % | Consistency Percent | `consistency_percent` | Number | Created |
| Opportunity % | Opportunity Percent | `opportunity_percent` | Number | Created |
| Visibility Score | visibility_score | `visibility_score` | Number | Existing |
| Visibility Gap | Visibility Gap | `visibility_gap` | Number | Existing |
| Visibility Level | Visibility Level (Quiz) | `visibility_level_quiz` | Dropdown: the 5 levels | Created |
| Strongest area | Strongest Code | `strongest_code` | Text | Existing |
| Primary gap | Weakest Code | `weakest_code` | Text | Existing |
| Q2 answer | Q2 Desired Outcome | `q2_desired_outcome` | Text | Existing |
| Q3 answer | Q3 Perceived Problem | `q3_perceived_problem` | Text | Existing |
| Q3 answer | Primary Visibility Problem | `primary_visibility_problem` | Long text | Existing |
| Q4 answer | Q4 Primary Platform | `q4_primary_platform` | Text | Existing |
| Q19 answer | Inner Visibility Blocker | `inner_visibility_blocker` | Text | Existing |
| Q25 answer | Q25 Years Experience | `q25_years_experience` | Text | Existing |
| Q26 answers | What have you already done to try to become more visible? | `what_have_you_already_done_to_try_to_become_more_visible` | Checkbox | Existing |
| Q27 answer | Q27 Intent Level | `q27_intent_level` | Text | Existing |
| Q28 answer | Q28 Written Response | `q28_written_response` | Long text | Existing |
| Report link | Visibility Report URL | `visibility_report_url` | Text | Created |
| Referral code | Referral Code | `referral_code` | Text | Created |
| Referred by | Referred By | `referred_by` | Text | Created |

Q1 (role) is saved as a tag only. The older `visibility_level` dropdown (its options don't match the
scoring doc's level names) and `visibility_gap_rating` (no score bands yet) are left untouched.

**Tags.** The funnel writes to GHL at two points, with one tag each:

| When | Tag | Sent by |
| --- | --- | --- |
| The opt-in pop-up is submitted, before any question is answered | `visibility_quiz_optin` | `POST /api/optin` |
| The report is unlocked after Q28 | `visibility_quiz_completed` | `POST /api/submit` |

The opt-in sync carries name, email and phone — it is the only place the phone number is captured,
so a lead who opts in and then abandons the quiz is still a reachable contact. The completion sync
adds the answer tags from the questions document (role, goal, problem, platform, blocker,
experience, intent) alongside `visibility_quiz_completed`.

Anyone who finishes therefore carries **both** tags; anyone who dropped out carries only
`visibility_quiz_optin`. That is the segment to follow up.

On a retake, quiz tags from the previous attempt are removed. Tags the quiz doesn't manage are never
touched — `visibility_quiz_optin` is deliberately outside that managed set (see `OPTIN_TAG` in
`src/lib/quiz/tags.ts`), so completing the quiz can never strip it. GHL stores tags in lowercase.

**Workflow.** The app calculates the Visibility Score itself, so no maths workflow is needed.
To email the report, trigger a workflow on the tag `visibility_quiz_completed` and use
`{{contact.visibility_report_url}}` in the email. For abandoned-quiz follow-up, trigger on
`visibility_quiz_optin` with a filter excluding `visibility_quiz_completed`.

## Scoring

From the "How to work out % scores" guide: each pillar's points ÷ its maximum × 100, then the
Visibility Score is the average of the five pillar percentages, rounded. Gap = 100 − score.
Strongest area = highest pillar; primary gap = lowest (ties go to the earlier pillar:
Direction, Recognition, Connection, Consistency, Opportunity). Logic lives in `src/lib/quiz/scoring.ts`.

## Editing copy

All visible text, dates and links are in `src/content/site.ts`. Lines marked `// DRAFT` were written by
the developer and need client approval.

## Open items for the client

- Approve the DRAFT copy in `src/content/site.ts`.
- **Visibility Gap Rating** (e.g. "SIGNIFICANT") is hidden until the rating bands are defined.
- **Pillar badges** assume: under 50% Developing, 50–74% Building, 75%+ Strong.
- Privacy Policy and Terms URLs (`brand.privacyUrl`, `brand.termsUrl`).
- Referral rewards (10% off, free VIP, commission) are displayed only; tracking happens outside this app.

## Deployment (Railway)

Railway detects Next.js automatically: build `npm run build`, start `npm start`.
Set the three environment variables in the Railway service.
