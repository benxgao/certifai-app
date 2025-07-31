import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Certestic | AI-Powered IT Certification Training for AWS, Azure, GCP & More | Free Beta',
  description:
    'Master AWS, Azure, GCP, and 50+ IT certifications with AI-powered practice exams. Adaptive learning technology creates personalized study plans that help you pass certifications faster.',
  keywords: [
    'Certestic',
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
    'AI-powered certification study',
    'adaptive learning technology',
    'IT professional development',
    'cloud computing certifications',
    'networking certification prep',
    'security certification training',
    'beta testing platform',
    'free certification training',
    'machine learning education',
    'IT career advancement',
    'certification success platform',
    'knowledge mastery assessment',
    'personalized exam preparation',
    'realistic exam simulation',
    'professional certification training',
  ].join(', '),
  authors: [{ name: 'Certestic Team' }],
  creator: 'Certestic',
  publisher: 'Certestic',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: 'Certestic | AI-Powered IT Certification Training for AWS, Azure, GCP & More',
    description:
      'Master AWS, Azure, GCP, and 50+ IT certifications with AI-powered practice exams. Adaptive learning technology creates personalized study plans to help you pass certifications faster.',
    type: 'website',
    locale: 'en_US',
    url: 'https://certestic.com',
    siteName: 'Certestic',
    images: [
      {
        url: '/favicon.ico',
        width: 256,
        height: 256,
        alt: 'Certestic - AI-Powered IT Certification Training Platform for AWS, Azure, GCP',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Certestic | Master AWS, Azure, GCP & IT Certifications with AI-Powered Practice Exams',
    description:
      'AI-powered practice exams for AWS, Azure, GCP, CompTIA, and 50+ IT certifications. Adaptive learning technology with personalized study plans and realistic exam simulation.',
    creator: '@Certestic',
    site: '@Certestic',
    images: [
      {
        url: '/favicon.ico',
        alt: 'Certestic - AI-Powered IT Certification Training Platform',
      },
    ],
  },
  alternates: {
    canonical: 'https://certestic.com',
  },
  category: 'Education',
  applicationName: 'Certestic',
  referrer: 'origin-when-cross-origin',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
};
