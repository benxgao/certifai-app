import React, { useState, useEffect } from 'react';
import { performEmergencyRecovery } from '@/src/lib/auth-recovery';

interface PageLoaderProps {
  isLoading: boolean;
  text?: string;
  showSpinner?: boolean;
  fullScreen?: boolean;
  variant?: 'default' | 'redirect' | 'auth';
  showBrand?: boolean;
  enableEmergencyRecovery?: boolean;
  emergencyTimeout?: number; // in seconds
}

const PageLoader: React.FC<PageLoaderProps> = ({
  isLoading,
  text = 'Loading...',
  showSpinner = true,
  fullScreen = true,
  variant = 'default',
  showBrand = false,
  enableEmergencyRecovery = false,
  emergencyTimeout = 20, // 20 seconds default
}) => {
  const [showEmergencyOptions, setShowEmergencyOptions] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isRecovering, setIsRecovering] = useState(false);

  // Timer for emergency recovery
  useEffect(() => {
    if (!isLoading || !enableEmergencyRecovery) {
      setShowEmergencyOptions(false);
      setTimeElapsed(0);
      return;
    }

    const startTime = Date.now();

    const timer = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      setTimeElapsed(elapsed);

      if (elapsed >= emergencyTimeout) {
        setShowEmergencyOptions(true);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [isLoading, enableEmergencyRecovery, emergencyTimeout]);

  const handleEmergencyRecovery = async () => {
    setIsRecovering(true);
    try {
      await performEmergencyRecovery('User initiated recovery from loading timeout');
    } catch (error) {
      console.error('Emergency recovery failed:', error);
      // Fall back to page reload
      window.location.reload();
    }
  };

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

            {enableEmergencyRecovery && timeElapsed > 0 && (
              <p className="text-sm text-slate-500 dark:text-slate-400">{timeElapsed}s elapsed</p>
            )}
          </div>
        </div>

        {/* Emergency recovery options */}
        {showEmergencyOptions && !isRecovering && (
          <div className="w-full max-w-xs bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm rounded-xl border border-slate-200/60 dark:border-slate-700/60 p-6 shadow-xl animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center space-y-4">
              <div className="text-amber-500 text-2xl">⚠️</div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
                  Taking Too Long?
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">
                  This might be due to a cached session issue. Try refreshing your authentication.
                </p>
              </div>

              <div className="space-y-2">
                <button
                  onClick={handleEmergencyRecovery}
                  className="w-full bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-700 hover:to-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 text-sm"
                >
                  Refresh Authentication
                </button>

                <button
                  onClick={() => window.location.reload()}
                  className="w-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium py-2 px-4 rounded-lg transition-all duration-200 text-sm"
                >
                  Reload Page
                </button>
              </div>
            </div>
          </div>
        )}

        {isRecovering && (
          <div className="w-full max-w-xs bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm rounded-xl border border-slate-200/60 dark:border-slate-700/60 p-6 shadow-xl">
            <div className="text-center space-y-4">
              <div className="animate-spin text-2xl">🔄</div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Recovering...</h3>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  Clearing cached data and refreshing your session.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PageLoader;
