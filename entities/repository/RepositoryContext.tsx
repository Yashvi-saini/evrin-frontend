'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { IForecastRepository, ForecastScenario } from './IForecastRepository';
import { defaultMockRepository } from '@/mocks/MockForecastRepository';

export interface RepositoryContextValue {
  repository: IForecastRepository;
  activeScenario: ForecastScenario | null;
  activeScenarioId: string;
  scenarios: ForecastScenario[];
  isLoading: boolean;
  isProcessingEvrin: boolean;
  error: string | null;
  selectScenario: (scenarioId: string) => Promise<void>;
  runEvrin: () => Promise<void>;
}

const RepositoryContext = createContext<RepositoryContextValue | null>(null);

export interface RepositoryProviderProps {
  repository?: IForecastRepository;
  initialScenarioId?: string;
  children: React.ReactNode;
}

export function RepositoryProvider({
  repository = defaultMockRepository,
  initialScenarioId = 'active-monsoon',
  children,
}: RepositoryProviderProps) {
  const [activeScenarioId, setActiveScenarioId] = useState<string>(initialScenarioId);
  const [activeScenario, setActiveScenario] = useState<ForecastScenario | null>(null);
  const [scenarios, setScenarios] = useState<ForecastScenario[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isProcessingEvrin, setIsProcessingEvrin] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Load scenarios on mount
  useEffect(() => {
    let isMounted = true;

    async function init() {
      try {
        setIsLoading(true);
        const [scenarioList, current] = await Promise.all([
          repository.getScenarios(),
          repository.getScenarioById(activeScenarioId),
        ]);
        if (isMounted) {
          setScenarios(scenarioList);
          setActiveScenario(current);
          setError(null);
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err?.message || 'Failed to initialize scenarios');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    init();

    return () => {
      isMounted = false;
    };
  }, [repository, activeScenarioId]);

  const selectScenario = useCallback(
    async (scenarioId: string) => {
      try {
        setIsLoading(true);
        setActiveScenarioId(scenarioId);
        const current = await repository.getScenarioById(scenarioId);
        setActiveScenario(current);
        setError(null);
      } catch (err: any) {
        setError(err?.message || `Failed to switch to scenario: ${scenarioId}`);
      } finally {
        setIsLoading(false);
      }
    },
    [repository]
  );

  const runEvrin = useCallback(async () => {
    if (!activeScenario) return;
    try {
      setIsProcessingEvrin(true);
      await repository.runEvrinPipeline({
        districtId: activeScenario.selectedDistrict.id,
        scenarioId: activeScenario.id,
        forecastHour: 24,
      });
      // Re-fetch calibrated scenario
      const updated = await repository.getScenarioById(activeScenario.id);
      setActiveScenario(updated);
    } catch (err: any) {
      setError(err?.message || 'Failed to execute EVRIN post-processing');
    } finally {
      setIsProcessingEvrin(false);
    }
  }, [repository, activeScenario]);

  const value: RepositoryContextValue = {
    repository,
    activeScenario,
    activeScenarioId,
    scenarios,
    isLoading,
    isProcessingEvrin,
    error,
    selectScenario,
    runEvrin,
  };

  return <RepositoryContext.Provider value={value}>{children}</RepositoryContext.Provider>;
}

export function useForecastRepository(): RepositoryContextValue {
  const context = useContext(RepositoryContext);
  if (!context) {
    throw new Error('useForecastRepository must be used within a RepositoryProvider');
  }
  return context;
}
