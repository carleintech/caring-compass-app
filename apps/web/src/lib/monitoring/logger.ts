// apps/web/src/lib/monitoring/logger.ts
import winston from 'winston'
import { Logtail } from '@logtail/node'
import { LogtailTransport } from '@logtail/winston'

// Initialize Logtail for centralized logging
const logtail = new Logtail(process.env.LOGTAIL_TOKEN || '')

// Create Winston logger with multiple transports
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json(),
    winston.format.metadata({ fillExcept: ['message', 'level', 'timestamp'] })
  ),
  defaultMeta: {
    service: 'caring-compass',
    environment: process.env.NODE_ENV,
    version: process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7)
  },
  transports: [
    // Console transport for development
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    }),
    
    // Logtail transport for production
    ...(process.env.LOGTAIL_TOKEN ? [new LogtailTransport(logtail)] : []),
    
    // File transport for persistent local logging
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5
    }),
    new winston.transports.File({
      filename: 'logs/combined.log',
      maxsize: 5242880, // 5MB
      maxFiles: 10
    })
  ]
})

// Custom logging methods for different event types
export const careLogger = {
  // Authentication events
  auth: {
    login: (userId: string, email: string, role: string) => {
      logger.info('User login', {
        event: 'auth.login',
        userId,
        email,
        role,
        timestamp: new Date().toISOString()
      })
    },
    logout: (userId: string) => {
      logger.info('User logout', {
        event: 'auth.logout',
        userId,
        timestamp: new Date().toISOString()
      })
    },
    failed: (email: string, reason: string, ip?: string) => {
      logger.warn('Login failed', {
        event: 'auth.failed',
        email,
        reason,
        ip,
        timestamp: new Date().toISOString()
      })
    }
  },

  // Care events
  care: {
    visitStart: (visitId: string, caregiverId: string, clientId: string, location: any) => {
      logger.info('Visit started', {
        event: 'care.visit_start',
        visitId,
        caregiverId,
        clientId,
        location,
        timestamp: new Date().toISOString()
      })
    },
    visitEnd: (visitId: string, duration: number, tasks: any[]) => {
      logger.info('Visit completed', {
        event: 'care.visit_end',
        visitId,
        duration,
        tasksCompleted: tasks.length,
        timestamp: new Date().toISOString()
      })
    },
    incident: (visitId: string, type: string, description: string, severity: string) => {
      logger.warn('Care incident', {
        event: 'care.incident',
        visitId,
        type,
        description,
        severity,
        timestamp: new Date().toISOString()
      })
    }
  },

  // Business events
  business: {
    clientSignup: (clientId: string, serviceType: string, location: string) => {
      logger.info('New client signup', {
        event: 'business.client_signup',
        clientId,
        serviceType,
        location,
        timestamp: new Date().toISOString()
      })
    },
    caregiverApplication: (applicationId: string, location: string, experience: string) => {
      logger.info('Caregiver application', {
        event: 'business.caregiver_application',
        applicationId,
        location,
        experience,
        timestamp: new Date().toISOString()
      })
    },
    paymentProcessed: (invoiceId: string, amount: number, method: string) => {
      logger.info('Payment processed', {
        event: 'business.payment_processed',
        invoiceId,
        amount,
        method,
        timestamp: new Date().toISOString()
      })
    }
  },

  // System events
  system: {
    error: (error: Error, context?: any) => {
      logger.error('System error', {
        event: 'system.error',
        error: {
          message: error.message,
          stack: error.stack,
          name: error.name
        },
        context,
        timestamp: new Date().toISOString()
      })
    },
    performance: (operation: string, duration: number, metadata?: any) => {
      logger.info('Performance metric', {
        event: 'system.performance',
        operation,
        duration,
        metadata,
        timestamp: new Date().toISOString()
      })
    },
    healthCheck: (service: string, status: 'healthy' | 'unhealthy', details?: any) => {
      const level = status === 'healthy' ? 'info' : 'error'
      logger.log(level, 'Health check', {
        event: 'system.health_check',
        service,
        status,
        details,
        timestamp: new Date().toISOString()
      })
    }
  },

  // Security events
  security: {
    accessDenied: (userId: string, resource: string, action: string) => {
      logger.warn('Access denied', {
        event: 'security.access_denied',
        userId,
        resource,
        action,
        timestamp: new Date().toISOString()
      })
    },
    suspiciousActivity: (userId: string, activity: string, details: any) => {
      logger.warn('Suspicious activity', {
        event: 'security.suspicious_activity',
        userId,
        activity,
        details,
        timestamp: new Date().toISOString()
      })
    },
    dataExport: (userId: string, dataType: string, recordCount: number) => {
      logger.info('Data export', {
        event: 'security.data_export',
        userId,
        dataType,
        recordCount,
        timestamp: new Date().toISOString()
      })
    }
  }
}

export default logger