import * as React from 'react';
import { cn } from '../../lib/utils';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-primary text-white shadow-lg shadow-primary/20 hover:bg-primary-dark hover:shadow-primary/30 disabled:bg-primary/60 disabled:shadow-none',
  secondary:
    'bg-white/70 text-slate-900 border border-slate-200 hover:bg-white disabled:bg-white/50 dark:bg-white/5 dark:text-white dark:border-white/10 dark:hover:bg-white/10',
  ghost:
    'bg-transparent text-slate-700 hover:bg-slate-100 disabled:text-slate-400 dark:text-slate-200 dark:hover:bg-white/5',
  danger:
    'bg-red-600 text-white hover:bg-red-500 disabled:bg-red-600/60',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'h-9 px-3 text-sm rounded-lg',
  md: 'h-11 px-4 text-sm rounded-xl',
  lg: 'h-12 px-5 text-base rounded-xl',
};

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading = false, disabled, children, ...props }, ref) => {
    const isDisabled = disabled || loading;

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        className={cn(
          'inline-flex items-center justify-center gap-2 font-bold transition-all active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-80 focus-ring',
          variantClasses[variant],
          sizeClasses[size],
          className,
        )}
        {...props}
      >
        {loading ? <span className="material-symbols-outlined animate-spin">sync</span> : null}
        {children}
      </button>
    );
  },
);

Button.displayName = 'Button';

