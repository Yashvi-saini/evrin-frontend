export interface CorrectionDelta {
  delta24h: number; // mm (EVRIN - Raw NWP)
  percentageChange: number; // e.g. +50.0 (%)
  direction: 'INCREASE' | 'DECREASE' | 'NEUTRAL';
  correctionStrategyApplied: string;
}

export interface CorrectionDriver {
  id: string;
  order: number;
  title: string;
  description: string;
  contributionScore: number; // e.g. +0.35
  weightPercentage: number;  // e.g. 35 (%)
}
