import { TRPCError, initTRPC } from '@trpc/server'
import { ZodError } from 'zod'
import superjson from 'superjson'
import { UserRole } from '@caring-compass/database'
import { permissionsManager, Permission } from '@caring-compass/auth'
import { 
  BaseContext, 
  ProtectedContext, 
  createProtectedContext,
  createAuditContext 
} from './context'
import { ProcedureType, CRUDProcedures, RouterTypes } from './types'

// Initialize tRPC
const t = initTRPC.context<BaseContext>().create({
  transformer: superjson,
  errorFormatter: ({ shape, error }) => {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.code === 'BAD_REQUEST' && error.cause instanceof ZodError
            ? error.cause.flatten()
            : null,
      },
    }
  },
})

// Create base router and middleware
export const createTRPCRouter = t.router
export const publicProcedure = t.procedure

// ===== MIDDLEWARE =====

/**
 * Authentication middleware
 * Requires user to be authenticated
 */
const enforceAuth = t.middleware(async ({ ctx, next }) => {
  const protectedContext = await createProtectedContext(ctx)
  
  if (!protectedContext) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'Authentication required'
    })
  }

  return next({
    ctx: protectedContext
  })
})

/**
 * Role-based access middleware
 */
const enforceRoles = (allowedRoles: UserRole[]) => 
  t.middleware(async ({ ctx, next }) => {
    const protectedContext = await createProtectedContext(ctx)
    
    if (!protectedContext) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'Authentication required'
      })
    }

    if (!allowedRoles.includes(protectedContext.user.role)) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: 'Insufficient permissions'
      })
    }

    return next({
      ctx: protectedContext
    })
  })

/**
 * Permission-based access middleware
 */
const enforcePermissions = (permissions: Permission[], requireAll = true) =>
  t.middleware(async ({ ctx, next }) => {
    const protectedContext = await createProtectedContext(ctx)
    
    if (!protectedContext) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'Authentication required'
      })
    }

    const hasPermission = requireAll
      ? permissionsManager.hasAllPermissions(protectedContext.user, permissions)
      : permissionsManager.hasAnyPermission(protectedContext.user, permissions)

    if (!hasPermission) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: 'Insufficient permissions'
      })
    }

    return next({
      ctx: protectedContext
    })
  })

/**
 * Audit logging middleware
 * Logs all mutations for compliance
 */
const auditLog = (action: string, resourceType: string) =>
  t.middleware(async ({ ctx, input, next }) => {
    const protectedContext = await createProtectedContext(ctx)
    const auditContext = createAuditContext(protectedContext?.user, ctx.req)

    // Execute the procedure
    const result = await next()

    // Log the action (only for mutations)
    if (protectedContext) {
      try {
        await ctx.prisma.auditLog.create({
          data: {
            userId: protectedContext.user.id,
            action: action as any, // Type assertion needed for enum
            resourceType,
            resourceId: typeof input === 'object' && input && 'id' in input 
              ? String(input.id) 
              : undefined,
            newValues: input,
            ipAddress: auditContext.ipAddress,
            userAgent: auditContext.userAgent,
            timestamp: auditContext.timestamp
          }
        })
      } catch (error) {
        console.error('Failed to create audit log:', error)
        // Don't fail the request if audit logging fails
      }
    }

    return result
  })

/**
 * Rate limiting middleware
 */
const rateLimit = (maxRequests: number, windowMs: number) => {
  const requests = new Map<string, { count: number; resetTime: number }>()

  return t.middleware(async ({ ctx, next }) => {
    const protectedContext = await createProtectedContext(ctx)
    const identifier = protectedContext?.user.id || 'anonymous'
    const now = Date.now()

    const userRequests = requests.get(identifier)
    
    if (!userRequests || now > userRequests.resetTime) {
      requests.set(identifier, { count: 1, resetTime: now + windowMs })
    } else {
      userRequests.count++
      
      if (userRequests.count > maxRequests) {
        throw new TRPCError({
          code: 'TOO_MANY_REQUESTS',
          message: 'Rate limit exceeded'
        })
      }
    }

    return next()
  })
}

