import { Metadata } from 'next';
import Link from 'next/link';
import LandingHeader from '@/src/components/custom/LandingHeader';
import MarketingFooter from '@/src/components/custom/MarketingFooter';
import Breadcrumbs from '@/src/components/navigation/Breadcrumbs';
import { Badge } from '@/src/components/ui/badge';
import { Card, CardContent } from '@/src/components/ui/card';
import {
  FaNetworkWired,
  FaServer,
  FaWifi,
  FaRoute,
  FaUsers,
  FaClock,
  FaArrowRight,
  FaStar,
  FaTrophy,
} from 'react-icons/fa';

export const metadata: Metadata = {
  title: 'Networking Certifications | Cisco CCNA, CompTIA Network+, CCNP Training | Certestic',
  description:
    'Master networking with AI-powered practice exams for Cisco CCNA, CompTIA Network+, CCNP, and more. Build your network engineering career with industry-standard certifications.',
  keywords: [
    'networking certifications',
    'Cisco CCNA',
    'CompTIA Network+',
    'CCNP certification',
    'network engineer',
    'network administrator',
    'routing and switching',
    'network security',
    'wireless networking',
    'network infrastructure',
    'Cisco training',
    'network protocols',
  ],
  openGraph: {
    title: 'Networking Certifications - CCNA, Network+, CCNP | Certestic',
    description:
      'Build your networking career with comprehensive training for Cisco and CompTIA networking certifications.',
    url: '/certifications/categories/networking',
    type: 'website',
  },
  alternates: {
    canonical: '/certifications/categories/networking',
  },
};

interface NetworkingCertification {
  name: string;
  slug: string;
  firmCode: string;
  firmName: string;
  description: string;
  level: 'Entry-level' | 'Associate' | 'Professional' | 'Expert';
  avgSalary: string;
  demandScore: number;
  studyTime: string;
  prerequisites?: string;
  icon: React.ReactNode;
  color: string;
  featured: boolean;
  jobRoles: string[];
  technologies: string[];
}

