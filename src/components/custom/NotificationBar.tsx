'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { X, Info, CheckCircle, AlertTriangle, Megaphone, Sparkles } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { Button } from '@/src/components/ui/button';
import { Checkbox } from '@/src/components/ui/checkbox';
import { Label } from '@/src/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/src/components/ui/dialog';

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
  /** If true, hide credentials and require explicit agreement click */
  requireConsent?: boolean;
  /** Callback fired when user clicks agree */
  onConsentAccept?: () => void | Promise<void>;
  /** Label for the consent trigger button shown in the notification bar */
  consentButtonText?: string;
  /** Privacy policy link */
  privacyLink?: string;
  /** Terms and conditions link */
  termsLink?: string;
  /** Loading state while fetching latest credentials */
  isConsentLoading?: boolean;
  /** Optional consent action error message */
  consentError?: string | null;
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
  requireConsent = false,
  onConsentAccept,
  consentButtonText = 'Show demo login details',
  privacyLink,
  termsLink,
  isConsentLoading = false,
  consentError,
}) => {
  const [isConsentModalOpen, setIsConsentModalOpen] = useState(false);
  const [hasReviewedConsent, setHasReviewedConsent] = useState(false);

  const handleConsentModalChange = (isOpen: boolean) => {
    setIsConsentModalOpen(isOpen);
    if (!isOpen) {
      setHasReviewedConsent(false);
    }
  };

  const handleConsentAgree = async () => {
    if (!onConsentAccept || isConsentLoading || !hasReviewedConsent) {
      return;
    }

    try {
      await onConsentAccept();
      setIsConsentModalOpen(false);
      setHasReviewedConsent(false);
    } catch {
      // Keep modal open so user can review and retry.
    }
  };

  if (!show) return null;

  // Get variant-specific configurations
  const getVariantConfig = () => {
    switch (variant) {
      case 'success':
        return {
          icon: CheckCircle,
          bgGradient: enhanced
            ? 'bg-emerald-50/95 dark:bg-emerald-950/30'
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
            ? 'bg-amber-50/95 dark:bg-amber-950/30'
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
            ? 'bg-violet-50/95 dark:bg-violet-950/30'
            : 'bg-violet-50 dark:bg-violet-950/50',
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
            ? 'bg-blue-50/95 dark:bg-blue-950/30'
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
            ? 'bg-indigo-50/95 dark:bg-indigo-950/30'
            : 'bg-indigo-50 dark:bg-indigo-950/50',
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
            ? 'bg-blue-50/95 dark:bg-blue-950/30'
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
      {/* Decorative color orb for enhanced mode */}
      {enhanced && (
        <div
          className={cn(
            'absolute top-0 left-1/4 w-32 h-8 opacity-20 blur-xl rounded-full',
            variant === 'promo' && 'bg-violet-400',
            variant === 'success' && 'bg-emerald-400',
            variant === 'warning' && 'bg-amber-400',
            variant === 'info' && 'bg-blue-400',
            variant === 'announcement' && 'bg-blue-400',
            variant === 'beta' && 'bg-indigo-400',
          )}
        />
      )}

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-3 py-3 sm:py-4 md:flex-row md:items-center md:justify-between">
          <div className="flex min-w-0 flex-1 items-start space-x-3 sm:space-x-4 md:items-center">
            {/* Icon */}
            {showIcon && IconComponent && (
              <div className="shrink-0">
                <IconComponent className={cn('h-4 w-4 sm:h-5 sm:w-5', config.iconColor)} />
              </div>
            )}

            {/* Message */}
            <div className="min-w-0 flex-1 text-sm font-medium leading-relaxed sm:text-base">
              <div>{message}</div>

              {requireConsent && consentError && (
                <div
                  className="mt-2 text-xs sm:text-sm text-red-700 dark:text-red-300"
                  role="alert"
                  aria-live="assertive"
                >
                  {consentError}
                </div>
              )}
            </div>

          </div>

          <div className="flex w-full flex-col gap-3 md:w-auto md:flex-row md:items-center md:justify-end md:self-start">
            {requireConsent && (
              <div className="flex w-full md:w-auto md:justify-end">
                <button
                  type="button"
                  onClick={() => setIsConsentModalOpen(true)}
                  disabled={isConsentLoading}
                  aria-label={consentButtonText}
                  aria-busy={isConsentLoading}
                  className={cn(
                    'inline-flex min-h-11 w-full items-center justify-center rounded-md px-0 py-1 text-sm font-semibold md:w-auto md:justify-end',
                    'bg-transparent text-violet-700 underline decoration-2 underline-offset-4 hover:text-violet-800',
                    'dark:text-violet-300 dark:hover:text-violet-200 disabled:opacity-70 disabled:cursor-not-allowed',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/30 focus-visible:ring-offset-2',
                    'transition-colors duration-200',
                  )}
                >
                  {isConsentLoading ? 'Loading latest credentials...' : consentButtonText}
                </button>
              </div>
            )}

            {/* Call-to-action link */}
            {!requireConsent && ctaText && ctaLink && (
              <Link
                href={ctaLink}
                className={cn(
                  'text-sm sm:text-base font-semibold underline decoration-2 underline-offset-2',
                  'transition-all duration-200 hover:scale-[1.02] focus-visible:ring-2',
                  'focus-visible:ring-offset-2 focus-visible:ring-violet-500/20 rounded-sm',
                  'shrink-0 md:text-right',
                  config.ctaColor,
                )}
              >
                {ctaText}
              </Link>
            )}

            {/* Dismiss button */}
            {dismissible && onDismiss && (
              <button
                onClick={onDismiss}
                className={cn(
                  'self-end p-1.5 rounded-lg transition-all duration-200 md:self-auto',
                  'hover:bg-black/5 dark:hover:bg-white/5 hover:scale-110',
                  'focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-violet-500/20',
                  'text-current opacity-70 hover:opacity-100 shrink-0',
                  enhanced && 'backdrop-blur-sm shadow-sm hover:shadow-md',
                )}
                aria-label="Dismiss notification"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {requireConsent && (
        <Dialog open={isConsentModalOpen} onOpenChange={handleConsentModalChange}>
          <DialogContent className="sm:max-w-xl">
            <DialogHeader>
              <DialogTitle>Before we display demo credentials</DialogTitle>
              <DialogDescription>
                By clicking <strong>Agree</strong>, you acknowledge that you have read and accept
                our Privacy Policy and Terms &amp; Conditions for demo account access.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 text-sm text-slate-700 dark:text-slate-300">
              <p>
                Demo credentials are provided strictly for product evaluation. Do not enter
                personal, confidential, or sensitive information when using the demo account.
              </p>

              <p>
                Your use of demo credentials is governed by the policies below. Please review
                them before continuing.
              </p>

              <div className="flex flex-wrap items-center gap-3">
                {privacyLink && (
                  <Link
                    href={privacyLink}
                    aria-label="Read Privacy Policy"
                    title="Privacy Policy"
                    className={cn(
                      'font-semibold underline decoration-2 underline-offset-2',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/30 focus-visible:ring-offset-2 rounded-sm',
                      config.ctaColor,
                    )}
                  >
                    Privacy Policy
                  </Link>
                )}

                {termsLink && (
                  <Link
                    href={termsLink}
                    aria-label="Read Terms & Conditions"
                    title="Terms & Conditions"
                    className={cn(
                      'font-semibold underline decoration-2 underline-offset-2',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/30 focus-visible:ring-offset-2 rounded-sm',
                      config.ctaColor,
                    )}
                  >
                    Terms & Conditions
                  </Link>
                )}
              </div>

              <div className="flex items-start gap-3 rounded-md border border-slate-200/70 bg-slate-50/60 p-3 dark:border-slate-700/70 dark:bg-slate-800/40">
                <Checkbox
                  id="demo-credentials-consent-checkbox"
                  checked={hasReviewedConsent}
                  onCheckedChange={(checked) => setHasReviewedConsent(Boolean(checked))}
                  disabled={isConsentLoading}
                />
                <Label
                  htmlFor="demo-credentials-consent-checkbox"
                  className="text-sm leading-relaxed text-slate-700 dark:text-slate-300"
                >
                  I have read and agree to the Privacy Policy and Terms &amp; Conditions for demo
                  account use.
                </Label>
              </div>

              {consentError && (
                <div className="text-xs sm:text-sm text-red-700 dark:text-red-300" role="alert" aria-live="assertive">
                  {consentError}
                </div>
              )}
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsConsentModalOpen(false)}
                disabled={isConsentLoading}
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={() => {
                  void handleConsentAgree();
                }}
                disabled={isConsentLoading || !hasReviewedConsent}
                aria-busy={isConsentLoading}
              >
                {isConsentLoading ? 'Loading latest credentials...' : 'Agree'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Subtle animation line for enhanced mode - removed */}
    </div>
  );
};

export default EnhancedNotificationBar;
