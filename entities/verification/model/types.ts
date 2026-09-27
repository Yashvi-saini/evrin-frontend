import { WeatherRegimeId } from '../../regime';

export interface MetricComparison {
  name: string;
  rawNwp: number;
  evrin: number;
  improvementPercentage: number;
  unit: string;
  isHigherBetter: boolean;
}

export interface VerificationMetrics {
  rmse: MetricComparison; // Root Mean Square Error (mm)
  ets: MetricComparison;  // Equitable Threat Score
  csi: MetricComparison;  // Critical Success Index
  pod: MetricComparison;  // Probability of Detection
  far: MetricComparison;  // False Alarm Ratio
  fss: MetricComparison;  // Fractions Skill Score
}

export interface RegimeSkillScore {
  regimeId: WeatherRegimeId;
  regimeName: string;
  sampleEventCount: number;
  rawNwpCsi: number;
  evrinCsi: number;
  skillGain: number; // e.g. +0.19
}

export interface VerificationResult {
  evaluationPeriod: string;
  overallMetrics: VerificationMetrics;
  regimeWiseSkill: RegimeSkillScore[];
  isSimulatedPrototypeData: boolean;
}
