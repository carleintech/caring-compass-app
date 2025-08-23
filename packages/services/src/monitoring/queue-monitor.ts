import { Queue, Worker } from 'bullmq'
import { redis, QUEUES } from '../queue/redis'
import { logger } from '../utils/logger'

export interface QueueMetrics {
  name: string
  waiting: number
  active: number
  completed: number
  failed: number
  delayed: number
  paused: boolean
  health: 'healthy' | 'degraded' | 'unhealthy'
}

export interface WorkerMetrics {
  name: string
  isRunning: boolean
  processed: number
  failed: number
  concurrency: number
  lastJobTime?: Date
  health: 'healthy' | 'degraded' | 'unhealthy'
}

export class QueueMonitor {
  private queues: Map<string, Queue> = new Map()
  private workers: Map<string, Worker> = new Map()

  constructor() {
    this.initializeQueues()
  }

  private initializeQueues() {
    Object.values(QUEUES).forEach(queueName => {
      const queue = new Queue(queueName, { connection: redis })
      this.queues.set(queueName, queue)
    })
  }

  registerWorker(name: string, worker: Worker) {
    this.workers.set(name, worker)
  }

  async getQueueMetrics(): Promise<QueueMetrics[]> {
    const metrics: QueueMetrics[] = []

    for (const [name, queue] of this.queues) {
      try {
        const [
          waiting,
          active,
          completed,
          failed,
          delayed,
          paused
        ] = await Promise.all([
          queue.getWaitingCount(),
          queue.getActiveCount(),
          queue.getCompletedCount(),
          queue.getFailedCount(),
          queue.getDelayedCount(),
          queue.isPaused()
        ])

        const health = this.calculateQueueHealth(waiting, failed, active)
        
        metrics.push({
          name,
          waiting,
          active,
          completed,
          failed,
          delayed,
          paused,
          health
        })
      } catch (error) {
        logger.error(`Failed to get metrics for queue ${name}:`, error)
        metrics.push({
          name,
          waiting: 0,
          active: 0,
          completed: 0,
          failed: 0,
          delayed: 0,
          paused: false,
          health: 'unhealthy'
        })
      }
    }

    return metrics
  }

  async getWorkerMetrics(): Promise<WorkerMetrics[]> {
    const metrics: WorkerMetrics[] = []

    for (const [name, worker] of this.workers) {
      try {
        const isRunning = await worker.isRunning()
        const stats = await worker.getStats()
        
        metrics.push({
          name,
          isRunning,
          processed: stats.processed || 0,
          failed: stats.failed || 0,
          concurrency: worker.opts.concurrency || 1,
          lastJobTime: stats.lastJob?.finishedOn ? new Date(stats.lastJob.finishedOn) : undefined,
          health: this.calculateWorkerHealth(isRunning, stats.failed || 0, stats.processed || 0)
        })
      } catch (error) {
        logger.error(`Failed to get metrics for worker ${name}:`, error)
        metrics.push({
          name,
          isRunning: false,
          processed: 0,
          failed: 0,
          concurrency: 1,
          health: 'unhealthy'
        })
      }
    }

    return metrics
  }

  private calculateQueueHealth(waiting: number, failed: number, active: number): 'healthy' | 'degraded' | 'unhealthy' {
    if (failed > 50) return 'unhealthy'
    if (waiting > 1000) return 'degraded'
    if (active === 0 && waiting > 100) return 'degraded'
    return 'healthy'
  }

  private calculateWorkerHealth(isRunning: boolean, failed: number, processed: number): 'healthy' | 'degraded' | 'unhealthy' {
    if (!isRunning) return 'unhealthy'
    if (failed > processed * 0.1 && processed > 10) return 'degraded'
    return 'healthy'
  }

  async getOverallHealth(): Promise<{
    status: 'healthy' | 'degraded' | 'unhealthy'
    queueMetrics: QueueMetrics[]
    workerMetrics: WorkerMetrics[]
    timestamp: Date
  }> {
    const [queueMetrics, workerMetrics] = await Promise.all([
      this.getQueueMetrics(),
      this.getWorkerMetrics()
    ])

    const unhealthyQueues = queueMetrics.filter(q => q.health === 'unhealthy')
    const unhealthyWorkers = workerMetrics.filter(w => w.health === 'unhealthy')
    const degradedQueues = queueMetrics.filter(q => q.health === 'degraded')
    const degradedWorkers = workerMetrics.filter(w => w.health === 'degraded')

    let status: 'healthy' | 'degraded' | 'unhealthy' = 'healthy'
    
    if (unhealthyQueues.length > 0 || unhealthyWorkers.length > 0) {
      status = 'unhealthy'
    } else if (degradedQueues.length > 0 || degradedWorkers.length > 0) {
      status = 'degraded'
    }

    return {
      status,
      queueMetrics,
      workerMetrics,
      timestamp: new Date()
    }
  }

