import React from 'react';
import Link from 'next/link';

interface SEOContentProps {
  className?: string;
}

export default function SEOContentBlock({ className = '' }: SEOContentProps) {
  return (
    <div className={`seo-content-block ${className}`}>
      {/* Visible SEO content section for better user experience and SEO */}
      <section
        className="py-16 bg-slate-50 dark:bg-slate-900/50"
        aria-labelledby="seo-content-heading"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <h2
              id="seo-content-heading"
              className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-8 text-center"
            >
              Master IT Certifications with AI-Powered Training
            </h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {/* Cloud Computing Certifications */}
              <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-md">
                <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-4">
                  Cloud Computing Certifications
                </h3>
                <ul className="space-y-2 text-slate-600 dark:text-slate-400">
                  <li>
                    <Link
                      href="/certifications/AWS/aws-certified-solutions-architect"
                      className="hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
                    >
                      AWS Solutions Architect Associate
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/certifications/AZURE/microsoft-certified-azure-administrator-associate"
                      className="hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
                    >
                      Azure Administrator Associate
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/certifications/GCP/google-cloud-professional-cloud-architect"
                      className="hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
                    >
                      Google Cloud Professional Architect
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/certifications/AWS/aws-certified-developer-associate"
                      className="hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
                    >
                      AWS Developer Associate
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Cybersecurity Certifications */}
              <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-md">
                <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-4">
                  Cybersecurity Certifications
                </h3>
                <ul className="space-y-2 text-slate-600 dark:text-slate-400">
                  <li>
                    <Link
                      href="/certifications/COMPTIA/comptia-security"
                      className="hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
                    >
                      CompTIA Security+ Certification
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/certifications/ISC2/certified-information-systems-security-professional-cissp"
                      className="hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
                    >
                      CISSP Certification
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/certifications/COMPTIA/comptia-cysa-cybersecurity-analyst"
                      className="hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
                    >
                      CompTIA CySA+ Certification
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/certifications/COMPTIA/certified-ethical-hacker-ceh"
                      className="hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
                    >
                      Certified Ethical Hacker (CEH)
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Networking & Infrastructure */}
              <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-md">
                <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-4">
                  Networking & Infrastructure
                </h3>
                <ul className="space-y-2 text-slate-600 dark:text-slate-400">
                  <li>
                    <Link
                      href="/certifications/CISCO/cisco-certified-network-associate-ccna"
                      className="hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
                    >
                      Cisco CCNA Certification
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/certifications/COMPTIA/comptia-network"
                      className="hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
                    >
                      CompTIA Network+ Certification
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/certifications/VMWARE/vmware-certified-professional-data-center-virtualization-vcp-dcv"
                      className="hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
                    >
                      VMware VCP-DCV Certification
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/certifications/REDHAT/red-hat-certified-system-administrator-rhcsa"
                      className="hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
                    >
                      Red Hat RHCSA Certification
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            {/* Additional SEO content */}
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-4">
                    Why Choose AI-Powered IT Certification Training?
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 mb-4">
                    Traditional IT certification study methods often lack personalization and fail
                    to identify specific knowledge gaps. Our AI-powered platform revolutionizes
                    certification preparation by creating adaptive learning experiences tailored to
                    your unique learning style and career goals.
                  </p>
                  <p className="text-slate-600 dark:text-slate-400">
                    Whether you&apos;re pursuing{' '}
                    <Link
                      href="/certifications/AWS"
                      className="text-violet-600 hover:text-violet-700"
                    >
                      AWS certifications
                    </Link>
                    ,
                    <Link
                      href="/certifications/AZURE"
                      className="text-violet-600 hover:text-violet-700 ml-1"
                    >
                      Microsoft Azure credentials
                    </Link>
                    , or
                    <Link
                      href="/certifications/COMPTIA"
                      className="text-violet-600 hover:text-violet-700 ml-1"
                    >
                      CompTIA certifications
                    </Link>
                    , our platform provides the most effective preparation available.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-4">
                    Comprehensive Certification Coverage
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 mb-4">
                    From cloud computing fundamentals to advanced cybersecurity practices, our
                    platform covers the full spectrum of in-demand IT certifications. Master
                    technologies like AWS EC2, Azure Active Directory, Google Cloud Kubernetes
                    Engine, and enterprise security frameworks.
                  </p>
                  <p className="text-slate-600 dark:text-slate-400">
                    Join thousands of IT professionals who have accelerated their careers with our
                    <Link
                      href="/certifications"
                      className="text-violet-600 hover:text-violet-700 ml-1"
                    >
                      comprehensive certification training platform
                    </Link>
                    . Start your journey today with our free beta access.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Hidden SEO content for search engines */}
      <div className="sr-only">
        <h2>AI-Powered IT Certification Training for AWS, Azure, GCP & More</h2>
        <p>
          Certestic revolutionizes IT certification preparation with AI-powered practice exams for
          AWS, Microsoft Azure, Google Cloud Platform, CompTIA, Cisco, and 50+ other certifications.
          Our adaptive learning technology creates personalized study plans that help IT
          professionals pass their certifications faster.
        </p>

        <h3>Comprehensive IT Certification Coverage</h3>
        <ul>
          <li>AWS Solutions Architect, Developer, and SysOps Administrator certifications</li>
          <li>Microsoft Azure Fundamentals, Administrator, and Architect certifications</li>
          <li>Google Cloud Platform Professional Cloud Architect and Associate certifications</li>
          <li>CompTIA Security+, Network+, A+, and CySA+ certifications</li>
          <li>Cisco CCNA, CCNP, and cybersecurity certifications</li>
          <li>VMware vSphere, NSX, and cloud management certifications</li>
        </ul>

        <h3>AI-Powered Certification Preparation</h3>
        <p>
          Our platform supports major IT certification programs with intelligent practice exams that
          adapt to your learning style. Whether you&apos;re pursuing cloud computing certifications
          (AWS, Azure, GCP), cybersecurity credentials (CompTIA Security+, CISSP), or networking
          certifications (Cisco CCNA, CompTIA Network+), our AI creates personalized study
          experiences that target your knowledge gaps.
        </p>

        <h3>Why Choose Certestic Over Generic Study Methods</h3>
        <ul>
          <li>Professional exam interface designed specifically for IT certifications</li>
          <li>Real-time adaptive learning that adjusts difficulty based on performance</li>
          <li>Comprehensive progress tracking across AWS, Azure, GCP domains</li>
          <li>Realistic exam simulation with proper timing and question formats</li>
          <li>Advanced analytics showing mastery levels for specific technologies</li>
          <li>
            Detailed explanations for cloud services, networking concepts, and security protocols
          </li>
        </ul>

        <h3>Accelerate Your IT Career with Targeted Certification Training</h3>
        <p>
          Join thousands of IT professionals who use Certestic to advance their careers with cloud
          and technology certifications. Our AI-powered platform provides superior preparation
          compared to traditional study methods, offering personalized practice exams, real-time
          progress tracking, and professional exam simulation designed specifically for AWS, Azure,
          GCP, and other IT certification success.
        </p>
      </div>
    </div>
  );
}

