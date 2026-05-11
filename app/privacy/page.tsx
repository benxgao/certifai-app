import React from 'react';
import { Metadata } from 'next';
import LandingHeader from '@/src/components/custom/LandingHeader';

export const metadata: Metadata = {
  title: 'Privacy Policy | Certestic',
  description:
    'Learn how Certestic collects, uses, and protects your personal information. Our comprehensive privacy policy explains your rights and our data practices.',
  robots: 'index, follow',
};

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <LandingHeader />

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Page Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4">
              Privacy Policy
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400">Last updated: May 11, 2026</p>
          </div>

          {/* Content */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-8 lg:p-12">
            <div className="prose prose-slate dark:prose-invert max-w-none">
              {/* Introduction */}
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-4">
                  Introduction
                </h2>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                  Certestic (&quot;the platform&quot;) is an AI-powered IT certification training
                  platform. This Privacy Policy explains how we collect, use, and protect your
                  personal information when you use our services.
                </p>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                  <strong>Your Rights:</strong> You have rights regarding your personal information,
                  including the right to access, correct, and request deletion of your information.
                  We comply with these rights as required by law.
                </p>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                  By using Certestic, you agree to the collection, use, and disclosure of your
                  personal information as described in this policy. If you do not agree, please do
                  not use this platform.
                </p>
              </section>

              {/* Legal Basis and Purpose */}
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-4">
                  Why We Collect Your Information
                </h2>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                  We collect and process your personal information for these purposes:
                </p>
                <ul className="list-disc pl-6 text-slate-700 dark:text-slate-300 space-y-2 mb-4">
                  <li>
                    <strong>Platform Operation:</strong> To provide you with access to the
                    certification training platform and its features
                  </li>
                  <li>
                    <strong>User Experience:</strong> To personalize your learning experience and
                    track your progress
                  </li>
                  <li>
                    <strong>Platform Improvement:</strong> To understand how the platform is used
                    and improve its functionality
                  </li>
                  <li>
                    <strong>Communication:</strong> To send you essential service-related
                    communications
                  </li>
                  <li>
                    <strong>Legal Requirements:</strong> To comply with applicable laws when
                    required
                  </li>
                </ul>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                  We aim to collect only information that is necessary for these purposes.
                </p>
              </section>

              {/* Information We Collect */}
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-4">
                  Information We Collect
                </h2>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                  We collect the following types of personal information to operate this platform:
                </p>

                <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-3">
                  Information You Provide
                </h3>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                  When you register or use the platform:
                </p>
                <ul className="list-disc pl-6 text-slate-700 dark:text-slate-300 space-y-2 mb-6">
                  <li>
                    <strong>Identity Information:</strong> Full name, email address, username
                  </li>
                  <li>
                    <strong>Account Information:</strong> Password (encrypted), profile preferences,
                    account settings
                  </li>
                  <li>
                    <strong>Payment Information:</strong> Credit card details, billing address,
                    payment history (processed securely through third-party payment processors)
                  </li>
                  <li>
                    <strong>Communication Data:</strong> Messages sent to our support team,
                    feedback, survey responses
                  </li>
                  <li>
                    <strong>Professional Information:</strong> Certification goals, professional
                    background (optional)
                  </li>
                </ul>

                <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-3">
                  Public Free Trials and Marketing Pages
                </h3>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                  When you access a public free trial, promotional landing page, or other marketing
                  page that offers a trial experience, we may collect the information you choose to
                  provide in order to deliver that experience, communicate with you about the trial,
                  and prevent abuse or misuse of the service. Depending on the specific trial flow,
                  we may ask for an email address, or allow access without requiring one if the
                  trial is designed to be anonymous or low-friction.
                </p>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                  If an email address is requested, we will clearly indicate whether it is required
                  or optional at the point of collection. Even when no email address is provided, we
                  may still collect limited technical information such as IP address, browser type,
                  and device information to operate the trial, protect our services, and improve our
                  products.
                </p>

                <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-3">
                  Information Collected Automatically
                </h3>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                  When you use our platform, we automatically collect:
                </p>
                <ul className="list-disc pl-6 text-slate-700 dark:text-slate-300 space-y-2 mb-6">
                  <li>
                    <strong>Usage Data:</strong> Pages visited, features used, time spent on
                    platform, click patterns
                  </li>
                  <li>
                    <strong>Performance Data:</strong> Exam attempts, scores, completion rates,
                    study progress, learning analytics
                  </li>
                  <li>
                    <strong>Technical Data:</strong> IP address, browser type, device information,
                    operating system, screen resolution
                  </li>
                  <li>
                    <strong>Log Data:</strong> Access times, error logs, system activity, security
                    events
                  </li>
                  <li>
                    <strong>Location Data:</strong> General geographic location based on IP address
                    (country/city level only)
                  </li>
                </ul>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                  This automatic collection also applies when you visit our marketing pages or use a
                  public trial experience, where we may use the information to measure traffic,
                  improve product quality, detect suspicious activity, and maintain service
                  reliability.
                </p>

                <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-3">
                  AI Training and Analytics Data
                </h3>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                  To provide AI-powered features, we collect and process:
                </p>
                <ul className="list-disc pl-6 text-slate-700 dark:text-slate-300 space-y-2 mb-6">
                  <li>
                    <strong>Learning Patterns:</strong> How you interact with questions, answer
                    patterns, study behaviors
                  </li>
                  <li>
                    <strong>Performance Metrics:</strong> Response times, accuracy rates,
                    improvement trends
                  </li>
                  <li>
                    <strong>Content Interactions:</strong> Which topics you focus on, difficulty
                    preferences, study session data
                  </li>
                </ul>

                <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-3">
                  Information We Do NOT Collect
                </h3>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                  We do not:
                </p>
                <ul className="list-disc pl-6 text-slate-700 dark:text-slate-300 space-y-2">
                  <li>
                    Collect sensitive personal information (health, political opinions, religious
                    beliefs) unless specifically relevant and consented to
                  </li>
                  <li>Collect information about you from third parties without your knowledge</li>
                  <li>Use hidden tracking or surveillance methods</li>
                  <li>Collect more information than necessary for our stated purposes</li>
                </ul>
              </section>

              {/* How We Use Your Information */}
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-4">
                  How We Use Your Personal Information
                </h2>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                  We use your personal information only for the purposes for which it was collected,
                  or for directly related purposes you would reasonably expect. Specifically:
                </p>

                <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-3">
                  Primary Service Purposes
                </h3>
                <ul className="list-disc pl-6 text-slate-700 dark:text-slate-300 space-y-2 mb-6">
                  <li>
                    <strong>Platform Operation:</strong> Providing access to our certification
                    training platform and maintaining your account
                  </li>
                  <li>
                    <strong>Public Trials and Marketing Pages:</strong> Operating free trials,
                    promotional experiences, and lead-capture flows where applicable
                  </li>
                  <li>
                    <strong>AI-Powered Features:</strong> Generating personalized practice exams,
                    study recommendations, and performance analytics
                  </li>
                  <li>
                    <strong>Progress Tracking:</strong> Monitoring your learning progress and
                    providing detailed performance insights
                  </li>
                  <li>
                    <strong>Content Delivery:</strong> Customizing your learning experience based on
                    your goals and preferences
                  </li>
                  <li>
                    <strong>Technical Support:</strong> Providing customer service and resolving
                    technical issues
                  </li>
                </ul>

                <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-3">
                  Administrative Purposes
                </h3>
                <ul className="list-disc pl-6 text-slate-700 dark:text-slate-300 space-y-2 mb-6">
                  <li>
                    <strong>Account Management:</strong> Processing registrations, managing
                    subscriptions, and handling payments
                  </li>
                  <li>
                    <strong>Communication:</strong> Sending service updates, technical notices, and
                    responding to inquiries
                  </li>
                  <li>
                    <strong>Platform Communications:</strong> Delivering essential platform updates,
                    feature announcements, security notifications, and service changes via our
                    marketing email service providers
                  </li>
                  <li>
                    <strong>Security:</strong> Detecting and preventing fraud, unauthorized access,
                    and security breaches
                  </li>
                  <li>
                    <strong>Legal Compliance:</strong> Meeting our legal obligations under New
                    Zealand law
                  </li>
                </ul>

                <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-6 mb-6">
                  <h4 className="text-amber-900 dark:text-amber-100 font-semibold mb-2">
                    📬 Platform Update Emails
                  </h4>
                  <p className="text-amber-800 dark:text-amber-200 text-sm mb-3">
                    We'll send you essential platform communications including:
                  </p>
                  <ul className="list-disc pl-6 text-amber-800 dark:text-amber-200 text-sm space-y-1">
                    <li>Critical security updates and notifications</li>
                    <li>New feature releases and platform improvements</li>
                    <li>Service maintenance schedules and downtime notices</li>
                    <li>Terms of service and privacy policy updates</li>
                    <li>Account status changes and billing notifications</li>
                    <li>Important certification and study-related announcements</li>
                  </ul>
                  <p className="text-amber-700 dark:text-amber-300 text-xs mt-3">
                    <strong>Note:</strong> You can unsubscribe from optional marketing content in
                    your account settings, but we cannot omit service-critical communications while
                    you maintain an active account.
                  </p>
                </div>

                <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-3">
                  Platform Improvement (With Your Consent)
                </h3>
                <ul className="list-disc pl-6 text-slate-700 dark:text-slate-300 space-y-2 mb-6">
                  <li>
                    <strong>Product Development:</strong> Analyzing usage patterns to improve our
                    platform and develop new features
                  </li>
                  <li>
                    <strong>AI Model Training:</strong> Using anonymized data to enhance our AI
                    algorithms and question generation
                  </li>
                  <li>
                    <strong>Research:</strong> Conducting internal research to better understand
                    learning patterns and certification success factors
                  </li>
                </ul>

                <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-3">
                  Marketing (With Express Consent Only)
                </h3>
                <ul className="list-disc pl-6 text-slate-700 dark:text-slate-300 space-y-2">
                  <li>
                    <strong>Promotional Communications:</strong> Sending information about new
                    features, courses, or promotions (only if you opt-in)
                  </li>
                  <li>
                    <strong>Surveys and Feedback:</strong> Requesting your input on our services and
                    user experience
                  </li>
                  <li>
                    <strong>Beta Testing:</strong> Inviting you to participate in testing new
                    features (voluntary participation only)
                  </li>
                </ul>
              </section>

              {/* Information Sharing and Disclosure */}
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-4">
                  Information Sharing and Disclosure
                </h2>
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6 mb-6">
                  <p className="text-green-800 dark:text-green-200 font-semibold mb-2">
                    Privacy Protection Commitment
                  </p>
                  <p className="text-green-700 dark:text-green-300 text-sm">
                    We do not sell, rent, or trade your personal information to third parties for
                    marketing purposes.
                  </p>
                </div>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                  We have strict limits on when and how we can disclose your personal information.
                  We may only share your information in the following circumstances:
                </p>

                <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-3">
                  Service Providers (Limited Purpose Disclosure)
                </h3>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                  We may share your information with trusted service providers who assist us in
                  operating our platform, subject to strict confidentiality agreements:
                </p>
                <ul className="list-disc pl-6 text-slate-700 dark:text-slate-300 space-y-2 mb-6">
                  <li>
                    <strong>Cloud Infrastructure:</strong> Google Cloud Platform and Firebase (data
                    stored in accordance with their privacy commitments)
                  </li>
                  <li>
                    <strong>Payment Processing:</strong> Secure payment processors for subscription
                    management (they do not store your full payment details)
                  </li>
                  <li>
                    <strong>Email Services:</strong> Email service providers for essential
                    communications only
                  </li>
                  <li>
                    <strong>Marketing Email Services:</strong> Third-party marketing email services
                    (such as MailerLite or similar providers) for delivering platform updates,
                    feature announcements, and service notifications
                  </li>
                  <li>
                    <strong>Analytics:</strong> Anonymized usage analytics to improve platform
                    performance
                  </li>
                </ul>

                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 mb-6">
                  <h4 className="text-blue-900 dark:text-blue-100 font-semibold mb-2">
                    📧 Marketing Email Service Notice
                  </h4>
                  <p className="text-blue-800 dark:text-blue-200 text-sm mb-3">
                    We use marketing email services to send important platform communications. By
                    creating an account, you consent to receiving these essential updates.
                  </p>
                  <p className="text-blue-700 dark:text-blue-300 text-sm mb-3">
                    <strong>Information Shared with Marketing Email Services:</strong>
                  </p>
                  <ul className="list-disc pl-6 text-blue-700 dark:text-blue-300 text-sm space-y-1">
                    <li>Your email address and name for delivery purposes</li>
                    <li>Basic account status (active/inactive) for list management</li>
                    <li>Subscription preferences and communication settings</li>
                    <li>
                      Anonymized engagement data (open rates, click rates) for service improvement
                    </li>
                  </ul>
                </div>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-6">
                  <strong>Service Provider Requirements:</strong> All service providers must:
                </p>
                <ul className="list-disc pl-6 text-slate-700 dark:text-slate-300 space-y-2 mb-6">
                  <li>Only use your information for the specific services they provide to us</li>
                  <li>Maintain appropriate security measures</li>
                  <li>Not disclose your information to other parties</li>
                  <li>Comply with applicable privacy laws</li>
                </ul>

                <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-3">
                  Legal Requirements
                </h3>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                  We may disclose your information when legally required:
                </p>
                <ul className="list-disc pl-6 text-slate-700 dark:text-slate-300 space-y-2 mb-6">
                  <li>
                    <strong>Court Orders:</strong> To comply with valid court orders or legal
                    processes
                  </li>
                  <li>
                    <strong>Safety Concerns:</strong> To prevent serious harm or illegal activity
                  </li>
                  <li>
                    <strong>Platform Security:</strong> To protect the security and operation of the
                    platform
                  </li>
                </ul>

                <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-3">
                  With Your Explicit Consent
                </h3>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                  We may share your information for other purposes only with your explicit, informed
                  consent. You can withdraw this consent at any time by contacting us.
                </p>

                <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-3 mt-6">
                  Cookie and Analytics Preferences
                </h3>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                  We use a cookie consent banner to ask for permission before loading Google
                  Analytics on marketing pages. Your choice is stored locally in your browser, and
                  you can update it at any time using the Cookie Preferences link in the footer.
                </p>
              </section>

              {/* Data Security */}
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-4">
                  Data Security
                </h2>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                  We implement technical and organizational security measures to protect your
                  personal information:
                </p>

                <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-3">
                  Security Measures
                </h3>
                <ul className="list-disc pl-6 text-slate-700 dark:text-slate-300 space-y-2 mb-6">
                  <li>
                    <strong>Encryption:</strong> HTTPS encryption for data transmission and
                    encryption for sensitive data at rest
                  </li>
                  <li>
                    <strong>Access Control:</strong> Authentication and authorization controls to
                    restrict access
                  </li>
                  <li>
                    <strong>Infrastructure Security:</strong> Security provided by Google Cloud
                    Platform and Firebase
                  </li>
                  <li>
                    <strong>Updates:</strong> Regular application of security patches and updates
                  </li>
                </ul>

                <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-3">
                  Breach Notification
                </h3>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                  If we become aware of a privacy breach, we will:
                </p>
                <ul className="list-disc pl-6 text-slate-700 dark:text-slate-300 space-y-2 mb-4">
                  <li>Notify affected users via email</li>
                  <li>Notify relevant authorities as required by law</li>
                  <li>Take steps to secure the platform and prevent further breaches</li>
                  <li>Provide available information about the incident</li>
                </ul>
              </section>

              {/* Data Retention */}
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-4">
                  Data Retention
                </h2>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                  We do not keep your personal information longer than necessary. Our retention
                  practices are:
                </p>

                <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-3">
                  Active Account Data
                </h3>
                <ul className="list-disc pl-6 text-slate-700 dark:text-slate-300 space-y-2 mb-6">
                  <li>
                    <strong>Account Information:</strong> Retained while your account is active and
                    for 12 months after account closure
                  </li>
                  <li>
                    <strong>Learning Progress:</strong> Retained for the duration of your account to
                    provide ongoing personalized recommendations
                  </li>
                  <li>
                    <strong>Usage Analytics:</strong> Retained in anonymized form for up to 5 years
                    for platform improvement
                  </li>
                </ul>

                <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-3">
                  Financial and Legal Records
                </h3>
                <ul className="list-disc pl-6 text-slate-700 dark:text-slate-300 space-y-2 mb-6">
                  <li>
                    <strong>Payment Information:</strong> Retained for 7 years as required by New
                    Zealand financial record-keeping laws
                  </li>
                  <li>
                    <strong>Tax Records:</strong> Retained for 7 years as required by the Income Tax
                    Act 2007
                  </li>
                  <li>
                    <strong>Legal Communications:</strong> Retained as long as necessary to defend
                    against legal claims
                  </li>
                </ul>

                <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-3">
                  Deletion Process
                </h3>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                  When retention periods expire or you request deletion:
                </p>
                <ul className="list-disc pl-6 text-slate-700 dark:text-slate-300 space-y-2">
                  <li>Personal information is securely deleted or anonymized</li>
                  <li>
                    Backups containing your information are automatically purged within 90 days
                  </li>
                  <li>
                    Some information may be retained in anonymized form for legitimate research
                    purposes
                  </li>
                  <li>
                    We maintain records of deletions for audit purposes (without storing the deleted
                    personal information)
                  </li>
                </ul>
              </section>

              {/* Your Privacy Rights */}
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-4">
                  Your Privacy Rights
                </h2>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-6">
                  You have important rights regarding your personal information. These rights may
                  vary depending on your jurisdiction, but generally include:
                </p>

                <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-3">
                  Right of Access
                </h3>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                  You have the right to request access to any personal information we hold about
                  you:
                </p>
                <ul className="list-disc pl-6 text-slate-700 dark:text-slate-300 space-y-2 mb-6">
                  <li>
                    <strong>What we will provide:</strong> A copy of your personal information in a
                    commonly used format
                  </li>
                  <li>
                    <strong>Response time:</strong> We will respond within 20 working days (as
                    required by law)
                  </li>
                  <li>
                    <strong>Cost:</strong> Access is free for the first request per year; reasonable
                    charges may apply for additional requests
                  </li>
                  <li>
                    <strong>Verification:</strong> We may need to verify your identity before
                    providing access
                  </li>
                  <li>
                    <strong>Limitations:</strong> We may refuse access only in specific
                    circumstances permitted by law (e.g., if it would harm another person&apos;s
                    privacy)
                  </li>
                </ul>

                <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-3">
                  Right of Correction
                </h3>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                  You have the right to request correction of any personal information that is
                  inaccurate, out of date, incomplete, irrelevant, or misleading:
                </p>
                <ul className="list-disc pl-6 text-slate-700 dark:text-slate-300 space-y-2 mb-6">
                  <li>
                    <strong>How to request:</strong> Contact us with details of the incorrect
                    information
                  </li>
                  <li>
                    <strong>Our response:</strong> We will correct the information or explain why we
                    believe it is accurate
                  </li>
                  <li>
                    <strong>Timeline:</strong> Corrections will be made within 20 working days
                  </li>
                  <li>
                    <strong>Third party notification:</strong> We will notify relevant third parties
                    of any corrections where appropriate
                  </li>
                </ul>

                <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-3">
                  Additional Rights
                </h3>
                <ul className="list-disc pl-6 text-slate-700 dark:text-slate-300 space-y-2 mb-6">
                  <li>
                    <strong>Data Portability:</strong> Request your personal information in a
                    portable format
                  </li>
                  <li>
                    <strong>Deletion:</strong> Request deletion of your personal information
                    (subject to legal retention requirements)
                  </li>
                  <li>
                    <strong>Restriction of Processing:</strong> Request that we limit how we use
                    your information
                  </li>
                  <li>
                    <strong>Objection:</strong> Object to certain uses of your personal information
                  </li>
                  <li>
                    <strong>Withdrawal of Consent:</strong> Withdraw consent for any processing
                    based on consent
                  </li>
                </ul>

                <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-3">
                  Marketing and Communication Choices
                </h3>
                <ul className="list-disc pl-6 text-slate-700 dark:text-slate-300 space-y-2 mb-6">
                  <li>
                    <strong>Opt-out:</strong> Unsubscribe from marketing emails using the link in
                    any email
                  </li>
                  <li>
                    <strong>Preferences:</strong> Update your communication preferences in your
                    account settings
                  </li>
                  <li>
                    <strong>Essential communications:</strong> Some service-related communications
                    cannot be opted out of while you have an active account
                  </li>
                </ul>

                <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-3">
                  How to Exercise Your Rights
                </h3>
                <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-6 border border-slate-200 dark:border-slate-600 mb-6">
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                    <strong>Contact our Privacy Officer:</strong>
                  </p>
                  <div className="space-y-2 text-slate-700 dark:text-slate-300">
                    <p>
                      <strong>Email:</strong> privacy@certestic.com
                    </p>
                    <p>
                      <strong>Subject Line:</strong> &quot;Privacy Rights Request - [Your Request
                      Type]&quot;
                    </p>
                    <p>
                      <strong>Include:</strong> Your full name, email address, and detailed
                      description of your request
                    </p>
                    <p>
                      <strong>Response Time:</strong> We will acknowledge your request within 5
                      working days and provide a full response within 20 working days
                    </p>
                  </div>
                </div>

                <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-3">
                  If You&apos;re Not Satisfied
                </h3>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                  If you&apos;re not satisfied with our response to your privacy request, you have
                  the right to:
                </p>
                <ul className="list-disc pl-6 text-slate-700 dark:text-slate-300 space-y-2">
                  <li>Contact our Privacy Officer to discuss your concerns</li>
                  <li>
                    Make a complaint to the relevant privacy regulator (for New Zealand users, the
                    Privacy Commissioner
                    <a href="https://privacy.org.nz" className="text-primary hover:underline">
                      privacy.org.nz
                    </a>
                    )
                  </li>
                  <li>Seek remedies through the Human Rights Review Tribunal</li>
                </ul>
              </section>

              {/* International Data Transfers */}
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-4">
                  International Data Transfers
                </h2>
                <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-6 mb-6">
                  <p className="text-amber-800 dark:text-amber-200 font-semibold mb-2">
                    🌐 Cross-Border Data Transfer Notice
                  </p>
                  <p className="text-amber-700 dark:text-amber-300 text-sm">
                    Some of your personal information may be stored or processed outside New
                    Zealand.
                  </p>
                </div>

                <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-3">
                  Where Your Data May Be Transferred
                </h3>
                <ul className="list-disc pl-6 text-slate-700 dark:text-slate-300 space-y-2 mb-6">
                  <li>
                    <strong>Google Cloud Platform:</strong> Data centers in Australia and Singapore
                    (countries with comparable privacy protections)
                  </li>
                  <li>
                    <strong>Payment Processors:</strong> United States and European Union (under
                    appropriate safeguards)
                  </li>
                  <li>
                    <strong>Email Services:</strong> United States (with contractual protections)
                  </li>
                </ul>

                <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-3">
                  Safeguards We Use
                </h3>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                  We only transfer your information to countries or organizations that provide
                  adequate protection:
                </p>
                <ul className="list-disc pl-6 text-slate-700 dark:text-slate-300 space-y-2 mb-6">
                  <li>
                    <strong>Comparable Privacy Laws:</strong> Countries with privacy laws similar to
                    New Zealand&apos;s
                  </li>
                  <li>
                    <strong>Contractual Safeguards:</strong> Binding agreements requiring equivalent
                    protection
                  </li>
                  <li>
                    <strong>Industry Standards:</strong> Service providers with SOC 2 and ISO 27001
                    certifications
                  </li>
                  <li>
                    <strong>Data Processing Agreements:</strong> Specific terms requiring protection
                    of your information
                  </li>
                </ul>

                <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-3">
                  Your Control Over International Transfers
                </h3>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                  You have the right to:
                </p>
                <ul className="list-disc pl-6 text-slate-700 dark:text-slate-300 space-y-2">
                  <li>Request information about where your data is stored and processed</li>
                  <li>
                    Object to transfers to specific countries (though this may limit service
                    availability)
                  </li>
                  <li>
                    Request that your data be stored only in New Zealand or Australia (additional
                    fees may apply)
                  </li>
                </ul>
              </section>

              {/* Children&apos;s Privacy */}
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-4">
                  Children&apos;s Privacy and Parental Rights
                </h2>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                  Under applicable law and our terms of service:
                </p>
                <ul className="list-disc pl-6 text-slate-700 dark:text-slate-300 space-y-2 mb-6">
                  <li>
                    <strong>Age Requirement:</strong> Certestic is intended for users 18 years and
                    older
                  </li>
                  <li>
                    <strong>Under 16:</strong> We do not knowingly collect personal information from
                    children under 16 without parental consent
                  </li>
                  <li>
                    <strong>Parental Rights:</strong> Parents can request access to, correction of,
                    or deletion of their child&apos;s information
                  </li>
                  <li>
                    <strong>School Use:</strong> Educational institutions using our platform must
                    have appropriate consent from parents/guardians
                  </li>
                </ul>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                  If you believe we have collected information from a child inappropriately, please
                  contact our Privacy Officer immediately.
                </p>
              </section>

              {/* International Customer Rights */}
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-4">
                  Jurisdiction-Specific Rights
                </h2>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-6">
                  While Certestic operates under New Zealand law, we recognize and respect the
                  privacy rights of our global customers. Depending on your location, you may have
                  additional rights under your local privacy legislation. We are committed to
                  honoring these rights to the fullest extent reasonably practicable.
                </p>

                <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-6">
                  <strong>General Principle:</strong> Where your local privacy laws provide stronger
                  protections than our base requirements, we will endeavor to comply with the higher
                  standard. This includes processing grounds, retention periods, disclosure
                  requirements, and individual rights.
                </p>

                <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-4">
                  European Union Users (GDPR Rights)
                </h3>
                <div className="mb-6">
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-3">
                    If you are located in the European Union, European Economic Area, or the United
                    Kingdom, you have the following additional rights:
                  </p>
                  <ul className="list-disc pl-6 text-slate-700 dark:text-slate-300 space-y-2">
                    <li>
                      <strong>Right to Data Portability:</strong> Request your data in a structured,
                      machine-readable format
                    </li>
                    <li>
                      <strong>Right to be Forgotten:</strong> Request deletion of your personal data
                      under specific circumstances
                    </li>
                    <li>
                      <strong>Right to Restrict Processing:</strong> Limit how we process your data
                      in certain situations
                    </li>
                    <li>
                      <strong>Right to Object:</strong> Object to processing based on legitimate
                      interests or for direct marketing
                    </li>
                    <li>
                      <strong>Right to Withdraw Consent:</strong> Withdraw consent at any time where
                      processing is based on consent
                    </li>
                    <li>
                      <strong>Right to Lodge Complaints:</strong> File complaints with your local
                      Data Protection Authority
                    </li>
                    <li>
                      <strong>Automated Decision-Making:</strong> Request human review of automated
                      decisions that significantly affect you
                    </li>
                  </ul>
                </div>

                <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-4">
                  Australian Users (Privacy Act 1988)
                </h3>
                <div className="mb-6">
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-3">
                    Australian customers have rights similar to our standard privacy protections,
                    plus:
                  </p>
                  <ul className="list-disc pl-6 text-slate-700 dark:text-slate-300 space-y-2">
                    <li>
                      <strong>Access and Correction:</strong> Rights to access and correct personal
                      information held about you
                    </li>
                    <li>
                      <strong>Complaints Process:</strong> Right to complain to the Australian
                      Privacy Commissioner
                    </li>
                    <li>
                      <strong>Notifiable Data Breaches:</strong> We will notify you and the
                      Commissioner of eligible data breaches
                    </li>
                    <li>
                      <strong>Direct Marketing:</strong> Right to opt-out of direct marketing
                      communications
                    </li>
                  </ul>
                </div>

                <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-4">
                  Canadian Users (PIPEDA/Provincial Laws)
                </h3>
                <div className="mb-6">
                  <ul className="list-disc pl-6 text-slate-700 dark:text-slate-300 space-y-2">
                    <li>
                      <strong>Knowledge and Consent:</strong> Right to know why information is
                      collected and how it will be used
                    </li>
                    <li>
                      <strong>Access Rights:</strong> Right to access personal information and
                      request corrections
                    </li>
                    <li>
                      <strong>Complaints:</strong> Right to file complaints with the Privacy
                      Commissioner of Canada or provincial commissioners
                    </li>
                    <li>
                      <strong>Breach Notification:</strong> Right to be notified of privacy breaches
                      that pose real risk of significant harm
                    </li>
                  </ul>
                </div>

                <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-4">
                  United States Users (State Privacy Laws)
                </h3>
                <div className="mb-6">
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-3">
                    Users in states with comprehensive privacy laws (California, Virginia, Colorado,
                    Connecticut, Utah, etc.) may have additional rights:
                  </p>
                  <ul className="list-disc pl-6 text-slate-700 dark:text-slate-300 space-y-2">
                    <li>
                      <strong>Right to Know:</strong> Know what personal information is collected
                      and how it is used
                    </li>
                    <li>
                      <strong>Right to Delete:</strong> Request deletion of personal information
                    </li>
                    <li>
                      <strong>Right to Opt-Out:</strong> Opt-out of sale/sharing of personal
                      information and targeted advertising
                    </li>
                    <li>
                      <strong>Right to Non-Discrimination:</strong> Not be discriminated against for
                      exercising privacy rights
                    </li>
                    <li>
                      <strong>Right to Correction:</strong> Request correction of inaccurate
                      personal information
                    </li>
                  </ul>
                </div>

                <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-4">
                  Other Jurisdictions
                </h3>
                <div className="mb-6">
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                    For users in other countries with privacy legislation (Brazil&apos;s LGPD,
                    Japan&apos;s APPI, Singapore&apos;s PDPA, etc.), we will respect any additional
                    privacy rights you have under your local laws to the extent reasonably
                    practicable.
                  </p>
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                    If you believe you have specific rights under your local privacy laws that are
                    not addressed here, please contact our Privacy Officer who will work with you to
                    understand and accommodate your rights where possible.
                  </p>
                </div>

                <div className="bg-amber-50 dark:bg-amber-900/20 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-amber-900 dark:text-amber-100 mb-2">
                    Exercise Your Rights
                  </h3>
                  <p className="text-amber-800 dark:text-amber-200 text-sm mb-3">
                    To exercise any of these rights, please contact our Privacy Officer at:
                  </p>
                  <ul className="text-amber-800 dark:text-amber-200 text-sm space-y-1">
                    <li>
                      <strong>Email:</strong> privacy@certestic.com
                    </li>
                    <li>
                      <strong>Subject Line:</strong> &quot;Privacy Rights Request&quot;
                    </li>
                    <li>
                      <strong>Include:</strong> Your country of residence, specific right you wish
                      to exercise, and verification details
                    </li>
                    <li>
                      <strong>Response Time:</strong> We will respond within 30 days
                    </li>
                  </ul>
                </div>
              </section>

              {/* Responsible Use */}
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-4">
                  Your Responsibilities
                </h2>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                  By using this platform, you agree to:
                </p>
                <ul className="list-disc pl-6 text-slate-700 dark:text-slate-300 space-y-2 mb-6">
                  <li>Use the platform only for lawful purposes</li>
                  <li>
                    Not store sensitive or confidential information without understanding our
                    security model
                  </li>
                  <li>Maintain your own backups of important information</li>
                  <li>
                    Notify us immediately of any security concerns or potential unauthorized access
                  </li>
                </ul>
              </section>

              {/* Effective Date */}
              <div className="bg-slate-50 dark:bg-slate-900/20 border border-slate-200 dark:border-slate-700 rounded-lg p-6 text-center">
                <p className="text-slate-800 dark:text-slate-200 font-semibold mb-2">
                  Privacy Policy Effective Date
                </p>
                <p className="text-slate-700 dark:text-slate-300 text-sm mb-2">
                  This Privacy Policy is effective as of May 11, 2026, and applies to all users of
                  the Certestic platform.
                </p>
                <p className="text-slate-600 dark:text-slate-400 text-xs">
                  We regularly review and update this policy to ensure compliance with applicable
                  privacy laws. Last updated: May 11, 2026.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
