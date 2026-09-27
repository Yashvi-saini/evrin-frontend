'use client';

import React, { useState, useEffect } from 'react';
import { Badge } from '@/shared/ui/badge';
import { AlertTriangle, CloudRain, RefreshCw, Compass, Search, Pin, Download } from '@/shared/ui/icons';
import { useForecastRepository } from '@/entities/repository';

interface DistrictRow {
  id: string;
  name: string;
  subRegion: string;
  regime: string;
  rawNwp: number;
  evrinMoe: number;
  delta: number;
  heavyProb: number;
  alertLevel: 'FLASH WATCH' | 'HEAVY RAIN' | 'EXTREME' | 'WATCH' | 'NORMAL';
  badgeVariant: 'danger' | 'warning' | 'info' | 'default';
  lat: number;
  lng: number;
  elev: number;
  catchment: string;
}

const DISTRICT_DATA: DistrictRow[] = [
  {
    id: 'IND-UP-42',
    name: 'Meerut',
    subRegion: 'Uttar Pradesh - 28.98°N',
    regime: 'Convective',
    rawNwp: 54.2,
    evrinMoe: 128.4,
    delta: 74.2,
    heavyProb: 94,
    alertLevel: 'FLASH WATCH',
    badgeVariant: 'danger',
    lat: 28.9845,
    lng: 77.7064,
    elev: 219,
    catchment: 'HINDON RIVER BASIN',
  },
  {
    id: 'IND-MH-12',
    name: 'Pune',
    subRegion: 'Maharashtra - Ghat Crest',
    regime: 'Orographic',
    rawNwp: 112.0,
    evrinMoe: 104.5,
    delta: -7.5,
    heavyProb: 88,
    alertLevel: 'HEAVY RAIN',
    badgeVariant: 'warning',
    lat: 18.5204,
    lng: 73.8567,
    elev: 560,
    catchment: 'MULA-MUTHA BASIN',
  },
  {
    id: 'IND-KL-08',
    name: 'Wayanad',
    subRegion: 'Kerala - Highland Ridge',
    regime: 'Orographic',
    rawNwp: 88.5,
    evrinMoe: 142.1,
    delta: 53.6,
    heavyProb: 96,
    alertLevel: 'EXTREME',
    badgeVariant: 'danger',
    lat: 11.6854,
    lng: 76.132,
    elev: 750,
    catchment: 'KABINI RIVER BASIN',
  },
  {
    id: 'IND-UP-18',
    name: 'Muzaffarnagar',
    subRegion: 'Uttar Pradesh - Upper Doab',
    regime: 'Convective',
    rawNwp: 42.8,
    evrinMoe: 89.6,
    delta: 46.8,
    heavyProb: 79,
    alertLevel: 'HEAVY RAIN',
    badgeVariant: 'warning',
    lat: 29.4727,
    lng: 77.7085,
    elev: 242,
    catchment: 'KALI RIVER BASIN',
  },
  {
    id: 'IND-UP-24',
    name: 'Ghaziabad',
    subRegion: 'Uttar Pradesh - NCR Perimeter',
    regime: 'Urban Low',
    rawNwp: 36.1,
    evrinMoe: 76.3,
    delta: 40.2,
    heavyProb: 68,
    alertLevel: 'HEAVY RAIN',
    badgeVariant: 'warning',
    lat: 28.6692,
    lng: 77.4538,
    elev: 214,
    catchment: 'YAMUNA BASIN',
  },
  {
    id: 'IND-MH-05',
    name: 'Ratnagiri',
    subRegion: 'Maharashtra - Konkan Coast',
    regime: 'Maritime',
    rawNwp: 98.4,
    evrinMoe: 110.2,
    delta: 11.8,
    heavyProb: 84,
    alertLevel: 'HEAVY RAIN',
    badgeVariant: 'warning',
    lat: 16.9902,
    lng: 73.312,
    elev: 11,
    catchment: 'SHASTRI RIVER BASIN',
  },
  {
    id: 'IND-KL-02',
    name: 'Alappuzha',
    subRegion: 'Kerala - Coastal Lowland',
    regime: 'Maritime',
    rawNwp: 64.0,
    evrinMoe: 71.8,
    delta: 7.8,
    heavyProb: 52,
    alertLevel: 'WATCH',
    badgeVariant: 'info',
    lat: 9.4981,
    lng: 76.3388,
    elev: 1,
    catchment: 'VEMBANAD BASIN',
  },
  {
    id: 'IND-UP-33',
    name: 'Bulandshahr',
    subRegion: 'Uttar Pradesh - Ganga Plain',
    regime: 'Convective',
    rawNwp: 29.4,
    evrinMoe: 48.2,
    delta: 18.8,
    heavyProb: 31,
    alertLevel: 'NORMAL',
    badgeVariant: 'default',
    lat: 28.4069,
    lng: 77.8498,
    elev: 201,
    catchment: 'GANGA DOAB',
  },
  {
    id: 'IND-KL-14',
    name: 'Idukki',
    subRegion: 'Kerala - High Ranges',
    regime: 'Orographic',
    rawNwp: 105.1,
    evrinMoe: 134.7,
    delta: 29.6,
    heavyProb: 91,
    alertLevel: 'EXTREME',
    badgeVariant: 'danger',
    lat: 9.8494,
    lng: 76.9806,
    elev: 1200,
    catchment: 'PERIYAR BASIN',
  },
];

