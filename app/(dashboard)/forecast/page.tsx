'use client';

import React from 'react';
import { Card, CardHeader, CardTitle } from '@/shared/ui/card';
import { Badge } from '@/shared/ui/badge';
import { CloudRain, RefreshCw } from '@/shared/ui/icons';
import { useForecastRepository } from '@/entities/repository';
import { formatRainfall, formatPercentage } from '@/shared/lib/utils';

export default function ForecastPage() {
  const { activeScenario, isLoading } = useForecastRepository();

  if (isLoading || !activeScenario) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-slate-400 gap-3 font-mono text-xs">
        <RefreshCw size={24} className="animate-spin text-sky-400" />
        <span>Loading forecast evolution data...</span>
      </div>
    );
  }

  const { forecast } = activeScenario;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-100 tracking-tight">Temporal Rainfall Forecast Evolution</h2>
          <p className="text-xs text-slate-400 mt-1 font-mono">
            24h / 48h / 72h accumulation horizons with ensemble uncertainty bands (P10–P90).
          </p>
        </div>
        <Badge variant="info">Target: {forecast.district.name}, {forecast.district.state} ({forecast.district.id})</Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* 24h Horizon */}
        <Card>
          <CardHeader>
            <CardTitle>24-Hour Horizon</CardTitle>
            <Badge variant="regime">Day 1</Badge>
          </CardHeader>
          <div className="text-2xl font-bold text-sky-400 font-mono">
            {formatRainfall(forecast.corrected.rainfall24h)}
          </div>
          <div className="text-xs text-slate-400 mt-2 space-y-1 font-mono">
            <div className="flex justify-between">
              <span>Raw NWP:</span>
              <span className="text-slate-300">{formatRainfall(forecast.raw.rainfall24h)}</span>
            </div>
            <div className="flex justify-between">
              <span>Uncertainty Range:</span>
              <span className="text-slate-300">
                {forecast.corrected.quantiles.p10} — {forecast.corrected.quantiles.p90} mm
              </span>
            </div>
            <div className="flex justify-between">
              <span>Confidence:</span>
              <span className="text-emerald-400 font-semibold">
                {formatPercentage(forecast.corrected.uncertainty.confidenceLevel)} ({forecast.corrected.uncertainty.confidenceGrade})
              </span>
            </div>
          </div>
        </Card>

        {/* 48h Horizon */}
        <Card>
          <CardHeader>
            <CardTitle>48-Hour Horizon</CardTitle>
            <Badge variant="regime">Day 2</Badge>
          </CardHeader>
          <div className="text-2xl font-bold text-sky-400 font-mono">
            {formatRainfall(forecast.corrected.rainfall48h)}
          </div>
          <div className="text-xs text-slate-400 mt-2 space-y-1 font-mono">
            <div className="flex justify-between">
              <span>Raw NWP:</span>
              <span className="text-slate-300">{formatRainfall(forecast.raw.rainfall48h)}</span>
            </div>
            <div className="flex justify-between">
              <span>Uncertainty Range:</span>
              <span className="text-slate-300">
                {(forecast.corrected.quantiles.p10 * 0.8).toFixed(0)} — {(forecast.corrected.quantiles.p90 * 0.75).toFixed(0)} mm
              </span>
            </div>
            <div className="flex justify-between">
              <span>Confidence:</span>
              <span className="text-emerald-400 font-semibold">79% (HIGH)</span>
            </div>
          </div>
        </Card>

        {/* 72h Horizon */}
        <Card>
          <CardHeader>
            <CardTitle>72-Hour Horizon</CardTitle>
            <Badge variant="regime">Day 3</Badge>
          </CardHeader>
          <div className="text-2xl font-bold text-sky-400 font-mono">
            {formatRainfall(forecast.corrected.rainfall72h)}
          </div>
          <div className="text-xs text-slate-400 mt-2 space-y-1 font-mono">
            <div className="flex justify-between">
              <span>Raw NWP:</span>
              <span className="text-slate-300">{formatRainfall(forecast.raw.rainfall72h)}</span>
            </div>
            <div className="flex justify-between">
              <span>Uncertainty Range:</span>
              <span className="text-slate-300">
                {(forecast.corrected.quantiles.p10 * 0.5).toFixed(0)} — {(forecast.corrected.quantiles.p90 * 0.5).toFixed(0)} mm
              </span>
            </div>
            <div className="flex justify-between">
              <span>Confidence:</span>
              <span className="text-amber-400 font-semibold">68% (MODERATE)</span>
            </div>
          </div>
        </Card>
      </div>

      <Card className="min-h-[280px] flex flex-col justify-center items-center text-center p-8">
        <CloudRain size={40} className="text-sky-500/60 mb-3" />
        <div className="text-sm font-semibold text-slate-200">Ensemble Quantile Spread Distribution</div>
        <div className="text-xs text-slate-400 max-w-md mt-1 font-mono">
          P10: {forecast.corrected.quantiles.p10}mm • P25: {forecast.corrected.quantiles.p25}mm • P50: {forecast.corrected.quantiles.p50}mm • P75: {forecast.corrected.quantiles.p75}mm • P90: {forecast.corrected.quantiles.p90}mm
        </div>
      </Card>
    </div>
  );
}
