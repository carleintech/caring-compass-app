import cron from 'node-cron'
import { QueueManager, QUEUES } from '../queue/redis'
import { JobFactory } from '../jobs/types'
import { getPrismaClient } from '@caring-compass/database/src/utils'

const prisma = getPrismaClient()

// Notification scheduler class
export class NotificationScheduler {
  private scheduledTasks: Map<string, cron.ScheduledTask> = new Map()
  private isRunning: boolean = false

  constructor() {
    this.setupDefaultSchedules()
  }

  // Start the scheduler
  start(): void {
    if (this.isRunning) {
      console.log('Notification scheduler is already running')
      return
    }

    console.log('🚀 Starting notification scheduler...')
    
    // Start all scheduled tasks
    this.scheduledTasks.forEach((task, name) => {
      task.start()
      console.log(`✅ Started scheduled task: ${name}`)
    })

    this.isRunning = true
    console.log('📅 Notification scheduler started successfully')
  }

  // Stop the scheduler
  stop(): void {
    if (!this.isRunning) {
      console.log('Notification scheduler is not running')
      return
    }

    console.log('🛑 Stopping notification scheduler...')
    
    // Stop all scheduled tasks
    this.scheduledTasks.forEach((task, name) => {
      task.stop()
      console.log(`⏹️ Stopped scheduled task: ${name}`)
    })

    this.isRunning = false
    console.log('✅ Notification scheduler stopped')
  }

  // Setup default recurring schedules
  private setupDefaultSchedules(): void {
    // Visit reminders - run every 30 minutes
    this.addSchedule(
      'visit-reminders',
      '*/30 * * * *', // Every 30 minutes
      () => this.scheduleVisitReminders()
    )

    // Credential expiry alerts - run daily at 9 AM
    this.addSchedule(
      'credential-alerts',
      '0 9 * * *', // Daily at 9 AM
      () => this.scheduleCredentialAlerts()
    )

    // Invoice generation - run on 1st of every month at 6 AM
    this.addSchedule(
      'monthly-invoices',
      '0 6 1 * *', // 1st of month at 6 AM
      () => this.scheduleMonthlyInvoices()
    )

    // Weekly invoice generation for weekly clients - run every Monday at 6 AM
    this.addSchedule(
      'weekly-invoices',
      '0 6 * * 1', // Monday at 6 AM
      () => this.scheduleWeeklyInvoices()
    )

    // Overdue invoice reminders - run daily at 10 AM
    this.addSchedule(
      'overdue-reminders',
      '0 10 * * *', // Daily at 10 AM
      () => this.scheduleOverdueReminders()
    )

    // Timesheet reminders - run every Friday at 4 PM
    this.addSchedule(
      'timesheet-reminders',
      '0 16 * * 5', // Friday at 4 PM
      () => this.scheduleTimesheetReminders()
    )

    // System maintenance - run daily at 2 AM
    this.addSchedule(
      'system-maintenance',
      '0 2 * * *', // Daily at 2 AM
      () => this.scheduleSystemMaintenance()
    )

    // Metrics collection - run every hour
    this.addSchedule(
      'metrics-collection',
      '0 * * * *', // Every hour
      () => this.scheduleMetricsCollection()
    )
  }

  // Add a custom schedule
  addSchedule(name: string, cronExpression: string, handler: () => Promise<void>): void {
    if (this.scheduledTasks.has(name)) {
      console.warn(`Schedule ${name} already exists, replacing...`)
      this.removeSchedule(name)
    }

    const task = cron.schedule(cronExpression, async () => {
      try {
        console.log(`🔄 Running scheduled task: ${name}`)
        await handler()
        console.log(`✅ Completed scheduled task: ${name}`)
      } catch (error) {
        console.error(`❌ Error in scheduled task ${name}:`, error)
      }
    }, {
      scheduled: false, // Don't start immediately
      timezone: process.env.TIMEZONE || 'America/New_York'
    })

    this.scheduledTasks.set(name, task)
    console.log(`📝 Added scheduled task: ${name} (${cronExpression})`)
  }

