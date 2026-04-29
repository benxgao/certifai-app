import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Exciting New Features Coming Soon | Certestic Platform Updates',
  description:
    'Discover upcoming AI features transforming IT certification training. Smart Documentation, AI Study Guides, Expert Community, and more. Get early access and shape the future of certification learning. Join thousands preparing for success.',
  keywords: [
    'coming soon',
    'new features',
    'AI features',
    'smart documentation',
    'AI study guides',
    'expert community',
    'certification platform updates',
    'new learning tools',
    'early access program',
    'beta features',
    'platform roadmap',
    'upcoming features',
    'advanced learning tools',
    'AI improvements',
    'feature preview',
    'certification training innovation',
    'learning platform updates',
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
    title: 'Exciting New Features Coming Soon | Certestic',
    description:
      'Get early access to game-changing features. Smart Documentation, AI Study Guides, Expert Community, and more are launching soon. Be the first to try new AI learning tools.',
    type: 'website',
    locale: 'en_US',
    url: 'https://certestic.com/coming-soon',
    siteName: 'Certestic',
    images: [
      {
        url: 'https://certestic.com/og-coming-soon.png',
        width: 1200,
        height: 630,
        alt: 'Certestic - Exciting New Features Coming Soon',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Exciting Features Coming Soon | Certestic',
    description:
      'Be first to experience new AI learning features. Smart Documentation, AI Study Guides, Expert Community launching soon!',
    creator: '@Certestic',
    site: '@Certestic',
    images: [
      {
        url: 'https://certestic.com/og-coming-soon.png',
        alt: 'Certestic - Coming Soon Features',
      },
    ],
  },
  alternates: {
    canonical: 'https://certestic.com/coming-soon',
  },
  category: 'Technology',
};
