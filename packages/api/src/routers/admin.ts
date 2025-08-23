import { z } from 'zod'
import { createTRPCRouter, adminProcedure, staffProcedure } from '../trpc/trpc'
import { RouterTypes } from '../trpc/types'
import { getPrismaClient } from '@caring-compass/database/src/utils'
import { TRPCError } from '@trpc/server'
import { schemas } from '../schemas'

const prisma = getPrismaClient()

/**
 * Admin Router - Administrative functions and system management
 * Requires ADMIN or COORDINATOR roles for most operations
 */
export const adminRouter = createTRPCRouter({
  // Dashboard and Analytics
  getDashboardStats: staffProcedure
    .query(async ({ ctx }) => {
      const [
        totalClients,
        activeClients,
        totalCaregivers,
        activeCaregivers,
        todayVisits,
        pendingInvoices,
        recentActivities
      ] = await Promise.all([
        // Total clients
        prisma.clientProfile.count(),
        
        // Active clients (with visits in last 30 days)
        prisma.clientProfile.count({
          where: {
            status: 'ACTIVE',
            visits: {
              some: {
                scheduledStart: {
                  gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
                }
              }
            }
          }
        }),
        
        // Total caregivers
        prisma.caregiverProfile.count(),
        
        // Active caregivers
        prisma.caregiverProfile.count({
          where: { status: 'ACTIVE' }
        }),
        
        // Today's visits
        prisma.visit.count({
          where: {
            scheduledStart: {
              gte: new Date(new Date().setHours(0, 0, 0, 0)),
              lt: new Date(new Date().setHours(23, 59, 59, 999))
            }
          }
        }),
        
        // Pending invoices
        prisma.invoice.count({
          where: { status: 'PENDING' }
        }),
        
        // Recent activities from audit log
        prisma.auditLog.findMany({
          take: 10,
          orderBy: { timestamp: 'desc' },
          include: {
            user: {
              select: {
                email: true,
                clientProfile: { select: { firstName: true, lastName: true } },
                caregiverProfile: { select: { firstName: true, lastName: true } },
                coordinatorProfile: { select: { firstName: true, lastName: true } }
              }
            }
          }
        })
      ])

      return {
        clients: {
          total: totalClients,
          active: activeClients,
          inactive: totalClients - activeClients
        },
        caregivers: {
          total: totalCaregivers,
          active: activeCaregivers,
          inactive: totalCaregivers - activeCaregivers
        },
        visits: {
          today: todayVisits
        },
        billing: {
          pendingInvoices
        },
        recentActivities: recentActivities.map(activity => ({
          id: activity.id,
          action: activity.action,
          resourceType: activity.resourceType,
          timestamp: activity.timestamp,
          userEmail: activity.user?.email,
          userName: activity.user?.clientProfile?.firstName 
            ? `${activity.user.clientProfile.firstName} ${activity.user.clientProfile.lastName}`
            : activity.user?.caregiverProfile?.firstName
            ? `${activity.user.caregiverProfile.firstName} ${activity.user.caregiverProfile.lastName}`
            : activity.user?.coordinatorProfile?.firstName
            ? `${activity.user.coordinatorProfile.firstName} ${activity.user.coordinatorProfile.lastName}`
            : 'Unknown User'
        }))
      }
    }),

  // System Reports
  getSystemReports: staffProcedure
    .input(z.object({
      reportType: z.enum(['UTILIZATION', 'REVENUE', 'CAREGIVER_RETENTION', 'CLIENT_SATISFACTION']),
      startDate: z.date(),
      endDate: z.date(),
      filters: z.object({
        clientIds: z.array(z.string()).optional(),
        caregiverIds: z.array(z.string()).optional(),
        serviceTypes: z.array(z.string()).optional()
      }).optional()
    }))
    .query(async ({ input, ctx }) => {
      const { reportType, startDate, endDate, filters } = input

      switch (reportType) {
        case 'UTILIZATION':
          return await generateUtilizationReport(startDate, endDate, filters)
        case 'REVENUE':
          return await generateRevenueReport(startDate, endDate, filters)
        case 'CAREGIVER_RETENTION':
          return await generateCaregiverRetentionReport(startDate, endDate, filters)
        case 'CLIENT_SATISFACTION':
          return await generateClientSatisfactionReport(startDate, endDate, filters)
        default:
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Invalid report type'
          })
      }
    }),

  // User Management
  getAllUsers: adminProcedure
    .input(z.object({
      page: z.number().min(1).default(1),
      limit: z.number().min(1).max(100).default(20),
      role: z.enum(['ADMIN', 'COORDINATOR', 'CAREGIVER', 'CLIENT', 'FAMILY']).optional(),
      status: z.enum(['ACTIVE', 'INACTIVE', 'SUSPENDED']).optional(),
      search: z.string().optional()
    }))
    .query(async ({ input }) => {
      const { page, limit, role, status, search } = input
      const skip = (page - 1) * limit

      const where: any = {}
      if (role) where.role = role
      if (status) where.isActive = status === 'ACTIVE'
      if (search) {
        where.OR = [
          { email: { contains: search, mode: 'insensitive' } },
          { clientProfile: { firstName: { contains: search, mode: 'insensitive' } } },
          { clientProfile: { lastName: { contains: search, mode: 'insensitive' } } },
          { caregiverProfile: { firstName: { contains: search, mode: 'insensitive' } } },
          { caregiverProfile: { lastName: { contains: search, mode: 'insensitive' } } }
        ]
      }

      const [users, total] = await Promise.all([
        prisma.user.findMany({
          where,
          skip,
          take: limit,
          include: {
            clientProfile: { select: { firstName: true, lastName: true, status: true } },
            caregiverProfile: { select: { firstName: true, lastName: true, status: true } },
            coordinatorProfile: { select: { firstName: true, lastName: true } }
          },
          orderBy: { createdAt: 'desc' }
        }),
        prisma.user.count({ where })
      ])

      return {
        users: users.map(user => ({
          id: user.id,
          email: user.email,
          role: user.role,
          isActive: user.isActive,
          lastLoginAt: user.lastLoginAt,
          createdAt: user.createdAt,
          profile: user.clientProfile || user.caregiverProfile || user.coordinatorProfile || null
        })),
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      }
    }),

  // System Settings
  getSystemSettings: adminProcedure
    .query(async () => {
      // In a real app, you'd have a settings table
      // For now, return default settings
      return {
        general: {
          companyName: 'Caring Compass Home Care LLC',
          timezone: 'America/New_York',
          defaultLanguage: 'en',
          supportedLanguages: ['en', 'ht', 'fr']
        },
        billing: {
          defaultPaymentTerms: 30,
          lateFeePercentage: 5,
          autoInvoiceGeneration: true,
          paymentMethods: ['ACH', 'CREDIT_CARD', 'CHECK']
        },
        scheduling: {
          minVisitDuration: 2, // hours
          maxVisitDuration: 24, // hours
          autoMatchingEnabled: true,
          requireApprovalForChanges: true
        },
        notifications: {
          emailEnabled: true,
          smsEnabled: true,
          visitReminders: true,
          paymentReminders: true,
          credentialExpiryAlerts: true
        },
        security: {
          mfaRequired: false,
          passwordExpiryDays: 90,
          sessionTimeoutMinutes: 1440, // 24 hours
          maxLoginAttempts: 5
        }
      }
    }),

  updateSystemSettings: adminProcedure
    .input(z.object({
      category: z.enum(['general', 'billing', 'scheduling', 'notifications', 'security']),
      settings: z.record(z.any())
    }))
    .mutation(async ({ input, ctx }) => {
      // In a real app, you'd update the settings in database
      // For now, just return success
      
      await prisma.auditLog.create({
        data: {
          userId: ctx.user.id,
          action: 'UPDATE',
          resourceType: 'SYSTEM_SETTINGS',
          resourceId: `settings:${input.category}`,
          details: `Updated ${input.category} settings`,
          metadata: input.settings
        }
      })

      return { success: true }
    }),

  // Audit Logs
  getAuditLogs: staffProcedure
    .input(z.object({
      page: z.number().min(1).default(1),
      limit: z.number().min(1).max(100).default(50),
      userId: z.string().optional(),
      action: z.string().optional(),
      resourceType: z.string().optional(),
      startDate: z.date().optional(),
      endDate: z.date().optional()
    }))
    .query(async ({ input }) => {
      const { page, limit, userId, action, resourceType, startDate, endDate } = input
      const skip = (page - 1) * limit

      const where: any = {}
      if (userId) where.userId = userId
      if (action) where.action = action
      if (resourceType) where.resourceType = resourceType
      if (startDate || endDate) {
        where.timestamp = {}
        if (startDate) where.timestamp.gte = startDate
        if (endDate) where.timestamp.lte = endDate
      }

      const [logs, total] = await Promise.all([
        prisma.auditLog.findMany({
          where,
          skip,
          take: limit,
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
        prisma.auditLog.count({ where })
      ])

      return {
        logs: logs.map(log => ({
          id: log.id,
          action: log.action,
          resourceType: log.resourceType,
          resourceId: log.resourceId,
          details: log.details,
          timestamp: log.timestamp,
          ipAddress: log.ipAddress,
          userAgent: log.userAgent,
          metadata: log.metadata,
          user: {
            email: log.user?.email,
            role: log.user?.role,
            name: log.user?.clientProfile?.firstName 
              ? `${log.user.clientProfile.firstName} ${log.user.clientProfile.lastName}`
              : log.user?.caregiverProfile?.firstName
              ? `${log.user.caregiverProfile.firstName} ${log.user.caregiverProfile.lastName}`
              : log.user?.coordinatorProfile?.firstName
              ? `${log.user.coordinatorProfile.firstName} ${log.user.coordinatorProfile.lastName}`
              : 'Unknown User'
          }
        })),
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      }
    })
})

