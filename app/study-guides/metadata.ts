import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Study Guides | CertifAI - AI-Powered IT Certification Study Materials',
  description:
    'Access comprehensive AI-generated study guides for IT certifications. Personalized study materials, practice questions, and learning paths tailored to your certification goals.',
  keywords: [
    'CertifAI study guides',
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
  authors: [{ name: 'CertifAI Team' }],
  creator: 'CertifAI',
  publisher: 'CertifAI',
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
    title: 'Study Guides | CertifAI - AI-Powered IT Certification Study Materials',
    description:
      'Access comprehensive AI-generated study guides and personalized learning materials for IT certification success.',
    type: 'website',
    locale: 'en_US',
    url: 'https://certifai.app/study-guides',
    siteName: 'CertifAI',
    images: [
      {
        url: '/images/study-guides/certifai-study-guides-og.jpg',
        width: 1200,
        height: 630,
        alt: 'CertifAI Study Guides - AI-Powered IT Certification Materials',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Study Guides | CertifAI - AI-Powered Study Materials',
    description: 'Access comprehensive AI-generated study guides for IT certification success.',
    creator: '@CertifAI',
    site: '@CertifAI',
    images: [
      {
        url: '/images/study-guides/certifai-study-guides-twitter.jpg',
        alt: 'CertifAI Study Guides - AI-Powered IT Certification Materials',
      },
    ],
  },
  alternates: {
    canonical: 'https://certifai.app/study-guides',
  },
  category: 'Education',
};
