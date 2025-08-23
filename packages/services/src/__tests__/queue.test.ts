import { QueueManager, QUEUES } from '../queue/redis'

describe('Queue System', () => {
  beforeAll(async () => {
    // Wait a bit for mocks to be set up
    await new Promise(resolve => setTimeout(resolve, 100))
  })

  afterAll(async () => {
    // Clean up
    await QueueManager.closeAllQueues()
  })

  describe('QueueManager', () => {
    it('should add a job to a queue', async () => {
      const jobData = {
        id: 'test-email-1',
        to: 'test@example.com',
        subject: 'Test Email',
        htmlContent: '<p>Test content</p>',
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

    it('should get queue stats', async () => {
      const stats = await QueueManager.getQueueStats(QUEUES.EMAIL_NOTIFICATIONS)

      expect(stats).toBeDefined()
      expect(stats.name).toBe(QUEUES.EMAIL_NOTIFICATIONS)
      expect(typeof stats.waiting).toBe('number')
      expect(typeof stats.active).toBe('number')
      expect(typeof stats.completed).toBe('number')
      expect(typeof stats.failed).toBe('number')
      expect(typeof stats.delayed).toBe('number')
    })

    it('should get all queue stats', async () => {
      const allStats = await QueueManager.getAllQueueStats()

      expect(Array.isArray(allStats)).toBe(true)
      expect(allStats.length).toBeGreaterThan(0)
    })

    it('should add a delayed job', async () => {
      const jobData = {
        id: 'test-sms-1',
        to: '+1234567890',
        message: 'Test SMS',
        priority: 'HIGH' as const
      }

      const job = await QueueManager.addDelayedJob(
        QUEUES.SMS_NOTIFICATIONS,
        'send-sms',
        jobData,
        5000 // 5 seconds delay
      )

      expect(job).toBeDefined()
      expect(job.id).toBe('test-job-id')
    })

    it('should add a scheduled job', async () => {
      const jobData = {
        visitId: 'visit-123',
        visitDate: new Date().toISOString(),
        reminderType: '24_HOUR' as const,
        reminderMethods: ['EMAIL' as const],
        caregiverId: 'caregiver-123'
      }

      const scheduleTime = new Date(Date.now() + 60000) // 1 minute from now

      const job = await QueueManager.addScheduledJob(
        QUEUES.VISIT_REMINDERS,
        'send-reminder',
        jobData,
        scheduleTime
      )

      expect(job).toBeDefined()
      expect(job.id).toBe('test-job-id')
    })

    it('should add a recurring job', async () => {
      const jobData = {
        taskType: 'HEALTH_CHECK' as const,
        scheduledBy: 'SYSTEM',
        parameters: {}
      }

      const job = await QueueManager.addRecurringJob(
        QUEUES.SYSTEM_MAINTENANCE,
        'health-check',
        jobData,
        '0 */6 * * *' // Every 6 hours
      )

      expect(job).toBeDefined()
      expect(job.id).toBe('test-job-id')
    })
  })

  describe('Queue Health', () => {
    it('should check Redis health', async () => {
      const { checkRedisHealth } = await import('../queue/redis')
      const isHealthy = await checkRedisHealth()
      expect(typeof isHealthy).toBe('boolean')
    })
  })
})
