import React from 'react';
import Head from 'next/head';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string[];
  ogImage?: string;
  twitterImage?: string;
  canonicalUrl?: string;
  structuredData?: object[];
  noIndex?: boolean;
}

export default function SEOComponent({
  title,
  description,
  keywords = [],
  ogImage,
  twitterImage,
  canonicalUrl,
  structuredData = [],
  noIndex = false,
}: SEOProps) {
  const defaultTitle = 'Certestic | AI-Powered IT Certification Training';
  const defaultDescription =
    'Master IT certifications with AI-powered practice questions and personalized study recommendations. Join professionals advancing their careers.';

  const pageTitle = title || defaultTitle;
  const pageDescription = description || defaultDescription;
  const keywordsString = keywords.length > 0 ? keywords.join(', ') : '';

  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{pageTitle}</title>
      <meta name="description" content={pageDescription} />
      {keywordsString && <meta name="keywords" content={keywordsString} />}

      {/* Robots */}
      {noIndex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta
          name="robots"
          content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
        />
      )}

      {/* Canonical URL */}
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}

      {/* Open Graph */}
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDescription} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="Certestic" />
      <meta property="og:locale" content="en_US" />
      {ogImage && <meta property="og:image" content={ogImage} />}
      {canonicalUrl && <meta property="og:url" content={canonicalUrl} />}

      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={pageDescription} />
      <meta name="twitter:creator" content="@Certestic" />
      <meta name="twitter:site" content="@Certestic" />
      {twitterImage && <meta name="twitter:image" content={twitterImage} />}

      {/* Structured Data */}
      {structuredData.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}

      {/* Preconnect for Performance */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

      {/* Additional SEO Meta Tags */}
      <meta name="author" content="Certestic Team" />
      <meta name="creator" content="Certestic" />
      <meta name="publisher" content="Certestic" />
      <meta name="format-detection" content="telephone=no, email=no, address=no" />

      {/* Mobile Optimization */}
      <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />

      {/* Theme Colors */}
      <meta name="theme-color" content="#6366f1" />
      <meta name="msapplication-TileColor" content="#6366f1" />
    </Head>
  );
}
