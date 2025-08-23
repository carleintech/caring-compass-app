import Redis from 'ioredis'

export const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD,
  maxRetriesPerRequest: 3,
  enableReadyCheck: false
})

export const QUEUES = {
  EMAIL: 'email-queue',
  NOTIFICATION: 'notification-queue',
  REPORT: 'report-queue',
  SYNC: 'sync-queue',
  CLEANUP: 'cleanup-queue'
} as const
