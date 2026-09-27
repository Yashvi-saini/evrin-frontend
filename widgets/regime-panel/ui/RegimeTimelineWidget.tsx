'use client';

import React from 'react';
import { Card, CardHeader, CardTitle } from '@/shared/ui/card';
import { useForecastRepository } from '@/entities/repository';
import { formatPercentage } from '@/shared/lib/utils';

export function RegimeTimelineWidget() {
  const { activeScenario } = useForecastRepository();
  if (!activeScenario) return null;

  const { regimeDiagnosis } = activeScenario;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xs">
          Regime Transition Timeline (Past 48h to Next 72h)
        </CardTitle>
      </CardHeader>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5">
        {regimeDiagnosis.timeline.map((tp) => (
          <div
            key={tp.timestamp}
            className={`p-2.5 rounded-lg border text-center font-mono ${
              tp.isCurrent
                ? 'bg-sky-950/60 border-sky-500/80 text-sky-200 ring-1 ring-sky-500'
                : 'bg-slate-950/40 border-slate-800/80 text-slate-400'
            }`}
          >
            <div className="text-[10px] text-slate-500">{tp.timestamp}</div>
            <div className="text-xs font-semibold text-slate-200 mt-1 truncate">{tp.name}</div>
            <div className="text-[11px] text-sky-400 mt-0.5">{formatPercentage(tp.confidence)}</div>
            {tp.isCurrent && (
              <div className="mt-1 text-[9px] bg-sky-500/20 text-sky-300 py-0.5 rounded font-bold uppercase">
                Active State
              </div>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
}
