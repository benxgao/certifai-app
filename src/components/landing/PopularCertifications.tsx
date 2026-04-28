import React from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { ActionButton } from '@/src/components/custom/ActionButton';
import { FaArrowRight } from 'react-icons/fa';

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
      'Practice AWS cloud architecture with hands-on exams covering EC2, S3, VPC, IAM, and more. Available for IT professionals.',
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
      'Practice AWS development with exams covering Lambda, API Gateway, DynamoDB, and DevOps practices for cloud developers.',
    difficulty: 'Intermediate',
    avgStudyTime: '6-10 weeks',
    popularityScore: 87,
    keywords: ['AWS', 'developer', 'Lambda', 'API Gateway', 'DynamoDB'],
  },
];

export default function PopularCertifications() {
  return (
    <section className="py-16 sm:py-20 lg:py-24" aria-labelledby="popular-certs-heading">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
          <h2
            id="popular-certs-heading"
            className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-slate-50 tracking-tight"
          >
            Available topics
          </h2>

          <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-light">
            Choose from cloud platforms, security, networking, and 100+ certification paths.
          </p>
        </div>

        {/* Certifications Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {popularCertifications.map((cert) => (
            <Card
              key={cert.slug}
              className="group bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border border-slate-200/60 dark:border-slate-700/60 shadow-md rounded-2xl overflow-hidden flex flex-col h-full hover:shadow-md transition-colors duration-300"
            >
              <CardContent className="p-8 flex flex-col h-full space-y-6">
                {/* Firm Name */}
                <div className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                  {cert.firmName}
                </div>

                {/* Certification Title */}
                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-50 tracking-tight line-clamp-3 leading-tight min-h-[4.5rem] flex items-start">
                  {cert.name}
                </h3>

                {/* Description */}
                <p className="text-base leading-relaxed text-slate-600 dark:text-slate-400 line-clamp-3 flex-grow">
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
          ))}
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
              Explore All Topics
            </ActionButton>
          </Link>
        </div>
      </div>
    </section>
  );
}
