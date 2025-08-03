import { Metadata } from 'next';
import Link from 'next/link';
import LandingHeader from '@/src/components/custom/LandingHeader';
import MarketingFooter from '@/src/components/custom/MarketingFooter';
import Breadcrumbs from '@/src/components/navigation/Breadcrumbs';
import { Badge } from '@/src/components/ui/badge';
import { Card, CardContent } from '@/src/components/ui/card';
import {
  FaCloud,
  FaAws,
  FaMicrosoft,
  FaGoogle,
  FaUsers,
  FaClock,
  FaArrowRight,
  FaStar,
  FaTrophy,
} from 'react-icons/fa';

export const metadata: Metadata = {
  title: 'Cloud Computing Certifications | AWS, Azure, GCP Training | Certestic',
  description:
    'Master cloud computing with AI-powered practice exams for AWS Solutions Architect, Microsoft Azure Administrator, Google Cloud Professional, and more. Start your cloud certification journey today.',
  keywords: [
    'cloud computing certifications',
    'AWS certifications',
    'Azure certifications',
    'Google Cloud certifications',
    'cloud architect',
    'cloud engineer',
    'cloud practitioner',
    'AWS Solutions Architect',
    'Azure Administrator',
    'GCP Professional',
    'cloud certification training',
  ],
  openGraph: {
    title: 'Cloud Computing Certifications - AWS, Azure, GCP | Certestic',
    description:
      'Excel in cloud computing with comprehensive certification training for AWS, Microsoft Azure, and Google Cloud Platform.',
    url: '/certifications/categories/cloud',
    type: 'website',
  },
  alternates: {
    canonical: '/certifications/categories/cloud',
  },
};

interface CloudCertification {
  name: string;
  slug: string;
  firmCode: string;
  firmName: string;
  description: string;
  level: 'Foundational' | 'Associate' | 'Professional' | 'Expert';
  avgSalary: string;
  demandScore: number;
  studyTime: string;
  prerequisites?: string;
  icon: React.ReactNode;
  color: string;
  featured: boolean;
}

const cloudCertifications: CloudCertification[] = [
  // AWS Certifications
  {
    name: 'AWS Certified Solutions Architect - Associate',
    slug: 'aws-certified-solutions-architect',
    firmCode: 'AWS',
    firmName: 'Amazon Web Services',
    description:
      'Design and deploy scalable, highly available systems on AWS. Master EC2, S3, VPC, RDS, and architectural best practices.',
    level: 'Associate',
    avgSalary: '$130,000',
    demandScore: 95,
    studyTime: '8-12 weeks',
    icon: <FaAws className="text-orange-500" />,
    color: 'border-orange-200 hover:border-orange-400',
    featured: true,
  },
  {
    name: 'AWS Certified Cloud Practitioner',
    slug: 'aws-certified-cloud-practitioner',
    firmCode: 'AWS',
    firmName: 'Amazon Web Services',
    description:
      'Foundational understanding of AWS Cloud concepts, services, security, architecture, pricing, and support.',
    level: 'Foundational',
    avgSalary: '$90,000',
    demandScore: 88,
    studyTime: '4-6 weeks',
    icon: <FaAws className="text-orange-500" />,
    color: 'border-orange-200 hover:border-orange-400',
    featured: false,
  },
  {
    name: 'AWS Certified Developer - Associate',
    slug: 'aws-certified-developer-associate',
    firmCode: 'AWS',
    firmName: 'Amazon Web Services',
    description:
      'Develop and maintain applications on AWS. Focus on Lambda, API Gateway, DynamoDB, and deployment practices.',
    level: 'Associate',
    avgSalary: '$125,000',
    demandScore: 87,
    studyTime: '6-10 weeks',
    icon: <FaAws className="text-orange-500" />,
    color: 'border-orange-200 hover:border-orange-400',
    featured: true,
  },
  {
    name: 'AWS Certified SysOps Administrator - Associate',
    slug: 'aws-certified-sysops-administrator-associate',
    firmCode: 'AWS',
    firmName: 'Amazon Web Services',
    description:
      'Deploy, manage, and operate scalable, highly available systems on AWS cloud platform.',
    level: 'Associate',
    avgSalary: '$120,000',
    demandScore: 82,
    studyTime: '8-10 weeks',
    icon: <FaAws className="text-orange-500" />,
    color: 'border-orange-200 hover:border-orange-400',
    featured: false,
  },

  // Azure Certifications
  {
    name: 'Microsoft Azure Fundamentals',
    slug: 'microsoft-certified-azure-fundamentals',
    firmCode: 'AZURE',
    firmName: 'Microsoft Azure',
    description:
      'Foundational knowledge of cloud services and how they are provided with Microsoft Azure.',
    level: 'Foundational',
    avgSalary: '$85,000',
    demandScore: 89,
    studyTime: '3-5 weeks',
    icon: <FaMicrosoft className="text-blue-500" />,
    color: 'border-blue-200 hover:border-blue-400',
    featured: false,
  },
  {
    name: 'Azure Administrator Associate',
    slug: 'microsoft-certified-azure-administrator-associate',
    firmCode: 'AZURE',
    firmName: 'Microsoft Azure',
    description:
      'Implement, manage, and monitor Azure environments including virtual machines, storage, and networking.',
    level: 'Associate',
    avgSalary: '$118,000',
    demandScore: 88,
    studyTime: '6-10 weeks',
    icon: <FaMicrosoft className="text-blue-500" />,
    color: 'border-blue-200 hover:border-blue-400',
    featured: true,
  },
  {
    name: 'Azure Solutions Architect Expert',
    slug: 'microsoft-certified-azure-solutions-architect-expert',
    firmCode: 'AZURE',
    firmName: 'Microsoft Azure',
    description:
      'Design solutions that run on Azure, including compute, network, storage, and security aspects.',
    level: 'Expert',
    avgSalary: '$145,000',
    demandScore: 85,
    studyTime: '12-16 weeks',
    prerequisites: 'Azure Administrator Associate',
    icon: <FaMicrosoft className="text-blue-500" />,
    color: 'border-blue-200 hover:border-blue-400',
    featured: true,
  },

  // Google Cloud Certifications
  {
    name: 'Google Cloud Digital Leader',
    slug: 'google-cloud-digital-leader',
    firmCode: 'GCP',
    firmName: 'Google Cloud Platform',
    description:
      'Foundational knowledge of cloud technology and data to support business transformation.',
    level: 'Foundational',
    avgSalary: '$88,000',
    demandScore: 78,
    studyTime: '4-6 weeks',
    icon: <FaGoogle className="text-green-500" />,
    color: 'border-green-200 hover:border-green-400',
    featured: false,
  },
  {
    name: 'Associate Cloud Engineer',
    slug: 'google-cloud-associate-cloud-engineer',
    firmCode: 'GCP',
    firmName: 'Google Cloud Platform',
    description:
      'Deploy applications, monitor operations, and manage enterprise solutions on Google Cloud.',
    level: 'Associate',
    avgSalary: '$115,000',
    demandScore: 80,
    studyTime: '6-8 weeks',
    icon: <FaGoogle className="text-green-500" />,
    color: 'border-green-200 hover:border-green-400',
    featured: false,
  },
  {
    name: 'Professional Cloud Architect',
    slug: 'google-cloud-professional-cloud-architect',
    firmCode: 'GCP',
    firmName: 'Google Cloud Platform',
    description:
      'Design and plan cloud solution architecture, manage and provision infrastructure, and ensure security.',
    level: 'Professional',
    avgSalary: '$140,000',
    demandScore: 82,
    studyTime: '10-14 weeks',
    icon: <FaGoogle className="text-green-500" />,
    color: 'border-green-200 hover:border-green-400',
    featured: true,
  },
];

