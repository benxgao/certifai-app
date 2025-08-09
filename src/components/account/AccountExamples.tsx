/**
 * Example components demonstrating how to use the AccountContext
 * These components can be used anywhere in the app to access account/subscription data
 */

'use client';

import React from 'react';
import {
  useAccount,
  useSubscriptionStatus,
  usePlanInfo,
  useAccountInfo,
} from '@/src/context/AccountContext';
import { isFeatureEnabled } from '@/src/config/featureFlags';

// Main account status component
export function AccountStatusCard() {
  const {
    isAuthenticated,
    isLoading,
    hasActiveSubscription,
    isTrialing,
    isCanceled,
    planName,
    userEmail,
  } = useAccount();

  if (!isAuthenticated) {
    return (
      <div className="p-4 bg-gray-100 dark:bg-slate-800 rounded-lg">
        <p className="text-gray-600 dark:text-slate-300">Please sign in to view account status</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="p-4 bg-gray-100 dark:bg-slate-800 rounded-lg">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-300 dark:bg-slate-600 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-300 dark:bg-slate-600 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 bg-white dark:bg-slate-800 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-3">Account Status</h3>

      <div className="space-y-2">
        <p>
          <span className="font-medium">Email:</span> {userEmail}
        </p>

        <div className="flex items-center gap-2">
          <span className="font-medium">Subscription:</span>
          {hasActiveSubscription ? (
            <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded text-sm">
              Active {planName && `(${planName})`}
            </span>
          ) : (
            <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded text-sm">
              No active subscription
            </span>
          )}
        </div>

        {isTrialing && (
          <p className="text-blue-600 dark:text-blue-400 text-sm">✨ Currently in trial period</p>
        )}

        {isCanceled && (
          <p className="text-orange-600 dark:text-orange-400 text-sm">
            ⚠️ Subscription will be canceled at period end
          </p>
        )}
      </div>
    </div>
  );
}

// Subscription-specific status component
export function SubscriptionBadge() {
  const { hasActiveSubscription, isTrialing } = useSubscriptionStatus();
  const { planName } = usePlanInfo();

  if (!hasActiveSubscription) {
    return (
      <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded text-xs">
        Free
      </span>
    );
  }

  return (
    <span
      className={`px-2 py-1 rounded text-xs ${
        isTrialing
          ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200'
          : 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
      }`}
    >
      {isTrialing ? 'Trial' : planName || 'Pro'}
    </span>
  );
}

// Plan information component
export function PlanDetails() {
  const { planName, planAmount, planCurrency, currentPeriodEnd, trialEnd, cancelAtPeriodEnd } =
    usePlanInfo();

  if (!planName) {
    return (
      <div className="p-4 bg-gray-50 dark:bg-slate-700 rounded-lg">
        <p className="text-gray-600 dark:text-slate-300">No active plan</p>
      </div>
    );
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString();
  };

  const formatPrice = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(amount / 100);
  };

  return (
    <div className="p-4 bg-white dark:bg-slate-800 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-3">Plan Details</h3>

      <div className="space-y-2">
        <p>
          <span className="font-medium">Plan:</span> {planName}
        </p>

        {planAmount && planCurrency && (
          <p>
            <span className="font-medium">Price:</span> {formatPrice(planAmount, planCurrency)}
          </p>
        )}

        {trialEnd && (
          <p>
            <span className="font-medium">Trial ends:</span> {formatDate(trialEnd)}
          </p>
        )}

        {currentPeriodEnd && !trialEnd && (
          <p>
            <span className="font-medium">{cancelAtPeriodEnd ? 'Cancels on:' : 'Renews on:'}</span>{' '}
            {formatDate(currentPeriodEnd)}
          </p>
        )}

        {cancelAtPeriodEnd && (
          <p className="text-orange-600 dark:text-orange-400 text-sm">
            ⚠️ Subscription will not renew
          </p>
        )}
      </div>
    </div>
  );
}

// Navigation component that shows different options based on account status
export function AccountNavigation() {
  const { isAuthenticated, hasActiveSubscription } = useAccount();

  if (!isAuthenticated) {
    return (
      <nav className="flex gap-4">
        <a href="/signin" className="text-blue-600 hover:text-blue-800">
          Sign In
        </a>
        <a href="/signup" className="text-blue-600 hover:text-blue-800">
          Sign Up
        </a>
      </nav>
    );
  }

  return (
    <nav className="flex gap-4">
      <a href="/main" className="text-blue-600 hover:text-blue-800">
        Dashboard
      </a>

      {hasActiveSubscription && isFeatureEnabled('STRIPE_INTEGRATION') ? (
        <a href="/main/billing" className="text-blue-600 hover:text-blue-800">
          Billing
        </a>
      ) : (
        <a href="/pricing" className="text-blue-600 hover:text-blue-800">
          Upgrade
        </a>
      )}
    </nav>
  );
}

// Loading wrapper component
export function AccountDataWrapper({ children }: { children: React.ReactNode }) {
  const { isLoading, isAuthenticated } = useAccount();

  if (!isAuthenticated) {
    return <>{children}</>;
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return <>{children}</>;
}
