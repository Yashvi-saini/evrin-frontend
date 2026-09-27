'use client';

import React from 'react';
import { Card, CardHeader, CardTitle } from '@/shared/ui/card';
import { Badge } from '@/shared/ui/badge';
import { AlertTriangle, RefreshCw } from '@/shared/ui/icons';
import { useForecastRepository } from '@/entities/repository';
import { formatPercentage, formatRainfall } from '@/shared/lib/utils';

export default function ExtremesPage() {
  const { activeScenario, isLoading } = useForecastRepository();

  if (isLoading || !activeScenario) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-slate-400 gap-3 font-mono text-xs">
        <RefreshCw size={24} className="animate-spin text-sky-400" />
        <span>Loading operational extremes data...</span>
      </div>
    );
  }

  const { extremes } = activeScenario;

  const getCategoryBadge = (cat: string) => {
    switch (cat) {
      case 'WARNING':
        return 'danger' as const;
      case 'ALERT':
        return 'warning' as const;
      case 'WATCH':
        return 'info' as const;
      default:
        return 'success' as const;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-100 tracking-tight">Extreme Rainfall & Operational Risk</h2>
          <p className="text-xs text-slate-400 mt-1 font-mono">
            Calibrated probability of exceeding IMD operational thresholds (64.5 mm, 115.5 mm, 204.4 mm).
          </p>
        </div>
        <Badge variant={extremes.thresholds.heavyRainProbability > 0.7 ? 'danger' : 'info'}>
          {extremes.thresholds.heavyRainProbability > 0.7 ? 'Active Severe Weather Alert' : 'Normal Operational Tier'}
        </Badge>
      </div>

      {/* Advisory Banner */}
      <div className="p-3.5 rounded-lg bg-red-950/20 border border-red-800/40 text-xs text-red-200/90 flex items-start gap-2.5">
        <AlertTriangle size={16} className="text-red-400 shrink-0 mt-0.5" />
        <div>
          <div className="font-semibold text-red-300">Synoptic Operational Advisory</div>
          <div className="text-[11px] text-red-200/70 mt-0.5 font-mono">
            {extremes.synopticWarning}
          </div>
        </div>
      </div>

      {/* Operational Threshold Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Heavy Rain (&gt; 64.5 mm)</CardTitle>
            <Badge variant="danger">
              P: {formatPercentage(extremes.thresholds.heavyRainProbability)}
            </Badge>
          </CardHeader>
          <div className="text-xs text-slate-400">
            Probability of localized flooding, urban waterlogging, and traffic disruption.
          </div>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Very Heavy Rain (&gt; 115.5 mm)</CardTitle>
            <Badge variant="warning">
              P: {formatPercentage(extremes.thresholds.veryHeavyRainProbability)}
            </Badge>
          </CardHeader>
          <div className="text-xs text-slate-400">
            Elevated threat for catchment runoff and agricultural inundation.
          </div>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Extremely Heavy (&gt; 204.4 mm)</CardTitle>
            <Badge variant="info">
              P: {formatPercentage(extremes.thresholds.extremelyHeavyRainProbability)}
            </Badge>
          </CardHeader>
          <div className="text-xs text-slate-400">
            Critical threshold for severe inundation and rapid hydro-meteorological response.
          </div>
        </Card>
      </div>

      {/* Ranked High-Risk District Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle size={15} className="text-amber-400" />
            <span>High-Risk District Exceedance Table ({activeScenario.name})</span>
          </CardTitle>
        </CardHeader>
        <div className="overflow-x-auto">
          <table className="w-full text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 text-left">
                <th className="pb-2">District</th>
                <th className="pb-2">State</th>
                <th className="pb-2">Expected 24h Rain</th>
                <th className="pb-2">P(&gt;64.5 mm)</th>
                <th className="pb-2">Prevailing Regime</th>
                <th className="pb-2">IMD Warning Level</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {extremes.highRiskDistricts.map((d) => (
                <tr key={d.district.id} className="hover:bg-slate-900/40">
                  <td className="py-2.5 font-sans font-semibold text-slate-200">{d.district.name}</td>
                  <td className="py-2.5 text-slate-400 font-sans">{d.district.state}</td>
                  <td className="py-2.5 text-sky-400 font-semibold">{formatRainfall(d.expectedRainfall)}</td>
                  <td className="py-2.5 text-amber-400">{formatPercentage(d.heavyRiskProbability)}</td>
                  <td className="py-2.5 text-slate-400 capitalize">{d.prevailingRegime.replace('-', ' ')}</td>
                  <td className="py-2.5">
                    <Badge variant={getCategoryBadge(d.riskCategory)}>{d.riskCategory}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
