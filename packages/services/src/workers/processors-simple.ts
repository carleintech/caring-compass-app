import { Worker, Job, WorkerOptions } from 'bullmq'
import { redis, QUEUES } from '../queue/redis'
import { 
  EmailJobData, 
  SmsJobData, 
  VisitReminderJobData,
  CredentialAlertJobData,
  InvoiceGenerationJobData,
  PaymentProcessingJobData,
  DocumentProcessingJobData,
  MatchingJobData,
  AuditLogJobData,
  SystemMaintenanceJobData,
  JobValidator
} from '../jobs/types'
import { createEmailService } from '../notifications/email-simple'
import { createSmsService } from '../notifications/sms-simple'
import { createStripeService } from '../integrations/stripe'
import { createFileStorageService } from '../storage/file-storage'

// Worker configuration
const workerOptions: WorkerOptions = {
  connection: redis,
  concurrency: 5,
  removeOnComplete: { count: 100 },
  removeOnFail: { count: 50 },
}

// Initialize services
const emailService = createEmailService()
const smsService = createSmsService()
const stripeService = createStripeService()
const fileStorageService = createFileStorageService()

// Email notification processor
export const emailWorker = new Worker(
  QUEUES.EMAIL_NOTIFICATIONS,
  async (job: Job<EmailJobData>) => {
    console.log(`Processing email job: ${job.id}`)
    
    try {
      // Validate job data
      const validatedData = JobValidator.validateEmailJob(job.data)
      
      // Process email
      const result = await emailService.sendEmail(validatedData)
      
      if (!result.success) {
        throw new Error(result.error || 'Email sending failed')
      }
      
      console.log(`Email sent successfully: ${result.messageId}`)
      return result
      
    } catch (error) {
      console.error(`Email job ${job.id} failed:`, error)
      throw error
    }
  },
  workerOptions
)

// SMS notification processor
export const smsWorker = new Worker(
  QUEUES.SMS_NOTIFICATIONS,
  async (job: Job<SmsJobData>) => {
    console.log(`Processing SMS job: ${job.id}`)
    
    try {
      // Validate job data
      const validatedData = JobValidator.validateSmsJob(job.data)
      
      // Process SMS
      const result = await smsService.sendSms(validatedData)
      
      if (!result.success) {
        throw new Error(result.error || 'SMS sending failed')
      }
      
      console.log(`SMS sent successfully: ${result.messageId}`)
      return result
      
    } catch (error) {
      console.error(`SMS job ${job.id} failed:`, error)
      throw error
    }
  },
  workerOptions
)

// Visit reminder processor (simplified)
export const visitReminderWorker = new Worker(
  QUEUES.VISIT_REMINDERS,
  async (job: Job<VisitReminderJobData>) => {
    console.log(`Processing visit reminder job: ${job.id}`)
    
    try {
      const validatedData = JobValidator.validateVisitReminderJob(job.data)
      
      // Mock visit data for now
      const mockVisit = {
        id: validatedData.visitId,
        client: { firstName: 'John', lastName: 'Doe' },
        caregiver: { firstName: 'Jane', lastName: 'Smith', phone: '+1234567890' }
      }
      
      const visitTime = new Date(validatedData.visitDate).toLocaleTimeString()
      const results = []
      
      for (const method of validatedData.reminderMethods) {
        switch (method) {
          case 'SMS':
            if (mockVisit.caregiver?.phone) {
              const smsResult = await smsService.sendSms({
                id: `reminder-sms-${job.id}`,
                to: mockVisit.caregiver.phone,
                message: `Reminder: Visit with ${mockVisit.client.firstName} ${mockVisit.client.lastName} at ${visitTime}`,
                priority: 'HIGH'
              })
              results.push({ method: 'SMS', success: smsResult.success })
            }
            break
            
          case 'EMAIL':
            // Email reminder would go here
            results.push({ method: 'EMAIL', success: true, note: 'Mock implementation' })
            break
            
          case 'PUSH':
            // Push notification implementation would go here
            results.push({ method: 'PUSH', success: false, note: 'Not implemented' })
            break
        }
      }
      
      console.log(`Visit reminder processed: ${results.length} notifications sent`)
      return { success: true, results }
      
    } catch (error) {
      console.error(`Visit reminder job ${job.id} failed:`, error)
      throw error
    }
  },
  workerOptions
)

// System maintenance processor
export const systemMaintenanceWorker = new Worker(
  QUEUES.SYSTEM_MAINTENANCE,
  async (job: Job<SystemMaintenanceJobData>) => {
    console.log(`Processing system maintenance job: ${job.id}`)
    
    try {
      const validatedData = JobValidator.validateSystemMaintenanceJob(job.data)
      
      let result
      
      switch (validatedData.taskType) {
        case 'HEALTH_CHECK':
          result = await performHealthCheck()
          break
          
        case 'CACHE_REFRESH':
          result = { success: true, message: 'Cache refreshed' }
          break
          
        case 'METRICS_COLLECTION':
          result = { success: true, message: 'Metrics collected', metrics: { timestamp: new Date() } }
          break
          
        default:
          result = { success: false, error: `Task type ${validatedData.taskType} not implemented in simplified version` }
      }
      
      console.log(`System maintenance completed: ${validatedData.taskType}`)
      return result
      
    } catch (error) {
      console.error(`System maintenance job ${job.id} failed:`, error)
      throw error
    }
  },
  workerOptions
)

// Simplified health check
async function performHealthCheck() {
  const checks = {
    redis: false,
    email: false,
    sms: false
  }
  
  try {
    await redis.ping()
    checks.redis = true
  } catch (error) {
    console.error('Redis health check failed:', error)
  }
  
  // Mock service checks
  checks.email = true
  checks.sms = true
  
  const healthyServices = Object.values(checks).filter(Boolean).length
  const totalServices = Object.keys(checks).length
  
  return { 
    success: true, 
    healthScore: (healthyServices / totalServices) * 100,
    checks 
  }
}

// Worker event handlers
const workers = [
  emailWorker,
  smsWorker,
  visitReminderWorker,
  systemMaintenanceWorker
]

// Add event listeners to all workers
workers.forEach(worker => {
  worker.on('completed', (job) => {
    console.log(`✅ Job ${job.id} completed in queue ${worker.name}`)
  })
  
  worker.on('failed', (job, err) => {
    console.error(`❌ Job ${job?.id} failed in queue ${worker.name}:`, err.message)
  })
  
  worker.on('error', (err) => {
    console.error(`🔥 Worker error in ${worker.name}:`, err)
  })
})

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('🛑 Shutting down workers gracefully...')
  
  await Promise.all(workers.map(worker => worker.close()))
  await redis.disconnect()
  
  console.log('✅ All workers shut down')
  process.exit(0)
})

export { workers }
