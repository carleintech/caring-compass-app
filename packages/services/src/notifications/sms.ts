import twilio from 'twilio'
import { SmsJobData, SmsJobResult } from '../jobs/types'
import { getPrismaClient } from '@caring-compass/database/src/utils'

const prisma = getPrismaClient()

// SMS provider configuration
interface SmsConfig {
  provider: 'TWILIO'
  twilio: {
    accountSid: string
    authToken: string
    phoneNumber: string
  }
  defaultCountryCode: string
}

// SMS template definitions
export interface SmsTemplate {
  id: string
  name: string
  content: string
  variables: string[]
  maxLength: number
}

// Built-in SMS templates
export const SMS_TEMPLATES: Record<string, SmsTemplate> = {
  VISIT_REMINDER_2H: {
    id: 'visit-reminder-2h',
    name: '2 Hour Visit Reminder',
    content: 'Reminder: You have a visit with {{clientName}} in 2 hours at {{visitTime}}. Address: {{clientAddress}}. Need help? Call {{supportPhone}}.',
    variables: ['clientName', 'visitTime', 'clientAddress', 'supportPhone'],
    maxLength: 160
  },

  VISIT_REMINDER_30M: {
    id: 'visit-reminder-30m',
    name: '30 Minute Visit Reminder',
    content: 'Visit starting in 30 minutes! Client: {{clientName}} at {{clientAddress}}. Don\'t forget to clock in. Questions? {{supportPhone}}',
    variables: ['clientName', 'clientAddress', 'supportPhone'],
    maxLength: 160
  },

  VISIT_CANCELLED: {
    id: 'visit-cancelled',
    name: 'Visit Cancellation Notice',
    content: 'IMPORTANT: Your visit with {{clientName}} scheduled for {{visitTime}} has been cancelled. Please contact your coordinator at {{coordinatorPhone}} for details.',
    variables: ['clientName', 'visitTime', 'coordinatorPhone'],
    maxLength: 160
  },

  SHIFT_ASSIGNED: {
    id: 'shift-assigned',
    name: 'New Shift Assignment',
    content: 'New shift assigned! {{visitDate}} at {{visitTime}} with {{clientName}}. Duration: {{duration}}. Check your app for details.',
    variables: ['visitDate', 'visitTime', 'clientName', 'duration'],
    maxLength: 160
  },

  CREDENTIAL_EXPIRES_SOON: {
    id: 'credential-expires-soon',
    name: 'Credential Expiry Alert',
    content: 'URGENT: Your {{credentialName}} expires in {{daysLeft}} days ({{expirationDate}}). Please renew immediately to avoid work interruption.',
    variables: ['credentialName', 'daysLeft', 'expirationDate'],
    maxLength: 160
  },

  TIMESHEET_REMINDER: {
    id: 'timesheet-reminder',
    name: 'Timesheet Submission Reminder',
    content: 'Reminder: Please submit your timesheet for the week ending {{weekEndDate}}. Deadline: {{deadline}}. Submit via your caregiver portal.',
    variables: ['weekEndDate', 'deadline'],
    maxLength: 160
  },

  PAYMENT_RECEIVED: {
    id: 'payment-received',
    name: 'Payment Confirmation',
    content: 'Payment confirmed! ${{amount}} received for invoice #{{invoiceNumber}}. Thank you! View details in your client portal.',
    variables: ['amount', 'invoiceNumber'],
    maxLength: 160
  },

  INVOICE_OVERDUE: {
    id: 'invoice-overdue',
    name: 'Overdue Invoice Notice',
    content: 'NOTICE: Invoice #{{invoiceNumber}} for ${{amount}} is now overdue. Please pay immediately to avoid service interruption. Pay online or call {{billingPhone}}.',
    variables: ['invoiceNumber', 'amount', 'billingPhone'],
    maxLength: 160
  },

  EMERGENCY_CONTACT: {
    id: 'emergency-contact',
    name: 'Emergency Contact Alert',
    content: 'EMERGENCY: {{clientName}} requires immediate assistance. Caregiver {{caregiverName}} has initiated emergency protocol. Please respond immediately.',
    variables: ['clientName', 'caregiverName'],
    maxLength: 160
  },

  VERIFICATION_CODE: {
    id: 'verification-code',
    name: 'SMS Verification Code',
    content: 'Your Caring Compass verification code is: {{code}}. This code expires in 10 minutes. Do not share this code with anyone.',
    variables: ['code'],
    maxLength: 160
  }
}

