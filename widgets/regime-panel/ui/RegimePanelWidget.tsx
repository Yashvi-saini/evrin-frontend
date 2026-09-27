'use client';

import React, { useState, useEffect } from 'react';
import { Badge } from '@/shared/ui/badge';
import { useForecastRepository } from '@/entities/repository';
import { formatPercentage } from '@/shared/lib/utils';

export function RegimePanelWidget() {
  const { activeScenario } = useForecastRepository();
  const [isAnimated, setIsAnimated] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsAnimated(true), 50);
    return () => clearTimeout(timer);
  }, []);

  if (!activeScenario) return null;

  const { regimeDiagnosis } = activeScenario;

  const regimes = [
    { name: 'Active Monsoon', prob: 78, color: 'bg-emerald-500 dark:bg-emerald-400' },
    { name: 'Monsoon Depression', prob: 14, color: 'bg-neutral-400 dark:bg-neutral-500' },
    { name: 'Orographic Convection', prob: 5, color: 'bg-amber-500' },
    { name: 'Monsoon Break', prob: 3, color: 'bg-neutral-300 dark:bg-neutral-700' },
  ];

  return (
    <div className="bg-white dark:bg-[#141414] border border-neutral-200 dark:border-[#262626] rounded-lg p-3.5 text-xs select-none transition-colors shadow-sm">
      {/* Header matching Image 2 */}
      <div className="flex items-center justify-between pb-2 border-b border-neutral-200 dark:border-[#262626] mb-3">
        <span className="text-[10px] text-neutral-500 dark:text-neutral-400 uppercase tracking-wider font-semibold">
          Atmospheric Regime Diagnosis
        </span>
        <Badge variant="pill-subtle" className="text-[9px]">
          MoE CLASSIFIER
        </Badge>
      </div>

      {/* Primary Regime Banner */}
      <div className="flex items-baseline justify-between mb-1">
        <div className="text-sm font-bold text-neutral-900 dark:text-white uppercase tracking-tight">
          {regimeDiagnosis.primaryRegimeName}
        </div>
        <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
          {formatPercentage(regimeDiagnosis.confidence)}
        </div>
      </div>
      <p className="text-[10px] text-neutral-500 dark:text-neutral-400 mb-3 leading-tight">
        Synoptic Low-Level Jet & Deep Tropospheric Moisture
      </p>

      {/* 4 Horizontal Progress Bars */}
      <div className="space-y-2 mb-3">
        {regimes.map((r) => (
          <div key={r.name} className="flex items-center gap-2 text-[10px]">
            <span className="w-24 sm:w-36 text-neutral-600 dark:text-neutral-400 truncate shrink-0">{r.name}</span>
            <div className="flex-1 bg-neutral-100 dark:bg-[#1f1f1f] rounded-full h-1.5 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-1000 ease-out ${r.color}`}
                style={{ width: isAnimated ? `${r.prob}%` : '0%' }}
              />
            </div>
            <span className="w-8 text-right text-neutral-800 dark:text-neutral-200 font-medium shrink-0">{r.prob}%</span>
          </div>
        ))}
      </div>

      {/* Transition Timeline */}
      <div className="pt-2 border-t border-neutral-200 dark:border-[#262626]">
        <div className="text-[9px] uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-1.5 font-semibold">
          Regime Transition Timeline
        </div>
        <div className="p-2 rounded bg-neutral-50 dark:bg-[#1a1a1a] border border-neutral-200 dark:border-[#262626] flex flex-wrap sm:flex-nowrap gap-1.5 items-center justify-between text-[10px]">
          <span className="text-neutral-500 dark:text-neutral-400">PAST (Break)</span>
          <span className="text-neutral-400 dark:text-neutral-600 hidden sm:inline">───</span>
          <span className="text-emerald-600 dark:text-emerald-400 font-semibold bg-transparent px-2 py-0.5 rounded-full border border-emerald-500/40">
            [NOW: Transition 81%]
          </span>
          <span className="text-neutral-400 dark:text-neutral-600 hidden sm:inline">───</span>
          <span className="text-neutral-700 dark:text-neutral-300">NEXT 72H (Active 78%)</span>
        </div>
      </div>
    </div>
  );
}