// Helper functions for report generation
async function generateUtilizationReport(startDate: Date, endDate: Date, filters?: any) {
  const visits = await prisma.visit.findMany({
    where: {
      scheduledStart: { gte: startDate, lte: endDate },
      ...(filters?.clientIds && { clientId: { in: filters.clientIds } }),
      ...(filters?.caregiverIds && { caregiverId: { in: filters.caregiverIds } })
    },
    include: {
      client: { select: { firstName: true, lastName: true } },
      caregiver: { select: { firstName: true, lastName: true } }
    }
  })

  // Calculate utilization metrics
  const totalScheduledHours = visits.reduce((sum, visit) => {
    if (visit.scheduledEnd && visit.scheduledStart) {
      return sum + ((visit.scheduledEnd.getTime() - visit.scheduledStart.getTime()) / (1000 * 60 * 60))
    }
    return sum
  }, 0)

  const totalActualHours = visits.reduce((sum, visit) => {
    if (visit.actualEnd && visit.actualStart) {
      return sum + ((visit.actualEnd.getTime() - visit.actualStart.getTime()) / (1000 * 60 * 60))
    }
    return sum
  }, 0)

  return {
    reportType: 'UTILIZATION',
    period: { startDate, endDate },
    summary: {
      totalVisits: visits.length,
      completedVisits: visits.filter(v => v.status === 'COMPLETED').length,
      cancelledVisits: visits.filter(v => v.status === 'CANCELLED').length,
      totalScheduledHours,
      totalActualHours,
      utilizationRate: totalScheduledHours > 0 ? (totalActualHours / totalScheduledHours) * 100 : 0
    },
    details: visits
  }
}

