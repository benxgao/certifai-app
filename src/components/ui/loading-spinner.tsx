import React from 'react';
import { cn } from '@/src/lib/utils';

interface LoadingSpinnerProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'primary' | 'white' | 'muted';
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  variant = 'primary',
  className,
}) => {
  const sizeClasses = {
    xs: 'h-3 w-3',
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
    xl: 'h-12 w-12',
  };

  const variantClasses = {
    primary: 'text-violet-600 dark:text-violet-400',
    white: 'text-white',
    muted: 'text-slate-400 dark:text-slate-500',
  };

  return (
    <div className={cn('inline-flex items-center justify-center', className)}>
      <svg
        className={cn('animate-spin', sizeClasses[size], variantClasses[variant], 'drop-shadow-sm')}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    </div>
  );
};

interface PageTransitionLoaderProps {
  isLoading: boolean;
  text?: string;
  showIcon?: boolean;
  variant?: 'overlay' | 'inline';
  className?: string;
}

export const PageTransitionLoader: React.FC<PageTransitionLoaderProps> = ({
  isLoading,
  text = 'Loading...',
  showIcon = true,
  variant = 'inline',
  className,
}) => {
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
};

interface ButtonLoadingTextProps {
  isLoading: boolean;
  loadingText: string;
  defaultText: string;
  showSpinner?: boolean;
  spinnerSize?: 'xs' | 'sm' | 'md';
  className?: string;
}

export const ButtonLoadingText: React.FC<ButtonLoadingTextProps> = ({
  isLoading,
  loadingText,
  defaultText,
  showSpinner = true,
  spinnerSize = 'sm',
  className,
}) => {
  return (
    <span className={cn('flex items-center', className)}>
      {isLoading && showSpinner && (
        <LoadingSpinner size={spinnerSize} variant="white" className="mr-2 -ml-1" />
      )}
      {isLoading ? loadingText : defaultText}
    </span>
  );
};

export default LoadingSpinner;
