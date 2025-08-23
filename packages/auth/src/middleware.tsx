import React from 'react'
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { AuthService } from './auth-service'
import { permissionsManager, PERMISSIONS } from './permissions'
import { 
  AuthUser, 
  AuthError, 
  AuthErrorCode, 
  RouteGuardConfig, 
  Permission,
  AuthRequest 
} from './types'
import { UserRole } from '@caring-compass/database'

/**
 * Authentication middleware for Next.js API routes
 */
export class AuthMiddleware {
  private authService: AuthService

  constructor(authService: AuthService) {
    this.authService = authService
  }

  /**
   * Middleware to verify JWT token and populate user in request
   */
  requireAuth = (handler: (req: AuthRequest, res: NextResponse) => Promise<NextResponse>) => {
    return async (req: NextRequest): Promise<NextResponse> => {
      try {
        const user = await this.extractUserFromRequest(req)
        
        if (!user) {
          return NextResponse.json(
            { error: 'Authentication required' },
            { status: 401 }
          )
        }

        // Add user to request object
        const authReq = req as AuthRequest
        authReq.user = user

        return await handler(authReq, NextResponse.next())
      } catch (error) {
        console.error('Auth middleware error:', error)
        return NextResponse.json(
          { error: 'Invalid authentication token' },
          { status: 401 }
        )
      }
    }
  }

  /**
   * Middleware to check specific permissions
   */
  requirePermissions = (permissions: Permission[], requireAll = true) => {
    return (handler: (req: AuthRequest, res: NextResponse) => Promise<NextResponse>) => {
      return this.requireAuth(async (req: AuthRequest, res: NextResponse) => {
        const user = req.user!

        const hasPermission = requireAll
          ? permissionsManager.hasAllPermissions(user, permissions)
          : permissionsManager.hasAnyPermission(user, permissions)

        if (!hasPermission) {
          return NextResponse.json(
            { error: 'Insufficient permissions' },
            { status: 403 }
          )
        }

        return await handler(req, res)
      })
    }
  }

  /**
   * Middleware to check specific roles
   */
  requireRoles = (roles: UserRole[], requireAll = false) => {
    return (handler: (req: AuthRequest, res: NextResponse) => Promise<NextResponse>) => {
      return this.requireAuth(async (req: AuthRequest, res: NextResponse) => {
        const user = req.user!

        const hasRole = requireAll
          ? roles.every(role => user.role === role)
          : roles.includes(user.role)

        if (!hasRole) {
          return NextResponse.json(
            { error: 'Insufficient role permissions' },
            { status: 403 }
          )
        }

        return await handler(req, res)
      })
    }
  }

  /**
   * Admin-only middleware
   */
  requireAdmin = (handler: (req: AuthRequest, res: NextResponse) => Promise<NextResponse>) => {
    return this.requireRoles([UserRole.ADMIN])(handler)
  }

  /**
   * Staff-only middleware (Admin or Coordinator)
   */
  requireStaff = (handler: (req: AuthRequest, res: NextResponse) => Promise<NextResponse>) => {
    return this.requireRoles([UserRole.ADMIN, UserRole.COORDINATOR])(handler)
  }

  /**
   * Extract user from request headers
   */
  private async extractUserFromRequest(req: NextRequest): Promise<AuthUser | null> {
    const authHeader = req.headers.get('authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null
    }

    const token = authHeader.substring(7)
    
    try {
      // Verify token with Supabase
      const supabase = createClient(
        process.env.SUPABASE_URL!,
        process.env.SUPABASE_ANON_KEY!
      )

      const { data: { user: supabaseUser }, error } = await supabase.auth.getUser(token)
      
      if (error || !supabaseUser) {
        return null
      }

      // Get user from database
      const user = await this.authService.getUserById(supabaseUser.id)
      return user
    } catch (error) {
      console.error('Token verification error:', error)
      return null
    }
  }
}

/**
 * Frontend route protection using Next.js middleware
 */
export class RouteGuard {
  private static instance: RouteGuard
  private routeConfigs: Map<string, RouteGuardConfig> = new Map()

  static getInstance(): RouteGuard {
    if (!RouteGuard.instance) {
      RouteGuard.instance = new RouteGuard()
    }
    return RouteGuard.instance
  }

  /**
   * Configure route protection
   */
  configureRoute(path: string, config: RouteGuardConfig): void {
    this.routeConfigs.set(path, config)
  }

  /**
   * Configure multiple routes at once
   */
  configureRoutes(routes: Record<string, RouteGuardConfig>): void {
    Object.entries(routes).forEach(([path, config]) => {
      this.configureRoute(path, config)
    })
  }

