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
            <span className="text-[9px] bg-[#1A8FCB]/10 dark:bg-[#141414] text-[#1A8FCB] dark:text-neutral-200 px-1.5 py-0.5 rounded font-semibold border border-[#1A8FCB]/30 dark:border-[#262626]">
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

        {/* Desktop Brand Header */}
        <div className="hidden md:flex items-center justify-between px-3.5 py-3 border-b border-neutral-200 dark:border-[#262626]">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-[#1A8FCB]/10 dark:bg-[#141414] border border-[#1A8FCB]/30 dark:border-[#262626] flex items-center justify-center text-[#1A8FCB] dark:text-neutral-200">
              <CloudRain size={13} />
            </div>
            <div>
              <div className="text-xs font-bold text-neutral-900 dark:text-white tracking-wide flex items-center gap-1.5">
                <span>EVRIN OPS</span>
                <span className="text-[8px] bg-[#1A8FCB]/10 text-[#1A8FCB] dark:bg-white/10 dark:text-white px-1 py-0.2 rounded font-bold">
                  AI
                </span>
              </div>
              <div className="text-[9px] text-neutral-500 dark:text-neutral-400">National Met Grid</div>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 py-3 px-2.5 space-y-1 overflow-y-auto">
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
                    ? 'bg-[#1A8FCB]/10 text-[#1A8FCB] font-semibold border border-[#1A8FCB]/30 shadow-none dark:bg-[#141414] dark:text-white dark:border-[#262626]'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-[#141414] border border-transparent'
                )}
              >
                <div className="flex items-center gap-2.5">
                  <span className={cn('shrink-0 transition-colors', isActive ? 'text-[#1A8FCB] dark:text-white' : 'text-neutral-400 group-hover:text-neutral-700 dark:group-hover:text-neutral-300')}>
                    <Icon size={15} />
                  </span>
                  <span className="truncate">{item.name}</span>
                </div>

                {item.badge && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 border border-rose-300 dark:border-rose-900/60 font-mono font-bold">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}

          {/* Action Button in Sidebar */}
          <div className="pt-3 px-0.5">
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

        {/* Telemetry Status Card Footer */}
        <div className="p-2.5 border-t border-neutral-200 dark:border-[#262626] bg-neutral-50/50 dark:bg-[#0A0A0A]">
          <div className="p-2.5 rounded-lg bg-white dark:bg-[#141414] border border-neutral-200 dark:border-[#262626] text-[10px] space-y-2 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-[9px] uppercase tracking-wider text-neutral-500 dark:text-neutral-400 font-semibold flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>TELEMETRY FEED</span>
              </span>
              <span className="text-[9px] font-mono text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/30 px-1.5 py-0.2 rounded border border-emerald-300 dark:border-emerald-800">LIVE</span>
            </div>

            <div className="space-y-1 text-neutral-600 dark:text-neutral-400 font-mono text-[9px]">
              <div className="flex items-center justify-between">
                <span>NWP ECMWF 06Z</span>
                <span className="text-neutral-800 dark:text-neutral-200 font-medium">Synced</span>
              </div>
              <div className="flex items-center justify-between">
                <span>A100 Acceleration</span>
                <span className="text-[#1A8FCB] dark:text-sky-400 font-semibold">1.84x Speedup</span>
              </div>
            </div>

            <div className="pt-1.5 border-t border-neutral-100 dark:border-[#222222] text-[8px] text-neutral-400 dark:text-neutral-500 truncate">
              Cluster: Asia-South1 (Active)
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
