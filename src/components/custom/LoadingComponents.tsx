import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

interface LoadingSpinnerProps {
  text?: string;
  size?: 'small' | 'medium' | 'large';
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ text = 'Loading...' }) => {
  return (
    <div className="flex items-center justify-center min-h-[200px]">
      <div className="text-center space-y-4 loading-fade-in">
        <div className="loading-spinner rounded-full h-12 w-12 border-4 border-violet-500 border-t-transparent mx-auto"></div>
        <p className="text-lg text-gray-600 dark:text-gray-400">{text}</p>
      </div>
    </div>
  );
};

interface PageSkeletonProps {
  title?: string;
  showBreadcrumb?: boolean;
  cardCount?: number;
  showHeader?: boolean;
}

export const PageSkeleton: React.FC<PageSkeletonProps> = ({
  title = 'Loading page...',
  showBreadcrumb = true,
  cardCount = 3,
  showHeader = true,
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 pt-16">
      <div className="max-w-6xl mx-auto px-4 py-6 md:px-6 md:py-8">
        {/* Breadcrumb Loading */}
        {showBreadcrumb && (
          <div className="mb-8">
            <Skeleton className="h-4 w-48" />
          </div>
        )}

        {/* Page Header Loading */}
        {showHeader && (
          <div className="mb-8 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-3">
                <Skeleton className="h-8 w-64" />
                <Skeleton className="h-4 w-96" />
              </div>
              <Skeleton className="h-10 w-32" />
            </div>
          </div>
        )}

        {/* Content Cards Loading */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: cardCount }).map((_, index) => (
            <div
              key={index}
              className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden"
            >
              {/* Card Header */}
              <div className="p-6 border-b border-slate-100 dark:border-slate-700">
                <div className="flex items-start justify-between">
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                  <Skeleton className="h-8 w-8 rounded-full ml-3" />
                </div>
              </div>

              {/* Card Content */}
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-16" />
                </div>
                <div className="flex items-center justify-between">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-12" />
                </div>
                <Skeleton className="h-10 w-full mt-4" />
              </div>
            </div>
          ))}
        </div>

        {/* Loading spinner overlay */}
        <div className="fixed inset-0 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-40">
          <div className="text-center space-y-4 loading-fade-in">
            <div className="loading-spinner rounded-full h-12 w-12 border-4 border-violet-500 border-t-transparent mx-auto"></div>
            <p className="text-lg text-gray-600 dark:text-gray-400">{title}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export const CardSkeleton: React.FC = () => (
  <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
    {/* Card Header */}
    <div className="p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0">
          <Skeleton className="h-6 w-4/5 mb-3" />
        </div>
        <Skeleton className="h-6 w-16 rounded-full ml-3" />
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-2 gap-3">
        <div className="flex items-center space-x-2">
          <Skeleton className="h-3 w-3 rounded" />
          <Skeleton className="h-4 w-20" />
        </div>
        <div className="flex items-center space-x-2">
          <Skeleton className="h-3 w-3 rounded" />
          <Skeleton className="h-4 w-16" />
        </div>
        <div className="flex items-center space-x-2">
          <Skeleton className="h-3 w-3 rounded" />
          <Skeleton className="h-4 w-18" />
        </div>
        <div className="flex items-center space-x-2">
          <Skeleton className="h-3 w-3 rounded" />
          <Skeleton className="h-4 w-20" />
        </div>
      </div>
    </div>

    {/* Card Content */}
    <div className="p-6 pt-4">
      <Skeleton className="h-10 w-full" />
    </div>
  </div>
);

const LoadingComponents = { LoadingSpinner, PageSkeleton, CardSkeleton };

export default LoadingComponents;
