'use client';

import React, { useState, useEffect } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
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
import { Loader2 } from 'lucide-react';

import { auth } from '@/src/firebase/firebaseWebConfig';

const LoginPage = () => {
  const [form, setForm] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const router = useRouter();

  // Clear any error messages from URL params (in case user was redirected back with error)
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const errorParam = urlParams.get('error');
    if (errorParam) {
      setError(decodeURIComponent(errorParam));
      // Clean up URL
      const newUrl = window.location.pathname;
      window.history.replaceState({}, '', newUrl);
    }
  }, []);

  const onChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSignin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError('');
      setIsLoading(true);

      // Start the authentication process
      const signInPromise = signInWithEmailAndPassword(auth, form.email, form.password);

      // Immediately set redirecting state and navigate to main page for better UX
      setIsRedirecting(true);
      router.replace('/main');

      // Continue authentication in the background
      const signedIn = await signInPromise;

      console.log(`signin initialized
        | uid: ${JSON.stringify(signedIn.user.uid)}`);

      const firebaseToken = await signedIn.user.getIdToken(true);

      // Set the authentication cookie
      const cookieRes = await fetch('/api/auth-cookie/set', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firebaseToken }),
      });

      if (!cookieRes.ok) {
        const cookieError: any = await cookieRes.json();
        console.error('Failed to set authentication cookie:', cookieError.message);
        // If cookie setting fails, redirect back to signin with error
        const errorMessage = encodeURIComponent(
          cookieError.message || 'Failed to set authentication cookie.',
        );
        router.replace(`/signin?error=${errorMessage}`);
      }
    } catch (error: any) {
      console.error(error);

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
        }
      }

      // If authentication fails, redirect back to signin with error
      const encodedError = encodeURIComponent(errorMessage);
      router.replace(`/signin?error=${encodedError}`);
    } finally {
      setIsLoading(false);
      setIsRedirecting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <div className="flex items-center">
              <Link href="/" className="flex items-center space-x-2">
                <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-lg">C</span>
                </div>
                <span className="font-bold text-xl text-foreground">CertifAI</span>
              </Link>
            </div>

            {/* Navigation */}
            <div className="flex items-center space-x-4">
              <Link
                href="/signup"
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors duration-200"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="w-full lg:grid lg:grid-cols-2">
        {/* Left Column - Enhanced Welcome Section */}
        <div className="hidden lg:flex lg:items-center lg:justify-center relative overflow-hidden">
          {/* Animated Background Elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-gradient-to-br from-violet-400/20 to-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute top-1/2 right-10 w-32 h-32 bg-gradient-to-br from-cyan-400/20 to-blue-500/20 rounded-full blur-2xl animate-pulse delay-1000"></div>
            <div className="absolute bottom-10 left-1/3 w-28 h-28 bg-gradient-to-br from-pink-400/20 to-rose-500/20 rounded-full blur-2xl animate-pulse delay-2000"></div>
          </div>

          <div className="relative z-10 max-w-lg p-8">
            {/* Main Content Card */}
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 rounded-3xl p-8 shadow-2xl">
              {/* Animated Icon */}
              <div className="relative mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg transform rotate-3 hover:rotate-0 transition-transform duration-500">
                  <svg
                    className="w-10 h-10 text-white"
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
                {/* Floating rings */}
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full animate-bounce delay-500"></div>
                <div className="absolute -bottom-1 -left-1 w-4 h-4 bg-gradient-to-br from-pink-400 to-rose-500 rounded-full animate-bounce delay-1000"></div>
              </div>

              <div className="text-center">
                <h2 className="text-4xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent mb-4">
                  Welcome Back
                </h2>
                <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed mb-8">
                  Continue your IT certification journey with AI-powered practice exams and
                  personalized learning insights.
                </p>

                {/* Enhanced Feature List */}
                <div className="space-y-4 mb-8">
                  <div className="flex items-center group">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-200">
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div className="text-left">
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        Resume Progress
                      </span>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        Pick up where you left off
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center group">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-200">
                      <svg
                        className="w-5 h-5 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                        />
                      </svg>
                    </div>
                    <div className="text-left">
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        View Analytics
                      </span>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        Track your performance
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center group">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-violet-500 rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-200">
                      <svg
                        className="w-5 h-5 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 10V3L4 14h7v7l9-11h-7z"
                        />
                      </svg>
                    </div>
                    <div className="text-left">
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        Continue Learning
                      </span>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        Access new practice sessions
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Enhanced Signin Form */}
        <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative">
          {/* Subtle background decoration for mobile */}
          <div className="absolute inset-0 lg:hidden overflow-hidden">
            <div className="absolute top-20 right-10 w-32 h-32 bg-gradient-to-br from-violet-400/10 to-purple-500/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-20 left-10 w-28 h-28 bg-gradient-to-br from-cyan-400/10 to-blue-500/10 rounded-full blur-2xl"></div>
          </div>

          <Card className="w-full max-w-md bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 shadow-2xl relative z-10">
            <CardHeader className="text-center space-y-1 pb-6">
              {/* Small decorative element */}
              <div className="w-12 h-1 bg-gradient-to-r from-violet-500 to-purple-500 rounded-full mx-auto mb-4"></div>
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
                Sign In
              </CardTitle>
              <CardDescription className="text-slate-600 dark:text-slate-400">
                Enter your credentials to access your CertifAI account.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSignin} className="space-y-6">
                <div className="space-y-2">
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
                    className="border-slate-200 dark:border-slate-700 focus:ring-violet-500 focus:border-violet-500 transition-all duration-200 hover:border-slate-300 dark:hover:border-slate-600"
                  />
                </div>
                <div className="space-y-2">
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
                    className="border-slate-200 dark:border-slate-700 focus:ring-violet-500 focus:border-violet-500 transition-all duration-200 hover:border-slate-300 dark:hover:border-slate-600"
                  />
                </div>
                {error && (
                  <div className="bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-100 text-sm p-3 rounded-xl border border-red-200 dark:border-red-800/50 animate-in slide-in-from-top-2 duration-300">
                    {error}
                  </div>
                )}
                <Button
                  type="submit"
                  className="w-full rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]"
                  disabled={isLoading || isRedirecting}
                  size="lg"
                >
                  {(isLoading || isRedirecting) && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {isRedirecting ? 'Redirecting...' : isLoading ? 'Signing In...' : 'Sign In'}
                </Button>
              </form>
            </CardContent>
            <CardFooter className="flex justify-center text-sm text-slate-600 dark:text-slate-400 pt-4 border-t border-slate-100 dark:border-slate-700/50">
              Don&apos;t have an account?&nbsp;
              <Link
                href="/signup"
                className="font-medium text-violet-600 hover:text-violet-500 hover:underline transition-colors duration-200"
              >
                Sign up
              </Link>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
