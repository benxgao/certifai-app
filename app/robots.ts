import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/main/', // Protected user areas
          '/api/', // API routes
          '/admin/', // Admin areas
          '/private/', // Private content
          '/temp/', // Temporary files
          '/.well-known/', // Well-known files
          '/auth-cookie/', // Auth endpoints
          '/test-*', // Test pages
          '/*?utm_*', // UTM tracking parameters
          '/*?fbclid=*', // Facebook click tracking
          '/*?gclid=*', // Google click tracking
          '/*?*sessionid*', // Session IDs
          '/*?*PHPSESSID*', // PHP session IDs
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/main/', '/api/', '/admin/', '/private/', '/auth-cookie/', '/temp/'],
        crawlDelay: 1,
      },
      {
        userAgent: 'Bingbot',
        allow: '/',
        disallow: ['/main/', '/api/', '/admin/', '/private/', '/auth-cookie/', '/temp/'],
        crawlDelay: 1,
      },
      {
        userAgent: 'facebookexternalhit',
        allow: '/',
        disallow: ['/main/', '/api/', '/admin/', '/private/', '/auth-cookie/'],
      },
      {
        userAgent: 'Twitterbot',
        allow: '/',
        disallow: ['/main/', '/api/', '/admin/', '/private/', '/auth-cookie/'],
      },
      {
        userAgent: 'LinkedInBot',
        allow: '/',
        disallow: ['/main/', '/api/', '/admin/', '/private/', '/auth-cookie/'],
      },
      {
        userAgent: 'Slackbot',
        allow: '/',
        disallow: ['/main/', '/api/', '/admin/', '/private/', '/auth-cookie/'],
      },
    ],
    sitemap: 'https://certestic.com/sitemap.xml',
    host: 'https://certestic.com',
  };
}
