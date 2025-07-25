import type { Metadata } from 'next';
// import { Geist, Geist_Mono } from 'next/font/google';
import { Suspense } from 'react';
import ConditionalFirebaseAuthProvider from '@/src/components/auth/ConditionalFirebaseAuthProvider';
import ConditionalFooter from '@/src/components/custom/ConditionalFooter';
import GoogleAnalytics from '@/src/components/analytics/GoogleAnalytics';
import PageViewTracker from '@/src/components/analytics/PageViewTracker';
import './globals.css';

// SEO and metadata
const META_CONTENT = {
  TITLE: 'Certestic | AI-Powered IT Certification Training Platform',
  DESCRIPTION:
    'Master IT certifications with AI-powered practice questions, personalized study recommendations, and adaptive learning. Join a growing number of beta users advancing their careers through intelligent technology.',
  KEYWORDS:
    'Certestic, AI-powered IT certification training, artificial intelligence learning platform, IT certification practice exams, personalized study recommendations, adaptive certification training, AI-generated practice questions, IT professional development, certification exam simulator, beta testing platform, free certification training, machine learning education, IT career advancement, online certification preparation, smart study technology, certification success platform',
  OG_DESCRIPTION:
    'Master IT certifications with AI-powered practice questions and personalized study recommendations. Join a growing number of beta users advancing their careers.',
} as const;

// const geistSans = Geist({
//   variable: '--font-geist-sans',
//   subsets: ['latin'],
// });

// const geistMono = Geist_Mono({
//   variable: '--font-geist-mono',
//   subsets: ['latin'],
// });

