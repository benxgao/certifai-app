import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Study Guides | Certestic - AI-Powered IT Certification Study Materials',
  description:
    'Access comprehensive AI-generated study guides for IT certifications. Personalized study materials, practice questions, and learning paths tailored to your certification goals.',
  keywords: [
    'Certestic study guides',
    'IT certification study materials',
    'AI-generated study guides',
    'personalized learning materials',
    'certification preparation resources',
    'IT study guides',
    'exam preparation materials',
    'adaptive study content',
    'certification study plans',
    'IT training resources',
    'professional certification guides',
    'AI-powered study materials',
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
    title: 'Study Guides | Certestic - AI-Powered IT Certification Study Materials',
    description:
      'Access comprehensive AI-generated study guides and personalized learning materials for IT certification success.',
    type: 'website',
    locale: 'en_US',
    url: 'https://certestic.com/study-guides',
    siteName: 'Certestic',
    images: [
      {
        url: '/images/study-guides/certestic-study-guides-og.jpg',
        width: 1200,
        height: 630,
        alt: 'Certestic Study Guides - AI-Powered IT Certification Materials',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Study Guides | Certestic - AI-Powered Study Materials',
    description: 'Access comprehensive AI-generated study guides for IT certification success.',
    creator: '@Certestic',
    site: '@Certestic',
    images: [
      {
        url: '/images/study-guides/certestic-study-guides-twitter.jpg',
        alt: 'Certestic Study Guides - AI-Powered IT Certification Materials',
      },
    ],
  },
  alternates: {
    canonical: 'https://certestic.com/study-guides',
  },
  category: 'Education',
};
