import React from 'react';
import { Button } from '@/src/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Badge } from '@/src/components/ui/badge';
import LandingHeader from '@/src/components/custom/LandingHeader';
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
  // Project milestones with personal developer journey
  const milestones = [
    {
      year: 'Early 2025',
      title: 'Started Building',
      description:
        'Began developing Certestic to improve IT certification training using AI. Focused on creating more effective study methods.',
      icon: Brain,
      keywords: 'AI development, certification training',
    },
    {
      year: 'Mid 2025',
      title: 'Beta Launch',
      description:
        'Released the first beta version with AI-generated questions. Iterating based on user feedback.',
      icon: Rocket,
      keywords: 'beta launch, user feedback',
    },
    {
      year: 'Current',
      title: 'Growing Platform',
      description:
        'Continuously improving the platform with new features. Building a community of learners.',
      icon: TrendingUp,
      keywords: 'platform growth, community building',
    },
  ];

  // Personal project stats
  const stats = [
    {
      value: 'Growing',
      label: 'User Base',
      icon: Users,
      description: 'Active beta users providing feedback',
    },
    {
      value: 'One Developer',
      label: 'Team',
      icon: Brain,
      description: 'Focused development approach',
    },
    {
      value: 'Free Beta',
      label: 'Access',
      icon: Rocket,
      description: 'Open access during development',
    },
    {
      value: 'AI-Powered',
      label: 'Technology',
      icon: Globe,
      description: 'Modern learning algorithms',
    },
  ];

  // Personal values and approach to this side project
  const values = [
    {
      icon: Brain,
      title: 'Adaptive AI Learning',
      description:
        'Revolutionary AI that learns from your exam performance to create truly personalized study experiences. Each test gets smarter, focusing on your weak areas while challenging your strengths.',
      benefits: [
        'Performance-based adaptation',
        'Intelligent topic allocation',
        'Zero study waste',
      ],
      keywords: 'adaptive AI, personalized learning, performance analysis',
    },
    {
      icon: Target,
      title: 'Precision Learning',
      description:
        'Stop wasting time on topics you already know. Our algorithm allocates 50% of questions to weak areas, 25% for mastery validation, ensuring every study minute counts toward certification success.',
      benefits: ['Targeted weak area focus', 'Mastery validation', 'Efficient study time'],
      keywords: 'precision learning, targeted study, efficiency',
    },
    {
      icon: Users,
      title: 'Community Feedback',
      description:
        'Building based on real user needs and feedback. Every suggestion helps improve the platform for everyone.',
      benefits: ['User-driven development', 'Regular updates', 'Community input'],
      keywords: 'user feedback, community-driven development',
    },
    {
      icon: Shield,
      title: 'Transparent Development',
      description:
        'Open about progress, challenges, and improvements. No marketing fluff, just honest updates about development.',
      benefits: ['Clear communication', 'Regular updates', 'Honest progress'],
      keywords: 'transparency, authentic development',
    },
    {
      icon: Heart,
      title: 'Accessible Education',
      description:
        'Quality certification training should be available to everyone, regardless of budget or background.',
      benefits: ['Free beta access', 'No hidden costs', 'Global availability'],
      keywords: 'accessible education, affordable learning',
    },
    {
      icon: Zap,
      title: 'Fast Iteration',
      description:
        'Small team means quick decisions and rapid improvements. New features and fixes roll out regularly.',
      benefits: ['Quick updates', 'Rapid fixes', 'Fast innovation'],
      keywords: 'agile development, rapid iteration',
    },
    {
      icon: Target,
      title: 'Problem-Focused',
      description:
        'Every feature addresses real certification training challenges. Built to solve actual problems, not add complexity.',
      benefits: ['Practical solutions', 'Real-world focus', 'User-centered design'],
      keywords: 'problem-solving, practical solutions',
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
        {/* Header */}
        <LandingHeader />

        {/* Main Content with proper semantic structure */}
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16" role="main">
          {/* Hero Section with background decorative elements */}
          <div className="relative">
            {/* Background decorative elements - mobile responsive */}
            <div className="absolute inset-0 bg-gradient-to-br from-violet-50/50 via-transparent to-blue-50/30 dark:from-violet-900/10 dark:via-transparent dark:to-blue-900/10 rounded-3xl"></div>
            <div className="absolute top-10 right-4 sm:right-20 w-48 sm:w-72 h-48 sm:h-72 bg-violet-200/20 dark:bg-violet-600/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-10 left-4 sm:left-20 w-64 sm:w-96 h-64 sm:h-96 bg-blue-200/20 dark:bg-blue-600/10 rounded-full blur-3xl"></div>

            <header className="text-center mb-20 relative z-10">
              <Badge
                variant="secondary"
                className="mb-8 bg-gradient-to-r from-violet-100 to-blue-100 dark:from-violet-900/30 dark:to-blue-900/30 border border-violet-200 dark:border-violet-800/50 text-violet-800 dark:text-violet-200 px-4 py-2"
              >
                <Rocket className="h-4 w-4 mr-2 text-violet-600 dark:text-violet-400" />
                Built with passion
              </Badge>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-8 leading-tight">
                <span className="bg-gradient-to-r from-violet-600 to-blue-600 bg-clip-text text-transparent">
                  About Certestic
                </span>
              </h1>

              <div className="max-w-4xl mx-auto mb-12">
                <p className="text-xl sm:text-2xl text-slate-700 dark:text-slate-200 mb-6 leading-relaxed">
                  Adaptive AI-powered certification training that learns from your performance and
                  eliminates study waste.
                </p>
                <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                  Built by a developer who believes learning should be intelligent, adaptive, and
                  personalized for every student.
                </p>
              </div>

              <nav
                className="flex flex-col sm:flex-row gap-4 justify-center"
                aria-label="CTA Navigation"
              >
                <Button
                  size="lg"
                  className="rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-700 hover:to-blue-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200 px-8 py-4"
                  aria-label="Try Certestic Beta Version"
                >
                  <Rocket className="mr-2 h-5 w-5" />
                  Try Certestic
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="rounded-xl px-8 py-4 text-lg font-semibold border-2 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all duration-200"
                  aria-label="Share feedback about Certestic"
                >
                  <Heart className="mr-2 h-5 w-5" />
                  Share Feedback
                </Button>
              </nav>
            </header>
          </div>

          {/* Enhanced Stats Section with rich descriptions */}
          <section className="mb-20" aria-labelledby="platform-stats">
            <h2 id="platform-stats" className="sr-only">
              Certestic Platform Statistics
            </h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              {stats.map((stat, index) => (
                <Card
                  key={index}
                  className="text-center bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                >
                  <CardContent className="p-6">
                    <div className="h-12 w-12 bg-gradient-to-br from-violet-100 to-violet-200 dark:from-violet-900/30 dark:to-violet-800/30 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                      <stat.icon
                        className="h-6 w-6 text-violet-600 dark:text-violet-400"
                        aria-hidden="true"
                      />
                    </div>
                    <div className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent mb-2">
                      {stat.value}
                    </div>
                    <div className="text-base font-medium text-slate-700 dark:text-slate-200 mb-2">
                      {stat.label}
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                      {stat.description}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Mission & Vision with enhanced SEO content */}
          <section
            className="grid lg:grid-cols-2 gap-8 lg:gap-12 mb-20"
            aria-labelledby="mission-vision"
          >
            <h2 id="mission-vision" className="sr-only">
              Mission and Vision for Certestic
            </h2>

            <article>
              <Card className="h-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 shadow-md hover:shadow-lg transition-all duration-300">
                <CardHeader className="pb-6">
                  <CardTitle className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-slate-100">
                    Mission
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-8 pb-8">
                  <p className="text-lg text-slate-700 dark:text-slate-200 leading-relaxed mb-6">
                    Create adaptive, AI-powered certification training that learns from your
                    performance and eliminates study waste.
                  </p>
                  <p className="text-base text-slate-600 dark:text-slate-400 leading-relaxed mb-8">
                    Traditional certification training wastes time on topics you already know. Our
                    adaptive AI analyzes your performance history to create personalized exams -
                    more questions for weak areas, advanced challenges for strengths, zero time
                    wasted.
                  </p>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <Zap
                        className="h-5 w-5 text-violet-600 dark:text-violet-400 mt-0.5 flex-shrink-0"
                        aria-hidden="true"
                      />
                      <span className="text-base text-slate-700 dark:text-slate-200">
                        <strong>Adaptive Intelligence:</strong> AI that learns from your performance
                        history
                      </span>
                    </div>
                    <div className="flex items-start space-x-3">
                      <BookOpen
                        className="h-5 w-5 text-violet-600 dark:text-violet-400 mt-0.5 flex-shrink-0"
                        aria-hidden="true"
                      />
                      <span className="text-base text-slate-700 dark:text-slate-200">
                        <strong>Real Experience:</strong> Content based on actual certification
                        paths
                      </span>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Users
                        className="h-5 w-5 text-violet-600 dark:text-violet-400 mt-0.5 flex-shrink-0"
                        aria-hidden="true"
                      />
                      <span className="text-base text-slate-700 dark:text-slate-200">
                        <strong>Zero Study Waste:</strong> Focus time only on what you need to
                        master
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </article>

            <article>
              <Card className="h-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 shadow-md hover:shadow-lg transition-all duration-300">
                <CardHeader className="pb-6">
                  <CardTitle className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-slate-100">
                    Vision
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-8 pb-8">
                  <p className="text-lg text-slate-700 dark:text-slate-200 leading-relaxed mb-6">
                    Build the world&apos;s most intelligent certification training platform that
                    adapts to each learner.
                  </p>
                  <p className="text-base text-slate-600 dark:text-slate-400 leading-relaxed mb-8">
                    Every IT professional should have access to adaptive learning that gets smarter
                    with every test. No more wasted study time, no more generic questions - just
                    personalized exams that evolve with your progress and accelerate your
                    certification success.
                  </p>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <Globe
                        className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0"
                        aria-hidden="true"
                      />
                      <span className="text-base text-slate-700 dark:text-slate-200">
                        <strong>Global Access:</strong> Available to IT professionals everywhere
                      </span>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Brain
                        className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0"
                        aria-hidden="true"
                      />
                      <span className="text-base text-slate-700 dark:text-slate-200">
                        <strong>Continuous Learning:</strong> Technology that evolves with the field
                      </span>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Rocket
                        className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0"
                        aria-hidden="true"
                      />
                      <span className="text-base text-slate-700 dark:text-slate-200">
                        <strong>Career Growth:</strong> Tools that help professionals advance
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </article>
          </section>

          {/* Core Values Section with enhanced SEO */}
          <section className="mb-20" aria-labelledby="core-values">
            <div className="text-center mb-12">
              <h2
                id="core-values"
                className="text-3xl md:text-4xl font-bold mb-4 text-slate-900 dark:text-slate-100"
              >
                My Approach
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                Building Certestic with clear principles and user-focused development
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {values.map((value, index) => (
                <article key={index}>
                  <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 h-full">
                    <CardContent className="p-8">
                      <div>
                        <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-4">
                          {value.title}
                        </h3>
                        <p className="text-base text-slate-700 dark:text-slate-200 mb-6 leading-relaxed">
                          {value.description}
                        </p>
                        <div className="space-y-2">
                          {value.benefits.map((benefit, idx) => (
                            <div key={idx} className="flex items-center space-x-3">
                              <div className="w-1.5 h-1.5 bg-violet-600 dark:bg-violet-400 rounded-full flex-shrink-0"></div>
                              <span className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                                {benefit}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </article>
              ))}
            </div>
          </section>

          {/* Development Timeline with rich content */}
          <section className="mb-20" aria-labelledby="development-timeline">
            <div className="text-center mb-12">
              <h2
                id="development-timeline"
                className="text-3xl md:text-4xl font-bold mb-4 text-slate-900 dark:text-slate-100"
              >
                Development Journey
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                The story of how Certestic came to life and where it&apos;s heading
              </p>
            </div>
            <div className="relative max-w-4xl mx-auto">
              <div className="absolute left-1/2 transform -translate-x-0.5 h-full w-0.5 bg-gradient-to-b from-violet-200 to-blue-200 dark:from-violet-800 dark:to-blue-800"></div>
              <div className="space-y-12">
                {milestones.map((milestone, index) => (
                  <article
                    key={index}
                    className={`flex items-center ${
                      index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'
                    }`}
                  >
                    <div className={`flex-1 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8'}`}>
                      <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                        <CardContent className="p-8">
                          <div className="mb-4">
                            <Badge
                              variant="secondary"
                              className="font-medium text-base bg-gradient-to-r from-violet-100 to-blue-100 dark:from-violet-900/30 dark:to-blue-900/30 border border-violet-200 dark:border-violet-800/50 px-3 py-1"
                            >
                              {milestone.year}
                            </Badge>
                          </div>
                          <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-3 text-xl">
                            {milestone.title}
                          </h3>
                          <p className="text-base text-slate-700 dark:text-slate-200 mb-4 leading-relaxed">
                            {milestone.description}
                          </p>
                          <div className="text-sm text-violet-600 dark:text-violet-400 font-medium">
                            {milestone.keywords}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                    <div className="flex-shrink-0 z-10">
                      <div className="h-4 w-4 rounded-full bg-gradient-to-r from-violet-600 to-blue-600 border-4 border-white dark:border-slate-900 shadow-md"></div>
                    </div>
                    <div className="flex-1"></div>
                  </article>
                ))}
              </div>
            </div>
          </section>

          {/* Enhanced Developer Section */}
          <section className="mb-20" aria-labelledby="developer-info">
            <div className="text-center mb-12">
              <h2
                id="developer-info"
                className="text-3xl md:text-4xl font-bold mb-4 text-slate-900 dark:text-slate-100"
              >
                About the Developer
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                The person behind Certestic and the vision for better certification training
              </p>
            </div>
            <div className="max-w-3xl mx-auto">
              <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 shadow-md hover:shadow-lg transition-all duration-300">
                <CardContent className="p-8 sm:p-12 text-center">
                  <h3 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-3">
                    Ben Gao
                  </h3>
                  <p className="text-lg text-violet-600 dark:text-violet-400 mb-8 font-medium">
                    Full-Stack Developer | AI Enthusiast
                  </p>
                  <div className="space-y-6 text-left">
                    <p className="text-lg text-slate-700 dark:text-slate-200 leading-relaxed">
                      A developer passionate about making IT certification training more effective
                      and accessible through modern technology.
                    </p>
                    <p className="text-base text-slate-600 dark:text-slate-400 leading-relaxed">
                      Certestic combines years of software development experience with firsthand
                      knowledge of certification challenges to create better learning tools.
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-6 mt-10 text-base">
                    <div className="flex items-center justify-center space-x-3 p-4 bg-violet-50/50 dark:bg-violet-900/20 rounded-lg">
                      <Code
                        className="h-5 w-5 text-violet-600 dark:text-violet-400"
                        aria-hidden="true"
                      />
                      <span className="text-slate-700 dark:text-slate-200 font-medium">
                        Full-Stack Development
                      </span>
                    </div>
                    <div className="flex items-center justify-center space-x-3 p-4 bg-violet-50/50 dark:bg-violet-900/20 rounded-lg">
                      <Brain
                        className="h-5 w-5 text-violet-600 dark:text-violet-400"
                        aria-hidden="true"
                      />
                      <span className="text-slate-700 dark:text-slate-200 font-medium">
                        AI & Machine Learning
                      </span>
                    </div>
                    <div className="flex items-center justify-center space-x-3 p-4 bg-violet-50/50 dark:bg-violet-900/20 rounded-lg">
                      <BookOpen
                        className="h-5 w-5 text-violet-600 dark:text-violet-400"
                        aria-hidden="true"
                      />
                      <span className="text-slate-700 dark:text-slate-200 font-medium">
                        Educational Technology
                      </span>
                    </div>
                    <div className="flex items-center justify-center space-x-3 p-4 bg-violet-50/50 dark:bg-violet-900/20 rounded-lg">
                      <Users
                        className="h-5 w-5 text-violet-600 dark:text-violet-400"
                        aria-hidden="true"
                      />
                      <span className="text-slate-700 dark:text-slate-200 font-medium">
                        User-Centered Design
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Enhanced Call to Action */}
          <section className="text-center" aria-labelledby="join-beta">
            <Card className="bg-gradient-to-br from-violet-50/90 to-blue-50/70 dark:from-violet-900/30 dark:to-blue-900/20 border border-violet-200/60 dark:border-violet-700/50 shadow-lg relative overflow-hidden">
              {/* Decorative background pattern */}
              <div className="absolute inset-0 bg-gradient-to-br from-violet-50/30 to-blue-50/20 dark:from-violet-900/10 dark:to-blue-900/5"></div>
              <div className="absolute top-0 right-0 w-40 h-40 bg-violet-200/15 dark:bg-violet-600/8 rounded-full blur-2xl"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-200/15 dark:bg-blue-600/8 rounded-full blur-2xl"></div>

              <CardContent className="p-8 sm:p-16 relative z-10">
                <h2
                  id="join-beta"
                  className="text-3xl md:text-4xl font-bold mb-6 text-slate-900 dark:text-slate-100"
                >
                  Try Certestic Today
                </h2>
                <p className="text-xl text-slate-700 dark:text-slate-200 mb-10 max-w-3xl mx-auto leading-relaxed">
                  Experience adaptive AI that learns how you learn. Join professionals using our
                  intelligent exam engine to master certifications faster and more efficiently.
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
                      Zero Waste
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
                  <Button
                    size="lg"
                    className="rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-700 hover:to-blue-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200 px-8 py-4"
                    aria-label="Try Certestic beta"
                  >
                    <Rocket className="mr-2 h-5 w-5" />
                    Start Learning
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="rounded-xl px-8 py-4 text-lg font-semibold border-2 bg-white/80 dark:bg-slate-900/80 hover:bg-white dark:hover:bg-slate-900 transition-all duration-200"
                    aria-label="Contact the developer"
                  >
                    <Heart className="mr-2 h-5 w-5" />
                    Get in Touch
                  </Button>
                </div>
              </CardContent>
            </Card>
          </section>
        </main>
      </div>
    </>
  );
}
