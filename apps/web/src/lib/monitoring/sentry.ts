// apps/web/src/lib/monitoring/sentry.ts
import * as Sentry from '@sentry/nextjs'
import type { ComponentType } from 'react'
import { ErrorBoundaryFallback } from '@/components/error-boundary'

const SENTRY_DSN = process.env.SENTRY_DSN

export function initSentry() {
  if (!SENTRY_DSN) {
    console.warn('Sentry DSN not found, error monitoring disabled')
    return
  }

  Sentry.init({
    dsn: SENTRY_DSN,
    environment: process.env.NODE_ENV,
    
    // Performance monitoring
    tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
    
    // Session replay
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
    
    // Release tracking
    release: process.env.VERCEL_GIT_COMMIT_SHA,
    
    // Custom error filtering
    beforeSend(event, hint) {
      // Filter out known non-critical errors
      if (event.exception) {
        const error = hint.originalException
        
        // Filter out network errors from development
        if (error?.message?.includes('fetch') && process.env.NODE_ENV === 'development') {
          return null
        }
        
        // Filter out authentication errors (handled by UI)
        if (error?.message?.includes('Unauthorized')) {
          return null
        }
      }
      
      return event
    },
    
    // Tag all events with user context
    initialScope: {
      tags: {
        component: 'caring-compass-web'
      }
    }
  })
}

// Custom error boundary with Sentry integration
export function withSentryErrorBoundary<P extends object>(Component: ComponentType<P>) {
  return Sentry.withErrorBoundary(Component, {
    fallback: ErrorBoundaryFallback,
    showDialog: false
  })
}