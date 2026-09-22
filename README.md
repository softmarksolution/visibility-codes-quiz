# The Visibility Codes Quiz

A 28-question Visibility Assessment for The Visibility Codes (Katrina Kavvalos International).
Visitors answer the quiz, unlock their report with first name and email, and get a personalised
results page. Every lead is created or updated in GoHighLevel (GHL).

Built with Next.js 16 and TypeScript. No database: GHL stores the leads, and the report link carries
only the scored answer letters (no personal data).

## Pages

| Path | What it is |
|---|---|
| `/` | The quiz. Captures `?ref=` referral codes. Progress is saved in the browser, so a reload picks up where you left off. The unlock pop-up appears after question 28. |
| `/quiz`, `/quiz-cover` | Retired. Permanent redirects to `/` so old ad, email and bookmark links still reach the quiz. |
| `/results?r=…&c=…` | The results report. Works on any device from the copied link. |
| `/checkout?r=…` | Retired. Forwards to the action-plan page for that report's primary gap, or to `/` without a readable result. |
| `/api/submit` | Validates, scores and sends the lead to GHL. |
| `/api/calendar` | `.ics` file for Apple / Outlook calendars. |

## Selling the Action Plan

The paid Action Plan is **not** sold on this site. Each edition has its own checkout page on the
client's site, carrying the price, the inclusions, the billing form, the masterclass waitlist
question and the payment itself.

The results page sends each visitor to the page for their **primary gap** — the lowest-scoring of
the five pillars — so the edition offered is the one their result calls for:

| Primary gap | Page |
| --- | --- |
| Direction | https://thevisibilitycodes.com/action-plan-direction |
| Recognition | https://thevisibilitycodes.com/action-plan-recognition |
| Consistency | https://thevisibilitycodes.com/action-plan-consistency |
| Connection | https://thevisibilitycodes.com/action-plan-connection |
| Opportunity | https://thevisibilitycodes.com/action-plan-opportunity |

The map lives in `src/lib/actionPlan.ts` and is typed so that adding a pillar without adding its
page is a compile error. To change a URL, change it there — nothing else needs touching.

This replaced an on-site checkout page with a demo card form. That page and its form are gone;
`/checkout` now only forwards, so report links handed out before the change still land on the right
edition. `/thank-you` is no longer reachable from this site — the checkout pages own everything
after payment — but the page is left in place in case it is linked from GoHighLevel.

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

**Per-question fields — to create.** Every answer is also sent as its own field, so any single
question can be filtered on or used in a workflow. The nine answer fields above already exist; these
twenty do not yet, and **must be created in GHL** (Settings → Custom Fields → Contact) before their
answers are stored. Name each field exactly as shown and GHL generates the matching key; check the
key after saving. Each holds the wording of the option the visitor picked.

| Quiz data | GHL field name | Key | Type |
|---|---|---|---|
| Q1 answer | Q1 Role | `q1_role` | Text |
| Q5 answer | Q5 Goal Clarity | `q5_goal_clarity` | Text |
| Q6 answer | Q6 Who Can Help | `q6_who_can_help` | Text |
| Q7 answer | Q7 Where To Show Up | `q7_where_to_show_up` | Text |
| Q8 answer | Q8 Visibility Focus | `q8_visibility_focus` | Text |
| Q9 answer | Q9 Efforts Working | `q9_efforts_working` | Text |
| Q10 answer | Q10 What Makes You Different | `q10_what_makes_you_different` | Text |
| Q11 answer | Q11 Brand Perception | `q11_brand_perception` | Text |
| Q12 answer | Q12 Proof Online | `q12_proof_online` | Text |
| Q13 answer | Q13 Audience Size | `q13_audience_size` | Text |
| Q14 answer | Q14 Sought For Advice | `q14_sought_for_advice` | Text |
| Q15 answer | Q15 Key Industry People | `q15_key_industry_people` | Text |
| Q16 answer | Q16 Right Rooms | `q16_right_rooms` | Text |
| Q17 answer | Q17 Following Up Connections | `q17_following_up_connections` | Text |
| Q18 answer | Q18 Connecting Without Agenda | `q18_connecting_without_agenda` | Text |
| Q20 answer | Q20 Posting Frequency | `q20_posting_frequency` | Text |
| Q21 answer | Q21 Reviewing What Works | `q21_reviewing_what_works` | Text |
| Q22 answer | Q22 Last Inbound Opportunity | `q22_last_inbound_opportunity` | Text |
| Q23 answer | Q23 How Opportunities Came | `q23_how_opportunities_came` | Text |
| Q24 answer | Q24 Building On Opportunities | `q24_building_on_opportunities` | Text |

Q1 (role) is also saved as a tag. The older `visibility_level` dropdown (its options don't match the
scoring doc's level names) and `visibility_gap_rating` (no score bands yet) are left untouched.

**Tags.** The funnel writes to GHL at one point: the unlock form after Q28.

| When | Tags | Sent by |
| --- | --- | --- |
| The report is unlocked after Q28 | `visibility_quiz_optin`, `visibility_quiz_completed` | `POST /api/submit` |

The sync carries first name, email and phone, plus the answer tags from the questions document
(role, goal, problem, platform, blocker, experience, intent).

The opt-in tag used to be sent ahead of the quiz by a pop-up on the landing page, which caught people
who handed over their details and then dropped out. That landing page and its pop-up have been
removed, so **the details are now only asked for at the end and only finishers become contacts.**
The tag is still sent, so workflows built on it keep firing, but it no longer identifies a separate
abandoned-quiz segment — every contact carrying it also carries `visibility_quiz_completed`.

On a retake, quiz tags from the previous attempt are removed. Tags the quiz doesn't manage are never
touched — `visibility_quiz_optin` is deliberately outside that managed set (see `OPTIN_TAG` in
`src/lib/quiz/tags.ts`), so a later sync can never strip it. GHL stores tags in lowercase.

**Workflow.** The app calculates the Visibility Score itself, so no maths workflow is needed.
To email the report, trigger a workflow on the tag `visibility_quiz_completed` and use
`{{contact.visibility_report_url}}` in the email. Abandoned-quiz follow-up is no longer possible:
nobody reaches the CRM until they finish.

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
