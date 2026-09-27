'use client';

import React from 'react';
import { Card, CardHeader, CardTitle } from '@/shared/ui/card';
import { Badge } from '@/shared/ui/badge';
import { AlertTriangle } from '@/shared/ui/icons';
import { useForecastRepository } from '@/entities/repository';
import { formatPercentage, formatRainfall } from '@/shared/lib/utils';

export function DistrictRiskTable() {
  const { activeScenario } = useForecastRepository();
  if (!activeScenario) return null;

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
  );
}
