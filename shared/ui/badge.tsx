import React from 'react';
import { cn } from '@/shared/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'info' | 'success' | 'warning' | 'danger' | 'regime' | 'pill-subtle';
  size?: 'sm' | 'md';
}

export function Badge({ className, variant = 'default', size = 'sm', children, ...props }: BadgeProps) {
  // Clean borderless, backgroundless pill badges — text-only with subtle color
  const variants = {
    default:     'text-neutral-500 dark:text-neutral-400',
    info:        'text-sky-600 dark:text-sky-400',
    success:     'text-emerald-600 dark:text-emerald-400',
    warning:     'text-amber-600 dark:text-amber-400',
    danger:      'text-rose-600 dark:text-rose-400',
    regime:      'text-neutral-700 dark:text-neutral-300',
    'pill-subtle': 'text-neutral-500 dark:text-neutral-400',
  };

  const sizes = {
    sm: 'text-[10px] px-1.5 py-0.5 tracking-wide',
    md: 'text-xs px-2 py-1 tracking-normal',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 font-medium rounded-full select-none transition-colors',
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
