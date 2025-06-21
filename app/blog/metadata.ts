import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog | CertifAI - AI-Powered IT Certification Training Insights & Tips',
  description:
    'Discover the latest insights, tips, and strategies for IT certification success with AI-powered learning. Expert advice on certification preparation, study techniques, and career advancement.',
  keywords: [
    'CertifAI blog',
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
    title: 'Blog | CertifAI - IT Certification Training Insights & Tips',
    description:
      'Discover expert insights and strategies for IT certification success with AI-powered learning techniques and proven study methods.',
    type: 'website',
    locale: 'en_US',
    url: 'https://certifai.app/blog',
    siteName: 'CertifAI',
    images: [
      {
        url: '/images/blog/certifai-blog-og.jpg',
        width: 1200,
        height: 630,
        alt: 'CertifAI Blog - IT Certification Training Insights',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blog | CertifAI - IT Certification Training Insights',
    description:
      'Expert insights and strategies for IT certification success with AI-powered learning.',
    creator: '@CertifAI',
    site: '@CertifAI',
    images: [
      {
        url: '/images/blog/certifai-blog-twitter.jpg',
        alt: 'CertifAI Blog - IT Certification Training Insights',
      },
    ],
  },
  alternates: {
    canonical: 'https://certifai.app/blog',
  },
  category: 'Education',
};
