import React from 'react';
import { cn } from '@/shared/lib/utils';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'subtle' | 'interactive';
}

export function Card({ className, variant = 'default', children, ...props }: CardProps) {
  const variants = {
    default: 'bg-white dark:bg-[#141414] border border-neutral-200 dark:border-[#262626] text-neutral-900 dark:text-neutral-100 shadow-sm',
    subtle: 'bg-neutral-50 dark:bg-[#1a1a1a] border border-neutral-200 dark:border-[#262626] text-neutral-800 dark:text-neutral-200',
    interactive: 'bg-white dark:bg-[#141414] border border-neutral-200 dark:border-[#262626] hover:border-neutral-300 dark:hover:border-[#383838] text-neutral-900 dark:text-neutral-100 transition-colors cursor-pointer shadow-sm',
  };

  return (
    <div
      className={cn('rounded-lg p-4 transition-colors', variants[variant], className)}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('flex items-center justify-between pb-3 border-b border-neutral-200 dark:border-[#1f1f1f] mb-3', className)} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({ className, children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 className={cn('text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400', className)} {...props}>
      {children}
    </h3>
  );
}
