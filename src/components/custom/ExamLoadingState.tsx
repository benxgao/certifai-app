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

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-6 md:px-6 md:py-8">
        <div className="space-y-6">
          {Array.from({ length: 5 }).map((_, index) => (
            <Card
              key={`question-skeleton-${index}`}
              className="relative bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200/60 dark:border-slate-700/60 shadow-xl rounded-2xl overflow-hidden"
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
