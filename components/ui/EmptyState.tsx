import * as React from 'react';
import { cn } from '../../lib/utils';
import { Button, type ButtonProps } from './Button';

export type EmptyStateProps = React.HTMLAttributes<HTMLDivElement> & {
  icon?: string;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  actionVariant?: ButtonProps['variant'];
};

export const EmptyState = React.forwardRef<HTMLDivElement, EmptyStateProps>(
  ({ className, icon = 'inbox', title, description, actionLabel, onAction, actionVariant = 'primary', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm dark:border-white/10 dark:bg-surface-dark',
          className,
        )}
        {...props}
      >
        <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-700 dark:bg-white/10 dark:text-slate-200">
          <span className="material-symbols-outlined text-3xl">{icon}</span>
        </div>
        <h3 className="text-lg font-black text-slate-900 dark:text-white">{title}</h3>
        {description ? <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{description}</p> : null}
        {actionLabel && onAction ? (
          <div className="mt-6 flex justify-center">
            <Button variant={actionVariant} onClick={onAction}>
              {actionLabel}
            </Button>
          </div>
        ) : null}
      </div>
    );
  },
);

EmptyState.displayName = 'EmptyState';

