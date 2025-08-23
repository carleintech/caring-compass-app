import { NextRequest } from 'next/server'
import { PrismaClient } from '@caring-compass/database'
import { AuthService, AuthUser, createAuthConfig } from '@caring-compass/auth'
import { createClient } from '@supabase/supabase-js'

// Create singleton instances
let prisma: PrismaClient | undefined
let authService: AuthService | undefined

function getPrismaClient(): PrismaClient {
  if (!prisma) {
    prisma = new PrismaClient({
      log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    })
  }
  return prisma
}

function getAuthService(): AuthService {
  if (!authService) {
    const config = createAuthConfig()
    authService = new AuthService(config, getPrismaClient())
  }
  return authService
}

// Base context type (no user)
export interface BaseContext {
  prisma: PrismaClient
  authService: AuthService
  req?: NextRequest
  headers?: Record<string, string>
}

// Protected context type (with authenticated user)
export interface ProtectedContext extends BaseContext {
  user: AuthUser
}

/**
 * Create context for tRPC
 * This runs for every request
 */
export async function createTRPCContext(opts: {
  req?: NextRequest
  headers?: Record<string, string>
}): Promise<BaseContext> {
  const { req, headers } = opts

  return {
    prisma: getPrismaClient(),
    authService: getAuthService(),
    req,
    headers: headers || (req ? Object.fromEntries(req.headers.entries()) : {})
  }
}

/**
 * Extract user from request headers
 */
export async function getUserFromRequest(context: BaseContext): Promise<AuthUser | null> {
  const { req, headers, authService } = context
  
  // Try to get token from Authorization header
  const authHeader = headers?.['authorization'] || req?.headers.get('authorization')
  
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

    // Get user from our database
    const user = await authService.getUserById(supabaseUser.id)
    return user
  } catch (error) {
    console.error('Error extracting user from request:', error)
    return null
  }
}

/**
 * Create protected context with user
 */
export async function createProtectedContext(context: BaseContext): Promise<ProtectedContext | null> {
  const user = await getUserFromRequest(context)
  
  if (!user) {
    return null
  }

  return {
    ...context,
    user
  }
}

// Helper function to get client IP
export function getClientIP(req?: NextRequest): string | undefined {
  if (!req) return undefined

  // Check various headers for client IP
  const forwarded = req.headers.get('x-forwarded-for')
  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }

  const realIP = req.headers.get('x-real-ip')
  if (realIP) {
    return realIP
  }

  const cfConnectingIP = req.headers.get('cf-connecting-ip')
  if (cfConnectingIP) {
    return cfConnectingIP
  }

  return undefined
}

// Helper function to get user agent
export function getUserAgent(req?: NextRequest): string | undefined {
  if (!req) return undefined
  return req.headers.get('user-agent') || undefined
}

// Create audit log context
export interface AuditContext {
  userId?: string
  ipAddress?: string
  userAgent?: string
  timestamp: Date
}

export function createAuditContext(
  user?: AuthUser,
  req?: NextRequest
): AuditContext {
  return {
    userId: user?.id,
    ipAddress: getClientIP(req),
    userAgent: getUserAgent(req),
    timestamp: new Date()
  }
}

// Export types for use in routers
export type { BaseContext, ProtectedContext, AuditContext }