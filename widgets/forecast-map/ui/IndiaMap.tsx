'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { MapLayerId, MapDistrictPoint } from '../model/types';
import { MapLayerControl } from './MapLayerControl';
import { MapLegend } from './MapLegend';
import { useForecastRepository } from '@/entities/repository';
import { formatRainfall, formatPercentage } from '@/shared/lib/utils';
import { MapPin, RefreshCw, Layers } from '@/shared/ui/icons';

// Declare Leaflet global type
declare global {
  interface Window {
    L: any;
  }
}

export interface IndiaMapProps {
  onSelectDistrict?: (districtId: string) => void;
}

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
  [22.5, 69.0], [23.5, 68.2], // Gujarat coast
  [24.5, 68.8], [25.0, 70.5], [26.0, 70.5], [27.5, 71.0], [28.5, 72.5],
  [30.0, 73.5], [31.5, 74.5], [32.5, 75.0], [33.5, 74.2], [34.5, 74.0],
  [35.5, 74.5]
];

export function IndiaMap({ onSelectDistrict }: IndiaMapProps) {
  const { activeScenario } = useForecastRepository();
  const [activeLayer, setActiveLayer] = useState<MapLayerId>('evrin-corrected');
  const [baseMapType, setBaseMapType] = useState<'osm' | 'dark' | 'satellite'>('dark');
  const [isLeafletReady, setIsLeafletReady] = useState(false);

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const tileLayerRef = useRef<any>(null);
  const layerGroupRef = useRef<any>(null);
  const synopticLayerRef = useRef<any>(null);
  const borderLayerRef = useRef<any>(null);

  // All major meteorological stations & districts across India with real GPS coordinates
  const stations: MapDistrictPoint[] = useMemo(() => {
    if (!activeScenario) return [];

    const target = activeScenario.selectedDistrict;
    const targetFc = activeScenario.forecast;
    const regime = activeScenario.regimeDiagnosis.primaryRegime;

    const baseList: MapDistrictPoint[] = [
      // Target District from active scenario
      {
        id: target.id,
        name: target.name,
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
      // Northern Region
      {
        id: 'IN.DL.ND',
        name: 'New Delhi',
        state: 'Delhi',
        region: 'North',
        lat: 28.6139,
        lng: 77.209,
        svgX: 0,
        svgY: 0,
        rawMm: regime === 'active-monsoon' ? 48 : regime === 'break-monsoon' ? 12 : 36,
        evrinMm: regime === 'active-monsoon' ? 68 : regime === 'break-monsoon' ? 8 : 46,
        deltaMm: regime === 'active-monsoon' ? 20 : regime === 'break-monsoon' ? -4 : 10,
        heavyProb: regime === 'active-monsoon' ? 0.72 : 0.14,
        regime: regime === 'active-monsoon' ? 'active-monsoon' : 'transition-mixed',
        uncertaintySpread: 45,
      },
      {
        id: 'IN.UT.DD',
        name: 'Dehradun',
        state: 'Uttarakhand',
        region: 'North',
        lat: 30.3165,
        lng: 78.0322,
        svgX: 0,
        svgY: 0,
        rawMm: regime === 'break-monsoon' ? 115 : regime === 'orographic-convection' ? 130 : 92,
        evrinMm: regime === 'break-monsoon' ? 148 : regime === 'orographic-convection' ? 165 : 124,
        deltaMm: regime === 'break-monsoon' ? 33 : 32,
        heavyProb: 0.91,
        regime: 'orographic-convection',
        uncertaintySpread: 75,
      },
      {
        id: 'IN.UP.LK',
        name: 'Lucknow',
        state: 'Uttar Pradesh',
        region: 'North',
        lat: 26.8467,
        lng: 80.9462,
        svgX: 0,
        svgY: 0,
        rawMm: regime === 'active-monsoon' ? 56 : 28,
        evrinMm: regime === 'active-monsoon' ? 82 : 34,
        deltaMm: regime === 'active-monsoon' ? 26 : 6,
        heavyProb: regime === 'active-monsoon' ? 0.81 : 0.28,
        regime: regime === 'active-monsoon' ? 'active-monsoon' : 'break-monsoon',
        uncertaintySpread: 52,
      },
      {
        id: 'IN.UP.MZ',
        name: 'Muzaffarnagar',
        state: 'Uttar Pradesh',
        region: 'North',
        lat: 29.4727,
        lng: 77.7085,
        svgX: 0,
        svgY: 0,
        rawMm: regime === 'active-monsoon' ? 50 : 25,
        evrinMm: regime === 'active-monsoon' ? 71 : 28,
        deltaMm: regime === 'active-monsoon' ? 21 : 3,
        heavyProb: regime === 'active-monsoon' ? 0.76 : 0.20,
        regime: 'active-monsoon',
        uncertaintySpread: 48,
      },
      // Central Region
      {
        id: 'IN.MH.NG',
        name: 'Nagpur',
        state: 'Maharashtra',
        region: 'Central',
        lat: 21.1458,
        lng: 79.0882,
        svgX: 0,
        svgY: 0,
        rawMm: regime === 'break-monsoon' ? 42 : regime === 'monsoon-depression' ? 74 : 45,
        evrinMm: regime === 'break-monsoon' ? 28 : regime === 'monsoon-depression' ? 105 : 55,
        deltaMm: regime === 'break-monsoon' ? -14 : regime === 'monsoon-depression' ? 31 : 10,
        heavyProb: regime === 'break-monsoon' ? 0.12 : 0.78,
        regime: regime === 'break-monsoon' ? 'break-monsoon' : 'monsoon-depression',
        uncertaintySpread: 38,
      },
      {
        id: 'IN.MP.BP',
        name: 'Bhopal',
        state: 'Madhya Pradesh',
        region: 'Central',
        lat: 23.2599,
        lng: 77.4126,
        svgX: 0,
        svgY: 0,
        rawMm: regime === 'break-monsoon' ? 34 : 52,
        evrinMm: regime === 'break-monsoon' ? 22 : 72,
        deltaMm: regime === 'break-monsoon' ? -12 : 20,
        heavyProb: regime === 'break-monsoon' ? 0.08 : 0.65,
        regime: regime === 'break-monsoon' ? 'break-monsoon' : 'active-monsoon',
        uncertaintySpread: 42,
      },
      // East & Bay of Bengal Coast
      {
        id: 'IN.OR.PU',
        name: 'Puri',
        state: 'Odisha',
        region: 'East',
        lat: 19.8135,
        lng: 85.8312,
        svgX: 0,
        svgY: 0,
        rawMm: regime === 'monsoon-depression' ? 86 : 42,
        evrinMm: regime === 'monsoon-depression' ? 128 : 58,
        deltaMm: regime === 'monsoon-depression' ? 42 : 16,
        heavyProb: regime === 'monsoon-depression' ? 0.94 : 0.45,
        regime: 'monsoon-depression',
        uncertaintySpread: 95,
      },
      {
        id: 'IN.OR.BB',
        name: 'Bhubaneswar',
        state: 'Odisha',
        region: 'East',
        lat: 20.2961,
        lng: 85.8245,
        svgX: 0,
        svgY: 0,
        rawMm: regime === 'monsoon-depression' ? 82 : 38,
        evrinMm: regime === 'monsoon-depression' ? 122 : 52,
        deltaMm: regime === 'monsoon-depression' ? 40 : 14,
        heavyProb: regime === 'monsoon-depression' ? 0.91 : 0.40,
        regime: 'monsoon-depression',
        uncertaintySpread: 90,
      },
      {
        id: 'IN.WB.KL',
        name: 'Kolkata',
        state: 'West Bengal',
        region: 'East',
        lat: 22.5726,
        lng: 88.3639,
        svgX: 0,
        svgY: 0,
        rawMm: regime === 'monsoon-depression' ? 65 : 44,
        evrinMm: regime === 'monsoon-depression' ? 94 : 58,
        deltaMm: regime === 'monsoon-depression' ? 29 : 14,
        heavyProb: regime === 'monsoon-depression' ? 0.82 : 0.52,
        regime: 'monsoon-depression',
        uncertaintySpread: 68,
      },
      {
        id: 'IN.BR.PA',
        name: 'Patna',
        state: 'Bihar',
        region: 'East',
        lat: 25.5941,
        lng: 85.1376,
        svgX: 0,
        svgY: 0,
        rawMm: regime === 'break-monsoon' ? 68 : 38,
        evrinMm: regime === 'break-monsoon' ? 92 : 44,
        deltaMm: regime === 'break-monsoon' ? 24 : 6,
        heavyProb: regime === 'break-monsoon' ? 0.74 : 0.32,
        regime: regime === 'break-monsoon' ? 'break-monsoon' : 'active-monsoon',
        uncertaintySpread: 56,
      },
      // West Coast & Western Ghats
      {
        id: 'IN.MH.MB',
        name: 'Mumbai',
        state: 'Maharashtra',
        region: 'West',
        lat: 19.076,
        lng: 72.8777,
        svgX: 0,
        svgY: 0,
        rawMm: regime === 'orographic-convection' || regime === 'coastal-rainfall' ? 88 : 55,
        evrinMm: regime === 'orographic-convection' || regime === 'coastal-rainfall' ? 134 : 76,
        deltaMm: regime === 'orographic-convection' || regime === 'coastal-rainfall' ? 46 : 21,
        heavyProb: 0.88,
        regime: 'coastal-rainfall',
        uncertaintySpread: 80,
      },
      {
        id: 'IN.MH.ST',
        name: 'Mahabaleshwar',
        state: 'Maharashtra',
        region: 'West',
        lat: 17.9237,
        lng: 73.6586,
        svgX: 0,
        svgY: 0,
        rawMm: regime === 'orographic-convection' ? 94 : 68,
        evrinMm: regime === 'orographic-convection' ? 152 : 98,
        deltaMm: regime === 'orographic-convection' ? 58 : 30,
        heavyProb: 0.98,
        regime: 'orographic-convection',
        uncertaintySpread: 136,
      },
      {
        id: 'IN.MH.RT',
        name: 'Ratnagiri',
        state: 'Maharashtra',
        region: 'West',
        lat: 16.9902,
        lng: 73.312,
        svgX: 0,
        svgY: 0,
        rawMm: regime === 'coastal-rainfall' || regime === 'orographic-convection' ? 82 : 58,
        evrinMm: regime === 'coastal-rainfall' || regime === 'orographic-convection' ? 124 : 78,
        deltaMm: regime === 'coastal-rainfall' || regime === 'orographic-convection' ? 42 : 20,
        heavyProb: 0.92,
        regime: 'coastal-rainfall',
        uncertaintySpread: 88,
      },
      {
        id: 'IN.GA.PJ',
        name: 'Panaji (Goa)',
        state: 'Goa',
        region: 'West',
        lat: 15.4909,
        lng: 73.8278,
        svgX: 0,
        svgY: 0,
        rawMm: regime === 'coastal-rainfall' ? 76 : 52,
        evrinMm: regime === 'coastal-rainfall' ? 112 : 72,
        deltaMm: regime === 'coastal-rainfall' ? 36 : 20,
        heavyProb: 0.89,
        regime: 'coastal-rainfall',
        uncertaintySpread: 76,
      },
      // South India
      {
        id: 'IN.KA.DK',
        name: 'Mangaluru',
        state: 'Karnataka',
        region: 'South',
        lat: 12.9141,
        lng: 74.856,
        svgX: 0,
        svgY: 0,
        rawMm: regime === 'coastal-rainfall' ? 62 : 45,
        evrinMm: regime === 'coastal-rainfall' ? 89 : 64,
        deltaMm: regime === 'coastal-rainfall' ? 27 : 19,
        heavyProb: regime === 'coastal-rainfall' ? 0.86 : 0.62,
        regime: 'coastal-rainfall',
        uncertaintySpread: 86,
      },
      {
        id: 'IN.KA.BL',
        name: 'Bengaluru',
        state: 'Karnataka',
        region: 'South',
        lat: 12.9716,
        lng: 77.5946,
        svgX: 0,
        svgY: 0,
        rawMm: 18,
        evrinMm: 22,
        deltaMm: 4,
        heavyProb: 0.18,
        regime: 'transition-mixed',
        uncertaintySpread: 24,
      },
      {
        id: 'IN.TN.CH',
        name: 'Chennai',
        state: 'Tamil Nadu',
        region: 'South',
        lat: 13.0827,
        lng: 80.2707,
        svgX: 0,
        svgY: 0,
        rawMm: 12,
        evrinMm: 14,
        deltaMm: 2,
        heavyProb: 0.08,
        regime: 'transition-mixed',
        uncertaintySpread: 18,
      },
      {
        id: 'IN.KL.KC',
        name: 'Kochi',
        state: 'Kerala',
        region: 'South',
        lat: 9.9312,
        lng: 76.2673,
        svgX: 0,
        svgY: 0,
        rawMm: regime === 'coastal-rainfall' ? 74 : 58,
        evrinMm: regime === 'coastal-rainfall' ? 104 : 82,
        deltaMm: regime === 'coastal-rainfall' ? 30 : 24,
        heavyProb: 0.84,
        regime: 'coastal-rainfall',
        uncertaintySpread: 72,
      },
      // Northeast Region
      {
        id: 'IN.AS.GU',
        name: 'Guwahati',
        state: 'Assam',
        region: 'NorthEast',
        lat: 26.1445,
        lng: 91.7362,
        svgX: 0,
        svgY: 0,
        rawMm: regime === 'break-monsoon' ? 85 : 48,
        evrinMm: regime === 'break-monsoon' ? 118 : 66,
        deltaMm: regime === 'break-monsoon' ? 33 : 18,
        heavyProb: regime === 'break-monsoon' ? 0.85 : 0.58,
        regime: 'orographic-convection',
        uncertaintySpread: 78,
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

  // Color picker based on active layer
  const getColor = (point: MapDistrictPoint): string => {
    switch (activeLayer) {
      case 'raw-nwp':
        if (point.rawMm > 115.5) return '#dc2626';
        if (point.rawMm > 64.5) return '#f97316';
        if (point.rawMm > 35) return '#10b981';
        if (point.rawMm > 15) return '#0284c7';
        return '#0c4a6e';

      case 'evrin-corrected':
        if (point.evrinMm > 115.5) return '#dc2626';
        if (point.evrinMm > 64.5) return '#f97316';
        if (point.evrinMm > 35) return '#10b981';
        if (point.evrinMm > 15) return '#0284c7';
        return '#0c4a6e';

      case 'difference':
        if (point.deltaMm > 35) return '#10b981';
        if (point.deltaMm > 15) return '#06b6d4';
        if (point.deltaMm >= 0) return '#64748b';
        if (point.deltaMm > -20) return '#f59e0b';
        return '#ef4444';

      case 'heavy-rain-prob':
        if (point.heavyProb > 0.85) return '#ef4444';
        if (point.heavyProb > 0.65) return '#f97316';
        if (point.heavyProb > 0.40) return '#eab308';
        if (point.heavyProb > 0.20) return '#22c55e';
        return '#1e293b';

      case 'regime':
        switch (point.regime) {
          case 'active-monsoon': return '#0ea5e9';
          case 'break-monsoon': return '#f59e0b';
          case 'monsoon-depression': return '#6366f1';
          case 'orographic-convection': return '#10b981';
          case 'coastal-rainfall': return '#06b6d4';
          default: return '#64748b';
        }

      case 'uncertainty':
        if (point.uncertaintySpread > 90) return '#ec4899';
        if (point.uncertaintySpread > 60) return '#a855f7';
        if (point.uncertaintySpread > 30) return '#38bdf8';
        return '#0284c7';
    }
  };

  // Switch Tile Layer (Free, No API Key required!)
  const setTileSource = (type: 'osm' | 'dark' | 'satellite') => {
    if (!mapInstanceRef.current || !window.L) return;
    const L = window.L;
    const map = mapInstanceRef.current;

    if (tileLayerRef.current) {
      map.removeLayer(tileLayerRef.current);
    }

    let tileUrl = '';
    let attribution = '';
    let maxZoom = 18;

    if (type === 'dark') {
      // Free Esri World Dark Gray Base (Clean, accurate, dark theme, NO API KEY)
      tileUrl = 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}';
      attribution = '&copy; Esri &mdash; Esri, DeLorme, NAVTEQ';
      maxZoom = 16;
    } else if (type === 'satellite') {
      // Free Esri World Imagery Satellite (Real satellite photography, NO API KEY)
      tileUrl = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
      attribution = '&copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP';
      maxZoom = 17;
    } else {
      // Standard Free OpenStreetMap (Detailed roads, cities, state boundaries, NO API KEY)
      tileUrl = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';
      attribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
      maxZoom = 19;
    }

    const newLayer = L.tileLayer(tileUrl, { attribution, maxZoom }).addTo(map);
    tileLayerRef.current = newLayer;
    setBaseMapType(type);
  };

  // Initialize Leaflet Map
  useEffect(() => {
    if (!isLeafletReady || !mapContainerRef.current || mapInstanceRef.current) return;

    const L = window.L;

    // Create Map centered strictly on the Indian Subcontinent
    const map = L.map(mapContainerRef.current, {
      center: [22.5, 79.5],
      zoom: 5,
      minZoom: 4,
      maxZoom: 10,
      zoomControl: false,
    });

    // Default to Esri World Dark Gray Base (100% Free, NO API KEY)
    const baseLayer = L.tileLayer(
      'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}',
      {
        attribution: '&copy; Esri, DeLorme, NAVTEQ',
        maxZoom: 16,
      }
    ).addTo(map);
    tileLayerRef.current = baseLayer;

    // Zoom controls top right
    L.control.zoom({ position: 'topright' }).addTo(map);

    // Dedicated layers
    const borderGroup = L.layerGroup().addTo(map);
    const synopticGroup = L.layerGroup().addTo(map);
    const layerGroup = L.layerGroup().addTo(map);

    borderLayerRef.current = borderGroup;
    synopticLayerRef.current = synopticGroup;
    layerGroupRef.current = layerGroup;
    mapInstanceRef.current = map;

    // Add highlighted India Official Territorial Border Polygon
    L.polygon(INDIA_BORDER_COORDINATES, {
      color: '#38bdf8',
      weight: 2,
      opacity: 0.9,
      fillColor: '#0284c7',
      fillOpacity: 0.08,
      dashArray: '4, 4',
    }).addTo(borderGroup);

    // Initial frame fitting strictly to India bounds
    map.fitBounds([
      [8.0, 68.0],
      [36.0, 97.5],
    ]);

    // Invalidate size after layout stabilization to prevent grey rendering
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 250);

    return () => {
      clearTimeout(timer);
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [isLeafletReady]);

  // Update Stations & Synoptics whenever activeScenario or activeLayer changes
  useEffect(() => {
    if (!mapInstanceRef.current || !window.L || !layerGroupRef.current || !synopticLayerRef.current) return;

    const L = window.L;
    const map = mapInstanceRef.current;
    const layerGroup = layerGroupRef.current;
    const synopticGroup = synopticLayerRef.current;

    layerGroup.clearLayers();
    synopticGroup.clearLayers();

    // 1. Synoptic Meteorological Overlays
    const regime = activeScenario?.regimeDiagnosis.primaryRegime;

    if (regime === 'active-monsoon') {
      const troughPoints: [number, number][] = [
        [29.5, 73.5], // Ganganagar
        [27.5, 78.5], // Agra
        [25.5, 83.5], // Varanasi
        [23.5, 87.5], // Kolkata
        [21.5, 89.5], // Head Bay
      ];
      const troughPolyline = L.polyline(troughPoints, {
        color: '#38bdf8',
        weight: 3.5,
        dashArray: '8, 6',
        opacity: 0.9,
      }).addTo(synopticGroup);
      troughPolyline.bindTooltip('MONSOON TROUGH AXIS (ACTIVE)', {
        permanent: false,
        className: 'bg-slate-900 text-sky-400 font-mono text-xs border border-sky-600',
      });
    } else if (regime === 'break-monsoon') {
      const breakPoints: [number, number][] = [
        [31.0, 77.0],
        [29.0, 82.0],
        [27.5, 87.0],
        [26.5, 92.0],
      ];
      const breakPolyline = L.polyline(breakPoints, {
        color: '#f59e0b',
        weight: 3.5,
        dashArray: '8, 6',
        opacity: 0.9,
      }).addTo(synopticGroup);
      breakPolyline.bindTooltip('TROUGH SHIFTED TO FOOTHILLS (BREAK MONSOON)', {
        permanent: false,
        className: 'bg-slate-900 text-amber-400 font-mono text-xs border border-amber-600',
      });
    } else if (regime === 'monsoon-depression') {
      const depressionCenter: [number, number] = [20.0, 86.5];
      L.circle(depressionCenter, {
        radius: 200000,
        color: '#6366f1',
        weight: 2,
        dashArray: '6, 6',
        fillColor: '#6366f1',
        fillOpacity: 0.15,
      }).addTo(synopticGroup);

      L.circle(depressionCenter, {
        radius: 90000,
        color: '#818cf8',
        weight: 2.5,
        fillColor: '#818cf8',
        fillOpacity: 0.3,
      }).addTo(synopticGroup).bindTooltip('CYCLONIC DEPRESSION CORE (LOW-1)', {
        permanent: true,
        direction: 'center',
        className: 'bg-indigo-950 text-indigo-300 font-mono text-[10px] font-bold border border-indigo-700',
      });
    } else if (regime === 'orographic-convection') {
      const ghatsPoints: [number, number][] = [
        [19.5, 73.4],
        [17.9, 73.7],
        [16.2, 74.0],
        [14.5, 74.5],
        [12.8, 75.3],
      ];
      L.polyline(ghatsPoints, {
        color: '#10b981',
        weight: 4.5,
        opacity: 0.9,
      }).addTo(synopticGroup).bindTooltip('WESTERN GHATS OROGRAPHIC RIDGE', {
        permanent: false,
        className: 'bg-slate-900 text-emerald-400 font-mono text-xs border border-emerald-600',
      });
    }

    // 2. Plot District Meteorological Observation Circles
    stations.forEach((station) => {
      const isTarget = station.id === activeScenario?.selectedDistrict.id;
      const color = getColor(station);

      let displayValue = '';
      if (activeLayer === 'difference') {
        displayValue = `${station.deltaMm > 0 ? '+' : ''}${station.deltaMm.toFixed(0)} mm`;
      } else if (activeLayer === 'heavy-rain-prob') {
        displayValue = formatPercentage(station.heavyProb);
      } else if (activeLayer === 'uncertainty') {
        displayValue = `±${station.uncertaintySpread} mm`;
      } else if (activeLayer === 'raw-nwp') {
        displayValue = `${station.rawMm.toFixed(0)} mm`;
      } else {
        displayValue = `${station.evrinMm.toFixed(0)} mm`;
      }

      // Outer pulsing ring for active target district
      if (isTarget) {
        L.circleMarker([station.lat, station.lng], {
          radius: 22,
          fillColor: '#38bdf8',
          fillOpacity: 0.25,
          color: '#38bdf8',
          weight: 2,
          dashArray: '3, 3',
        }).addTo(layerGroup);
      }

      // Station marker
      const marker = L.circleMarker([station.lat, station.lng], {
        radius: isTarget ? 13 : 8,
        fillColor: color,
        fillOpacity: 0.9,
        color: isTarget ? '#ffffff' : '#020617',
        weight: isTarget ? 3 : 1.5,
      }).addTo(layerGroup);

      // Detailed GIS Popup
      const popupHtml = `
        <div style="font-family: monospace; font-size: 11px; color: #f8fafc; min-width: 180px;">
          <div style="font-weight: bold; font-size: 13px; color: #38bdf8; border-bottom: 1px solid #334155; padding-bottom: 4px; margin-bottom: 6px;">
            ${station.name} (${station.state})
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 3px;">
            <span style="color: #94a3b8;">Raw NWP:</span>
            <span style="font-weight: bold;">${station.rawMm.toFixed(1)} mm</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 3px;">
            <span style="color: #94a3b8;">EVRIN Corrected:</span>
            <span style="color: #38bdf8; font-weight: bold;">${station.evrinMm.toFixed(1)} mm</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 3px;">
            <span style="color: #94a3b8;">Correction Delta:</span>
            <span style="color: ${station.deltaMm > 0 ? '#34d399' : '#fbbf24'}; font-weight: bold;">
              ${station.deltaMm > 0 ? '+' : ''}${station.deltaMm.toFixed(1)} mm
            </span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 3px;">
            <span style="color: #94a3b8;">Heavy Rain Prob:</span>
            <span style="color: #f87171; font-weight: bold;">${formatPercentage(station.heavyProb)}</span>
          </div>
          <div style="display: flex; justify-content: space-between;">
            <span style="color: #94a3b8;">Weather Regime:</span>
            <span style="color: #a5b4fc; text-transform: capitalize;">${station.regime.replace('-', ' ')}</span>
          </div>
        </div>
      `;

      marker.bindPopup(popupHtml);

      marker.bindTooltip(`<b>${station.name}</b>: ${displayValue}`, {
        permanent: false,
        direction: 'top',
        className: 'bg-slate-950 text-slate-100 font-mono text-[11px] border border-slate-700 px-2 py-1 rounded shadow-md',
      });

      marker.on('click', () => {
        if (onSelectDistrict) onSelectDistrict(station.id);
      });
    });

    // Fly camera smoothly to target district
    if (activeScenario) {
      const targetCoords: [number, number] = [
        activeScenario.selectedDistrict.coordinates.lat,
        activeScenario.selectedDistrict.coordinates.lng,
      ];
      map.flyTo(targetCoords, 6, { duration: 1.0 });
    }
  }, [activeScenario, activeLayer, stations, onSelectDistrict]);

  return (
    <div className="relative w-full h-full min-h-[540px] flex flex-col bg-slate-950 rounded-lg overflow-hidden border border-slate-800/80">
      {/* Top Floating Bar: Layer Controls & Free Basemap Switcher */}
      <div className="absolute top-3 left-3 right-16 z-[1000] flex flex-wrap items-center justify-between gap-2 pointer-events-auto">
        <MapLayerControl activeLayer={activeLayer} onLayerChange={setActiveLayer} />

        {/* Free Basemap Switcher (Dark / OSM / Satellite) */}
        <div className="bg-slate-950/90 backdrop-blur border border-slate-800 p-1 rounded-md flex items-center gap-1 font-mono text-[10px]">
          <span className="px-1 text-slate-500 font-semibold uppercase">Base:</span>
          <button
            onClick={() => setTileSource('dark')}
            className={`px-2 py-0.5 rounded transition-colors ${
              baseMapType === 'dark' ? 'bg-sky-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Dark GIS
          </button>
          <button
            onClick={() => setTileSource('osm')}
            className={`px-2 py-0.5 rounded transition-colors ${
              baseMapType === 'osm' ? 'bg-sky-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            OpenStreetMap
          </button>
          <button
            onClick={() => setTileSource('satellite')}
            className={`px-2 py-0.5 rounded transition-colors ${
              baseMapType === 'satellite' ? 'bg-sky-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Satellite
          </button>
        </div>
      </div>

      {/* Real Geographic Leaflet Map Canvas */}
      <div
        ref={mapContainerRef}
        className="flex-1 w-full h-full min-h-[540px] z-0 bg-[#090e1a]"
      />

      {/* Loading state before Leaflet mounts */}
      {!isLeafletReady && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-slate-950/90 text-slate-400 gap-3 font-mono text-xs">
          <RefreshCw size={24} className="animate-spin text-sky-400" />
          <span>Loading Real Geographic Map of India...</span>
        </div>
      )}

      {/* Bottom Floating Legend Bar */}
      <div className="absolute bottom-3 left-3 right-3 z-[1000] flex flex-wrap items-center justify-between gap-2 pointer-events-auto">
        <MapLegend activeLayer={activeLayer} />

        <div className="flex items-center gap-1.5 bg-slate-950/90 backdrop-blur border border-slate-800 px-3 py-1.5 rounded-md font-mono text-[10px] text-slate-300">
          <MapPin size={12} className="text-sky-400" />
          <span>Active Target: {activeScenario?.selectedDistrict.name}, {activeScenario?.selectedDistrict.state}</span>
        </div>
      </div>
    </div>
  );
}
