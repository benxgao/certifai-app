import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI Study Guides | Personalized Learning Paths for IT Certifications',
  description:
    'Personalized AI-powered study guides that adapt to your knowledge gaps. Get smart learning paths for AWS, Azure, GCP, CompTIA, Cisco, and 100+ certifications. Study the right topics at the right time.',
  keywords: [
    'AI study guides',
    'personalized learning',
    'adaptive study plans',
    'knowledge gap analysis',
    'smart learning paths',
    'certification study guides',
    'AWS study guide',
    'Azure learning path',
    'GCP study guide',
    'CompTIA study path',
    'personalized exam prep',
    'adaptive learning technology',
    'intelligent tutoring',
    'learning analytics',
    'study optimization',
    'targeted learning',
    'efficient study methods',
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
    title: 'AI Study Guides | Personalized Learning Paths',
    description:
      'Smart study guides that adapt to your learning style. Get personalized learning paths for AWS, Azure, GCP, CompTIA, and more certifications.',
    type: 'website',
    locale: 'en_US',
    url: 'https://certestic.com/study-guides',
    siteName: 'Certestic',
    images: [
      {
        url: 'https://certestic.com/og-study-guides.png',
        width: 1200,
        height: 630,
        alt: 'AI Study Guides - Personalized Learning Paths',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Study Guides | Personalized Learning',
    description:
      'Adaptive AI-powered study guides that personalize your learning path for each certification.',
    creator: '@Certestic',
    site: '@Certestic',
    images: [
      {
        url: 'https://certestic.com/og-study-guides.png',
        alt: 'AI Study Guides - Personalized Learning',
      },
    ],
  },
  alternates: {
    canonical: 'https://certestic.com/study-guides',
  },
  category: 'Education',
};
