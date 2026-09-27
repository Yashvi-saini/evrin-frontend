'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Badge } from '@/shared/ui/badge';
import { AlertTriangle, RefreshCw, ShieldAlert, Users, Clock, Wind, ArrowUpRight, Zap, CheckCircle2, Download, Play, SkipBack, SkipForward } from '@/shared/ui/icons';
import { useForecastRepository } from '@/entities/repository';
import { useTheme } from '@/shared/lib/theme';

declare global {
  interface Window {
    L: any;
  }
}

export default function ExtremesPage() {
  const { theme } = useTheme();
  const { activeScenario, isLoading } = useForecastRepository();
  const [selectedThreshold, setSelectedThreshold] = useState<string>('heavy');
  const [selectedCutoff, setSelectedCutoff] = useState<string>('64.5');
  const [activeHorizon, setActiveHorizon] = useState<string>('+24h');
  const [isLeafletReady, setIsLeafletReady] = useState(false);
  const [isAnimated, setIsAnimated] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsAnimated(true), 50);
    return () => clearTimeout(timer);
  }, []);

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const tileLayerRef = useRef<any>(null);

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

  // Initialize Leaflet Map on Real Indian Subcontinent
  useEffect(() => {
    if (!isLeafletReady || !mapContainerRef.current || mapInstanceRef.current) return;

    const L = window.L;

    const map = L.map(mapContainerRef.current, {
      center: [22.8, 79.5],
      zoom: 5,
      minZoom: 4,
      maxZoom: 10,
      zoomControl: false,
    });

    // Theme-Aware GIS Basemap
    const isDark = theme === 'dark';
    const tileUrl = isDark
      ? 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}'
      : 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}';

    const tileLayer = L.tileLayer(tileUrl, {
      attribution: '&copy; Esri &mdash; National Meteorological Hazard Grid',
      maxZoom: 16,
    }).addTo(map);
    tileLayerRef.current = tileLayer;

    // Zoom controls top right
    L.control.zoom({ position: 'topright' }).addTo(map);

    // Hazard layer groups
    const hazardGroup = L.layerGroup().addTo(map);

    // 1. Synoptic Trough & Moisture Vector Line (Ratnagiri -> Meerut -> Uttarkashi)
    L.polyline(
      [
        [16.99, 73.31], // Ratnagiri
        [22.5, 75.8],   // Central convergence
        [28.98, 77.7],  // Meerut
        [30.73, 78.44], // Uttarkashi
      ],
      {
        color: '#0891b2',
        weight: 2.5,
        dashArray: '6, 5',
        opacity: 0.85,
      }
    ).addTo(hazardGroup);

    // Bay of Bengal moisture plume to Cherrapunji
    L.polyline(
      [
        [19.5, 87.0],
        [22.0, 90.0],
        [25.27, 91.73],
      ],
      {
        color: '#0891b2',
        weight: 2,
        dashArray: '5, 5',
        opacity: 0.75,
      }
    ).addTo(hazardGroup);

    // 2. Ratnagiri Hotspots & Glowing Hazard Rings
    L.circle([16.99, 73.31], {
      radius: 120000,
      color: '#ef4444',
      weight: 1,
      fillColor: '#ef4444',
      fillOpacity: 0.2,
      dashArray: '4, 4',
    }).addTo(hazardGroup);

    L.circle([16.99, 73.31], {
      radius: 65000,
      color: '#ef4444',
      weight: 1.5,
      fillColor: '#ef4444',
      fillOpacity: 0.45,
    }).addTo(hazardGroup);

    L.circleMarker([16.99, 73.31], {
      radius: 6,
      fillColor: '#ef4444',
      fillOpacity: 1,
      color: '#ffffff',
      weight: 2,
    }).addTo(hazardGroup);

    // 3. Meerut Hotspot
    L.circle([28.98, 77.7], {
      radius: 80000,
      color: '#f97316',
      weight: 1.5,
      fillColor: '#f97316',
      fillOpacity: 0.4,
    }).addTo(hazardGroup);

    L.circleMarker([28.98, 77.7], {
      radius: 6,
      fillColor: '#f97316',
      fillOpacity: 1,
      color: '#ffffff',
      weight: 2,
    }).addTo(hazardGroup);

    // 4. Uttarkashi Hotspot (Cloudburst Alert)
    L.circle([30.73, 78.44], {
      radius: 70000,
      color: '#ef4444',
      weight: 1.5,
      fillColor: '#ef4444',
      fillOpacity: 0.45,
    }).addTo(hazardGroup);

    L.circleMarker([30.73, 78.44], {
      radius: 6,
      fillColor: '#ef4444',
      fillOpacity: 1,
      color: '#ffffff',
      weight: 2,
    }).addTo(hazardGroup);

    // 5. Sohra (Cherrapunji) Hotspot
    L.circle([25.27, 91.73], {
      radius: 95000,
      color: '#ea580c',
      weight: 1.5,
      fillColor: '#ea580c',
      fillOpacity: 0.4,
    }).addTo(hazardGroup);

    L.circleMarker([25.27, 91.73], {
      radius: 6,
      fillColor: '#ea580c',
      fillOpacity: 1,
      color: '#ffffff',
      weight: 2,
    }).addTo(hazardGroup);

    // Custom Callout Marker 1: Uttarkashi
    const uttarkashiIcon = L.divIcon({
      className: 'custom-hazard-callout',
      html: `
        <div style="
          background: #141414;
          border: 1px solid #262626;
          color: #ededed;
          font-family: inherit;
          font-size: 10px;
          padding: 4px 8px;
          border-radius: 6px;
          box-shadow: 0 2px 6px rgba(0,0,0,0.4);
          white-space: nowrap;
          transform: translate(-50%, -135%);
        ">
          <div style="display: flex; align-items: center; gap: 5px;">
            <strong style="color: #ffffff;">Uttarkashi (UK)</strong>
            <span style="font-size: 8px; padding: 1px 4px; border-radius: 3px; border: 1px solid #ef4444; color: #f87171; font-weight: bold;">
              CLOUDBURST
            </span>
          </div>
          <div style="color: #f87171; font-weight: bold; font-size: 9px; margin-top: 2px;">
            74% P(&gt;115.6mm) • High Debris Flow
          </div>
        </div>
      `,
      iconSize: [0, 0],
    });
    L.marker([30.73, 78.44], { icon: uttarkashiIcon }).addTo(hazardGroup);

    // Custom Callout Marker 2: Meerut
    const meerutIcon = L.divIcon({
      className: 'custom-hazard-callout',
      html: `
        <div style="
          background: #141414;
          border: 1px solid #262626;
          color: #ededed;
          font-family: inherit;
          font-size: 10px;
          padding: 4px 8px;
          border-radius: 6px;
          box-shadow: 0 2px 6px rgba(0,0,0,0.4);
          white-space: nowrap;
          transform: translate(-10%, -125%);
        ">
          <div style="display: flex; align-items: center; gap: 6px;">
            <strong style="color: #ffffff;">Meerut (UP)</strong>
            <span style="color: #fbbf24; font-weight: bold; font-size: 11px;">82%</span>
          </div>
          <div style="color: #fde047; font-size: 9px; margin-top: 1px;">
            P(&gt;64.5mm) T+22h
          </div>
        </div>
      `,
      iconSize: [0, 0],
    });
    L.marker([28.98, 77.7], { icon: meerutIcon }).addTo(hazardGroup);

    // Custom Callout Marker 3: Sohra
    const sohraIcon = L.divIcon({
      className: 'custom-hazard-callout',
      html: `
        <div style="
          background: #141414;
          border: 1px solid #262626;
          color: #ededed;
          font-family: inherit;
          font-size: 10px;
          padding: 4px 8px;
          border-radius: 6px;
          box-shadow: 0 2px 6px rgba(0,0,0,0.4);
          white-space: nowrap;
          transform: translate(-20%, -125%);
        ">
          <div style="display: flex; align-items: center; gap: 6px;">
            <strong style="color: #ffffff;">Sohra (Cherrapunji)</strong>
            <span style="color: #f87171; font-weight: bold; font-size: 11px;">91%</span>
          </div>
          <div style="color: #a3a3a3; font-size: 9px; margin-top: 1px;">
            P(&gt;204.5mm) Inflow Convergence
          </div>
        </div>
      `,
      iconSize: [0, 0],
    });
    L.marker([25.27, 91.73], { icon: sohraIcon }).addTo(hazardGroup);

    // Custom Callout Marker 4: Ratnagiri
    const ratnagiriIcon = L.divIcon({
      className: 'custom-hazard-callout',
      html: `
        <div style="
          background: #141414;
          border: 1px solid #262626;
          color: #ededed;
          font-family: inherit;
          font-size: 10px;
          padding: 5px 9px;
          border-radius: 6px;
          box-shadow: 0 2px 6px rgba(0,0,0,0.4);
          white-space: nowrap;
          transform: translate(-50%, 20%);
        ">
          <div style="display: flex; align-items: center; gap: 6px;">
            <span style="width: 7px; height: 7px; border-radius: 9999px; background: #f43f5e; display: inline-block;"></span>
            <strong style="color: #ffffff; font-size: 11px;">Ratnagiri (MH)</strong>
            <span style="font-size: 8px; padding: 1px 4px; border-radius: 3px; border: 1px solid #ef4444; color: #f87171; font-weight: bold;">
              EXTREME
            </span>
          </div>
          <div style="color: #f87171; font-weight: bold; font-size: 9px; margin-top: 2px;">
            P(&gt;115.6mm): 96% • Orographic Amplification
          </div>
        </div>
      `,
      iconSize: [0, 0],
    });
    L.marker([16.99, 73.31], { icon: ratnagiriIcon }).addTo(hazardGroup);

    // Initial frame fitting strictly to India bounds without letterboxing
    map.setView([22.5, 79.5], 5);
    map.fitBounds([
      [8.0, 68.0],
      [35.0, 96.0],
    ], { padding: [0, 0] });

    mapInstanceRef.current = map;

    // Multiple invalidateSize triggers to ensure complete tile coverage
    map.invalidateSize();
    const t1 = setTimeout(() => map.invalidateSize(), 100);
    const t2 = setTimeout(() => map.invalidateSize(), 300);
    const t3 = setTimeout(() => map.invalidateSize(), 600);

    // ResizeObserver to automatically resize Leaflet when container dimensions change
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

  // Dynamically update tile layer when theme changes
  useEffect(() => {
    if (mapInstanceRef.current && window.L) {
      const L = window.L;
      const map = mapInstanceRef.current;
      if (tileLayerRef.current) {
        map.removeLayer(tileLayerRef.current);
      }
      const isDark = theme === 'dark';
      const tileUrl = isDark
        ? 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}'
        : 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}';
      const newLayer = L.tileLayer(tileUrl, {
        attribution: '&copy; Esri &mdash; National Meteorological Hazard Grid',
        maxZoom: 16,
      }).addTo(map);
      if (newLayer.bringToBack) newLayer.bringToBack();
      tileLayerRef.current = newLayer;
    }
  }, [theme]);

  const thresholdPills = [
    { id: 'all', label: 'All Extremes', color: 'text-slate-300 border-slate-700' },
    { id: 'heavy', label: '>64.5 mm (Heavy)', dotColor: 'bg-amber-400', color: 'text-amber-400 border-amber-500/60' },
    { id: 'very-heavy', label: '>115.6 mm (Very Heavy)', dotColor: 'bg-cyan-400', color: 'text-cyan-400 border-cyan-500/60' },
    { id: 'cloudburst', label: '>204.5 mm (Extremely Heavy / Cloudburst Risk)', dotColor: 'bg-rose-500', color: 'text-rose-400 border-rose-500/60' },
  ];

  const alertQueueItems = [
    {
      district: 'Ratnagiri, MH',
      tier: 'RED TIER',
      tierColor: 'text-rose-400 border-rose-500/60',
      prob: '96%',
      probThreshold: '>115.6mm',
      probColor: 'text-rose-400',
      zone: 'Konkan Escarpment Zone',
      peak: '28 Sep 03Z-09Z',
      expected: '184mm / 12h',
    },
    {
      district: 'Meerut, UP',
      tier: 'ORANGE TIER',
      tierColor: 'text-amber-400 border-amber-500/60',
      prob: '82%',
      probThreshold: '>64.5mm',
      probColor: 'text-amber-400',
      zone: 'Upper Gangetic Plain',
      peak: '28 Sep 12Z',
      expected: '78mm / 12h',
    },
    {
      district: 'Uttarkashi, UK',
      tier: 'LANDSLIDE RISK',
      tierColor: 'text-rose-400 border-rose-500/60',
      prob: '74%',
      probThreshold: '>115.6mm',
      probColor: 'text-rose-400',
      zone: 'Bhagirathi Basin Catchment',
      peak: 'Debris Index: 8.9 / 10',
      expected: '142mm / 24h',
    },
  ];

  const horizons = [
    { id: '+06h', label: '+06h', isPeak: false },
    { id: '+12h', label: '+12h', isPeak: false },
    { id: '+18h', label: '+18h', isPeak: false },
    { id: '+24h', label: '+24h (HIGH IMPACT PEAK)', isPeak: true },
    { id: '+36h', label: '+36h', isPeak: false },
    { id: '+48h', label: '+48h', isPeak: false },
    { id: '+60h', label: '+60h', isPeak: false },
    { id: '+72h', label: '+72h', isPeak: false },
  ];

  return (
    <div className="space-y-4 select-none transition-colors">
      {/* 1. Header Bar matching Image 6 (media_1790525351083.png) */}
      <div className="bg-white dark:bg-[#141414] border border-neutral-200 dark:border-[#262626] rounded-lg p-3.5 space-y-3 transition-colors">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-500" />
              <h1 className="text-base font-bold text-neutral-900 dark:text-neutral-100 uppercase tracking-tight">
                Extreme Event Intelligence
              </h1>
              <span className="text-[10px] px-2 py-0.5 rounded-full border border-rose-300 dark:border-rose-900/60 text-rose-600 dark:text-rose-400 font-semibold bg-transparent">
                CRITICAL SEVERITY
              </span>
            </div>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
              Probabilistic Threshold Exceedance & Flash Flood Risk Early Warning • Model Run 06 UTC
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => alert('Exporting NDMA/IMD Extreme Weather Alert Bulletin (PDF/GeoJSON)...')}
              className="px-3 py-1.5 rounded-full bg-transparent hover:bg-neutral-100 dark:hover:bg-[#1f1f1f] border border-neutral-300 dark:border-[#262626] text-neutral-700 dark:text-neutral-300 hover:text-black dark:hover:text-white text-xs transition-colors flex items-center gap-1.5"
            >
              <Download size={13} className="shrink-0" />
              <span>Export Alert Bulletin (NDMA/IMD Format)</span>
            </button>
            <button
              onClick={() => alert('Broadcasting Emergency Push Notification to District Disaster Response Forces...')}
              className="px-3.5 py-1.5 rounded-full bg-[#1A8FCB] hover:bg-[#167db3] dark:bg-white dark:hover:bg-neutral-200 text-white dark:text-black text-xs font-semibold transition-colors border border-transparent flex items-center gap-1.5 shadow-none"
            >
              <Zap size={12} className="fill-current text-amber-400 dark:text-amber-500" />
              <span>Set Push Trigger</span>
            </button>
          </div>
        </div>

        {/* Threshold Pills & Meta info */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-neutral-200 dark:border-[#262626]">
          <div className="flex items-center gap-1.5 flex-wrap">
            {thresholdPills.map((pill) => {
              const isActive = selectedThreshold === pill.id;
              return (
                <button
                  key={pill.id}
                  onClick={() => setSelectedThreshold(pill.id)}
                  className={`px-3 py-1 rounded-full text-xs transition-colors border flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-[#1A8FCB] dark:bg-white text-white dark:text-black border-[#1A8FCB] dark:border-white font-medium shadow-none'
                      : 'bg-transparent hover:bg-neutral-100 dark:hover:bg-[#1f1f1f] text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white border-neutral-300 dark:border-[#262626]'
                  }`}
                >
                  {pill.dotColor && <span className={`w-1.5 h-1.5 rounded-full ${pill.dotColor}`} />}
                  <span>{pill.label}</span>
                </button>
              );
            })}
          </div>

          <div className="text-[10px] text-neutral-500 dark:text-neutral-400 flex items-center gap-2">
            <span>ENSEMBLE MEMBERS: <strong className="text-neutral-800 dark:text-neutral-200">51/51</strong></span>
            <span>•</span>
            <span>BIAS CORRECTION: <strong className="text-neutral-900 dark:text-white font-semibold">MoE DEEP KALMAN</strong></span>
          </div>
        </div>
      </div>

      {/* 2. Top 4 KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Card 1: High Risk Districts */}
        <div className="p-3.5 rounded-lg bg-white dark:bg-[#141414] border border-neutral-200 dark:border-[#262626] flex flex-col justify-between transition-colors">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] uppercase tracking-wider text-neutral-500 dark:text-neutral-400 font-semibold">
              HIGH RISK DISTRICTS
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
          </div>
          <div className="text-2xl font-bold text-rose-600 dark:text-rose-500 my-1">
            124 <span className="text-sm font-normal text-neutral-500">Districts</span>
          </div>
          <div className="text-[11px] text-rose-600 dark:text-rose-400 font-semibold flex items-center gap-1">
            <span>+18 vs Raw NWP (Regime Shift)</span>
          </div>
        </div>

        {/* Card 2: Peak Exceedance Probability */}
        <div className="p-3.5 rounded-lg bg-white dark:bg-[#141414] border border-neutral-200 dark:border-[#262626] flex flex-col justify-between transition-colors">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] uppercase tracking-wider text-neutral-500 dark:text-neutral-400 font-semibold">
              PEAK EXCEEDANCE PROBABILITY
            </span>
            <span className="text-[9px] px-1.5 py-0.2 rounded border border-neutral-300 dark:border-[#262626] text-neutral-700 dark:text-neutral-300 font-semibold">
              P95
            </span>
          </div>
          <div className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 my-1">
            94% <span className="text-xs font-normal text-neutral-500">P(Rain &gt; 115.6mm)</span>
          </div>
          <div className="text-[10px] text-neutral-500 dark:text-neutral-400 truncate">
            Konkan & Western Ghats Escarpme...
          </div>
        </div>

        {/* Card 3: Lead Time to Peak */}
        <div className="p-3.5 rounded-lg bg-white dark:bg-[#141414] border border-neutral-200 dark:border-[#262626] flex flex-col justify-between transition-colors">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] uppercase tracking-wider text-neutral-500 dark:text-neutral-400 font-semibold">
              LEAD TIME TO PEAK
            </span>
            <Clock size={13} className="text-neutral-400" />
          </div>
          <div className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 my-1">
            T+18h to T+30h
          </div>
          <div className="text-[10px] text-neutral-600 dark:text-neutral-400">
            Critical Impact: 28 Sep 00Z - 12Z
          </div>
        </div>

        {/* Card 4: Population Exposed */}
        <div className="p-3.5 rounded-lg bg-white dark:bg-[#141414] border border-neutral-200 dark:border-[#262626] flex flex-col justify-between transition-colors">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] uppercase tracking-wider text-neutral-500 dark:text-neutral-400 font-semibold">
              POPULATION EXPOSED
            </span>
            <Users size={14} className="text-neutral-400" />
          </div>
          <div className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 my-1">
            42.8M <span className="text-xs font-normal text-neutral-500">Est. Vulnerable</span>
          </div>
          <div className="text-[10px] text-neutral-500 dark:text-neutral-400">
            Across 4 State Disaster Zones
          </div>
        </div>
      </div>

      {/* 3. Main Split Layout: Spatial Hazard Map with Real Leaflet Cartography (Left) & Alert Queue + CDF (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Column (8 cols): Spatial Hazard Map Canvas with Real Leaflet Map */}
        <div className="lg:col-span-8 bg-white dark:bg-[#141414] border border-neutral-200 dark:border-[#262626] rounded-lg overflow-hidden flex flex-col justify-between">
          {/* Map Header Ribbon */}
          <div className="p-3 border-b border-neutral-200 dark:border-[#262626] bg-neutral-50 dark:bg-[#141414] flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-neutral-500 dark:text-neutral-400 uppercase font-semibold">PROBABILITY CUTOFF:</span>
              <button
                onClick={() => setSelectedCutoff('64.5')}
                className={`px-3 py-0.5 rounded-full text-xs font-mono transition-all border ${
                  selectedCutoff === '64.5'
                    ? 'bg-[#1A8FCB] text-white dark:bg-white dark:text-black border-[#1A8FCB] dark:border-white font-bold'
                    : 'bg-transparent text-neutral-600 dark:text-neutral-400 border-neutral-200 dark:border-[#262626] hover:border-neutral-400 dark:hover:border-neutral-600'
                }`}
              >
                P(&gt;64.5mm)
              </button>
              <button
                onClick={() => setSelectedCutoff('115.6')}
                className={`px-3 py-0.5 rounded-full text-xs font-mono transition-all border ${
                  selectedCutoff === '115.6'
                    ? 'bg-[#1A8FCB] text-white dark:bg-white dark:text-black border-[#1A8FCB] dark:border-white font-bold'
                    : 'bg-transparent text-neutral-600 dark:text-neutral-400 border-neutral-200 dark:border-[#262626] hover:border-neutral-400 dark:hover:border-neutral-600'
                }`}
              >
                P(&gt;115.6mm)
              </button>
            </div>

            <div className="flex items-center gap-2 text-[10px] text-neutral-500 dark:text-neutral-400 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>EPSG:4326 | 0.05° EPS | DOPPLER COMPOSITE</span>
            </div>
          </div>

          {/* Real Geographic Leaflet Map of India */}
          <div className="relative w-full h-[460px] min-h-[460px] flex-1 bg-neutral-100 dark:bg-[#0A0A0A] overflow-hidden">
            <div
              ref={mapContainerRef}
              className="w-full h-full min-h-[460px] z-0 bg-neutral-100 dark:bg-[#0A0A0A]"
              style={{ width: '100%', height: '100%' }}
            />

            {!isLeafletReady && (
              <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/90 dark:bg-[#0A0A0A]/90 text-neutral-600 dark:text-neutral-400 gap-3 font-mono text-xs">
                <RefreshCw size={24} className="animate-spin text-neutral-900 dark:text-neutral-100" />
                <span>Loading National Hazard Map...</span>
              </div>
            )}

            {/* LLJ Arrow Callout Box */}
            <div className="absolute bottom-12 right-20 pointer-events-none z-10">
              <div className="px-2.5 py-1 rounded bg-white/95 dark:bg-[#141414]/95 border border-neutral-300 dark:border-[#262626] text-neutral-800 dark:text-neutral-200 text-[10px] font-mono flex items-center gap-1.5 shadow-sm">
                <Wind size={12} className="text-cyan-500 dark:text-cyan-400" />
                <span>LLJ: 850hPa 42kts (Moisture Core)</span>
              </div>
            </div>

            {/* Floating Discrete Probability Legend inside Map (Bottom Left) */}
            <div className="absolute bottom-3 left-3 bg-white/95 dark:bg-[#141414]/95 border border-neutral-200 dark:border-[#262626] p-2 rounded text-[9px] font-mono select-none z-10 shadow-sm">
              <div className="flex justify-between items-center text-neutral-500 dark:text-neutral-400 mb-1">
                <span>PROBABILITY EXCEEDANCE</span>
                <span className="text-neutral-400 dark:text-neutral-500">%</span>
              </div>
              <div className="flex items-center gap-0.5 mb-1">
                {[
                  { label: '10%', color: '#0284c7' },
                  { label: '30%', color: '#06b6d4' },
                  { label: '50%', color: '#eab308' },
                  { label: '75%', color: '#f97316' },
                  { label: '100%', color: '#ef4444' },
                ].map((item) => (
                  <div key={item.label} className="flex flex-col items-center">
                    <span className="w-6 h-1.5 rounded-sm" style={{ backgroundColor: item.color }} />
                    <span className="text-neutral-500 dark:text-neutral-400 text-[8px] mt-0.5">{item.label}</span>
                  </div>
                ))}
              </div>
              <div className="text-[9px] text-neutral-500 dark:text-neutral-400">
                Threshold: <span className="text-neutral-900 dark:text-neutral-100 font-semibold">&gt; 115.6 mm / 24h</span>
              </div>
            </div>
          </div>

          {/* Map Bottom Timeline Bar */}
          <div className="p-2.5 border-t border-neutral-200 dark:border-[#262626] bg-neutral-50 dark:bg-[#141414] flex flex-wrap items-center justify-between gap-2 z-10 text-[10px] font-mono">
            <div className="flex items-center gap-2">
              <span className="text-neutral-500 dark:text-neutral-400 font-semibold uppercase">TEMPORAL FORECAST HORIZON</span>
              <span className="px-2 py-0.5 rounded-full border border-neutral-300 dark:border-[#262626] text-neutral-900 dark:text-neutral-100 font-bold bg-neutral-100 dark:bg-[#1a1a1a]">
                +24h (28 Sep 06Z)
              </span>
            </div>

            {/* Player Controls & Horizon Pills */}
            <div className="flex items-center gap-1.5">
              <div className="flex items-center gap-1 text-neutral-500 dark:text-neutral-400 px-1">
                <button className="p-0.5 hover:text-black dark:hover:text-white transition-colors" title="First">
                  <SkipBack size={11} />
                </button>
                <button className="p-0.5 hover:text-black dark:hover:text-white text-neutral-900 dark:text-white transition-colors" title="Play / Pause">
                  <Play size={11} className="fill-current" />
                </button>
                <button className="p-0.5 hover:text-black dark:hover:text-white transition-colors" title="Last">
                  <SkipForward size={11} />
                </button>
              </div>

              {horizons.map((h) => {
                const isActive = activeHorizon === h.id;
                return (
                  <button
                    key={h.id}
                    onClick={() => setActiveHorizon(h.id)}
                    className={`px-2 py-0.5 rounded-full transition-all border ${
                      isActive
                        ? 'bg-[#1A8FCB] text-white dark:bg-white dark:text-black border-[#1A8FCB] dark:border-white font-bold'
                        : h.isPeak
                        ? 'bg-transparent text-rose-600 dark:text-rose-400 border-rose-300 dark:border-rose-900/60 font-semibold'
                        : 'bg-transparent text-neutral-600 dark:text-neutral-400 border-neutral-200 dark:border-[#262626] hover:border-neutral-400 dark:hover:border-neutral-600'
                    }`}
                  >
                    {h.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column (4 cols): Priority Alert Queue, Tail-Risk CDF, and Physics Attribution */}
        <div className="lg:col-span-4 space-y-3.5">
          {/* Card 1: Priority Alert Queue */}
          <div className="bg-white dark:bg-[#141414] border border-neutral-200 dark:border-[#262626] rounded-lg p-3.5">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-200 dark:border-[#262626] mb-2.5">
              <div className="flex items-center gap-1.5">
                <AlertTriangle size={14} className="text-rose-500" />
                <span className="text-xs font-bold text-neutral-900 dark:text-neutral-100 uppercase tracking-wide">
                  Priority Alert Queue
                </span>
              </div>
              <span className="text-[9px] px-2 py-0.5 rounded-full border border-rose-300 dark:border-rose-900/60 text-rose-600 dark:text-rose-400 font-mono font-bold bg-rose-50 dark:bg-rose-950/20">
                124 IN WARNING
              </span>
            </div>

            <div className="space-y-2.5">
              {alertQueueItems.map((item) => (
                <div
                  key={item.district}
                  className="p-2.5 rounded-lg bg-neutral-50 dark:bg-[#1a1a1a] border border-neutral-200 dark:border-[#262626] text-xs font-mono"
                >
                  <div className="flex items-baseline justify-between mb-1">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-neutral-900 dark:text-neutral-100">{item.district}</span>
                      <span className={`text-[8px] px-1.5 py-0.2 rounded border bg-transparent font-bold ${item.tierColor}`}>
                        {item.tier}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className={`text-base font-bold ${item.probColor}`}>{item.prob}</div>
                      <div className="text-[9px] text-neutral-400 dark:text-neutral-500">{item.probThreshold}</div>
                    </div>
                  </div>
                  <div className="text-[10px] text-neutral-500 dark:text-neutral-400 font-sans">{item.zone}</div>
                  <div className="mt-1.5 pt-1.5 border-t border-neutral-200 dark:border-[#262626] flex items-center justify-between text-[9px] text-neutral-500 dark:text-neutral-400">
                    <span>{item.peak}</span>
                    <span className="text-neutral-700 dark:text-neutral-300 font-semibold">{item.expected}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Card 2: Threshold CDF Tail-Risk */}
          <div className="bg-white dark:bg-[#141414] border border-neutral-200 dark:border-[#262626] rounded-lg p-3.5">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-200 dark:border-[#262626] mb-1.5">
              <span className="text-xs font-bold text-neutral-900 dark:text-neutral-100 uppercase tracking-wide">
                Threshold CDF Tail-Risk
              </span>
              <span className="text-[9px] px-2 py-0.5 rounded-full border border-neutral-300 dark:border-[#262626] text-neutral-700 dark:text-neutral-300 font-bold bg-neutral-100 dark:bg-[#1a1a1a]">
                MoE BOOSTED
              </span>
            </div>
            <p className="text-[10px] text-neutral-500 dark:text-neutral-400 font-sans mb-2 leading-tight">
              Comparison of Raw ECMWF/NWP vs EVRIN Mixture-of-Experts Corrected Tail Probabilities.
            </p>

            {/* SVG S-Curve Plot */}
            <div className="w-full h-28 bg-neutral-50 dark:bg-[#0A0A0A] rounded border border-neutral-200 dark:border-[#262626] p-2 flex items-center justify-center relative">
              <svg viewBox="0 0 300 90" className="w-full h-full">
                {/* Horizontal reference line */}
                <line x1="15" y1="80" x2="285" y2="80" stroke="#737373" strokeWidth="0.5" strokeDasharray="2 2" />
                <line x1="15" y1="15" x2="285" y2="15" stroke="#737373" strokeWidth="0.5" strokeDasharray="3 3" />

                {/* Vertical Extreme threshold boundary (dashed red) */}
                <line x1="180" y1="10" x2="180" y2="80" stroke="#ef4444" strokeWidth="1" strokeDasharray="2 2" />

                {/* Shaded Tail Amplification Area */}
                <path
                  d="M 180,50 Q 230,22 280,18 L 280,48 Q 230,52 180,62 Z"
                  fill="#06b6d4"
                  fillOpacity={isAnimated ? 0.2 : 0}
                  style={{ transition: 'fill-opacity 1.5s ease-out' }}
                />

                {/* Raw NWP CDF (Gray curve) */}
                <path
                  d="M 15,78 Q 90,75 140,70 T 220,52 T 280,48"
                  fill="none"
                  stroke="#737373"
                  strokeWidth="1.8"
                  strokeDasharray="400"
                  strokeDashoffset={isAnimated ? 0 : 400}
                  style={{ transition: 'stroke-dashoffset 1.2s ease-out' }}
                />

                {/* EVRIN MoE Corrected CDF (Solid line) */}
                <path
                  d="M 15,78 Q 90,75 140,65 T 220,24 T 280,18"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="2.5"
                  strokeDasharray="400"
                  strokeDashoffset={isAnimated ? 0 : 400}
                  style={{ transition: 'stroke-dashoffset 1.5s cubic-bezier(0.16, 1, 0.3, 1)' }}
                />

                {/* Tail Amplification Annotation */}
                <text x="230" y="72" fill="#ef4444" fontSize="7" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
                  +38% Extreme Tail Amplification
                </text>
              </svg>
            </div>

            <div className="mt-2 flex items-center justify-between text-[9px] font-mono text-neutral-500 dark:text-neutral-400">
              <div className="flex items-center gap-1">
                <span className="w-3 h-0.5 bg-neutral-400 dark:bg-neutral-600" />
                <span>Raw NWP CDF</span>
              </div>
              <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold">
                <span className="w-3 h-0.5 bg-emerald-500" />
                <span>EVRIN MoE Corrected</span>
              </div>
            </div>
          </div>

          {/* Card 3: Physics Attribution */}
          <div className="bg-white dark:bg-[#141414] border border-neutral-200 dark:border-[#262626] rounded-lg p-3.5">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-200 dark:border-[#262626] mb-1.5">
              <span className="text-xs font-bold text-neutral-900 dark:text-neutral-100 uppercase tracking-wide">
                Physics Attribution
              </span>
              <span className="text-[9px] text-neutral-600 dark:text-neutral-400 font-mono">SHAP EXPLAIN</span>
            </div>
            <p className="text-[10px] text-neutral-500 dark:text-neutral-400 font-sans mb-2 leading-tight">
              Primary synoptic drivers boosting tail probabilities above classical parameterized thresholds:
            </p>

            <div className="space-y-1.5 text-[10px] font-mono">
              <div className="p-1.5 rounded bg-neutral-50 dark:bg-[#1a1a1a] border border-neutral-200 dark:border-[#262626] text-neutral-700 dark:text-neutral-300 flex items-start gap-1.5">
                <span className="text-neutral-900 dark:text-neutral-100 font-bold">01</span>
                <span>Orographic windward ascent velocity (W &gt; 1.8 m/s along Western Ghats ridge)</span>
              </div>
              <div className="p-1.5 rounded bg-neutral-50 dark:bg-[#1a1a1a] border border-neutral-200 dark:border-[#262626] text-neutral-700 dark:text-neutral-300 flex items-start gap-1.5">
                <span className="text-neutral-900 dark:text-neutral-100 font-bold">02</span>
                <span>Deep CAPE &gt; 2400 J/kg coupled with PWAT &gt; 62mm tropospheric moisture loading</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
