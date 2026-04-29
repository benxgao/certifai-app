'use client';

import React from 'react';
import Link from 'next/link';
import LandingHeader from '@/src/components/custom/LandingHeader';
import Breadcrumb from '@/src/components/custom/Breadcrumb';
import { ActionButton } from '@/src/components/custom/ActionButton';
import { Mail, BookOpen, MessageCircle, HelpCircle, Users } from 'lucide-react';

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
    <div className="min-h-screen bg-slate-50 dark:bg-linear-to-br dark:from-slate-900 dark:to-slate-800 overflow-x-hidden">
      <LandingHeader />

      <main className="relative" role="main">
        {/* Hero Section */}
        <section className="relative py-8 sm:py-12 lg:py-16 overflow-hidden" role="banner">
          <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
            <Breadcrumb
              items={[
                { label: 'Home', href: '/' },
                { label: 'Contact', current: true },
              ]}
              className="mb-8 sm:mb-12"
            />

            {/* Hero Content - Centered */}
            <div className="text-center max-w-4xl mx-auto space-y-6 sm:space-y-8">
              <div className="inline-flex items-center gap-2 bg-violet-100 dark:bg-violet-900/30 border border-violet-200 dark:border-violet-800/50 text-violet-700 dark:text-violet-300 px-4 py-2 rounded-full text-xs sm:text-sm font-medium">
                <MessageCircle className="w-4 h-4" />
                <span>We&apos;d love to hear from you</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
                <span className="bg-linear-to-r from-violet-600 to-blue-600 bg-clip-text text-transparent">
                  Get in Touch
                </span>
              </h1>

              <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed font-light">
                Have questions, feedback, or ideas? Every message helps us improve and build a better learning experience.
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
                  className="w-full sm:w-auto"
                >
                  Send us an Email
                </ActionButton>
                <ActionButton
                  variant="outline"
                  size="lg"
                  onClick={() => (window.location.href = '/documentation')}
                  icon={<BookOpen className="h-5 w-5" />}
                  className="w-full sm:w-auto"
                >
                  Browse Documentation
                </ActionButton>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Methods Section */}
        <section className="relative py-16 sm:py-24 bg-slate-50/50 dark:bg-slate-800/30 overflow-hidden">
          <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-20">
                <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-slate-100 mb-6 leading-tight">
                  Contact Methods
                </h2>
                <p className="text-base sm:text-lg lg:text-xl leading-relaxed text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
                  Choose the best way to reach us and we&apos;ll get back to you as soon as possible
                </p>
              </div>

              <div className="grid gap-8 md:grid-cols-2 max-w-4xl mx-auto">
                {contactMethods.map((method, index) => (
                  <div
                    key={index}
                    className="group relative bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border border-slate-200/60 dark:border-slate-700/60 shadow-md rounded-3xl p-8 hover:shadow-md hover:border-slate-300/60 dark:hover:border-slate-600/60 transition-colors duration-300 flex flex-col h-full overflow-hidden"
                  >
                    <div className="relative z-10 text-center flex flex-col h-full">
                      <div
                        className={`h-14 w-14 bg-linear-to-br ${
                          method.primary
                            ? 'from-violet-100 to-violet-200 dark:from-violet-900/40 dark:to-violet-800/40'
                            : 'from-blue-100 to-blue-200 dark:from-blue-900/40 dark:to-blue-800/40'
                        } rounded-lg flex items-center justify-center mx-auto mb-6 shadow-sm`}
                      >
                        <method.icon
                          className={`h-7 w-7 ${
                            method.primary
                              ? 'text-violet-500 dark:text-violet-300'
                              : 'text-blue-500 dark:text-blue-300'
                          }`}
                        />
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 dark:text-slate-50 mb-3 tracking-tight">
                        {method.title}
                      </h3>
                      <p className="text-base leading-relaxed text-slate-600 dark:text-slate-400 mb-6 flex-grow">
                        {method.description}
                      </p>
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
        <section className="relative py-16 sm:py-24 overflow-hidden">
          <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-20">
                <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-slate-100 mb-6 leading-tight">
                  Frequently Asked Questions
                </h2>
                <p className="text-base sm:text-lg lg:text-xl leading-relaxed text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
                  Quick answers to common questions about Certestic
                </p>
              </div>

              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {faqs.map((faq, index) => (
                  <div
                    key={index}
                    className="group relative bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border border-slate-200/60 dark:border-slate-700/60 shadow-md rounded-3xl p-8 hover:shadow-md hover:border-slate-300/60 dark:hover:border-slate-600/60 transition-colors duration-300 flex flex-col h-full overflow-hidden"
                  >
                    <div className="relative z-10">
                      <div className="h-12 w-12 bg-linear-to-br from-violet-100 to-violet-200 dark:from-violet-900/40 dark:to-violet-800/40 rounded-lg flex items-center justify-center mb-6 shadow-sm">
                        <faq.icon className="h-6 w-6 text-violet-500 dark:text-violet-300" />
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-slate-50 mb-3 tracking-tight">
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

        {/* Call to Action Section */}
        <section className="relative py-16 sm:py-24 bg-linear-to-br from-violet-50/90 to-blue-50/70 dark:from-violet-900/30 dark:to-blue-900/20 overflow-hidden">
          <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <div className="group relative bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-violet-200/60 dark:border-violet-700/50 shadow-lg rounded-3xl p-8 sm:p-12 hover:shadow-lg transition-all duration-300 overflow-hidden">
                <div className="relative z-10 text-center">
                  <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-slate-900 dark:text-slate-100 tracking-tight">
                    Ready to connect?
                  </h2>
                  <p className="text-base sm:text-lg leading-relaxed text-slate-600 dark:text-slate-400 mb-8 max-w-2xl mx-auto">
                    Whether you have feedback, found a bug, or want to share your certification journey—we&apos;re here to help.
                  </p>
                  <ActionButton
                    variant="primary"
                    size="lg"
                    onClick={() =>
                      window.open(
                        'mailto:info@certestic.com?subject=Hello%20from%20Certestic%20user',
                        '_blank',
                      )
                    }
                    icon={<Mail className="h-5 w-5" />}
                    className="px-8 py-4"
                  >
                    Send us a Message
                  </ActionButton>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
