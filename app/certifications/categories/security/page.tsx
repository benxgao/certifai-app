import { Metadata } from 'next';
import Link from 'next/link';
import LandingHeader from '@/src/components/custom/LandingHeader';
import MarketingFooter from '@/src/components/custom/MarketingFooter';
import Breadcrumbs from '@/src/components/navigation/Breadcrumbs';
import { Badge } from '@/src/components/ui/badge';
import { Card, CardContent } from '@/src/components/ui/card';
import {
  FaShieldAlt,
  FaLock,
  FaEye,
  FaBug,
  FaUsers,
  FaClock,
  FaArrowRight,
  FaStar,
  FaTrophy,
} from 'react-icons/fa';

export const metadata: Metadata = {
  title: 'Cybersecurity Certifications | CompTIA Security+, CISSP, CEH Training | Certestic',
  description:
    'Master cybersecurity with AI-powered practice exams for CompTIA Security+, CISSP, CEH, CySA+, and more. Boost your security career with industry-recognized certifications.',
  keywords: [
    'cybersecurity certifications',
    'CompTIA Security+',
    'CISSP certification',
    'CEH certification',
    'CySA+ certification',
    'cybersecurity training',
    'ethical hacking',
    'network security',
    'information security',
    'cyber analyst',
    'security engineer',
    'penetration testing',
  ],
  openGraph: {
    title: 'Cybersecurity Certifications - Security+, CISSP, CEH | Certestic',
    description:
      'Launch your cybersecurity career with comprehensive training for top security certifications.',
    url: '/certifications/categories/security',
    type: 'website',
  },
  alternates: {
    canonical: '/certifications/categories/security',
  },
};

interface SecurityCertification {
  name: string;
  slug: string;
  firmCode: string;
  firmName: string;
  description: string;
  level: 'Entry-level' | 'Intermediate' | 'Advanced' | 'Expert';
  avgSalary: string;
  demandScore: number;
  studyTime: string;
  prerequisites?: string;
  icon: React.ReactNode;
  color: string;
  featured: boolean;
  jobRoles: string[];
}

