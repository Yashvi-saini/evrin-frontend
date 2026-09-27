'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/shared/lib/utils';
import {
  Compass,
  CloudRain,
  BarChart3,
  AlertTriangle,
  ShieldAlert,
  Cpu,
  Database,
  Play,
  X,
} from '@/shared/ui/icons';

export interface SidebarProps {
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

const NAV_ITEMS = [
  { name: 'Overview', path: '/overview', icon: Compass },
  { name: 'Forecast (District Grid)', path: '/forecast', icon: CloudRain },
  { name: 'Regimes', path: '/regimes', icon: BarChart3 },
  { name: 'Extremes', path: '/extremes', icon: AlertTriangle, badge: '124' },
  { name: 'Verification', path: '/verification', icon: ShieldAlert },
  { name: 'Data', path: '/data', icon: Database },
  { name: 'Models', path: '/models', icon: Cpu },
];

export function Sidebar({ isMobileOpen = false, onCloseMobile }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isMobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-black/75 backdrop-blur-sm z-40 md:hidden transition-opacity"
        />
      )}

      {/* Responsive Scientific Sidebar Drawer */}
      <aside
        className={cn(
          'bg-white dark:bg-[#0A0A0A] border-r border-neutral-200 dark:border-[#262626] flex flex-col select-none transition-transform duration-300 z-50 text-neutral-800 dark:text-neutral-200',
          // Desktop: Permanent static sidebar
          'md:static md:w-56 md:translate-x-0 md:shrink-0',
          // Mobile: Off-canvas sliding drawer
          'fixed inset-y-0 left-0 w-64',
          isMobileOpen ? 'translate-x-0 shadow-xl' : '-translate-x-full md:translate-x-0'
        )}
      >
        {/* Mobile Header with Close Button */}
        <div className="flex md:hidden items-center justify-between p-3.5 border-b border-neutral-200 dark:border-[#262626]">
          <div className="flex items-center gap-2">
            <span className="font-bold text-neutral-900 dark:text-neutral-100 text-sm tracking-wider">EVRIN OPS</span>
            <span className="text-[9px] bg-neutral-100 dark:bg-[#141414] text-neutral-800 dark:text-neutral-200 px-1 py-0.5 rounded font-semibold border border-neutral-300 dark:border-[#262626]">
              PRO
            </span>
          </div>
          <button
            onClick={onCloseMobile}
            className="p-1 rounded-md text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 py-4 px-2.5 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.path || (item.path !== '/overview' && pathname.startsWith(item.path));

            return (
              <Link
                key={item.path}
                href={item.path}
                onClick={onCloseMobile}
                className={cn(
                  'flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all group',
                  isActive
                    ? 'bg-neutral-100 dark:bg-[#141414] text-neutral-900 dark:text-neutral-100 font-semibold border border-neutral-200 dark:border-[#262626]'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-[#141414] border border-transparent'
                )}
              >
                <div className="flex items-center gap-2.5">
                  <span className={cn('shrink-0 transition-colors', isActive ? 'text-neutral-900 dark:text-white' : 'text-neutral-400 group-hover:text-neutral-700 dark:group-hover:text-neutral-300')}>
                    <Icon size={15} />
                  </span>
                  <span className="truncate">{item.name}</span>
                </div>

                {item.badge && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 border border-rose-300 dark:border-rose-900/60 font-bold">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}

          {/* Action Button in Sidebar */}
          <div className="pt-4 px-1">
            <button
              onClick={() => {
                onCloseMobile?.();
                const runBtn = document.querySelector('header button');
                if (runBtn) (runBtn as HTMLButtonElement).click();
              }}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-full bg-[#1A8FCB] text-white dark:bg-white dark:text-black hover:bg-[#167db3] dark:hover:bg-neutral-200 text-xs font-semibold transition-all border border-[#1A8FCB] dark:border-white shadow-sm"
            >
              <Play size={13} className="fill-current text-white dark:text-black" />
              <span>Run Ensemble</span>
            </button>
          </div>
        </div>

        {/* Telemetry Links Footer */}
        <div className="p-3 border-t border-neutral-200 dark:border-[#262626] bg-neutral-50 dark:bg-[#0A0A0A] text-[10px] text-neutral-500 dark:text-neutral-400">
          <div className="text-[9px] uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-2 font-semibold">
            Telemetry Links
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>NWP 06 UTC</span>
              </span>
              <span>Synced (42m)</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>Obs 03 UTC</span>
              </span>
              <span className="text-emerald-600 dark:text-emerald-400 font-bold">Live</span>
            </div>

            <div className="flex items-center justify-between">
              <span>System Healthy</span>
              <span className="text-neutral-800 dark:text-neutral-200 font-semibold">1.84x (A100)</span>
            </div>

            <div className="pt-1.5 border-t border-neutral-200 dark:border-[#262626] truncate">
              Inference Cluster: Asia-South1
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
