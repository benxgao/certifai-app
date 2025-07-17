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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
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
            <p className="text-lg text-slate-600 dark:text-slate-400">Last updated: July 9, 2025</p>
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
                  Certestic (&quot;this project,&quot; &quot;the platform,&quot; or &quot;I&quot;)
                  is a personal side project operated by an individual developer. This Privacy
                  Policy explains how I collect, use, and protect your personal information when you
                  use this AI-powered IT certification training platform. As a personal project with
                  limited resources, this policy reflects the practical realities of operating a
                  small-scale educational platform.
                </p>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                  <strong>Your Rights:</strong> You have rights regarding your personal information,
                  including the right to access, correct, and request deletion of your information.
                  I will honor these rights to the best of my ability as a solo developer.
                </p>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                  By using Certestic, you acknowledge that this is a personal project and agree to
                  the collection, use, and disclosure of your personal information as described in
                  this policy. If you do not agree with this policy, please do not use this
                  platform.
                </p>
              </section>

              {/* Legal Basis and Purpose */}
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-4">
                  Why I Collect Your Information
                </h2>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                  As a personal project, I collect and process your personal information for these
                  essential purposes:
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
                    and improve its functionality (as time and resources permit)
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
                  I aim to collect only information that is necessary for these purposes, though as
                  a solo developer, data minimization practices may evolve over time.
                </p>
              </section>

              {/* Information We Collect */}
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-4">
                  Information I Collect
                </h2>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                  I collect the following types of personal information to operate this platform:
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
                  In compliance with Privacy Principle 2 (collection from individual), we do not:
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
                  How We Use Your Personal Information (Privacy Principle 3)
                </h2>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                  Under Privacy Principle 3, we will only use your personal information for the
                  purposes for which it was collected, or for a directly related purpose you would
                  reasonably expect. We use your information for:
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
                    📬 Essential Platform Communications
                  </h4>
                  <p className="text-amber-800 dark:text-amber-200 text-sm mb-3">
                    By creating an account, you automatically consent to receiving platform update
                    emails through our marketing email services. These communications include:
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
                    <strong>Note:</strong> While you can unsubscribe from promotional content,
                    essential service communications are required for platform operation and cannot
                    be opted out of.
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
                  Information Sharing and Disclosure (Privacy Principles 10 & 11)
                </h2>
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6 mb-6">
                  <p className="text-green-800 dark:text-green-200 font-semibold mb-2">
                    ✅ Privacy Protection Commitment
                  </p>
                  <p className="text-green-700 dark:text-green-300 text-sm">
                    We do not sell, rent, or trade your personal information to third parties for
                    marketing purposes.
                  </p>
                </div>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                  Under Privacy Principles 10 and 11, we have strict limits on when and how we can
                  disclose your personal information. We may only share your information in the
                  following circumstances:
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
                  Legal Requirements (Limited Capacity)
                </h3>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                  As a personal project, I may disclose your information only when legally required:
                </p>
                <ul className="list-disc pl-6 text-slate-700 dark:text-slate-300 space-y-2 mb-6">
                  <li>
                    <strong>Legal Orders:</strong> To comply with valid court orders or legal
                    processes (though I may lack resources for complex legal responses)
                  </li>
                  <li>
                    <strong>Safety Concerns:</strong> To prevent serious harm or illegal activity
                    when I become aware of it
                  </li>
                  <li>
                    <strong>Platform Protection:</strong> To protect the basic operation and
                    security of the platform
                  </li>
                </ul>

                <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-3">
                  Project Discontinuation
                </h3>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                  If I decide to discontinue this personal project:
                </p>
                <ul className="list-disc pl-6 text-slate-700 dark:text-slate-300 space-y-2 mb-6">
                  <li>I will attempt to provide 30 days&apos; notice (resources permitting)</li>
                  <li>I will make reasonable efforts to delete or anonymize user data</li>
                  <li>No guarantee of data preservation or transfer to another service</li>
                  <li>
                    Users are responsible for backing up their own data before discontinuation
                  </li>
                </ul>

                <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-3">
                  With Your Explicit Consent
                </h3>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                  We may share your information for other purposes only with your explicit, informed
                  consent. You can withdraw this consent at any time by contacting us.
                </p>
              </section>

              {/* Data Security */}
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-4">
                  Data Security (Privacy Principle 5)
                </h2>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                  Under Privacy Principle 5, we are required to protect your personal information
                  with appropriate security safeguards. We implement comprehensive technical and
                  organizational security measures:
                </p>

                <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-3">
                  Basic Security Measures (Personal Project)
                </h3>
                <ul className="list-disc pl-6 text-slate-700 dark:text-slate-300 space-y-2 mb-6">
                  <li>
                    <strong>Platform Security:</strong> Basic security measures provided by hosting
                    platforms (Firebase/Google Cloud)
                  </li>
                  <li>
                    <strong>Standard Encryption:</strong> Standard HTTPS encryption for data
                    transmission
                  </li>
                  <li>
                    <strong>Access Control:</strong> Basic authentication and authorization controls
                  </li>
                  <li>
                    <strong>Updates:</strong> Security updates applied when time and knowledge
                    permit
                  </li>
                  <li>
                    <strong>Limited Monitoring:</strong> Basic automated monitoring where available
                  </li>
                </ul>

                <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-3">
                  Personal Project Limitations
                </h3>
                <ul className="list-disc pl-6 text-slate-700 dark:text-slate-300 space-y-2 mb-6">
                  <li>
                    <strong>Solo Operation:</strong> No dedicated security team or 24/7 monitoring
                  </li>
                  <li>
                    <strong>Limited Expertise:</strong> Security measures depend on my personal
                    knowledge and available time
                  </li>
                  <li>
                    <strong>Best Effort Response:</strong> Security incidents will be addressed on a
                    best-effort basis
                  </li>
                  <li>
                    <strong>No Formal Procedures:</strong> No enterprise-level incident response
                    procedures or security audits
                  </li>
                  <li>
                    <strong>Dependency on Providers:</strong> Security heavily relies on third-party
                    service providers
                  </li>
                </ul>

                <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-3">
                  Breach Notification (Best Effort)
                </h3>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                  If I become aware of a privacy breach, I will make reasonable efforts to:
                </p>
                <ul className="list-disc pl-6 text-slate-700 dark:text-slate-300 space-y-2 mb-4">
                  <li>Notify affected users via email when reasonably possible</li>
                  <li>
                    Notify relevant authorities if required and I&apos;m aware of the requirements
                  </li>
                  <li>Take basic steps to secure the platform and prevent further breaches</li>
                  <li>Provide available information about the incident</li>
                </ul>

                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                  <strong>Important Security Notice:</strong> As a personal project, security
                  measures are basic and you should not store any sensitive, confidential, or
                  critical information on this platform. Use this service at your own risk and
                  maintain your own backups.
                </p>
              </section>

              {/* Data Retention */}
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-4">
                  Data Retention (Privacy Principle 9)
                </h2>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                  Under Privacy Principle 9, we must not keep your personal information for longer
                  than necessary. Our retention practices are:
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
                  International Data Transfers (Privacy Principle 12)
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
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                  Under Privacy Principle 12, we can only transfer your personal information outside
                  New Zealand in specific circumstances. Here&apos;s how we handle international
                  transfers:
                </p>

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
                      <strong>Response Time:</strong> Please allow up to 30 days for response as
                      this is managed by a solo developer
                    </li>
                  </ul>
                </div>
              </section>

              {/* Limitation of Liability for Privacy Matters */}
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-4">
                  Limitation of Liability - Personal Project Disclaimers
                </h2>

                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 mb-6">
                  <p className="text-red-800 dark:text-red-200 font-semibold mb-2">
                    ⚠️ Important Notice - Personal Project Limitations
                  </p>
                  <p className="text-red-700 dark:text-red-300 text-sm">
                    This platform is operated as a personal side project by an individual developer
                    with limited resources, time, and expertise. Your use of this platform is at
                    your own risk.
                  </p>
                </div>

                <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-4">
                  Personal Project Disclaimers
                </h3>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                  TO THE MAXIMUM EXTENT PERMITTED BY LAW, AS A PERSONAL PROJECT:
                </p>
                <ul className="list-disc pl-6 text-slate-700 dark:text-slate-300 space-y-2 mb-6">
                  <li>
                    <strong>Best Effort Basis:</strong> I operate this platform on a best-effort
                    basis in my spare time with no guarantee of continuous availability or support
                  </li>
                  <li>
                    <strong>Limited Resources:</strong> I have limited time, technical resources,
                    and expertise to implement comprehensive data protection measures
                  </li>
                  <li>
                    <strong>No Service Level Guarantees:</strong> I make no warranties about uptime,
                    data backup, recovery capabilities, or response times
                  </li>
                  <li>
                    <strong>Volunteer Effort:</strong> Privacy request processing depends on my
                    availability and may experience significant delays
                  </li>
                  <li>
                    <strong>Platform Evolution:</strong> Features, security measures, and data
                    practices may change as the project develops
                  </li>
                </ul>

                <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-4">
                  Maximum Liability Limitation
                </h3>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                  TO THE FULLEST EXTENT PERMITTED BY LAW:
                </p>
                <ul className="list-disc pl-6 text-slate-700 dark:text-slate-300 space-y-2 mb-6">
                  <li>
                    <strong>No Monetary Liability:</strong> My total liability for any
                    privacy-related claims is limited to $0 (zero dollars), as this is provided as a
                    free personal project
                  </li>
                  <li>
                    <strong>No Damages:</strong> I exclude all liability for direct, indirect,
                    consequential, punitive, or any other damages arising from privacy issues
                  </li>
                  <li>
                    <strong>Use At Your Own Risk:</strong> You acknowledge that you use this
                    platform entirely at your own risk
                  </li>
                  <li>
                    <strong>No Professional Standards:</strong> This platform is not held to
                    commercial or professional data protection standards
                  </li>
                </ul>

                <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-4">
                  Technical Limitations
                </h3>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                  As a solo developer, I cannot guarantee:
                </p>
                <ul className="list-disc pl-6 text-slate-700 dark:text-slate-300 space-y-2 mb-6">
                  <li>Enterprise-level security implementations</li>
                  <li>24/7 monitoring or incident response</li>
                  <li>Professional data backup and recovery procedures</li>
                  <li>Immediate response to security vulnerabilities</li>
                  <li>Compliance with all international privacy regulations</li>
                  <li>Continuous platform availability or data access</li>
                </ul>

                <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-4">
                  User Responsibility and Indemnification
                </h3>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                  By using this platform, you agree to:
                </p>
                <ul className="list-disc pl-6 text-slate-700 dark:text-slate-300 space-y-2 mb-6">
                  <li>
                    <strong>Assume All Risk:</strong> Accept full responsibility for any
                    consequences of using this personal project
                  </li>
                  <li>
                    <strong>No Sensitive Data:</strong> Not upload or store any sensitive,
                    confidential, or critical personal information
                  </li>
                  <li>
                    <strong>Backup Your Data:</strong> Maintain your own backups of any important
                    information
                  </li>
                  <li>
                    <strong>Indemnify Developer:</strong> Hold harmless and indemnify the developer
                    from any claims, damages, or losses arising from your use of the platform
                  </li>
                </ul>

                <div className="bg-yellow-50 dark:bg-yellow-900/20 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-yellow-900 dark:text-yellow-100 mb-2">
                    Consumer Rights Notice
                  </h3>
                  <p className="text-yellow-800 dark:text-yellow-200 text-sm">
                    <strong>Important:</strong> While I limit liability to the maximum extent
                    permitted, nothing in this policy excludes rights that cannot be excluded under
                    applicable consumer protection laws. This is provided as a free personal project
                    with no commercial warranties or guarantees.
                  </p>
                </div>
              </section>

              {/* Effective Date */}
              <div className="bg-slate-50 dark:bg-slate-900/20 border border-slate-200 dark:border-slate-700 rounded-lg p-6 text-center">
                <p className="text-slate-800 dark:text-slate-200 font-semibold mb-2">
                  Privacy Policy Effective Date
                </p>
                <p className="text-slate-700 dark:text-slate-300 text-sm mb-2">
                  This Privacy Policy is effective as of July 9, 2025, and applies to all users of
                  the Certestic platform.
                </p>
                <p className="text-slate-600 dark:text-slate-400 text-xs">
                  This policy reflects the operational realities of a personal side project and
                  complies with applicable privacy laws to the extent reasonably practicable for an
                  individual developer.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
