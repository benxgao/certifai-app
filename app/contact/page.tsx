'use client';

import React from 'react';
import Link from 'next/link';
import { Badge } from '@/src/components/ui/badge';
import LandingHeader from '@/src/components/custom/LandingHeader';
import { ActionButton } from '@/src/components/custom/ActionButton';
import { Mail, BookOpen, MessageCircle, Heart, HelpCircle, Users } from 'lucide-react';

export default function ContactPage() {
  // Simplified FAQ data
  const faqs = [
    {
      question: 'What is Certestic?',
      answer:
        'An AI-powered certification training platform that adapts to your learning style and performance.',
      icon: HelpCircle,
    },
    {
      question: 'Which certifications are available?',
      answer:
        'We continuously add new certifications based on user demand, focusing on major cloud providers and IT fundamentals.',
      icon: BookOpen,
    },
    {
      question: 'How can I help improve the platform?',
      answer:
        'Share feedback, report bugs, suggest features, or spread the word. Every input helps us improve!',
      icon: Users,
    },
  ];

  // Contact methods
  const contactMethods = [
    {
      title: 'Email Support',
      description: 'Get personalized help and share feedback',
      email: 'info@certestic.com',
      icon: Mail,
      primary: true,
    },
    {
      title: 'General Inquiries',
      description: 'Questions about features or partnerships',
      email: 'info@certestic.com',
      icon: MessageCircle,
      primary: false,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 overflow-x-hidden">
      <LandingHeader />

      <main className="relative pt-16" role="main">
        {/* Hero Section */}
        <section className="relative overflow-hidden" role="banner">
          {/* Background decorative elements */}
          <div className="absolute inset-0 bg-gradient-to-br from-violet-50/50 via-transparent to-blue-50/30 dark:from-violet-900/10 dark:via-transparent dark:to-blue-900/10"></div>
          <div className="absolute top-20 right-2 sm:right-10 w-48 sm:w-72 h-48 sm:h-72 bg-violet-200/20 dark:bg-violet-600/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-2 sm:left-10 w-64 sm:w-96 h-64 sm:h-96 bg-blue-200/20 dark:bg-blue-600/10 rounded-full blur-3xl"></div>

          <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-24 lg:pt-28 pb-16 sm:pb-20 lg:pb-24">
            <div className="text-center max-w-5xl mx-auto">
              <Badge
                variant="secondary"
                className="mb-8 bg-violet-100 dark:bg-violet-900/30 border border-violet-200 dark:border-violet-800/50 text-violet-700 dark:text-violet-300 px-4 py-2 rounded-full"
              >
                <MessageCircle className="h-4 w-4 mr-2 text-violet-600 dark:text-violet-400" />
                We&apos;d love to hear from you
              </Badge>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold mb-8 tracking-tight">
                <span className="bg-gradient-to-r from-violet-600 to-blue-600 bg-clip-text text-transparent">
                  Get in Touch
                </span>
              </h1>

              <div className="max-w-4xl mx-auto mb-12 space-y-6">
                <p className="text-xl lg:text-2xl leading-relaxed font-light text-slate-700 dark:text-slate-200">
                  Have questions, feedback, or ideas? We&apos;d love to hear from you.
                </p>
                <p className="text-base sm:text-lg leading-relaxed text-slate-600 dark:text-slate-400">
                  Every message helps us improve and build a better learning experience.
                </p>
              </div>
            </div>
          </div>
        </section>
        {/* Contact Methods */}
        <section className="relative py-16 sm:py-20 lg:py-24 overflow-hidden">
          <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-4xl lg:text-5xl font-bold mb-4 text-slate-900 dark:text-slate-100 tracking-tight">
                  Contact Methods
                </h2>
                <p className="text-base sm:text-lg lg:text-xl leading-relaxed text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
                  Choose the best way to reach us
                </p>
              </div>
              <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                {contactMethods.map((method, index) => (
                  <div
                    key={index}
                    className={`group relative bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border border-slate-200/60 dark:border-slate-700/60 shadow-xl rounded-3xl p-8 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 hover:scale-105 flex flex-col h-full overflow-hidden ${
                      method.primary
                        ? 'hover:border-violet-300/60 dark:hover:border-violet-700/60'
                        : 'hover:border-blue-300/60 dark:hover:border-blue-700/60'
                    }`}
                  >
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${
                        method.primary ? 'from-violet-50/20' : 'from-blue-50/20'
                      } to-transparent dark:from-violet-900/10 dark:to-transparent rounded-3xl`}
                    ></div>
                    <div className="relative z-10 text-center">
                      <div
                        className={`h-16 w-16 bg-gradient-to-br ${
                          method.primary
                            ? 'from-violet-100 to-violet-200 dark:from-violet-900/30 dark:to-violet-800/30'
                            : 'from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30'
                        } rounded-xl flex items-center justify-center mx-auto mb-6 shadow-sm`}
                      >
                        <method.icon
                          className={`h-8 w-8 ${
                            method.primary
                              ? 'text-violet-600 dark:text-violet-400'
                              : 'text-blue-600 dark:text-blue-400'
                          }`}
                        />
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 dark:text-slate-50 mb-4 tracking-tight">
                        {method.title}
                      </h3>
                      <p className="text-base leading-relaxed text-slate-600 dark:text-slate-400 mb-6">
                        {method.description}
                      </p>
                      <div className="bg-slate-50/50 dark:bg-slate-900/30 rounded-lg p-4 mb-6">
                        <p className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">
                          {method.email}
                        </p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          Click to open your email client
                        </p>
                      </div>
                      <ActionButton
                        variant={method.primary ? 'primary' : 'secondary'}
                        size="lg"
                        onClick={() =>
                          window.open(
                            `mailto:${method.email}?subject=Hello from Certestic user`,
                            '_blank',
                          )
                        }
                        icon={<Mail className="h-5 w-5" />}
                        className="w-full"
                      >
                        Send Email
                      </ActionButton>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="relative py-16 sm:py-20 lg:py-24 overflow-hidden">
          <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-4xl lg:text-5xl font-bold mb-4 text-slate-900 dark:text-slate-100 tracking-tight">
                  Frequently Asked Questions
                </h2>
                <p className="text-base sm:text-lg lg:text-xl leading-relaxed text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
                  Quick answers to common questions
                </p>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {faqs.map((faq, index) => (
                  <div
                    key={index}
                    className="group relative bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border border-slate-200/60 dark:border-slate-700/60 shadow-xl rounded-3xl p-8 hover:shadow-2xl hover:border-violet-300/60 dark:hover:border-violet-700/60 transition-all duration-500 transform hover:-translate-y-3 hover:scale-105 flex flex-col h-full overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-violet-50/20 to-transparent dark:from-violet-900/10 dark:to-transparent rounded-3xl"></div>
                    <div className="relative z-10">
                      <div className="h-12 w-12 bg-gradient-to-br from-violet-100 to-violet-200 dark:from-violet-900/30 dark:to-violet-800/30 rounded-xl flex items-center justify-center mb-6 shadow-sm">
                        <faq.icon className="h-6 w-6 text-violet-600 dark:text-violet-400" />
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-slate-50 mb-4 tracking-tight">
                        {faq.question}
                      </h3>
                      <p className="text-base leading-relaxed text-slate-600 dark:text-slate-400">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="relative py-16 sm:py-20 lg:py-24 overflow-hidden">
          <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
              <div className="group relative bg-gradient-to-br from-violet-50/90 to-blue-50/70 dark:from-violet-900/30 dark:to-blue-900/20 border border-violet-200/60 dark:border-violet-700/50 shadow-xl rounded-3xl p-8 sm:p-16 hover:shadow-2xl transition-all duration-500 overflow-hidden">
                {/* Decorative background pattern */}
                <div className="absolute inset-0 bg-gradient-to-br from-violet-50/30 to-blue-50/20 dark:from-violet-900/10 dark:to-blue-900/5 rounded-3xl"></div>
                <div className="absolute top-0 right-0 w-40 h-40 bg-violet-200/15 dark:bg-violet-600/8 rounded-full blur-2xl"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-200/15 dark:bg-blue-600/8 rounded-full blur-2xl"></div>

                <div className="relative z-10 text-center">
                  <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-slate-900 dark:text-slate-100 tracking-tight">
                    Still Have Questions?
                  </h2>
                  <p className="text-base sm:text-lg lg:text-xl leading-relaxed text-slate-600 dark:text-slate-400 mb-12 max-w-3xl mx-auto">
                    Whether you have feedback, found a bug, or just want to share your certification
                    journey - we&apos;re here to help.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <ActionButton
                      variant="primary"
                      size="lg"
                      onClick={() =>
                        window.open(
                          'mailto:info@certestic.com?subject=Hello from Certestic user',
                          '_blank',
                        )
                      }
                      icon={<Mail className="h-5 w-5" />}
                      className="px-8 py-4"
                    >
                      Send us an Email
                    </ActionButton>
                    <ActionButton
                      variant="outline"
                      size="lg"
                      onClick={() => window.open('/documentation', '_blank')}
                      icon={<BookOpen className="h-5 w-5" />}
                      className="px-8 py-4"
                    >
                      Browse Documentation
                    </ActionButton>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
