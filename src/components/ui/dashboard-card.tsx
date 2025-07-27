'use client';

import React from 'react';
import { cn } from '@/src/lib/utils';

interface DashboardCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'compact';
}

interface DashboardCardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

interface DashboardCardContentProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Reusable dashboard card component with glass-morphism design
 * Extracted from the main dashboard page for consistent styling
 */
function DashboardCard({ children, className, variant = 'default' }: DashboardCardProps) {
  return (
    <div
      className={cn(
        'relative bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200/60 dark:border-slate-700/60 shadow-2xl rounded-xl overflow-hidden',
        variant === 'compact' && 'shadow-lg',
        className,
      )}
    >
      {/* Decorative gradient orbs */}
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-violet-200/20 dark:bg-violet-600/10 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-10 -left-10 w-56 h-56 bg-blue-200/20 dark:bg-blue-600/10 rounded-full blur-3xl"></div>

      <div className="relative z-10">{children}</div>
    </div>
  );
}

/**
 * Dashboard card header with consistent gradient background and spacing
 */
function DashboardCardHeader({ children, className }: DashboardCardHeaderProps) {
  return (
    <div
      className={cn(
        'px-6 sm:px-8 py-6 border-b border-slate-100 dark:border-slate-700/50 bg-gradient-to-r from-slate-50/60 to-violet-50/30 dark:from-slate-800/40 dark:to-violet-950/20',
        className,
      )}
    >
      {children}
    </div>
  );
}

/**
 * Dashboard card content area with consistent padding
 */
function DashboardCardContent({ children, className }: DashboardCardContentProps) {
  return <div className={cn('p-6 sm:p-8', className)}>{children}</div>;
}

export { DashboardCard, DashboardCardHeader, DashboardCardContent };
