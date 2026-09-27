import React from 'react';
import { Card, CardHeader, CardTitle } from '@/shared/ui/card';
import { Badge } from '@/shared/ui/badge';
import { Cpu } from '@/shared/ui/icons';

export default function ModelsPage() {
  const steps = [
    { num: '01', title: 'Atmospheric State Ingestion', desc: 'Raw NWP ensemble feeds (IMD-GFS, NCUM) including geopotential height, u/v winds, moisture convergence, and CAPE.' },
    { num: '02', title: 'Regime Classifier', desc: 'LightGBM / CNN classifier trained on synoptic classification benchmarks (Active, Break, Low/Depression, Orographic).' },
    { num: '03', title: 'Regime-Specific Bias Correction', desc: 'Specialized expert neural networks mapped to prevailing regime physics to eliminate systematic spatial biases.' },
    { num: '04', title: 'Extreme-Event Calibration', desc: 'Quantile regression & extreme value theory (EVT) calibration preserving the tail distribution for heavy rainfall events.' },
    { num: '05', title: 'Probabilistic Uncertainty Estimation', desc: 'Quantile spread generation (P10, P25, P50, P75, P90) communicating physical forecast confidence.' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-100 tracking-tight">AI/ML Post-Processing Architecture</h2>
          <p className="text-xs text-slate-400 mt-1 font-mono">
            How EVRIN adapts raw Numerical Weather Prediction (NWP) to synoptic weather regimes.
          </p>
        </div>
        <Badge variant="info">Pipeline Version: 1.0-prototype</Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Cpu size={15} className="text-sky-400" />
            <span>5-Stage Regime-Aware Inference Flow</span>
          </CardTitle>
        </CardHeader>
        <div className="space-y-4">
          {steps.map((s) => (
            <div key={s.num} className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/60 flex items-start gap-3.5">
              <span className="font-mono text-sm font-bold text-sky-400 shrink-0 mt-0.5">{s.num}</span>
              <div>
                <h4 className="text-xs font-semibold text-slate-200">{s.title}</h4>
                <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
