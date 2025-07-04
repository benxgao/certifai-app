'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Check, Star } from 'lucide-react';
import LandingHeader from '@/src/components/custom/LandingHeader';

// Structured Data for SEO
const pricingSchema = {
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: 'CertifAI IT Certification Training Platform - Beta',
  description:
    'Free AI-powered IT certification training platform in beta - helping us improve through user feedback',
  brand: {
    '@type': 'Brand',
    name: 'CertifAI',
  },
  offers: [
    {
      '@type': 'Offer',
      name: 'Beta Access',
      description: 'Free beta access to all features - feedback appreciated',
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
  name: 'CertifAI - Free Beta Access | AI-Powered IT Certification Training',
  description:
    'Join our free beta program and help us build the future of AI-powered IT certification training. Your feedback shapes our platform.',
  url: 'https://certifai.app/pricing',
  mainEntity: {
    '@type': 'Product',
    name: 'CertifAI IT Certification Training Platform - Beta',
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
            <div className="inline-flex items-center gap-2 bg-orange-100 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Star className="w-4 h-4" />
              <span>Free Beta - We Value Your Feedback</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Join Our Beta Program
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Help us build the future of AI-powered IT certification training. Access all features
              completely free during our beta phase while we gather feedback and improve the
              platform.
            </p>
          </header>

          {/* Beta Access Card */}
          <div className="max-w-2xl mx-auto">
            <div className="relative bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 rounded-2xl border-2 border-orange-200 dark:border-orange-800 p-8 shadow-xl">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-orange-500 text-white px-6 py-2 rounded-full text-sm font-semibold">
                  FREE BETA ACCESS
                </span>
              </div>

              <div className="text-center mb-8">
                <h3 className="text-3xl font-bold text-foreground mb-2">Beta Program</h3>
                <div className="text-5xl font-bold text-foreground mb-2">FREE</div>
                <p className="text-muted-foreground">
                  Complete access while we build the future together
                </p>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-orange-500" />
                  <span className="text-foreground">Unlimited AI-Generated Practice Exams</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-orange-500" />
                  <span className="text-foreground">All IT Certifications Supported</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-orange-500" />
                  <span className="text-foreground">Advanced Performance Analytics</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-orange-500" />
                  <span className="text-foreground">Personalized Study Recommendations</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-orange-500" />
                  <span className="text-foreground">Community Access & Support</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-orange-500" />
                  <span className="text-foreground">
                    Direct Feedback Channel to Development Team
                  </span>
                </div>
              </div>

              <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4 mb-6">
                <p className="text-sm text-orange-700 dark:text-orange-300 text-center">
                  <strong>Beta Promise:</strong> Your feedback directly shapes our platform. Help us
                  build the best AI-powered certification training experience.
                </p>
              </div>

              <Link href="/signup" className="block">
                <Button className="w-full bg-orange-600 hover:bg-orange-700 text-white text-lg py-3">
                  Join Beta Program
                </Button>
              </Link>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mt-20">
            <h2 className="text-3xl font-bold text-center text-foreground mb-12">
              Beta Program Questions
            </h2>

            <div className="max-w-3xl mx-auto space-y-6">
              <div className="bg-white dark:bg-slate-800 rounded-lg border border-border p-6">
                <h4 className="font-semibold text-foreground mb-2">
                  How long will the beta program last?
                </h4>
                <p className="text-muted-foreground">
                  We&apos;re in active development and expect the beta phase to continue throughout
                  2025. We&apos;ll give plenty of notice before any changes, and early beta users
                  will receive special benefits.
                </p>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-lg border border-border p-6">
                <h4 className="font-semibold text-foreground mb-2">
                  What happens to my data during beta?
                </h4>
                <p className="text-muted-foreground">
                  Your progress and data are secure and will be preserved. We&apos;re committed to
                  maintaining your study history and achievements as we evolve the platform.
                </p>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-lg border border-border p-6">
                <h4 className="font-semibold text-foreground mb-2">How can I provide feedback?</h4>
                <p className="text-muted-foreground">
                  We&apos;ve built feedback mechanisms directly into the platform. You can also
                  reach out through our support channels. Your input directly influences our
                  development roadmap.
                </p>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-lg border border-border p-6">
                <h4 className="font-semibold text-foreground mb-2">
                  Are there any limitations during beta?
                </h4>
                <p className="text-muted-foreground">
                  While we&apos;re in beta, you may occasionally experience new features being
                  tested or minor issues as we improve. We work quickly to address any problems and
                  appreciate your patience.
                </p>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="mt-20 text-center bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-900/10 dark:to-orange-800/10 rounded-2xl p-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Ready to Shape the Future of IT Certification Training?
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join our beta community and help us build the most effective AI-powered certification
              training platform. Your feedback drives our innovation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup">
                <Button size="lg" className="px-8 bg-orange-600 hover:bg-orange-700">
                  Join Beta Program
                </Button>
              </Link>
              <Link href="/contact">
                <Button
                  variant="outline"
                  size="lg"
                  className="px-8 border-orange-200 dark:border-orange-700"
                >
                  Share Your Ideas
                </Button>
              </Link>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
