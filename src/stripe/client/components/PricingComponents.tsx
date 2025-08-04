/**
 * Stripe React components for checkout flow
 * Following Certifai's design patterns and shadcn/ui conventions
 */

'use client';

import React from 'react';
import { Button } from '@/src/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/src/components/ui/card';
import { Badge } from '@/src/components/ui/badge';
import { Alert, AlertDescription } from '@/src/components/ui/alert';
import { Skeleton } from '@/src/components/ui/skeleton';
import { Check, Clock, X, ExternalLink, CreditCard, Crown, Zap } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { toast } from 'sonner';
import { usePricingPlans, useSubscriptionState, type PricingPlan } from '../swr';
import { useCheckoutFlow } from '../hooks/useCheckoutFlow';
import { STRIPE_URLS } from '../../config';

interface PricingCardProps {
  plan: PricingPlan;
  isCurrentPlan?: boolean;
  isPopular?: boolean;
  onSelectPlan: (priceId: string) => void;
  isLoading?: boolean;
  disabled?: boolean;
}

/**
 * Individual pricing plan card component
 */
export function PricingCard({
  plan,
  isCurrentPlan = false,
  isPopular = false,
  onSelectPlan,
  isLoading = false,
  disabled = false,
}: PricingCardProps) {
  const formatPrice = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
      minimumFractionDigits: 0,
    }).format(amount / 100);
  };

  const getPeriodText = (interval: string) => {
    return interval === 'year' ? 'yearly' : 'monthly';
  };

  return (
    <Card
      className={cn(
        'relative overflow-hidden transition-all duration-200 hover:shadow-lg border border-slate-200 dark:border-slate-700',
        isPopular && 'border-primary ring-2 ring-primary/20',
        isCurrentPlan && 'bg-primary/5 dark:bg-primary/10',
      )}
    >
      {isPopular && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <Badge className="bg-primary text-primary-foreground shadow-lg">
            <Crown className="w-3 h-3 mr-1" />
            Most Popular
          </Badge>
        </div>
      )}

      <CardHeader className="text-center pb-4">
        <CardTitle className="text-xl font-bold text-slate-900 dark:text-slate-100">
          {plan.name}
        </CardTitle>
        <CardDescription className="text-sm text-slate-600 dark:text-slate-400">
          {plan.description}
        </CardDescription>

        <div className="mt-4">
          <div className="text-3xl font-bold text-slate-900 dark:text-slate-100">
            {formatPrice(plan.amount, plan.currency)}
            <span className="text-lg font-normal text-slate-500 dark:text-slate-400">
              /{plan.interval}
            </span>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Billed {getPeriodText(plan.interval)}
          </p>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Features list */}
        <div className="space-y-3">
          {plan.features.map((feature, index) => (
            <div key={index} className="flex items-start gap-2">
              <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
              <span className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                {feature}
              </span>
            </div>
          ))}
        </div>

        {/* Action button */}
        <div className="pt-4">
          {isCurrentPlan ? (
            <Button variant="outline" className="w-full" disabled>
              <Check className="w-4 h-4 mr-2" />
              Current Plan
            </Button>
          ) : (
            <Button
              className={cn(
                'w-full font-semibold',
                isPopular
                  ? 'bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg'
                  : 'bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-700 dark:hover:bg-slate-600',
              )}
              onClick={() => onSelectPlan(plan.id)}
              disabled={disabled || isLoading}
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                  Processing...
                </>
              ) : (
                <>
                  <CreditCard className="w-4 h-4 mr-2" />
                  Get Started
                </>
              )}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Pricing plans grid component
 */
export function PricingPlansGrid() {
  const { data: plansData, error, isLoading } = usePricingPlans();
  const { subscription, hasActiveSubscription } = useSubscriptionState();
  const { startCheckoutFlow, isProcessing } = useCheckoutFlow();

  const handleSelectPlan = async (priceId: string) => {
    await startCheckoutFlow(priceId, 0); // 0-day trial
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="overflow-hidden">
            <CardHeader className="text-center pb-4">
              <Skeleton className="h-6 w-24 mx-auto mb-2" />
              <Skeleton className="h-4 w-32 mx-auto mb-4" />
              <Skeleton className="h-8 w-20 mx-auto" />
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[1, 2, 3, 4].map((j) => (
                  <div key={j} className="flex items-center gap-2">
                    <Skeleton className="h-4 w-4 rounded-full" />
                    <Skeleton className="h-4 flex-1" />
                  </div>
                ))}
              </div>
              <Skeleton className="h-10 w-full mt-6" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Alert className="max-w-md mx-auto">
        <X className="h-4 w-4" />
        <AlertDescription>
          Failed to load pricing plans. Please refresh the page or contact support.
        </AlertDescription>
      </Alert>
    );
  }

  const plans = plansData?.data || [];

  if (plans.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
          No pricing plans available
        </h3>
        <p className="text-slate-600 dark:text-slate-400">
          Please check back later or contact support.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {plans.map((plan) => (
        <PricingCard
          key={plan.id}
          plan={plan}
          isCurrentPlan={hasActiveSubscription && subscription?.plan_id === plan.id}
          isPopular={plan.popular}
          onSelectPlan={handleSelectPlan}
          isLoading={isProcessing}
          disabled={hasActiveSubscription}
        />
      ))}
    </div>
  );
}

/**
 * Subscription status card component
 */
export function SubscriptionStatusCard() {
  const { subscription, hasActiveSubscription, isTrialing, isCanceled, isLoading } =
    useSubscriptionState();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-48" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-6 w-16" />
            </div>
            <div className="flex justify-between items-center">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-32" />
            </div>
            <Skeleton className="h-10 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!hasActiveSubscription || !subscription) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-primary" />
            No Active Subscription
          </CardTitle>
          <CardDescription>
            You don&apos;t have an active subscription. Choose a plan to get started.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatPrice = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
      minimumFractionDigits: 0,
    }).format(amount / 100);
  };

  const getStatusBadge = () => {
    if (isTrialing) {
      return (
        <Badge
          variant="secondary"
          className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
        >
          <Clock className="w-3 h-3 mr-1" />
          Trial
        </Badge>
      );
    }

    if (isCanceled) {
      return (
        <Badge variant="destructive">
          <X className="w-3 h-3 mr-1" />
          Canceling
        </Badge>
      );
    }

    return (
      <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
        <Check className="w-3 h-3 mr-1" />
        Active
      </Badge>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Crown className="w-5 h-5 text-primary" />
            Current Subscription
          </span>
          {getStatusBadge()}
        </CardTitle>
        <CardDescription>Manage your subscription and billing preferences</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Plan</label>
            <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              {subscription.plan_name}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Price</label>
            <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              {formatPrice(subscription.amount, subscription.currency)}
            </p>
          </div>
        </div>

        {isCanceled && (
          <Alert>
            <X className="h-4 w-4" />
            <AlertDescription>
              Your subscription will be canceled on {formatDate(subscription.current_period_end)}.
              You&apos;ll still have access until then.
            </AlertDescription>
          </Alert>
        )}

        {isTrialing && subscription.trial_end && (
          <Alert>
            <Clock className="h-4 w-4" />
            <AlertDescription>
              Your trial ends on {formatDate(subscription.trial_end)}. Your subscription will
              automatically start after the trial.
            </AlertDescription>
          </Alert>
        )}

        <div className="pt-2">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Next billing date: {formatDate(subscription.current_period_end)}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
