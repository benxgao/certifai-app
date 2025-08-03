import React from 'react';
import Link from 'next/link';

interface RelatedCertification {
  name: string;
  firmCode: string;
  slug: string;
  level: string;
  description: string;
}

interface RelatedCertificationsProps {
  currentFirmCode: string;
  currentSlug: string;
  className?: string;
}

// Predefined related certifications by firm
const RELATED_CERTIFICATIONS: Record<string, RelatedCertification[]> = {
  AWS: [
    {
      name: 'AWS Certified Solutions Architect - Associate',
      firmCode: 'AWS',
      slug: 'aws-certified-solutions-architect',
      level: 'Associate',
      description: 'Design and deploy scalable systems on AWS',
    },
    {
      name: 'AWS Certified Developer - Associate',
      firmCode: 'AWS',
      slug: 'aws-certified-developer-associate',
      level: 'Associate',
      description: 'Build and maintain applications on AWS',
    },
    {
      name: 'AWS Certified SysOps Administrator - Associate',
      firmCode: 'AWS',
      slug: 'aws-certified-sysops-administrator-associate',
      level: 'Associate',
      description: 'Deploy, manage, and operate systems on AWS',
    },
    {
      name: 'AWS Certified Cloud Practitioner',
      firmCode: 'AWS',
      slug: 'aws-certified-cloud-practitioner',
      level: 'Foundational',
      description: 'Fundamental understanding of AWS Cloud',
    },
  ],
  AZURE: [
    {
      name: 'Microsoft Azure Fundamentals',
      firmCode: 'AZURE',
      slug: 'microsoft-certified-azure-fundamentals',
      level: 'Fundamental',
      description: 'Basic knowledge of cloud services',
    },
    {
      name: 'Azure Administrator Associate',
      firmCode: 'AZURE',
      slug: 'microsoft-certified-azure-administrator-associate',
      level: 'Associate',
      description: 'Implement, manage, and monitor Azure environments',
    },
    {
      name: 'Azure Developer Associate',
      firmCode: 'AZURE',
      slug: 'microsoft-certified-azure-developer-associate',
      level: 'Associate',
      description: 'Design, build, test, and maintain cloud applications',
    },
    {
      name: 'Azure Solutions Architect Expert',
      firmCode: 'AZURE',
      slug: 'microsoft-certified-azure-solutions-architect-expert',
      level: 'Expert',
      description: 'Design solutions that run on Azure',
    },
  ],
  GCP: [
    {
      name: 'Google Cloud Digital Leader',
      firmCode: 'GCP',
      slug: 'google-cloud-digital-leader',
      level: 'Foundational',
      description: 'Fundamental knowledge of Google Cloud',
    },
    {
      name: 'Associate Cloud Engineer',
      firmCode: 'GCP',
      slug: 'google-cloud-associate-cloud-engineer',
      level: 'Associate',
      description: 'Deploy applications and monitor operations',
    },
    {
      name: 'Professional Cloud Architect',
      firmCode: 'GCP',
      slug: 'google-cloud-professional-cloud-architect',
      level: 'Professional',
      description: 'Design and plan cloud solution architecture',
    },
    {
      name: 'Professional Data Engineer',
      firmCode: 'GCP',
      slug: 'google-cloud-professional-data-engineer',
      level: 'Professional',
      description: 'Design and build data processing systems',
    },
  ],
  COMPTIA: [
    {
      name: 'CompTIA Security+',
      firmCode: 'COMPTIA',
      slug: 'comptia-security',
      level: 'Intermediate',
      description: 'Core cybersecurity skills for any tech role',
    },
    {
      name: 'CompTIA Network+',
      firmCode: 'COMPTIA',
      slug: 'comptia-network',
      level: 'Intermediate',
      description: 'Essential networking concepts and skills',
    },
    {
      name: 'CompTIA A+',
      firmCode: 'COMPTIA',
      slug: 'comptia-a',
      level: 'Entry-level',
      description: 'Foundation for IT support roles',
    },
    {
      name: 'CompTIA CySA+',
      firmCode: 'COMPTIA',
      slug: 'comptia-cysa-cybersecurity-analyst',
      level: 'Intermediate',
      description: 'Cybersecurity analyst skills',
    },
  ],
};

export default function RelatedCertifications({
  currentFirmCode,
  currentSlug,
  className = '',
}: RelatedCertificationsProps) {
  const relatedCerts = RELATED_CERTIFICATIONS[currentFirmCode] || [];

  // Filter out the current certification
  const filteredCerts = relatedCerts.filter((cert) => cert.slug !== currentSlug);

  // Show max 3 related certifications
  const displayCerts = filteredCerts.slice(0, 3);

  if (displayCerts.length === 0) {
    return null;
  }

  return (
    <section className={`py-12 bg-slate-50 dark:bg-slate-900/50 ${className}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100 mb-4">
              Related {currentFirmCode} Certifications
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-lg">
              Expand your expertise with these complementary certifications
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayCerts.map((cert) => (
              <Link
                key={cert.slug}
                href={`/certifications/${cert.firmCode}/${cert.slug}`}
                className="group block"
              >
                <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 p-6 h-full border border-slate-200 dark:border-slate-700 hover:border-violet-300 dark:hover:border-violet-600 group-hover:-translate-y-1">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 px-2 py-1 rounded-full text-xs font-medium">
                          {cert.level}
                        </span>
                        <span className="bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 px-2 py-1 rounded-full text-xs font-medium">
                          {cert.firmCode}
                        </span>
                      </div>
                      <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors duration-200">
                        {cert.name}
                      </h3>
                      <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                        {cert.description}
                      </p>
                    </div>
                    <svg
                      className="w-5 h-5 text-slate-400 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors duration-200 ml-2 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>

                  <div className="pt-4 border-t border-slate-100 dark:border-slate-700">
                    <div className="flex items-center text-violet-600 dark:text-violet-400 text-sm font-medium group-hover:text-violet-700 dark:group-hover:text-violet-300 transition-colors duration-200">
                      <span>View Details</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Link to all certifications */}
          <div className="text-center mt-8">
            <Link
              href={`/certifications/${currentFirmCode}`}
              className="inline-flex items-center gap-2 text-violet-600 hover:text-violet-700 dark:text-violet-400 dark:hover:text-violet-300 font-medium transition-colors duration-200"
            >
              <span>View all {currentFirmCode} certifications</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
