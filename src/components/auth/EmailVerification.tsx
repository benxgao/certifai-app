'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { applyActionCode, checkActionCode } from 'firebase/auth';
import { auth } from '@/src/firebase/firebaseWebConfig';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import LandingHeader from '@/src/components/custom/LandingHeader';

export default function EmailVerification() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'expired'>('loading');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const verifyEmail = async () => {
      const mode = searchParams.get('mode');
      const oobCode = searchParams.get('oobCode');

      // Check if this is an email verification request
      if (mode !== 'verifyEmail' || !oobCode) {
        setStatus('error');
        setErrorMessage('Invalid verification link. Please check your email and try again.');
        return;
      }

      try {
        // Check if the action code is valid
        await checkActionCode(auth, oobCode);

        // Apply the email verification
        await applyActionCode(auth, oobCode);

        console.log('Email verified successfully');
        setStatus('success');
      } catch (error: any) {
        console.error('Email verification failed:', error);

        if (error.code === 'auth/expired-action-code') {
          setStatus('expired');
          setErrorMessage('This verification link has expired. Please request a new one.');
        } else if (error.code === 'auth/invalid-action-code') {
          setStatus('error');
          setErrorMessage(
            'This verification link is invalid. Please check your email and try again.',
          );
        } else {
          setStatus('error');
          setErrorMessage('Verification failed. Please try again or contact support.');
        }
      }
    };

    verifyEmail();
  }, [searchParams]);

  const handleContinueToSignIn = () => {
    router.push('/signin?verification=success');
  };

  const handleRequestNewLink = () => {
    router.push('/signin?verification=expired');
  };

  return (
    <div className="flex flex-col min-h-screen">
      <LandingHeader showFeaturesLink={false} />
      <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <Card className="w-full max-w-md bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 shadow-sm">
          <CardHeader className="text-center space-y-4 pb-6">
            {status === 'loading' && (
              <>
                <div className="w-12 h-12 bg-green-100 rounded-full mx-auto flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-green-600 animate-spin"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                </div>
                <div className="space-y-2">
                  <CardTitle className="text-xl font-semibold text-gray-900">
                    Verifying email
                  </CardTitle>
                  <CardDescription className="text-gray-600">
                    Please wait while we verify your email address.
                  </CardDescription>
                </div>
              </>
            )}

            {status === 'success' && (
              <>
                <div className="w-12 h-12 bg-green-100 rounded-full mx-auto flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <div className="space-y-2">
                  <CardTitle className="text-xl font-semibold text-gray-900">
                    Email verified
                  </CardTitle>
                  <CardDescription className="text-gray-600">
                    Your email has been successfully verified.
                  </CardDescription>
                </div>
              </>
            )}

            {(status === 'error' || status === 'expired') && (
              <>
                <div className="w-12 h-12 bg-green-100 rounded-full mx-auto flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </div>
                <div className="space-y-2">
                  <CardTitle className="text-xl font-semibold text-gray-900">
                    {status === 'expired' ? 'Link expired' : 'Verification failed'}
                  </CardTitle>
                  <CardDescription className="text-gray-600">{errorMessage}</CardDescription>
                </div>
              </>
            )}
          </CardHeader>

          <CardContent className="space-y-4 px-6 pb-6">
            {status === 'success' && (
              <Button
                onClick={handleContinueToSignIn}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium"
                size="lg"
              >
                Continue to Sign In
              </Button>
            )}

            {status === 'expired' && (
              <Button
                onClick={handleRequestNewLink}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium"
                size="lg"
              >
                Request New Verification Link
              </Button>
            )}

            {status === 'error' && (
              <div className="space-y-3">
                <Button
                  onClick={handleRequestNewLink}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium"
                  size="lg"
                >
                  Get New Verification Link
                </Button>
                <Button
                  onClick={() => router.push('/support')}
                  variant="outline"
                  className="w-full border-gray-300 hover:bg-gray-50"
                  size="lg"
                >
                  Contact Support
                </Button>
              </div>
            )}

            {status === 'loading' && (
              <div className="bg-green-50 border border-green-200 text-green-800 text-sm p-4 rounded-lg">
                <div className="flex items-center">
                  <svg
                    className="w-4 h-4 mr-2 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Processing your verification request...</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
