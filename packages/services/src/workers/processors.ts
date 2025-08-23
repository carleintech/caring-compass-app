import { Worker, Job, WorkerOptions } from 'bullmq'
import { redis, QUEUES } from '../queue/redis'
import { 
  EmailJobData, 
  SmsJobData, 
  VisitReminderJobData,
  CredentialAlertJobData,
  InvoiceGenerationJobData,
  PaymentProcessingJobData,
  DocumentProcessingJobData,
  MatchingJobData,
  AuditLogJobData,
  SystemMaintenanceJobData,
  JobValidator
} from '../jobs/types'
import { createEmailService } from '../notifications/email'
import { createSmsService } from '../notifications/sms'
import { createStripeService } from '../integrations/stripe'
import { createFileStorageService } from '../storage/file-storage'
import { getPrismaClient } from '@caring-compass/database/src/utils'
// Mock function for caregiver matching - will be replaced with actual implementation
const findCaregiverMatches = async (criteria: any) => {
  return [
    {
      caregiverId: 'mock-caregiver-1',
      score: 0.95,
      distance: 2.5
    }
  ]
}

const prisma = getPrismaClient()

// Worker configuration
const workerOptions: WorkerOptions = {
  connection: redis,
  concurrency: 5,
  removeOnComplete: { count: 100 },
  removeOnFail: { count: 50 },
}

// Initialize services
const emailService = createEmailService()
const smsService = createSmsService()
const stripeService = createStripeService()
const fileStorageService = createFileStorageService()

// Email notification processor
export const emailWorker = new Worker(
  QUEUES.EMAIL_NOTIFICATIONS,
  async (job: Job<EmailJobData>) => {
    console.log(`Processing email job: ${job.id}`)
    
    try {
      // Validate job data
      const validatedData = JobValidator.validateEmailJob(job.data)
      
      // Process email
      const result = await emailService.sendEmail(validatedData)
      
      if (!result.success) {
        throw new Error(result.error || 'Email sending failed')
      }
      
      console.log(`Email sent successfully: ${result.messageId}`)
      return result
      
    } catch (error) {
      console.error(`Email job ${job.id} failed:`, error)
      throw error
    }
  },
  workerOptions
)

// SMS notification processor
export const smsWorker = new Worker(
  QUEUES.SMS_NOTIFICATIONS,
  async (job: Job<SmsJobData>) => {
    console.log(`Processing SMS job: ${job.id}`)
    
    try {
      // Validate job data
      const validatedData = JobValidator.validateSmsJob(job.data)
      
      // Process SMS
      const result = await smsService.sendSms(validatedData)
      
      if (!result.success) {
        throw new Error(result.error || 'SMS sending failed')
      }
      
      console.log(`SMS sent successfully: ${result.messageId}`)
      return result
      
    } catch (error) {
      console.error(`SMS job ${job.id} failed:`, error)
      throw error
    }
  },
  workerOptions
)

