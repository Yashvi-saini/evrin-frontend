'use client';

import React from 'react';
import { Card, CardHeader, CardTitle } from '@/shared/ui/card';
import { Badge } from '@/shared/ui/badge';
import { CloudRain } from '@/shared/ui/icons';
import { useForecastRepository } from '@/entities/repository';
import { formatRainfall, formatPercentage } from '@/shared/lib/utils';

export function DistrictInspectionWidget() {
  const { activeScenario } = useForecastRepository();
  if (!activeScenario) return null;

  const { forecast, extremes } = activeScenario;
  const isPositiveDelta = forecast.correction.direction === 'INCREASE';

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CloudRain size={14} className="text-sky-400" />
          <span>Target Inspection: {forecast.district.name}, {forecast.district.state}</span>
        </CardTitle>
        <Badge variant="default">{forecast.district.id}</Badge>
      </CardHeader>
      <div className="space-y-3 text-xs">
        <div className="flex justify-between py-1.5 border-b border-slate-800/60 font-mono">
          <span className="text-slate-400">Raw NWP ({forecast.raw.modelName}):</span>
          <span className="text-slate-200 font-semibold">{formatRainfall(forecast.raw.rainfall24h)}</span>
        </div>
        <div className="flex justify-between py-1.5 border-b border-slate-800/60 font-mono">
          <span className="text-slate-400">EVRIN Regime Corrected:</span>
          <span className="text-sky-400 font-bold">{formatRainfall(forecast.corrected.rainfall24h)}</span>
        </div>
        <div className="flex justify-between py-1.5 border-b border-slate-800/60 font-mono">
          <span className="text-slate-400">Regime Delta:</span>
          <span className={`font-semibold ${isPositiveDelta ? 'text-emerald-400' : 'text-amber-400'}`}>
            {forecast.correction.delta24h > 0 ? `+${forecast.correction.delta24h.toFixed(1)} mm` : `${forecast.correction.delta24h.toFixed(1)} mm`} ({forecast.correction.percentageChange > 0 ? `+${forecast.correction.percentageChange}%` : `${forecast.correction.percentageChange}%`})
          </span>
        </div>
        <div className="flex justify-between py-1.5 border-b border-slate-800/60 font-mono">
          <span className="text-slate-400">Heavy Rain P(&gt;64.5mm):</span>
          <span className={`font-bold ${extremes.thresholds.heavyRainProbability > 0.7 ? 'text-red-400' : 'text-slate-300'}`}>
            {formatPercentage(extremes.thresholds.heavyRainProbability)}
          </span>
        </div>
      </div>
    </Card>
  );
}
