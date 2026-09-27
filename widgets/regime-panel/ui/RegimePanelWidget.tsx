'use client';

import React from 'react';
import { Card, CardHeader, CardTitle } from '@/shared/ui/card';
import { Badge } from '@/shared/ui/badge';
import { Progress } from '@/shared/ui/progress';
import { useForecastRepository } from '@/entities/repository';
import { formatPercentage } from '@/shared/lib/utils';

export function RegimePanelWidget() {
  const { activeScenario } = useForecastRepository();
  if (!activeScenario) return null;

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
  );
}
