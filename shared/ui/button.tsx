import React from 'react';
import { cn } from '@/shared/lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'pill' | 'pill-active' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
}

export function Button({
  className,
  variant = 'pill',
  size = 'sm',
  icon,
  children,
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-colors focus:outline-none disabled:opacity-50 disabled:pointer-events-none select-none';

  const variants = {
    // Vercel-style clean matte pill buttons: subtle gray border, no glowing shadow
    pill: 'rounded-full bg-transparent hover:bg-neutral-100 dark:hover:bg-[#161616] text-neutral-700 dark:text-neutral-300 hover:text-black dark:hover:text-white border border-neutral-300 dark:border-[#262626] hover:border-neutral-400 dark:hover:border-[#404040]',
    'pill-active': 'rounded-full bg-[#1A8FCB] dark:bg-white text-white dark:text-black font-semibold border border-[#1A8FCB] dark:border-white',
    
    // Primary Action (e.g. Vercel "Import" / "Upgrade" button)
    primary: 'rounded-full sm:rounded-md bg-[#1A8FCB] hover:bg-[#167db3] dark:bg-white dark:hover:bg-neutral-200 text-white dark:text-black font-medium border border-transparent shadow-none',
    secondary: 'rounded-full sm:rounded-md bg-transparent hover:bg-neutral-100 dark:hover:bg-[#161616] text-neutral-700 dark:text-neutral-300 hover:text-black dark:hover:text-white border border-neutral-300 dark:border-[#262626]',
    outline: 'rounded-full sm:rounded-md border border-neutral-300 dark:border-[#262626] hover:bg-neutral-100 dark:hover:bg-[#161616] text-neutral-700 dark:text-neutral-300 hover:text-black dark:hover:text-white',
    ghost: 'rounded-full sm:rounded-md hover:bg-neutral-100 dark:hover:bg-[#161616] text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white',
    danger: 'rounded-full sm:rounded-md bg-transparent hover:bg-red-50 dark:hover:bg-red-950/40 text-red-600 dark:text-red-400 border border-red-300 dark:border-red-900/60',
  };

  const sizes = {
    sm: 'text-xs px-3 py-1 gap-1.5',
    md: 'text-xs px-3.5 py-1.5 gap-2',
    lg: 'text-sm px-5 py-2 gap-2.5',
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
