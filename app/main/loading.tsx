import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export default function MainLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 pt-16">
      <div className="max-w-4xl mx-auto px-4 py-6 md:px-6 md:py-8">
        {/* Breadcrumb Loading */}
        <div className="mb-8">
          <Skeleton className="h-4 w-24" />
        </div>

        {/* Dashboard Header Loading */}
        <div className="mb-8 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-lg rounded-xl overflow-hidden">
          {/* Header */}
          <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700/50 bg-gradient-to-r from-slate-25 to-slate-50/50 dark:from-slate-800 dark:to-slate-700/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Skeleton className="h-8 w-48" />
              </div>
              <div className="flex-shrink-0">
                <Skeleton className="h-10 w-48" />
              </div>
            </div>
          </div>

          {/* Dashboard Stats Loading */}
          <div className="px-6 py-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
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
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Your Registered Certifications Section Loading */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-64" />
            <Skeleton className="h-10 w-32" />
          </div>

          {/* Certification Cards Loading */}
          <div className="space-y-6">
            {Array.from({ length: 2 }).map((_, index) => (
              <div
                key={`skeleton-${index}`}
                className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/50 shadow-sm rounded-xl overflow-hidden"
              >
                {/* Header skeleton */}
                <div className="bg-gradient-to-r from-slate-25 to-slate-50/50 dark:from-slate-800 dark:to-slate-700/30 border-b border-slate-100 dark:border-slate-700/50 p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-3">
                      <Skeleton className="h-6 w-32" />
                      <Skeleton className="h-7 w-3/4" />
                    </div>
                    <Skeleton className="h-8 w-24 rounded-lg" />
                  </div>
                </div>

                {/* Content skeleton */}
                <div className="p-6 pt-4">
                  <div className="flex flex-col space-y-5">
                    {/* Three-column metrics skeleton */}
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

                    {/* Action button skeleton */}
                    <div className="flex justify-center mt-2">
                      <Skeleton className="h-12 w-64 rounded-xl" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