const securityCertifications: SecurityCertification[] = [
  {
    name: 'CompTIA Security+',
    slug: 'comptia-security',
    firmCode: 'COMPTIA',
    firmName: 'CompTIA',
    description:
      'Essential cybersecurity certification covering network security, risk management, cryptography, and incident response. Perfect entry point for security careers.',
    level: 'Entry-level',
    avgSalary: '$95,000',
    demandScore: 90,
    studyTime: '4-8 weeks',
    icon: <FaShieldAlt className="text-red-500" />,
    color: 'border-red-200 hover:border-red-400',
    featured: true,
    jobRoles: ['Security Analyst', 'SOC Analyst', 'IT Security Specialist'],
  },
  {
    name: 'Certified Information Systems Security Professional (CISSP)',
    slug: 'certified-information-systems-security-professional-cissp',
    firmCode: 'ISC2',
    firmName: '(ISC)² International',
    description:
      'Advanced certification for experienced security professionals. Covers security architecture, risk management, and governance.',
    level: 'Expert',
    avgSalary: '$140,000',
    demandScore: 88,
    studyTime: '12-16 weeks',
    prerequisites: '5 years security experience',
    icon: <FaLock className="text-purple-500" />,
    color: 'border-purple-200 hover:border-purple-400',
    featured: true,
    jobRoles: ['CISO', 'Security Manager', 'Security Architect'],
  },
  {
    name: 'Certified Ethical Hacker (CEH)',
    slug: 'certified-ethical-hacker-ceh',
    firmCode: 'ECCOUNCIL',
    firmName: 'EC-Council',
    description:
      "Learn ethical hacking techniques and penetration testing methodologies. Understand vulnerabilities from an attacker's perspective.",
    level: 'Intermediate',
    avgSalary: '$110,000',
    demandScore: 82,
    studyTime: '8-12 weeks',
    icon: <FaBug className="text-orange-500" />,
    color: 'border-orange-200 hover:border-orange-400',
    featured: true,
    jobRoles: ['Penetration Tester', 'Security Consultant', 'Ethical Hacker'],
  },
  {
    name: 'CompTIA CySA+ (Cybersecurity Analyst)',
    slug: 'comptia-cysa-cybersecurity-analyst',
    firmCode: 'COMPTIA',
    firmName: 'CompTIA',
    description:
      'Intermediate-level certification focusing on threat detection, analysis, and response. Perfect for SOC analysts and incident responders.',
    level: 'Intermediate',
    avgSalary: '$105,000',
    demandScore: 78,
    studyTime: '6-10 weeks',
    prerequisites: 'Security+ recommended',
    icon: <FaEye className="text-blue-500" />,
    color: 'border-blue-200 hover:border-blue-400',
    featured: true,
    jobRoles: ['Cyber Analyst', 'SOC Analyst', 'Threat Hunter'],
  },
  {
    name: 'CompTIA PenTest+',
    slug: 'comptia-pentest',
    firmCode: 'COMPTIA',
    firmName: 'CompTIA',
    description:
      'Hands-on penetration testing skills including planning, scoping, vulnerability identification, and reporting.',
    level: 'Intermediate',
    avgSalary: '$115,000',
    demandScore: 75,
    studyTime: '8-12 weeks',
    prerequisites: 'Network+ and Security+',
    icon: <FaShieldAlt className="text-green-500" />,
    color: 'border-green-200 hover:border-green-400',
    featured: false,
    jobRoles: ['Penetration Tester', 'Security Analyst', 'Vulnerability Assessor'],
  },
  {
    name: 'CISSP Associate',
    slug: 'cissp-associate',
    firmCode: 'ISC2',
    firmName: '(ISC)² International',
    description:
      'Entry path to CISSP for professionals with less than 5 years experience. Covers all CISSP domains.',
    level: 'Intermediate',
    avgSalary: '$100,000',
    demandScore: 72,
    studyTime: '10-14 weeks',
    icon: <FaLock className="text-indigo-500" />,
    color: 'border-indigo-200 hover:border-indigo-400',
    featured: false,
    jobRoles: ['Security Analyst', 'Information Security Officer', 'Risk Analyst'],
  },
  {
    name: 'CISM (Certified Information Security Manager)',
    slug: 'certified-information-security-manager-cism',
    firmCode: 'ISACA',
    firmName: 'ISACA',
    description:
      'Management-level certification focusing on information security strategy, governance, and risk management.',
    level: 'Expert',
    avgSalary: '$145,000',
    demandScore: 80,
    studyTime: '12-16 weeks',
    prerequisites: '5 years management experience',
    icon: <FaShieldAlt className="text-teal-500" />,
    color: 'border-teal-200 hover:border-teal-400',
    featured: false,
    jobRoles: ['Security Manager', 'CISO', 'IT Risk Manager'],
  },
  {
    name: 'GCIH (GIAC Certified Incident Handler)',
    slug: 'giac-certified-incident-handler-gcih',
    firmCode: 'GIAC',
    firmName: 'GIAC (SANS)',
    description:
      'Hands-on incident response and digital forensics skills. Learn to detect, respond to, and recover from security incidents.',
    level: 'Advanced',
    avgSalary: '$125,000',
    demandScore: 70,
    studyTime: '10-14 weeks',
    icon: <FaEye className="text-red-600" />,
    color: 'border-red-200 hover:border-red-400',
    featured: false,
    jobRoles: ['Incident Response Analyst', 'Digital Forensics Investigator', 'SOC Manager'],
  },
];

const getLevelColor = (level: string) => {
  switch (level) {
    case 'Entry-level':
      return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
    case 'Intermediate':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
    case 'Advanced':
      return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300';
    case 'Expert':
      return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
  }
};

const breadcrumbItems = [
  { name: 'Certifications', href: '/certifications' },
  { name: 'Cybersecurity', current: true },
];

