import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import LandingHeader from '@/src/components/custom/LandingHeader';

export const metadata: Metadata = {
  title: 'Terms of Service | CertifAI',
  description:
    "Read CertifAI's Terms of Service. Understand your rights and responsibilities when using our AI-powered IT certification training platform.",
  robots: 'index, follow',
};

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <LandingHeader showFeaturesLink={false} />

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Page Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4">
              Terms of Service
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              Last updated: June 18, 2025
            </p>
          </div>

          {/* Content */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-8 lg:p-12">
            <div className="prose prose-slate dark:prose-invert max-w-none">
              {/* Acceptance of Terms */}
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-4">
                  1. Acceptance of Terms
                </h2>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                  These Terms of Service (&quot;Terms&quot;) constitute a legally binding agreement
                  between you (&quot;User,&quot; &quot;you,&quot; or &quot;your&quot;) and CertifAI
                  Limited, a company incorporated in New Zealand (&quot;CertifAI,&quot;
                  &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;). By accessing or using the
                  CertifAI platform, you acknowledge that you have read, understood, and agree to be
                  bound by these Terms.
                </p>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                  <strong>
                    IF YOU DO NOT AGREE TO THESE TERMS, YOU MUST NOT ACCESS OR USE THE PLATFORM.
                  </strong>{' '}
                  Your continued use of the platform constitutes acceptance of any modifications to
                  these Terms.
                </p>
              </section>

              {/* Definitions */}
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-4">
                  2. Definitions
                </h2>
                <ul className="list-disc pl-6 text-slate-700 dark:text-slate-300 space-y-2">
                  <li>
                    <strong>&quot;Platform&quot;</strong> means the CertifAI website, applications,
                    and related services
                  </li>
                  <li>
                    <strong>&quot;Content&quot;</strong> means all information, data, text,
                    software, music, sound, photographs, graphics, video, messages, or other
                    materials
                  </li>
                  <li>
                    <strong>&quot;User Content&quot;</strong> means any Content that you submit,
                    post, or transmit through the Platform
                  </li>
                  <li>
                    <strong>&quot;Services&quot;</strong> means all services provided by CertifAI
                    including AI-powered exam generation, performance analytics, and study
                    recommendations
                  </li>
                  <li>
                    <strong>&quot;Beta Version&quot;</strong> refers to the current pre-release
                    version of the Platform which may contain bugs or incomplete features
                  </li>
                </ul>
              </section>

              {/* Beta Platform Disclaimer */}
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-4">
                  3. Beta Platform Disclaimer
                </h2>
                <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-6 mb-4">
                  <p className="text-amber-800 dark:text-amber-200 font-semibold mb-2">
                    ⚠️ Important Beta Notice
                  </p>
                  <p className="text-amber-700 dark:text-amber-300 text-sm">
                    CertifAI is currently in beta testing. The Platform may contain bugs, errors, or
                    incomplete features.
                  </p>
                </div>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                  You acknowledge and agree that:
                </p>
                <ul className="list-disc pl-6 text-slate-700 dark:text-slate-300 space-y-2">
                  <li>
                    The Platform is provided on an &quot;as-is&quot; basis for testing and feedback
                    purposes
                  </li>
                  <li>Features may be incomplete, unstable, or subject to change without notice</li>
                  <li>You use the beta Platform at your own risk and discretion</li>
                  <li>
                    We may suspend, modify, or discontinue any aspect of the Platform during beta
                    testing
                  </li>
                  <li>Your feedback and usage data may be used to improve the Platform</li>
                </ul>
              </section>

              {/* Account Registration and Eligibility */}
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-4">
                  4. Account Registration and Eligibility
                </h2>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                  To access certain features of the Platform, you must create an account. You
                  represent and warrant that:
                </p>
                <ul className="list-disc pl-6 text-slate-700 dark:text-slate-300 space-y-2 mb-4">
                  <li>
                    You are at least 18 years old or have reached the age of majority in your
                    jurisdiction
                  </li>
                  <li>You have the legal capacity to enter into these Terms</li>
                  <li>All information you provide is accurate, current, and complete</li>
                  <li>You will maintain the accuracy of your account information</li>
                  <li>
                    You are responsible for maintaining the confidentiality of your account
                    credentials
                  </li>
                </ul>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                  You are solely responsible for all activities that occur under your account. You
                  must immediately notify us of any unauthorized use of your account or any other
                  breach of security.
                </p>
              </section>

              {/* Permitted Use */}
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-4">
                  5. Permitted Use
                </h2>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                  Subject to these Terms, we grant you a limited, non-exclusive, non-transferable,
                  revocable license to:
                </p>
                <ul className="list-disc pl-6 text-slate-700 dark:text-slate-300 space-y-2 mb-4">
                  <li>
                    Access and use the Platform for your personal, non-commercial educational
                    purposes
                  </li>
                  <li>Download and use our mobile applications on devices you own or control</li>
                  <li>
                    Use our AI-generated practice exams and study materials for certification
                    preparation
                  </li>
                </ul>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                  This license does not include any right to: (a) resell or make commercial use of
                  the Platform; (b) distribute, publicly perform, or publicly display any Platform
                  content; (c) modify or otherwise make derivative works of the Platform; or (d) use
                  any data mining, robots, or similar data gathering methods.
                </p>
              </section>

              {/* Prohibited Conduct */}
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-4">
                  6. Prohibited Conduct
                </h2>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                  You agree not to:
                </p>
                <ul className="list-disc pl-6 text-slate-700 dark:text-slate-300 space-y-2">
                  <li>Violate any applicable laws, regulations, or third-party rights</li>
                  <li>Use the Platform for any fraudulent, illegal, or unauthorized purpose</li>
                  <li>
                    Attempt to gain unauthorized access to the Platform or its related systems
                  </li>
                  <li>Reverse engineer, decompile, or disassemble any aspect of the Platform</li>
                  <li>Distribute malware, viruses, or other harmful code</li>
                  <li>Harass, abuse, or harm other users or our staff</li>
                  <li>Share, sell, or distribute your account credentials or exam content</li>
                  <li>Use automated systems (bots, scripts) to access the Platform</li>
                  <li>Interfere with or disrupt the Platform&apos;s operation or servers</li>
                  <li>Create multiple accounts to circumvent limitations or restrictions</li>
                  <li>
                    Use the Platform to prepare for exams in violation of certification body
                    policies
                  </li>
                </ul>
              </section>

              {/* AI Services and Accuracy Disclaimer */}
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-4">
                  7. AI Services and Accuracy Disclaimer
                </h2>
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 mb-4">
                  <p className="text-red-800 dark:text-red-200 font-semibold mb-2">
                    🤖 AI Content Disclaimer
                  </p>
                  <p className="text-red-700 dark:text-red-300 text-sm">
                    Our AI-generated content is for educational purposes only and may contain errors
                    or inaccuracies.
                  </p>
                </div>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                  You acknowledge and agree that:
                </p>
                <ul className="list-disc pl-6 text-slate-700 dark:text-slate-300 space-y-2">
                  <li>
                    AI-generated exam questions and explanations may contain errors, inaccuracies,
                    or outdated information
                  </li>
                  <li>
                    The Platform is a study aid only and does not guarantee certification success
                  </li>
                  <li>You should verify all information with official certification materials</li>
                  <li>
                    We make no representations about the accuracy, completeness, or currency of
                    AI-generated content
                  </li>
                  <li>
                    Official certification bodies are not affiliated with or responsible for our
                    Platform
                  </li>
                  <li>Our performance predictions and recommendations are estimates only</li>
                </ul>
              </section>

              {/* Intellectual Property Rights */}
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-4">
                  8. Intellectual Property Rights
                </h2>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                  The Platform and its original content, features, and functionality are owned by
                  CertifAI and are protected by international copyright, trademark, patent, trade
                  secret, and other intellectual property laws.
                </p>
                <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-3">
                  Our Content
                </h3>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                  All content on the Platform, including but not limited to text, graphics, logos,
                  images, audio clips, digital downloads, and software, is our property or the
                  property of our licensors and is protected by copyright and other intellectual
                  property laws.
                </p>
                <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-3">
                  User Content License
                </h3>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                  By submitting User Content, you grant us a worldwide, non-exclusive, royalty-free,
                  transferable license to use, reproduce, distribute, prepare derivative works of,
                  display, and perform your User Content in connection with the Platform and our
                  business operations.
                </p>

                <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-3">
                  User Content Responsibilities and Warranties
                </h3>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                  By submitting User Content, you represent and warrant that:
                </p>
                <ul className="list-disc pl-6 text-slate-700 dark:text-slate-300 space-y-2 mb-4">
                  <li>You own or have the necessary rights to submit the User Content</li>
                  <li>
                    Your User Content does not infringe any third-party intellectual property rights
                  </li>
                  <li>
                    Your User Content does not contain defamatory, offensive, or illegal material
                  </li>
                  <li>Your User Content does not violate any applicable laws or regulations</li>
                  <li>
                    You have obtained all necessary consents for any personal information included
                  </li>
                </ul>

                <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-3">
                  Content Monitoring and Removal Rights
                </h3>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                  We reserve the right, but have no obligation, to:
                </p>
                <ul className="list-disc pl-6 text-slate-700 dark:text-slate-300 space-y-2 mb-4">
                  <li>Monitor, review, or moderate User Content</li>
                  <li>Remove or refuse to display User Content at our sole discretion</li>
                  <li>Suspend or terminate accounts that violate our content policies</li>
                  <li>Cooperate with law enforcement regarding illegal content</li>
                  <li>Use automated systems to detect prohibited content</li>
                </ul>

                <div className="bg-orange-50 dark:bg-orange-900/20 p-6 rounded-lg">
                  <h4 className="font-semibold text-orange-900 dark:text-orange-100 mb-2">
                    Content Disclaimer
                  </h4>
                  <p className="text-orange-800 dark:text-orange-200 text-sm">
                    We do not endorse, guarantee, or assume responsibility for any User Content.
                    Users are solely responsible for their content and its compliance with
                    applicable laws.
                  </p>
                </div>
              </section>

              {/* Privacy and Data Protection */}
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-4">
                  9. Privacy and Data Protection
                </h2>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                  Your privacy is important to us. Our collection and use of personal information is
                  governed by our{' '}
                  <Link href="/privacy" className="text-primary hover:underline">
                    Privacy Policy
                  </Link>
                  , which is incorporated into these Terms by reference.
                </p>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                  By using the Platform, you consent to the collection, use, and disclosure of your
                  information as described in our Privacy Policy. You acknowledge that the Platform
                  may store and process your data outside of New Zealand.
                </p>
              </section>

              {/* Payment Terms */}
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-4">
                  10. Payment Terms
                </h2>
                <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-3">
                  Beta Pricing
                </h3>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                  During the beta period, we may offer free or discounted access to the Platform.
                  These promotional terms may change as we transition from beta to full release.
                </p>
                <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-3">
                  Subscription Terms
                </h3>
                <ul className="list-disc pl-6 text-slate-700 dark:text-slate-300 space-y-2 mb-4">
                  <li>
                    Subscription fees are charged in advance and are non-refundable except as
                    required by law
                  </li>
                  <li>
                    Subscriptions automatically renew unless cancelled before the renewal date
                  </li>
                  <li>Price changes will be communicated at least 30 days in advance</li>
                  <li>All prices include applicable taxes unless otherwise stated</li>
                </ul>
                <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-3">
                  Refunds and Cancellation
                </h3>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                  You may cancel your subscription at any time. Refunds are provided only as
                  required under New Zealand consumer protection laws or at our sole discretion.
                  During the beta period, we may offer more flexible refund terms.
                </p>
              </section>

              {/* Disclaimers and Limitation of Liability */}
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-4">
                  11. Disclaimers and Limitation of Liability
                </h2>
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 mb-4">
                  <p className="text-red-800 dark:text-red-200 font-semibold mb-2">
                    ⚠️ Important Legal Notice
                  </p>
                  <p className="text-red-700 dark:text-red-300 text-sm">
                    This section limits our liability to the maximum extent permitted under New
                    Zealand law.
                  </p>
                </div>

                <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-3">
                  Platform Disclaimers
                </h3>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                  TO THE MAXIMUM EXTENT PERMITTED BY NEW ZEALAND LAW:
                </p>
                <ul className="list-disc pl-6 text-slate-700 dark:text-slate-300 space-y-2 mb-6">
                  <li>
                    THE PLATFORM IS PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; WITHOUT
                    ANY WARRANTIES
                  </li>
                  <li>
                    WE DISCLAIM ALL WARRANTIES, EXPRESS OR IMPLIED, INCLUDING MERCHANTABILITY,
                    FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT
                  </li>
                  <li>
                    WE DO NOT WARRANT THAT THE PLATFORM WILL BE UNINTERRUPTED, ERROR-FREE, OR SECURE
                  </li>
                  <li>WE DO NOT GUARANTEE THE ACCURACY OR COMPLETENESS OF ANY CONTENT</li>
                  <li>
                    WE DO NOT WARRANT THAT USE OF THE PLATFORM WILL RESULT IN CERTIFICATION SUCCESS
                  </li>
                </ul>

                <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-3">
                  Limitation of Liability
                </h3>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                  TO THE MAXIMUM EXTENT PERMITTED BY NEW ZEALAND LAW, IN NO EVENT SHALL CERTIFAI BE
                  LIABLE FOR:
                </p>
                <ul className="list-disc pl-6 text-slate-700 dark:text-slate-300 space-y-2 mb-6">
                  <li>ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES</li>
                  <li>ANY LOSS OF PROFITS, REVENUE, DATA, OR BUSINESS OPPORTUNITIES</li>
                  <li>ANY FAILURE TO PASS CERTIFICATION EXAMS</li>
                  <li>ANY ERRORS OR INACCURACIES IN AI-GENERATED CONTENT</li>
                  <li>ANY UNAUTHORIZED ACCESS TO OR ALTERATION OF YOUR DATA</li>
                  <li>ANY DAMAGES RESULTING FROM YOUR USE OR INABILITY TO USE THE PLATFORM</li>
                </ul>

                <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                  OUR TOTAL LIABILITY TO YOU FOR ALL CLAIMS ARISING FROM OR RELATING TO THESE TERMS
                  OR THE PLATFORM SHALL NOT EXCEED THE GREATER OF:
                </p>
                <ul className="list-disc pl-6 text-slate-700 dark:text-slate-300 space-y-2 mb-4">
                  <li>NZD $100; OR</li>
                  <li>THE TOTAL AMOUNT YOU PAID TO US IN THE 12 MONTHS PRECEDING THE CLAIM</li>
                </ul>

                <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-3">
                  Consumer Guarantees Act Exception
                </h3>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                  If you are a consumer under the New Zealand Consumer Guarantees Act 1993, some of
                  the above limitations may not apply to you. Nothing in these Terms limits or
                  excludes any guarantee, warranty, or liability that cannot be limited or excluded
                  under New Zealand law.
                </p>
              </section>

              {/* Indemnification */}
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-4">
                  12. Indemnification
                </h2>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                  You agree to indemnify, defend, and hold harmless CertifAI, its officers,
                  directors, employees, agents, and affiliates from and against any and all claims,
                  damages, obligations, losses, liabilities, costs, or debt, and expenses (including
                  attorney&apos;s fees) arising from:
                </p>
                <ul className="list-disc pl-6 text-slate-700 dark:text-slate-300 space-y-2">
                  <li>Your use of the Platform</li>
                  <li>Your violation of these Terms</li>
                  <li>Your violation of any third-party rights</li>
                  <li>Any User Content you submit or transmit</li>
                  <li>Your negligent or wrongful conduct</li>
                </ul>
              </section>

              {/* Termination */}
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-4">
                  13. Termination
                </h2>
                <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-3">
                  Termination by You
                </h3>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                  You may terminate your account at any time by following the cancellation process
                  in your account settings or contacting our support team.
                </p>
                <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-3">
                  Termination by CertifAI
                </h3>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                  We may suspend or terminate your access to the Platform immediately, without prior
                  notice, if:
                </p>
                <ul className="list-disc pl-6 text-slate-700 dark:text-slate-300 space-y-2 mb-4">
                  <li>You breach these Terms</li>
                  <li>
                    We reasonably believe termination is necessary to protect us or other users
                  </li>
                  <li>Required by law or at the request of law enforcement</li>
                  <li>The Platform is discontinued (with reasonable notice during beta)</li>
                </ul>
                <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-3">
                  Effect of Termination
                </h3>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                  Upon termination, your right to use the Platform will cease immediately. We may
                  delete your account and all associated data. Provisions that by their nature
                  should survive termination shall survive, including ownership provisions, warranty
                  disclaimers, and limitations of liability.
                </p>
              </section>

              {/* Governing Law and Jurisdiction */}
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-4">
                  14. Governing Law and Jurisdiction
                </h2>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                  These Terms are governed by and construed in accordance with the laws of New
                  Zealand, without regard to conflict of law principles.
                </p>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                  Any disputes arising under these Terms shall be subject to the exclusive
                  jurisdiction of the New Zealand courts. You consent to the personal jurisdiction
                  of such courts and waive any objection to venue.
                </p>
                <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-3">
                  Dispute Resolution
                </h3>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                  Before initiating formal legal proceedings, you agree to attempt to resolve any
                  dispute through good faith negotiations with us for at least 30 days. If you are a
                  consumer, this does not affect your rights under the Disputes Tribunals Act 1988.
                </p>
              </section>

              {/* Force Majeure */}
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-4">
                  15. Force Majeure
                </h2>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                  We shall not be liable for any failure or delay in performance under these Terms
                  which is due to circumstances beyond our reasonable control, including but not
                  limited to acts of God, natural disasters, war, terrorism, pandemic, government
                  actions, internet service provider failures, or power outages.
                </p>
              </section>

              {/* Changes to Terms */}
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-4">
                  16. Changes to Terms
                </h2>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                  We reserve the right to modify these Terms at any time. We will notify you of
                  material changes by:
                </p>
                <ul className="list-disc pl-6 text-slate-700 dark:text-slate-300 space-y-2 mb-4">
                  <li>Posting the updated Terms on the Platform</li>
                  <li>Sending email notification to registered users</li>
                  <li>Displaying a prominent notice on the Platform</li>
                </ul>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                  Changes will become effective 30 days after notification, except for changes
                  required by law which may be effective immediately. Your continued use of the
                  Platform after the effective date constitutes acceptance of the modified Terms.
                </p>
              </section>

              {/* International Customer Rights */}
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-4">
                  17. International Customer Rights and Compliance
                </h2>

                <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg mb-6">
                  <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
                    Cross-Border Service Commitment
                  </h3>
                  <p className="text-blue-800 dark:text-blue-200 text-sm">
                    While these Terms are governed by New Zealand law, we recognize that our
                    international customers may have additional rights under their local consumer
                    protection and privacy laws. Where your local laws provide stronger protections,
                    we will endeavor to comply with the higher standard.
                  </p>
                </div>

                <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-4">
                  Consumer Protection Rights
                </h3>
                <div className="mb-6">
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                    Depending on your jurisdiction, you may have additional consumer protection
                    rights that cannot be waived or limited by these Terms:
                  </p>

                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-slate-800 dark:text-slate-200 mb-2">
                        European Union
                      </h4>
                      <ul className="list-disc pl-6 text-slate-700 dark:text-slate-300 space-y-1 text-sm">
                        <li>Right to withdraw from distance contracts within 14 days</li>
                        <li>Statutory warranties and guarantees that cannot be excluded</li>
                        <li>
                          Protection against unfair contract terms under EU Directive 93/13/EEC
                        </li>
                        <li>
                          Right to dispute resolution through EU Online Dispute Resolution platform
                        </li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold text-slate-800 dark:text-slate-200 mb-2">
                        Australia
                      </h4>
                      <ul className="list-disc pl-6 text-slate-700 dark:text-slate-300 space-y-1 text-sm">
                        <li>Consumer guarantees under the Australian Consumer Law</li>
                        <li>Protection against unfair contract terms</li>
                        <li>Right to remedies that cannot be excluded or limited</li>
                        <li>Access to Australian Consumer Law remedies and dispute resolution</li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold text-slate-800 dark:text-slate-200 mb-2">
                        United Kingdom
                      </h4>
                      <ul className="list-disc pl-6 text-slate-700 dark:text-slate-300 space-y-1 text-sm">
                        <li>Consumer Rights Act 2015 protections</li>
                        <li>Right to cancel distance contracts within 14 days</li>
                        <li>Protection against unfair terms in consumer contracts</li>
                        <li>Access to UK dispute resolution mechanisms</li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold text-slate-800 dark:text-slate-200 mb-2">
                        Canada
                      </h4>
                      <ul className="list-disc pl-6 text-slate-700 dark:text-slate-300 space-y-1 text-sm">
                        <li>Provincial consumer protection legislation</li>
                        <li>Protection against unconscionable terms</li>
                        <li>Statutory cooling-off periods where applicable</li>
                        <li>Access to provincial consumer protection agencies</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-4">
                  Limitation of Liability - International Considerations
                </h3>
                <div className="mb-6">
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                    Our limitation of liability clauses (Section 10) are subject to the following
                    international considerations:
                  </p>
                  <ul className="list-disc pl-6 text-slate-700 dark:text-slate-300 space-y-2">
                    <li>
                      <strong>Non-excludable Rights:</strong> Nothing in these Terms excludes,
                      restricts, or modifies any consumer guarantee, warranty, or other right that
                      cannot be excluded under your local law
                    </li>
                    <li>
                      <strong>Proportionate Remedies:</strong> Where local law requires
                      proportionate remedies, our liability will be the greater of the remedy under
                      these Terms or the minimum required by local law
                    </li>
                    <li>
                      <strong>Death/Personal Injury:</strong> We do not exclude liability for death
                      or personal injury caused by our negligence in any jurisdiction
                    </li>
                    <li>
                      <strong>Fraud/Willful Misconduct:</strong> We do not exclude liability for
                      fraud, willful misconduct, or gross negligence in any jurisdiction
                    </li>
                  </ul>
                </div>

                <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-4">
                  Dispute Resolution for International Customers
                </h3>
                <div className="mb-6">
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                    While Section 13 specifies New Zealand courts and arbitration, international
                    customers may also have access to:
                  </p>
                  <ul className="list-disc pl-6 text-slate-700 dark:text-slate-300 space-y-2">
                    <li>Local consumer protection agencies and ombudsman services</li>
                    <li>EU Online Dispute Resolution platform (for EU residents)</li>
                    <li>Local small claims courts for qualifying disputes</li>
                    <li>Alternative dispute resolution services in your jurisdiction</li>
                  </ul>
                </div>

                <div className="bg-amber-50 dark:bg-amber-900/20 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-amber-900 dark:text-amber-100 mb-2">
                    How to Exercise International Rights
                  </h3>
                  <p className="text-amber-800 dark:text-amber-200 text-sm mb-3">
                    If you believe you have rights under your local consumer protection or privacy
                    laws that are not adequately addressed in these Terms:
                  </p>
                  <ol className="list-decimal pl-6 text-amber-800 dark:text-amber-200 text-sm space-y-1">
                    <li>
                      Contact our legal team at legal@certifai.com with &quot;International
                      Rights&quot; in the subject line
                    </li>
                    <li>
                      Specify your country/jurisdiction and the specific rights you wish to exercise
                    </li>
                    <li>Provide relevant documentation of the applicable local law</li>
                    <li>
                      We will work with you in good faith to accommodate your rights where legally
                      required
                    </li>
                  </ol>
                </div>
              </section>

              {/* Severability */}
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-4">
                  18. Severability
                </h2>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                  If any provision of these Terms is held to be invalid, illegal, or unenforceable,
                  the validity, legality, and enforceability of the remaining provisions shall not
                  be affected or impaired.
                </p>
              </section>

              {/* Entire Agreement */}
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-4">
                  19. Entire Agreement
                </h2>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                  These Terms, together with our Privacy Policy and any other legal notices
                  published by us, constitute the entire agreement between you and CertifAI
                  regarding the Platform and supersede all prior agreements and understandings.
                </p>
              </section>

              {/* Contact Information */}
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-4">
                  20. Contact Information
                </h2>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                  If you have any questions about these Terms, please contact us:
                </p>
                <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-6 border border-slate-200 dark:border-slate-600">
                  <div className="space-y-2 text-slate-700 dark:text-slate-300">
                    <p>
                      <strong>CertifAI Limited</strong>
                    </p>
                    <p>
                      <strong>Email:</strong> legal@certifai.com
                    </p>
                    <p>
                      <strong>Support:</strong>{' '}
                      <Link href="/support" className="text-primary hover:underline">
                        support.certifai.com
                      </Link>
                    </p>
                    <p>
                      <strong>Business Hours:</strong> Monday-Friday, 9:00 AM - 5:00 PM NZST
                    </p>
                    <p>
                      <strong>Response Time:</strong> We aim to respond to legal inquiries within 5
                      business days
                    </p>
                  </div>
                </div>
              </section>

              {/* Effective Date */}
              <div className="bg-slate-100 dark:bg-slate-700 rounded-lg p-6 border border-slate-200 dark:border-slate-600 text-center">
                <p className="text-slate-600 dark:text-slate-400 text-sm">
                  These Terms of Service are effective as of June 18, 2025, and apply to all users
                  of the CertifAI platform.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
