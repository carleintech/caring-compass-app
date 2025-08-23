import { Queue, Job, JobsOptions } from 'bullmq'
import { EmailService, createEmailService, getEmailTemplates } from './notifications/email'
import { SmsService, createSmsService, SMS_TEMPLATES, PhoneUtils } from './notifications/sms'
import { NotificationScheduler } from './notifications/scheduler'
import { 
  StripeService, 
  createStripeService, 
  type PaymentMethodType, 
  type PaymentMetadata, 
  type CustomerInfo 
} from './integrations/stripe'
import { FileStorageService, createFileStorageService, FileValidator } from './storage/file-storage'
import { redis, defaultQueueOptions, defaultWorkerOptions } from './queue/redis'
import { QueueManager, QUEUES } from './queue/manager'
import { QueueMonitor, type QueueMetrics, type JobMetrics } from './queue/monitor'
import { JobFactory } from './jobs/factory'
import { checkRedisHealth } from './utils/health'
import { 
  type EmailJobData,
  type SmsJobData,
  type VisitReminderJobData,
  type BaseJobData,
  EmailJobSchema,
  SmsJobSchema,
  VisitReminderJobSchema
} from './jobs/types'

// Re-export everything
export { 
  redis, 
  defaultQueueOptions,
  defaultWorkerOptions,
  
  // Queue management
  QueueManager,
  QueueMonitor,
  QUEUES,
  type QueueMetrics,
  type JobMetrics,
  
  // Health checks
  checkRedisHealth,
  
  // Notification services
  EmailService, 
  createEmailService, 
  getEmailTemplates,
  SmsService, 
  createSmsService, 
  SMS_TEMPLATES, 
  PhoneUtils,
  NotificationScheduler,

  // Integration services 
  StripeService,
  createStripeService,
  type PaymentMethodType,
  type PaymentMetadata,
  type CustomerInfo,

  // Storage services
  FileStorageService, 
  createFileStorageService, 
  FileValidator,

  // Job types
  type EmailJobData,
  type SmsJobData,
  type VisitReminderJobData,
  type BaseJobData,
  EmailJobSchema,
  SmsJobSchema,
  VisitReminderJobSchema
}

// Initialize notification scheduler singleton
const notificationScheduler = new NotificationScheduler()

// Worker processors
export * from './workers/processors'

// Service factory for easy initialization
interface ServiceInstances {
  email: EmailService
  sms: SmsService
  stripe: StripeService
  storage: FileStorageService
  scheduler: NotificationScheduler
}

type ServiceType = keyof ServiceInstances
type Service = ServiceInstances[ServiceType]

export class ServicesFactory {
  private static instances = new Map<ServiceType, Service>()

  static getEmailService(): EmailService {
    const key: ServiceType = 'email'
    if (!this.instances.has(key)) {
      this.instances.set(key, createEmailService())
    }
    return this.instances.get(key) as EmailService
  }

  static getSmsService(): SmsService {
    const key: ServiceType = 'sms'
    if (!this.instances.has(key)) {
      this.instances.set(key, createSmsService())
    }
    return this.instances.get(key) as SmsService
  }

  static getStripeService(): StripeService {
    const key: ServiceType = 'stripe'
    if (!this.instances.has(key)) {
      this.instances.set(key, createStripeService())
    }
    return this.instances.get(key) as StripeService
  }

  static getFileStorageService(): FileStorageService {
    const key: ServiceType = 'storage'
    if (!this.instances.has(key)) {
      this.instances.set(key, createFileStorageService())
    }
    return this.instances.get(key) as FileStorageService
  }

  static getNotificationScheduler(): NotificationScheduler {
    const key: ServiceType = 'scheduler'
    if (!this.instances.has(key)) {
      this.instances.set(key, new NotificationScheduler())
    }
    return this.instances.get(key) as NotificationScheduler
  }



  // Clear all instances (useful for testing)
  static clearInstances(): void {
    this.instances.clear()
  }
}

