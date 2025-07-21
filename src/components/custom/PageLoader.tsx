import React from 'react';

interface PageLoaderProps {
  isLoading: boolean;
  text?: string;
  showSpinner?: boolean;
  fullScreen?: boolean;
  variant?: 'default' | 'redirect' | 'auth';
  showBrand?: boolean;
}

const PageLoader: React.FC<PageLoaderProps> = ({
  isLoading,
  text = 'Loading...',
  showSpinner = true,
  fullScreen = true,
  variant = 'default',
  showBrand = false,
}) => {
  if (!isLoading) {
    return null;
  }

  const containerClasses = fullScreen
    ? 'fixed inset-0 z-50 grid place-items-center bg-gradient-to-br from-slate-50 via-white to-violet-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-violet-950/20 relative overflow-hidden min-h-screen min-h-dvh'
    : 'grid place-items-center h-screen min-h-screen min-h-dvh w-full bg-gradient-to-br from-slate-50/50 via-white/50 to-violet-50/20 dark:from-slate-950/50 dark:via-slate-900/50 dark:to-violet-950/10 relative overflow-hidden';

  // Get appropriate icon and styling based on variant
  const getVariantConfig = () => {
    switch (variant) {
      case 'redirect':
        return {
          icon: '↗',
          iconBg: 'from-green-500 to-emerald-600 dark:from-green-400 dark:to-emerald-500',
          ringColor: 'border-t-green-600 dark:border-t-green-400',
          staticRingColor: 'border-green-200 dark:border-green-800/40',
        };
      case 'auth':
        return {
          icon: '🔐',
          iconBg: 'from-blue-500 to-indigo-600 dark:from-blue-400 dark:to-indigo-500',
          ringColor: 'border-t-blue-600 dark:border-t-blue-400',
          staticRingColor: 'border-blue-200 dark:border-blue-800/40',
        };
      default:
        return {
          icon: '✨',
          iconBg: 'from-violet-500 to-purple-600 dark:from-violet-400 dark:to-purple-500',
          ringColor: 'border-t-violet-600 dark:border-t-violet-400',
          staticRingColor: 'border-violet-200 dark:border-violet-800/40',
        };
    }
  };

  const config = getVariantConfig();

  return (
    <div className={containerClasses}>
      {/* Background decoration */}
      {fullScreen && (
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-4 -left-4 w-72 h-72 bg-violet-200/20 dark:bg-violet-800/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-8 -right-8 w-96 h-96 bg-blue-200/20 dark:bg-blue-800/10 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-purple-200/10 dark:bg-purple-800/5 rounded-full blur-3xl"></div>
        </div>
      )}

      <div className="flex flex-col items-center space-y-8 z-10 px-6 max-w-sm mx-auto">
        {/* Main loading content */}
        <div className="text-center space-y-6">
          {/* Brand name - only show if requested */}
          {showBrand && (
            <h1 className="text-2xl font-bold bg-gradient-to-r from-violet-600 via-purple-600 to-violet-800 dark:from-violet-400 dark:via-purple-400 dark:to-violet-200 bg-clip-text text-transparent mb-4">
              Certestic
            </h1>
          )}

          {/* Spinner/Icon area */}
          {showSpinner && (
            <div className="relative mx-auto w-20 h-20 flex items-center justify-center">
              {/* Outer Ring */}
              <div
                className={`absolute inset-0 border-4 ${config.staticRingColor} rounded-full animate-pulse`}
              />

              {/* Spinning Ring */}
              <div
                className={`absolute inset-0 border-4 border-transparent ${config.ringColor} rounded-full animate-spin`}
              />

              {/* Center Icon */}
              <div
                className={`w-10 h-10 rounded-full bg-gradient-to-r ${config.iconBg} flex items-center justify-center text-white text-lg font-bold shadow-lg transform-gpu will-change-transform animate-pulse`}
              >
                {config.icon}
              </div>
            </div>
          )}

          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">{text}</h2>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageLoader;
