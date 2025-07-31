'use client';

import React from 'react';
import EnhancedNotificationBar from '@/src/components/custom/NotificationBar';
import { useSystemErrorNotification } from '@/src/hooks/useSystemErrorNotification';

/**
 * Global System Error Notification Bar
 * Displays system-wide error notifications (like 500 errors from profile API)
 * Should be included at the app level to show critical system issues
 */
export default function SystemErrorNotificationBar() {
  const { showSystemError, dismissSystemError, notificationContent, errorType } =
    useSystemErrorNotification();

  if (!showSystemError) {
    return null;
  }

  const handleCtaClick = () => {
    if (errorType === 'network_error') {
      // For network errors, refresh the page
      window.location.reload();
    }
    // For server errors, the CTA link will handle navigation to support
  };

  return (
    <EnhancedNotificationBar
      message={notificationContent.message}
      variant={notificationContent.variant}
      ctaText={notificationContent.ctaText}
      ctaLink={notificationContent.ctaLink}
      dismissible={true}
      onDismiss={dismissSystemError}
      showIcon={true}
      enhanced={true}
      className="border-amber-300 dark:border-amber-600" // Extra emphasis for system errors
    />
  );
}
