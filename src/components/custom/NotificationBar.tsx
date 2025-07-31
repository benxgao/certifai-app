'use client';

import React from 'react';
import Link from 'next/link';
import { X, Info, CheckCircle, AlertTriangle, Megaphone, Sparkles } from 'lucide-react';
import { cn } from '@/src/lib/utils';

interface EnhancedNotificationBarProps {
  /** The main message to display */
  message: string;
  /** Optional call-to-action text */
  ctaText?: string;
  /** Optional CTA link */
  ctaLink?: string;
  /** Color variant for the notification bar */
  variant?: 'info' | 'success' | 'warning' | 'promo' | 'announcement' | 'beta';
  /** Whether the notification can be dismissed */
  dismissible?: boolean;
  /** Callback when notification is dismissed */
  onDismiss?: () => void;
  /** Additional CSS classes */
  className?: string;
  /** Whether to show the notification */
  show?: boolean;
  /** Whether to show the variant icon */
  showIcon?: boolean;
  /** Custom icon to override the default variant icon */
  customIcon?: React.ReactNode;
  /** Whether to enable enhanced glass-morphism styling - defaults to true */
  enhanced?: boolean;
}

/**
 * Enhanced NotificationBar with glass-morphism styling and improved visual hierarchy
 * Consolidated component that combines basic and enhanced notification bar functionality
 * Uses enhanced styling by default for modern UI experience
 */
