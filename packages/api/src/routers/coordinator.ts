import { z } from 'zod'
import { createTRPCRouter, protectedProcedure } from '../trpc/trpc'
import { TRPCError } from '@trpc/server'

/**
 * Coordinator Router - Operations for Care Coordinators
 * Provides access to caregivers and clients assigned to the coordinator
 */
export const coordinatorRouter = createTRPCRouter({
  /**
   * Get dashboard stats for the logged-in coordinator
   * Returns counts of assigned caregivers, clients, visits, and tasks
   */
  getDashboardStats: protectedProcedure
    .query(async ({ ctx }) => {
      // Ensure user is a coordinator
      if (ctx.user.role !== 'COORDINATOR') {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Only coordinators can access this endpoint'
        })
      }

      const coordinatorProfile = await ctx.db.coordinatorProfile.findUnique({
        where: { userId: ctx.user.id }
      })

      if (!coordinatorProfile) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Coordinator profile not found'
        })
      }

      const coordinatorId = coordinatorProfile.id

      const today = new Date()
      const todayStart = new Date(today.setHours(0, 0, 0, 0))
      const todayEnd = new Date(today.setHours(23, 59, 59, 999))

      // Get all stats in parallel
      const [
        caregiversCount,
        clientsCount,
        visitsTodayCount,
        scheduledVisitsCount
      ] = await Promise.all([
        // Count caregivers assigned to this coordinator
        ctx.db.caregiverCoordinators.count({
          where: { coordinatorId }
        }),

        // Count clients assigned to this coordinator
        ctx.db.clientCoordinators.count({
          where: { coordinatorId }
        }),

        // Count visits today for this coordinator's team
        ctx.db.visit.count({
          where: {
            scheduledStart: {
              gte: todayStart,
              lte: todayEnd
            },
            caregiver: {
              caregiverCoordinators: {
                some: { coordinatorId }
              }
            }
          }
        }),

        // Count scheduled visits (upcoming tasks)
        ctx.db.visit.count({
          where: {
            status: 'SCHEDULED',
            scheduledStart: { gte: new Date() },
            caregiver: {
              caregiverCoordinators: {
                some: { coordinatorId }
              }
            }
          }
        })
      ])

      return {
        caregivers: caregiversCount,
        clients: clientsCount,
        visitsToday: visitsTodayCount,
        tasks: scheduledVisitsCount
      }
    }),

  /**
   * Get today's visits for coordinator's team
   */
  getTodayVisits: protectedProcedure
    .query(async ({ ctx }) => {
      if (ctx.user.role !== 'COORDINATOR') {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Only coordinators can access this endpoint'
        })
      }

      const coordinatorProfile = await ctx.db.coordinatorProfile.findUnique({
        where: { userId: ctx.user.id }
      })

      if (!coordinatorProfile) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Coordinator profile not found'
        })
      }

      const today = new Date()
      const todayStart = new Date(today.setHours(0, 0, 0, 0))
      const todayEnd = new Date(today.setHours(23, 59, 59, 999))

      const visits = await ctx.db.visit.findMany({
        where: {
          scheduledStart: {
            gte: todayStart,
            lte: todayEnd
          },
          caregiver: {
            caregiverCoordinators: {
              some: { coordinatorId: coordinatorProfile.id }
            }
          }
        },
        include: {
          caregiver: {
            select: {
              firstName: true,
              lastName: true
            }
          },
          client: {
            select: {
              firstName: true,
              lastName: true
            }
          }
        },
        orderBy: {
          scheduledStart: 'asc'
        }
      })

      return visits.map((visit: any) => ({
        id: visit.id,
        caregiver: visit.caregiver 
          ? `${visit.caregiver.firstName} ${visit.caregiver.lastName}`
          : 'Unassigned',
        client: `${visit.client.firstName} ${visit.client.lastName}`,
        scheduledStart: visit.scheduledStart,
        scheduledEnd: visit.scheduledEnd,
        status: visit.status,
        time: `${visit.scheduledStart.toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit',
          hour12: false
        })}–${visit.scheduledEnd.toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit',
          hour12: false
        })}`
      }))
    }),

  /**
   * Get caregivers assigned to this coordinator
   */
  getMyCaregivers: protectedProcedure
    .input(z.object({
      status: z.enum(['ACTIVE', 'INACTIVE', 'ALL']).optional().default('ACTIVE')
    }))
    .query(async ({ ctx, input }) => {
      if (ctx.user.role !== 'COORDINATOR') {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Only coordinators can access this endpoint'
        })
      }

      const coordinatorProfile = await ctx.db.coordinatorProfile.findUnique({
        where: { userId: ctx.user.id }
      })

      if (!coordinatorProfile) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Coordinator profile not found'
        })
      }

      const whereCondition: any = {
        caregiverCoordinators: {
          some: { coordinatorId: coordinatorProfile.id }
        }
      }

      if (input.status !== 'ALL') {
        whereCondition.status = input.status
      }

      const caregivers = await ctx.db.caregiverProfile.findMany({
        where: whereCondition,
        include: {
          user: {
            select: {
              email: true,
              isActive: true
            }
          }
        },
        orderBy: {
          lastName: 'asc'
        }
      })

      return caregivers.map((caregiver: any) => ({
        id: caregiver.id,
        userId: caregiver.userId,
        firstName: caregiver.firstName,
        lastName: caregiver.lastName,
        email: caregiver.user.email,
        phone: caregiver.primaryPhone,
        status: caregiver.status,
        employmentType: caregiver.employmentType,
        isActive: caregiver.user.isActive
      }))
    }),

  /**
   * Get clients assigned to this coordinator
   */
  getMyClients: protectedProcedure
    .input(z.object({
      status: z.enum(['ACTIVE', 'INACTIVE', 'ALL']).optional().default('ACTIVE')
    }))
    .query(async ({ ctx, input }) => {
      if (ctx.user.role !== 'COORDINATOR') {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Only coordinators can access this endpoint'
        })
      }

      const coordinatorProfile = await ctx.db.coordinatorProfile.findUnique({
        where: { userId: ctx.user.id }
      })

      if (!coordinatorProfile) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Coordinator profile not found'
        })
      }

      const whereCondition: any = {
        clientCoordinators: {
          some: { coordinatorId: coordinatorProfile.id }
        }
      }

      if (input.status !== 'ALL') {
        whereCondition.status = input.status
      }

      const clients = await ctx.db.clientProfile.findMany({
        where: whereCondition,
        include: {
          user: {
            select: {
              email: true,
              isActive: true
            }
          }
        },
        orderBy: {
          lastName: 'asc'
        }
      })

      return clients.map((client: any) => ({
        id: client.id,
        userId: client.userId,
        firstName: client.firstName,
        lastName: client.lastName,
        email: client.user.email,
        phone: client.primaryPhone,
        status: client.status,
        isActive: client.user.isActive
      }))
    })
})
