import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | Certestic - Data Protection & Privacy',
  description:
    'Learn how Certestic protects your privacy and handles your personal data. Comprehensive privacy policy for our AI-powered IT certification training platform.',
  keywords: [
    'Certestic privacy policy',
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
    title: 'Privacy Policy | Certestic - Data Protection & Privacy',
    description:
      'Learn how Certestic protects your privacy and handles your personal data in our AI-powered certification platform.',
    type: 'website',
    locale: 'en_US',
    url: 'https://certestic.com/privacy',
    siteName: 'Certestic',
  },
  twitter: {
    card: 'summary',
    title: 'Privacy Policy | Certestic',
    description: 'Data protection and privacy policy for Certestic certification platform.',
    creator: '@Certestic',
    site: '@Certestic',
  },
  alternates: {
    canonical: 'https://certestic.com/privacy',
  },
  category: 'Legal',
};
