import { TRPCError } from '@trpc/server'
import { z } from 'zod'
import { AuthError, AuthErrorCode } from '@caring-compass/auth'
import { 
  createTRPCRouter, 
  publicProcedure, 
  protectedProcedure, 
  adminProcedure,
  createRateLimitedProcedure,
  handleDatabaseError,
  createPaginationQuery,
  createPaginatedResponse
} from '../trpc/trpc'
import { createAuditContext } from '../trpc/context'
import { authSchemas } from '../schemas'

// Rate-limited procedures for auth endpoints
const authProcedure = createRateLimitedProcedure(10, 60000) // 10 requests per minute
const loginProcedure = createRateLimitedProcedure(5, 60000)  // 5 login attempts per minute

export const authRouter = createTRPCRouter({
  // ===== AUTHENTICATION =====
  
  /**
   * User login
   */
  signIn: loginProcedure
    .input(authSchemas.login)
    .output(authSchemas.loginResponse)
    .mutation(async ({ ctx, input }) => {
      try {
        const auditContext = createAuditContext(undefined, ctx.req)
        
        const result = await ctx.authService.signIn(input, {
          ipAddress: auditContext.ipAddress,
          userAgent: auditContext.userAgent
        })
        
        return result
      } catch (error) {
        if (error instanceof AuthError) {
          throw new TRPCError({
            code: error.statusCode === 401 ? 'UNAUTHORIZED' : 'BAD_REQUEST',
            message: error.message
          })
        }
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Login failed'
        })
      }
    }),

  /**
   * User registration
   */
  signUp: authProcedure
    .input(authSchemas.register)
    .output(authSchemas.registerResponse)
    .mutation(async ({ ctx, input }) => {
      try {
        const auditContext = createAuditContext(undefined, ctx.req)
        
        const result = await ctx.authService.signUp(input, {
          ipAddress: auditContext.ipAddress,
          userAgent: auditContext.userAgent
        })
        
        return result
      } catch (error) {
        if (error instanceof AuthError) {
          const statusCode = error.code === AuthErrorCode.USER_ALREADY_EXISTS ? 409 : 400
          throw new TRPCError({
            code: statusCode === 409 ? 'CONFLICT' : 'BAD_REQUEST',
            message: error.message
          })
        }
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Registration failed'
        })
      }
    }),

  /**
   * User logout
   */
  signOut: protectedProcedure
    .input(authSchemas.logout)
    .mutation(async ({ ctx, input }) => {
      try {
        const auditContext = createAuditContext(ctx.user, ctx.req)
        
        await ctx.authService.signOut(ctx.user.id, {
          ipAddress: auditContext.ipAddress,
          userAgent: auditContext.userAgent
        })
        
        return { success: true }
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Logout failed'
        })
      }
    }),

  /**
   * Password reset request
   */
  requestPasswordReset: authProcedure
    .input(authSchemas.passwordResetRequest)
    .mutation(async ({ ctx, input }) => {
      try {
        const auditContext = createAuditContext(undefined, ctx.req)
        
        await ctx.authService.resetPassword(input, {
          ipAddress: auditContext.ipAddress,
          userAgent: auditContext.userAgent
        })
        
        return { 
          success: true, 
          message: 'Password reset email sent if account exists' 
        }
      } catch (error) {
        if (error instanceof AuthError) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: error.message
          })
        }
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Password reset request failed'
        })
      }
    }),

  /**
   * Update password
   */
  updatePassword: protectedProcedure
    .input(authSchemas.passwordUpdate)
    .mutation(async ({ ctx, input }) => {
      try {
        const auditContext = createAuditContext(ctx.user, ctx.req)
        
        await ctx.authService.updatePassword(ctx.user.id, input, {
          ipAddress: auditContext.ipAddress,
          userAgent: auditContext.userAgent
        })
        
        return { success: true, message: 'Password updated successfully' }
      } catch (error) {
        if (error instanceof AuthError) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: error.message
          })
        }
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Password update failed'
        })
      }
    }),

  /**
   * Update email
   */
  updateEmail: protectedProcedure
    .input(authSchemas.emailUpdate)
    .mutation(async ({ ctx, input }) => {
      try {
        const auditContext = createAuditContext(ctx.user, ctx.req)
        
        await ctx.authService.updateEmail(ctx.user.id, input, {
          ipAddress: auditContext.ipAddress,
          userAgent: auditContext.userAgent
        })
        
        return { success: true, message: 'Email updated successfully' }
      } catch (error) {
        if (error instanceof AuthError) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: error.message
          })
        }
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Email update failed'
        })
      }
    }),

  /**
   * Refresh session
   */
  refreshSession: publicProcedure
    .input(authSchemas.refreshToken)
    .output(z.union([authSchemas.authSession, z.null()]))
    .mutation(async ({ ctx, input }) => {
      try {
        const session = await ctx.authService.refreshSession(input.refreshToken)
        return session
      } catch (error) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'Invalid refresh token'
        })
      }
    }),

  // ===== USER MANAGEMENT =====

  /**
   * Get current user session info
   */
  me: protectedProcedure
    .input(authSchemas.sessionInfo)
    .output(authSchemas.authUser)
    .query(async ({ ctx, input }) => {
      if (input.includeProfile) {
        // Include role-specific profile data
        const user = await ctx.prisma.user.findUnique({
          where: { id: ctx.user.id },
          include: {
            clientProfile: true,
            caregiverProfile: true,
            coordinatorProfile: true,
            familyProfile: true
          }
        })
        
        if (!user) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'User not found'
          })
        }
        
        return {
          ...ctx.user,
          // Add profile data to response
          profile: user.clientProfile || user.caregiverProfile || 
                  user.coordinatorProfile || user.familyProfile || null
        }
      }
      
      return ctx.user
    }),

  /**
   * Search users (admin only)
   */
  searchUsers: adminProcedure
    .input(authSchemas.userSearch)
    .query(async ({ ctx, input }) => {
      try {
        const { page, limit, query, role, isActive } = input
        const { skip, take } = createPaginationQuery(page, limit)
        
        const where = {
          ...(query && {
            OR: [
              { email: { contains: query, mode: 'insensitive' as const } },
              { 
                clientProfile: {
                  OR: [
                    { firstName: { contains: query, mode: 'insensitive' as const } },
                    { lastName: { contains: query, mode: 'insensitive' as const } }
                  ]
                }
              },
              {
                caregiverProfile: {
                  OR: [
                    { firstName: { contains: query, mode: 'insensitive' as const } },
                    { lastName: { contains: query, mode: 'insensitive' as const } }
                  ]
                }
              }
            ]
          }),
          ...(role && { role }),
          ...(isActive !== undefined && { isActive })
        }
        
        const [users, totalCount] = await Promise.all([
          ctx.prisma.user.findMany({
            where,
            skip,
            take,
            include: {
              clientProfile: true,
              caregiverProfile: true,
              coordinatorProfile: true,
              familyProfile: true
            },
            orderBy: { createdAt: 'desc' }
          }),
          ctx.prisma.user.count({ where })
        ])
        
        return createPaginatedResponse(users, totalCount, page, limit)
      } catch (error) {
        handleDatabaseError(error)
      }
    }),

  // ===== INVITE SYSTEM =====

  /**
   * Invite a user
   */
  inviteUser: adminProcedure
    .input(authSchemas.inviteUser)
    .output(authSchemas.userInvite)
    .mutation(async ({ ctx, input }) => {
      try {
        const invite = await ctx.authService.inviteUser(input, ctx.user.id)
        return invite
      } catch (error) {
        if (error instanceof AuthError) {
          throw new TRPCError({
            code: error.code === AuthErrorCode.USER_ALREADY_EXISTS ? 'CONFLICT' : 'BAD_REQUEST',
            message: error.message
          })
        }
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to create invite'
        })
      }
    }),

  /**
   * Accept an invite
   */
  acceptInvite: publicProcedure
    .input(authSchemas.acceptInvite)
    .output(authSchemas.registerResponse)
    .mutation(async ({ ctx, input }) => {
      try {
        const result = await ctx.authService.acceptInvite(input)
        return result
      } catch (error) {
        if (error instanceof AuthError) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: error.message
          })
        }
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to accept invite'
        })
      }
    }),

  /**
   * Get pending invites (admin only)
   */
  getPendingInvites: adminProcedure
    .input(z.object({
      page: z.number().default(1),
      limit: z.number().default(20)
    }))
    .query(async ({ ctx, input }) => {
      try {
        const { skip, take } = createPaginationQuery(input.page, input.limit)
        
        const [invites, totalCount] = await Promise.all([
          ctx.prisma.$queryRaw`
            SELECT * FROM user_invites 
            WHERE accepted_at IS NULL 
            AND expires_at > NOW()
            ORDER BY created_at DESC
            LIMIT ${take} OFFSET ${skip}
          ` as any[],
          ctx.prisma.$queryRaw`
            SELECT COUNT(*) as count FROM user_invites 
            WHERE accepted_at IS NULL 
            AND expires_at > NOW()
          ` as any[]
        ])
        
        const count = totalCount[0]?.count || 0
        return createPaginatedResponse(invites, Number(count), input.page, input.limit)
      } catch (error) {
        handleDatabaseError(error)
      }
    }),

  // ===== PERMISSIONS =====

  /**
   * Check if user has permission
   */
  checkPermission: protectedProcedure
    .input(authSchemas.checkPermission)
    .output(authSchemas.permissionCheckResponse)
    .query(async ({ ctx, input }) => {
      const { permissionsManager } = await import('@caring-compass/auth')
      
      const hasPermission = permissionsManager.hasPermission(ctx.user, input)
      
      return {
        hasPermission,
        reason: hasPermission ? undefined : 'User does not have required permission'
      }
    }),

  /**
   * Check multiple permissions
   */
  checkMultiplePermissions: protectedProcedure
    .input(authSchemas.checkMultiplePermissions)
    .query(async ({ ctx, input }) => {
      const { permissionsManager } = await import('@caring-compass/auth')
      
      const hasPermissions = input.requireAll
        ? permissionsManager.hasAllPermissions(ctx.user, input.permissions)
        : permissionsManager.hasAnyPermission(ctx.user, input.permissions)
      
      return {
        hasPermissions,
        permissions: input.permissions.map(permission => ({
          permission,
          granted: permissionsManager.hasPermission(ctx.user, permission)
        }))
      }
    }),

  /**
   * Check if user has role
   */
  hasRole: protectedProcedure
    .input(authSchemas.hasRole)
    .query(async ({ ctx, input }) => {
      const { permissionsManager } = await import('@caring-compass/auth')
      
      const hasRole = permissionsManager.hasRole(ctx.user, input.roles)
      
      return { hasRole }
    }),

  // ===== AUDIT LOGS =====

  /**
   * Get audit logs (admin only)
   */
  getAuditLogs: adminProcedure
    .input(authSchemas.auditLogSearch)
    .query(async ({ ctx, input }) => {
      try {
        const { page, limit, userId, action, resourceType, dateRange } = input
        const { skip, take } = createPaginationQuery(page, limit)
        
        const where = {
          ...(userId && { userId }),
          ...(action && { action }),
          ...(resourceType && { resourceType }),
          ...(dateRange && {
            timestamp: {
              gte: dateRange.from,
              lte: dateRange.to
            }
          })
        }
        
        const [logs, totalCount] = await Promise.all([
          ctx.prisma.auditLog.findMany({
            where,
            skip,
            take,
            include: {
              user: {
                select: {
                  email: true,
                  role: true,
                  clientProfile: { select: { firstName: true, lastName: true } },
                  caregiverProfile: { select: { firstName: true, lastName: true } },
                  coordinatorProfile: { select: { firstName: true, lastName: true } }
                }
              }
            },
            orderBy: { timestamp: 'desc' }
          }),
          ctx.prisma.auditLog.count({ where })
        ])
        
        return createPaginatedResponse(logs, totalCount, page, limit)
      } catch (error) {
        handleDatabaseError(error)
      }
    })
})