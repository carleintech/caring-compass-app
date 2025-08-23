import { TRPCError } from '@trpc/server'
import { z } from 'zod'
import { UserRole } from '@caring-compass/database'
import { PERMISSIONS } from '@caring-compass/auth'
import { 
  createTRPCRouter, 
  protectedProcedure, 
  staffProcedure,
  clientProcedure,
  createPermissionProcedure,
  createCRUDProcedures,
  handleDatabaseError,
  createPaginationQuery,
  createPaginatedResponse,
  checkResourceAccess
} from '../trpc/trpc'
import { clientSchemas } from '../schemas'

// Create CRUD procedures for clients
const clientCRUD = createCRUDProcedures('ClientProfile')

export const clientsRouter = createTRPCRouter({
  // ===== CLIENT PROFILE MANAGEMENT =====

  /**
   * Create a new client
   */
  create: staffProcedure
    .input(clientSchemas.clientCreate)
    .output(clientSchemas.clientProfile)
    .mutation(async ({ ctx, input }) => {
      try {
        const result = await ctx.prisma.$transaction(async (tx) => {
          // Create user account first
          const user = await tx.user.create({
            data: {
              email: input.email,
              role: UserRole.CLIENT,
              isActive: true
            }
          })

          // Create client profile
          const clientProfile = await tx.clientProfile.create({
            data: {
              userId: user.id,
              firstName: input.firstName,
              lastName: input.lastName,
              dateOfBirth: input.dateOfBirth,
              gender: input.gender,
              preferredName: input.preferredName,
              primaryPhone: input.primaryPhone,
              secondaryPhone: input.secondaryPhone,
              emergencyContact: input.emergencyContact,
              address: input.address,
              status: input.status,
              enrollmentDate: input.enrollmentDate,
              preferences: input.preferences,
              medicalInfo: input.medicalInfo
            }
          })

          return clientProfile
        })

        // Register user with Supabase Auth (handled separately)
        await ctx.authService.signUp({
          email: input.email,
          password: input.password,
          firstName: input.firstName,
          lastName: input.lastName,
          role: UserRole.CLIENT
        })

        return result
      } catch (error) {
        handleDatabaseError(error)
      }
    }),

  /**
   * Get client by ID
   */
  getById: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .output(clientSchemas.clientWithRelations)
    .query(async ({ ctx, input }) => {
      try {
        const client = await ctx.prisma.clientProfile.findUnique({
          where: { id: input.id },
          include: {
            user: { select: { email: true, role: true, isActive: true } },
            planOfCare: {
              include: {
                goals: true,
                tasks: true
              }
            },
            familyMembers: {
              include: {
                user: { select: { email: true } }
              }
            },
            visits: {
              where: { status: 'COMPLETED' },
              select: { id: true, scheduledStart: true }
            }
          }
        })

        if (!client) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Client not found'
          })
        }

        // Check access permissions
        const hasAccess = checkResourceAccess(
          ctx.user,
          client.userId,
          [UserRole.ADMIN, UserRole.COORDINATOR]
        ) || (
          ctx.user.role === UserRole.FAMILY && 
          client.familyMembers.some(fm => fm.userId === ctx.user.id)
        )

        if (!hasAccess) {
          throw new TRPCError({
            code: 'FORBIDDEN',
            message: 'Access denied'
          })
        }

        // Calculate visit statistics
        const totalVisits = client.visits.length
        const activeVisits = await ctx.prisma.visit.count({
          where: {
            clientId: input.id,
            status: { in: ['SCHEDULED', 'IN_PROGRESS'] }
          }
        })

        const lastVisitDate = client.visits[0]?.scheduledStart || null

        return {
          ...client,
          email: client.user.email,
          activeVisits,
          totalVisits,
          lastVisitDate
        }
      } catch (error) {
        if (error instanceof TRPCError) throw error
        handleDatabaseError(error)
      }
    }),

  /**
   * Update client profile
   */
  update: protectedProcedure
    .input(z.object({
      id: z.string().uuid(),
      data: clientSchemas.clientUpdate
    }))
    .output(clientSchemas.clientProfile)
    .mutation(async ({ ctx, input }) => {
      try {
        // Check if client exists and user has access
        const existingClient = await ctx.prisma.clientProfile.findUnique({
          where: { id: input.id }
        })

        if (!existingClient) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Client not found'
          })
        }

        const hasAccess = checkResourceAccess(
          ctx.user,
          existingClient.userId,
          [UserRole.ADMIN, UserRole.COORDINATOR]
        )

        if (!hasAccess) {
          throw new TRPCError({
            code: 'FORBIDDEN',
            message: 'Access denied'
          })
        }

        const updatedClient = await ctx.prisma.clientProfile.update({
          where: { id: input.id },
          data: input.data,
          include: {
            user: { select: { email: true } }
          }
        })

        return {
          ...updatedClient,
          email: updatedClient.user.email
        }
      } catch (error) {
        if (error instanceof TRPCError) throw error
        handleDatabaseError(error)
      }
    }),

  /**
   * Search clients
   */
  search: protectedProcedure
    .input(clientSchemas.clientSearch)
    .query(async ({ ctx, input }) => {
      try {
        const { page, limit, query, status, enrollmentDateRange, coordinatorId, hasActivePlan, city, state } = input
        const { skip, take } = createPaginationQuery(page, limit)

        // Build where clause based on user role
        let where: any = {}

        // Role-based filtering
        if (ctx.user.role === UserRole.CLIENT) {
          where.userId = ctx.user.id
        } else if (ctx.user.role === UserRole.FAMILY) {
          // Family members can only see their associated client
          const familyProfile = await ctx.prisma.familyProfile.findUnique({
            where: { userId: ctx.user.id }
          })
          if (familyProfile) {
            where.id = familyProfile.clientId
          } else {
            where.id = 'non-existent' // No access
          }
        }

        // Apply search filters
        if (query) {
          where.OR = [
            { firstName: { contains: query, mode: 'insensitive' as const } },
            { lastName: { contains: query, mode: 'insensitive' as const } },
            { primaryPhone: { contains: query } },
            { user: { email: { contains: query, mode: 'insensitive' as const } } }
          ]
        }

        if (status) where.status = status
        if (coordinatorId) {
          // Filter by coordinator assignment (would need coordinator relationship)
        }
        if (hasActivePlan !== undefined) {
          if (hasActivePlan) {
            where.planOfCare = { status: 'ACTIVE' }
          } else {
            where.planOfCare = null
          }
        }
        if (city) where.address = { path: ['city'], equals: city }
        if (state) where.address = { path: ['state'], equals: state }
        if (enrollmentDateRange) {
          where.enrollmentDate = {
            gte: enrollmentDateRange.from,
            lte: enrollmentDateRange.to
          }
        }

        const [clients, totalCount] = await Promise.all([
          ctx.prisma.clientProfile.findMany({
            where,
            skip,
            take,
            include: {
              user: { select: { email: true, isActive: true } },
              planOfCare: { select: { id: true, status: true, totalWeeklyHours: true } },
              _count: {
                select: {
                  visits: { where: { status: 'COMPLETED' } }
                }
              }
            },
            orderBy: { createdAt: 'desc' }
          }),
          ctx.prisma.clientProfile.count({ where })
        ])

        const clientsWithCounts = clients.map(client => ({
          ...client,
          email: client.user.email,
          totalVisits: client._count.visits
        }))

        return createPaginatedResponse(clientsWithCounts, totalCount, page, limit)
      } catch (error) {
        handleDatabaseError(error)
      }
    }),

  /**
   * Delete client (soft delete)
   */
  delete: staffProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      try {
        // Check if client exists
        const client = await ctx.prisma.clientProfile.findUnique({
          where: { id: input.id },
          include: { user: true }
        })

        if (!client) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Client not found'
          })
        }

        // Soft delete by deactivating user account
        await ctx.prisma.user.update({
          where: { id: client.userId },
          data: { isActive: false }
        })

        return { success: true }
      } catch (error) {
        if (error instanceof TRPCError) throw error
        handleDatabaseError(error)
      }
    }),

  // ===== PLAN OF CARE MANAGEMENT =====

  /**
   * Create plan of care
   */
  createPlanOfCare: staffProcedure
    .input(clientSchemas.planOfCareCreate)
    .output(clientSchemas.planOfCare)
    .mutation(async ({ ctx, input }) => {
      try {
        const planOfCare = await ctx.prisma.planOfCare.create({
          data: {
            clientId: input.clientId,
            effectiveDate: input.effectiveDate,
            expirationDate: input.expirationDate,
            totalWeeklyHours: input.totalWeeklyHours,
            status: 'DRAFT',
            goals: {
              create: input.goals
            },
            tasks: {
              create: input.tasks
            }
          },
          include: {
            goals: true,
            tasks: true
          }
        })

        return planOfCare
      } catch (error) {
        handleDatabaseError(error)
      }
    }),

  /**
   * Update plan of care
   */
  updatePlanOfCare: staffProcedure
    .input(z.object({
      id: z.string().uuid(),
      data: clientSchemas.planOfCareUpdate
    }))
    .mutation(async ({ ctx, input }) => {
      try {
        const updatedPlan = await ctx.prisma.planOfCare.update({
          where: { id: input.id },
          data: input.data,
          include: {
            goals: true,
            tasks: true
          }
        })

        return updatedPlan
      } catch (error) {
        handleDatabaseError(error)
      }
    }),

  /**
   * Approve plan of care
   */
  approvePlanOfCare: staffProcedure
    .input(z.object({ 
      id: z.string().uuid(),
      notes: z.string().optional()
    }))
    .mutation(async ({ ctx, input }) => {
      try {
        const approvedPlan = await ctx.prisma.planOfCare.update({
          where: { id: input.id },
          data: {
            status: 'ACTIVE',
            approvedAt: new Date(),
            approvedBy: ctx.user.id
          }
        })

        return approvedPlan
      } catch (error) {
        handleDatabaseError(error)
      }
    }),

  // ===== FAMILY MEMBER MANAGEMENT =====

  /**
   * Add family member
   */
  addFamilyMember: staffProcedure
    .input(clientSchemas.familyMemberCreate)
    .output(clientSchemas.familyMember)
    .mutation(async ({ ctx, input }) => {
      try {
        const result = await ctx.prisma.$transaction(async (tx) => {
          // Create user account for family member
          const user = await tx.user.create({
            data: {
              email: input.email,
              role: UserRole.FAMILY,
              isActive: true
            }
          })

          // Create family profile
          const familyMember = await tx.familyProfile.create({
            data: {
              userId: user.id,
              clientId: input.clientId,
              firstName: input.firstName,
              lastName: input.lastName,
              relationship: input.relationship,
              primaryPhone: input.primaryPhone,
              secondaryPhone: input.secondaryPhone,
              email: input.email,
              canViewSchedule: input.canViewSchedule,
              canViewBilling: input.canViewBilling,
              canReceiveUpdates: input.canReceiveUpdates,
              preferredContact: input.preferredContact
            },
            include: {
              user: { select: { email: true } }
            }
          })

          return familyMember
        })

        // Send invite email if requested
        if (input.sendInviteEmail) {
          await ctx.authService.inviteUser({
            email: input.email,
            role: UserRole.FAMILY,
            sendEmail: true
          }, ctx.user.id)
        }

        return result
      } catch (error) {
        handleDatabaseError(error)
      }
    }),

  /**
   * Update family member
   */
  updateFamilyMember: staffProcedure
    .input(z.object({
      id: z.string().uuid(),
      data: clientSchemas.familyMemberUpdate
    }))
    .mutation(async ({ ctx, input }) => {
      try {
        const updatedFamilyMember = await ctx.prisma.familyProfile.update({
          where: { id: input.id },
          data: input.data,
          include: {
            user: { select: { email: true } }
          }
        })

        return updatedFamilyMember
      } catch (error) {
        handleDatabaseError(error)
      }
    }),

  /**
   * Remove family member
   */
  removeFamilyMember: staffProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      try {
        const familyMember = await ctx.prisma.familyProfile.findUnique({
          where: { id: input.id }
        })

        if (!familyMember) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Family member not found'
          })
        }

        // Soft delete by deactivating user account
        await ctx.prisma.user.update({
          where: { id: familyMember.userId },
          data: { isActive: false }
        })

        return { success: true }
      } catch (error) {
        if (error instanceof TRPCError) throw error
        handleDatabaseError(error)
      }
    }),

  // ===== CLIENT STATISTICS =====

  /**
   * Get client statistics
   */
  getStats: staffProcedure
    .query(async ({ ctx }) => {
      try {
        const [
          totalClients,
          activeClients,
          newClientsThisMonth,
          clientsWithActivePlans
        ] = await Promise.all([
          ctx.prisma.clientProfile.count(),
          ctx.prisma.clientProfile.count({
            where: { status: 'ACTIVE' }
          }),
          ctx.prisma.clientProfile.count({
            where: {
              enrollmentDate: {
                gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
              }
            }
          }),
          ctx.prisma.clientProfile.count({
            where: {
              planOfCare: { status: 'ACTIVE' }
            }
          })
        ])

        // Get client status distribution
        const statusDistribution = await ctx.prisma.clientProfile.groupBy({
          by: ['status'],
          _count: true
        })

        return {
          totalClients,
          activeClients,
          newClientsThisMonth,
          clientsWithActivePlans,
          statusDistribution: statusDistribution.reduce((acc, item) => {
            acc[item.status] = item._count
            return acc
          }, {} as Record<string, number>)
        }
      } catch (error) {
        handleDatabaseError(error)
      }
    })
})