// Phone number utilities
export class PhoneUtils {
  static formatPhoneNumber(phone: string, countryCode: string = '+1'): string {
    // Remove all non-numeric characters
    const cleaned = phone.replace(/\D/g, '')
    
    // Handle US numbers
    if (countryCode === '+1') {
      if (cleaned.length === 10) {
        return `+1${cleaned}`
      } else if (cleaned.length === 11 && cleaned.startsWith('1')) {
        return `+${cleaned}`
      }
    }
    
    // For other countries, assume the number is properly formatted
    if (cleaned.length >= 10) {
      return countryCode + cleaned.slice(-10)
    }
    
    throw new Error(`Invalid phone number: ${phone}`)
  }

  static validatePhoneNumber(phone: string): boolean {
    const phoneRegex = /^\+?[1-9]\d{1,14}$/
    return phoneRegex.test(phone.replace(/\D/g, ''))
  }

  static isUSNumber(phone: string): boolean {
    const cleaned = phone.replace(/\D/g, '')
    return cleaned.length === 10 || (cleaned.length === 11 && cleaned.startsWith('1'))
  }
}

// SMS service class
export class SmsService {
  private config: SmsConfig
  private twilioClient: twilio.Twilio

  constructor(config: SmsConfig) {
    this.config = config
    this.initializeTwilio()
  }

  private initializeTwilio(): void {
    if (!this.config.twilio.accountSid || !this.config.twilio.authToken) {
      throw new Error('Twilio credentials are required')
    }
    
    this.twilioClient = twilio(
      this.config.twilio.accountSid,
      this.config.twilio.authToken
    )
  }

  async sendSms(jobData: SmsJobData): Promise<SmsJobResult> {
    const startTime = Date.now()
    
    try {
      // Validate phone number
      const formattedPhone = PhoneUtils.formatPhoneNumber(
        jobData.to,
        this.config.defaultCountryCode
      )

      // Process template if provided
      let messageContent = jobData.message
      if (jobData.templateId && jobData.templateData) {
        messageContent = await this.processTemplate(
          jobData.templateId,
          jobData.templateData
        )
      }

      // Validate message length
      if (messageContent.length > 1600) { // Twilio's maximum
        throw new Error(`Message too long: ${messageContent.length} characters`)
      }

      // Send SMS via Twilio
      const result = await this.sendViaTwilio(formattedPhone, messageContent)
      result.executionTime = Date.now() - startTime

      // Log SMS activity
      await this.logSmsActivity(jobData, result)

      return result

    } catch (error) {
      const errorResult: SmsJobResult = {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        executionTime: Date.now() - startTime,
        retryable: this.isRetryableError(error)
      }

      await this.logSmsActivity(jobData, errorResult)
      return errorResult
    }
  }

  private async sendViaTwilio(to: string, message: string): Promise<SmsJobResult> {
    try {
      const result = await this.twilioClient.messages.create({
        body: message,
        from: this.config.twilio.phoneNumber,
        to: to
      })

      return {
        success: true,
        messageId: result.sid,
        deliveryStatus: result.status,
        message: 'SMS sent successfully via Twilio'
      }
    } catch (error: any) {
      // Handle Twilio-specific errors
      if (error.code) {
        switch (error.code) {
          case 21614: // Invalid phone number
            throw new Error('Invalid phone number format')
          case 21408: // Permission denied
            throw new Error('SMS not permitted to this number')
          case 21610: // Message blocked
            throw new Error('Message blocked by carrier')
          default:
            throw new Error(`Twilio error (${error.code}): ${error.message}`)
        }
      }
      throw error
    }
  }

  private async processTemplate(templateId: string, templateData: Record<string, any>): Promise<string> {
    const template = SMS_TEMPLATES[templateId.toUpperCase()]
    
    if (!template) {
      throw new Error(`SMS template not found: ${templateId}`)
    }

    let content = template.content

    // Replace template variables
    for (const [key, value] of Object.entries(templateData)) {
      const placeholder = `{{${key}}}`
      content = content.replace(new RegExp(placeholder, 'g'), String(value))
    }

    // Check if message exceeds template's max length
    if (content.length > template.maxLength) {
      console.warn(`SMS message exceeds recommended length for template ${templateId}: ${content.length}/${template.maxLength}`)
    }

    return content
  }

