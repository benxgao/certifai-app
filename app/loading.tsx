import React from 'react';

export default function RootLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-violet-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-violet-950/20 flex items-center justify-center relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-4 -left-4 w-72 h-72 bg-violet-200/20 dark:bg-violet-800/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-8 -right-8 w-96 h-96 bg-blue-200/20 dark:bg-blue-800/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-purple-200/10 dark:bg-purple-800/5 rounded-full blur-3xl"></div>
      </div>

      {/* Main loading content */}
      <div className="relative z-10 text-center space-y-8 px-4">
        {/* Logo/Brand area */}
        <div className="space-y-4">
          <div className="relative mx-auto w-16 h-16 mb-6">
            {/* Outer ring */}
            <div className="absolute inset-0 rounded-full border-4 border-violet-200 dark:border-violet-800/40"></div>
            {/* Spinning ring */}
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-violet-600 dark:border-t-violet-400 animate-spin"></div>
            {/* Inner dot */}
            <div className="absolute inset-3 rounded-full bg-gradient-to-r from-violet-500 to-purple-600 dark:from-violet-400 dark:to-purple-500 animate-pulse"></div>
          </div>

          {/* Brand name with gradient */}
          <h1 className="text-2xl font-bold bg-gradient-to-r from-violet-600 via-purple-600 to-violet-800 dark:from-violet-400 dark:via-purple-400 dark:to-violet-200 bg-clip-text text-transparent">
            Certestic
          </h1>
        </div>

        {/* Loading message */}
        <div className="space-y-3">
          <p className="text-slate-600 dark:text-slate-300 font-medium">
            Preparing your experience...
          </p>

          {/* Animated dots */}
          <div className="flex items-center justify-center space-x-2">
            <div className="w-2 h-2 bg-violet-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
            <div className="w-2 h-2 bg-violet-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
            <div className="w-2 h-2 bg-violet-500 rounded-full animate-bounce"></div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-64 mx-auto">
          <div className="h-1 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-violet-500 to-purple-600 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
