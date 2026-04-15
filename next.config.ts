import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Local dev — any port (runserver :8000 or gunicorn :8098)
      {
        protocol: 'http',
        hostname: 'localhost',
        pathname: '/media/**',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        pathname: '/media/**',
      },
      // UAT
      {
        protocol: 'https',
        hostname: 'mite-choco.mitetechnology.in',
        pathname: '/media/**',
      },
      // Prod
      {
        protocol: 'https',
        hostname: 'mite-choco.mitetechnology.com',
        pathname: '/media/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
};

export default nextConfig;
