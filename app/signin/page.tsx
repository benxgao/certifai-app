'use client';

import React, { useState, useCallback } from 'react';
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
import NotificationBar from '@/src/components/custom/NotificationBar';
import { useFirebaseAuth } from '@/src/context/FirebaseAuthContext';
import { ButtonLoadingText } from '@/src/components/ui/loading-spinner';
import PageLoader from '@/src/components/custom/PageLoader';
import {
  performSignin,
  resendVerificationEmail,
  isAuthenticationError,
  type SigninFormData,
} from '@/src/lib/signin-helpers';
import { useAuthRedirect, useSigninInitialization } from '@/src/hooks/useSigninHooks';

const LoginPage = () => {
  const [form, setForm] = useState<SigninFormData>({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [showVerificationPrompt, setShowVerificationPrompt] = useState(false);
  const [verificationLoading, setVerificationLoading] = useState(false);
  const { firebaseUser, loading, apiUserId } = useFirebaseAuth();

  // Initialize signin page - handle URL params and display messages
  useSigninInitialization(setError);

  // Simple redirect logic - redirect when user is fully authenticated
  useAuthRedirect(loading, firebaseUser, apiUserId, isRedirecting, error, setIsRedirecting);

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

    // Prevent form submission if already processing or redirecting
    if (isLoading || isRedirecting) {
      return;
    }

    try {
      setError('');
      setIsLoading(true);

      const result = await performSignin(form);

      if (result.success) {
        // Clear any previous error messages and verification prompts
        setError('');
        setShowVerificationPrompt(false);
        // Don't redirect here - let the useAuthRedirect hook handle it
      } else if (result.error) {
        setError(result.error.message);
        if (result.error.showVerificationPrompt) {
          setShowVerificationPrompt(true);
        }
        setIsLoading(false);
        return;
      }
    } catch (error: any) {
      console.error('Unexpected signin error:', error);
      setError('An unexpected error occurred. Please try again.');
      setIsLoading(false);
    }
  };

  // Don't show signin form if user is already authenticated and will be redirected
  const isAuthError = isAuthenticationError(error);

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

      {/* Notification Bar */}
      <NotificationBar
        message="🚀 Try our platform instantly with demo account - username/password: demo@certestic.com"
        ctaText=""
        ctaLink="/signin"
        variant="promo"
      />

      <div className="flex-1 w-full lg:relative bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 lg:bg-none auth-container">
        {/* Left Column - Welcome Section */}
        <AuthLeftSection mode="signin" />

        {/* Right Column - Signin Form */}
        <div className="flex justify-center py-4 sm:py-8 lg:py-20 px-4 sm:px-6 lg:px-16 lg:ml-[50%] relative bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 min-h-full lg:min-h-0 auth-form-mobile">
          {/* Enhanced background decoration matching signup page */}
          <div className="absolute inset-0 overflow-hidden">
            {/* Large gradient orbs for depth */}
            <div className="absolute top-10 right-10 w-48 h-48 bg-violet-200/20 dark:bg-violet-600/10 rounded-full blur-3xl lg:hidden"></div>
            <div className="absolute bottom-10 left-10 w-64 h-64 bg-blue-200/20 dark:bg-blue-600/10 rounded-full blur-3xl lg:hidden"></div>

            {/* Desktop patterns */}
            <div className="absolute top-20 right-16 w-32 h-32 bg-violet-200/15 dark:bg-violet-600/8 rounded-full blur-2xl hidden lg:block"></div>
            <div className="absolute bottom-32 left-16 w-40 h-40 bg-blue-200/15 dark:bg-blue-600/8 rounded-full blur-2xl hidden lg:block"></div>

            {/* Subtle geometric accent shapes */}
            <div className="absolute top-32 right-20 w-16 h-16 bg-gradient-to-br from-violet-200/30 to-purple-200/30 dark:from-violet-800/20 dark:to-purple-700/20 rounded-2xl rotate-12 animate-pulse delay-3000 hidden lg:block"></div>
            <div className="absolute bottom-40 left-20 w-12 h-12 bg-gradient-to-br from-blue-200/30 to-cyan-200/30 dark:from-blue-800/20 dark:to-cyan-700/20 rounded-xl rotate-45 animate-pulse delay-4000 hidden lg:block"></div>
          </div>

          <Card className="w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-lg xl:max-w-xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm border border-slate-200/60 dark:border-slate-700/60 shadow-2xl dark:shadow-slate-900/50 relative z-10">
            <CardHeader className="text-center pt-4 sm:pt-6 lg:pt-6 pb-3 sm:pb-6 lg:pb-6 px-6 sm:px-8 lg:px-12">
              <CardTitle className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent auth-title-mobile">
                Sign In
              </CardTitle>
              <CardDescription className="text-slate-600 dark:text-slate-300 text-sm sm:text-base lg:text-lg">
                Enter your credentials to access your Certestic account.
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleSignin} autoComplete="on">
              <CardContent className="space-y-3 sm:space-y-4 lg:space-y-6 px-6 sm:px-8 lg:px-12 pb-6 sm:pb-8 lg:pb-12 auth-content-mobile">
                <div className="space-y-1 sm:space-y-2">
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
                    className="text-sm sm:text-base border-slate-200 dark:border-slate-600 dark:bg-slate-800/50 dark:text-slate-100 focus:ring-violet-500 focus:border-violet-500 transition-all duration-200 hover:border-slate-300 dark:hover:border-slate-500"
                  />
                </div>
                <div className="space-y-1 sm:space-y-2">
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
                    className="text-sm sm:text-base border-slate-200 dark:border-slate-600 dark:bg-slate-800/50 dark:text-slate-100 focus:ring-violet-500 focus:border-violet-500 transition-all duration-200 hover:border-slate-300 dark:hover:border-slate-500"
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
                  className="w-full rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02] text-sm sm:text-base"
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
