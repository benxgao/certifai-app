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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import LandingHeader from '@/src/components/custom/LandingHeader';
import { saveSubscriberIdToClaims } from '@/src/lib/marketing-claims';
import {
  StatusCardHeader,
  PasswordResetForm,
  LoadingInfoBox,
  ActionButtons,
} from '@/src/components/custom';

export default function EmailActionHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<
    'loading' | 'success' | 'error' | 'expired' | 'password-reset'
  >('loading');
  const [errorMessage, setErrorMessage] = useState('');
  const [email, setEmail] = useState('');
  const [actionType, setActionType] = useState<string>('');
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

      let retryCount = 0;
      const maxRetries = 3;

      const attemptEmailAction = async (): Promise<void> => {
        try {
          // Check the action code to determine what type of action this is
          let actionCodeInfo;
          let operation = 'VERIFY_EMAIL'; // Default fallback

          try {
            actionCodeInfo = await checkActionCode(auth, oobCode);
            operation = actionCodeInfo.operation;
          } catch (checkError: any) {
            // If checkActionCode fails but it's not a critical error,
            // we can still try to apply the code for email verification
            if (
              mode === 'verifyEmail' &&
              (checkError.code === 'auth/user-not-found' ||
                checkError.code === 'auth/invalid-action-code')
            ) {
            } else {
              throw checkError; // Re-throw if it's a different type of error
            }
          }

          setActionType(operation);

          switch (mode) {
            case 'verifyEmail':
              // Handle email verification (signup or email change) with improved retry logic
              try {
                await applyActionCode(auth, oobCode);
              } catch (verifyError: any) {
                // Enhanced retry logic for newly created accounts
                if (verifyError.code === 'auth/user-not-found' && retryCount < maxRetries) {
                  // Progressive delay: 2s, 4s, 6s
                  const delay = Math.min(2000 + retryCount * 2000, 6000);
                  await new Promise((resolve) => setTimeout(resolve, delay));

                  try {
                    // Try to refresh auth state and retry verification
                    await auth.signOut(); // Clear any stale auth state
                    await applyActionCode(auth, oobCode);
                  } catch (retryError: any) {
                    throw retryError;
                  }
                } else if (verifyError.code === 'auth/invalid-action-code') {
                  // Action code might be expired or already used
                  throw new Error(
                    'This verification link has expired or has already been used. Please request a new verification email.',
                  );
                } else if (verifyError.code === 'auth/expired-action-code') {
                  throw new Error(
                    'This verification link has expired. Please request a new verification email.',
                  );
                } else {
                  throw verifyError;
                }
              }

              // Subscribe user to marketing list after successful email verification
              // Only for new user signups (VERIFY_EMAIL), not email changes (EMAIL_SIGNIN)
              if (operation === 'VERIFY_EMAIL') {
                try {
                  // Wait a moment for auth state to update after email verification
                  await new Promise((resolve) => setTimeout(resolve, 1000));

                  // Get the current user information (should be available after the delay)
                  const currentUser = auth.currentUser;

                  // Get user email from multiple sources
                  const userEmail =
                    currentUser?.email ||
                    actionCodeInfo?.data?.email ||
                    // Try to extract email from the oobCode URL params as a fallback
                    (function () {
                      try {
                        // The oobCode often contains encoded user information
                        return null; // We'll rely on other methods
                      } catch {
                        return null;
                      }
                    })();

                  if (userEmail) {
                    const userAgent =
                      typeof window !== 'undefined' ? window.navigator.userAgent : undefined;

                    // Extract name from displayName if available
                    // After waiting, the displayName should be populated from the signup process
                    let displayName = currentUser?.displayName || '';
                    let firstName = '';
                    let lastName = '';

                    // If displayName is still empty, try to reload the user
                    if (!displayName && currentUser) {
                      try {
                        await currentUser.reload();
                        displayName = currentUser.displayName || '';
                      } catch (reloadError) {
                        console.warn('Failed to reload user for displayName:', reloadError);
                      }
                    }

                    // Parse the name parts
                    if (displayName) {
                      const nameParts = displayName
                        .trim()
                        .split(' ')
                        .filter((part) => part.length > 0);
                      firstName = nameParts[0] || '';
                      lastName = nameParts.slice(1).join(' ') || '';
                    } else {
                      console.warn(
                        'DisplayName is still empty after all attempts. User may have signed up without setting displayName properly.',
                      );
                      // In this case, firstName and lastName will remain empty strings
                      // The marketing API will handle this gracefully
                    }

                    // Prepare the final names (trim and ensure they're not just whitespace)
                    const finalFirstName = firstName.trim() || undefined;
                    const finalLastName = lastName.trim() || undefined;

                    const marketingResponse = await fetch('/api/marketing/subscribe', {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                      },
                      body: JSON.stringify({
                        email: userEmail,
                        firstName: finalFirstName,
                        lastName: finalLastName,
                        userAgent,
                      }),
                      // Add timeout to prevent hanging
                      signal: AbortSignal.timeout(15000),
                    });

                    if (!marketingResponse.ok) {
                      throw new Error(`Marketing API returned status: ${marketingResponse.status}`);
                    }

                    const marketingResult = await marketingResponse.json();

                    if (marketingResult.success) {
                      // Save subscriberId to Firebase Auth claims
                      if (marketingResult.subscriberId && currentUser) {
                        await saveSubscriberIdToClaims(marketingResult.subscriberId, currentUser);
                      }
                    } else {
                      console.warn(
                        'Marketing subscription failed (non-blocking):',
                        marketingResult.error,
                      );
                    }
                  } else {
                    console.warn('No email address available for marketing subscription');
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
          console.error('Token verification error details:', {
            message: error.message,
            code: error.code,
            stack: error.stack,
          });

          // Handle user-not-found with retries for recently created accounts
          if (error.code === 'auth/user-not-found' && retryCount < maxRetries) {
            retryCount++;

            // Wait longer for user account propagation
            await new Promise((resolve) => setTimeout(resolve, 3000));

            try {
              return await attemptEmailAction();
            } catch (retryError) {
              // If retry still fails, fall through to normal error handling
              console.error(`Retry ${retryCount} failed:`, retryError);
            }
          }

          if (error.code === 'auth/expired-action-code') {
            setStatus('expired');
            setErrorMessage('This action link has expired. Please request a new one.');
          } else if (error.code === 'auth/invalid-action-code') {
            setStatus('error');
            setErrorMessage('This action link is invalid. Please check your email and try again.');
          } else if (error.code === 'auth/user-not-found') {
            setStatus('error');
            setErrorMessage(
              'The user account associated with this email verification link no longer exists. Please sign up again or contact support if you believe this is an error.',
            );
          } else if (error.code === 'auth/weak-password') {
            setStatus('error');
            setErrorMessage('Please choose a stronger password (at least 6 characters).');
          } else if (error.code === 'auth/too-many-requests') {
            setStatus('error');
            setErrorMessage('Too many requests. Please wait a few minutes before trying again.');
          } else {
            setStatus('error');
            setErrorMessage(
              `Action failed: ${
                error.message || 'Unknown error'
              }. Please try again or contact support.`,
            );
          }
        }
      };

      await attemptEmailAction();
    };

    handleEmailAction();
  }, [searchParams]);

  const handlePasswordReset = async (newPassword: string, confirmPassword: string) => {
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
      <LandingHeader />

      <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-50 via-slate-100 to-violet-50/30 dark:from-slate-900 dark:via-slate-800 dark:to-violet-950/20">
        <Card className="w-full max-w-md bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200/60 dark:border-slate-700/60 shadow-2xl rounded-xl overflow-hidden">
          {/* Decorative gradient orbs */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-violet-200/20 dark:bg-violet-600/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-10 -left-10 w-56 h-56 bg-blue-200/20 dark:bg-blue-600/10 rounded-full blur-3xl"></div>

          <div className="relative z-10">
            {status === 'loading' && (
              <StatusCardHeader
                status="loading"
                title="Processing"
                description="Please wait while we process your request."
              />
            )}

            {status === 'success' && (
              <StatusCardHeader
                status="success"
                title={getSuccessMessage().title}
                description={getSuccessMessage().description}
              />
            )}

            {status === 'password-reset' && (
              <StatusCardHeader
                status="info"
                title="Reset Password"
                description={`Enter your new password for ${email}`}
              />
            )}

            {(status === 'error' || status === 'expired') && (
              <StatusCardHeader
                status="error"
                title={status === 'expired' ? 'Link Expired' : 'Action Failed'}
                description={errorMessage}
              />
            )}

            <CardContent className="space-y-4 px-6 pb-6">
              {status === 'success' && (
                <ActionButtons variant="success" onContinueToSignIn={handleContinueToSignIn} />
              )}

              {status === 'password-reset' && (
                <PasswordResetForm
                  email={email}
                  onSubmit={handlePasswordReset}
                  isResetting={isResetting}
                  errorMessage={errorMessage}
                />
              )}

              {status === 'expired' && (
                <ActionButtons variant="expired" onRequestNewLink={handleRequestNewLink} />
              )}

              {status === 'error' && (
                <ActionButtons
                  variant="error"
                  onRequestNewLink={handleRequestNewLink}
                  onContactSupport={() => router.push('/support')}
                />
              )}

              {status === 'loading' && <LoadingInfoBox />}
            </CardContent>
          </div>
        </Card>
      </div>
    </div>
  );
}
