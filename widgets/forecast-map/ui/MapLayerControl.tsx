'use client';

import React from 'react';
import { MapLayerId } from '../model/types';
import { cn } from '@/shared/lib/utils';

export interface MapLayerControlProps {
  activeLayer: MapLayerId;
  onLayerChange: (layer: MapLayerId) => void;
}

export function MapLayerControl({ activeLayer, onLayerChange }: MapLayerControlProps) {
  // Exact layers from Image 2
  const layers: { id: MapLayerId; label: string }[] = [
    { id: 'raw-nwp', label: 'Raw NWP' },
    { id: 'evrin-corrected', label: 'EVRIN Corrected' },
    { id: 'difference', label: 'Difference (+/-)' },
    { id: 'heavy-rain-prob', label: 'Heavy Rain Prob' },
    { id: 'regime', label: 'Regime Flow' },
    { id: 'uncertainty', label: 'Uncertainty P90' },
  ];

  return (
    <div className="flex flex-wrap items-center gap-1.5 select-none text-xs">
      {layers.map((layer) => {
        const isActive = activeLayer === layer.id;
        return (
          <button
            key={layer.id}
            onClick={() => onLayerChange(layer.id)}
            className={cn(
              'px-3 py-1 rounded-full text-xs transition-colors border',
              isActive
                ? 'bg-[#1A8FCB] dark:bg-white text-white dark:text-black border-transparent font-medium shadow-none'
                : 'bg-transparent hover:bg-neutral-100 dark:hover:bg-[#161616] text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white border-neutral-300 dark:border-[#262626]'
            )}
          >
            {layer.label}
          </button>
        );
      })}
    </div>
  );
}
