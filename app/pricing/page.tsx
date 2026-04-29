'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/src/components/ui/button';
import { Check, Star } from 'lucide-react';
import LandingHeader from '@/src/components/custom/LandingHeader';
import Breadcrumb from '@/src/components/custom/Breadcrumb';
import { Card, CardContent } from '@/src/components/ui/card';
import { FaGraduationCap } from 'react-icons/fa';

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

      <div className="pricing-page min-h-screen bg-slate-50 dark:from-slate-900 dark:to-slate-800 dark:bg-linear-to-br overflow-x-hidden relative">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 right-10 w-72 h-72 bg-violet-200/20 dark:bg-violet-600/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-10 w-96 h-96 bg-blue-200/20 dark:bg-blue-600/10 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-purple-200/10 dark:bg-purple-800/5 rounded-full blur-3xl"></div>
        </div>

        {/* Header with Navigation */}
        <LandingHeader />

        {/* Main Content */}
        <main className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16" role="main">
          {/* Breadcrumb */}
          <Breadcrumb
            items={[
              { label: 'Home', href: '/' },
              { label: 'Pricing', current: true },
            ]}
            className="mb-8 sm:mb-12"
          />

          {/* Hero Section */}
          <section className="pricing-hero relative py-8 sm:py-12 mb-12 sm:mb-16 lg:mb-20 text-center">
            <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8">
              <div className="inline-flex items-center gap-2 bg-violet-100 dark:bg-violet-900/30 border border-violet-200 dark:border-violet-800/50 text-violet-700 dark:text-violet-300 px-4 py-2 rounded-full text-xs sm:text-sm font-medium">
                <Star className="w-4 h-4" />
                <span>100% Free Beta</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
                <span className="bg-linear-to-r from-violet-600 to-blue-600 bg-clip-text text-transparent">
                  Simple, Transparent Pricing
                </span>
              </h1>

              <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed font-light">
                Access unlimited AI-powered practice exams and personalized learning. Everything's
                completely free while we build the future of IT certification training.
              </p>
            </div>
          </section>

          {/* Pricing Card */}
          <section className="pricing-card-section relative py-8 sm:py-12 mb-12 sm:mb-16">
            <div className="max-w-2xl mx-auto">
              <Card className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border border-slate-200/60 dark:border-slate-700/60 shadow-xl rounded-3xl overflow-hidden hover:shadow-2xl transition-all duration-500">
                <CardContent className="relative p-8 sm:p-12 lg:p-14">
                  {/* Free Beta Badge */}
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-violet-600 dark:bg-violet-700 text-white px-6 sm:px-8 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-semibold shadow-lg">
                      FREE BETA ACCESS
                    </span>
                  </div>

                  {/* Pricing Content */}
                  <div className="text-center mb-8 sm:mb-10 mt-4">
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                      Beta Access
                    </h2>
                    <div className="text-5xl sm:text-6xl lg:text-7xl font-bold bg-linear-to-r from-violet-600 to-blue-600 bg-clip-text text-transparent mb-3">
                      FREE
                    </div>
                    <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400">
                      Start your certification journey today
                    </p>
                  </div>

                  {/* Features List */}
                  <div className="space-y-3 sm:space-y-4 mb-8 sm:mb-10">
                    <div className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-violet-600 dark:text-violet-400 shrink-0 mt-0.5" />
                      <span className="text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                        Unlimited AI-generated practice exams
                      </span>
                    </div>
                    <div className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-violet-600 dark:text-violet-400 shrink-0 mt-0.5" />
                      <span className="text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                        All IT certification tracks
                      </span>
                    </div>
                    <div className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-violet-600 dark:text-violet-400 shrink-0 mt-0.5" />
                      <span className="text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                        Performance analytics & insights
                      </span>
                    </div>
                    <div className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-violet-600 dark:text-violet-400 shrink-0 mt-0.5" />
                      <span className="text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                        Personalized study recommendations
                      </span>
                    </div>
                    <div className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-violet-600 dark:text-violet-400 shrink-0 mt-0.5" />
                      <span className="text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                        Email support & feedback
                      </span>
                    </div>
                    <div className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-violet-600 dark:text-violet-400 shrink-0 mt-0.5" />
                      <span className="text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                        Direct developer feedback
                      </span>
                    </div>
                  </div>

                  {/* Beta Promise Card */}
                  <div className="bg-violet-50/80 dark:bg-violet-900/20 border border-violet-200/60 dark:border-violet-700/60 rounded-2xl p-4 sm:p-6 mb-8 sm:mb-10">
                    <p className="text-base sm:text-lg text-slate-700 dark:text-slate-300 text-center leading-relaxed">
                      <strong className="font-semibold">Beta Promise:</strong> Your feedback shapes
                      what gets built next. Help create the platform you actually want to use.
                    </p>
                  </div>

                  {/* CTA Button */}
                  <Link href="/signup" className="block">
                    <Button className="w-full bg-violet-600 hover:bg-violet-700 text-white text-base sm:text-lg py-3 sm:py-4 font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200">
                      <FaGraduationCap className="mr-2" />
                      Get Started Free
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* FAQ Section */}
          <section className="faq-section relative py-8 sm:py-12 mb-12 sm:mb-16">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12 sm:mb-16">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-slate-100 mb-4 leading-tight">
                  Frequently Asked Questions
                </h2>
                <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed font-light">
                  Everything you need to know about our free beta
                </p>
              </div>

              <div className="space-y-4 sm:space-y-6">
                <Card className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border border-slate-200/60 dark:border-slate-700/60 shadow-md rounded-2xl hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-6 sm:p-8">
                    <h3 className="font-bold text-slate-900 dark:text-slate-100 mb-3 text-lg">
                      How long is the beta free?
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                      The platform stays free throughout 2025. Early users will get special
                      benefits when pricing is introduced.
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border border-slate-200/60 dark:border-slate-700/60 shadow-md rounded-2xl hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-6 sm:p-8">
                    <h3 className="font-bold text-slate-900 dark:text-slate-100 mb-3 text-lg">
                      What happens to my data?
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                      Your progress and achievements are secure. Everything stays with you as
                      the platform grows.
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border border-slate-200/60 dark:border-slate-700/60 shadow-md rounded-2xl hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-6 sm:p-8">
                    <h3 className="font-bold text-slate-900 dark:text-slate-100 mb-3 text-lg">
                      How can I provide feedback?
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                      Use the built-in feedback tools or contact directly. Your input drives
                      development priorities.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>

          {/* Call to Action Section */}
          <section className="cta-section relative py-12 sm:py-16">
            <Card className="bg-linear-to-r from-violet-600 to-blue-600 text-white rounded-3xl shadow-2xl overflow-hidden">
              <CardContent className="p-8 sm:p-12 lg:p-16 text-center relative">
                {/* Background decoration */}
                <div className="absolute inset-0 bg-linear-to-br from-white/10 via-transparent to-white/5 pointer-events-none"></div>

                <div className="relative max-w-4xl mx-auto">
                  <FaGraduationCap className="text-5xl sm:text-6xl lg:text-7xl mb-6 mx-auto opacity-90" />
                  <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 leading-tight">
                    Ready to Get Started?
                  </h2>
                  <p className="text-xl sm:text-2xl mb-8 sm:mb-10 opacity-90 leading-relaxed max-w-2xl mx-auto font-light">
                    Join IT professionals who are already using and improving the platform.
                    Completely free.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center">
                    <Link href="/signup">
                      <Button
                        size="lg"
                        variant="secondary"
                        className="w-full sm:w-auto px-8 sm:px-10 py-3 sm:py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 bg-white text-violet-600 hover:bg-violet-50 hover:text-violet-700 hover:scale-105 transform"
                      >
                        <FaGraduationCap className="mr-2" />
                        Start Free
                      </Button>
                    </Link>
                    <Link href="/contact">
                      <Button
                        size="lg"
                        variant="outline"
                        className="w-full sm:w-auto px-8 sm:px-10 py-3 sm:py-4 text-lg font-semibold rounded-xl border-2 border-white text-white bg-transparent hover:bg-white hover:text-violet-600 transition-all duration-200 hover:scale-105 transform"
                      >
                        Contact Us
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>
        </main>
      </div>
    </>
  );
}
