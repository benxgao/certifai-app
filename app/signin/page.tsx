'use client';

import React, { useState, useCallback } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import LandingHeader from '@/src/components/custom/LandingHeader';
import AuthLeftSection from '@/src/components/auth/AuthLeftSection';
import EnhancedNotificationBar from '@/src/components/custom/NotificationBar';
import { AlertMessage } from '@/src/components/custom/AlertMessage';
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-violet-50/30 dark:from-slate-900 dark:via-slate-800 dark:to-violet-950/20">
      {/* Header */}
      <LandingHeader />

      {/* Notification Bar */}
      {/* <EnhancedNotificationBar
        message="🚀 Try our platform instantly with demo account - username/password: demo@certestic.com"
        ctaText=""
        ctaLink="/signin"
        variant="promo"
        showIcon={true}
      /> */}

      {/* Main Container with same width as header */}
      <div className="container mx-auto px-4 sm:px-6 md:px-7 lg:px-8">
        <div className="flex-1 w-full lg:relative lg:bg-none auth-container">
          {/* Left Column - Welcome Section */}
          <AuthLeftSection mode="signin" />

          {/* Right Column - Signin Form */}
          <div className="flex items-center justify-center py-4 sm:py-8 lg:py-20 lg:ml-[50%] relative min-h-full lg:min-h-0 auth-container auth-form-mobile">
            {/* Enhanced background decoration matching dashboard */}
            <div className="absolute inset-0 overflow-hidden">
              {/* Large gradient orbs for depth - matching dashboard style */}
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-violet-200/20 dark:bg-violet-600/10 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-10 -left-10 w-56 h-56 bg-blue-200/20 dark:bg-blue-600/10 rounded-full blur-3xl"></div>
            </div>

            {/* Form Card using DashboardCard pattern */}
            <div className="relative bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200/60 dark:border-slate-700/60 shadow-2xl rounded-xl overflow-hidden w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-lg xl:max-w-xl">
              {/* Decorative gradient orbs - matching dashboard cards */}
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-violet-200/20 dark:bg-violet-600/10 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-10 -left-10 w-56 h-56 bg-blue-200/20 dark:bg-blue-600/10 rounded-full blur-3xl"></div>

              <div className="relative z-10">
                {/* Header with dashboard card header styling */}
                <div className="px-6 sm:px-8 py-6 border-b border-slate-100 dark:border-slate-700/50 bg-gradient-to-r from-slate-50/60 to-violet-50/30 dark:from-slate-800/40 dark:to-violet-950/20">
                  <div className="text-center">
                    <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 dark:text-slate-50 tracking-tight mb-2">
                      Sign In
                    </h1>
                    <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
                      Enter your credentials to access your account
                    </p>
                  </div>
                </div>

                <form onSubmit={handleSignin} autoComplete="on">
                  {/* Form Content with dashboard card content styling */}
                  <div className="p-6 sm:p-8 space-y-3 sm:space-y-4 lg:space-y-6 auth-content-mobile">
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
                        className="text-sm sm:text-base rounded-xl border-slate-200/60 dark:border-slate-600/60 bg-white/80 dark:bg-slate-900/60 text-slate-900 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-400 focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 focus:bg-white dark:focus:bg-slate-900/80 transition-all duration-300 hover:border-violet-300 dark:hover:border-violet-700 backdrop-blur-sm shadow-sm hover:shadow-md"
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
                        className="text-sm sm:text-base rounded-xl border-slate-200/60 dark:border-slate-600/60 bg-white/80 dark:bg-slate-900/60 text-slate-900 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-400 focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 focus:bg-white dark:focus:bg-slate-900/80 transition-all duration-300 hover:border-violet-300 dark:hover:border-violet-700 backdrop-blur-sm shadow-sm hover:shadow-md"
                      />
                    </div>
                    {error && (
                      <AlertMessage message={error} className="text-sm p-4 sm:p-5 lg:p-6">
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
                      </AlertMessage>
                    )}
                    <Button
                      type="submit"
                      className="w-full rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-700 hover:to-blue-700 text-white font-bold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] hover:-translate-y-0.5 text-base sm:text-lg relative overflow-hidden group"
                      disabled={
                        isLoading || isRedirecting || !form.email.trim() || !form.password.trim()
                      }
                      size="lg"
                    >
                      {/* Button shine effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                      <ButtonLoadingText
                        isLoading={isLoading || isRedirecting}
                        loadingText={isRedirecting ? 'Redirecting...' : 'Signing In...'}
                        defaultText="Sign In"
                        showSpinner={true}
                        spinnerSize="sm"
                      />
                    </Button>
                  </div>

                  {/* Form Footer with dashboard card footer styling */}
                  <div className="flex justify-center text-sm text-slate-600 dark:text-slate-300 pt-2 sm:pt-4 lg:pt-6 border-t border-slate-100 dark:border-slate-700/70 px-6 sm:px-8 lg:px-12 pb-4 sm:pb-6 lg:pb-10 bg-gradient-to-r from-slate-50/60 to-violet-50/30 dark:from-slate-800/40 dark:to-violet-950/20">
                    Don&apos;t have an account?&nbsp;
                    <Link
                      href="/signup"
                      className="font-medium text-violet-600 dark:text-violet-400 hover:text-violet-500 dark:hover:text-violet-300 hover:underline transition-colors duration-200"
                    >
                      Sign up
                    </Link>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