  private async logSmsActivity(smsData: SmsJobData, result: SmsJobResult): Promise<void> {
    try {
      await prisma.smsLog.create({
        data: {
          jobId: smsData.id,
          recipient: smsData.to,
          message: smsData.message,
          templateId: smsData.templateId,
          provider: 'TWILIO',
          success: result.success,
          messageId: result.messageId,
          deliveryStatus: result.deliveryStatus,
          errorMessage: result.error,
          sentAt: result.success ? new Date() : null,
          metadata: {
            executionTime: result.executionTime,
            priority: smsData.priority,
            ...smsData.metadata
          }
        }
      })
    } catch (error) {
      console.error('Failed to log SMS activity:', error)
    }
  }

  private isRetryableError(error: any): boolean {
    // Twilio error codes that are retryable
    if (error?.code) {
      const retryableCodes = [
        20003, // Unreachable destination handset
        30001, // Queue overflow
        30002, // Account suspended
        30003, // Unreachable destination handset
        30004, // Message blocked
        30005, // Unknown destination handset
        30006  // Landline or unreachable carrier
      ]
      
      // Don't retry these codes
      const nonRetryableCodes = [
        21211, // Invalid 'To' phone number
        21614, // 'To' phone number cannot be reached
        21408, // Permission denied for phone number
        21610  // Message blocked
      ]
      
      if (nonRetryableCodes.includes(error.code)) {
        return false
      }
      
      return retryableCodes.includes(error.code)
    }

    // Network errors are usually retryable
    if (error?.message?.includes('timeout') || error?.message?.includes('ECONNRESET')) {
      return true
    }

    return false
  }

  async getSmsStats(dateRange?: { startDate: Date; endDate: Date }) {
    const where: any = {}
    if (dateRange) {
      where.sentAt = {
        gte: dateRange.startDate,
        lte: dateRange.endDate
      }
    }

    const [total, successful, failed, delivered] = await Promise.all([
      prisma.smsLog.count({ where }),
      prisma.smsLog.count({ where: { ...where, success: true } }),
      prisma.smsLog.count({ where: { ...where, success: false } }),
      prisma.smsLog.count({ where: { ...where, deliveryStatus: 'delivered' } })
    ])

    return {
      total,
      successful,
      failed,
      delivered,
      successRate: total > 0 ? (successful / total) * 100 : 0,
      deliveryRate: successful > 0 ? (delivered / successful) * 100 : 0
    }
  }

  async checkDeliveryStatus(messageId: string): Promise<string> {
    try {
      const message = await this.twilioClient.messages(messageId).fetch()
      
      // Update our log with the latest status
      await prisma.smsLog.updateMany({
        where: { messageId },
        data: { deliveryStatus: message.status }
      })
      
      return message.status
    } catch (error) {
      console.error('Failed to check delivery status:', error)
      return 'unknown'
    }
  }

  // Bulk SMS functionality
  async sendBulkSms(recipients: Array<{
    to: string
    message: string
    templateData?: Record<string, any>
  }>): Promise<SmsJobResult[]> {
    const results: SmsJobResult[] = []
    
    // Process in batches to avoid rate limits
    const batchSize = 10
    for (let i = 0; i < recipients.length; i += batchSize) {
      const batch = recipients.slice(i, i + batchSize)
      
      const batchPromises = batch.map(async (recipient) => {
        const jobData: SmsJobData = {
          id: `bulk-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          to: recipient.to,
          message: recipient.message,
          templateData: recipient.templateData,
          priority: 'NORMAL'
        }
        
        return this.sendSms(jobData)
      })
      
      const batchResults = await Promise.allSettled(batchPromises)
      
      batchResults.forEach((result) => {
        if (result.status === 'fulfilled') {
          results.push(result.value)
        } else {
          results.push({
            success: false,
            error: result.reason?.message || 'Unknown error',
            retryable: false
          })
        }
      })
      
      // Rate limiting delay between batches
      if (i + batchSize < recipients.length) {
        await new Promise(resolve => setTimeout(resolve, 1000))
      }
    }
    
    return results
  }
}

// SMS service factory
export function createSmsService(): SmsService {
  const config: SmsConfig = {
    provider: 'TWILIO',
    twilio: {
      accountSid: process.env.TWILIO_ACCOUNT_SID!,
      authToken: process.env.TWILIO_AUTH_TOKEN!,
      phoneNumber: process.env.TWILIO_PHONE_NUMBER!
    },
    defaultCountryCode: process.env.DEFAULT_COUNTRY_CODE || '+1'
  }

  return new SmsService(config)
}

export default SmsService