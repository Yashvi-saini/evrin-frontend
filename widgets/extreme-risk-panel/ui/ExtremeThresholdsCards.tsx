'use client';

import React from 'react';
import { Card, CardHeader, CardTitle } from '@/shared/ui/card';
import { Badge } from '@/shared/ui/badge';
import { useForecastRepository } from '@/entities/repository';
import { formatPercentage } from '@/shared/lib/utils';

export function ExtremeThresholdsCards() {
  const { activeScenario } = useForecastRepository();
  if (!activeScenario) return null;

  const { extremes } = activeScenario;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Heavy Rain (&gt; 64.5 mm)</CardTitle>
          <Badge variant="danger">
            P: {formatPercentage(extremes.thresholds.heavyRainProbability)}
          </Badge>
        </CardHeader>
        <div className="text-xs text-slate-400">
          Probability of localized flooding, urban waterlogging, and traffic disruption.
        </div>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Very Heavy Rain (&gt; 115.5 mm)</CardTitle>
          <Badge variant="warning">
            P: {formatPercentage(extremes.thresholds.veryHeavyRainProbability)}
          </Badge>
        </CardHeader>
        <div className="text-xs text-slate-400">
          Elevated threat for catchment runoff and agricultural inundation.
        </div>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Extremely Heavy (&gt; 204.4 mm)</CardTitle>
          <Badge variant="info">
            P: {formatPercentage(extremes.thresholds.extremelyHeavyRainProbability)}
          </Badge>
        </CardHeader>
        <div className="text-xs text-slate-400">
          Critical threshold for severe inundation and rapid hydro-meteorological response.
        </div>
      </Card>
    </div>
  );
}
