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
  name: "About Certestic - A Solo Developer's Side-Hustle Project",
  description:
    "Learn about Certestic, a passionate side-hustle project by a solo developer who's building an AI-powered IT certification platform in their spare time.",
  url: 'https://certestic.com/about',
  mainEntity: {
    '@type': 'Person',
    name: 'Certestic Developer',
    jobTitle: 'Full-Stack Developer & AI Enthusiast',
  },
  isPartOf: {
    '@type': 'WebSite',
    name: 'Certestic',
    url: 'https://certestic.com',
  },
  inLanguage: 'en-US',
  author: {
    '@type': 'Person',
    name: 'Certestic Developer',
  },
};

export default function AboutPage() {
  // Project milestones with personal developer journey
  const milestones = [
    {
      year: 'Early 2025',
      title: 'The Side-Hustle Begins',
      description:
        'Started Certestic as a weekend project after noticing how expensive and outdated most IT certification training was. Began experimenting with AI to create personalized practice questions in my spare time.',
      icon: Brain,
      keywords: 'side project, weekend coding, AI experimentation',
    },
    {
      year: 'Mid 2025',
      title: 'First Beta Release',
      description:
        'After countless late nights and weekends, launched the first beta version. Started with basic AI-generated questions and slowly built up features based on feedback from fellow developers and IT professionals.',
      icon: Rocket,
      keywords: 'beta launch, late nights, community feedback',
    },
    {
      year: 'Current',
      title: 'Building the Future',
      description:
        'Continuing to develop Certestic in my spare time, balancing it with my day job. Each new user and piece of feedback motivates me to keep building and improving this passion project.',
      icon: TrendingUp,
      keywords: 'passion project, work-life balance, user feedback',
    },
  ];

  // Personal project stats
  const stats = [
    {
      value: 'A growing number',
      label: 'Beta Users',
      icon: Users,
      description: 'Fellow developers and IT professionals trying my side project',
    },
    {
      value: 'Solo Dev',
      label: 'Team Size',
      icon: Brain,
      description: 'Just me, coding in my spare time with passion',
    },
    {
      value: 'Free Beta',
      label: 'Access',
      icon: Rocket,
      description: 'Free while I build and improve based on your feedback',
    },
    {
      value: 'Nights & Weekends',
      label: 'Development Time',
      icon: Globe,
      description: 'Built with love during my free time',
    },
  ];

  // Personal values and approach to this side project
  const values = [
    {
      icon: Brain,
      title: 'AI-Powered Learning (Built by Hand)',
      description:
        'I&apos;m fascinated by AI and spend my weekends experimenting with machine learning to create personalized study experiences. Every algorithm and feature is crafted with care during my spare time.',
      benefits: ['Hand-crafted AI models', 'Personal experimentation', 'Weekend innovations'],
      keywords: 'AI passion, machine learning, personal development',
    },
    {
      icon: Users,
      title: 'Community-First Development',
      description:
        'As a solo developer, I rely heavily on feedback from users like you. Every feature request and bug report helps me improve Certestic during my limited development time.',
      benefits: ['Direct developer contact', 'Quick responses', 'User-driven features'],
      keywords: 'community feedback, solo development, user input',
    },
    {
      icon: Shield,
      title: 'Honest & Transparent',
      description:
        'I&apos;m upfront about this being a side project. I share my development progress, challenges, and wins openly. No corporate speak - just honest communication about what I&apos;m building.',
      benefits: ['Transparent development', 'No marketing fluff', 'Real progress updates'],
      keywords: 'transparency, honest development, authentic communication',
    },
    {
      icon: Heart,
      title: 'Accessible & Free (For Now)',
      description:
        'While I figure out the business model, Certestic stays free. I believe good education shouldn&apos;t be expensive, and I want to help as many people as possible while I build this platform.',
      benefits: ['Free beta access', 'No hidden costs', 'Educational mission'],
      keywords: 'free access, educational mission, affordable learning',
    },
    {
      icon: Zap,
      title: 'Rapid Iteration & Learning',
      description:
        'Working solo means I can move fast and experiment freely. I push updates regularly, try new features, and learn from failures without corporate bureaucracy slowing me down.',
      benefits: ['Fast updates', 'Experimental features', 'Quick pivots'],
      keywords: 'rapid development, experimentation, agile solo work',
    },
    {
      icon: Target,
      title: 'Practical & Results-Focused',
      description:
        'I built Certestic to solve real problems I&apos;ve seen in my career. Every feature is designed to actually help people pass certifications and advance their careers, not just look impressive.',
      benefits: ['Real-world solutions', 'Career-focused', 'Practical approach'],
      keywords: 'practical solutions, career advancement, real-world application',
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
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12" role="main">
          {/* Hero Section with optimized heading hierarchy */}
          <header className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              About Certestic: A Solo Developer&apos;s Side-Hustle
            </h1>
            <div className="text-xl text-muted-foreground max-w-4xl mx-auto mb-8">
              <p className="mb-4">
                <strong>Certestic</strong> is my personal side project - a passion-driven attempt to
                make IT certification training more accessible and effective using AI. What started
                as weekend coding sessions has grown into something I&apos;m genuinely proud of.
              </p>
              <p>
                I&apos;m just <strong>one developer</strong> working on this in my spare time, but I
                believe that with your feedback and support, we can build something truly special
                together. No corporate BS, just honest work and genuine care for helping people
                succeed.
              </p>
            </div>
            <nav
              className="flex flex-col sm:flex-row gap-4 justify-center"
              aria-label="CTA Navigation"
            >
              <Button size="lg" className="rounded-lg" aria-label="Try Certestic Beta Version">
                <Rocket className="mr-2 h-5 w-5" />
                Try My Beta Project
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="rounded-lg"
                aria-label="Share feedback about Certestic"
              >
                <Heart className="mr-2 h-5 w-5" />
                Send Me Feedback
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
                    <div className="text-2xl font-bold text-foreground mb-1">{stat.value}</div>
                    <div className="text-sm font-medium text-muted-foreground mb-2">
                      {stat.label}
                    </div>
                    <div className="text-xs text-muted-foreground">{stat.description}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Mission & Vision with enhanced SEO content */}
          <section className="grid lg:grid-cols-2 gap-12 mb-16" aria-labelledby="mission-vision">
            <h2 id="mission-vision" className="sr-only">
              My Personal Mission and Vision for Certestic
            </h2>

            <article>
              <Card className="h-full">
                <CardHeader>
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Target className="h-5 w-5 text-primary" aria-hidden="true" />
                    </div>
                    <CardTitle className="text-2xl">
                      My Mission: Making IT Certification Training Better
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    I started Certestic because I was frustrated with the expensive, outdated IT
                    certification training options available. As someone who&apos;s been through
                    multiple certifications, I knew there had to be a better way.
                  </p>
                  <p className="text-muted-foreground leading-relaxed mb-6">
                    My goal is simple: use AI to create{' '}
                    <strong>personalized, effective, and affordable</strong> certification training
                    that actually helps people pass their exams and advance their careers. No fluff,
                    just results.
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <Zap
                        className="h-5 w-5 text-primary mt-0.5 flex-shrink-0"
                        aria-hidden="true"
                      />
                      <span className="text-sm text-muted-foreground">
                        <strong>Personal AI Development:</strong> Hand-crafted algorithms based on
                        real learning patterns
                      </span>
                    </div>
                    <div className="flex items-start space-x-3">
                      <BookOpen
                        className="h-5 w-5 text-primary mt-0.5 flex-shrink-0"
                        aria-hidden="true"
                      />
                      <span className="text-sm text-muted-foreground">
                        <strong>Real-World Focus:</strong> Content based on actual certification
                        experiences
                      </span>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Users
                        className="h-5 w-5 text-primary mt-0.5 flex-shrink-0"
                        aria-hidden="true"
                      />
                      <span className="text-sm text-muted-foreground">
                        <strong>Community Partnership:</strong> Built with and for fellow IT
                        professionals
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
                    <CardTitle className="text-2xl">
                      My Vision: Growing Beyond a Side Project
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    Right now, Certestic is my nights-and-weekends project, but I have plans for it
                    becoming the go-to platform for IT certification training. I want to prove that
                    a solo developer can build something that competes with (and beats) the big
                    players.
                  </p>
                  <p className="text-muted-foreground leading-relaxed mb-6">
                    My vision is to create a platform where <strong>every IT professional</strong>{' '}
                    can access high-quality, AI-powered training regardless of their budget or
                    location. If I can help just one person advance their career, it&apos;s worth
                    it.
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <Globe
                        className="h-5 w-5 text-primary mt-0.5 flex-shrink-0"
                        aria-hidden="true"
                      />
                      <span className="text-sm text-muted-foreground">
                        <strong>Global Impact:</strong> Helping IT professionals worldwide achieve
                        their goals
                      </span>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Brain
                        className="h-5 w-5 text-primary mt-0.5 flex-shrink-0"
                        aria-hidden="true"
                      />
                      <span className="text-sm text-muted-foreground">
                        <strong>Continuous Learning:</strong> AI that gets smarter with every user
                        interaction
                      </span>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Rocket
                        className="h-5 w-5 text-primary mt-0.5 flex-shrink-0"
                        aria-hidden="true"
                      />
                      <span className="text-sm text-muted-foreground">
                        <strong>Sustainable Growth:</strong> Building a business that supports great
                        education
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </article>
          </section>

          {/* Core Values Section with enhanced SEO */}
          <section className="mb-16" aria-labelledby="core-values">
            <h2 id="core-values" className="text-3xl font-bold text-foreground text-center mb-8">
              My Development Philosophy: How I&apos;m Building Certestic
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
                          <h3 className="font-semibold text-foreground mb-2">{value.title}</h3>
                          <p className="text-sm text-muted-foreground mb-3">{value.description}</p>
                          <div className="space-y-1">
                            {value.benefits.map((benefit, idx) => (
                              <div key={idx} className="flex items-center space-x-2">
                                <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                                <span className="text-xs text-muted-foreground">{benefit}</span>
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
              className="text-3xl font-bold text-foreground text-center mb-8"
            >
              My Certestic Journey: From Idea to Beta
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
                            <Badge variant="secondary" className="font-medium">
                              {milestone.year}
                            </Badge>
                            <milestone.icon className="h-4 w-4 text-primary" aria-hidden="true" />
                          </div>
                          <h3 className="font-semibold text-foreground mb-2 text-lg">
                            {milestone.title}
                          </h3>
                          <p className="text-sm text-muted-foreground mb-3">
                            {milestone.description}
                          </p>
                          <div className="text-xs text-primary font-medium">
                            Key Focus: {milestone.keywords}
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
            <h2 id="developer-info" className="text-3xl font-bold text-foreground text-center mb-8">
              Hi, I&apos;m the Developer Behind Certestic
            </h2>
            <div className="max-w-2xl mx-auto">
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-8 text-center">
                  <div className="w-24 h-24 rounded-full bg-primary/10 mx-auto mb-6 flex items-center justify-center">
                    <Brain className="h-12 w-12 text-primary" aria-hidden="true" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    Just a Developer with a Plan
                  </h3>
                  <p className="text-primary mb-4 font-medium">
                    Full-Stack Developer | AI Enthusiast | Side-Hustle Entrepreneur
                  </p>
                  <p className="text-muted-foreground leading-relaxed mb-6">
                    I&apos;m a <strong>full-stack developer</strong> who got tired of expensive,
                    outdated IT certification training. After struggling through multiple
                    certifications myself, I decided to build something better. Certestic is my
                    attempt to use AI to solve real problems in professional education.
                  </p>
                  <p className="text-muted-foreground leading-relaxed mb-6">
                    This isn&apos;t my day job - it&apos;s my passion project. I work on Certestic
                    during evenings and weekends, pouring my heart into creating something that
                    genuinely helps people advance their careers. Every line of code is written with
                    care and purpose.
                  </p>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center justify-center space-x-2">
                      <Code className="h-4 w-4 text-primary" aria-hidden="true" />
                      <span>Weekend Coding</span>
                    </div>
                    <div className="flex items-center justify-center space-x-2">
                      <Brain className="h-4 w-4 text-primary" aria-hidden="true" />
                      <span>AI Experimentation</span>
                    </div>
                    <div className="flex items-center justify-center space-x-2">
                      <BookOpen className="h-4 w-4 text-primary" aria-hidden="true" />
                      <span>Real-World Testing</span>
                    </div>
                    <div className="flex items-center justify-center space-x-2">
                      <Users className="h-4 w-4 text-primary" aria-hidden="true" />
                      <span>Community Feedback</span>
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
                <h2 id="join-beta" className="text-3xl font-bold text-foreground mb-4">
                  Help Me Build Something Amazing
                </h2>
                <p className="text-xl text-muted-foreground mb-6 max-w-3xl mx-auto">
                  Certestic is still in beta, and I need your help to make it better. Try it out,
                  break it, and tell me what you think. Your feedback directly shapes what I build
                  next.
                </p>
                <div className="grid md:grid-cols-3 gap-4 mb-8 max-w-2xl mx-auto">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">Free</div>
                    <div className="text-sm text-muted-foreground">Beta Access</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">Direct</div>
                    <div className="text-sm text-muted-foreground">Developer Contact</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">Real</div>
                    <div className="text-sm text-muted-foreground">Impact on Development</div>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg" className="rounded-lg" aria-label="Try Certestic beta">
                    <Rocket className="mr-2 h-5 w-5" />
                    Try My Beta Project
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="rounded-lg"
                    aria-label="Contact the developer"
                  >
                    <Heart className="mr-2 h-5 w-5" />
                    Send Me Feedback
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