  // Remove a schedule
  removeSchedule(name: string): void {
    const task = this.scheduledTasks.get(name)
    if (task) {
      task.stop()
      this.scheduledTasks.delete(name)
      console.log(`🗑️ Removed scheduled task: ${name}`)
    }
  }

  // Schedule visit reminders
  private async scheduleVisitReminders(): Promise<void> {
    const now = new Date()
    
    // 24-hour reminders
    const twentyFourHoursFromNow = new Date(now.getTime() + 24 * 60 * 60 * 1000)
    const twentyFourHourStart = new Date(twentyFourHoursFromNow.getTime() - 30 * 60 * 1000) // 30 min window
    const twentyFourHourEnd = new Date(twentyFourHoursFromNow.getTime() + 30 * 60 * 1000)

    const upcomingVisits24h = await prisma.visit.findMany({
      where: {
        status: 'ASSIGNED',
        scheduledStart: {
          gte: twentyFourHourStart,
          lte: twentyFourHourEnd
        },
        caregiverId: { not: null }
      },
      include: {
        client: true,
        caregiver: { include: { user: true } }
      }
    })

    // 2-hour reminders
    const twoHoursFromNow = new Date(now.getTime() + 2 * 60 * 60 * 1000)
    const twoHourStart = new Date(twoHoursFromNow.getTime() - 15 * 60 * 1000) // 15 min window
    const twoHourEnd = new Date(twoHoursFromNow.getTime() + 15 * 60 * 1000)

    const upcomingVisits2h = await prisma.visit.findMany({
      where: {
        status: 'ASSIGNED',
        scheduledStart: {
          gte: twoHourStart,
          lte: twoHourEnd
        },
        caregiverId: { not: null }
      },
      include: {
        client: true,
        caregiver: { include: { user: true } }
      }
    })

    // 30-minute reminders
    const thirtyMinutesFromNow = new Date(now.getTime() + 30 * 60 * 1000)
    const thirtyMinStart = new Date(thirtyMinutesFromNow.getTime() - 5 * 60 * 1000) // 5 min window
    const thirtyMinEnd = new Date(thirtyMinutesFromNow.getTime() + 5 * 60 * 1000)

    const upcomingVisits30m = await prisma.visit.findMany({
      where: {
        status: 'ASSIGNED',
        scheduledStart: {
          gte: thirtyMinStart,
          lte: thirtyMinEnd
        },
        caregiverId: { not: null }
      },
      include: {
        client: true,
        caregiver: { include: { user: true } }
      }
    })

    // Queue reminder jobs
    const reminderPromises = []

    // 24-hour reminders
    for (const visit of upcomingVisits24h) {
      if (visit.caregiver) {
        const reminderJob = JobFactory.createVisitReminderJob({
          visitId: visit.id,
          clientId: visit.clientId,
          caregiverId: visit.caregiverId!,
          reminderType: '24_HOUR',
          visitDate: visit.scheduledStart.toISOString(),
          reminderMethods: ['EMAIL', 'SMS']
        })

        reminderPromises.push(
          QueueManager.addJob(QUEUES.VISIT_REMINDERS, 'visit-reminder-24h', reminderJob)
        )
      }
    }

    // 2-hour reminders
    for (const visit of upcomingVisits2h) {
      if (visit.caregiver) {
        const reminderJob = JobFactory.createVisitReminderJob({
          visitId: visit.id,
          clientId: visit.clientId,
          caregiverId: visit.caregiverId!,
          reminderType: '2_HOUR',
          visitDate: visit.scheduledStart.toISOString(),
          reminderMethods: ['SMS']
        })

        reminderPromises.push(
          QueueManager.addJob(QUEUES.VISIT_REMINDERS, 'visit-reminder-2h', reminderJob)
        )
      }
    }

    // 30-minute reminders
    for (const visit of upcomingVisits30m) {
      if (visit.caregiver) {
        const reminderJob = JobFactory.createVisitReminderJob({
          visitId: visit.id,
          clientId: visit.clientId,
          caregiverId: visit.caregiverId!,
          reminderType: '30_MINUTE',
          visitDate: visit.scheduledStart.toISOString(),
          reminderMethods: ['SMS']
        })

        reminderPromises.push(
          QueueManager.addJob(QUEUES.VISIT_REMINDERS, 'visit-reminder-30m', reminderJob)
        )
      }
    }

    await Promise.all(reminderPromises)
    
    const totalReminders = upcomingVisits24h.length + upcomingVisits2h.length + upcomingVisits30m.length
    console.log(`📢 Scheduled ${totalReminders} visit reminders`)
  }

