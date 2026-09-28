'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { MapLayerId, MapDistrictPoint } from '../model/types';
import { MapLayerControl } from './MapLayerControl';
import { MapLegend } from './MapLegend';
import { useForecastRepository } from '@/entities/repository';
import { RefreshCw, SkipBack, SkipForward, ChevronLeft, ChevronRight, Pause } from '@/shared/ui/icons';
import { useTheme } from '@/shared/lib/theme';

// Declare Leaflet global type
declare global {
  interface Window {
    L: any;
  }
}

export interface IndiaMapProps {
  onSelectDistrict?: (districtId: string) => void;
}

// Basemap Tile Providers
const ESRI_DARK_TILES = 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}';
const ESRI_LIGHT_TILES = 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}';
const OSM_TILES = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';
const SATELLITE_TILES = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';

// Detailed India National Boundary Geo-Coordinates [Lat, Lng]
const INDIA_BORDER_COORDINATES: [number, number][] = [
  [35.5, 74.5], [37.0, 75.0], [37.1, 77.0], [35.5, 79.5], [34.5, 79.0],
  [32.5, 78.8], [31.5, 79.0], [30.5, 80.5], [29.0, 80.3], [28.0, 82.0],
  [27.5, 84.5], [26.5, 87.0], [27.0, 88.5], [27.8, 88.8], [27.5, 89.0],
  [26.8, 90.0], [27.8, 92.5], [28.2, 94.5], [28.5, 96.5], [28.0, 97.2],
  [26.5, 96.0], [25.0, 95.0], [24.0, 94.5], [23.5, 93.5], [22.0, 93.0],
  [21.5, 92.5], [22.5, 91.5], [23.8, 91.3], [25.0, 92.0], [25.5, 90.0],
  [25.0, 89.0], [22.0, 89.0], [21.5, 87.5], [20.0, 86.0], [18.0, 84.0],
  [16.0, 81.5], [14.0, 80.2], [12.0, 79.8], [10.0, 79.5], [9.2, 79.0],
  [8.1, 77.5],  // Kanyakumari
  [8.5, 76.9], [10.0, 76.0], [12.0, 75.0], [13.0, 74.8], [15.0, 74.0],
  [17.0, 73.3], [19.0, 72.8], [20.5, 72.8], [21.0, 72.5], [21.5, 70.0],
  [22.5, 69.0], [23.5, 68.2], // Gujarat
  [24.5, 68.8], [25.0, 70.5], [26.0, 70.5], [27.5, 71.0], [28.5, 72.5],
  [30.0, 73.5], [31.5, 74.5], [32.5, 75.0], [33.5, 74.2], [34.5, 74.0],
  [35.5, 74.5]
];

