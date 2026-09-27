'use client';

import React, { useState, useEffect } from 'react';
import { PipelineStep } from '../model/types';
import { INITIAL_PIPELINE_STEPS } from '../model/pipelineSteps';
import { CheckCircle2, RefreshCw, Cpu, Info } from '@/shared/ui/icons';
import { Button } from '@/shared/ui/button';
import { Badge } from '@/shared/ui/badge';
import { useForecastRepository } from '@/entities/repository';

export interface ExecutionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ExecutionModal({ isOpen, onClose }: ExecutionModalProps) {
  const { activeScenario } = useForecastRepository();
  const [steps, setSteps] = useState<PipelineStep[]>(INITIAL_PIPELINE_STEPS);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isFinished, setIsFinished] = useState<boolean>(false);

  // Run pipeline state machine when modal opens
  useEffect(() => {
    if (!isOpen) {
      setSteps(INITIAL_PIPELINE_STEPS.map((s) => ({ ...s, status: 'pending' })));
      setCurrentStepIndex(0);
      setIsFinished(false);
      return;
    }

    let isCancelled = false;

    async function executePipeline() {
      for (let i = 0; i < INITIAL_PIPELINE_STEPS.length; i++) {
        if (isCancelled) return;

        // Set current step to running
        setCurrentStepIndex(i);
        setSteps((prev) =>
          prev.map((step, idx) => ({
            ...step,
            status: idx === i ? 'running' : idx < i ? 'completed' : 'pending',
          }))
        );

        // Await step duration
        await new Promise((resolve) => setTimeout(resolve, INITIAL_PIPELINE_STEPS[i].durationMs));

        if (isCancelled) return;

        // Mark current step as completed
        setSteps((prev) =>
          prev.map((step, idx) => (idx === i ? { ...step, status: 'completed' } : step))
        );
      }

      if (!isCancelled) {
        setIsFinished(true);
      }
    }

    executePipeline();

    return () => {
      isCancelled = true;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-xl shadow-2xl overflow-hidden font-mono text-xs">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-md bg-sky-500/20 border border-sky-500/40 flex items-center justify-center text-sky-400">
              <Cpu size={16} />
            </div>
            <div>
              <div className="font-bold text-slate-100 text-sm tracking-wide flex items-center gap-2">
                <span>EVRIN AI INFERENCE ENGINE</span>
                <span className="text-[10px] text-sky-400 bg-sky-950/80 px-1.5 py-0.5 rounded border border-sky-800/60">
                  v1.0-sim
                </span>
              </div>
              <div className="text-[10px] text-slate-400">
                Target: {activeScenario?.selectedDistrict.name}, {activeScenario?.selectedDistrict.state}
              </div>
            </div>
          </div>
          {isFinished ? (
            <Badge variant="success">COMPLETE</Badge>
          ) : (
            <Badge variant="info">EXECUTING</Badge>
          )}
        </div>

        {/* Steps List */}
        <div className="p-5 space-y-2.5 max-h-[380px] overflow-y-auto bg-slate-950/40">
          {steps.map((step, idx) => {
            const isCompleted = step.status === 'completed';
            const isRunning = step.status === 'running';

            return (
              <div
                key={step.id}
                className={`p-2.5 rounded-lg border transition-all ${
                  isRunning
                    ? 'bg-sky-950/40 border-sky-700/80 text-sky-100'
                    : isCompleted
                    ? 'bg-slate-900/60 border-slate-800/80 text-slate-300'
                    : 'bg-slate-950/20 border-slate-800/40 text-slate-500'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="font-bold text-slate-400 text-[11px]">0{step.order}</span>
                    <span className="font-semibold text-slate-200">{step.title}</span>
                  </div>

                  {/* Status Indicator */}
                  <div>
                    {isCompleted && (
                      <span className="text-emerald-400 flex items-center gap-1 font-bold text-xs">
                        <CheckCircle2 size={14} />
                        <span>✓</span>
                      </span>
                    )}
                    {isRunning && (
                      <RefreshCw size={14} className="animate-spin text-sky-400" />
                    )}
                    {step.status === 'pending' && (
                      <span className="text-slate-600 text-[10px]">WAITING</span>
                    )}
                  </div>
                </div>
                <div className="text-[10px] text-slate-400 mt-1 pl-6 leading-relaxed">
                  {step.subtext}
                </div>
              </div>
            );
          })}
        </div>

        {/* Completion Banner or Progress Footer */}
        <div className="px-5 py-4 border-t border-slate-800 bg-slate-950/90 flex items-center justify-between">
          {isFinished ? (
            <div className="w-full space-y-3">
              <div className="p-2.5 rounded-md bg-emerald-950/40 border border-emerald-800/60 text-emerald-300 font-semibold flex items-center justify-between text-xs">
                <span>✓ EVRIN FORECAST READY</span>
                <span className="text-[10px] font-mono text-emerald-400">Calibrated in 2.9s</span>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="primary" size="sm" onClick={onClose} className="w-full">
                  VIEW CALIBRATED GUIDANCE
                </Button>
              </div>
            </div>
          ) : (
            <div className="w-full flex items-center justify-between text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <RefreshCw size={13} className="animate-spin text-sky-400" />
                <span>Calibrating step {currentStepIndex + 1} of 7...</span>
              </div>
              <span className="font-mono text-[10px] text-slate-500">Do not close modal</span>
            </div>
          )}
        </div>

        {/* Prototype Honesty Disclaimer */}
        <div className="px-5 py-2 bg-slate-950 border-t border-slate-800/60 text-[10px] text-slate-400 flex items-center gap-1.5">
          <Info size={11} className="text-slate-400 shrink-0" />
          <span>Frontend simulation of ML post-processing pipeline sequence.</span>
        </div>
      </div>
    </div>
  );
}
