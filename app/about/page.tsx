'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import LandingHeader from '@/src/components/custom/LandingHeader';
import Breadcrumb from '@/src/components/custom/Breadcrumb';
import { ActionButton } from '@/src/components/custom/ActionButton';
import {
  organizationSchema,
  softwareApplicationSchema,
} from '@/src/lib/schemas/organizationSchema';
import { faqSchema } from '@/src/lib/schemas/faqSchema';
import { breadcrumbSchemas } from '@/src/lib/schemas/breadcrumbSchema';
import { Target, Heart, Users, Brain, Rocket } from 'lucide-react';

// Enhanced WebPage Schema for About page
const aboutPageSchema = {
  '@context': 'https://schema.org',
  '@type': 'AboutPage',
  name: 'About Certestic - AI-Powered Certification Training Platform',
  description:
    'Learn about Certestic, an AI-powered platform for IT certification training designed to be effective and accessible.',
  url: 'https://certestic.com/about',
  mainEntity: {
    '@type': 'Organization',
    name: 'Certestic',
    description: 'AI-powered certification training platform',
  },
  isPartOf: {
    '@type': 'WebSite',
    name: 'Certestic',
    url: 'https://certestic.com',
  },
  inLanguage: 'en-US',
  author: {
    '@type': 'Person',
    name: 'Ben Gao',
  },
};

