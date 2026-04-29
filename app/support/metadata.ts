import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Support & Help Center | Certestic Customer Support',
  description:
    'Get comprehensive help with Certestic platform. Access our help center with troubleshooting guides, FAQs, step-by-step tutorials, and feature documentation. Contact our customer support team for technical assistance. Find answers to questions about practice exams, performance tracking, knowledge gap analysis, and platform features.',
  keywords: [
    'Certestic support',
    'help center',
    'customer support',
    'tech support',
    'platform help',
    'troubleshooting',
    'FAQ',
    'support email',
    'help desk',
    'technical assistance',
    'platform support',
    'account help',
    'certification platform support',
    'customer service',
    'support resources',
    'help documentation',
    'problem solving',
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
    title: 'Support & Help Center | Certestic Customer Support',
    description:
      'Get fast support for your Certestic platform issues. Access FAQs, guides, and contact our customer support team to resolve your questions.',
    type: 'website',
    locale: 'en_US',
    url: 'https://certestic.com/support',
    siteName: 'Certestic',
    images: [
      {
        url: 'https://certestic.com/og-support.png',
        width: 1200,
        height: 630,
        alt: 'Certestic Support & Help Center',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Support | Certestic Help Center',
    description:
      'Get help with Certestic platform. Access customer support, FAQs, and troubleshooting guides for your certification training.',
    creator: '@Certestic',
    site: '@Certestic',
    images: [
      {
        url: 'https://certestic.com/og-support.png',
        alt: 'Certestic Support Center',
      },
    ],
  },
  alternates: {
    canonical: 'https://certestic.com/support',
  },
  category: 'Education',
};
