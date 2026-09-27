import React from 'react';
import { cn } from '@/shared/lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
}

export function Button({
  className,
  variant = 'secondary',
  size = 'md',
  icon,
  children,
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-colors focus:outline-none focus:ring-1 focus:ring-met-blue disabled:opacity-50 disabled:pointer-events-none rounded-md select-none';

  const variants = {
    primary: 'bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold shadow-sm',
    secondary: 'bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700/80',
    outline: 'border border-slate-700 hover:bg-slate-800/80 text-slate-300 hover:text-white',
    ghost: 'hover:bg-slate-800/60 text-slate-400 hover:text-slate-200',
    danger: 'bg-red-600 hover:bg-red-500 text-white font-medium',
  };

  const sizes = {
    sm: 'text-xs px-2.5 py-1.5 gap-1.5',
    md: 'text-sm px-3.5 py-2 gap-2',
    lg: 'text-base px-5 py-2.5 gap-2.5',
  };

  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      disabled={disabled}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
    </button>
  );
}
