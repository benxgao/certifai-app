'use client';

import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export const ExamLoadingState: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-violet-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-violet-950/30 text-foreground pt-16">
      {/* Background decorative elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-200/20 dark:bg-violet-600/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-200/20 dark:bg-blue-600/10 rounded-full blur-3xl"></div>
      </div>

      {/* Centered Loading Spinner */}
      <div className="fixed inset-0 z-50 grid place-items-center">
        <div className="flex flex-col items-center space-y-6">
          {/* Loading Spinner with Icon */}
          <div className="relative w-20 h-20 flex items-center justify-center">
            {/* Outer Ring */}
            <div className="absolute inset-0 border-4 border-violet-200 dark:border-violet-800/40 rounded-full animate-pulse" />

            {/* Spinning Ring */}
            <div className="absolute inset-0 border-4 border-transparent border-t-violet-600 dark:border-t-violet-400 rounded-full animate-spin" />

            {/* Center Icon */}
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-violet-500 to-purple-600 dark:from-violet-400 dark:to-purple-500 flex items-center justify-center text-white text-lg font-bold shadow-lg animate-pulse">
              ✨
            </div>
          </div>

          {/* Loading Text */}
          <div className="text-center space-y-2">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Loading exam...</h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">Preparing your exam questions</p>
          </div>
        </div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-6 md:px-6 md:py-8">
        <div className="space-y-6">
          {Array.from({ length: 5 }).map((_, index) => (
            <Card
              key={`question-skeleton-${index}`}
              className="relative bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200/60 dark:border-slate-700/60 shadow-xl rounded-2xl overflow-hidden opacity-50"
            >
              {/* Individual card gradient orb */}
              <div className="absolute -top-2 -right-2 w-16 h-16 bg-violet-100/30 dark:bg-violet-600/10 rounded-full blur-xl"></div>

              <CardHeader className="relative z-10 bg-gradient-to-r from-slate-50/80 to-violet-50/40 dark:from-slate-800/60 dark:to-violet-950/30 border-b border-slate-100/60 dark:border-slate-700/50 p-6 backdrop-blur-sm">
                <Skeleton className="h-6 w-3/4 bg-slate-200/60 dark:bg-slate-700/60" />
              </CardHeader>
              <CardContent className="relative z-10 space-y-3 p-6">
                <Skeleton className="h-4 w-full bg-slate-200/60 dark:bg-slate-700/60" />
                <Skeleton className="h-4 w-full bg-slate-200/60 dark:bg-slate-700/60" />
                <Skeleton className="h-4 w-5/6 bg-slate-200/60 dark:bg-slate-700/60" />
                <Skeleton className="h-10 w-1/4 mt-4 bg-slate-200/60 dark:bg-slate-700/60" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
