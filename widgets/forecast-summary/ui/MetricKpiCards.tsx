'use client';

import React from 'react';
import { Card } from '@/shared/ui/card';
import { Badge } from '@/shared/ui/badge';
import { ArrowUpRight, ArrowDownRight } from '@/shared/ui/icons';
import { useForecastRepository } from '@/entities/repository';
import { formatRainfall, formatPercentage } from '@/shared/lib/utils';

export function MetricKpiCards() {
  const { activeScenario } = useForecastRepository();
  if (!activeScenario) return null;

  const { forecast, regimeDiagnosis, extremes } = activeScenario;
  const isPositiveDelta = forecast.correction.direction === 'INCREASE';

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* KPI 1: Current Regime */}
      <Card>
        <div className="flex items-center justify-between text-xs text-slate-400 font-mono mb-2">
          <span>CURRENT REGIME</span>
          <Badge variant="regime">CONF {formatPercentage(regimeDiagnosis.confidence)}</Badge>
        </div>
        <div className="text-xl font-bold text-sky-400 tracking-tight uppercase">
          {regimeDiagnosis.primaryRegimeName}
        </div>
        <div className="text-xs text-slate-400 mt-1 font-mono truncate">
          {regimeDiagnosis.atmosphericDrivers.lowLevelMoistureFlux} moisture flux
        </div>
      </Card>

      {/* KPI 2: Heavy Rainfall Risk */}
      <Card>
        <div className="flex items-center justify-between text-xs text-slate-400 font-mono mb-2">
          <span>HEAVY RAIN RISK</span>
          <Badge variant={extremes.thresholds.heavyRainProbability > 0.7 ? 'danger' : 'info'}>
            {extremes.thresholds.heavyRainProbability > 0.7 ? 'HIGH RISK' : 'LOW RISK'}
          </Badge>
        </div>
        <div className="text-xl font-bold text-red-400 tracking-tight">
          {formatRainfall(forecast.corrected.rainfall24h)} / 24h
        </div>
        <div className="text-xs text-slate-400 mt-1 font-mono">
          P(Rain &gt; 64.5mm): {formatPercentage(extremes.thresholds.heavyRainProbability)}
        </div>
      </Card>

      {/* KPI 3: Correction Impact */}
      <Card>
        <div className="flex items-center justify-between text-xs text-slate-400 font-mono mb-2">
          <span>CORRECTION IMPACT</span>
          <Badge variant={isPositiveDelta ? 'info' : 'warning'}>
            {forecast.correction.percentageChange > 0 ? `+${forecast.correction.percentageChange.toFixed(1)}%` : `${forecast.correction.percentageChange.toFixed(1)}%`}
          </Badge>
        </div>
        <div className="flex items-center gap-1.5">
          <span className={`text-xl font-bold tracking-tight ${isPositiveDelta ? 'text-emerald-400' : 'text-amber-400'}`}>
            {forecast.correction.delta24h > 0 ? `+${forecast.correction.delta24h.toFixed(1)} mm` : `${forecast.correction.delta24h.toFixed(1)} mm`}
          </span>
          {isPositiveDelta ? (
            <ArrowUpRight size={18} className="text-emerald-400" />
          ) : (
            <ArrowDownRight size={18} className="text-amber-400" />
          )}
        </div>
        <div className="text-xs text-slate-400 mt-1 font-mono truncate">
          Raw: {forecast.raw.rainfall24h}mm → EVRIN: {forecast.corrected.rainfall24h}mm
        </div>
      </Card>

      {/* KPI 4: Forecast Confidence */}
      <Card>
        <div className="flex items-center justify-between text-xs text-slate-400 font-mono mb-2">
          <span>FORECAST CONFIDENCE</span>
          <Badge variant="success">{forecast.corrected.uncertainty.confidenceGrade}</Badge>
        </div>
        <div className="text-xl font-bold text-slate-100 tracking-tight font-mono">
          {formatPercentage(forecast.corrected.uncertainty.confidenceLevel)}
        </div>
        <div className="text-xs text-slate-400 mt-1 font-mono">
          P10-P90 Spread: {forecast.corrected.uncertainty.lowerBound}–{forecast.corrected.uncertainty.upperBound} mm
        </div>
      </Card>
    </div>
  );
}
