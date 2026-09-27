'use client';

import React from 'react';
import { Card } from '@/shared/ui/card';
import { Badge } from '@/shared/ui/badge';
import { useForecastRepository } from '@/entities/repository';
import { formatPercentage, formatRainfall } from '@/shared/lib/utils';
import { RefreshCw } from '@/shared/ui/icons';

export function MetricKpiCards() {
  const { activeScenario } = useForecastRepository();
  if (!activeScenario) return null;

  const { forecast, regimeDiagnosis, extremes, verification } = activeScenario;

  return (
    <div className="space-y-3">
      {/* Header bar matching Image 2 */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-neutral-200 dark:border-[#262626]">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-base font-bold text-neutral-900 dark:text-neutral-100 tracking-tight">
              Forecast Intelligence Console
            </h1>
            <Badge variant="pill-subtle">
              India • 27 Sep 2026 • 06 UTC
            </Badge>
          </div>
          <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5">
            Regime-aware post-processing active across 736 meteorological districts • Neural MoE Bias Correction
          </p>
        </div>

        {/* Right Header Status */}
        <div className="flex items-center gap-3 text-xs">
          <span className="text-[10px] text-neutral-400 uppercase">UPDATED 14m AGO</span>
          <button
            onClick={() => {
              const runBtn = document.querySelector('header button');
              if (runBtn) (runBtn as HTMLButtonElement).click();
            }}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-transparent hover:bg-neutral-100 dark:hover:bg-[#161616] text-neutral-700 dark:text-neutral-300 hover:text-black dark:hover:text-white border border-neutral-300 dark:border-[#262626] text-xs transition-colors"
          >
            <RefreshCw size={11} className="text-neutral-500 dark:text-neutral-400" />
            <span>Re-compute</span>
          </button>
        </div>
      </div>

      {/* 4 KPI Cards Row matching Image 2 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Card 1: CURRENT REGIME */}
        <div className="bg-white dark:bg-[#141414] border border-neutral-200 dark:border-[#262626] rounded-lg p-3.5 flex flex-col justify-between transition-colors shadow-sm">
          <div className="flex items-center justify-between text-[10px] text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-1">
            <span>CURRENT REGIME</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          </div>
          <div className="text-base font-bold text-neutral-900 dark:text-white tracking-tight uppercase mt-1">
            {regimeDiagnosis.primaryRegimeName}
          </div>
          <div className="flex items-center justify-between text-[11px] text-neutral-500 dark:text-neutral-400 mt-2 pt-2 border-t border-neutral-100 dark:border-[#1a1a1a]">
            <span>Confidence: <strong className="text-neutral-800 dark:text-neutral-200">{formatPercentage(regimeDiagnosis.confidence)}</strong></span>
            <span>Depression: <strong className="text-neutral-600 dark:text-neutral-400">14%</strong></span>
          </div>
        </div>

        {/* Card 2: HEAVY RAINFALL RISK */}
        <div className="bg-white dark:bg-[#141414] border border-neutral-200 dark:border-[#262626] rounded-lg p-3.5 flex flex-col justify-between transition-colors shadow-sm">
          <div className="flex items-center justify-between text-[10px] text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-1">
            <span>HEAVY RAINFALL RISK</span>
            <Badge variant="danger" size="sm">ALERT</Badge>
          </div>
          <div className="text-base font-bold text-neutral-900 dark:text-neutral-100 tracking-tight mt-1">
            124 Districts <span className="text-xs text-neutral-500 dark:text-neutral-400 font-normal">&gt;64.5 mm</span>
          </div>
          <div className="flex items-center justify-between text-[11px] text-neutral-500 dark:text-neutral-400 mt-2 pt-2 border-t border-neutral-100 dark:border-[#1a1a1a]">
            <span className="text-rose-600 dark:text-rose-400 font-semibold">+18 vs Raw NWP</span>
            <span>Threshold: 64.5mm/24h</span>
          </div>
        </div>

        {/* Card 3: CORRECTION IMPACT */}
        <div className="bg-white dark:bg-[#141414] border border-neutral-200 dark:border-[#262626] rounded-lg p-3.5 flex flex-col justify-between transition-colors shadow-sm">
          <div className="flex items-center justify-between text-[10px] text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-1">
            <span>CORRECTION IMPACT</span>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">RMSE ↓</span>
          </div>
          <div className="text-base font-bold text-emerald-600 dark:text-emerald-400 tracking-tight mt-1">
            RMSE ↓ 18.4%
          </div>
          <div className="flex items-center justify-between text-[11px] text-neutral-500 dark:text-neutral-400 mt-2 pt-2 border-t border-neutral-100 dark:border-[#1a1a1a]">
            <span>ECMWF/GFS Baseline</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold">CSI: +0.14</span>
          </div>
        </div>

        {/* Card 4: FORECAST CONFIDENCE */}
        <div className="bg-white dark:bg-[#141414] border border-neutral-200 dark:border-[#262626] rounded-lg p-3.5 flex flex-col justify-between transition-colors shadow-sm">
          <div className="flex items-center justify-between text-[10px] text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-1">
            <span>FORECAST CONFIDENCE</span>
            <span className="text-[10px] text-neutral-400">P50/P90</span>
          </div>
          <div className="text-base font-bold text-neutral-900 dark:text-neutral-100 tracking-tight mt-1">
            HIGH • 87%
          </div>
          <div className="flex items-center justify-between text-[11px] text-neutral-500 dark:text-neutral-400 mt-2 pt-2 border-t border-neutral-100 dark:border-[#1a1a1a]">
            <span>Uncertainty Band</span>
            <span className="text-neutral-800 dark:text-neutral-200 font-semibold">±6.2 mm</span>
          </div>
        </div>
      </div>
    </div>
  );
}
