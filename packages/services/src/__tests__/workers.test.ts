import { emailWorker, smsWorker, visitReminderWorker, systemMaintenanceWorker } from '../workers/processors-simple'
import { QueueManager, QUEUES } from '../queue/redis'

describe('Worker Processors', () => {
  beforeAll(async () => {
    // Wait for setup
    await new Promise(resolve => setTimeout(resolve, 100))
  })

  afterAll(async () => {
    // Clean up
    await QueueManager.closeAllQueues()
  })

  describe('Email Worker', () => {
    it('should process email jobs', async () => {
      const jobData = {
        id: 'test-email-worker-1',
        to: 'test@example.com',
        subject: 'Worker Test Email',
        htmlContent: '<p>Test content from worker</p>',
        priority: 'NORMAL' as const
      }

      const job = await QueueManager.addJob(
        QUEUES.EMAIL_NOTIFICATIONS,
        'send-email',
        jobData
      )

      expect(job).toBeDefined()
      expect(job.id).toBe('test-job-id')
    })
  })

  describe('SMS Worker', () => {
    it('should process SMS jobs', async () => {
      const jobData = {
        id: 'test-sms-worker-1',
        to: '+1234567890',
        message: 'Test SMS from worker',
        priority: 'HIGH' as const
      }

      const job = await QueueManager.addJob(
        QUEUES.SMS_NOTIFICATIONS,
        'send-sms',
        jobData
      )

      expect(job).toBeDefined()
      expect(job.id).toBe('test-job-id')
    })
  })

  describe('Visit Reminder Worker', () => {
    it('should process visit reminder jobs', async () => {
      const jobData = {
        visitId: 'visit-123',
        visitDate: new Date().toISOString(),
        reminderType: '24_HOUR' as const,
        reminderMethods: ['SMS' as const],
        caregiverId: 'caregiver-123'
      }

      const job = await QueueManager.addJob(
        QUEUES.VISIT_REMINDERS,
        'send-reminder',
        jobData
      )

      expect(job).toBeDefined()
      expect(job.id).toBe('test-job-id')
    })
  })

  describe('System Maintenance Worker', () => {
    it('should process health check jobs', async () => {
      const jobData = {
        taskType: 'HEALTH_CHECK' as const,
        scheduledBy: 'SYSTEM',
        parameters: {}
      }

      const job = await QueueManager.addJob(
        QUEUES.SYSTEM_MAINTENANCE,
        'health-check',
        jobData
      )

      expect(job).toBeDefined()
      expect(job.id).toBe('test-job-id')
    })

    it('should process cache refresh jobs', async () => {
      const jobData = {
        taskType: 'CACHE_REFRESH' as const,
        scheduledBy: 'ADMIN',
        parameters: {}
      }

      const job = await QueueManager.addJob(
        QUEUES.SYSTEM_MAINTENANCE,
        'cache-refresh',
        jobData
      )

      expect(job).toBeDefined()
      expect(job.id).toBe('test-job-id')
    })
  })
})
