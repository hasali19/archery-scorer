import type { RoundDefinition } from '../types';
import shortMetricAllowances from '../assets/rounds/short-metric.json';

const SHORT_METRIC: RoundDefinition = {
  id: 'short-metric',
  name: 'Short Metric',
  distances: [
    { distanceMeters: 50, endCount: 6, arrowsPerEnd: 6 },
    { distanceMeters: 30, endCount: 6, arrowsPerEnd: 6 },
  ],
  goldScore: 10,
  maxArrowScore: 10,
  allowances: shortMetricAllowances,
};

export const ROUNDS: Record<string, RoundDefinition> = {
  [SHORT_METRIC.id]: SHORT_METRIC,
};

export const ROUND_OPTIONS = Object.values(ROUNDS).map(r => ({
  value: r.id,
  label: r.name,
}));
