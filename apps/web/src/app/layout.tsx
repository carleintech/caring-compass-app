import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Providers from '@/components/providers/providers'
import { cn } from '@/lib/utils'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  ),
  title: {
    default: 'Caring Compass Home Care',
    template: '%s | Caring Compass'
  },
  description: 'Compassionate home care services that honor your desire to age in place with dignity and independence.',
  applicationName: 'Caring Compass',
  authors: { name: 'Caring Compass Team' },
  generator: 'Next.js',
  creator: 'Caring Compass',
  publisher: 'Caring Compass',
  formatDetection: {
    telephone: false,
    address: false,
    email: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    title: 'Caring Compass Home Care',
    description: 'Compassionate home care services that honor your desire to age in place with dignity and independence.',
    siteName: 'Caring Compass',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Caring Compass Home Care',
    description: 'Compassionate home care services that honor your desire to age in place with dignity and independence.',
    creator: '@caringcompass',
    site: '@caringcompass',
  },
  keywords: [
    'home care',
    'elder care',
    'senior care',
    'personal care assistant',
    'PCA',
    'CNA',
    'Virginia Beach',
    'Norfolk',
    'Hampton Roads',
    'aging in place',
    'caregiver services'
  ],
  authors: [
    {
      name: 'Caring Compass Home Care LLC',
      url: 'https://caringcompass.com',
    },
  ],
  creator: 'Caring Compass Home Care LLC',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://caringcompass.com',
    siteName: 'Caring Compass Home Care',
    title: 'Caring Compass Home Care - Compassionate Care at Home',
    description: 'Professional home care services that help seniors and adults with disabilities maintain their independence and dignity in the comfort of their own homes.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Caring Compass Home Care',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Caring Compass Home Care',
    description: 'Compassionate home care services in Hampton Roads, Virginia',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  manifest: '/manifest.json',
  other: {
    'application-name': 'Caring Compass',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
    'apple-mobile-web-app-title': 'Caring Compass',
    'format-detection': 'telephone=no',
    'mobile-web-app-capable': 'yes',
    'msapplication-config': '/browserconfig.xml',
    'msapplication-TileColor': '#3b82f6',
    'msapplication-tap-highlight': 'no',
    'theme-color': '#3b82f6',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Preload critical fonts */}
        <link
          rel="preload"
          href="/fonts/inter-var.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />

        {/* Primary Meta Tags */}
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="color-scheme" content="light dark" />
        <meta name="format-detection" content="telephone=no" />
        
        {/* Icons */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        
        {/* PWA/Mobile Meta Tags */}
        <meta name="application-name" content="Caring Compass" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Caring Compass" />
        <meta name="mobile-web-app-capable" content="yes" />
        
        {/* Microsoft Meta Tags */}
        <meta name="msapplication-config" content="/browserconfig.xml" />
        <meta name="msapplication-TileColor" content="#3b82f6" />
        <meta name="msapplication-tap-highlight" content="no" />
        
        {/* Theme Meta Tags */}
        <meta
          name="theme-color"
          content="#3b82f6"
          media="(prefers-color-scheme: light)"
        />
        <meta
          name="theme-color"
          content="#1e293b"
          media="(prefers-color-scheme: dark)"
        />
      </head>
      <body 
        className={cn(
          'min-h-screen bg-background font-sans antialiased',
          inter.variable
        )}
        suppressHydrationWarning
      >
        <Providers>
          <div className="relative min-h-screen">
            {/* Skip to main content link for accessibility */}
            <a
              href="#main-content"
              className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              Skip to main content
            </a>
            
            {/* Main application content */}
            <main id="main-content" className="relative flex min-h-screen flex-col">
              {children}
            </main>
          </div>
          
          {/* Screen reader announcements */}
          <div
            id="announcements"
            aria-live="polite"
            aria-atomic="true"
            className="sr-only"
          />
          
          {/* Emergency announcements */}
          <div
            id="emergency-announcements"
            aria-live="assertive"
            aria-atomic="true"
            className="sr-only"
          />
          {/* Toast notifications handled by ToastProvider */}
        </Providers>
      </body>
    </html>
  )
}