import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import LandingHeader from '@/src/components/custom/LandingHeader';
import ScreenshotSlideshow from '@/src/components/landing/ScreenshotSlideshow';
import SEOContentBlock from '@/src/components/seo/SEOContentBlock';

export default function LandingPageContent() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header with Navigation */}
      <LandingHeader showFeaturesLink={true} />

      {/* Hero Section */}
      <section className="relative overflow-hidden" role="banner">
        {/* Background decorative elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-violet-50/50 via-transparent to-blue-50/30 dark:from-violet-900/10 dark:via-transparent dark:to-blue-900/10"></div>
        <div className="absolute top-20 right-10 w-72 h-72 bg-violet-200/20 dark:bg-violet-600/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-blue-200/20 dark:bg-blue-600/10 rounded-full blur-3xl"></div>

        <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-24 lg:pt-28 pb-16 sm:pb-20 lg:pb-24">
          {/* Hero Content - Centered */}
          <div className="text-center max-w-5xl mx-auto">
            {/* Beta badge */}
            <div className="inline-flex items-center gap-2 bg-violet-100 dark:bg-violet-900/30 border border-violet-200 dark:border-violet-800/50 rounded-full px-3 py-1 mb-4 sm:mb-6">
              <div
                className="w-2 h-2 bg-violet-500 rounded-full animate-pulse"
                aria-hidden="true"
              ></div>
              <span className="text-xs sm:text-sm font-medium text-violet-700 dark:text-violet-300">
                Beta Access Available
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-bold text-slate-900 dark:text-slate-100 mb-4 sm:mb-6 leading-tight">
              <span className="bg-gradient-to-r from-violet-600 to-blue-600 bg-clip-text text-transparent">
                Get Ready For Certifications
              </span>
              <br />
              with AI-Generated Exams
            </h1>

            <p className="text-base sm:text-lg lg:text-xl xl:text-2xl text-slate-600 dark:text-slate-400 mb-8 sm:mb-10 leading-relaxed font-light px-2">
              Master IT certifications by creating exams on particular exam topics to test your
              knowledge. We are a wonderful addition to IT training by self-testing the knowledge
              you&apos;ve gained. Tell AI to generate exams on your particular needs like focusing
              on specific concepts, technologies, or certification domains. Join our growing
              community of professionals advancing their careers through intelligent exam
              simulation.
            </p>

            {/* Enhanced Stats with SEO keywords */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-8 mb-10">
              <div className="text-center">
                <div className="text-3xl font-bold text-violet-600 dark:text-violet-400">
                  Growing
                </div>
                <div className="text-sm text-slate-500 dark:text-slate-400">Self Exam Users</div>
              </div>
              <div
                className="hidden sm:block w-px h-12 bg-slate-200 dark:bg-slate-700"
                aria-hidden="true"
              ></div>
              <div className="text-center">
                <div className="text-3xl font-bold text-violet-600 dark:text-violet-400">
                  AI Exam
                </div>
                <div className="text-sm text-slate-500 dark:text-slate-400">Simulation</div>
              </div>
              <div
                className="hidden sm:block w-px h-12 bg-slate-200 dark:bg-slate-700"
                aria-hidden="true"
              ></div>
              <div className="text-center">
                <div className="text-3xl font-bold text-violet-600 dark:text-violet-400">Free</div>
                <div className="text-sm text-slate-500 dark:text-slate-400">Beta Access</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Link href="/signup">
                <Button
                  size="lg"
                  className="w-full sm:w-auto rounded-xl px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200 bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-700 hover:to-blue-700"
                >
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                  Start Beta Trial
                </Button>
              </Link>
              <Link href="/signin">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto rounded-xl px-8 py-4 text-lg font-semibold border-2 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all duration-200"
                >
                  Sign In
                </Button>
              </Link>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                No credit card required
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
                14-day free trial
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
                Cancel anytime
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Screenshot Slideshow Section - Full Width */}
      <section className="relative py-16 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900">
        {/* Background decorative elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-violet-50/30 via-transparent to-blue-50/20 dark:from-violet-900/10 dark:via-transparent dark:to-blue-900/10"></div>
        <div className="absolute top-10 right-20 w-48 h-48 bg-violet-200/20 dark:bg-violet-600/10 rounded-full blur-2xl"></div>
        <div className="absolute bottom-10 left-20 w-64 h-64 bg-blue-200/20 dark:bg-blue-600/10 rounded-full blur-2xl"></div>

        <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="relative">
              {/* Decorative background */}
              <div className="absolute inset-0 bg-gradient-to-br from-violet-100 to-blue-100 dark:from-violet-900/20 dark:to-blue-900/20 rounded-3xl transform rotate-1 scale-105"></div>
              <div className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 p-4 md:p-6">
                <ScreenshotSlideshow className="group rounded-xl overflow-hidden w-full" />
              </div>
              {/* Floating elements */}
              <div className="absolute -top-6 -right-6 bg-green-500 text-white rounded-full p-4 shadow-lg">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <div className="absolute -bottom-6 -left-6 bg-violet-500 text-white rounded-full p-4 shadow-lg">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative py-24 bg-slate-50/50 dark:bg-slate-800/30">
        {/* Background decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-violet-50/30 via-transparent to-blue-50/20 dark:from-violet-900/5 dark:via-transparent dark:to-blue-900/5"></div>
        <div className="absolute top-20 left-1/4 w-64 h-64 bg-violet-200/10 dark:bg-violet-600/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-1/4 w-80 h-80 bg-blue-200/10 dark:bg-blue-600/5 rounded-full blur-3xl"></div>

        <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            {/* Section badge */}
            <div className="inline-flex items-center gap-2 bg-violet-100 dark:bg-violet-900/30 border border-violet-200 dark:border-violet-800/50 rounded-full px-4 py-2 mb-6">
              <svg
                className="w-4 h-4 text-violet-600 dark:text-violet-400"
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
              <span className="text-sm font-medium text-violet-700 dark:text-violet-300">
                AI-Powered Features
              </span>
            </div>

            <h2 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-slate-900 dark:text-slate-100 mb-6 leading-tight">
              Simulate Exams by AI &
              <span className="bg-gradient-to-r from-violet-600 to-blue-600 bg-clip-text text-transparent block">
                Prepare by Self Exams
              </span>
            </h2>
            <p className="text-xl lg:text-2xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed font-light">
              Create exams on particular exam topics to test your knowledge mastery. Tell AI to
              generate exams on your particular needs - whether focusing on specific concepts,
              technologies, or certification domains. Currently in early beta with features driven
              by your feedback.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {/* Feature 1: AI-Generated Questions */}
            <div className="group bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-lg rounded-2xl p-8 hover:shadow-2xl hover:border-violet-200 dark:hover:border-violet-800/50 transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-violet-100 to-violet-200 dark:from-violet-900/30 dark:to-violet-800/30 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg
                  className="w-8 h-8 text-violet-600 dark:text-violet-400"
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
              <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors duration-300">
                AI Exam Simulation
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-lg">
                Create exams on particular exam topics to test if you have mastered knowledge. AI
                generates intelligent questions for various IT certifications, with quality
                improving through user feedback and continuous learning.
              </p>
              <div className="mt-6 flex items-center text-violet-600 dark:text-violet-400 font-semibold group-hover:translate-x-2 transition-transform duration-300">
                <span className="mr-2">Learn more</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </div>

            {/* Feature 2: Real Exam Simulation */}
            <div className="group bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-lg rounded-2xl p-8 hover:shadow-2xl hover:border-violet-200 dark:hover:border-violet-800/50 transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg
                  className="w-8 h-8 text-blue-600 dark:text-blue-400"
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
              <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                Self Exam Environment
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-lg">
                Prepare for IT certification by self exams in a realistic practice environment that
                simulates real exam conditions with timing and question formats.
              </p>
              <div className="mt-6 flex items-center text-blue-600 dark:text-blue-400 font-semibold group-hover:translate-x-2 transition-transform duration-300">
                <span className="mr-2">Learn more</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </div>

            {/* Feature 3: Performance Analytics */}
            <div className="group bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-lg rounded-2xl p-8 hover:shadow-2xl hover:border-violet-200 dark:hover:border-violet-800/50 transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-100 to-emerald-200 dark:from-emerald-900/30 dark:to-emerald-800/30 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg
                  className="w-8 h-8 text-emerald-600 dark:text-emerald-400"
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
              <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors duration-300">
                Detailed Analytics
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-lg">
                Working on basic performance tracking to help identify areas for improvement.
                Analytics features are in early development.
              </p>
              <div className="mt-6 flex items-center text-emerald-600 dark:text-emerald-400 font-semibold group-hover:translate-x-2 transition-transform duration-300">
                <span className="mr-2">Learn more</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </div>

            {/* Feature 4: Custom Exam Creation */}
            <div className="group bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-lg rounded-2xl p-8 hover:shadow-2xl hover:border-violet-200 dark:hover:border-violet-800/50 transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-amber-100 to-amber-200 dark:from-amber-900/30 dark:to-amber-800/30 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg
                  className="w-8 h-8 text-amber-600 dark:text-amber-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors duration-300">
                Topic-Focused AI Exams
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-lg">
                Tell AI to generate exams on your particular needs like focusing on a specific
                topic, concept, or weak area. Create targeted practice tests to master knowledge in
                areas that matter most.
              </p>
              <div className="mt-6 flex items-center text-amber-600 dark:text-amber-400 font-semibold group-hover:translate-x-2 transition-transform duration-300">
                <span className="mr-2">Learn more</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </div>

            {/* Feature 6: Progress Tracking */}
            <div className="group bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-lg rounded-2xl p-8 hover:shadow-2xl hover:border-violet-200 dark:hover:border-violet-800/50 transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-100 to-indigo-200 dark:from-indigo-900/30 dark:to-indigo-800/30 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg
                  className="w-8 h-8 text-indigo-600 dark:text-indigo-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-300">
                Progress Monitoring
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-lg">
                Visualize your improvement over time with detailed progress charts, milestone
                tracking, and achievement badges to stay motivated.
              </p>
              <div className="mt-6 flex items-center text-indigo-600 dark:text-indigo-400 font-semibold group-hover:translate-x-2 transition-transform duration-300">
                <span className="mr-2">Learn more</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </div>

            {/* Feature 7: Better Than AI Chatbots */}
            <div className="group bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-lg rounded-2xl p-8 hover:shadow-2xl hover:border-violet-200 dark:hover:border-violet-800/50 transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-100 to-orange-200 dark:from-orange-900/30 dark:to-orange-800/30 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg
                  className="w-8 h-8 text-orange-600 dark:text-orange-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors duration-300">
                Better Than AI Chatbots
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-lg">
                Unlike generating exam tests in AI chatbots directly, Certestic provides a dedicated
                interface with proper exam formatting, timed sessions, progress tracking, and
                seamless user experience designed specifically for certification preparation.
              </p>
              <div className="mt-6 flex items-center text-orange-600 dark:text-orange-400 font-semibold group-hover:translate-x-2 transition-transform duration-300">
                <span className="mr-2">Learn more</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call-to-Action Section */}
      <section className="relative py-24 overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-violet-50/80 via-transparent to-blue-50/60 dark:from-violet-900/20 dark:via-transparent dark:to-blue-900/15"></div>
        <div className="absolute top-10 right-20 w-80 h-80 bg-violet-200/20 dark:bg-violet-600/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 left-20 w-96 h-96 bg-blue-200/20 dark:bg-blue-600/10 rounded-full blur-3xl"></div>

        <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 border-2 border-slate-200 dark:border-slate-700 shadow-2xl rounded-3xl p-12 lg:p-16 text-center overflow-hidden">
            {/* Decorative background pattern */}
            <div className="absolute inset-0 bg-gradient-to-br from-violet-50/50 to-blue-50/30 dark:from-violet-900/10 dark:to-blue-900/5 rounded-3xl"></div>
            <div className="absolute top-0 right-0 w-40 h-40 bg-violet-200/20 dark:bg-violet-600/10 rounded-full blur-2xl"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-200/20 dark:bg-blue-600/10 rounded-full blur-2xl"></div>

            <div className="relative z-10">
              {/* CTA badge */}
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-violet-100 to-blue-100 dark:from-violet-900/30 dark:to-blue-900/30 border border-violet-200 dark:border-violet-800/50 rounded-full px-6 py-3 mb-8">
                <div className="w-3 h-3 bg-gradient-to-r from-violet-500 to-blue-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-semibold text-violet-700 dark:text-violet-300">
                  Limited Time Beta Access
                </span>
              </div>

              <h2 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-slate-900 dark:text-slate-100 mb-8 leading-tight">
                Create Exams on Particular Topics &
                <span className="bg-gradient-to-r from-violet-600 to-blue-600 bg-clip-text text-transparent">
                  Shape the Future
                </span>
                <br />
                of Knowledge Testing
              </h2>

              <p className="text-xl lg:text-2xl text-slate-600 dark:text-slate-400 mb-12 max-w-4xl mx-auto leading-relaxed font-light">
                Join our growing beta community to help develop the next generation of topic-focused
                AI exam tools. Help us perfect how to create exams on particular exam topics and
                tell AI to generate exams on your particular needs.
              </p>

              {/* Enhanced stats for CTA */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-8 mb-12">
                <div className="text-center">
                  <div className="text-4xl font-bold bg-gradient-to-r from-violet-600 to-blue-600 bg-clip-text text-transparent">
                    Open
                  </div>
                  <div className="text-sm text-slate-500 dark:text-slate-400">Beta Access</div>
                </div>
                <div className="hidden sm:block w-px h-16 bg-slate-200 dark:bg-slate-700"></div>
                <div className="text-center">
                  <div className="text-4xl font-bold bg-gradient-to-r from-violet-600 to-blue-600 bg-clip-text text-transparent">
                    Active
                  </div>
                  <div className="text-sm text-slate-500 dark:text-slate-400">Development</div>
                </div>
                <div className="hidden sm:block w-px h-16 bg-slate-200 dark:bg-slate-700"></div>
                <div className="text-center">
                  <div className="text-4xl font-bold bg-gradient-to-r from-violet-600 to-blue-600 bg-clip-text text-transparent">
                    Free
                  </div>
                  <div className="text-sm text-slate-500 dark:text-slate-400">During Beta</div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-6 justify-center mb-10">
                <Link href="/signup">
                  <Button
                    size="lg"
                    className="w-full sm:w-auto rounded-2xl px-12 py-6 text-xl font-bold shadow-2xl hover:shadow-3xl transition-all duration-300 bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-700 hover:to-blue-700 transform hover:scale-105"
                  >
                    <svg
                      className="w-6 h-6 mr-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                    Start Beta Trial
                  </Button>
                </Link>
                <Link href="/signin">
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full sm:w-auto rounded-2xl px-12 py-6 text-xl font-bold border-2 border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-300 transform hover:scale-105"
                  >
                    Sign In
                  </Button>
                </Link>
              </div>

              {/* Enhanced trust indicators */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-base text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-green-600 dark:text-green-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <span className="font-medium">No credit card required</span>
                </div>
                <div className="hidden sm:block">•</div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-green-600 dark:text-green-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <span className="font-medium">Free during beta</span>
                </div>
                <div className="hidden sm:block">•</div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-green-600 dark:text-green-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <span className="font-medium">Cancel anytime</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SEO Content Block */}
      <SEOContentBlock />
    </div>
  );
}