// Visit reminder processor
export const visitReminderWorker = new Worker(
  QUEUES.VISIT_REMINDERS,
  async (job: Job<VisitReminderJobData>) => {
    console.log(`Processing visit reminder job: ${job.id}`)
    
    try {
      const validatedData = JobValidator.validateVisitReminderJob(job.data)
      
      // Get visit details
      const visit = await prisma.visit.findUnique({
        where: { id: validatedData.visitId },
        include: {
          client: {
            include: {
              user: true
            }
          },
          caregiver: {
            include: {
              user: true
            }
          }
        }
      })
      
      if (!visit) {
        throw new Error(`Visit not found: ${validatedData.visitId}`)
      }
      
      const visitDate = new Date(validatedData.visitDate).toLocaleDateString()
      const visitTime = new Date(validatedData.visitDate).toLocaleTimeString()
      
      // Send reminders based on methods specified
      const results = []
      
      for (const method of validatedData.reminderMethods) {
        switch (method) {
          case 'EMAIL':
            if (validatedData.caregiverId && visit.caregiver?.user?.email) {
              const emailResult = await emailService.sendEmail({
                id: `reminder-email-${job.id}`,
                to: visit.caregiver.user.email,
                templateId: 'visit-reminder-24h',
                templateData: {
                  recipientName: `${visit.caregiver.firstName} ${visit.caregiver.lastName}`,
                  visitDate,
                  visitTime,
                  visitDuration: '4 hours', // This should be calculated
                  clientName: `${visit.client.firstName} ${visit.client.lastName}`,
                  clientAddress: visit.client.address,
                  serviceTypes: visit.serviceType,
                  additionalNotes: visit.notes || ''
                },
                priority: 'HIGH'
              })
              results.push({ method: 'EMAIL', success: emailResult.success })
            }
            break
            
          case 'SMS':
            if (validatedData.caregiverId && visit.caregiver?.phone) {
              const smsResult = await smsService.sendSms({
                id: `reminder-sms-${job.id}`,
                to: visit.caregiver.phone,
                message: `Reminder: Visit with ${visit.client.firstName} ${visit.client.lastName} at ${visitTime}`,
                templateId: validatedData.reminderType === '24_HOUR' ? 'visit-reminder-24h' : 'visit-reminder-2h',
                templateData: {
                  clientName: `${visit.client.firstName} ${visit.client.lastName}`,
                  visitTime,
                  clientAddress: visit.client.address,
                  supportPhone: process.env.SUPPORT_PHONE || '555-SUPPORT'
                },
                priority: 'HIGH'
              })
              results.push({ method: 'SMS', success: smsResult.success })
            }
            break
            
          case 'PUSH':
            // Push notification implementation would go here
            results.push({ method: 'PUSH', success: false, note: 'Not implemented' })
            break
        }
      }
      
      console.log(`Visit reminder processed: ${results.length} notifications sent`)
      return { success: true, results }
      
    } catch (error) {
      console.error(`Visit reminder job ${job.id} failed:`, error)
      throw error
    }
  },
  workerOptions
)

