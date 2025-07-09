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
    'Join our friendly community of IT professionals! Completely free beta access while we build the future of certification training together',
  brand: {
    '@type': 'Brand',
    name: 'Certestic',
  },
  offers: [
    {
      '@type': 'Offer',
      name: 'Free Beta Family Access',
      description:
        'Join our community of passionate learners - completely free while we grow together!',
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
  name: 'Certestic - Join Our Free Beta Family! | AI-Powered IT Certification Training',
  description:
    'Come build the future of IT certification training with us! Join our friendly community of passionate learners - everything is completely free while we grow together.',
  url: 'https://certestic.com/pricing',
  mainEntity: {
    '@type': 'Product',
    name: 'Certestic IT Certification Training Platform - Free Beta Family Access',
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
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-20" role="main">
          {/* Header Section */}
          <header className="text-center mb-8 sm:mb-12 lg:mb-16">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium mb-4 sm:mb-6">
              <Star className="w-3 sm:w-4 h-3 sm:h-4" />
              <span>100% Free Beta - Your Ideas Matter! 💫</span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-3 sm:mb-4 lg:mb-6 px-2">
              Come Build This With Me! 🚀
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto px-2">
              Hey there! 👋 I&apos;m building something special for IT folks like us, and I&apos;d
              love for you to be part of it. Everything&apos;s completely free right now because
              honestly? I need your help to make this amazing. Your feedback literally shapes what
              we build next!
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
                <h3 className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold text-foreground mb-2">
                  Beta Family Access ✨
                </h3>
                <div className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-foreground mb-2">
                  FREE
                </div>
                <p className="text-xs sm:text-sm lg:text-base text-muted-foreground px-2">
                  Join our little community of passionate learners! 🎯
                </p>
              </div>

              <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6 lg:mb-8">
                <div className="flex items-start gap-2 sm:gap-3">
                  <Check className="w-4 sm:w-5 h-4 sm:h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-xs sm:text-sm lg:text-base text-foreground leading-relaxed">
                    🧠 Unlimited AI-Generated Practice Exams (they&apos;re getting smarter every
                    day!)
                  </span>
                </div>
                <div className="flex items-start gap-2 sm:gap-3">
                  <Check className="w-4 sm:w-5 h-4 sm:h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-xs sm:text-sm lg:text-base text-foreground leading-relaxed">
                    📚 All IT Certifications Supported (seriously, all of them!)
                  </span>
                </div>
                <div className="flex items-start gap-2 sm:gap-3">
                  <Check className="w-4 sm:w-5 h-4 sm:h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-xs sm:text-sm lg:text-base text-foreground leading-relaxed">
                    📊 Advanced Performance Analytics (see exactly where you&apos;re crushing it)
                  </span>
                </div>
                <div className="flex items-start gap-2 sm:gap-3">
                  <Check className="w-4 sm:w-5 h-4 sm:h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-xs sm:text-sm lg:text-base text-foreground leading-relaxed">
                    🎯 Personalized Study Recommendations (like having a study buddy who knows you)
                  </span>
                </div>
                <div className="flex items-start gap-2 sm:gap-3">
                  <Check className="w-4 sm:w-5 h-4 sm:h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-xs sm:text-sm lg:text-base text-foreground leading-relaxed">
                    🤝 Community Access & Support (we&apos;re all in this together)
                  </span>
                </div>
                <div className="flex items-start gap-2 sm:gap-3">
                  <Check className="w-4 sm:w-5 h-4 sm:h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-xs sm:text-sm lg:text-base text-foreground leading-relaxed">
                    💬 Direct Line to Me (yes, I actually read every message!)
                  </span>
                </div>
              </div>

              <div className="bg-primary/5 dark:bg-primary/10 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6 border border-primary/20">
                <p className="text-xs sm:text-sm text-primary dark:text-primary text-center leading-relaxed">
                  <strong>My Promise to You:</strong> 🤝 Every suggestion you share directly
                  influences what I build next. You&apos;re not just using this platform -
                  you&apos;re helping create the certification training tool we all wish existed!
                </p>
              </div>

              <Link href="/signup" className="block">
                <Button className="w-full bg-primary hover:bg-primary/90 text-white text-sm sm:text-base lg:text-lg py-2.5 sm:py-3 lg:py-4 font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl">
                  Let&apos;s Do This Together! 🚀
                </Button>
              </Link>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mt-12 sm:mt-16 lg:mt-20 px-2 sm:px-4">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-center text-foreground mb-6 sm:mb-8 lg:mb-12">
              Questions? I&apos;ve Got Answers! 💭
            </h2>

            <div className="max-w-3xl mx-auto space-y-3 sm:space-y-4 lg:space-y-6">
              <div className="bg-white dark:bg-slate-800 rounded-lg border border-border p-4 sm:p-6">
                <h4 className="font-semibold text-foreground mb-2 text-sm sm:text-base">
                  How long will this free ride last? 🎢
                </h4>
                <p className="text-muted-foreground text-sm sm:text-base">
                  Great question! We&apos;re planning to keep things free throughout 2025 while I
                  perfect the platform. When we do eventually introduce pricing, early beta folks
                  like you will get some pretty sweet perks. Think of it as my way of saying thanks
                  for believing in this crazy project! 😊
                </p>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-lg border border-border p-4 sm:p-6">
                <h4 className="font-semibold text-foreground mb-2 text-sm sm:text-base">
                  What about my study progress and data? 📊
                </h4>
                <p className="text-muted-foreground text-sm sm:text-base">
                  Don&apos;t worry - your progress is safe with me! 🔒 I treat your study data like
                  my own (because honestly, I use this platform too). All your achievements,
                  progress, and study history will stick around as we grow. Your success story is
                  part of our success story!
                </p>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-lg border border-border p-4 sm:p-6">
                <h4 className="font-semibold text-foreground mb-2 text-sm sm:text-base">
                  How can I share my brilliant ideas? 💡
                </h4>
                <p className="text-muted-foreground text-sm sm:text-base">
                  Oh, I&apos;m so glad you asked! 🎉 I&apos;ve built feedback tools right into the
                  platform, plus you can always hit me up through our contact page. Seriously, I
                  read every single message - your ideas literally shape what I work on next. Got a
                  wild idea? Send it my way!
                </p>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-lg border border-border p-4 sm:p-6">
                <h4 className="font-semibold text-foreground mb-2 text-sm sm:text-base">
                  Will there be any hiccups along the way? 🛠️
                </h4>
                <p className="text-muted-foreground text-sm sm:text-base">
                  I&apos;ll be honest with you - we&apos;re building this thing live! 🚧 Sometimes
                  you might see me testing new features or fixing little bugs. Think of it as
                  getting a behind-the-scenes look at how software gets made. I work fast to fix
                  anything that pops up, and I really appreciate your patience as we grow together!
                </p>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="mt-16 sm:mt-20 text-center bg-gradient-to-r from-primary/5 to-primary/10 dark:from-primary/5 dark:to-primary/10 rounded-xl sm:rounded-2xl p-6 sm:p-8 lg:p-12 mx-2 sm:mx-4 border border-primary/10">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground mb-3 sm:mb-4">
              Ready to Join Our Little Revolution? 🔥
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-muted-foreground mb-6 sm:mb-8 max-w-2xl mx-auto leading-relaxed">
              Come be part of something special! 🌟 Join our growing family of IT professionals who
              are helping shape the future of certification training. Plus, did I mention it&apos;s
              completely free? Your success is our success - let&apos;s make it happen together! 💪
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
              <Link href="/signup" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="w-full sm:w-auto px-6 sm:px-8 bg-primary hover:bg-primary/90 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  Count Me In! 🚀
                </Button>
              </Link>
              <Link href="/contact" className="w-full sm:w-auto">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto px-6 sm:px-8 border-primary/20 dark:border-primary/40 text-primary hover:bg-primary/10 font-semibold transition-all duration-200"
                >
                  Let&apos;s Chat! 💬
                </Button>
              </Link>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
