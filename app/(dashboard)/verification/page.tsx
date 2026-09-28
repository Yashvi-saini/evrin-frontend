'use client';

import React, { useState, useEffect } from 'react';
import { Badge } from '@/shared/ui/badge';
import { ShieldAlert, RefreshCw, Activity, ArrowUpRight, TrendingUp, CheckCircle2, ChevronDown, Settings } from '@/shared/ui/icons';
import { useForecastRepository } from '@/entities/repository';

export default function VerificationPage() {
  const { activeScenario, isLoading } = useForecastRepository();
  const [selectedRegime, setSelectedRegime] = useState<string>('Active Monsoon');
  const [selectedThreshold, setSelectedThreshold] = useState<string>('>64.5mm');
  const [selectedLeadTime, setSelectedLeadTime] = useState<string>('24h');
  const [isAnimated, setIsAnimated] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsAnimated(true), 50);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading || !activeScenario) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-slate-400 gap-3 font-mono text-xs">
        <RefreshCw size={24} className="animate-spin text-teal-400" />
        <span>Loading verification benchmark suite...</span>
      </div>
    );
  }

  // 6 KPI Metric Cards matching Image 5 (media_1790525299534.png)
  const kpiMetrics = [
    {
      label: 'RMSE (ERROR)',
      gainBadge: '-18.4% GAIN',
      value: '35.1',
      unit: 'mm',
      rawNwp: '42.8',
      delta: '-7.7 mm',
      gainColor: 'text-emerald-400 border-emerald-500/50',
      barColor: 'bg-emerald-400',
      progress: 68,
    },
    {
      label: 'CSI (THREAT SCORE)',
      gainBadge: '+41.5%',
      value: '0.58',
      unit: 'index',
      rawNwp: '0.41',
      delta: '+0.17 pts',
      gainColor: 'text-teal-400 border-teal-500/50',
      barColor: 'bg-teal-400',
      progress: 58,
    },
    {
      label: 'POD (HIT RATE)',
      gainBadge: '+22.6%',
      value: '0.76',
      unit: 'rate',
      rawNwp: '0.62',
      delta: '+0.14',
      gainColor: 'text-teal-400 border-teal-500/50',
      barColor: 'bg-teal-400',
      progress: 76,
    },
    {
      label: 'FAR (FALSE ALARMS)',
      gainBadge: '-35.3% CUT',
      value: '0.22',
      unit: 'ratio',
      rawNwp: '0.34',
      delta: '-0.12',
      gainColor: 'text-emerald-400 border-emerald-500/50',
      barColor: 'bg-emerald-400',
      progress: 44,
    },
    {
      label: 'FSS @ 25KM RADIUS',
      gainBadge: '+21.2%',
      value: '0.63',
      unit: 'skill',
      rawNwp: '0.48',
      delta: '+0.15',
      gainColor: 'text-cyan-400 border-cyan-500/50',
      barColor: 'bg-cyan-400',
      progress: 63,
    },
    {
      label: 'ETS (EQUITABLE THREAT)',
      gainBadge: '+57.1%',
      value: '0.44',
      unit: 'skill',
      rawNwp: '0.28',
      delta: '+0.16',
      gainColor: 'text-teal-400 border-teal-500/50',
      barColor: 'bg-teal-400',
      progress: 44,
    },
  ];

  // Reliability Diagram Points matching Image 5
  // Bin centers: 0.0, 0.25, 0.50, 0.75, 1.0
  const reliabilityBins = [
    { p: 0.0, obs: 0.02, raw: 0.0, hist: 12 },
    { p: 0.25, obs: 0.24, raw: 0.09, hist: 32 },
    { p: 0.50, obs: 0.49, raw: 0.21, hist: 58 },
    { p: 0.75, obs: 0.72, raw: 0.48, hist: 42 },
    { p: 1.0, obs: 0.94, raw: 0.86, hist: 64 },
  ];

  // Lead Time Degradation Points (D+1 to D+5) matching Image 5
  const leadTimePoints = [
    { lead: '+24h (D1)', gfs: 42, ecmwf: 38, evrin: 31 },
    { lead: '+48h (D2)', gfs: 52, ecmwf: 46, evrin: 36 },
    { lead: '+72h (D3)', gfs: 64, ecmwf: 54, evrin: 43 },
    { lead: '+96h (D4)', gfs: 72, ecmwf: 63, evrin: 51 },
    { lead: '+120h (D5)', gfs: 84, ecmwf: 73, evrin: 60 },
  ];

  // Regime Skill Matrix Rows matching Image 5
  const regimeSkillRows = [
    {
      metric: 'RMSE Error Reduction',
      active: '-18.4%',
      break: '-9.2%',
      depression: '-26.7%',
      orographic: '-31.5%',
      conf: 'p < 0.001',
    },
    {
      metric: 'Critical Success Index (CSI)',
      active: '+41.5%',
      break: '+14.2%',
      depression: '+33.0%',
      orographic: '+49.1%',
      conf: 'p < 0.001',
    },
    {
      metric: 'False Alarm Reduction (FAR)',
      active: '-35.3%',
      break: '-18.0%',
      depression: '-42.1%',
      orographic: '-48.6%',
      conf: 'p < 0.001',
    },
    {
      metric: 'Brier Skill Score (BSS)',
      active: '+0.42',
      break: '+0.21',
      depression: '+0.38',
      orographic: '+0.52',
      conf: 'p < 0.001',
    },
  ];

  return (
    <div className="space-y-4 font-mono select-none">
      {/* 1. Header Ribbon & Filter Controls */}
      <div className="bg-white dark:bg-[#141414] rounded-lg p-3">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-2.5">
          {/* Regime Selector */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-neutral-500 dark:text-neutral-400 uppercase font-semibold">REGIME:</span>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-transparent text-neutral-800 dark:text-neutral-200 text-xs font-semibold cursor-pointer hover:border-neutral-400 dark:hover:border-neutral-600">
              <span>{selectedRegime}</span>
              <ChevronDown size={12} className="text-neutral-400" />
            </div>
          </div>

          {/* Precip Threshold Pills */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-neutral-500 dark:text-neutral-400 uppercase font-semibold">PRECIP THRESHOLD:</span>
            <div className="flex items-center gap-1">
              {['All', '>15mm', '>64.5mm', '>115.6mm'].map((thresh) => {
                const isActive = selectedThreshold === thresh;
                return (
                  <button
                    key={thresh}
                    onClick={() => setSelectedThreshold(thresh)}
                    className={`px-3 py-1 rounded-full text-xs font-mono transition-all border ${
                      isActive
                        ? 'bg-[#1A8FCB] text-white dark:bg-white dark:text-black border-[#1A8FCB] dark:border-white font-bold'
                        : 'bg-transparent text-neutral-600 dark:text-neutral-400 border-neutral-200 dark:border-[#262626] hover:border-neutral-400 dark:hover:border-neutral-600'
                    }`}
                  >
                    {thresh}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Lead Time Pills */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-neutral-500 dark:text-neutral-400 uppercase font-semibold">LEAD TIME:</span>
            <div className="flex items-center gap-1">
              {['24h', '48h', '72h', '120h'].map((lt) => {
                const isActive = selectedLeadTime === lt;
                return (
                  <button
                    key={lt}
                    onClick={() => setSelectedLeadTime(lt)}
                    className={`px-3 py-1 rounded-full text-xs font-mono transition-all border ${
                      isActive
                        ? 'bg-[#1A8FCB] text-white dark:bg-white dark:text-black border-[#1A8FCB] dark:border-white font-bold'
                        : 'bg-transparent text-neutral-600 dark:text-neutral-400 border-neutral-200 dark:border-[#262626] hover:border-neutral-400 dark:hover:border-neutral-600'
                    }`}
                  >
                    {lt}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Sub-bar: Target Model & District Validation Count */}
        <div className="pt-2 border-t border-neutral-200 dark:border-[#262626] flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2.5">
            <div className="px-2.5 py-0.5 rounded-full bg-transparent text-neutral-700 dark:text-neutral-300 text-[11px] font-mono">
              TARGET: <span className="text-neutral-500">Raw NWP (ECMWF 0.1°)</span> vs <span className="text-neutral-900 dark:text-white font-bold">EVRIN MoE</span>
            </div>
            <div className="flex items-center gap-1.5 text-neutral-600 dark:text-neutral-400 text-[11px]">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>736 Districts Validated (IMD 0.25° Gridded Obs)</span>
            </div>
          </div>

          <button
            onClick={() => alert('Opening Evaluation Configuration Settings...')}
            className="px-3 py-0.5 rounded-full bg-transparent hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 text-[11px] transition-all"
          >
            <Settings size={12} className="inline mr-1 shrink-0" />
            Evaluation Config
          </button>
        </div>
      </div>

      {/* 2. Top 6 KPI Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {kpiMetrics.map((kpi) => (
          <div
            key={kpi.label}
            className="p-3 rounded-lg bg-white dark:bg-[#141414] flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-1 mb-1.5">
                <span className="text-[9px] text-neutral-500 dark:text-neutral-400 uppercase tracking-tight font-semibold truncate">
                  {kpi.label}
                </span>
                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded-full text-neutral-700 dark:text-neutral-300 font-bold">
                  {kpi.gainBadge}
                </span>
              </div>
              <div className="text-xl font-bold text-neutral-900 dark:text-neutral-100 font-mono">
                {kpi.value} <span className="text-[11px] font-normal text-neutral-400 dark:text-neutral-500">{kpi.unit}</span>
              </div>
            </div>

            <div className="mt-2 pt-2 border-t border-neutral-200 dark:border-[#262626]">
              <div className="flex items-center justify-between text-[10px] text-neutral-500 dark:text-neutral-400 font-mono mb-1">
                <span>Raw: {kpi.rawNwp}</span>
                <span className={kpi.delta.startsWith('-') ? 'text-emerald-600 dark:text-emerald-400 font-semibold' : 'text-neutral-900 dark:text-neutral-100 font-semibold'}>
                  {kpi.delta}
                </span>
              </div>
              {/* Thin metric indicator bar */}
              <div className="w-full bg-neutral-100 dark:bg-[#222222] rounded-full h-1 overflow-hidden">
                <div
                  className="h-full rounded-full bg-neutral-800 dark:bg-white transition-all duration-1000 ease-out"
                  style={{ width: isAnimated ? `${kpi.progress}%` : '0%' }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 3. Middle Row: Two Major Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left Chart: Reliability Diagram & Calibration */}
        <div className="bg-white dark:bg-[#141414] rounded-lg p-4 flex flex-col justify-between">
          <div>
            <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-neutral-900 dark:text-neutral-100 uppercase tracking-wide">
                  Reliability Diagram & Calibration
                </span>
                <span className="text-[9px] px-2 py-0.5 rounded-full text-neutral-700 dark:text-neutral-300">
                  P(&gt;64.5mm/24h)
                </span>
              </div>

              {/* Legend */}
              <div className="flex items-center gap-3 text-[10px] font-mono">
                <div className="flex items-center gap-1 text-neutral-400">
                  <span className="w-3 h-0.5 border-t border-dashed border-neutral-400" />
                  <span>Perfect 1:1</span>
                </div>
                <div className="flex items-center gap-1 text-orange-500">
                  <span className="w-3 h-0.5 bg-orange-500" />
                  <span>Raw NWP</span>
                </div>
                <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold">
                  <span className="w-3 h-0.5 bg-emerald-500" />
                  <span>EVRIN MoE</span>
                </div>
              </div>
            </div>
            <p className="text-[10px] text-neutral-500 dark:text-neutral-400 font-sans mb-3">
              Forecast Probability vs. Observed Frequency across 736 District Grid Cells
            </p>

            {/* SVG Reliability Plot Canvas */}
            <div className="relative w-full h-[220px] bg-neutral-50 dark:bg-[#0A0A0A] rounded-lg p-2 flex items-center justify-center">
              <svg viewBox="0 0 500 210" className="w-full h-full max-h-[210px]">
                {/* Background Frequency Sharpness Histogram Bars */}
                {reliabilityBins.map((bin) => {
                  const x = 50 + bin.p * 380;
                  const barH = isAnimated ? (bin.hist / 70) * 120 : 0;
                  return (
                    <rect
                      key={bin.p}
                      x={x - 8}
                      y={180 - barH}
                      width="16"
                      height={barH}
                      fill="#0284c7"
                      fillOpacity="0.15"
                      rx="2"
                      style={{ transition: 'height 1s ease-out, y 1s ease-out' }}
                    />
                  );
                })}

                {/* Horizontal Grid lines */}
                {[0.0, 0.25, 0.5, 0.75, 1.0].map((val) => {
                  const y = 180 - val * 150;
                  return (
                    <g key={val}>
                      <line x1="50" y1={y} x2="430" y2={y} stroke="#737373" strokeWidth="0.5" strokeDasharray="3 3" />
                      <text x="42" y={y + 3} fill="#737373" fontSize="8" fontFamily="monospace" textAnchor="end">
                        {val.toFixed(2)}
                      </text>
                    </g>
                  );
                })}

                {/* X-axis labels */}
                {[0.0, 0.25, 0.5, 0.75, 1.0].map((val) => {
                  const x = 50 + val * 380;
                  return (
                    <text key={val} x={x} y="195" fill="#737373" fontSize="8" fontFamily="monospace" textAnchor="middle">
                      {val.toFixed(2)}
                    </text>
                  );
                })}

                {/* Perfect 1:1 Diagonal Dashed Line */}
                <line x1="50" y1="180" x2="430" y2="30" stroke="#737373" strokeWidth="1.2" strokeDasharray="5 5" />

                {/* Raw NWP S-Curve (Orange Line with filled dots) */}
                <polyline
                  points={reliabilityBins.map((b) => `${50 + b.p * 380},${180 - b.raw * 150}`).join(' ')}
                  fill="none"
                  stroke="#ea580c"
                  strokeWidth="2.5"
                  strokeDasharray="600"
                  strokeDashoffset={isAnimated ? 0 : 600}
                  style={{ transition: 'stroke-dashoffset 1.2s ease-out' }}
                />
                {reliabilityBins.map((b) => (
                  <circle
                    key={b.p}
                    cx={50 + b.p * 380}
                    cy={180 - b.raw * 150}
                    r="4"
                    fill="#ea580c"
                    stroke="#ffffff"
                    strokeWidth="1.2"
                    style={{ opacity: isAnimated ? 1 : 0, transition: 'opacity 0.5s ease-out 1s' }}
                  />
                ))}

                {/* EVRIN MoE Calibrated Curve (Solid Line) */}
                <polyline
                  points={reliabilityBins.map((b) => `${50 + b.p * 380},${180 - b.obs * 150}`).join(' ')}
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="3"
                  strokeDasharray="600"
                  strokeDashoffset={isAnimated ? 0 : 600}
                  style={{ transition: 'stroke-dashoffset 1.2s ease-out 0.2s' }}
                />
                {reliabilityBins.map((b) => (
                  <circle
                    key={b.p}
                    cx={50 + b.p * 380}
                    cy={180 - b.obs * 150}
                    r="4"
                    fill="#10b981"
                    stroke="#ffffff"
                    strokeWidth="1.5"
                    style={{ opacity: isAnimated ? 1 : 0, transition: 'opacity 0.5s ease-out 1.2s' }}
                  />
                ))}
              </svg>
            </div>
          </div>

          {/* Footer: Brier Score Decomposition */}
          <div className="mt-3 pt-2.5 border-t border-neutral-200 dark:border-[#262626] flex flex-wrap items-center justify-between text-[11px] font-mono text-neutral-500 dark:text-neutral-400 gap-2">
            <span className="text-neutral-800 dark:text-neutral-200 font-semibold">Brier Score Decomposition:</span>
            <div className="flex items-center gap-4">
              <span>
                Reliability: <strong className="text-emerald-600 dark:text-emerald-400">0.012</strong> <span className="text-neutral-400 dark:text-neutral-500">(Raw: 0.048)</span>
              </span>
              <span>
                Resolution: <strong className="text-emerald-600 dark:text-emerald-400">0.245</strong> <span className="text-neutral-400 dark:text-neutral-500">(Raw: 0.189)</span>
              </span>
            </div>
          </div>
        </div>

        {/* Right Chart: Lead Time Error Degradation */}
        <div className="bg-white dark:bg-[#141414] rounded-lg p-4 flex flex-col justify-between">
          <div>
            <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-neutral-900 dark:text-neutral-100 uppercase tracking-wide">
                  Lead Time Error Degradation
                </span>
                <span className="text-[9px] px-2 py-0.5 rounded-full text-neutral-700 dark:text-neutral-300">
                  D+1 to D+5 Curve
                </span>
              </div>

              {/* Legend */}
              <div className="flex items-center gap-3 text-[10px] font-mono">
                <div className="flex items-center gap-1 text-orange-500">
                  <span className="w-3 h-0.5 border-t border-dashed border-orange-500" />
                  <span>GFS</span>
                </div>
                <div className="flex items-center gap-1 text-sky-500">
                  <span className="w-3 h-0.5 bg-sky-500" />
                  <span>ECMWF 0.1°</span>
                </div>
                <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold">
                  <span className="w-3 h-0.5 bg-emerald-500" />
                  <span>EVRIN</span>
                </div>
              </div>
            </div>
            <p className="text-[10px] text-neutral-500 dark:text-neutral-400 font-sans mb-3">
              Mean District RMSE (mm) over forecast horizon in Active Monsoon Regime
            </p>

            {/* SVG Lead Time Plot Canvas */}
            <div className="relative w-full h-[220px] bg-neutral-50 dark:bg-[#0A0A0A] rounded-lg p-2 flex items-center justify-center">
              <svg viewBox="0 0 500 210" className="w-full h-full max-h-[210px]">
                {/* Horizontal Grid lines */}
                {[30, 45, 60, 75, 90].map((val) => {
                  const y = 180 - ((val - 30) / 60) * 150;
                  return (
                    <g key={val}>
                      <line x1="50" y1={y} x2="440" y2={y} stroke="#737373" strokeWidth="0.5" strokeDasharray="3 3" />
                      <text x="42" y={y + 3} fill="#737373" fontSize="8" fontFamily="monospace" textAnchor="end">
                        {val} mm
                      </text>
                    </g>
                  );
                })}

                {/* Vertical Lead Time lines */}
                {leadTimePoints.map((pt, idx) => {
                  const x = 70 + idx * 85;
                  return (
                    <g key={pt.lead}>
                      <line x1={x} y1="30" x2={x} y2="180" stroke="#737373" strokeWidth="0.5" />
                      <text x={x} y="196" fill="#737373" fontSize="8" fontFamily="monospace" textAnchor="middle">
                        {pt.lead}
                      </text>
                    </g>
                  );
                })}

                {/* Shaded Gain Area between ECMWF and EVRIN */}
                <polygon
                  points={`
                    ${leadTimePoints.map((p, i) => `${70 + i * 85},${180 - ((p.ecmwf - 30) / 60) * 150}`).join(' ')}
                    ${leadTimePoints.slice().reverse().map((p, i) => `${70 + (4 - i) * 85},${180 - ((p.evrin - 30) / 60) * 150}`).join(' ')}
                  `}
                  fill="#0284c7"
                  fillOpacity={isAnimated ? 0.15 : 0}
                  style={{ transition: 'fill-opacity 0.8s ease-out 0.6s' }}
                />

                {/* GFS Curve (Orange Dashed) */}
                <polyline
                  points={leadTimePoints.map((p, i) => `${70 + i * 85},${180 - ((p.gfs - 30) / 60) * 150}`).join(' ')}
                  fill="none"
                  stroke="#ea580c"
                  strokeWidth="2"
                  strokeDasharray="500"
                  strokeDashoffset={isAnimated ? 0 : 500}
                  style={{ transition: 'stroke-dashoffset 1s ease-out' }}
                />

                {/* ECMWF 0.1° Curve (Sky with dots) */}
                <polyline
                  points={leadTimePoints.map((p, i) => `${70 + i * 85},${180 - ((p.ecmwf - 30) / 60) * 150}`).join(' ')}
                  fill="none"
                  stroke="#0284c7"
                  strokeWidth="2"
                  strokeDasharray="500"
                  strokeDashoffset={isAnimated ? 0 : 500}
                  style={{ transition: 'stroke-dashoffset 1s ease-out 0.1s' }}
                />
                {leadTimePoints.map((p, i) => (
                  <circle
                    key={p.lead}
                    cx={70 + i * 85}
                    cy={180 - ((p.ecmwf - 30) / 60) * 150}
                    r="3.5"
                    fill="#0284c7"
                    stroke="#ffffff"
                    strokeWidth="1.2"
                    style={{ opacity: isAnimated ? 1 : 0, transition: 'opacity 0.4s ease-out 1s' }}
                  />
                ))}

                {/* EVRIN Post-Process Curve (Emerald Solid) */}
                <polyline
                  points={leadTimePoints.map((p, i) => `${70 + i * 85},${180 - ((p.evrin - 30) / 60) * 150}`).join(' ')}
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="3"
                  strokeDasharray="500"
                  strokeDashoffset={isAnimated ? 0 : 500}
                  style={{ transition: 'stroke-dashoffset 1s ease-out 0.2s' }}
                />
                {leadTimePoints.map((p, i) => (
                  <circle
                    key={p.lead}
                    cx={70 + i * 85}
                    cy={180 - ((p.evrin - 30) / 60) * 150}
                    r="4"
                    fill="#10b981"
                    stroke="#ffffff"
                    strokeWidth="1.5"
                    style={{ opacity: isAnimated ? 1 : 0, transition: 'opacity 0.4s ease-out 1.1s' }}
                  />
                ))}

                {/* D+3 Error Gain Callout Bubble */}
                <g>
                  <rect x="220" y="70" width="130" height="20" rx="4" fill="#141414" stroke="#262626" strokeWidth="1" />
                  <text x="285" y="83" fill="#ffffff" fontSize="8" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
                    D+3: -11.3mm error gain
                  </text>
                </g>
              </svg>
            </div>
          </div>

          {/* Footer: Day 5 Skill Retention */}
          <div className="mt-3 pt-2.5 border-t border-neutral-200 dark:border-[#262626] flex flex-wrap items-center justify-between text-[11px] font-mono text-neutral-500 dark:text-neutral-400 gap-2">
            <span className="text-neutral-800 dark:text-neutral-200 font-semibold">Day 5 Skill Retention:</span>
            <div className="flex items-center gap-3">
              <span>EVRIN: <strong className="text-emerald-600 dark:text-emerald-400">48.2 mm RMSE</strong></span>
              <span className="text-neutral-300 dark:text-neutral-700">|</span>
              <span>GFS: <strong className="text-orange-500">78.4 mm RMSE</strong></span>
              <span className="text-neutral-300 dark:text-neutral-700">|</span>
              <span>ECMWF: <strong className="text-sky-500">62.1 mm RMSE</strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Bottom Row: Atmospheric Regime Skill Matrix & District Bias Correction Map */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Panel (8 cols): Atmospheric Regime Skill Matrix */}
        <div className="lg:col-span-8 bg-white dark:bg-[#141414] rounded-lg p-4">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-neutral-200 dark:border-[#262626] mb-2.5">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-neutral-900 dark:text-neutral-100 uppercase tracking-wide">
                  Atmospheric Regime Skill Matrix
                </span>
                <span className="text-[9px] px-2 py-0.5 rounded-full text-neutral-700 dark:text-neutral-300">
                  MoE Diagnostic
                </span>
              </div>
              <p className="text-[10px] text-neutral-500 dark:text-neutral-400 font-sans mt-0.5">
                Where does EVRIN post-processing yield statistically significant forecast improvement?
              </p>
            </div>

            {/* Legend */}
            <div className="flex items-center gap-3 text-[10px] font-mono">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-neutral-700 dark:text-neutral-300">Strong Gain (&gt;20%)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-sky-500" />
                <span className="text-neutral-500 dark:text-neutral-400">Modest Gain</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-neutral-400" />
                <span className="text-neutral-400 dark:text-neutral-500">Parity</span>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-neutral-200 dark:border-[#262626] text-[10px] text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                  <th className="py-2 px-2.5 font-semibold">Evaluation Metric</th>
                  <th className="py-2 px-2.5 font-semibold text-center">Active Monsoon</th>
                  <th className="py-2 px-2.5 font-semibold text-center">Monsoon Break</th>
                  <th className="py-2 px-2.5 font-semibold text-center">Depression / Low</th>
                  <th className="py-2 px-2.5 font-semibold text-center">Orographic Ghats</th>
                  <th className="py-2 px-2.5 font-semibold text-right">Confidence</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 dark:divide-[#262626] font-mono text-[11px]">
                {regimeSkillRows.map((row) => (
                  <tr key={row.metric} className="hover:bg-neutral-50 dark:hover:bg-[#1a1a1a]">
                    <td className="py-2.5 px-2.5 font-sans font-medium text-neutral-800 dark:text-neutral-200">
                      {row.metric}
                    </td>
                    <td className="py-2.5 px-2.5 text-center">
                      <span className="px-2 py-0.5 rounded-full text-neutral-900 dark:text-neutral-100 font-bold">
                        {row.active}
                      </span>
                    </td>
                    <td className="py-2.5 px-2.5 text-center">
                      <span className="px-2 py-0.5 rounded-full text-neutral-600 dark:text-neutral-400 bg-transparent">
                        {row.break}
                      </span>
                    </td>
                    <td className="py-2.5 px-2.5 text-center">
                      <span className="px-2 py-0.5 rounded-full text-neutral-900 dark:text-neutral-100 font-bold">
                        {row.depression}
                      </span>
                    </td>
                    <td className="py-2.5 px-2.5 text-center">
                      <span className="px-2 py-0.5 rounded-full text-neutral-900 dark:text-neutral-100 font-bold">
                        {row.orographic}
                      </span>
                    </td>
                    <td className="py-2.5 px-2.5 text-right text-emerald-600 dark:text-emerald-400 font-semibold">
                      {row.conf}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Panel (4 cols): District Bias Correction Map */}
        <div className="lg:col-span-4 bg-white dark:bg-[#141414] rounded-lg p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-neutral-200 dark:border-[#262626] mb-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-neutral-900 dark:text-neutral-100 uppercase tracking-wide">
                  District Bias Correction Map
                </span>
                <span className="text-[9px] px-2 py-0.5 rounded-full text-neutral-500 dark:text-neutral-400">
                  736 Dists
                </span>
              </div>
              <a
                href="/forecast"
                className="text-[10px] text-neutral-900 dark:text-neutral-200 hover:underline flex items-center gap-1 font-mono"
              >
                <span>Full View</span>
                <ArrowUpRight size={11} />
              </a>
            </div>
            <p className="text-[10px] text-neutral-500 dark:text-neutral-400 font-sans mb-3">
              Spatial telemetry of wet-bias dampening & orographic correction
            </p>

            {/* India Outline Mini Canvas */}
            <div className="relative w-full h-[145px] bg-neutral-50 dark:bg-[#0A0A0A] rounded-lg p-2 flex items-center justify-center overflow-hidden">
              <svg viewBox="0 0 200 160" className="w-full h-full max-h-[140px]">
                {/* Simplified India Territorial Outline */}
                <polygon
                  points="100,15 115,25 125,45 145,55 130,75 120,95 105,140 95,140 75,95 65,75 55,60 70,35 85,25"
                  fill="none"
                  stroke="#737373"
                  strokeWidth="1.2"
                  strokeDasharray="3 2"
                />

                {/* Monsoon Trough Vector Corridor */}
                <line x1="75" y1="58" x2="135" y2="78" stroke="#0284c7" strokeWidth="2" />
                <circle cx="135" cy="78" r="3.5" fill="#0284c7" />

                {/* Callout Bubble */}
                <g>
                  <rect x="110" y="55" width="75" height="15" rx="3" fill="#141414" stroke="#262626" strokeWidth="1" />
                  <text x="147" y="66" fill="#ffffff" fontSize="7" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
                    Trough: CSI 0.68
                  </text>
                </g>

                {/* Orographic hotspot marker */}
                <circle cx="82" cy="100" r="3" fill="#10b981" />
                <text x="82" y="112" fill="#737373" fontSize="6" fontFamily="monospace" textAnchor="middle">
                  Ghats +31%
                </text>
              </svg>
            </div>
          </div>

          <div className="mt-2 text-right">
            <span className="text-[9px] text-neutral-500 dark:text-neutral-400 font-mono">
              Ready for CEMS / NDRF Deployment
            </span>
          </div>
        </div>
      </div>

      {/* 5. Bottom Global Telemetry Status Bar */}
      <div className="p-2.5 rounded-lg bg-neutral-50 dark:bg-[#141414] text-[10px] font-mono text-neutral-500 dark:text-neutral-400 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="text-neutral-400 dark:text-neutral-500">Statistical Engine:</span>
            <span className="text-neutral-800 dark:text-neutral-200 font-bold">Extreme Value Theory (EVT) + GBDT Post-Processor</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-neutral-400 dark:text-neutral-500">Seed:</span>
            <span className="text-neutral-900 dark:text-neutral-100">0x9B4E38A</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-neutral-400 dark:text-neutral-500">Validation Timeframe:</span>
            <span className="text-neutral-800 dark:text-neutral-200">JJAS 2026 Season</span>
          </div>
          <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 size={12} />
            <span>IMD Ground Truth Gridded Verification: OK</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span className="text-emerald-600 dark:text-emerald-400 font-bold">Ready for CEMS / NDRF Deployment</span>
        </div>
      </div>
    </div>
  );
}
