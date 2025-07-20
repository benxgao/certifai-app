'use client';

import React from 'react';
import Link from 'next/link';
import { X } from 'lucide-react';
import { cn } from '@/src/lib/utils';

interface NotificationBarProps {
  /** The main message to display */
  message: string;
  /** Optional call-to-action text */
  ctaText?: string;
  /** Optional CTA link */
  ctaLink?: string;
  /** Color variant for the notification bar */
  variant?: 'info' | 'success' | 'warning' | 'promo';
  /** Whether the notification can be dismissed */
  dismissible?: boolean;
  /** Callback when notification is dismissed */
  onDismiss?: () => void;
  /** Additional CSS classes */
  className?: string;
  /** Whether to show the notification */
  show?: boolean;
}

const NotificationBar: React.FC<NotificationBarProps> = ({
  message,
  ctaText,
  ctaLink,
  variant = 'info',
  dismissible = false,
  onDismiss,
  className,
  show = true,
}) => {
  if (!show) return null;

  const variantStyles = {
    info: 'bg-blue-50 dark:bg-blue-950/50 text-blue-900 dark:text-blue-100 border-blue-200 dark:border-blue-800/50',
    success:
      'bg-green-50 dark:bg-green-950/50 text-green-900 dark:text-green-100 border-green-200 dark:border-green-800/50',
    warning:
      'bg-amber-50 dark:bg-amber-950/50 text-amber-900 dark:text-amber-100 border-amber-200 dark:border-amber-800/50',
    promo:
      'bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-950/50 dark:to-purple-950/50 text-violet-900 dark:text-violet-100 border-violet-200 dark:border-violet-800/50',
  };

  const ctaStyles = {
    info: 'text-blue-700 dark:text-blue-300 hover:text-blue-800 dark:hover:text-blue-200',
    success: 'text-green-700 dark:text-green-300 hover:text-green-800 dark:hover:text-green-200',
    warning: 'text-amber-700 dark:text-amber-300 hover:text-amber-800 dark:hover:text-amber-200',
    promo: 'text-violet-700 dark:text-violet-300 hover:text-violet-800 dark:hover:text-violet-200',
  };

  return (
    <div
      className={cn(
        'relative border-b backdrop-blur-sm transition-all duration-300',
        variantStyles[variant],
        className,
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-3">
          <div className="flex items-center space-x-4 flex-1">
            <div className="text-sm font-medium">{message}</div>
            {ctaText && ctaLink && (
              <Link
                href={ctaLink}
                className={cn(
                  'text-sm font-semibold underline decoration-2 underline-offset-2 transition-colors duration-200',
                  ctaStyles[variant],
                )}
              >
                {ctaText}
              </Link>
            )}
          </div>

          {dismissible && onDismiss && (
            <button
              onClick={onDismiss}
              className={cn(
                'ml-4 p-1 rounded-md transition-colors duration-200 hover:bg-black/5 dark:hover:bg-white/5',
                'text-current opacity-70 hover:opacity-100',
              )}
              aria-label="Dismiss notification"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationBar;