export const metadata: Metadata = {
  title: {
    default: META_CONTENT.TITLE,
    template: '%s | Certestic - AI-Powered IT Certification Training',
  },
  description: META_CONTENT.DESCRIPTION,
  keywords: META_CONTENT.KEYWORDS,
  authors: [{ name: 'Certestic Team' }],
  creator: 'Certestic',
  publisher: 'Certestic',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://certestic.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://certestic.com',
    title: META_CONTENT.TITLE,
    description: META_CONTENT.OG_DESCRIPTION,
    siteName: 'Certestic',
    images: [
      {
        url: '/favicon.ico',
        width: 256,
        height: 256,
        alt: 'Certestic - AI-Powered IT Certification Training Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: META_CONTENT.TITLE,
    description: META_CONTENT.OG_DESCRIPTION,
    creator: '@Certestic',
    images: ['/favicon.ico'],
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
    google: 'your-google-site-verification-code',
    yandex: 'your-yandex-verification-code',
    yahoo: 'your-yahoo-verification-code',
    other: {
      'msvalidate.01': 'your-bing-verification-code',
    },
  },
  category: 'Education',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      {/* Enhanced SEO Meta Tags */}
      <head>
        {/* Theme detection script */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                function setTheme() {
                  const theme = localStorage.getItem('theme') ||
                    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
                  if (theme === 'dark') {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                }
                setTheme();
                window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', setTheme);
              })();
            `,
          }}
        />
        <title>{META_CONTENT.TITLE}</title>
        <meta name="description" content={META_CONTENT.DESCRIPTION} />
        <meta name="keywords" content={META_CONTENT.KEYWORDS} />
        <meta name="author" content="Certestic Team" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="theme-color" content="#6366f1" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />

        {/* Open Graph Meta Tags */}
        <meta property="og:title" content={META_CONTENT.TITLE} />
        <meta property="og:description" content={META_CONTENT.OG_DESCRIPTION} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://certestic.com/" />
        <meta property="og:image" content="https://certestic.com/favicon.ico" />
        <meta property="og:image:width" content="256" />
        <meta property="og:image:height" content="256" />
        <meta property="og:image:alt" content="Certestic - AI-Powered IT Certification Training" />
        <meta property="og:site_name" content="Certestic" />
        <meta property="og:locale" content="en_US" />

        {/* Twitter Card Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@Certestic" />
        <meta name="twitter:creator" content="@Certestic" />
        <meta name="twitter:title" content={META_CONTENT.TITLE} />
        <meta name="twitter:description" content={META_CONTENT.OG_DESCRIPTION} />
        <meta name="twitter:image" content="https://certestic.com/favicon.ico" />

        {/* Additional SEO Tags */}
        <meta
          name="robots"
          content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
        />
        <meta name="googlebot" content="index, follow" />
        <link rel="canonical" href="https://certestic.com/" />

        {/* Favicon and Icons */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />

        {/* Preconnect for Performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* Google Analytics (gtag) */}
        {process.env.NEXT_PUBLIC_GA_TRACKING_ID && (
          <>
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_TRACKING_ID}`}
            />
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${process.env.NEXT_PUBLIC_GA_TRACKING_ID}');
                `,
              }}
            />
          </>
        )}

        {/* Schema.org structured data for Organization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'Certestic',
              alternateName: 'Certestic - AI-Powered IT Certification Training',
              description:
                'AI-powered IT certification training platform with personalized study recommendations',
              url: 'https://certestic.com',
              logo: {
                '@type': 'ImageObject',
                url: 'https://certestic.com/favicon.ico',
                width: 256,
                height: 256,
              },
              sameAs: [
                'https://twitter.com/certestic',
                'https://linkedin.com/company/certestic',
                'https://github.com/certestic',
              ],
              contactPoint: [
                {
                  '@type': 'ContactPoint',
                  contactType: 'customer service',
                  email: 'support@certestic.com',
                  availableLanguage: 'English',
                },
                {
                  '@type': 'ContactPoint',
                  contactType: 'sales',
                  email: 'sales@certestic.com',
                  availableLanguage: 'English',
                },
              ],
              address: {
                '@type': 'PostalAddress',
                addressCountry: 'US',
                addressRegion: 'California',
              },
              foundingDate: '2024',
              numberOfEmployees: {
                '@type': 'QuantitativeValue',
                value: '1-10',
              },
              industry: 'Education Technology',
              keywords: 'AI, IT Certification, Training, Education, Machine Learning',
            }),
          }}
        />

        {/* Schema.org structured data for Website */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: 'Certestic',
              url: 'https://certestic.com',
              description: 'AI-powered IT certification training platform',
              publisher: {
                '@type': 'Organization',
                name: 'Certestic',
              },
              potentialAction: {
                '@type': 'SearchAction',
                target: {
                  '@type': 'EntryPoint',
                  urlTemplate: 'https://certestic.com/search?q={search_term_string}',
                },
                'query-input': 'required name=search_term_string',
              },
            }),
          }}
        />

        {/* Schema.org structured data for Educational Organization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'EducationalOrganization',
              name: 'Certestic',
              url: 'https://certestic.com',
              description:
                'AI-powered IT certification training platform offering personalized study recommendations and practice exams',
              educationalCredentialAwarded: 'IT Certification Preparation',
              hasCredential: {
                '@type': 'EducationalOccupationalCredential',
                name: 'IT Certification Training',
                description:
                  'Comprehensive training for various IT certifications using AI-powered learning',
              },
              offers: {
                '@type': 'Offer',
                category: 'Education',
                availability: 'https://schema.org/InStock',
                priceCurrency: 'USD',
                description:
                  'AI-powered IT certification training with personalized recommendations',
              },
            }),
          }}
        />
      </head>
      <body className="antialiased">
        {/* Google Analytics */}
        {process.env.NEXT_PUBLIC_GA_TRACKING_ID && (
          <GoogleAnalytics GA_MEASUREMENT_ID={process.env.NEXT_PUBLIC_GA_TRACKING_ID} />
        )}

        <ConditionalFirebaseAuthProvider>
          <Suspense fallback={null}>
            <PageViewTracker />
          </Suspense>
          <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-slate-900 text-gray-900 dark:text-slate-100">
            <Suspense
              fallback={
                <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-slate-900">
                  <div className="text-center space-y-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-violet-600 mx-auto"></div>
                    <p className="text-lg text-gray-600 dark:text-slate-400">Loading...</p>
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
