import { Metadata } from 'next';

const description =
  'Simple, transparent pricing for AI-powered IT certification practice. Join our beta program with free access to core features and special pricing.';

const keywords = [
  'CertifAI pricing',
  'IT certification cost',
  'free beta trial',
  'practice exam pricing',
  'AI training platform cost',
  'beta program pricing',
  'IT certification subscription',
  'educational technology pricing',
  'certification preparation cost',
  'affordable IT training',
  'beta access pricing',
].join(', ');

export const metadata: Metadata = {
  title: 'Pricing Plans | CertifAI - AI-Powered IT Certification Training | Free Beta Access',
  description,
  keywords,
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
    title: 'Pricing Plans | CertifAI - AI-Powered IT Certification Training',
    description:
      'Simple, transparent pricing for AI-powered IT certification practice and training. Free beta access available.',
    type: 'website',
    locale: 'en_US',
    url: 'https://certifai.app/pricing',
    siteName: 'CertifAI',
    images: [
      {
        url: '/images/pricing/certifai-pricing-og.jpg',
        width: 1200,
        height: 630,
        alt: 'CertifAI Pricing Plans - Free Beta Access Available',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pricing Plans | CertifAI - Free Beta Access',
    description:
      'Simple pricing for AI-powered IT certification practice. Free beta access available.',
    creator: '@CertifAI',
    site: '@CertifAI',
    images: [
      {
        url: '/images/pricing/certifai-pricing-twitter.jpg',
        alt: 'CertifAI Pricing Plans - Free Beta Access',
      },
    ],
  },
  alternates: {
    canonical: 'https://certifai.app/pricing',
  },
  category: 'Education',
};
