import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export default function CertificationsLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 pt-16">
      <div className="max-w-6xl mx-auto px-4 py-6 md:px-6 md:py-8">
        {/* Breadcrumb Loading */}
        <div className="mb-8">
          <Skeleton className="h-4 w-48" />
        </div>

        {/* Page Header Loading */}
        <div className="mb-8 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-3">
              <Skeleton className="h-8 w-64" />
              <Skeleton className="h-4 w-96" />
            </div>
            <Skeleton className="h-10 w-48" />
          </div>
        </div>

        {/* Certifications Grid Loading */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-md transition-shadow duration-200"
            >
              {/* Card Header */}
              <div className="p-6 border-b border-slate-100 dark:border-slate-700">
                <div className="flex items-start justify-between">
                  <div className="space-y-3 flex-1">
                    <div className="flex items-center space-x-2">
                      <Skeleton className="h-5 w-5 rounded" />
                      <Skeleton className="h-6 w-3/4" />
                    </div>
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                  <Skeleton className="h-8 w-20 rounded-full ml-3" />
                </div>
              </div>

              {/* Card Content */}
              <div className="p-6 space-y-4">
                {/* Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                    <Skeleton className="h-4 w-16 mx-auto mb-1" />
                    <Skeleton className="h-6 w-8 mx-auto" />
                  </div>
                  <div className="text-center p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                    <Skeleton className="h-4 w-20 mx-auto mb-1" />
                    <Skeleton className="h-6 w-12 mx-auto" />
                  </div>
                </div>

                {/* Action Button */}
                <Skeleton className="h-10 w-full rounded-lg" />
              </div>
            </div>
          ))}
        </div>

        {/* Floating Loading Indicator */}
        <div className="fixed bottom-8 right-8 bg-white dark:bg-slate-800 rounded-full shadow-lg border border-slate-200 dark:border-slate-700 p-4">
          <div className="flex items-center space-x-3">
            <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-purple-600"></div>
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Loading certifications...
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
