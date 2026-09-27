import { WeatherRegimeId } from '../../regime';

export interface DistrictCoordinates {
  lat: number;
  lng: number;
}

export interface District {
  id: string; // e.g. "IN.UP.ME"
  name: string; // "Meerut"
  state: string; // "Uttar Pradesh"
  region: 'North' | 'South' | 'East' | 'West' | 'Central' | 'NorthEast';
  coordinates: DistrictCoordinates;
}

export type ImdRiskLevel = 'NO_WARNING' | 'WATCH' | 'ALERT' | 'WARNING'; // Green, Yellow, Orange, Red

export interface DistrictRiskSummary {
  district: District;
  expectedRainfall: number; // mm
  heavyRiskProbability: number; // 0.0 to 1.0
  riskCategory: ImdRiskLevel;
  prevailingRegime: WeatherRegimeId;
}
