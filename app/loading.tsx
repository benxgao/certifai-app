import React from 'react';

export default function RootLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-violet-600 border-t-transparent mx-auto"></div>
        <p className="text-sm text-slate-600 dark:text-slate-400">Loading Certestic...</p>
      </div>
    </div>
  );
}
