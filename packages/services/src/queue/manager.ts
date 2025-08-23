import { Queue, Job, JobsOptions } from 'bullmq'
import { redis } from './redis'
import {
  EmailJobData,
  SmsJobData,
  PaymentJobData,
  FileJobData,
  NotificationJobData
} from '../jobs/types'

// Queue names
export const QUEUES = {
  EMAIL_NOTIFICATIONS: 'email_notifications',
  SMS_NOTIFICATIONS: 'sms_notifications',
  PAYMENT_PROCESSING: 'payment_processing',
  FILE_PROCESSING: 'file_processing',
  VISIT_REMINDERS: 'visit_reminders',
  INVOICE_GENERATION: 'invoice_generation'
} as const

export type QueueName = typeof QUEUES[keyof typeof QUEUES]
export type JobName = string
export type JobData = EmailJobData | SmsJobData | PaymentJobData | FileJobData | NotificationJobData

// Queue manager class
export class QueueManager {
  private static queues: Map<QueueName, Queue> = new Map()

  static getQueue(name: QueueName): Queue {
    if (!this.queues.has(name)) {
      this.queues.set(name, new Queue(name, { connection: redis }))
    }
    return this.queues.get(name)!
  }

  static async addJob(
    queueName: QueueName, 
    jobName: JobName, 
    data: JobData, 
    options?: JobsOptions
  ): Promise<Job> {
    const queue = this.getQueue(queueName)
    return queue.add(jobName, data, options)
  }

  static async getJob(queueName: QueueName, jobId: string): Promise<Job | null> {
    const queue = this.getQueue(queueName)
    return queue.getJob(jobId)
  }

  static async close(): Promise<void> {
    for (const queue of this.queues.values()) {
      await queue.close()
    }
  }
}
