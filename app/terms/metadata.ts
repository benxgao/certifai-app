import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service | Certestic - Legal Terms & Conditions',
  description:
    "Read Certestic's comprehensive Terms of Service. Understand your rights, responsibilities, and legal terms when using our AI-powered IT certification training platform.",
  keywords: [
    'Certestic terms of service',
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
  authors: [{ name: 'Certestic Legal Team' }],
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
    title: 'Terms of Service | Certestic - Legal Terms & Conditions',
    description:
      "Read Certestic's comprehensive Terms of Service and legal terms for our AI-powered IT certification training platform.",
    type: 'website',
    locale: 'en_US',
    url: 'https://certestic.com/terms',
    siteName: 'Certestic',
  },
  twitter: {
    card: 'summary',
    title: 'Terms of Service | Certestic',
    description: 'Legal terms and conditions for Certestic AI-powered certification platform.',
    creator: '@Certestic',
    site: '@Certestic',
  },
  alternates: {
    canonical: 'https://certestic.com/terms',
  },
  category: 'Legal',
};
