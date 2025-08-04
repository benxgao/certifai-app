/**
 * Subscription management components
 * Following Certifai's design patterns
 */

'use client';

import React, { useState } from 'react';
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
import { Skeleton } from '@/src/components/ui/skeleton';
import {
  ExternalLink,
  Settings,
  Pause,
  Play,
  X,
  RotateCcw,
  AlertTriangle,
  Calendar,
  DollarSign,
} from 'lucide-react';
import { toast } from 'sonner';
import {
  useSubscriptionState,
  useCreatePortalSession,
  useCancelSubscription,
  useResumeSubscription,
  useReactivateSubscription,
  useSubscriptionHistory,
} from '../swr';
import { STRIPE_URLS } from '../../config';

/**
 * Subscription management card with actions
 */
export function SubscriptionManagementCard() {
  const {
    subscription,
    hasActiveSubscription,
    isTrialing,
    isCanceled,
    isLoading,
    refreshSubscription,
  } = useSubscriptionState();

  const { trigger: createPortal, isMutating: isCreatingPortal } = useCreatePortalSession();
  const { trigger: cancelSubscription, isMutating: isCanceling } = useCancelSubscription();
  const { trigger: resumeSubscription, isMutating: isResuming } = useResumeSubscription();
  const { trigger: reactivateSubscription, isMutating: isReactivating } =
    useReactivateSubscription();

  const [showCancelDialog, setShowCancelDialog] = useState(false);

  const handleOpenPortal = async () => {
    try {
      const result = await createPortal({
        return_url: STRIPE_URLS.return,
      });

      if (result.success && result.data?.portal_url) {
        window.open(result.data.portal_url, '_blank');
      } else {
        toast.error('Failed to open billing portal. Please try again.');
      }
    } catch (error) {
      console.error('Portal error:', error);
      toast.error('Something went wrong. Please try again.');
    }
  };

  const handleCancelSubscription = async () => {
    try {
      const result = await cancelSubscription({
        cancel_at_period_end: true,
      });

      if (result.success) {
        toast.success(
          'Subscription canceled. You&apos;ll have access until the end of your billing period.',
        );
        refreshSubscription();
        setShowCancelDialog(false);
      } else {
        toast.error('Failed to cancel subscription. Please try again.');
      }
    } catch (error) {
      console.error('Cancel error:', error);
      toast.error('Something went wrong. Please try again.');
    }
  };

  const handleResumeSubscription = async () => {
    try {
      const result = await resumeSubscription({});

      if (result.success) {
        toast.success('Subscription resumed successfully!');
        refreshSubscription();
      } else {
        toast.error('Failed to resume subscription. Please try again.');
      }
    } catch (error) {
      console.error('Resume error:', error);
      toast.error('Something went wrong. Please try again.');
    }
  };

  const handleReactivateSubscription = async () => {
    try {
      const result = await reactivateSubscription({});

      if (result.success) {
        toast.success('Subscription reactivated successfully!');
        refreshSubscription();
      } else {
        toast.error('Failed to reactivate subscription. Please try again.');
      }
    } catch (error) {
      console.error('Reactivate error:', error);
      toast.error('Something went wrong. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
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
            <Settings className="w-5 h-5 text-slate-500" />
            Subscription Management
          </CardTitle>
          <CardDescription>
            No active subscription to manage. Choose a plan to get started.
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

  const canReactivate = isCanceled && subscription.status === 'active';

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="w-5 h-5 text-primary" />
          Subscription Management
        </CardTitle>
        <CardDescription>
          Manage your subscription, update payment methods, and view billing history
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Quick actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Button
            variant="outline"
            onClick={handleOpenPortal}
            disabled={isCreatingPortal}
            className="justify-start"
          >
            {isCreatingPortal ? (
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
            ) : (
              <ExternalLink className="w-4 h-4 mr-2" />
            )}
            Billing Portal
          </Button>

          {isCanceled ? (
            canReactivate ? (
              <Button
                variant="default"
                onClick={handleReactivateSubscription}
                disabled={isReactivating}
                className="justify-start bg-green-600 hover:bg-green-700"
              >
                {isReactivating ? (
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                ) : (
                  <RotateCcw className="w-4 h-4 mr-2" />
                )}
                Reactivate
              </Button>
            ) : (
              <Button
                variant="default"
                onClick={handleResumeSubscription}
                disabled={isResuming}
                className="justify-start bg-green-600 hover:bg-green-700"
              >
                {isResuming ? (
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                ) : (
                  <Play className="w-4 h-4 mr-2" />
                )}
                Resume
              </Button>
            )
          ) : (
            <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  className="justify-start border-red-200 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/20"
                >
                  <Pause className="w-4 h-4 mr-2" />
                  Cancel Subscription
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-orange-500" />
                    Cancel Subscription
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to cancel your subscription? You&apos;ll still have access
                    until the end of your current billing period (
                    {formatDate(subscription.current_period_end)}).
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Keep Subscription</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleCancelSubscription}
                    disabled={isCanceling}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    {isCanceling ? (
                      <>
                        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                        Canceling...
                      </>
                    ) : (
                      'Cancel Subscription'
                    )}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>

        {/* Status alerts */}
        {isCanceled && (
          <Alert>
            <X className="h-4 w-4" />
            <AlertDescription>
              Your subscription is set to cancel on {formatDate(subscription.current_period_end)}.
              You can reactivate it anytime before then.
            </AlertDescription>
          </Alert>
        )}

        {isTrialing && subscription.trial_end && (
          <Alert>
            <Calendar className="h-4 w-4" />
            <AlertDescription>
              Your trial ends on {formatDate(subscription.trial_end)}. Make sure to add a payment
              method before then.
            </AlertDescription>
          </Alert>
        )}

        {/* Quick info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
            <Calendar className="w-4 h-4" />
            <span>Next billing: {formatDate(subscription.current_period_end)}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
            <DollarSign className="w-4 h-4" />
            <span>
              {new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: subscription.currency.toUpperCase(),
                minimumFractionDigits: 0,
              }).format(subscription.amount / 100)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Subscription history component
 */
export function SubscriptionHistoryCard() {
  const { data: historyData, error, isLoading } = useSubscriptionHistory();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex justify-between items-center">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-6 w-16" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Subscription History</CardTitle>
          <CardDescription>Failed to load subscription history</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const subscriptions = historyData?.data || [];

  if (subscriptions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Subscription History</CardTitle>
          <CardDescription>No subscription history found</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: any; className?: string }> = {
      active: {
        variant: 'default',
        className: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      },
      trialing: { variant: 'secondary' },
      canceled: { variant: 'destructive' },
      incomplete: { variant: 'destructive' },
      past_due: { variant: 'destructive' },
      unpaid: { variant: 'destructive' },
    };

    const config = variants[status] || { variant: 'secondary' };

    return (
      <Badge variant={config.variant} className={config.className}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Subscription History</CardTitle>
        <CardDescription>View your past and current subscriptions</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {subscriptions.map((subscription) => (
            <div
              key={subscription.subscription_id}
              className="flex justify-between items-center p-3 border border-slate-200 dark:border-slate-700 rounded-lg"
            >
              <div>
                <p className="font-medium text-slate-900 dark:text-slate-100">
                  {subscription.plan_name}
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Created {new Date(subscription.created_at).toLocaleDateString()}
                </p>
              </div>
              <div className="text-right">
                {getStatusBadge(subscription.status)}
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  {new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: subscription.currency.toUpperCase(),
                    minimumFractionDigits: 0,
                  }).format(subscription.amount / 100)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