  async getFailedJobs(queueName: string, limit: number = 50) {
    const queue = this.queues.get(queueName)
    if (!queue) return []

    try {
      const failedJobs = await queue.getFailed(limit)
      return failedJobs.map(job => ({
        id: job.id,
        name: job.name,
        data: job.data,
        failedReason: job.failedReason,
        failedAt: job.failedAt ? new Date(job.failedAt) : undefined,
        attemptsMade: job.attemptsMade,
        maxAttempts: job.opts?.attempts || 1
      }))
    } catch (error) {
      logger.error(`Failed to get failed jobs for queue ${queueName}:`, error)
      return []
    }
  }

  async retryFailedJob(queueName: string, jobId: string) {
    const queue = this.queues.get(queueName)
    if (!queue) return false

    try {
      const job = await queue.getJob(jobId)
      if (job && job.failedReason) {
        await job.retry()
        return true
      }
      return false
    } catch (error) {
      logger.error(`Failed to retry job ${jobId} in queue ${queueName}:`, error)
      return false
    }
  }

  async pauseQueue(queueName: string) {
    const queue = this.queues.get(queueName)
    if (!queue) return false

    try {
      await queue.pause()
      return true
    } catch (error) {
      logger.error(`Failed to pause queue ${queueName}:`, error)
      return false
    }
  }

  async resumeQueue(queueName: string) {
    const queue = this.queues.get(queueName)
    if (!queue) return false

    try {
      await queue.resume()
      return true
    } catch (error) {
      logger.error(`Failed to resume queue ${queueName}:`, error)
      return false
    }
  }

  async cleanQueue(queueName: string, grace = 5000) {
    const queue = this.queues.get(queueName)
    if (!queue) return false

    try {
      const [completed, failed] = await Promise.all([
        queue.clean(grace, 1000, 'completed'),
        queue.clean(grace, 1000, 'failed')
      ])

      logger.info(`Cleaned ${completed.length} completed and ${failed.length} failed jobs from ${queueName}`)
      return true
    } catch (error) {
      logger.error(`Failed to clean queue ${queueName}:`, error)
      return false
    }
  }

  async retryFailedJobs(queueName: string) {
    const queue = this.queues.get(queueName)
    if (!queue) return false

    try {
      const failedJobs = await queue.getFailed()
      const retryPromises = failedJobs.map(job => job.retry())
      
      await Promise.all(retryPromises)
      logger.info(`Retried ${failedJobs.length} failed jobs in ${queueName}`)
      return true
    } catch (error) {
      logger.error(`Failed to retry failed jobs in queue ${queueName}:`, error)
      return false
    }
  }

  async getJobDetails(queueName: string, jobId: string) {
    const queue = this.queues.get(queueName)
    if (!queue) return null

    try {
      const job = await queue.getJob(jobId)
      if (!job) return null

      return {
        id: job.id,
        name: job.name,
        data: job.data,
        opts: job.opts,
        progress: job.progress,
        delay: job.delay,
        timestamp: job.timestamp,
        attemptsMade: job.attemptsMade,
        failedReason: job.failedReason,
        stacktrace: job.stacktrace,
        returnvalue: job.returnvalue,
        finishedOn: job.finishedOn,
        processedOn: job.processedOn
      }
    } catch (error) {
      logger.error(`Failed to get job details ${jobId} from queue ${queueName}:`, error)
      return null
    }
  }

  async close() {
    const closePromises = [
      ...Array.from(this.queues.values()).map(queue => queue.close()),
      ...Array.from(this.workers.values()).map(worker => worker.close())
    ]
    
    try {
      await Promise.all(closePromises)
      logger.info('All queues and workers closed')
      return true
    } catch (error) {
      logger.error('Failed to close queues and workers:', error)
      return false
    }
  }
}

export const queueMonitor = new QueueMonitor()
