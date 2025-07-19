# SEO and Analytics Implementation Guide

This guide documents the comprehensive SEO and Google Analytics implementation for Certestic.

## 🎯 Overview

We've implemented a complete SEO and analytics solution including:

- **Google Analytics 4** integration with custom event tracking
- **Dynamic sitemap** generation with certification pages
- **Enhanced robots.txt** with specific crawling rules
- **Open Graph** image generation for social sharing
- **Structured data** for better search engine understanding
- **Security.txt** for responsible disclosure
- **PWA manifest** with proper icons and shortcuts
- **SEO utilities** for metadata generation

## 📊 Google Analytics Setup

### 1. Environment Configuration

Add your Google Analytics Measurement ID to `.env.local`:

```bash
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

### 2. Analytics Components

- **GoogleAnalytics**: Main component that loads GA4 script
- **PageViewTracker**: Automatically tracks page views on route changes
- **useAnalytics**: Hook for custom event tracking

### 3. Custom Event Tracking

The analytics system includes predefined events for:

- User engagement (signup, login, logout)
- Certification actions (start, complete, view)
- AI interactions (question generation, recommendations)
- Business actions (contact forms, pricing views)
- Navigation and search

### Example Usage:

```typescript
import { useAnalytics } from '@/src/hooks/useAnalytics';

function MyComponent() {
  const { trackUserSignup, trackEvent } = useAnalytics();

  const handleSignup = () => {
    trackUserSignup('email');
  };

  const handleCustomEvent = () => {
    trackEvent({
      action: 'custom_action',
      category: 'engagement',
      label: 'button_click',
      value: 1,
    });
  };
}
```

## 🗺️ SEO Implementation

### 1. Dynamic Sitemap

Located at `/app/sitemap.ts`, automatically generates:

- Static pages with appropriate priorities
- Dynamic certification pages
- Firm-specific certification catalogs
- Proper change frequencies and priorities

### 2. Robots.txt

Enhanced robots.txt at `/app/robots.ts` includes:

- Specific rules for different search engines
- Protected routes (admin, API, private areas)
- Crawl delay specifications
- UTM and tracking parameter exclusions

### 3. Metadata Generation

Utility functions in `/src/lib/seo.ts` provide:

- **generateMetadata()**: Standard page metadata
- **generateCertificationMetadata()**: Certification-specific SEO
- **generateFirmMetadata()**: Firm-specific SEO
- **generateCertificationStructuredData()**: Course structured data

### 4. Open Graph Images

Dynamic OG image generation at `/app/api/og/route.tsx`:

- Customizable title and description
- Brand-consistent design
- Automatic generation for certification pages

### Example Usage:

```typescript
// In any page.tsx or layout.tsx
import { generateMetadata } from '@/src/lib/seo';

export const metadata = generateMetadata({
  title: 'Custom Page Title',
  description: 'Custom page description',
  keywords: 'relevant, keywords, here',
});
```

## 🔧 Configuration Files

### 1. SEO Config (`/src/config/seo.ts`)

Central configuration for:

- Site information
- Default metadata
- Social media handles
- Page templates
- Keywords by category

### 2. Next.js Config (`next.config.ts`)

Enhanced with:

- SEO-friendly headers
- Proper caching for static files
- Security headers
- Redirects for canonical URLs

## 📱 PWA Support

### Manifest.json

Enhanced manifest includes:

- Proper icon sizes and purposes
- App shortcuts for quick actions
- Screenshots for app stores
- Comprehensive metadata

## 🔒 Security Features

### Security.txt

Located at `/public/.well-known/security.txt`:

- Security contact information
- Disclosure policy
- Encryption keys (when available)

### Security Headers

Implemented in `next.config.ts`:

- X-Content-Type-Options
- X-Frame-Options
- X-XSS-Protection
- Referrer-Policy

## 🔍 Search Engine Verification

Add verification codes to `.env.local`:

```bash
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=your-google-code
NEXT_PUBLIC_BING_SITE_VERIFICATION=your-bing-code
NEXT_PUBLIC_YANDEX_SITE_VERIFICATION=your-yandex-code
NEXT_PUBLIC_YAHOO_SITE_VERIFICATION=your-yahoo-code
```

## 📈 Monitoring and Analytics

### Key Metrics to Track

1. **Page Views**: Automatic tracking on all pages
2. **User Engagement**: Signups, logins, session duration
3. **Certification Activity**: Starts, completions, views
4. **AI Interactions**: Question generations, recommendations
5. **Business Conversions**: Contact forms, pricing page views
6. **Search Performance**: Internal search queries and results

### Custom Dimensions

The analytics implementation supports custom parameters for:

- Certification IDs and names
- Firm codes
- User types
- Feature usage
- Content categories

## 🚀 Deployment Checklist

Before going live, ensure:

1. ✅ Replace `G-XXXXXXXXXX` with actual GA4 Measurement ID
2. ✅ Update verification codes with real values
3. ✅ Replace placeholder contact emails
4. ✅ Add actual social media URLs
5. ✅ Generate and upload proper icons (192x192, 512x512)
6. ✅ Create actual screenshots for manifest
7. ✅ Update business address in structured data
8. ✅ Set up Google Search Console
9. ✅ Submit sitemap to search engines
10. ✅ Test all analytics events in GA4

## 📋 Testing

### Analytics Testing

1. Enable GA4 DebugView in development
2. Test event firing with browser dev tools
3. Verify custom parameters are captured
4. Check real-time reports in GA4

### SEO Testing

1. Validate structured data with Google's Rich Results Test
2. Check robots.txt accessibility
3. Verify sitemap generation and accessibility
4. Test Open Graph images with social media debuggers
5. Validate metadata with SEO analysis tools

## 🔧 Maintenance

### Regular Tasks

1. **Monthly**: Review analytics data and adjust tracking
2. **Quarterly**: Update sitemap priorities based on performance
3. **Yearly**: Review and update keywords and descriptions
4. **As needed**: Add new event tracking for new features

### Performance Monitoring

- Monitor Core Web Vitals in GA4
- Track site speed and user experience metrics
- Review crawl errors in Google Search Console
- Monitor social sharing performance

## 📚 Resources

- [Google Analytics 4 Documentation](https://developers.google.com/analytics/devguides/collection/ga4)
- [Next.js SEO Documentation](https://nextjs.org/learn/seo/introduction-to-seo)
- [Schema.org Documentation](https://schema.org/)
- [Open Graph Protocol](https://ogp.me/)
- [Robots.txt Specification](https://developers.google.com/search/docs/advanced/robots/robots_txt)

## 🆘 Troubleshooting

### Common Issues

1. **Analytics not firing**: Check measurement ID and environment variables
2. **Sitemap errors**: Verify dynamic data fetching and error handling
3. **OG images not loading**: Check API route and image generation
4. **Robots.txt issues**: Verify proper route handling and syntax

### Debug Mode

Enable analytics debug mode in development:

```typescript
// Add to analytics component
gtag('config', 'GA_MEASUREMENT_ID', {
  debug_mode: process.env.NODE_ENV === 'development',
});
```

This comprehensive implementation provides a solid foundation for SEO and analytics that will grow with your application.
