import React from 'react';
import { cn } from '@/shared/lib/utils';

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number; // 0 to 100
  color?: 'sky' | 'emerald' | 'amber' | 'red' | 'indigo';
}

export function Progress({
  value,
  color = 'sky',
  className,
  ...props
}: ProgressProps) {
  const safeValue = Math.min(100, Math.max(0, value));

  const colors = {
    sky: 'bg-sky-500',
    emerald: 'bg-emerald-500',
    amber: 'bg-amber-500',
    red: 'bg-red-500',
    indigo: 'bg-indigo-500',
  };

  return (
    <div
      className={cn('w-full bg-slate-800 rounded-full h-2 overflow-hidden', className)}
      {...props}
    >
      <div
        className={cn('h-full transition-all duration-300 rounded-full', colors[color])}
        style={{ width: `${safeValue}%` }}
      />
    </div>
  );
}
