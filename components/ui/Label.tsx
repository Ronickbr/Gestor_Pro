import * as React from 'react';
import { cn } from '../../lib/utils';

export type LabelProps = React.LabelHTMLAttributes<HTMLLabelElement>;

export const Label = React.forwardRef<HTMLLabelElement, LabelProps>(({ className, ...props }, ref) => {
  return (
    <label
      ref={ref}
      className={cn('text-[11px] font-black text-slate-600 dark:text-slate-400 uppercase tracking-widest', className)}
      {...props}
    />
  );
});

Label.displayName = 'Label';

