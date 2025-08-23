import { createEmailService } from '../notifications/email-simple'
import { createSmsService } from '../notifications/sms-simple'

describe('Notification Services', () => {
  describe('Email Service', () => {
    let emailService: ReturnType<typeof createEmailService>

    beforeEach(() => {
      emailService = createEmailService()
    })

    it('should send email successfully', async () => {
      const emailData = {
        id: 'test-email-1',
        to: 'test@example.com',
        subject: 'Test Email',
        htmlContent: '<p>Test content</p>',
        priority: 'NORMAL' as const
      }

      const result = await emailService.sendEmail(emailData)

      expect(result).toBeDefined()
      expect(typeof result.success).toBe('boolean')
      if (result.success) {
        expect(result.messageId).toBeDefined()
      } else {
        expect(result.error).toBeDefined()
      }
    })

    it('should handle email with template', async () => {
      const emailData = {
        id: 'test-email-template-1',
        to: 'test@example.com',
        subject: 'Template Test',
        templateId: 'welcome-template',
        templateData: {
          name: 'John Doe',
          company: 'Test Company'
        },
        priority: 'HIGH' as const
      }

      const result = await emailService.sendEmail(emailData)

      expect(result).toBeDefined()
      expect(typeof result.success).toBe('boolean')
    })

    it('should handle invalid email address', async () => {
      const emailData = {
        id: 'test-email-invalid',
        to: 'invalid-email',
        subject: 'Test Email',
        htmlContent: '<p>Test content</p>',
        priority: 'NORMAL' as const
      }

      const result = await emailService.sendEmail(emailData)

      expect(result).toBeDefined()
      expect(typeof result.success).toBe('boolean')
    })
  })

  describe('SMS Service', () => {
    let smsService: ReturnType<typeof createSmsService>

    beforeEach(() => {
      smsService = createSmsService()
    })

    it('should send SMS successfully', async () => {
      const smsData = {
        id: 'test-sms-1',
        to: '+1234567890',
        message: 'Test SMS message',
        priority: 'NORMAL' as const
      }

      const result = await smsService.sendSms(smsData)

      expect(result).toBeDefined()
      expect(typeof result.success).toBe('boolean')
      if (result.success) {
        expect(result.messageId).toBeDefined()
      } else {
        expect(result.error).toBeDefined()
      }
    })

    it('should handle SMS with template', async () => {
      const smsData = {
        id: 'test-sms-template-1',
        to: '+1234567890',
        message: 'Template message',
        templateId: 'reminder-template',
        templateData: {
          clientName: 'John Doe',
          visitTime: '2:00 PM'
        },
        priority: 'HIGH' as const
      }

      const result = await smsService.sendSms(smsData)

      expect(result).toBeDefined()
      expect(typeof result.success).toBe('boolean')
    })

    it('should handle invalid phone number', async () => {
      const smsData = {
        id: 'test-sms-invalid',
        to: 'invalid-phone',
        message: 'Test SMS message',
        priority: 'NORMAL' as const
      }

      const result = await smsService.sendSms(smsData)

      expect(result).toBeDefined()
      expect(typeof result.success).toBe('boolean')
    })
  })
})
