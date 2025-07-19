'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/src/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/src/components/ui/card';
import { Mail, BookOpen } from 'lucide-react';
import LandingHeader from '@/src/components/custom/LandingHeader';

export default function ContactPage() {
  const faqs = [
    {
      question: 'What is Certestic exactly?',
      answer:
        'Certestic is my personal project to help people prepare for IT certifications using AI. I built it because I wanted to create smarter, more personalized study tools than what was available.',
    },
    {
      question: 'Which certifications can I study for?',
      answer:
        "I'm continuously adding new certifications based on user feedback and demand. Currently focusing on major cloud providers and IT fundamentals. What certification are you working on? Let me know!",
    },
    {
      question: 'Is this free to use?',
      answer:
        'Yes! This is currently a passion project and I want to keep core features accessible. As the platform grows, I may introduce premium features, but the goal is to keep it affordable and valuable.',
    },
    {
      question: 'How can I help improve Certestic?',
      answer:
        "I'd love your help! Use the platform, share feedback, report bugs, suggest features, or spread the word. Every bit of input helps me understand what to build next and how to make it better.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <LandingHeader />

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Hero Section */}
        <div className="text-center mb-12 sm:mb-16">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4 sm:mb-6">
            Get in Touch
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto">
            Have questions about Certestic? Found a bug? Have feedback or ideas? I&apos;d love to
            hear from you! Drop me an email and I&apos;ll get back to you soon.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Direct Email Contact */}
          <div className="mb-12">
            <Card>
              <CardHeader className="text-center px-8">
                <CardTitle className="text-2xl flex items-center justify-center gap-2">
                  <Mail className="h-6 w-6" />
                  Send Me an Email
                </CardTitle>
                <CardDescription>
                  The best way to reach me! I read every email personally.
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center py-8 px-8">
                <div className="mb-6">
                  <div className="h-16 w-16 rounded-full bg-gradient-to-r from-violet-600 to-blue-600 flex items-center justify-center mx-auto mb-4">
                    <Mail className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">Direct Email</h3>
                  <p className="text-muted-foreground mb-4">
                    Whether it&apos;s feedback, a bug report, feature ideas, or just to say hello -
                    I genuinely read and respond to every message!
                  </p>
                </div>

                <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 mb-6">
                  <p className="text-lg font-semibold text-primary mb-2">info@certestic.com</p>
                  <p className="text-sm text-muted-foreground">
                    Copy the email above or click the button below to open your email client
                  </p>
                </div>

                <Button
                  asChild
                  className="w-full sm:w-auto bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-700 hover:to-blue-700"
                >
                  <a href="mailto:info@certestic.com?subject=Hello from Certestic user">
                    <Mail className="h-4 w-4 mr-2" />
                    Open Email Client
                  </a>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* FAQ */}
          <div className="mb-16">
            <Card>
              <CardHeader className="pb-8">
                <CardTitle>Frequently Asked Questions</CardTitle>
                <CardDescription>Quick answers to common questions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 px-8 pb-8">
                {faqs.map((faq, index) => (
                  <div
                    key={index}
                    className="border-b border-border last:border-b-0 pb-6 last:pb-0"
                  >
                    <h4 className="font-semibold text-foreground text-sm mb-3">{faq.question}</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">{faq.answer}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Bottom CTA Section */}
        <div className="mt-10">
          <div className="max-w-4xl mx-auto">
            <div className="bg-card border rounded-xl p-12 text-center">
              <h2 className="text-2xl font-bold text-foreground mb-8">
                Questions? Ideas? Just Want to Chat?
              </h2>
              <p className="text-muted-foreground mb-10 leading-relaxed max-w-2xl mx-auto">
                I&apos;m always happy to hear from users! Whether you&apos;ve found a bug, have a
                feature request, or just want to share your certification journey - drop me a line
                at <strong className="text-primary">info@certestic.com</strong>.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Button
                  asChild
                  size="lg"
                  className="bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-700 hover:to-blue-700"
                >
                  <a href="mailto:info@certestic.com">
                    <Mail className="mr-2 h-4 w-4" />
                    Send me an Email
                  </a>
                </Button>
                <Link href="/documentation">
                  <Button variant="outline" size="lg">
                    <BookOpen className="mr-2 h-4 w-4" />
                    Browse Documentation
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
