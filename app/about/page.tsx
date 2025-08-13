'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Badge } from '@/src/components/ui/badge';
import LandingHeader from '@/src/components/custom/LandingHeader';
import { ActionButton } from '@/src/components/custom/ActionButton';
import {
  organizationSchema,
  softwareApplicationSchema,
} from '@/src/lib/schemas/organizationSchema';
import { faqSchema } from '@/src/lib/schemas/faqSchema';
import { breadcrumbSchemas } from '@/src/lib/schemas/breadcrumbSchema';
import {
  Target,
  Heart,
  Users,
  Globe,
  BookOpen,
  Zap,
  Shield,
  Brain,
  Rocket,
  TrendingUp,
  Code,
} from 'lucide-react';

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

  // Simplified stats
  const stats = [
    {
      value: 'AI-Powered',
      label: 'Learning',
      icon: Brain,
      description: 'Adaptive technology',
    },
    {
      value: 'Personal',
      label: 'Focus',
      icon: Target,
      description: 'Targeted training',
    },
    {
      value: 'Growing',
      label: 'Community',
      icon: Users,
      description: 'Active learners',
    },
    {
      value: 'Modern',
      label: 'Platform',
      icon: Rocket,
      description: 'Latest technology',
    },
  ];

  // Core values - simplified
  const values = [
    {
      icon: Brain,
      title: 'Adaptive Learning',
      description: 'AI that learns from your performance to create personalized study experiences.',
      benefits: [
        'Performance-based adaptation',
        'Smart question allocation',
        'Optimized efficiency',
      ],
    },
    {
      icon: Target,
      title: 'Focused Training',
      description: 'Concentrate your study time precisely where you need growth most.',
      benefits: ['Targeted weak areas', 'Mastery validation', 'Time optimization'],
    },
    {
      icon: Users,
      title: 'Community Driven',
      description: 'Built based on real user feedback and continuous improvement.',
      benefits: ['User-driven features', 'Regular updates', 'Community input'],
    },
  ];

  // Simplified milestones
  const milestones = [
    {
      year: 'Early 2025',
      title: 'Project Started',
      description: 'Began building an AI-powered certification training platform.',
      icon: Brain,
    },
    {
      year: 'Mid 2025',
      title: 'Platform Launch',
      description: 'Released with adaptive AI and personalized learning features.',
      icon: Rocket,
    },
    {
      year: 'Current',
      title: 'Growing',
      description: 'Continuously improving based on user feedback and needs.',
      icon: TrendingUp,
    },
  ];

  return (
    <>
      {/* Enhanced Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareApplicationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutPageSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchemas.about) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 overflow-x-hidden">
        <LandingHeader />

        <main className="relative pt-16" role="main">
          {/* Hero Section */}
          <section className="relative overflow-hidden" role="banner">
            {/* Background decorative elements */}
            <div className="absolute inset-0 bg-gradient-to-br from-violet-50/50 via-transparent to-blue-50/30 dark:from-violet-900/10 dark:via-transparent dark:to-blue-900/10"></div>
            <div className="absolute top-20 right-2 sm:right-10 w-48 sm:w-72 h-48 sm:h-72 bg-violet-200/20 dark:bg-violet-600/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-20 left-2 sm:left-10 w-64 sm:w-96 h-64 sm:h-96 bg-blue-200/20 dark:bg-blue-600/10 rounded-full blur-3xl"></div>

            <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-24 lg:pt-28 pb-16 sm:pb-20 lg:pb-24">
              <div className="text-center max-w-5xl mx-auto">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold mb-8 tracking-tight">
                  <span className="bg-gradient-to-r from-violet-600 to-blue-600 bg-clip-text text-transparent">
                    About Certestic
                  </span>
                </h1>

                <div className="max-w-4xl mx-auto mb-12 space-y-6">
                  <p className="text-xl lg:text-2xl leading-relaxed font-light text-slate-700 dark:text-slate-200">
                    AI-powered certification training that learns from your performance and
                    optimizes study efficiency.
                  </p>
                  <p className="text-base sm:text-lg leading-relaxed text-slate-600 dark:text-slate-400">
                    Built by a developer who believes learning should be intelligent, adaptive, and
                    personalized.
                  </p>
                </div>

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

          {/* Stats Section */}
          <section className="relative py-16 sm:py-20 lg:py-24 overflow-hidden">
            <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
              <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
                  {stats.map((stat, index) => (
                    <div
                      key={index}
                      className="group relative bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border border-slate-200/60 dark:border-slate-700/60 shadow-xl rounded-3xl p-6 hover:shadow-2xl hover:border-violet-300/60 dark:hover:border-violet-700/60 transition-all duration-500 transform hover:-translate-y-3 hover:scale-105"
                    >
                      <div className="text-center">
                        <div className="h-12 w-12 bg-gradient-to-br from-violet-100 to-violet-200 dark:from-violet-900/30 dark:to-violet-800/30 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                          <stat.icon className="h-6 w-6 text-violet-600 dark:text-violet-400" />
                        </div>
                        <div className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent mb-2">
                          {stat.value}
                        </div>
                        <div className="text-base font-bold text-slate-900 dark:text-slate-50 mb-2">
                          {stat.label}
                        </div>
                        <div className="text-sm text-slate-600 dark:text-slate-400">
                          {stat.description}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Mission & Vision */}
          <section className="relative py-16 sm:py-20 lg:py-24 overflow-hidden">
            <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
              <div className="max-w-7xl mx-auto">
                <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
                  <div className="group relative bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border border-slate-200/60 dark:border-slate-700/60 shadow-xl rounded-3xl p-8 hover:shadow-2xl hover:border-violet-300/60 dark:hover:border-violet-700/60 transition-all duration-500 transform hover:-translate-y-3 hover:scale-105 flex flex-col h-full overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-violet-50/20 to-transparent dark:from-violet-900/10 dark:to-transparent rounded-3xl"></div>
                    <div className="relative z-10">
                      <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-6 tracking-tight">
                        Mission
                      </h2>
                      <p className="text-base sm:text-lg leading-relaxed text-slate-600 dark:text-slate-400 mb-6">
                        Create adaptive, AI-powered certification training that learns from your
                        performance and maximizes study efficiency.
                      </p>
                      <div className="space-y-4">
                        <div className="flex items-start space-x-3">
                          <Zap className="h-5 w-5 text-violet-600 dark:text-violet-400 mt-0.5 flex-shrink-0" />
                          <span className="text-slate-700 dark:text-slate-200">
                            <strong>Adaptive Intelligence:</strong> AI that learns from your
                            performance
                          </span>
                        </div>
                        <div className="flex items-start space-x-3">
                          <BookOpen className="h-5 w-5 text-violet-600 dark:text-violet-400 mt-0.5 flex-shrink-0" />
                          <span className="text-slate-700 dark:text-slate-200">
                            <strong>Real Experience:</strong> Content based on actual certifications
                          </span>
                        </div>
                        <div className="flex items-start space-x-3">
                          <Target className="h-5 w-5 text-violet-600 dark:text-violet-400 mt-0.5 flex-shrink-0" />
                          <span className="text-slate-700 dark:text-slate-200">
                            <strong>Smart Focus:</strong> Concentrate time on what you need to
                            master
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="group relative bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border border-slate-200/60 dark:border-slate-700/60 shadow-xl rounded-3xl p-8 hover:shadow-2xl hover:border-violet-300/60 dark:hover:border-violet-700/60 transition-all duration-500 transform hover:-translate-y-3 hover:scale-105 flex flex-col h-full overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-50/20 to-transparent dark:from-blue-900/10 dark:to-transparent rounded-3xl"></div>
                    <div className="relative z-10">
                      <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-6 tracking-tight">
                        Vision
                      </h2>
                      <p className="text-base sm:text-lg leading-relaxed text-slate-600 dark:text-slate-400 mb-6">
                        Build the world&apos;s most intelligent certification training platform that
                        adapts to each learner.
                      </p>
                      <div className="space-y-4">
                        <div className="flex items-start space-x-3">
                          <Globe className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                          <span className="text-slate-700 dark:text-slate-200">
                            <strong>Global Access:</strong> Available to IT professionals everywhere
                          </span>
                        </div>
                        <div className="flex items-start space-x-3">
                          <Brain className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                          <span className="text-slate-700 dark:text-slate-200">
                            <strong>Continuous Learning:</strong> Technology that evolves with the
                            field
                          </span>
                        </div>
                        <div className="flex items-start space-x-3">
                          <Rocket className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                          <span className="text-slate-700 dark:text-slate-200">
                            <strong>Career Growth:</strong> Tools that help professionals advance
                          </span>
                        </div>
                      </div>
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
                    Our Approach
                  </h2>
                  <p className="text-base sm:text-lg lg:text-xl leading-relaxed text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
                    Building Certestic with clear principles and user-focused development
                  </p>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {values.map((value, index) => (
                    <div
                      key={index}
                      className="group relative bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border border-slate-200/60 dark:border-slate-700/60 shadow-xl rounded-3xl p-8 hover:shadow-2xl hover:border-violet-300/60 dark:hover:border-violet-700/60 transition-all duration-500 transform hover:-translate-y-3 hover:scale-105 flex flex-col h-full overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-violet-50/20 to-transparent dark:from-violet-900/10 dark:to-transparent rounded-3xl"></div>
                      <div className="relative z-10">
                        <div className="h-12 w-12 bg-gradient-to-br from-violet-100 to-violet-200 dark:from-violet-900/30 dark:to-violet-800/30 rounded-xl flex items-center justify-center mb-6 shadow-sm">
                          <value.icon className="h-6 w-6 text-violet-600 dark:text-violet-400" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-slate-50 mb-4 tracking-tight">
                          {value.title}
                        </h3>
                        <p className="text-base leading-relaxed text-slate-600 dark:text-slate-400 mb-6">
                          {value.description}
                        </p>
                        <div className="space-y-2">
                          {value.benefits.map((benefit, idx) => (
                            <div key={idx} className="flex items-center space-x-3">
                              <div className="w-1.5 h-1.5 bg-violet-600 dark:bg-violet-400 rounded-full flex-shrink-0"></div>
                              <span className="text-sm text-slate-600 dark:text-slate-400">
                                {benefit}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Development Timeline */}
          <section className="relative py-16 sm:py-20 lg:py-24 overflow-hidden">
            <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
              <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12">
                  <h2 className="text-4xl lg:text-5xl font-bold mb-4 text-slate-900 dark:text-slate-100 tracking-tight">
                    Development Journey
                  </h2>
                  <p className="text-base sm:text-lg lg:text-xl leading-relaxed text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
                    The story of how Certestic came to life and where it&apos;s heading
                  </p>
                </div>
                <div className="relative max-w-4xl mx-auto">
                  <div className="absolute left-1/2 transform -translate-x-0.5 h-full w-0.5 bg-gradient-to-b from-violet-200 to-blue-200 dark:from-violet-800 dark:to-blue-800"></div>
                  <div className="space-y-12">
                    {milestones.map((milestone, index) => (
                      <div
                        key={index}
                        className={`flex items-center ${
                          index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'
                        }`}
                      >
                        <div className={`flex-1 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8'}`}>
                          <div className="group relative bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border border-slate-200/60 dark:border-slate-700/60 shadow-xl rounded-3xl p-8 hover:shadow-2xl hover:border-violet-300/60 dark:hover:border-violet-700/60 transition-all duration-500 transform hover:-translate-y-3 hover:scale-105 overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-violet-50/20 to-transparent dark:from-violet-900/10 dark:to-transparent rounded-3xl"></div>
                            <div className="relative z-10">
                              <div className="mb-4">
                                <Badge
                                  variant="secondary"
                                  className="font-medium bg-violet-100 dark:bg-violet-900/30 border border-violet-200 dark:border-violet-800/50 text-violet-700 dark:text-violet-300 px-4 py-2 rounded-full"
                                >
                                  {milestone.year}
                                </Badge>
                              </div>
                              <h3 className="text-xl font-bold text-slate-900 dark:text-slate-50 mb-3 tracking-tight">
                                {milestone.title}
                              </h3>
                              <p className="text-base leading-relaxed text-slate-600 dark:text-slate-400">
                                {milestone.description}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="flex-shrink-0 z-10">
                          <div className="h-4 w-4 rounded-full bg-gradient-to-r from-violet-600 to-blue-600 border-4 border-white dark:border-slate-900 shadow-md"></div>
                        </div>
                        <div className="flex-1"></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Developer Section */}
          <section className="relative py-16 sm:py-20 lg:py-24 overflow-hidden">
            <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
              <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12">
                  <h2 className="text-4xl lg:text-5xl font-bold mb-4 text-slate-900 dark:text-slate-100 tracking-tight">
                    About the Developer
                  </h2>
                  <p className="text-base sm:text-lg lg:text-xl leading-relaxed text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
                    The person behind Certestic and the vision for better certification training
                  </p>
                </div>
                <div className="max-w-4xl mx-auto">
                  <div className="group relative bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border border-slate-200/60 dark:border-slate-700/60 shadow-xl rounded-3xl p-8 sm:p-12 hover:shadow-2xl hover:border-violet-300/60 dark:hover:border-violet-700/60 transition-all duration-500 transform hover:-translate-y-3 hover:scale-105 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-violet-50/20 to-transparent dark:from-violet-900/10 dark:to-transparent rounded-3xl"></div>
                    <div className="relative z-10 text-center">
                      <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-3 tracking-tight">
                        Ben Gao
                      </h3>
                      <p className="text-lg text-violet-600 dark:text-violet-400 mb-8 font-medium">
                        Full-Stack Developer | AI Enthusiast
                      </p>
                      <div className="space-y-6 text-left max-w-2xl mx-auto">
                        <p className="text-base sm:text-lg leading-relaxed text-slate-600 dark:text-slate-400">
                          A developer passionate about making IT certification training more
                          effective and accessible through modern technology.
                        </p>
                        <p className="text-base leading-relaxed text-slate-600 dark:text-slate-400">
                          Certestic combines years of software development experience with firsthand
                          knowledge of certification challenges.
                        </p>
                      </div>
                      <div className="grid grid-cols-2 gap-6 mt-10 max-w-2xl mx-auto">
                        <div className="flex items-center justify-center space-x-3 p-4 bg-violet-50/50 dark:bg-violet-900/20 rounded-lg">
                          <Code className="h-5 w-5 text-violet-600 dark:text-violet-400" />
                          <span className="text-slate-700 dark:text-slate-200 font-medium">
                            Full-Stack Development
                          </span>
                        </div>
                        <div className="flex items-center justify-center space-x-3 p-4 bg-violet-50/50 dark:bg-violet-900/20 rounded-lg">
                          <Brain className="h-5 w-5 text-violet-600 dark:text-violet-400" />
                          <span className="text-slate-700 dark:text-slate-200 font-medium">
                            AI & Machine Learning
                          </span>
                        </div>
                        <div className="flex items-center justify-center space-x-3 p-4 bg-violet-50/50 dark:bg-violet-900/20 rounded-lg">
                          <BookOpen className="h-5 w-5 text-violet-600 dark:text-violet-400" />
                          <span className="text-slate-700 dark:text-slate-200 font-medium">
                            Educational Technology
                          </span>
                        </div>
                        <div className="flex items-center justify-center space-x-3 p-4 bg-violet-50/50 dark:bg-violet-900/20 rounded-lg">
                          <Users className="h-5 w-5 text-violet-600 dark:text-violet-400" />
                          <span className="text-slate-700 dark:text-slate-200 font-medium">
                            User-Centered Design
                          </span>
                        </div>
                      </div>
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
                <div className="group relative bg-gradient-to-br from-violet-50/90 to-blue-50/70 dark:from-violet-900/30 dark:to-blue-900/20 border border-violet-200/60 dark:border-violet-700/50 shadow-xl rounded-3xl p-8 sm:p-16 hover:shadow-2xl transition-all duration-500 overflow-hidden">
                  {/* Decorative background pattern */}
                  <div className="absolute inset-0 bg-gradient-to-br from-violet-50/30 to-blue-50/20 dark:from-violet-900/10 dark:to-blue-900/5 rounded-3xl"></div>
                  <div className="absolute top-0 right-0 w-40 h-40 bg-violet-200/15 dark:bg-violet-600/8 rounded-full blur-2xl"></div>
                  <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-200/15 dark:bg-blue-600/8 rounded-full blur-2xl"></div>

                  <div className="relative z-10 text-center">
                    <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-slate-900 dark:text-slate-100 tracking-tight">
                      Try Certestic Today
                    </h2>
                    <p className="text-base sm:text-lg lg:text-xl leading-relaxed text-slate-600 dark:text-slate-400 mb-12 max-w-3xl mx-auto">
                      Experience adaptive AI that learns how you learn. Join professionals using our
                      intelligent exam engine to master certifications faster.
                    </p>
                    <div className="grid md:grid-cols-3 gap-6 mb-12 max-w-3xl mx-auto">
                      <div className="text-center p-6 bg-white/60 dark:bg-slate-900/60 rounded-lg backdrop-blur-sm">
                        <div className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-blue-600 bg-clip-text text-transparent mb-2">
                          Adaptive AI
                        </div>
                        <div className="text-base text-slate-600 dark:text-slate-400">
                          Learns from you
                        </div>
                      </div>
                      <div className="text-center p-6 bg-white/60 dark:bg-slate-900/60 rounded-lg backdrop-blur-sm">
                        <div className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-blue-600 bg-clip-text text-transparent mb-2">
                          Smart Focus
                        </div>
                        <div className="text-base text-slate-600 dark:text-slate-400">
                          Efficient study time
                        </div>
                      </div>
                      <div className="text-center p-6 bg-white/60 dark:bg-slate-900/60 rounded-lg backdrop-blur-sm">
                        <div className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-blue-600 bg-clip-text text-transparent mb-2">
                          Personal Engine
                        </div>
                        <div className="text-base text-slate-600 dark:text-slate-400">
                          Your success system
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <ActionButton
                        variant="primary"
                        size="lg"
                        onClick={() => router.push('/signup')}
                        icon={<Rocket className="h-5 w-5" />}
                        className="px-8 py-4"
                      >
                        Start Learning
                      </ActionButton>
                      <ActionButton
                        variant="outline"
                        size="lg"
                        onClick={() => router.push('/contact')}
                        icon={<Heart className="h-5 w-5" />}
                        className="px-8 py-4"
                      >
                        Get in Touch
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
