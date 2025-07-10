'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  applyActionCode,
  checkActionCode,
  verifyPasswordResetCode,
  confirmPasswordReset,
} from 'firebase/auth';
import { auth } from '@/src/firebase/firebaseWebConfig';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import LandingHeader from '@/src/components/custom/LandingHeader';

export default function EmailActionHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<
    'loading' | 'success' | 'error' | 'expired' | 'password-reset'
  >('loading');
  const [errorMessage, setErrorMessage] = useState('');
  const [email, setEmail] = useState('');
  const [actionType, setActionType] = useState<string>('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isResetting, setIsResetting] = useState(false);

  useEffect(() => {
    const handleEmailAction = async () => {
      const mode = searchParams.get('mode');
      const oobCode = searchParams.get('oobCode');

      if (!mode || !oobCode) {
        setStatus('error');
        setErrorMessage('Invalid action link. Please check your email and try again.');
        return;
      }

      try {
        // Check the action code to determine what type of action this is
        const actionCodeInfo = await checkActionCode(auth, oobCode);
        const operation = actionCodeInfo.operation;

        setActionType(operation);

        switch (mode) {
          case 'verifyEmail':
            // Handle email verification (signup or email change)
            await applyActionCode(auth, oobCode);
            console.log('Email verified successfully');

            // Subscribe user to marketing list after successful email verification
            // Only for new user signups (VERIFY_EMAIL), not email changes (EMAIL_SIGNIN)
            if (operation === 'VERIFY_EMAIL') {
              try {
                // Get the current user information
                const currentUser = auth.currentUser;
                if (currentUser) {
                  const userAgent =
                    typeof window !== 'undefined' ? window.navigator.userAgent : undefined;

                  // Extract name from displayName if available
                  const displayName = currentUser.displayName || '';
                  const nameParts = displayName.split(' ');
                  const firstName = nameParts[0] || '';
                  const lastName = nameParts.slice(1).join(' ') || '';

                  console.log('Subscribing verified user to marketing list:', currentUser.email);

                  const marketingResponse = await fetch('/api/marketing/subscribe', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                      email: currentUser.email,
                      firstName: firstName.trim(),
                      lastName: lastName.trim(),
                      userAgent,
                    }),
                    // Add timeout to prevent hanging
                    signal: AbortSignal.timeout(15000),
                  });

                  const marketingResult = await marketingResponse.json();

                  if (marketingResult.success) {
                    console.log(
                      'User successfully subscribed to marketing list after email verification',
                    );
                  } else {
                    console.warn(
                      'Marketing subscription failed (non-blocking):',
                      marketingResult.error,
                    );
                  }
                }
              } catch (marketingError) {
                console.error(
                  'Error during marketing subscription (non-blocking):',
                  marketingError,
                );
                // Marketing subscription errors are non-blocking and won't affect email verification
              }
            }

            setStatus('success');
            break;

          case 'resetPassword':
            // Handle password reset
            const userEmail = await verifyPasswordResetCode(auth, oobCode);
            setEmail(userEmail);
            setStatus('password-reset');
            break;

          default:
            setStatus('error');
            setErrorMessage('Unsupported action type. Please check your email and try again.');
        }
      } catch (error: any) {
        console.error('Email action failed:', error);

        if (error.code === 'auth/expired-action-code') {
          setStatus('expired');
          setErrorMessage('This action link has expired. Please request a new one.');
        } else if (error.code === 'auth/invalid-action-code') {
          setStatus('error');
          setErrorMessage('This action link is invalid. Please check your email and try again.');
        } else {
          setStatus('error');
          setErrorMessage('Action failed. Please try again or contact support.');
        }
      }
    };

    handleEmailAction();
  }, [searchParams]);

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setErrorMessage('Passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      setErrorMessage('Password must be at least 6 characters long');
      return;
    }

    setIsResetting(true);
    setErrorMessage('');

    try {
      const oobCode = searchParams.get('oobCode')!;
      await confirmPasswordReset(auth, oobCode, newPassword);
      setStatus('success');
    } catch (error: any) {
      console.error('Password reset failed:', error);
      setErrorMessage(error.message || 'Failed to reset password. Please try again.');
    } finally {
      setIsResetting(false);
    }
  };

  const handleContinueToSignIn = () => {
    const message =
      actionType === 'EMAIL_SIGNIN'
        ? 'Email updated successfully!'
        : 'Email verified successfully!';
    router.push(`/signin?verification=success&message=${encodeURIComponent(message)}`);
  };

  const handleRequestNewLink = () => {
    router.push('/signin?verification=expired');
  };

  const getSuccessMessage = () => {
    switch (actionType) {
      case 'EMAIL_SIGNIN':
        return {
          title: 'Email Updated Successfully',
          description: 'Your email address has been updated and verified.',
        };
      case 'VERIFY_EMAIL':
        return {
          title: 'Email Verified',
          description: 'Your email has been successfully verified.',
        };
      default:
        return {
          title: 'Action Completed',
          description: 'The requested action has been completed successfully.',
        };
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <LandingHeader showFeaturesLink={false} />

      <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <Card className="w-full max-w-md bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 shadow-sm">
          <CardHeader className="text-center space-y-4 pb-6">
            {status === 'loading' && (
              <>
                <div className="w-12 h-12 bg-blue-100 rounded-full mx-auto flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-blue-600 animate-spin"
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
                  <CardTitle className="text-xl font-semibold text-gray-900">Processing</CardTitle>
                  <CardDescription className="text-gray-600">
                    Please wait while we process your request.
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
                    {getSuccessMessage().title}
                  </CardTitle>
                  <CardDescription className="text-gray-600">
                    {getSuccessMessage().description}
                  </CardDescription>
                </div>
              </>
            )}

            {status === 'password-reset' && (
              <>
                <div className="w-12 h-12 bg-blue-100 rounded-full mx-auto flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
                <div className="space-y-2">
                  <CardTitle className="text-xl font-semibold text-gray-900">
                    Reset Password
                  </CardTitle>
                  <CardDescription className="text-gray-600">
                    Enter your new password for {email}
                  </CardDescription>
                </div>
              </>
            )}

            {(status === 'error' || status === 'expired') && (
              <>
                <div className="w-12 h-12 bg-red-100 rounded-full mx-auto flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-red-600"
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
                    {status === 'expired' ? 'Link Expired' : 'Action Failed'}
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

            {status === 'password-reset' && (
              <form onSubmit={handlePasswordReset} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    required
                    minLength={6}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    required
                    minLength={6}
                  />
                </div>
                {errorMessage && <p className="text-sm text-red-600">{errorMessage}</p>}
                <Button
                  type="submit"
                  disabled={isResetting || !newPassword || !confirmPassword}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium"
                  size="lg"
                >
                  {isResetting ? 'Resetting...' : 'Reset Password'}
                </Button>
              </form>
            )}

            {status === 'expired' && (
              <Button
                onClick={handleRequestNewLink}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium"
                size="lg"
              >
                Request New Link
              </Button>
            )}

            {status === 'error' && (
              <div className="space-y-3">
                <Button
                  onClick={handleRequestNewLink}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium"
                  size="lg"
                >
                  Get New Link
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
              <div className="bg-blue-50 border border-blue-200 text-blue-800 text-sm p-4 rounded-lg">
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
                  <span>Processing your request...</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
