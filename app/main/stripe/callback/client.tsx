'use client';

import React, { useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/src/components/ui/card';
import { Button } from '@/src/components/ui/button';
import { CheckCircle, XCircle, Loader2, ArrowLeft } from 'lucide-react';
import { useStripeCallback } from '@/src/stripe/client/hooks';

/**
 * Stripe checkout callback page
 * Handles success and cancel redirects from Stripe
 */
export default function StripeCallbackClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { handleCheckoutSuccess, handleCheckoutCancel, isProcessing } = useStripeCallback();

  const sessionId = searchParams.get('session_id');
  const canceled = searchParams.get('canceled');

  useEffect(() => {
    if (canceled === 'true') {
      handleCheckoutCancel();
    } else if (sessionId) {
      handleCheckoutSuccess(sessionId);
    } else {
      // No valid parameters, redirect to billing
      router.push('/main/billing');
    }
  }, [sessionId, canceled, handleCheckoutSuccess, handleCheckoutCancel, router]);

  const handleReturnToBilling = () => {
    router.push('/main/billing');
  };

  const handleGoToDashboard = () => {
    router.push('/main');
  };

  // Show processing state
  if (isProcessing || (!sessionId && !canceled)) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-violet-50/30 dark:from-slate-900 dark:via-slate-800 dark:to-violet-950/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="max-w-md mx-auto mt-20">
            <Card>
              <CardHeader className="text-center">
                <div className="mx-auto w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-4">
                  <Loader2 className="w-8 h-8 text-blue-600 dark:text-blue-400 animate-spin" />
                </div>
                <CardTitle>Processing Payment</CardTitle>
                <CardDescription>Please wait while we confirm your subscription...</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // Show success state
  if (sessionId && !canceled) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-violet-50/30 dark:from-slate-900 dark:via-slate-800 dark:to-violet-950/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="max-w-md mx-auto mt-20">
            <Card>
              <CardHeader className="text-center">
                <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>
                <CardTitle className="text-green-900 dark:text-green-100">
                  Payment Successful!
                </CardTitle>
                <CardDescription>
                  Your subscription has been activated successfully.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center text-sm text-slate-600 dark:text-slate-400">
                  <p>
                    Welcome to Certifai! Your subscription is now active and you have access to all
                    premium features.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  <Button onClick={handleGoToDashboard} className="w-full">
                    Go to Dashboard
                  </Button>
                  <Button variant="outline" onClick={handleReturnToBilling} className="w-full">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Billing
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // Show cancel state
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-violet-50/30 dark:from-slate-900 dark:via-slate-800 dark:to-violet-950/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-md mx-auto mt-20">
          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center mb-4">
                <XCircle className="w-8 h-8 text-orange-600 dark:text-orange-400" />
              </div>
              <CardTitle className="text-orange-900 dark:text-orange-100">
                Payment Canceled
              </CardTitle>
              <CardDescription>Your payment was canceled. No charges were made.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center text-sm text-slate-600 dark:text-slate-400">
                <p>You can try again anytime. Your cart is still saved and ready for checkout.</p>
              </div>

              <div className="grid grid-cols-1 gap-3">
                <Button onClick={handleReturnToBilling} className="w-full">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Billing
                </Button>
                <Button variant="outline" onClick={handleGoToDashboard} className="w-full">
                  Go to Dashboard
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
