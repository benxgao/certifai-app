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
import { Mail, MessageSquare, Phone, MapPin } from 'lucide-react';
import LandingHeader from '@/src/components/custom/LandingHeader';

export default function ContactPage() {
  const contactInfo = [
    {
      icon: Mail,
      title: 'Email Me Directly',
      content: 'info@certestic.com',
      description:
        "The best way to reach me! I usually reply within a day (sometimes sooner if I'm having a coding session)",
    },
    {
      icon: MessageSquare,
      title: 'Beta User Community',
      content: 'Community Discord',
      description: 'Chat with other beta testers, share experiences, and help each other out',
    },
    {
      icon: Phone,
      title: 'Catch Me Online',
      content: 'NZDT 8pm-10pm',
      description:
        "When I'm usually online and available for real-time chat (between work and sleep!)",
    },
    {
      icon: MapPin,
      title: 'Built From Home',
      content: 'Remote Development',
      description: 'Working from my home office, one feature at a time',
    },
  ];

  const faqs = [
    {
      question: 'So... is this actually a real company?',
      answer:
        "Great question! Right now it's just me in my home office building something I believe in. I'm treating it seriously, but I'm honest about it being a one-person passion project that might grow into something bigger.",
    },
    {
      question: 'Which certifications can I study for?',
      answer:
        "I'm starting with AWS basics since that's what I know best. As I get more feedback and understand what users need most, I'll add more. What certification are YOU working on? Let me know!",
    },
    {
      question: 'How much does this cost?',
      answer:
        'Right now? Absolutely nothing! The beta is completely free because I want to focus on making it genuinely helpful before worrying about money. Future pricing will be fair and user-informed.',
    },
    {
      question: 'Can I help make this better somehow?',
      answer:
        "YES! Please! Use the beta, tell me what works and what doesn't, spread the word if you like it, or even contribute code if you're technical. Every bit of feedback helps me understand what to build next!",
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
            {"Let's Chat! 💬"}
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto">
            Got questions about Certestic? Found a bug? Have an idea that could make things better?
            Or just want to say hi? {"I'd"} genuinely love to hear from you! Drop me an email and
            I&apos;ll get back to you within a day.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 sm:gap-12">
          {/* Email Contact Section */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Send Me an Email �</CardTitle>
                <CardDescription>
                  The best way to reach me! I read every email and usually reply within a day.
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center py-8">
                <div className="mb-6">
                  <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Mail className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    Direct Email Contact
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Whether it&apos;s feedback, a bug report, a feature idea, or just to say hello -
                    I genuinely read every message!
                  </p>
                </div>

                <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 mb-6">
                  <p className="text-lg font-semibold text-primary mb-2">info@certestic.com</p>
                  <p className="text-sm text-muted-foreground">
                    Copy the email above or click the button below to open your email client
                  </p>
                </div>

                <Button asChild className="w-full">
                  <a href="mailto:info@certestic.com?subject=Hello from Certestic user">
                    <Mail className="h-4 w-4 mr-2" />
                    Open Email Client 📬
                  </a>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Contact Information & FAQ */}
          <div className="space-y-8">
            {/* Contact Info */}
            <Card>
              <CardHeader>
                <CardTitle>Ways to Reach Me 📞</CardTitle>
                <CardDescription>Pick whatever works best for you!</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {contactInfo.map((item, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <item.icon className="h-5 w-5 text-primary" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">{item.title}</h3>
                      <p className="text-sm font-medium text-primary">{item.content}</p>
                      <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Quick FAQ */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Answers 🤔</CardTitle>
                <CardDescription>The questions I get asked most often</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {faqs.map((faq, index) => (
                  <div
                    key={index}
                    className="border-b border-border last:border-b-0 pb-4 last:pb-0"
                  >
                    <h4 className="font-semibold text-foreground text-sm mb-2">{faq.question}</h4>
                    <p className="text-sm text-muted-foreground">{faq.answer}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Support Section */}
        <div className="mt-16 text-center">
          <div className="bg-card border rounded-xl p-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">Need Help Right Now? 🚀</h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              For the fastest response, send me an email at <strong>info@certestic.com</strong> - I
              usually reply within a day! You can also jump into the Discord to chat with other beta
              testers, or browse through the documentation if you prefer to figure things out
              yourself.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg">
                <a href="mailto:info@certestic.com">
                  <Mail className="mr-2 h-4 w-4" />
                  Email Me Directly
                </a>
              </Button>
              <Link href="/community">
                <Button variant="outline" size="lg">
                  Join the Discord
                </Button>
              </Link>
              <Link href="/documentation">
                <Button variant="outline" size="lg">
                  Browse the Docs
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
