import * as React from 'react';
import { cn } from '../../lib/utils';

type IconButtonVariant = 'default' | 'ghost' | 'danger';

const variantClasses: Record<IconButtonVariant, string> = {
  default:
    'bg-white/70 text-slate-900 border border-slate-200 hover:bg-white dark:bg-white/5 dark:text-white dark:border-white/10 dark:hover:bg-white/10',
  ghost: 'bg-transparent text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-white/5',
  danger: 'bg-red-500/10 text-red-600 hover:bg-red-500/15 dark:text-red-400 dark:hover:bg-red-500/20',
};

export type IconButtonProps = Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children'> & {
  icon: string;
  'aria-label': string;
  variant?: IconButtonVariant;
  size?: 'md' | 'lg';
};

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ className, icon, variant = 'ghost', size = 'md', type = 'button', ...props }, ref) => {
    return (
      <button
        ref={ref}
        type={type}
        className={cn(
          'inline-flex items-center justify-center rounded-full transition-all active:scale-[0.98] focus-ring',
          size === 'md' ? 'size-11' : 'size-12',
          variantClasses[variant],
          className,
        )}
        {...props}
      >
        <span className="material-symbols-outlined">{icon}</span>
      </button>
    );
  },
);

IconButton.displayName = 'IconButton';

