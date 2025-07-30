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
          icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          ),
          iconBg: 'from-green-500 to-emerald-600 dark:from-green-400 dark:to-emerald-500',
          ringColor: 'border-t-green-600 dark:border-t-green-400',
          staticRingColor: 'border-green-200 dark:border-green-800/40',
        };
      case 'auth':
        return {
          icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          ),
          iconBg: 'from-blue-500 to-indigo-600 dark:from-blue-400 dark:to-indigo-500',
          ringColor: 'border-t-blue-600 dark:border-t-blue-400',
          staticRingColor: 'border-blue-200 dark:border-blue-800/40',
        };
      default:
        return {
          icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
              <circle cx="12" cy="12" r="3" fill="currentColor" className="animate-pulse" />
            </svg>
          ),
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
            <div className="relative mx-auto w-24 h-24 flex items-center justify-center">
              {/* Outer Ring with gradient */}
              <div
                className={`absolute inset-0 border-4 ${config.staticRingColor} rounded-full animate-pulse opacity-30`}
              />

              {/* Secondary spinning ring */}
              <div
                className={`absolute inset-1 border-2 border-transparent ${config.ringColor} rounded-full animate-spin`}
                style={{ animationDuration: '2s' }}
              />

              {/* Primary spinning ring */}
              <div
                className={`absolute inset-0 border-4 border-transparent ${config.ringColor} rounded-full animate-spin`}
                style={{ animationDuration: '1.5s', animationDirection: 'reverse' }}
              />

              {/* Center Icon Container with enhanced styling */}
              <div
                className={`relative w-12 h-12 rounded-full bg-gradient-to-r ${config.iconBg} flex items-center justify-center text-white shadow-xl transform-gpu will-change-transform animate-pulse backdrop-blur-sm`}
                style={{
                  boxShadow:
                    '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                  animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                }}
              >
                {/* Inner glow effect */}
                <div
                  className="absolute inset-0 rounded-full bg-white/20 animate-ping"
                  style={{ animationDuration: '2s' }}
                />

                {/* Icon */}
                <div className="relative z-10 transform transition-transform duration-300 hover:scale-110">
                  {config.icon}
                </div>
              </div>

              {/* Floating particles effect */}
              <div className="absolute inset-0 pointer-events-none">
                <div
                  className="absolute top-2 left-4 w-1 h-1 bg-violet-400/60 rounded-full animate-bounce"
                  style={{ animationDelay: '0s', animationDuration: '2s' }}
                />
                <div
                  className="absolute top-6 right-3 w-1 h-1 bg-purple-400/60 rounded-full animate-bounce"
                  style={{ animationDelay: '0.5s', animationDuration: '2.2s' }}
                />
                <div
                  className="absolute bottom-4 left-2 w-1 h-1 bg-blue-400/60 rounded-full animate-bounce"
                  style={{ animationDelay: '1s', animationDuration: '1.8s' }}
                />
                <div
                  className="absolute bottom-2 right-5 w-1 h-1 bg-indigo-400/60 rounded-full animate-bounce"
                  style={{ animationDelay: '1.5s', animationDuration: '2.5s' }}
                />
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
