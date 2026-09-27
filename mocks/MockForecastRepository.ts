import {
  IForecastRepository,
  ForecastScenario,
  ForecastRequest,
  ExtremeRiskResult,
} from '@/entities/repository/IForecastRepository';
import { ForecastResult } from '@/entities/forecast';
import { RegimeDiagnosis } from '@/entities/regime';
import { VerificationResult } from '@/entities/verification';
import { DistrictRiskSummary } from '@/entities/district';
import { SCENARIO_FIXTURES, ALL_SCENARIOS, activeMonsoonScenario } from './scenarios';

export class MockForecastRepository implements IForecastRepository {
  private simulatedLatencyMs: number;

  constructor(simulatedLatencyMs: number = 120) {
    this.simulatedLatencyMs = simulatedLatencyMs;
  }

  private async delay(): Promise<void> {
    if (this.simulatedLatencyMs <= 0) return;
    return new Promise((resolve) => setTimeout(resolve, this.simulatedLatencyMs));
  }

  async getScenarios(): Promise<ForecastScenario[]> {
    await this.delay();
    return ALL_SCENARIOS;
  }

  async getScenarioById(id: string): Promise<ForecastScenario> {
    await this.delay();
    const scenario = SCENARIO_FIXTURES[id];
    if (!scenario) {
      console.warn(`Scenario id "${id}" not found, falling back to active-monsoon`);
      return activeMonsoonScenario;
    }
    return scenario;
  }

  async getForecast(request: ForecastRequest): Promise<ForecastResult> {
    await this.delay();
    const scenario = request.scenarioId ? SCENARIO_FIXTURES[request.scenarioId] || activeMonsoonScenario : activeMonsoonScenario;
    return scenario.forecast;
  }

  async getRegimeDiagnosis(scenarioId: string): Promise<RegimeDiagnosis> {
    await this.delay();
    const scenario = SCENARIO_FIXTURES[scenarioId] || activeMonsoonScenario;
    return scenario.regimeDiagnosis;
  }

  async getExtremeRisks(scenarioId: string): Promise<ExtremeRiskResult> {
    await this.delay();
    const scenario = SCENARIO_FIXTURES[scenarioId] || activeMonsoonScenario;
    return scenario.extremes;
  }

  async getVerification(scenarioId: string): Promise<VerificationResult> {
    await this.delay();
    const scenario = SCENARIO_FIXTURES[scenarioId] || activeMonsoonScenario;
    return scenario.verification;
  }

  async getDistrictSummaries(scenarioId: string): Promise<DistrictRiskSummary[]> {
    await this.delay();
    const scenario = SCENARIO_FIXTURES[scenarioId] || activeMonsoonScenario;
    return scenario.extremes.highRiskDistricts;
  }

  async runEvrinPipeline(request: ForecastRequest): Promise<ForecastResult> {
    // Pipeline execution simulation with realistic post-processing delay
    await new Promise((resolve) => setTimeout(resolve, 800));
    const scenario = request.scenarioId ? SCENARIO_FIXTURES[request.scenarioId] || activeMonsoonScenario : activeMonsoonScenario;
    return scenario.forecast;
  }
}

export const defaultMockRepository = new MockForecastRepository();