// Service health checker
export class ServicesHealthChecker {
  static async checkAllServices(): Promise<{
    overall: 'healthy' | 'degraded' | 'unhealthy'
    services: Record<string, {
      status: 'healthy' | 'unhealthy'
      message?: string
      responseTime?: number
    }>
  }> {
    const results: Record<string, any> = {}
    
    // Check Redis
    try {
      const start = Date.now()
      await checkRedisHealth()
      results.redis = {
        status: 'healthy',
        responseTime: Date.now() - start
      }
    } catch (error) {
      results.redis = {
        status: 'unhealthy',
        message: error instanceof Error ? error.message : 'Unknown error'
      }
    }

    // Check Email Service
    try {
      const emailService = ServicesFactory.getEmailService()
      // Basic health check - could be more sophisticated
      results.email = {
        status: 'healthy',
        message: 'Service initialized'
      }
    } catch (error) {
      results.email = {
        status: 'unhealthy',
        message: error instanceof Error ? error.message : 'Unknown error'
      }
    }

    // Check SMS Service
    try {
      const smsService = ServicesFactory.getSmsService()
      results.sms = {
        status: 'healthy',
        message: 'Service initialized'
      }
    } catch (error) {
      results.sms = {
        status: 'unhealthy',
        message: error instanceof Error ? error.message : 'Unknown error'
      }
    }

    // Check Stripe Service
    try {
      const stripeService = ServicesFactory.getStripeService()
      results.stripe = {
        status: 'healthy',
        message: 'Service initialized'
      }
    } catch (error) {
      results.stripe = {
        status: 'unhealthy',
        message: error instanceof Error ? error.message : 'Unknown error'
      }
    }

    // Check File Storage
    try {
      const storageService = ServicesFactory.getFileStorageService()
      results.storage = {
        status: 'healthy',
        message: 'Service initialized'
      }
    } catch (error) {
      results.storage = {
        status: 'unhealthy',
        message: error instanceof Error ? error.message : 'Unknown error'
      }
    }

    // Check Notification Scheduler
    try {
      const scheduler = ServicesFactory.getNotificationScheduler()
      const schedulerStatus = scheduler.getStatus()
      results.scheduler = {
        status: schedulerStatus.isRunning ? 'healthy' : 'unhealthy',
        message: `${schedulerStatus.scheduledTasks.length} tasks scheduled`
      }
    } catch (error) {
      results.scheduler = {
        status: 'unhealthy',
        message: error instanceof Error ? error.message : 'Unknown error'
      }
    }

    // Determine overall health
    const healthyServices = Object.values(results).filter(r => r.status === 'healthy').length
    const totalServices = Object.keys(results).length
    const healthRatio = healthyServices / totalServices

    let overall: 'healthy' | 'degraded' | 'unhealthy'
    if (healthRatio === 1) {
      overall = 'healthy'
    } else if (healthRatio >= 0.7) {
      overall = 'degraded'
    } else {
      overall = 'unhealthy'
    }

    return {
      overall,
      services: results
    }
  }

