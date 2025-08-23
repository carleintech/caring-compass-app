import { redis } from '../queue/redis'
import { QueueManager } from '../queue/manager'
import { EmailJobData } from '../jobs/types'

export async function checkRedisHealth(): Promise<boolean> {
  try {
    const ping = await redis.ping()
    return ping === 'PONG'
  } catch (error) {
    console.error('Redis health check failed:', error)
    return false
  }
}

export async function checkQueueHealth(): Promise<boolean> {
  try {
    // Try to add and remove a test job to verify queue functionality
    const queue = QueueManager.getQueue('health_check')
    const testJob: EmailJobData = {
      id: 'health-check',
      type: 'email',
      timestamp: new Date(),
      to: 'test@example.com',
      subject: 'Health Check',
      html: 'Health check email'
    }
    
    const job = await QueueManager.addJob('health_check', 'test', testJob)
    await job.remove()
    
    return true
  } catch (error) {
    console.error('Queue health check failed:', error)
    return false
  }
}