const networkingCertifications: NetworkingCertification[] = [
  {
    name: 'Cisco Certified Network Associate (CCNA)',
    slug: 'cisco-certified-network-associate-ccna',
    firmCode: 'CISCO',
    firmName: 'Cisco',
    description:
      'Foundation networking certification covering routing, switching, wireless, and network fundamentals. Essential for network engineers and administrators.',
    level: 'Associate',
    avgSalary: '$85,000',
    demandScore: 85,
    studyTime: '6-12 weeks',
    icon: <FaNetworkWired className="text-blue-600" />,
    color: 'border-blue-200 hover:border-blue-400',
    featured: true,
    jobRoles: ['Network Engineer', 'Network Administrator', 'Network Technician'],
    technologies: ['Routing', 'Switching', 'OSPF', 'EIGRP', 'VLANs'],
  },
  {
    name: 'CompTIA Network+',
    slug: 'comptia-network',
    firmCode: 'COMPTIA',
    firmName: 'CompTIA',
    description:
      'Vendor-neutral networking certification covering network technologies, installation, configuration, and troubleshooting across various platforms.',
    level: 'Entry-level',
    avgSalary: '$75,000',
    demandScore: 78,
    studyTime: '4-8 weeks',
    icon: <FaServer className="text-green-600" />,
    color: 'border-green-200 hover:border-green-400',
    featured: true,
    jobRoles: ['Network Technician', 'Help Desk', 'Junior Network Admin'],
    technologies: ['TCP/IP', 'DNS', 'DHCP', 'VPN', 'Subnetting'],
  },
  {
    name: 'Cisco Certified Network Professional (CCNP) Enterprise',
    slug: 'cisco-certified-network-professional-ccnp-enterprise',
    firmCode: 'CISCO',
    firmName: 'Cisco',
    description:
      'Advanced networking certification focusing on enterprise networking solutions, including automation, security, and optimization.',
    level: 'Professional',
    avgSalary: '$110,000',
    demandScore: 75,
    studyTime: '12-16 weeks',
    prerequisites: 'CCNA recommended',
    icon: <FaRoute className="text-purple-600" />,
    color: 'border-purple-200 hover:border-purple-400',
    featured: true,
    jobRoles: ['Senior Network Engineer', 'Network Architect', 'Network Consultant'],
    technologies: ['BGP', 'MPLS', 'QoS', 'Network Automation', 'SD-WAN'],
  },
  {
    name: 'Juniper Networks Certified Associate (JNCIA-Junos)',
    slug: 'juniper-networks-certified-associate-jncia-junos',
    firmCode: 'JUNIPER',
    firmName: 'Juniper Networks',
    description:
      'Entry-level Juniper certification covering Junos OS fundamentals, routing, and switching on Juniper platforms.',
    level: 'Associate',
    avgSalary: '$80,000',
    demandScore: 65,
    studyTime: '6-10 weeks',
    icon: <FaNetworkWired className="text-teal-600" />,
    color: 'border-teal-200 hover:border-teal-400',
    featured: false,
    jobRoles: ['Juniper Network Engineer', 'Network Operations', 'NOC Engineer'],
    technologies: ['Junos OS', 'Routing Protocols', 'Firewall Filters', 'MPLS'],
  },
  {
    name: 'Cisco Certified Internetwork Expert (CCIE) Enterprise Infrastructure',
    slug: 'cisco-certified-internetwork-expert-ccie-enterprise-infrastructure',
    firmCode: 'CISCO',
    firmName: 'Cisco',
    description:
      'Expert-level certification demonstrating advanced skills in enterprise infrastructure technologies and complex network design.',
    level: 'Expert',
    avgSalary: '$150,000',
    demandScore: 90,
    studyTime: '24-36 weeks',
    prerequisites: 'CCNP Enterprise',
    icon: <FaServer className="text-red-600" />,
    color: 'border-red-200 hover:border-red-400',
    featured: true,
    jobRoles: ['Network Architect', 'Senior Network Consultant', 'Technical Lead'],
    technologies: ['Advanced Routing', 'Network Design', 'Troubleshooting', 'Automation'],
  },
  {
    name: 'VMware Certified Professional - Network Virtualization (VCP-NV)',
    slug: 'vmware-certified-professional-network-virtualization-vcp-nv',
    firmCode: 'VMWARE',
    firmName: 'VMware',
    description:
      'Specialized certification for network virtualization using VMware NSX, covering micro-segmentation and software-defined networking.',
    level: 'Professional',
    avgSalary: '$125,000',
    demandScore: 70,
    studyTime: '10-14 weeks',
    icon: <FaWifi className="text-indigo-600" />,
    color: 'border-indigo-200 hover:border-indigo-400',
    featured: false,
    jobRoles: ['Network Virtualization Engineer', 'SDN Architect', 'Cloud Network Engineer'],
    technologies: ['NSX', 'Micro-segmentation', 'Load Balancing', 'VPN'],
  },
  {
    name: 'Aruba Certified Mobility Professional (ACMP)',
    slug: 'aruba-certified-mobility-professional-acmp',
    firmCode: 'ARUBA',
    firmName: 'Aruba (HPE)',
    description:
      'Wireless networking certification focusing on Aruba wireless solutions, mobility, and network access control.',
    level: 'Professional',
    avgSalary: '$95,000',
    demandScore: 60,
    studyTime: '8-12 weeks',
    icon: <FaWifi className="text-orange-600" />,
    color: 'border-orange-200 hover:border-orange-400',
    featured: false,
    jobRoles: ['Wireless Network Engineer', 'WiFi Specialist', 'Network Security Engineer'],
    technologies: ['802.11', 'Wireless Security', 'Network Access Control', 'Mobility'],
  },
  {
    name: 'Fortinet Network Security Expert (NSE)',
    slug: 'fortinet-network-security-expert-nse',
    firmCode: 'FORTINET',
    firmName: 'Fortinet',
    description:
      'Network security certification combining networking and security skills using Fortinet FortiGate firewalls and security appliances.',
    level: 'Professional',
    avgSalary: '$105,000',
    demandScore: 68,
    studyTime: '10-12 weeks',
    icon: <FaNetworkWired className="text-red-500" />,
    color: 'border-red-200 hover:border-red-400',
    featured: false,
    jobRoles: ['Network Security Engineer', 'Firewall Administrator', 'Security Analyst'],
    technologies: ['FortiGate', 'VPN', 'Intrusion Prevention', 'Web Filtering'],
  },
];

