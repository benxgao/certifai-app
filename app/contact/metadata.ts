import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us | Get Support & Share Feedback | Certestic',
  description:
    "Have questions or feedback? Get in touch with the Certestic team. We're committed to supporting your IT certification journey and welcome your suggestions to improve our platform. Contact us for technical support, bug reports, or partnership opportunities.",
  keywords: [
    'contact Certestic',
    'support',
    'customer service',
    'technical support',
    'feedback',
    'contact form',
    'help desk',
    'customer support',
    'get help',
    'report bug',
    'feature request',
    'partnership',
    'business inquiry',
    'developer contact',
    'support email',
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
    },
  },
  openGraph: {
    title: 'Contact Certestic | Get Expert Support for Your Certification Journey',
    description:
      'Reach out to our team for technical support, feedback, or questions about our AI-powered certification training platform.',
    type: 'website',
    locale: 'en_US',
    url: 'https://certestic.com/contact',
    siteName: 'Certestic',
    images: [
      {
        url: 'https://certestic.com/og-contact.png',
        width: 1200,
        height: 630,
        alt: 'Contact Certestic',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact Certestic | Expert Support Team',
    description:
      'Get in touch with our support team. We\'re here to help with technical issues, feedback, or questions about our platform.',
    creator: '@Certestic',
    site: '@Certestic',
    images: [
      {
        url: 'https://certestic.com/og-contact.png',
        alt: 'Contact Certestic',
      },
    ],
  },
  alternates: {
    canonical: 'https://certestic.com/contact',
  },
};
