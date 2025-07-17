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
  Users,
  BookOpen,
  HeadphonesIcon,
  FileText,
  Newspaper,
  Sparkles,
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
        icon: Sparkles,
      };

    const path = window.location.pathname;
    const featureMap: Record<
      string,
      { feature: string; expectedDate: string; description: string; icon: any }
    > = {
      '/documentation': {
        feature: 'Documentation',
        expectedDate: 'Q3 2025',
        description: 'Comprehensive guides and tutorials to help you master IT certifications.',
        icon: FileText,
      },
      '/blog': {
        feature: 'Blog',
        expectedDate: 'Q4 2025',
        description:
          'Latest insights and success stories from the world of IT certification training.',
        icon: Newspaper,
      },
      '/study-guides': {
        feature: 'Study Guides',
        expectedDate: 'Q3 2025',
        description: 'Curated study materials and learning paths for all major IT certifications.',
        icon: BookOpen,
      },
      '/community': {
        feature: 'Discussion Forum',
        expectedDate: 'Q4 2025',
        description: 'Share knowledge and get answers to your certification questions.',
        icon: Users,
      },
      '/support': {
        feature: 'Support Center',
        expectedDate: 'Q3 2025',
        description: 'Comprehensive help center with FAQs and customer support.',
        icon: HeadphonesIcon,
      },
    };

    return (
      featureMap[path] || {
        feature: 'New Feature',
        expectedDate: 'Q3 2025',
        description: "We're working hard to bring you something amazing!",
        icon: Sparkles,
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
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setIsSubmitting(false);
    setIsSubscribed(true);

    // Reset after 3 seconds
    setTimeout(() => {
      setEmail('');
      setIsSubscribed(false);
    }, 3000);
  };

  const IconComponent = featureInfo.icon;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <LandingHeader />

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16">
        {/* Back Button */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
        </div>

        {/* Main Content Container */}
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                <IconComponent className="h-8 w-8 text-primary" />
              </div>
            </div>

            <Badge variant="secondary" className="mb-4">
              <Clock className="h-3 w-3 mr-1" />
              Coming {featureInfo.expectedDate}
            </Badge>

            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              {featureInfo.feature} is Coming Soon
            </h1>

            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {featureInfo.description}
            </p>
          </div>

          {/* Email Subscription */}
          <div className="max-w-md mx-auto mb-16">
            <Card className="border-0 shadow-lg">
              <CardHeader className="text-center pb-4">
                <CardTitle className="flex items-center justify-center space-x-2 text-lg">
                  <Bell className="h-5 w-5 text-primary" />
                  <span>Get Notified</span>
                </CardTitle>
                <CardDescription className="text-sm">
                  Be the first to know when it launches
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                {isSubscribed ? (
                  <div className="text-center py-6">
                    <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-3" />
                    <p className="font-medium text-foreground mb-1">You&apos;re on the list!</p>
                    <p className="text-sm text-muted-foreground">
                      We&apos;ll notify you when it&apos;s ready.
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
                      <Button type="submit" disabled={isSubmitting} size="default">
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

          {/* Alternative Actions */}
          <div className="text-center">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-8">
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  Ready to Start Learning?
                </h3>
                <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
                  While you wait, explore our current features and start practicing with
                  AI-generated questions to advance your career.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link href="/signup">
                    <Button size="lg" className="w-full sm:w-auto">
                      Start Free Trial
                    </Button>
                  </Link>
                  <Link href="/contact">
                    <Button variant="outline" size="lg" className="w-full sm:w-auto">
                      Contact Us
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
