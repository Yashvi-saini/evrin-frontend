'use client';

import React from 'react';
import { useForecastRepository } from '@/entities/repository';
import { AlertTriangle, Activity, ArrowRight, Download } from '@/shared/ui/icons';

export function CorrectionDriversWidget() {
  const { activeScenario } = useForecastRepository();
  if (!activeScenario) return null;

  const attributionItems = [
    {
      order: '01',
      title: 'Active monsoon low-level jet moisture convergence',
      impact: '+14 mm contribution',
      color: 'text-emerald-600 dark:text-emerald-400',
    },
    {
      order: '02',
      title: 'Historical NWP negative bias in Western UP under active regime',
      impact: '+8 mm compensation',
      color: 'text-emerald-600 dark:text-emerald-400',
    },
    {
      order: '03',
      title: 'Boundary-layer equivalent potential temperature anomaly',
      impact: '+4 mm convective trigger',
      color: 'text-emerald-600 dark:text-emerald-400',
    },
    {
      order: '04',
      title: 'Multi-model ensemble spread indicates elevated upper-tail convective risk',
      impact: 'Shifted distribution skew',
      color: 'text-amber-600 dark:text-amber-400',
    },
  ];

  return (
    <div className="space-y-3 text-xs select-none transition-colors">
      {/* WHY DID EVRIN CORRECT THIS? */}
      <div className="bg-white dark:bg-[#141414] rounded-lg p-3.5 shadow-sm">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-neutral-900 dark:text-neutral-100 uppercase tracking-tight mb-1">
          <span>Why Did EVRIN Correct This?</span>
        </div>
        <p className="text-[10px] text-neutral-500 dark:text-neutral-400 mb-3 leading-tight">
          Physical attribution decomposition from atmospheric ML expert weights:
        </p>

        <div className="space-y-2">
          {attributionItems.map((item) => (
            <div
              key={item.order}
              className="p-2.5 rounded-lg text-[10px]"
            >
              <div className="text-neutral-800 dark:text-neutral-200 leading-snug">
                <span className="font-semibold text-neutral-900 dark:text-white mr-1.5">{item.order}</span>
                {item.title}
              </div>
              <div className={`mt-1 font-medium ${item.color}`}>
                {item.impact}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* OPERATIONAL RESPONSE */}
      <div className="bg-white dark:bg-[#141414] rounded-lg p-3.5 space-y-2 shadow-sm">
        <div className="text-[10px] uppercase tracking-wider text-neutral-500 dark:text-neutral-400 font-semibold mb-2">
          Operational Response
        </div>

        {/* Action 1: Inspect District Time Series */}
        <button
          onClick={() => {
            window.location.href = '/forecast';
          }}
          className="w-full flex items-center justify-between px-3.5 py-2 rounded-full bg-transparent hover:bg-neutral-100 dark:hover:bg-[#1a1a1a] text-neutral-800 dark:text-neutral-200 hover:text-black dark:hover:text-white text-[11px] transition-colors group"
        >
          <div className="flex items-center gap-2">
            <Activity size={13} className="text-neutral-500" />
            <span>Inspect District Time Series</span>
          </div>
          <ArrowRight size={13} className="text-neutral-400 group-hover:text-black dark:group-hover:text-white transition-transform group-hover:translate-x-0.5" />
        </button>

        {/* Action 2: Download GRIB2 Grid Field */}
        <button
          onClick={() => alert('Preparing GRIB2 0.05° grid field download (18.4 MB)...')}
          className="w-full flex items-center justify-between px-3.5 py-2 rounded-full bg-transparent hover:bg-neutral-100 dark:hover:bg-[#1a1a1a] text-neutral-800 dark:text-neutral-200 hover:text-black dark:hover:text-white text-[11px] transition-colors"
        >
          <div className="flex items-center gap-2">
            <Download size={13} className="text-neutral-500" />
            <span>Download GRIB2 Grid Field</span>
          </div>
          <span className="text-[10px] text-neutral-400 font-mono">18.4 MB</span>
        </button>

        {/* Action 3: Issue Early Warning Advisory */}
        <button
          onClick={() => alert('Issuing Early Warning Meteorological Bulletin for Western UP & Foothills...')}
          className="w-full flex items-center justify-center gap-2 px-3.5 py-2 rounded-full bg-transparent hover:bg-rose-50 dark:hover:bg-rose-950/30 border border-rose-300 dark:border-rose-900/60 text-rose-600 dark:text-rose-400 font-semibold text-[11px] transition-colors"
        >
          <AlertTriangle size={13} className="text-rose-500" />
          <span>Issue Early Warning Advisory</span>
        </button>
      </div>
    </div>
  );
}
