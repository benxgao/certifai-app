'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { Textarea } from '@/src/components/ui/textarea';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/src/components/ui/card';
import { Mail, MessageSquare, Phone, MapPin, Send, CheckCircle } from 'lucide-react';
import LandingHeader from '@/src/components/custom/LandingHeader';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsSubmitting(false);
    setIsSubmitted(true);

    // Reset form after successful submission
    setTimeout(() => {
      setFormData({ name: '', email: '', subject: '', message: '' });
      setIsSubmitted(false);
    }, 3000);
  };

  const contactInfo = [
    {
      icon: Mail,
      title: 'Email Me Directly',
      content: 'contact@certestic.com',
      description:
        "The best way to reach me! I usually reply within a day (sometimes sooner if I'm having a coding session)",
    },
    {
      icon: MessageSquare,
      title: 'Join Our Beta Community',
      content: 'Community Discord',
      description:
        'Hang out with other beta testers, share ideas, and get help from fellow learners',
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
      content: 'Remote & Proud',
      description: 'Working from my home office, building something I believe in',
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
        "I'm starting with AWS basics since that's what I know best. As the community grows and I get feedback, I'll add more. What certification are YOU working on? Let me know!",
    },
    {
      question: 'How much does this cost?',
      answer:
        'Right now? Absolutely nothing! The beta is completely free because I want to focus on making it genuinely helpful before worrying about money. Future pricing will be fair and community-informed.',
    },
    {
      question: 'Can I help make this better somehow?',
      answer:
        "YES! Please! Use the beta, tell me what works and what doesn't, spread the word if you like it, or even contribute code if you're technical. Every bit of help means the world to me!",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <LandingHeader showFeaturesLink={false} />

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Hero Section */}
        <div className="text-center mb-12 sm:mb-16">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4 sm:mb-6">
            {"Let's Chat! 💬"}
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto">
            Got questions about Certestic? Found a bug? Have an idea that could make things better?
            Or just want to say hi? {"I'd"} genuinely love to hear from you! Every message helps me
            understand what you need and how I can improve.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 sm:gap-12">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Drop Me a Line 📝</CardTitle>
                <CardDescription>
                  {"Whether it's"} feedback, a bug report, a feature idea, or just to say hello - I
                  read every message!
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isSubmitted ? (
                  <div className="text-center py-8">
                    <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-foreground mb-2">
                      Got Your Message! 🎉
                    </h3>
                    <p className="text-muted-foreground">
                      Thanks for reaching out! {"I'll"} get back to you within a day or two. In the
                      meantime, feel free to explore more of what {"we're"} building!
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="name"
                          className="block text-sm font-medium text-foreground mb-2"
                        >
                          Full Name *
                        </label>
                        <Input
                          id="name"
                          name="name"
                          type="text"
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="What should I call you?"
                          required
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="email"
                          className="block text-sm font-medium text-foreground mb-2"
                        >
                          Email Address *
                        </label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="your.email@example.com"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="subject"
                        className="block text-sm font-medium text-foreground mb-2"
                      >
                        Subject *
                      </label>
                      <Input
                        id="subject"
                        name="subject"
                        type="text"
                        value={formData.subject}
                        onChange={handleInputChange}
                        placeholder="What's on your mind?"
                        required
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="message"
                        className="block text-sm font-medium text-foreground mb-2"
                      >
                        Message *
                      </label>
                      <Textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        placeholder="Tell me what you're thinking... I read every word! 😊"
                        rows={6}
                        required
                      />
                    </div>

                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                          Sending Your Message...
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4 mr-2" />
                          Send My Message ✉️
                        </>
                      )}
                    </Button>
                  </form>
                )}
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
              Jump into our Discord community where you can chat with other beta testers and get
              help in real-time! Or browse through our documentation if you prefer to figure things
              out yourself. And hey, if you catch me online during <strong>NZDT 8pm-10pm</strong>,
              {"I'm"} usually up for a quick chat!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/community">
                <Button variant="outline" size="lg">
                  Join Our Discord Family
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
