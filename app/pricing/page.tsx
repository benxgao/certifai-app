'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/src/components/ui/button';
import { Check, Star } from 'lucide-react';
import LandingHeader from '@/src/components/custom/LandingHeader';

// Structured Data for SEO
const pricingSchema = {
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: 'Certestic AI-Powered Certification Training Platform - Premium Access',
  description:
    'Advanced AI-powered IT certification training platform with adaptive learning. Access 1000+ certifications with personalized exam generation, performance analytics',
  brand: {
    '@type': 'Brand',
    name: 'Certestic',
  },
  offers: [
    {
      '@type': 'Offer',
      name: 'Premium Access',
      description:
        'Complete access to AI-powered adaptive learning with 1000+ IT certifications, performance analytics, and personalized study recommendations',
      price: '10',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      validFrom: '2025-01-01',
      priceSpecification: {
        '@type': 'PriceSpecification',
        price: '10',
        priceCurrency: 'USD',
        valueAddedTaxIncluded: true,
        billingIncrement: 'P1M',
      },
    },
  ],
};

const webPageSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'Certestic - Premium Access | AI-Powered Adaptive Certification Training',
  description:
    'Get professional access to AI-powered adaptive certification training with 1000+ IT certifications. Personalized learning with performance analytics.',
  url: 'https://certestic.com/pricing',
  mainEntity: {
    '@type': 'Product',
    name: 'Certestic AI-Powered Certification Training Platform - Premium Access',
  },
};