const EnhancedNotificationBar: React.FC<EnhancedNotificationBarProps> = ({
  message,
  ctaText,
  ctaLink,
  variant = 'info',
  dismissible = false,
  onDismiss,
  className,
  show = true,
  showIcon = true,
  customIcon,
  enhanced = true, // Default to enhanced styling
}) => {
  if (!show) return null;

  // Get variant-specific configurations
  const getVariantConfig = () => {
    switch (variant) {
      case 'success':
        return {
          icon: CheckCircle,
          bgGradient: enhanced
            ? 'bg-gradient-to-r from-emerald-50/95 via-green-50/90 to-emerald-50/95 dark:from-emerald-950/30 dark:via-green-950/25 dark:to-emerald-950/30'
            : 'bg-green-50 dark:bg-green-950/50',
          borderColor: 'border-emerald-200/60 dark:border-emerald-700/60',
          textColor: 'text-emerald-900 dark:text-emerald-100',
          iconColor: 'text-emerald-600 dark:text-emerald-400',
          ctaColor:
            'text-emerald-700 dark:text-emerald-300 hover:text-emerald-800 dark:hover:text-emerald-200',
        };
      case 'warning':
        return {
          icon: AlertTriangle,
          bgGradient: enhanced
            ? 'bg-gradient-to-r from-amber-50/95 via-yellow-50/90 to-amber-50/95 dark:from-amber-950/30 dark:via-yellow-950/25 dark:to-amber-950/30'
            : 'bg-amber-50 dark:bg-amber-950/50',
          borderColor: 'border-amber-200/60 dark:border-amber-700/60',
          textColor: 'text-amber-900 dark:text-amber-100',
          iconColor: 'text-amber-600 dark:text-amber-400',
          ctaColor:
            'text-amber-700 dark:text-amber-300 hover:text-amber-800 dark:hover:text-amber-200',
        };
      case 'promo':
        return {
          icon: Sparkles,
          bgGradient: enhanced
            ? 'bg-gradient-to-r from-violet-50/95 via-purple-50/90 to-violet-50/95 dark:from-violet-950/30 dark:via-purple-950/25 dark:to-violet-950/30'
            : 'bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-950/50 dark:to-purple-950/50',
          borderColor: 'border-violet-200/60 dark:border-violet-700/60',
          textColor: 'text-violet-900 dark:text-violet-100',
          iconColor: 'text-violet-600 dark:text-violet-400',
          ctaColor:
            'text-violet-700 dark:text-violet-300 hover:text-violet-800 dark:hover:text-violet-200',
        };
      case 'announcement':
        return {
          icon: Megaphone,
          bgGradient: enhanced
            ? 'bg-gradient-to-r from-blue-50/95 via-cyan-50/90 to-blue-50/95 dark:from-blue-950/30 dark:via-cyan-950/25 dark:to-blue-950/30'
            : 'bg-blue-50 dark:bg-blue-950/50',
          borderColor: 'border-blue-200/60 dark:border-blue-700/60',
          textColor: 'text-blue-900 dark:text-blue-100',
          iconColor: 'text-blue-600 dark:text-blue-400',
          ctaColor: 'text-blue-700 dark:text-blue-300 hover:text-blue-800 dark:hover:text-blue-200',
        };
      case 'beta':
        return {
          icon: Sparkles,
          bgGradient: enhanced
            ? 'bg-gradient-to-r from-indigo-50/95 via-purple-50/90 to-pink-50/95 dark:from-indigo-950/30 dark:via-purple-950/25 dark:to-pink-950/30'
            : 'bg-gradient-to-r from-indigo-50 to-pink-50 dark:from-indigo-950/50 dark:to-pink-950/50',
          borderColor: 'border-indigo-200/60 dark:border-indigo-700/60',
          textColor: 'text-indigo-900 dark:text-indigo-100',
          iconColor: 'text-indigo-600 dark:text-indigo-400',
          ctaColor:
            'text-indigo-700 dark:text-indigo-300 hover:text-indigo-800 dark:hover:text-indigo-200',
        };
      case 'info':
      default:
        return {
          icon: Info,
          bgGradient: enhanced
            ? 'bg-gradient-to-r from-blue-50/95 via-slate-50/90 to-blue-50/95 dark:from-blue-950/30 dark:via-slate-950/25 dark:to-blue-950/30'
            : 'bg-blue-50 dark:bg-blue-950/50',
          borderColor: 'border-blue-200/60 dark:border-blue-700/60',
          textColor: 'text-blue-900 dark:text-blue-100',
          iconColor: 'text-blue-600 dark:text-blue-400',
          ctaColor: 'text-blue-700 dark:text-blue-300 hover:text-blue-800 dark:hover:text-blue-200',
        };
    }
  };

  const config = getVariantConfig();
  const IconComponent = customIcon ? () => customIcon : config.icon;

  return (
    <div
      className={cn(
        'relative border-b transition-all duration-300',
        // Enhanced glass-morphism styling
        enhanced && 'backdrop-blur-sm shadow-sm hover:shadow-md',
        // Background and border styles
        config.bgGradient,
        config.borderColor,
        config.textColor,
        className,
      )}
    >
      {/* Decorative gradient orb for enhanced mode */}
      {enhanced && (
        <div
          className={cn(
            'absolute top-0 left-1/4 w-32 h-8 opacity-20 blur-xl rounded-full',
            variant === 'promo' && 'bg-gradient-to-r from-violet-400 to-purple-500',
            variant === 'success' && 'bg-gradient-to-r from-emerald-400 to-green-500',
            variant === 'warning' && 'bg-gradient-to-r from-amber-400 to-yellow-500',
            variant === 'info' && 'bg-gradient-to-r from-blue-400 to-cyan-500',
            variant === 'announcement' && 'bg-gradient-to-r from-blue-400 to-cyan-500',
            variant === 'beta' && 'bg-gradient-to-r from-indigo-400 to-pink-500',
          )}
        />
      )}

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-3 sm:py-4">
          <div className="flex items-center space-x-3 sm:space-x-4 flex-1 min-w-0">
            {/* Icon */}
            {showIcon && IconComponent && (
              <div className="flex-shrink-0">
                <IconComponent className={cn('h-4 w-4 sm:h-5 sm:w-5', config.iconColor)} />
              </div>
            )}

            {/* Message */}
            <div className="text-sm sm:text-base font-medium leading-relaxed min-w-0 flex-1">
              {message}
            </div>

            {/* Call-to-action link */}
            {ctaText && ctaLink && (
              <Link
                href={ctaLink}
                className={cn(
                  'text-sm sm:text-base font-semibold underline decoration-2 underline-offset-2',
                  'transition-all duration-200 hover:scale-[1.02] focus-visible:ring-2',
                  'focus-visible:ring-offset-2 focus-visible:ring-violet-500/20 rounded-sm',
                  'flex-shrink-0',
                  config.ctaColor,
                )}
              >
                {ctaText}
              </Link>
            )}
          </div>

          {/* Dismiss button */}
          {dismissible && onDismiss && (
            <button
              onClick={onDismiss}
              className={cn(
                'ml-3 sm:ml-4 p-1.5 rounded-lg transition-all duration-200',
                'hover:bg-black/5 dark:hover:bg-white/5 hover:scale-110',
                'focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-violet-500/20',
                'text-current opacity-70 hover:opacity-100 flex-shrink-0',
                enhanced && 'backdrop-blur-sm shadow-sm hover:shadow-md',
              )}
              aria-label="Dismiss notification"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Subtle animation line for enhanced mode */}
      {enhanced && (
        <div
          className={cn(
            'absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r opacity-30',
            variant === 'promo' && 'from-violet-400 via-purple-500 to-violet-400',
            variant === 'success' && 'from-emerald-400 via-green-500 to-emerald-400',
            variant === 'warning' && 'from-amber-400 via-yellow-500 to-amber-400',
            variant === 'info' && 'from-blue-400 via-cyan-500 to-blue-400',
            variant === 'announcement' && 'from-blue-400 via-cyan-500 to-blue-400',
            variant === 'beta' && 'from-indigo-400 via-purple-500 to-pink-400',
          )}
        />
      )}
    </div>
  );
};

export default EnhancedNotificationBar;
