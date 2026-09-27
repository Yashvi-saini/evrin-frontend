import { District } from '../../district';
import { WeatherRegimeId } from '../../regime';
import { RainfallQuantiles, UncertaintyRange } from '../../rainfall';
import { CorrectionDelta, CorrectionDriver } from '../../correction';

export interface RawNwpForecast {
  modelName: 'IMD-GFS' | 'NCUM' | 'ECMWF-RAW';
  rainfall24h: number; // mm
  rainfall48h: number; // mm
  rainfall72h: number; // mm
  rawQuantiles: RainfallQuantiles;
}

export interface EvrinCorrectedForecast {
  rainfall24h: number; // mm
  rainfall48h: number; // mm
  rainfall72h: number; // mm
  quantiles: RainfallQuantiles;
  uncertainty: UncertaintyRange;
}

export interface ForecastResult {
  district: District;
  validTime: string;
  issueTime: string;
  forecastHorizonHours: 24 | 48 | 72;
  raw: RawNwpForecast;
  corrected: EvrinCorrectedForecast;
  correction: CorrectionDelta;
  drivers: CorrectionDriver[];
  regimeContext: WeatherRegimeId;
}
