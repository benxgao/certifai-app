'use client';

/**
 * Modern billing components using AccountContext
 * Replaces old Stripe-specific components with context-aware ones
 */

import React from 'react';
import { format } from 'date-fns';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/src/components/ui/card';
import { Button } from '@/src/components/ui/button';
import { Badge } from '@/src/components/ui/badge';
import { Separator } from '@/src/components/ui/separator';
import {
  Crown,
  Calendar,
  CreditCard,
  AlertTriangle,
  CheckCircle,
  Clock,
  Shield,
  ExternalLink,
  Loader2,
  RefreshCw,
} from 'lucide-react';
import {
  useAccount,
  useSubscriptionStatus,
  usePlanInfo,
  useAccountInfo,
} from '@/src/context/AccountContext';
import { useCreatePortalSession } from '@/src/stripe/client/swr';

/**
 * Modern subscription status card with detailed information
 */
export function ModernSubscriptionCard() {
  const { isLoading, error } = useAccount();
  const { hasActiveSubscription, isTrialing, isCanceled } = useSubscriptionStatus();
  const { planName, planAmount, planCurrency, currentPeriodEnd, trialEnd } = usePlanInfo();
  const { userEmail } = useAccountInfo();

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center p-8">
            <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
            <span className="ml-2 text-slate-600 dark:text-slate-400">
              Loading subscription details...
            </span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border-red-200 dark:border-red-800">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3 text-red-600 dark:text-red-400">
            <AlertTriangle className="w-5 h-5" />
            <span>Error loading subscription data. Please try again.</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  const formatPrice = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(amount / 100);
  };

  const formatDate = (timestamp: number) => {
    return format(new Date(timestamp * 1000), 'PPP');
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Crown className="w-6 h-6 text-blue-600" />
            <div>
              <CardTitle>Subscription Status</CardTitle>
              <CardDescription>{userEmail}</CardDescription>
            </div>
          </div>

          {hasActiveSubscription ? (
            <Badge
              variant={isTrialing ? 'secondary' : 'default'}
              className="flex items-center gap-1"
            >
              {isTrialing ? <Clock className="w-3 h-3" /> : <CheckCircle className="w-3 h-3" />}
              {isTrialing ? 'Trial' : 'Active'}
            </Badge>
          ) : (
            <Badge variant="outline">Free Plan</Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Current Plan */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-medium text-slate-900 dark:text-slate-100 mb-2">Current Plan</h4>
            <p className="text-lg font-semibold text-blue-600 dark:text-blue-400">
              {planName || 'Free Plan'}
            </p>
            {planAmount && planCurrency && (
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {formatPrice(planAmount, planCurrency)}/month
              </p>
            )}
          </div>

          {/* Status Information */}
          <div>
            <h4 className="font-medium text-slate-900 dark:text-slate-100 mb-2">Status</h4>
            <div className="space-y-1">
              {isTrialing && trialEnd && (
                <p className="text-sm text-blue-600 dark:text-blue-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  Trial ends {formatDate(trialEnd)}
                </p>
              )}

              {isCanceled && currentPeriodEnd && (
                <p className="text-sm text-orange-600 dark:text-orange-400 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" />
                  Cancels on {formatDate(currentPeriodEnd)}
                </p>
              )}

              {hasActiveSubscription && !isTrialing && !isCanceled && currentPeriodEnd && (
                <p className="text-sm text-green-600 dark:text-green-400 flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" />
                  Renews on {formatDate(currentPeriodEnd)}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Features or Benefits */}
        {hasActiveSubscription && (
          <>
            <Separator />
            <div>
              <h4 className="font-medium text-slate-900 dark:text-slate-100 mb-2">Plan Benefits</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-slate-600 dark:text-slate-400">
                <div className="flex items-center gap-2">
                  <Shield className="w-3 h-3 text-green-500" />
                  Unlimited practice exams
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-3 h-3 text-green-500" />
                  AI-powered study plans
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-3 h-3 text-green-500" />
                  Progress tracking & analytics
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-3 h-3 text-green-500" />
                  Priority support
                </div>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

/**
 * Billing management card with portal access
 */
export function BillingManagementCard() {
  const { hasActiveSubscription } = useSubscriptionStatus();
  const { hasStripeCustomer } = useAccountInfo();
  const { trigger: createPortalSession, isMutating: isCreatingPortal } = useCreatePortalSession();

  const handleManageBilling = async () => {
    try {
      const response = await createPortalSession({
        return_url: window.location.href,
      });

      if (response.success && response.data.portal_url) {
        window.location.href = response.data.portal_url;
      }
    } catch (error) {
      console.error('Failed to create portal session:', error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <CreditCard className="w-6 h-6 text-blue-600" />
          <div>
            <CardTitle>Billing Management</CardTitle>
            <CardDescription>
              Manage your payment methods, billing information, and download invoices
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-slate-900 dark:text-slate-100">Customer Portal</h4>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Update payment methods, view invoices, and manage billing details
              </p>
            </div>
            <Button
              onClick={handleManageBilling}
              disabled={!hasStripeCustomer || isCreatingPortal}
              variant="outline"
              size="sm"
            >
              {isCreatingPortal ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <ExternalLink className="w-4 h-4 mr-2" />
              )}
              {isCreatingPortal ? 'Opening...' : 'Open Portal'}
            </Button>
          </div>
        </div>

        <Separator />

        <div className="text-sm text-slate-600 dark:text-slate-400 space-y-2">
          <p className="font-medium">In the customer portal you can:</p>
          <ul className="space-y-1 ml-4">
            <li>• Update payment methods and billing information</li>
            <li>• Download invoices and receipts</li>
            <li>• View payment history</li>
            <li>• Update billing address and tax information</li>
          </ul>
        </div>

        {!hasStripeCustomer && (
          <div className="bg-blue-50 dark:bg-blue-950/20 p-3 rounded-lg">
            <p className="text-sm text-blue-700 dark:text-blue-300">
              💡 The billing portal will be available once you subscribe to a plan.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

/**
 * Subscription actions card (cancel, resume, etc.)
 */
export function SubscriptionActionsCard() {
  const { hasActiveSubscription, isCanceled } = useSubscriptionStatus();
  const { planName } = usePlanInfo();
  const { refreshAccount } = useAccountInfo();

  if (!hasActiveSubscription) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Subscription Actions</CardTitle>
          <CardDescription>Subscription management options</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <p className="text-slate-600 dark:text-slate-400">
              Subscribe to a plan to access subscription management features.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Subscription Actions</CardTitle>
        <CardDescription>Manage your {planName} subscription</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium text-slate-900 dark:text-slate-100">Refresh Account Data</h4>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Update subscription status and billing information
            </p>
          </div>
          <Button onClick={refreshAccount} variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>

        <Separator />

        <div className="bg-amber-50 dark:bg-amber-950/20 p-4 rounded-lg">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5" />
            <div>
              <h4 className="font-medium text-amber-800 dark:text-amber-200 mb-2">
                Subscription Management
              </h4>
              <p className="text-sm text-amber-700 dark:text-amber-300 mb-3">
                To cancel, modify, or manage your subscription, please use the billing portal in the
                &ldquo;Manage&rdquo; tab above. This ensures secure handling of your billing
                information.
              </p>
              {isCanceled && (
                <p className="text-sm text-orange-600 dark:text-orange-400">
                  ⚠️ Your subscription is currently set to cancel at the end of the billing period.
                </p>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Subscription history and activity card
 */
export function SubscriptionHistoryCard() {
  const { account } = useAccount();
  const { hasStripeCustomer } = useAccountInfo();

  const formatDate = (timestamp: number) => {
    return format(new Date(timestamp * 1000), 'PPP');
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <Calendar className="w-6 h-6 text-blue-600" />
          <div>
            <CardTitle>Account History</CardTitle>
            <CardDescription>Your subscription and billing timeline</CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {account ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b border-slate-200 dark:border-slate-700">
              <span className="text-sm font-medium">Account Created</span>
              <span className="text-sm text-slate-600 dark:text-slate-400">
                {account.created_at ? format(new Date(account.created_at), 'PPP') : 'N/A'}
              </span>
            </div>

            {account.updated_at && (
              <div className="flex items-center justify-between py-2 border-b border-slate-200 dark:border-slate-700">
                <span className="text-sm font-medium">Last Updated</span>
                <span className="text-sm text-slate-600 dark:text-slate-400">
                  {format(new Date(account.updated_at), 'PPP')}
                </span>
              </div>
            )}

            {account.stripe_customer_id && (
              <div className="flex items-center justify-between py-2 border-b border-slate-200 dark:border-slate-700">
                <span className="text-sm font-medium">Billing Account</span>
                <span className="text-sm text-slate-600 dark:text-slate-400">Active</span>
              </div>
            )}

            {account.subscription_id && (
              <div className="flex items-center justify-between py-2">
                <span className="text-sm font-medium">Subscription Active</span>
                <span className="text-sm text-slate-600 dark:text-slate-400">
                  {account.subscription_status || 'Active'}
                </span>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-6">
            <p className="text-slate-600 dark:text-slate-400">No account history available.</p>
          </div>
        )}

        <Separator />

        <div className="bg-blue-50 dark:bg-blue-950/20 p-3 rounded-lg">
          <p className="text-sm text-blue-700 dark:text-blue-300">
            📋 For detailed billing history, invoices, and receipts, please use the billing portal
            in the &ldquo;Manage&rdquo; tab.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
