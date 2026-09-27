'use client';

import React from 'react';
import { MapLayerId } from '../model/types';
import { cn } from '@/shared/lib/utils';
import { Layers } from '@/shared/ui/icons';

export interface MapLayerControlProps {
  activeLayer: MapLayerId;
  onLayerChange: (layer: MapLayerId) => void;
}

export function MapLayerControl({ activeLayer, onLayerChange }: MapLayerControlProps) {
  const layers: { id: MapLayerId; label: string }[] = [
    { id: 'evrin-corrected', label: 'EVRIN Corrected' },
    { id: 'raw-nwp', label: 'Raw NWP' },
    { id: 'difference', label: 'Difference (Delta)' },
    { id: 'heavy-rain-prob', label: 'Heavy Rain Prob' },
    { id: 'regime', label: 'Weather Regime' },
    { id: 'uncertainty', label: 'Uncertainty' },
  ];

  return (
    <div className="bg-slate-950/80 backdrop-blur border border-slate-800 p-1 rounded-md flex flex-wrap gap-1 font-mono text-[11px] select-none">
      <div className="flex items-center gap-1.5 px-2 py-1 text-slate-500 font-semibold uppercase text-[10px]">
        <Layers size={13} className="text-sky-400" />
        <span className="hidden sm:inline">Layer:</span>
      </div>
      {layers.map((layer) => {
        const isActive = activeLayer === layer.id;
        return (
          <button
            key={layer.id}
            onClick={() => onLayerChange(layer.id)}
            className={cn(
              'px-2.5 py-1 rounded transition-colors',
              isActive
                ? 'bg-sky-500 text-slate-950 font-bold shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/80'
            )}
          >
            {layer.label}
          </button>
        );
      })}
    </div>
  );
}
