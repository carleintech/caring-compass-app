import sgMail from '@sendgrid/mail'
import { Resend } from 'resend'
import { createClient } from '@supabase/supabase-js'
import { EmailJobData, EmailJobResult } from '../jobs/types'
import { getPrismaClient } from '@caring-compass/database/src/utils'

const prisma = getPrismaClient()

// Email provider configuration
interface EmailConfig {
  provider: 'SENDGRID' | 'RESEND' | 'SUPABASE'
  sendgrid?: {
    apiKey: string
  }
  resend?: {
    apiKey: string
  }
  supabase?: {
    url: string
    serviceKey: string
  }
  defaultFrom: string
  defaultReplyTo?: string
}

// Email template definitions
export interface EmailTemplate {
  id: string
  name: string
  subject: string
  htmlContent: string
  textContent?: string
  variables: string[]
}

// Built-in email templates function to avoid evaluation at module load
export function getEmailTemplates(): Record<string, EmailTemplate> {
  return {
    WELCOME_CLIENT: {
      id: 'welcome-client',
      name: 'Welcome New Client',
      subject: 'Welcome to Caring Compass Home Care',
      htmlContent: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #2563eb;">Welcome to Caring Compass, {{firstName}}!</h1>
          <p>We're excited to partner with you in providing exceptional home care services.</p>
          <p>Your account has been created successfully. Here's what happens next:</p>
          <ul>
            <li>Complete your care assessment</li>
            <li>Review and sign your service agreement</li>
            <li>Meet your assigned care coordinator</li>
          </ul>
          <p>If you have any questions, please don't hesitate to contact us at {{supportEmail}} or {{supportPhone}}.</p>
          <p>Best regards,<br>The Caring Compass Team</p>
        </div>
      `,
      textContent: `Welcome to Caring Compass, {{firstName}}! We're excited to partner with you in providing exceptional home care services...`,
      variables: ['firstName', 'supportEmail', 'supportPhone']
    },

    WELCOME_CAREGIVER: {
      id: 'welcome-caregiver',
      name: 'Welcome New Caregiver',
      subject: 'Welcome to the Caring Compass Team',
      htmlContent: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #2563eb;">Welcome to our team, {{firstName}}!</h1>
          <p>We're thrilled to have you join the Caring Compass family of compassionate caregivers.</p>
          <p>Your application has been approved. Next steps:</p>
          <ul>
            <li>Complete your onboarding training</li>
            <li>Upload required credentials</li>
            <li>Set your availability schedule</li>
            <li>Review our caregiver handbook</li>
          </ul>
          <p>Your login credentials:</p>
          <p><strong>Email:</strong> {{email}}<br><strong>Temporary Password:</strong> {{tempPassword}}</p>
          <p>Please log in and change your password immediately.</p>
          <p>Welcome aboard!<br>The Caring Compass Team</p>
        </div>
      `,
      variables: ['firstName', 'email', 'tempPassword']
    },

    VISIT_REMINDER_24H: {
      id: 'visit-reminder-24h',
      name: '24 Hour Visit Reminder',
      subject: 'Visit Reminder - Tomorrow at {{visitTime}}',
      htmlContent: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Visit Reminder</h2>
          <p>Hello {{recipientName}},</p>
          <p>This is a friendly reminder that you have a scheduled visit tomorrow:</p>
          <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Date:</strong> {{visitDate}}</p>
            <p><strong>Time:</strong> {{visitTime}}</p>
            <p><strong>Duration:</strong> {{visitDuration}}</p>
            <p><strong>Client:</strong> {{clientName}}</p>
            <p><strong>Address:</strong> {{clientAddress}}</p>
            <p><strong>Services:</strong> {{serviceTypes}}</p>
          </div>
          <p>{{additionalNotes}}</p>
          <p>If you need to make any changes, please contact your coordinator immediately.</p>
          <p>Thank you,<br>Caring Compass</p>
        </div>
      `,
      variables: ['recipientName', 'visitDate', 'visitTime', 'visitDuration', 'clientName', 'clientAddress', 'serviceTypes', 'additionalNotes']
    },

    CREDENTIAL_EXPIRY_WARNING: {
      id: 'credential-expiry-warning',
      name: 'Credential Expiry Warning',
      subject: 'Important: {{credentialName}} expires in {{daysUntilExpiry}} days',
      htmlContent: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #dc2626;">Credential Expiry Notice</h2>
          <p>Hello {{caregiverName}},</p>
          <p>This is an important reminder that your <strong>{{credentialName}}</strong> will expire soon:</p>
          <div style="background: #fee2e2; border: 1px solid #dc2626; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Credential:</strong> {{credentialName}}</p>
            <p><strong>Expiration Date:</strong> {{expirationDate}}</p>
            <p><strong>Days Remaining:</strong> {{daysUntilExpiry}}</p>
          </div>
          <p>Please renew this credential immediately to avoid any interruption in your work assignments.</p>
          <p>To upload your renewed credential, please log into your caregiver portal.</p>
          <p>If you have any questions, contact your coordinator.</p>
          <p>Best regards,<br>Caring Compass Team</p>
        </div>
      `,
      variables: ['caregiverName', 'credentialName', 'expirationDate', 'daysUntilExpiry']
    },

    INVOICE_GENERATED: {
      id: 'invoice-generated',
      name: 'New Invoice Available',
      subject: 'New Invoice #{{invoiceNumber}} - Amount Due: ${{amount}}',
      htmlContent: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">New Invoice Available</h2>
          <p>Dear {{clientName}},</p>
          <p>A new invoice has been generated for your care services:</p>
          <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Invoice Number:</strong> {{invoiceNumber}}</p>
            <p><strong>Billing Period:</strong> {{billingPeriod}}</p>
            <p><strong>Amount Due:</strong> ${{amount}}</p>
            <p><strong>Due Date:</strong> {{dueDate}}</p>
          </div>
          <p>You can view and pay your invoice by logging into your client portal or clicking the button below:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="{{paymentLink}}" style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">View & Pay Invoice</a>
          </div>
          <p>We accept credit cards, ACH transfers, and checks.</p>
          <p>Thank you for your business!</p>
          <p>Caring Compass Billing Team</p>
        </div>
      `,
      variables: ['clientName', 'invoiceNumber', 'billingPeriod', 'amount', 'dueDate', 'paymentLink']
    },

    PAYMENT_CONFIRMATION: {
      id: 'payment-confirmation',
      name: 'Payment Confirmation',
      subject: 'Payment Received - Invoice #{{invoiceNumber}}',
      htmlContent: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #059669;">Payment Confirmed</h2>
          <p>Dear {{clientName}},</p>
          <p>Thank you! We have successfully received your payment:</p>
          <div style="background: #ecfdf5; border: 1px solid #059669; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Invoice Number:</strong> {{invoiceNumber}}</p>
            <p><strong>Payment Amount:</strong> ${{paymentAmount}}</p>
            <p><strong>Payment Date:</strong> {{paymentDate}}</p>
            <p><strong>Payment Method:</strong> {{paymentMethod}}</p>
            <p><strong>Transaction ID:</strong> {{transactionId}}</p>
          </div>
          <p>Your account is now current. You can view your payment history in your client portal.</p>
          <p>Thank you for choosing Caring Compass!</p>
          <p>Best regards,<br>Caring Compass Team</p>
        </div>
      `,
      variables: ['clientName', 'invoiceNumber', 'paymentAmount', 'paymentDate', 'paymentMethod', 'transactionId']
    },

    PASSWORD_RESET: {
      id: 'password-reset',
      name: 'Password Reset Request',
      subject: 'Reset Your Caring Compass Password',
      htmlContent: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Password Reset Request</h2>
          <p>Hello,</p>
          <p>We received a request to reset your password for your Caring Compass account.</p>
          <p>Click the button below to reset your password:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="{{resetLink}}" style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Reset Password</a>
          </div>
          <p>This link will expire in 24 hours for security reasons.</p>
          <p>If you didn't request this password reset, please ignore this email or contact support if you have concerns.</p>
          <p>Best regards,<br>Caring Compass Security Team</p>
        </div>
      `,
      variables: ['resetLink']
    }
  }
}

