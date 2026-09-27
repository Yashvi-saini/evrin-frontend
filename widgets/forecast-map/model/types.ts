import { WeatherRegimeId } from '@/entities/regime';

export type MapLayerId =
  | 'evrin-corrected'
  | 'raw-nwp'
  | 'difference'
  | 'heavy-rain-prob'
  | 'regime'
  | 'uncertainty';

export interface MapLayerConfig {
  id: MapLayerId;
  name: string;
  unit: string;
  description: string;
  palette: string[];
  stops: { value: string; label: string }[];
}

export interface MapDistrictPoint {
  id: string;
  name: string;
  state: string;
  region: 'North' | 'South' | 'East' | 'West' | 'Central' | 'NorthEast';
  lat: number;
  lng: number;
  svgX: number; // Normalized coordinate in India map projection (0-1000)
  svgY: number; // Normalized coordinate in India map projection (0-1000)
  rawMm: number;
  evrinMm: number;
  deltaMm: number;
  heavyProb: number; // 0.0 to 1.0
  regime: WeatherRegimeId;
  uncertaintySpread: number; // mm
}