  // Schedule credential expiry alerts
  private async scheduleCredentialAlerts(): Promise<void> {
    const now = new Date()
    
    // Check for credentials expiring in 30, 7, and 1 days
    const alertPeriods = [
      { days: 30, type: '30_DAY' as const },
      { days: 7, type: '7_DAY' as const },
      { days: 1, type: '1_DAY' as const }
    ]

    const alertPromises = []

    for (const period of alertPeriods) {
      const expiryDate = new Date(now.getTime() + period.days * 24 * 60 * 60 * 1000)
      const startOfDay = new Date(expiryDate.getFullYear(), expiryDate.getMonth(), expiryDate.getDate())
      const endOfDay = new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000 - 1)

      const expiringCredentials = await prisma.caregiverCredential.findMany({
        where: {
          expirationDate: {
            gte: startOfDay,
            lte: endOfDay
          },
          status: 'VERIFIED'
        },
        include: {
          caregiver: { include: { user: true } }
        }
      })

      for (const credential of expiringCredentials) {
        // Check if alert already sent for this period
        const alertsSent = credential.metadata?.alertsSent || []
        if (!alertsSent.includes(period.type)) {
          const alertJob = JobFactory.createCredentialAlert({
            caregiverId: credential.caregiverId,
            credentialType: credential.credentialType,
            credentialName: credential.credentialName,
            expirationDate: credential.expirationDate!.toISOString(),
            alertType: period.type,
            alertMethods: ['EMAIL', 'SMS']
          })

          alertPromises.push(
            QueueManager.addJob(QUEUES.CREDENTIAL_ALERTS, 'credential-expiry-alert', alertJob)
          )
        }
      }
    }

    // Check for already expired credentials
    const expiredCredentials = await prisma.caregiverCredential.findMany({
      where: {
        expirationDate: { lt: now },
        status: 'VERIFIED' // Still marked as verified but expired
      },
      include: {
        caregiver: { include: { user: true } }
      }
    })

    for (const credential of expiredCredentials) {
      // Update status to expired
      await prisma.caregiverCredential.update({
        where: { id: credential.id },
        data: { status: 'EXPIRED' }
      })

      // Send expired notification if not already sent
      const alertsSent = credential.metadata?.alertsSent || []
      if (!alertsSent.includes('EXPIRED')) {
        const alertJob = JobFactory.createCredentialAlert({
          caregiverId: credential.caregiverId,
          credentialType: credential.credentialType,
          credentialName: credential.credentialName,
          expirationDate: credential.expirationDate!.toISOString(),
          alertType: 'EXPIRED',
          alertMethods: ['EMAIL', 'SMS']
        })

        alertPromises.push(
          QueueManager.addJob(QUEUES.CREDENTIAL_ALERTS, 'credential-expired-alert', alertJob)
        )
      }
    }

