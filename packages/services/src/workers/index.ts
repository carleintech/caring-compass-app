#!/usr/bin/env node

import * as dotenv from 'dotenv'
import { ServicesConfig, ServicesHealthChecker, notificationScheduler } from '../index'
import {
  emailWorker,
  smsWorker,
  visitReminderWorker,
  credentialAlertWorker,
  invoiceGenerationWorker,
  paymentProcessingWorker,
  documentProcessingWorker,
  matchingEngineWorker,
  auditLogWorker,
  systemMaintenanceWorker
} from './processors'

// Load environment variables
dotenv.config()

// Worker manager class
class WorkerManager {
  private workers = [
    emailWorker,
    smsWorker,
    visitReminderWorker,
    credentialAlertWorker,
    invoiceGenerationWorker,
    paymentProcessingWorker,
    documentProcessingWorker,
    matchingEngineWorker,
    auditLogWorker,
    systemMaintenanceWorker
  ]

  private isShuttingDown = false

  async start(): Promise<void> {
    console.log('🚀 Starting Caring Compass Background Workers...')
    console.log(`📅 Timestamp: ${new Date().toISOString()}`)
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`)
    console.log(`📦 Worker Process ID: ${process.pid}`)

    // Validate configuration
    console.log('\n🔧 Validating configuration...')
    const configValidation = ServicesConfig.validate()
    
    if (configValidation.errors.length > 0) {
      console.error('❌ Configuration errors found:')
      configValidation.errors.forEach(error => console.error(`   - ${error}`))
      process.exit(1)
    }

    if (configValidation.warnings.length > 0) {
      console.warn('⚠️ Configuration warnings:')
      configValidation.warnings.forEach(warning => console.warn(`   - ${warning}`))
    }

    console.log('✅ Configuration validated')

    // Check service health
    console.log('\n🏥 Checking service health...')
    const healthCheck = await ServicesHealthChecker.checkAllServices()
    
    console.log(`Overall health: ${this.getHealthEmoji(healthCheck.overall)} ${healthCheck.overall.toUpperCase()}`)
    
    Object.entries(healthCheck.services).forEach(([service, status]) => {
      const emoji = status.status === 'healthy' ? '✅' : '❌'
      const responseTime = status.responseTime ? ` (${status.responseTime}ms)` : ''
      console.log(`   ${emoji} ${service}: ${status.status}${responseTime}`)
      if (status.message) {
        console.log(`      ${status.message}`)
      }
    })

    if (healthCheck.overall === 'unhealthy') {
      console.error('❌ System health check failed. Exiting...')
      process.exit(1)
    }

    // Start notification scheduler
    console.log('\n📅 Starting notification scheduler...')
    notificationScheduler.start()
    
    const schedulerStatus = notificationScheduler.getStatus()
    console.log(`✅ Scheduler started with ${schedulerStatus.scheduledTasks.length} tasks:`)
    schedulerStatus.scheduledTasks.forEach(task => {
      const nextRun = schedulerStatus.nextRunTimes[task]
      console.log(`   📝 ${task}: ${nextRun ? nextRun.toLocaleString() : 'No next run scheduled'}`)
    })

    // Start workers
    console.log('\n👷 Starting job workers...')
    this.workers.forEach(worker => {
      console.log(`✅ Started worker: ${worker.name}`)
    })

    // Log initial queue status
    console.log('\n📊 Initial queue status:')
    const queueMetrics = await ServicesHealthChecker.getQueueMetrics()
    if ('error' in queueMetrics) {
      console.error(`❌ Failed to get queue metrics: ${queueMetrics.error}`)
    } else {
      queueMetrics.queues.forEach(queue => {
        const total = queue.waiting + queue.active + queue.completed + queue.failed + queue.delayed
        console.log(`   📋 ${queue.name}: ${total} total jobs (${queue.waiting} waiting, ${queue.active} active, ${queue.failed} failed)`)
      })
    }

    // Setup graceful shutdown
    this.setupGracefulShutdown()

    console.log('\n🎉 All workers started successfully!')
    console.log('📊 Worker metrics will be logged every 5 minutes')
    console.log('🛑 Press Ctrl+C to shutdown gracefully')

    // Start metrics logging
    this.startMetricsLogging()

    // Keep the process alive
    process.stdin.resume()
  }

  private setupGracefulShutdown(): void {
    const shutdown = async (signal: string) => {
      if (this.isShuttingDown) {
        console.log('⚡ Force shutdown initiated')
        process.exit(1)
      }

      this.isShuttingDown = true
      console.log(`\n🛑 Received ${signal}. Starting graceful shutdown...`)

      try {
        // Stop accepting new jobs
        console.log('📝 Stopping job workers...')
        await Promise.all(this.workers.map(async worker => {
          console.log(`   ⏹️ Stopping ${worker.name}...`)
          await worker.close()
          console.log(`   ✅ Stopped ${worker.name}`)
        }))

        // Stop scheduler
        console.log('📅 Stopping notification scheduler...')
        notificationScheduler.stop()
        console.log('✅ Notification scheduler stopped')

        // Log final metrics
        console.log('\n📊 Final queue metrics:')
        const finalMetrics = await ServicesHealthChecker.getQueueMetrics()
        if ('error' in finalMetrics) {
          console.error(`❌ Failed to get final metrics: ${finalMetrics.error}`)
        } else {
          finalMetrics.queues.forEach(queue => {
            const total = queue.waiting + queue.active + queue.completed + queue.failed + queue.delayed
            console.log(`   📋 ${queue.name}: ${total} total jobs (${queue.waiting} waiting, ${queue.active} active)`)
          })
        }

        console.log('✅ Graceful shutdown completed')
        process.exit(0)

      } catch (error) {
        console.error('❌ Error during shutdown:', error)
        process.exit(1)
      }
    }

    // Handle various shutdown signals
    process.on('SIGTERM', () => shutdown('SIGTERM'))
    process.on('SIGINT', () => shutdown('SIGINT'))
    process.on('SIGQUIT', () => shutdown('SIGQUIT'))

    // Handle uncaught exceptions
    process.on('uncaughtException', (error) => {
      console.error('💥 Uncaught Exception:', error)
      if (!this.isShuttingDown) {
        shutdown('UNCAUGHT_EXCEPTION')
      }
    })

    process.on('unhandledRejection', (reason, promise) => {
      console.error('💥 Unhandled Promise Rejection at:', promise, 'reason:', reason)
      if (!this.isShuttingDown) {
        shutdown('UNHANDLED_REJECTION')
      }
    })
  }

  private startMetricsLogging(): void {
    const logMetrics = async () => {
      try {
        const metrics = await ServicesHealthChecker.getQueueMetrics()
        
        if ('error' in metrics) {
          console.error(`📊 Metrics collection failed: ${metrics.error}`)
          return
        }

        console.log(`\n📊 Queue Metrics - ${new Date().toLocaleTimeString()}`)
        
        let totalJobs = 0
        let totalWaiting = 0
        let totalActive = 0
        let totalFailed = 0

        metrics.queues.forEach(queue => {
          const queueTotal = queue.waiting + queue.active + queue.completed + queue.failed + queue.delayed
          totalJobs += queueTotal
          totalWaiting += queue.waiting
          totalActive += queue.active
          totalFailed += queue.failed

          if (queueTotal > 0) {
            console.log(`   📋 ${queue.name}: ${queueTotal} total (W:${queue.waiting} A:${queue.active} F:${queue.failed})`)
          }
        })

        console.log(`   📈 Totals: ${totalJobs} jobs (${totalWaiting} waiting, ${totalActive} active, ${totalFailed} failed)`)
        console.log(`   🏥 Redis: ${metrics.totals.healthy ? '✅ Healthy' : '❌ Unhealthy'}`)

        // Log memory usage
        const memUsage = process.memoryUsage()
        const memMB = {
          rss: Math.round(memUsage.rss / 1024 / 1024),
          heapTotal: Math.round(memUsage.heapTotal / 1024 / 1024),
          heapUsed: Math.round(memUsage.heapUsed / 1024 / 1024),
          external: Math.round(memUsage.external / 1024 / 1024)
        }
        console.log(`   💾 Memory: ${memMB.heapUsed}/${memMB.heapTotal}MB heap, ${memMB.rss}MB RSS`)

      } catch (error) {
        console.error('📊 Error collecting metrics:', error)
      }
    }

    // Log metrics every 5 minutes
    setInterval(logMetrics, 5 * 60 * 1000)

    // Log initial metrics after 30 seconds
    setTimeout(logMetrics, 30000)
  }

  private getHealthEmoji(health: string): string {
    switch (health) {
      case 'healthy': return '💚'
      case 'degraded': return '💛'
      case 'unhealthy': return '❤️'
      default: return '❓'
    }
  }
}

// CLI interface for worker management
class WorkerCLI {
  static async handleCommand(command: string): Promise<void> {
    switch (command) {
      case 'start':
        const manager = new WorkerManager()
        await manager.start()
        break

      case 'health':
        console.log('🏥 Checking service health...')
        const health = await ServicesHealthChecker.checkAllServices()
        console.log(`Overall: ${health.overall}`)
        Object.entries(health.services).forEach(([service, status]) => {
          console.log(`${service}: ${status.status}`)
        })
        process.exit(health.overall === 'healthy' ? 0 : 1)

      case 'queues':
        console.log('📊 Queue status:')
        const metrics = await ServicesHealthChecker.getQueueMetrics()
        if ('error' in metrics) {
          console.error(`Error: ${metrics.error}`)
          process.exit(1)
        } else {
          metrics.queues.forEach(queue => {
            console.log(`${queue.name}: ${queue.waiting + queue.active + queue.completed + queue.failed + queue.delayed} jobs`)
          })
        }
        process.exit(0)

      case 'config':
        console.log('🔧 Configuration:')
        const config = ServicesConfig.getConfiguration()
        console.log(JSON.stringify(config, null, 2))
        process.exit(0)

      case 'validate':
        console.log('✅ Validating configuration...')
        const validation = ServicesConfig.validate()
        if (validation.valid) {
          console.log('✅ Configuration is valid')
          validation.warnings.forEach(warning => console.warn(`⚠️ ${warning}`))
        } else {
          console.log('❌ Configuration is invalid')
          validation.errors.forEach(error => console.error(`❌ ${error}`))
        }
        process.exit(validation.valid ? 0 : 1)

      default:
        console.log(`
🔧 Caring Compass Worker Manager

Usage: npm run worker:dev [command]

Commands:
  start     Start all background workers (default)
  health    Check service health
  queues    Show queue status
  config    Show configuration
  validate  Validate configuration

Examples:
  npm run worker:dev start
  npm run worker:dev health
  npm run worker:dev queues
        `)
        process.exit(0)
    }
  }
}

// Main execution
async function main() {
  const command = process.argv[2] || 'start'
  
  try {
    await WorkerCLI.handleCommand(command)
  } catch (error) {
    console.error('💥 Fatal error:', error)
    process.exit(1)
  }
}

// Only run if this file is executed directly
if (require.main === module) {
  main()
}

export { WorkerManager, WorkerCLI }
export default WorkerManager