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
      {/* Background decorative elements - only for fullScreen */}
      {fullScreen && (
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-4 -left-4 w-72 h-72 bg-violet-200/20 dark:bg-violet-800/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-8 -right-8 w-96 h-96 bg-blue-200/20 dark:bg-blue-800/10 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-purple-200/10 dark:bg-purple-800/5 rounded-full blur-3xl"></div>
        </div>
      )}

      {/* Main loading content */}
      <div className="relative z-10 text-center space-y-6 px-4">
        {/* Brand name - only show if requested */}
        {showBrand && (
          <h1 className="text-2xl font-bold bg-gradient-to-r from-violet-600 via-purple-600 to-violet-800 dark:from-violet-400 dark:via-purple-400 dark:to-violet-200 bg-clip-text text-transparent mb-4">
            Certestic
          </h1>
        )}

        {/* Spinner/Icon area */}
        {showSpinner && (
          <div className="space-y-4">
            <div className="relative mx-auto w-14 h-14">
              {/* Outer ring */}
              <div
                className={`absolute inset-0 rounded-full border-3 ${config.staticRingColor}`}
              ></div>
              {/* Spinning ring */}
              <div
                className={`absolute inset-0 rounded-full border-3 border-transparent ${config.ringColor} animate-spin`}
              ></div>
              {/* Inner content */}
              <div
                className={`absolute inset-2 rounded-full bg-gradient-to-r ${config.iconBg} animate-pulse flex items-center justify-center`}
              >
                <span className="text-white text-lg">{config.icon}</span>
              </div>
            </div>
          </div>
        )}

        {/* Loading message */}
        {text && (
          <div className="space-y-3">
            <p className="text-slate-600 dark:text-slate-300 font-medium text-lg">{text}</p>

            {/* Animated dots */}
            <div className="flex items-center justify-center space-x-2">
              <div className="w-2 h-2 bg-violet-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
              <div className="w-2 h-2 bg-violet-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
              <div className="w-2 h-2 bg-violet-500 rounded-full animate-bounce"></div>
            </div>
          </div>
        )}

        {/* Progress indication for fullScreen */}
        {fullScreen && (
          <div className="w-64 mx-auto">
            <div className="h-1 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-violet-500 to-purple-600 rounded-full animate-pulse"></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PageLoader;
