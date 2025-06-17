import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export default function RootLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header Skeleton */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-2">
              <Skeleton className="h-8 w-8 rounded-lg" />
              <Skeleton className="h-6 w-20" />
            </div>
            <div className="hidden md:flex items-center space-x-6">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-8 w-24 rounded-lg" />
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 flex items-center justify-center pt-20">
        <div className="text-center space-y-8 p-8">
          {/* Hero Section Skeleton */}
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-lg rounded-xl p-8 max-w-2xl">
            <div className="space-y-6">
              <Skeleton className="h-12 w-96 mx-auto" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4 mx-auto" />
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Skeleton className="h-12 w-32 rounded-lg" />
                <Skeleton className="h-12 w-24 rounded-lg" />
              </div>
            </div>
          </div>

          {/* Loading Spinner */}
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-primary"></div>
          </div>

          {/* Loading Text */}
          <p className="text-sm text-slate-600 dark:text-slate-400">Loading CertifAI...</p>
        </div>
      </div>
    </div>
  );
}
