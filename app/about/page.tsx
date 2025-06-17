'use client';

import React from 'react';
import { Button } from '@/src/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Badge } from '@/src/components/ui/badge';
import LandingHeader from '@/src/components/custom/LandingHeader';
import {
  Target,
  Eye,
  Heart,
  Users,
  Award,
  TrendingUp,
  Globe,
  BookOpen,
  Zap,
  Shield,
  Brain,
  Rocket,
  Star,
  Linkedin,
  Twitter,
  Github,
} from 'lucide-react';

export default function AboutPage() {
  const milestones = [
    {
      year: '2023',
      quarter: 'Q1',
      title: 'Company Founded',
      description:
        'CertifAI was founded with a vision to revolutionize IT certification training using AI technology.',
    },
    {
      year: '2023',
      quarter: 'Q3',
      title: 'Beta Launch',
      description:
        'Launched our beta platform with 50 initial users and AWS certification support.',
    },
    {
      year: '2024',
      quarter: 'Q1',
      title: 'Series A Funding',
      description:
        'Raised $12M in Series A funding to accelerate product development and team growth.',
    },
    {
      year: '2024',
      quarter: 'Q3',
      title: 'Multi-Cloud Support',
      description: 'Expanded to support Azure, Google Cloud, and other major cloud certifications.',
    },
    {
      year: '2025',
      quarter: 'Q1',
      title: '500+ Active Users',
      description: 'Reached 500+ active users with 95% satisfaction rate and growing community.',
    },
    {
      year: '2025',
      quarter: 'Q2',
      title: 'AI Enhancement',
      description:
        'Launched advanced AI personalization features and adaptive learning algorithms.',
    },
  ];

  const stats = [
    { value: '500+', label: 'Active Users', icon: Users },
    { value: '95%', label: 'Success Rate', icon: Award },
    { value: '50+', label: 'Certifications', icon: BookOpen },
    { value: '28', label: 'Team Members', icon: Heart },
    { value: '$12M', label: 'Funding Raised', icon: TrendingUp },
    { value: '15+', label: 'Countries', icon: Globe },
  ];

  const team = [
    {
      name: 'Sarah Chen',
      role: 'CEO & Co-Founder',
      bio: 'Former AWS Solutions Architect with 10+ years in cloud technologies. Passionate about democratizing IT education.',
      image: '/api/placeholder/150/150',
      linkedin: '#',
      twitter: '#',
    },
    {
      name: 'Marcus Rodriguez',
      role: 'CTO & Co-Founder',
      bio: 'Ex-Google AI researcher specializing in educational technology and machine learning systems.',
      image: '/api/placeholder/150/150',
      linkedin: '#',
      github: '#',
    },
    {
      name: 'Dr. Emily Watson',
      role: 'Head of AI Research',
      bio: 'PhD in Computer Science from Stanford. Expert in natural language processing and adaptive learning.',
      image: '/api/placeholder/150/150',
      linkedin: '#',
      twitter: '#',
    },
    {
      name: 'James Park',
      role: 'VP of Engineering',
      bio: 'Former Principal Engineer at Microsoft Azure. 12+ years building scalable cloud platforms.',
      image: '/api/placeholder/150/150',
      linkedin: '#',
      github: '#',
    },
    {
      name: 'Lisa Thompson',
      role: 'Head of Product',
      bio: 'Former Product Manager at Salesforce. Expert in B2B SaaS and user experience design.',
      image: '/api/placeholder/150/150',
      linkedin: '#',
      twitter: '#',
    },
    {
      name: 'David Kim',
      role: 'Head of Customer Success',
      bio: 'Former Solutions Engineer with deep expertise in IT certifications and customer success.',
      image: '/api/placeholder/150/150',
      linkedin: '#',
    },
  ];

  const values = [
    {
      icon: Brain,
      title: 'Innovation First',
      description:
        'We push the boundaries of what&apos;s possible with AI and education technology.',
    },
    {
      icon: Users,
      title: 'User-Centric',
      description:
        'Every decision we make is guided by how it will improve our learners&apos; success.',
    },
    {
      icon: Shield,
      title: 'Quality & Trust',
      description: 'We maintain the highest standards in accuracy, reliability, and data security.',
    },
    {
      icon: Heart,
      title: 'Inclusive Community',
      description:
        'We believe learning should be accessible to everyone, regardless of background.',
    },
    {
      icon: Zap,
      title: 'Continuous Learning',
      description: 'We practice what we preach - always learning, improving, and adapting.',
    },
    {
      icon: Target,
      title: 'Results Driven',
      description:
        'We measure success by our users&apos; certification achievements and career growth.',
    },
  ];

  const investors = [
    { name: 'Andreessen Horowitz', type: 'Lead Series A', logo: '/api/placeholder/120/60' },
    { name: 'Sequoia Capital', type: 'Series A', logo: '/api/placeholder/120/60' },
    { name: 'First Round Capital', type: 'Seed', logo: '/api/placeholder/120/60' },
    { name: 'Y Combinator', type: 'Accelerator', logo: '/api/placeholder/120/60' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <LandingHeader showFeaturesLink={false} />

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">About CertifAI</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            We&apos;re on a mission to democratize IT certification training through the power of
            artificial intelligence. Our platform helps professionals advance their careers with
            personalized, AI-generated practice questions and adaptive learning experiences.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="rounded-lg">
              Start Your Journey
            </Button>
            <Button variant="outline" size="lg" className="rounded-lg">
              Learn More
            </Button>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-16">
          {stats.map((stat, index) => (
            <Card key={index} className="text-center">
              <CardContent className="p-6">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <stat.icon className="h-6 w-6 text-primary" />
                </div>
                <div className="text-2xl font-bold text-foreground mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Mission & Vision */}
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-3 mb-2">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Target className="h-5 w-5 text-primary" />
                </div>
                <CardTitle className="text-2xl">Our Mission</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                To revolutionize IT certification training by making high-quality, personalized
                learning accessible to everyone. We believe that with the right tools and AI-powered
                insights, any motivated professional can achieve their certification goals and
                advance their career in technology.
              </p>
              <div className="mt-6 space-y-3">
                <div className="flex items-start space-x-3">
                  <Zap className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-muted-foreground">
                    Accelerate learning with AI-powered personalization
                  </span>
                </div>
                <div className="flex items-start space-x-3">
                  <BookOpen className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-muted-foreground">
                    Provide comprehensive coverage of all major certifications
                  </span>
                </div>
                <div className="flex items-start space-x-3">
                  <Users className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-muted-foreground">
                    Build a supportive community of learners and professionals
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center space-x-3 mb-2">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Eye className="h-5 w-5 text-primary" />
                </div>
                <CardTitle className="text-2xl">Our Vision</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                To become the world&apos;s leading platform for AI-powered professional
                certification training, where millions of learners achieve their career goals
                through personalized, effective, and engaging educational experiences.
              </p>
              <div className="mt-6 space-y-3">
                <div className="flex items-start space-x-3">
                  <Globe className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-muted-foreground">
                    Global reach with localized learning experiences
                  </span>
                </div>
                <div className="flex items-start space-x-3">
                  <Brain className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-muted-foreground">
                    Cutting-edge AI that adapts to each learner&apos;s needs
                  </span>
                </div>
                <div className="flex items-start space-x-3">
                  <Rocket className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-muted-foreground">
                    Continuous innovation in educational technology
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Values */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-foreground text-center mb-8">Our Values</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map((value, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <value.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">{value.title}</h3>
                      <p className="text-sm text-muted-foreground">{value.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Timeline */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-foreground text-center mb-8">Our Journey</h2>
          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-0.5 h-full w-0.5 bg-border"></div>
            <div className="space-y-8">
              {milestones.map((milestone, index) => (
                <div
                  key={index}
                  className={`flex items-center ${
                    index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'
                  }`}
                >
                  <div className={`flex-1 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8'}`}>
                    <Card className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-center space-x-2 mb-2">
                          <Badge variant="secondary">
                            {milestone.year} {milestone.quarter}
                          </Badge>
                        </div>
                        <h3 className="font-semibold text-foreground mb-2">{milestone.title}</h3>
                        <p className="text-sm text-muted-foreground">{milestone.description}</p>
                      </CardContent>
                    </Card>
                  </div>
                  <div className="flex-shrink-0 z-10">
                    <div className="h-4 w-4 rounded-full bg-primary border-4 border-background"></div>
                  </div>
                  <div className="flex-1"></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Leadership Team */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-foreground text-center mb-8">Leadership Team</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6 text-center">
                  <div className="w-24 h-24 rounded-full bg-primary/10 mx-auto mb-4 flex items-center justify-center">
                    <Users className="h-12 w-12 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-1">{member.name}</h3>
                  <p className="text-sm text-primary mb-3">{member.role}</p>
                  <p className="text-sm text-muted-foreground mb-4">{member.bio}</p>
                  <div className="flex justify-center space-x-3">
                    {member.linkedin && (
                      <a
                        href={member.linkedin}
                        className="text-muted-foreground hover:text-primary transition-colors"
                      >
                        <Linkedin className="h-4 w-4" />
                      </a>
                    )}
                    {member.twitter && (
                      <a
                        href={member.twitter}
                        className="text-muted-foreground hover:text-primary transition-colors"
                      >
                        <Twitter className="h-4 w-4" />
                      </a>
                    )}
                    {member.github && (
                      <a
                        href={member.github}
                        className="text-muted-foreground hover:text-primary transition-colors"
                      >
                        <Github className="h-4 w-4" />
                      </a>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Investors */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-foreground text-center mb-8">
            Backed by Leading Investors
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {investors.map((investor, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6 text-center">
                  <div className="h-16 w-full bg-muted rounded-lg flex items-center justify-center mb-3">
                    <span className="text-sm font-medium text-muted-foreground">
                      {investor.name}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">{investor.type}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="p-12">
              <Star className="h-12 w-12 text-primary mx-auto mb-6" />
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Ready to Transform Your Career?
              </h2>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Join thousands of professionals who are already using CertifAI to accelerate their
                certification journey and advance their careers in technology.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="rounded-lg">
                  Start Free Trial
                </Button>
                <Button variant="outline" size="lg" className="rounded-lg">
                  Schedule a Demo
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
