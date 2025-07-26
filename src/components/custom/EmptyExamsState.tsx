'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { FaClipboardList } from 'react-icons/fa';

export function EmptyExamsState() {
  return (
    <div className="text-center py-16 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
      <div className="space-y-4">
        <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto">
          <FaClipboardList className="w-8 h-8 text-slate-400 dark:text-slate-500" />
        </div>
        <h3 className="text-xl font-medium text-slate-900 dark:text-slate-100">
          No Exams Available
        </h3>
        <p className="text-base text-slate-600 dark:text-slate-400 max-w-md mx-auto">
          No exams are currently available for this certification. Please check back later or
          contact support.
        </p>
        <Button onClick={() => window.location.reload()} variant="outline" className="mt-4">
          Refresh Page
        </Button>
      </div>
    </div>
  );
}
