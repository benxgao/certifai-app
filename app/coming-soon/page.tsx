'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/src/components/ui/card';
import { Badge } from '@/src/components/ui/badge';
import {
  Clock,
  Bell,
  Mail,
  ArrowLeft,
  CheckCircle,
  Rocket,
  Calendar,
  Users,
  BookOpen,
  HeadphonesIcon,
  FileText,
  Newspaper,
  Brain,
} from 'lucide-react';
import LandingHeader from '@/src/components/custom/LandingHeader';

export default function ComingSoonPage() {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get feature info based on current path
  const getFeatureInfo = () => {
    if (typeof window === 'undefined')
      return {
        feature: 'New Feature',
        expectedDate: 'Q3 2025',
        description: "We're working hard to bring you something amazing!",
        icon: Rocket,
      };

    const path = window.location.pathname;
    const featureMap: Record<
      string,
      { feature: string; expectedDate: string; description: string; icon: any }
    > = {
      '/documentation': {
        feature: 'Documentation',
        expectedDate: 'Q3 2025',
        description:
          'Comprehensive guides, API references, and tutorials to help you master Certestic.',
        icon: FileText,
      },
      '/blog': {
        feature: 'Blog',
        expectedDate: 'Q4 2025',
        description:
          'Latest insights, tips, and success stories from the world of IT certification training.',
        icon: Newspaper,
      },
      '/study-guides': {
        feature: 'Study Guides',
        expectedDate: 'Q3 2025',
        description: 'Curated study materials and learning paths for all major IT certifications.',
        icon: BookOpen,
      },
      '/community': {
        feature: 'Community',
        expectedDate: 'Q4 2025',
        description:
          'Connect with fellow learners, share experiences, and get support from our community.',
        icon: Users,
      },
      '/support': {
        feature: 'Support Center',
        expectedDate: 'Q3 2025',
        description: 'Comprehensive help center with FAQs, tutorials, and customer support tools.',
        icon: HeadphonesIcon,
      },
    };

    return (
      featureMap[path] || {
        feature: 'New Feature',
        expectedDate: 'Q3 2025',
        description: "We're working hard to bring you something amazing!",
        icon: Rocket,
      }
    );
  };

  const [featureInfo, setFeatureInfo] = useState(getFeatureInfo());

  useEffect(() => {
    setFeatureInfo(getFeatureInfo());
  }, []);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    setIsSubscribed(true);

    // Reset after 3 seconds
    setTimeout(() => {
      setEmail('');
      setIsSubscribed(false);
    }, 3000);
  };

  const upcomingFeatures = [
    {
      title: 'AI-Powered Study Plans',
      description: 'Personalized learning paths based on your goals and progress',
      status: 'In Development',
      eta: 'Q3 2025',
      icon: Brain,
    },
    {
      title: 'Live Practice Sessions',
      description: 'Interactive group study sessions with expert instructors',
      status: 'Planning',
      eta: 'Q4 2025',
      icon: Users,
    },
    {
      title: 'Mobile App',
      description: 'Practice on-the-go with our native mobile applications',
      status: 'Design Phase',
      eta: 'Q1 2026',
      icon: Rocket,
    },
    {
      title: 'Certification Tracking',
      description: 'Track your certification progress and renewal dates',
      status: 'In Development',
      eta: 'Q3 2025',
      icon: Calendar,
    },
  ];

  const IconComponent = featureInfo.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <LandingHeader showFeaturesLink={false} />

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Button */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
        </div>

        {/* Hero Section */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <div className="mb-6">
            <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <IconComponent className="h-10 w-10 text-primary" />
            </div>
            <Badge variant="secondary" className="mb-4">
              <Clock className="h-3 w-3 mr-1" />
              Coming {featureInfo.expectedDate}
            </Badge>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            {featureInfo.feature} is Coming Soon
          </h1>

          <p className="text-xl text-muted-foreground mb-8">{featureInfo.description}</p>

          <p className="text-muted-foreground mb-8">
            We&apos;re putting the finishing touches on this exciting new feature. Be the first to
            know when it&apos;s ready!
          </p>
        </div>

        {/* Email Subscription */}
        <div className="max-w-md mx-auto mb-16">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center space-x-2">
                <Bell className="h-5 w-5 text-primary" />
                <span>Get Notified</span>
              </CardTitle>
              <CardDescription>
                Enter your email to be notified when {featureInfo.feature.toLowerCase()} launches
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isSubscribed ? (
                <div className="text-center py-4">
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-3" />
                  <p className="font-medium text-foreground mb-1">You&apos;re on the list!</p>
                  <p className="text-sm text-muted-foreground">
                    We&apos;ll notify you when {featureInfo.feature.toLowerCase()} is ready.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleEmailSubmit} className="space-y-4">
                  <div className="flex space-x-2">
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="flex-1"
                    />
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                      ) : (
                        <Mail className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground text-center">
                    No spam, unsubscribe at any time.
                  </p>
                </form>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Upcoming Features */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-foreground text-center mb-8">
            What&apos;s Coming Next
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {upcomingFeatures.map((feature, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <feature.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-foreground">{feature.title}</h3>
                        <Badge
                          variant={feature.status === 'In Development' ? 'default' : 'secondary'}
                          className="text-xs"
                        >
                          {feature.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{feature.description}</p>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3 mr-1" />
                        Expected: {feature.eta}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Alternative Actions */}
        <div className="text-center">
          <Card className="max-w-2xl mx-auto">
            <CardContent className="p-8">
              <h3 className="text-xl font-bold text-foreground mb-4">Ready to Start Learning?</h3>
              <p className="text-muted-foreground mb-6">
                While you wait for {featureInfo.feature.toLowerCase()}, explore our current features
                and start practicing with AI-generated questions today.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/signup">
                  <Button size="lg" className="rounded-lg">
                    Start Free Trial
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button variant="outline" size="lg" className="rounded-lg">
                    Contact Us
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
