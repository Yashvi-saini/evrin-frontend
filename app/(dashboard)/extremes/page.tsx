'use client';

import React from 'react';
import { Badge } from '@/shared/ui/badge';
import { AlertTriangle, RefreshCw } from '@/shared/ui/icons';
import { useForecastRepository } from '@/entities/repository';
import { ExtremeThresholdsCards, DistrictRiskTable } from '@/widgets/extreme-risk-panel';

export default function ExtremesPage() {
  const { activeScenario, isLoading } = useForecastRepository();

  if (isLoading || !activeScenario) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-slate-400 gap-3 font-mono text-xs">
        <RefreshCw size={24} className="animate-spin text-sky-400" />
        <span>Loading operational extremes data...</span>
      </div>
    );
  }

  const { extremes } = activeScenario;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-100 tracking-tight">Extreme Rainfall & Operational Risk</h2>
          <p className="text-xs text-slate-400 mt-1 font-mono">
            Calibrated probability of exceeding IMD operational thresholds (64.5 mm, 115.5 mm, 204.4 mm).
          </p>
        </div>
        <Badge variant={extremes.thresholds.heavyRainProbability > 0.7 ? 'danger' : 'info'}>
          {extremes.thresholds.heavyRainProbability > 0.7 ? 'Active Severe Weather Alert' : 'Normal Operational Tier'}
        </Badge>
      </div>

      {/* Advisory Banner */}
      <div className="p-3.5 rounded-lg bg-red-950/20 border border-red-800/40 text-xs text-red-200/90 flex items-start gap-2.5">
        <AlertTriangle size={16} className="text-red-400 shrink-0 mt-0.5" />
        <div>
          <div className="font-semibold text-red-300">Synoptic Operational Advisory</div>
          <div className="text-[11px] text-red-200/70 mt-0.5 font-mono">
            {extremes.synopticWarning}
          </div>
        </div>
      </div>

      {/* Operational Threshold Cards */}
      <ExtremeThresholdsCards />

      {/* Ranked High-Risk District Table */}
      <DistrictRiskTable />
    </div>
  );
}
