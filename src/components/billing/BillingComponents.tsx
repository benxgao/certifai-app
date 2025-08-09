'use client';

/**
 * Modern billing components using AccountContext
 * Replaces old Stripe-specific components with context-aware ones
 */

import React, { useState } from 'react';
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/src/components/ui/alert-dialog';
import { toast } from 'sonner';
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
  X,
  RotateCcw,
} from 'lucide-react';
import {
  useAccount,
  useSubscriptionStatus,
  usePlanInfo,
  useAccountInfo,
} from '@/src/context/AccountContext';
import {
  useCreatePortalSession,
  useCancelSubscription,
  useResumeSubscription,
} from '@/src/stripe/client/swr';

/**
 * Modern subscription status card with detailed information
 */
export function ModernSubscriptionCard() {
  const { isLoading, error } = useAccount();
  const { hasActiveSubscription, isTrialing, isCanceled } = useSubscriptionStatus();
  const {
    planName,
    planAmount,
    planCurrency,
    currentPeriodStart,
    currentPeriodEnd,
    trialEnd,
    cancelAtPeriodEnd,
  } = usePlanInfo();
  const { userEmail } = useAccountInfo();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-6 h-6 animate-spin text-violet-600" />
        <span className="ml-2 text-slate-600 dark:text-slate-400">
          Loading subscription details...
        </span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center gap-3 text-red-600 dark:text-red-400 p-4 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-800">
        <AlertTriangle className="w-5 h-5" />
        <span>Error loading subscription data. Please try again.</span>
      </div>
    );
  }

  const formatPrice = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(amount / 100);
  };

  const formatDate = (timestamp: number | null | undefined) => {
    if (!timestamp || timestamp === 0) {
      return 'N/A';
    }
    return format(new Date(timestamp * 1000), 'PPP');
  };

  // Helper function to determine when subscription ends based on cancellation status
  const getSubscriptionEndDate = () => {
    // For subscriptions with cancel_at_period_end = true,
    // the subscription will end at the current_period_end
    if (cancelAtPeriodEnd && currentPeriodEnd) {
      return currentPeriodEnd;
    }
    // For active subscriptions, show the next renewal date (current_period_end)
    return currentPeriodEnd;
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div>
            <h4 className="text-base font-medium text-slate-900 dark:text-slate-100">
              Current Plan
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-300">{userEmail}</p>
          </div>
        </div>

        {hasActiveSubscription ? (
          <Badge
            variant={isCanceled ? 'destructive' : isTrialing ? 'secondary' : 'default'}
            className="flex items-center gap-1"
          >
            {isCanceled ? (
              <>
                <AlertTriangle className="w-3 h-3" />
                Canceled
              </>
            ) : isTrialing ? (
              <>
                <Clock className="w-3 h-3" />
                Trial
              </>
            ) : (
              <>
                <CheckCircle className="w-3 h-3" />
                Active
              </>
            )}
          </Badge>
        ) : (
          <Badge variant="outline">Free Plan</Badge>
        )}
      </div>

      <div className="space-y-4">
        {/* Current Plan and Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-medium text-slate-900 dark:text-slate-100 mb-2">Plan Details</h4>
            <p className="text-lg font-semibold text-violet-600 dark:text-violet-400">
              {planName || 'Free Plan'}
            </p>
            {planAmount && planCurrency && (
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {formatPrice(planAmount, planCurrency)}/month
              </p>
            )}
          </div>

          <div>
            <h4 className="font-medium text-slate-900 dark:text-slate-100 mb-2">Billing Status</h4>
            <div className="space-y-1">
              {isTrialing && trialEnd && (
                <p className="text-sm text-blue-600 dark:text-blue-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  Trial ends {formatDate(trialEnd)}
                </p>
              )}

              {isCanceled && getSubscriptionEndDate() && (
                <p className="text-sm text-orange-600 dark:text-orange-400 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" />
                  Cancels on {formatDate(getSubscriptionEndDate())}
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
      </div>
    </div>
  );
}

/**
 * Subscription actions card (cancel, resume, etc.)
 */
export function SubscriptionActionsCard() {
  const { hasActiveSubscription, isCanceled } = useSubscriptionStatus();
  const { planName, currentPeriodStart, currentPeriodEnd, cancelAtPeriodEnd } = usePlanInfo();
  const { refreshAccount } = useAccountInfo();
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);

  // Stripe mutation hooks
  const { trigger: cancelSubscription, isMutating: isCanceling } = useCancelSubscription();
  const { trigger: resumeSubscription, isMutating: isResuming } = useResumeSubscription();

  const formatDate = (timestamp: number | null | undefined) => {
    if (!timestamp || timestamp === 0) {
      return 'N/A';
    }
    return format(new Date(timestamp * 1000), 'PPP');
  };

  // Helper function to determine when subscription ends based on cancellation status
  const getSubscriptionEndDate = () => {
    // For subscriptions with cancel_at_period_end = true,
    // the subscription will end at the current_period_end
    if (cancelAtPeriodEnd && currentPeriodEnd) {
      return currentPeriodEnd;
    }
    // For active subscriptions, show the next renewal date (current_period_end)
    return currentPeriodEnd;
  };

  const handleCancelSubscription = async () => {
    try {
      const response = await cancelSubscription({
        cancel_at_period_end: true,
      });

      if (response.success) {
        toast.success('Subscription canceled', {
          description: `Your subscription will remain active until ${formatDate(
            getSubscriptionEndDate(),
          )} and then will not renew.`,
        });

        // Give Stripe webhooks a moment to process the cancellation
        // then refresh account data to reflect the latest changes
        setTimeout(() => {
          refreshAccount();
        }, 2000);
      } else {
        throw new Error('Failed to cancel subscription');
      }
    } catch (error) {
      console.error('Cancel subscription error:', error);
      toast.error('Failed to cancel subscription', {
        description:
          error instanceof Error ? error.message : 'Please try again or contact support.',
      });
    } finally {
      setIsConfirmDialogOpen(false);
    }
  };

  const handleResumeSubscription = async () => {
    try {
      const response = await resumeSubscription({});

      if (response.success) {
        toast.success('Subscription resumed', {
          description: 'Your subscription will continue to renew automatically.',
        });

        // Give Stripe webhooks a moment to process the resumption
        // then refresh account data to reflect the latest changes
        setTimeout(() => {
          refreshAccount();
        }, 2000);
      } else {
        throw new Error('Failed to resume subscription');
      }
    } catch (error) {
      console.error('Resume subscription error:', error);
      toast.error('Failed to resume subscription', {
        description:
          error instanceof Error ? error.message : 'Please try again or contact support.',
      });
    }
  };

  if (!hasActiveSubscription) {
    return (
      <div className="text-center py-6">
        <p className="text-slate-600 dark:text-slate-400">
          Subscribe to a plan to access subscription management features.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Subscription Management Actions */}
      <div className="space-y-4">
        {isCanceled ? (
          /* Resume Subscription Section */
          <div className="flex items-center justify-between p-4 bg-orange-50 dark:bg-orange-950/20 rounded-lg border border-orange-200 dark:border-orange-800">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-orange-600 dark:text-orange-400 mt-0.5" />
              <div>
                <h5 className="font-medium text-orange-800 dark:text-orange-200 mb-1">
                  Subscription Canceled
                </h5>
                <p className="text-sm text-orange-700 dark:text-orange-300">
                  Your subscription will end on {formatDate(getSubscriptionEndDate())}. You can
                  resume it anytime before this date.
                </p>
              </div>
            </div>
            <Button
              onClick={handleResumeSubscription}
              disabled={isResuming}
              variant="outline"
              size="sm"
              className="border-orange-300 hover:bg-orange-100 dark:border-orange-700 dark:hover:bg-orange-900/20"
            >
              {isResuming ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <RotateCcw className="w-4 h-4 mr-2" />
              )}
              {isResuming ? 'Resuming...' : 'Resume'}
            </Button>
          </div>
        ) : (
          /* Cancel Subscription Section */
          <div className="flex items-center justify-between">
            <div>
              <h5 className="font-medium text-slate-900 dark:text-slate-100">
                Cancel Subscription
              </h5>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Cancel your subscription at the end of the current billing period
              </p>
            </div>

            <AlertDialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
              <AlertDialogTrigger asChild>
                <Button variant="secondary" size="sm" className="">
                  Cancel Plan
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Cancel Your Subscription?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to cancel your <strong>{planName}</strong> subscription?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="space-y-3 px-6 pb-4">
                  <p className="text-sm text-muted-foreground">
                    Your subscription will remain active until{' '}
                    <strong>{formatDate(getSubscriptionEndDate())}</strong> and then will not renew.
                  </p>
                  <p className="text-amber-600 dark:text-amber-400 text-sm">
                    You can resume your subscription anytime before the end date.
                  </p>
                </div>
                <AlertDialogFooter>
                  <AlertDialogCancel>Keep Subscription</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleCancelSubscription}
                    disabled={isCanceling}
                    className="bg-red-600 hover:bg-red-700 text-white"
                  >
                    {isCanceling ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        Canceling...
                      </>
                    ) : (
                      'Yes, Cancel Subscription'
                    )}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Subscription history and activity card (simplified)
 */
export function SubscriptionHistoryCard() {
  const { account } = useAccount();

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <Calendar className="w-6 h-6 text-blue-600" />
          <div>
            <CardTitle>Account History</CardTitle>
            <CardDescription>Basic account information</CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {account ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2">
              <span className="text-sm font-medium">Account Created</span>
              <span className="text-sm text-slate-600 dark:text-slate-400">
                {account.created_at ? format(new Date(account.created_at), 'PPP') : 'N/A'}
              </span>
            </div>

            {account.stripe_customer_id && (
              <div className="flex items-center justify-between py-2">
                <span className="text-sm font-medium">Billing Status</span>
                <span className="text-sm text-slate-600 dark:text-slate-400">Active</span>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-6">
            <p className="text-slate-600 dark:text-slate-400">No account history available.</p>
          </div>
        )}

        <div className="bg-blue-50 dark:bg-blue-950/20 p-3 rounded-lg">
          <p className="text-sm text-blue-700 dark:text-blue-300">
            📋 For detailed billing history and invoices, use the billing portal above.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
