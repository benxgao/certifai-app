import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import LandingHeader from '@/src/components/custom/LandingHeader';
import PopularCertifications from '@/src/components/landing/PopularCertifications';

export default function LandingPageContent() {
  return (
    <div className="min-h-screen bg-slate-50 dark:from-slate-900 dark:to-slate-800 dark:bg-linear-to-br overflow-x-hidden">
      {/* Header with Navigation */}
      <LandingHeader />

      {/* Hero Section */}
      <section className="relative py-16 sm:py-20 lg:py-24 overflow-hidden" role="banner">
        <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Content - Centered */}
          <div className="text-center max-w-5xl mx-auto">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-slate-900 dark:text-slate-100 mb-4 sm:mb-6 leading-tight">
              Certification practice that adapts to you
            </h1>

            <p className="text-base sm:text-lg lg:text-xl text-slate-600 dark:text-slate-400 mb-8 sm:mb-10 leading-relaxed font-light max-w-3xl mx-auto">
              Practice questions adjust as understanding deepens. The app learns what helps, then builds on it.
            </p>

            <p className="text-sm sm:text-base lg:text-lg text-slate-500 dark:text-slate-400 mb-10 leading-relaxed font-light max-w-3xl mx-auto">
              Explore topics in{' '}
              <Link
                href="/certifications"
                className="text-violet-600 hover:text-violet-700 dark:text-violet-400 dark:hover:text-violet-300 underline"
              >
                AWS, Azure, GCP, Cisco, and 100+ certification paths
              </Link>
              .
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup">
                <Button
                  size="lg"
                  className="w-full sm:w-auto rounded-lg px-8 py-4 text-base font-semibold shadow-sm hover:shadow-sm transition-colors duration-200 bg-violet-600 hover:bg-violet-700"
                >
                  Start Practicing
                </Button>
              </Link>
              <Link href="/signin">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto rounded-lg px-8 py-4 text-base font-semibold border-2 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all duration-200"
                >
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section
        id="features"
        className="relative py-16 sm:py-24 bg-slate-50/50 dark:bg-slate-800/30 overflow-hidden"
      >
        {/* Background decorative elements - disabled for light mode */}
        <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-slate-100 mb-6 leading-tight">
              How it works
            </h2>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            {/* Feature 1: Adaptive Learning */}
            <div className="group relative bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border border-slate-200/60 dark:border-slate-700/60 shadow-md rounded-3xl p-8 hover:shadow-md hover:border-slate-300/60 dark:hover:border-slate-600/60 transition-colors duration-300 flex flex-col h-full overflow-hidden">
              <div className="relative w-10 h-10 bg-violet-100 dark:bg-violet-900/40 rounded-lg flex items-center justify-center mb-8">
                <span className="text-sm font-bold text-violet-600 dark:text-violet-400">1</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-slate-50 tracking-tight mb-6">
                Questions adapt to understanding
              </h3>
              <p className="text-base leading-relaxed text-slate-600 dark:text-slate-400 flex-auto mb-8">
                As patterns become clear, question types shift. Sticky concepts get more practice; solid areas move forward. No wasted time on what's already secure.
              </p>
            </div>

            {/* Feature 2: Exam Format */}
            <div className="group relative bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border border-slate-200/60 dark:border-slate-700/60 shadow-md rounded-3xl p-8 hover:shadow-md hover:border-slate-300/60 dark:hover:border-slate-600/60 transition-colors duration-300 flex flex-col h-full overflow-hidden">
              <div className="relative w-10 h-10 bg-slate-100 dark:bg-slate-700/40 rounded-lg flex items-center justify-center mb-8">
                <span className="text-sm font-bold text-slate-700 dark:text-slate-300">2</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-slate-50 tracking-tight mb-6">
                Exam format feels like test day
              </h3>
              <p className="text-base leading-relaxed text-slate-600 dark:text-slate-400 grow mb-8">
                Question types, timing, interface—all match the real exam. When test day arrives, nothing feels new.
              </p>
            </div>

            {/* Feature 3: Progress Tracking */}
            <div className="group relative bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border border-slate-200/60 dark:border-slate-700/60 shadow-md rounded-3xl p-8 hover:shadow-md hover:border-slate-300/60 dark:hover:border-slate-600/60 transition-colors duration-300 flex flex-col h-full overflow-hidden">
              <div className="relative w-10 h-10 bg-slate-100 dark:bg-slate-700/40 rounded-lg flex items-center justify-center mb-8">
                <span className="text-sm font-bold text-slate-700 dark:text-slate-300">3</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-slate-50 tracking-tight mb-6">
                Progress shows when patterns are clear
              </h3>
              <p className="text-base leading-relaxed text-slate-600 dark:text-slate-400 grow mb-8">
                Charts and insights show what's solid and what needs focus. Progress tracking is there—without pressure to optimize.
              </p>
            </div>

            {/* Feature 4: Study Rhythm */}
            <div className="group relative bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border border-slate-200/60 dark:border-slate-700/60 shadow-md rounded-3xl p-8 hover:shadow-md hover:border-slate-300/60 dark:hover:border-slate-600/60 transition-colors duration-300 flex flex-col h-full overflow-hidden">
              <div className="relative w-10 h-10 bg-slate-100 dark:bg-slate-700/40 rounded-lg flex items-center justify-center mb-8">
                <span className="text-sm font-bold text-slate-700 dark:text-slate-300">4</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-slate-50 tracking-tight mb-6">
                Study rhythm is personal
              </h3>
              <p className="text-base leading-relaxed text-slate-600 dark:text-slate-400 grow mb-8">
                  Difficult areas get revisited more; strong topics move forward. Pace adapts to individual learning rhythm, not a preset schedule.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Certifications Section */}
      <PopularCertifications />
    </div>
  );
}