export default function SecurityCertificationsPage() {
  const featuredCertifications = securityCertifications.filter((cert) => cert.featured);
  const allCertifications = securityCertifications;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-red-50/30 dark:from-slate-900 dark:to-slate-800">
      <LandingHeader />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumbs items={breadcrumbItems} className="mb-8" />

        {/* Hero Section */}
        <section className="text-center mb-16 relative">
          {/* Background Elements */}
          <div className="absolute inset-0 bg-gradient-to-br from-red-50/50 via-transparent to-purple-50/30 dark:from-red-900/10 dark:via-transparent dark:to-purple-900/10 rounded-3xl"></div>
          <div className="absolute top-10 right-10 w-64 h-64 bg-red-200/20 dark:bg-red-600/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 left-10 w-80 h-80 bg-purple-200/20 dark:bg-purple-600/10 rounded-full blur-3xl"></div>

          <div className="relative z-10 py-16">
            <div className="inline-flex items-center gap-2 bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800/50 rounded-full px-4 py-2 mb-6">
              <FaShieldAlt className="text-red-600 dark:text-red-400" />
              <span className="text-sm font-medium text-red-700 dark:text-red-300">
                Cybersecurity Certifications
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-slate-100 mb-6">
              Launch Your
              <span className="bg-gradient-to-r from-red-600 to-purple-600 bg-clip-text text-transparent">
                {' '}
                Cybersecurity{' '}
              </span>
              Career
            </h1>

            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-4xl mx-auto leading-relaxed mb-8">
              Protect organizations from cyber threats with industry-leading security
              certifications. From CompTIA Security+ to CISSP, master the skills that make you
              indispensable in today&apos;s threat landscape with our AI-powered practice exams.
            </p>

            {/* Stats */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-8 mb-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-red-600 dark:text-red-400">
                  {allCertifications.length}+
                </div>
                <div className="text-sm text-slate-500 dark:text-slate-400">
                  Security Certifications
                </div>
              </div>
              <div className="hidden sm:block w-px h-12 bg-slate-200 dark:bg-slate-700"></div>
              <div className="text-center">
                <div className="text-3xl font-bold text-red-600 dark:text-red-400">$95k-$145k</div>
                <div className="text-sm text-slate-500 dark:text-slate-400">
                  Average Salary Range
                </div>
              </div>
              <div className="hidden sm:block w-px h-12 bg-slate-200 dark:bg-slate-700"></div>
              <div className="text-center">
                <div className="text-3xl font-bold text-red-600 dark:text-red-400">3.5M</div>
                <div className="text-sm text-slate-500 dark:text-slate-400">
                  Unfilled Cyber Jobs
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Certifications */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <FaTrophy className="text-yellow-500 text-xl" />
            <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
              Most In-Demand Security Certifications
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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

                  {/* Job Roles */}
                  <div className="mb-4">
                    <div className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Career Paths:
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {cert.jobRoles.slice(0, 3).map((role, idx) => (
                        <span
                          key={idx}
                          className="inline-block px-2 py-1 text-xs font-medium bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 rounded-md"
                        >
                          {role}
                        </span>
                      ))}
                    </div>
                  </div>

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
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        Prerequisite: {cert.prerequisites}
                      </div>
                    )}
                  </div>

                  <Link
                    href={`/certifications/${cert.firmCode}/${cert.slug}`}
                    className="w-full inline-flex items-center justify-between px-4 py-3 bg-gradient-to-r from-red-600 to-purple-600 hover:from-red-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-200 transform group-hover:scale-105"
                  >
                    <span>Start Practice Exam</span>
                    <FaArrowRight className="group-hover:translate-x-1 transition-transform duration-200" />
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* All Security Certifications */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-8">
            All Cybersecurity Certifications
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {allCertifications.map((cert) => (
              <Card
                key={cert.slug}
                className="group bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-red-300 dark:hover:border-red-600 shadow-md hover:shadow-lg transition-all duration-300"
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="text-xl">{cert.icon}</div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-slate-900 dark:text-slate-100 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
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
                          className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 font-medium text-sm transition-colors"
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
            Why Cybersecurity Certifications Are Critical in 2025
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-3">
                Growing Threat Landscape
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                Cyberattacks increase by 15% annually, creating massive demand for security
                professionals.
                <Link
                  href="/certifications/COMPTIA/comptia-security"
                  className="text-red-600 hover:text-red-700 ml-1"
                >
                  CompTIA Security+
                </Link>{' '}
                certified professionals are essential for defending against ransomware, data
                breaches, and advanced persistent threats targeting organizations worldwide.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-3">
                Skills Gap Crisis
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                3.5 million cybersecurity jobs remain unfilled globally. Organizations desperately
                need professionals with{' '}
                <Link
                  href="/certifications/ISC2/certified-information-systems-security-professional-cissp"
                  className="text-red-600 hover:text-red-700"
                >
                  CISSP
                </Link>{' '}
                and
                <Link
                  href="/certifications/ECCOUNCIL/certified-ethical-hacker-ceh"
                  className="text-red-600 hover:text-red-700 ml-1"
                >
                  CEH certifications
                </Link>{' '}
                to lead security initiatives, conduct penetration testing, and manage incident
                response programs.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-3">
                Regulatory Requirements
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                Compliance frameworks like SOX, HIPAA, and GDPR mandate certified security
                professionals.
                <Link
                  href="/certifications/COMPTIA/comptia-cysa-cybersecurity-analyst"
                  className="text-red-600 hover:text-red-700"
                >
                  CySA+
                </Link>{' '}
                and
                <Link
                  href="/certifications/ISACA/certified-information-security-manager-cism"
                  className="text-red-600 hover:text-red-700 ml-1"
                >
                  CISM certifications
                </Link>{' '}
                demonstrate the expertise required to ensure organizational compliance and avoid
                costly regulatory penalties.
              </p>
            </div>
          </div>
        </section>
      </main>

      <MarketingFooter />
    </div>
  );
}
