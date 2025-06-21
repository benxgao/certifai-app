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
  Globe,
  BookOpen,
  Zap,
  Shield,
  Brain,
  Rocket,
  Star,
} from 'lucide-react';

export default function AboutPage() {
  const milestones = [
    {
      year: '2025 Q2',
      title: 'Concept & Development',
      description:
        'Started as a personal project to explore how AI could revolutionize IT certification training.',
    },
    {
      year: '2025 Q3',
      title: 'Early Beta Release',
      description:
        'Launched initial version with AI-powered question generation and basic practice exam functionality.',
    },
    {
      year: 'Current',
      title: 'Community Building',
      description:
        'Actively gathering feedback from early users to improve the AI models and user experience.',
    },
  ];

  const stats = [
    { value: 'Solo', label: 'Developer Team', icon: Users },
    { value: 'AI-First', label: 'Approach', icon: Brain },
    { value: 'Beta', label: 'Stage', icon: Rocket },
    { value: 'Open', label: 'Community', icon: Heart },
  ];

  const values = [
    {
      icon: Brain,
      title: 'AI-Powered Innovation',
      description:
        'Leveraging artificial intelligence to create personalized and effective learning experiences.',
    },
    {
      icon: Users,
      title: 'User-Centric Development',
      description: 'Building features based on real user feedback and actual learning needs.',
    },
    {
      icon: Shield,
      title: 'Quality & Transparency',
      description:
        'Maintaining high standards while being open about the experimental nature of the project.',
    },
    {
      icon: Heart,
      title: 'Accessible Learning',
      description:
        'Making quality certification training available to anyone with an internet connection.',
    },
    {
      icon: Zap,
      title: 'Continuous Improvement',
      description: 'Constantly learning, iterating, and improving based on user experiences.',
    },
    {
      icon: Target,
      title: 'Practical Focus',
      description:
        'Focusing on what actually helps users pass certifications and advance their careers.',
    },
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
            A passion project by a solo developer exploring the intersection of AI and education.
            CertifAI is an experimental platform that combines artificial intelligence with IT
            certification training to create personalized learning experiences.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="rounded-lg">
              Try Beta Version
            </Button>
            <Button variant="outline" size="lg" className="rounded-lg">
              Share Feedback
            </Button>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
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
                To experiment with AI technology in education and create tools that make IT
                certification training more accessible and effective. This project explores how
                artificial intelligence can personalize learning experiences and help professionals
                achieve their certification goals more efficiently.
              </p>
              <div className="mt-6 space-y-3">
                <div className="flex items-start space-x-3">
                  <Zap className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-muted-foreground">
                    Experiment with AI-powered personalized learning
                  </span>
                </div>
                <div className="flex items-start space-x-3">
                  <BookOpen className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-muted-foreground">
                    Focus on core IT certifications for practical value
                  </span>
                </div>
                <div className="flex items-start space-x-3">
                  <Users className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-muted-foreground">
                    Build based on real user feedback and needs
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
                To create a valuable learning tool that demonstrates the potential of AI in
                education. While starting as a solo project, the vision is to build something that
                genuinely helps IT professionals succeed in their certification journey through
                innovative technology.
              </p>
              <div className="mt-6 space-y-3">
                <div className="flex items-start space-x-3">
                  <Globe className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-muted-foreground">
                    Accessible to learners everywhere through web technology
                  </span>
                </div>
                <div className="flex items-start space-x-3">
                  <Brain className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-muted-foreground">
                    AI that learns and improves from user interactions
                  </span>
                </div>
                <div className="flex items-start space-x-3">
                  <Rocket className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-muted-foreground">
                    Continuous experimentation with educational technology
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Values */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-foreground text-center mb-8">Core Principles</h2>
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
          <h2 className="text-3xl font-bold text-foreground text-center mb-8">
            Development Journey
          </h2>
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
                          <Badge variant="secondary">{milestone.year}</Badge>
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

        {/* Developer */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-foreground text-center mb-8">The Developer</h2>
          <div className="max-w-2xl mx-auto">
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-8 text-center">
                <div className="w-24 h-24 rounded-full bg-primary/10 mx-auto mb-6 flex items-center justify-center">
                  <Brain className="h-12 w-12 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Solo Developer</h3>
                <p className="text-primary mb-4">Founder & AI Enthusiast</p>
                <p className="text-muted-foreground leading-relaxed">
                  A passionate developer exploring the intersection of artificial intelligence and
                  education. Building CertifAI as an experiment to see how AI can make certification
                  training more effective and accessible. Open to collaboration and always learning
                  from the community.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="p-12">
              <Star className="h-12 w-12 text-primary mx-auto mb-6" />
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Join the AI Learning Experiment
              </h2>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Help shape the development of CertifAI by trying the beta version and sharing your
                feedback. Your input directly influences how the AI models learn and improve.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="rounded-lg">
                  Try Beta Version
                </Button>
                <Button variant="outline" size="lg" className="rounded-lg">
                  Share Feedback
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
