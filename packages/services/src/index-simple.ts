// Simple exports for testing
import { 
  redis, 
  queues, 
  QueueManager, 
  QueueMonitor, 
  checkRedisHealth, 
  QUEUES 
} from './queue/redis'

export { 
  redis, 
  queues, 
  QueueManager, 
  QueueMonitor, 
  checkRedisHealth, 
  QUEUES 
}

// Job types and validation
export * from './jobs/types'

// Simple notification services
import { SimpleEmailService, createEmailService as createSimpleEmailService } from './notifications/email-simple'
import { SimpleSmsService, createSmsService as createSimpleSmsService } from './notifications/sms-simple'

export { SimpleEmailService as EmailService }
export { SimpleSmsService as SmsService }

export function createEmailService() {
  return createSimpleEmailService()
}

export function createSmsService() {
  return createSimpleSmsService()
}

// Mock other services for testing
export class MockStripeService {
  async createPaymentIntent() { return { id: 'pi_mock', status: 'succeeded' } }
  async confirmPaymentIntent() { return { id: 'pi_mock', status: 'succeeded' } }
}

export class MockFileStorageService {
  async uploadFile() { return { success: true, url: 'https://mock.com/file.pdf' } }
  async downloadFile() { return { success: true, data: Buffer.from('mock') } }
}

export class MockNotificationScheduler {
  getStatus() { return { isRunning: true, scheduledTasks: [] } }
  scheduleReminder() { return Promise.resolve({ success: true }) }
}

export function createStripeService() { return new MockStripeService() }
export function createFileStorageService() { return new MockFileStorageService() }

const mockScheduler = new MockNotificationScheduler()
export { mockScheduler as notificationScheduler }

// Service factory for easy initialization
export class ServicesFactory {
  private static instances: Map<string, any> = new Map()

  static getEmailService() {
    if (!this.instances.has('email')) {
      this.instances.set('email', createEmailService())
    }
    return this.instances.get('email')
  }

  static getSmsService() {
    if (!this.instances.has('sms')) {
      this.instances.set('sms', createSmsService())
    }
    return this.instances.get('sms')
  }

  static getStripeService() {
    if (!this.instances.has('stripe')) {
      this.instances.set('stripe', createStripeService())
    }
    return this.instances.get('stripe')
  }

  static getFileStorageService() {
    if (!this.instances.has('storage')) {
      this.instances.set('storage', createFileStorageService())
    }
    return this.instances.get('storage')
  }

  static getNotificationScheduler() {
    return mockScheduler
  }

  static clearInstances(): void {
    this.instances.clear()
  }
}

// Service health checker
export class ServicesHealthChecker {
  static async checkAllServices() {
    return {
      overall: 'healthy' as const,
      services: {
        redis: { status: 'healthy' as const, responseTime: 5 },
        email: { status: 'healthy' as const, message: 'Mock service' },
        sms: { status: 'healthy' as const, message: 'Mock service' },
        stripe: { status: 'healthy' as const, message: 'Mock service' },
        storage: { status: 'healthy' as const, message: 'Mock service' },
        scheduler: { status: 'healthy' as const, message: '0 tasks scheduled' }
      }
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
  static async addJobSafely<T = any>(
    queueName: string,
    jobName: string,
    data: T,
    options?: any
  ) {
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

  static async sendNotification(options: any) {
    return {
      success: true,
      results: [
        { method: 'EMAIL', success: true, jobId: 'mock-job-1' },
        { method: 'SMS', success: true, jobId: 'mock-job-2' }
      ]
    }
  }

  static async scheduleVisitReminder(options: any) {
    return { success: true, jobId: 'mock-reminder-job' }
  }

  static async generateInvoice(options: any) {
    return { success: true, jobId: 'mock-invoice-job' }
  }

  static async processPayment(options: any) {
    return { success: true, jobId: 'mock-payment-job' }
  }
}

// Configuration validator
export class ServicesConfig {
  static validate() {
    return {
      valid: true,
      errors: [],
      warnings: []
    }
  }

  static getConfiguration() {
    return {
      redis: {
        url: process.env.REDIS_URL,
        host: process.env.REDIS_HOST || 'localhost',
        port: process.env.REDIS_PORT || '6379'
      },
      email: {
        provider: 'MOCK',
        sendgridKey: '***configured***',
        resendKey: 'not configured'
      },
      sms: {
        twilioSid: '***configured***',
        twilioToken: '***configured***'
      },
      stripe: {
        secretKey: '***configured***',
        webhookSecret: '***configured***'
      },
      supabase: {
        url: process.env.SUPABASE_URL || 'https://mock.supabase.co',
        serviceKey: '***configured***'
      }
    }
  }
}

export default {
  ServicesFactory,
  ServicesHealthChecker,
  ServiceUtils,
  ServicesConfig,
  QueueManager,
  QueueMonitor,
  notificationScheduler: mockScheduler
}
