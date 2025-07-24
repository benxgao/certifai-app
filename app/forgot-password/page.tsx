'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { useSearchParams } from 'next/navigation';
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
import { auth } from '@/src/firebase/firebaseWebConfig';
import { ButtonLoadingText } from '@/src/components/ui/loading-spinner';

function ForgotPasswordContent() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();

  // Handle URL params for redirected users
  useEffect(() => {
    const passwordResetParam = searchParams.get('passwordReset');

    if (passwordResetParam === 'expired') {
      setError('Your password reset link has expired. Please request a new one below.');
    } else if (passwordResetParam === 'success') {
      setSuccess('Password reset successful! You can now sign in with your new password.');
    }

    // Clean up URL
    if (passwordResetParam) {
      const newUrl = window.location.pathname;
      window.history.replaceState({}, '', newUrl);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }

    try {
      setError('');
      setSuccess('');
      setIsLoading(true);

      // Configure action code settings to use the new URL structure
      const actionCodeSettings = {
        url: `${window.location.origin}?mode=resetPassword`,
        handleCodeInApp: true,
      };

      await sendPasswordResetEmail(auth, email, actionCodeSettings);

      setSuccess(
        'Password reset email sent! Please check your inbox and follow the instructions to reset your password.',
      );
      setEmail(''); // Clear the form
    } catch (error: any) {

      switch (error.code) {
        case 'auth/user-not-found':
          setError('No account found with this email address.');
          break;
        case 'auth/invalid-email':
          setError('Please enter a valid email address.');
          break;
        case 'auth/too-many-requests':
          setError('Too many requests. Please try again later.');
          break;
        default:
          setError('Failed to send password reset email. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen auth-page-mobile">
      {/* Header */}
      <LandingHeader />

      <div className="flex-1 flex items-center justify-center py-6 lg:py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-violet-50 via-purple-25 to-indigo-50">
        {/* Subtle background decoration */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 right-10 w-32 h-32 bg-gradient-to-br from-violet-200/20 to-purple-300/20 rounded-full"></div>
          <div className="absolute bottom-20 left-10 w-28 h-28 bg-gradient-to-br from-cyan-200/20 to-blue-300/20 rounded-full"></div>
        </div>

        <Card className="w-full max-w-md bg-white/90 backdrop-blur-sm border border-slate-200/50 shadow-2xl relative z-10">
          <CardHeader className="text-center space-y-1 pb-6">
            {/* Small decorative element */}
            <div className="w-12 h-1 bg-gradient-to-r from-violet-500 to-purple-500 rounded-full mx-auto mb-4"></div>
            <CardTitle className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
              Forgot Password
            </CardTitle>
            <CardDescription className="text-slate-600 dark:text-slate-200 text-sm sm:text-base">
              Enter your email address and we&apos;ll send you a link to reset your password.
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit} autoComplete="off">
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-700 dark:text-slate-100 font-medium">
                  Email address
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  autoComplete="off"
                  className="border-slate-200 focus:ring-violet-500 focus:border-violet-500 transition-all duration-200 hover:border-slate-300"
                />
              </div>

              {error && (
                <div className="bg-red-50 text-red-800 text-sm p-3 rounded-xl border border-red-200 animate-in slide-in-from-top-2 duration-300">
                  <div className="flex items-start">
                    <svg
                      className="w-4 h-4 mr-2 flex-shrink-0 mt-0.5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {error}
                  </div>
                </div>
              )}

              {success && (
                <div className="bg-green-50 text-green-800 text-sm p-3 rounded-xl border border-green-200 animate-in slide-in-from-top-2 duration-300">
                  <div className="flex items-start">
                    <svg
                      className="w-4 h-4 mr-2 flex-shrink-0 mt-0.5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {success}
                  </div>
                </div>
              )}

              <Button
                type="submit"
                className="w-full rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]"
                disabled={isLoading || !email.trim()}
                size="lg"
              >
                <ButtonLoadingText
                  isLoading={isLoading}
                  loadingText="Sending Reset Email..."
                  defaultText="Send Reset Email"
                  showSpinner={true}
                  spinnerSize="sm"
                />
              </Button>
            </CardContent>

            <CardFooter className="flex justify-center text-sm text-slate-600 dark:text-slate-300 pt-3 border-t border-slate-100 dark:border-slate-700/50">
              Remember your password?&nbsp;
              <Link
                href="/signin"
                className="font-medium text-violet-600 hover:text-violet-500 hover:underline transition-colors duration-200"
              >
                Sign in
              </Link>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}

// Wrapper component with Suspense for useSearchParams
export default function ForgotPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-violet-100 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-violet-600 mx-auto"></div>
            <p className="text-lg text-gray-600 dark:text-slate-400">Loading...</p>
          </div>
        </div>
      }
    >
      <ForgotPasswordContent />
    </Suspense>
  );
}
