import React, { memo } from 'react';
import { cn } from '@/src/lib/utils';

interface LoadingSpinnerProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'primary' | 'white' | 'muted' | 'success' | 'error';
  className?: string;
  text?: string;
  showText?: boolean;
}

/**
 * Optimized spinner component with GPU acceleration and reduced motion support
 * Features:
 * - GPU-accelerated animations
 * - Multiple size variants
 * - Color themes
 * - Accessibility support
 * - Reduced motion compliance
 */
export const LoadingSpinner = memo<LoadingSpinnerProps>(
  ({ size = 'md', variant = 'primary', className, text, showText = false }) => {
    const sizeClasses = {
      xs: 'w-3 h-3',
      sm: 'w-4 h-4',
      md: 'w-6 h-6',
      lg: 'w-8 h-8',
      xl: 'w-12 h-12',
    };

    const variantClasses = {
      primary: 'text-violet-600 dark:text-violet-400',
      white: 'text-white',
      muted: 'text-slate-400 dark:text-slate-500',
      success: 'text-emerald-600 dark:text-emerald-400',
      error: 'text-red-600 dark:text-red-400',
    };

    const textSizeClasses = {
      xs: 'text-xs',
      sm: 'text-sm',
      md: 'text-base',
      lg: 'text-lg',
      xl: 'text-xl',
    };

    const spinnerContent = (
      <div
        className={cn(
          'loading-optimized gpu-accelerated inline-block rounded-full border-2 border-solid border-current border-r-transparent',
          sizeClasses[size],
          variantClasses[variant],
          className,
        )}
        role="status"
        aria-label={text || 'Loading'}
      >
        <span className="sr-only">{text || 'Loading...'}</span>
      </div>
    );

    if (showText && text) {
      return (
        <div className="flex items-center space-x-3">
          {spinnerContent}
          <span className={cn('font-medium', variantClasses[variant], textSizeClasses[size])}>
            {text}
          </span>
        </div>
      );
    }

    return spinnerContent;
  },
);

LoadingSpinner.displayName = 'LoadingSpinner';

/**
 * Specialized loading component for page transitions
 */
const PageLoadingSpinner = memo<{
  text?: string;
  className?: string;
}>(({ text = 'Loading page...', className }) => (
  <div className={cn('flex flex-col items-center justify-center space-y-4 p-8', className)}>
    <LoadingSpinner size="lg" variant="primary" />
    <p className="text-lg text-slate-600 dark:text-slate-400 font-medium">{text}</p>
  </div>
));

PageLoadingSpinner.displayName = 'PageLoadingSpinner';

/**
 * Inline loading spinner for buttons and small components
 */
const InlineSpinner = memo<{
  size?: 'xs' | 'sm' | 'md';
  variant?: 'primary' | 'white' | 'muted';
  className?: string;
}>(({ size = 'sm', variant = 'white', className }) => (
  <LoadingSpinner size={size} variant={variant} className={cn('mr-2', className)} />
));

InlineSpinner.displayName = 'InlineSpinner';

interface PageTransitionLoaderProps {
  isLoading: boolean;
  text?: string;
  showIcon?: boolean;
  variant?: 'overlay' | 'inline';
  className?: string;
}

export const PageTransitionLoader = memo<PageTransitionLoaderProps>(
  ({ isLoading, text = 'Loading...', showIcon = true, variant = 'inline', className }) => {
    if (!isLoading) return null;

    if (variant === 'overlay') {
      return (
        <div
          className={cn(
            'fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/90 backdrop-blur-md',
            className,
          )}
        >
          <div className="flex flex-col items-center space-y-6 p-8 rounded-lg bg-background/50 border border-border/50 shadow-2xl backdrop-blur-sm">
            {showIcon && <LoadingSpinner size="xl" variant="primary" className="drop-shadow-lg" />}
            <div className="text-center space-y-2">
              <p className="text-lg font-medium text-foreground">{text}</p>
              <div className="flex items-center justify-center space-x-1">
                <div className="w-2 h-2 bg-violet-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-2 h-2 bg-violet-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-2 h-2 bg-violet-500 rounded-full animate-bounce"></div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className={cn('flex flex-col items-center justify-center py-12 px-4', className)}>
        <div className="flex flex-col items-center space-y-4 text-center max-w-sm mx-auto">
          {showIcon && <LoadingSpinner size="lg" variant="primary" className="drop-shadow-sm" />}
          <p className="text-slate-600 dark:text-slate-400 font-medium">{text}</p>
          <div className="flex items-center justify-center space-x-1">
            <div className="w-1.5 h-1.5 bg-violet-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
            <div className="w-1.5 h-1.5 bg-violet-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
            <div className="w-1.5 h-1.5 bg-violet-500 rounded-full animate-bounce"></div>
          </div>
        </div>
      </div>
    );
  },
);

PageTransitionLoader.displayName = 'PageTransitionLoader';

interface ButtonLoadingTextProps {
  isLoading: boolean;
  loadingText: string;
  defaultText: string;
  showSpinner?: boolean;
  spinnerSize?: 'xs' | 'sm' | 'md';
  className?: string;
}

export const ButtonLoadingText = memo<ButtonLoadingTextProps>(
  ({ isLoading, loadingText, defaultText, showSpinner = true, spinnerSize = 'sm', className }) => {
    return (
      <span className={cn('flex items-center', className)}>
        {isLoading && showSpinner && (
          <LoadingSpinner size={spinnerSize} variant="white" className="mr-2 -ml-1" />
        )}
        {isLoading ? loadingText : defaultText}
      </span>
    );
  },
);

ButtonLoadingText.displayName = 'ButtonLoadingText';

export default LoadingSpinner;

// Export optimized variants for backward compatibility
export { LoadingSpinner as OptimizedSpinner, PageLoadingSpinner, InlineSpinner };
