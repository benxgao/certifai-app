import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | CertifAI - Data Protection & Privacy',
  description:
    'Learn how CertifAI protects your privacy and handles your personal data. Comprehensive privacy policy for our AI-powered IT certification training platform.',
  keywords: [
    'CertifAI privacy policy',
    'data protection',
    'personal data handling',
    'privacy rights',
    'GDPR compliance',
    'data security',
    'user privacy',
    'information collection',
    'data usage policy',
    'privacy protection',
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
    title: 'Privacy Policy | CertifAI - Data Protection & Privacy',
    description:
      'Learn how CertifAI protects your privacy and handles your personal data in our AI-powered certification platform.',
    type: 'website',
    locale: 'en_US',
    url: 'https://certifai.app/privacy',
    siteName: 'CertifAI',
  },
  twitter: {
    card: 'summary',
    title: 'Privacy Policy | CertifAI',
    description: 'Data protection and privacy policy for CertifAI certification platform.',
    creator: '@CertifAI',
    site: '@CertifAI',
  },
  alternates: {
    canonical: 'https://certifai.app/privacy',
  },
  category: 'Legal',
};
