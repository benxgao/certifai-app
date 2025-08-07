'use client';

/**
 * Demo page showing how to use the new billing components throughout the app
 * This demonstrates the flexibility and reusability of the AccountContext-based billing system
 */

import React from 'react';
import {
  ModernSubscriptionCard,
  BillingManagementCard,
  SubscriptionActionsCard,
  SubscriptionHistoryCard,
} from '@/src/components/billing/BillingComponents';
import { useAccount, useSubscriptionStatus, usePlanInfo } from '@/src/context/AccountContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/src/components/ui/tabs';

/**
 * Quick subscription status widget for dashboard
 */
export function DashboardSubscriptionWidget() {
  const { hasActiveSubscription, isTrialing } = useSubscriptionStatus();
  const { planName } = usePlanInfo();

  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Subscription</CardTitle>
      </CardHeader>
      <CardContent>
        {hasActiveSubscription ? (
          <div className="space-y-2">
            <p className="font-medium text-green-600 dark:text-green-400">
              {isTrialing ? '🎯 Trial Active' : '✅ Active'}
            </p>
            <p className="text-sm text-slate-600 dark:text-slate-400">{planName || 'Pro Plan'}</p>
          </div>
        ) : (
          <div className="space-y-2">
            <p className="font-medium text-slate-600 dark:text-slate-400">Free Plan</p>
            <p className="text-sm text-blue-600 dark:text-blue-400">
              <a href="/pricing" className="hover:underline">
                Upgrade to unlock more features →
              </a>
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

/**
 * Compact billing status for navigation or headers
 */
export function HeaderBillingStatus() {
  const { hasActiveSubscription, isTrialing } = useSubscriptionStatus();
  const { planName } = usePlanInfo();
  const { isLoading } = useAccount();

  if (isLoading) {
    return (
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 bg-gray-300 rounded-full animate-pulse"></div>
        <span className="text-sm text-slate-600 dark:text-slate-400">Loading...</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <div
        className={`w-2 h-2 rounded-full ${
          hasActiveSubscription ? (isTrialing ? 'bg-blue-500' : 'bg-green-500') : 'bg-gray-400'
        }`}
      ></div>
      <span className="text-sm text-slate-700 dark:text-slate-300">
        {hasActiveSubscription ? planName || 'Pro' : 'Free'}
      </span>
    </div>
  );
}

/**
 * Full billing demo page
 */
export default function BillingDemo() {
  const { isAuthenticated, isLoading } = useAccount();

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <h2 className="text-xl font-semibold mb-2">Please Sign In</h2>
              <p className="text-slate-600 dark:text-slate-400">
                You need to be signed in to view billing information.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Billing Components Demo</h1>
        <p className="text-slate-600 dark:text-slate-400">
          Demonstrating the new AccountContext-based billing system
        </p>
      </div>

      {/* Quick widgets */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-xl font-semibold mb-4">Dashboard Widget</h2>
          <DashboardSubscriptionWidget />
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-4">Header Status</h2>
          <Card className="p-4">
            <HeaderBillingStatus />
          </Card>
        </div>
      </div>

      {/* Full billing components */}
      <div>
        <h2 className="text-2xl font-semibold mb-6">Complete Billing Interface</h2>
        <Tabs defaultValue="subscription" className="space-y-6">
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="subscription">Subscription</TabsTrigger>
            <TabsTrigger value="management">Management</TabsTrigger>
            <TabsTrigger value="actions">Actions</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          <TabsContent value="subscription">
            <ModernSubscriptionCard />
          </TabsContent>

          <TabsContent value="management">
            <BillingManagementCard />
          </TabsContent>

          <TabsContent value="actions">
            <SubscriptionActionsCard />
          </TabsContent>

          <TabsContent value="history">
            <SubscriptionHistoryCard />
          </TabsContent>
        </Tabs>
      </div>

      {/* Usage examples */}
      <div>
        <h2 className="text-2xl font-semibold mb-6">Integration Examples</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Code Example: Dashboard Widget</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="text-sm bg-slate-100 dark:bg-slate-800 p-4 rounded overflow-x-auto">
                {`import { useSubscriptionStatus, usePlanInfo } from '@/src/context/AccountContext';

export function MyWidget() {
  const { hasActiveSubscription } = useSubscriptionStatus();
  const { planName } = usePlanInfo();

  return (
    <div>
      {hasActiveSubscription ? planName : 'Free Plan'}
    </div>
  );
}`}
              </pre>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Code Example: Status Check</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="text-sm bg-slate-100 dark:bg-slate-800 p-4 rounded overflow-x-auto">
                {`import { useAccount } from '@/src/context/AccountContext';

export function MyComponent() {
  const {
    hasActiveSubscription,
    isLoading,
    planName
  } = useAccount();

  if (isLoading) return <Spinner />;

  return <YourContent />;
}`}
              </pre>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
