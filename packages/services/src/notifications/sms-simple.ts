import { SmsJobData, SmsJobResult } from '../jobs/types'

// Simplified SMS service for testing
export class SimpleSmsService {
  async sendSms(jobData: SmsJobData): Promise<SmsJobResult> {
    // Mock SMS sending
    const success = !jobData.to.includes('invalid')
    
    if (success) {
      return {
        success: true,
        messageId: `mock-sms-${Date.now()}`,
        deliveryStatus: 'sent',
        message: 'SMS sent successfully (mock)',
        executionTime: 80
      }
    } else {
      return {
        success: false,
        error: 'Invalid phone number (mock)',
        executionTime: 30,
        retryable: false
      }
    }
  }

  async getSmsStats() {
    return {
      total: 50,
      successful: 48,
      failed: 2,
      successRate: 96
    }
  }
}

export function createSmsService(): SimpleSmsService {
  return new SimpleSmsService()
}

export default SimpleSmsService