// Email service class
export class EmailService {
  private config: EmailConfig
  private sendgrid?: typeof sgMail
  private resend?: Resend
  private supabase?: any

  constructor(config: EmailConfig) {
    this.config = config
    this.initializeProvider()
  }

  private initializeProvider(): void {
    switch (this.config.provider) {
      case 'SENDGRID':
        if (!this.config.sendgrid?.apiKey) {
          throw new Error('SendGrid API key is required')
        }
        sgMail.setApiKey(this.config.sendgrid.apiKey)
        this.sendgrid = sgMail
        break

      case 'RESEND':
        if (!this.config.resend?.apiKey) {
          throw new Error('Resend API key is required')
        }
        this.resend = new Resend(this.config.resend.apiKey)
        break

      case 'SUPABASE':
        if (!this.config.supabase?.url || !this.config.supabase?.serviceKey) {
          throw new Error('Supabase URL and service key are required')
        }
        this.supabase = createClient(
          this.config.supabase.url,
          this.config.supabase.serviceKey
        )
        break
    }
  }

  async sendEmail(jobData: EmailJobData): Promise<EmailJobResult> {
    const startTime = Date.now()
    
    try {
      // Process template if provided
      let htmlContent = jobData.htmlContent
      let textContent = jobData.textContent
      let subject = jobData.subject

      if (jobData.templateId && jobData.templateData) {
        const processed = await this.processTemplate(
          jobData.templateId,
          jobData.templateData
        )
        htmlContent = processed.htmlContent
        textContent = processed.textContent
        subject = processed.subject
      }

      // Send email based on provider
      let result: EmailJobResult

      switch (this.config.provider) {
        case 'SENDGRID':
          result = await this.sendViaSendGrid({
            ...jobData,
            htmlContent,
            textContent,
            subject
          })
          break

        case 'RESEND':
          result = await this.sendViaResend({
            ...jobData,
            htmlContent,
            textContent,
            subject
          })
          break

        case 'SUPABASE':
          result = await this.sendViaSupabase({
            ...jobData,
            htmlContent,
            textContent,
            subject
          })
          break

        default:
          throw new Error(`Unsupported email provider: ${this.config.provider}`)
      }

      result.executionTime = Date.now() - startTime

      // Log email activity
      await this.logEmailActivity(jobData, result)

      return result

    } catch (error) {
      const errorResult: EmailJobResult = {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        executionTime: Date.now() - startTime,
        retryable: this.isRetryableError(error)
      }

      await this.logEmailActivity(jobData, errorResult)
      return errorResult
    }
  }

