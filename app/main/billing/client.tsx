'use client';

import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/src/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/src/components/ui/accordion';
import { CreditCard, Crown, History, AlertTriangle } from 'lucide-react';
import { PricingPlansGrid } from '@/src/stripe/client/components';
import { useAccount, useSubscriptionStatus } from '@/src/context/AccountContext';
import {
  ModernSubscriptionCard,
  SubscriptionActionsCard,
} from '@/src/components/billing/BillingComponents';
import { isFeatureEnabled } from '@/src/config/featureFlags';
import Breadcrumb from '@/src/components/custom/Breadcrumb';
import {
  DashboardCard,
  DashboardCardHeader,
  DashboardCardContent,
} from '@/src/components/ui/dashboard-card';
import { LoadingSpinner } from '@/src/components/ui/loading-spinner';

/**
 * Main billing page component
 * Following Certifai's dashboard layout patterns with AccountContext integration
 */
export default function BillingClient() {
  const { hasActiveSubscription } = useSubscriptionStatus();
  const { isLoading } = useAccount();

  // Breadcrumb navigation items
  const breadcrumbItems = [
    { label: 'Dashboard', href: '/main' },
    { label: 'Billing & Subscriptions', current: true },
  ];

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-background text-foreground">
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="flex flex-col items-center space-y-6 text-center max-w-md mx-auto">
            <div className="relative">
              <LoadingSpinner size="xl" variant="primary" className="loading-glow" />
              <div className="absolute -inset-4 bg-violet-500/10 rounded-full blur-xl animate-pulse"></div>
            </div>
            <div className="space-y-3">
              <h3 className="text-xl font-normal text-foreground">Loading Billing</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Please wait while we fetch your billing and subscription information...
              </p>
              <div className="flex items-center justify-center space-x-1 mt-4">
                <div className="w-2 h-2 bg-violet-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-2 h-2 bg-violet-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-2 h-2 bg-violet-500 rounded-full animate-bounce"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-violet-50/30 dark:from-slate-900 dark:via-slate-800 dark:to-violet-950/20 pt-16">
      <div className="max-w-4xl mx-auto px-4 py-8 md:px-8 md:py-12 space-y-10">
        {/* Breadcrumb Navigation */}
        <Breadcrumb items={breadcrumbItems} />

        {/* Header */}
        <DashboardCard>
          <DashboardCardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <CreditCard className="w-6 h-6 text-violet-600 dark:text-violet-400" />
                <div>
                  <h1 className="text-xl md:text-2xl font-medium text-slate-900 dark:text-slate-100">
                    Billing & Subscriptions
                  </h1>
                  <p className="text-sm md:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                    Manage your subscription, billing preferences, and view your payment history
                  </p>
                </div>
              </div>
            </div>
          </DashboardCardHeader>
        </DashboardCard>

        {/* Main Content */}
        {isFeatureEnabled('STRIPE_INTEGRATION') ? (
          <DashboardCard>
            <DashboardCardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <h2 className="text-xl font-normal text-slate-900 dark:text-slate-50">
                    Subscription Management
                  </h2>
                </div>
              </div>
            </DashboardCardHeader>

            <DashboardCardContent>
              <Accordion
                type="multiple"
                defaultValue={hasActiveSubscription ? ['subscription'] : ['plans']}
                className="w-full space-y-4"
              >
                {/* Subscription Status Section */}
                <AccordionItem
                  value="subscription"
                  className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200/60 dark:border-slate-700/60 rounded-xl shadow-sm hover:shadow-md transition-all duration-300"
                >
                  <AccordionTrigger className="px-6 py-4 hover:no-underline [&[data-state=open]]:border-b [&[data-state=open]]:border-slate-200/60 [&[data-state=open]]:dark:border-slate-700/60">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-purple-600 rounded-lg flex items-center justify-center shadow-sm">
                        <Crown className="w-4 h-4 text-white" />
                      </div>
                      <div className="text-left">
                        <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100">
                          Subscription Status
                        </h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          Your current plan and billing information
                        </p>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-6 space-y-6">
                    {/* Subscription Overview */}
                    <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-6">
                      <ModernSubscriptionCard />
                    </div>

                    {hasActiveSubscription && (
                      <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-6">
                        <h4 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-4">
                          Subscription Actions
                        </h4>
                        <SubscriptionActionsCard />
                      </div>
                    )}
                  </AccordionContent>
                </AccordionItem>

                {/* Pricing Plans Section */}
                <AccordionItem
                  value="plans"
                  className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200/60 dark:border-slate-700/60 rounded-xl shadow-sm hover:shadow-md transition-all duration-300"
                >
                  <AccordionTrigger className="px-6 py-4 hover:no-underline [&[data-state=open]]:border-b [&[data-state=open]]:border-slate-200/60 [&[data-state=open]]:dark:border-slate-700/60">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center shadow-sm">
                        <CreditCard className="w-4 h-4 text-white" />
                      </div>
                      <div className="text-left">
                        <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100">
                          Available Plans
                        </h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          {hasActiveSubscription
                            ? 'Upgrade or change your current subscription plan'
                            : 'Select a plan that fits your certification journey'}
                        </p>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-6 space-y-6">
                    <Card className="border border-slate-100 dark:border-slate-700/50 shadow-sm hover:shadow-md transition-shadow duration-200">
                      <CardHeader className="pb-4">
                        <CardTitle className="text-lg font-normal text-slate-900 dark:text-slate-100">
                          Choose Your Plan
                        </CardTitle>
                        <CardDescription className="text-sm text-slate-600 dark:text-slate-300">
                          {hasActiveSubscription
                            ? 'Upgrade or change your current subscription plan'
                            : 'Select a plan that fits your certification journey'}
                        </CardDescription>
                      </CardHeader>
                    </Card>

                    <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200/60 dark:border-slate-700/60 rounded-xl p-6 shadow-lg">
                      <PricingPlansGrid />
                    </div>

                    {!hasActiveSubscription && (
                      <Card className="bg-gradient-to-r from-blue-50 to-violet-50 dark:from-blue-950/20 dark:to-violet-950/20 border border-blue-200/50 dark:border-blue-800/30 shadow-sm">
                        <CardContent className="pt-6">
                          <div className="text-center">
                            <h4 className="text-lg font-medium text-blue-900 dark:text-blue-100 mb-2">
                              🎯 Free Trial Available
                            </h4>
                            <p className="text-sm text-blue-700 dark:text-blue-200 leading-relaxed">
                              Start with a 14-day free trial on any paid plan. No commitment
                              required.
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </AccordionContent>
                </AccordionItem>

                {/* Billing History Section */}
                <AccordionItem
                  value="history"
                  className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200/60 dark:border-slate-700/60 rounded-xl shadow-sm hover:shadow-md transition-all duration-300"
                >
                  <AccordionTrigger className="px-6 py-4 hover:no-underline [&[data-state=open]]:border-b [&[data-state=open]]:border-slate-200/60 [&[data-state=open]]:dark:border-slate-700/60">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center shadow-sm">
                        <History className="w-4 h-4 text-white" />
                      </div>
                      <div className="text-left">
                        <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100">
                          Billing History
                        </h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          View your payment history and transaction details
                        </p>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-6 space-y-6">
                    <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-6">
                      <h4 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-2">
                        Download Invoices
                      </h4>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </DashboardCardContent>
          </DashboardCard>
        ) : (
          // Feature Disabled Fallback for dedicated billing page
          <DashboardCard>
            <DashboardCardContent>
              <div className="text-center py-12">
                <AlertTriangle className="w-16 h-16 text-amber-500 mx-auto mb-6" />
                <h2 className="text-2xl font-medium text-slate-900 dark:text-slate-100 mb-4">
                  Billing System Temporarily Unavailable
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                  We apologize for any inconvenience and appreciate your patience.
                </p>
              </div>
            </DashboardCardContent>
          </DashboardCard>
        )}
      </div>
    </div>
  );
}
