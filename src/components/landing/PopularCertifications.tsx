import React from 'react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { FaAward, FaUsers, FaClock, FaArrowRight } from 'react-icons/fa';

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

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case 'Beginner':
      return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
    case 'Intermediate':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
    case 'Advanced':
      return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
  }
};

export default function PopularCertifications() {
  return (
    <section
      className="py-16 sm:py-20 lg:py-24 relative overflow-hidden"
      aria-labelledby="popular-certs-heading"
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-50/30 via-transparent to-blue-50/30 dark:from-violet-900/10 dark:via-transparent dark:to-blue-900/10"></div>
      <div className="absolute top-10 left-10 w-72 h-72 bg-violet-200/10 dark:bg-violet-600/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-200/10 dark:bg-blue-600/5 rounded-full blur-3xl"></div>

      <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-4xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 bg-violet-100 dark:bg-violet-900/30 border border-violet-200 dark:border-violet-800/50 rounded-full px-4 py-2 mb-6">
            <FaAward className="text-violet-600 dark:text-violet-400" />
            <span className="text-sm font-medium text-violet-700 dark:text-violet-300">
              Most Popular IT Certifications
            </span>
          </div>

          <h2
            id="popular-certs-heading"
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-slate-100 mb-6"
          >
            Start Your IT Career with
            <span className="bg-gradient-to-r from-violet-600 to-blue-600 bg-clip-text text-transparent">
              {' '}
              High-Demand Certifications
            </span>
          </h2>

          <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 leading-relaxed">
            Master the most sought-after IT certifications with AI-powered practice exams. These
            certifications are proven to boost salaries and open new career opportunities in cloud
            computing, cybersecurity, and enterprise IT.
          </p>
        </div>

        {/* Certifications Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {popularCertifications.map((cert, index) => (
            <Card
              key={cert.slug}
              className="group bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border border-slate-200/60 dark:border-slate-700/60 hover:border-violet-300/60 dark:hover:border-violet-600/60 shadow-lg hover:shadow-xl dark:hover:shadow-slate-900/30 transition-all duration-300 transform hover:-translate-y-2 rounded-2xl overflow-hidden"
            >
              <CardContent className="p-6">
                {/* Header with badges */}
                <div className="flex items-start justify-between mb-4">
                  <Badge
                    variant="secondary"
                    className="text-xs font-medium bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300"
                  >
                    {cert.firmName}
                  </Badge>
                  <Badge className={`text-xs ${getDifficultyColor(cert.difficulty)}`}>
                    {cert.difficulty}
                  </Badge>
                </div>

                {/* Certification Title */}
                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-3 line-clamp-2 group-hover:text-violet-700 dark:group-hover:text-violet-300 transition-colors">
                  {cert.name}
                </h3>

                {/* Description */}
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-4 line-clamp-3">
                  {cert.description}
                </p>

                {/* Keywords */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {cert.keywords.slice(0, 4).map((keyword, idx) => (
                    <span
                      key={idx}
                      className="inline-block px-2 py-1 text-xs font-medium bg-violet-50 dark:bg-violet-900/20 text-violet-700 dark:text-violet-300 rounded-md"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                    <FaClock className="text-blue-500" />
                    <span>{cert.avgStudyTime}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                    <FaUsers className="text-green-500" />
                    <span>{cert.popularityScore}% popular</span>
                  </div>
                </div>

                {/* CTA Button */}
                <Link
                  href={`/certifications/${cert.firmCode}/${cert.slug}`}
                  className="w-full inline-flex items-center justify-between px-4 py-3 bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-700 hover:to-blue-700 text-white font-semibold rounded-xl transition-all duration-200 transform group-hover:scale-105 hover:shadow-lg"
                >
                  <span>Start Practice Exam</span>
                  <FaArrowRight className="group-hover:translate-x-1 transition-transform duration-200" />
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* View All CTA */}
        <div className="text-center">
          <Link
            href="/certifications"
            className="inline-flex items-center gap-3 px-8 py-4 bg-white/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 hover:border-violet-300 dark:hover:border-violet-600 text-slate-900 dark:text-slate-100 font-semibold rounded-xl transition-all duration-200 hover:shadow-lg transform hover:scale-105"
          >
            <span>View All 50+ IT Certifications</span>
            <FaArrowRight />
          </Link>
        </div>

        {/* SEO-optimized text content */}
        <div className="mt-16 max-w-4xl mx-auto">
          <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-2xl p-8 border border-slate-200/60 dark:border-slate-700/60">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">
              Why Choose AI-Powered IT Certification Training?
            </h3>
            <div className="grid md:grid-cols-2 gap-6 text-slate-600 dark:text-slate-400">
              <div>
                <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">
                  Cloud Computing Certifications
                </h4>
                <p className="text-sm leading-relaxed">
                  Master AWS Solutions Architect, Microsoft Azure Administrator, and Google Cloud
                  Professional certifications with AI-powered practice exams that adapt to your
                  learning pace and identify knowledge gaps.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">
                  Cybersecurity & Networking
                </h4>
                <p className="text-sm leading-relaxed">
                  Excel in CompTIA Security+, Cisco CCNA, and other networking certifications with
                  realistic exam simulations that mirror actual certification test environments and
                  question formats.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