  private async sendViaSendGrid(emailData: EmailJobData): Promise<EmailJobResult> {
    if (!this.sendgrid) {
      throw new Error('SendGrid not initialized')
    }

    const msg = {
      to: emailData.to,
      from: emailData.from || this.config.defaultFrom,
      replyTo: this.config.defaultReplyTo,
      subject: emailData.subject,
      html: emailData.htmlContent,
      text: emailData.textContent,
      attachments: emailData.attachments?.map(att => ({
        filename: att.filename,
        content: att.content,
        type: att.contentType,
        disposition: 'attachment'
      }))
    }

    const response = await this.sendgrid.send(msg)
    
    return {
      success: true,
      messageId: response[0].headers['x-message-id'],
      deliveryStatus: 'sent',
      message: 'Email sent successfully via SendGrid'
    }
  }

  private async sendViaResend(emailData: EmailJobData): Promise<EmailJobResult> {
    if (!this.resend) {
      throw new Error('Resend not initialized')
    }

    const response = await this.resend.emails.send({
      from: emailData.from || this.config.defaultFrom,
      to: emailData.to,
      replyTo: this.config.defaultReplyTo,
      subject: emailData.subject,
      html: emailData.htmlContent,
      text: emailData.textContent,
      attachments: emailData.attachments?.map(att => ({
        filename: att.filename,
        content: Buffer.from(att.content, 'base64')
      }))
    })

    return {
      success: true,
      messageId: response.data?.id,
      deliveryStatus: 'sent',
      message: 'Email sent successfully via Resend'
    }
  }

