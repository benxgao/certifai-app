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
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
    xl: 'h-8 w-8',
  };

  const variantClasses = {
    primary: 'text-violet-600 dark:text-violet-400',
    white: 'text-white',
    muted: 'text-slate-400 dark:text-slate-500',
  };

  return (
    <svg
      className={cn('loading-spinner', sizeClasses[size], variantClasses[variant], className)}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
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
          'fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm',
          className,
        )}
      >
        <div className="flex flex-col items-center space-y-4 loading-fade-in">
          {showIcon && (
            <div className="loading-spinner rounded-full h-12 w-12 border-4 border-violet-500 border-t-transparent" />
          )}
          <p className="text-lg font-medium text-slate-700 dark:text-slate-300">{text}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('flex flex-col items-center justify-center py-8', className)}>
      <div className="flex flex-col items-center space-y-4 loading-fade-in">
        {showIcon && (
          <div className="loading-spinner rounded-full h-8 w-8 border-4 border-violet-500 border-t-transparent" />
        )}
        <p className="text-slate-600 dark:text-slate-400">{text}</p>
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
