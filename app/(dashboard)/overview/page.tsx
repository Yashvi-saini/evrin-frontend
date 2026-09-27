'use client';

import React from 'react';
import { useForecastRepository } from '@/entities/repository';
import { RefreshCw } from '@/shared/ui/icons';
import { MetricKpiCards } from '@/widgets/forecast-summary';
import { IndiaMap } from '@/widgets/forecast-map';
import { DistrictInspectionWidget } from '@/widgets/district-inspection';
import { CorrectionDriversWidget } from '@/widgets/correction-drivers';
import { RegimeTimelineWidget } from '@/widgets/regime-panel';

export default function OverviewPage() {
  const { activeScenario, isLoading } = useForecastRepository();

  if (isLoading || !activeScenario) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-slate-400 gap-3 font-mono text-xs">
        <RefreshCw size={24} className="animate-spin text-sky-400" />
        <span>Loading operational scenario data...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 4 Primary KPI Metric Cards */}
      <MetricKpiCards />

      {/* Main Map & Target Inspection Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Interactive Real Geographic GIS Map */}
        <div className="lg:col-span-2 min-h-[540px]">
          <IndiaMap />
        </div>

        {/* Target Inspection & Explainability Column */}
        <div className="space-y-4">
          <DistrictInspectionWidget />
          <CorrectionDriversWidget />
        </div>
      </div>

      {/* Regime Transition Timeline */}
      <RegimeTimelineWidget />
    </div>
  );
}
