import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  turbopack: {
    rules: {
      // Add specific handling for .well-known paths to prevent issues
      '**/.well-known/**': {
        loaders: ['raw-loader'],
      },
    },
  },
  // Performance optimizations
  experimental: {
    optimizePackageImports: ['firebase', '@radix-ui/react-checkbox', '@radix-ui/react-label'],
  },

  // Add headers for SEO and performance
  async headers() {
    return [
      {
        source: '/.well-known/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization',
          },
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/robots.txt',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400, s-maxage=86400',
          },
        ],
      },
      {
        source: '/sitemap.xml',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=43200, s-maxage=43200',
          },
        ],
      },
      {
        source: '/manifest.json',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Content-Security-Policy',
            value:
              "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com https://apis.google.com https://identitytoolkit.googleapis.com https://securetoken.googleapis.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://www.google-analytics.com https://identitytoolkit.googleapis.com https://securetoken.googleapis.com wss://ws-us3.pusher.com; frame-src 'none'; object-src 'none'; base-uri 'self'; form-action 'self';",
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), payment=()',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload',
          },
        ],
      },
    ];
  },

  // Add proper support for serving static files and SEO files
  async rewrites() {
    return [
      {
        source: '/.well-known/:path*',
        destination: '/.well-known/:path*',
      },
      {
        source: '/robots.txt',
        destination: '/api/robots',
      },
      {
        source: '/sitemap.xml',
        destination: '/api/sitemap',
      },
    ];
  },

  // Redirects for SEO
  async redirects() {
    return [
      // Redirect www to non-www for consistency
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'www.certestic.com',
          },
        ],
        destination: 'https://certestic.com/:path*',
        permanent: true,
      },
      // Redirect old paths if any exist
      {
        source: '/login',
        destination: '/signin',
        permanent: true,
      },
      {
        source: '/register',
        destination: '/signup',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