  static async getQueueMetrics() {
    try {
      return await QueueMonitor.getMetrics()
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }
}

// Service utilities
export class ServiceUtils {
  // Add a job to any queue with validation
  static async addJobSafely<T = any>(
    queueName: string,
    jobName: string,
    data: T,
    options?: any
  ): Promise<{ success: boolean; jobId?: string; error?: string }> {
    try {
      const job = await QueueManager.addJob(queueName as any, jobName, data, options)
      return {
        success: true,
        jobId: job.id
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  // Send notification with automatic method detection
  static async sendNotification(options: {
    userId?: string
    email?: string
    phone?: string
    subject: string
    message: string
    templateId?: string
    templateData?: Record<string, any>
    priority?: 'LOW' | 'NORMAL' | 'HIGH'
    methods?: ('EMAIL' | 'SMS')[]
  }): Promise<{
    success: boolean
    results: Array<{ method: string; success: boolean; jobId?: string; error?: string }>
  }> {
    const results: Array<{ method: string; success: boolean; jobId?: string; error?: string }> = []
    const methods = options.methods || ['EMAIL', 'SMS']

    // Send email if requested and email available
    if (methods.includes('EMAIL') && options.email) {
      const emailJob = JobFactory.createEmailJob({
        to: options.email,
        subject: options.subject,
        htmlContent: options.message,
        templateId: options.templateId,
        templateData: options.templateData,
        priority: options.priority || 'NORMAL'
      })

      const emailResult = await this.addJobSafely(
        QUEUES.EMAIL_NOTIFICATIONS,
        'notification-email',
        emailJob
      )

      results.push({
        method: 'EMAIL',
        success: emailResult.success,
        jobId: emailResult.jobId,
        error: emailResult.error
      })
    }

    // Send SMS if requested and phone available
    if (methods.includes('SMS') && options.phone) {
      const smsJob = JobFactory.createSmsJob({
        to: options.phone,
        message: options.message,
        templateId: options.templateId,
        templateData: options.templateData,
        priority: options.priority || 'NORMAL'
      })

      const smsResult = await this.addJobSafely(
        QUEUES.SMS_NOTIFICATIONS,
        'notification-sms',
        smsJob
      )

      results.push({
        method: 'SMS',
        success: smsResult.success,
        jobId: smsResult.jobId,
        error: smsResult.error
      })
    }

    const overallSuccess = results.every(r => r.success)
    return {
      success: overallSuccess,
      results
    }
  }

  // Schedule a visit reminder
  static async scheduleVisitReminder(options: {
    visitId: string
    clientId: string
    caregiverId: string
    visitDate: Date
    reminderType: '24_HOUR' | '2_HOUR' | '30_MINUTE'
    methods?: ('EMAIL' | 'SMS')[]
  }): Promise<{ success: boolean; jobId?: string; error?: string }> {
    const reminderJob = JobFactory.createVisitReminderJob({
      visitId: options.visitId,
      clientId: options.clientId,
      caregiverId: options.caregiverId,
      reminderType: options.reminderType,
      visitDate: options.visitDate.toISOString(),
      reminderMethods: options.methods || ['EMAIL', 'SMS']
    })

    return await this.addJobSafely(
      QUEUES.VISIT_REMINDERS,
      'visit-reminder',
      reminderJob
    )
  }

  // Generate an invoice
  static async generateInvoice(options: {
    clientId: string
    billingPeriod: {
      startDate: Date
      endDate: Date
    }
    visitIds?: string[]
    autoSend?: boolean
    dueDate?: Date
  }): Promise<{ success: boolean; jobId?: string; error?: string }> {
    const invoiceJob = JobFactory.createInvoiceJob({
      clientId: options.clientId,
      billingPeriod: {
        startDate: options.billingPeriod.startDate.toISOString(),
        endDate: options.billingPeriod.endDate.toISOString()
      },
      visitIds: options.visitIds,
      autoSend: options.autoSend || false,
      dueDate: options.dueDate?.toISOString()
    })

    return await this.addJobSafely(
      QUEUES.INVOICE_GENERATION,
      'invoice-generation',
      invoiceJob
    )
  }

  // Process a payment
  static async processPayment(options: {
    invoiceId: string
    paymentIntentId: string
    amount: number
    currency?: string
    paymentMethod: 'STRIPE' | 'ACH' | 'CHECK'
  }): Promise<{ success: boolean; jobId?: string; error?: string }> {
    const paymentJob = JobFactory.createPaymentProcessingJob({
      invoiceId: options.invoiceId,
      paymentIntentId: options.paymentIntentId,
      amount: options.amount,
      currency: options.currency || 'usd',
      paymentMethod: options.paymentMethod
    })

    return await this.addJobSafely(
      QUEUES.PAYMENT_PROCESSING,
      'payment-processing',
      paymentJob
    )
  }
}

// Configuration validator
export class ServicesConfig {
  static validate(): {
    valid: boolean
    errors: string[]
    warnings: string[]
  } {
    const errors: string[] = []
    const warnings: string[] = []

    // Redis configuration
    if (!process.env.REDIS_URL && !process.env.REDIS_HOST) {
      errors.push('Redis configuration missing (REDIS_URL or REDIS_HOST required)')
    }

    // Email configuration
    if (!process.env.SENDGRID_API_KEY && !process.env.RESEND_API_KEY) {
      warnings.push('No email service configured (SENDGRID_API_KEY or RESEND_API_KEY)')
    }

    // SMS configuration
    if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN) {
      warnings.push('Twilio SMS service not configured')
    }

    // Stripe configuration
    if (!process.env.STRIPE_SECRET_KEY) {
      warnings.push('Stripe payment service not configured')
    }

    // Supabase configuration
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_KEY) {
      errors.push('Supabase configuration missing (required for file storage)')
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings
    }
  }

  static getConfiguration() {
    return {
      redis: {
        url: process.env.REDIS_URL,
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT
      },
      email: {
        provider: process.env.EMAIL_PROVIDER,
        sendgridKey: process.env.SENDGRID_API_KEY ? '***configured***' : 'not configured',
        resendKey: process.env.RESEND_API_KEY ? '***configured***' : 'not configured'
      },
      sms: {
        twilioSid: process.env.TWILIO_ACCOUNT_SID ? '***configured***' : 'not configured',
        twilioToken: process.env.TWILIO_AUTH_TOKEN ? '***configured***' : 'not configured'
      },
      stripe: {
        secretKey: process.env.STRIPE_SECRET_KEY ? '***configured***' : 'not configured',
        webhookSecret: process.env.STRIPE_WEBHOOK_SECRET ? '***configured***' : 'not configured'
      },
      supabase: {
        url: process.env.SUPABASE_URL,
        serviceKey: process.env.SUPABASE_SERVICE_KEY ? '***configured***' : 'not configured'
      }
    }
  }
}

// Export everything for easy access
export default {
  ServicesFactory,
  ServicesHealthChecker,
  ServiceUtils,
  ServicesConfig,
  QueueManager,
  QueueMonitor,
  notificationScheduler
}