'use client';

import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

interface DashboardLoadingProps {
  showWelcome?: boolean;
  showStats?: boolean;
  showCertifications?: boolean;
}

export const DashboardLoading: React.FC<DashboardLoadingProps> = ({
  showWelcome = true,
  showStats = true,
  showCertifications = true,
}) => {
  return (
    <div className="space-y-6">
      {/* Welcome Section Skeleton */}
      {showWelcome && (
        <div className="bg-gradient-to-r from-violet-50 to-violet-50 dark:from-primary-900/20 dark:to-violet-900/20 border border-violet-100 dark:border-violet-800/50 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-3">
              <Skeleton className="h-7 w-64" />
              <Skeleton className="h-4 w-96" />
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <div className="text-center">
                <Skeleton className="h-6 w-12 mx-auto mb-1" />
                <Skeleton className="h-3 w-12" />
              </div>
              <div className="text-center">
                <Skeleton className="h-6 w-12 mx-auto mb-1" />
                <Skeleton className="h-3 w-12" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Dashboard Header Skeleton */}
      <div className="bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-lg rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700/50 bg-gradient-to-r from-slate-25 to-slate-50/50 dark:from-slate-800 dark:to-slate-700/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Skeleton className="h-7 w-28" />
            </div>
            <Skeleton className="h-10 w-48" />
          </div>
        </div>

        {/* Stats Section Skeleton */}
        {showStats && (
          <div className="px-6 py-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-100 dark:border-slate-700/50 shadow-sm"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-center space-x-2">
                      <Skeleton className="w-4 h-4 rounded" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                    <Skeleton className="h-6 w-8 mx-auto" />
                    <Skeleton className="h-2 w-16 mx-auto" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Certifications Section Skeleton */}
      {showCertifications && (
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-64" />
            <Skeleton className="h-10 w-32" />
          </div>

          <div className="space-y-6">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={`certification-skeleton-${index}`}
                className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/50 shadow-sm rounded-xl overflow-hidden"
              >
                {/* Header skeleton */}
                <div className="bg-gradient-to-r from-slate-25 to-slate-50/50 dark:from-slate-800 dark:to-slate-700/30 border-b border-slate-100 dark:border-slate-700/50 p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-3">
                      <Skeleton className="h-5 w-32" />
                      <Skeleton className="h-7 w-3/4" />
                    </div>
                    <Skeleton className="h-8 w-24" />
                  </div>
                </div>

                {/* Content skeleton */}
                <div className="p-6 pt-4">
                  <div className="flex flex-col space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {Array.from({ length: 3 }).map((_, i) => (
                        <div
                          key={i}
                          className="bg-slate-50 dark:bg-slate-800/80 rounded-lg p-4 border border-slate-100 dark:border-slate-700/50"
                        >
                          <div className="flex items-center space-x-3">
                            <Skeleton className="w-8 h-8 rounded-lg" />
                            <div className="flex-1 space-y-2">
                              <Skeleton className="h-3 w-24" />
                              <Skeleton className="h-5 w-16" />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-center mt-2">
                      <Skeleton className="h-12 w-64 rounded-xl" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default DashboardLoading;
