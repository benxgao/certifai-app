import * as React from 'react';
import { memo, useMemo, useCallback } from 'react';

import { cn } from '@/src/lib/utils';

interface CardProps extends React.ComponentProps<'div'> {
  variant?: 'default' | 'compact' | 'elevated';
  isSelected?: boolean;
  isLoading?: boolean;
  onClick?: () => void;
  metadata?: Record<string, any>;
}

const Card = memo<CardProps>(
  ({
    className,
    variant = 'default',
    isSelected = false,
    isLoading = false,
    onClick,
    metadata,
    children,
    ...props
  }) => {
    // Memoize card styles to prevent recalculation
    const cardStyles = useMemo(() => {
      const baseClasses = [
        'group relative overflow-hidden rounded-xl border transition-all duration-300 ease-in-out gpu-accelerated',
        'bg-white/95 dark:bg-slate-800/95 backdrop-blur-md shadow-sm',
        'border-slate-200/60 dark:border-slate-700/60',
      ];

      const variantClasses = {
        default: 'p-6',
        compact: 'p-4',
        elevated: 'p-6 shadow-lg',
      };

      const interactiveClasses = onClick
        ? [
            'cursor-pointer interactive-optimized',
            'hover:shadow-lg hover:border-violet-300 dark:hover:border-violet-700',
            'hover:scale-[1.02] hover:-translate-y-1',
          ]
        : [];

      const selectedClasses = isSelected
        ? ['ring-2 ring-violet-500/50 border-violet-300 dark:border-violet-700', 'shadow-lg']
        : [];

      const loadingClasses = isLoading ? ['opacity-70 pointer-events-none'] : [];

      return cn(
        ...baseClasses,
        variantClasses[variant],
        ...interactiveClasses,
        ...selectedClasses,
        ...loadingClasses,
        className,
      );
    }, [className, isSelected, isLoading, onClick, variant]);

    // Create handlers and interactive props only when onClick is provided
    const interactiveProps = useMemo(() => {
      if (!onClick) return {};

      const handleClick = () => {
        if (!isLoading) {
          onClick();
        }
      };

      const handleKeyDown = (event: React.KeyboardEvent) => {
        if ((event.key === 'Enter' || event.key === ' ') && !isLoading) {
          event.preventDefault();
          onClick();
        }
      };

      return {
        onClick: handleClick,
        onKeyDown: handleKeyDown,
        role: 'button' as const,
        tabIndex: 0,
        'aria-pressed': isSelected,
        'aria-disabled': isLoading,
      };
    }, [onClick, isLoading, isSelected]);

    // Memoize metadata rendering
    const metadataContent = useMemo(() => {
      if (!metadata || Object.keys(metadata).length === 0) return null;

      return (
        <div className="mt-4 flex flex-wrap gap-2">
          {Object.entries(metadata).map(([key, value]) => (
            <span
              key={key}
              className="px-2 py-1 text-xs font-medium bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-full"
            >
              {String(value)}
            </span>
          ))}
        </div>
      );
    }, [metadata]);

    return (
      <div data-slot="card" className={cardStyles} {...interactiveProps} {...props}>
        {/* Optimized gradient overlay */}
        {onClick && (
          <div className="absolute inset-0 bg-gradient-to-br from-violet-50/10 to-blue-50/10 dark:from-violet-950/10 dark:to-blue-950/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 gpu-accelerated" />
        )}

        {/* Loading overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm flex items-center justify-center z-10">
            <div className="w-6 h-6 border-2 border-violet-500 border-t-transparent rounded-full loading-optimized" />
          </div>
        )}

        <div className="relative z-10">
          {children}
          {metadataContent}
        </div>
      </div>
    );
  },
);

Card.displayName = 'Card';

const CardHeader = memo<React.ComponentProps<'div'>>(({ className, ...props }) => {
  return (
    <div
      data-slot="card-header"
      className={cn(
        '@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6',
        className,
      )}
      {...props}
    />
  );
});

CardHeader.displayName = 'CardHeader';

const CardTitle = memo<React.ComponentProps<'div'>>(({ className, ...props }) => {
  return (
    <div
      data-slot="card-title"
      className={cn('leading-none font-semibold', className)}
      {...props}
    />
  );
});

CardTitle.displayName = 'CardTitle';

const CardDescription = memo<React.ComponentProps<'div'>>(({ className, ...props }) => {
  return (
    <div
      data-slot="card-description"
      className={cn('text-muted-foreground text-sm', className)}
      {...props}
    />
  );
});

CardDescription.displayName = 'CardDescription';

const CardAction = memo<React.ComponentProps<'div'>>(({ className, ...props }) => {
  return (
    <div
      data-slot="card-action"
      className={cn('col-start-2 row-span-2 row-start-1 self-start justify-self-end', className)}
      {...props}
    />
  );
});

CardAction.displayName = 'CardAction';

const CardContent = memo<React.ComponentProps<'div'>>(({ className, ...props }) => {
  return <div data-slot="card-content" className={cn('px-6', className)} {...props} />;
});

CardContent.displayName = 'CardContent';

const CardFooter = memo<React.ComponentProps<'div'>>(({ className, ...props }) => {
  return (
    <div
      data-slot="card-footer"
      className={cn('flex items-center px-6 [.border-t]:pt-6', className)}
      {...props}
    />
  );
});

CardFooter.displayName = 'CardFooter';

/**
 * Specialized card for loading states
 */
const SkeletonCard = memo<{
  variant?: 'default' | 'compact' | 'elevated';
  className?: string;
}>(({ variant = 'default', className }) => {
  const variantClasses = {
    default: 'p-6',
    compact: 'p-4',
    elevated: 'p-6 shadow-lg',
  };

  return (
    <div
      className={cn(
        'bg-white/95 dark:bg-slate-800/95 backdrop-blur-md shadow-sm rounded-xl border border-slate-200/60 dark:border-slate-700/60',
        variantClasses[variant],
        className,
      )}
    >
      <div className="animate-pulse space-y-4">
        <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
        <div className="space-y-2">
          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded"></div>
          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-2/3"></div>
        </div>
        <div className="flex space-x-2">
          <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded-full w-16"></div>
          <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded-full w-20"></div>
        </div>
      </div>
    </div>
  );
});

SkeletonCard.displayName = 'SkeletonCard';

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
  SkeletonCard,
};

// Export optimized variants for backward compatibility
export { Card as OptimizedCard };
