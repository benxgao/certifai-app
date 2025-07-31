'use client';

import React from 'react';
import { cn } from '@/src/lib/utils';

export interface FormCardProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  className?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl';
  showDecorations?: boolean;
}

export const FormCard: React.FC<FormCardProps> = ({
  children,
  title,
  description,
  className,
  maxWidth = 'md',
  showDecorations = true,
}) => {
  const getMaxWidthClass = () => {
    switch (maxWidth) {
      case 'sm':
        return 'max-w-sm';
      case 'md':
        return 'max-w-md';
      case 'lg':
        return 'max-w-lg';
      case 'xl':
        return 'max-w-xl';
      default:
        return 'max-w-md';
    }
  };

  return (
    <div className="relative w-full">
      {/* Background decorations */}
      {showDecorations && (
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-violet-200/20 dark:bg-violet-600/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-10 -left-10 w-56 h-56 bg-blue-200/20 dark:bg-blue-600/10 rounded-full blur-3xl"></div>
        </div>
      )}

      {/* Form Card */}
      <div
        className={cn(
          'relative bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200/60 dark:border-slate-700/60 shadow-2xl rounded-xl overflow-hidden w-full',
          getMaxWidthClass(),
          className,
        )}
      >
        {/* Decorative gradient orbs */}
        {showDecorations && (
          <>
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-violet-200/20 dark:bg-violet-600/10 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-10 -left-10 w-56 h-56 bg-blue-200/20 dark:bg-blue-600/10 rounded-full blur-3xl"></div>
          </>
        )}

        <div className="relative z-10">
          {/* Header */}
          {(title || description) && (
            <div className="px-6 sm:px-8 py-6 border-b border-slate-100 dark:border-slate-700/50 bg-gradient-to-r from-slate-50/60 to-violet-50/30 dark:from-slate-800/40 dark:to-violet-950/20">
              <div className="text-center">
                {title && (
                  <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 dark:text-slate-50 tracking-tight mb-2">
                    {title}
                  </h1>
                )}
                {description && (
                  <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
                    {description}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Content */}
          <div className="p-6 sm:p-8">{children}</div>
        </div>
      </div>
    </div>
  );
};
