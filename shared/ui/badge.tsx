import React from 'react';
import { cn } from '@/shared/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'info' | 'success' | 'warning' | 'danger' | 'regime' | 'pill-subtle';
  size?: 'sm' | 'md';
}

export function Badge({ className, variant = 'default', size = 'sm', children, ...props }: BadgeProps) {
  // Vercel-style clean matte pill badges without any shiny/glowing illumination
  const variants = {
    default: 'bg-neutral-100 dark:bg-[#111111] text-neutral-700 dark:text-neutral-300 border border-neutral-300 dark:border-[#262626]',
    info: 'bg-sky-50 dark:bg-sky-950/30 text-sky-700 dark:text-sky-400 border border-sky-200 dark:border-sky-900/60',
    success: 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/60',
    warning: 'bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-900/60',
    danger: 'bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-900/60',
    regime: 'bg-neutral-100 dark:bg-[#111111] text-neutral-800 dark:text-neutral-200 border border-neutral-300 dark:border-[#262626]',
    'pill-subtle': 'bg-transparent text-neutral-600 dark:text-neutral-400 border border-neutral-300 dark:border-[#262626]',
  };

  const sizes = {
    sm: 'text-[10px] px-2 py-0.5 tracking-wide',
    md: 'text-xs px-2.5 py-1 tracking-normal',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 font-medium rounded-full select-none transition-colors',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
