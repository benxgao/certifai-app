import { Metadata } from 'next';

const description =
  'Join our free beta program and get unlimited access to AI-powered IT certification training. Complete platform access while we develop features with your feedback. No credit card required.';

const keywords = [
  'Certestic beta program',
  'free certification training',
  'AI certification platform',
  'free practice exams',
  'beta testing program',
  'free access',
  'certification platform',
  'AI learning beta',
  'free exam prep',
  'unlimited access',
  'beta user program',
  'early access program',
  'free training platform',
  'no credit card',
  'beta features',
  'platform beta',
].join(', ');

export const metadata: Metadata = {
  title:
    'Free Beta Program | Certestic - Unlimited AI-Powered Certification Training | Join Now',
  description,
  keywords,
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
    title: 'Free Beta Program | Certestic - Shape the Future of IT Certification Training',
    description:
      'Get unlimited access to our AI-powered certification training platform for free. Help us build the future while perfecting your certifications. No credit card required.',
    type: 'website',
    locale: 'en_US',
    url: 'https://certestic.com/pricing',
    siteName: 'Certestic',
    images: [
      {
        url: 'https://certestic.com/og-pricing.png',
        width: 1200,
        height: 630,
        alt: 'Certestic Free Beta Program',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Beta | Certestic - Unlimited Certification Training',
    description:
      'Join our free beta program and get unlimited access to AI-powered IT certification training. Help shape the platform while you study.',
    creator: '@Certestic',
    site: '@Certestic',
    images: [
      {
        url: 'https://certestic.com/og-pricing.png',
        alt: 'Certestic Free Beta Program',
      },
    ],
  },
  alternates: {
    canonical: 'https://certestic.com/pricing',
  },
  category: 'Technology',
};