export default function ForecastPage() {
  const { activeScenario } = useForecastRepository();
  const [selectedDistrict, setSelectedDistrict] = useState<DistrictRow>(DISTRICT_DATA[0]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTier, setSelectedTier] = useState<string>('ALL');
  const [isAnimated, setIsAnimated] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsAnimated(true), 50);
    return () => clearTimeout(timer);
  }, []);

  // Filtered districts
  const filteredDistricts = DISTRICT_DATA.filter((d) => {
    const matchesSearch = d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          d.subRegion.toLowerCase().includes(searchTerm.toLowerCase());
    if (!matchesSearch) return false;
    if (selectedTier === '>64.5mm') return d.evrinMoe > 64.5;
    if (selectedTier === '>115.6mm') return d.evrinMoe > 115.6;
    return true;
  });

  // Simulated 48h hourly rainfall profile for hyetograph (mm/h)
  const hyetographData = [
    { hour: '06Z', rain: 2.1, ecmwfAccum: 2, evrinAccum: 2 },
    { hour: '08Z', rain: 4.5, ecmwfAccum: 6, evrinAccum: 7 },
    { hour: '10Z', rain: 8.2, ecmwfAccum: 12, evrinAccum: 16 },
    { hour: '12Z', rain: 14.8, ecmwfAccum: 20, evrinAccum: 31 },
    { hour: '14Z', rain: 26.5, ecmwfAccum: 32, evrinAccum: 58 },
    { hour: '16Z', rain: 34.2, ecmwfAccum: 45, evrinAccum: 92 }, // Peak Convective Burst
    { hour: '18Z', rain: 22.0, ecmwfAccum: 52, evrinAccum: 114 },
    { hour: '20Z', rain: 8.4, ecmwfAccum: 56, evrinAccum: 122 },
    { hour: '22Z', rain: 3.2, ecmwfAccum: 58, evrinAccum: 125 },
    { hour: '00Z', rain: 1.5, ecmwfAccum: 60, evrinAccum: 127 },
    { hour: '06Z', rain: 0.8, ecmwfAccum: 62, evrinAccum: 128 },
    { hour: '12Z', rain: 0.4, ecmwfAccum: 64, evrinAccum: 128.4 },
  ];

  return (
    <div className="space-y-3.5 max-w-[1700px] mx-auto select-none">
      {/* Top Header matching Image: District Grid Forecast Explorer */}
      <div className="bg-white dark:bg-[#141414] border border-neutral-200 dark:border-[#262626] rounded-lg p-3 flex flex-wrap items-center justify-between gap-3 transition-colors shadow-sm">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 tracking-tight">
              District Grid Forecast Explorer
            </h1>
            <Badge variant="pill-subtle" className="text-[10px]">
              736 Operational Districts
            </Badge>
          </div>
          <div className="text-[10px] text-neutral-500 dark:text-neutral-400 mt-0.5">
            RESOLUTION: 0.05° (~5.5km) • ENSEMBLE MEMBERS: 51 • BIAS-CORRECTED MoE ACTIVE
          </div>
        </div>

        {/* Filters Bar: Search, State, Threshold Pills */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {/* Search Input */}
          <div className="flex items-center gap-1.5 bg-neutral-50 dark:bg-[#1a1a1a] border border-neutral-300 dark:border-[#262626] rounded-full px-3 py-1">
            <Search size={13} className="text-neutral-400 shrink-0" />
            <input
              type="text"
              placeholder="Search district..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none text-[11px] w-28"
            />
          </div>

          {/* State Dropdown Pill */}
          <div className="bg-neutral-50 dark:bg-[#1a1a1a] border border-neutral-300 dark:border-[#262626] rounded-full px-3 py-1 text-[11px] text-neutral-700 dark:text-neutral-300">
            <span>STATE: </span>
            <span className="text-neutral-900 dark:text-white font-semibold">Uttar Pradesh ▾</span>
          </div>

          {/* Threshold Filter Pills */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              onClick={() => setSelectedTier('ALL')}
              className={`px-3 py-1 rounded-full text-xs transition-colors border ${
                selectedTier === 'ALL'
                  ? 'bg-[#1A8FCB] dark:bg-white text-white dark:text-black border-[#1A8FCB] dark:border-white font-medium'
                  : 'bg-transparent hover:bg-neutral-100 dark:hover:bg-[#1a1a1a] text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white border-neutral-300 dark:border-[#262626]'
              }`}
            >
              ALL TIER
            </button>
            <button
              onClick={() => setSelectedTier('>64.5mm')}
              className={`px-3 py-1 rounded-full text-xs transition-colors border ${
                selectedTier === '>64.5mm'
                  ? 'bg-[#1A8FCB] dark:bg-white text-white dark:text-black border-[#1A8FCB] dark:border-white font-medium'
                  : 'bg-transparent hover:bg-neutral-100 dark:hover:bg-[#1a1a1a] text-amber-700 dark:text-amber-400 border-neutral-300 dark:border-[#262626]'
              }`}
            >
              &gt;64.5mm
            </button>
            <button
              onClick={() => setSelectedTier('>115.6mm')}
              className={`px-3 py-1 rounded-full text-xs transition-colors border ${
                selectedTier === '>115.6mm'
                  ? 'bg-[#1A8FCB] dark:bg-white text-white dark:text-black border-[#1A8FCB] dark:border-white font-medium'
                  : 'bg-transparent hover:bg-neutral-100 dark:hover:bg-[#1a1a1a] text-rose-700 dark:text-rose-400 border-neutral-300 dark:border-[#262626]'
              }`}
            >
              &gt;115.6mm
            </button>
            <span className="px-2.5 py-1 rounded-full bg-transparent border border-neutral-300 dark:border-[#262626] text-[10px] text-neutral-500 dark:text-neutral-400">
              STAT: <strong className="text-neutral-800 dark:text-neutral-200">P90 PEAK</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Main Layout Grid: Responsive Left Table & Right Hyetograph Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5">
        {/* Left Section: Interactive District Grid Table */}
        <div className="lg:col-span-6 bg-white dark:bg-[#141414] border border-neutral-200 dark:border-[#262626] rounded-lg p-3 flex flex-col justify-between transition-colors shadow-sm">
          <div>
            {/* Table Summary Bar */}
            <div className="flex items-center justify-between pb-2 border-b border-neutral-200 dark:border-[#262626] mb-2 text-[10px] text-neutral-500 dark:text-neutral-400">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-neutral-900 dark:text-slate-100 uppercase">SHOWING 24 DISTRICTS</span>
                <span>•</span>
                <span className="text-rose-600 dark:text-rose-400 font-medium">4 EXTREME WATCH</span>
                <span>•</span>
                <span className="text-amber-600 dark:text-amber-400 font-medium">9 HEAVY RAIN</span>
              </div>
              <div className="text-neutral-500 dark:text-neutral-400 hover:text-black dark:hover:text-white cursor-pointer">
                SORT: <strong className="text-neutral-900 dark:text-neutral-200">EXCEEDANCE P90 ▾</strong>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-[11px]">
                <thead>
                  <tr className="border-b border-neutral-200 dark:border-[#262626] text-neutral-500 uppercase text-[9px]">
                    <th className="pb-1.5">DISTRICT / STATE</th>
                    <th className="pb-1.5">REGIME</th>
                    <th className="pb-1.5 text-right">RAW NWP</th>
                    <th className="pb-1.5 text-right text-emerald-600 dark:text-emerald-400">EVRIN MoE</th>
                    <th className="pb-1.5 text-right">Δ (MM)</th>
                    <th className="pb-1.5 text-right">P(&gt;64.5)</th>
                    <th className="pb-1.5 text-right">ALERT LEVEL</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 dark:divide-[#262626]">
                  {filteredDistricts.map((d) => {
                    const isSelected = selectedDistrict.id === d.id;
                    const isPositive = d.delta > 0;

                    return (
                      <tr
                        key={d.id}
                        onClick={() => setSelectedDistrict(d)}
                        className={`cursor-pointer transition-colors ${
                          isSelected
                            ? 'bg-neutral-100 dark:bg-[#1a1a1a] text-neutral-900 dark:text-neutral-100 font-semibold'
                            : 'hover:bg-neutral-50 dark:hover:bg-[#161616] text-neutral-700 dark:text-neutral-300'
                        }`}
                      >
                        <td className="py-2.5">
                          <div className="flex items-center gap-1.5">
                            {isSelected && <span className="text-neutral-900 dark:text-white text-xs">▸</span>}
                            <div>
                              <div className="font-semibold text-neutral-900 dark:text-slate-100">{d.name}</div>
                              <div className="text-[9px] text-neutral-400">{d.subRegion}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-2.5">
                          <span className="px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-[#1a1a1a] border border-neutral-200 dark:border-[#262626] text-[9px] text-neutral-600 dark:text-neutral-400">
                            {d.regime}
                          </span>
                        </td>
                        <td className="py-2.5 text-right text-neutral-500 dark:text-neutral-400">{d.rawNwp.toFixed(1)}</td>
                        <td className="py-2.5 text-right font-semibold text-emerald-600 dark:text-emerald-400">{d.evrinMoe.toFixed(1)}</td>
                        <td className={`py-2.5 text-right font-medium ${isPositive ? 'text-neutral-900 dark:text-white' : 'text-neutral-500'}`}>
                          {isPositive ? `+${d.delta.toFixed(1)}` : d.delta.toFixed(1)}
                        </td>
                        <td className="py-2.5 text-right text-amber-600 dark:text-amber-400 font-medium">{d.heavyProb}%</td>
                        <td className="py-2.5 text-right">
                          <Badge variant={d.badgeVariant} size="sm">
                            {d.alertLevel}
                          </Badge>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="pt-2.5 border-t border-neutral-200 dark:border-[#262626] mt-2 flex items-center justify-between text-[9px] text-neutral-400">
            <span>SHOWING 9 OF 736 DISTRICTS</span>
            <span className="text-neutral-600 dark:text-neutral-400">• MoE KALMAN WEIGHTED</span>
          </div>
        </div>

        {/* Right Section: 48-Hour Hyetograph & Runoff Visualizer */}
        <div className="lg:col-span-6 space-y-3.5">
          {/* Card 1: Top District Header with Metadata & Bulletin Button */}
          <div className="bg-white dark:bg-[#141414] border border-neutral-200 dark:border-[#262626] rounded-lg p-3.5 transition-colors shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-neutral-200 dark:border-[#262626] mb-2.5">
              <div className="flex items-center gap-2">
                <Badge variant="danger" size="sm">
                  {selectedDistrict.alertLevel} LEVEL 2
                </Badge>
                <span className="text-[10px] text-neutral-500 dark:text-neutral-400">DISTRICT ID: {selectedDistrict.id}</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  title="Pin Station"
                  className="p-1.5 rounded-full bg-transparent hover:bg-neutral-100 dark:hover:bg-[#1a1a1a] border border-neutral-300 dark:border-[#262626] text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors"
                >
                  <Pin size={12} className="shrink-0" />
                </button>
                <button
                  title="Export Station Data"
                  className="p-1.5 rounded-full bg-transparent hover:bg-neutral-100 dark:hover:bg-[#1a1a1a] border border-neutral-300 dark:border-[#262626] text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors"
                >
                  <Download size={12} className="shrink-0" />
                </button>
                <button
                  onClick={() => alert(`Issuing Emergency Hydro-Meteorological Warning Bulletin for ${selectedDistrict.name}...`)}
                  className="px-3.5 py-1 rounded-full bg-[#1A8FCB] hover:bg-[#167db3] dark:bg-white dark:hover:bg-neutral-200 text-white dark:text-black font-semibold text-xs flex items-center gap-1.5 transition-colors border border-transparent shadow-sm"
                >
                  <AlertTriangle size={13} className="text-amber-400 dark:text-amber-500" />
                  <span>Issue Warning Bulletin</span>
                </button>
              </div>
            </div>

            {/* Station Title & Geodetic Profile */}
            <div className="text-base font-bold text-neutral-900 dark:text-slate-100 tracking-tight mb-2">
              {selectedDistrict.name} <span className="text-xs font-normal text-neutral-500 dark:text-neutral-400">({selectedDistrict.subRegion.split('-')[0]})</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px] text-neutral-600 dark:text-neutral-400 bg-neutral-50 dark:bg-[#1a1a1a] p-2.5 rounded-lg border border-neutral-200 dark:border-[#262626]">
              <div>
                <span className="text-neutral-400 uppercase">LAT:</span>{' '}
                <strong className="text-neutral-800 dark:text-slate-200">{selectedDistrict.lat.toFixed(4)}° N</strong>
              </div>
              <div>
                <span className="text-neutral-400 uppercase">LON:</span>{' '}
                <strong className="text-neutral-800 dark:text-slate-200">{selectedDistrict.lng.toFixed(4)}° E</strong>
              </div>
              <div>
                <span className="text-neutral-400 uppercase">ELEV:</span>{' '}
                <strong className="text-neutral-800 dark:text-slate-200">{selectedDistrict.elev}m ASL</strong>
              </div>
              <div>
                <span className="text-neutral-400 uppercase">CATCHMENT:</span>{' '}
                <strong className="text-neutral-900 dark:text-white truncate block">{selectedDistrict.catchment}</strong>
              </div>
            </div>
          </div>

          {/* Card 2: 48-Hour Hyetograph & Runoff Chart */}
          <div className="bg-white dark:bg-[#141414] border border-neutral-200 dark:border-[#262626] rounded-lg p-3.5 space-y-3 transition-colors shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-neutral-200 dark:border-[#262626]">
              <div>
                <div className="text-xs font-bold text-neutral-900 dark:text-slate-100 uppercase tracking-tight flex items-center gap-1.5">
                  <CloudRain size={14} className="text-neutral-600 dark:text-neutral-300" />
                  <span>48-Hour Hyetograph & Cumulative Runoff Profile</span>
                </div>
                <div className="text-[10px] text-neutral-500 dark:text-neutral-400 mt-0.5">
                  Hourly Rainfall Intensity (mm/h) vs Cumulative Post-Processed EVRIN MoE vs Raw NWP Baselines
                </div>
              </div>

              {/* Chart Legend matching Image */}
              <div className="flex items-center gap-3 text-[9px]">
                <div className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 bg-neutral-800 dark:bg-white rounded-sm" />
                  <span className="text-neutral-700 dark:text-neutral-300">EVRIN Hourly (mm/h)</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-3 h-0.5 bg-neutral-400 border-dashed" />
                  <span className="text-neutral-400">ECMWF Accum.</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-3 h-0.5 bg-sky-500" />
                  <span className="text-sky-600 dark:text-sky-400 font-semibold">EVRIN P90 Accum.</span>
                </div>
              </div>
            </div>

            {/* High-Precision Hyetograph SVG Chart with Threshold Lines */}
            <div className="relative w-full h-52 bg-neutral-50 dark:bg-[#0A0A0A] rounded-lg border border-neutral-200 dark:border-[#262626] p-2 overflow-hidden">
              <svg viewBox="0 0 600 200" className="w-full h-full">
                {/* Background Grid Lines */}
                <line x1="40" y1="20" x2="580" y2="20" stroke="#333333" strokeWidth="0.5" strokeOpacity="0.4" />
                <line x1="40" y1="60" x2="580" y2="60" stroke="#333333" strokeWidth="0.5" strokeOpacity="0.4" />
                <line x1="40" y1="100" x2="580" y2="100" stroke="#333333" strokeWidth="0.5" strokeOpacity="0.4" />
                <line x1="40" y1="140" x2="580" y2="140" stroke="#333333" strokeWidth="0.5" strokeOpacity="0.4" />

                {/* FLASH FLOOD THRESHOLD LINE (25 mm/h) */}
                <line x1="40" y1="50" x2="580" y2="50" stroke="#dc2626" strokeWidth="1" strokeDasharray="4 4" />
                <text x="45" y="46" fill="#dc2626" fontSize="8">
                  FLASH FLOOD THRESHOLD (25 mm/h)
                </text>

                {/* HEAVY ADVISORY THRESHOLD LINE (15 mm/h) */}
                <line x1="40" y1="90" x2="580" y2="90" stroke="#d97706" strokeWidth="1" strokeDasharray="4 4" />
                <text x="45" y="86" fill="#d97706" fontSize="8">
                  HEAVY ADVISORY THRESHOLD (15 mm/h)
                </text>

                {/* Hourly Hyetograph Bars */}
                {hyetographData.map((d, idx) => {
                  const x = 50 + idx * 44;
                  const barHeight = isAnimated ? (d.rain / 40) * 120 : 0;
                  const y = 170 - barHeight;

                  return (
                    <g key={d.hour}>
                      <rect
                        x={x}
                        y={y}
                        width="18"
                        height={barHeight}
                        fill={d.rain > 25 ? '#dc2626' : d.rain > 15 ? '#d97706' : '#525252'}
                        rx="2"
                        opacity="0.85"
                        style={{ transition: `height 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${idx * 40}ms, y 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${idx * 40}ms` }}
                      />
                      {/* X-axis labels */}
                      <text x={x + 9} y="185" fill="#737373" fontSize="8" textAnchor="middle">
                        {d.hour}
                      </text>
                    </g>
                  );
                })}

                {/* Cumulative Runoff Curves */}
                <path
                  d="M 59 170 Q 150 160 250 135 T 450 110 T 550 100"
                  fill="none"
                  stroke="#737373"
                  strokeWidth="1.5"
                  strokeDasharray="700"
                  strokeDashoffset={isAnimated ? 0 : 700}
                  style={{ transition: 'stroke-dashoffset 1.4s ease-out 0.4s' }}
                />

                {/* EVRIN P90 Calibrated Runoff Curve */}
                <path
                  d="M 59 170 Q 150 150 250 85 T 400 35 T 550 25"
                  fill="none"
                  stroke="#0284c7"
                  strokeWidth="2.5"
                  strokeDasharray="700"
                  strokeDashoffset={isAnimated ? 0 : 700}
                  style={{ transition: 'stroke-dashoffset 1.6s cubic-bezier(0.16, 1, 0.3, 1) 0.5s' }}
                />

                {/* Peak Convective Burst Callout Badge */}
                <g transform="translate(260, 20)">
                  <rect x="0" y="0" width="200" height="18" rx="4" fill="#141414" stroke="#262626" strokeWidth="1" />
                  <text x="100" y="12" fill="#ef4444" fontSize="8" fontWeight="bold" textAnchor="middle">
                    PEAK CONVECTIVE BURST: 34.2 mm/h [16:00 UTC]
                  </text>
                </g>
              </svg>
            </div>

            {/* 4 Metric Summary Boxes */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px]">
              {/* Box 1: 48H TOTAL ACCUM */}
              <div className="p-2 rounded bg-neutral-50 dark:bg-[#1a1a1a] border border-neutral-200 dark:border-[#262626]">
                <div className="text-[9px] text-neutral-400 uppercase">48H TOTAL ACCUM</div>
                <div className="text-sm font-bold text-neutral-900 dark:text-white mt-0.5">{selectedDistrict.evrinMoe} mm</div>
                <div className="text-[9px] text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5">+136% vs GFS Raw</div>
              </div>

              {/* Box 2: PEAK HOURLY RATE */}
              <div className="p-2 rounded bg-neutral-50 dark:bg-[#1a1a1a] border border-neutral-200 dark:border-[#262626]">
                <div className="text-[9px] text-neutral-400 uppercase">PEAK HOURLY RATE</div>
                <div className="text-sm font-bold text-rose-600 dark:text-rose-400 mt-0.5">34.2 mm/h</div>
                <div className="text-[9px] text-neutral-400 mt-0.5">AT 16:00 UTC (+10h)</div>
              </div>

              {/* Box 3: ENSEMBLE SPREAD */}
              <div className="p-2 rounded bg-neutral-50 dark:bg-[#1a1a1a] border border-neutral-200 dark:border-[#262626]">
                <div className="text-[9px] text-neutral-400 uppercase">ENSEMBLE SPREAD</div>
                <div className="text-sm font-bold text-neutral-900 dark:text-neutral-100 mt-0.5">82–154 mm</div>
                <div className="text-[9px] text-neutral-500 mt-0.5">High Convergence</div>
              </div>

              {/* Box 4: FLASH FLOOD SEVERITY */}
              <div className="p-2 rounded bg-neutral-50 dark:bg-[#1a1a1a] border border-neutral-200 dark:border-[#262626]">
                <div className="text-[9px] text-neutral-400 uppercase">FLASH FLOOD SEVERITY</div>
                <div className="text-sm font-bold text-rose-600 dark:text-rose-400 mt-0.5">CRITICAL</div>
                <div className="text-[9px] text-neutral-400 mt-0.5">RISE TIME: 2.1 HRS</div>
              </div>
            </div>
          </div>

          {/* Bottom 2 Cards matching Image: Ensemble Plume & Atmospheric Sounding */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* Card A: 51-Member Ensemble Plume */}
            <div className="bg-white dark:bg-[#141414] border border-neutral-200 dark:border-[#262626] rounded-lg p-3 transition-colors">
              <div className="flex items-center justify-between pb-1.5 border-b border-neutral-200 dark:border-[#262626] mb-2 text-[10px]">
                <span className="font-semibold text-neutral-900 dark:text-slate-100">51-Member Ensemble Plume</span>
                <Badge variant="pill-subtle" className="text-[9px]">EPS + GEFS</Badge>
              </div>
              <div className="text-[9px] text-neutral-500 dark:text-neutral-400 mb-2.5">
                Mixture-of-Experts quantile dispersion across calibrated precipitation distribution.
              </div>

              <div className="space-y-2 text-[10px]">
                <div>
                  <div className="flex justify-between text-neutral-600 dark:text-neutral-400 mb-0.5">
                    <span>P10 (Minimum Safe Estimate)</span>
                    <strong className="text-neutral-800 dark:text-slate-200">82.1 mm</strong>
                  </div>
                  <div className="w-full bg-neutral-100 dark:bg-[#222222] h-1.5 rounded-full overflow-hidden">
                    <div className="bg-neutral-400 dark:bg-neutral-600 h-full rounded-full transition-all duration-1000 ease-out" style={{ width: isAnimated ? '55%' : '0%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-neutral-600 dark:text-neutral-400 mb-0.5">
                    <span>P50 (Median Calibration)</span>
                    <strong className="text-neutral-900 dark:text-white">114.5 mm</strong>
                  </div>
                  <div className="w-full bg-neutral-100 dark:bg-[#222222] h-1.5 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full rounded-full transition-all duration-1000 ease-out" style={{ width: isAnimated ? '75%' : '0%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-neutral-600 dark:text-neutral-400 mb-0.5">
                    <span>P90 (Severe Tail Risk)</span>
                    <strong className="text-rose-600 dark:text-rose-400">148.2 mm</strong>
                  </div>
                  <div className="w-full bg-neutral-100 dark:bg-[#222222] h-1.5 rounded-full overflow-hidden">
                    <div className="bg-rose-500 h-full rounded-full transition-all duration-1000 ease-out" style={{ width: isAnimated ? '95%' : '0%' }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Card B: Moisture & Stability Sounding */}
            <div className="bg-white dark:bg-[#141414] border border-neutral-200 dark:border-[#262626] rounded-lg p-3 transition-colors">
              <div className="flex items-center justify-between pb-1.5 border-b border-neutral-200 dark:border-[#262626] mb-2 text-[10px]">
                <span className="font-semibold text-neutral-900 dark:text-slate-100">Moisture & Stability Sounding</span>
                <Badge variant="pill-subtle" className="text-[9px]">DELHI-MEERUT 06Z</Badge>
              </div>
              <div className="text-[9px] text-neutral-500 dark:text-neutral-400 mb-2.5">
                Low-level tropospheric thermodynamic profile confirming deep convective initiation.
              </div>

              <div className="grid grid-cols-2 gap-2 text-[10px]">
                <div className="p-2 rounded bg-neutral-50 dark:bg-[#1a1a1a] border border-neutral-200 dark:border-[#262626]">
                  <div className="text-[8px] text-neutral-400 uppercase">PRECIPITABLE WATER (PWAT)</div>
                  <div className="text-sm font-bold text-neutral-900 dark:text-white mt-0.5">62.4 mm</div>
                  <div className="text-[8px] text-amber-600 dark:text-amber-400 font-semibold mt-0.5">98th Hist. Percentile</div>
                </div>

                <div className="p-2 rounded bg-neutral-50 dark:bg-[#1a1a1a] border border-neutral-200 dark:border-[#262626]">
                  <div className="text-[8px] text-neutral-400 uppercase">MOST UNSTABLE CAPE</div>
                  <div className="text-sm font-bold text-rose-600 dark:text-rose-400 mt-0.5">3,180 J/kg</div>
                  <div className="text-[8px] text-neutral-500 mt-0.5">Extremely Unstable</div>
                </div>
              </div>

              <div className="mt-2 pt-2 border-t border-neutral-200 dark:border-[#262626] flex justify-between text-[9px] text-neutral-500 dark:text-neutral-400">
                <span>K-INDEX: <strong className="text-neutral-800 dark:text-slate-200">38.2°C</strong></span>
                <span>850hPa MOISTURE: <strong className="text-neutral-800 dark:text-slate-200">18.4 g/kg</strong></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