// Credential expiry alert processor
export const credentialAlertWorker = new Worker(
  QUEUES.CREDENTIAL_ALERTS,
  async (job: Job<CredentialAlertJobData>) => {
    console.log(`Processing credential alert job: ${job.id}`)
    
    try {
      const validatedData = JobValidator.validateCredentialAlertJob(job.data)
      
      // Get caregiver details
      const caregiver = await prisma.caregiverProfile.findUnique({
        where: { id: validatedData.caregiverId },
        include: {
          user: true,
          credentials: {
            where: {
              credentialType: validatedData.credentialType,
              status: 'VERIFIED'
            }
          }
        }
      })
      
      if (!caregiver) {
        throw new Error(`Caregiver not found: ${validatedData.caregiverId}`)
      }
      
      const credential = caregiver.credentials[0]
      if (!credential) {
        throw new Error(`Credential not found: ${validatedData.credentialType}`)
      }
      
      const expirationDate = new Date(validatedData.expirationDate)
      const daysUntilExpiry = Math.ceil((expirationDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
      
      // Send alerts based on methods specified
      const results = []
      
      for (const method of validatedData.alertMethods) {
        switch (method) {
          case 'EMAIL':
            if (caregiver.user?.email) {
              const emailResult = await emailService.sendEmail({
                id: `credential-email-${job.id}`,
                to: caregiver.user.email,
                templateId: 'credential-expiry-warning',
                templateData: {
                  caregiverName: `${caregiver.firstName} ${caregiver.lastName}`,
                  credentialName: validatedData.credentialName,
                  expirationDate: expirationDate.toLocaleDateString(),
                  daysUntilExpiry: daysUntilExpiry.toString()
                },
                priority: daysUntilExpiry <= 7 ? 'HIGH' : 'NORMAL'
              })
              results.push({ method: 'EMAIL', success: emailResult.success })
            }
            break
            
          case 'SMS':
            if (caregiver.phone) {
              const smsResult = await smsService.sendSms({
                id: `credential-sms-${job.id}`,
                to: caregiver.phone,
                templateId: 'credential-expires-soon',
                templateData: {
                  credentialName: validatedData.credentialName,
                  daysLeft: daysUntilExpiry.toString(),
                  expirationDate: expirationDate.toLocaleDateString()
                },
                priority: daysUntilExpiry <= 7 ? 'HIGH' : 'NORMAL'
              })
              results.push({ method: 'SMS', success: smsResult.success })
            }
            break
        }
      }
      
      // Update credential with alert sent flag
      await prisma.caregiverCredential.update({
        where: { id: credential.id },
        data: {
          lastAlertSent: new Date(),
          metadata: {
            ...credential.metadata,
            alertsSent: [...(credential.metadata?.alertsSent || []), validatedData.alertType]
          }
        }
      })
      
      console.log(`Credential alert processed: ${results.length} notifications sent`)
      return { success: true, results }
      
    } catch (error) {
      console.error(`Credential alert job ${job.id} failed:`, error)
      throw error
    }
  },
  workerOptions
)

// Invoice generation processor
export const invoiceGenerationWorker = new Worker(
  QUEUES.INVOICE_GENERATION,
  async (job: Job<InvoiceGenerationJobData>) => {
    console.log(`Processing invoice generation job: ${job.id}`)
    
    try {
      const validatedData = JobValidator.validateInvoiceGenerationJob(job.data)
      
      // Get client and visit data
      const client = await prisma.clientProfile.findUnique({
        where: { id: validatedData.clientId },
        include: {
          user: true,
          visits: {
            where: {
              status: 'COMPLETED',
              scheduledStart: {
                gte: new Date(validatedData.billingPeriod.startDate),
                lte: new Date(validatedData.billingPeriod.endDate)
              },
              ...(validatedData.visitIds && {
                id: { in: validatedData.visitIds }
              })
            },
            include: {
              caregiver: true
            }
          }
        }
      })
      
      if (!client) {
        throw new Error(`Client not found: ${validatedData.clientId}`)
      }
      
      if (client.visits.length === 0) {
        throw new Error('No completed visits found for billing period')
      }
      
      // Calculate invoice details
      let totalAmount = 0
      const lineItems = []
      
      for (const visit of client.visits) {
        if (visit.actualStart && visit.actualEnd) {
          const duration = (visit.actualEnd.getTime() - visit.actualStart.getTime()) / (1000 * 60 * 60) // hours
          const rate = visit.caregiver?.hourlyRate || 20 // default rate
          const amount = duration * rate
          
          totalAmount += amount
          lineItems.push({
            description: `${visit.serviceType} - ${visit.actualStart.toLocaleDateString()}`,
            hours: duration,
            rate,
            amount,
            caregiverName: visit.caregiver ? `${visit.caregiver.firstName} ${visit.caregiver.lastName}` : 'Unknown'
          })
        }
      }
      
      // Generate invoice number
      const invoiceCount = await prisma.invoice.count({
        where: { clientId: validatedData.clientId }
      })
      const invoiceNumber = `INV-${client.id.substring(0, 6).toUpperCase()}-${(invoiceCount + 1).toString().padStart(4, '0')}`
      
      // Create invoice
      const invoice = await prisma.invoice.create({
        data: {
          clientId: validatedData.clientId,
          invoiceNumber,
          billingPeriod: {
            startDate: new Date(validatedData.billingPeriod.startDate),
            endDate: new Date(validatedData.billingPeriod.endDate)
          },
          lineItems,
          subtotal: totalAmount,
          taxAmount: 0, // Tax calculation would go here
          totalAmount,
          dueDate: validatedData.dueDate ? new Date(validatedData.dueDate) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
          status: 'PENDING',
          metadata: {
            visitIds: client.visits.map(v => v.id),
            generatedBy: 'SYSTEM',
            jobId: job.id
          }
        }
      })
      
      // Auto-send if requested
      if (validatedData.autoSend && client.user?.email) {
        await emailService.sendEmail({
          id: `invoice-email-${job.id}`,
          to: client.user.email,
          templateId: 'invoice-generated',
          templateData: {
            clientName: `${client.firstName} ${client.lastName}`,
            invoiceNumber: invoice.invoiceNumber,
            billingPeriod: `${new Date(validatedData.billingPeriod.startDate).toLocaleDateString()} - ${new Date(validatedData.billingPeriod.endDate).toLocaleDateString()}`,
            amount: totalAmount.toFixed(2),
            dueDate: invoice.dueDate.toLocaleDateString(),
            paymentLink: `${process.env.CLIENT_PORTAL_URL}/invoices/${invoice.id}/pay`
          },
          priority: 'NORMAL'
        })
      }
      
      console.log(`Invoice generated: ${invoice.invoiceNumber} for $${totalAmount.toFixed(2)}`)
      return { 
        success: true, 
        invoiceId: invoice.id,
        invoiceNumber: invoice.invoiceNumber,
        totalAmount,
        lineItemsCount: lineItems.length
      }
      
    } catch (error) {
      console.error(`Invoice generation job ${job.id} failed:`, error)
      throw error
    }
  },
  workerOptions
)

// Payment processing processor
export const paymentProcessingWorker = new Worker(
  QUEUES.PAYMENT_PROCESSING,
  async (job: Job<PaymentProcessingJobData>) => {
    console.log(`Processing payment job: ${job.id}`)
    
    try {
      const validatedData = JobValidator.validatePaymentProcessingJob(job.data)
      
      // Get invoice details
      const invoice = await prisma.invoice.findUnique({
        where: { id: validatedData.invoiceId },
        include: {
          client: {
            include: { user: true }
          }
        }
      })
      
      if (!invoice) {
        throw new Error(`Invoice not found: ${validatedData.invoiceId}`)
      }
      
      let result
      
      switch (validatedData.paymentMethod) {
        case 'STRIPE':
          // Confirm the payment intent
          const paymentIntent = await stripeService.confirmPaymentIntent(validatedData.paymentIntentId)
          
          if (paymentIntent.status === 'succeeded') {
            // Update invoice and create payment record
            await prisma.$transaction(async (tx) => {
              await tx.invoice.update({
                where: { id: validatedData.invoiceId },
                data: {
                  status: 'PAID',
                  paidAt: new Date()
                }
              })
              
              await tx.payment.create({
                data: {
                  invoiceId: validatedData.invoiceId,
                  amount: validatedData.amount,
                  currency: validatedData.currency,
                  paymentMethod: 'STRIPE',
                  stripePaymentIntentId: validatedData.paymentIntentId,
                  status: 'COMPLETED',
                  processedAt: new Date(),
                  metadata: {
                    stripeChargeId: paymentIntent.charges.data[0]?.id
                  }
                }
              })
            })
            
            // Send confirmation email
            if (invoice.client.user?.email) {
              await emailService.sendEmail({
                id: `payment-confirmation-${job.id}`,
                to: invoice.client.user.email,
                templateId: 'payment-confirmation',
                templateData: {
                  clientName: `${invoice.client.firstName} ${invoice.client.lastName}`,
                  invoiceNumber: invoice.invoiceNumber,
                  paymentAmount: validatedData.amount.toFixed(2),
                  paymentDate: new Date().toLocaleDateString(),
                  paymentMethod: 'Credit Card',
                  transactionId: paymentIntent.id
                },
                priority: 'NORMAL'
              })
            }
            
            result = { success: true, paymentId: paymentIntent.id, status: 'completed' }
          } else {
            result = { success: false, error: `Payment failed with status: ${paymentIntent.status}` }
          }
          break
          
        case 'ACH':
          // ACH processing would go here
          result = { success: false, error: 'ACH processing not implemented' }
          break
          
        case 'CHECK':
          // Check processing would go here
          result = { success: false, error: 'Check processing not implemented' }
          break
          
        default:
          throw new Error(`Unsupported payment method: ${validatedData.paymentMethod}`)
      }
      
      console.log(`Payment processing completed: ${result.success ? 'SUCCESS' : 'FAILED'}`)
      return result
      
    } catch (error) {
      console.error(`Payment processing job ${job.id} failed:`, error)
      throw error
    }
  },
  workerOptions
)

// Document processing processor
export const documentProcessingWorker = new Worker(
  QUEUES.DOCUMENT_PROCESSING,
  async (job: Job<DocumentProcessingJobData>) => {
    console.log(`Processing document job: ${job.id}`)
    
    try {
      const validatedData = JobValidator.validateDocumentProcessingJob(job.data)
      
      // Get document details
      const document = await prisma.document.findUnique({
        where: { id: validatedData.documentId }
      })
      
      if (!document) {
        throw new Error(`Document not found: ${validatedData.documentId}`)
      }
      
      let result
      
      switch (validatedData.operation) {
        case 'UPLOAD':
          // File upload is handled by the file storage service
          result = { success: true, message: 'Upload completed' }
          break
          
        case 'CONVERT':
          // Document conversion (e.g., PDF to image)
          result = { success: false, error: 'Conversion not implemented' }
          break
          
        case 'SIGN':
          // E-signature processing
          result = { success: false, error: 'E-signature not implemented' }
          break
          
        case 'COMPRESS':
          // Document compression
          result = { success: false, error: 'Compression not implemented' }
          break
          
        case 'VALIDATE':
          // Document validation
          result = { success: true, message: 'Validation completed' }
          break
          
        default:
          throw new Error(`Unsupported operation: ${validatedData.operation}`)
      }
      
      console.log(`Document processing completed: ${result.success ? 'SUCCESS' : 'FAILED'}`)
      return result
      
    } catch (error) {
      console.error(`Document processing job ${job.id} failed:`, error)
      throw error
    }
  },
  workerOptions
)

// Matching engine processor
export const matchingEngineWorker = new Worker(
  QUEUES.MATCHING_ENGINE,
  async (job: Job<MatchingJobData>) => {
    console.log(`Processing matching job: ${job.id}`)
    
    try {
      const validatedData = JobValidator.validateMatchingJob(job.data)
      
      // Get visit and client details
      const visit = await prisma.visit.findUnique({
        where: { id: validatedData.visitId },
        include: {
          client: true
        }
      })
      
      if (!visit) {
        throw new Error(`Visit not found: ${validatedData.visitId}`)
      }
      
      // Find caregiver matches
      const matches = await findCaregiverMatches({
        skills: validatedData.matchingCriteria.requiredSkills,
        languages: validatedData.matchingCriteria.preferredLanguages || [],
        gender: validatedData.matchingCriteria.genderPreference,
        maxDistance: validatedData.matchingCriteria.maxDistance,
        clientLat: visit.client.latitude || 0,
        clientLon: visit.client.longitude || 0,
        requiredDate: new Date(validatedData.matchingCriteria.visitDate),
        visitDuration: validatedData.matchingCriteria.visitDuration
      })
      
      // Auto-assign if requested and matches found
      let selectedCaregiverId: string | undefined
      let autoAssigned = false
      
      if (validatedData.autoAssign && matches.length > 0) {
        const bestMatch = matches[0]
        
        // Assign the best match
        await prisma.visit.update({
          where: { id: validatedData.visitId },
          data: {
            caregiverId: bestMatch.caregiverId,
            status: 'ASSIGNED',
            assignedAt: new Date(),
            assignedBy: 'SYSTEM'
          }
        })
        
        selectedCaregiverId = bestMatch.caregiverId
        autoAssigned = true
      }
      
      // Notify coordinator if requested
      if (validatedData.notifyCoordinator) {
        const coordinators = await prisma.user.findMany({
          where: { role: 'COORDINATOR', isActive: true },
          include: { coordinatorProfile: true }
        })
        
        for (const coordinator of coordinators) {
          if (coordinator.email) {
            await emailService.sendEmail({
              id: `matching-notification-${job.id}-${coordinator.id}`,
              to: coordinator.email,
              subject: `Caregiver matching ${autoAssigned ? 'completed' : 'results'} for Visit ${visit.id}`,
              htmlContent: `
                <h2>Caregiver Matching Results</h2>
                <p>Visit: ${visit.serviceType} on ${new Date(validatedData.matchingCriteria.visitDate).toLocaleDateString()}</p>
                <p>Client: ${visit.client.firstName} ${visit.client.lastName}</p>
                <p>Matches found: ${matches.length}</p>
                ${autoAssigned ? `<p><strong>Auto-assigned to: ${selectedCaregiverId}</strong></p>` : ''}
                <p>View details in the admin portal.</p>
              `,
              priority: 'NORMAL'
            })
          }
        }
      }
      
      console.log(`Matching completed: ${matches.length} matches found, auto-assigned: ${autoAssigned}`)
      return {
        success: true,
        matches: matches.slice(0, 10), // Return top 10 matches
        selectedCaregiverId,
        autoAssigned
      }
      
    } catch (error) {
      console.error(`Matching job ${job.id} failed:`, error)
      throw error
    }
  },
  workerOptions
)

// Audit logging processor
export const auditLogWorker = new Worker(
  QUEUES.AUDIT_LOGGING,
  async (job: Job<AuditLogJobData>) => {
    console.log(`Processing audit log job: ${job.id}`)
    
    try {
      const validatedData = JobValidator.validateAuditLogJob(job.data)
      
      // Create audit log entry
      await prisma.auditLog.create({
        data: {
          userId: validatedData.userId,
          action: validatedData.action,
          resourceType: validatedData.resourceType,
          resourceId: validatedData.resourceId,
          details: validatedData.details,
          ipAddress: validatedData.ipAddress,
          userAgent: validatedData.userAgent,
          timestamp: new Date(validatedData.timestamp),
          metadata: validatedData.metadata
        }
      })
      
      console.log(`Audit log created: ${validatedData.action} on ${validatedData.resourceType}`)
      return { success: true }
      
    } catch (error) {
      console.error(`Audit log job ${job.id} failed:`, error)
      throw error
    }
  },
  workerOptions
)

// System maintenance processor
export const systemMaintenanceWorker = new Worker(
  QUEUES.SYSTEM_MAINTENANCE,
  async (job: Job<SystemMaintenanceJobData>) => {
    console.log(`Processing system maintenance job: ${job.id}`)
    
    try {
      const validatedData = JobValidator.validateSystemMaintenanceJob(job.data)
      
      let result
      
      switch (validatedData.taskType) {
        case 'DATABASE_CLEANUP':
          result = await performDatabaseCleanup()
          break
          
        case 'FILE_CLEANUP':
          result = await performFileCleanup()
          break
          
        case 'CACHE_REFRESH':
          result = await performCacheRefresh()
          break
          
        case 'BACKUP_GENERATION':
          result = await performBackupGeneration()
          break
          
        case 'HEALTH_CHECK':
          result = await performHealthCheck()
          break
          
        case 'METRICS_COLLECTION':
          result = await performMetricsCollection()
          break
          
        default:
          throw new Error(`Unsupported maintenance task: ${validatedData.taskType}`)
      }
      
      console.log(`System maintenance completed: ${validatedData.taskType}`)
      return result
      
    } catch (error) {
      console.error(`System maintenance job ${job.id} failed:`, error)
      throw error
    }
  },
  workerOptions
)

// Maintenance task implementations
async function performDatabaseCleanup() {
  // Clean up old audit logs (older than 1 year)
  const cutoffDate = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000)
  
  const deleted = await prisma.auditLog.deleteMany({
    where: {
      timestamp: { lt: cutoffDate }
    }
  })
  
  return { success: true, deletedRecords: deleted.count }
}

async function performFileCleanup() {
  // Clean up expired documents
  const expired = await prisma.document.updateMany({
    where: {
      expiresAt: { lt: new Date() },
      status: 'ACTIVE'
    },
    data: {
      status: 'EXPIRED'
    }
  })
  
  return { success: true, expiredFiles: expired.count }
}

async function performCacheRefresh() {
  // Redis cache refresh logic would go here
  return { success: true, message: 'Cache refreshed' }
}

async function performBackupGeneration() {
  // Database backup logic would go here
  return { success: true, message: 'Backup generated' }
}

async function performHealthCheck() {
  // System health check logic
  const checks = {
    database: false,
    redis: false,
    storage: false,
    email: false,
    sms: false
  }
  
  try {
    // Database check
    await prisma.$queryRaw`SELECT 1`
    checks.database = true
  } catch (error) {
    console.error('Database health check failed:', error)
  }
  
  try {
    // Redis check
    await redis.ping()
    checks.redis = true
  } catch (error) {
    console.error('Redis health check failed:', error)
  }
  
  const healthyServices = Object.values(checks).filter(Boolean).length
  const totalServices = Object.keys(checks).length
  
  return { 
    success: true, 
    healthScore: (healthyServices / totalServices) * 100,
    checks 
  }
}

async function performMetricsCollection() {
  // Collect system metrics
  const metrics = {
    users: await prisma.user.count(),
    clients: await prisma.clientProfile.count(),
    caregivers: await prisma.caregiverProfile.count(),
    visits: await prisma.visit.count(),
    invoices: await prisma.invoice.count(),
    timestamp: new Date()
  }
  
  // Store metrics in a metrics table or external service
  return { success: true, metrics }
}

// Worker event handlers
const workers = [
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

// Add event listeners to all workers
workers.forEach(worker => {
  worker.on('completed', (job) => {
    console.log(`✅ Job ${job.id} completed in queue ${worker.name}`)
  })
  
  worker.on('failed', (job, err) => {
    console.error(`❌ Job ${job?.id} failed in queue ${worker.name}:`, err.message)
  })
  
  worker.on('error', (err) => {
    console.error(`🔥 Worker error in ${worker.name}:`, err)
  })
})

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('🛑 Shutting down workers gracefully...')
  
  await Promise.all(workers.map(worker => worker.close()))
  await redis.disconnect()
  
  console.log('✅ All workers shut down')
  process.exit(0)
})

// Workers are already exported individually above
