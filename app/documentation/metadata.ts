import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Documentation | CertifAI - Platform Guide & Help Center',
  description:
    'Complete documentation and help center for CertifAI platform. Learn how to use AI-powered features, manage your study progress, and maximize your certification success.',
  keywords: [
    'CertifAI documentation',
    'platform help center',
    'user guide',
    'AI features guide',
    'certification platform help',
    'study progress tracking',
    'platform tutorials',
    'user manual',
    'help documentation',
    'getting started guide',
    'feature documentation',
    'support resources',
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
    title: 'Documentation | CertifAI - Platform Guide & Help Center',
    description:
      'Complete documentation and help center for CertifAI platform. Learn how to maximize your certification success.',
    type: 'website',
    locale: 'en_US',
    url: 'https://certifai.app/documentation',
    siteName: 'CertifAI',
    images: [
      {
        url: '/images/documentation/certifai-docs-og.jpg',
        width: 1200,
        height: 630,
        alt: 'CertifAI Documentation - Platform Guide & Help Center',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Documentation | CertifAI - Platform Guide',
    description: 'Complete documentation and help center for CertifAI platform.',
    creator: '@CertifAI',
    site: '@CertifAI',
    images: [
      {
        url: '/images/documentation/certifai-docs-twitter.jpg',
        alt: 'CertifAI Documentation - Platform Guide & Help Center',
      },
    ],
  },
  alternates: {
    canonical: 'https://certifai.app/documentation',
  },
  category: 'Education',
};
