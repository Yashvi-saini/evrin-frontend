'use client';

import React from 'react';
import { Badge } from '@/shared/ui/badge';
import { RefreshCw } from '@/shared/ui/icons';
import { useForecastRepository } from '@/entities/repository';
import { formatPercentage } from '@/shared/lib/utils';
import { RegimePanelWidget, RegimeTimelineWidget } from '@/widgets/regime-panel';

export default function RegimesPage() {
  const { activeScenario, isLoading } = useForecastRepository();

  if (isLoading || !activeScenario) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-slate-400 gap-3 font-mono text-xs">
        <RefreshCw size={24} className="animate-spin text-sky-400" />
        <span>Loading regime diagnostic data...</span>
      </div>
    );
  }

  const { regimeDiagnosis } = activeScenario;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-100 tracking-tight">Weather Regime Intelligence</h2>
          <p className="text-xs text-slate-400 mt-1 font-mono">
            AI synoptic classifier detecting prevailing meteorological states for targeted bias post-processing.
          </p>
        </div>
        <Badge variant="regime">
          Active State: {regimeDiagnosis.primaryRegimeName} ({formatPercentage(regimeDiagnosis.confidence)})
        </Badge>
      </div>

      {/* Main Regime Diagnostic & Drivers Grid */}
      <RegimePanelWidget />

      {/* Transition Evolution Timeline */}
      <RegimeTimelineWidget />
    </div>
  );
}
