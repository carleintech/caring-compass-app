import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

// Use Supabase JWT secret to verify tokens signed by Supabase Auth
const JWT_SECRET = new TextEncoder().encode(
  process.env.SUPABASE_JWT_SECRET || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'your-secret-key'
)

interface TokenPayload {
  userId: string
  email: string
  role: string
  iat: number
  exp: number
}

// Define route configurations
const routeConfig = {
  // Public routes (no authentication required)
  public: [
    '/auth/login',
    '/auth/register',
    '/auth/forgot-password',
    '/auth/reset-password',
    '/',
    '/about',
    '/services',
    '/contact',
    '/careers',
    '/login',
    '/register',
    '/forgot-password',
    '/reset-password',
    '/privacy',
    '/terms'
  ],
  
  // Role-based protected routes
  protected: {
    // Admin and Coordinator routes
    admin: [
      '/admin',
      '/admin/dashboard',
      '/coordinator',
      '/coordinator/dashboard'
    ],
    
    // Caregiver routes
    caregiver: [
      '/caregiver',
      '/caregiver/dashboard'
    ],
    
    // Client and Family routes
    client: [
      '/client',
      '/client/dashboard',
      '/family',
      '/family/dashboard'
    ],
    
    // General authenticated routes (NO /dashboard here!)
    authenticated: [
      '/profile',
      '/messages',
      '/documents'
    ]
  }
}

async function verifyAuth(request: NextRequest): Promise<TokenPayload | null> {
  try {
    // Get token from authorization header or cookie
    const token = request.headers.get('authorization')?.replace('Bearer ', '') || 
                 request.cookies.get('auth-token')?.value

    if (!token) {
      return null
    }

    // Verify token and return payload
    const { payload } = await jwtVerify(token, JWT_SECRET)
    
    if (!payload.sub || !payload.email || !payload.role) {
      console.error('Invalid token payload:', payload)
      return null
    }

    return {
      userId: payload.sub as string,
      email: payload.email as string,
      role: payload.role as string,
      iat: payload.iat as number,
      exp: payload.exp as number
    } as TokenPayload
  } catch (error) {
    console.error('Token verification failed:', error)
    return null
  }
}

function isPublicRoute(pathname: string): boolean {
  return routeConfig.public.some(route => 
    pathname === route || pathname.startsWith(route + '/')
  )
}

function getRequiredRole(pathname: string): string | null {
  // Check admin routes
  if (routeConfig.protected.admin.some(route => pathname.startsWith(route))) {
    return 'admin'
  }
  
  // Check caregiver routes
  if (routeConfig.protected.caregiver.some(route => pathname.startsWith(route))) {
    return 'caregiver'
  }
  
  // Check client routes
  if (routeConfig.protected.client.some(route => pathname.startsWith(route))) {
    return 'client'
  }
  
  // Check general authenticated routes
  if (routeConfig.protected.authenticated.some(route => pathname.startsWith(route))) {
    return 'authenticated'
  }
  
  return null
}

function hasRequiredRole(userRole: string, requiredRole: string): boolean {
  if (requiredRole === 'authenticated') {
    return true // Any authenticated user can access
  }
  
  if (requiredRole === 'admin') {
    return ['ADMIN', 'COORDINATOR'].includes(userRole)
  }
  
  if (requiredRole === 'caregiver') {
    return userRole === 'CAREGIVER'
  }
  
  if (requiredRole === 'client') {
    return ['CLIENT', 'FAMILY'].includes(userRole)
  }
  
  return false
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Skip middleware for non-HTML routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.') ||
    pathname === '/favicon.ico'
  ) {
    return NextResponse.next()
  }

  // Get base URL for redirects
  const baseUrl = request.nextUrl.origin

  // Always allow public routes
  if (isPublicRoute(pathname)) {
    // If user is already authenticated and trying to access auth pages,
    // redirect to appropriate dashboard
    if (pathname.startsWith('/auth') || pathname === '/login') {
      const user = await verifyAuth(request)
      if (user) {
        let redirectPath = '/dashboard'
        switch (user.role) {
          case 'ADMIN':
          case 'COORDINATOR':
            redirectPath = '/admin/dashboard'
            break
          case 'CAREGIVER':
            redirectPath = '/caregiver/dashboard'
            break
          case 'CLIENT':
          case 'FAMILY':
            redirectPath = '/client/dashboard'
            break
        }
        return NextResponse.redirect(new URL(redirectPath, baseUrl))
      }
    }
    return NextResponse.next()
  }
  
  // Check if route requires authentication
  const requiredRole = getRequiredRole(pathname)
  if (!requiredRole) {
    return NextResponse.next()
  }
  
  // Verify authentication
  const user = await verifyAuth(request)
  if (!user) {
    const loginUrl = new URL('/login', baseUrl)
    loginUrl.searchParams.set('redirectTo', pathname)
    return NextResponse.redirect(loginUrl)
  }
  
  // Check role permissions
  if (!hasRequiredRole(user.role, requiredRole)) {
    let redirectPath = '/dashboard'
    switch (user.role) {
      case 'ADMIN':
      case 'COORDINATOR':
        redirectPath = '/admin/dashboard'
        break
      case 'CAREGIVER':
        redirectPath = '/caregiver/dashboard'
        break
      case 'CLIENT':
      case 'FAMILY':
        redirectPath = '/client/dashboard'
        break
    }
    
    return NextResponse.redirect(new URL(redirectPath, request.url))
  }
  
  // User is authenticated and has required permissions
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all routes except:
     * - API routes (/api/*)
     * - Static files (_next/static/*, _next/image/*, *.*)
     * - Internal Next.js routes (_next/*)
     * - Favicon and other root files (favicon.ico, etc.)
     */
    '/((?!api/|_next/|.*\\.).*)',
    '/api/trpc/:path*'
  ]
}