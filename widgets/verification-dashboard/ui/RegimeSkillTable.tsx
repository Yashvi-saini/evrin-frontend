'use client';

import React from 'react';
import { Card, CardHeader, CardTitle } from '@/shared/ui/card';
import { useForecastRepository } from '@/entities/repository';

export function RegimeSkillTable() {
  const { activeScenario } = useForecastRepository();
  if (!activeScenario) return null;

  const { verification } = activeScenario;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Regime-Stratified Critical Success Index (CSI Skill Gain)</CardTitle>
      </CardHeader>
      <div className="overflow-x-auto">
        <table className="w-full text-xs font-mono">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 text-left">
              <th className="pb-2">Weather Regime</th>
              <th className="pb-2 text-right">Sample Events</th>
              <th className="pb-2 text-right">Raw NWP CSI</th>
              <th className="pb-2 text-right">EVRIN CSI</th>
              <th className="pb-2 text-right">Absolute CSI Gain</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {verification.regimeWiseSkill.map((rs) => (
              <tr key={rs.regimeId} className="hover:bg-slate-900/40">
                <td className="py-2.5 font-sans font-medium text-slate-200">{rs.regimeName}</td>
                <td className="py-2.5 text-right text-slate-400">{rs.sampleEventCount}</td>
                <td className="py-2.5 text-right text-slate-400">{rs.rawNwpCsi.toFixed(2)}</td>
                <td className="py-2.5 text-right text-sky-400 font-bold">{rs.evrinCsi.toFixed(2)}</td>
                <td className="py-2.5 text-right text-emerald-400 font-semibold">+{rs.skillGain.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
