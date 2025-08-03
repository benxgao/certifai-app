import React from 'react';
import Link from 'next/link';

interface SEOContentProps {
  className?: string;
}

export default function SEOContentBlock({ className = '' }: SEOContentProps) {
  return (
    <div className={`seo-content-block ${className}`}>
      {/* Visible SEO content section with enhanced styling to match top sections */}
      <section
        className="relative py-16 sm:py-20 lg:py-24 overflow-hidden"
        aria-labelledby="seo-content-heading"
      >
        {/* Background decorative elements matching top sections */}
        <div className="absolute inset-0 bg-gradient-to-br from-violet-50/30 via-transparent to-blue-50/20 dark:from-violet-900/10 dark:via-transparent dark:to-blue-900/10"></div>
        <div className="absolute top-10 left-10 w-72 h-72 bg-violet-200/10 dark:bg-violet-600/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-200/10 dark:bg-blue-600/5 rounded-full blur-3xl"></div>

        <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            {/* Enhanced heading matching top section style */}
            <div className="text-center mb-16">
              <h2
                id="seo-content-heading"
                className="text-4xl lg:text-5xl xl:text-6xl font-bold text-slate-900 dark:text-slate-100 mb-6 leading-tight"
              >
                Master IT Certifications with
                <span className="bg-gradient-to-r from-violet-600 to-blue-600 bg-clip-text text-transparent block">
                  AI-Powered Training
                </span>
              </h2>
              <p className="text-xl lg:text-2xl text-slate-600 dark:text-slate-400 max-w-4xl mx-auto leading-relaxed font-light">
                Explore our comprehensive certification categories and start your journey to IT
                career success
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              {/* Cloud Computing Certifications - Enhanced card styling */}
              <div className="group relative bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border border-slate-200/60 dark:border-slate-700/60 shadow-xl rounded-3xl p-8 hover:shadow-2xl hover:border-violet-300/60 dark:hover:border-violet-700/60 transition-all duration-500 transform hover:-translate-y-3 hover:scale-105 flex flex-col h-full overflow-hidden">
                {/* Background gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-violet-50/50 via-transparent to-transparent dark:from-violet-900/20 dark:via-transparent dark:to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl"></div>

                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-br from-violet-100 via-violet-200 to-violet-300 dark:from-violet-900/40 dark:via-violet-800/40 dark:to-violet-700/40 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-all duration-500 shadow-lg">
                    <svg
                      className="w-8 h-8 text-violet-600 dark:text-violet-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.5 5.5 0 11-9.78 2.096A4.4 4.4 0 003 15z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-6 group-hover:text-violet-700 dark:group-hover:text-violet-300 transition-colors duration-300">
                    Cloud Computing Certifications
                  </h3>
                  <ul className="relative space-y-3 text-slate-600 dark:text-slate-400 flex-grow">
                    <li>
                      <Link
                        href="/certifications/AWS/aws-certified-solutions-architect"
                        className="block py-2 px-3 rounded-lg hover:bg-violet-50 dark:hover:bg-violet-900/20 hover:text-violet-600 dark:hover:text-violet-400 transition-all duration-200 font-medium"
                      >
                        AWS Solutions Architect Associate
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/certifications/AZURE/microsoft-certified-azure-administrator-associate"
                        className="block py-2 px-3 rounded-lg hover:bg-violet-50 dark:hover:bg-violet-900/20 hover:text-violet-600 dark:hover:text-violet-400 transition-all duration-200 font-medium"
                      >
                        Azure Administrator Associate
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/certifications/GCP/google-cloud-professional-cloud-architect"
                        className="block py-2 px-3 rounded-lg hover:bg-violet-50 dark:hover:bg-violet-900/20 hover:text-violet-600 dark:hover:text-violet-400 transition-all duration-200 font-medium"
                      >
                        Google Cloud Professional Architect
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/certifications/AWS/aws-certified-developer-associate"
                        className="block py-2 px-3 rounded-lg hover:bg-violet-50 dark:hover:bg-violet-900/20 hover:text-violet-600 dark:hover:text-violet-400 transition-all duration-200 font-medium"
                      >
                        AWS Developer Associate
                      </Link>
                    </li>
                    <li className="pt-2 border-t border-slate-200/50 dark:border-slate-700/50">
                      <Link
                        href="/certifications/categories/cloud"
                        className="block py-2 px-3 rounded-lg bg-gradient-to-r from-violet-50 to-blue-50 dark:from-violet-900/10 dark:to-blue-900/10 border border-violet-200/50 dark:border-violet-700/50 hover:from-violet-100 hover:to-blue-100 dark:hover:from-violet-900/20 dark:hover:to-blue-900/20 text-violet-700 dark:text-violet-300 font-semibold transition-all duration-200"
                      >
                        View All Cloud Certifications →
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Cybersecurity Certifications - Enhanced card styling */}
              <div className="group relative bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border border-slate-200/60 dark:border-slate-700/60 shadow-xl rounded-3xl p-8 hover:shadow-2xl hover:border-green-300/60 dark:hover:border-green-700/60 transition-all duration-500 transform hover:-translate-y-3 hover:scale-105 flex flex-col h-full overflow-hidden">
                {/* Background gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-green-50/50 via-transparent to-transparent dark:from-green-900/20 dark:via-transparent dark:to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl"></div>

                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-100 via-green-200 to-green-300 dark:from-green-900/40 dark:via-green-800/40 dark:to-green-700/40 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-all duration-500 shadow-lg">
                    <svg
                      className="w-8 h-8 text-green-600 dark:text-green-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-6 group-hover:text-green-700 dark:group-hover:text-green-300 transition-colors duration-300">
                    Cybersecurity Certifications
                  </h3>
                  <ul className="relative space-y-3 text-slate-600 dark:text-slate-400 flex-grow">
                    <li>
                      <Link
                        href="/certifications/COMPTIA/comptia-security"
                        className="block py-2 px-3 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20 hover:text-green-600 dark:hover:text-green-400 transition-all duration-200 font-medium"
                      >
                        CompTIA Security+ Certification
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/certifications/ISC2/certified-information-systems-security-professional-cissp"
                        className="block py-2 px-3 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20 hover:text-green-600 dark:hover:text-green-400 transition-all duration-200 font-medium"
                      >
                        CISSP Certification
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/certifications/COMPTIA/comptia-cysa-cybersecurity-analyst"
                        className="block py-2 px-3 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20 hover:text-green-600 dark:hover:text-green-400 transition-all duration-200 font-medium"
                      >
                        CompTIA CySA+ Certification
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/certifications/COMPTIA/certified-ethical-hacker-ceh"
                        className="block py-2 px-3 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20 hover:text-green-600 dark:hover:text-green-400 transition-all duration-200 font-medium"
                      >
                        Certified Ethical Hacker (CEH)
                      </Link>
                    </li>
                    <li className="pt-2 border-t border-slate-200/50 dark:border-slate-700/50">
                      <Link
                        href="/certifications/categories/security"
                        className="block py-2 px-3 rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/10 dark:to-emerald-900/10 border border-green-200/50 dark:border-green-700/50 hover:from-green-100 hover:to-emerald-100 dark:hover:from-green-900/20 dark:hover:to-emerald-900/20 text-green-700 dark:text-green-300 font-semibold transition-all duration-200"
                      >
                        View All Security Certifications →
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Networking & Infrastructure - Enhanced card styling */}
              <div className="group relative bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border border-slate-200/60 dark:border-slate-700/60 shadow-xl rounded-3xl p-8 hover:shadow-2xl hover:border-blue-300/60 dark:hover:border-blue-700/60 transition-all duration-500 transform hover:-translate-y-3 hover:scale-105 flex flex-col h-full overflow-hidden">
                {/* Background gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-transparent dark:from-blue-900/20 dark:via-transparent dark:to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl"></div>

                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300 dark:from-blue-900/40 dark:via-blue-800/40 dark:to-blue-700/40 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-all duration-500 shadow-lg">
                    <svg
                      className="w-8 h-8 text-blue-600 dark:text-blue-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01"
                      />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-6 group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors duration-300">
                    Networking & Infrastructure
                  </h3>
                  <ul className="relative space-y-3 text-slate-600 dark:text-slate-400 flex-grow">
                    <li>
                      <Link
                        href="/certifications/CISCO/cisco-certified-network-associate-ccna"
                        className="block py-2 px-3 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200 font-medium"
                      >
                        Cisco CCNA Certification
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/certifications/COMPTIA/comptia-network"
                        className="block py-2 px-3 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200 font-medium"
                      >
                        CompTIA Network+ Certification
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/certifications/VMWARE/vmware-certified-professional-data-center-virtualization-vcp-dcv"
                        className="block py-2 px-3 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200 font-medium"
                      >
                        VMware VCP-DCV Certification
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/certifications/REDHAT/red-hat-certified-system-administrator-rhcsa"
                        className="block py-2 px-3 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200 font-medium"
                      >
                        Red Hat RHCSA Certification
                      </Link>
                    </li>
                    <li className="pt-2 border-t border-slate-200/50 dark:border-slate-700/50">
                      <Link
                        href="/certifications/categories/networking"
                        className="block py-2 px-3 rounded-lg bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/10 dark:to-cyan-900/10 border border-blue-200/50 dark:border-blue-700/50 hover:from-blue-100 hover:to-cyan-100 dark:hover:from-blue-900/20 dark:hover:to-cyan-900/20 text-blue-700 dark:text-blue-300 font-semibold transition-all duration-200"
                      >
                        View All Networking Certifications →
                      </Link>
                    </li>
                  </ul>
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
