'use client';

import React from 'react';
import { Card, CardHeader, CardTitle } from '@/shared/ui/card';
import { useForecastRepository } from '@/entities/repository';

export function CorrectionDriversWidget() {
  const { activeScenario } = useForecastRepository();
  if (!activeScenario) return null;

  const { forecast } = activeScenario;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Correction Drivers (Explainability)</CardTitle>
      </CardHeader>
      <div className="space-y-2.5 text-xs">
        {forecast.drivers.map((drv) => (
          <div key={drv.id} className="p-2.5 rounded bg-slate-950/60 border border-slate-800/60">
            <div className="font-semibold text-slate-200 flex items-center justify-between">
              <span>0{drv.order} {drv.title}</span>
              <span className="text-sky-400 font-mono text-[11px]">{drv.weightPercentage}%</span>
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
              {drv.description}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