export function IndiaMap({ onSelectDistrict }: IndiaMapProps) {
  const { theme } = useTheme();
  const { activeScenario } = useForecastRepository();
  const [activeLayer, setActiveLayer] = useState<MapLayerId>('evrin-corrected');
  const [baseMapType, setBaseMapType] = useState<'gis' | 'osm' | 'satellite'>('gis');
  const [activeTimeHorizon, setActiveTimeHorizon] = useState<string>('+06Z');
  const [isLeafletReady, setIsLeafletReady] = useState(false);

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const tileLayerRef = useRef<any>(null);
  const layerGroupRef = useRef<any>(null);
  const synopticLayerRef = useRef<any>(null);

  // All major meteorological stations & districts across India with real GPS coordinates
  const stations: MapDistrictPoint[] = useMemo(() => {
    if (!activeScenario) return [];

    const target = activeScenario.selectedDistrict;
    const targetFc = activeScenario.forecast;
    const regime = activeScenario.regimeDiagnosis.primaryRegime;

    const baseList: MapDistrictPoint[] = [
      // Primary Target District from active scenario (e.g. Meerut)
      {
        id: target.id,
        name: target.name.toUpperCase(),
        state: target.state,
        region: target.region,
        lat: target.coordinates.lat,
        lng: target.coordinates.lng,
        svgX: 0,
        svgY: 0,
        rawMm: targetFc.raw.rainfall24h,
        evrinMm: targetFc.corrected.rainfall24h,
        deltaMm: targetFc.correction.delta24h,
        heavyProb: activeScenario.extremes.thresholds.heavyRainProbability,
        regime: regime,
        uncertaintySpread: targetFc.corrected.uncertainty.spread,
      },
      // Sohra (Cherrapunji) - Featured in Image 2
      {
        id: 'IN.ML.SO',
        name: 'SOHRA',
        state: 'Meghalaya',
        region: 'NorthEast',
        lat: 25.27,
        lng: 91.73,
        svgX: 0,
        svgY: 0,
        rawMm: 168,
        evrinMm: 218,
        deltaMm: 50,
        heavyProb: 0.99,
        regime: 'orographic-convection',
        uncertaintySpread: 85,
      },
      // Ratnagiri - Featured in Image 2
      {
        id: 'IN.MH.RT',
        name: 'RATNAGIRI',
        state: 'Maharashtra',
        region: 'West',
        lat: 16.99,
        lng: 73.31,
        svgX: 0,
        svgY: 0,
        rawMm: 98,
        evrinMm: 142,
        deltaMm: 44,
        heavyProb: 0.92,
        regime: 'coastal-rainfall',
        uncertaintySpread: 64,
      },
      // Dehradun
      {
        id: 'IN.UT.DD',
        name: 'DEHRADUN',
        state: 'Uttarakhand',
        region: 'North',
        lat: 30.32,
        lng: 78.03,
        svgX: 0,
        svgY: 0,
        rawMm: 92,
        evrinMm: 124,
        deltaMm: 32,
        heavyProb: 0.88,
        regime: 'orographic-convection',
        uncertaintySpread: 58,
      },
      // Nagpur
      {
        id: 'IN.MH.NG',
        name: 'NAGPUR',
        state: 'Maharashtra',
        region: 'Central',
        lat: 21.15,
        lng: 79.09,
        svgX: 0,
        svgY: 0,
        rawMm: regime === 'break-monsoon' ? 42 : 55,
        evrinMm: regime === 'break-monsoon' ? 28 : 65,
        deltaMm: regime === 'break-monsoon' ? -14 : 10,
        heavyProb: regime === 'break-monsoon' ? 0.12 : 0.45,
        regime: 'break-monsoon',
        uncertaintySpread: 38,
      },
      // Puri / Bhubaneswar
      {
        id: 'IN.OR.PU',
        name: 'PURI',
        state: 'Odisha',
        region: 'East',
        lat: 19.81,
        lng: 85.83,
        svgX: 0,
        svgY: 0,
        rawMm: regime === 'monsoon-depression' ? 86 : 42,
        evrinMm: regime === 'monsoon-depression' ? 128 : 58,
        deltaMm: regime === 'monsoon-depression' ? 42 : 16,
        heavyProb: regime === 'monsoon-depression' ? 0.94 : 0.45,
        regime: 'monsoon-depression',
        uncertaintySpread: 95,
      },
    ];

    const uniqueMap = new Map<string, MapDistrictPoint>();
    for (const s of baseList) {
      uniqueMap.set(s.id, s);
    }
    return Array.from(uniqueMap.values());
  }, [activeScenario]);

  // Load Leaflet dynamically without bundle issues
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

  const getTileConfig = (type: 'gis' | 'osm' | 'satellite', currentTheme: 'light' | 'dark') => {
    if (type === 'satellite') {
      return {
        url: SATELLITE_TILES,
        attribution: '&copy; Esri &mdash; Satellite Observation',
        maxZoom: 17,
      };
    }
    if (type === 'osm') {
      return {
        url: OSM_TILES,
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 19,
      };
    }
    // GIS Base Canvas (Dynamic based on theme)
    if (currentTheme === 'light') {
      return {
        url: ESRI_LIGHT_TILES,
        attribution: '&copy; Esri &mdash; National Meteorological Grid (Light GIS)',
        maxZoom: 16,
      };
    }
    return {
      url: ESRI_DARK_TILES,
      attribution: '&copy; Esri &mdash; National Meteorological Grid (Dark GIS)',
      maxZoom: 16,
    };
  };

  // Switch Tile Layer: GIS / OpenStreetMap / Satellite
  const setTileSource = (type: 'gis' | 'osm' | 'satellite') => {
    if (!mapInstanceRef.current || !window.L) return;
    const L = window.L;
    const map = mapInstanceRef.current;

    if (tileLayerRef.current) {
      map.removeLayer(tileLayerRef.current);
    }

    const { url, attribution, maxZoom } = getTileConfig(type, theme);
    const newLayer = L.tileLayer(url, { attribution, maxZoom }).addTo(map);
    if (newLayer.bringToBack) newLayer.bringToBack();
    tileLayerRef.current = newLayer;
    setBaseMapType(type);
  };

  // Automatically switch GIS base map when theme toggles
  useEffect(() => {
    if (baseMapType === 'gis' && mapInstanceRef.current && window.L) {
      const L = window.L;
      const map = mapInstanceRef.current;
      if (tileLayerRef.current) {
        map.removeLayer(tileLayerRef.current);
      }
      const { url, attribution, maxZoom } = getTileConfig('gis', theme);
      const newLayer = L.tileLayer(url, { attribution, maxZoom }).addTo(map);
      if (newLayer.bringToBack) newLayer.bringToBack();
      tileLayerRef.current = newLayer;
    }
  }, [theme, baseMapType]);

  // Initialize Leaflet Map
  useEffect(() => {
    if (!isLeafletReady || !mapContainerRef.current || mapInstanceRef.current) return;

    const L = window.L;

    // Create Map centered strictly on the Indian Subcontinent
    const map = L.map(mapContainerRef.current, {
      center: [22.8, 79.5],
      zoom: 5,
      minZoom: 4,
      maxZoom: 10,
      zoomControl: false,
    });

    // Theme-Aware Default GIS Base Layer
    const { url, attribution, maxZoom } = getTileConfig('gis', theme);
    const baseLayer = L.tileLayer(url, { attribution, maxZoom }).addTo(map);
    tileLayerRef.current = baseLayer;

    // Zoom controls top right
    L.control.zoom({ position: 'topright' }).addTo(map);

    // Dedicated layers
    const borderGroup = L.layerGroup().addTo(map);
    const synopticGroup = L.layerGroup().addTo(map);
    const layerGroup = L.layerGroup().addTo(map);

    synopticLayerRef.current = synopticGroup;
    layerGroupRef.current = layerGroup;
    mapInstanceRef.current = map;

    // Add highlighted India Official Territorial Border Polygon
    L.polygon(INDIA_BORDER_COORDINATES, {
      color: '#0891b2',
      weight: 1.5,
      opacity: 0.8,
      fillColor: '#0e7490',
      fillOpacity: 0.05,
      dashArray: '3, 3',
    }).addTo(borderGroup);

    // Initial frame fitting strictly to India bounds
    map.fitBounds([
      [8.0, 68.0],
      [36.0, 97.5],
    ]);

    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 250);

    return () => {
      clearTimeout(timer);
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [isLeafletReady]);

  // Update Stations & Synoptics whenever activeScenario, activeLayer, or timeHorizon changes
  useEffect(() => {
    if (!mapInstanceRef.current || !window.L || !layerGroupRef.current || !synopticLayerRef.current) return;

    const L = window.L;
    const map = mapInstanceRef.current;
    const layerGroup = layerGroupRef.current;
    const synopticGroup = synopticLayerRef.current;

    layerGroup.clearLayers();
    synopticGroup.clearLayers();

    // Time multiplier based on selected horizon
    const timeMultipliers: Record<string, number> = {
      '00Z': 0.15,
      '+06Z': 0.38,
      '+12Z': 0.65,
      '+24Z': 1.0,
      '+36Z': 1.35,
      '+48Z': 1.75,
      '+72Z': 2.2,
    };
    const currentMult = timeMultipliers[activeTimeHorizon] || 1.0;

    // =========================================================================
    // LAYER SPECIFIC RENDERING: FULLY FUNCTIONAL PILLS
    // =========================================================================

    if (activeLayer === 'regime') {
      // 1. REGIME FLOW LAYER: Synoptic streamlines, Monsoon trough axis, LPA low-pressure vortex
      // A. Monsoon Trough Axis line across Northern India
      const monsoonTroughLine: [number, number][] = [
        [27.5, 71.5], // Rajasthan Thermal Low
        [28.98, 77.7], // Meerut / Delhi
        [25.5, 82.0], // UP / Bihar
        [22.8, 87.5], // West Bengal
        [20.5, 90.0], // Bay of Bengal Head
      ];
      L.polyline(monsoonTroughLine, {
        color: '#f43f5e',
        weight: 3,
        dashArray: '8, 6',
        opacity: 0.9,
      }).addTo(synopticGroup).bindTooltip('Monsoon Trough Shear Line (Active Convergence Axis)', { sticky: true });

      // B. Arabian Sea Cross-Equatorial Low-Level Jet (LLJ) Streamlines
      const lljPoints1: [number, number][] = [
        [10.0, 68.0], [13.0, 71.0], [16.99, 73.31], [19.0, 75.5], [21.15, 79.09]
      ];
      const lljPoints2: [number, number][] = [
        [8.5, 71.0], [11.5, 73.5], [14.5, 74.8], [17.5, 77.0], [20.5, 81.5], [22.5, 85.0]
      ];
      L.polyline(lljPoints1, { color: '#06b6d4', weight: 2.5, dashArray: '4, 4', opacity: 0.85 }).addTo(synopticGroup);
      L.polyline(lljPoints2, { color: '#0284c7', weight: 2, dashArray: '6, 6', opacity: 0.75 }).addTo(synopticGroup);

      // C. Bay of Bengal Cyclonic Depression Vortex (LPA)
      L.circle([20.0, 88.5], {
        radius: 180000,
        color: '#ef4444',
        weight: 1.5,
        fillColor: '#ef4444',
        fillOpacity: 0.15,
        dashArray: '4, 4',
      }).addTo(synopticGroup).bindTooltip('Monsoon Depression Core (LPA 994 hPa)', { sticky: true });

      L.circle([20.0, 88.5], {
        radius: 80000,
        color: '#f97316',
        weight: 2,
        fillColor: '#f97316',
        fillOpacity: 0.3,
      }).addTo(synopticGroup);

      // D. Orographic Lift Barrier Zone (Western Ghats & Meghalaya Plateau)
      L.polygon([
        [18.5, 73.0], [15.0, 73.8], [12.0, 75.2], [10.0, 76.5],
        [10.0, 77.2], [13.0, 76.0], [16.0, 74.5], [18.5, 73.8]
      ], {
        color: '#eab308',
        weight: 1.5,
        fillColor: '#eab308',
        fillOpacity: 0.15,
        dashArray: '3, 3',
      }).addTo(synopticGroup).bindTooltip('Western Ghats Orographic Barrier Envelope', { sticky: true });

    } else if (activeLayer === 'heavy-rain-prob') {
      // 2. HEAVY RAIN PROBABILITY: IMD Hazard Warning Alert Polygons & Convective Outflow Rings
      // A. Red Warning Zone (>80% prob of >115.5mm very heavy rain) over Cherrapunji / Meghalaya
      L.circle([25.27, 91.73], {
        radius: 120000,
        color: '#ef4444',
        weight: 2,
        fillColor: '#ef4444',
        fillOpacity: 0.45,
      }).addTo(synopticGroup).bindTooltip('IMD RED WARNING: Cherrapunji Orographic Deluge (>99% Prob >115.5mm)', { sticky: true });

      // B. Red/Orange Alert Zone over Konkan / Ratnagiri
      L.circle([16.99, 73.31], {
        radius: 95000,
        color: '#f97316',
        weight: 2,
        fillColor: '#f97316',
        fillOpacity: 0.4,
      }).addTo(synopticGroup).bindTooltip('IMD ORANGE ALERT: Konkan Coast (>92% Prob >64.5mm)', { sticky: true });

      // C. Yellow Alert Zone over Gangetic Basin / Meerut
      L.circle([28.98, 77.7], {
        radius: 80000,
        color: '#eab308',
        weight: 1.5,
        fillColor: '#eab308',
        fillOpacity: 0.3,
      }).addTo(synopticGroup).bindTooltip('IMD YELLOW WATCH: Convective Core (78% Prob)', { sticky: true });

    } else if (activeLayer === 'difference') {
      // 3. DIFFERENCE (+/-) LAYER: Uplift Anomaly (Cyan) vs Overestimation Suppression (Amber)
      stations.forEach((station) => {
        const isUplift = station.deltaMm > 0;
        const radius = Math.min(130000, Math.max(45000, Math.abs(station.deltaMm) * 2200));

        L.circle([station.lat, station.lng], {
          radius: radius,
          color: isUplift ? '#06b6d4' : '#f97316',
          weight: 1.5,
          fillColor: isUplift ? '#06b6d4' : '#f97316',
          fillOpacity: 0.28,
          dashArray: isUplift ? undefined : '4, 4',
        }).addTo(synopticGroup).bindTooltip(
          `${station.name}: ${isUplift ? 'EVRIN Uplift +' : 'Suppressed Bias '}${station.deltaMm}mm`,
          { sticky: true }
        );
      });

    } else if (activeLayer === 'uncertainty') {
      // 4. UNCERTAINTY P90: 51-Member Ensemble Spread Dispersion Halos
      stations.forEach((station) => {
        const radius = Math.min(140000, Math.max(50000, station.uncertaintySpread * 1400));
        const isHighSpread = station.uncertaintySpread > 65;

        L.circle([station.lat, station.lng], {
          radius: radius,
          color: isHighSpread ? '#ec4899' : '#8b5cf6',
          weight: 1.5,
          fillColor: isHighSpread ? '#ec4899' : '#8b5cf6',
          fillOpacity: 0.22,
          dashArray: '3, 4',
        }).addTo(synopticGroup).bindTooltip(
          `${station.name} Epistemic Spread: ±${station.uncertaintySpread}mm (90th Percentile Dispersion)`,
          { sticky: true }
        );
      });

    } else if (activeLayer === 'raw-nwp') {
      // 5. RAW NWP: Uncalibrated Numerical Grid Footprints (Smooth wide contours)
      stations.forEach((station) => {
        const scaledRaw = station.rawMm * currentMult;
        L.circle([station.lat, station.lng], {
          radius: Math.min(110000, Math.max(40000, scaledRaw * 800)),
          color: '#0284c7',
          weight: 1.5,
          fillColor: '#0284c7',
          fillOpacity: 0.25,
        }).addTo(synopticGroup).bindTooltip(
          `ECMWF IFS Raw Output: ${scaledRaw.toFixed(0)}mm (Uncalibrated)`,
          { sticky: true }
        );
      });

    } else {
      // 6. EVRIN CORRECTED: Regime-Aware Calibrated Precipitation Field with Sharp Convective Cores
      const targetDistrict = activeScenario?.selectedDistrict;
      if (targetDistrict) {
        L.circle([targetDistrict.coordinates.lat, targetDistrict.coordinates.lng], {
          radius: 95000,
          color: '#f97316',
          weight: 0,
          fillColor: '#f97316',
          fillOpacity: 0.4,
        }).addTo(synopticGroup);

        L.circle([targetDistrict.coordinates.lat, targetDistrict.coordinates.lng], {
          radius: 45000,
          color: '#ef4444',
          weight: 0,
          fillColor: '#ef4444',
          fillOpacity: 0.6,
        }).addTo(synopticGroup);
      }

      // Synoptic flow corridor
      L.polyline([[16.99, 73.31], [22.5, 75.8], [28.98, 77.7]], {
        color: '#06b6d4',
        weight: 2,
        dashArray: '4, 4',
        opacity: 0.8,
      }).addTo(synopticGroup);
    }

    // =========================================================================
    // DISTRICT STATION MARKERS & DYNAMIC DATA CALLOUT LABELS
    // =========================================================================
    stations.forEach((station) => {
      const isTarget = station.id === activeScenario?.selectedDistrict.id;

      // Calculate displayed value according to activeLayer & timeHorizon
      let labelText = '';
      let labelColor = '#38bdf8';
      let markerColor = '#06b6d4';

      if (activeLayer === 'raw-nwp') {
        const val = (station.rawMm * currentMult).toFixed(0);
        labelText = `${val}mm NWP`;
        labelColor = '#38bdf8';
        markerColor = '#0284c7';
      } else if (activeLayer === 'evrin-corrected') {
        const val = (station.evrinMm * currentMult).toFixed(0);
        labelText = `${val}mm EVRIN`;
        labelColor = isTarget ? '#38bdf8' : '#34d399';
        markerColor = isTarget ? '#ef4444' : '#10b981';
      } else if (activeLayer === 'difference') {
        const delta = (station.deltaMm * currentMult).toFixed(0);
        const sign = Number(delta) >= 0 ? '+' : '';
        labelText = `${sign}${delta}mm Δ`;
        labelColor = Number(delta) >= 0 ? '#38bdf8' : '#f97316';
        markerColor = Number(delta) >= 0 ? '#06b6d4' : '#ea580c';
      } else if (activeLayer === 'heavy-rain-prob') {
        const pct = (station.heavyProb * 100).toFixed(0);
        labelText = `${pct}% RISK`;
        labelColor = station.heavyProb > 0.85 ? '#ef4444' : station.heavyProb > 0.65 ? '#f97316' : '#eab308';
        markerColor = labelColor;
      } else if (activeLayer === 'regime') {
        labelText = station.regime.split('-')[0].toUpperCase();
        labelColor = '#2dd4bf';
        markerColor = '#0d9488';
      } else if (activeLayer === 'uncertainty') {
        labelText = `±${station.uncertaintySpread}mm`;
        labelColor = '#c084fc';
        markerColor = '#a855f7';
      }

      // Circle Marker on Map
      const marker = L.circleMarker([station.lat, station.lng], {
        radius: isTarget ? 7 : 5,
        fillColor: markerColor,
        fillOpacity: 1,
        color: '#ffffff',
        weight: 1.5,
      }).addTo(layerGroup);

      // Target pulsing outer ring
      if (isTarget) {
        L.circleMarker([station.lat, station.lng], {
          radius: 13,
          fillColor: markerColor,
          fillOpacity: 0.25,
          color: markerColor,
          weight: 1.5,
          dashArray: '3, 3',
        }).addTo(layerGroup);
      }

      const isDark = theme === 'dark';

      // Dynamic Station Callout Label
      const labelIcon = L.divIcon({
        className: 'station-callout-icon',
        html: `
          <div style="
            background: ${isDark ? '#141414' : '#ffffff'};
            border: 1px solid ${isTarget ? '#06b6d4' : (isDark ? '#262626' : '#cbd5e1')};
            color: ${isDark ? '#ededed' : '#0f172a'};
            font-family: inherit;
            font-size: 10px;
            font-weight: 600;
            padding: 3px 8px;
            border-radius: 9999px;
            white-space: nowrap;
            box-shadow: ${isDark ? '0 2px 6px rgba(0,0,0,0.4)' : '0 2px 6px rgba(0,0,0,0.1)'};
            transform: translate(12px, -12px);
            cursor: pointer;
            display: inline-flex;
            align-items: center;
            gap: 5px;
          ">
            <span>${station.name}</span>
            <span style="color: ${labelColor}; font-weight: 700;">${labelText}</span>
          </div>
        `,
        iconSize: [0, 0],
      });

      const calloutMarker = L.marker([station.lat, station.lng], { icon: labelIcon }).addTo(layerGroup);

      // Interactive Click Handling on District
      const handleDistrictClick = () => {
        if (onSelectDistrict) {
          onSelectDistrict(station.id);
        }
      };

      marker.on('click', handleDistrictClick);
      calloutMarker.on('click', handleDistrictClick);

      // Bind Rich Popup
      marker.bindPopup(`
        <div style="font-family: inherit; font-size: 11px; color: ${isDark ? '#ededed' : '#0f172a'}; background: ${isDark ? '#141414' : '#ffffff'}; padding: 4px; min-width: 170px;">
          <div style="font-weight: bold; font-size: 13px; color: ${isDark ? '#ffffff' : '#0f172a'}; border-bottom: 1px solid ${isDark ? '#262626' : '#e2e8f0'}; padding-bottom: 4px; margin-bottom: 6px;">
            ${station.name} (${station.state})
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 3px;">
            <span style="color: ${isDark ? '#94a3b8' : '#64748b'};">RAW NWP:</span>
            <span style="font-weight: bold;">${(station.rawMm * currentMult).toFixed(1)} mm</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 3px;">
            <span style="color: ${isDark ? '#94a3b8' : '#64748b'};">EVRIN AI:</span>
            <span style="font-weight: bold; color: #10b981;">${(station.evrinMm * currentMult).toFixed(1)} mm</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 3px;">
            <span style="color: ${isDark ? '#94a3b8' : '#64748b'};">BIAS DELTA:</span>
            <span style="font-weight: bold; color: ${station.deltaMm >= 0 ? '#0284c7' : '#ea580c'};">
              ${station.deltaMm >= 0 ? '+' : ''}${(station.deltaMm * currentMult).toFixed(1)} mm
            </span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 3px;">
            <span style="color: ${isDark ? '#94a3b8' : '#64748b'};">HEAVY PROB:</span>
            <span style="font-weight: bold; color: #ef4444;">${(station.heavyProb * 100).toFixed(0)}%</span>
          </div>
          <div style="display: flex; justify-content: space-between;">
            <span style="color: ${isDark ? '#94a3b8' : '#64748b'};">REGIME:</span>
            <span style="font-weight: bold; color: #0d9488;">${station.regime}</span>
          </div>
        </div>
      `);
    });

    if (activeScenario) {
      const targetCoords: [number, number] = [
        activeScenario.selectedDistrict.coordinates.lat,
        activeScenario.selectedDistrict.coordinates.lng,
      ];
      map.flyTo(targetCoords, 6, { duration: 1.0 });
    }
  }, [activeScenario, activeLayer, stations, activeTimeHorizon, onSelectDistrict, theme]);

  const timeHorizons = ['00Z', '+06Z', '+12Z', '+24Z', '+36Z', '+48Z', '+72Z'];

  return (
    <div className="relative w-full h-full min-h-[540px] flex flex-col bg-white dark:bg-[#141414] rounded-lg overflow-hidden shadow-sm">
      {/* Top Bar of Map: Layer Switcher & Basemap View Buttons */}
      <div className="p-3 border-b border-neutral-200 dark:border-[#262626] bg-neutral-50 dark:bg-[#141414] flex flex-wrap items-center justify-between gap-2.5 z-10 select-none">
        {/* Layer Selector Pills with Vercel black & gray style */}
        <MapLayerControl activeLayer={activeLayer} onLayerChange={setActiveLayer} />

        {/* Free Basemap Switcher: GIS Canvas (Light/Dark), OpenStreetMap, Satellite */}
        <div className="flex items-center gap-1.5 text-[11px]">
          <span className="text-neutral-500 dark:text-neutral-400 font-semibold uppercase tracking-wider text-[10px] px-1 hidden sm:inline">
            MAP VIEW:
          </span>
          <button
            onClick={() => setTileSource('gis')}
            className={`px-3 py-1 rounded-full text-xs transition-colors border ${
              baseMapType === 'gis'
                ? 'bg-[#1A8FCB] dark:bg-white text-white dark:text-black border-[#1A8FCB] dark:border-white font-medium'
                : 'bg-transparent hover:bg-neutral-100 dark:hover:bg-[#1f1f1f] text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white border-neutral-300 dark:border-[#262626]'
            }`}
          >
            {theme === 'dark' ? 'Dark GIS' : 'Light GIS'}
          </button>
          <button
            onClick={() => setTileSource('osm')}
            className={`px-3 py-1 rounded-full text-xs transition-colors border ${
              baseMapType === 'osm'
                ? 'bg-[#1A8FCB] dark:bg-white text-white dark:text-black border-[#1A8FCB] dark:border-white font-medium'
                : 'bg-transparent hover:bg-neutral-100 dark:hover:bg-[#1f1f1f] text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white border-neutral-300 dark:border-[#262626]'
            }`}
          >
            OpenStreetMap
          </button>
          <button
            onClick={() => setTileSource('satellite')}
            className={`px-3 py-1 rounded-full text-xs transition-colors border ${
              baseMapType === 'satellite'
                ? 'bg-[#1A8FCB] dark:bg-white text-white dark:text-black border-[#1A8FCB] dark:border-white font-medium'
                : 'bg-transparent hover:bg-neutral-100 dark:hover:bg-[#1f1f1f] text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white border-neutral-300 dark:border-[#262626]'
            }`}
          >
            Satellite View
          </button>
        </div>
      </div>

      {/* Map Canvas and In-Map Overlays Container */}
      <div className="relative flex-1 w-full h-full min-h-[460px] overflow-hidden bg-neutral-100 dark:bg-[#0A0A0A]">
        {/* Floating Active Layer Badge Indicator inside Map Canvas (safe from header wrapping) */}
        <div className="absolute top-3 left-3 z-10 pointer-events-none">
          <div className="text-[10px] text-neutral-600 dark:text-neutral-400 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
            <span className="uppercase font-medium">ACTIVE OVERLAY:</span>
            <span className="text-neutral-900 dark:text-white font-semibold uppercase tracking-wider">{activeLayer.replace('-', ' ')}</span>
            <span className="text-neutral-400 dark:text-neutral-600">|</span>
            <span className="text-neutral-600 dark:text-neutral-300 font-medium">{activeTimeHorizon} HORIZON</span>
          </div>
        </div>

        {/* Real Geographic Leaflet Map Canvas */}
        <div
          ref={mapContainerRef}
          className="w-full h-full min-h-[460px] z-0"
        />

        {/* Loading state before Leaflet mounts */}
        {!isLeafletReady && (
          <div className="absolute inset-0 z-[500] flex flex-col items-center justify-center bg-white/90 dark:bg-[#0A0A0A]/90 text-neutral-500 gap-3 text-xs">
            <RefreshCw size={24} className="animate-spin text-neutral-400" />
            <span>Initializing Operational GIS Cartography...</span>
          </div>
        )}
      </div>

      {/* Bottom Floating Bar: Accumulation Legend & Timeline */}
      <div className="p-2.5 border-t border-neutral-200 dark:border-[#262626] bg-neutral-50 dark:bg-[#141414] flex flex-wrap items-center justify-between gap-3 z-10 select-none">
        {/* Dynamic Accumulation / Anomaly Scale Bar */}
        <MapLegend activeLayer={activeLayer} />

        {/* Time Horizon Slider Player with Clean Lucide Icons */}
        <div className="flex items-center gap-2 text-[10px] text-neutral-500 dark:text-neutral-400">
          <div className="flex items-center gap-1 text-neutral-500 dark:text-neutral-400 px-1">
            <button className="p-1 hover:text-black dark:hover:text-white transition-colors" title="First Horizon">
              <SkipBack size={11} />
            </button>
            <button className="p-1 hover:text-black dark:hover:text-white transition-colors" title="Previous Horizon">
              <ChevronLeft size={12} />
            </button>
            <button className="p-1 text-neutral-900 dark:text-white hover:text-black dark:hover:text-white transition-colors" title="Pause / Play">
              <Pause size={11} />
            </button>
            <button className="p-1 hover:text-black dark:hover:text-white transition-colors" title="Next Horizon">
              <ChevronRight size={12} />
            </button>
            <button className="p-1 hover:text-black dark:hover:text-white transition-colors" title="Last Horizon">
              <SkipForward size={11} />
            </button>
          </div>

          <div className="flex items-center gap-1">
            {timeHorizons.map((h) => {
              const isActive = h === activeTimeHorizon;
              return (
                <button
                  key={h}
                  onClick={() => setActiveTimeHorizon(h)}
                  className={`px-2.5 py-0.5 rounded-full text-[10px] transition-colors border ${
                    isActive
                      ? 'bg-[#1A8FCB] dark:bg-white text-white dark:text-black border-transparent font-semibold'
                      : 'bg-transparent hover:bg-neutral-100 dark:hover:bg-[#1f1f1f] text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white border-transparent hover:border-neutral-300 dark:hover:border-[#262626]'
                  }`}
                >
                  {h}
                </button>
              );
            })}
          </div>

          <span className="text-[10px] text-neutral-400 dark:text-neutral-500 border-l border-neutral-200 dark:border-[#262626] pl-2 hidden md:inline">
            VALID: 27 SEP 12:00 UTC
          </span>
        </div>
      </div>
    </div>
  );
}
