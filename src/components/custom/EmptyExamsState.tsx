'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { FaClipboardList } from 'react-icons/fa';

export function EmptyExamsState() {
  return (
    <div className="relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-6 left-6 w-20 h-20 bg-gradient-to-br from-violet-400/20 to-purple-500/20 rounded-full blur-xl"></div>
        <div className="absolute bottom-6 right-6 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-violet-500/20 rounded-full blur-xl"></div>
      </div>

      <div className="relative text-center py-20 space-y-8">
        {/* Enhanced Icon Container */}
        <div className="w-20 h-20 bg-gradient-to-br from-violet-100 to-blue-100 dark:from-violet-900/50 dark:to-blue-900/50 rounded-full flex items-center justify-center mx-auto shadow-lg backdrop-blur-sm border border-white/50 dark:border-slate-700/50">
          <FaClipboardList className="w-10 h-10 text-violet-600 dark:text-violet-400" />
        </div>

        {/* Enhanced Content */}
        <div className="space-y-4">
          <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            No Exams Available
          </h3>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-lg mx-auto leading-relaxed">
            No exams are currently available for this certification. Please check back later or
            contact support for assistance.
          </p>
        </div>

        {/* Enhanced Action Button */}
        <Button
          onClick={() => window.location.reload()}
          className="bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-700 hover:to-blue-700 text-white shadow-lg shadow-violet-500/25 dark:shadow-violet-500/20 transition-all duration-200 px-6 py-3 text-base font-medium"
        >
          Refresh Page
        </Button>
      </div>
    </div>
  );
}
