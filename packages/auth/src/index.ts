// Core authentication service
export { AuthService } from './auth-service'

// Types and interfaces
export * from './types'

// Permissions system
export { 
  PermissionsManager, 
  permissionsManager, 
  PERMISSIONS, 
  ROLE_PERMISSIONS,
  authUtils 
} from './permissions'

// Middleware and route protection
export { 
  AuthMiddleware, 
  RouteGuard, 
  createRouteConfig,
  commonRouteConfigs,
  setupCommonRoutes,
  withAuth 
} from './middleware'

// Configuration
export const createAuthConfig = (overrides: Partial<any> = {}) => ({
  supabase: {
    url: process.env.SUPABASE_URL!,
    anonKey: process.env.SUPABASE_ANON_KEY!,
    serviceKey: process.env.SUPABASE_SERVICE_KEY!,
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'your-secret-key',
    expiresIn: '24h',
    refreshExpiresIn: '30d',
  },
  passwords: {
    minLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: true,
    maxAttempts: 5,
    lockoutDuration: 30, // minutes
  },
  session: {
    timeout: 1440, // 24 hours in minutes
    extendOnActivity: true,
  },
  mfa: {
    issuer: 'Caring Compass',
    enabled: false, // Enable in production
  },
  email: {
    from: 'noreply@caringcompass.com',
    templates: {
      welcome: 'welcome-template-id',
      passwordReset: 'password-reset-template-id',
      emailVerification: 'email-verification-template-id',
    }
  },
  ...overrides
})