'use client';

import React from 'react';
import { Badge } from '@/shared/ui/badge';
import { useForecastRepository } from '@/entities/repository';
import { formatPercentage, formatRainfall } from '@/shared/lib/utils';

export function DistrictInspectionWidget() {
  const { activeScenario } = useForecastRepository();
  if (!activeScenario) return null;

  const { forecast, extremes } = activeScenario;
  const quantiles = forecast.corrected.quantiles;

  return (
    <div className="bg-white dark:bg-[#141414] rounded-lg p-3.5 text-xs select-none transition-colors shadow-sm">
      {/* Header matching Image 2 */}
      <div className="flex items-center justify-between pb-2 border-b border-neutral-200 dark:border-[#262626] mb-2.5">
        <span className="text-[10px] text-neutral-500 dark:text-neutral-400 uppercase tracking-wider font-semibold">
          Target Inspection
        </span>
        <Badge variant="pill-subtle" className="text-[9px]">
          GRID 0.05° @UP-14
        </Badge>
      </div>

      {/* Target District Name */}
      <div className="text-xs font-bold text-neutral-900 dark:text-white uppercase tracking-wide mb-3">
        {forecast.district.name}, {forecast.district.state}
      </div>

      {/* Two Comparison Boxes */}
      <div className="grid grid-cols-2 gap-2.5 mb-2.5">
        {/* Raw NWP Box */}
        <div className="p-2.5 rounded-lg">
          <div className="text-[9px] uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-1">
            Raw NWP ({forecast.raw.modelName})
          </div>
          <div className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
            {forecast.raw.rainfall24h.toFixed(0)}{' '}
            <span className="text-[11px] font-normal text-neutral-500">mm</span>
          </div>
          <div className="text-[10px] text-neutral-500 dark:text-neutral-400 mt-1">
            P(&gt;64.5mm): <span className="text-neutral-700 dark:text-neutral-300 font-medium">34%</span>
          </div>
        </div>

        {/* EVRIN Corrected Box */}
        <div className="p-2.5 rounded-lg border border-neutral-300 dark:border-[#333333]">
          <div className="flex items-center justify-between text-[9px] uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-1 font-semibold">
            <span>EVRIN Corrected</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          </div>
          <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
            {forecast.corrected.rainfall24h.toFixed(0)}{' '}
            <span className="text-[11px] font-normal text-neutral-500">mm</span>
          </div>
          <div className="text-[10px] text-neutral-600 dark:text-neutral-400 mt-1">
            P(&gt;64.5mm): <strong className="text-rose-600 dark:text-rose-400">{formatPercentage(extremes.thresholds.heavyRainProbability)}</strong>
          </div>
        </div>
      </div>

      {/* Post-Processing Delta Banner */}
      <div className="p-2 rounded flex items-center justify-between text-[11px] text-neutral-700 dark:text-neutral-300 mb-3">
        <span>Post-Processing Delta:</span>
        <span className="font-semibold text-neutral-900 dark:text-white">
          {forecast.correction.delta24h > 0 ? `+${forecast.correction.delta24h.toFixed(0)} mm` : `${forecast.correction.delta24h.toFixed(0)} mm`} correction ({forecast.correction.percentageChange > 0 ? `+${forecast.correction.percentageChange.toFixed(1)}%` : `${forecast.correction.percentageChange.toFixed(1)}%`})
        </span>
      </div>

      {/* Uncertainty Quantiles Section */}
      <div>
        <div className="flex items-center justify-between text-[9px] uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-1.5 font-semibold">
          <span>Uncertainty Quantiles</span>
          <span className="text-neutral-700 dark:text-neutral-300 font-semibold">CONFIDENCE 82%</span>
        </div>

        <div className="grid grid-cols-3 gap-1.5 mb-1.5">
          <div className="p-1.5 rounded text-center">
            <div className="text-[8px] text-neutral-400 uppercase">P50</div>
            <div className="text-xs font-semibold text-neutral-900 dark:text-neutral-100">{quantiles.p50} mm</div>
          </div>
          <div className="p-1.5 rounded text-center">
            <div className="text-[8px] text-neutral-400 uppercase">P75</div>
            <div className="text-xs font-semibold text-amber-600 dark:text-amber-400">{quantiles.p75} mm</div>
          </div>
          <div className="p-1.5 rounded text-center">
            <div className="text-[8px] text-neutral-400 uppercase">P90</div>
            <div className="text-xs font-semibold text-rose-600 dark:text-rose-400">{quantiles.p90} mm</div>
          </div>
        </div>

        <div className="text-center text-[9px] text-neutral-500 dark:text-neutral-400">
          Uncertainty Range: {quantiles.p10} mm — {quantiles.p90} mm
        </div>
      </div>
    </div>
  );
}