async function generateRevenueReport(startDate: Date, endDate: Date, filters?: any) {
  const invoices = await prisma.invoice.findMany({
    where: {
      createdAt: { gte: startDate, lte: endDate },
      ...(filters?.clientIds && { clientId: { in: filters.clientIds } })
    },
    include: {
      client: { select: { firstName: true, lastName: true } },
      payments: true
    }
  })

  const totalRevenue = invoices.reduce((sum, invoice) => sum + invoice.totalAmount, 0)
  const paidRevenue = invoices
    .filter(invoice => invoice.status === 'PAID')
    .reduce((sum, invoice) => sum + invoice.totalAmount, 0)

  return {
    reportType: 'REVENUE',
    period: { startDate, endDate },
    summary: {
      totalInvoices: invoices.length,
      totalRevenue,
      paidRevenue,
      pendingRevenue: totalRevenue - paidRevenue,
      collectionRate: totalRevenue > 0 ? (paidRevenue / totalRevenue) * 100 : 0
    },
    details: invoices
  }
}

async function generateCaregiverRetentionReport(startDate: Date, endDate: Date, filters?: any) {
  const caregivers = await prisma.caregiverProfile.findMany({
    where: {
      hireDate: { gte: startDate, lte: endDate },
      ...(filters?.caregiverIds && { id: { in: filters.caregiverIds } })
    },
    include: {
      visits: {
        where: {
          scheduledStart: { gte: startDate, lte: endDate }
        }
      }
    }
  })

  const activeCaregivers = caregivers.filter(c => c.status === 'ACTIVE').length
  const inactiveCaregivers = caregivers.filter(c => c.status === 'INACTIVE').length

  return {
    reportType: 'CAREGIVER_RETENTION',
    period: { startDate, endDate },
    summary: {
      totalCaregivers: caregivers.length,
      activeCaregivers,
      inactiveCaregivers,
      retentionRate: caregivers.length > 0 ? (activeCaregivers / caregivers.length) * 100 : 0
    },
    details: caregivers
  }
}

async function generateClientSatisfactionReport(startDate: Date, endDate: Date, filters?: any) {
  // This would require a satisfaction/rating system to be implemented
  // For now, return placeholder data
  return {
    reportType: 'CLIENT_SATISFACTION',
    period: { startDate, endDate },
    summary: {
      averageRating: 4.5,
      totalResponses: 0,
      satisfactionRate: 90
    },
    details: []
  }
}