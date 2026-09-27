'use client';

import React from 'react';
import { useForecastRepository } from '@/entities/repository';
import { RefreshCw } from '@/shared/ui/icons';
import { MetricKpiCards } from '@/widgets/forecast-summary';
import { IndiaMap } from '@/widgets/forecast-map';
import { RegimePanelWidget } from '@/widgets/regime-panel';
import { DistrictInspectionWidget } from '@/widgets/district-inspection';
import { CorrectionDriversWidget } from '@/widgets/correction-drivers';

export default function OverviewPage() {
  const { activeScenario, isLoading } = useForecastRepository();

  if (isLoading || !activeScenario) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-slate-400 gap-3 font-mono text-xs">
        <RefreshCw size={24} className="animate-spin text-teal-400" />
        <span>Loading operational console telemetry...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4 max-w-[1600px] mx-auto">
      {/* 4 Primary KPI Metric Cards Row matching Image 2 */}
      <MetricKpiCards />

      {/* Main Grid: GIS Map (Left) & Detailed Telemetry Column (Right) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
        {/* Left: Real India GIS Map Canvas matching Image 2 */}
        <div className="xl:col-span-7 flex flex-col min-h-[580px]">
          <IndiaMap />
        </div>

        {/* Right: Stacked Telemetry & Diagnostic Column matching Image 2 & 3 */}
        <div className="xl:col-span-5 space-y-3.5">
          {/* 1. Atmospheric Regime Diagnosis */}
          <RegimePanelWidget />

          {/* 2. Target Inspection with Raw vs EVRIN & Quantiles */}
          <DistrictInspectionWidget />

          {/* 3. Why Did EVRIN Correct This? & Operational Response Actions */}
          <CorrectionDriversWidget />
        </div>
      </div>
    </div>
  );
}