// ===== PROCEDURES =====

/**
 * Protected procedure (requires authentication)
 */
export const protectedProcedure: ProcedureType = publicProcedure.use(enforceAuth)

/**
 * Admin-only procedure
 */
export const adminProcedure: ProcedureType = publicProcedure.use(
  enforceRoles([UserRole.ADMIN])
)

/**
 * Staff-only procedure (Admin or Coordinator)
 */
export const staffProcedure: ProcedureType = publicProcedure.use(
  enforceRoles([UserRole.ADMIN, UserRole.COORDINATOR])
)

/**
 * Client-only procedure
 */
export const clientProcedure: ProcedureType = publicProcedure.use(
  enforceRoles([UserRole.CLIENT, UserRole.FAMILY])
)

/**
 * Caregiver-only procedure
 */
export const caregiverProcedure: ProcedureType = publicProcedure.use(
  enforceRoles([UserRole.CAREGIVER])
)

/**
 * Create procedure with specific permissions
 */
export const createPermissionProcedure = (permissions: Permission[], requireAll = true) =>
  publicProcedure.use(enforcePermissions(permissions, requireAll))

/**
 * Create procedure with audit logging
 */
export const createAuditedProcedure = (action: string, resourceType: string) =>
  protectedProcedure.use(auditLog(action, resourceType))

/**
 * Create rate-limited procedure
 */
export const createRateLimitedProcedure = (maxRequests: number, windowMs: number) =>
  publicProcedure.use(rateLimit(maxRequests, windowMs))

// ===== HELPER FUNCTIONS =====

/**
 * Create a CRUD router with standard procedures
 */
export function createCRUDProcedures<T extends string>(resourceType: T) {
  return {
    create: createAuditedProcedure('CREATE', resourceType),
    read: protectedProcedure,
    update: createAuditedProcedure('UPDATE', resourceType),
    delete: createAuditedProcedure('DELETE', resourceType),
    list: protectedProcedure
  }
}

/**
 * Error handler for database operations
 */
export function handleDatabaseError(error: unknown): never {
  console.error('Database error:', error)
  
  if (error instanceof Error) {
    // Handle specific Prisma errors
    if (error.message.includes('Unique constraint')) {
      throw new TRPCError({
        code: 'CONFLICT',
        message: 'A record with this information already exists'
      })
    }
    
    if (error.message.includes('Foreign key constraint')) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Invalid reference to related record'
      })
    }
    
    if (error.message.includes('Record to update not found')) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Record not found'
      })
    }
  }
  
  throw new TRPCError({
    code: 'INTERNAL_SERVER_ERROR',
    message: 'An unexpected error occurred'
  })
}

/**
 * Pagination helper
 */
export function createPaginationQuery(page: number, limit: number) {
  const skip = (page - 1) * limit
  return {
    skip,
    take: limit
  }
}

/**
 * Create paginated response
 */
export function createPaginatedResponse<T>(
  items: T[],
  totalCount: number,
  page: number,
  limit: number
) {
  const totalPages = Math.ceil(totalCount / limit)
  
  return {
    items,
    totalCount,
    totalPages,
    currentPage: page,
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1
  }
}

/**
 * Access control helper
 */
export function checkResourceAccess(
  user: { id: string; role: UserRole },
  resourceUserId?: string,
  allowedRoles: UserRole[] = []
): boolean {
  // Admin and allowed roles have full access
  if ([UserRole.ADMIN, ...allowedRoles].includes(user.role)) {
    return true
  }
  
  // Users can access their own resources
  if (resourceUserId && user.id === resourceUserId) {
    return true
  }
  
  return false
}

// Export the tRPC instance for creating routers
export { t }