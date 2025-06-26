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
  name: 'About CertifAI - Simulate Exams by AI & Prepare for IT Certification by Self Exams',
  description:
    "Learn about CertifAI's mission to revolutionize how professionals simulate exams by AI and prepare for IT certification by self exams through artificial intelligence, personalized learning, and innovative educational technology.",
  url: 'https://certifai.app/about',
  mainEntity: {
    '@type': 'Organization',
    name: 'CertifAI',
  },
  isPartOf: {
    '@type': 'WebSite',
    name: 'CertifAI',
    url: 'https://certifai.app',
  },
  inLanguage: 'en-US',
  author: {
    '@type': 'Organization',
    name: 'CertifAI Team',
  },
};

export default function AboutPage() {
  // SEO-optimized milestone data with rich keywords
  const milestones = [
    {
      year: '2025 Q2',
      title: 'AI-Powered Platform Development',
      description:
        'Initiated development of CertifAI as an innovative AI-powered IT certification training platform, focusing on personalized learning experiences and adaptive question generation for professional development.',
      icon: Brain,
      keywords: 'AI development, certification platform, personalized learning',
    },
    {
      year: '2025 Q3',
      title: 'Beta Launch & Community Building',
      description:
        'Successfully launched early beta version with AI-generated practice questions, intelligent study recommendations, and core exam simulation features. Began building our community of IT professionals.',
      icon: Rocket,
      keywords: 'beta launch, practice questions, exam simulation',
    },
    {
      year: 'Current',
      title: 'User Feedback Integration & AI Enhancement',
      description:
        'Actively collecting user feedback from 500+ beta testers to improve AI model accuracy, enhance user experience, and expand certification coverage for various IT career paths.',
      icon: TrendingUp,
      keywords: 'user feedback, AI improvement, certification coverage',
    },
  ];

  // Enhanced stats with SEO-friendly descriptions
  const stats = [
    {
      value: '500+',
      label: 'Beta Users',
      icon: Users,
      description: 'Active beta testers improving their IT certification skills',
    },
    {
      value: 'AI-First',
      label: 'Technology',
      icon: Brain,
      description: 'Advanced artificial intelligence for personalized learning',
    },
    {
      value: 'Open Beta',
      label: 'Access',
      icon: Rocket,
      description: 'Free beta access with 300 credit coins for practice exams',
    },
    {
      value: '24/7',
      label: 'Availability',
      icon: Globe,
      description: 'Round-the-clock access to AI-powered study materials',
    },
  ];

  // SEO-optimized core values with rich keywords and benefits
  const values = [
    {
      icon: Brain,
      title: 'Advanced AI Technology for IT Certification Success',
      description:
        'Utilizing cutting-edge artificial intelligence and machine learning algorithms to create personalized study experiences, adaptive question generation, and intelligent performance analytics for IT professionals.',
      benefits: ['Personalized learning paths', 'Adaptive difficulty', 'Smart recommendations'],
      keywords: 'AI technology, machine learning, personalized study',
    },
    {
      icon: Users,
      title: 'User-Centric Development & Community Feedback',
      description:
        'Building every feature based on real user feedback from IT professionals, ensuring our platform addresses actual learning challenges and certification preparation needs.',
      benefits: ['Real user input', 'Practical solutions', 'Community-driven features'],
      keywords: 'user feedback, community driven, practical solutions',
    },
    {
      icon: Shield,
      title: 'Quality Assurance & Transparent Development',
      description:
        'Maintaining the highest standards in educational content quality while being transparent about our beta status, development progress, and the experimental nature of our AI features.',
      benefits: ['High-quality content', 'Transparent processes', 'Continuous improvement'],
      keywords: 'quality assurance, transparent development, high standards',
    },
    {
      icon: Heart,
      title: 'Accessible Professional Education for All',
      description:
        'Making premium IT certification training accessible to professionals worldwide through free beta access, comprehensive study materials, and inclusive learning design.',
      benefits: ['Free beta access', 'Global accessibility', 'Inclusive design'],
      keywords: 'accessible education, free access, inclusive learning',
    },
    {
      icon: Zap,
      title: 'Continuous Innovation & Rapid Improvement',
      description:
        'Implementing agile development practices to rapidly iterate, improve AI models, and introduce new features based on user needs and technological advancement.',
      benefits: ['Rapid iterations', 'Regular updates', 'Innovation focus'],
      keywords: 'continuous innovation, rapid improvement, agile development',
    },
    {
      icon: Target,
      title: 'Career-Focused Results & Practical Application',
      description:
        'Focusing exclusively on practical skills and knowledge that directly help IT professionals pass certifications, advance careers, and achieve their professional goals.',
      benefits: ['Career advancement', 'Practical skills', 'Real-world application'],
      keywords: 'career focused, practical application, professional goals',
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
              About CertifAI: Revolutionizing IT Certification Training with AI
            </h1>
            <div className="text-xl text-muted-foreground max-w-4xl mx-auto mb-8">
              <p className="mb-4">
                <strong>CertifAI</strong> is an innovative AI-powered platform transforming how IT
                professionals prepare for certifications. Our cutting-edge artificial intelligence
                creates personalized learning experiences, adaptive practice questions, and
                intelligent study recommendations.
              </p>
              <p>
                Join our community of <strong>500+ beta users</strong> who are already experiencing
                the future of IT certification training through our advanced machine learning
                technology.
              </p>
            </div>
            <nav
              className="flex flex-col sm:flex-row gap-4 justify-center"
              aria-label="CTA Navigation"
            >
              <Button size="lg" className="rounded-lg" aria-label="Try CertifAI Beta Version">
                <Rocket className="mr-2 h-5 w-5" />
                Start Free Beta Trial
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="rounded-lg"
                aria-label="Share feedback about CertifAI"
              >
                <Heart className="mr-2 h-5 w-5" />
                Join Our Community
              </Button>
            </nav>
          </header>

          {/* Enhanced Stats Section with rich descriptions */}
          <section className="mb-16" aria-labelledby="platform-stats">
            <h2 id="platform-stats" className="sr-only">
              CertifAI Platform Statistics
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
              CertifAI Mission and Vision
            </h2>

            <article>
              <Card className="h-full">
                <CardHeader>
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Target className="h-5 w-5 text-primary" aria-hidden="true" />
                    </div>
                    <CardTitle className="text-2xl">
                      Our Mission: Democratizing IT Certification Success
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    To <strong>revolutionize IT certification training</strong> through advanced
                    artificial intelligence, making professional education more accessible,
                    effective, and personalized. We&apos;re building the world&apos;s most
                    intelligent platform for IT certification preparation.
                  </p>
                  <p className="text-muted-foreground leading-relaxed mb-6">
                    Our AI-powered approach delivers{' '}
                    <strong>personalized learning experiences</strong> that adapt to individual
                    learning styles, knowledge gaps, and career goals, ensuring every professional
                    can achieve certification success.
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <Zap
                        className="h-5 w-5 text-primary mt-0.5 flex-shrink-0"
                        aria-hidden="true"
                      />
                      <span className="text-sm text-muted-foreground">
                        <strong>AI-Powered Personalization:</strong> Advanced machine learning for
                        adaptive study paths
                      </span>
                    </div>
                    <div className="flex items-start space-x-3">
                      <BookOpen
                        className="h-5 w-5 text-primary mt-0.5 flex-shrink-0"
                        aria-hidden="true"
                      />
                      <span className="text-sm text-muted-foreground">
                        <strong>Comprehensive Coverage:</strong> Multiple IT certification tracks
                        with expert-validated content
                      </span>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Users
                        className="h-5 w-5 text-primary mt-0.5 flex-shrink-0"
                        aria-hidden="true"
                      />
                      <span className="text-sm text-muted-foreground">
                        <strong>Community-Driven Development:</strong> Built with real feedback from
                        500+ IT professionals
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
                      Our Vision: The Future of Professional Education
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    To become the{' '}
                    <strong>global leader in AI-powered professional education</strong>, where every
                    IT professional has access to intelligent, personalized training that guarantees
                    certification success and career advancement.
                  </p>
                  <p className="text-muted-foreground leading-relaxed mb-6">
                    We envision a world where{' '}
                    <strong>artificial intelligence eliminates barriers</strong> to professional
                    growth, making expert-level training accessible regardless of location, budget,
                    or learning style.
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <Globe
                        className="h-5 w-5 text-primary mt-0.5 flex-shrink-0"
                        aria-hidden="true"
                      />
                      <span className="text-sm text-muted-foreground">
                        <strong>Global Accessibility:</strong> Reaching IT professionals worldwide
                        through web technology
                      </span>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Brain
                        className="h-5 w-5 text-primary mt-0.5 flex-shrink-0"
                        aria-hidden="true"
                      />
                      <span className="text-sm text-muted-foreground">
                        <strong>Intelligent Adaptation:</strong> AI that continuously learns and
                        improves from user interactions
                      </span>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Rocket
                        className="h-5 w-5 text-primary mt-0.5 flex-shrink-0"
                        aria-hidden="true"
                      />
                      <span className="text-sm text-muted-foreground">
                        <strong>Innovation Leadership:</strong> Pioneering the next generation of
                        educational technology
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
              Core Values: What Drives CertifAI&apos;s Innovation
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
              CertifAI Development Journey: From Concept to AI-Powered Platform
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
              Meet the Developer: Building the Future of AI Education
            </h2>
            <div className="max-w-2xl mx-auto">
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-8 text-center">
                  <div className="w-24 h-24 rounded-full bg-primary/10 mx-auto mb-6 flex items-center justify-center">
                    <Brain className="h-12 w-12 text-primary" aria-hidden="true" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    Solo Developer & AI Innovation Expert
                  </h3>
                  <p className="text-primary mb-4 font-medium">
                    Founder of CertifAI | AI Education Pioneer
                  </p>
                  <p className="text-muted-foreground leading-relaxed mb-6">
                    A passionate <strong>full-stack developer and AI enthusiast</strong> dedicated
                    to revolutionizing professional education through cutting-edge technology. With
                    deep expertise in machine learning, educational technology, and user experience
                    design, I&apos;m building CertifAI to demonstrate how AI can transform the way
                    IT professionals learn and grow.
                  </p>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center justify-center space-x-2">
                      <Code className="h-4 w-4 text-primary" aria-hidden="true" />
                      <span>Full-Stack Development</span>
                    </div>
                    <div className="flex items-center justify-center space-x-2">
                      <Brain className="h-4 w-4 text-primary" aria-hidden="true" />
                      <span>AI & Machine Learning</span>
                    </div>
                    <div className="flex items-center justify-center space-x-2">
                      <BookOpen className="h-4 w-4 text-primary" aria-hidden="true" />
                      <span>Educational Technology</span>
                    </div>
                    <div className="flex items-center justify-center space-x-2">
                      <Users className="h-4 w-4 text-primary" aria-hidden="true" />
                      <span>User Experience Design</span>
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
                  Join the AI-Powered Learning Revolution
                </h2>
                <p className="text-xl text-muted-foreground mb-6 max-w-3xl mx-auto">
                  Be part of the future of IT certification training. Try CertifAI&apos;s beta
                  platform and experience how artificial intelligence can accelerate your
                  professional growth.
                </p>
                <div className="grid md:grid-cols-3 gap-4 mb-8 max-w-2xl mx-auto">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">300+</div>
                    <div className="text-sm text-muted-foreground">Free Credit Coins</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">5+</div>
                    <div className="text-sm text-muted-foreground">Practice Exams</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">24/7</div>
                    <div className="text-sm text-muted-foreground">AI-Powered Support</div>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    size="lg"
                    className="rounded-lg"
                    aria-label="Start free CertifAI beta trial"
                  >
                    <Rocket className="mr-2 h-5 w-5" />
                    Start Free Beta Trial
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="rounded-lg"
                    aria-label="Join CertifAI community"
                  >
                    <Heart className="mr-2 h-5 w-5" />
                    Join Our Community
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
