/**
 * Enhanced pricing components with unified account integration
 * Replaces separate subscription/customer components with unified approach
 */

import React from 'react';
import { Button } from '@/src/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/src/components/ui/card';
import { Badge } from '@/src/components/ui/badge';
import { Check, Crown, Zap } from 'lucide-react';
import { useEnhancedCheckoutFlow } from '../hooks/useEnhancedCheckoutFlow';
import { usePricingPlans } from '../swr';
import { cn } from '@/src/lib/utils';

interface PricingCardProps {
  planId: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  interval: 'month' | 'year';
  features: string[];
  isPopular?: boolean;
  trialDays?: number;
  className?: string;
}

export function PricingCard({
  planId,
  title,
  description,
  price,
  currency,
  interval,
  features,
  isPopular = false,
  trialDays,
  className,
}: PricingCardProps) {
  const {
    hasActiveSubscription,
    subscriptionInfo,
    canStartSubscription,
    startCheckoutFlow,
    isLoading,
    goToBilling,
  } = useEnhancedCheckoutFlow();

  const handleSubscribe = async () => {
    if (hasActiveSubscription && !subscriptionInfo?.isCanceled) {
      goToBilling();
      return;
    }

    await startCheckoutFlow(planId, trialDays);
  };

  const isCurrentPlan = subscriptionInfo?.id === planId && hasActiveSubscription;
  const isCanceled = subscriptionInfo?.isCanceled;

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
      minimumFractionDigits: 0,
    }).format(amount / 100);
  };

  const getButtonText = () => {
    if (isCurrentPlan && !isCanceled) return 'Current Plan';
    if (isCurrentPlan && isCanceled) return 'Reactivate';
    if (hasActiveSubscription && !isCanceled) return 'Switch Plan';
    if (trialDays) return `Start ${trialDays}-Day Trial`;
    return 'Get Started';
  };

  const getButtonVariant = () => {
    if (isCurrentPlan && !isCanceled) return 'outline' as const;
    if (isPopular) return 'default' as const;
    return 'outline' as const;
  };

  return (
    <Card className={cn('relative', className, isPopular && 'border-primary shadow-lg')}>
      {isPopular && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <Badge className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground">
            <Crown className="w-3 h-3 mr-1" />
            Most Popular
          </Badge>
        </div>
      )}

      {isCurrentPlan && (
        <div className="absolute -top-3 right-4">
          <Badge
            variant="secondary"
            className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
          >
            <Check className="w-3 h-3 mr-1" />
            Active
          </Badge>
        </div>
      )}

      <CardHeader className="text-center">
        <CardTitle className="text-2xl">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
        <div className="mt-4">
          <span className="text-4xl font-bold">{formatPrice(price)}</span>
          <span className="text-muted-foreground">/{interval}</span>
        </div>
        {trialDays && (
          <div className="flex items-center justify-center mt-2">
            <Zap className="w-4 h-4 mr-1 text-primary" />
            <span className="text-sm text-primary">{trialDays} days free trial</span>
          </div>
        )}
      </CardHeader>

      <CardContent>
        <ul className="space-y-3">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start">
              <Check className="w-5 h-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
              <span className="text-sm">{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>

      <CardFooter>
        <Button
          onClick={handleSubscribe}
          variant={getButtonVariant()}
          size="lg"
          className="w-full"
          disabled={isLoading || (isCurrentPlan && !isCanceled)}
        >
          {isLoading ? 'Processing...' : getButtonText()}
        </Button>
      </CardFooter>
    </Card>
  );
}

/**
 * Pricing section component that displays all available plans
 */
