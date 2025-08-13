import React from 'react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ActionButton } from '@/src/components/custom/ActionButton';
import { FaAward, FaArrowRight } from 'react-icons/fa';

interface PopularCertification {
  name: string;
  slug: string;
  firmCode: string;
  firmName: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  avgStudyTime: string;
  popularityScore: number;
  keywords: string[];
}

const popularCertifications: PopularCertification[] = [
  {
    name: 'AWS Certified Solutions Architect - Associate',
    slug: 'aws-certified-solutions-architect',
    firmCode: 'AWS',
    firmName: 'Amazon Web Services',
    description:
      'Master AWS cloud architecture with hands-on practice exams covering EC2, S3, VPC, IAM, and more. The most sought-after cloud certification for IT professionals.',
    difficulty: 'Intermediate',
    avgStudyTime: '8-12 weeks',
    popularityScore: 95,
    keywords: ['AWS', 'cloud architect', 'EC2', 'S3', 'VPC', 'IAM'],
  },
  {
    name: 'Microsoft Certified: Azure Administrator Associate',
    slug: 'microsoft-certified-azure-administrator-associate',
    firmCode: 'AZURE',
    firmName: 'Microsoft Azure',
    description:
      'Excel in Azure administration with comprehensive practice covering virtual machines, storage, networking, and Active Directory integration.',
    difficulty: 'Intermediate',
    avgStudyTime: '6-10 weeks',
    popularityScore: 88,
    keywords: ['Azure', 'administrator', 'virtual machines', 'Active Directory'],
  },
  {
    name: 'Google Cloud Professional Cloud Architect',
    slug: 'google-cloud-professional-cloud-architect',
    firmCode: 'GCP',
    firmName: 'Google Cloud Platform',
    description:
      'Design scalable GCP solutions with AI-powered practice exams covering Compute Engine, BigQuery, Kubernetes, and cloud-native architectures.',
    difficulty: 'Advanced',
    avgStudyTime: '10-14 weeks',
    popularityScore: 82,
    keywords: ['Google Cloud', 'GCP', 'cloud architect', 'Kubernetes', 'BigQuery'],
  },
  {
    name: 'CompTIA Security+',
    slug: 'comptia-security',
    firmCode: 'COMPTIA',
    firmName: 'CompTIA',
    description:
      'Essential cybersecurity certification covering network security, risk management, cryptography, and incident response for IT security professionals.',
    difficulty: 'Beginner',
    avgStudyTime: '4-8 weeks',
    popularityScore: 90,
    keywords: ['CompTIA', 'cybersecurity', 'network security', 'risk management'],
  },
  {
    name: 'Cisco Certified Network Associate (CCNA)',
    slug: 'cisco-certified-network-associate-ccna',
    firmCode: 'CISCO',
    firmName: 'Cisco',
    description:
      'Foundation networking knowledge with practice exams covering routing, switching, wireless, and network fundamentals for network engineers.',
    difficulty: 'Intermediate',
    avgStudyTime: '6-12 weeks',
    popularityScore: 85,
    keywords: ['Cisco', 'CCNA', 'networking', 'routing', 'switching'],
  },
  {
    name: 'AWS Certified Developer - Associate',
    slug: 'aws-certified-developer-associate',
    firmCode: 'AWS',
    firmName: 'Amazon Web Services',
    description:
      'Master AWS development with practice exams covering Lambda, API Gateway, DynamoDB, and DevOps practices for cloud developers.',
    difficulty: 'Intermediate',
    avgStudyTime: '6-10 weeks',
    popularityScore: 87,
    keywords: ['AWS', 'developer', 'Lambda', 'API Gateway', 'DynamoDB'],
  },
];

