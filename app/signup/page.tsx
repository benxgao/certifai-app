'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
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
import { auth } from '@/firebase/firebaseWebConfig';
import Link from 'next/link';

// User Authentication
export const MIN_PASSWORD_LENGTH = 6;
export const MIN_PASSWORD_MESSAGE = `min. ${MIN_PASSWORD_LENGTH} characters`;

// UI Text Content
const APP_STATS = {
  // More realistic stats for a growing startup
  BETA_USERS: '500+',
  EARLY_ADOPTERS: '500+',
  SUCCESS_RATE: '90%',
  BETA_SUCCESS_RATE: '90%',
  EXAM_COVERAGE: '20+',
  CERTIFICATIONS_SUPPORTED: '20+',
} as const;

// Form placeholders
const FORM_PLACEHOLDERS = {
  FIRST_NAME: 'John',
  LAST_NAME: 'Doe',
  EMAIL: 'you@example.com',
  PASSWORD: `•••••••• (${MIN_PASSWORD_MESSAGE})`,
} as const;

// Marketing copy
const MARKETING_COPY = {
  HERO_TAGLINE: 'AI-Powered IT Certification Training',
  HERO_DESCRIPTION:
    'Master IT certifications with AI-generated practice exams, real-time performance analysis, and personalized study recommendations. Join our growing community of beta users.',
  SIGNUP_DESCRIPTION:
    'Join 500+ beta users who are accelerating their certification success with AI-powered learning.',
  STATS_LABEL_SUCCESS: 'Beta Success Rate',
  STATS_LABEL_USERS: 'Early Adopters',
} as const;

// Error messages
const ERROR_MESSAGES = {
  EMAIL_IN_USE: 'This email address is already in use.',
  WEAK_PASSWORD: `Password should be at least ${MIN_PASSWORD_LENGTH} characters.`,
  SIGNUP_FAILED: 'Failed to create an account. Please try again.',
  PROFILE_UPDATE_FAILED: 'Failed to update user profile. Please try again.',
} as const;

export default function SignUp() {
  const router = useRouter();
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const onChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError('');
      setIsLoading(true);

      await createUserWithEmailAndPassword(auth, form.email, form.password).then(
        async (userCredential) => {
          // Signed in
          const user = userCredential.user;

          console.log(`User created:0
            | user: ${JSON.stringify(user)}`);

          if (user) {
            await updateProfile(user!, {
              displayName: `${form.firstName} ${form.lastName}`.trim(),
            })
              .then((user) => {
                console.log(`User updated:1
                  | user: ${JSON.stringify(user)}`);
              })
              .catch((error) => {
                console.error('Error updating user profile:', error);
                setError('Failed to update user profile. Please try again.');
              });
          }
        },
      );

      router.replace('/signin');
    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use') {
        setError(ERROR_MESSAGES.EMAIL_IN_USE);
      } else if (error.code === 'auth/weak-password') {
        setError(ERROR_MESSAGES.WEAK_PASSWORD);
      } else {
        setError(ERROR_MESSAGES.SIGNUP_FAILED);
      }
      console.error('Signup Error:', error);
    } finally {
      setIsLoading(false);
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
                href="/signin"
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors duration-200"
              >
                Sign In
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
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                {/* Floating rings */}
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full animate-bounce delay-500"></div>
                <div className="absolute -bottom-1 -left-1 w-4 h-4 bg-gradient-to-br from-pink-400 to-rose-500 rounded-full animate-bounce delay-1000"></div>
              </div>

              <div className="text-center">
                <h2 className="text-4xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent mb-4">
                  Transform Your Career
                </h2>
                <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed mb-8">
                  {MARKETING_COPY.SIGNUP_DESCRIPTION}
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
                        AI-Powered Questions
                      </span>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        Unlimited practice with smart difficulty adjustment
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
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <div className="text-left">
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        Real Exam Simulation
                      </span>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        Authentic testing environment with timer
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
                          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                        />
                      </svg>
                    </div>
                    <div className="text-left">
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        Smart Analytics
                      </span>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        Track progress and identify weak areas
                      </p>
                    </div>
                  </div>
                </div>

                {/* Success Stats */}
                <div className="bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20 rounded-2xl p-6 border border-violet-100 dark:border-violet-800/30">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-violet-600 dark:text-violet-400">
                        {APP_STATS.BETA_SUCCESS_RATE}
                      </div>
                      <div className="text-xs text-slate-600 dark:text-slate-400">
                        {MARKETING_COPY.STATS_LABEL_SUCCESS}
                      </div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-violet-600 dark:text-violet-400">
                        {APP_STATS.EARLY_ADOPTERS}
                      </div>
                      <div className="text-xs text-slate-600 dark:text-slate-400">
                        {MARKETING_COPY.STATS_LABEL_USERS}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Enhanced Signup Form */}
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
                Create your account
              </CardTitle>
              <CardDescription className="text-slate-600 dark:text-slate-400">
                Enter your details below to get started with CertifAI.
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleSignup}>
              <CardContent className="space-y-6">
                {/* First Name and Last Name Row */}
                <div className="flex space-x-4">
                  <div className="w-1/2 space-y-2">
                    <Label
                      htmlFor="first-name"
                      className="text-slate-700 dark:text-slate-300 font-medium"
                    >
                      First Name
                    </Label>
                    <Input
                      id="first-name"
                      name="firstName"
                      type="text"
                      autoComplete="given-name"
                      required
                      value={form.firstName}
                      onChange={onChange}
                      placeholder={FORM_PLACEHOLDERS.FIRST_NAME}
                      disabled={isLoading}
                      className="border-slate-200 dark:border-slate-700 focus:ring-violet-500 focus:border-violet-500 transition-all duration-200 hover:border-slate-300 dark:hover:border-slate-600"
                    />
                  </div>
                  <div className="w-1/2 space-y-2">
                    <Label
                      htmlFor="last-name"
                      className="text-slate-700 dark:text-slate-300 font-medium"
                    >
                      Last Name
                    </Label>
                    <Input
                      id="last-name"
                      name="lastName"
                      type="text"
                      autoComplete="family-name"
                      required
                      value={form.lastName}
                      onChange={onChange}
                      placeholder={FORM_PLACEHOLDERS.LAST_NAME}
                      disabled={isLoading}
                      className="border-slate-200 dark:border-slate-700 focus:ring-violet-500 focus:border-violet-500 transition-all duration-200 hover:border-slate-300 dark:hover:border-slate-600"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="email-address"
                    className="text-slate-700 dark:text-slate-300 font-medium"
                  >
                    Email address
                  </Label>
                  <Input
                    id="email-address"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={form.email}
                    onChange={onChange}
                    placeholder={FORM_PLACEHOLDERS.EMAIL}
                    disabled={isLoading}
                    className="border-slate-200 dark:border-slate-700 focus:ring-violet-500 focus:border-violet-500 transition-all duration-200 hover:border-slate-300 dark:hover:border-slate-600"
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="password"
                    className="text-slate-700 dark:text-slate-300 font-medium"
                  >
                    Password
                  </Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={form.password}
                    onChange={onChange}
                    placeholder={FORM_PLACEHOLDERS.PASSWORD}
                    disabled={isLoading}
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
                  disabled={isLoading}
                  size="lg"
                >
                  {isLoading ? (
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
                      Creating Account...
                    </div>
                  ) : (
                    'Create Account'
                  )}
                </Button>
              </CardContent>
              <CardFooter className="flex justify-center text-sm text-slate-600 dark:text-slate-400 pt-4 border-t border-slate-100 dark:border-slate-700/50">
                Already have an account?&nbsp;
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
    </div>
  );
}
