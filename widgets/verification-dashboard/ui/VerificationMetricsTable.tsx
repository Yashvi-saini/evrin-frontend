'use client';

import React from 'react';
import { Card, CardHeader, CardTitle } from '@/shared/ui/card';
import { ShieldAlert } from '@/shared/ui/icons';
import { useForecastRepository } from '@/entities/repository';

export function VerificationMetricsTable() {
  const { activeScenario } = useForecastRepository();
  if (!activeScenario) return null;

  const { verification } = activeScenario;
  const metricsList = Object.values(verification.overallMetrics);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShieldAlert size={15} className="text-sky-400" />
          <span>Operational Skill Comparison (Raw NWP vs EVRIN)</span>
        </CardTitle>
      </CardHeader>
      <div className="overflow-x-auto">
        <table className="w-full text-xs font-mono">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 text-left">
              <th className="pb-2">Metric</th>
              <th className="pb-2 text-right">Raw NWP</th>
              <th className="pb-2 text-right">EVRIN Corrected</th>
              <th className="pb-2 text-right">Skill Gain</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {metricsList.map((m) => (
              <tr key={m.name} className="hover:bg-slate-900/40">
                <td className="py-3 font-sans font-medium text-slate-200">
                  {m.name} {m.unit && `(${m.unit})`}
                </td>
                <td className="py-3 text-right text-slate-400">
                  {m.rawNwp} {m.unit}
                </td>
                <td className="py-3 text-right text-sky-400 font-bold">
                  {m.evrin} {m.unit}
                </td>
                <td className="py-3 text-right text-emerald-400 font-semibold">
                  {m.improvementPercentage > 0 ? `+${m.improvementPercentage}%` : `${m.improvementPercentage}%`}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
