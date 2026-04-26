import * as React from 'react';
import { cn } from '../../lib/utils';

type BadgeVariant = 'default' | 'success' | 'warning' | 'info';

const variantClasses: Record<BadgeVariant, string> = {
  default: 'bg-slate-100 text-slate-700 dark:bg-white/10 dark:text-slate-200',
  success: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-300',
  warning: 'bg-amber-100 text-amber-900 dark:bg-amber-500/15 dark:text-amber-300',
  info: 'bg-blue-100 text-blue-900 dark:bg-blue-500/15 dark:text-blue-300',
};

export type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  variant?: BadgeVariant;
};

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(({ className, variant = 'default', ...props }, ref) => {
  return (
    <span
      ref={ref}
      className={cn('inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold', variantClasses[variant], className)}
      {...props}
    />
  );
});

Badge.displayName = 'Badge';

