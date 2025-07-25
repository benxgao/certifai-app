import React from 'react';
import { Skeleton } from './skeleton';

interface CertificationCardSkeletonProps {
  /**
   * Number of skeleton cards to render
   */
  count?: number;
  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * Skeleton for certification cards - matches the certification page design
 */
export function CertificationCardSkeleton({
  count = 4,
  className,
}: CertificationCardSkeletonProps) {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 ${className || ''}`}>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-violet-300 dark:hover:border-violet-600 rounded-lg overflow-hidden"
        >
          {/* Header skeleton */}
          <div className="bg-white dark:bg-slate-800 p-6 h-40 relative">
            <div className="h-full w-full">
              <div className="flex flex-col justify-between h-full pr-8">
                <div className="min-h-[4rem] flex items-start">
                  <div className="space-y-3 w-full">
                    <Skeleton className="h-7 w-full" />
                    <Skeleton className="h-7 w-4/5" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-28" />
                </div>
              </div>
              {/* Absolutely positioned label skeleton */}
              <div className="absolute top-6 right-6">
                <Skeleton className="w-3 h-3 rounded-full" />
              </div>
            </div>
          </div>
          {/* Content skeleton */}
          <div className="p-6 space-y-6">
            {/* Status indicator skeleton */}
            <div className="flex items-center space-x-3">
              <Skeleton className="w-2 h-2 rounded-full" />
              <Skeleton className="h-4 w-20" />
            </div>
            {/* Button skeleton */}
            <Skeleton className="h-12 w-full rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  );
}

interface DashboardStatSkeletonProps {
  /**
   * Number of stat cards to render
   */
  count?: number;
  /**
   * Grid layout classes
   */
  gridCols?: string;
  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * Skeleton for dashboard stat cards - matches the dashboard stats design
 */
export function DashboardStatSkeleton({
  count = 5,
  gridCols = 'grid-cols-1 md:grid-cols-2 lg:grid-cols-5',
  className,
}: DashboardStatSkeletonProps) {
  return (
    <div className={`grid ${gridCols} gap-4 ${className || ''}`}>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={`stat-skeleton-${index}`}
          className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-slate-100 dark:border-slate-700/50 shadow-sm"
        >
          <div className="space-y-3">
            <div className="flex items-center justify-center space-x-2">
              <Skeleton className="w-4 h-4" />
              <Skeleton className="h-3 w-20" />
            </div>
            <Skeleton className="h-6 w-8 mx-auto" />
          </div>
        </div>
      ))}
    </div>
  );
}

interface UserCertificationCardSkeletonProps {
  /**
   * Number of certification cards to render
   */
  count?: number;
  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * Skeleton for user certification cards - matches the dashboard certification list design
 */
export function UserCertificationCardSkeleton({
  count = 3,
  className,
}: UserCertificationCardSkeletonProps) {
  return (
    <div className={`space-y-6 ${className || ''}`}>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={`user-cert-skeleton-${index}`}
          className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/50 shadow-sm rounded-lg overflow-hidden"
        >
          {/* Header skeleton */}
          <div className="bg-gradient-to-r from-slate-25 to-slate-50/50 dark:from-slate-700/50 dark:to-slate-600/30 border-b border-slate-100 dark:border-slate-700/50 p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1 space-y-3">
                <Skeleton className="h-6 w-3/4" />
              </div>
            </div>
          </div>

          {/* Content skeleton */}
          <div className="p-6">
            <div className="flex flex-col space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={`inner-skeleton-${i}`}
                    className="bg-slate-50 dark:bg-slate-800/80 rounded-lg px-5 py-4 border border-slate-100 dark:border-slate-700/50"
                  >
                    <div className="flex items-center space-x-4">
                      <Skeleton className="w-10 h-10 rounded-lg flex-shrink-0" />
                      <div className="flex-1 space-y-2 min-w-0">
                        <Skeleton className="h-4 w-16" />
                        <Skeleton className="h-5 w-12" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-end pt-2">
                <Skeleton className="h-12 w-48 rounded-lg" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

interface GenericCardSkeletonProps {
  /**
   * Number of cards to render
   */
  count?: number;
  /**
   * Grid layout classes
   */
  gridCols?: string;
  /**
   * Card height
   */
  height?: string;
  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * Generic skeleton for basic card layouts
 */
export function GenericCardSkeleton({
  count = 6,
  gridCols = 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
  height = 'h-48',
  className,
}: GenericCardSkeletonProps) {
  return (
    <div className={`grid ${gridCols} gap-6 ${className || ''}`}>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={`generic-skeleton-${index}`}
          className={`bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden ${height}`}
        >
          <div className="p-6 h-full flex flex-col space-y-4">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <div className="flex-1" />
            <Skeleton className="h-10 w-full rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  );
}

interface ListItemSkeletonProps {
  /**
   * Number of list items to render
   */
  count?: number;
  /**
   * Show avatar placeholder
   */
  showAvatar?: boolean;
  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * Skeleton for list items
 */
export function ListItemSkeleton({
  count = 5,
  showAvatar = true,
  className,
}: ListItemSkeletonProps) {
  return (
    <div className={`space-y-3 ${className || ''}`}>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={`list-skeleton-${index}`}
          className="flex items-center space-x-3 p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg"
        >
          {showAvatar && <Skeleton className="w-10 h-10 rounded-full" />}
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
          <Skeleton className="h-8 w-20 rounded" />
        </div>
      ))}
    </div>
  );
}

interface ExamCardSkeletonProps {
  /**
   * Number of exam cards to render
   */
  count?: number;
  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * Skeleton for exam cards - matches the exam page design
 */
export function ExamCardSkeleton({ count = 3, className }: ExamCardSkeletonProps) {
  return (
    <div className={`space-y-6 ${className || ''}`}>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={`exam-skeleton-${index}`}
          className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/50 shadow-sm rounded-lg overflow-hidden"
        >
          <div className="bg-gradient-to-r from-slate-25 to-slate-50/50 dark:from-slate-700/50 dark:to-slate-600/30 border-b border-slate-100 dark:border-slate-700/50 p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-3">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-4 w-48" />
              </div>
              <Skeleton className="h-8 w-24 rounded-lg" />
            </div>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="space-y-2">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-6 w-20" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-6 w-24" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-12" />
                <Skeleton className="h-6 w-16" />
              </div>
            </div>
            <Skeleton className="h-12 w-full rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  );
}