export default function AboutPage() {
  const router = useRouter();

  // Core values - simplified to what matters
  const values = [
    {
      icon: Brain,
      title: 'Actually Works',
      description:
        'The platform learns how you study best and adapts. No guessing games, just smarter preparation.',
      benefits: [],
    },
    {
      icon: Target,
      title: 'Saves You Time',
      description: 'Focus on knowledge gaps instead of endless drilling. Study less, retain more.',
      benefits: [],
    },
    {
      icon: Users,
      title: 'Built With Real Feedback',
      description: 'Shaped by what people actually need when preparing for certifications.',
      benefits: [],
    },
  ];

  return (
    <>
      <div className="min-h-screen bg-slate-50 dark:from-slate-900 dark:to-slate-800 dark:bg-linear-to-br overflow-x-hidden">
        <LandingHeader />

        <main className="relative" role="main">
          {/* Hero Section */}
          <section className="relative py-8 sm:py-12 lg:py-16 overflow-hidden" role="banner">
            <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
              <Breadcrumb
                items={[
                  { label: 'Home', href: '/' },
                  { label: 'About', current: true },
                ]}
                className="mb-8 sm:mb-12"
              />

              <div className="text-center max-w-4xl mx-auto space-y-6 sm:space-y-8">
                <div className="inline-flex items-center gap-2 bg-violet-100 dark:bg-violet-900/30 border border-violet-200 dark:border-violet-800/50 text-violet-700 dark:text-violet-300 px-4 py-2 rounded-full text-xs sm:text-sm font-medium">
                  <Heart className="w-4 h-4" />
                  <span>Built for Real People</span>
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
                  <span className="bg-linear-to-r from-violet-600 to-blue-600 bg-clip-text text-transparent">
                    About Certestic
                  </span>
                </h1>

                <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed font-light">
                  A simple project built to help people study for IT certifications smarter, not
                  just harder.
                </p>

                <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed font-light">
                  Think of Certestic as a friendly study companion that learns how you learn and
                  helps you focus on what actually matters.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <ActionButton
                    variant="primary"
                    size="lg"
                    onClick={() => router.push('/signup')}
                    icon={<Rocket className="h-5 w-5" />}
                    className="px-8 py-4"
                  >
                    Try Certestic
                  </ActionButton>
                  <ActionButton
                    variant="outline"
                    size="lg"
                    onClick={() => router.push('/contact')}
                    icon={<Heart className="h-5 w-5" />}
                    className="px-8 py-4"
                  >
                    Share Feedback
                  </ActionButton>
                </div>
              </div>
            </div>
          </section>

          {/* Mission & Vision */}
          <section className="relative py-16 sm:py-20 lg:py-24 overflow-hidden">
            <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
              <div className="max-w-4xl mx-auto">
                <div className="group relative bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border border-slate-200/60 dark:border-slate-700/60 shadow-xl rounded-3xl p-8 sm:p-12 hover:shadow-2xl hover:border-violet-300/60 dark:hover:border-violet-700/60 transition-all duration-500 transform hover:-translate-y-3 hover:scale-105 flex flex-col h-full overflow-hidden">
                  <div className="absolute inset-0 bg-linear-to-br from-violet-50/20 to-transparent dark:from-violet-900/10 dark:to-transparent rounded-3xl"></div>
                  <div className="relative z-10">
                    <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-50 mb-6 tracking-tight">
                      What This Is Really About
                    </h2>
                    <div className="space-y-6 text-base sm:text-lg leading-relaxed text-slate-600 dark:text-slate-400">
                      <p>
                        Certification exams can feel overwhelming. Too many resources, too many
                        topics, not enough time. People study the same questions over and over,
                        while missing the areas they actually need to work on.
                      </p>
                      <p>
                        Certestic exists to change that. It's built on a simple idea: let an AI
                        watch how you study, understand where your weaknesses are, and focus your
                        time where it matters most.
                      </p>
                      <p>
                        The goal isn't to replace traditional learning. It's to make your study time
                        count. Learn the concepts, understand the principles, then let the platform
                        help you practice smarter.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Core Values */}
          <section className="relative py-16 sm:py-20 lg:py-24 overflow-hidden">
            <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
              <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12">
                  <h2 className="text-4xl lg:text-5xl font-bold mb-4 text-slate-900 dark:text-slate-100 tracking-tight">
                    How It Works
                  </h2>
                  <p className="text-base sm:text-lg lg:text-xl leading-relaxed text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
                    Three principles that guide everything
                  </p>
                </div>
                <div className="grid md:grid-cols-3 gap-8">
                  {values.map((value, index) => (
                    <div
                      key={index}
                      className="group relative bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border border-slate-200/60 dark:border-slate-700/60 shadow-xl rounded-3xl p-8 hover:shadow-2xl hover:border-violet-300/60 dark:hover:border-violet-700/60 transition-all duration-500 transform hover:-translate-y-3 hover:scale-105 flex flex-col h-full overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-linear-to-br from-violet-50/20 to-transparent dark:from-violet-900/10 dark:to-transparent rounded-3xl"></div>
                      <div className="relative z-10">
                        <div className="h-12 w-12 bg-violet-100 dark:bg-linear-to-br dark:from-violet-900/30 dark:to-violet-800/30 rounded-xl flex items-center justify-center mb-6 shadow-sm">
                          <value.icon className="h-6 w-6 text-violet-500 dark:text-violet-300" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-slate-50 mb-4 tracking-tight">
                          {value.title}
                        </h3>
                        <p className="text-base leading-relaxed text-slate-600 dark:text-slate-400">
                          {value.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Developer Section */}
          <section className="relative py-16 sm:py-20 lg:py-24 overflow-hidden">
            <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
              <div className="max-w-4xl mx-auto">
                <div className="group relative bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border border-slate-200/60 dark:border-slate-700/60 shadow-xl rounded-3xl p-8 sm:p-12 hover:shadow-2xl hover:border-violet-300/60 dark:hover:border-violet-700/60 transition-all duration-500 transform hover:-translate-y-3 hover:scale-105 overflow-hidden">
                  <div className="absolute inset-0 bg-linear-to-br from-violet-50/20 to-transparent dark:from-violet-900/10 dark:to-transparent rounded-3xl"></div>
                  <div className="relative z-10">
                    <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-50 mb-3 tracking-tight">
                      About Ben
                    </h2>
                    <p className="text-lg text-violet-600 dark:text-violet-400 mb-8 font-medium">
                      The person behind this
                    </p>
                    <div className="space-y-6 text-base sm:text-lg leading-relaxed text-slate-600 dark:text-slate-400">
                      <p>
                        A full-stack developer who's spent years building software but also spent a
                        lot of time grinding through certification exams. Got tired of studying the
                        same things over and over while missing the concepts that actually confused
                        me.
                      </p>
                      <p>
                        That frustration turned into Certestic. The idea that technology should work
                        harder so people don't have to. Learn less, retain more. Study efficiently
                        instead of endlessly.
                      </p>
                      <p>
                        Now spending time learning AI and machine learning, partly because it's
                        fascinating, but mostly because it helps solve real problems. Like making
                        certification prep actually useful.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Call to Action */}
          <section className="relative py-16 sm:py-20 lg:py-24 overflow-hidden">
            <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
              <div className="max-w-7xl mx-auto">
                <div className="group relative bg-white dark:from-violet-900/30 dark:to-blue-900/20 dark:bg-linear-to-br border border-slate-200 dark:border-violet-700/50 shadow-md rounded-3xl p-8 sm:p-16 hover:shadow-md dark:hover:shadow-2xl transition-colors dark:transition-all duration-500 overflow-hidden">
                  {/* Decorative background pattern */}
                  {/* Background overlay - disabled for light mode */}
                  <div className="absolute top-0 right-0 w-40 h-40 bg-violet-200/15 dark:bg-violet-600/8 rounded-full blur-2xl"></div>
                  <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-200/15 dark:bg-blue-600/8 rounded-full blur-2xl"></div>

                  <div className="relative z-10 text-center">
                    <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-slate-900 dark:text-slate-100 tracking-tight">
                      Ready to Try It?
                    </h2>
                    <p className="text-base sm:text-lg lg:text-xl leading-relaxed text-slate-600 dark:text-slate-400 mb-12 max-w-3xl mx-auto">
                      Sign up for free and see if smarter studying actually works for you.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <ActionButton
                        variant="primary"
                        size="lg"
                        onClick={() => router.push('/signup')}
                        icon={<Rocket className="h-5 w-5" />}
                        className="px-8 py-4"
                      >
                        Get Started
                      </ActionButton>
                      <ActionButton
                        variant="outline"
                        size="lg"
                        onClick={() => router.push('/contact')}
                        icon={<Heart className="h-5 w-5" />}
                        className="px-8 py-4"
                      >
                        Say Hi
                      </ActionButton>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </>
  );
}
