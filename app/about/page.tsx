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
  name: 'About Certestic - My Personal Journey Building an AI Learning Platform',
  description:
    'Get to know the story behind Certestic and the developer who&apos;s passionate about making IT certification training better for everyone.',
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
      title: 'The Journey Begins',
      description:
        'I started Certestic because I saw an amazing opportunity to revolutionize IT certification training! After going through my own certification journey, I realized we could use AI to make studying so much more effective and enjoyable. So I started experimenting with AI in my spare time, and wow - the possibilities were endless!',
      icon: Brain,
      keywords:
        'opportunity and innovation, weekend experiments, AI curiosity, endless possibilities',
    },
    {
      year: 'Mid 2025',
      title: 'My First Beta Launch',
      description:
        'After countless late nights (and way too much coffee), I finally launched the first beta version! I started with basic AI-generated questions and have been adding features based on feedback from early users.',
      icon: Rocket,
      keywords: 'late nights, coffee addiction, beta launch, user feedback',
    },
    {
      year: 'Current',
      title: 'Growing Through Real Feedback',
      description:
        'I&apos;m still working on Certestic every spare moment I get, balancing it with my day job. Every message from users, every success story, every piece of feedback helps me understand what actually matters and guides my development priorities.',
      icon: TrendingUp,
      keywords: 'passion project, user feedback, iterative development',
    },
  ];

  // Personal project stats
  const stats = [
    {
      value: 'Growing Daily',
      label: 'Beta Users',
      icon: Users,
      description: 'People trying out what I&apos;ve built and sharing feedback',
    },
    {
      value: 'Just Me (For Now!)',
      label: 'Team Size',
      icon: Brain,
      description: 'One passionate developer with big dreams',
    },
    {
      value: 'Free Beta',
      label: 'Access',
      icon: Rocket,
      description: 'Free while I figure out how to make this sustainable',
    },
    {
      value: 'Nights & Weekends',
      label: 'Development Time',
      icon: Globe,
      description: 'Built with love and lots of coffee',
    },
  ];

  // Personal values and approach to this side project
  const values = [
    {
      icon: Brain,
      title: 'AI That Actually Helps (Not Just Hype)',
      description:
        'I&apos;m genuinely fascinated by AI and spend my weekends experimenting with ways to make learning more personalized. I&apos;m not chasing trends - I&apos;m trying to solve real problems using technology I&apos;m passionate about.',
      benefits: ['Hand-crafted with care', 'Real problem solving', 'Weekend experiments'],
      keywords: 'AI passion, machine learning, personal development',
    },
    {
      icon: Users,
      title: 'Your Feedback Shapes Development',
      description:
        'Since it&apos;s just me building this, I really value the feedback from users. Every message, suggestion, and bug report you send helps me understand what&apos;s working and what needs improvement. Your input directly influences my development priorities.',
      benefits: ['Direct feedback channel', 'Real user insights', 'Responsive development'],
      keywords: 'user feedback, solo development, responsive iteration',
    },
    {
      icon: Shield,
      title: 'Honest & Real (No Corporate Speak)',
      description:
        'I&apos;ll always be upfront about where Certestic stands. Sometimes things break, sometimes I&apos;m behind schedule, and sometimes I have amazing breakthroughs. I&apos;ll share it all because authenticity matters more than polished marketing.',
      benefits: ['Real talk always', 'No sugar coating', 'Genuine updates'],
      keywords: 'transparency, honest development, authentic communication',
    },
    {
      icon: Heart,
      title: 'Free Because Education Should Be',
      description:
        'Right now, Certestic is completely free because I believe good education shouldn&apos;t be a luxury. I&apos;m still figuring out how to make this sustainable long-term, but making it accessible is more important than making it profitable right now.',
      benefits: ['Completely free', 'No hidden agenda', 'Education-first mindset'],
      keywords: 'free access, educational mission, affordable learning',
    },
    {
      icon: Zap,
      title: 'Moving Fast & Learning Faster',
      description:
        'One of the perks of being a one-person team? I can try new things, experiment, and iterate quickly without getting stuck in meetings. If something doesn&apos;t work, I can pivot immediately. If it does work, I can build on it right away.',
      benefits: ['Quick experiments', 'Fast iterations', 'No bureaucracy'],
      keywords: 'rapid development, experimentation, agile solo work',
    },
    {
      icon: Target,
      title: 'Solving Real Problems (I&apos;ve Been There)',
      description:
        'Every feature in Certestic comes from a real problem I&apos;ve experienced or heard about from others. I&apos;m not building features because they sound cool - I&apos;m building them because they solve actual pain points in certification training.',
      benefits: ['Real-world tested', 'Problem-focused', 'Experience-driven'],
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
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12" role="main">
          {/* Hero Section with optimized heading hierarchy */}
          <header className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Hey There! I&apos;m Building Certestic 👋
            </h1>
            <div className="text-xl text-muted-foreground max-w-4xl mx-auto mb-8">
              <p className="mb-4">
                <strong>Certestic</strong> is my labor of love - a project I&apos;m building because
                I genuinely believe IT certification training can be so much better. What started as
                me being frustrated with expensive, boring study materials has turned into something
                I wake up excited to work on every day.
              </p>
              <p>
                I&apos;m <strong>one person</strong> with a laptop, a lot of determination, and a
                belief that good tools can make a real difference. No corporate fluff, no fancy
                offices - just me, my code, and the valuable feedback from users who help me
                understand what actually works.
              </p>
            </div>
            <nav
              className="flex flex-col sm:flex-row gap-4 justify-center"
              aria-label="CTA Navigation"
            >
              {' '}
              <Button size="lg" className="rounded-lg" aria-label="Try Certestic Beta Version">
                <Rocket className="mr-2 h-5 w-5" />
                Try What I&apos;ve Built
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="rounded-lg"
                aria-label="Share feedback about Certestic"
              >
                <Heart className="mr-2 h-5 w-5" />
                Share Your Feedback
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
                    <CardTitle className="text-2xl">Why I Started This Journey</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    I started Certestic because I was tired of watching friends (and myself!)
                    struggle with overpriced, outdated certification training. I&apos;ve been
                    through the pain of spending hundreds of dollars on boring materials that barely
                    helped me pass my exams.
                  </p>
                  <p className="text-muted-foreground leading-relaxed mb-6">
                    My mission is personal: create{' '}
                    <strong>AI-powered, affordable, and actually effective</strong> certification
                    training that I wish I had when I was studying. I want every IT professional to
                    have access to quality tools they need to succeed, without breaking the bank.
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <Zap
                        className="h-5 w-5 text-primary mt-0.5 flex-shrink-0"
                        aria-hidden="true"
                      />
                      <span className="text-sm text-muted-foreground">
                        <strong>Personal AI Magic:</strong> Algorithms I&apos;ve crafted with care
                        based on how people actually learn
                      </span>
                    </div>
                    <div className="flex items-start space-x-3">
                      <BookOpen
                        className="h-5 w-5 text-primary mt-0.5 flex-shrink-0"
                        aria-hidden="true"
                      />
                      <span className="text-sm text-muted-foreground">
                        <strong>Real-World Experience:</strong> Content based on my own
                        certification journey (and struggles!)
                      </span>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Users
                        className="h-5 w-5 text-primary mt-0.5 flex-shrink-0"
                        aria-hidden="true"
                      />
                      <span className="text-sm text-muted-foreground">
                        <strong>Community Input:</strong> Guided by feedback from users who share
                        this vision
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
                    <CardTitle className="text-2xl">Where I&apos;m Heading</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    Right now, Certestic is my nights-and-weekends passion project, but I have big
                    dreams for where this can go. I want to prove that with dedication, great
                    feedback from users, and a genuine desire to help people, a small project can
                    make a real difference.
                  </p>
                  <p className="text-muted-foreground leading-relaxed mb-6">
                    My vision is ambitious but simple: make Certestic the place where{' '}
                    <strong>every IT professional</strong> can get top-quality, AI-powered training
                    without worrying about cost. If I can help even one person land their dream job
                    or advance their career, all the late nights will be worth it.
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <Globe
                        className="h-5 w-5 text-primary mt-0.5 flex-shrink-0"
                        aria-hidden="true"
                      />
                      <span className="text-sm text-muted-foreground">
                        <strong>Global Impact:</strong> Helping IT professionals worldwide achieve
                        their dreams (starting one person at a time)
                      </span>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Brain
                        className="h-5 w-5 text-primary mt-0.5 flex-shrink-0"
                        aria-hidden="true"
                      />
                      <span className="text-sm text-muted-foreground">
                        <strong>Smarter AI:</strong> Technology that learns and improves with every
                        interaction
                      </span>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Rocket
                        className="h-5 w-5 text-primary mt-0.5 flex-shrink-0"
                        aria-hidden="true"
                      />
                      <span className="text-sm text-muted-foreground">
                        <strong>Sustainable Growth:</strong> Building something that lasts while
                        keeping education accessible
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
              How I&apos;m Building Certestic (And Why It Matters)
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
              My Journey So Far (The Real Story)
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
              Let Me Introduce Myself 😊
            </h2>
            <div className="max-w-2xl mx-auto">
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-8 text-center">
                  <div className="w-24 h-24 rounded-full bg-primary/10 mx-auto mb-6 flex items-center justify-center">
                    <Brain className="h-12 w-12 text-primary" aria-hidden="true" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    A Developer with a Dream (And Probably Too Much Coffee)
                  </h3>
                  <p className="text-primary mb-4 font-medium">
                    Full-Stack Developer | AI Enthusiast | Believer in Better Education
                  </p>
                  <p className="text-muted-foreground leading-relaxed mb-6">
                    I&apos;m Ben Gao, a <strong>full-stack developer</strong> who got fed up with
                    how expensive and boring IT certification training had become. After struggling
                    through my own certifications and watching friends do the same, I thought
                    &quot;someone should fix this!&quot; Then I realized... maybe that someone could
                    be me.
                  </p>
                  <p className="text-muted-foreground leading-relaxed mb-6">
                    Certestic isn&apos;t my day job (yet!) - it&apos;s the project I work on when I
                    get home from work, on weekends, and sometimes at 2 AM when I have a brilliant
                    idea. Every line of code is written with the hope that it might help someone
                    achieve their career goals. That&apos;s what keeps me going.
                  </p>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center justify-center space-x-2">
                      <Code className="h-4 w-4 text-primary" aria-hidden="true" />
                      <span>Late Night Coding</span>
                    </div>
                    <div className="flex items-center justify-center space-x-2">
                      <Brain className="h-4 w-4 text-primary" aria-hidden="true" />
                      <span>AI Experimenting</span>
                    </div>
                    <div className="flex items-center justify-center space-x-2">
                      <BookOpen className="h-4 w-4 text-primary" aria-hidden="true" />
                      <span>Learning by Doing</span>
                    </div>
                    <div className="flex items-center justify-center space-x-2">
                      <Users className="h-4 w-4 text-primary" aria-hidden="true" />
                      <span>Community Love</span>
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
                  Want to Try What I&apos;m Building? 🚀
                </h2>
                <p className="text-xl text-muted-foreground mb-6 max-w-3xl mx-auto">
                  Certestic is still in beta, which means it&apos;s not perfect - but that&apos;s
                  part of the journey! I&apos;m looking for people to try it out, share what works,
                  what doesn&apos;t, and what could be better. Your feedback helps me understand
                  what to focus on next.
                </p>
                <div className="grid md:grid-cols-3 gap-4 mb-8 max-w-2xl mx-auto">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">100% Free</div>
                    <div className="text-sm text-muted-foreground">Beta Access</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">Direct Access</div>
                    <div className="text-sm text-muted-foreground">To The Developer</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">Real Feedback</div>
                    <div className="text-sm text-muted-foreground">Actually Gets Heard</div>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg" className="rounded-lg" aria-label="Try Certestic beta">
                    <Rocket className="mr-2 h-5 w-5" />
                    Give It a Try!
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="rounded-lg"
                    aria-label="Contact the developer"
                  >
                    <Heart className="mr-2 h-5 w-5" />
                    Send Feedback
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
