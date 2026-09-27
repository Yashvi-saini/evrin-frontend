import { ForecastScenario } from '@/entities/repository/IForecastRepository';
import { activeMonsoonScenario } from './active-monsoon';
import { breakMonsoonScenario } from './break-monsoon';
import { monsoonDepressionScenario } from './monsoon-depression';
import { orographicScenario } from './orographic-rainfall';
import { coastalScenario } from './coastal-rainfall';

export const SCENARIO_FIXTURES: Record<string, ForecastScenario> = {
  'active-monsoon': activeMonsoonScenario,
  'break-monsoon': breakMonsoonScenario,
  'monsoon-depression': monsoonDepressionScenario,
  'orographic-convection': orographicScenario,
  'coastal-rainfall': coastalScenario,
};

export const ALL_SCENARIOS: ForecastScenario[] = [
  activeMonsoonScenario,
  breakMonsoonScenario,
  monsoonDepressionScenario,
  orographicScenario,
  coastalScenario,
];

export {
  activeMonsoonScenario,
  breakMonsoonScenario,
  monsoonDepressionScenario,
  orographicScenario,
  coastalScenario,
};
