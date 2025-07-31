'use client';

import React, { useState } from 'react';
import EnhancedNotificationBar from '@/src/components/custom/NotificationBar';

/**
 * Example component showing how to implement hideable notification bars
 * Users can dismiss notifications and the state is managed locally
 */
export default function HideableNotificationExample() {
  const [showPromo, setShowPromo] = useState(true);
  const [showInfo, setShowInfo] = useState(true);
  const [showSuccess, setShowSuccess] = useState(true);

  return (
    <div className="space-y-0">
      {/* Promotional notification */}
      <EnhancedNotificationBar
        message="🎉 Limited time offer: Get 50% off premium certification courses!"
        variant="promo"
        ctaText="Claim Offer"
        ctaLink="/pricing"
        dismissible
        onDismiss={() => setShowPromo(false)}
        show={showPromo}
        showIcon
      />

      {/* Info notification */}
      <EnhancedNotificationBar
        message="New feature available: AI-powered question recommendations are now live!"
        variant="info"
        ctaText="Learn More"
        ctaLink="/features"
        dismissible
        onDismiss={() => setShowInfo(false)}
        show={showInfo}
        showIcon
      />

      {/* Success notification */}
      <EnhancedNotificationBar
        message="Your certification exam has been successfully completed with a score of 89%!"
        variant="success"
        ctaText="View Results"
        ctaLink="/results"
        dismissible
        onDismiss={() => setShowSuccess(false)}
        show={showSuccess}
        showIcon
      />

      {/* Reset buttons for demo purposes */}
      {(!showPromo || !showInfo || !showSuccess) && (
        <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-center space-x-4">
              <span className="text-sm text-slate-600 dark:text-slate-400">Demo Controls:</span>
              {!showPromo && (
                <button
                  onClick={() => setShowPromo(true)}
                  className="text-xs px-2 py-1 bg-violet-100 text-violet-700 hover:bg-violet-200 dark:bg-violet-900/30 dark:text-violet-300 dark:hover:bg-violet-900/50 rounded transition-colors"
                >
                  Show Promo
                </button>
              )}
              {!showInfo && (
                <button
                  onClick={() => setShowInfo(true)}
                  className="text-xs px-2 py-1 bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:hover:bg-blue-900/50 rounded transition-colors"
                >
                  Show Info
                </button>
              )}
              {!showSuccess && (
                <button
                  onClick={() => setShowSuccess(true)}
                  className="text-xs px-2 py-1 bg-emerald-100 text-emerald-700 hover:bg-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:hover:bg-emerald-900/50 rounded transition-colors"
                >
                  Show Success
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
