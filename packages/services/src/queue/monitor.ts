import { Queue, QueueScheduler, Metrics } from 'bullmq'
import { redis } from './redis'
import { QUEUES, QueueName } from './manager'

export interface QueueMetrics {
  waiting: number
  active: number
  completed: number
  failed: number
  delayed: number
  paused: number
}

export interface JobMetrics {
  processedCount: number
  failedCount: number
  retriesCount: number
  completionRate: number
}

// Queue monitor class
export class QueueMonitor {
  private static schedulers: Map<QueueName, QueueScheduler> = new Map()

  static initialize(): void {
    Object.values(QUEUES).forEach(queueName => {
      if (!this.schedulers.has(queueName)) {
        this.schedulers.set(
          queueName, 
          new QueueScheduler(queueName, { connection: redis })
        )
      }
    })
  }

  static async getMetrics(): Promise<Record<QueueName, QueueMetrics>> {
    const metrics: Partial<Record<QueueName, QueueMetrics>> = {}

    for (const queueName of Object.values(QUEUES)) {
      const queue = new Queue(queueName, { connection: redis })
      const counts = await queue.getJobCounts(
        'waiting',
        'active',
        'completed',
        'failed',
        'delayed',
        'paused'
      )

      metrics[queueName] = {
        waiting: counts.waiting,
        active: counts.active,
        completed: counts.completed,
        failed: counts.failed,
        delayed: counts.delayed,
        paused: counts.paused
      }

      await queue.close()
    }

    return metrics as Record<QueueName, QueueMetrics>
  }

  static async getJobMetrics(queueName: QueueName): Promise<JobMetrics> {
    const queue = new Queue(queueName, { connection: redis })
    const metrics = await queue.getMetrics()

    const result = {
      processedCount: metrics.processedCount,
      failedCount: metrics.failedCount,
      retriesCount: metrics.retriesCount,
      completionRate: metrics.processedCount > 0 
        ? (metrics.processedCount - metrics.failedCount) / metrics.processedCount 
        : 0
    }

    await queue.close()
    return result
  }

  static async close(): Promise<void> {
    for (const scheduler of this.schedulers.values()) {
      await scheduler.close()
    }
  }
}