  /**
   * Middleware function for Next.js
   */
  middleware = async (request: NextRequest): Promise<NextResponse> => {
    const { pathname } = request.nextUrl
    
    // Find matching route configuration
    const config = this.findRouteConfig(pathname)
    
    if (!config) {
      // No protection configured for this route
      return NextResponse.next()
    }

    try {
      const user = await this.extractUserFromRequest(request)
      
      if (!user) {
        // Redirect to login if user is not authenticated
        const loginUrl = new URL('/auth/login', request.url)
        loginUrl.searchParams.set('redirect', pathname)
        return NextResponse.redirect(loginUrl)
      }

      // Check role requirements
      if (config.roles && config.roles.length > 0) {
        const hasRequiredRole = config.requireAll
          ? config.roles.every(role => user.role === role)
          : config.roles.includes(user.role)

        if (!hasRequiredRole) {
          const redirectUrl = config.redirectTo || '/unauthorized'
          return NextResponse.redirect(new URL(redirectUrl, request.url))
        }
      }

      // Check permission requirements
      if (config.permissions && config.permissions.length > 0) {
        const hasRequiredPermissions = config.requireAll
          ? permissionsManager.hasAllPermissions(user, config.permissions)
          : permissionsManager.hasAnyPermission(user, config.permissions)

        if (!hasRequiredPermissions) {
          const redirectUrl = config.redirectTo || '/unauthorized'
          return NextResponse.redirect(new URL(redirectUrl, request.url))
        }
      }

      // User is authorized, continue to the route
      return NextResponse.next()
    } catch (error) {
      console.error('Route guard error:', error)
      const loginUrl = new URL('/auth/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  private findRouteConfig(pathname: string): RouteGuardConfig | null {
    // First try exact match
    if (this.routeConfigs.has(pathname)) {
      return this.routeConfigs.get(pathname)!
    }

    // Then try pattern matching (for dynamic routes)
    for (const [pattern, config] of this.routeConfigs.entries()) {
      if (this.matchPattern(pattern, pathname)) {
        return config
      }
    }

    return null
  }

  private matchPattern(pattern: string, pathname: string): boolean {
    // Convert Next.js dynamic route pattern to regex
    const regexPattern = pattern
      .replace(/\[\.\.\.(\w+)\]/g, '.*') // [...param] -> .*
      .replace(/\[(\w+)\]/g, '[^/]+')   // [param] -> [^/]+
      .replace(/\//g, '\\/')            // Escape forward slashes

    const regex = new RegExp(`^${regexPattern}$`)
    return regex.test(pathname)
  }

  private async extractUserFromRequest(request: NextRequest): Promise<AuthUser | null> {
    // Try to get token from cookie first (for browser requests)
    const token = request.cookies.get('sb-access-token')?.value ||
                 request.headers.get('authorization')?.replace('Bearer ', '')

    if (!token) {
      return null
    }

    try {
      const supabase = createClient(
        process.env.SUPABASE_URL!,
        process.env.SUPABASE_ANON_KEY!
      )

      const { data: { user: supabaseUser }, error } = await supabase.auth.getUser(token)
      
      if (error || !supabaseUser) {
        return null
      }

      // Get user from your database
      // You'll need to create a method to get user by ID without the full AuthService
      return await this.getUserById(supabaseUser.id)
    } catch (error) {
      console.error('Token verification error:', error)
      return null
    }
  }

  private async getUserById(id: string): Promise<AuthUser | null> {
    // This would typically use a lightweight database client
    // For now, we'll use a simplified version
    // In a real implementation, you'd want to optimize this
    return null // Placeholder
  }
}

/**
 * Helper function to create route configurations
 */
export const createRouteConfig = (config: RouteGuardConfig): RouteGuardConfig => config

/**
 * Predefined route configurations for common scenarios
 */
export const commonRouteConfigs = {
  adminOnly: createRouteConfig({
    roles: [UserRole.ADMIN],
    redirectTo: '/unauthorized'
  }),

  staffOnly: createRouteConfig({
    roles: [UserRole.ADMIN, UserRole.COORDINATOR],
    redirectTo: '/unauthorized'
  }),

  clientPortal: createRouteConfig({
    roles: [UserRole.CLIENT, UserRole.FAMILY],
    redirectTo: '/unauthorized'
  }),

  caregiverPortal: createRouteConfig({
    roles: [UserRole.CAREGIVER],
    redirectTo: '/unauthorized'
  }),

  coordinatorPortal: createRouteConfig({
    roles: [UserRole.ADMIN, UserRole.COORDINATOR],
    redirectTo: '/unauthorized'
  }),

  authenticatedOnly: createRouteConfig({
    roles: [UserRole.ADMIN, UserRole.COORDINATOR, UserRole.CAREGIVER, UserRole.CLIENT, UserRole.FAMILY],
    redirectTo: '/auth/login'
  })
}

/**
 * Utility function to setup common route protections
 */
export const setupCommonRoutes = (): void => {
  const routeGuard = RouteGuard.getInstance()

  routeGuard.configureRoutes({
    // Admin routes
    '/admin': commonRouteConfigs.adminOnly,
    '/admin/[...path]': commonRouteConfigs.adminOnly,

    // Coordinator/Staff routes
    '/coordinator': commonRouteConfigs.coordinatorPortal,
    '/coordinator/[...path]': commonRouteConfigs.coordinatorPortal,
    '/schedule': commonRouteConfigs.staffOnly,
    '/schedule/[...path]': commonRouteConfigs.staffOnly,
    '/reports': commonRouteConfigs.staffOnly,
    '/reports/[...path]': commonRouteConfigs.staffOnly,

    // Client portal routes
    '/client': commonRouteConfigs.clientPortal,
    '/client/[...path]': commonRouteConfigs.clientPortal,
    '/billing': commonRouteConfigs.clientPortal,
    '/billing/[...path]': commonRouteConfigs.clientPortal,

    // Caregiver portal routes
    '/caregiver': commonRouteConfigs.caregiverPortal,
    '/caregiver/[...path]': commonRouteConfigs.caregiverPortal,

    // General authenticated routes
    '/dashboard': commonRouteConfigs.authenticatedOnly,
    '/profile': commonRouteConfigs.authenticatedOnly,
    '/messages': commonRouteConfigs.authenticatedOnly,
    '/messages/[...path]': commonRouteConfigs.authenticatedOnly,
    '/documents': commonRouteConfigs.authenticatedOnly,
    '/documents/[...path]': commonRouteConfigs.authenticatedOnly,
  })
}

/**
 * HOC for protecting React components
 */
export const withAuth = (
  WrappedComponent: React.ComponentType<any>,
  config?: RouteGuardConfig
) => {
  return function AuthenticatedComponent(props: any) {
    // This would integrate with your React auth context
    // Implementation depends on your frontend architecture
    return <WrappedComponent {...props} />
  }
}

export default RouteGuard