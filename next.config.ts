// next.config.ts
import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

// Bundle analyzer (optional - install with: npm install @next/bundle-analyzer)
let withBundleAnalyzer = (config: NextConfig) => config;
try {
  const bundleAnalyzer = require('@next/bundle-analyzer');
  withBundleAnalyzer = bundleAnalyzer({
    enabled: process.env.ANALYZE === 'true',
  });
} catch (e) {
  console.log('Bundle analyzer not installed. Run: npm install @next/bundle-analyzer --save-dev');
}

const nextConfig: NextConfig = {
  // Exclude studio directory from build
  experimental: {
    optimizePackageImports: ['@sanity/image-url', 'next-intl'],
  },
  
  // Ignore studio directory
  typescript: {
    ignoreBuildErrors: false,
  },
  
  // Image optimization
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        pathname: "/**",
      },
    ],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  
  // Compression
  compress: true,
  
  // PWA Manifest
  async headers() {
    return [
      {
        source: '/manifest.json',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/manifest+json',
          },
        ],
      },
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ];
  },
  
  // Webpack optimizations
  webpack: (config, { isServer, dev }) => {
    // Production optimizations
    if (!dev && !isServer) {
      config.optimization.splitChunks.chunks = 'all';
      config.optimization.splitChunks.cacheGroups = {
        ...config.optimization.splitChunks.cacheGroups,
        sanity: {
          name: 'sanity',
          test: /[\\/]node_modules[\\/](@sanity|next-sanity)[\\/]/,
          chunks: 'all',
          priority: 30,
        },
        i18n: {
          name: 'i18n',
          test: /[\\/]node_modules[\\/](next-intl)[\\/]/,
          chunks: 'all',
          priority: 30,
        },
      };
    }
    
    return config;
  },
};

export default withBundleAnalyzer(withNextIntl(nextConfig));
