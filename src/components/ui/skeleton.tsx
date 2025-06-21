import { cn } from '@/src/lib/utils';

function Skeleton({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="skeleton"
      className={cn('bg-slate-200 dark:bg-slate-600 animate-pulse rounded', className)}
      {...props}
    />
  );
}

export { Skeleton };
