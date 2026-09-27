export interface RainfallQuantiles {
  p10: number; // mm (10th percentile - lower baseline)
  p25: number; // mm
  p50: number; // mm (Median expectation)
  p75: number; // mm
  p90: number; // mm (90th percentile - extreme tail)
}

export interface UncertaintyRange {
  lowerBound: number; // mm
  upperBound: number; // mm
  spread: number;     // mm (upperBound - lowerBound)
  confidenceLevel: number; // 0.0 to 1.0 (e.g. 0.87 for 87%)
  confidenceGrade: 'LOW' | 'MODERATE' | 'HIGH';
}

export interface OperationalThresholds {
  heavyRainProbability: number;          // P(Rain > 64.5 mm)
  veryHeavyRainProbability: number;      // P(Rain > 115.5 mm)
  extremelyHeavyRainProbability: number; // P(Rain > 204.4 mm)
}
