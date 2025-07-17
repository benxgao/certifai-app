import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Coming Soon | Certestic - New AI Features in Development',
  description:
    'Get early access to game-changing features: Smart Documentation, AI Study Guides, Expert Community, and more. Join thousands learning with AI-powered IT certification training.',
  keywords:
    'coming soon, AI features, smart documentation, AI study guides, expert community, IT certification training, Certestic, early access, beta features, personalized learning',
  robots: 'index, follow',
  openGraph: {
    title: 'Coming Soon | Certestic - New AI Learning Features',
    description:
      'Be the first to try new IT certification training features. Cool AI features launching soon - get early access now!',
    type: 'website',
    images: [
      {
        url: '/og-coming-soon.png',
        width: 1200,
        height: 630,
        alt: 'Certestic - New AI Features Coming Soon',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Coming Soon | Certestic - New AI Learning Features',
    description:
      'Be the first to try new IT certification training features. Cool AI features launching soon!',
    images: ['/og-coming-soon.png'],
  },
};