export function PricingPlansGrid() {
  const { data: pricingData, isLoading, error } = usePricingPlans();
  const { accountData, hasActiveSubscription } = useEnhancedCheckoutFlow();

  if (isLoading) {
    return (
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-6 bg-muted rounded w-3/4 mx-auto"></div>
              <div className="h-4 bg-muted rounded w-full mt-2"></div>
              <div className="h-8 bg-muted rounded w-1/2 mx-auto mt-4"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[1, 2, 3, 4].map((j) => (
                  <div key={j} className="flex items-center">
                    <div className="w-5 h-5 bg-muted rounded mr-3"></div>
                    <div className="h-4 bg-muted rounded flex-1"></div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <div className="w-full h-10 bg-muted rounded"></div>
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">
          Unable to load pricing plans. Please try again later.
        </p>
      </div>
    );
  }

  const plans = pricingData?.data || [];

  return (
    <div className="space-y-8">
      {/* Current subscription status */}
      {hasActiveSubscription && accountData && (
        <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">Current Subscription</h3>
                <p className="text-sm text-muted-foreground">
                  {accountData.stripe_plan_name} - {accountData.subscription_status}
                </p>
              </div>
              <Badge variant="secondary" className="bg-primary/20 text-primary">
                Active
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Pricing cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {plans.map((plan) => (
          <PricingCard
            key={plan.id}
            planId={plan.id}
            title={plan.name}
            description={plan.description}
            price={plan.amount}
            currency={plan.currency}
            interval={plan.interval}
            features={plan.features}
            isPopular={plan.popular}
            trialDays={plan.trial_days}
          />
        ))}
      </div>
    </div>
  );
}

/**
 * Subscription status component for dashboard/billing pages
 */
export function SubscriptionStatusCard() {
  const {
    accountData,
    subscriptionInfo,
    hasActiveSubscription,
    isTrialing,
    isCanceled,
    goToBilling,
    refreshAccountData,
  } = useEnhancedCheckoutFlow();

  if (!accountData || !hasActiveSubscription) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center">
            <h3 className="font-semibold text-lg mb-2">No Active Subscription</h3>
            <p className="text-muted-foreground mb-4">
              Subscribe to unlock premium features and get the most out of Certifai.
            </p>
            <Button onClick={() => (window.location.href = '/pricing')}>View Pricing Plans</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString();
  };

  const formatAmount = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
      minimumFractionDigits: 0,
    }).format(amount / 100);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Subscription Details</span>
          {isTrialing && (
            <Badge
              variant="secondary"
              className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
            >
              <Zap className="w-3 h-3 mr-1" />
              Trial
            </Badge>
          )}
          {isCanceled && <Badge variant="destructive">Canceled</Badge>}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground">Plan</label>
            <p className="font-semibold">{subscriptionInfo?.planName}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">Status</label>
            <p className="font-semibold capitalize">{subscriptionInfo?.status}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">Amount</label>
            <p className="font-semibold">
              {subscriptionInfo?.amount && subscriptionInfo?.currency
                ? formatAmount(subscriptionInfo.amount, subscriptionInfo.currency)
                : 'N/A'}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">
              {isTrialing ? 'Trial Ends' : 'Next Billing'}
            </label>
            <p className="font-semibold">
              {isTrialing && subscriptionInfo?.trialEnd
                ? formatDate(subscriptionInfo.trialEnd)
                : subscriptionInfo?.currentPeriodEnd
                ? formatDate(subscriptionInfo.currentPeriodEnd)
                : 'N/A'}
            </p>
          </div>
        </div>

        {isCanceled && (
          <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg dark:bg-orange-900/20 dark:border-orange-800">
            <p className="text-sm text-orange-700 dark:text-orange-300">
              Your subscription will end on{' '}
              {subscriptionInfo?.currentPeriodEnd
                ? formatDate(subscriptionInfo.currentPeriodEnd)
                : 'the current billing period'}
              . You can reactivate it anytime before then.
            </p>
          </div>
        )}
      </CardContent>
      <CardFooter className="gap-2">
        <Button onClick={goToBilling} variant="outline">
          Manage Billing
        </Button>
        <Button onClick={() => refreshAccountData()} variant="ghost" size="sm">
          Refresh
        </Button>
      </CardFooter>
    </Card>
  );
}
