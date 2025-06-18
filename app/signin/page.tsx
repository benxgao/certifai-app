'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { signInWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
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
import { resetAuthenticationState } from '@/src/lib/auth-utils';
import { useFirebaseAuth } from '@/src/context/FirebaseAuthContext';

import { auth } from '@/src/firebase/firebaseWebConfig';

const LoginPage = () => {
  const [form, setForm] = useState({
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
  const { firebaseUser, loading } = useFirebaseAuth();

  // Monitor authentication state and redirect when both firebaseUser and apiUserId are available
  useEffect(() => {
    // Only redirect if:
    // 1. Auth context loading is complete
    // 2. No auth processing in progress
    // 3. No signin loading in progress
    // 4. User is authenticated
    // 5. Not already redirecting
    if (!loading && !authProcessing && !isLoading && firebaseUser && !isRedirecting) {
      console.log('Authentication successful, initiating redirect to /main');
      setIsRedirecting(true);
      // Use a minimal delay to ensure state is fully settled
      setTimeout(() => {
        router.replace('/main');
      }, 50);
    }
  }, [firebaseUser, loading, authProcessing, isLoading, isRedirecting, router]);

  // Clear any error messages from URL params and handle signup success
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const errorParam = urlParams.get('error');
    const signupParam = urlParams.get('signup');
    const verificationParam = urlParams.get('verification');

    if (errorParam) {
      setError(decodeURIComponent(errorParam));
    }

    if (signupParam === 'success') {
      if (verificationParam === 'pending') {
        setError(
          'Account created! Please check your email and verify your account before signing in.',
        );
      } else {
        setError('Account created successfully! You can now sign in.');
      }
    }

    // Clean up URL
    if (errorParam || signupParam) {
      const newUrl = window.location.pathname;
      window.history.replaceState({}, '', newUrl);
    }
  }, []);

  // Function to resend verification email
  const resendVerificationEmail = async () => {
    if (!auth.currentUser) {
      setError('Please sign in first to resend verification email.');
      return;
    }

    try {
      setVerificationLoading(true);
      await sendEmailVerification(auth.currentUser);
      setError('Verification email sent! Please check your inbox.');
    } catch (error) {
      console.error('Failed to resend verification email:', error);
      setError('Failed to send verification email. Please try again.');
    } finally {
      setVerificationLoading(false);
    }
  };

  const onChange = useCallback(
    (e: any) => {
      setForm({ ...form, [e.target.name]: e.target.value });
    },
    [form],
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

      // Clear any existing auth state/cookies before signing in
      await resetAuthenticationState();

      // Start the authentication process
      const signedIn = await signInWithEmailAndPassword(auth, form.email, form.password);

      // Check if email is verified
      if (!signedIn.user.emailVerified) {
        setShowVerificationPrompt(true);
        setError(
          'Please verify your email address before signing in. Check your inbox for a verification link.',
        );
        setIsLoading(false);
        setAuthProcessing(false);
        return;
      }

      // Force refresh to get a brand new Firebase token
      const firebaseToken = await signedIn.user.getIdToken(true);

      // Set the authentication cookie with brand new token
      const cookieRes = await fetch('/api/auth-cookie/set', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firebaseToken }),
      });

      if (!cookieRes.ok) {
        const cookieError: any = await cookieRes.json();
        // If cookie setting fails, show error
        const errorMessage = cookieError.message || 'Failed to set authentication cookie.';
        setError(errorMessage);
        return;
      }

      // Small delay to ensure cookie is properly set in browser (reduced from 200ms to 100ms)
      await new Promise((resolve) => setTimeout(resolve, 100));
      // Don't redirect here - let the useEffect with auth state monitoring handle it
      // The FirebaseAuthContext will handle getting the API user ID
    } catch (error: any) {
      let errorMessage = 'An unexpected error occurred. Please try again.';

      if (error.code) {
        switch (error.code) {
          case 'auth/user-not-found':
          case 'auth/wrong-password':
            errorMessage = 'Invalid email or password.';
            break;
          case 'auth/invalid-email':
            errorMessage = 'Please enter a valid email address.';
            break;
          case 'auth/too-many-requests':
            errorMessage = 'Too many failed attempts. Please try again later.';
            break;
          case 'auth/user-disabled':
            errorMessage = 'This account has been disabled.';
            break;
        }
      }

      setError(errorMessage);
    } finally {
      setIsLoading(false);
      setAuthProcessing(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen auth-page-mobile">
      {/* Header */}
      <LandingHeader showFeaturesLink={false} />

      <div className="flex-1 w-full lg:grid lg:grid-cols-2 bg-gradient-to-br from-violet-50 via-purple-25 to-indigo-50 lg:bg-none auth-container">
        {/* Left Column - Welcome Section */}
        <AuthLeftSection mode="signin" />

        {/* Right Column - Signin Form */}
        <div className="flex items-center justify-center py-3 sm:py-6 lg:py-12 px-3 sm:px-6 lg:px-8 relative bg-gradient-to-br from-violet-50 via-purple-25 to-indigo-50 min-h-full lg:min-h-0 auth-container auth-form-mobile">
          {/* Subtle background decoration for mobile */}
          <div className="absolute inset-0 lg:hidden overflow-hidden">
            <div className="absolute top-20 right-10 w-32 h-32 bg-gradient-to-br from-violet-200/20 to-purple-300/20 rounded-full"></div>
            <div className="absolute bottom-20 left-10 w-28 h-28 bg-gradient-to-br from-cyan-200/20 to-blue-300/20 rounded-full"></div>
          </div>

          {/* Additional subtle patterns for desktop right section */}
          <div className="absolute inset-0 hidden lg:block overflow-hidden">
            <div className="absolute top-32 right-20 w-20 h-20 bg-gradient-to-br from-violet-200/30 to-purple-200/30 rounded-xl rotate-12 animate-pulse delay-3000"></div>
            <div className="absolute bottom-40 left-16 w-16 h-16 bg-gradient-to-br from-indigo-200/30 to-violet-200/30 rounded-lg rotate-45 animate-pulse delay-4000"></div>
          </div>

          <Card className="w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-lg xl:max-w-xl bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 shadow-2xl relative z-10">
            <CardHeader className="text-center space-y-1 pb-2 sm:pb-3 lg:pb-6 px-4 sm:px-6">
              {/* Small decorative element */}
              <div className="w-12 h-1 bg-gradient-to-r from-violet-500 to-purple-500 rounded-full mx-auto mb-3 sm:mb-4"></div>
              <CardTitle className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent auth-title-mobile">
                Sign In
              </CardTitle>
              <CardDescription className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">
                Enter your credentials to access your CertifAI account.
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleSignin} autoComplete="off">
              <CardContent className="space-y-2 sm:space-y-3 lg:space-y-6 px-4 sm:px-6 auth-content-mobile">
                <div className="space-y-1.5 sm:space-y-2">
                  <Label htmlFor="email" className="text-slate-700 dark:text-slate-300 font-medium">
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
                    autoComplete="off"
                    className="border-slate-200 dark:border-slate-700 focus:ring-violet-500 focus:border-violet-500 transition-all duration-200 hover:border-slate-300 dark:hover:border-slate-600"
                  />
                </div>
                <div className="space-y-1.5 sm:space-y-2">
                  <div className="flex items-center justify-between">
                    <Label
                      htmlFor="password"
                      className="text-slate-700 dark:text-slate-300 font-medium"
                    >
                      Password
                    </Label>
                    <Link
                      href="#"
                      className="text-sm font-medium text-violet-600 hover:text-violet-500 hover:underline transition-colors duration-200"
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
                    autoComplete="off"
                    className="border-slate-200 dark:border-slate-700 focus:ring-violet-500 focus:border-violet-500 transition-all duration-200 hover:border-slate-300 dark:hover:border-slate-600"
                  />
                </div>
                {error && (
                  <div
                    className={`text-sm p-3 rounded-xl border animate-in slide-in-from-top-2 duration-300 ${
                      error.includes('created successfully') || error.includes('sent!')
                        ? 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-100 border-green-200 dark:border-green-800/50'
                        : 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-100 border-red-200 dark:border-red-800/50'
                    }`}
                  >
                    <div className="flex items-start">
                      <svg
                        className="w-4 h-4 mr-2 flex-shrink-0 mt-0.5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        {error.includes('created successfully') || error.includes('sent!') ? (
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
                          <div className="mt-3">
                            <Button
                              onClick={resendVerificationEmail}
                              disabled={verificationLoading}
                              variant="outline"
                              size="sm"
                              className="w-full"
                            >
                              {verificationLoading ? (
                                <div className="flex items-center">
                                  <svg
                                    className="animate-spin -ml-1 mr-2 h-3 w-3"
                                    xmlns="http://www.w3.org/2000/svg"
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
                                  Sending...
                                </div>
                              ) : (
                                'Resend verification email'
                              )}
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
                <Button
                  type="submit"
                  className="w-full rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]"
                  disabled={isLoading || isRedirecting}
                  size="lg"
                >
                  {(isLoading || isRedirecting) && (
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
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
                  )}
                  {isRedirecting ? 'Redirecting...' : isLoading ? 'Signing In...' : 'Sign In'}
                </Button>
              </CardContent>
              <CardFooter className="flex justify-center text-sm text-slate-600 dark:text-slate-400 pt-2 sm:pt-3 border-t border-slate-100 dark:border-slate-700/50 px-4 sm:px-6">
                Don&apos;t have an account?&nbsp;
                <Link
                  href="/signup"
                  className="font-medium text-violet-600 hover:text-violet-500 hover:underline transition-colors duration-200"
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
