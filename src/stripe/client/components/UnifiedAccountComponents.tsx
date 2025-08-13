/**
 * Example component showing how to use the new unified account data
 * This demonstrates the benefits of the single collection approach
 */

'use client';

import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/src/components/ui/card';
import { Badge } from '@/src/components/ui/badge';
import { Button } from '@/src/components/ui/button';
import { Alert, AlertDescription } from '@/src/components/ui/alert';
import { Skeleton } from '@/src/components/ui/skeleton';
import {
  Crown,
  CreditCard,
  Calendar,
  DollarSign,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
} from 'lucide-react';
import {
  useUnifiedAccountData,
  useAccountStatus,
  AccountUtils,
} from '../hooks/useUnifiedAccountData';

/**
 * Unified account dashboard - all Stripe data in one component
 * Before: Required multiple API calls and state management
 * After: Single API call with flat data structure
 */
export function UnifiedAccountDashboard() {
  const { data, error, isLoading } = useUnifiedAccountData();
  const account = data?.data;

  if (isLoading) {
    return <AccountDashboardSkeleton />;
  }

  if (error) {
    return (
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>Failed to load account data. Please try again.</AlertDescription>
      </Alert>
    );
  }

  if (!account) {
    return (
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>Account not found. Please contact support.</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {/* Account Overview */}
      <AccountOverviewCard account={account} />

      {/* Subscription Details */}
      <SubscriptionDetailsCard account={account} />

      {/* Payment Information */}
      <PaymentInfoCard account={account} />

      {/* Quick Actions */}
      <QuickActionsCard account={account} />
    </div>
  );
}

/**
 * Account overview with key information
 */
function AccountOverviewCard({ account }: { account: any }) {
  const statusInfo = AccountUtils.getStatusInfo(account);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Crown className="w-5 h-5 text-primary" />
          Account Overview
        </CardTitle>
        <CardDescription>Your Certifai account and subscription status</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Account Status */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Account Status
            </label>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span className="text-sm">Active</span>
            </div>
          </div>

          {/* Subscription Status */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Subscription
            </label>
            <Badge
              variant={statusInfo.color === 'green' ? 'default' : 'secondary'}
              className={statusInfo.color === 'green' ? 'bg-green-100 text-green-800' : ''}
            >
              {statusInfo.label}
            </Badge>
          </div>

          {/* Customer Status */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Billing Setup
            </label>
            <div className="flex items-center gap-2">
              {account.has_stripe_customer ? (
                <>
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Complete</span>
                </>
              ) : (
                <>
                  <XCircle className="w-4 h-4 text-red-500" />
                  <span className="text-sm">Incomplete</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Key Information */}
        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">API User ID:</span>
              <p className="text-slate-600 dark:text-slate-400 font-mono text-xs">
                {account.api_user_id}
              </p>
            </div>
            <div>
              <span className="font-medium">Email:</span>
              <p className="text-slate-600 dark:text-slate-400">{account.email}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Subscription details with all relevant information
 */
function SubscriptionDetailsCard({ account }: { account: any }) {
  if (!account.has_subscription) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Crown className="w-5 h-5 text-slate-400" />
            No Active Subscription
          </CardTitle>
          <CardDescription>Subscribe to unlock premium features</CardDescription>
        </CardHeader>
        <CardContent>
          <Button className="w-full">View Plans</Button>
        </CardContent>
      </Card>
    );
  }

  const formattedAmount = AccountUtils.formatAmount(account);
  const nextBilling = AccountUtils.formatBillingDate(account.stripe_current_period_end);
  const daysRemaining = AccountUtils.getDaysRemaining(account);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Crown className="w-5 h-5 text-primary" />
          Subscription Details
        </CardTitle>
        <CardDescription>Your current plan and billing information</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Plan Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Current Plan
            </label>
            <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              {account.stripe_plan_name}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Price</label>
            <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              {formattedAmount}
            </p>
          </div>
        </div>

        {/* Billing Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Next Billing Date
            </label>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-slate-400" />
              <span className="text-slate-900 dark:text-slate-100">{nextBilling}</span>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Days Remaining
            </label>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-slate-400" />
              <span className="text-slate-900 dark:text-slate-100">{daysRemaining} days</span>
            </div>
          </div>
        </div>

        {/* Status Alerts */}
        {account.is_trial && (
          <Alert>
            <Clock className="h-4 w-4" />
            <AlertDescription>
              You&apos;re currently in your free trial. Trial ends on{' '}
              {AccountUtils.formatBillingDate(account.stripe_trial_end)}.
            </AlertDescription>
          </Alert>
        )}

        {account.is_canceled && (
          <Alert>
            <XCircle className="h-4 w-4" />
            <AlertDescription>
              Your subscription will cancel on {nextBilling}. You&apos;ll still have access until
              then.
            </AlertDescription>
          </Alert>
        )}

        {AccountUtils.expiresSoon(account) && !account.is_canceled && (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Your subscription renews in {daysRemaining} days. Make sure your payment method is up
              to date.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}

/**
 * Payment and invoice information
 */
function PaymentInfoCard({ account }: { account: any }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-primary" />
          Payment Information
        </CardTitle>
        <CardDescription>Your billing history and payment methods</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Latest Invoice */}
        {account.stripe_latest_invoice_id && (
          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4">
            <h4 className="font-medium mb-2">Latest Invoice</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-slate-600 dark:text-slate-400">Invoice ID:</span>
                <p className="font-mono text-xs">{account.stripe_latest_invoice_id}</p>
              </div>
              <div>
                <span className="text-slate-600 dark:text-slate-400">Status:</span>
                <p className="capitalize">{account.stripe_latest_invoice_status}</p>
              </div>
            </div>
          </div>
        )}

        {/* Customer Information */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium">Customer ID:</span>
            <p className="text-slate-600 dark:text-slate-400 font-mono text-xs">
              {account.stripe_customer_id}
            </p>
          </div>
          <div>
            <span className="font-medium">Subscription ID:</span>
            <p className="text-slate-600 dark:text-slate-400 font-mono text-xs">
              {account.subscription_id}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Quick action buttons
 */
function QuickActionsCard({ account }: { account: any }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>Manage your subscription and billing</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Button variant="outline">
            <CreditCard className="w-4 h-4 mr-2" />
            Billing Portal
          </Button>

          {account.has_subscription && (
            <Button variant="outline">
              <Crown className="w-4 h-4 mr-2" />
              Change Plan
            </Button>
          )}

          {!account.has_subscription && (
            <Button>
              <Crown className="w-4 h-4 mr-2" />
              Subscribe Now
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Loading skeleton for the dashboard
 */
function AccountDashboardSkeleton() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-6 w-16" />
                </div>
              ))}
            </div>
            <Skeleton className="h-16 w-full" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-5 w-32" />
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

/**
 * Migration comparison component - shows old vs new approach
 */
export function MigrationComparison() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Old Approach */}
      <Card>
        <CardHeader>
          <CardTitle className="text-red-600">❌ Old Approach</CardTitle>
          <CardDescription>Multiple API calls and state management</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>• 3 separate API calls:</p>
          <ul className="ml-4 space-y-1 text-slate-600">
            <li>- GET /stripe/customer/status</li>
            <li>- GET /stripe/subscription/status</li>
            <li>- GET /stripe/invoices/latest</li>
          </ul>
          <p>• Complex state management</p>
          <p>• Data correlation required</p>
          <p>• Higher latency</p>
          <p>• More error states to handle</p>
        </CardContent>
      </Card>

      {/* New Approach */}
      <Card>
        <CardHeader>
          <CardTitle className="text-green-600">✅ New Approach</CardTitle>
          <CardDescription>Single API call with flat data structure</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>• 1 unified API call:</p>
          <ul className="ml-4 space-y-1 text-slate-600">
            <li>- GET /stripe/account</li>
          </ul>
          <p>• Flat data structure</p>
          <p>• All data prefixed with `stripe_`</p>
          <p>• Lower latency</p>
          <p>• Simplified error handling</p>
          <p>• Better performance</p>
        </CardContent>
      </Card>
    </div>
  );
}
