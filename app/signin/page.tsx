'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import LandingHeader from '@/src/components/custom/LandingHeader';
import AuthLeftSection from '@/src/components/auth/AuthLeftSection';
import { useFirebaseAuth } from '@/src/context/FirebaseAuthContext';
import { ButtonLoadingText } from '@/src/components/ui/loading-spinner';
import PageLoader from '@/src/components/custom/PageLoader';
import {
  parseAuthURLParams,
  clearLegacyAuthState,
  processURLParamsError,
  cleanupURLParams,
  performSignin,
  resendVerificationEmail,
  type SigninFormData,
} from '@/src/lib/signin-helpers';

const LoginPage = () => {
  const [form, setForm] = useState<SigninFormData>({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [authProcessing, setAuthProcessing] = useState(false);
  const [lastLoginAttempt, setLastLoginAttempt] = useState(0); // Add request deduplication
  const [showVerificationPrompt, setShowVerificationPrompt] = useState(false);
  const [verificationLoading, setVerificationLoading] = useState(false);
  const router = useRouter();
  const { firebaseUser, loading, apiUserId } = useFirebaseAuth();

  // Clear any existing auth state when signin page loads to ensure legacy tokens are not effective
  // This is a security measure to prevent any lingering authentication tokens from being used
  useEffect(() => {
    const initializeSigninPage = async () => {
      const urlParams = parseAuthURLParams();
      const errorMessage = await clearLegacyAuthState(urlParams);
      if (errorMessage) {
        setError(errorMessage);
      }
    };

    initializeSigninPage();
  }, []); // Run only once on component mount

  // Safeguard to ensure form remains functional after auth errors
  useEffect(() => {
    // If there's an error and we're not currently processing/loading,
    // ensure all loading states are cleared to keep the form functional
    if (error && !authProcessing && !isLoading) {
      setIsRedirecting(false);
    }
  }, [error, authProcessing, isLoading]);

  // Monitor authentication state and redirect when both firebaseUser and apiUserId are available
  useEffect(() => {
    // Only redirect if:
    // 1. Auth context loading is complete
    // 2. No auth processing in progress
    // 3. No signin loading in progress
    // 4. User is authenticated
    // 5. Not already redirecting
    // 6. No current error state that indicates authentication failure (allow redirect for success messages)
    const isAuthError =
      error &&
      !error.includes('created successfully') &&
      !error.includes('sent!') &&
      !error.includes('verified successfully') &&
      !error.includes('reset successful') &&
      !error.includes('Session recovered');

    if (
      !loading &&
      !authProcessing &&
      !isLoading &&
      firebaseUser &&
      firebaseUser.emailVerified &&
      (apiUserId || error.includes('Authentication timed out')) && // Allow redirect on timeout error
      !isRedirecting &&
      !isAuthError
    ) {
      console.log('Authentication successful, initiating redirect to /main');
      // Clear any success messages and URL parameters before redirecting
      setError('');
      setShowVerificationPrompt(false);

      // Clear any error parameters from URL
      if (typeof window !== 'undefined') {
        const url = new URL(window.location.href);
        if (url.searchParams.has('error') || url.searchParams.has('recovery')) {
          url.searchParams.delete('error');
          url.searchParams.delete('recovery');
          window.history.replaceState({}, '', url.pathname);
        }
      }

      // Use a slightly longer delay to ensure all state and URL cleanup is complete
      setTimeout(() => {
        setIsRedirecting(true);
        router.replace('/main');
      }, 100);
    }
  }, [firebaseUser, loading, authProcessing, isLoading, isRedirecting, error, router, apiUserId]);

  // Clear any error messages from URL params and handle signup success
  useEffect(() => {
    const urlParams = parseAuthURLParams();
    const errorMessage = processURLParamsError(urlParams);

    if (errorMessage) {
      setError(errorMessage);
    }

    // Clean up URL
    cleanupURLParams(urlParams);
  }, []);

  // Function to resend verification email
  const handleResendVerificationEmail = async () => {
    try {
      setVerificationLoading(true);
      const message = await resendVerificationEmail();
      setError(message);
    } finally {
      setVerificationLoading(false);
    }
  };

  const onChange = useCallback(
    (e: any) => {
      const { name, value } = e.target;
      setForm((prevForm) => {
        // Ensure we don't accidentally clear the form
        const newForm = { ...prevForm, [name]: value };
        return newForm;
      });
      // Clear error when user starts typing again
      if (error) {
        setError('');
      }
    },
    [error],
  );

  const handleSignin = async (e: React.FormEvent) => {
    e.preventDefault();

    // Prevent form submission if already redirecting
    if (isRedirecting) {
      console.log('Signin blocked - already redirecting');
      return;
    }

    // Prevent multiple simultaneous login attempts
    const currentTime = Date.now();
    if (currentTime - lastLoginAttempt < 1000) {
      console.log('Login attempt blocked - too soon after previous attempt');
      return;
    }
    setLastLoginAttempt(currentTime);

    try {
      setError('');
      setIsLoading(true);
      setAuthProcessing(true);

      const result = await performSignin(form);

      if (result.success) {
        // Clear any previous error messages on successful authentication
        setError('');
        setShowVerificationPrompt(false);
        // Don't redirect here - let the useEffect with auth state monitoring handle it
      } else if (result.error) {
        setError(result.error.message);
        if (result.error.showVerificationPrompt) {
          setShowVerificationPrompt(true);
        }

        // Small delay to ensure auth state has settled before clearing loading states
        setTimeout(() => {
          setIsLoading(false);
          setAuthProcessing(false);
        }, 100);
        return;
      }
    } catch (error: any) {
      console.error('Unexpected signin error:', error);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
      setAuthProcessing(false);
    }
  };

  // Function to handle refresh when user is stuck
  const handleRefresh = () => {
    window.location.reload();
  };

  // Safety mechanism: if user is stuck in loading state for too long, show a refresh option
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    // Only start timeout if we're in a loading/processing state
    if (loading || authProcessing || isLoading) {
      timeoutId = setTimeout(() => {
        console.warn('Authentication process taking too long, user might be stuck');
        // Set a specific error to help user understand what to do
        if (!error) {
          setError(
            'Authentication is taking longer than expected. Please refresh the page and try again.',
          );
        }
        // Clear loading states
        setIsLoading(false);
        setAuthProcessing(false);
        setIsRedirecting(false);
      }, 30000); // 30 second timeout
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [loading, authProcessing, isLoading, error]);

  // Don't show signin form if user is already authenticated and will be redirected
  // Only show loading if there's no authentication error
  const isAuthError =
    error &&
    !error.includes('created successfully') &&
    !error.includes('sent!') &&
    !error.includes('verified successfully') &&
    !error.includes('reset successful');

  if (!loading && firebaseUser && apiUserId && !isAuthError) {
    return (
      <PageLoader
        isLoading={true}
        text="Already signed in. Redirecting..."
        variant="redirect"
        fullScreen={true}
        showBrand={true}
      />
    );
  }

  return (
    <div className="flex flex-col min-h-screen auth-page-mobile">
      {/* Header */}
      <LandingHeader />

      <div className="flex-1 w-full lg:grid lg:grid-cols-2 bg-gradient-to-br from-violet-50 via-purple-25 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 lg:bg-none auth-container">
        {/* Left Column - Welcome Section */}
        <AuthLeftSection mode="signin" />

        {/* Right Column - Signin Form */}
        <div className="flex items-center justify-center py-4 sm:py-8 lg:py-20 px-4 sm:px-6 lg:px-16 relative bg-gradient-to-br from-violet-50 via-purple-25 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 min-h-full lg:min-h-0 auth-container auth-form-mobile">
          {/* Subtle background decoration for mobile */}
          <div className="absolute inset-0 lg:hidden overflow-hidden">
            <div className="absolute top-20 right-10 w-32 h-32 bg-gradient-to-br from-violet-200/20 to-purple-300/20 dark:from-violet-800/10 dark:to-purple-700/10 rounded-full"></div>
            <div className="absolute bottom-20 left-10 w-28 h-28 bg-gradient-to-br from-cyan-200/20 to-blue-300/20 dark:from-cyan-800/10 dark:to-blue-700/10 rounded-full"></div>
          </div>

          {/* Additional subtle patterns for desktop right section */}
          <div className="absolute inset-0 hidden lg:block overflow-hidden">
            <div className="absolute top-32 right-20 w-20 h-20 bg-gradient-to-br from-violet-200/30 to-purple-200/30 dark:from-violet-800/20 dark:to-purple-700/20 rounded-xl rotate-12 animate-pulse delay-3000"></div>
            <div className="absolute bottom-40 left-16 w-16 h-16 bg-gradient-to-br from-indigo-200/30 to-violet-200/30 dark:from-indigo-800/20 dark:to-violet-700/20 rounded-lg rotate-45 animate-pulse delay-4000"></div>
          </div>

          <Card className="w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-lg xl:max-w-xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm border border-slate-200/60 dark:border-slate-700/60 shadow-2xl dark:shadow-slate-900/50 relative z-10">
            <CardHeader className="text-center space-y-2 sm:space-y-4 lg:space-y-6 pt-4 sm:pt-8 lg:pt-12 pb-3 sm:pb-6 lg:pb-10 px-6 sm:px-8 lg:px-12">
              {/* Small decorative element */}
              <div className="w-12 h-1 bg-gradient-to-r from-violet-500 to-purple-500 rounded-full mx-auto mb-3 sm:mb-6"></div>
              <CardTitle className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-50 dark:to-slate-200 bg-clip-text text-transparent auth-title-mobile">
                Sign In
              </CardTitle>
              <CardDescription className="text-slate-600 dark:text-slate-300 text-sm sm:text-base lg:text-lg">
                Enter your credentials to access your Certestic account.
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleSignin} autoComplete="on">
              <CardContent className="space-y-4 sm:space-y-6 lg:space-y-10 px-6 sm:px-8 lg:px-12 pb-6 sm:pb-8 lg:pb-12 auth-content-mobile">
                <div className="space-y-2 sm:space-y-3">
                  <Label
                    htmlFor="email"
                    className="text-slate-700 dark:text-slate-200 font-medium text-sm sm:text-base"
                  >
                    Email address
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    required
                    value={form.email}
                    onChange={onChange}
                    disabled={isLoading || isRedirecting}
                    autoComplete="on"
                    className="h-11 sm:h-12 lg:h-14 text-sm sm:text-base border-slate-200 dark:border-slate-600 dark:bg-slate-800/50 dark:text-slate-100 focus:ring-violet-500 focus:border-violet-500 transition-all duration-200 hover:border-slate-300 dark:hover:border-slate-500"
                  />
                </div>
                <div className="space-y-2 sm:space-y-3">
                  <div className="flex items-center justify-between">
                    <Label
                      htmlFor="password"
                      className="text-slate-700 dark:text-slate-200 font-medium text-sm sm:text-base"
                    >
                      Password
                    </Label>
                    <Link
                      href="/forgot-password"
                      className="text-xs sm:text-sm font-medium text-violet-600 dark:text-violet-400 hover:text-violet-500 dark:hover:text-violet-300 hover:underline transition-colors duration-200"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    required
                    value={form.password}
                    onChange={onChange}
                    disabled={isLoading || isRedirecting}
                    autoComplete="on"
                    className="h-11 sm:h-12 lg:h-14 text-sm sm:text-base border-slate-200 dark:border-slate-600 dark:bg-slate-800/50 dark:text-slate-100 focus:ring-violet-500 focus:border-violet-500 transition-all duration-200 hover:border-slate-300 dark:hover:border-slate-500"
                  />
                </div>
                {error && (
                  <div
                    className={`text-sm p-4 sm:p-5 lg:p-6 rounded-xl border animate-in slide-in-from-top-2 duration-300 ${
                      error.includes('created successfully') ||
                      error.includes('sent!') ||
                      error.includes('verified successfully') ||
                      error.includes('reset successful')
                        ? 'bg-green-50 dark:bg-green-950/50 text-green-800 dark:text-green-200 border-green-200 dark:border-green-800/50'
                        : 'bg-red-50 dark:bg-red-950/50 text-red-800 dark:text-red-200 border-red-200 dark:border-red-800/50'
                    }`}
                  >
                    <div className="flex items-start">
                      <svg
                        className="w-4 h-4 mr-3 flex-shrink-0 mt-0.5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        {error.includes('created successfully') ||
                        error.includes('sent!') ||
                        error.includes('verified successfully') ||
                        error.includes('reset successful') ? (
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        ) : (
                          <path
                            fillRule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                            clipRule="evenodd"
                          />
                        )}
                      </svg>
                      <div className="flex-1">
                        {error}
                        {error.includes('taking longer than expected') && (
                          <div className="mt-4">
                            <Button
                              onClick={handleRefresh}
                              variant="outline"
                              size="sm"
                              className="text-xs"
                            >
                              Refresh Page
                            </Button>
                          </div>
                        )}
                        {showVerificationPrompt && (
                          <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800/50 rounded-lg">
                            <p className="text-sm text-blue-700 dark:text-blue-200 mb-3">
                              Didn&apos;t receive the email? Check your spam folder or resend it.
                            </p>
                            <Button
                              onClick={handleResendVerificationEmail}
                              disabled={verificationLoading}
                              variant="outline"
                              size="sm"
                              className="text-xs"
                            >
                              {verificationLoading ? 'Sending...' : 'Resend verification email'}
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
                <Button
                  type="submit"
                  className="w-full h-11 sm:h-12 lg:h-14 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02] text-sm sm:text-base"
                  disabled={
                    isLoading || isRedirecting || !form.email.trim() || !form.password.trim()
                  }
                  size="lg"
                >
                  <ButtonLoadingText
                    isLoading={isLoading || isRedirecting}
                    loadingText={isRedirecting ? 'Redirecting...' : 'Signing In...'}
                    defaultText="Sign In"
                    showSpinner={true}
                    spinnerSize="sm"
                  />
                </Button>
              </CardContent>
              <CardFooter className="flex justify-center text-sm text-slate-600 dark:text-slate-300 pt-2 sm:pt-4 lg:pt-6 border-t border-slate-100 dark:border-slate-700/70 px-6 sm:px-8 lg:px-12 pb-4 sm:pb-6 lg:pb-10">
                Don&apos;t have an account?&nbsp;
                <Link
                  href="/signup"
                  className="font-medium text-violet-600 dark:text-violet-400 hover:text-violet-500 dark:hover:text-violet-300 hover:underline transition-colors duration-200"
                >
                  Sign up
                </Link>
              </CardFooter>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
