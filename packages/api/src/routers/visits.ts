import { TRPCError } from '@trpc/server'
import { z } from 'zod'
import { UserRole } from '@caring-compass/database'
import { 
  createTRPCRouter, 
  protectedProcedure, 
  staffProcedure,
  caregiverProcedure,
  createCRUDProcedures,
  handleDatabaseError,
  createPaginationQuery,
  createPaginatedResponse,
  checkResourceAccess
} from '../trpc/trpc'
import { visitSchemas } from '../schemas'

export const visitsRouter = createTRPCRouter({
  // ===== VISIT MANAGEMENT =====

  /**
   * Create a new visit
   */
  create: staffProcedure
    .input(visitSchemas.visitCreate)
    .output(visitSchemas.visitWithDetails)
    .mutation(async ({ ctx, input }) => {
      try {
        const result = await ctx.prisma.$transaction(async (tx) => {
          // Check for conflicts if caregiver is assigned
          if (input.caregiverId) {
            const conflicts = await checkScheduleConflicts(tx, {
              caregiverId: input.caregiverId,
              scheduledStart: input.scheduledStart,
              scheduledEnd: input.scheduledEnd
            })

            if (conflicts.length > 0) {
              throw new TRPCError({
                code: 'CONFLICT',
                message: 'Caregiver has conflicting visits at this time'
              })
            }
          }

          // Create the visit
          const visit = await tx.visit.create({
            data: {
              clientId: input.clientId,
              caregiverId: input.caregiverId,
              scheduledStart: input.scheduledStart,
              scheduledEnd: input.scheduledEnd,
              visitType: input.visitType,
              specialInstructions: input.specialInstructions,
              status: 'SCHEDULED'
            }
          })

          // Create visit tasks if provided
          if (input.tasks && input.tasks.length > 0) {
            await tx.visitTask.createMany({
              data: input.tasks.map(task => ({
                visitId: visit.id,
                taskName: task.taskName,
                category: task.category,
                isCompleted: false
              }))
            })
          }

          // Handle recurring visits
          if (input.isRecurring && input.recurrencePattern) {
            await createRecurringVisits(tx, visit, input.recurrencePattern)
          }

          return visit
        })

        // Return visit with details
        return await getVisitWithDetails(ctx, result.id)
      } catch (error) {
        if (error instanceof TRPCError) throw error
        handleDatabaseError(error)
      }
    }),

  /**
   * Get visit by ID
   */
  getById: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .output(visitSchemas.visitWithDetails)
    .query(async ({ ctx, input }) => {
      try {
        const visit = await getVisitWithDetails(ctx, input.id)

        if (!visit) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Visit not found'
          })
        }

        // Check access permissions
        const hasAccess = 
          checkResourceAccess(ctx.user, visit.client.id, [UserRole.ADMIN, UserRole.COORDINATOR]) ||
          (ctx.user.role === UserRole.CLIENT && visit.client.id === getClientIdForUser(ctx.user.id)) ||
          (ctx.user.role === UserRole.CAREGIVER && visit.caregiver?.id === getCaregiverIdForUser(ctx.user.id)) ||
          (ctx.user.role === UserRole.FAMILY && await isFamilyMemberOfClient(ctx, ctx.user.id, visit.client.id))

        if (!hasAccess) {
          throw new TRPCError({
            code: 'FORBIDDEN',
            message: 'Access denied'
          })
        }

        return visit
      } catch (error) {
        if (error instanceof TRPCError) throw error
        handleDatabaseError(error)
      }
    }),

  /**
   * Update visit
   */
  update: protectedProcedure
    .input(z.object({
      id: z.string().uuid(),
      data: visitSchemas.visitUpdate
    }))
    .output(visitSchemas.visit)
    .mutation(async ({ ctx, input }) => {
      try {
        const existingVisit = await ctx.prisma.visit.findUnique({
          where: { id: input.id },
          include: { client: true, caregiver: true }
        })

        if (!existingVisit) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Visit not found'
          })
        }

        // Check permissions - staff can update any visit, caregivers can update their own
        const hasAccess = 
          [UserRole.ADMIN, UserRole.COORDINATOR].includes(ctx.user.role) ||
          (ctx.user.role === UserRole.CAREGIVER && existingVisit.caregiver?.userId === ctx.user.id)

        if (!hasAccess) {
          throw new TRPCError({
            code: 'FORBIDDEN',
            message: 'Access denied'
          })
        }

        // Check for conflicts if updating schedule or caregiver
        if (input.data.scheduledStart || input.data.scheduledEnd || input.data.caregiverId) {
          const conflicts = await checkScheduleConflicts(ctx.prisma, {
            caregiverId: input.data.caregiverId || existingVisit.caregiverId,
            scheduledStart: input.data.scheduledStart || existingVisit.scheduledStart,
            scheduledEnd: input.data.scheduledEnd || existingVisit.scheduledEnd,
            excludeVisitId: input.id
          })

          if (conflicts.length > 0) {
            throw new TRPCError({
              code: 'CONFLICT',
              message: 'Schedule conflict detected'
            })
          }
        }

        const updatedVisit = await ctx.prisma.visit.update({
          where: { id: input.id },
          data: input.data
        })

        return updatedVisit
      } catch (error) {
        if (error instanceof TRPCError) throw error
        handleDatabaseError(error)
      }
    }),

  /**
   * Search visits
   */
  search: protectedProcedure
    .input(visitSchemas.visitSearch)
    .query(async ({ ctx, input }) => {
      try {
        const { page, limit, clientId, caregiverId, status, visitType, dateRange } = input
        const { skip, take } = createPaginationQuery(page, limit)

        let where: any = {}

        // Role-based filtering
        if (ctx.user.role === UserRole.CLIENT) {
          const userClientId = await getClientIdForUser(ctx.user.id)
          where.clientId = userClientId
        } else if (ctx.user.role === UserRole.CAREGIVER) {
          const userCaregiverId = await getCaregiverIdForUser(ctx.user.id)
          where.caregiverId = userCaregiverId
        } else if (ctx.user.role === UserRole.FAMILY) {
          const familyClientId = await getFamilyMemberClientId(ctx, ctx.user.id)
          if (familyClientId) {
            where.clientId = familyClientId
          } else {
            where.clientId = 'non-existent' // No access
          }
        }

        // Apply filters
        if (clientId) where.clientId = clientId
        if (caregiverId) where.caregiverId = caregiverId
        if (status) where.status = status
        if (visitType) where.visitType = visitType
        if (dateRange) {
          where.scheduledStart = {
            gte: dateRange.from,
            lte: dateRange.to
          }
        }

        const [visits, totalCount] = await Promise.all([
          ctx.prisma.visit.findMany({
            where,
            skip,
            take,
            include: {
              client: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                  address: true
                }
              },
              caregiver: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                  primaryPhone: true
                }
              },
              tasks: {
                select: {
                  id: true,
                  taskName: true,
                  category: true,
                  isCompleted: true
                }
              },
              evvEvents: {
                select: {
                  id: true,
                  eventType: true,
                  timestamp: true
                }
              }
            },
            orderBy: { scheduledStart: 'desc' }
          }),
          ctx.prisma.visit.count({ where })
        ])

        return createPaginatedResponse(visits, totalCount, page, limit)
      } catch (error) {
        handleDatabaseError(error)
      }
    }),

  /**
   * Cancel visit
   */
  cancel: protectedProcedure
    .input(visitSchemas.visitCancellation)
    .mutation(async ({ ctx, input }) => {
      try {
        const visit = await ctx.prisma.visit.findUnique({
          where: { id: input.visitId },
          include: { client: true, caregiver: true }
        })

        if (!visit) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Visit not found'
          })
        }

        // Check permissions
        const hasAccess = 
          [UserRole.ADMIN, UserRole.COORDINATOR].includes(ctx.user.role) ||
          (ctx.user.role === UserRole.CLIENT && visit.client.userId === ctx.user.id) ||
          (ctx.user.role === UserRole.CAREGIVER && visit.caregiver?.userId === ctx.user.id)

        if (!hasAccess) {
          throw new TRPCError({
            code: 'FORBIDDEN',
            message: 'Access denied'
          })
        }

        // Update visit status
        const cancelledVisit = await ctx.prisma.visit.update({
          where: { id: input.visitId },
          data: {
            status: 'CANCELLED',
            notes: input.cancellationNotes
          }
        })

        // Handle rescheduling if requested
        if (input.reschedule) {
          await ctx.prisma.visit.create({
            data: {
              clientId: visit.clientId,
              caregiverId: input.reschedule.alternativeCaregiver || visit.caregiverId,
              scheduledStart: new Date(`${input.reschedule.proposedDate.toISOString().split('T')[0]}T${input.reschedule.proposedStartTime}:00.000Z`),
              scheduledEnd: new Date(`${input.reschedule.proposedDate.toISOString().split('T')[0]}T${input.reschedule.proposedEndTime}:00.000Z`),
              visitType: visit.visitType,
              status: 'SCHEDULED'
            }
          })
        }

        // Send notifications (implement notification service)
        if (input.notifyClient || input.notifyCaregiver) {
          // Notification logic here
        }

        return { success: true, visit: cancelledVisit }
      } catch (error) {
        if (error instanceof TRPCError) throw error
        handleDatabaseError(error)
      }
    }),

  // ===== EVV (ELECTRONIC VISIT VERIFICATION) =====

  /**
   * Clock in for visit
   */
  clockIn: caregiverProcedure
    .input(visitSchemas.evvClockIn)
    .mutation(async ({ ctx, input }) => {
      try {
        const visit = await ctx.prisma.visit.findUnique({
          where: { id: input.visitId },
          include: { caregiver: true, client: true }
        })

        if (!visit) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Visit not found'
          })
        }

        // Verify caregiver is assigned to this visit
        if (!visit.caregiver || visit.caregiver.userId !== ctx.user.id) {
          throw new TRPCError({
            code: 'FORBIDDEN',
            message: 'You are not assigned to this visit'
          })
        }

        // Check if already clocked in
        const existingClockIn = await ctx.prisma.EvVEvent.findFirst({
          where: {
            visitId: input.visitId,
            eventType: 'CLOCK_IN'
          }
        })

        if (existingClockIn) {
          throw new TRPCError({
            code: 'CONFLICT',
            message: 'Already clocked in for this visit'
          })
        }

        // Verify location (basic geofencing)
        const isValidLocation = await verifyVisitLocation(
          input.latitude,
          input.longitude,
          visit.client.address
        )

        if (!isValidLocation) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Location verification failed - you must be at the client location'
          })
        }

        // Create EVV event
        const evvEvent = await ctx.prisma.EvVEvent.create({
          data: {
            visitId: input.visitId,
            eventType: 'CLOCK_IN',
            timestamp: input.timestamp,
            latitude: input.latitude,
            longitude: input.longitude,
            deviceId: input.deviceId
          }
        })

        // Update visit status
        await ctx.prisma.visit.update({
          where: { id: input.visitId },
          data: {
            status: 'IN_PROGRESS',
            actualStart: input.timestamp
          }
        })

        return { success: true, evvEvent }
      } catch (error) {
        if (error instanceof TRPCError) throw error
        handleDatabaseError(error)
      }
    }),

  /**
   * Clock out from visit
   */
  clockOut: caregiverProcedure
    .input(visitSchemas.evvClockOut)
    .mutation(async ({ ctx, input }) => {
      try {
        const visit = await ctx.prisma.visit.findUnique({
          where: { id: input.visitId },
          include: { caregiver: true, client: true }
        })

        if (!visit) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Visit not found'
          })
        }

        // Verify caregiver is assigned to this visit
        if (!visit.caregiver || visit.caregiver.userId !== ctx.user.id) {
          throw new TRPCError({
            code: 'FORBIDDEN',
            message: 'You are not assigned to this visit'
          })
        }

        // Check if clocked in
        const clockInEvent = await ctx.prisma.EvVEvent.findFirst({
          where: {
            visitId: input.visitId,
            eventType: 'CLOCK_IN'
          }
        })

        if (!clockInEvent) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Cannot clock out without clocking in first'
          })
        }

        // Check if already clocked out
        const existingClockOut = await ctx.prisma.EvVEvent.findFirst({
          where: {
            visitId: input.visitId,
            eventType: 'CLOCK_OUT'
          }
        })

        if (existingClockOut) {
          throw new TRPCError({
            code: 'CONFLICT',
            message: 'Already clocked out for this visit'
          })
        }

        // Verify location
        const isValidLocation = await verifyVisitLocation(
          input.latitude,
          input.longitude,
          visit.client.address
        )

        if (!isValidLocation) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Location verification failed'
          })
        }

        // Calculate billable hours
        const billableHours = calculateBillableHours(clockInEvent.timestamp, input.timestamp)

        // Create EVV event
        const evvEvent = await ctx.prisma.EvVEvent.create({
          data: {
            visitId: input.visitId,
            eventType: 'CLOCK_OUT',
            timestamp: input.timestamp,
            latitude: input.latitude,
            longitude: input.longitude,
            deviceId: input.deviceId
          }
        })

        // Update visit status
        await ctx.prisma.visit.update({
          where: { id: input.visitId },
          data: {
            status: 'COMPLETED',
            actualEnd: input.timestamp,
            billableHours,
            caregiverNotes: input.completionNotes,
            clientSignature: input.clientSignature
          }
        })

        return { success: true, evvEvent, billableHours }
      } catch (error) {
        if (error instanceof TRPCError) throw error
        handleDatabaseError(error)
      }
    }),

  // ===== VISIT TASKS =====

  /**
   * Update visit tasks
   */
  updateTasks: protectedProcedure
    .input(visitSchemas.visitTaskBulkUpdate)
    .mutation(async ({ ctx, input }) => {
      try {
        const visit = await ctx.prisma.visit.findUnique({
          where: { id: input.visitId },
          include: { caregiver: true }
        })

        if (!visit) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Visit not found'
          })
        }

        // Check permissions
        const hasAccess = 
          [UserRole.ADMIN, UserRole.COORDINATOR].includes(ctx.user.role) ||
          (ctx.user.role === UserRole.CAREGIVER && visit.caregiver?.userId === ctx.user.id)

        if (!hasAccess) {
          throw new TRPCError({
            code: 'FORBIDDEN',
            message: 'Access denied'
          })
        }

        // Update tasks
        const updatePromises = input.tasks.map(task =>
          ctx.prisma.visitTask.update({
            where: { id: task.taskId },
            data: {
              isCompleted: task.isCompleted,
              notes: task.notes,
              completedAt: task.completedAt
            }
          })
        )

        await Promise.all(updatePromises)

        return { success: true }
      } catch (error) {
        if (error instanceof TRPCError) throw error
        handleDatabaseError(error)
      }
    }),

  // ===== BULK SCHEDULING =====

  /**
   * Create bulk schedule
   */
  createBulkSchedule: staffProcedure
    .input(visitSchemas.bulkScheduleCreate)
    .mutation(async ({ ctx, input }) => {
      try {
        const visits = await ctx.prisma.$transaction(async (tx) => {
          const createdVisits = []
          const { dateRange, pattern, excludeDates, tasks } = input

          // Generate dates based on pattern
          const dates = generateDatesBetween(
            dateRange.startDate,
            dateRange.endDate,
            pattern.daysOfWeek,
            excludeDates
          )

          for (const date of dates) {
            const scheduledStart = new Date(`${date.toISOString().split('T')[0]}T${pattern.startTime}:00.000Z`)
            const scheduledEnd = new Date(`${date.toISOString().split('T')[0]}T${pattern.endTime}:00.000Z`)

            // Check for conflicts if caregiver is specified
            if (input.caregiverId) {
              const conflicts = await checkScheduleConflicts(tx, {
                caregiverId: input.caregiverId,
                scheduledStart,
                scheduledEnd
              })

              if (conflicts.length > 0) {
                continue // Skip conflicting dates
              }
            }

            // Create visit
            const visit = await tx.visit.create({
              data: {
                clientId: input.clientId,
                caregiverId: input.caregiverId,
                scheduledStart,
                scheduledEnd,
                visitType: pattern.visitType,
                status: 'SCHEDULED'
              }
            })

            // Create tasks if provided
            if (tasks && tasks.length > 0) {
              await tx.visitTask.createMany({
                data: tasks.map(task => ({
                  visitId: visit.id,
                  taskName: task.taskName,
                  category: task.category
                }))
              })
            }

            createdVisits.push(visit)
          }

          return createdVisits
        })

        return { 
          success: true, 
          createdCount: visits.length,
          visits: visits.slice(0, 10) // Return first 10 for confirmation
        }
      } catch (error) {
        handleDatabaseError(error)
      }
    }),

  // ===== CONFLICT DETECTION =====

  /**
   * Check schedule conflicts
   */
  checkConflicts: staffProcedure
    .input(visitSchemas.scheduleConflictCheck)
    .output(z.array(visitSchemas.scheduleConflict))
    .query(async ({ ctx, input }) => {
      try {
        const conflicts = await checkScheduleConflicts(ctx.prisma, input)
        return conflicts.map(conflict => ({
          conflictType: conflict.type,
          message: conflict.message,
          conflictingVisits: conflict.visits,
          suggestions: conflict.suggestions
        }))
      } catch (error) {
        handleDatabaseError(error)
      }
    }),

  // ===== VISIT STATISTICS =====

  /**
   * Get visit statistics
   */
  getStats: protectedProcedure
    .input(z.object({
      dateRange: z.object({
        from: z.date(),
        to: z.date()
      }).optional(),
      clientId: z.string().uuid().optional(),
      caregiverId: z.string().uuid().optional()
    }))
    .output(visitSchemas.scheduleStats)
    .query(async ({ ctx, input }) => {
      try {
        const { dateRange, clientId, caregiverId } = input
        
        const where: any = {}
        if (dateRange) {
          where.scheduledStart = {
            gte: dateRange.from,
            lte: dateRange.to
          }
        }
        if (clientId) where.clientId = clientId
        if (caregiverId) where.caregiverId = caregiverId

        // Role-based filtering
        if (ctx.user.role === UserRole.CLIENT) {
          where.clientId = await getClientIdForUser(ctx.user.id)
        } else if (ctx.user.role === UserRole.CAREGIVER) {
          where.caregiverId = await getCaregiverIdForUser(ctx.user.id)
        }

        const [
          totalVisits,
          completedVisits,
          cancelledVisits,
          noShowVisits,
          billableHours
        ] = await Promise.all([
          ctx.prisma.visit.count({ where }),
          ctx.prisma.visit.count({ where: { ...where, status: 'COMPLETED' } }),
          ctx.prisma.visit.count({ where: { ...where, status: 'CANCELLED' } }),
          ctx.prisma.visit.count({ where: { ...where, status: { in: ['NO_SHOW_CLIENT', 'NO_SHOW_CAREGIVER'] } } }),
          ctx.prisma.visit.aggregate({
            where: { ...where, status: 'COMPLETED' },
            _sum: { billableHours: true }
          })
        ])

        const totalHours = billableHours._sum.billableHours || 0
        const averageVisitDuration = completedVisits > 0 ? totalHours / completedVisits : 0

        // Calculate punctuality and completion rates
        const punctualityRate = completedVisits > 0 ? (completedVisits / totalVisits) * 100 : 0
        const completionRate = totalVisits > 0 ? (completedVisits / totalVisits) * 100 : 0

        return {
          totalVisits,
          completedVisits,
          cancelledVisits,
          noShowVisits,
          totalHours,
          billableHours: totalHours,
          averageVisitDuration,
          punctualityRate,
          completionRate
        }
      } catch (error) {
        handleDatabaseError(error)
      }
    })
})

