'use client';

import React from 'react';
import { Card, CardHeader, CardTitle } from '@/shared/ui/card';
import { Badge } from '@/shared/ui/badge';
import { Progress } from '@/shared/ui/progress';
import { BarChart3, RefreshCw } from '@/shared/ui/icons';
import { useForecastRepository } from '@/entities/repository';
import { formatPercentage } from '@/shared/lib/utils';

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

  const colorMap = {
    'active-monsoon': 'sky' as const,
    'break-monsoon': 'amber' as const,
    'monsoon-depression': 'indigo' as const,
    'orographic-convection': 'emerald' as const,
    'coastal-rainfall': 'sky' as const,
    'western-disturbance': 'amber' as const,
    'transition-mixed': 'indigo' as const,
  };

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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Regime Probabilities */}
        <Card>
          <CardHeader>
            <CardTitle>Regime Probabilities</CardTitle>
          </CardHeader>
          <div className="space-y-4">
            {regimeDiagnosis.probabilities.map((r) => (
              <div key={r.regimeId} className="space-y-1.5">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-200 font-medium">{r.name}</span>
                  <span className="text-slate-400">{formatPercentage(r.probability)}</span>
                </div>
                <Progress value={Math.round(r.probability * 100)} color={colorMap[r.regimeId] || 'sky'} />
              </div>
            ))}
          </div>
        </Card>

        {/* Synoptic Atmospheric Drivers */}
        <Card>
          <CardHeader>
            <CardTitle>Synoptic Atmospheric Drivers</CardTitle>
          </CardHeader>
          <div className="space-y-3 text-xs">
            <div className="p-3 rounded bg-slate-950/60 border border-slate-800/60 flex justify-between items-center">
              <div>
                <div className="font-semibold text-slate-200">Monsoon Trough Axis</div>
                <div className="text-[11px] text-slate-400">Position relative to normal synoptic climatology</div>
              </div>
              <Badge variant="info">{regimeDiagnosis.atmosphericDrivers.monsoonTroughPosition}</Badge>
            </div>

            <div className="p-3 rounded bg-slate-950/60 border border-slate-800/60 flex justify-between items-center">
              <div>
                <div className="font-semibold text-slate-200">Low-Level Moisture Flux (850 hPa)</div>
                <div className="text-[11px] text-slate-400">Integrated water vapor transport vector</div>
              </div>
              <Badge variant="success">{regimeDiagnosis.atmosphericDrivers.lowLevelMoistureFlux}</Badge>
            </div>

            <div className="p-3 rounded bg-slate-950/60 border border-slate-800/60 flex justify-between items-center">
              <div>
                <div className="font-semibold text-slate-200">Mid-Tropospheric Vorticity</div>
                <div className="text-[11px] text-slate-400">Curvature & cyclonic spin over subcontinent</div>
              </div>
              <Badge variant="regime">{regimeDiagnosis.atmosphericDrivers.vorticity850hPa}</Badge>
            </div>
          </div>
        </Card>
      </div>

      {/* Regime Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Regime Transition Evolution (Past 48h to Next 72h)</CardTitle>
        </CardHeader>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
          {regimeDiagnosis.timeline.map((tp) => (
            <div
              key={tp.timestamp}
              className={`p-3 rounded-lg border text-center font-mono ${
                tp.isCurrent
                  ? 'bg-sky-950/60 border-sky-600 text-sky-200 ring-1 ring-sky-500'
                  : 'bg-slate-950/40 border-slate-800/80 text-slate-400'
              }`}
            >
              <div className="text-[10px] text-slate-500">{tp.timestamp}</div>
              <div className="text-xs font-semibold text-slate-200 mt-1 truncate">{tp.name}</div>
              <div className="text-[11px] text-sky-400 mt-0.5">{formatPercentage(tp.confidence)}</div>
              {tp.isCurrent && (
                <div className="mt-1 text-[9px] bg-sky-500/20 text-sky-300 py-0.5 rounded font-bold uppercase">
                  Current
                </div>
              )}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
