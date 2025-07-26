'use client';

import React from 'react';

interface StatsCardProps {
  icon: React.ReactNode;
  title: string;
  value: number | string | React.ReactNode;
  subtitle?: string;
  className?: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  icon,
  title,
  value,
  subtitle,
  className = '',
}) => (
  <div
    className={`bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm p-6 rounded-lg border border-slate-200/60 dark:border-slate-700/60 shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300 group ${className}`}
  >
    <div className="space-y-4">
      <div className="flex items-center justify-center space-x-3">
        <div className="w-10 h-10 bg-gradient-to-r from-violet-50 to-blue-50 dark:from-violet-900/40 dark:to-blue-900/40 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
          {icon}
        </div>
        <p className="text-sm font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
          {title}
        </p>
      </div>
      <div className="text-center">
        <div className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-violet-700 dark:from-slate-100 dark:to-violet-300 bg-clip-text text-transparent">
          {typeof value === 'number' ? value.toLocaleString() : value}
        </div>
        {subtitle && (
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 font-medium">{subtitle}</p>
        )}
      </div>
    </div>
  </div>
);
