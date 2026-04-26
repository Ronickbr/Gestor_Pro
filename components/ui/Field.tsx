import * as React from 'react';
import { cn } from '../../lib/utils';
import { Label } from './Label';

export type FieldProps = {
  label?: string;
  htmlFor?: string;
  hint?: string;
  error?: string;
  className?: string;
  children: React.ReactNode;
};

export const Field: React.FC<FieldProps> = ({ label, htmlFor, hint, error, className, children }) => {
  return (
    <div className={cn('space-y-1.5', className)}>
      {label ? <Label htmlFor={htmlFor}>{label}</Label> : null}
      {children}
      {error ? <p className="text-xs font-medium text-red-600 dark:text-red-400">{error}</p> : null}
      {!error && hint ? <p className="text-xs text-slate-500 dark:text-slate-400">{hint}</p> : null}
    </div>
  );
};

