import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Support | CertifAI - Help Center & Customer Support',
  description:
    'Get help with CertifAI platform. Access customer support, troubleshooting guides, and assistance for your AI-powered IT certification training journey.',
  keywords: [
    'CertifAI support',
    'customer support',
    'help center',
    'technical support',
    'platform assistance',
    'troubleshooting',
    'user support',
    'certification training help',
    'AI platform support',
    'contact support',
    'help desk',
    'customer service',
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
    title: 'Support | CertifAI - Help Center & Customer Support',
    description:
      'Get help with CertifAI platform. Access customer support and assistance for your AI-powered certification training.',
    type: 'website',
    locale: 'en_US',
    url: 'https://certifai.app/support',
    siteName: 'CertifAI',
    images: [
      {
        url: '/images/support/certifai-support-og.jpg',
        width: 1200,
        height: 630,
        alt: 'CertifAI Support - Help Center & Customer Support',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Support | CertifAI - Help Center',
    description: 'Get help with CertifAI platform and your certification training journey.',
    creator: '@CertifAI',
    site: '@CertifAI',
    images: [
      {
        url: '/images/support/certifai-support-twitter.jpg',
        alt: 'CertifAI Support - Help Center & Customer Support',
      },
    ],
  },
  alternates: {
    canonical: 'https://certifai.app/support',
  },
  category: 'Education',
};