    await Promise.all(alertPromises)
    console.log(`🔔 Scheduled ${alertPromises.length} credential alerts`)
  }

  // Schedule monthly invoices
  private async scheduleMonthlyInvoices(): Promise<void> {
    const now = new Date()
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0)

    // Get clients with monthly billing
    const monthlyClients = await prisma.clientProfile.findMany({
      where: {
        status: 'ACTIVE',
        billingFrequency: 'MONTHLY'
      }
    })

    const invoicePromises = []

    for (const client of monthlyClients) {
      const invoiceJob = JobFactory.createInvoiceJob({
        clientId: client.id,
        billingPeriod: {
          startDate: lastMonth.toISOString(),
          endDate: endOfLastMonth.toISOString()
        },
        autoSend: true
      })

      invoicePromises.push(
        QueueManager.addJob(QUEUES.INVOICE_GENERATION, 'monthly-invoice', invoiceJob)
      )
    }

    await Promise.all(invoicePromises)
    console.log(`💰 Scheduled ${invoicePromises.length} monthly invoices`)
  }

  // Schedule weekly invoices
  private async scheduleWeeklyInvoices(): Promise<void> {
    const now = new Date()
    const lastWeekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    const lastWeekEnd = new Date(now.getTime() - 24 * 60 * 60 * 1000)

    // Get clients with weekly billing
    const weeklyClients = await prisma.clientProfile.findMany({
      where: {
        status: 'ACTIVE',
        billingFrequency: 'WEEKLY'
      }
    })

    const invoicePromises = []

    for (const client of weeklyClients) {
      const invoiceJob = JobFactory.createInvoiceJob({
        clientId: client.id,
        billingPeriod: {
          startDate: lastWeekStart.toISOString(),
          endDate: lastWeekEnd.toISOString()
        },
        autoSend: true
      })

      invoicePromises.push(
        QueueManager.addJob(QUEUES.INVOICE_GENERATION, 'weekly-invoice', invoiceJob)
      )
    }

    await Promise.all(invoicePromises)
    console.log(`💰 Scheduled ${invoicePromises.length} weekly invoices`)
  }

  // Schedule overdue reminders
  private async scheduleOverdueReminders(): Promise<void> {
    const now = new Date()

    const overdueInvoices = await prisma.invoice.findMany({
      where: {
        status: 'PENDING',
        dueDate: { lt: now }
      },
      include: {
        client: { include: { user: true } }
      }
    })

    const reminderPromises = []

    for (const invoice of overdueInvoices) {
      if (invoice.client.user?.email) {
        const emailJob = JobFactory.createEmailJob({
          to: invoice.client.user.email,
          templateId: 'invoice-overdue',
          templateData: {
            clientName: `${invoice.client.firstName} ${invoice.client.lastName}`,
            invoiceNumber: invoice.invoiceNumber,
            amount: invoice.totalAmount.toFixed(2),
            daysOverdue: Math.ceil((now.getTime() - invoice.dueDate.getTime()) / (1000 * 60 * 60 * 24)),
            paymentLink: `${process.env.CLIENT_PORTAL_URL}/invoices/${invoice.id}/pay`
          },
          priority: 'HIGH'
        })

        reminderPromises.push(
          QueueManager.addJob(QUEUES.EMAIL_NOTIFICATIONS, 'overdue-reminder', emailJob)
        )
      }

      // Also send SMS if phone number available
      if (invoice.client.phone) {
        const smsJob = JobFactory.createSmsJob({
          to: invoice.client.phone,
          templateId: 'invoice-overdue',
          templateData: {
            invoiceNumber: invoice.invoiceNumber,
            amount: invoice.totalAmount.toFixed(2),
            billingPhone: process.env.BILLING_PHONE || '555-BILLING'
          },
          priority: 'HIGH'
        })

        reminderPromises.push(
          QueueManager.addJob(QUEUES.SMS_NOTIFICATIONS, 'overdue-sms-reminder', smsJob)
        )
      }
    }

    await Promise.all(reminderPromises)
    console.log(`⚠️ Scheduled ${reminderPromises.length} overdue reminders`)
  }

  // Schedule timesheet reminders
  private async scheduleTimesheetReminders(): Promise<void> {
    const now = new Date()
    const weekEndDate = new Date(now.getTime() - ((now.getDay() + 2) % 7) * 24 * 60 * 60 * 1000) // Last Sunday
    
    // Get caregivers who haven't submitted timesheets
    const caregivers = await prisma.caregiverProfile.findMany({
      where: {
        status: 'ACTIVE'
      },
      include: {
        user: true,
        timesheets: {
          where: {
            payPeriod: {
              endDate: weekEndDate
            }
          }
        }
      }
    })

    const reminderPromises = []

    for (const caregiver of caregivers) {
      // Check if timesheet already submitted
      if (caregiver.timesheets.length === 0) {
        if (caregiver.user?.email) {
          const emailJob = JobFactory.createEmailJob({
            to: caregiver.user.email,
            templateId: 'timesheet-reminder',
            templateData: {
              caregiverName: `${caregiver.firstName} ${caregiver.lastName}`,
              weekEndDate: weekEndDate.toLocaleDateString(),
              deadline: new Date(weekEndDate.getTime() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString(),
              portalLink: process.env.CAREGIVER_PORTAL_URL
            },
            priority: 'NORMAL'
          })

          reminderPromises.push(
            QueueManager.addJob(QUEUES.EMAIL_NOTIFICATIONS, 'timesheet-reminder', emailJob)
          )
        }

        if (caregiver.phone) {
          const smsJob = JobFactory.createSmsJob({
            to: caregiver.phone,
            templateId: 'timesheet-reminder',
            templateData: {
              weekEndDate: weekEndDate.toLocaleDateString(),
              deadline: new Date(weekEndDate.getTime() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString()
            },
            priority: 'NORMAL'
          })

          reminderPromises.push(
            QueueManager.addJob(QUEUES.SMS_NOTIFICATIONS, 'timesheet-sms-reminder', smsJob)
          )
        }
      }
    }

    await Promise.all(reminderPromises)
    console.log(`📝 Scheduled ${reminderPromises.length} timesheet reminders`)
  }

  // Schedule system maintenance
  private async scheduleSystemMaintenance(): Promise<void> {
    const maintenanceTasks = [
      'DATABASE_CLEANUP',
      'FILE_CLEANUP',
      'CACHE_REFRESH',
      'HEALTH_CHECK',
      'METRICS_COLLECTION'
    ]

    const taskPromises = []

    for (const taskType of maintenanceTasks) {
      const maintenanceJob = JobFactory.createAuditLogJob({
        action: 'SYSTEM_MAINTENANCE',
        resourceType: 'SYSTEM',
        resourceId: 'maintenance',
        details: `Scheduled ${taskType}`,
        timestamp: new Date().toISOString()
      })

      taskPromises.push(
        QueueManager.addJob(QUEUES.SYSTEM_MAINTENANCE, taskType.toLowerCase(), maintenanceJob)
      )
    }

    await Promise.all(taskPromises)
    console.log(`🔧 Scheduled ${taskPromises.length} maintenance tasks`)
  }

  // Schedule metrics collection
  private async scheduleMetricsCollection(): Promise<void> {
    const metricsJob = JobFactory.createAuditLogJob({
      action: 'METRICS_COLLECTION',
      resourceType: 'SYSTEM',
      resourceId: 'metrics',
      details: 'Hourly metrics collection',
      timestamp: new Date().toISOString()
    })

    await QueueManager.addJob(QUEUES.SYSTEM_MAINTENANCE, 'metrics-collection', metricsJob)
    console.log('📊 Scheduled metrics collection')
  }

  // Get scheduler status
  getStatus(): {
    isRunning: boolean
    scheduledTasks: string[]
    nextRunTimes: Record<string, Date | null>
  } {
    const nextRunTimes: Record<string, Date | null> = {}
    
    this.scheduledTasks.forEach((task, name) => {
      nextRunTimes[name] = task.nextDates().next().value || null
    })

    return {
      isRunning: this.isRunning,
      scheduledTasks: Array.from(this.scheduledTasks.keys()),
      nextRunTimes
    }
  }

  // Manual trigger for testing
  async triggerTask(taskName: string): Promise<void> {
    console.log(`🔧 Manually triggering task: ${taskName}`)
    
    switch (taskName) {
      case 'visit-reminders':
        await this.scheduleVisitReminders()
        break
      case 'credential-alerts':
        await this.scheduleCredentialAlerts()
        break
      case 'monthly-invoices':
        await this.scheduleMonthlyInvoices()
        break
      case 'weekly-invoices':
        await this.scheduleWeeklyInvoices()
        break
      case 'overdue-reminders':
        await this.scheduleOverdueReminders()
        break
      case 'timesheet-reminders':
        await this.scheduleTimesheetReminders()
        break
      case 'system-maintenance':
        await this.scheduleSystemMaintenance()
        break
      case 'metrics-collection':
        await this.scheduleMetricsCollection()
        break
      default:
        throw new Error(`Unknown task: ${taskName}`)
    }
  }
}

// Export singleton instance
export const notificationScheduler = new NotificationScheduler()

// Auto-start if not in test environment
if (process.env.NODE_ENV !== 'test') {
  notificationScheduler.start()
}

export default NotificationScheduler