// Helper functions
async function getVisitWithDetails(ctx: any, visitId: string) {
  return await ctx.prisma.visit.findUnique({
    where: { id: visitId },
    include: {
      client: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          address: true
        }
      },
      caregiver: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          primaryPhone: true
        }
      },
      tasks: true,
      evvEvents: {
        orderBy: { timestamp: 'asc' }
      }
    }
  })
}

async function checkScheduleConflicts(prisma: any, params: {
  caregiverId?: string,
  scheduledStart: Date,
  scheduledEnd: Date,
  excludeVisitId?: string
}) {
  if (!params.caregiverId) return []

  const conflicts = await prisma.visit.findMany({
    where: {
      caregiverId: params.caregiverId,
      id: params.excludeVisitId ? { not: params.excludeVisitId } : undefined,
      status: { in: ['SCHEDULED', 'IN_PROGRESS'] },
      OR: [
        {
          scheduledStart: { lte: params.scheduledStart },
          scheduledEnd: { gt: params.scheduledStart }
        },
        {
          scheduledStart: { lt: params.scheduledEnd },
          scheduledEnd: { gte: params.scheduledEnd }
        },
        {
          scheduledStart: { gte: params.scheduledStart },
          scheduledEnd: { lte: params.scheduledEnd }
        }
      ]
    },
    include: {
      client: { select: { firstName: true, lastName: true } }
    }
  })

  return conflicts.map(conflict => ({
    type: 'CAREGIVER_DOUBLE_BOOKED' as const,
    message: `Conflict with existing visit for ${conflict.client.firstName} ${conflict.client.lastName}`,
    visits: [conflict],
    suggestions: [
      {
        type: 'RESCHEDULE' as const,
        description: 'Reschedule one of the conflicting visits',
        proposedChange: {}
      }
    ]
  }))
}

