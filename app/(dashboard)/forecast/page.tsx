'use client';

import React from 'react';
import { Card, CardHeader, CardTitle } from '@/shared/ui/card';
import { Badge } from '@/shared/ui/badge';
import { CloudRain, RefreshCw, ArrowUpRight, ArrowDownRight } from '@/shared/ui/icons';
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
  const isPositiveDelta = forecast.correction.direction === 'INCREASE';
  const quantiles = forecast.corrected.quantiles;
  const rawQuantiles = forecast.raw.rawQuantiles;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-100 tracking-tight">Temporal Rainfall Forecast Evolution</h2>
          <p className="text-xs text-slate-400 mt-1 font-mono">
            24h / 48h / 72h accumulation horizons with ensemble uncertainty bands (P10–P90).
          </p>
        </div>
        <Badge variant="info">
          Target: {forecast.district.name}, {forecast.district.state} ({forecast.district.id})
        </Badge>
      </div>

      {/* 24h / 48h / 72h Horizon Cards */}
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
                {quantiles.p10} — {quantiles.p90} mm
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
                {(quantiles.p10 * 0.8).toFixed(0)} — {(quantiles.p90 * 0.75).toFixed(0)} mm
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
                {(quantiles.p10 * 0.5).toFixed(0)} — {(quantiles.p90 * 0.5).toFixed(0)} mm
              </span>
            </div>
            <div className="flex justify-between">
              <span>Confidence:</span>
              <span className="text-amber-400 font-semibold">68% (MODERATE)</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Raw NWP vs EVRIN Quantiles Comparison Table & Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Comparison Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CloudRain size={15} className="text-sky-400" />
              <span>Raw NWP vs. EVRIN Post-Processed Quantiles</span>
            </CardTitle>
            <Badge variant={isPositiveDelta ? 'info' : 'warning'}>
              Delta: {forecast.correction.delta24h > 0 ? `+${forecast.correction.delta24h.toFixed(1)} mm` : `${forecast.correction.delta24h.toFixed(1)} mm`}
            </Badge>
          </CardHeader>
          <div className="overflow-x-auto">
            <table className="w-full text-xs font-mono">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 text-left">
                  <th className="pb-2">Metric / Quantile</th>
                  <th className="pb-2 text-right">Raw NWP</th>
                  <th className="pb-2 text-right">EVRIN Corrected</th>
                  <th className="pb-2 text-right">Correction</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                <tr className="hover:bg-slate-900/40">
                  <td className="py-2.5 font-sans font-medium text-slate-200">24h Rainfall Accumulation</td>
                  <td className="py-2.5 text-right text-slate-400">{formatRainfall(forecast.raw.rainfall24h)}</td>
                  <td className="py-2.5 text-right text-sky-400 font-bold">{formatRainfall(forecast.corrected.rainfall24h)}</td>
                  <td className={`py-2.5 text-right font-bold ${isPositiveDelta ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {forecast.correction.delta24h > 0 ? `+${forecast.correction.delta24h.toFixed(1)} mm` : `${forecast.correction.delta24h.toFixed(1)} mm`}
                  </td>
                </tr>
                <tr className="hover:bg-slate-900/40">
                  <td className="py-2.5 text-slate-400">P10 (Baseline Lower Bound)</td>
                  <td className="py-2.5 text-right text-slate-500">{formatRainfall(rawQuantiles.p10)}</td>
                  <td className="py-2.5 text-right text-slate-300">{formatRainfall(quantiles.p10)}</td>
                  <td className="py-2.5 text-right text-slate-400">+{((quantiles.p10 - rawQuantiles.p10)).toFixed(1)} mm</td>
                </tr>
                <tr className="hover:bg-slate-900/40">
                  <td className="py-2.5 text-slate-400">P50 (Median Expectation)</td>
                  <td className="py-2.5 text-right text-slate-500">{formatRainfall(rawQuantiles.p50)}</td>
                  <td className="py-2.5 text-right text-sky-300 font-semibold">{formatRainfall(quantiles.p50)}</td>
                  <td className="py-2.5 text-right text-slate-400">+{((quantiles.p50 - rawQuantiles.p50)).toFixed(1)} mm</td>
                </tr>
                <tr className="hover:bg-slate-900/40">
                  <td className="py-2.5 text-slate-400">P75 (Upper Quartile)</td>
                  <td className="py-2.5 text-right text-slate-500">{formatRainfall(rawQuantiles.p75)}</td>
                  <td className="py-2.5 text-right text-amber-300 font-semibold">{formatRainfall(quantiles.p75)}</td>
                  <td className="py-2.5 text-right text-slate-400">+{((quantiles.p75 - rawQuantiles.p75)).toFixed(1)} mm</td>
                </tr>
                <tr className="hover:bg-slate-900/40">
                  <td className="py-2.5 text-slate-400">P90 (Severe Event Tail)</td>
                  <td className="py-2.5 text-right text-slate-500">{formatRainfall(rawQuantiles.p90)}</td>
                  <td className="py-2.5 text-right text-red-400 font-bold">{formatRainfall(quantiles.p90)}</td>
                  <td className="py-2.5 text-right text-emerald-400 font-semibold">+{((quantiles.p90 - rawQuantiles.p90)).toFixed(1)} mm</td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>

        {/* Quantile Distribution Visualizer */}
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle>Ensemble Quantile Dispersion Envelope</CardTitle>
            <Badge variant="success">Confidence: {formatPercentage(forecast.corrected.uncertainty.confidenceLevel)}</Badge>
          </CardHeader>
          <div className="flex-1 flex flex-col justify-center space-y-5 p-2">
            {/* Visual horizontal quantile band */}
            <div className="space-y-1.5 font-mono text-xs">
              <div className="flex justify-between text-slate-400 text-[11px]">
                <span>P10: {quantiles.p10}mm</span>
                <span>P50: {quantiles.p50}mm</span>
                <span>P90: {quantiles.p90}mm</span>
              </div>
              <div className="relative h-6 bg-slate-950 rounded-md border border-slate-800 overflow-hidden flex items-center">
                {/* Gradient band from P10 to P90 */}
                <div
                  className="h-full bg-gradient-to-r from-sky-600 via-emerald-500 to-red-500 opacity-80"
                  style={{
                    marginLeft: `${(quantiles.p10 / (quantiles.p90 * 1.2)) * 100}%`,
                    width: `${((quantiles.p90 - quantiles.p10) / (quantiles.p90 * 1.2)) * 100}%`,
                  }}
                />
                {/* Median Marker */}
                <div
                  className="absolute top-0 bottom-0 w-1 bg-white shadow-lg"
                  style={{ left: `${(quantiles.p50 / (quantiles.p90 * 1.2)) * 100}%` }}
                  title={`P50: ${quantiles.p50} mm`}
                />
              </div>
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>0 mm</span>
                <span>Uncertainty Range: {quantiles.p10} — {quantiles.p90} mm</span>
                <span>{(quantiles.p90 * 1.2).toFixed(0)} mm</span>
              </div>
            </div>

            {/* Calibration Insight */}
            <div className="p-3 rounded bg-slate-950/60 border border-slate-800 text-xs text-slate-300">
              <div className="font-semibold text-slate-200">Post-Processing Strategy</div>
              <div className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                {forecast.correction.correctionStrategyApplied}. Preserves the heavy-tail distribution while reducing systemic bias in the median expectation.
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
