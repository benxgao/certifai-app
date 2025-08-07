'use client';

/**
 * AccountContext provides centralized access to account and subscription data
 * throughout the entire application. This context wraps the main routes and
 * makes account state easily accessible on any page.
 */

import React, { createContext, useContext, ReactNode } from 'react';
import { useAccountStatus } from '@/src/stripe/client/hooks/useUnifiedAccountData';
import { useFirebaseAuth } from '@/src/context/FirebaseAuthContext';
import type { UnifiedAccountData } from '@/src/stripe/client/hooks/useUnifiedAccountData';

// Enhanced account context interface
export interface AccountContextType {
  // Account data
  account: UnifiedAccountData | null;
  isLoading: boolean;
  error: Error | null;

  // Authentication state
  isAuthenticated: boolean;
  firebaseUserId: string | null;
  apiUserId: string | null;
  userEmail: string | null;

  // Account status helpers
  hasAccount: boolean;
  hasStripeCustomer: boolean;

  // Subscription status helpers
  hasSubscription: boolean;
  hasActiveSubscription: boolean;
  isTrialing: boolean;
  isCanceled: boolean;
  subscriptionStatus: string | null;

  // Plan information
  planId: string | null;
  planName: string | null;
  planAmount: number | null;
  planCurrency: string | null;

  // Billing information
  currentPeriodEnd: number | null;
  trialEnd: number | null;
  cancelAtPeriodEnd: boolean;

  // Actions
  refreshAccount: () => void;
}

const AccountContext = createContext<AccountContextType | null>(null);

// Custom hook to use account context
export function useAccount(): AccountContextType {
  const context = useContext(AccountContext);
  if (!context) {
    throw new Error('useAccount must be used within an AccountProvider');
  }
  return context;
}

// Provider component
interface AccountProviderProps {
  children: ReactNode;
}

export function AccountProvider({ children }: AccountProviderProps) {
  // Get authentication state
  const { firebaseUser, apiUserId, loading: authLoading } = useFirebaseAuth();

  // Get account data (only if authenticated)
  const {
    account,
    hasActiveSubscription,
    isTrialing,
    isCanceled,
    planName,
    planAmount,
    planCurrency,
    currentPeriodEnd,
    isLoading: accountLoading,
    error,
    refreshAccount,
  } = useAccountStatus();

  // Compute derived state
  const isAuthenticated = !authLoading && !!firebaseUser && !!apiUserId;
  const isLoading = authLoading || (isAuthenticated && accountLoading);

  // Account status helpers
  const hasAccount = !!account;
  const hasStripeCustomer = !!account?.has_stripe_customer;
  const hasSubscription = !!account?.has_subscription;

  // Subscription details
  const subscriptionStatus = account?.subscription_status || null;
  const planId = account?.stripe_plan_id || null;
  const trialEnd = account?.stripe_trial_end || null;
  const cancelAtPeriodEnd = account?.stripe_cancel_at_period_end || false;

  // User information
  const firebaseUserId = firebaseUser?.uid || null;
  const userEmail = firebaseUser?.email || account?.email || null;

  const contextValue: AccountContextType = {
    // Account data
    account,
    isLoading,
    error,

    // Authentication state
    isAuthenticated,
    firebaseUserId,
    apiUserId,
    userEmail,

    // Account status helpers
    hasAccount,
    hasStripeCustomer,

    // Subscription status helpers
    hasSubscription,
    hasActiveSubscription,
    isTrialing,
    isCanceled,
    subscriptionStatus,

    // Plan information
    planId,
    planName: planName || null,
    planAmount: planAmount || null,
    planCurrency: planCurrency || null,

    // Billing information
    currentPeriodEnd: currentPeriodEnd || null,
    trialEnd,
    cancelAtPeriodEnd,

    // Actions
    refreshAccount,
  };

  return <AccountContext.Provider value={contextValue}>{children}</AccountContext.Provider>;
}

// Convenience hooks for specific use cases
export function useSubscriptionStatus() {
  const { hasSubscription, hasActiveSubscription, isTrialing, isCanceled, subscriptionStatus } =
    useAccount();

  return {
    hasSubscription,
    hasActiveSubscription,
    isTrialing,
    isCanceled,
    subscriptionStatus,
  };
}

export function usePlanInfo() {
  const {
    planId,
    planName,
    planAmount,
    planCurrency,
    currentPeriodEnd,
    trialEnd,
    cancelAtPeriodEnd,
  } = useAccount();

  return {
    planId,
    planName,
    planAmount,
    planCurrency,
    currentPeriodEnd,
    trialEnd,
    cancelAtPeriodEnd,
  };
}

export function useAccountInfo() {
  const {
    account,
    hasAccount,
    hasStripeCustomer,
    isAuthenticated,
    userEmail,
    apiUserId,
    firebaseUserId,
    refreshAccount,
  } = useAccount();

  return {
    account,
    hasAccount,
    hasStripeCustomer,
    isAuthenticated,
    userEmail,
    apiUserId,
    firebaseUserId,
    refreshAccount,
  };
}
