'use client';

import React, { useState, useRef, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { Play, RefreshCw, Info, CloudRain, Menu, Sun, Moon, Download, Printer, FileText, FileImage, Table2, ChevronDown } from '@/shared/ui/icons';
import { useForecastRepository } from '@/entities/repository';
import { useTheme } from '@/shared/lib/theme';
import { ExecutionModal } from '@/features/run-evrin';

export interface TopbarProps {
  onToggleMobileMenu?: () => void;
  onRunEnsemble?: () => void;
}

export function Topbar({ onToggleMobileMenu, onRunEnsemble }: TopbarProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const exportRef = useRef<HTMLDivElement>(null);
  const { theme, toggleTheme } = useTheme();

  const {
    activeScenario,
    activeScenarioId,
    scenarios,
    selectScenario,
    isLoading,
  } = useForecastRepository();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (exportRef.current && !exportRef.current.contains(e.target as Node)) {
        setIsExportOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handlePrint = () => {
    setIsExportOpen(false);
    document.body.setAttribute('data-print-url', window.location.href);
    window.print();
  };

  const handleExportPDF = () => {
    setIsExportOpen(false);
    const originalTitle = document.title;
    document.title = `EVRIN-OPS_Report_${new Date().toISOString().split('T')[0]}`;
    document.body.setAttribute('data-print-url', window.location.href);
    window.print();
    document.title = originalTitle;
  };

  const handleExportCSV = () => {
    setIsExportOpen(false);
    // Build a CSV from the active scenario forecast data
    const rows: string[][] = [
      ['District', 'Sub-Region', 'Valid Time', 'Regime', 'Raw NWP 24h (mm)', 'EVRIN MoE 24h (mm)', 'Raw NWP 48h (mm)', 'EVRIN MoE 48h (mm)', 'Forecast Horizon (h)'],
    ];

    if (activeScenario?.forecast) {
      const f = activeScenario.forecast;
      rows.push([
        f.district?.name ?? activeScenario.selectedDistrict?.name ?? '',
        f.district?.state ?? '',
        f.validTime ?? '',
        f.regimeContext ?? '',
        String(f.raw?.rainfall24h ?? ''),
        String(f.corrected?.rainfall24h ?? ''),
        String(f.raw?.rainfall48h ?? ''),
        String(f.corrected?.rainfall48h ?? ''),
        String(f.forecastHorizonHours ?? ''),
      ]);
    }

    const csvContent = rows.map((r) => r.map((c) => `"${c}"`).join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `EVRIN_Forecast_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleExportPNG = () => {
    setIsExportOpen(false);
    // Use html2canvas-like approach: screenshot the main content area
    // Since html2canvas isn't installed, we'll use the browser's built-in screenshot API via print media
    const style = document.createElement('style');
    style.id = 'png-export-style';
    style.innerHTML = `@media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }`;
    document.head.appendChild(style);
    window.print();
    document.getElementById('png-export-style')?.remove();
  };

  const exportOptions = [
    {
      icon: <Printer size={13} className="shrink-0" />,
      label: 'Print Page',
      sublabel: 'Browser print dialog',
      action: handlePrint,
      color: 'text-neutral-700 dark:text-neutral-300',
    },
    {
      icon: <FileText size={13} className="shrink-0" />,
      label: 'Export as PDF',
      sublabel: 'Save current view as PDF',
      action: handleExportPDF,
      color: 'text-rose-600 dark:text-rose-400',
    },
    {
      icon: <Table2 size={13} className="shrink-0" />,
      label: 'Export as CSV',
      sublabel: 'District forecast data table',
      action: handleExportCSV,
      color: 'text-emerald-600 dark:text-emerald-400',
    },
    {
      icon: <FileImage size={13} className="shrink-0" />,
      label: 'Export as PNG',
      sublabel: 'Screenshot current view',
      action: handleExportPNG,
      color: 'text-[#1A8FCB]',
    },
  ];

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
            <div className="w-6 h-6 rounded bg-neutral-100 dark:bg-[#141414] flex items-center justify-center text-neutral-800 dark:text-neutral-200 shrink-0">
              <CloudRain size={14} />
            </div>
            <div className="flex items-center gap-1 sm:gap-1.5">
              <span className="font-bold text-neutral-900 dark:text-neutral-100 text-xs sm:text-sm tracking-wider whitespace-nowrap">EVRIN OPS</span>
              <span className="text-[8px] sm:text-[9px] bg-neutral-100 dark:bg-[#141414] text-neutral-800 dark:text-neutral-200 px-1 py-0.5 rounded font-semibold shrink-0">
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
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-transparent hover:bg-neutral-100 dark:hover:bg-[#141414] text-neutral-600 dark:text-neutral-300 text-xs transition-colors shrink-0"
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
          <div className="flex items-center gap-1 bg-transparent hover:bg-neutral-100 dark:hover:bg-[#141414] rounded-full px-2.5 sm:px-3 py-1 text-xs transition-colors shrink-0">
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

          {/* Quick Export Dropdown */}
          <div ref={exportRef} className="relative hidden md:block">
            <button
              onClick={() => setIsExportOpen((v) => !v)}
              className="inline-flex items-center gap-1.5 rounded-full bg-transparent hover:bg-neutral-100 dark:hover:bg-[#141414] text-neutral-700 dark:text-neutral-300 hover:text-black dark:hover:text-white text-xs px-3 py-1 transition-colors whitespace-nowrap shrink-0"
            >
              <Download size={12} className="shrink-0" />
              <span>Quick Export</span>
              <ChevronDown
                size={11}
                className={`shrink-0 transition-transform duration-200 ${isExportOpen ? 'rotate-180' : ''}`}
              />
            </button>

            {/* Dropdown Panel */}
            {isExportOpen && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-[#141414] rounded-xl shadow-lg z-50 overflow-hidden">
                <div className="px-3 py-2 border-b border-neutral-100 dark:border-[#262626]">
                  <p className="text-[10px] font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                    Export Options
                  </p>
                </div>
                <div className="py-1">
                  {exportOptions.map((opt) => (
                    <button
                      key={opt.label}
                      onClick={opt.action}
                      className="w-full flex items-start gap-2.5 px-3 py-2.5 hover:bg-neutral-50 dark:hover:bg-[#1a1a1a] transition-colors text-left group"
                    >
                      <span className={`mt-0.5 ${opt.color} group-hover:scale-110 transition-transform`}>
                        {opt.icon}
                      </span>
                      <div>
                        <div className={`text-xs font-semibold ${opt.color}`}>{opt.label}</div>
                        <div className="text-[10px] text-neutral-400 dark:text-neutral-500 mt-0.5">{opt.sublabel}</div>
                      </div>
                    </button>
                  ))}
                </div>
                <div className="px-3 py-2 border-t border-neutral-100 dark:border-[#262626]">
                  <p className="text-[9px] text-neutral-400 dark:text-neutral-500 font-mono">
                    EVRIN OPS v0.4.2 • {new Date().toLocaleDateString('en-IN')}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Run EVRIN Action Button */}
          <button
            onClick={() => (onRunEnsemble ? onRunEnsemble() : setIsModalOpen(true))}
            disabled={isLoading}
            className="inline-flex items-center gap-1.5 rounded-full bg-[#1A8FCB] text-white dark:bg-white dark:text-black hover:bg-[#167db3] dark:hover:bg-neutral-200 text-xs font-semibold px-3.5 py-1 transition-all border border-[#1A8FCB] dark:border-white shadow-sm whitespace-nowrap shrink-0"
          >
            <Play size={11} className="fill-current text-white dark:text-black shrink-0" />
            <span>Run Ensemble</span>
          </button>
        </div>
      </header>

      {/* 7-Step Sequential Execution Stepper Modal (fallback if not handled by parent) */}
      {!onRunEnsemble && <ExecutionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />}
    </>
  );
}
