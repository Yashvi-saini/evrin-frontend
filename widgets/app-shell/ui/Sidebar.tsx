'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NAVIGATION_ROUTES } from '@/shared/config/routes';
import { cn } from '@/shared/lib/utils';
import {
  Compass,
  CloudRain,
  BarChart3,
  AlertTriangle,
  ShieldAlert,
  Cpu,
  Database,
  Activity,
} from '@/shared/ui/icons';

const ICON_MAP = {
  Compass,
  CloudRain,
  BarChart3,
  AlertTriangle,
  ShieldAlert,
  Cpu,
  Database,
};

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-slate-950 border-r border-slate-800 flex flex-col shrink-0 select-none">
      {/* Brand Header */}
      <div className="h-16 px-5 border-b border-slate-800/80 flex items-center justify-between">
        <Link href="/overview" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400">
            <CloudRain size={20} />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold tracking-wider text-slate-100 text-base">EVRIN</span>
              <span className="text-[10px] font-mono bg-sky-500/20 text-sky-300 px-1 py-0.2 rounded font-semibold">AI</span>
            </div>
            <div className="text-[10px] text-slate-400 font-mono tracking-tight leading-none mt-0.5">
              Regime-Aware Rainfall
            </div>
          </div>
        </Link>
      </div>

      {/* Navigation Section */}
      <div className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] font-mono uppercase tracking-wider text-slate-400">
          Intelligence Modules
        </div>

        {NAVIGATION_ROUTES.map((route) => {
          const Icon = ICON_MAP[route.iconName];
          const isActive = pathname === route.path || (route.path !== '/overview' && pathname.startsWith(route.path));

          return (
            <Link
              key={route.path}
              href={route.path}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-md text-xs font-medium transition-all group',
                isActive
                  ? 'bg-sky-950/60 text-sky-300 border border-sky-800/60 font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/80 border border-transparent'
              )}
            >
              <span className={cn('shrink-0 transition-colors', isActive ? 'text-sky-400' : 'text-slate-500 group-hover:text-slate-300')}>
                <Icon size={17} />
              </span>
              <span className="truncate">{route.name}</span>
            </Link>
          );
        })}
      </div>

      {/* System Status Footer */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-950/80">
        <div className="p-2.5 rounded-md bg-slate-900/60 border border-slate-800/60 text-xs">
          <div className="flex items-center justify-between text-[11px] mb-1">
            <span className="text-slate-400">Operational Mode</span>
            <span className="flex items-center gap-1.5 text-emerald-400 font-mono text-[10px]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              ONLINE
            </span>
          </div>
          <div className="text-[10px] text-slate-400 font-mono">
            PS 26080 • SIH 2026
          </div>
        </div>
      </div>
    </aside>
  );
}
