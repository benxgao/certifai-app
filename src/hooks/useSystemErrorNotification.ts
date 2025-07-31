'use client';

import { useState, useEffect } from 'react';
import { useUserProfileContext } from '@/src/context/UserProfileContext';

interface SystemErrorState {
  showNotification: boolean;
  errorType: 'server_error' | 'network_error' | null;
  lastErrorTime: number | null;
}

/**
 * Hook to monitor system-wide errors and manage error notification display
 * Specifically watches for profile API 500 errors and other critical system issues
 */
export function useSystemErrorNotification() {
  const { isError, error } = useUserProfileContext();

  const [errorState, setErrorState] = useState<SystemErrorState>({
    showNotification: false,
    errorType: null,
    lastErrorTime: null,
  });

  useEffect(() => {
    if (isError && error) {
      // Check if this is a 500 server error from the profile API
      const is500Error =
        error?.status === 500 ||
        error?.response?.status === 500 ||
        (typeof error === 'object' && error.message?.includes('500')) ||
        (typeof error === 'object' && error.message?.includes('Internal server error'));

      // Check if this is a network/connectivity error
      const isNetworkError =
        error?.name === 'NetworkError' ||
        error?.code === 'NETWORK_ERROR' ||
        (typeof error === 'object' && error.message?.includes('fetch'));

      const currentTime = Date.now();

      // Only show notification for server errors (500) or network errors
      // And prevent spam by checking if we recently showed an error
      if (
        (is500Error || isNetworkError) &&
        (!errorState.lastErrorTime || currentTime - errorState.lastErrorTime > 30000)
      ) {
        // 30 second cooldown

        setErrorState({
          showNotification: true,
          errorType: is500Error ? 'server_error' : 'network_error',
          lastErrorTime: currentTime,
        });
      }
    }
  }, [isError, error, errorState.lastErrorTime]);

  const dismissNotification = () => {
    setErrorState((prev) => ({
      ...prev,
      showNotification: false,
    }));
  };

  const getNotificationContent = () => {
    switch (errorState.errorType) {
      case 'server_error':
        return {
          message:
            "We're experiencing system issues that may affect your account access. Please try refreshing the page or check back in a few minutes.",
          ctaText: 'Contact Support',
          ctaLink: '/support',
          variant: 'warning' as const,
        };
      case 'network_error':
        return {
          message:
            'Unable to connect to our servers. Please check your internet connection and try again.',
          ctaText: 'Retry',
          ctaLink: window?.location?.href || '/',
          variant: 'warning' as const,
        };
      default:
        return {
          message:
            "We're experiencing technical difficulties. Please try again later or contact support if the issue persists.",
          ctaText: 'Contact Support',
          ctaLink: '/support',
          variant: 'warning' as const,
        };
    }
  };

  return {
    showSystemError: errorState.showNotification,
    dismissSystemError: dismissNotification,
    notificationContent: getNotificationContent(),
    errorType: errorState.errorType,
  };
}
