'use client';

import React from 'react';
import { Card, CardHeader, CardTitle } from '@/shared/ui/card';
import { Badge } from '@/shared/ui/badge';
import { CloudRain, Compass, AlertTriangle, ShieldAlert, ArrowUpRight, ArrowDownRight, RefreshCw } from '@/shared/ui/icons';
import { useForecastRepository } from '@/entities/repository';
import { formatRainfall, formatPercentage } from '@/shared/lib/utils';

export default function OverviewPage() {
  const { activeScenario, isLoading, isProcessingEvrin } = useForecastRepository();

  if (isLoading || !activeScenario) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-slate-400 gap-3 font-mono text-xs">
        <RefreshCw size={24} className="animate-spin text-sky-400" />
        <span>Loading operational scenario data...</span>
      </div>
    );
  }

  const { forecast, regimeDiagnosis, extremes } = activeScenario;
  const isPositiveDelta = forecast.correction.direction === 'INCREASE';

  return (
    <div className="space-y-6">
      {/* Processing Overlay Notice when Running EVRIN */}
      {isProcessingEvrin && (
        <div className="p-3 rounded-lg bg-sky-950/60 border border-sky-800/80 text-xs text-sky-200 flex items-center justify-between animate-pulse">
          <div className="flex items-center gap-2">
            <RefreshCw size={15} className="animate-spin text-sky-400" />
            <span className="font-mono font-medium">Running EVRIN AI Post-Processing Pipeline...</span>
          </div>
          <span className="font-mono text-[11px] text-sky-400">Step 4/7: Calibrating Extreme Tail</span>
        </div>
      )}

      {/* KPI Cards Row */}
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

      {/* Main Map & Inspection Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map Area */}
        <Card className="lg:col-span-2 min-h-[480px] flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Compass size={14} className="text-sky-400" />
              <span>India Rainfall Intelligence Map (GIS View)</span>
            </CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant="info">Layer: EVRIN Corrected</Badge>
              <Badge variant="regime">{activeScenario.selectedDistrict.state}</Badge>
            </div>
          </CardHeader>
          <div className="flex-1 rounded-md border border-slate-800/80 bg-slate-950/70 flex flex-col items-center justify-center p-8 text-center">
            <Compass size={44} className="text-sky-500/60 animate-pulse mb-3" />
            <div className="text-sm font-semibold text-slate-200">
              {activeScenario.name} Simulation — {activeScenario.selectedDistrict.name}, {activeScenario.selectedDistrict.state}
            </div>
            <div className="text-xs text-slate-400 max-w-sm mt-1 font-mono">
              Coordinates: {activeScenario.selectedDistrict.coordinates.lat}°N, {activeScenario.selectedDistrict.coordinates.lng}°E
            </div>
            <div className="mt-4 flex gap-2">
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300">
                Valid: {forecast.validTime}
              </span>
            </div>
          </div>
        </Card>

        {/* Target Inspection Panel */}
        <div className="space-y-4">
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

          {/* Correction Drivers (Explainability) */}
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
        </div>
      </div>
    </div>
  );
}
