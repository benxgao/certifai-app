import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export default function RootLoading() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100 text-gray-900">
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center space-y-6 p-8">
          {/* App Logo/Title Skeleton */}
          <div className="space-y-2">
            <Skeleton className="h-8 w-48 mx-auto" />
            <Skeleton className="h-4 w-64 mx-auto" />
          </div>

          {/* Loading Spinner */}
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-purple-600"></div>
          </div>

          {/* Loading Text */}
          <Skeleton className="h-4 w-32 mx-auto" />
        </div>
      </div>

      {/* Footer Skeleton */}
      <footer className="mt-auto py-8 px-6 lg:px-20 bg-gray-800">
        <div className="mb-4 flex justify-center space-x-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-4 w-16 bg-gray-600" />
          ))}
        </div>
        <div className="text-center">
          <Skeleton className="h-4 w-48 mx-auto bg-gray-600" />
        </div>
      </footer>
    </div>
  );
}