// Optional: Export SEO keywords for use in metadata
export const seoKeywords = [
  'AWS certification practice exams',
  'Azure certification training',
  'GCP practice tests',
  'CompTIA Security+ exam prep',
  'IT certification AI training',
  'cloud certification practice',
  'AWS Solutions Architect practice',
  'Azure Administrator exam prep',
  'Google Cloud certification study',
  'Cisco CCNA practice exams',
  'cybersecurity certification prep',
  'VMware certification training',
];

// SEO meta descriptions for different contexts
export const seoDescriptions = {
  homepage:
    'Master AWS, Azure, GCP, and 50+ IT certifications with AI-powered practice exams. Adaptive learning technology creates personalized study plans to help you pass certifications faster.',
  certifications:
    'Browse comprehensive IT certifications including AWS Solutions Architect, Microsoft Azure Administrator, Google Cloud Professional, CompTIA Security+, and more with AI-powered practice exams.',
  individual: (certName: string, firmCode: string) =>
    `AI-powered practice exams for ${certName} certification. Personalized study plans and realistic exam simulation for ${firmCode} certification success.`,
  about:
    'Learn how Certestic helps IT professionals master AWS, Azure, GCP, and other certifications with AI-powered practice exams and adaptive learning technology.',
  pricing:
    'Affordable pricing for AI-powered IT certification training. Choose the perfect plan for AWS, Azure, GCP, CompTIA, and other certification preparation.',
};
