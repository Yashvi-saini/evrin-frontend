'use client';

import React, { useState } from 'react';
import { Badge } from '@/shared/ui/badge';
import { Cpu, Activity, Zap, CheckCircle2, CloudRain, Layers, ArrowRight } from '@/shared/ui/icons';

export default function ModelsPage() {
  const [selectedStage, setSelectedStage] = useState<number>(2);

  const pipelineStages = [
    {
      num: '01',
      title: 'Multi-Source Atmospheric Ingestion',
      subtitle: 'NWP Ensembles & Satellite Feed',
      arch: 'Asynchronous GRIB2 / NetCDF-4 Ingestion Pipe',
      tensor: '[B, 37, 721, 1440] @ 0.1° ECMWF / NCUM',
      params: 'N/A (I/O Pipeline)',
      latency: '180 ms',
      physics: 'Ingests 3D geopotential height (Z), U/V wind vectors (850/500/200 hPa), specific humidity (q), CAPE, and INSAT-3DR Brightness Temp.',
    },
    {
      num: '02',
      title: 'Topographic Spherical Mesh-GNN',
      subtitle: 'Multi-Scale Spatial Tokenizer',
      arch: 'Spherical Graph Convolutional Network (GCN)',
      tensor: '[B, 48200 nodes, 128 hidden dim]',
      params: '14.2M params',
      latency: '320 ms',
      physics: 'Projects India 0.05° digital elevation model (DEM) onto an icosahedral spherical mesh, resolving steep orographic Ghats & Himalayan barriers.',
    },
    {
      num: '03',
      title: 'Regime-Aware Mixture of Experts (MoE)',
      subtitle: 'Synoptic Dynamic Router',
      arch: 'Top-2 Gated MoE with 5 Physical Expert Networks',
      tensor: '[B, 5 experts, 256 dim softmax routing]',
      params: '38.6M params',
      latency: '410 ms',
      physics: 'Softmax gating classifier determines prevailing monsoon state (Active, Break, Depression, Orographic) and routes grid cells to expert weights.',
    },
    {
      num: '04',
      title: 'Tail-Preserving Extreme Value Head',
      subtitle: 'Generalized Pareto Quantile Network',
      arch: 'Non-Stationary EVT Neural Regression',
      tensor: '[B, 11 quantiles (P05..P95), 0.05° grid]',
      params: '8.4M params',
      latency: '190 ms',
      physics: 'Eliminates NWP systematic conditional bias while preserving upper tail distribution for cloudbursts and extreme rainfall (>115.5mm).',
    },
    {
      num: '05',
      title: 'Conformal Prediction Calibrator',
      subtitle: 'Coverage-Guaranteed Uncertainty',
      arch: 'Empirical Conformal Inference (Coverage 90%)',
      tensor: '[B, 2 bounds (Lower P10, Upper P90)]',
      params: 'Non-parametric calibration',
      latency: '60 ms',
      physics: 'Yields mathematically valid prediction intervals under non-exchangeable monsoon regime transitions with guaranteed 90% coverage.',
    },
  ];

  const currentStage = pipelineStages[selectedStage];

  return (
    <div className="space-y-5 font-mono select-none">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-200 dark:border-[#262626] pb-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 tracking-tight">AI/ML Post-Processing Architecture</h1>
            <span className="text-[10px] px-2.5 py-0.5 rounded-full text-neutral-800 dark:text-neutral-200 font-mono font-bold">
              RESIDUAL-GNN + REGIME-MoE
            </span>
          </div>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 font-sans mt-0.5">
            5-Stage deep learning pipeline translating raw NWP ensemble output into regime-calibrated 0.05° precipitation.
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="text-neutral-500 dark:text-neutral-400">Total Latency:</span>
          <span className="text-neutral-900 dark:text-neutral-100 font-bold">1,160 ms (End-to-End)</span>
        </div>
      </div>

      {/* 5-Stage Visual Stepper Pipeline Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2.5">
        {pipelineStages.map((s, idx) => {
          const isSelected = selectedStage === idx;
          return (
            <button
              key={s.num}
              onClick={() => setSelectedStage(idx)}
              className={`p-3 rounded-lg text-left transition-all border font-mono ${
                isSelected
                  ? 'bg-[#1A8FCB] text-white dark:bg-white dark:text-black border-[#1A8FCB] dark:border-white'
                  : 'bg-white dark:bg-[#141414] hover:bg-neutral-50 dark:hover:bg-[#1a1a1a] text-neutral-600 dark:text-neutral-400 border-neutral-200 dark:border-[#262626] hover:border-neutral-400 dark:hover:border-neutral-600'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className={`text-[10px] font-bold ${isSelected ? 'text-sky-100 dark:text-neutral-700' : 'text-neutral-400 dark:text-neutral-500'}`}>
                  STAGE {s.num}
                </span>
                <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-white dark:bg-black' : 'bg-neutral-300 dark:bg-neutral-700'}`} />
              </div>
              <div className={`text-xs font-bold truncate ${isSelected ? 'text-white dark:text-black' : 'text-neutral-900 dark:text-neutral-100'}`}>{s.title}</div>
              <div className={`text-[10px] truncate mt-0.5 ${isSelected ? 'text-sky-100 dark:text-neutral-600' : 'text-neutral-500 dark:text-neutral-400'}`}>{s.subtitle}</div>
            </button>
          );
        })}
      </div>

      {/* Selected Stage Deep-Dive Diagnostics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Column: Stage Architectural Specifications */}
        <div className="lg:col-span-7 bg-white dark:bg-[#141414] rounded-lg p-4 space-y-4">
          <div className="flex items-center justify-between pb-2.5 border-b border-neutral-200 dark:border-[#262626]">
            <div>
              <div className="text-xs font-bold text-neutral-900 dark:text-neutral-100 uppercase tracking-wide flex items-center gap-2">
                <Cpu size={15} className="text-neutral-600 dark:text-neutral-400" />
                <span>Stage {currentStage.num}: {currentStage.title}</span>
              </div>
              <span className="text-[10px] text-neutral-500 dark:text-neutral-400">{currentStage.subtitle}</span>
            </div>
            <span className="text-[10px] px-2.5 py-0.5 rounded-full text-neutral-700 dark:text-neutral-300">
              {currentStage.latency} INFERENCE
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-2.5 rounded">
              <div className="text-[9px] text-neutral-500 dark:text-neutral-400 uppercase">Core Architecture</div>
              <div className="font-bold text-neutral-900 dark:text-neutral-100 mt-0.5 font-mono text-[11px]">{currentStage.arch}</div>
            </div>
            <div className="p-2.5 rounded">
              <div className="text-[9px] text-neutral-500 dark:text-neutral-400 uppercase">Input Tensor Shape</div>
              <div className="font-bold text-neutral-900 dark:text-neutral-100 mt-0.5 font-mono text-[11px] truncate">{currentStage.tensor}</div>
            </div>
            <div className="p-2.5 rounded">
              <div className="text-[9px] text-neutral-500 dark:text-neutral-400 uppercase">Learnable Parameters</div>
              <div className="font-bold text-neutral-900 dark:text-neutral-100 mt-0.5 font-mono text-[11px]">{currentStage.params}</div>
            </div>
            <div className="p-2.5 rounded">
              <div className="text-[9px] text-neutral-500 dark:text-neutral-400 uppercase">Hardware Acceleration</div>
              <div className="font-bold text-neutral-900 dark:text-neutral-100 mt-0.5 font-mono text-[11px]">TensorRT FP16 @ A100</div>
            </div>
          </div>

          {/* Physical Mechanism Explainer */}
          <div className="p-3 rounded text-xs">
            <div className="text-[10px] text-neutral-500 dark:text-neutral-400 uppercase tracking-wider font-semibold mb-1">
              Meteorological Inductive Bias:
            </div>
            <p className="text-neutral-700 dark:text-neutral-300 font-sans leading-relaxed text-[11px]">
              {currentStage.physics}
            </p>
          </div>
        </div>

        {/* Right Column: Training Telemetry & Benchmark Card */}
        <div className="lg:col-span-5 bg-white dark:bg-[#141414] rounded-lg p-4 space-y-3.5">
          <div className="flex items-center justify-between pb-2 border-b border-neutral-200 dark:border-[#262626]">
            <span className="text-[10px] text-neutral-500 dark:text-neutral-400 uppercase tracking-wider font-semibold">
              Training & Optimization Profile
            </span>
            <span className="text-[9px] text-neutral-600 dark:text-neutral-400 font-mono">1980–2024 ERA5</span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between items-center p-2 rounded">
              <span className="text-neutral-500 dark:text-neutral-400 text-[11px]">Objective Loss:</span>
              <span className="text-neutral-900 dark:text-neutral-100 font-bold font-mono">Regime-Weighted Pinball + EVT Tail Penalty</span>
            </div>

            <div className="flex justify-between items-center p-2 rounded">
              <span className="text-neutral-500 dark:text-neutral-400 text-[11px]">Training Dataset:</span>
              <span className="text-neutral-800 dark:text-neutral-200 font-bold font-mono">44 Years (16,070 Monsoon Days)</span>
            </div>

            <div className="flex justify-between items-center p-2 rounded">
              <span className="text-neutral-500 dark:text-neutral-400 text-[11px]">Observation Truth:</span>
              <span className="text-neutral-800 dark:text-neutral-200 font-bold font-mono">IMD 0.25° Daily Gridded Rain</span>
            </div>

            <div className="flex justify-between items-center p-2 rounded">
              <span className="text-neutral-500 dark:text-neutral-400 text-[11px]">Throughput:</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-bold font-mono">14.8 Full Grids / Minute</span>
            </div>

            <div className="flex justify-between items-center p-2 rounded">
              <span className="text-neutral-500 dark:text-neutral-400 text-[11px]">Quantile Output:</span>
              <span className="text-neutral-900 dark:text-neutral-100 font-bold font-mono">P10, P25, P50, P75, P90, P95</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