// Function to get provider-specific colors
const getProviderTheme = (firmCode: string) => {
  switch (firmCode) {
    case 'AWS':
      return {
        badgeColor:
          'bg-orange-100/90 dark:bg-orange-900/40 text-orange-700 dark:text-orange-300 border-orange-200/50 dark:border-orange-800/50',
        accentColor:
          'bg-gradient-to-r from-orange-500/10 to-amber-500/10 dark:from-orange-600/20 dark:to-amber-600/20',
        borderColor: 'border-orange-200/30 dark:border-orange-800/30',
      };
    case 'AZURE':
      return {
        badgeColor:
          'bg-blue-100/90 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 border-blue-200/50 dark:border-blue-800/50',
        accentColor:
          'bg-gradient-to-r from-blue-500/10 to-cyan-500/10 dark:from-blue-600/20 dark:to-cyan-600/20',
        borderColor: 'border-blue-200/30 dark:border-blue-800/30',
      };
    case 'GCP':
      return {
        badgeColor:
          'bg-emerald-100/90 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 border-emerald-200/50 dark:border-emerald-800/50',
        accentColor:
          'bg-gradient-to-r from-emerald-500/10 to-green-500/10 dark:from-emerald-600/20 dark:to-green-600/20',
        borderColor: 'border-emerald-200/30 dark:border-emerald-800/30',
      };
    case 'COMPTIA':
      return {
        badgeColor:
          'bg-purple-100/90 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 border-purple-200/50 dark:border-purple-800/50',
        accentColor:
          'bg-gradient-to-r from-purple-500/10 to-violet-500/10 dark:from-purple-600/20 dark:to-violet-600/20',
        borderColor: 'border-purple-200/30 dark:border-purple-800/30',
      };
    case 'CISCO':
      return {
        badgeColor:
          'bg-sky-100/90 dark:bg-sky-900/40 text-sky-700 dark:text-sky-300 border-sky-200/50 dark:border-sky-800/50',
        accentColor:
          'bg-gradient-to-r from-sky-500/10 to-blue-500/10 dark:from-sky-600/20 dark:to-blue-600/20',
        borderColor: 'border-sky-200/30 dark:border-sky-800/30',
      };
    default:
      return {
        badgeColor:
          'bg-slate-100/90 dark:bg-slate-700/90 text-slate-700 dark:text-slate-300 border-slate-200/50 dark:border-slate-800/50',
        accentColor:
          'bg-gradient-to-r from-slate-500/10 to-gray-500/10 dark:from-slate-600/20 dark:to-gray-600/20',
        borderColor: 'border-slate-200/30 dark:border-slate-800/30',
      };
  }
};

export default function PopularCertifications() {
  return (
    <section className="py-16 sm:py-20 lg:py-24" aria-labelledby="popular-certs-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-4xl mx-auto mb-16 space-y-6">
          <div className="inline-flex items-center gap-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200/60 dark:border-slate-700/60 rounded-full px-4 py-2">
            <FaAward className="text-violet-600 dark:text-violet-400 h-4 w-4" />
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Most Popular IT Certifications
            </span>
          </div>

          <h2
            id="popular-certs-heading"
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-slate-50 tracking-tight"
          >
            Start Your IT Career with{' '}
            <span className="bg-gradient-to-r from-violet-600 to-blue-600 bg-clip-text text-transparent">
              High-Demand Certifications
            </span>
          </h2>

          <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
            Master the most sought-after IT certifications with AI-powered practice exams. These
            certifications are proven to boost salaries and open new career opportunities.
          </p>
        </div>

        {/* Certifications Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {popularCertifications.map((cert, index) => {
            const theme = getProviderTheme(cert.firmCode);
            return (
              <Card
                key={cert.slug}
                className={`group bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border-2 ${theme.borderColor} hover:shadow-2xl hover:shadow-violet-500/10 dark:hover:shadow-violet-400/10 transition-all duration-500 rounded-2xl overflow-hidden flex flex-col h-full hover:scale-[1.03] hover:-translate-y-2`}
              >
                {/* Colored accent bar */}
                <div className={`h-1.5 ${theme.accentColor}`}></div>

                <CardContent className="p-8 flex flex-col h-full space-y-6">
                  {/* Header with enhanced badge */}
                  <div className="flex items-start">
                    <Badge
                      variant="secondary"
                      className={`text-sm font-semibold px-4 py-2 rounded-full backdrop-blur-sm border ${theme.badgeColor}`}
                    >
                      {cert.firmName}
                    </Badge>
                  </div>

                  {/* Certification Title */}
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-50 tracking-tight line-clamp-2 leading-tight">
                    {cert.name}
                  </h3>

                  {/* Description */}
                  <p className="text-lg leading-relaxed text-slate-600 dark:text-slate-300 line-clamp-4 flex-grow">
                    {cert.description}
                  </p>

                  {/* CTA Button */}
                  <div className="pt-4">
                    <Link href={`/certifications/${cert.firmCode}/${cert.slug}`}>
                      <ActionButton
                        onClick={() => {}}
                        variant="secondary"
                        size="lg"
                        fullWidth
                        icon={<FaArrowRight className="h-4 w-4" />}
                      >
                        Start Practicing
                      </ActionButton>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* View All CTA */}
        <div className="text-center">
          <Link href="/certifications">
            <ActionButton
              onClick={() => {}}
              variant="primary"
              size="lg"
              icon={<FaArrowRight className="h-4 w-4" />}
            >
              View All 100+ IT Certifications
            </ActionButton>
          </Link>
        </div>
      </div>
    </section>
  );
}
