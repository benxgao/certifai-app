import { Metadata } from 'next';
import { SEO_CONFIG } from '@/src/config/seo';

interface GenerateMetadataProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  ogType?: 'website' | 'article' | 'profile';
  canonicalUrl?: string;
  noIndex?: boolean;
  alternateLanguages?: Record<string, string>;
}

export function generateMetadata({
  title,
  description,
  keywords,
  ogImage,
  ogType = 'website',
  canonicalUrl,
  noIndex = false,
  alternateLanguages,
}: GenerateMetadataProps = {}): Metadata {
  const metaTitle = title ? `${title} | ${SEO_CONFIG.SITE_NAME}` : SEO_CONFIG.SITE_TITLE;
  const metaDescription = description || SEO_CONFIG.SITE_DESCRIPTION;
  const metaKeywords = keywords || SEO_CONFIG.KEYWORDS.DEFAULT;
  const metaImage = ogImage || SEO_CONFIG.DEFAULT_OG_IMAGE;
  const metaUrl = canonicalUrl || SEO_CONFIG.SITE_URL;

  const metadata: Metadata = {
    title: metaTitle,
    description: metaDescription,
    keywords: metaKeywords,
    authors: [{ name: SEO_CONFIG.BUSINESS_NAME }],
    creator: SEO_CONFIG.BUSINESS_NAME,
    publisher: SEO_CONFIG.BUSINESS_NAME,
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    metadataBase: new URL(SEO_CONFIG.SITE_URL),
    alternates: {
      canonical: metaUrl,
      languages: alternateLanguages,
    },
    openGraph: {
      type: ogType,
      locale: 'en_US',
      url: metaUrl,
      title: metaTitle,
      description: metaDescription,
      siteName: SEO_CONFIG.SITE_NAME,
      images: [
        {
          url: metaImage,
          width: 1200,
          height: 630,
          alt: metaTitle,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: metaTitle,
      description: metaDescription,
      creator: SEO_CONFIG.TWITTER_HANDLE,
      images: [metaImage],
    },
    robots: noIndex
      ? {
          index: false,
          follow: false,
        }
      : {
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
      google: SEO_CONFIG.VERIFICATION.GOOGLE,
      yandex: SEO_CONFIG.VERIFICATION.YANDEX,
      yahoo: SEO_CONFIG.VERIFICATION.YAHOO,
      other: SEO_CONFIG.VERIFICATION.BING
        ? {
            'msvalidate.01': SEO_CONFIG.VERIFICATION.BING,
          }
        : undefined,
    },
  };

  return metadata;
}

// Utility for generating certification-specific metadata
export function generateCertificationMetadata(
  certificationName: string,
  firmName: string,
  certificationDescription?: string,
): Metadata {
  const title = `${certificationName} Certification Practice | ${firmName} Training`;
  const description =
    certificationDescription ||
    `Master the ${certificationName} certification with AI-powered practice questions and personalized study recommendations. Get ${firmName} certified faster with Certestic.`;

  return generateMetadata({
    title,
    description,
    keywords: `${certificationName}, ${firmName}, certification practice, ${SEO_CONFIG.KEYWORDS.CERTIFICATIONS}`,
    ogImage: `/api/og?title=${encodeURIComponent(title)}&description=${encodeURIComponent(
      description,
    )}`,
  });
}

// Utility for generating firm-specific metadata
export function generateFirmMetadata(firmName: string, firmDescription?: string): Metadata {
  const title = `${firmName} Certifications | AI-Powered Practice Tests`;
  const description =
    firmDescription ||
    `Explore all ${firmName} certifications with AI-powered practice questions and personalized study plans. Master ${firmName} technologies with Certestic.`;

  return generateMetadata({
    title,
    description,
    keywords: `${firmName}, certifications, practice tests, ${SEO_CONFIG.KEYWORDS.CERTIFICATIONS}`,
    ogImage: `/api/og?title=${encodeURIComponent(title)}&description=${encodeURIComponent(
      description,
    )}`,
  });
}

// Generate structured data for certification pages
export function generateCertificationStructuredData(
  certificationName: string,
  firmName: string,
  description: string,
  url: string,
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: `${certificationName} Certification Training`,
    description: description,
    provider: {
      '@type': 'Organization',
      name: SEO_CONFIG.BUSINESS_NAME,
      url: SEO_CONFIG.SITE_URL,
    },
    about: {
      '@type': 'Thing',
      name: certificationName,
      description: `Professional certification in ${certificationName}`,
    },
    educationalCredentialAwarded: certificationName,
    teaches: certificationName,
    courseMode: 'online',
    isAccessibleForFree: true,
    url: url,
    image: `${SEO_CONFIG.SITE_URL}/api/og?title=${encodeURIComponent(
      certificationName,
    )}&description=${encodeURIComponent(description)}`,
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '150',
      bestRating: '5',
      worstRating: '1',
    },
  };
}
