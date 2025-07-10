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
  Eye,
  Heart,
  Users,
  Globe,
  BookOpen,
  Zap,
  Shield,
  Brain,
  Rocket,
  Star,
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
      title: 'AI-Powered Learning',
      description:
        'Using artificial intelligence to create personalized study experiences that adapt to individual learning patterns.',
      benefits: ['Adaptive algorithms', 'Personalized content', 'Smart recommendations'],
      keywords: 'AI technology, personalized learning',
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

      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        {/* Header */}
        <LandingHeader showFeaturesLink={false} />

        {/* Main Content with proper semantic structure */}
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12" role="main">
          {/* Hero Section with optimized heading hierarchy */}
          <header className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-8">About Certestic</h1>
            <div className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto mb-8">
              <p className="mb-6">
                AI-powered certification training built to be effective and accessible.
              </p>
              <p className="text-lg">
                Made by one developer who believes learning should be better.
              </p>
            </div>
            <nav
              className="flex flex-col sm:flex-row gap-4 justify-center"
              aria-label="CTA Navigation"
            >
              <Button size="lg" className="rounded-lg" aria-label="Try Certestic Beta Version">
                <Rocket className="mr-2 h-5 w-5" />
                Try Certestic
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="rounded-lg"
                aria-label="Share feedback about Certestic"
              >
                <Heart className="mr-2 h-5 w-5" />
                Share Feedback
              </Button>
            </nav>
          </header>

          {/* Enhanced Stats Section with rich descriptions */}
          <section className="mb-16" aria-labelledby="platform-stats">
            <h2 id="platform-stats" className="sr-only">
              Certestic Platform Statistics
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-3">
                      <stat.icon className="h-6 w-6 text-primary" aria-hidden="true" />
                    </div>
                    <div className="text-2xl md:text-3xl font-bold text-foreground mb-1">
                      {stat.value}
                    </div>
                    <div className="text-base md:text-lg font-medium text-muted-foreground mb-2">
                      {stat.label}
                    </div>
                    <div className="text-sm text-muted-foreground">{stat.description}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Mission & Vision with enhanced SEO content */}
          <section className="grid lg:grid-cols-2 gap-12 mb-16" aria-labelledby="mission-vision">
            <h2 id="mission-vision" className="sr-only">
              Mission and Vision for Certestic
            </h2>

            <article>
              <Card className="h-full">
                <CardHeader>
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Target className="h-5 w-5 text-primary" aria-hidden="true" />
                    </div>
                    <CardTitle className="text-2xl md:text-3xl">Mission</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-lg text-muted-foreground leading-relaxed mb-4">
                    Create effective, AI-powered certification training that&apos;s accessible to
                    everyone.
                  </p>
                  <p className="text-base text-muted-foreground leading-relaxed mb-6">
                    Traditional certification training is expensive and often ineffective.
                    We&apos;re building something better using modern AI technology.
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <Zap
                        className="h-5 w-5 text-primary mt-0.5 flex-shrink-0"
                        aria-hidden="true"
                      />
                      <span className="text-base text-muted-foreground">
                        <strong>Smart Learning:</strong> AI adapts to how you learn best
                      </span>
                    </div>
                    <div className="flex items-start space-x-3">
                      <BookOpen
                        className="h-5 w-5 text-primary mt-0.5 flex-shrink-0"
                        aria-hidden="true"
                      />
                      <span className="text-base text-muted-foreground">
                        <strong>Real Experience:</strong> Content based on actual certification
                        paths
                      </span>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Users
                        className="h-5 w-5 text-primary mt-0.5 flex-shrink-0"
                        aria-hidden="true"
                      />
                      <span className="text-base text-muted-foreground">
                        <strong>Community Driven:</strong> Built with user feedback
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </article>

            <article>
              <Card className="h-full">
                <CardHeader>
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Eye className="h-5 w-5 text-primary" aria-hidden="true" />
                    </div>
                    <CardTitle className="text-2xl md:text-3xl">Vision</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-lg text-muted-foreground leading-relaxed mb-4">
                    Make quality IT certification training available to professionals worldwide.
                  </p>
                  <p className="text-base text-muted-foreground leading-relaxed mb-6">
                    Every IT professional should have access to effective training that helps
                    advance their career without breaking the bank.
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <Globe
                        className="h-5 w-5 text-primary mt-0.5 flex-shrink-0"
                        aria-hidden="true"
                      />
                      <span className="text-base text-muted-foreground">
                        <strong>Global Access:</strong> Available to IT professionals everywhere
                      </span>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Brain
                        className="h-5 w-5 text-primary mt-0.5 flex-shrink-0"
                        aria-hidden="true"
                      />
                      <span className="text-base text-muted-foreground">
                        <strong>Continuous Learning:</strong> Technology that evolves with the field
                      </span>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Rocket
                        className="h-5 w-5 text-primary mt-0.5 flex-shrink-0"
                        aria-hidden="true"
                      />
                      <span className="text-base text-muted-foreground">
                        <strong>Career Growth:</strong> Tools that help professionals advance
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </article>
          </section>

          {/* Core Values Section with enhanced SEO */}
          <section className="mb-16" aria-labelledby="core-values">
            <h2
              id="core-values"
              className="text-3xl md:text-4xl font-bold text-foreground text-center mb-8"
            >
              Our Approach
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {values.map((value, index) => (
                <article key={index}>
                  <Card className="hover:shadow-lg transition-shadow h-full">
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <value.icon className="h-5 w-5 text-primary" aria-hidden="true" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-foreground mb-2">
                            {value.title}
                          </h3>
                          <p className="text-base text-muted-foreground mb-3">
                            {value.description}
                          </p>
                          <div className="space-y-1">
                            {value.benefits.map((benefit, idx) => (
                              <div key={idx} className="flex items-center space-x-2">
                                <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                                <span className="text-sm text-muted-foreground">{benefit}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </article>
              ))}
            </div>
          </section>

          {/* Development Timeline with rich content */}
          <section className="mb-16" aria-labelledby="development-timeline">
            <h2
              id="development-timeline"
              className="text-3xl md:text-4xl font-bold text-foreground text-center mb-8"
            >
              Development Timeline
            </h2>
            <div className="relative">
              <div className="absolute left-1/2 transform -translate-x-0.5 h-full w-0.5 bg-border"></div>
              <div className="space-y-8">
                {milestones.map((milestone, index) => (
                  <article
                    key={index}
                    className={`flex items-center ${
                      index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'
                    }`}
                  >
                    <div className={`flex-1 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8'}`}>
                      <Card className="hover:shadow-lg transition-shadow">
                        <CardContent className="p-6">
                          <div className="flex items-center space-x-2 mb-3">
                            <Badge variant="secondary" className="font-medium text-base">
                              {milestone.year}
                            </Badge>
                            <milestone.icon className="h-5 w-5 text-primary" aria-hidden="true" />
                          </div>
                          <h3 className="font-semibold text-foreground mb-2 text-xl">
                            {milestone.title}
                          </h3>
                          <p className="text-base text-muted-foreground mb-3">
                            {milestone.description}
                          </p>
                          <div className="text-sm text-primary font-medium">
                            {milestone.keywords}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                    <div className="flex-shrink-0 z-10">
                      <div className="h-4 w-4 rounded-full bg-primary border-4 border-background"></div>
                    </div>
                    <div className="flex-1"></div>
                  </article>
                ))}
              </div>
            </div>
          </section>

          {/* Enhanced Developer Section */}
          <section className="mb-16" aria-labelledby="developer-info">
            <h2
              id="developer-info"
              className="text-3xl md:text-4xl font-bold text-foreground text-center mb-8"
            >
              About the Developer
            </h2>
            <div className="max-w-2xl mx-auto">
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-8 text-center">
                  <div className="w-24 h-24 rounded-full bg-primary/10 mx-auto mb-6 flex items-center justify-center">
                    <Brain className="h-12 w-12 text-primary" aria-hidden="true" />
                  </div>
                  <h3 className="text-2xl font-semibold text-foreground mb-2">Ben Gao</h3>
                  <p className="text-lg text-primary mb-4 font-medium">
                    Full-Stack Developer | AI Enthusiast
                  </p>
                  <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                    A developer passionate about making IT certification training more effective and
                    accessible through modern technology.
                  </p>
                  <p className="text-base text-muted-foreground leading-relaxed mb-6">
                    Certestic combines years of software development experience with firsthand
                    knowledge of certification challenges to create better learning tools.
                  </p>
                  <div className="grid grid-cols-2 gap-4 text-base">
                    <div className="flex items-center justify-center space-x-2">
                      <Code className="h-5 w-5 text-primary" aria-hidden="true" />
                      <span>Full-Stack Development</span>
                    </div>
                    <div className="flex items-center justify-center space-x-2">
                      <Brain className="h-5 w-5 text-primary" aria-hidden="true" />
                      <span>AI & Machine Learning</span>
                    </div>
                    <div className="flex items-center justify-center space-x-2">
                      <BookOpen className="h-5 w-5 text-primary" aria-hidden="true" />
                      <span>Educational Technology</span>
                    </div>
                    <div className="flex items-center justify-center space-x-2">
                      <Users className="h-5 w-5 text-primary" aria-hidden="true" />
                      <span>User-Centered Design</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Enhanced Call to Action */}
          <section className="text-center" aria-labelledby="join-beta">
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="p-12">
                <Star className="h-12 w-12 text-primary mx-auto mb-6" aria-hidden="true" />
                <h2 id="join-beta" className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                  Try Certestic Today
                </h2>
                <p className="text-xl text-muted-foreground mb-6 max-w-3xl mx-auto">
                  Join the beta and experience AI-powered certification training. Free access while
                  in development.
                </p>
                <div className="grid md:grid-cols-3 gap-4 mb-8 max-w-2xl mx-auto">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">Free Beta</div>
                    <div className="text-base text-muted-foreground">No cost to try</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">AI-Powered</div>
                    <div className="text-base text-muted-foreground">Smart learning</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">Community</div>
                    <div className="text-base text-muted-foreground">Shape the future</div>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg" className="rounded-lg" aria-label="Try Certestic beta">
                    <Rocket className="mr-2 h-5 w-5" />
                    Start Learning
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="rounded-lg"
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
