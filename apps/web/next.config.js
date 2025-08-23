/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable experimental features
  experimental: {
    // Enable server components
    serverComponentsExternalPackages: ['@caring-compass/database'],
    // Optimize for monorepo
    optimizePackageImports: ['@caring-compass/api', '@caring-compass/auth'],
    // Enable TypeScript plugin
    typedRoutes: true,
  },
  // Configure React strict mode and other runtime options
  reactStrictMode: true,
  // Add page extensions
  pageExtensions: ['tsx', 'ts', 'jsx', 'js'],
  // Improve hydration performance
  compiler: {
    styledComponents: true,
  },
  // Optimize loading
  optimizeFonts: true,

  // Transpile monorepo packages
  transpilePackages: [
    '@caring-compass/api',
    '@caring-compass/auth',
    '@caring-compass/services',
  ],

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
    ],
    formats: ['image/webp', 'image/avif'],
  },

  // Security headers
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
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(self)',
          },
        ],
      },
    ]
  },

  // Redirects
  async redirects() {
    return [
      {
        source: '/dashboard',
        destination: '/client/dashboard',
        permanent: false,
        has: [
          {
            type: 'cookie',
            key: 'user-role',
            value: 'CLIENT',
          },
        ],
      },
      {
        source: '/dashboard',
        destination: '/caregiver/dashboard',
        permanent: false,
        has: [
          {
            type: 'cookie',
            key: 'user-role',
            value: 'CAREGIVER',
          },
        ],
      },
      {
        source: '/dashboard',
        destination: '/admin/dashboard',
        permanent: false,
        has: [
          {
            type: 'cookie',
            key: 'user-role',
            value: 'ADMIN',
          },
        ],
      },
    ]
  },

  // Environment variables validation
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY || 'default-value',
  },

  // Bundle analyzer (for development)
  ...(process.env.ANALYZE === 'true' && {
    bundleAnalyzer: {
      enabled: true,
    },
  }),

  // Output configuration
  output: process.env.NODE_ENV === 'production' ? 'standalone' : undefined,

  // Compiler options
  compiler: {
    // Remove console logs in production
    removeConsole: process.env.NODE_ENV === 'production',
  },

  // Webpack configuration
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Add custom webpack configurations here
    
    // Handle SVG imports
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });

    // Optimize for monorepo
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }

    return config;
  },

  // TypeScript configuration
  typescript: {
    // Type checking is handled by our CI/CD pipeline
    ignoreBuildErrors: false,
  },

  // ESLint configuration
  eslint: {
    // ESLint is handled by our CI/CD pipeline
    ignoreDuringBuilds: false,
  },

  // Performance optimizations
  poweredByHeader: false,
  compress: true,

  // Custom page extensions
  pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],

  // Internationalization (if needed in future)
  // i18n: {
  //   locales: ['en', 'es', 'ht'],
  //   defaultLocale: 'en',
  // },
}

// Export the config
module.exports = nextConfig;
