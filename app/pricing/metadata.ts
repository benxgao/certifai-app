import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pricing Plans | CertifAI - AI-Powered IT Certification Training | Free Beta Access',
  description:
    'Simple, transparent pricing for AI-powered IT certification practice. Start free with 300 credit coins - enough for 5 practice exams. Join our beta program with special pricing.',
  keywords: [
    'CertifAI pricing',
    'IT certification cost',
    'free beta trial',
    'credit coins system',
    'practice exam pricing',
    'AI training platform cost',
    'beta program pricing',
    'IT certification subscription',
    'educational technology pricing',
    'certification preparation cost',
    'affordable IT training',
    'beta access pricing',
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
    title: 'Pricing Plans | CertifAI - AI-Powered IT Certification Training',
    description:
      'Start free with 300 credit coins. Simple, transparent pricing for AI-powered IT certification practice and training.',
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
      'Start free with 300 credit coins. Simple pricing for AI-powered IT certification practice.',
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
