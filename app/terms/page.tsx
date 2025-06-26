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
              Last updated: June 26, 2025
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
                  <li>
                    <strong>&quot;AI Training Data&quot;</strong> means anonymized and aggregated
                    user interaction data, performance metrics, and usage patterns used to improve
                    our artificial intelligence systems
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
                  <li>
                    Your feedback and usage data may be used to improve the Platform and train our
                    AI systems (see Section 10 for details)
                  </li>
                </ul>
              </section>

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

              {/* Platform Purpose and Exam Result Disclaimer */}
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-4">
                  4. Platform Purpose and Exam Result Disclaimer
                </h2>
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 mb-6">
                  <p className="text-red-800 dark:text-red-200 font-semibold mb-2">
                    🚨 Important: Practice and Preparation Tool Only
                  </p>
                  <p className="text-red-700 dark:text-red-300 text-sm">
                    CertifAI is designed exclusively for practice and preparation purposes. We do
                    not guarantee or take responsibility for your actual certification exam results.
                  </p>
                </div>

                <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-3">
                  Platform Purpose
                </h3>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                  CertifAI is a practice and preparation platform designed to help you study for IT
                  certification exams. You acknowledge and agree that:
                </p>
                <ul className="list-disc pl-6 text-slate-700 dark:text-slate-300 space-y-2 mb-6">
                  <li>
                    <strong>Practice Tool Only:</strong> The Platform is intended solely as a
                    practice and study aid to help you prepare for certification exams
                  </li>
                  <li>
                    <strong>Not Official Exam Content:</strong> Our practice questions, simulations,
                    and content are not actual exam questions from certification bodies
                  </li>
                  <li>
                    <strong>Supplementary Resource:</strong> The Platform should be used as a
                    supplement to, not a replacement for, official study materials and training
                  </li>
                  <li>
                    <strong>No Exam Equivalency:</strong> Practice scores and results on our
                    Platform do not predict or guarantee performance on actual certification exams
                  </li>
                </ul>

                <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-3">
                  No Responsibility for Actual Exam Results
                </h3>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                  <strong>IMPORTANT DISCLAIMER:</strong> CertifAI explicitly disclaims any
                  responsibility for your actual certification exam results. You understand and
                  agree that:
                </p>
                <ul className="list-disc pl-6 text-slate-700 dark:text-slate-300 space-y-2 mb-6">
                  <li>
                    <strong>No Results Guarantee:</strong> We make no warranties, representations,
                    or guarantees regarding your performance on actual certification exams
                  </li>
                  <li>
                    <strong>Individual Responsibility:</strong> Your exam success depends on many
                    factors including your dedication, study habits, prior knowledge, and official
                    training
                  </li>
                  <li>
                    <strong>No Liability for Failures:</strong> We are not liable for any costs,
                    damages, or consequences arising from failing to pass certification exams
                  </li>
                  <li>
                    <strong>External Factors:</strong> Actual exam difficulty, format changes, and
                    content updates are beyond our control and may affect your results
                  </li>
                  <li>
                    <strong>Independent Verification:</strong> You must independently verify all
                    study material with official sources and authorized training providers
                  </li>
                </ul>

                <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-3">
                  User Responsibilities
                </h3>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                  As a user preparing for certification exams, you are responsible for:
                </p>
                <ul className="list-disc pl-6 text-slate-700 dark:text-slate-300 space-y-2">
                  <li>
                    Consulting official certification body resources and authorized training
                    materials
                  </li>
                  <li>Understanding the actual exam format, requirements, and content areas</li>
                  <li>
                    Ensuring adequate preparation through multiple study methods and resources
                  </li>
                  <li>Managing your own study schedule and preparation timeline</li>
                  <li>
                    Verifying current exam objectives and requirements with certification bodies
                  </li>
                  <li>Understanding that practice results do not guarantee actual exam success</li>
                </ul>
              </section>

              {/* Account Registration and Eligibility */}
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-4">
                  5. Account Registration and Eligibility
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
                  6. Permitted Use
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
                  7. Prohibited Conduct
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

              {/* AI Services and Content Creation Disclaimer */}
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-4">
                  8. AI Services and Content Creation Disclaimer
                </h2>
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 mb-4">
                  <p className="text-red-800 dark:text-red-200 font-semibold mb-2">
                    🤖 AI and Human Content Disclaimer
                  </p>
                  <p className="text-red-700 dark:text-red-300 text-sm">
                    Our platform content is created through a combination of AI generation and human
                    oversight. All content is for educational purposes only and may contain errors
                    or inaccuracies.
                  </p>
                </div>

                <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-3">
                  Content Creation Process
                </h3>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                  You acknowledge and understand that content on our Platform is created through:
                </p>
                <ul className="list-disc pl-6 text-slate-700 dark:text-slate-300 space-y-2 mb-6">
                  <li>
                    <strong>AI Generation:</strong> Initial content is primarily generated by
                    artificial intelligence systems trained on educational materials and technical
                    documentation
                  </li>
                  <li>
                    <strong>Human Review and Editing:</strong> AI-generated content may be reviewed,
                    edited, modified, or enhanced by human experts, educators, and content reviewers
                  </li>
                  <li>
                    <strong>Direct Human Creation:</strong> Some content may be created entirely by
                    human authors, particularly specialized explanations, course materials, and
                    platform documentation
                  </li>
                  <li>
                    <strong>Hybrid Approach:</strong> Most content represents a combination of AI
                    generation with subsequent human modification, correction, or improvement
                  </li>
                  <li>
                    <strong>Ongoing Refinement:</strong> Content may be continuously updated,
                    modified, or replaced based on user feedback, accuracy improvements, or
                    educational effectiveness
                  </li>
                </ul>

                <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-3">
                  Content Accuracy and Limitations
                </h3>
                <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-6 mb-4">
                  <p className="text-amber-800 dark:text-amber-200 font-semibold mb-2">
                    ⚠️ Important Accuracy Notice
                  </p>
                  <p className="text-amber-700 dark:text-amber-300 text-sm">
                    Despite human oversight and review, content errors may still occur. Always
                    verify information with official sources.
                  </p>
                </div>

                <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                  You acknowledge and agree that:
                </p>
                <ul className="list-disc pl-6 text-slate-700 dark:text-slate-300 space-y-2 mb-6">
                  <li>
                    <strong>Error Possibility:</strong> Both AI-generated and human-edited content
                    may contain errors, inaccuracies, or outdated information despite quality
                    control measures
                  </li>
                  <li>
                    <strong>No Perfection Guarantee:</strong> Human review and editing does not
                    guarantee complete accuracy or eliminate all potential errors in content
                  </li>
                  <li>
                    <strong>Study Aid Only:</strong> The Platform serves as a study aid and
                    supplement to official materials, not as a replacement for authoritative
                    certification resources
                  </li>
                  <li>
                    <strong>Verification Responsibility:</strong> You should independently verify
                    all information with official certification materials and authoritative sources
                  </li>
                  <li>
                    <strong>No Official Affiliation:</strong> Official certification bodies are not
                    affiliated with, responsible for, or endorsing our Platform or its content
                  </li>
                  <li>
                    <strong>Estimates and Predictions:</strong> Performance predictions,
                    recommendations, and analytics are estimates based on available data and may not
                    accurately predict actual exam outcomes
                  </li>
                  <li>
                    <strong>Content Evolution:</strong> Content may change over time as we improve
                    accuracy, update materials, or respond to certification body changes
                  </li>
                </ul>

                <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-3">
                  Human Oversight and Quality Control
                </h3>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                  While we implement human oversight in our content creation process, you understand
                  that:
                </p>
                <ul className="list-disc pl-6 text-slate-700 dark:text-slate-300 space-y-2 mb-4">
                  <li>
                    <strong>Best Efforts Standard:</strong> Human review is conducted on a
                    best-efforts basis and may not catch all errors or inaccuracies
                  </li>
                  <li>
                    <strong>Resource Limitations:</strong> The extent of human review may vary based
                    on available resources, content volume, and operational priorities
                  </li>
                  <li>
                    <strong>Expertise Variations:</strong> Human reviewers may have varying levels
                    of expertise in specific certification areas
                  </li>
                  <li>
                    <strong>No Warranty:</strong> Human involvement in content creation does not
                    constitute a warranty of accuracy, completeness, or fitness for any particular
                    purpose
                  </li>
                </ul>

                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
                  <h4 className="text-blue-900 dark:text-blue-100 font-semibold mb-2">
                    Content Improvement Commitment
                  </h4>
                  <p className="text-blue-800 dark:text-blue-200 text-sm mb-3">
                    We are committed to continuously improving content quality through:
                  </p>
                  <ul className="list-disc pl-6 text-blue-800 dark:text-blue-200 text-sm space-y-1">
                    <li>Regular content audits and updates by subject matter experts</li>
                    <li>User feedback integration and error reporting mechanisms</li>
                    <li>Collaboration with certified professionals in relevant fields</li>
                    <li>Ongoing AI model training and improvement initiatives</li>
                    <li>Implementation of quality assurance processes and standards</li>
                  </ul>
                </div>
              </section>

              {/* Content Creation and Copyright Considerations */}
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-4">
                  9. Content Creation and Copyright Considerations
                </h2>

                <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-6 mb-6">
                  <p className="text-purple-800 dark:text-purple-200 font-semibold mb-2">
                    ⚖️ Important Copyright Notice
                  </p>
                  <p className="text-purple-700 dark:text-purple-300 text-sm">
                    Our platform contains mixed content created through AI generation, human
                    authorship, and hybrid approaches. This section explains copyright implications
                    for different types of content.
                  </p>
                </div>

                <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-3">
                  Content Creation Categories
                </h3>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                  You acknowledge and understand that content on our Platform falls into several
                  categories:
                </p>
                <ul className="list-disc pl-6 text-slate-700 dark:text-slate-300 space-y-2 mb-6">
                  <li>
                    <strong>Pure AI-Generated Content:</strong> Content created entirely by
                    artificial intelligence systems without subsequent human modification
                  </li>
                  <li>
                    <strong>Human-Authored Content:</strong> Content created entirely by human
                    authors, including specialized explanations, educational materials, and
                    documentation
                  </li>
                  <li>
                    <strong>AI-Assisted Human Content:</strong> Content created by humans using AI
                    tools for research, drafting, or enhancement while maintaining human creative
                    control
                  </li>
                  <li>
                    <strong>Human-Enhanced AI Content:</strong> AI-generated content that has been
                    subsequently reviewed, edited, modified, or improved by human experts
                  </li>
                  <li>
                    <strong>Collaborative Content:</strong> Content resulting from iterative
                    collaboration between AI systems and human creators
                  </li>
                </ul>

                <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-3">
                  Copyright Approach by Content Type
                </h3>
                <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-6 mb-4">
                  <p className="text-orange-800 dark:text-orange-200 font-semibold mb-2">
                    ⚠️ Differentiated Copyright Approach
                  </p>
                  <p className="text-orange-700 dark:text-orange-300 text-sm">
                    We take different copyright approaches depending on the level of human creative
                    input in content creation.
                  </p>
                </div>

                <div className="space-y-6 mb-6">
                  <div className="border-l-4 border-gray-300 pl-6">
                    <h4 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-2">
                      Pure AI-Generated Content
                    </h4>
                    <p className="text-slate-700 dark:text-slate-300 text-sm mb-2">
                      <strong>Copyright Status:</strong> We disclaim copyright ownership to the
                      maximum extent permitted by law
                    </p>
                    <ul className="list-disc pl-6 text-slate-600 dark:text-slate-400 text-sm space-y-1">
                      <li>No copyright claims asserted by CertifAI</li>
                      <li>Intended for public domain treatment where legally possible</li>
                      <li>Users may freely use, reproduce, and distribute such content</li>
                      <li>No enforcement action will be taken for use of this content</li>
                    </ul>
                  </div>

                  <div className="border-l-4 border-blue-300 pl-6">
                    <h4 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-2">
                      Human-Authored and Human-Enhanced Content
                    </h4>
                    <p className="text-slate-700 dark:text-slate-300 text-sm mb-2">
                      <strong>Copyright Status:</strong> May be subject to copyright protection
                      where human creativity is substantial
                    </p>
                    <ul className="list-disc pl-6 text-slate-600 dark:text-slate-400 text-sm space-y-1">
                      <li>Copyright may exist in original human contributions</li>
                      <li>Substantial human modifications may create new copyrightable works</li>
                      <li>Educational use principles generally apply</li>
                      <li>Commercial reproduction may require permission</li>
                    </ul>
                  </div>

                  <div className="border-l-4 border-green-300 pl-6">
                    <h4 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-2">
                      Hybrid and Collaborative Content
                    </h4>
                    <p className="text-slate-700 dark:text-slate-300 text-sm mb-2">
                      <strong>Copyright Status:</strong> Evaluated case-by-case based on level of
                      human creative input
                    </p>
                    <ul className="list-disc pl-6 text-slate-600 dark:text-slate-400 text-sm space-y-1">
                      <li>Copyright may exist in substantial human contributions</li>
                      <li>Minimal edits to AI content generally do not create copyright</li>
                      <li>Creative reorganization or enhancement may be protected</li>
                      <li>Users should contact us for clarification on specific content</li>
                    </ul>
                  </div>
                </div>

                <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-3">
                  Content Identification and Transparency
                </h3>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                  We strive to provide transparency about content creation methods:
                </p>
                <ul className="list-disc pl-6 text-slate-700 dark:text-slate-300 space-y-2 mb-6">
                  <li>
                    <strong>Content Labeling:</strong> Where feasible, we may indicate whether
                    content is AI-generated, human-authored, or hybrid
                  </li>
                  <li>
                    <strong>Attribution Practices:</strong> Human authors and significant
                    contributors may be credited where appropriate
                  </li>
                  <li>
                    <strong>Source Documentation:</strong> We maintain internal records of content
                    creation methods for copyright determination purposes
                  </li>
                  <li>
                    <strong>User Inquiries:</strong> Users may contact us to inquire about the
                    creation method and copyright status of specific content
                  </li>
                </ul>

                <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-3">
                  Third-Party Copyright Considerations
                </h3>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                  Regardless of our content creation methods, you acknowledge that:
                </p>
                <ul className="list-disc pl-6 text-slate-700 dark:text-slate-300 space-y-2 mb-6">
                  <li>
                    <strong>Training Data Sources:</strong> AI systems may have been trained on
                    copyrighted materials, but generate new, transformative content
                  </li>
                  <li>
                    <strong>No Infringement Intent:</strong> Our content creation process is
                    designed to produce original works and avoid reproducing copyrighted materials
                  </li>
                  <li>
                    <strong>Similarity Disclaimers:</strong> Any similarity to existing copyrighted
                    works is coincidental and results from common knowledge in technical fields
                  </li>
                  <li>
                    <strong>User Responsibility:</strong> Users should independently verify that
                    their use of any content complies with applicable copyright laws
                  </li>
                  <li>
                    <strong>Human Review Process:</strong> Our human review process includes
                    checking for potential copyright issues, though we cannot guarantee complete
                    detection
                  </li>
                </ul>

                <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-3">
                  Platform and Technology Rights
                </h3>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                  Regardless of content copyright status, we retain rights in:
                </p>
                <ul className="list-disc pl-6 text-slate-700 dark:text-slate-300 space-y-2 mb-4">
                  <li>The CertifAI platform software and technology infrastructure</li>
                  <li>Our proprietary AI models, algorithms, and training methodologies</li>
                  <li>Platform design, user interface, branding, and visual elements</li>
                  <li>Database compilation and content organization systems</li>
                  <li>User data analytics and performance tracking technologies</li>
                </ul>

                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6">
                  <h4 className="text-green-900 dark:text-green-100 font-semibold mb-2">
                    Practical Benefits for Users
                  </h4>
                  <p className="text-green-800 dark:text-green-200 text-sm mb-3">
                    Our differentiated approach to content copyright provides you with:
                  </p>
                  <ul className="list-disc pl-6 text-green-800 dark:text-green-200 text-sm space-y-1">
                    <li>Clear guidance on usage rights for different content types</li>
                    <li>Maximum freedom to use purely AI-generated materials</li>
                    <li>Respect for human creativity while maintaining educational access</li>
                    <li>Transparent communication about content creation methods</li>
                    <li>Support for both personal study and educational institution use</li>
                  </ul>
                </div>
              </section>

              {/* Intellectual Property Rights */}
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-4">
                  10. Intellectual Property Rights
                </h2>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                  The Platform and its original content, features, and functionality are owned by
                  CertifAI and are protected by international copyright, trademark, patent, trade
                  secret, and other intellectual property laws, except as specifically detailed in
                  Section 9 regarding different content creation methods and their copyright
                  implications.
                </p>

                <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-3">
                  Our Content (Human-Authored and Platform Technology)
                </h3>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                  Content on the Platform that involves human authorship or substantial human
                  creative input, including platform software, user interface design, human-authored
                  text, logos, images, and our proprietary technology, is our property or the
                  property of our licensors and is protected by copyright and other intellectual
                  property laws.
                </p>

                <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-3">
                  Mixed Content Rights
                </h3>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                  As detailed in Section 9, our Platform contains content created through various
                  methods with different copyright implications:
                </p>
                <ul className="list-disc pl-6 text-slate-700 dark:text-slate-300 space-y-2 mb-4">
                  <li>Pure AI-generated content where we disclaim copyright ownership</li>
                  <li>Human-authored content which may be protected by copyright</li>
                  <li>Human-enhanced AI content with varying levels of copyright protection</li>
                  <li>Hybrid content evaluated based on human creative contribution</li>
                </ul>
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
                    We do not endorse, guarantee, or assume responsibility for any User Content or
                    platform content regardless of creation method (AI-generated, human-authored, or
                    hybrid). Users are solely responsible for their content and its compliance with
                    applicable laws. Our various copyright approaches for different content types do
                    not create any warranties or guarantees about content accuracy, completeness, or
                    fitness for purpose.
                  </p>
                </div>
              </section>

              {/* Privacy and Data Protection */}
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-4">
                  10. Privacy and Data Protection
                </h2>

                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 mb-6">
                  <p className="text-blue-800 dark:text-blue-200 font-semibold mb-2">
                    🔒 Important Privacy Notice
                  </p>
                  <p className="text-blue-700 dark:text-blue-300 text-sm">
                    Your data may be used to improve our AI systems and platform functionality.
                    Please review this section carefully to understand how your information is
                    processed.
                  </p>
                </div>

                <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                  Your privacy is important to us. Our collection and use of personal information is
                  governed by our{' '}
                  <Link href="/privacy" className="text-primary hover:underline">
                    Privacy Policy
                  </Link>
                  , which is incorporated into these Terms by reference.
                </p>

                <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-3">
                  Data Collection and Basic Processing
                </h3>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                  By using the Platform, you consent to the collection, use, and disclosure of your
                  information as described in our Privacy Policy. You acknowledge that the Platform
                  may store and process your data outside of New Zealand.
                </p>

                <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-3">
                  AI and Human-Enhanced Content Development
                </h3>
                <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-6 mb-4">
                  <p className="text-amber-800 dark:text-amber-200 font-semibold mb-2">
                    ⚠️ Data Usage for Content Creation Notice
                  </p>
                  <p className="text-amber-700 dark:text-amber-300 text-sm">
                    Your usage data and interactions may be used both for AI training and to inform
                    human content creators and reviewers in improving our educational materials.
                  </p>
                </div>

                <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                  <strong>
                    You expressly acknowledge and consent that your data may be used for the
                    following content development and improvement purposes:
                  </strong>
                </p>

                <ul className="list-disc pl-6 text-slate-700 dark:text-slate-300 space-y-2 mb-6">
                  <li>
                    <strong>AI Model Training:</strong> Your exam responses, study patterns, and
                    performance data may be used to train and improve our AI question generation and
                    recommendation systems
                  </li>
                  <li>
                    <strong>Human Content Review:</strong> Aggregated usage patterns and feedback
                    may be reviewed by human content creators and subject matter experts to identify
                    areas for content improvement
                  </li>
                  <li>
                    <strong>Performance Analytics:</strong> Your learning behavior and outcomes may
                    be analyzed by both AI systems and human researchers to enhance our ability to
                    predict certification success and provide personalized recommendations
                  </li>
                  <li>
                    <strong>Content Quality Assessment:</strong> Your interactions with both
                    AI-generated and human-created content help us refine question quality,
                    difficulty levels, and explanations through automated and manual review
                    processes
                  </li>
                  <li>
                    <strong>Pattern Recognition:</strong> Aggregated and anonymized data from your
                    usage may be analyzed by AI systems and reviewed by human experts to identify
                    learning patterns and improve educational outcomes
                  </li>
                  <li>
                    <strong>Human-AI Collaboration:</strong> Your feedback and usage data may inform
                    collaborative content creation processes where human experts work with AI tools
                    to develop educational materials
                  </li>
                  <li>
                    <strong>System Improvement:</strong> Your feedback, error reports, and usage
                    metrics help us enhance both AI system accuracy and human content creation
                    processes
                  </li>
                </ul>

                <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-3">
                  Data Anonymization and Privacy Protections
                </h3>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                  When using your data for AI training and analysis, we implement the following
                  privacy protections:
                </p>
                <ul className="list-disc pl-6 text-slate-700 dark:text-slate-300 space-y-2 mb-6">
                  <li>
                    <strong>Data Anonymization:</strong> Personal identifiers are removed or
                    anonymized before data is used for AI training using commercially reasonable
                    methods
                  </li>
                  <li>
                    <strong>Aggregation:</strong> Individual data points are typically aggregated
                    with other users&apos; data to identify patterns rather than individual
                    behaviors
                  </li>
                  <li>
                    <strong>Purpose Limitation:</strong> Data is only used for improving educational
                    services and AI systems, not for unrelated commercial purposes
                  </li>
                  <li>
                    <strong>Retention Limits:</strong> Raw personal data used for AI training is
                    subject to reasonable retention limits as outlined in our Privacy Policy
                  </li>
                  <li>
                    <strong>Security Measures:</strong> AI training data is protected by
                    industry-standard security measures and access controls implemented on a
                    best-efforts basis
                  </li>
                  <li>
                    <strong>Anonymization Disclaimer:</strong> We cannot guarantee that
                    anonymization methods will prevent all possible re-identification, particularly
                    as technology evolves
                  </li>
                </ul>

                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 mb-6">
                  <h4 className="text-red-800 dark:text-red-200 font-semibold mb-2">
                    🚨 Important Privacy Limitations
                  </h4>
                  <p className="text-red-700 dark:text-red-300 text-sm mb-3">
                    By using our Platform, you acknowledge and accept the following privacy
                    limitations and disclaimers:
                  </p>
                  <ul className="list-disc pl-6 text-red-700 dark:text-red-300 text-sm space-y-2">
                    <li>
                      <strong>No Guarantee of Privacy:</strong> While we implement reasonable
                      security measures, we cannot guarantee complete privacy or security of your
                      data
                    </li>
                    <li>
                      <strong>Evolving Technology:</strong> Privacy protection methods may become
                      inadequate as technology advances, and we are not liable for future
                      vulnerabilities
                    </li>
                    <li>
                      <strong>Force Majeure Events:</strong> We are not responsible for data
                      exposure due to events beyond our reasonable control, including cyber attacks,
                      system failures, or natural disasters
                    </li>
                    <li>
                      <strong>Anonymization Limitations:</strong> Anonymized data may still be
                      subject to re-identification through advanced techniques we cannot control or
                      predict
                    </li>
                    <li>
                      <strong>Regulatory Changes:</strong> Changes in privacy laws may require us to
                      modify our data handling practices, potentially affecting your data
                      retroactively
                    </li>
                  </ul>
                </div>

                <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-3">
                  Data Protection Limitations and Disclaimers
                </h3>
                <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-6 mb-4">
                  <p className="text-orange-800 dark:text-orange-200 font-semibold mb-2">
                    ⚠️ Data Protection Limitations
                  </p>
                  <p className="text-orange-700 dark:text-orange-300 text-sm">
                    While we implement reasonable security measures, you acknowledge that no online
                    service can guarantee absolute data security.
                  </p>
                </div>

                <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                  <strong>You acknowledge and agree that:</strong>
                </p>
                <ul className="list-disc pl-6 text-slate-700 dark:text-slate-300 space-y-2 mb-6">
                  <li>
                    <strong>No Absolute Security:</strong> No internet-based service can provide
                    100% security, and you assume the inherent risks of online data transmission and
                    storage
                  </li>
                  <li>
                    <strong>Best Efforts Standard:</strong> We implement industry-standard security
                    measures on a &quot;best efforts&quot; basis but do not guarantee protection
                    against all security threats
                  </li>
                  <li>
                    <strong>Third-Party Risks:</strong> We are not responsible for security breaches
                    caused by third-party services, infrastructure providers, or circumstances
                    beyond our reasonable control
                  </li>
                  <li>
                    <strong>User Responsibility:</strong> You are responsible for maintaining the
                    security of your account credentials and for any activities that occur under
                    your account
                  </li>
                  <li>
                    <strong>Data Breach Limitations:</strong> Our liability for data breaches is
                    limited to notification as required by applicable law and reasonable remedial
                    actions, subject to the limitation of liability provisions in these Terms
                  </li>
                </ul>

                <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-3">
                  Your Rights and Choices
                </h3>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                  Subject to applicable law and the limitations described above, you have the
                  following rights regarding AI-related data processing:
                </p>
                <ul className="list-disc pl-6 text-slate-700 dark:text-slate-300 space-y-2 mb-6">
                  <li>
                    <strong>Opt-Out Rights:</strong> You may request to opt-out of certain AI
                    training data usage by contacting our privacy team, though we cannot guarantee
                    complete removal of anonymized data already incorporated into AI models
                  </li>
                  <li>
                    <strong>Data Access:</strong> You can request information about how your data
                    has been used for AI training purposes, subject to technical and commercial
                    limitations
                  </li>
                  <li>
                    <strong>Deletion Requests:</strong> You may request deletion of your personal
                    data, though anonymized data used in AI models may not be retrievable or
                    technically feasible to remove
                  </li>
                  <li>
                    <strong>Transparency:</strong> We will provide reasonable updates about
                    significant changes to our AI data usage practices, but are not obligated to
                    provide detailed technical information about proprietary AI systems
                  </li>
                </ul>

                <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-3">
                  Third-Party AI Services
                </h3>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                  We may use third-party AI services and APIs to provide our educational content.
                  When we do:
                </p>
                <ul className="list-disc pl-6 text-slate-700 dark:text-slate-300 space-y-2 mb-6">
                  <li>
                    We make reasonable efforts to ensure third-party providers have appropriate
                    privacy protections
                  </li>
                  <li>
                    We limit data sharing to what we reasonably believe is necessary for service
                    provision
                  </li>
                  <li>
                    We seek to require third parties to comply with applicable data protection laws,
                    but cannot guarantee their compliance
                  </li>
                  <li>
                    We maintain commercially reasonable contractual safeguards, but are not
                    responsible for third-party breaches or failures
                  </li>
                  <li>
                    <strong>Third-Party Limitation:</strong> We are not liable for any privacy
                    violations, data breaches, or security failures by third-party service providers
                  </li>
                </ul>

                <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-3">
                  Data Retention and Technical Limitations
                </h3>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                  You acknowledge the following technical and practical limitations regarding data
                  protection:
                </p>
                <ul className="list-disc pl-6 text-slate-700 dark:text-slate-300 space-y-2 mb-6">
                  <li>
                    <strong>AI Model Limitations:</strong> Once data is incorporated into AI
                    training models, complete removal may be technically impossible without
                    destroying the model
                  </li>
                  <li>
                    <strong>Backup Systems:</strong> Data may persist in backup systems for
                    reasonable periods for business continuity purposes
                  </li>
                  <li>
                    <strong>Legal Retention:</strong> We may retain data longer than requested if
                    required by law, regulation, or legitimate business interests
                  </li>
                  <li>
                    <strong>Anonymization Irreversibility:</strong> Once data is anonymized, we may
                    not be able to identify or remove specific individual contributions
                  </li>
                  <li>
                    <strong>Technical Feasibility:</strong> Data deletion requests will be fulfilled
                    to the extent technically and commercially reasonable
                  </li>
                </ul>

                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6">
                  <h4 className="text-green-900 dark:text-green-100 font-semibold mb-2">
                    Contact Us About AI Data Usage
                  </h4>
                  <p className="text-green-800 dark:text-green-200 text-sm mb-3">
                    If you have questions or concerns about how your data is used for AI training or
                    analysis:
                  </p>
                  <ul className="list-disc pl-6 text-green-800 dark:text-green-200 text-sm space-y-1 mb-4">
                    <li>
                      Email us at privacy@certifai.com with &quot;AI Data Usage&quot; in the subject
                      line
                    </li>
                    <li>Use our privacy request form (link in Privacy Policy)</li>
                    <li>
                      Contact our Data Protection Officer if you&apos;re in a jurisdiction that
                      requires one
                    </li>
                    <li>Exercise your rights under applicable privacy laws (GDPR, CCPA, etc.)</li>
                  </ul>

                  <div className="bg-green-100 dark:bg-green-800/30 p-4 rounded border-l-4 border-green-500">
                    <p className="text-green-900 dark:text-green-100 text-xs font-semibold mb-2">
                      Response Limitations
                    </p>
                    <p className="text-green-800 dark:text-green-200 text-xs">
                      We will make reasonable efforts to respond to privacy requests within
                      applicable legal timeframes, but cannot guarantee specific response times or
                      outcomes. Complex technical requests may require additional time or may not be
                      feasible to fulfill completely. Our ability to provide detailed information
                      about AI systems may be limited by proprietary technology considerations.
                    </p>
                  </div>
                </div>
              </section>

              {/* Payment Terms */}
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-4">
                  11. Payment Terms
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
                  12. Disclaimers and Limitation of Liability
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
                    WE DO NOT WARRANT THAT USE OF THE PLATFORM WILL RESULT IN CERTIFICATION SUCCESS,
                    PASSING GRADES, OR ANY SPECIFIC EXAM OUTCOMES
                  </li>
                  <li>
                    WE DO NOT GUARANTEE THAT PRACTICE SCORES WILL CORRELATE WITH ACTUAL EXAM
                    PERFORMANCE
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
                  <li>ANY FAILURE TO PASS CERTIFICATION EXAMS OR ACHIEVE DESIRED EXAM SCORES</li>
                  <li>ANY COSTS ASSOCIATED WITH RETAKING CERTIFICATION EXAMS</li>
                  <li>ANY LOST TIME, PREPARATION COSTS, OR STUDY EXPENSES</li>
                  <li>ANY CAREER OPPORTUNITIES LOST DUE TO CERTIFICATION EXAM FAILURES</li>
                  <li>ANY RELIANCE ON PRACTICE SCORES OR PERFORMANCE PREDICTIONS</li>
                  <li>ANY ERRORS OR INACCURACIES IN AI-GENERATED CONTENT</li>
                  <li>ANY COPYRIGHT CLAIMS RELATED TO AI-GENERATED CONTENT</li>
                  <li>ANY UNAUTHORIZED ACCESS TO OR ALTERATION OF YOUR DATA</li>
                  <li>ANY DAMAGES RESULTING FROM YOUR USE OR INABILITY TO USE THE PLATFORM</li>
                </ul>

                <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                  OUR TOTAL LIABILITY TO YOU FOR ALL CLAIMS ARISING FROM OR RELATING TO THESE TERMS
                  OR THE PLATFORM SHALL NOT EXCEED THE GREATER OF:
                </p>
                <ul className="list-disc pl-6 text-slate-700 dark:text-slate-300 space-y-2 mb-4">
                  <li>THE TOTAL AMOUNT YOU PAID TO US IN THE 6 MONTHS PRECEDING THE CLAIM</li>
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
                  13. Indemnification
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
                  14. Termination
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
                  15. Governing Law and Jurisdiction
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
                  16. Force Majeure
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
                  17. Changes to Terms
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
                  18. International Customer Rights and Compliance
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
                  19. Severability
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
                  20. Entire Agreement
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
                  21. Contact Information
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
                  These Terms of Service are effective as of June 26, 2025, and apply to all users
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
