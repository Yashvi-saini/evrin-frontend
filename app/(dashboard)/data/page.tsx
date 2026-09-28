'use client';

import React, { useState, useEffect } from 'react';
import { Badge } from '@/shared/ui/badge';
import { Database, RefreshCw, Activity, CheckCircle2, Zap, Radio, Server } from '@/shared/ui/icons';

export default function DataPage() {
  const [selectedFeedFilter, setSelectedFeedFilter] = useState<string>('all');
  const [isAnimated, setIsAnimated] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsAnimated(true), 50);
    return () => clearTimeout(timer);
  }, []);

  const feeds = [
    {
      name: 'ECMWF Integrated Forecasting System (IFS)',
      agency: 'ECMWF Open Data',
      type: 'Global NWP High-Res',
      res: '0.1° (~9 km)',
      cycle: '00z, 06z, 12z, 18z',
      latency: '42s after dissemination',
      status: 'SYNCHRONIZED',
      health: '100%',
      variables: 'U/V (850, 500 hPa), T, Q, PWAT, CAPE, Mean Sea Level Pressure',
    },
    {
      name: 'IMD Global Forecast System (GFS)',
      agency: 'India Meteorological Dept',
      type: 'National Operational NWP',
      res: '12 km National Grid',
      cycle: '00z & 12z daily',
      latency: '28s pipeline ingest',
      status: 'SYNCHRONIZED',
      health: '99.8%',
      variables: '24h/48h Acc. Precip, Boundary Layer Height, 2m Temperature',
    },
    {
      name: 'NCMRWF Unified Model (NCUM)',
      agency: 'MoES NCMRWF',
      type: 'Regional High-Res Model',
      res: '4 km India Domain',
      cycle: '00z & 12z daily',
      latency: '35s pipeline ingest',
      status: 'SYNCHRONIZED',
      health: '100%',
      variables: 'Convective Precip, Deep Soil Moisture, Orographic Drag Vector',
    },
    {
      name: 'INSAT-3D/3DR Hydro-Estimator Satellite',
      agency: 'ISRO / IMD Satellite Division',
      type: 'Near Real-Time Geostationary',
      res: '4 km Pixel Resolution',
      cycle: '15-min Rapid Scan',
      latency: '8s live telemetry',
      status: 'LIVE STREAM',
      health: '100%',
      variables: 'TIR-1 (10.8 µm), Water Vapor (6.9 µm), Cloud Top Temperature',
    },
    {
      name: 'IMD Doppler Weather Radar (DWR) 34-Station Network',
      agency: 'IMD Radar Network',
      type: 'Dual-Pol Doppler Radar',
      res: '500m Radial Grid',
      cycle: '10-min Volume Scans',
      latency: '14s live mosaic',
      status: 'LIVE STREAM',
      health: '98.5%',
      variables: 'Reflectivity (Z_H), Differential Reflectivity (Z_DR), Radial Velocity',
    },
    {
      name: 'IMD 0.25° Daily Gridded Rainfall Analysis',
      agency: 'National Climate Center, Pune',
      type: 'Ground Observation Truth',
      res: '0.25° x 0.25° (~27 km)',
      cycle: 'Daily 03:00 UTC',
      latency: 'Archived Benchmark',
      status: 'VERIFIED',
      health: '100%',
      variables: 'Gauge-calibrated surface accumulation for 44-year hindcast truth',
    },
  ];

  const filterPills = [
    { id: 'all', label: 'All Feeds (6)' },
    { id: 'nwp', label: 'Numerical NWP' },
    { id: 'satellite', label: 'Satellite & Radar' },
    { id: 'ground', label: 'Ground Truth' },
  ];

  const filteredFeeds = feeds.filter((f) => {
    if (selectedFeedFilter === 'nwp') return f.type.includes('NWP') || f.type.includes('Model');
    if (selectedFeedFilter === 'satellite') return f.type.includes('Satellite') || f.type.includes('Radar');
    if (selectedFeedFilter === 'ground') return f.type.includes('Ground') || f.type.includes('Observation');
    return true;
  });

  return (
    <div className="space-y-5 font-mono select-none">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-200 dark:border-[#262626] pb-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 tracking-tight">Data Sources & NWP Ingestion</h1>
            <span className="text-[10px] px-2.5 py-0.5 rounded-full border border-emerald-300 dark:border-emerald-900/60 text-emerald-600 dark:text-emerald-400 font-mono font-bold bg-emerald-50 dark:bg-emerald-950/20">
              ALL FEEDS HEALTHY (100%)
            </span>
          </div>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 font-sans mt-0.5">
            Atmospheric variables, satellite radiometry, and ground radar feeds feeding EVRIN&apos;s real-time calibration pipe.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {filterPills.map((pill) => {
            const isActive = selectedFeedFilter === pill.id;
            return (
              <button
                key={pill.id}
                onClick={() => setSelectedFeedFilter(pill.id)}
                className={`px-3 py-1 rounded-full text-xs font-mono transition-all border ${
                  isActive
                    ? 'bg-[#1A8FCB] text-white dark:bg-white dark:text-black border-[#1A8FCB] dark:border-white font-bold'
                    : 'bg-transparent text-neutral-600 dark:text-neutral-400 border-neutral-200 dark:border-[#262626] hover:border-neutral-400 dark:hover:border-neutral-600'
                }`}
              >
                {pill.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 4 Ingestion Telemetry Metric KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3 rounded-lg bg-white dark:bg-[#141414]">
          <div className="text-[10px] text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-1">Total Daily Ingestion Volume</div>
          <div className="text-xl font-bold text-neutral-900 dark:text-neutral-100 font-mono">
            48.2 GB
          </div>
          <div className="text-[9px] text-neutral-500 dark:text-neutral-400 mt-1">GRIB2 + NetCDF-4 Streams</div>
        </div>

        <div className="p-3 rounded-lg bg-white dark:bg-[#141414]">
          <div className="text-[10px] text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-1">Average Ingestion Latency</div>
          <div className="text-xl font-bold text-neutral-900 dark:text-neutral-100 font-mono">
            26.4 sec
          </div>
          <div className="text-[9px] text-neutral-500 dark:text-neutral-400 mt-1">Dissemination to GPU Memory</div>
        </div>

        <div className="p-3 rounded-lg bg-white dark:bg-[#141414]">
          <div className="text-[10px] text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-1">DWR Radar Coverage</div>
          <div className="text-xl font-bold text-neutral-900 dark:text-neutral-100 font-mono">
            34 Stations
          </div>
          <div className="text-[9px] text-neutral-500 dark:text-neutral-400 mt-1">Nowcasting Doppler Mosaic Active</div>
        </div>

        <div className="p-3 rounded-lg bg-white dark:bg-[#141414]">
          <div className="text-[10px] text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-1">Grid Interpolation Fidelity</div>
          <div className="text-xl font-bold text-neutral-900 dark:text-neutral-100 font-mono">
            0.05° (~5 km)
          </div>
          <div className="text-[9px] text-neutral-500 dark:text-neutral-400 mt-1">Bilinear + Topographic Hypsometry</div>
        </div>
      </div>

      {/* Ingestion Latency Timeline Visualization */}
      <div className="bg-white dark:bg-[#141414] rounded-lg p-4">
        <div className="flex items-center justify-between pb-2.5 border-b border-neutral-200 dark:border-[#262626] mb-3">
          <div className="flex items-center gap-2">
            <Radio size={14} className="text-neutral-600 dark:text-neutral-400" />
            <span className="text-xs font-bold text-neutral-900 dark:text-neutral-100 uppercase tracking-wide">
              Real-Time Ingestion Throughput & Latency (Last 24 Hours)
            </span>
          </div>
          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            POLLING RATE: 10s
          </span>
        </div>

        {/* SVG Latency Barcode Sparkline */}
        <div className="w-full h-20 bg-neutral-50 dark:bg-[#0A0A0A] rounded p-2 flex items-end gap-[2px]">
          {Array.from({ length: 48 }).map((_, idx) => {
            const h = 25 + Math.sin(idx * 0.4) * 15 + (idx % 7 === 0 ? 35 : 0);
            const isBurst = idx % 7 === 0;
            const delay = idx * 15; // 15ms stagger per bar = ~720ms total wave
            return (
              <div
                key={idx}
                className="flex-1 rounded-t group relative cursor-pointer"
                style={{
                  height: isAnimated ? `${h}%` : '0%',
                  minWidth: '2px',
                  backgroundColor: isBurst ? '#1A8FCB' : '#737373',
                  opacity: isAnimated ? (isBurst ? 1 : 0.4) : 0,
                  transform: isAnimated ? 'scaleY(1)' : 'scaleY(0)',
                  transformOrigin: 'bottom',
                  transition: `height 0.55s cubic-bezier(0.34, 1.56, 0.64, 1) ${delay}ms,
                               opacity 0.3s ease-out ${delay}ms,
                               transform 0.55s cubic-bezier(0.34, 1.56, 0.64, 1) ${delay}ms`,
                }}
              >
                <div className="hidden group-hover:block absolute bottom-full mb-1 left-1/2 -translate-x-1/2 bg-neutral-900 dark:bg-white dark:text-neutral-900 text-white border border-neutral-700 dark:border-neutral-200 text-[8px] px-1.5 py-0.5 rounded whitespace-nowrap z-10 font-mono">
                  T-{48 - idx}h: {h.toFixed(0)} MB/s
                </div>
              </div>
            );
          })}
        </div>
        <div className="flex justify-between items-center text-[9px] text-neutral-400 dark:text-neutral-500 mt-1 font-mono">
          <span>T - 24 Hours</span>
          <span>T - 12 Hours (12Z Cycle Run)</span>
          <span>T - 06 Hours</span>
          <span className="text-neutral-900 dark:text-neutral-100 font-bold">Now (06Z Cycle Synchronized)</span>
        </div>
      </div>

      {/* Main Meteorological Feeds Table */}
      <div className="bg-white dark:bg-[#141414] rounded-lg p-4">
        <div className="flex items-center justify-between pb-2.5 border-b border-neutral-200 dark:border-[#262626] mb-3">
          <div className="flex items-center gap-2">
            <Server size={14} className="text-neutral-600 dark:text-neutral-400" />
            <span className="text-xs font-bold text-neutral-900 dark:text-neutral-100 uppercase tracking-wide">
              Connected Sensor & NWP Data Streams
            </span>
          </div>
          <span className="text-[10px] text-neutral-500 dark:text-neutral-400 font-mono">
            DISPLAYING {filteredFeeds.length} FEEDS
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-neutral-200 dark:border-[#262626] text-[10px] text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                <th className="py-2.5 px-3 font-semibold">Feed Source & Agency</th>
                <th className="py-2.5 px-3 font-semibold">Class</th>
                <th className="py-2.5 px-3 font-semibold">Resolution</th>
                <th className="py-2.5 px-3 font-semibold">Cycle</th>
                <th className="py-2.5 px-3 font-semibold">Latency</th>
                <th className="py-2.5 px-3 font-semibold text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 dark:divide-[#262626] font-mono text-[11px]">
              {filteredFeeds.map((feed) => (
                <tr key={feed.name} className="hover:bg-neutral-50 dark:hover:bg-[#1a1a1a]">
                  <td className="py-3 px-3">
                    <div className="font-sans font-bold text-neutral-900 dark:text-neutral-100">{feed.name}</div>
                    <div className="text-[10px] text-neutral-500 dark:text-neutral-400 font-mono">{feed.agency}</div>
                  </td>
                  <td className="py-3 px-3 text-neutral-700 dark:text-neutral-300 font-sans">{feed.type}</td>
                  <td className="py-3 px-3 text-neutral-900 dark:text-neutral-100 font-bold">{feed.res}</td>
                  <td className="py-3 px-3 text-neutral-500 dark:text-neutral-400">{feed.cycle}</td>
                  <td className="py-3 px-3 text-neutral-700 dark:text-neutral-300">{feed.latency}</td>
                  <td className="py-3 px-3 text-right">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold text-neutral-800 dark:text-neutral-200">
                      {feed.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
