import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/src/lib/utils';

const alertVariants = cva(
  'relative w-full rounded-lg border px-4 py-3 text-sm grid has-[>svg]:grid-cols-[calc(var(--spacing)*4)_1fr] grid-cols-[0_1fr] has-[>svg]:gap-x-3 gap-y-0.5 items-start [&>svg]:size-4 [&>svg]:translate-y-0.5 [&>svg]:text-current',
  {
    variants: {
      variant: {
        default: 'bg-card text-card-foreground border-border',
        destructive:
          'bg-red-50 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-100 dark:border-red-800/50 [&>svg]:text-red-600 dark:[&>svg]:text-red-400 *:data-[slot=alert-description]:text-red-700 dark:*:data-[slot=alert-description]:text-red-300',
        success:
          'bg-green-50 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-100 dark:border-green-800/50 [&>svg]:text-green-600 dark:[&>svg]:text-green-400 *:data-[slot=alert-description]:text-green-700 dark:*:data-[slot=alert-description]:text-green-300',
        warning:
          'bg-warning-50 text-warning-800 border-warning-200 dark:bg-warning-900/20 dark:text-warning-100 dark:border-warning-800/50 [&>svg]:text-warning-600 dark:[&>svg]:text-warning-400 *:data-[slot=alert-description]:text-warning-700 dark:*:data-[slot=alert-description]:text-warning-300',
        info: 'bg-info-50 text-info-800 border-info-200 dark:bg-info-900/20 dark:text-info-100 dark:border-info-800/50 [&>svg]:text-info-600 dark:[&>svg]:text-info-400 *:data-[slot=alert-description]:text-info-700 dark:*:data-[slot=alert-description]:text-info-300',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

function Alert({
  className,
  variant,
  ...props
}: React.ComponentProps<'div'> & VariantProps<typeof alertVariants>) {
  return (
    <div
      data-slot="alert"
      role="alert"
      className={cn(alertVariants({ variant }), className)}
      {...props}
    />
  );
}

function AlertTitle({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="alert-title"
      className={cn('col-start-2 line-clamp-1 min-h-4 font-medium tracking-tight', className)}
      {...props}
    />
  );
}

function AlertDescription({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="alert-description"
      className={cn(
        'text-muted-foreground col-start-2 grid justify-items-start gap-1 text-sm [&_p]:leading-relaxed',
        className,
      )}
      {...props}
    />
  );
}

export { Alert, AlertTitle, AlertDescription, alertVariants };
