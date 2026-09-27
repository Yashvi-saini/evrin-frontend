import React from 'react';
import { cn } from '@/shared/lib/utils';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'subtle' | 'interactive';
}

export function Card({ className, variant = 'default', children, ...props }: CardProps) {
  const variants = {
    default: 'bg-slate-900/90 border border-slate-800 text-slate-100 shadow-sm backdrop-blur-sm',
    subtle: 'bg-slate-950/60 border border-slate-800/60 text-slate-200',
    interactive: 'bg-slate-900/90 border border-slate-800 hover:border-slate-700 text-slate-100 transition-colors cursor-pointer',
  };

  return (
    <div
      className={cn('rounded-lg p-4', variants[variant], className)}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('flex items-center justify-between pb-3 border-b border-slate-800/80 mb-3', className)} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({ className, children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 className={cn('text-xs font-semibold uppercase tracking-wider text-slate-400', className)} {...props}>
      {children}
    </h3>
  );
}
