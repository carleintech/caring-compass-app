// monitoring/sentry.config.ts
import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  
  // Performance monitoring
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
  
  // Error filtering
  beforeSend(event, hint) {
    // Filter out known non-critical errors
    const error = hint.originalException
    
    if (error && error.message) {
      // Skip network errors that are user-related
      if (error.message.includes('Network Error') || 
          error.message.includes('fetch')) {
        return null
      }
      
      // Skip client-side validation errors
      if (error.message.includes('validation')) {
        return null
      }
    }
    
    return event
  },
  
  // Enhanced context for healthcare app
  initialScope: {
    tags: {
      component: 'caring-compass',
      version: process.env.npm_package_version
    }
  },
  
  // Performance monitoring for healthcare compliance
  integrations: [
    new Sentry.BrowserTracing({
      // Track user interactions
      tracingOrigins: ['localhost', /^\/api/],
      
      // Monitor Core Web Vitals
      enableWebVitals: true,
      
      // Custom routing for healthcare portals
      routingInstrumentation: Sentry.reactRouterV6Instrumentation(
        React.useEffect,
        useLocation,
        useNavigationType,
        createRoutesFromChildren,
        matchRoutes
      )
    })
  ],
  
  // Healthcare-specific error tracking
  tags: {
    feature: 'healthcare-management',
    compliance: 'hipaa-ready'
  }
})