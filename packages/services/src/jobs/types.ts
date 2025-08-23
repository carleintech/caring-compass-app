import { z } from 'zod'

// Base job interface
export interface BaseJobData {
  id: string
  userId?: string
  timestamp: Date
  metadata?: Record<string, any>
}

// Email notification job data
export const EmailJobSchema = z.object({
  id: z.string(),
  to: z.string().email(),
  from: z.string().email().optional(),
  subject: z.string(),
  templateId: z.string().optional(),
  templateData: z.record(z.any()).optional(),
  htmlContent: z.string().optional(),
  textContent: z.string().optional(),
  attachments: z.array(z.object({
    filename: z.string(),
    content: z.string(), // Base64 content
    contentType: z.string()
  })).optional(),
  priority: z.enum(['LOW', 'NORMAL', 'HIGH']).default('NORMAL'),
  metadata: z.record(z.any()).optional()
})

export type EmailJobData = z.infer<typeof EmailJobSchema>

// Payment job data
export const PaymentJobSchema = z.object({
  id: z.string(),
  amount: z.number(),
  currency: z.string(),
  method: z.enum(['STRIPE', 'ACH', 'CHECK', 'CASH']),
  status: z.enum(['PENDING', 'PROCESSING', 'COMPLETED', 'FAILED']),
  invoiceId: z.string(),
  clientId: z.string(),
  metadata: z.record(z.any()).optional()
})

export type PaymentJobData = z.infer<typeof PaymentJobSchema>

export interface PaymentJobResult {
  success: boolean
  transactionId?: string
  error?: string
}

// File job data
export const FileJobSchema = z.object({
  id: z.string(),
  path: z.string(),
  operation: z.enum(['UPLOAD', 'DOWNLOAD', 'DELETE']),
  metadata: z.record(z.any()).optional()
})

export type FileJobData = z.infer<typeof FileJobSchema>

export interface FileJobResult {
  success: boolean
  url?: string
  error?: string
}

// Notification job data
export const NotificationJobSchema = z.object({
  id: z.string(),
  type: z.enum(['EMAIL', 'SMS', 'PUSH']),
  to: z.string(),
  subject: z.string().optional(),
  message: z.string().optional(),
  data: z.record(z.any()).optional(),
  metadata: z.record(z.any()).optional()
})

export type NotificationJobData = z.infer<typeof NotificationJobSchema>

export interface NotificationJobResult {
  success: boolean
  messageId?: string
  error?: string
}

// SMS notification job data
export const SmsJobSchema = z.object({
  id: z.string(),
  to: z.string(),
  message: z.string(),
  templateId: z.string().optional(),
  templateData: z.record(z.any()).optional(),
  priority: z.enum(['LOW', 'NORMAL', 'HIGH']).default('NORMAL'),
  metadata: z.record(z.any()).optional()
})

export type SmsJobData = z.infer<typeof SmsJobSchema>

// Visit reminder job data
export const VisitReminderJobSchema = z.object({
  id: z.string(),
  visitId: z.string(),
  clientId: z.string(),
  caregiverId: z.string().optional(),
  reminderType: z.enum(['24_HOUR', '2_HOUR', '30_MINUTE']),
  visitDate: z.string().datetime(),
  reminderMethods: z.array(z.enum(['EMAIL', 'SMS', 'PUSH'])),
  metadata: z.record(z.any()).optional()
})

export type VisitReminderJobData = z.infer<typeof VisitReminderJobSchema>

// Credential expiry alert job data
export const CredentialAlertJobSchema = z.object({
  id: z.string(),
  caregiverId: z.string(),
  credentialType: z.string(),
  credentialName: z.string(),
  expirationDate: z.string().datetime(),
  alertType: z.enum(['30_DAY', '7_DAY', '1_DAY', 'EXPIRED']),
  alertMethods: z.array(z.enum(['EMAIL', 'SMS', 'PUSH'])),
  metadata: z.record(z.any()).optional()
})

export type CredentialAlertJobData = z.infer<typeof CredentialAlertJobSchema>

// Invoice generation job data
export const InvoiceGenerationJobSchema = z.object({
  id: z.string(),
  clientId: z.string(),
  billingPeriod: z.object({
    startDate: z.string().datetime(),
    endDate: z.string().datetime()
  }),
  visitIds: z.array(z.string()).optional(),
  autoSend: z.boolean().default(false),
  dueDate: z.string().datetime().optional(),
  metadata: z.record(z.any()).optional()
})

export type InvoiceGenerationJobData = z.infer<typeof InvoiceGenerationJobSchema>

// Payment processing job data
export const PaymentProcessingJobSchema = z.object({
  id: z.string(),
  invoiceId: z.string(),
  paymentIntentId: z.string(),
  amount: z.number().positive(),
  currency: z.string().default('usd'),
  paymentMethod: z.enum(['STRIPE', 'ACH', 'CHECK']),
  metadata: z.record(z.any()).optional()
})

export type PaymentProcessingJobData = z.infer<typeof PaymentProcessingJobSchema>

// Document processing job data
export const DocumentProcessingJobSchema = z.object({
  id: z.string(),
  documentId: z.string(),
  userId: z.string(),
  documentType: z.enum(['AGREEMENT', 'CREDENTIAL', 'INVOICE', 'REPORT', 'OTHER']),
  operation: z.enum(['UPLOAD', 'CONVERT', 'SIGN', 'COMPRESS', 'VALIDATE']),
  sourceUrl: z.string().optional(),
  destinationPath: z.string().optional(),
  processingOptions: z.record(z.any()).optional(),
  metadata: z.record(z.any()).optional()
})

export type DocumentProcessingJobData = z.infer<typeof DocumentProcessingJobSchema>

