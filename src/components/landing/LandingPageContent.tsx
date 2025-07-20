import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import LandingHeader from '@/src/components/custom/LandingHeader';
import ScreenshotSlideshow from '@/src/components/landing/ScreenshotSlideshow';
import SEOContentBlock from '@/src/components/seo/SEOContentBlock';

export default function LandingPageContent() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 overflow-x-hidden">
      {/* Header with Navigation */}
      <LandingHeader />

      {/* Hero Section */}
      <section className="relative overflow-hidden" role="banner">
        {/* Background decorative elements - mobile responsive */}
        <div className="absolute inset-0 bg-gradient-to-br from-violet-50/50 via-transparent to-blue-50/30 dark:from-violet-900/10 dark:via-transparent dark:to-blue-900/10"></div>
        <div className="absolute top-20 right-2 sm:right-10 w-48 sm:w-72 h-48 sm:h-72 bg-violet-200/20 dark:bg-violet-600/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-2 sm:left-10 w-64 sm:w-96 h-64 sm:h-96 bg-blue-200/20 dark:bg-blue-600/10 rounded-full blur-3xl"></div>

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
                Free Beta Access Available!
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-bold text-slate-900 dark:text-slate-100 mb-4 sm:mb-6 leading-tight">
              <span className="bg-gradient-to-r from-violet-600 to-blue-600 bg-clip-text text-transparent">
                AI That Learns How YOU Learn
              </span>
              <br />
              <span className="bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent font-extrabold">
                Certestic
              </span>{' '}
              - Your Personal Certification Success Engine
            </h1>

            <p className="text-base sm:text-lg lg:text-xl xl:text-2xl text-slate-600 dark:text-slate-400 mb-8 sm:mb-10 leading-relaxed font-light px-2">
              Stop wasting study time on topics you already know. Our adaptive AI creates
              personalized exams that get smarter with every test - focusing on your weak areas
              while challenging your strengths. Experience intelligent questions that evolve with
              your progress and accelerate your certification success.
            </p>

            {/* Enhanced Stats with SEO keywords */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-8 mb-10">
              <div className="text-center">
                <div className="text-3xl font-bold text-violet-600 dark:text-violet-400">
                  Free Beta
                </div>
                <div className="text-sm text-slate-500 dark:text-slate-400">Access</div>
              </div>
              <div
                className="hidden sm:block w-px h-12 bg-slate-200 dark:bg-slate-700"
                aria-hidden="true"
              ></div>
              <div className="text-center">
                <div className="text-3xl font-bold text-violet-600 dark:text-violet-400">
                  Advanced AI
                </div>
                <div className="text-sm text-slate-500 dark:text-slate-400">Exam Generator</div>
              </div>
              <div
                className="hidden sm:block w-px h-12 bg-slate-200 dark:bg-slate-700"
                aria-hidden="true"
              ></div>
              <div className="text-center">
                <div className="text-3xl font-bold text-violet-600 dark:text-violet-400">
                  100% Free
                </div>
                <div className="text-sm text-slate-500 dark:text-slate-400">Beta Access</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Link href="/signup">
                <Button
                  size="lg"
                  className="w-full sm:w-auto rounded-xl px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200 bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-700 hover:to-blue-700"
                >
                  Start Learning Now!
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
                No credit card needed
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
                Free beta access
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
                Personalized learning
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Screenshot Slideshow Section - Full Width */}
      <section className="relative py-16 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 overflow-hidden">
        {/* Background decorative elements - mobile responsive */}
        <div className="absolute inset-0 bg-gradient-to-br from-violet-50/30 via-transparent to-blue-50/20 dark:from-violet-900/10 dark:via-transparent dark:to-blue-900/10"></div>
        <div className="absolute top-10 right-4 sm:right-20 w-32 sm:w-48 h-32 sm:h-48 bg-violet-200/20 dark:bg-violet-600/10 rounded-full blur-2xl"></div>
        <div className="absolute bottom-10 left-4 sm:left-20 w-48 sm:w-64 h-48 sm:h-64 bg-blue-200/20 dark:bg-blue-600/10 rounded-full blur-2xl"></div>

        <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="relative">
              {/* Decorative background */}
              <div className="absolute inset-0 bg-gradient-to-br from-violet-100 to-blue-100 dark:from-violet-900/20 dark:to-blue-900/20 rounded-3xl transform rotate-1 scale-105"></div>
              <div className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 p-4 md:p-6">
                <ScreenshotSlideshow className="group rounded-xl overflow-hidden w-full" />
              </div>
              {/* Floating elements - mobile responsive positioning */}
              <div className="absolute -top-3 -right-3 sm:-top-6 sm:-right-6 bg-green-500 text-white rounded-full p-2 sm:p-4 shadow-lg">
                <svg
                  className="w-4 h-4 sm:w-8 sm:h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <div className="absolute -bottom-3 -left-3 sm:-bottom-6 sm:-left-6 bg-violet-500 text-white rounded-full p-2 sm:p-4 shadow-lg">
                <svg
                  className="w-4 h-4 sm:w-8 sm:h-8"
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
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        id="features"
        className="relative py-16 sm:py-24 bg-slate-50/50 dark:bg-slate-800/30 overflow-hidden"
      >
        {/* Background decorative elements - mobile responsive */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-violet-50/30 via-transparent to-blue-50/20 dark:from-violet-900/5 dark:via-transparent dark:to-blue-900/5"></div>
        <div className="absolute top-10 sm:top-20 left-1/4 w-32 sm:w-64 h-32 sm:h-64 bg-violet-200/10 dark:bg-violet-600/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 sm:bottom-20 right-1/4 w-48 sm:w-80 h-48 sm:h-80 bg-blue-200/10 dark:bg-blue-600/5 rounded-full blur-3xl"></div>

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
                Platform Features
              </span>
            </div>

            <h2 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-slate-900 dark:text-slate-100 mb-6 leading-tight">
              No More Wasted Study Time &
              <span className="bg-gradient-to-r from-violet-600 to-blue-600 bg-clip-text text-transparent block">
                Adaptive Learning That Actually Works
              </span>
            </h2>
            <p className="text-xl lg:text-2xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed font-light">
              Our adaptive AI analyzes your performance history to create personalized exams. Weak
              areas get more questions, strong areas get harder challenges, and your study sessions
              become laser-focused on what you need to master next.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {/* Feature 1: AI-Generated Questions */}
            <div className="group relative bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border border-slate-200/60 dark:border-slate-700/60 shadow-xl rounded-3xl p-8 hover:shadow-2xl hover:border-violet-300/60 dark:hover:border-violet-700/60 transition-all duration-500 transform hover:-translate-y-3 hover:scale-105 flex flex-col h-full overflow-hidden">
              {/* Background gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-violet-50/50 via-transparent to-transparent dark:from-violet-900/20 dark:via-transparent dark:to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl"></div>
              <div className="relative w-20 h-20 bg-gradient-to-br from-violet-100 via-violet-200 to-violet-300 dark:from-violet-900/40 dark:via-violet-800/40 dark:to-violet-700/40 rounded-3xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg">
                <div className="absolute inset-0 bg-gradient-to-br from-violet-400/20 to-violet-600/20 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <svg
                  className="relative w-10 h-10 text-violet-600 dark:text-violet-400 group-hover:text-violet-700 dark:group-hover:text-violet-300 transition-colors duration-300"
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
              <h3 className="relative text-2xl font-bold text-slate-900 dark:text-slate-100 mb-6 group-hover:text-violet-700 dark:group-hover:text-violet-300 transition-colors duration-300">
                Adaptive AI Learning Engine
              </h3>
              <p className="relative text-slate-600 dark:text-slate-400 leading-relaxed text-lg flex-grow mb-8">
                Revolutionary AI technology that learns from your performance history. Each exam
                adapts based on your previous results - more questions for weak areas, advanced
                challenges for strengths. Experience truly personalized learning that evolves with
                your progress and maximizes study efficiency.
              </p>
              <div className="relative mt-auto flex items-center text-violet-600 dark:text-violet-400 font-semibold group-hover:text-violet-700 dark:group-hover:text-violet-300 group-hover:translate-x-3 transition-all duration-300">
                <span className="mr-3">Learn more</span>
                <div className="w-8 h-8 bg-violet-100 dark:bg-violet-900/40 rounded-full flex items-center justify-center group-hover:bg-violet-200 dark:group-hover:bg-violet-800/60 transition-colors duration-300">
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

            {/* Feature 2: Real Exam Simulation */}
            <div className="group relative bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border border-slate-200/60 dark:border-slate-700/60 shadow-xl rounded-3xl p-8 hover:shadow-2xl hover:border-blue-300/60 dark:hover:border-blue-700/60 transition-all duration-500 transform hover:-translate-y-3 hover:scale-105 flex flex-col h-full overflow-hidden">
              {/* Background gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-transparent dark:from-blue-900/20 dark:via-transparent dark:to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl"></div>

              <div className="relative w-20 h-20 bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300 dark:from-blue-900/40 dark:via-blue-800/40 dark:to-blue-700/40 rounded-3xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-blue-600/20 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <svg
                  className="relative w-10 h-10 text-blue-600 dark:text-blue-400 group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors duration-300"
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
              <h3 className="relative text-2xl font-bold text-slate-900 dark:text-slate-100 mb-6 group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors duration-300">
                Realistic Exam Simulation
              </h3>
              <p className="relative text-slate-600 dark:text-slate-400 leading-relaxed text-lg flex-grow mb-8">
                Experience authentic exam conditions with timed sessions and realistic question
                formats. Practice with confidence-building exercises that mirror actual
                certification exams, helping you feel prepared and reduce test anxiety.
              </p>
              <div className="relative mt-auto flex items-center text-blue-600 dark:text-blue-400 font-semibold group-hover:text-blue-700 dark:group-hover:text-blue-300 group-hover:translate-x-3 transition-all duration-300">
                <span className="mr-3">Try demo</span>
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/40 rounded-full flex items-center justify-center group-hover:bg-blue-200 dark:group-hover:bg-blue-800/60 transition-colors duration-300">
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

            {/* Feature 3: Performance Analytics */}
            <div className="group relative bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border border-slate-200/60 dark:border-slate-700/60 shadow-xl rounded-3xl p-8 hover:shadow-2xl hover:border-emerald-300/60 dark:hover:border-emerald-700/60 transition-all duration-500 transform hover:-translate-y-3 hover:scale-105 flex flex-col h-full overflow-hidden">
              {/* Background gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 via-transparent to-transparent dark:from-emerald-900/20 dark:via-transparent dark:to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl"></div>

              <div className="relative w-20 h-20 bg-gradient-to-br from-emerald-100 via-emerald-200 to-emerald-300 dark:from-emerald-900/40 dark:via-emerald-800/40 dark:to-emerald-700/40 rounded-3xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/20 to-emerald-600/20 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <svg
                  className="relative w-10 h-10 text-emerald-600 dark:text-emerald-400 group-hover:text-emerald-700 dark:group-hover:text-emerald-300 transition-colors duration-300"
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
              <h3 className="relative text-2xl font-bold text-slate-900 dark:text-slate-100 mb-6 group-hover:text-emerald-700 dark:group-hover:text-emerald-300 transition-colors duration-300">
                Smart Performance Analytics
              </h3>
              <p className="relative text-slate-600 dark:text-slate-400 leading-relaxed text-lg flex-grow mb-8">
                Advanced analytics that identify your knowledge gaps and learning patterns. Track
                improvement trends, mastery levels, and confidence scores across all certification
                topics. Get actionable insights that guide your next study session for maximum
                learning efficiency.
              </p>
              <div className="relative mt-auto flex items-center text-emerald-600 dark:text-emerald-400 font-semibold group-hover:text-emerald-700 dark:group-hover:text-emerald-300 group-hover:translate-x-3 transition-all duration-300">
                <span className="mr-3">View analytics</span>
                <div className="w-8 h-8 bg-emerald-100 dark:bg-emerald-900/40 rounded-full flex items-center justify-center group-hover:bg-emerald-200 dark:group-hover:bg-emerald-800/60 transition-colors duration-300">
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

            {/* Feature 4: Custom Exam Creation */}
            <div className="group relative bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border border-slate-200/60 dark:border-slate-700/60 shadow-xl rounded-3xl p-8 hover:shadow-2xl hover:border-amber-300/60 dark:hover:border-amber-700/60 transition-all duration-500 transform hover:-translate-y-3 hover:scale-105 flex flex-col h-full overflow-hidden">
              {/* Background gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-amber-50/50 via-transparent to-transparent dark:from-amber-900/20 dark:via-transparent dark:to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl"></div>

              <div className="relative w-20 h-20 bg-gradient-to-br from-amber-100 via-amber-200 to-amber-300 dark:from-amber-900/40 dark:via-amber-800/40 dark:to-amber-700/40 rounded-3xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-400/20 to-amber-600/20 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <svg
                  className="relative w-10 h-10 text-amber-600 dark:text-amber-400 group-hover:text-amber-700 dark:group-hover:text-amber-300 transition-colors duration-300"
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
              <h3 className="relative text-2xl font-bold text-slate-900 dark:text-slate-100 mb-6 group-hover:text-amber-700 dark:group-hover:text-amber-300 transition-colors duration-300">
                Zero-Waste Study Sessions
              </h3>
              <p className="relative text-slate-600 dark:text-slate-400 leading-relaxed text-lg flex-grow mb-8">
                Stop wasting time on topics you&apos;ve already mastered. Our adaptive algorithm
                allocates 50% of questions to your weak areas, 25% for mastery validation of strong
                topics, and explores new areas strategically. Every minute counts toward
                certification success.
              </p>
              <div className="relative mt-auto flex items-center text-amber-600 dark:text-amber-400 font-semibold group-hover:text-amber-700 dark:group-hover:text-amber-300 group-hover:translate-x-3 transition-all duration-300">
                <span className="mr-3">Explore feature</span>
                <div className="w-8 h-8 bg-amber-100 dark:bg-amber-900/40 rounded-full flex items-center justify-center group-hover:bg-amber-200 dark:group-hover:bg-amber-800/60 transition-colors duration-300">
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

            {/* Feature 6: Progress Tracking */}
            <div className="group relative bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border border-slate-200/60 dark:border-slate-700/60 shadow-xl rounded-3xl p-8 hover:shadow-2xl hover:border-indigo-300/60 dark:hover:border-indigo-700/60 transition-all duration-500 transform hover:-translate-y-3 hover:scale-105 flex flex-col h-full overflow-hidden">
              {/* Background gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 via-transparent to-transparent dark:from-indigo-900/20 dark:via-transparent dark:to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl"></div>

              <div className="relative w-20 h-20 bg-gradient-to-br from-indigo-100 via-indigo-200 to-indigo-300 dark:from-indigo-900/40 dark:via-indigo-800/40 dark:to-indigo-700/40 rounded-3xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-400/20 to-indigo-600/20 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <svg
                  className="relative w-10 h-10 text-indigo-600 dark:text-indigo-400 group-hover:text-indigo-700 dark:group-hover:text-indigo-300 transition-colors duration-300"
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
              <h3 className="relative text-2xl font-bold text-slate-900 dark:text-slate-100 mb-6 group-hover:text-indigo-700 dark:group-hover:text-indigo-300 transition-colors duration-300">
                Performance Tracking
              </h3>
              <p className="relative text-slate-600 dark:text-slate-400 leading-relaxed text-lg flex-grow mb-8">
                Monitor your certification progress with comprehensive performance metrics. Watch
                your scores improve over time, celebrate achievements, and stay motivated with clear
                visual feedback on your learning journey.
              </p>
              <div className="relative mt-auto flex items-center text-indigo-600 dark:text-indigo-400 font-semibold group-hover:text-indigo-700 dark:group-hover:text-indigo-300 group-hover:translate-x-3 transition-all duration-300">
                <span className="mr-3">View progress</span>
                <div className="w-8 h-8 bg-indigo-100 dark:bg-indigo-900/40 rounded-full flex items-center justify-center group-hover:bg-indigo-200 dark:group-hover:bg-indigo-800/60 transition-colors duration-300">
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

            {/* Feature 7: Better Than AI Chatbots */}
            <div className="group relative bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border border-slate-200/60 dark:border-slate-700/60 shadow-xl rounded-3xl p-8 hover:shadow-2xl hover:border-orange-300/60 dark:hover:border-orange-700/60 transition-all duration-500 transform hover:-translate-y-3 hover:scale-105 flex flex-col h-full overflow-hidden">
              {/* Background gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-orange-50/50 via-transparent to-transparent dark:from-orange-900/20 dark:via-transparent dark:to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl"></div>

              <div className="relative w-20 h-20 bg-gradient-to-br from-orange-100 via-orange-200 to-orange-300 dark:from-orange-900/40 dark:via-orange-800/40 dark:to-orange-700/40 rounded-3xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-400/20 to-orange-600/20 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <svg
                  className="relative w-10 h-10 text-orange-600 dark:text-orange-400 group-hover:text-orange-700 dark:group-hover:text-orange-300 transition-colors duration-300"
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
              <h3 className="relative text-2xl font-bold text-slate-900 dark:text-slate-100 mb-6 group-hover:text-orange-700 dark:group-hover:text-orange-300 transition-colors duration-300">
                Purpose-Built for Studying
              </h3>
              <p className="relative text-slate-600 dark:text-slate-400 leading-relaxed text-lg flex-grow mb-8">
                Unlike generic AI chatbots, our platform is specifically designed for certification
                preparation. Get properly formatted questions, built-in timers, automatic scoring,
                and all the study tools you need in one integrated platform.
              </p>
              <div className="relative mt-auto flex items-center text-orange-600 dark:text-orange-400 font-semibold group-hover:text-orange-700 dark:group-hover:text-orange-300 group-hover:translate-x-3 transition-all duration-300">
                <span className="mr-3">Learn more</span>
                <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900/40 rounded-full flex items-center justify-center group-hover:bg-orange-200 dark:group-hover:bg-orange-800/60 transition-colors duration-300">
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
        </div>
      </section>

      {/* Call-to-Action Section */}
      <section className="relative py-16 sm:py-24 overflow-hidden">
        {/* Background decorative elements - mobile responsive */}
        <div className="absolute inset-0 bg-gradient-to-br from-violet-50/80 via-transparent to-blue-50/60 dark:from-violet-900/20 dark:via-transparent dark:to-blue-900/15"></div>
        <div className="absolute top-10 right-4 sm:right-20 w-48 sm:w-80 h-48 sm:h-80 bg-violet-200/20 dark:bg-violet-600/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 left-4 sm:left-20 w-64 sm:w-96 h-64 sm:h-96 bg-blue-200/20 dark:bg-blue-600/10 rounded-full blur-3xl"></div>

        <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 border-2 border-slate-200 dark:border-slate-700 shadow-2xl rounded-3xl p-8 sm:p-12 lg:p-16 text-center overflow-hidden">
            {/* Decorative background pattern */}
            <div className="absolute inset-0 bg-gradient-to-br from-violet-50/50 to-blue-50/30 dark:from-violet-900/10 dark:to-blue-900/5 rounded-3xl"></div>
            <div className="absolute top-0 right-0 w-40 h-40 bg-violet-200/20 dark:bg-violet-600/10 rounded-full blur-2xl"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-200/20 dark:bg-blue-600/10 rounded-full blur-2xl"></div>

            <div className="relative z-10">
              {/* CTA badge */}
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-violet-100 to-blue-100 dark:from-violet-900/30 dark:to-blue-900/30 border border-violet-200 dark:border-violet-800/50 rounded-full px-6 py-3 mb-8">
                <div className="w-3 h-3 bg-gradient-to-r from-violet-500 to-blue-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-semibold text-violet-700 dark:text-violet-300">
                  Start Your Success Journey!
                </span>
              </div>

              <h2 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-slate-900 dark:text-slate-100 mb-8 leading-tight">
                Your Personal Certification
                <span className="bg-gradient-to-r from-violet-600 to-blue-600 bg-clip-text text-transparent">
                  Success Engine
                </span>
                <br />
                Awaits You
              </h2>

              <p className="text-xl lg:text-2xl text-slate-600 dark:text-slate-400 mb-12 max-w-4xl mx-auto leading-relaxed font-light">
                Experience adaptive AI that learns from your performance, eliminates study waste,
                and creates truly personalized exams. Join professionals who are already mastering
                certifications faster with our intelligent learning platform.
              </p>

              {/* Enhanced stats for CTA */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-8 mb-12">
                <div className="text-center">
                  <div className="text-4xl font-bold bg-gradient-to-r from-violet-600 to-blue-600 bg-clip-text text-transparent">
                    Adaptive AI
                  </div>
                  <div className="text-sm text-slate-500 dark:text-slate-400">
                    Learns How You Learn
                  </div>
                </div>
                <div className="hidden sm:block w-px h-16 bg-slate-200 dark:bg-slate-700"></div>
                <div className="text-center">
                  <div className="text-4xl font-bold bg-gradient-to-r from-violet-600 to-blue-600 bg-clip-text text-transparent">
                    Zero Waste
                  </div>
                  <div className="text-sm text-slate-500 dark:text-slate-400">
                    Targeted Study Time
                  </div>
                </div>
                <div className="hidden sm:block w-px h-16 bg-slate-200 dark:bg-slate-700"></div>
                <div className="text-center">
                  <div className="text-4xl font-bold bg-gradient-to-r from-violet-600 to-blue-600 bg-clip-text text-transparent">
                    Personal Engine
                  </div>
                  <div className="text-sm text-slate-500 dark:text-slate-400">
                    Your Success System
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-6 justify-center mb-10">
                <Link href="/signup">
                  <Button
                    size="lg"
                    className="w-full sm:w-auto rounded-2xl px-12 py-6 text-xl font-bold shadow-2xl hover:shadow-3xl transition-all duration-300 bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-700 hover:to-blue-700 transform hover:scale-105"
                  >
                    Get Free Access
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
                  <span className="font-medium">No credit card needed</span>
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
                  <span className="font-medium">Continuous updates</span>
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
