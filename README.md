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
| `/quiz` | The quiz. Progress is saved in the browser. The unlock pop-up appears after question 28. |
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

Create these **Contact** custom fields in the sub-account. The **key** must match exactly
(GHL shows it as `contact.<key>`). Fields that don't exist are skipped and logged.

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
| Visibility Actions Tried | `visibility_actions_tried` | Multi line |
| Biggest Visibility Obstacle | `biggest_visibility_obstacle` | Multi line |
| Visibility Report URL | `visibility_report_url` | Single line |
| Referral Code | `referral_code` | Single line |
| Referred By | `referred_by` | Single line |

**Tags.** Each submission adds the answer tags from the questions document (role, goal, problem,
platform, blocker, experience, intent) plus `visibility_quiz_completed`. On a retake, quiz tags from
the previous attempt are removed; tags the quiz doesn't manage are never touched. GHL stores tags in lowercase.

**Workflow.** The app calculates the Visibility Score itself, so no maths workflow is needed.
To email the report, trigger a workflow on the tag `visibility_quiz_completed` and use
`{{contact.visibility_report_url}}` in the email.

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