// Matching engine job data
export const MatchingJobSchema = z.object({
  id: z.string(),
  visitId: z.string(),
  clientId: z.string(),
  matchingCriteria: z.object({
    requiredSkills: z.array(z.string()),
    preferredLanguages: z.array(z.string()).optional(),
    genderPreference: z.enum(['MALE', 'FEMALE']).optional(),
    maxDistance: z.number().positive(),
    visitDate: z.string().datetime(),
    visitDuration: z.number().positive(), // hours
    hourlyRateMax: z.number().positive().optional()
  }),
  autoAssign: z.boolean().default(false),
  notifyCoordinator: z.boolean().default(true),
  metadata: z.record(z.any()).optional()
})

export type MatchingJobData = z.infer<typeof MatchingJobSchema>

// Audit logging job data
export const AuditLogJobSchema = z.object({
  id: z.string(),
  userId: z.string().optional(),
  action: z.string(),
  resourceType: z.string(),
  resourceId: z.string(),
  details: z.string().optional(),
  ipAddress: z.string().optional(),
  userAgent: z.string().optional(),
  timestamp: z.string().datetime(),
  metadata: z.record(z.any()).optional()
})

export type AuditLogJobData = z.infer<typeof AuditLogJobSchema>

// System maintenance job data
export const SystemMaintenanceJobSchema = z.object({
  id: z.string(),
  taskType: z.enum([
    'DATABASE_CLEANUP',
    'FILE_CLEANUP', 
    'CACHE_REFRESH',
    'BACKUP_GENERATION',
    'HEALTH_CHECK',
    'METRICS_COLLECTION'
  ]),
  targetResource: z.string().optional(),
  parameters: z.record(z.any()).optional(),
  metadata: z.record(z.any()).optional()
})

export type SystemMaintenanceJobData = z.infer<typeof SystemMaintenanceJobSchema>

// Job result interfaces
export interface JobResult {
  success: boolean
  message?: string
  data?: any
  error?: string
  executionTime?: number
  retryable?: boolean
}

export interface EmailJobResult extends JobResult {
  messageId?: string
  deliveryStatus?: string
}

export interface SmsJobResult extends JobResult {
  messageId?: string
  deliveryStatus?: string
}

export interface PaymentJobResult extends JobResult {
  paymentId?: string
  transactionId?: string
  status?: string
}

export interface DocumentJobResult extends JobResult {
  documentUrl?: string
  processedSize?: number
  processingTime?: number
}

export interface MatchingJobResult extends JobResult {
  matches?: Array<{
    caregiverId: string
    score: number
    reasons: string[]
    distance: number
  }>
  selectedCaregiverId?: string
  autoAssigned?: boolean
}

// Job priority levels
export enum JobPriority {
  LOW = 10,
  NORMAL = 0,
  HIGH = -10,
  CRITICAL = -20
}

// Job status tracking
export enum JobStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
  RETRYING = 'retrying',
  CANCELLED = 'cancelled'
}

// Common job options
export interface JobOptions {
  priority?: JobPriority
  delay?: number // milliseconds
  attempts?: number
  backoff?: {
    type: 'fixed' | 'exponential'
    delay: number
  }
  removeOnComplete?: number
  removeOnFail?: number
  repeat?: {
    cron?: string
    every?: number
    limit?: number
    endDate?: Date
  }
}

// Job factory helpers
export class JobFactory {
  static createEmailJob(data: Omit<EmailJobData, 'id'>): EmailJobData {
    return {
      id: `email-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
      ...data
    }
  }

  static createSmsJob(data: Omit<SmsJobData, 'id'>): SmsJobData {
    return {
      id: `sms-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
      ...data
    }
  }

  static createVisitReminderJob(data: Omit<VisitReminderJobData, 'id'>): VisitReminderJobData {
    return {
      id: `reminder-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
      ...data
    }
  }

  static createInvoiceJob(data: Omit<InvoiceGenerationJobData, 'id'>): InvoiceGenerationJobData {
    return {
      id: `invoice-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
      ...data
    }
  }

  static createMatchingJob(data: Omit<MatchingJobData, 'id'>): MatchingJobData {
    return {
      id: `matching-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
      ...data
    }
  }

  static createAuditLogJob(data: Omit<AuditLogJobData, 'id'>): AuditLogJobData {
    return {
      id: `audit-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
      ...data
    }
  }
}

// Job validation utilities
export class JobValidator {
  static validateEmailJob(data: any): EmailJobData {
    return EmailJobSchema.parse(data)
  }

  static validateSmsJob(data: any): SmsJobData {
    return SmsJobSchema.parse(data)
  }

  static validateVisitReminderJob(data: any): VisitReminderJobData {
    return VisitReminderJobSchema.parse(data)
  }

  static validateCredentialAlertJob(data: any): CredentialAlertJobData {
    return CredentialAlertJobSchema.parse(data)
  }

  static validateInvoiceGenerationJob(data: any): InvoiceGenerationJobData {
    return InvoiceGenerationJobSchema.parse(data)
  }

  static validatePaymentProcessingJob(data: any): PaymentProcessingJobData {
    return PaymentProcessingJobSchema.parse(data)
  }

  static validateDocumentProcessingJob(data: any): DocumentProcessingJobData {
    return DocumentProcessingJobSchema.parse(data)
  }

  static validateMatchingJob(data: any): MatchingJobData {
    return MatchingJobSchema.parse(data)
  }

  static validateAuditLogJob(data: any): AuditLogJobData {
    return AuditLogJobSchema.parse(data)
  }

  static validateSystemMaintenanceJob(data: any): SystemMaintenanceJobData {
    return SystemMaintenanceJobSchema.parse(data)
  }
}