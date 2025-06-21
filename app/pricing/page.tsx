'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Check, Star, Zap } from 'lucide-react';
import LandingHeader from '@/src/components/custom/LandingHeader';

// Structured Data for SEO
const pricingSchema = {
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: 'CertifAI IT Certification Training Platform',
  description: 'AI-powered IT certification training with personalized learning and practice exams',
  brand: {
    '@type': 'Brand',
    name: 'CertifAI',
  },
  offers: [
    {
      '@type': 'Offer',
      name: 'Beta Starter',
      description: 'Free beta access with 300 credit coins',
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
    {
      '@type': 'Offer',
      name: 'Beta Pro',
      description: 'Enhanced beta access with 1500 credit coins',
      price: '19',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      validFrom: '2025-01-01',
      priceSpecification: {
        '@type': 'PriceSpecification',
        price: '19',
        priceCurrency: 'USD',
        valueAddedTaxIncluded: true,
      },
    },
  ],
};

const webPageSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'CertifAI Pricing Plans - AI-Powered IT Certification Training',
  description:
    'Simple, transparent pricing for AI-powered IT certification practice. Free beta access available.',
  url: 'https://certifai.app/pricing',
  mainEntity: {
    '@type': 'Product',
    name: 'CertifAI IT Certification Training Platform',
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
        <LandingHeader showFeaturesLink={true} />

        {/* Main Content */}
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-20" role="main">
          {/* Header Section */}
          <header className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Star className="w-4 h-4" />
              <span>Beta Version - Special Pricing</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Simple, Transparent Pricing for AI-Powered IT Certification Training
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Start your certification journey with our beta program. Every new account gets 300
              credit coins absolutely free - enough for 5 practice exams to get you started with
              AI-powered learning.
            </p>
          </header>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {/* Beta Trial */}
            <div className="relative bg-white dark:bg-slate-800 rounded-2xl border-2 border-green-200 dark:border-green-800 p-8 shadow-lg">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-green-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
                  FREE TRIAL
                </span>
              </div>
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-foreground mb-2">Beta Starter</h3>
                <div className="text-4xl font-bold text-foreground mb-2">FREE</div>
                <p className="text-muted-foreground">Perfect for getting started</p>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-500" />
                  <span className="text-foreground">300 Credit Coins</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-500" />
                  <span className="text-foreground">5 Practice Exams</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-500" />
                  <span className="text-foreground">AI-Generated Questions</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-500" />
                  <span className="text-foreground">Performance Analytics</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-500" />
                  <span className="text-foreground">Study Recommendations</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-500" />
                  <span className="text-foreground">Community Access</span>
                </div>
              </div>

              <Link href="/signup" className="block">
                <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                  Start Free Trial
                </Button>
              </Link>
            </div>

            {/* Pro Plan */}
            <div className="relative bg-white dark:bg-slate-800 rounded-2xl border-2 border-primary p-8 shadow-lg">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-semibold">
                  MOST POPULAR
                </span>
              </div>
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-foreground mb-2">Pro</h3>
                <div className="text-4xl font-bold text-foreground mb-2">
                  $19<span className="text-lg text-muted-foreground">/month</span>
                </div>
                <p className="text-muted-foreground">For serious exam preparation</p>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-primary" />
                  <span className="text-foreground">2,000 Credit Coins/month</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-primary" />
                  <span className="text-foreground">Unlimited Practice Exams</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-primary" />
                  <span className="text-foreground">Custom Exam Creation</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-primary" />
                  <span className="text-foreground">Advanced Analytics</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-primary" />
                  <span className="text-foreground">Personalized Study Plans</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-primary" />
                  <span className="text-foreground">Priority Support</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-primary" />
                  <span className="text-foreground">Export Progress Reports</span>
                </div>
              </div>

              <Link href="/signup" className="block">
                <Button className="w-full">Choose Pro Plan</Button>
              </Link>
            </div>

            {/* Enterprise Plan */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-border p-8 shadow-lg">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-foreground mb-2">Enterprise</h3>
                <div className="text-4xl font-bold text-foreground mb-2">Custom</div>
                <p className="text-muted-foreground">For teams and organizations</p>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-foreground" />
                  <span className="text-foreground">Unlimited Credit Coins</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-foreground" />
                  <span className="text-foreground">Team Management</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-foreground" />
                  <span className="text-foreground">Custom Branding</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-foreground" />
                  <span className="text-foreground">API Access</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-foreground" />
                  <span className="text-foreground">Advanced Reporting</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-foreground" />
                  <span className="text-foreground">24/7 Dedicated Support</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-foreground" />
                  <span className="text-foreground">SLA Guarantee</span>
                </div>
              </div>

              <Link href="/contact" className="block">
                <Button variant="outline" className="w-full">
                  Contact Sales
                </Button>
              </Link>
            </div>
          </div>

          {/* Credit Coin System Explanation */}
          <div className="mt-20 bg-white dark:bg-slate-800 rounded-2xl border border-border p-8 max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <Zap className="w-12 h-12 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-foreground mb-4">How Credit Coins Work</h2>
              <p className="text-muted-foreground">
                Our credit coin system provides flexible access to AI-powered exam preparation
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-primary">60</span>
                </div>
                <h4 className="font-semibold text-foreground mb-2">Practice Exam</h4>
                <p className="text-sm text-muted-foreground">
                  Generate a full-length practice exam with AI-powered questions
                </p>
              </div>

              <div className="text-center">
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-primary">15</span>
                </div>
                <h4 className="font-semibold text-foreground mb-2">Quick Quiz</h4>
                <p className="text-sm text-muted-foreground">
                  Create targeted quizzes for specific topics or weak areas
                </p>
              </div>

              <div className="text-center">
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-primary">5</span>
                </div>
                <h4 className="font-semibold text-foreground mb-2">Question Review</h4>
                <p className="text-sm text-muted-foreground">
                  Get detailed explanations and study recommendations
                </p>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mt-20">
            <h2 className="text-3xl font-bold text-center text-foreground mb-12">
              Frequently Asked Questions
            </h2>

            <div className="max-w-3xl mx-auto space-y-6">
              <div className="bg-white dark:bg-slate-800 rounded-lg border border-border p-6">
                <h4 className="font-semibold text-foreground mb-2">
                  What happens when I run out of credit coins?
                </h4>
                <p className="text-muted-foreground">
                  You can upgrade to a paid plan for monthly credit refills, or purchase additional
                  coins as needed. Your progress and study data are always preserved.
                </p>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-lg border border-border p-6">
                <h4 className="font-semibold text-foreground mb-2">
                  Can I cancel my subscription anytime?
                </h4>
                <p className="text-muted-foreground">
                  Yes, you can cancel your subscription at any time. You&apos;ll continue to have
                  access to paid features until the end of your current billing period.
                </p>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-lg border border-border p-6">
                <h4 className="font-semibold text-foreground mb-2">
                  Is this really free during beta?
                </h4>
                <p className="text-muted-foreground">
                  Yes! Every new account gets 300 credit coins completely free. This is our way of
                  thanking early users for helping us improve the platform during our beta phase.
                </p>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-lg border border-border p-6">
                <h4 className="font-semibold text-foreground mb-2">
                  What certifications do you support?
                </h4>
                <p className="text-muted-foreground">
                  We support major IT certifications including AWS, Azure, Google Cloud, CompTIA,
                  Cisco, and many more. Our AI adapts to create relevant questions for any
                  certification you&apos;re studying for.
                </p>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="mt-20 text-center bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl p-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Ready to Start Your Certification Journey?
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join hundreds of beta users who are already preparing smarter with AI-powered practice
              exams.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup">
                <Button size="lg" className="px-8">
                  Start Free Trial
                </Button>
              </Link>
              <Link href="/contact">
                <Button variant="outline" size="lg" className="px-8">
                  Contact Sales
                </Button>
              </Link>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
