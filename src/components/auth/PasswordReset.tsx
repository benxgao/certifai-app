'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { confirmPasswordReset, verifyPasswordResetCode } from 'firebase/auth';
import { auth } from '@/src/firebase/firebaseWebConfig';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import LandingHeader from '@/src/components/custom/LandingHeader';
import Link from 'next/link';

export default function PasswordReset() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'ready' | 'success' | 'error' | 'expired'>(
    'loading',
  );
  const [errorMessage, setErrorMessage] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [oobCode, setOobCode] = useState<string | null>(null);

  useEffect(() => {
    const verifyResetCode = async () => {
      const mode = searchParams.get('mode');
      const code = searchParams.get('oobCode');

      // Check if this is a password reset request
      if (mode !== 'resetPassword' || !code) {
        setStatus('error');
        setErrorMessage('Invalid password reset link. Please check your email and try again.');
        return;
      }

      try {
        // Verify the password reset code and get the email
        const userEmail = await verifyPasswordResetCode(auth, code);
        setEmail(userEmail);
        setOobCode(code);
        setStatus('ready');
      } catch (error: any) {

        if (error.code === 'auth/expired-action-code') {
          setStatus('expired');
          setErrorMessage('This password reset link has expired. Please request a new one.');
        } else if (error.code === 'auth/invalid-action-code') {
          setStatus('error');
          setErrorMessage(
            'This password reset link is invalid. Please check your email and try again.',
          );
        } else {
          setStatus('error');
          setErrorMessage(
            'Password reset verification failed. Please try again or contact support.',
          );
        }
      }
    };

    verifyResetCode();
  }, [searchParams]);

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!oobCode) {
      setErrorMessage('Invalid reset code. Please try again.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please try again.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage('');

      // Confirm the password reset with the new password
      await confirmPasswordReset(auth, oobCode, password);

      setStatus('success');
    } catch (error: any) {

      switch (error.code) {
        case 'auth/expired-action-code':
          setErrorMessage('This password reset link has expired. Please request a new one.');
          break;
        case 'auth/invalid-action-code':
          setErrorMessage(
            'This password reset link is invalid. Please check your email and try again.',
          );
          break;
        case 'auth/weak-password':
          setErrorMessage('Password is too weak. Please choose a stronger password.');
          break;
        default:
          setErrorMessage('Password reset failed. Please try again or contact support.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleContinueToSignIn = () => {
    router.push('/signin?passwordReset=success');
  };

  const handleRequestNewLink = () => {
    router.push('/signin?passwordReset=expired');
  };

  return (
    <div className="flex flex-col min-h-screen">
      <LandingHeader />
      <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-violet-50 via-purple-25 to-indigo-50">
        <Card className="w-full max-w-md bg-white/95 backdrop-blur-sm border border-slate-200/50 shadow-2xl">
          <CardHeader className="text-center space-y-6 pb-8">
            {status === 'loading' && (
              <>
                <div className="w-20 h-20 bg-gradient-to-r from-violet-500 to-purple-500 rounded-full mx-auto flex items-center justify-center shadow-lg">
                  <svg
                    className="w-10 h-10 text-white animate-spin"
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
                  <CardTitle className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                    Verifying reset link
                  </CardTitle>
                  <CardDescription className="text-slate-600 dark:text-slate-300 text-base">
                    We&apos;re confirming your password reset request. This should only take a
                    moment.
                  </CardDescription>
                </div>
              </>
            )}

            {status === 'ready' && (
              <>
                <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full mx-auto flex items-center justify-center shadow-lg">
                  <svg
                    className="w-10 h-10 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
                <div className="space-y-2">
                  <CardTitle className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                    Reset your password
                  </CardTitle>
                  <CardDescription className="text-slate-600 dark:text-slate-300 text-base">
                    Enter a new password for {email}
                  </CardDescription>
                </div>
              </>
            )}

            {status === 'success' && (
              <>
                <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full mx-auto flex items-center justify-center shadow-lg">
                  <svg
                    className="w-10 h-10 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <div className="space-y-2">
                  <CardTitle className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                    Password reset successful!
                  </CardTitle>
                  <CardDescription className="text-slate-600 dark:text-slate-300 text-base">
                    Your password has been successfully updated. You can now sign in with your new
                    password.
                  </CardDescription>
                </div>
              </>
            )}

            {(status === 'error' || status === 'expired') && (
              <>
                <div className="w-20 h-20 bg-gradient-to-r from-red-500 to-rose-500 rounded-full mx-auto flex items-center justify-center shadow-lg">
                  <svg
                    className="w-10 h-10 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </div>
                <div className="space-y-2">
                  <CardTitle className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                    {status === 'expired' ? 'Link expired' : 'Reset failed'}
                  </CardTitle>
                  <CardDescription className="text-slate-600 dark:text-slate-300 text-base">
                    {errorMessage}
                  </CardDescription>
                </div>
              </>
            )}
          </CardHeader>

          <CardContent className="space-y-6 px-6 pb-6">
            {status === 'ready' && (
              <form onSubmit={handlePasswordReset} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-slate-700 font-medium">
                    New Password
                  </Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Enter new password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isSubmitting}
                    className="border-slate-200 focus:ring-violet-500 focus:border-violet-500 transition-all duration-200"
                    minLength={6}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-slate-700 font-medium">
                    Confirm New Password
                  </Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    placeholder="Confirm new password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={isSubmitting}
                    className="border-slate-200 focus:ring-violet-500 focus:border-violet-500 transition-all duration-200"
                    minLength={6}
                  />
                </div>

                {errorMessage && (
                  <div className="bg-red-50 text-red-800 text-sm p-3 rounded-xl border border-red-200">
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
                      {errorMessage}
                    </div>
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white font-semibold transition-all duration-200 transform hover:scale-[1.02]"
                  size="lg"
                  disabled={isSubmitting || !password || !confirmPassword}
                >
                  {isSubmitting ? (
                    <div className="flex items-center">
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
                      Resetting Password...
                    </div>
                  ) : (
                    'Reset Password'
                  )}
                </Button>
              </form>
            )}

            {status === 'success' && (
              <Button
                onClick={handleContinueToSignIn}
                className="w-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white font-semibold transition-all duration-200 transform hover:scale-[1.02]"
                size="lg"
              >
                Continue to Sign In
              </Button>
            )}

            {status === 'expired' && (
              <Button
                onClick={handleRequestNewLink}
                className="w-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white font-semibold transition-all duration-200 transform hover:scale-[1.02]"
                size="lg"
              >
                Request New Reset Link
              </Button>
            )}

            {status === 'error' && (
              <div className="space-y-3">
                <Button
                  onClick={handleRequestNewLink}
                  className="w-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white font-semibold transition-all duration-200 transform hover:scale-[1.02]"
                  size="lg"
                >
                  Request New Reset Link
                </Button>
                <Button
                  onClick={() => router.push('/support')}
                  variant="outline"
                  className="w-full border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all duration-200"
                  size="lg"
                >
                  Contact Support
                </Button>
              </div>
            )}

            {status === 'loading' && (
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-800 text-sm p-5 rounded-xl border border-blue-200/50 shadow-sm">
                <div className="flex items-center justify-center">
                  <svg
                    className="w-5 h-5 mr-3 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="font-medium">Verifying your reset request...</span>
                </div>
              </div>
            )}

            {(status === 'ready' || status === 'error' || status === 'expired') && (
              <div className="text-center text-sm text-slate-600">
                Remember your password?{' '}
                <Link
                  href="/signin"
                  className="font-medium text-violet-600 hover:text-violet-500 hover:underline transition-colors duration-200"
                >
                  Sign in instead
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
