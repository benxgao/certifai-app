import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { Suspense } from 'react';
import ConditionalFirebaseAuthProvider from '@/src/components/auth/ConditionalFirebaseAuthProvider';
import ConditionalFooter from '@/src/components/custom/ConditionalFooter';
import './globals.css';

// SEO and metadata
const META_CONTENT = {
  TITLE: 'CertifAI | AI-Powered IT Certification Training Platform',
  DESCRIPTION:
    'Master IT certifications with AI-powered practice questions, personalized study recommendations, and adaptive learning. Join 500+ beta users advancing their careers through intelligent technology.',
  KEYWORDS:
    'CertifAI, AI-powered IT certification training, artificial intelligence learning platform, IT certification practice exams, personalized study recommendations, adaptive certification training, AI-generated practice questions, IT professional development, certification exam simulator, beta testing platform, free certification training, machine learning education, IT career advancement, online certification preparation, smart study technology, certification success platform',
  OG_DESCRIPTION:
    'Master IT certifications with AI-powered practice questions and personalized study recommendations. Join 500+ beta users advancing their careers.',
} as const;
const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: {
    default: META_CONTENT.TITLE,
    template: '%s | CertifAI - AI-Powered IT Certification Training',
  },
  description: META_CONTENT.DESCRIPTION,
  keywords: META_CONTENT.KEYWORDS,
  authors: [{ name: 'CertifAI Team' }],
  creator: 'CertifAI',
  publisher: 'CertifAI',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://certifai.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://certifai.app',
    title: META_CONTENT.TITLE,
    description: META_CONTENT.OG_DESCRIPTION,
    siteName: 'CertifAI',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'CertifAI - AI-Powered IT Certification Training Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: META_CONTENT.TITLE,
    description: META_CONTENT.OG_DESCRIPTION,
    creator: '@CertifAI',
    images: ['/images/twitter-card.jpg'],
  },
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
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
    yahoo: 'your-yahoo-verification-code',
  },
  category: 'Education',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      {/* Enhanced SEO Meta Tags */}
      <head>
        <title>{META_CONTENT.TITLE}</title>
        <meta name="description" content={META_CONTENT.DESCRIPTION} />
        <meta name="keywords" content={META_CONTENT.KEYWORDS} />
        <meta name="author" content="CertifAI Team" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="theme-color" content="#6366f1" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />

        {/* Open Graph Meta Tags */}
        <meta property="og:title" content={META_CONTENT.TITLE} />
        <meta property="og:description" content={META_CONTENT.OG_DESCRIPTION} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://certifai.app/" />
        <meta property="og:image" content="https://certifai.app/images/og-image.jpg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="CertifAI - AI-Powered IT Certification Training" />
        <meta property="og:site_name" content="CertifAI" />
        <meta property="og:locale" content="en_US" />

        {/* Twitter Card Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@CertifAI" />
        <meta name="twitter:creator" content="@CertifAI" />
        <meta name="twitter:title" content={META_CONTENT.TITLE} />
        <meta name="twitter:description" content={META_CONTENT.OG_DESCRIPTION} />
        <meta name="twitter:image" content="https://certifai.app/images/twitter-card.jpg" />

        {/* Additional SEO Tags */}
        <meta
          name="robots"
          content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
        />
        <meta name="googlebot" content="index, follow" />
        <link rel="canonical" href="https://certifai.app/" />

        {/* Favicon and Icons */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />

        {/* Preconnect for Performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* Schema.org structured data for Organization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'CertifAI',
              description: 'AI-powered IT certification training platform',
              url: 'https://certifai.app',
              logo: 'https://certifai.app/images/logo.png',
              sameAs: ['https://twitter.com/CertifAI', 'https://linkedin.com/company/certifai'],
              contactPoint: {
                '@type': 'ContactPoint',
                contactType: 'customer service',
                email: 'support@certifai.app',
              },
            }),
          }}
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ConditionalFirebaseAuthProvider>
          <div className="min-h-screen flex flex-col bg-gray-100 text-gray-900">
            <Suspense
              fallback={
                <div className="min-h-screen flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-violet-600 mx-auto"></div>
                    <p className="text-lg text-gray-600">Loading...</p>
                  </div>
                </div>
              }
            >
              {children}
            </Suspense>
          </div>
          <ConditionalFooter />
        </ConditionalFirebaseAuthProvider>
      </body>
    </html>
  );
}
