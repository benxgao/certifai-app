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
  name: 'Certestic IT Certification Training Platform - Free Beta Access',
  description:
    'Free beta access to AI-powered IT certification training platform! Practice with unlimited questions while we build the future of certification training',
  brand: {
    '@type': 'Brand',
    name: 'Certestic',
  },
  offers: [
    {
      '@type': 'Offer',
      name: 'Free Beta Access',
      description: 'Free access to all features while we develop the platform!',
      price: '0',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      validFrom: '2025-01-01',
      priceSpecification: {
        '@type': 'PriceSpecification',
        price: '0',
        priceCurrency: 'USD',
        valueAddedTaxIncluded: true,
      },
    },
  ],
};

const webPageSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'Certestic - Free Beta Access! | AI-Powered IT Certification Training',
  description:
    'Get free access to AI-powered IT certification training! Practice with unlimited questions and advance your career with our beta platform.',
  url: 'https://certestic.com/pricing',
  mainEntity: {
    '@type': 'Product',
    name: 'Certestic IT Certification Training Platform - Free Beta Access',
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
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium mb-4 sm:mb-6">
              <Star className="w-3 sm:w-4 h-3 sm:h-4" />
              <span>100% Free Beta</span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-slate-100 mb-3 sm:mb-4 lg:mb-6 px-2">
              Join the Beta
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto px-2">
              Help build the future of IT certification training. Everything&apos;s free while in
              beta.
            </p>
          </header>

          {/* Beta Access Card */}
          <div className="max-w-2xl mx-auto px-2 sm:px-4">
            <div className="relative bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 rounded-xl sm:rounded-2xl border-2 border-primary/20 dark:border-primary/40 p-4 sm:p-6 lg:p-8 shadow-xl">
              <div className="absolute -top-2 sm:-top-3 lg:-top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-primary text-white px-3 sm:px-4 lg:px-6 py-1 sm:py-1.5 lg:py-2 rounded-full text-xs sm:text-sm font-semibold shadow-lg">
                  FREE BETA ACCESS
                </span>
              </div>

              <div className="text-center mb-6 sm:mb-8 mt-4 sm:mt-6 lg:mt-0">
                <h3 className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
                  Beta Access
                </h3>
                <div className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-primary mb-2">
                  FREE
                </div>
                <p className="text-xs sm:text-sm lg:text-base text-muted-foreground px-2">
                  Start your certification journey
                </p>
              </div>

              <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6 lg:mb-8">
                <div className="flex items-start gap-2 sm:gap-3">
                  <Check className="w-4 sm:w-5 h-4 sm:h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-xs sm:text-sm lg:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                    Unlimited AI-generated practice exams
                  </span>
                </div>
                <div className="flex items-start gap-2 sm:gap-3">
                  <Check className="w-4 sm:w-5 h-4 sm:h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-xs sm:text-sm lg:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                    All IT certification tracks
                  </span>
                </div>
                <div className="flex items-start gap-2 sm:gap-3">
                  <Check className="w-4 sm:w-5 h-4 sm:h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-xs sm:text-sm lg:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                    Performance analytics & insights
                  </span>
                </div>
                <div className="flex items-start gap-2 sm:gap-3">
                  <Check className="w-4 sm:w-5 h-4 sm:h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-xs sm:text-sm lg:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                    Personalized study recommendations
                  </span>
                </div>
                <div className="flex items-start gap-2 sm:gap-3">
                  <Check className="w-4 sm:w-5 h-4 sm:h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-xs sm:text-sm lg:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                    Email support & feedback
                  </span>
                </div>
                <div className="flex items-start gap-2 sm:gap-3">
                  <Check className="w-4 sm:w-5 h-4 sm:h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-xs sm:text-sm lg:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                    Direct developer feedback
                  </span>
                </div>
              </div>

              <div className="bg-primary/5 dark:bg-primary/10 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6 border border-primary/20">
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 text-center leading-relaxed">
                  <strong>Beta Promise:</strong> Your feedback shapes what gets built next. Help
                  create the platform you actually want to use.
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
                  How long is the beta free?
                </h4>
                <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">
                  The platform stays free throughout 2025. Early users will get special benefits
                  when pricing is introduced.
                </p>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-lg border border-border p-4 sm:p-6">
                <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-2 text-sm sm:text-base">
                  What happens to my data?
                </h4>
                <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">
                  Your progress and achievements are secure. Everything stays with you as the
                  platform grows.
                </p>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-lg border border-border p-4 sm:p-6">
                <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-2 text-sm sm:text-base">
                  How can I provide feedback?
                </h4>
                <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">
                  Use the built-in feedback tools or contact directly. Your input drives development
                  priorities.
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
              Join IT professionals who are already using and improving the platform. Completely
              free.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
              <Link href="/signup" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="w-full sm:w-auto px-6 sm:px-8 bg-primary hover:bg-primary/90 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  Start Free
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