  private async sendViaSupabase(emailData: EmailJobData): Promise<EmailJobResult> {
    // Supabase doesn't have built-in email sending
    // This would integrate with a Supabase Edge Function
    throw new Error('Supabase email sending not implemented')
  }

  private async processTemplate(templateId: string, templateData: Record<string, any>): Promise<{
    htmlContent: string
    textContent?: string
    subject: string
  }> {
    const template = EMAIL_TEMPLATES[templateId.toUpperCase()]
    
    if (!template) {
      throw new Error(`Email template not found: ${templateId}`)
    }

    // Simple template variable replacement
    let htmlContent = template.htmlContent
    let textContent = template.textContent
    let subject = template.subject

    for (const [key, value] of Object.entries(templateData)) {
      const placeholder = `{{${key}}}`
      const stringValue = String(value)
      
      htmlContent = htmlContent.replace(new RegExp(placeholder, 'g'), stringValue)
      if (textContent) {
        textContent = textContent.replace(new RegExp(placeholder, 'g'), stringValue)
      }
      subject = subject.replace(new RegExp(placeholder, 'g'), stringValue)
    }

    return { htmlContent, textContent, subject }
  }

  private async logEmailActivity(emailData: EmailJobData, result: EmailJobResult): Promise<void> {
    try {
      await prisma.emailLog.create({
        data: {
          jobId: emailData.id,
          recipient: emailData.to,
          subject: emailData.subject,
          templateId: emailData.templateId,
          provider: this.config.provider,
          success: result.success,
          messageId: result.messageId,
          errorMessage: result.error,
          sentAt: result.success ? new Date() : null,
          metadata: {
            executionTime: result.executionTime,
            priority: emailData.priority,
            ...emailData.metadata
          }
        }
      })
    } catch (error) {
      console.error('Failed to log email activity:', error)
    }
  }

  private isRetryableError(error: any): boolean {
    // Define which errors should trigger a retry
    if (error?.code) {
      const retryableCodes = ['ECONNRESET', 'ETIMEDOUT', 'ENOTFOUND']
      return retryableCodes.includes(error.code)
    }
    
    if (error?.status) {
      // HTTP status codes that are retryable
      const retryableStatuses = [429, 500, 502, 503, 504]
      return retryableStatuses.includes(error.status)
    }

    return false
  }

  async getEmailStats(dateRange?: { startDate: Date; endDate: Date }) {
    const where: any = {}
    if (dateRange) {
      where.sentAt = {
        gte: dateRange.startDate,
        lte: dateRange.endDate
      }
    }

    const [total, successful, failed] = await Promise.all([
      prisma.emailLog.count({ where }),
      prisma.emailLog.count({ where: { ...where, success: true } }),
      prisma.emailLog.count({ where: { ...where, success: false } })
    ])

    return {
      total,
      successful,
      failed,
      successRate: total > 0 ? (successful / total) * 100 : 0
    }
  }
}

// Email service factory
export function createEmailService(): EmailService {
  // Use mock service in test environment
  if (process.env.NODE_ENV === 'test') {
    const { createMockEmailService } = require('./email-mock')
    return createMockEmailService()
  }

  const config: EmailConfig = {
    provider: (process.env.EMAIL_PROVIDER as any) || 'SENDGRID',
    sendgrid: {
      apiKey: process.env.SENDGRID_API_KEY || 'mock-key'
    },
    resend: {
      apiKey: process.env.RESEND_API_KEY || 'mock-key'
    },
    supabase: {
      url: process.env.SUPABASE_URL || 'https://mock.supabase.co',
      serviceKey: process.env.SUPABASE_SERVICE_KEY || 'mock-key'
    },
    defaultFrom: process.env.DEFAULT_FROM_EMAIL || 'noreply@caringcompass.com',
    defaultReplyTo: process.env.DEFAULT_REPLY_TO_EMAIL || 'support@caringcompass.com'
  }

  return new EmailService(config)
}

export default EmailService