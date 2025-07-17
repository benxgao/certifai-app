import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Support | Certestic - Help Center & Customer Support',
  description:
    'Get help with Certestic platform. Access customer support, troubleshooting guides, and assistance for your AI-powered IT certification training journey.',
  keywords: [
    'Certestic support',
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
    title: 'Support | Certestic - Help Center & Customer Support',
    description:
      'Get help with Certestic platform. Access customer support and assistance for your AI-powered certification training.',
    type: 'website',
    locale: 'en_US',
    url: 'https://certestic.com/support',
    siteName: 'Certestic',
    images: [
      {
        url: '/favicon.ico',
        width: 1200,
        height: 630,
        alt: 'Certestic Support - Help Center & Customer Support',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Support | Certestic - Help Center',
    description: 'Get help with Certestic platform and your certification training journey.',
    creator: '@Certestic',
    site: '@Certestic',
    images: [
      {
        url: '/favicon.ico',
        alt: 'Certestic Support - Help Center & Customer Support',
      },
    ],
  },
  alternates: {
    canonical: 'https://certestic.com/support',
  },
  category: 'Education',
};
