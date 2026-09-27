'use client';

import React from 'react';
import { Badge } from '@/shared/ui/badge';
import { Info, RefreshCw } from '@/shared/ui/icons';
import { useForecastRepository } from '@/entities/repository';
import { VerificationMetricsTable, RegimeSkillTable } from '@/widgets/verification-dashboard';

export default function VerificationPage() {
  const { activeScenario, isLoading } = useForecastRepository();

  if (isLoading || !activeScenario) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-slate-400 gap-3 font-mono text-xs">
        <RefreshCw size={24} className="animate-spin text-sky-400" />
        <span>Loading verification skill scores...</span>
      </div>
    );
  }

  const { verification } = activeScenario;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-100 tracking-tight">Scientific Model Verification</h2>
          <p className="text-xs text-slate-400 mt-1 font-mono">
            Standard IMD/WMO verification metrics evaluating EVRIN post-processing against raw NWP forecasts.
          </p>
        </div>
        <Badge variant="warning" className="flex items-center gap-1 font-mono">
          <Info size={12} className="text-amber-400" />
          <span>Simulated Prototype Data</span>
        </Badge>
      </div>

      {/* Honesty Banner */}
      <div className="p-3.5 rounded-lg bg-amber-950/20 border border-amber-800/40 text-xs text-amber-200/90 flex items-start gap-2.5">
        <Info size={16} className="text-amber-400 shrink-0 mt-0.5" />
        <div>
          <div className="font-semibold text-amber-300">Prototype Honesty Notice</div>
          <div className="text-[11px] text-amber-200/70 mt-0.5">
            The verification scores below reflect benchmark targets calibrated for monsoon season demo evaluation ({verification.evaluationPeriod}). In Stage B, these will be populated from live hindcast validation pipelines against observed IMD gridded rainfall.
          </div>
        </div>
      </div>

      {/* Main Metric Comparison Table */}
      <VerificationMetricsTable />

      {/* Regime-Stratified Skill Breakdown */}
      <RegimeSkillTable />
    </div>
  );
}
