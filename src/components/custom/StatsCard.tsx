'use client';

import React from 'react';
import { cn } from '@/src/lib/utils';

interface StatsCardProps {
  dotColor?: string;
  title: string;
  value: number | string | React.ReactNode;
  subtitle?: string;
  className?: string;
  variant?: 'default' | 'overview';
}

export const StatsCard: React.FC<StatsCardProps> = ({
  dotColor = 'bg-violet-400 dark:bg-violet-500',
  title,
  value,
  subtitle,
  className = '',
  variant = 'default',
}) => (
  <div
    className={cn(
      'relative backdrop-blur-md border rounded-2xl overflow-hidden group transition-all duration-500',
      variant === 'overview'
        ? 'bg-white/95 dark:bg-slate-900/95 border-slate-200/60 dark:border-slate-700/60 shadow-xl hover:shadow-2xl hover:shadow-slate-500/10 dark:hover:shadow-slate-400/5'
        : 'bg-white/95 dark:bg-slate-800/95 border-slate-200/60 dark:border-slate-700/60 shadow-lg hover:shadow-xl transition-all duration-300',
      className,
    )}
  >
    {/* Enhanced decorative elements for overview variant */}
    {variant === 'overview' && (
      <>
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-slate-200/20 to-blue-200/10 dark:from-slate-600/10 dark:to-blue-600/5 rounded-bl-full blur-xl"></div>
        <div className="absolute -bottom-2 -left-2 w-16 h-16 bg-gradient-to-tr from-violet-100/15 to-cyan-100/10 dark:from-violet-600/5 dark:to-cyan-600/3 rounded-tr-full blur-lg"></div>
      </>
    )}

    <div className={cn('relative z-10', variant === 'overview' ? 'p-6 sm:p-7' : 'p-6')}>
      <div className="space-y-4 sm:space-y-5">
        <div className="flex items-center justify-center space-x-3">
          <div
            className={cn(
              'rounded-full transition-all duration-300',
              variant === 'overview'
                ? 'w-3 h-3 shadow-md group-hover:scale-125 group-hover:shadow-lg'
                : 'w-2.5 h-2.5 group-hover:scale-125',
              dotColor,
            )}
          ></div>
          <p
            className={cn(
              'font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider',
              variant === 'overview' ? 'text-sm sm:text-base' : 'text-sm',
            )}
          >
            {title}
          </p>
        </div>
        <div className="text-center">
          <div
            className={cn(
              'font-bold bg-gradient-to-r bg-clip-text text-transparent',
              variant === 'overview'
                ? 'text-3xl sm:text-4xl from-slate-900 via-violet-700 to-blue-700 dark:from-slate-100 dark:via-violet-300 dark:to-blue-300'
                : 'text-2xl from-slate-900 to-violet-700 dark:from-slate-100 dark:to-violet-300',
            )}
          >
            {typeof value === 'number' ? value.toLocaleString() : value}
          </div>
          {subtitle && (
            <p
              className={cn(
                'text-slate-500 dark:text-slate-400 mt-2 font-medium',
                variant === 'overview' ? 'text-sm' : 'text-xs',
              )}
            >
              {subtitle}
            </p>
          )}
        </div>
      </div>
    </div>
  </div>
);
