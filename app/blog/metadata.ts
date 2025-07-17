import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog | Certestic - AI-Powered IT Certification Training Insights & Tips',
  description:
    'Discover the latest insights, tips, and strategies for IT certification success with AI-powered learning. Expert advice on certification preparation, study techniques, and career advancement.',
  keywords: [
    'Certestic blog',
    'IT certification tips',
    'AI learning insights',
    'certification study strategies',
    'IT career advice',
    'exam preparation tips',
    'professional development blog',
    'certification success stories',
    'AI education insights',
    'IT training articles',
    'certification preparation guide',
    'career advancement tips',
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
    title: 'Blog | Certestic - IT Certification Training Insights & Tips',
    description:
      'Discover expert insights and strategies for IT certification success with AI-powered learning techniques and proven study methods.',
    type: 'website',
    locale: 'en_US',
    url: 'https://certestic.com/blog',
    siteName: 'Certestic',
    images: [
      {
        url: '/favicon.ico',
        width: 1200,
        height: 630,
        alt: 'Certestic Blog - IT Certification Training Insights',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blog | Certestic - IT Certification Training Insights',
    description:
      'Expert insights and strategies for IT certification success with AI-powered learning.',
    creator: '@Certestic',
    site: '@Certestic',
    images: [
      {
        url: '/favicon.ico',
        alt: 'Certestic Blog - IT Certification Training Insights',
      },
    ],
  },
  alternates: {
    canonical: 'https://certestic.com/blog',
  },
  category: 'Education',
};
