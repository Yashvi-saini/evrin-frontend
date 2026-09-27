'use client';

import React from 'react';
import { Card, CardHeader, CardTitle } from '@/shared/ui/card';
import { Badge } from '@/shared/ui/badge';
import { Info, ShieldAlert, RefreshCw } from '@/shared/ui/icons';
import { useForecastRepository } from '@/entities/repository';

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
  const metricsList = Object.values(verification.overallMetrics);

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
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShieldAlert size={15} className="text-sky-400" />
            <span>Operational Skill Comparison (Raw NWP vs EVRIN)</span>
          </CardTitle>
        </CardHeader>
        <div className="overflow-x-auto">
          <table className="w-full text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 text-left">
                <th className="pb-2">Metric</th>
                <th className="pb-2 text-right">Raw NWP</th>
                <th className="pb-2 text-right">EVRIN Corrected</th>
                <th className="pb-2 text-right">Skill Gain</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {metricsList.map((m) => (
                <tr key={m.name} className="hover:bg-slate-900/40">
                  <td className="py-3 font-sans font-medium text-slate-200">
                    {m.name} {m.unit && `(${m.unit})`}
                  </td>
                  <td className="py-3 text-right text-slate-400">
                    {m.rawNwp} {m.unit}
                  </td>
                  <td className="py-3 text-right text-sky-400 font-bold">
                    {m.evrin} {m.unit}
                  </td>
                  <td className="py-3 text-right text-emerald-400 font-semibold">
                    {m.improvementPercentage > 0 ? `+${m.improvementPercentage}%` : `${m.improvementPercentage}%`}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Regime-Stratified Skill Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Regime-Stratified Critical Success Index (CSI Skill Gain)</CardTitle>
        </CardHeader>
        <div className="overflow-x-auto">
          <table className="w-full text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 text-left">
                <th className="pb-2">Weather Regime</th>
                <th className="pb-2 text-right">Sample Events</th>
                <th className="pb-2 text-right">Raw NWP CSI</th>
                <th className="pb-2 text-right">EVRIN CSI</th>
                <th className="pb-2 text-right">Absolute CSI Gain</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {verification.regimeWiseSkill.map((rs) => (
                <tr key={rs.regimeId} className="hover:bg-slate-900/40">
                  <td className="py-2.5 font-sans font-medium text-slate-200">{rs.regimeName}</td>
                  <td className="py-2.5 text-right text-slate-400">{rs.sampleEventCount}</td>
                  <td className="py-2.5 text-right text-slate-400">{rs.rawNwpCsi.toFixed(2)}</td>
                  <td className="py-2.5 text-right text-sky-400 font-bold">{rs.evrinCsi.toFixed(2)}</td>
                  <td className="py-2.5 text-right text-emerald-400 font-semibold">+{rs.skillGain.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
