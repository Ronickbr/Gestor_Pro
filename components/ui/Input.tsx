import * as React from 'react';
import { cn } from '../../lib/utils';

export type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  startIcon?: string;
};

export const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, startIcon, ...props }, ref) => {
  if (startIcon) {
    return (
      <div className="relative">
        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-lg">
          {startIcon}
        </span>
        <input
          ref={ref}
          className={cn(
            'w-full h-12 rounded-xl border border-slate-200 bg-white px-4 pl-10 text-sm text-slate-900 placeholder:text-slate-400 transition-all focus-ring dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-slate-500',
            className,
          )}
          {...props}
        />
      </div>
    );
  }

  return (
    <input
      ref={ref}
      className={cn(
        'w-full h-12 rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900 placeholder:text-slate-400 transition-all focus-ring dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-slate-500',
        className,
      )}
      {...props}
    />
  );
});

Input.displayName = 'Input';

