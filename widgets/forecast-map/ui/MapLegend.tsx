'use client';

import React from 'react';
import { MapLayerId } from '../model/types';

export interface MapLegendProps {
  activeLayer: MapLayerId;
}

export function MapLegend({ activeLayer }: MapLegendProps) {
  if (activeLayer === 'regime') {
    const regimes = [
      { label: 'Active Monsoon', color: '#0ea5e9' },
      { label: 'Monsoon Depression', color: '#6366f1' },
      { label: 'Orographic Convection', color: '#10b981' },
      { label: 'Coastal Rainfall', color: '#06b6d4' },
      { label: 'Break Monsoon', color: '#f59e0b' },
    ];

    return (
      <div className="bg-slate-950/80 backdrop-blur border border-slate-800 p-2.5 rounded-md font-mono text-[10px]">
        <div className="text-slate-400 uppercase tracking-wider mb-1.5 font-semibold">Regime Classification</div>
        <div className="flex flex-wrap gap-2.5">
          {regimes.map((r) => (
            <div key={r.label} className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: r.color }} />
              <span className="text-slate-300">{r.label}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (activeLayer === 'difference') {
    return (
      <div className="bg-slate-950/80 backdrop-blur border border-slate-800 p-2.5 rounded-md font-mono text-[10px]">
        <div className="flex items-center justify-between text-slate-400 uppercase tracking-wider mb-1">
          <span>EVRIN Delta (Bias Correction)</span>
          <span className="text-slate-500">mm</span>
        </div>
        <div
          className="h-2.5 w-48 rounded-sm mb-1"
          style={{
            background: 'linear-gradient(to right, #ef4444, #f59e0b, #64748b, #06b6d4, #10b981)',
          }}
        />
        <div className="flex justify-between text-slate-400 text-[9px]">
          <span>-30 mm (Suppression)</span>
          <span>0</span>
          <span>+50 mm (Enhancement)</span>
        </div>
      </div>
    );
  }

  if (activeLayer === 'heavy-rain-prob') {
    return (
      <div className="bg-slate-950/80 backdrop-blur border border-slate-800 p-2.5 rounded-md font-mono text-[10px]">
        <div className="flex items-center justify-between text-slate-400 uppercase tracking-wider mb-1">
          <span>P(Rain &gt; 64.5 mm)</span>
          <span className="text-slate-500">%</span>
        </div>
        <div
          className="h-2.5 w-48 rounded-sm mb-1"
          style={{
            background: 'linear-gradient(to right, #1e293b, #22c55e, #eab308, #f97316, #ef4444)',
          }}
        />
        <div className="flex justify-between text-slate-400 text-[9px]">
          <span>0%</span>
          <span>25%</span>
          <span>50%</span>
          <span>75%</span>
          <span>&gt;90%</span>
        </div>
      </div>
    );
  }

  if (activeLayer === 'uncertainty') {
    return (
      <div className="bg-slate-950/80 backdrop-blur border border-slate-800 p-2.5 rounded-md font-mono text-[10px]">
        <div className="flex items-center justify-between text-slate-400 uppercase tracking-wider mb-1">
          <span>Uncertainty Spread (P90 - P10)</span>
          <span className="text-slate-500">mm</span>
        </div>
        <div
          className="h-2.5 w-48 rounded-sm mb-1"
          style={{
            background: 'linear-gradient(to right, #0284c7, #38bdf8, #a855f7, #ec4899)',
          }}
        />
        <div className="flex justify-between text-slate-400 text-[9px]">
          <span>10 mm (High Conf.)</span>
          <span>50 mm</span>
          <span>&gt;120 mm (High Spread)</span>
        </div>
      </div>
    );
  }

  // Default: Rainfall accumulation (Raw NWP or EVRIN Corrected)
  return (
    <div className="bg-slate-950/80 backdrop-blur border border-slate-800 p-2.5 rounded-md font-mono text-[10px]">
      <div className="flex items-center justify-between text-slate-400 uppercase tracking-wider mb-1">
        <span>24h Rainfall Accumulation</span>
        <span className="text-slate-500">mm</span>
      </div>
      <div
        className="h-2.5 w-48 rounded-sm mb-1"
        style={{
          background: 'linear-gradient(to right, #0c4a6e, #0284c7, #10b981, #eab308, #f97316, #dc2626)',
        }}
      />
      <div className="flex justify-between text-slate-400 text-[9px]">
        <span>0</span>
        <span>15</span>
        <span>35</span>
        <span>64.5 (Heavy)</span>
        <span>115.5</span>
        <span>&gt;150</span>
      </div>
    </div>
  );
}