export default function PricingPage() {
  return (
    <>
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pricingSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
      />

      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        {/* Header with Navigation */}
        <LandingHeader />

        {/* Main Content */}
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-20" role="main">
          {/* Header Section */}
          <header className="text-center mb-8 sm:mb-12 lg:mb-16">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-slate-100 mb-3 sm:mb-4 lg:mb-6 px-2">
              Start Your Journey
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto px-2">
              Access professional AI-powered certification training with adaptive learning
              technology that personalizes your study experience.
            </p>
          </header>

          {/* Premium Access Card */}
          <div className="max-w-2xl mx-auto px-2 sm:px-4">
            <div className="relative bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 rounded-xl sm:rounded-2xl border-2 border-primary/20 dark:border-primary/40 p-4 sm:p-6 lg:p-8 shadow-xl">
              <div className="absolute -top-2 sm:-top-3 lg:-top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-violet-600 dark:bg-violet-700 text-white px-4 sm:px-6 lg:px-8 py-1.5 sm:py-2 lg:py-2.5 rounded-full text-xs sm:text-sm font-medium shadow-lg">
                  PREMIUM ACCESS
                </span>
              </div>

              <div className="text-center mb-6 sm:mb-8 mt-4 sm:mt-6 lg:mt-0">
                <h3 className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
                  Premium Access
                </h3>
                <div className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-primary mb-2">
                  $10
                  <span className="text-lg sm:text-xl lg:text-2xl text-slate-500 dark:text-slate-400">
                    /month
                  </span>
                </div>
                <p className="text-xs sm:text-sm lg:text-base text-slate-500 dark:text-slate-400 px-2">
                  AI-powered adaptive certification training
                </p>
              </div>

              <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6 lg:mb-8">
                <div className="flex items-start gap-2 sm:gap-3">
                  <Check className="w-4 sm:w-5 h-4 sm:h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-xs sm:text-sm lg:text-base text-slate-500 dark:text-slate-400 leading-relaxed">
                    100+ IT certifications (AWS, Azure, GCP, Microsoft, Cisco & more)
                  </span>
                </div>
                <div className="flex items-start gap-2 sm:gap-3">
                  <Check className="w-4 sm:w-5 h-4 sm:h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-xs sm:text-sm lg:text-base text-slate-500 dark:text-slate-400 leading-relaxed">
                    AI-powered adaptive exam generation based on your performance
                  </span>
                </div>
                <div className="flex items-start gap-2 sm:gap-3">
                  <Check className="w-4 sm:w-5 h-4 sm:h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-xs sm:text-sm lg:text-base text-slate-500 dark:text-slate-400 leading-relaxed">
                    Detailed performance analytics & exam reports
                  </span>
                </div>
                <div className="flex items-start gap-2 sm:gap-3">
                  <Check className="w-4 sm:w-5 h-4 sm:h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-xs sm:text-sm lg:text-base text-slate-500 dark:text-slate-400 leading-relaxed">
                    Personalized study recommendations & progress tracking
                  </span>
                </div>
                <div className="flex items-start gap-2 sm:gap-3">
                  <Check className="w-4 sm:w-5 h-4 sm:h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-xs sm:text-sm lg:text-base text-slate-500 dark:text-slate-400 leading-relaxed">
                    Custom exam generation with specific topic focus
                  </span>
                </div>
                <div className="flex items-start gap-2 sm:gap-3">
                  <Check className="w-4 sm:w-5 h-4 sm:h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-xs sm:text-sm lg:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                    Advanced dashboard with learning insights & analytics
                  </span>
                </div>
              </div>

              <div className="bg-primary/5 dark:bg-primary/10 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6 border border-primary/20">
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 text-center leading-relaxed">
                  <strong>Advanced AI Technology:</strong> Our adaptive learning system analyzes
                  your performance to create personalized exams that focus on your knowledge gaps
                  and accelerate your learning.
                </p>
              </div>

              <Link href="/signup" className="block">
                <Button className="w-full bg-primary hover:bg-primary/90 text-white text-sm sm:text-base lg:text-lg py-2.5 sm:py-3 lg:py-4 font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mt-12 sm:mt-16 lg:mt-20 px-2 sm:px-4">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-center text-slate-900 dark:text-slate-100 mb-6 sm:mb-8 lg:mb-12">
              Frequently Asked Questions
            </h2>

            <div className="max-w-3xl mx-auto space-y-3 sm:space-y-4 lg:space-y-6">
              <div className="bg-white dark:bg-slate-800 rounded-lg border border-border p-4 sm:p-6">
                <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-2 text-sm sm:text-base">
                  How does pricing work?
                </h4>
                <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">
                  Premium access is $10 per month, giving you unlimited access to all
                  certifications, AI-powered practice questions, and personalized study plans.
                  Cancel anytime with no long-term commitment.
                </p>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-lg border border-border p-4 sm:p-6">
                <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-2 text-sm sm:text-base">
                  What makes this platform unique?
                </h4>
                <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">
                  Our AI-powered adaptive learning system analyzes your exam performance to create
                  personalized future exams. Unlike static practice tests, our system focuses on
                  your knowledge gaps and adjusts difficulty based on your progress, making your
                  study time more effective and targeted.
                </p>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-lg border border-border p-4 sm:p-6">
                <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-2 text-sm sm:text-base">
                  How many certifications are available?
                </h4>
                <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">
                  Access 100+ IT certifications from leading technology companies including AWS,
                  Microsoft Azure, Google Cloud Platform, Cisco, CompTIA, Oracle, Salesforce, IBM,
                  and many more. Our comprehensive catalog covers cloud computing, cybersecurity,
                  networking, data science, and emerging technologies.
                </p>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-lg border border-border p-4 sm:p-6">
                <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-2 text-sm sm:text-base">
                  What analytics and insights do I get?
                </h4>
                <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">
                  Comprehensive performance analytics including detailed exam reports, topic mastery
                  levels, improvement trends, knowledge gap identification, and personalized study
                  recommendations. Track your progress over time and get insights into your learning
                  patterns to optimize your certification preparation.
                </p>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-lg border border-border p-4 sm:p-6">
                <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-2 text-sm sm:text-base">
                  How does the adaptive learning work?
                </h4>
                <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">
                  Our AI system analyzes your previous exam performance to identify weak areas and
                  strengths. When you create new exams, the system automatically adjusts topic
                  distribution and difficulty levels to focus on areas needing improvement while
                  reinforcing your strong areas with more challenging questions.
                </p>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="mt-16 sm:mt-20 text-center bg-gradient-to-r from-primary/5 to-primary/10 dark:from-primary/5 dark:to-primary/10 rounded-xl sm:rounded-2xl p-6 sm:p-8 lg:p-12 mx-2 sm:mx-4 border border-primary/10">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-slate-900 dark:text-slate-100 mb-3 sm:mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-slate-600 dark:text-slate-400 mb-6 sm:mb-8 max-w-2xl mx-auto leading-relaxed">
              Join IT professionals advancing their careers with our AI-powered adaptive learning
              platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
              <Link href="/signup" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="w-full sm:w-auto px-6 sm:px-8 bg-primary hover:bg-primary/90 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  Start Your Subscription
                </Button>
              </Link>
              <Link href="/contact" className="w-full sm:w-auto">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto px-6 sm:px-8 border-primary/20 dark:border-primary/40 text-primary hover:bg-primary/10 font-semibold transition-all duration-200"
                >
                  Contact Us
                </Button>
              </Link>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
