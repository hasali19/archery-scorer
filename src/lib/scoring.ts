import type { RoundDefinition } from '../types';

export function totalArrows(round: RoundDefinition): number {
  return round.distances.reduce((sum, d) => sum + d.endCount * d.arrowsPerEnd, 0);
}

export function calculateTotalScore(scores: (number | null)[]): number {
  return scores.reduce<number>((sum, s) => sum + (s ?? 0), 0);
}

export function calculateHits(scores: (number | null)[]): number {
  return scores.filter(s => s !== null && s > 0).length;
}

export function calculateGolds(scores: (number | null)[], goldScore: number): number {
  return scores.filter(s => s !== null && s >= goldScore).length;
}

export function getAllowance(handicap: number | null, allowances: number[]): number {
  if (handicap === null) return 0;
  const idx = Math.max(0, Math.min(allowances.length - 1, Math.round(handicap)));
  return allowances[idx];
}

export function calculateHandicappedScore(totalScore: number, allowance: number): number {
  return totalScore + allowance;
}