async function createRecurringVisits(tx: any, baseVisit: any, pattern: any) {
  // Implementation for creating recurring visits
  // This would generate multiple visits based on the recurrence pattern
  // Simplified implementation - in practice would be more complex
}

async function verifyVisitLocation(lat: number, lng: number, clientAddress: any): Promise<boolean> {
  // Simplified location verification
  // In practice, you would use proper geolocation services
  // and define acceptable radius around client location
  return true // Placeholder - always passes for demo
}

function calculateBillableHours(startTime: Date, endTime: Date): number {
  const diffMs = endTime.getTime() - startTime.getTime()
  const diffHours = diffMs / (1000 * 60 * 60)
  return Math.round(diffHours * 100) / 100 // Round to 2 decimal places
}

function generateDatesBetween(
  startDate: Date,
  endDate: Date,
  daysOfWeek: string[],
  excludeDates?: Date[]
): Date[] {
  const dates = []
  const current = new Date(startDate)
  
  while (current <= endDate) {
    const dayName = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'][current.getDay()]
    
    if (daysOfWeek.includes(dayName)) {
      const isExcluded = excludeDates?.some(excluded => 
        excluded.toDateString() === current.toDateString()
      )
      
      if (!isExcluded) {
        dates.push(new Date(current))
      }
    }
    
    current.setDate(current.getDate() + 1)
  }
  
  return dates
}

// Helper functions to get user's associated IDs
async function getClientIdForUser(userId: string): Promise<string | null> {
  // Implementation to get client ID for user
  return null // Placeholder
}

async function getCaregiverIdForUser(userId: string): Promise<string | null> {
  // Implementation to get caregiver ID for user
  return null // Placeholder
}

async function getFamilyMemberClientId(ctx: any, userId: string): Promise<string | null> {
  // Implementation to get client ID for family member
  return null // Placeholder
}

async function isFamilyMemberOfClient(ctx: any, userId: string, clientId: string): Promise<boolean> {
  // Implementation to check if user is family member of client
  return false // Placeholder
}