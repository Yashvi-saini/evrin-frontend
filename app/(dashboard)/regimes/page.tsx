'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Badge } from '@/shared/ui/badge';
import { RefreshCw, Wind, Compass, Activity, CheckCircle2, ChevronDown, Layers } from '@/shared/ui/icons';
import { useForecastRepository } from '@/entities/repository';

declare global {
  interface Window {
    L: any;
  }
}

export default function RegimesPage() {
  const { activeScenario, isLoading } = useForecastRepository();
  const [activeMapMode, setActiveMapMode] = useState<string>('streamlines');
  const [isLeafletReady, setIsLeafletReady] = useState(false);

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);

  // Load Leaflet dynamically
  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (window.L) {
      setIsLeafletReady(true);
      return;
    }

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    document.head.appendChild(link);

    const script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.async = true;
    script.onload = () => {
      setIsLeafletReady(true);
    };
    document.body.appendChild(script);
  }, []);

  // Initialize Real Leaflet Map for Synoptic Regime Flow
  useEffect(() => {
    if (!isLeafletReady || !mapContainerRef.current || mapInstanceRef.current) return;

    const L = window.L;

    const map = L.map(mapContainerRef.current, {
      center: [22.5, 79.5],
      zoom: 5,
      minZoom: 4,
      maxZoom: 10,
      zoomControl: false,
    });

    // Dark GIS Basemap
    L.tileLayer(
      'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}',
      {
        attribution: '&copy; Esri &mdash; National Meteorological Regime Grid',
        maxZoom: 16,
      }
    ).addTo(map);

    // Zoom controls top right
    L.control.zoom({ position: 'topright' }).addTo(map);

    const regimeLayerGroup = L.layerGroup().addTo(map);

    // 1. Indo-Gangetic Monsoon Trough Axis (26.4°N) - Dashed Red Line
    const troughLine = [
      [27.5, 71.5],
      [28.98, 77.7],
      [25.5, 82.0],
      [23.0, 88.0],
    ];
    L.polyline(troughLine as any, {
      color: '#f43f5e',
      weight: 3,
      dashArray: '8, 6',
      opacity: 0.9,
    }).addTo(regimeLayerGroup);

    // Trough Label
    const troughLabel = L.divIcon({
      className: 'trough-label-icon',
      html: `
        <div style="
          background: #141414;
          border: 1px solid #f43f5e;
          color: #f43f5e;
          font-family: inherit;
          font-size: 9px;
          font-weight: bold;
          padding: 2px 6px;
          border-radius: 4px;
          white-space: nowrap;
          box-shadow: 0 2px 6px rgba(0,0,0,0.5);
          transform: translate(-50%, -120%);
        ">
          INDO-GANGETIC MONSOON TROUGH (26.4°N)
        </div>
      `,
      iconSize: [0, 0],
    });
    L.marker([26.8, 80.0], { icon: troughLabel }).addTo(regimeLayerGroup);

    // 2. Arabian Sea South-West Low-Level Jet (LLJ) Streamlines
    const llj1 = [
      [10.0, 68.0],
      [14.0, 71.5],
      [17.5, 73.5],
      [21.0, 76.5],
      [23.5, 80.0],
    ];
    const llj2 = [
      [8.5, 71.0],
      [12.0, 73.5],
      [15.5, 75.0],
      [19.0, 78.0],
    ];
    L.polyline(llj1 as any, {
      color: '#06b6d4',
      weight: 2.5,
      dashArray: '5, 4',
      opacity: 0.85,
    }).addTo(regimeLayerGroup);
    L.polyline(llj2 as any, {
      color: '#0284c7',
      weight: 2,
      dashArray: '6, 5',
      opacity: 0.75,
    }).addTo(regimeLayerGroup);

    // 3. Active Monsoon Cluster Polygon
    const activePolygon = [
      [18.0, 73.0],
      [23.5, 74.0],
      [25.0, 80.0],
      [21.5, 83.0],
      [18.0, 77.0],
    ];
    L.polygon(activePolygon as any, {
      color: '#06b6d4',
      weight: 1.5,
      fillColor: '#06b6d4',
      fillOpacity: 0.18,
      dashArray: '4, 4',
    }).addTo(regimeLayerGroup);

    const activeLabel = L.divIcon({
      className: 'active-label-icon',
      html: `
        <div style="
          background: #141414;
          border: 1px solid #06b6d4;
          color: #2dd4bf;
          font-family: inherit;
          font-size: 9px;
          font-weight: bold;
          padding: 3px 7px;
          border-radius: 4px;
          white-space: nowrap;
          box-shadow: 0 2px 6px rgba(0,0,0,0.5);
          transform: translate(-50%, -50%);
        ">
          ACTIVE MONSOON (78.4% CLUSTER)
        </div>
      `,
      iconSize: [0, 0],
    });
    L.marker([21.0, 77.5], { icon: activeLabel }).addTo(regimeLayerGroup);

    // 4. Western Ghats Orographic Convective Surge Ridge (Amber)
    const orographicRidge = [
      [19.0, 73.2],
      [17.0, 73.6],
      [14.5, 74.5],
    ];
    L.polyline(orographicRidge as any, {
      color: '#f59e0b',
      weight: 4.5,
      opacity: 0.9,
    }).addTo(regimeLayerGroup);

    const oroLabel = L.divIcon({
      className: 'oro-label-icon',
      html: `
        <div style="
          background: #141414;
          border: 1px solid #f59e0b;
          color: #fbbf24;
          font-family: inherit;
          font-size: 8px;
          font-weight: bold;
          padding: 2px 5px;
          border-radius: 3px;
          white-space: nowrap;
          box-shadow: 0 2px 6px rgba(0,0,0,0.5);
          transform: translate(-110%, -50%);
        ">
          OROGRAPHIC GHATS
        </div>
      `,
      iconSize: [0, 0],
    });
    L.marker([16.5, 73.5], { icon: oroLabel }).addTo(regimeLayerGroup);

    // 5. Bay of Bengal Cyclonic Depression Vortex (LPA 994 hPa)
    L.circle([19.5, 88.5], {
      radius: 160000,
      color: '#3b82f6',
      weight: 1.5,
      fillColor: '#3b82f6',
      fillOpacity: 0.18,
      dashArray: '4, 4',
    }).addTo(regimeLayerGroup);

    L.circle([19.5, 88.5], {
      radius: 70000,
      color: '#ef4444',
      weight: 2,
      fillColor: '#ef4444',
      fillOpacity: 0.45,
    }).addTo(regimeLayerGroup);

    const depLabel = L.divIcon({
      className: 'dep-label-icon',
      html: `
        <div style="
          background: #141414;
          border: 1px solid #3b82f6;
          color: #60a5fa;
          font-family: inherit;
          font-size: 9px;
          font-weight: bold;
          padding: 2px 6px;
          border-radius: 4px;
          white-space: nowrap;
          box-shadow: 0 2px 6px rgba(0,0,0,0.5);
          transform: translate(-50%, 80%);
        ">
          DEPRESSION (LPA 994 hPa)
        </div>
      `,
      iconSize: [0, 0],
    });
    L.marker([19.5, 88.5], { icon: depLabel }).addTo(regimeLayerGroup);

    // Initial frame fitting strictly to India bounds without letterboxing
    map.setView([22.5, 79.5], 5);
    map.fitBounds([
      [8.0, 68.0],
      [35.0, 96.0],
    ], { padding: [0, 0] });

    mapInstanceRef.current = map;

    // Invalidate size on mount to fill 100% of div
    map.invalidateSize();
    const t1 = setTimeout(() => map.invalidateSize(), 100);
    const t2 = setTimeout(() => map.invalidateSize(), 300);
    const t3 = setTimeout(() => map.invalidateSize(), 600);

    let ro: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined' && mapContainerRef.current) {
      ro = new ResizeObserver(() => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.invalidateSize();
        }
      });
      ro.observe(mapContainerRef.current);
    }

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      if (ro) ro.disconnect();
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [isLeafletReady]);

  // 5-Day Regime Evolution Timesteps matching Image 8 (media_1790525763019.png)
  const evolutionSteps = [
    { time: '00Z (T+0)', active: 78, depression: 12, orographic: 6, break: 4, hasBadge: false },
    { time: '+24Z', active: 72, depression: 16, orographic: 8, break: 4, hasBadge: false },
    { time: '+48Z', active: 62, depression: 22, orographic: 10, break: 6, hasBadge: false },
    { time: '+72Z', active: 42, depression: 38, orographic: 12, break: 8, hasBadge: true, badgeText: 'SHIFT PEAK' },
    { time: '+96Z', active: 32, depression: 48, orographic: 12, break: 8, hasBadge: false },
    { time: '+120Z', active: 28, depression: 52, orographic: 12, break: 8, hasBadge: false },
  ];

  // Regime Diagnostic Profile Parameters matching Image 8
  const diagnosticProfile = [
    {
      variable: 'Zonal Wind Shear (850-200 hPa)',
      value: '-28.4 m/s',
      desc: 'Upper easterly jet vs lower westerly monsoon',
      badge: 'Favorable (Shear OK)',
      badgeColor: 'text-teal-400 border-teal-500/50',
    },
    {
      variable: 'Total Precipitable Water (TPW)',
      value: '64.2 mm',
      desc: 'Atmospheric column integrated moisture',
      badge: '96th Percentile',
      badgeColor: 'text-teal-400 border-teal-500/50',
    },
    {
      variable: 'Monsoon Trough Latitude',
      value: '26.4° N',
      desc: 'Mean sea level trough axis positioning',
      badge: 'Normal Position (+0.4°)',
      badgeColor: 'text-amber-400 border-amber-500/50',
    },
    {
      variable: 'Cross-Equatorial Flow (Findlater)',
      value: '38.4 m/s',
      desc: 'Equatorial Somali Jet momentum transport',
      badge: 'Active (Surge Phase)',
      badgeColor: 'text-teal-400 border-teal-500/50',
    },
  ];

  // Regime-Dependent Bias Correction Factors matching Image 8
  const biasCorrectionFactors = [
    {
      regime: 'Active Monsoon (Current)',
      gain: '+24.2% Convective Amp',
      gainColor: 'text-teal-400 font-bold',
      desc: 'Raw NWP systematically underpredicts intense mesoscale convective cores. Amplification applied to coastal and central belts.',
      dotColor: 'bg-teal-400',
    },
    {
      regime: 'Monsoon Depression',
      gain: '-12 km Track / +18% Surge',
      gainColor: 'text-sky-400 font-bold',
      desc: 'Compensates for northward track displacement bias and under-forecast coastal wind shear surges.',
      dotColor: 'bg-sky-400',
    },
    {
      regime: 'Orographic Ghats',
      gain: '+31.5% Precip Enhance',
      gainColor: 'text-amber-400 font-bold',
      desc: 'Suppresses dry bias along Western Ghats ridgeline elevation steps (0.05° terrain resolved).',
      dotColor: 'bg-amber-400',
    },
    {
      regime: 'Monsoon Break',
      gain: '-42.0% False-Alarm Damp',
      gainColor: 'text-rose-400 font-bold',
      desc: 'Dampens spurious light drizzle generated by parameterized convection over Central India during quiescent phases.',
      dotColor: 'bg-rose-400',
    },
  ];

  // MoE Sub-Model Weights matching Image 8
  const moeWeights = [
    { name: 'Synoptic Monsoon Wave Expert', weight: 0.42, color: 'bg-teal-400' },
    { name: 'Orographic Convective Expert', weight: 0.38, color: 'bg-amber-400' },
    { name: 'Tropical Cyclone / Depression Expert', weight: 0.12, color: 'bg-sky-500' },
    { name: 'Boundary Layer Empirical Expert', weight: 0.08, color: 'bg-slate-400' },
  ];

  return (
    <div className="space-y-4 font-mono select-none">
      {/* 1. Header Bar */}
      <div className="bg-white dark:bg-[#141414] border border-neutral-200 dark:border-[#262626] rounded-lg p-3.5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base font-bold text-neutral-900 dark:text-neutral-100 uppercase tracking-tight">
              Atmospheric Regime Intelligence & Detection
            </h1>
            <span className="text-[10px] px-2 py-0.5 rounded-full border border-neutral-300 dark:border-[#262626] text-neutral-800 dark:text-neutral-200 font-bold bg-neutral-100 dark:bg-[#1a1a1a]">
              MoE-0.3-OPERATIONAL
            </span>
          </div>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 font-sans mt-0.5">
            Synoptic-scale regime classification, transition dynamics, and regime-specific bias weight attribution across 736 districts
          </p>
        </div>

        {/* Top-Right Technical Meta Box */}
        <div className="p-2 rounded bg-neutral-50 dark:bg-[#1a1a1a] border border-neutral-200 dark:border-[#262626] text-[10px] text-neutral-500 dark:text-neutral-400 font-mono space-y-0.5">
          <div className="flex items-center gap-3">
            <span>Run: <strong className="text-neutral-800 dark:text-neutral-200">2026-09-27 06Z</strong></span>
            <span>|</span>
            <span>Domain: <strong className="text-neutral-800 dark:text-neutral-200">South Asian Monsoon</strong></span>
          </div>
          <div className="flex items-center gap-3">
            <span>Classifier: <strong className="text-neutral-900 dark:text-neutral-100 font-bold">Neural MoE v2.3</strong></span>
            <span>|</span>
            <span>Members: <strong className="text-neutral-800 dark:text-neutral-200">51</strong></span>
            <span>|</span>
            <span>Span: <strong className="text-neutral-800 dark:text-neutral-200">00Z to +120Z</strong></span>
          </div>
        </div>
      </div>

      {/* 2. Top 4 KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Card 1: Dominant Regime */}
        <div className="p-3.5 rounded-lg bg-white dark:bg-[#141414] border border-neutral-200 dark:border-[#262626] flex flex-col justify-between">
          <div className="text-[10px] uppercase tracking-wider text-neutral-500 dark:text-neutral-400 font-semibold mb-1">
            DOMINANT REGIME (ACTIVE)
          </div>
          <div>
            <div className="text-xl font-bold text-neutral-900 dark:text-neutral-100 font-mono tracking-tight">
              ACTIVE MONSOON
            </div>
            <div className="text-xs text-neutral-600 dark:text-neutral-300 mt-0.5">
              <strong className="text-neutral-900 dark:text-white">78.4%</strong> Confidence: <span className="text-emerald-600 dark:text-emerald-400 font-semibold">High</span>
            </div>
          </div>
          <div className="mt-2 pt-2 border-t border-neutral-200 dark:border-[#262626] text-[10px] text-neutral-500 dark:text-neutral-400 flex items-center justify-between">
            <span>Persistence: 38h elapsed</span>
            <span>Stability: 0.91</span>
          </div>
        </div>

        {/* Card 2: Transition Probability */}
        <div className="p-3.5 rounded-lg bg-white dark:bg-[#141414] border border-neutral-200 dark:border-[#262626] flex flex-col justify-between">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] uppercase tracking-wider text-neutral-500 dark:text-neutral-400 font-semibold">
              TRANSITION PROBABILITY (+48H)
            </span>
            <span className="text-[9px] px-1.5 py-0.5 rounded border border-emerald-300 dark:border-emerald-900/60 text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/20">
              LOW RISK
            </span>
          </div>
          <div>
            <div className="text-xl font-bold text-neutral-900 dark:text-neutral-100 font-mono tracking-tight">
              LOW • 14.2%
            </div>
            <div className="text-xs text-neutral-600 dark:text-neutral-300 mt-0.5">
              Next: Depression Low t = <span className="text-neutral-900 dark:text-white font-semibold">+44h</span>
            </div>
          </div>
          <div className="mt-2 pt-2 border-t border-neutral-200 dark:border-[#262626] text-[10px] text-neutral-500 dark:text-neutral-400 flex items-center justify-between">
            <span>Critical threshold: 40.0%</span>
            <span className="text-neutral-400 dark:text-neutral-500">Bay of Bengal code</span>
          </div>
        </div>

        {/* Card 3: Primary Synoptic Driver */}
        <div className="p-3.5 rounded-lg bg-white dark:bg-[#141414] border border-neutral-200 dark:border-[#262626] flex flex-col justify-between">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] uppercase tracking-wider text-neutral-500 dark:text-neutral-400 font-semibold">
              PRIMARY SYNOPTIC DRIVER
            </span>
            <Wind size={13} className="text-neutral-400" />
          </div>
          <div>
            <div className="text-xl font-bold text-neutral-900 dark:text-neutral-100 font-mono tracking-tight">
              LLJ 850 hPa Core
            </div>
            <div className="text-xs text-neutral-600 dark:text-neutral-300 mt-0.5">
              <strong className="text-neutral-900 dark:text-white">42.1 kts</strong> Arabian Sea Advection
            </div>
          </div>
          <div className="mt-2 pt-2 border-t border-neutral-200 dark:border-[#262626] text-[10px] text-neutral-500 dark:text-neutral-400 flex items-center justify-between">
            <span>Core Azimuth: 242° WSW</span>
            <span>Vorticity: +8.4×10⁻⁵</span>
          </div>
        </div>

        {/* Card 4: Mixture Entropy */}
        <div className="p-3.5 rounded-lg bg-white dark:bg-[#141414] border border-neutral-200 dark:border-[#262626] flex flex-col justify-between">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] uppercase tracking-wider text-neutral-500 dark:text-neutral-400 font-semibold">
              MIXTURE ENTROPY
            </span>
            <span className="text-xs font-bold text-neutral-900 dark:text-neutral-100">0.43 bits</span>
          </div>
          <div className="space-y-1.5 my-1">
            <div className="flex items-center justify-between text-[10px]">
              <span className="text-neutral-500 dark:text-neutral-400">Active: 78%</span>
              <span className="text-neutral-500 dark:text-neutral-400">Depression: 14%</span>
            </div>
            <div className="w-full bg-neutral-200 dark:bg-[#222222] rounded-full h-1.5 overflow-hidden flex">
              <div className="h-full bg-neutral-800 dark:bg-white" style={{ width: '78%' }} />
              <div className="h-full bg-sky-500" style={{ width: '14%' }} />
              <div className="h-full bg-amber-500" style={{ width: '8%' }} />
            </div>
          </div>
          <div className="mt-2 pt-2 border-t border-neutral-200 dark:border-[#262626] text-[10px] text-neutral-500 dark:text-neutral-400 flex items-center justify-between">
            <span>Geographic: 82%</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Quasi-steady</span>
          </div>
        </div>
      </div>

      {/* 3. Main Split Grid: Synoptic Real Leaflet Map + 5-Day Stacked Evolution (Left) vs Profile & Bias Factors (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Column (7 cols): Real Leaflet Map + 5-Day Stacked Evolution */}
        <div className="lg:col-span-7 space-y-4">
          {/* Top Panel: Real Leaflet Map for Synoptic Regime Flow & District Classification */}
          <div className="bg-white dark:bg-[#141414] border border-neutral-200 dark:border-[#262626] rounded-lg p-3.5 overflow-hidden flex flex-col justify-between">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-neutral-200 dark:border-[#262626] mb-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-neutral-900 dark:text-neutral-100 uppercase tracking-wide">
                  Synoptic Regime Flow & District Classification
                </span>
              </div>
              <div className="flex items-center gap-2 text-[10px] text-neutral-500 dark:text-neutral-400 font-mono">
                <span>[Domain: 08°N-37°N, 68°E-98°E]</span>
                <span className="px-1.5 py-0.5 rounded border border-neutral-300 dark:border-[#262626] text-neutral-700 dark:text-neutral-300 font-bold bg-neutral-100 dark:bg-[#1a1a1a]">
                  LIVE VECTOR FIELD
                </span>
              </div>
            </div>

            {/* Sub-bar with Cursor Coordinate & Mode Toggle Pills */}
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono mb-2">
              <div className="text-[10px] text-neutral-500 dark:text-neutral-400">
                Cursor: <span className="text-neutral-900 dark:text-neutral-200 font-semibold">18.978° N, 72.825° E</span> | Pres: <span className="text-neutral-700 dark:text-neutral-300">850 hPa</span> | U-Wind: <span className="text-neutral-700 dark:text-neutral-300">22.4 m/s</span>
              </div>

              <div className="flex items-center gap-1 font-mono text-[10px]">
                {['Streamlines', 'Moisture Flux', '850hPa Z', 'VTT Anomaly'].map((mode) => {
                  const isActive = activeMapMode === mode.toLowerCase().replace(' ', '-');
                  return (
                    <button
                      key={mode}
                      onClick={() => setActiveMapMode(mode.toLowerCase().replace(' ', '-'))}
                      className={`px-2.5 py-0.5 rounded-full transition-all border ${
                        isActive || (activeMapMode === 'streamlines' && mode === 'Streamlines')
                          ? 'bg-[#1A8FCB] text-white dark:bg-white dark:text-black border-[#1A8FCB] dark:border-white font-bold'
                          : 'bg-transparent text-neutral-600 dark:text-neutral-400 border-neutral-200 dark:border-[#262626] hover:border-neutral-400 dark:hover:border-neutral-600'
                      }`}
                    >
                      {mode}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Real Geographic Leaflet Map Canvas (Full Bleed, No Gaps) */}
            <div className="relative w-full h-[320px] min-h-[320px] flex-1 bg-neutral-100 dark:bg-[#0A0A0A] rounded-lg overflow-hidden border border-neutral-200 dark:border-[#262626]">
              <div
                ref={mapContainerRef}
                className="w-full h-full min-h-[320px] z-0 bg-neutral-100 dark:bg-[#0A0A0A]"
                style={{ width: '100%', height: '100%' }}
              />

              {!isLeafletReady && (
                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/90 dark:bg-[#0A0A0A]/90 text-neutral-600 dark:text-neutral-400 gap-3 font-mono text-xs">
                  <RefreshCw size={24} className="animate-spin text-neutral-900 dark:text-neutral-100" />
                  <span>Loading Synoptic Regime Cartography...</span>
                </div>
              )}
            </div>

            {/* Bottom Active Regime Legend */}
            <div className="mt-2.5 pt-2 border-t border-neutral-200 dark:border-[#262626] flex flex-wrap items-center justify-between text-[10px] font-mono text-neutral-500 dark:text-neutral-400 gap-2">
              <div className="flex items-center gap-3">
                <span className="text-neutral-500 uppercase font-semibold">ACTIVE REGIME LEGEND:</span>
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="text-neutral-700 dark:text-neutral-300">Active Monsoon</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-sky-500" />
                  <span className="text-neutral-700 dark:text-neutral-300">Monsoon Depression</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  <span className="text-neutral-700 dark:text-neutral-300">Orographic Convect.</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-rose-500" />
                  <span className="text-neutral-700 dark:text-neutral-300">Monsoon Break</span>
                </div>
              </div>

              <span className="text-[9px] text-neutral-400 dark:text-neutral-500">
                Scale: 1:7,500,000 | EPS 51 Res. Median
              </span>
            </div>
          </div>

          {/* Bottom Panel: 5-Day Regime Transition Stacked Bar Chart */}
          <div className="bg-white dark:bg-[#141414] border border-neutral-200 dark:border-[#262626] rounded-lg p-3.5">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-neutral-200 dark:border-[#262626] mb-2.5">
              <div>
                <span className="text-xs font-bold text-neutral-900 dark:text-neutral-100 uppercase tracking-wide">
                  5-Day Regime Transition Probability Matrix & Evolution Horizon
                </span>
              </div>

              <div className="flex items-center gap-3 text-[10px] font-mono">
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded bg-emerald-500" />
                  <span>Active</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded bg-sky-500" />
                  <span>Depression</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded bg-amber-500" />
                  <span>Orographic</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded bg-rose-500" />
                  <span>Break</span>
                </div>
              </div>
            </div>

            {/* Stacked Bars Grid */}
            <div className="overflow-x-auto pb-1">
              <div className="grid grid-cols-6 gap-2 pt-2 min-w-[340px]">
                {evolutionSteps.map((step) => (
                  <div key={step.time} className="flex flex-col items-center">
                    {/* Optional Peak Badge */}
                    <div className="h-5 flex items-center justify-center">
                      {step.hasBadge && (
                        <span className="text-[8px] font-bold px-1.5 py-0.5 rounded bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-300 dark:border-rose-900/60">
                          {step.badgeText}
                        </span>
                      )}
                    </div>

                    {/* Stacked Vertical Bar */}
                    <div className="w-full max-w-[46px] h-36 bg-neutral-100 dark:bg-[#0A0A0A] rounded overflow-hidden flex flex-col-reverse border border-neutral-200 dark:border-[#262626] my-1">
                      {/* Active (Bottom) */}
                      <div className="w-full bg-emerald-500" style={{ height: `${step.active}%` }} />
                      {/* Depression */}
                      <div className="w-full bg-sky-500" style={{ height: `${step.depression}%` }} />
                      {/* Orographic */}
                      <div className="w-full bg-amber-500" style={{ height: `${step.orographic}%` }} />
                      {/* Break (Top) */}
                      <div className="w-full bg-rose-500" style={{ height: `${step.break}%` }} />
                    </div>

                    {/* Timestep Label */}
                    <div className="text-[10px] text-neutral-800 dark:text-neutral-300 font-bold mt-1">{step.time}</div>
                    <div className="text-[9px] text-emerald-600 dark:text-emerald-400 font-semibold">{step.active}% Act</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Annotation */}
            <div className="mt-3 pt-2 border-t border-neutral-200 dark:border-[#262626] flex items-center justify-between text-[10px] text-neutral-500 dark:text-neutral-400 font-mono">
              <div className="flex items-center gap-1.5">
                <span className="text-neutral-900 dark:text-neutral-100 font-bold">ℹ</span>
                <span>Ensemble spread indicates regime bifurcation at +64h as BoB depression forms (38 of 51 members agree).</span>
              </div>
              <span className="text-neutral-800 dark:text-neutral-200 font-semibold">Brier Score: 0.118</span>
            </div>
          </div>
        </div>

        {/* Right Column (5 cols): Diagnostic Profile, Bias Factors & MoE Weights */}
        <div className="lg:col-span-5 space-y-3.5">
          {/* Card 1: Regime Diagnostic Profile */}
          <div className="bg-white dark:bg-[#141414] border border-neutral-200 dark:border-[#262626] rounded-lg p-3.5">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-200 dark:border-[#262626] mb-2">
              <span className="text-xs font-bold text-neutral-900 dark:text-neutral-100 uppercase tracking-wide">
                Regime Diagnostic Profile: Active Monsoon
              </span>
              <span className="text-[9px] px-2 py-0.5 rounded-full border border-neutral-300 dark:border-[#262626] text-neutral-700 dark:text-neutral-300 font-bold bg-neutral-100 dark:bg-[#1a1a1a]">
                STATE-MATCH 98%
              </span>
            </div>

            <div className="divide-y divide-neutral-200 dark:divide-[#262626]">
              {diagnosticProfile.map((p) => (
                <div key={p.variable} className="py-2 first:pt-0 last:pb-0 text-xs font-mono">
                  <div className="flex items-baseline justify-between mb-0.5">
                    <span className="text-neutral-800 dark:text-neutral-200 font-semibold text-[11px]">{p.variable}</span>
                    <span className="text-neutral-900 dark:text-white font-bold text-xs">{p.value}</span>
                  </div>
                  <div className="flex items-center justify-between text-[9px]">
                    <span className="text-neutral-500 dark:text-neutral-400 font-sans">{p.desc}</span>
                    <span className="px-1.5 py-0.5 rounded border border-neutral-200 dark:border-[#262626] text-neutral-700 dark:text-neutral-300 bg-neutral-50 dark:bg-[#1a1a1a] font-semibold">
                      {p.badge}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Card 2: Regime-Dependent Bias Correction Factors */}
          <div className="bg-white dark:bg-[#141414] border border-neutral-200 dark:border-[#262626] rounded-lg p-3.5">
            <div className="flex items-center justify-between pb-1.5 border-b border-neutral-200 dark:border-[#262626] mb-1.5">
              <span className="text-xs font-bold text-neutral-900 dark:text-neutral-100 uppercase tracking-wide">
                Regime Dependent Bias Correction Factors
              </span>
              <span className="text-[9px] text-neutral-500 dark:text-neutral-400 font-mono">736 Districts Calibrated</span>
            </div>
            <p className="text-[10px] text-neutral-500 dark:text-neutral-400 font-sans mb-2.5 leading-tight">
              Operational calibration adjustments dynamically applied by EVRIN to raw NWP ensemble members based on the classified synoptic regime:
            </p>

            <div className="space-y-2">
              {biasCorrectionFactors.map((item) => (
                <div key={item.regime} className="p-2 rounded bg-neutral-50 dark:bg-[#1a1a1a] border border-neutral-200 dark:border-[#262626] text-[10px] font-mono">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-1.5">
                      <span className={`w-1.5 h-1.5 rounded-full ${item.dotColor}`} />
                      <strong className="text-neutral-900 dark:text-neutral-200">{item.regime}</strong>
                    </div>
                    <span className={item.gainColor}>{item.gain}</span>
                  </div>
                  <p className="text-neutral-600 dark:text-neutral-400 font-sans text-[10px] leading-snug">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Card 3: Mixture of Experts (MoE) Sub-Model Weights */}
          <div className="bg-white dark:bg-[#141414] border border-neutral-200 dark:border-[#262626] rounded-lg p-3.5">
            <div className="flex items-center justify-between pb-1.5 border-b border-neutral-200 dark:border-[#262626] mb-2">
              <span className="text-xs font-bold text-neutral-900 dark:text-neutral-100 uppercase tracking-wide">
                Mixture of Experts (MoE) Sub-Model Weights
              </span>
              <span className="text-[9px] px-2 py-0.5 rounded-full border border-neutral-300 dark:border-[#262626] text-neutral-700 dark:text-neutral-300 font-bold bg-neutral-100 dark:bg-[#1a1a1a]">
                Σ = 1.00
              </span>
            </div>

            <div className="space-y-2.5">
              {moeWeights.map((w) => (
                <div key={w.name} className="text-xs font-mono">
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span className="text-neutral-700 dark:text-neutral-300 truncate">{w.name}</span>
                    <span className="text-neutral-900 dark:text-neutral-100 font-bold">{w.weight.toFixed(2)}</span>
                  </div>
                  <div className="w-full bg-neutral-200 dark:bg-[#222222] rounded-full h-1.5 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${w.color}`}
                      style={{ width: `${w.weight * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-3 pt-2 border-t border-neutral-200 dark:border-[#262626] flex items-center justify-between text-[10px] text-neutral-500 dark:text-neutral-400 font-mono">
              <span>Gating Model: <strong className="text-neutral-800 dark:text-neutral-200">ResNet-Transformer v2.7</strong></span>
              <span>Inference: <strong className="text-neutral-900 dark:text-neutral-100">14.8 ms</strong></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
