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
  // Add headers to handle Chrome DevTools endpoint properly
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
            value: 'no-cache, no-store, must-revalidate',
          },
        ],
      },
    ];
  },
  // Add proper support for serving static files
  async rewrites() {
    return [
      {
        source: '/.well-known/:path*',
        destination: '/.well-known/:path*',
      },
    ];
  },
};

export default nextConfig;
