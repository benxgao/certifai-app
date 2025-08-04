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
import { CreditCard, Crown, History, Settings } from 'lucide-react';
import {
  PricingPlansGrid,
  SubscriptionStatusCard,
  SubscriptionManagementCard,
  SubscriptionHistoryCard,
} from '@/src/stripe/client/components';
import { useSubscriptionState } from '@/src/stripe/client/swr';
import { useCachedCheckoutHandler } from '@/src/stripe/client/hooks/useCachedCheckoutHandler';

/**
 * Main billing page component
 * Following Certifai's dashboard layout patterns
 */
export default function BillingClient() {
  const { hasActiveSubscription } = useSubscriptionState();

  // Handle cached checkout sessions after authentication
  useCachedCheckoutHandler();

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
        <Tabs defaultValue={hasActiveSubscription ? 'subscription' : 'plans'} className="space-y-6">
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
            <SubscriptionStatusCard />

            {hasActiveSubscription && (
              <>
                <Separator />
                <Card>
                  <CardHeader>
                    <CardTitle>Billing Information</CardTitle>
                    <CardDescription>
                      Manage your payment methods and billing details in the customer portal
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Use the &quot;Manage&quot; tab or the billing portal to update your payment
                      methods, download invoices, and update your billing address.
                    </p>
                  </CardContent>
                </Card>
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
            <SubscriptionManagementCard />

            <Card>
              <CardHeader>
                <CardTitle>Need Help?</CardTitle>
                <CardDescription>
                  Contact our support team if you have any billing questions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    • Email: billing@certifai.com
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    • Live chat: Available 24/7 in the app
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    • Response time: Usually within 2 hours
                  </p>
                </div>
              </CardContent>
            </Card>
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
                  &quot;Manage&quot; tab. All your billing documents are available there.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
