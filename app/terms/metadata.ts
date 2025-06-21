import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service | CertifAI - Legal Terms & Conditions',
  description:
    "Read CertifAI's comprehensive Terms of Service. Understand your rights, responsibilities, and legal terms when using our AI-powered IT certification training platform.",
  keywords: [
    'CertifAI terms of service',
    'legal terms and conditions',
    'user agreement',
    'platform terms',
    'beta terms',
    'AI platform legal',
    'certification training terms',
    'user responsibilities',
    'service agreement',
    'platform policies',
  ].join(', '),
  authors: [{ name: 'CertifAI Legal Team' }],
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
    title: 'Terms of Service | CertifAI - Legal Terms & Conditions',
    description:
      "Read CertifAI's comprehensive Terms of Service and legal terms for our AI-powered IT certification training platform.",
    type: 'website',
    locale: 'en_US',
    url: 'https://certifai.app/terms',
    siteName: 'CertifAI',
  },
  twitter: {
    card: 'summary',
    title: 'Terms of Service | CertifAI',
    description: 'Legal terms and conditions for CertifAI AI-powered certification platform.',
    creator: '@CertifAI',
    site: '@CertifAI',
  },
  alternates: {
    canonical: 'https://certifai.app/terms',
  },
  category: 'Legal',
};
