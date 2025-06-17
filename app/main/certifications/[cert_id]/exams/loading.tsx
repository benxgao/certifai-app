import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export default function ExamsLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 pt-16">
      <div className="max-w-6xl mx-auto px-4 py-6 md:px-6 md:py-8">
        {/* Breadcrumb Loading */}
        <div className="mb-8">
          <Skeleton className="h-4 w-72" />
        </div>

        {/* Page Header Loading */}
        <div className="mb-8 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-3">
              <Skeleton className="h-8 w-80" />
              <Skeleton className="h-4 w-96" />
            </div>
            <Skeleton className="h-10 w-36" />
          </div>
        </div>

        {/* Exam Cards Loading */}
        <div className="space-y-6">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-md transition-shadow duration-200"
            >
              {/* Card Header */}
              <div className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-700 dark:to-slate-800 p-6 border-b border-slate-200 dark:border-slate-700">
                <div className="flex items-start justify-between">
                  <div className="space-y-3 flex-1">
                    <div className="flex items-center space-x-3">
                      <Skeleton className="h-6 w-6 rounded" />
                      <Skeleton className="h-7 w-64" />
                    </div>
                    <div className="flex items-center space-x-4">
                      <Skeleton className="h-5 w-20 rounded-full" />
                      <Skeleton className="h-5 w-24 rounded-full" />
                    </div>
                  </div>
                  <Skeleton className="h-8 w-24 rounded-lg ml-4" />
                </div>
              </div>

              {/* Card Content */}
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  {/* Exam Stats */}
                  {Array.from({ length: 4 }).map((_, statIndex) => (
                    <div
                      key={statIndex}
                      className="text-center p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg"
                    >
                      <div className="flex items-center justify-center mb-2">
                        <Skeleton className="h-5 w-5 rounded" />
                      </div>
                      <Skeleton className="h-4 w-16 mx-auto mb-1" />
                      <Skeleton className="h-6 w-12 mx-auto" />
                    </div>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-700">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Skeleton className="h-12 flex-1 rounded-lg" />
                    <Skeleton className="h-12 w-32 rounded-lg" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State Skeleton (for when no exams) */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-12 text-center">
          <Skeleton className="h-16 w-16 rounded-full mx-auto mb-4" />
          <Skeleton className="h-6 w-48 mx-auto mb-2" />
          <Skeleton className="h-4 w-96 mx-auto mb-6" />
          <Skeleton className="h-10 w-36 mx-auto" />
        </div>

        {/* Floating Loading Indicator */}
        <div className="fixed bottom-8 right-8 bg-white dark:bg-slate-800 rounded-full shadow-lg border border-slate-200 dark:border-slate-700 p-4">
          <div className="flex items-center space-x-3">
            <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-violet-600"></div>
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Loading exams...
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
