export type StepStatus = 'pending' | 'running' | 'completed' | 'error';

export interface PipelineStep {
  id: string;
  order: number;
  title: string;
  subtext: string;
  durationMs: number;
  status: StepStatus;
}