const getLevelColor = (level: string) => {
  switch (level) {
    case 'Entry-level':
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
  { name: 'Networking', current: true },
];

export default function NetworkingCertificationsPage() {
  const featuredCertifications = networkingCertifications.filter((cert) => cert.featured);
  const allCertifications = networkingCertifications;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-green-50/30 dark:from-slate-900 dark:to-slate-800">
      <LandingHeader />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumbs items={breadcrumbItems} className="mb-8" />

        {/* Hero Section */}
        <section className="text-center mb-16 relative">
          {/* Background Elements */}
          <div className="absolute inset-0 bg-gradient-to-br from-green-50/50 via-transparent to-blue-50/30 dark:from-green-900/10 dark:via-transparent dark:to-blue-900/10 rounded-3xl"></div>
          <div className="absolute top-10 right-10 w-64 h-64 bg-green-200/20 dark:bg-green-600/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 left-10 w-80 h-80 bg-blue-200/20 dark:bg-blue-600/10 rounded-full blur-3xl"></div>

          <div className="relative z-10 py-16">
            <div className="inline-flex items-center gap-2 bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-800/50 rounded-full px-4 py-2 mb-6">
              <FaNetworkWired className="text-green-600 dark:text-green-400" />
              <span className="text-sm font-medium text-green-700 dark:text-green-300">
                Networking Certifications
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-slate-100 mb-6">
              Build the
              <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                {' '}
                Network Backbone{' '}
              </span>
              of Tomorrow
            </h1>

            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-4xl mx-auto leading-relaxed mb-8">
              Master networking fundamentals and advanced technologies with industry-leading
              certifications from Cisco, CompTIA, and other top vendors. From CCNA to expert-level
              credentials, build the skills that power global connectivity.
            </p>

            {/* Stats */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-8 mb-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                  {allCertifications.length}+
                </div>
                <div className="text-sm text-slate-500 dark:text-slate-400">
                  Network Certifications
                </div>
              </div>
              <div className="hidden sm:block w-px h-12 bg-slate-200 dark:bg-slate-700"></div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                  $75k-$150k
                </div>
                <div className="text-sm text-slate-500 dark:text-slate-400">
                  Average Salary Range
                </div>
              </div>
              <div className="hidden sm:block w-px h-12 bg-slate-200 dark:bg-slate-700"></div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 dark:text-green-400">85%</div>
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
              Essential Network Engineering Certifications
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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

                  {/* Technologies */}
                  <div className="mb-4">
                    <div className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Key Technologies:
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {cert.technologies.slice(0, 4).map((tech, idx) => (
                        <span
                          key={idx}
                          className="inline-block px-2 py-1 text-xs font-medium bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-md"
                        >
                          {tech}
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
                    className="w-full inline-flex items-center justify-between px-4 py-3 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-semibold rounded-xl transition-all duration-200 transform group-hover:scale-105"
                  >
                    <span>Start Practice Exam</span>
                    <FaArrowRight className="group-hover:translate-x-1 transition-transform duration-200" />
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* All Networking Certifications */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-8">
            All Networking Certifications
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {allCertifications.map((cert) => (
              <Card
                key={cert.slug}
                className="group bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-green-300 dark:hover:border-green-600 shadow-md hover:shadow-lg transition-all duration-300"
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="text-xl">{cert.icon}</div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-slate-900 dark:text-slate-100 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
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
                          className="text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 font-medium text-sm transition-colors"
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
            Why Networking Certifications Remain Essential in 2025
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-3">
                Network Infrastructure Growth
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                Digital transformation drives massive network expansion worldwide. Organizations
                need
                <Link
                  href="/certifications/CISCO/cisco-certified-network-associate-ccna"
                  className="text-green-600 hover:text-green-700 ml-1"
                >
                  CCNA certified
                </Link>{' '}
                professionals to design, implement, and maintain complex network infrastructures
                supporting cloud migration, IoT devices, and remote workforce connectivity.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-3">
                Software-Defined Networking
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                SDN and network automation revolutionize traditional networking approaches.
                <Link
                  href="/certifications/CISCO/cisco-certified-network-professional-ccnp-enterprise"
                  className="text-green-600 hover:text-green-700"
                >
                  CCNP Enterprise
                </Link>{' '}
                and
                <Link
                  href="/certifications/VMWARE/vmware-certified-professional-network-virtualization-vcp-nv"
                  className="text-green-600 hover:text-green-700 ml-1"
                >
                  VCP-NV certifications
                </Link>{' '}
                provide the advanced skills needed for next-generation network architectures and
                programmable infrastructure.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-3">
                Network Security Integration
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                Modern networks must integrate security at every layer.
                <Link
                  href="/certifications/COMPTIA/comptia-network"
                  className="text-green-600 hover:text-green-700"
                >
                  CompTIA Network+
                </Link>{' '}
                and
                <Link
                  href="/certifications/FORTINET/fortinet-network-security-expert-nse"
                  className="text-green-600 hover:text-green-700 ml-1"
                >
                  Fortinet NSE certifications
                </Link>{' '}
                combine networking fundamentals with security expertise, preparing professionals for
                roles where network performance and security converge.
              </p>
            </div>
          </div>
        </section>
      </main>

      <MarketingFooter />
    </div>
  );
}
