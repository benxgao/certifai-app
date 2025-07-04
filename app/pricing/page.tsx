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
  name: 'Certestic IT Certification Training Platform - Beta',
  description:
    'Free AI-powered IT certification training platform in beta - helping us improve through user feedback',
  brand: {
    '@type': 'Brand',
    name: 'Certestic',
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
  name: 'Certestic - Free Beta Access | AI-Powered IT Certification Training',
  description:
    'Join our free beta program and help us build the future of AI-powered IT certification training. Your feedback shapes our platform.',
  url: 'https://certestic.com/pricing',
  mainEntity: {
    '@type': 'Product',
    name: 'Certestic IT Certification Training Platform - Beta',
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
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20" role="main">
          {/* Header Section */}
          <header className="text-center mb-12 sm:mb-16">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Star className="w-4 h-4" />
              <span>Free Beta - We Value Your Feedback</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4 sm:mb-6 px-2">
              Join Our Beta Program
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto px-2">
              Help us build the future of AI-powered IT certification training. Access all features
              completely free during our beta phase while we gather feedback and improve the
              platform.
            </p>
          </header>

          {/* Beta Access Card */}
          <div className="max-w-2xl mx-auto px-2 sm:px-4">
            <div className="relative bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 rounded-xl sm:rounded-2xl border-2 border-primary/20 dark:border-primary/40 p-4 sm:p-6 lg:p-8 shadow-xl">
              <div className="absolute -top-3 sm:-top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-primary text-white px-3 sm:px-4 lg:px-6 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold shadow-lg">
                  FREE BETA ACCESS
                </span>
              </div>

              <div className="text-center mb-6 sm:mb-8 mt-6 sm:mt-4 lg:mt-0">
                <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground mb-2">
                  Beta Program
                </h3>
                <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-2">
                  FREE
                </div>
                <p className="text-sm sm:text-base text-muted-foreground px-2">
                  Complete access while we build the future together
                </p>
              </div>

              <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-sm sm:text-base text-foreground leading-relaxed">
                    Unlimited AI-Generated Practice Exams
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-sm sm:text-base text-foreground leading-relaxed">
                    All IT Certifications Supported
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-sm sm:text-base text-foreground leading-relaxed">
                    Advanced Performance Analytics
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-sm sm:text-base text-foreground leading-relaxed">
                    Personalized Study Recommendations
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-sm sm:text-base text-foreground leading-relaxed">
                    Community Access & Support
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-sm sm:text-base text-foreground leading-relaxed">
                    Direct Feedback Channel to Development Team
                  </span>
                </div>
              </div>

              <div className="bg-primary/5 dark:bg-primary/10 rounded-lg p-3 sm:p-4 mb-6 border border-primary/20">
                <p className="text-xs sm:text-sm text-primary dark:text-primary text-center leading-relaxed">
                  <strong>Beta Promise:</strong> Your feedback directly shapes our platform. Help us
                  build the best AI-powered certification training experience.
                </p>
              </div>

              <Link href="/signup" className="block">
                <Button className="w-full bg-primary hover:bg-primary/90 text-white text-sm sm:text-base lg:text-lg py-3 sm:py-4 font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl">
                  Join Beta Program
                </Button>
              </Link>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mt-16 sm:mt-20 px-2 sm:px-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-center text-foreground mb-8 sm:mb-12">
              Beta Program Questions
            </h2>

            <div className="max-w-3xl mx-auto space-y-4 sm:space-y-6">
              <div className="bg-white dark:bg-slate-800 rounded-lg border border-border p-4 sm:p-6">
                <h4 className="font-semibold text-foreground mb-2 text-sm sm:text-base">
                  How long will the beta program last?
                </h4>
                <p className="text-muted-foreground text-sm sm:text-base">
                  We&apos;re in active development and expect the beta phase to continue throughout
                  2025. We&apos;ll give plenty of notice before any changes, and early beta users
                  will receive special benefits.
                </p>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-lg border border-border p-4 sm:p-6">
                <h4 className="font-semibold text-foreground mb-2 text-sm sm:text-base">
                  What happens to my data during beta?
                </h4>
                <p className="text-muted-foreground text-sm sm:text-base">
                  Your progress and data are secure and will be preserved. We&apos;re committed to
                  maintaining your study history and achievements as we evolve the platform.
                </p>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-lg border border-border p-4 sm:p-6">
                <h4 className="font-semibold text-foreground mb-2 text-sm sm:text-base">
                  How can I provide feedback?
                </h4>
                <p className="text-muted-foreground text-sm sm:text-base">
                  We&apos;ve built feedback mechanisms directly into the platform. You can also
                  reach out through our support channels. Your input directly influences our
                  development roadmap.
                </p>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-lg border border-border p-4 sm:p-6">
                <h4 className="font-semibold text-foreground mb-2 text-sm sm:text-base">
                  Are there any limitations during beta?
                </h4>
                <p className="text-muted-foreground text-sm sm:text-base">
                  While we&apos;re in beta, you may occasionally experience new features being
                  tested or minor issues as we improve. We work quickly to address any problems and
                  appreciate your patience.
                </p>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="mt-16 sm:mt-20 text-center bg-gradient-to-r from-primary/5 to-primary/10 dark:from-primary/5 dark:to-primary/10 rounded-xl sm:rounded-2xl p-6 sm:p-8 lg:p-12 mx-2 sm:mx-4 border border-primary/10">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground mb-3 sm:mb-4">
              Ready to Shape the Future of IT Certification Training?
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-muted-foreground mb-6 sm:mb-8 max-w-2xl mx-auto leading-relaxed">
              Join our beta community and help us build the most effective AI-powered certification
              training platform. Your feedback drives our innovation.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
              <Link href="/signup" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="w-full sm:w-auto px-6 sm:px-8 bg-primary hover:bg-primary/90 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  Join Beta Program
                </Button>
              </Link>
              <Link href="/contact" className="w-full sm:w-auto">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto px-6 sm:px-8 border-primary/20 dark:border-primary/40 text-primary hover:bg-primary/10 font-semibold transition-all duration-200"
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
