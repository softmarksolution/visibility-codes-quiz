// Scoring rules from "HOW TO WORK OUT % SCORES.docx":
// score each pillar as a %, then average the five percentages.

import { PILLARS, SCORED_QUESTIONS, type Answers, type PillarId } from "./questions";

export const LEVELS = [
  { min: 90, name: "Chosen Expert" },
  { min: 75, name: "Recognised" },
  { min: 50, name: "Building Recognition" },
  { min: 25, name: "Emerging Visibility" },
  { min: 0, name: "Hidden Potential" },
] as const;

export type LevelName = (typeof LEVELS)[number]["name"];

export type Badge = "Primary Blocker" | "Strongest Area" | "Strong" | "Building" | "Developing";

export interface PillarResult {
  id: PillarId;
  points: number;
  max: number;
  /** Unrounded percentage, used for all maths. */
  percent: number;
  /** Rounded percentage for display. */
  display: number;
}

export interface QuizResults {
  pillars: Record<PillarId, PillarResult>;
  score: number;
  gap: number;
  level: LevelName;
  strongest: PillarId;
  primaryGap: PillarId;
}

function emptyTotals(): Record<PillarId, number> {
  return { direction: 0, recognition: 0, connection: 0, consistency: 0, opportunity: 0 };
}

export const PILLAR_MAX: Record<PillarId, number> = SCORED_QUESTIONS.reduce((max, q) => {
  max[q.pillar!] += Math.max(...q.options.map((o) => o.score ?? 0));
  return max;
}, emptyTotals());

export function levelForScore(score: number): LevelName {
  return (LEVELS.find((l) => score >= l.min) ?? LEVELS[LEVELS.length - 1]!).name;
}

/** Throws if any scored question is unanswered or has an unknown option. */
export function computeResults(answers: Answers): QuizResults {
  const points = emptyTotals();
  for (const q of SCORED_QUESTIONS) {
    const value = answers[q.id];
    const option = typeof value === "string" ? q.options.find((o) => o.id === value) : undefined;
    if (!option || option.score === undefined) {
      throw new Error(`Q${q.id} is missing a valid answer`);
    }
    points[q.pillar!] += option.score;
  }

  const pillars = {} as Record<PillarId, PillarResult>;
  for (const id of PILLARS) {
    const percent = (points[id] / PILLAR_MAX[id]) * 100;
    pillars[id] = { id, points: points[id], max: PILLAR_MAX[id], percent, display: Math.round(percent) };
  }

  const average = PILLARS.reduce((sum, id) => sum + pillars[id].percent, 0) / PILLARS.length;
  const score = Math.round(average);

  // Strict comparisons keep the earliest pillar (doc order) on ties.
  let strongest: PillarId = PILLARS[0];
  let primaryGap: PillarId = PILLARS[0];
  for (const id of PILLARS) {
    if (pillars[id].percent > pillars[strongest].percent) strongest = id;
    if (pillars[id].percent < pillars[primaryGap].percent) primaryGap = id;
  }

  return { pillars, score, gap: 100 - score, level: levelForScore(score), strongest, primaryGap };
}

/** ASSUMPTION (confirm with client): under 50 Developing, 50-74 Building, 75+ Strong. */
export function badgeFor(results: QuizResults, pillar: PillarId): Badge {
  if (pillar === results.primaryGap) return "Primary Blocker";
  if (pillar === results.strongest) return "Strongest Area";
  const pct = results.pillars[pillar].display;
  if (pct >= 75) return "Strong";
  if (pct >= 50) return "Building";
  return "Developing";
}
