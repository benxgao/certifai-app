'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/src/lib/utils';

export interface FormButtonProps {
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'lg' | 'default';
  disabled?: boolean;
  loading?: boolean;
  loadingText?: string;
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  fullWidth?: boolean;
}

export const FormButton: React.FC<FormButtonProps> = ({
  type = 'button',
  variant = 'primary',
  size = 'lg',
  disabled = false,
  loading = false,
  loadingText,
  children,
  onClick,
  className,
  fullWidth = true,
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'primary':
        return 'bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-700 hover:to-blue-700 text-white font-medium border-0 shadow-md hover:shadow-lg';
      case 'secondary':
        return 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-600';
      case 'outline':
        return 'border-slate-200/60 dark:border-slate-600/60 hover:bg-slate-50/90 dark:hover:bg-slate-700/90 text-slate-700 dark:text-slate-200 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm';
      case 'ghost':
        return 'hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200';
      default:
        return '';
    }
  };

  return (
    <Button
      type={type}
      size={size}
      disabled={disabled || loading}
      onClick={onClick}
      className={cn(
        'transition-all duration-300 rounded-xl',
        getVariantClasses(),
        fullWidth && 'w-full',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        className,
      )}
    >
      {loading && (
        <div className="flex items-center justify-center">
          <svg className="w-4 h-4 mr-2 animate-spin" fill="none" viewBox="0 0 24 24">
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
          {loadingText || 'Loading...'}
        </div>
      )}
      {!loading && children}
    </Button>
  );
};
