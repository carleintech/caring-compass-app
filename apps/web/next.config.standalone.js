/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configure React strict mode and other runtime options
  reactStrictMode: true,
  // Add page extensions
  pageExtensions: ['tsx', 'ts', 'jsx', 'js'],
  // Optimize loading
  optimizeFonts: true,

  // Image optimization
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'api.placeholder.com',
        port: '',
        pathname: '/**',
      }
    ],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60,
  },

  // Webpack configuration
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Add webpack aliases for stub files
    config.resolve.alias = {
      ...config.resolve.alias,
      '@caring-compass/api': require.resolve('./src/lib/api-stub.ts'),
      '@caring-compass/auth': require.resolve('./src/lib/auth-stub.ts'),
      '@caring-compass/database': require.resolve('./src/lib/database-stub.ts'),
    };

    return config;
  },

  // Build configuration
  swcMinify: true,
  
  // Environment variables
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },

  // Redirects for better SEO
  async redirects() {
    return [
      // Add any redirects here if needed
    ]
  },

  // Headers for security
  async headers() {
    return [
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
    ]
  },
}

module.exports = nextConfig
