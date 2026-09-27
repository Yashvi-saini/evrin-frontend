'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { Play, RefreshCw, Info, CloudRain, Menu, Sun, Moon, Download } from '@/shared/ui/icons';
import { useForecastRepository } from '@/entities/repository';
import { useTheme } from '@/shared/lib/theme';
import { ExecutionModal } from '@/features/run-evrin';

export interface TopbarProps {
  onToggleMobileMenu?: () => void;
}

export function Topbar({ onToggleMobileMenu }: TopbarProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const {
    activeScenario,
    activeScenarioId,
    scenarios,
    selectScenario,
    isLoading,
  } = useForecastRepository();

  return (
    <>
      <header className="h-14 border-b border-neutral-200 dark:border-[#262626] bg-white/95 dark:bg-[#0A0A0A]/95 backdrop-blur px-3 sm:px-5 flex items-center justify-between shrink-0 select-none z-20 text-neutral-800 dark:text-neutral-100 transition-colors gap-2">
        {/* Brand & Meta Info */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Mobile Hamburger Menu Toggle */}
          <button
            onClick={onToggleMobileMenu}
            className="p-1.5 rounded-lg text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-[#141414] md:hidden flex items-center justify-center transition-colors"
            aria-label="Toggle Navigation Menu"
          >
            <Menu size={19} />
          </button>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="w-6 h-6 rounded bg-neutral-100 dark:bg-[#141414] border border-neutral-300 dark:border-[#262626] flex items-center justify-center text-neutral-800 dark:text-neutral-200 shrink-0">
              <CloudRain size={14} />
            </div>
            <div className="flex items-center gap-1 sm:gap-1.5">
              <span className="font-bold text-neutral-900 dark:text-neutral-100 text-xs sm:text-sm tracking-wider whitespace-nowrap">EVRIN OPS</span>
              <span className="text-[8px] sm:text-[9px] bg-neutral-100 dark:bg-[#141414] text-neutral-800 dark:text-neutral-200 px-1 py-0.5 rounded font-semibold border border-neutral-300 dark:border-[#262626] shrink-0">
                PRO
              </span>
              <span className="text-[10px] text-neutral-500 dark:text-neutral-400 hidden 2xl:inline ml-1 whitespace-nowrap">
                v0.4.2 Operational
              </span>
            </div>
          </div>

          <div className="h-4 w-px bg-neutral-200 dark:border-[#262626] hidden md:block shrink-0" />

          {/* Operational Pill Metadata (Responsive) */}
          <div className="hidden lg:flex items-center gap-1.5 text-[10px]">
            <Badge variant="pill-subtle" className="hidden 2xl:inline-flex whitespace-nowrap">
              RUN 2026-09-27 06Z
            </Badge>

            <Badge variant="pill-subtle" className="hidden xl:inline-flex whitespace-nowrap">
              India National Grid (0.05° Res)
            </Badge>

            <Badge variant="regime" className="flex items-center gap-1 whitespace-nowrap">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
              <span>ACTIVE MONSOON 78% CONF</span>
            </Badge>
          </div>
        </div>

        {/* Actions, Theme Toggle & Scenario Dropdown */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Light / Dark Mode Toggle Pill */}
          <button
            onClick={toggleTheme}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-transparent hover:bg-neutral-100 dark:hover:bg-[#141414] border border-neutral-300 dark:border-[#262626] text-neutral-600 dark:text-neutral-300 text-xs transition-colors shrink-0"
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? (
              <>
                <Sun size={13} className="text-amber-400 shrink-0" />
                <span className="text-[10px] font-medium hidden sm:inline">Light</span>
              </>
            ) : (
              <>
                <Moon size={13} className="text-neutral-800 shrink-0" />
                <span className="text-[10px] font-medium hidden sm:inline">Dark</span>
              </>
            )}
          </button>

          {/* Scenario Selector Pill */}
          <div className="flex items-center gap-1 bg-transparent hover:bg-neutral-100 dark:hover:bg-[#141414] border border-neutral-300 dark:border-[#262626] rounded-full px-2.5 sm:px-3 py-1 text-xs transition-colors shrink-0">
            <span className="text-[10px] text-neutral-500 dark:text-neutral-400 uppercase hidden sm:inline whitespace-nowrap">Scenario:</span>
            <select
              value={activeScenarioId}
              onChange={(e) => selectScenario(e.target.value)}
              disabled={isLoading}
              className="bg-transparent text-neutral-900 dark:text-white font-medium focus:outline-none cursor-pointer text-xs max-w-[120px] sm:max-w-[170px] truncate"
            >
              {scenarios.map((s) => (
                <option key={s.id} value={s.id} className="bg-white dark:bg-[#141414] text-neutral-900 dark:text-neutral-100">
                  {s.name} ({s.selectedDistrict.name})
                </option>
              ))}
            </select>
          </div>

          {/* Quick Export Pill */}
          <button
            onClick={() => alert('Exporting GeoTIFF / NetCDF Grid Field...')}
            className="hidden md:inline-flex items-center gap-1.5 rounded-full bg-transparent hover:bg-neutral-100 dark:hover:bg-[#141414] text-neutral-700 dark:text-neutral-300 hover:text-black dark:hover:text-white border border-neutral-300 dark:border-[#262626] text-xs px-3 py-1 transition-colors whitespace-nowrap shrink-0"
          >
            <Download size={12} className="shrink-0" />
            <span>Quick Export</span>
          </button>

          {/* Run EVRIN Action Button */}
          <button
            onClick={() => setIsModalOpen(true)}
            disabled={isLoading}
            className="inline-flex items-center gap-1.5 rounded-full bg-[#1A8FCB] text-white dark:bg-white dark:text-black hover:bg-[#167db3] dark:hover:bg-neutral-200 text-xs font-semibold px-3.5 py-1 transition-all border border-[#1A8FCB] dark:border-white shadow-sm whitespace-nowrap shrink-0"
          >
            <Play size={11} className="fill-current text-white dark:text-black shrink-0" />
            <span>Run Ensemble</span>
          </button>
        </div>
      </header>

      {/* 7-Step Sequential Execution Stepper Modal */}
      <ExecutionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
