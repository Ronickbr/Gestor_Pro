import * as React from 'react';
import { cn } from '../../lib/utils';

type InlineAlertVariant = 'info' | 'success' | 'warning' | 'danger';

const variantClasses: Record<InlineAlertVariant, string> = {
  info: 'border-blue-200 bg-blue-50 text-blue-900 dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-200',
  success:
    'border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-200',
  warning:
    'border-amber-200 bg-amber-50 text-amber-950 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-100',
  danger: 'border-red-200 bg-red-50 text-red-900 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-200',
};

const variantIcon: Record<InlineAlertVariant, string> = {
  info: 'info',
  success: 'check_circle',
  warning: 'warning',
  danger: 'error',
};

export type InlineAlertProps = React.HTMLAttributes<HTMLDivElement> & {
  variant?: InlineAlertVariant;
  title?: string;
};

export const InlineAlert = React.forwardRef<HTMLDivElement, InlineAlertProps>(
  ({ className, variant = 'info', title, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex gap-3 rounded-2xl border px-4 py-3 text-sm leading-relaxed',
          variantClasses[variant],
          className,
        )}
        {...props}
      >
        <span className="material-symbols-outlined mt-0.5">{variantIcon[variant]}</span>
        <div className="min-w-0">
          {title ? <div className="font-black">{title}</div> : null}
          <div className="text-[13px]">{children}</div>
        </div>
      </div>
    );
  },
);

InlineAlert.displayName = 'InlineAlert';

