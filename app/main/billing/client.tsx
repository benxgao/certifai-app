'use client';

import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/src/components/ui/tabs';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/src/components/ui/card';
import { Separator } from '@/src/components/ui/separator';
import { CreditCard, Crown, History, Settings, Shield, Clock, AlertTriangle } from 'lucide-react';
import { PricingPlansGrid } from '@/src/stripe/client/components';
import { useAccount, useSubscriptionStatus, usePlanInfo } from '@/src/context/AccountContext';
import {
  ModernSubscriptionCard,
  BillingManagementCard,
  SubscriptionHistoryCard,
  SubscriptionActionsCard,
} from '@/src/components/billing/BillingComponents';
import { isFeatureEnabled } from '@/src/config/featureFlags';

/**
 * Main billing page component
 * Following Certifai's dashboard layout patterns with AccountContext integration
 */
export default function BillingClient() {
  const { hasActiveSubscription } = useSubscriptionStatus();
  const { isLoading } = useAccount();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-violet-50/30 dark:from-slate-900 dark:via-slate-800 dark:to-violet-950/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-violet-50/30 dark:from-slate-900 dark:via-slate-800 dark:to-violet-950/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
            Billing & Subscriptions
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Manage your subscription, billing preferences, and view your payment history
          </p>
        </div>

        {/* Main Content */}
        {isFeatureEnabled('is_stripe_enabled') ? (
          <Tabs
            defaultValue={hasActiveSubscription ? 'subscription' : 'plans'}
            className="space-y-6"
          >
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="subscription" className="flex items-center gap-2">
                <Crown className="w-4 h-4" />
                <span className="hidden sm:inline">Subscription</span>
              </TabsTrigger>
              <TabsTrigger value="plans" className="flex items-center gap-2">
                <CreditCard className="w-4 h-4" />
                <span className="hidden sm:inline">Plans</span>
              </TabsTrigger>
              <TabsTrigger value="manage" className="flex items-center gap-2">
                <Settings className="w-4 h-4" />
                <span className="hidden sm:inline">Manage</span>
              </TabsTrigger>
              <TabsTrigger value="history" className="flex items-center gap-2">
                <History className="w-4 h-4" />
                <span className="hidden sm:inline">History</span>
              </TabsTrigger>
            </TabsList>

            {/* Subscription Status Tab */}
            <TabsContent value="subscription" className="space-y-6">
              <ModernSubscriptionCard />

              {hasActiveSubscription && (
                <>
                  <Separator />
                  <SubscriptionActionsCard />
                </>
              )}
            </TabsContent>

            {/* Pricing Plans Tab */}
            <TabsContent value="plans" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Choose Your Plan</CardTitle>
                  <CardDescription>
                    {hasActiveSubscription
                      ? 'Upgrade or change your current subscription plan'
                      : 'Select a plan that fits your certification journey'}
                  </CardDescription>
                </CardHeader>
              </Card>

              <PricingPlansGrid />

              {!hasActiveSubscription && (
                <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
                        🎯 Free Trial Available
                      </h3>
                      <p className="text-blue-700 dark:text-blue-200">
                        Start with a 14-day free trial on any paid plan. No commitment required.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Manage Subscription Tab */}
            <TabsContent value="manage" className="space-y-6">
              <BillingManagementCard />
            </TabsContent>

            {/* Billing History Tab */}
            <TabsContent value="history" className="space-y-6">
              <SubscriptionHistoryCard />

              <Card>
                <CardHeader>
                  <CardTitle>Download Invoices</CardTitle>
                  <CardDescription>
                    Access detailed billing statements and tax documents
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    To download invoices and receipts, please use the billing portal in the
                    &ldquo;Manage&rdquo; tab. All your billing documents are available there.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        ) : (
          // Feature Disabled Fallback for dedicated billing page
          <Card className="max-w-2xl mx-auto">
            <CardContent className="pt-6">
              <div className="text-center py-12">
                <AlertTriangle className="w-16 h-16 text-amber-500 mx-auto mb-6" />
                <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">
                  Billing System Temporarily Unavailable
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  We apologize for any inconvenience and appreciate your patience.
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
