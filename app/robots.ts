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
          '/*?*', // Dynamic query parameters
          '/temp/', // Temporary files
          '/.well-known/', // Well-known files
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/main/', '/api/', '/admin/', '/private/'],
        crawlDelay: 1,
      },
      {
        userAgent: 'Bingbot',
        allow: '/',
        disallow: ['/main/', '/api/', '/admin/', '/private/'],
        crawlDelay: 1,
      },
      {
        userAgent: 'facebookexternalhit',
        allow: '/',
        disallow: ['/main/', '/api/', '/admin/', '/private/'],
      },
      {
        userAgent: 'Twitterbot',
        allow: '/',
        disallow: ['/main/', '/api/', '/admin/', '/private/'],
      },
    ],
    sitemap: 'https://certifai.app/sitemap.xml',
    host: 'https://certifai.app',
  };
}
