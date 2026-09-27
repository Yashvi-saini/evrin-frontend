'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { Play, Info } from '@/shared/ui/icons';
import { NAVIGATION_ROUTES } from '@/shared/config/routes';
import { useForecastRepository } from '@/entities/repository';
import { ExecutionModal } from '@/features/run-evrin';

export function Topbar() {
  const pathname = usePathname();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    activeScenario,
    activeScenarioId,
    scenarios,
    selectScenario,
    isLoading,
  } = useForecastRepository();

  const currentRoute = NAVIGATION_ROUTES.find(
    (r) => pathname === r.path || (r.path !== '/overview' && pathname.startsWith(r.path))
  ) || NAVIGATION_ROUTES[0];

  return (
    <>
      <header className="h-16 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md px-6 flex items-center justify-between shrink-0 select-none">
        {/* Route Title & Subheader */}
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
              <span>{currentRoute.name}</span>
              <span className="text-slate-600">/</span>
              <span className="text-xs font-normal text-slate-400 font-mono">
                {currentRoute.description}
              </span>
            </h1>
          </div>
        </div>

        {/* Actions, Scenario Dropdown & Simulation Badges */}
        <div className="flex items-center gap-3">
          {/* Prototype Honesty Badge */}
          <Badge variant="warning" size="sm" className="hidden lg:inline-flex items-center gap-1 font-mono">
            <Info size={12} className="text-amber-400 shrink-0" />
            <span>Simulated Prototype Data</span>
          </Badge>

          {/* Interactive Scenario Selector */}
          <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-md text-xs font-mono">
            <span className="text-[10px] text-slate-400 uppercase hidden sm:inline">Scenario:</span>
            <select
              value={activeScenarioId}
              onChange={(e) => selectScenario(e.target.value)}
              disabled={isLoading}
              className="bg-transparent text-sky-400 font-medium focus:outline-none cursor-pointer text-xs"
            >
              {scenarios.map((s) => (
                <option key={s.id} value={s.id} className="bg-slate-900 text-slate-200">
                  {s.name} ({s.selectedDistrict.name})
                </option>
              ))}
            </select>
          </div>

          {/* Run EVRIN Action Button */}
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsModalOpen(true)}
            disabled={isLoading}
            icon={<Play size={13} />}
            className="font-mono text-xs tracking-wider"
          >
            RUN EVRIN
          </Button>
        </div>
      </header>

      {/* 7-Step Sequential Execution Stepper Modal */}
      <ExecutionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