const getLevelColor = (level: string) => {
  switch (level) {
    case 'Foundational':
      return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
    case 'Associate':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
    case 'Professional':
      return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300';
    case 'Expert':
      return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
  }
};

const breadcrumbItems = [
  { name: 'Certifications', href: '/certifications' },
  { name: 'Cloud Computing', current: true },
];

export default function CloudCertificationsPage() {
  const featuredCertifications = cloudCertifications.filter((cert) => cert.featured);
  const allCertifications = cloudCertifications;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 dark:from-slate-900 dark:to-slate-800">
      <LandingHeader />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumbs items={breadcrumbItems} className="mb-8" />

        {/* Hero Section */}
        <section className="text-center mb-16 relative">
          {/* Background Elements */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-violet-50/30 dark:from-blue-900/10 dark:via-transparent dark:to-violet-900/10 rounded-3xl"></div>
          <div className="absolute top-10 right-10 w-64 h-64 bg-blue-200/20 dark:bg-blue-600/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 left-10 w-80 h-80 bg-violet-200/20 dark:bg-violet-600/10 rounded-full blur-3xl"></div>

          <div className="relative z-10 py-16">
            <div className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800/50 rounded-full px-4 py-2 mb-6">
              <FaCloud className="text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                Cloud Computing Certifications
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-slate-100 mb-6">
              Master
              <span className="bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
                {' '}
                Cloud Computing{' '}
              </span>
              Certifications
            </h1>

            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-4xl mx-auto leading-relaxed mb-8">
              Launch your cloud career with industry-leading certifications from AWS, Microsoft
              Azure, and Google Cloud Platform. Our AI-powered practice exams help you master cloud
              architecture, administration, and development skills that employers demand.
            </p>

            {/* Stats */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-8 mb-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                  {allCertifications.length}+
                </div>
                <div className="text-sm text-slate-500 dark:text-slate-400">
                  Cloud Certifications
                </div>
              </div>
              <div className="hidden sm:block w-px h-12 bg-slate-200 dark:bg-slate-700"></div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                  $90k-$150k
                </div>
                <div className="text-sm text-slate-500 dark:text-slate-400">
                  Average Salary Range
                </div>
              </div>
              <div className="hidden sm:block w-px h-12 bg-slate-200 dark:bg-slate-700"></div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">95%</div>
                <div className="text-sm text-slate-500 dark:text-slate-400">Job Market Demand</div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Certifications */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <FaTrophy className="text-yellow-500 text-xl" />
            <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
              Most Popular Cloud Certifications
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredCertifications.map((cert) => (
              <Card
                key={cert.slug}
                className={`group bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border-2 ${cert.color} shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 rounded-xl overflow-hidden`}
              >
                <CardContent className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">{cert.icon}</div>
                      <Badge variant="secondary" className="text-xs">
                        {cert.firmName}
                      </Badge>
                    </div>
                    <Badge className={`text-xs ${getLevelColor(cert.level)}`}>{cert.level}</Badge>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-3 line-clamp-2">
                    {cert.name}
                  </h3>

                  <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-4 line-clamp-3">
                    {cert.description}
                  </p>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                      <FaClock className="text-blue-500" />
                      <span>{cert.studyTime}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                      <FaUsers className="text-green-500" />
                      <span>{cert.demandScore}% demand</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                      <FaStar className="text-yellow-500" />
                      <span>{cert.avgSalary} avg</span>
                    </div>
                    {cert.prerequisites && (
                      <div className="col-span-2 text-xs text-slate-500 dark:text-slate-400">
                        Prerequisite: {cert.prerequisites}
                      </div>
                    )}
                  </div>

                  <Link
                    href={`/certifications/${cert.firmCode}/${cert.slug}`}
                    className="w-full inline-flex items-center justify-between px-4 py-3 bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white font-semibold rounded-xl transition-all duration-200 transform group-hover:scale-105"
                  >
                    <span>Start Practice Exam</span>
                    <FaArrowRight className="group-hover:translate-x-1 transition-transform duration-200" />
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* All Cloud Certifications */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-8">
            All Cloud Computing Certifications
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {allCertifications.map((cert) => (
              <Card
                key={cert.slug}
                className="group bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600 shadow-md hover:shadow-lg transition-all duration-300"
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="text-xl">{cert.icon}</div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {cert.name}
                        </h3>
                        <Badge className={`text-xs ${getLevelColor(cert.level)}`}>
                          {cert.level}
                        </Badge>
                      </div>

                      <p className="text-slate-600 dark:text-slate-400 text-sm mb-3 line-clamp-2">
                        {cert.description}
                      </p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                          <span>{cert.studyTime}</span>
                          <span>•</span>
                          <span>{cert.avgSalary}</span>
                        </div>

                        <Link
                          href={`/certifications/${cert.firmCode}/${cert.slug}`}
                          className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium text-sm transition-colors"
                        >
                          Learn More →
                        </Link>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* SEO Content Section */}
        <section className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-2xl p-8 border border-slate-200/60 dark:border-slate-700/60">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-6">
            Why Cloud Computing Certifications Matter in 2025
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-3">
                High Demand Skills
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                Cloud computing continues to be the fastest-growing IT sector. Companies worldwide
                are migrating to cloud platforms, creating unprecedented demand for certified cloud
                professionals.{' '}
                <Link
                  href="/certifications/AWS/aws-certified-solutions-architect"
                  className="text-blue-600 hover:text-blue-700"
                >
                  AWS Solutions Architect
                </Link>{' '}
                and
                <Link
                  href="/certifications/AZURE/microsoft-certified-azure-administrator-associate"
                  className="text-blue-600 hover:text-blue-700 ml-1"
                >
                  Azure Administrator
                </Link>{' '}
                certifications consistently rank among the highest-paying IT credentials.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-3">
                Career Advancement
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                Cloud certifications provide immediate career benefits including salary increases,
                promotion opportunities, and job security. Professionals with
                <Link
                  href="/certifications/GCP/google-cloud-professional-cloud-architect"
                  className="text-blue-600 hover:text-blue-700 ml-1"
                >
                  Google Cloud
                </Link>{' '}
                or
                <Link href="/certifications/AWS" className="text-blue-600 hover:text-blue-700 ml-1">
                  AWS certifications
                </Link>{' '}
                report 15-25% salary increases and access to senior-level cloud architect positions.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-3">
                Future-Proof Technology
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                Cloud technologies form the foundation of modern digital transformation initiatives.
                By mastering cloud certifications, you&apos;re investing in skills that will remain
                relevant and valuable throughout your career. Start with foundational certifications
                like{' '}
                <Link
                  href="/certifications/AWS/aws-certified-cloud-practitioner"
                  className="text-blue-600 hover:text-blue-700"
                >
                  AWS Cloud Practitioner
                </Link>{' '}
                and progress to advanced architect-level credentials.
              </p>
            </div>
          </div>
        </section>
      </main>

      <MarketingFooter />
    </div>
  );
}
