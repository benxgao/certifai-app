'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { ButtonLoadingText } from '@/src/components/ui/loading-spinner';

interface ActionButtonProps {
  onClick: () => void;
  disabled?: boolean;
  isLoading?: boolean;
  loadingText?: string;
  variant?: 'primary' | 'secondary' | 'success' | 'outline';
  size?: 'sm' | 'lg';
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  fullWidth?: boolean;
}

export const ActionButton: React.FC<ActionButtonProps> = ({
  onClick,
  disabled = false,
  isLoading = false,
  loadingText,
  variant = 'primary',
  size = 'lg',
  icon,
  children,
  className = '',
  fullWidth = false,
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'primary':
        return 'bg-violet-600 hover:bg-violet-700 text-white border-0';
      case 'secondary':
        return 'bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-slate-200/60 dark:border-slate-700/60 hover:bg-slate-50/90 dark:hover:bg-slate-700/90 text-slate-700 dark:text-slate-200';
      case 'success':
        return 'bg-emerald-500 hover:bg-emerald-600 text-white border-0';
      case 'outline':
        return 'bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-slate-200/60 dark:border-slate-700/60 hover:bg-slate-50/90 dark:hover:bg-slate-700/90 text-slate-700 dark:text-slate-200';
      default:
        return 'bg-violet-600 hover:bg-violet-700 text-white border-0';
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'px-4 py-2 text-sm';
      case 'lg':
        return 'px-6 py-3 text-sm';
      default:
        return 'px-6 py-3 text-sm';
    }
  };

  const baseClasses = `
    font-semibold rounded-lg shadow-sm hover:shadow-sm
    transition-colors duration-300
    ${getVariantClasses()}
    ${getSizeClasses()}
    ${fullWidth ? 'w-full' : 'w-auto'}
    ${disabled || isLoading ? 'cursor-not-allowed opacity-70' : ''}
  `
    .replace(/\s+/g, ' ')
    .trim();

  return (
    <Button
      onClick={onClick}
      disabled={disabled || isLoading}
      size={size}
      className={`${baseClasses} ${className}`}
    >
      {isLoading ? (
        <ButtonLoadingText
          isLoading={true}
          loadingText={loadingText || 'Loading...'}
          defaultText={loadingText || 'Loading...'}
          showSpinner={true}
          spinnerSize="sm"
        />
      ) : (
        <span className="flex items-center justify-center space-x-2">
          {icon && <span className="flex-shrink-0">{icon}</span>}
          <span>{children}</span>
        </span>
      )}
    </Button>
  );
};
