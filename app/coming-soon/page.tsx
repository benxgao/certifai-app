'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/src/components/ui/card';
import {
  Mail,
  ArrowLeft,
  CheckCircle,
  Users,
  BookOpen,
  HeadphonesIcon,
  FileText,
  Newspaper,
  Sparkles,
} from 'lucide-react';
import LandingHeader from '@/src/components/custom/LandingHeader';

export default function ComingSoonPage() {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Structured Data for SEO - Coming Soon page
  const webPageSchema = useMemo(
    () => ({
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: 'Coming Soon - New AI Features | Certestic',
      description:
        'Get early access to new AI-powered features for IT certification training. Smart documentation, AI study guides, expert community, and more launching soon.',
      url: 'https://certestic.com/coming-soon',
      isPartOf: {
        '@type': 'WebSite',
        name: 'Certestic',
        url: 'https://certestic.com',
      },
      mainEntity: {
        '@type': 'Product',
        name: 'Certestic AI Features',
        description: 'New AI-powered features for IT certification training',
        category: 'Educational Software',
        offers: {
          '@type': 'Offer',
          availability: 'https://schema.org/PreOrder',
          price: '0',
          priceCurrency: 'USD',
        },
      },
    }),
    [],
  );

  // Default feature info that's consistent between server and client
  const defaultFeatureInfo = useMemo(
    () => ({
      feature: 'Exciting New Feature',
      expectedDate: 'Q3 2025',
      description:
        'Something cool is brewing! This new feature will enhance your IT certification journey with AI-powered learning.',
      icon: Sparkles,
    }),
    [],
  );

  const [featureInfo, setFeatureInfo] = useState(defaultFeatureInfo);

  // Get feature info based on current path (client-side only)
  const getFeatureInfo = useCallback(
    (pathname: string) => {
      const featureMap: Record<
        string,
        { feature: string; expectedDate: string; description: string; icon: any }
      > = {
        '/documentation': {
          feature: 'Smart Documentation',
          expectedDate: 'Q3 2025',
          description:
            'Interactive guides that adapt to how you learn and track your progress through IT certification materials.',
          icon: FileText,
        },
        '/blog': {
          feature: 'Learning Insights Blog',
          expectedDate: 'Q4 2025',
          description:
            'Insights, success stories, and strategies from IT professionals who aced their certifications using this platform.',
          icon: Newspaper,
        },
        '/study-guides': {
          feature: 'AI Study Guides',
          expectedDate: 'Q3 2025',
          description:
            'Personalized study paths powered by AI that adapt to your knowledge gaps and help you learn more effectively.',
          icon: BookOpen,
        },
        '/community': {
          feature: 'Expert Community',
          expectedDate: 'Q4 2025',
          description:
            'Connect with certified professionals, get mentorship, and collaborate with peers on your certification journey.',
          icon: Users,
        },
        '/support': {
          feature: 'Smart Support Center',
          expectedDate: 'Q3 2025',
          description:
            'AI-powered help system with instant answers, video tutorials, and direct access to the support team when you need it.',
          icon: HeadphonesIcon,
        },
      };

      return featureMap[pathname] || defaultFeatureInfo;
    },
    [defaultFeatureInfo],
  );

  useEffect(() => {
    // Update feature info based on actual path once client-side
    if (typeof window !== 'undefined') {
      setFeatureInfo(getFeatureInfo(window.location.pathname));
    }
  }, [getFeatureInfo]);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setIsSubmitting(false);
    setIsSubscribed(true);

    // Reset after 3 seconds
    setTimeout(() => {
      setEmail('');
      setIsSubscribed(false);
    }, 3000);
  };

  return (
    <>
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
      />

      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 overflow-x-hidden">
        {/* Header */}
        <LandingHeader />

        {/* Main Content */}
        <main className="relative overflow-hidden">
          {/* Background decorative elements - matching home page */}
          <div className="absolute inset-0 bg-gradient-to-br from-violet-50/50 via-transparent to-blue-50/30 dark:from-violet-900/10 dark:via-transparent dark:to-blue-900/10"></div>
          <div className="absolute top-20 right-2 sm:right-10 w-48 sm:w-72 h-48 sm:h-72 bg-violet-200/20 dark:bg-violet-600/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-2 sm:left-10 w-64 sm:w-96 h-64 sm:h-96 bg-blue-200/20 dark:bg-blue-600/10 rounded-full blur-3xl"></div>

          <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-24 lg:pt-28 pb-16 sm:pb-20 lg:pb-24">
            {/* Back Button */}
            <div className="mb-8 max-w-5xl mx-auto">
              <Link
                href="/"
                className="inline-flex items-center text-slate-600 dark:text-slate-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors group"
              >
                <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                Back to Home
              </Link>
            </div>

            {/* Hero Section - matching home page style */}
            <div className="text-center max-w-5xl mx-auto">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-slate-900 dark:text-slate-100 mb-4 sm:mb-6 leading-tight">
                <span className="bg-gradient-to-r from-violet-600 to-blue-600 bg-clip-text text-transparent">
                  {featureInfo.feature}
                </span>
                <br />
                is Coming Soon
              </h1>

              <p className="text-base sm:text-lg lg:text-xl xl:text-2xl text-slate-600 dark:text-slate-400 mb-8 sm:mb-10 leading-relaxed font-light px-2 max-w-3xl mx-auto">
                {featureInfo.description} This feature is being built to take your learning
                experience to the next level. Get ready for the future of IT certification training!
              </p>

              {/* Trust indicators - matching home page */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm text-slate-500 dark:text-slate-400 mb-10">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Premium access continues
                </div>
                <div className="hidden sm:block">•</div>
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  No wait - use current features
                </div>
                <div className="hidden sm:block">•</div>
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Get notified when ready
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Email Subscription Section - styled like home page features */}
        <section className="relative py-16 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 overflow-hidden">
          {/* Background decorative elements */}
          <div className="absolute inset-0 bg-gradient-to-br from-violet-50/30 via-transparent to-blue-50/20 dark:from-violet-900/10 dark:via-transparent dark:to-blue-900/10"></div>
          <div className="absolute top-10 right-4 sm:right-20 w-32 sm:w-48 h-32 sm:h-48 bg-violet-200/20 dark:bg-violet-600/10 rounded-full blur-2xl"></div>
          <div className="absolute bottom-10 left-4 sm:left-20 w-48 sm:w-64 h-48 sm:h-64 bg-blue-200/20 dark:bg-blue-600/10 rounded-full blur-2xl"></div>

          <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                {/* Decorative background */}
                <div className="absolute inset-0 bg-gradient-to-br from-violet-100 to-blue-100 dark:from-violet-900/20 dark:to-blue-900/20 rounded-3xl transform rotate-1 scale-105"></div>

                <Card className="relative bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm border border-slate-200/60 dark:border-slate-700/60 shadow-2xl rounded-2xl">
                  <CardHeader className="text-center pb-4">
                    <CardTitle className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                      Get Early Access
                    </CardTitle>
                    <CardDescription className="text-slate-600 dark:text-slate-400 text-lg">
                      Be the first to experience the future of IT certification training
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0 p-6">
                    {isSubscribed ? (
                      <div className="text-center py-8">
                        <div className="h-16 w-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-4">
                          <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
                        </div>
                        <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
                          You&apos;re on the VIP list!
                        </h3>
                        <p className="text-slate-600 dark:text-slate-400">
                          You&apos;ll get notified the moment this feature launches. Get ready for
                          something amazing!
                        </p>
                      </div>
                    ) : (
                      <form onSubmit={handleEmailSubmit} className="space-y-6">
                        <div className="flex flex-col sm:flex-row gap-3">
                          <Input
                            type="email"
                            placeholder="Enter your email address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="flex-1 h-12 text-base bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600"
                          />
                          <Button
                            type="submit"
                            disabled={isSubmitting}
                            size="lg"
                            className="h-12 px-6 bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-700 hover:to-blue-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                          >
                            {isSubmitting ? (
                              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                            ) : (
                              <>
                                <Mail className="h-5 w-5 mr-2" />
                                Notify Me
                              </>
                            )}
                          </Button>
                        </div>
                        <p className="text-sm text-slate-500 dark:text-slate-400 text-center">
                          Join thousands of learners. No spam, unsubscribe anytime.
                        </p>
                      </form>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Alternative Actions Section - styled like home page */}
        <section className="relative py-16 sm:py-24 bg-slate-50/50 dark:bg-slate-800/30 overflow-hidden">
          {/* Background decorative elements */}
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-violet-50/30 via-transparent to-blue-50/20 dark:from-violet-900/5 dark:via-transparent dark:to-blue-900/5"></div>
          <div className="absolute top-10 sm:top-20 left-1/4 w-32 sm:w-64 h-32 sm:h-64 bg-violet-200/10 dark:bg-violet-600/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 sm:bottom-20 right-1/4 w-48 sm:w-80 h-48 sm:h-80 bg-blue-200/10 dark:bg-blue-600/5 rounded-full blur-3xl"></div>

          <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-slate-100 mb-6">
                <span className="bg-gradient-to-r from-violet-600 to-blue-600 bg-clip-text text-transparent">
                  Don&apos;t Wait
                </span>
                <br />
                Start Learning Today!
              </h2>

              <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 mb-12 leading-relaxed max-w-2xl mx-auto">
                While this exciting new feature is in development, explore the current AI-powered
                certification training platform. Get personalized practice exams and advance your
                career right now!
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                <Link href="/signup">
                  <Button
                    size="lg"
                    className="w-full sm:w-auto rounded-xl px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200 bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-700 hover:to-blue-700"
                  >
                    Start Learning Now!
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full sm:w-auto rounded-xl px-8 py-4 text-lg font-semibold border-2 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all duration-200"
                  >
                    Contact Us
                  </Button>
                </Link>
              </div>

              {/* Feature highlights */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
                <div className="text-center p-6 rounded-2xl bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-slate-200/60 dark:border-slate-700/60">
                  <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center mx-auto mb-4">
                    <Sparkles className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
                    AI-Powered
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm">
                    Generate personalized practice exams with advanced AI technology
                  </p>
                </div>

                <div className="text-center p-6 rounded-2xl bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-slate-200/60 dark:border-slate-700/60">
                  <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center mx-auto mb-4">
                    <BookOpen className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
                    Platform Access
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm">
                    Complete platform access with study tools to start your journey
                  </p>
                </div>

                <div className="text-center p-6 rounded-2xl bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-slate-200/60 dark:border-slate-700/60">
                  <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center mx-auto mb-4">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
                    Join Community
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm">
                    Connect with thousands of learners advancing their IT careers
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
