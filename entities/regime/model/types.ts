export type WeatherRegimeId =
  | 'active-monsoon'
  | 'break-monsoon'
  | 'monsoon-depression'
  | 'orographic-convection'
  | 'coastal-rainfall'
  | 'western-disturbance'
  | 'transition-mixed';

export interface WeatherRegime {
  id: WeatherRegimeId;
  name: string;
  description: string;
  synopticFeatures: string[];
}

export interface RegimeProbability {
  regimeId: WeatherRegimeId;
  name: string;
  probability: number; // 0.0 to 1.0 (e.g. 0.78 for 78%)
}

export interface RegimeTimelinePoint {
  timestamp: string;
  regimeId: WeatherRegimeId;
  name: string;
  confidence: number;
  isCurrent: boolean;
}

export interface RegimeDiagnosis {
  primaryRegime: WeatherRegimeId;
  primaryRegimeName: string;
  confidence: number; // 0.0 to 1.0
  probabilities: RegimeProbability[];
  timeline: RegimeTimelinePoint[];
  atmosphericDrivers: {
    lowLevelMoistureFlux: 'LOW' | 'NORMAL' | 'STRONG' | 'VERY_STRONG';
    vorticity850hPa: 'CYCLONIC' | 'NEUTRAL' | 'ANTICYCLONIC';
    monsoonTroughPosition: 'NORMAL' | 'SOUTH' | 'NORTH_OF_NORMAL' | 'FOOT_HILLS';
    verticalWindShear: 'WEAK' | 'MODERATE' | 'STRONG';
  };
}
