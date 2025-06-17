'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { MARKETING_COPY } from '@/src/config/constants';
import LandingHeader from '@/src/components/custom/LandingHeader';

// --- Landing Page for AI-Driven IT Exam Simulator ---

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header with Navigation */}
      <LandingHeader showFeaturesLink={true} />

      {/* Hero Section */}
      <section className="relative">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20">
          <div className="flex flex-col lg:flex-row items-center lg:justify-between gap-12">
            {/* Hero Content */}
            <div className="flex-1 max-w-2xl">
              <div className="bg-gradient-to-r from-violet-50 to-violet-50 dark:from-primary-900/20 dark:to-violet-900/20 border border-violet-100 dark:border-violet-800/50 rounded-xl p-8">
                <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 dark:text-slate-100 mb-6">
                  {MARKETING_COPY.HERO_TAGLINE}
                </h1>
                <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
                  {MARKETING_COPY.HERO_DESCRIPTION}
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/signup">
                    <Button size="lg" className="w-full sm:w-auto rounded-lg">
                      Start Free Trial
                    </Button>
                  </Link>
                  <Link href="/signin">
                    <Button variant="outline" size="lg" className="w-full sm:w-auto rounded-lg">
                      Sign In
                    </Button>
                  </Link>
                </div>
              </div>
            </div>

            {/* Hero Visual */}
            <div className="flex-1 max-w-lg">
              <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-lg rounded-xl p-8">
                <div className="aspect-video bg-gradient-to-br from-violet-500 to-purple-600 rounded-lg flex items-center justify-center text-white">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <p className="text-lg font-semibold">AI Exam Simulator</p>
                    <p className="text-sm opacity-90">Interactive Demo</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Comprehensive tools and AI-powered features designed to accelerate your IT
              certification journey.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Feature 1: AI-Generated Questions */}
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm rounded-xl p-6 hover:shadow-lg transition-shadow duration-200">
              <div className="w-12 h-12 bg-violet-100 dark:bg-violet-900/30 rounded-lg flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-violet-600 dark:text-violet-400"
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
              <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-3">
                AI-Generated Questions
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Get unlimited practice questions tailored to your certification goals. Our AI
                creates relevant, up-to-date questions that mirror real exam scenarios.
              </p>
            </div>

            {/* Feature 2: Real Exam Simulation */}
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm rounded-xl p-6 hover:shadow-lg transition-shadow duration-200">
              <div className="w-12 h-12 bg-violet-100 dark:bg-violet-900/30 rounded-lg flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-violet-600 dark:text-violet-400"
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
              <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-3">
                Realistic Exam Environment
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Experience authentic exam conditions with timed tests, proper formatting, and
                realistic pressure to build confidence for the real thing.
              </p>
            </div>

            {/* Feature 3: Performance Analytics */}
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm rounded-xl p-6 hover:shadow-lg transition-shadow duration-200">
              <div className="w-12 h-12 bg-violet-100 dark:bg-violet-900/30 rounded-lg flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-violet-600 dark:text-violet-400"
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
              <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-3">
                Detailed Analytics
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Track your progress with comprehensive performance metrics, identify knowledge gaps,
                and receive personalized study recommendations.
              </p>
            </div>

            {/* Feature 4: Custom Exam Creation */}
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm rounded-xl p-6 hover:shadow-lg transition-shadow duration-200">
              <div className="w-12 h-12 bg-violet-100 dark:bg-violet-900/30 rounded-lg flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-violet-600 dark:text-violet-400"
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
              <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-3">
                Custom Practice Exams
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Create personalized practice tests focusing on specific topics or weak areas.
                Perfect for targeted learning and last-minute reviews.
              </p>
            </div>

            {/* Feature 5: Pass Prediction */}
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm rounded-xl p-6 hover:shadow-lg transition-shadow duration-200">
              <div className="w-12 h-12 bg-violet-100 dark:bg-violet-900/30 rounded-lg flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-violet-600 dark:text-violet-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-3">
                Smart Pass Prediction
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                AI-powered algorithms analyze your performance patterns to predict your likelihood
                of passing and guide your study strategy.
              </p>
            </div>

            {/* Feature 6: Progress Tracking */}
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm rounded-xl p-6 hover:shadow-lg transition-shadow duration-200">
              <div className="w-12 h-12 bg-violet-100 dark:bg-violet-900/30 rounded-lg flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-violet-600 dark:text-violet-400"
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
              <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-3">
                Progress Monitoring
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Visualize your improvement over time with detailed progress charts, milestone
                tracking, and achievement badges to stay motivated.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call-to-Action Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-violet-50 to-violet-50 dark:from-primary-900/20 dark:to-violet-900/20 border border-violet-100 dark:border-violet-800/50 rounded-xl p-8 lg:p-12 text-center">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-slate-100 mb-6">
              Ready to Accelerate Your IT Career?
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 max-w-2xl mx-auto leading-relaxed">
              Join thousands of IT professionals who have transformed their certification journey
              with our AI-powered platform. Start your free trial today and experience the future of
              exam preparation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup">
                <Button size="lg" className="w-full sm:w-auto rounded-lg">
                  Start Free Trial
                </Button>
              </Link>
              <Link href="/signin">
                <Button variant="outline" size="lg" className="w-full sm:w-auto rounded-lg">
                  Sign In
                </Button>
              </Link>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-6">
              No credit card required • 14-day free trial • Cancel anytime
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
            {/* Company */}
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center space-x-2 mb-4">
                <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-lg">C</span>
                </div>
                <span className="font-bold text-xl text-foreground">CertifAI</span>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Revolutionizing IT certification training with AI-powered personalized learning.
              </p>
            </div>

            {/* Product */}
            <div>
              <h3 className="font-semibold text-foreground mb-3">Product</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/main" className="hover:text-primary transition-colors">
                    Practice Exams
                  </Link>
                </li>
                <li>
                  <Link href="/study-guides" className="hover:text-primary transition-colors">
                    Study Guides
                  </Link>
                </li>
                <li>
                  <Link href="/documentation" className="hover:text-primary transition-colors">
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link href="/community" className="hover:text-primary transition-colors">
                    Community
                  </Link>
                </li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h3 className="font-semibold text-foreground mb-3">Resources</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/blog" className="hover:text-primary transition-colors">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="/support" className="hover:text-primary transition-colors">
                    Support Center
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-primary transition-colors">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="/careers" className="hover:text-primary transition-colors">
                    Careers
                  </Link>
                </li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h3 className="font-semibold text-foreground mb-3">Company</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/about" className="hover:text-primary transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="hover:text-primary transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-primary transition-colors">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>

            {/* Newsletter */}
            <div>
              <h3 className="font-semibold text-foreground mb-3">Stay Updated</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Get the latest updates and tips for your certification journey.
              </p>
              <Link href="/coming-soon">
                <Button variant="outline" size="sm" className="w-full">
                  Subscribe to Newsletter
                </Button>
              </Link>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-border">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-sm text-muted-foreground">
                &copy; 2025 CertifAI. All rights reserved.
              </p>
              <div className="flex items-center space-x-4 mt-4 md:mt-0 text-sm text-muted-foreground">
                <span>Made with ❤️ for IT professionals</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
