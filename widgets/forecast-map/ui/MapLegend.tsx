'use client';

import React from 'react';
import { MapLayerId } from '../model/types';

export interface MapLegendProps {
  activeLayer: MapLayerId;
}

export function MapLegend({ activeLayer }: MapLegendProps) {
  if (activeLayer === 'difference') {
    const diffScale = [
      { val: '-30mm', label: 'Overest.', color: '#ea580c' },
      { val: '-15mm', label: '', color: '#f59e0b' },
      { val: '0mm', label: 'Neutral', color: '#64748b' },
      { val: '+20mm', label: '', color: '#0284c7' },
      { val: '+50mm', label: 'Uplift', color: '#06b6d4' },
      { val: '>+80mm', label: 'Heavy Uplift', color: '#38bdf8' },
    ];
    return (
      <div className="bg-white/95 dark:bg-[#141414]/95 backdrop-blur border border-neutral-200 dark:border-[#262626] p-2 rounded-lg font-mono text-[10px] select-none shadow-sm">
        <div className="flex items-center gap-1.5 text-slate-400 uppercase tracking-wider mb-1 font-semibold text-[9px]">
          <span>BIAS DELTA ANOMALY</span>
          <span className="text-cyan-400">EVRIN - NWP (mm)</span>
        </div>
        <div className="flex items-center gap-0.5">
          {diffScale.map((item) => (
            <div key={item.val} className="flex flex-col items-center">
              <span className="w-8 h-2 rounded-sm" style={{ backgroundColor: item.color }} />
              <span className="text-slate-400 text-[9px] mt-0.5">{item.val}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (activeLayer === 'heavy-rain-prob') {
    const probScale = [
      { val: '<30%', label: 'Low', color: '#10b981' },
      { val: '30-60%', label: 'Moderate', color: '#eab308' },
      { val: '60-80%', label: 'Orange Alert', color: '#f97316' },
      { val: '>80%', label: 'Red Warning', color: '#ef4444' },
    ];
    return (
      <div className="bg-white/95 dark:bg-[#141414]/95 backdrop-blur border border-neutral-200 dark:border-[#262626] p-2 rounded-lg font-mono text-[10px] select-none shadow-sm">
        <div className="flex items-center gap-1.5 text-slate-400 uppercase tracking-wider mb-1 font-semibold text-[9px]">
          <span>IMD EXTREME PROBABILITY</span>
          <span className="text-rose-400">&gt;64.5mm / 24h</span>
        </div>
        <div className="flex items-center gap-1">
          {probScale.map((item) => (
            <div key={item.val} className="flex items-center gap-1 px-1.5 py-0.5 rounded border border-slate-700/60">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="text-slate-300 text-[9px]">{item.val}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (activeLayer === 'regime') {
    return (
      <div className="bg-white/95 dark:bg-[#141414]/95 backdrop-blur border border-neutral-200 dark:border-[#262626] p-2 rounded-lg font-mono text-[10px] select-none shadow-sm">
        <div className="flex items-center gap-1.5 text-slate-400 uppercase tracking-wider mb-1 font-semibold text-[9px]">
          <span>SYNOPTIC REGIME FLOW</span>
          <span className="text-teal-400">MoE CLASSIFIER</span>
        </div>
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[9px] px-2 py-0.5 rounded-full border border-sky-500/50 text-sky-400 font-mono">Monsoon Trough</span>
          <span className="text-[9px] px-2 py-0.5 rounded-full border border-amber-500/50 text-amber-400 font-mono">Orographic Convection</span>
          <span className="text-[9px] px-2 py-0.5 rounded-full border border-red-500/50 text-red-400 font-mono">Depression Landfall</span>
          <span className="text-[9px] px-2 py-0.5 rounded-full border border-teal-500/50 text-teal-400 font-mono">Coastal Inflow</span>
        </div>
      </div>
    );
  }

  if (activeLayer === 'uncertainty') {
    const uncertScale = [
      { val: '±15mm', label: 'Tight', color: '#06b6d4' },
      { val: '±35mm', label: 'Normal', color: '#3b82f6' },
      { val: '±60mm', label: 'Elevated', color: '#a855f7' },
      { val: '>±85mm', label: 'High Spread', color: '#ec4899' },
    ];
    return (
      <div className="bg-white/95 dark:bg-[#141414]/95 backdrop-blur border border-neutral-200 dark:border-[#262626] p-2 rounded-lg font-mono text-[10px] select-none shadow-sm">
        <div className="flex items-center gap-1.5 text-slate-400 uppercase tracking-wider mb-1 font-semibold text-[9px]">
          <span>UNCERTAINTY ENVELOPE</span>
          <span className="text-purple-400">51-MEMBER P90</span>
        </div>
        <div className="flex items-center gap-0.5">
          {uncertScale.map((item) => (
            <div key={item.val} className="flex flex-col items-center">
              <span className="w-8 h-2 rounded-sm" style={{ backgroundColor: item.color }} />
              <span className="text-slate-400 text-[9px] mt-0.5">{item.val}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Standard Accumulation scale for Raw NWP and EVRIN Corrected
  const scale = [
    { val: '0', color: '#0c4a6e' },
    { val: '15', color: '#0284c7' },
    { val: '35', color: '#10b981' },
    { val: '64.5', color: '#eab308' },
    { val: '115.6', color: '#f97316' },
    { val: '>204.5', color: '#ef4444' },
  ];

  return (
    <div className="bg-white/95 dark:bg-[#141414]/95 backdrop-blur border border-neutral-200 dark:border-[#262626] p-2 rounded-lg font-mono text-[10px] select-none shadow-sm">
      <div className="flex items-center gap-1.5 text-slate-400 uppercase tracking-wider mb-1 font-semibold text-[9px]">
        <span>{activeLayer === 'raw-nwp' ? 'RAW NWP ACCUMULATION' : 'EVRIN CALIBRATED ACCUMULATION'} (24h)</span>
        <span className="text-teal-400">mm</span>
      </div>
      <div className="flex items-center gap-0.5">
        {scale.map((item) => (
          <div key={item.val} className="flex flex-col items-center">
            <span className="w-7 h-2 rounded-sm" style={{ backgroundColor: item.color }} />
            <span className="text-slate-400 text-[9px] mt-0.5">{item.val}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
