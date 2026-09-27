import { ForecastResult } from '../forecast';
import { RegimeDiagnosis } from '../regime';
import { District, DistrictRiskSummary } from '../district';
import { OperationalThresholds } from '../rainfall';
import { VerificationResult } from '../verification';

export interface ExtremeRiskResult {
  targetDistrict: District;
  thresholds: OperationalThresholds;
  highRiskDistricts: DistrictRiskSummary[];
  synopticWarning: string;
}

export interface ForecastScenario {
  id: string;
  name: string;
  subtitle: string;
  dateStr: string;
  selectedDistrict: District;
  regimeDiagnosis: RegimeDiagnosis;
  forecast: ForecastResult;
  extremes: ExtremeRiskResult;
  verification: VerificationResult;
}

export interface ForecastRequest {
  districtId: string;
  scenarioId?: string;
  forecastHour?: 24 | 48 | 72;
}

export interface IForecastRepository {
  /** Retrieves all available demo scenarios */
  getScenarios(): Promise<ForecastScenario[]>;

  /** Retrieves full scenario bundle by id */
  getScenarioById(id: string): Promise<ForecastScenario>;

  /** Retrieves forecast for specific district within scenario */
  getForecast(request: ForecastRequest): Promise<ForecastResult>;

  /** Retrieves prevailing weather regime diagnosis */
  getRegimeDiagnosis(scenarioId: string): Promise<RegimeDiagnosis>;

  /** Retrieves extreme rainfall risks and ranked district list */
  getExtremeRisks(scenarioId: string): Promise<ExtremeRiskResult>;

  /** Retrieves verification metrics */
  getVerification(scenarioId: string): Promise<VerificationResult>;

  /** Retrieves all district spatial summaries for map layer display */
  getDistrictSummaries(scenarioId: string): Promise<DistrictRiskSummary[]>;

  /** Simulates or executes EVRIN post-processing */
  runEvrinPipeline(request: ForecastRequest): Promise<ForecastResult>;
}
