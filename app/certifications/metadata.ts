import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'IT Certifications Directory | Browse 100+ AWS, Azure, GCP, Cisco & More Certifications',
  description:
    'Explore our comprehensive directory of IT certifications from leading tech companies. Find AWS Solutions Architect, Azure Administrator, Google Cloud Associate Engineer, CompTIA Security+, Cisco CCNA, VMware certifications and 100+ more programs. Get AI-powered practice exams and personalized preparation paths for each certification.',
  keywords: [
    'IT certifications directory',
    'AWS certifications',
    'Microsoft Azure certifications',
    'Google Cloud certifications',
    'Cisco certifications',
    'CompTIA certifications',
    'cybersecurity certifications',
    'cloud certifications',
    'IT certification programs',
    'certification catalog',
    'professional certifications',
    'cloud architect certification',
    'security certifications',
    'networking certifications',
    'database certifications',
    'DevOps certifications',
    'IT training programs',
    'tech certifications',
    'career advancement certifications',
    'high-demand IT certs',
    'certification exam prep',
    'online certification training',
    'self-paced certification',
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
    title: 'Browse IT Certifications | AWS, Azure, GCP, Cisco & More | Certestic',
    description:
      'Discover 100+ IT certifications from top tech companies. Prepare with AI-powered practice exams and personalized study paths.',
    type: 'website',
    locale: 'en_US',
    url: 'https://certestic.com/certifications',
    siteName: 'Certestic',
    images: [
      {
        url: 'https://certestic.com/og-certifications.png',
        width: 1200,
        height: 630,
        alt: 'Certestic Certifications - Browse IT Certifications',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Browse 100+ IT Certifications | Certestic',
    description:
      'Explore AWS, Azure, GCP, Cisco, and CompTIA certifications. Create personalized study plans with AI-powered practice exams.',
    creator: '@Certestic',
    site: '@Certestic',
    images: [
      {
        url: 'https://certestic.com/og-certifications.png',
        alt: 'Certestic Certifications Directory',
      },
    ],
  },
  alternates: {
    canonical: 'https://certestic.com/certifications',
  },
  category: 'Education',
};
