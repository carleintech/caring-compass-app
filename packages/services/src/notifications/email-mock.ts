import { EmailJobData, EmailJobResult } from '../jobs/types'

// Mock email service for testing
export class MockEmailService {
  async sendEmail(jobData: EmailJobData): Promise<EmailJobResult> {
    // Simulate email sending
    const success = !jobData.to.includes('invalid')
    
    if (success) {
      return {
        success: true,
        messageId: `mock-email-${Date.now()}`,
        deliveryStatus: 'sent',
        message: 'Email sent successfully (mock)',
        executionTime: 100
      }
    } else {
      return {
        success: false,
        error: 'Invalid email address (mock)',
        executionTime: 50,
        retryable: false
      }
    }
  }

  async getEmailStats() {
    return {
      total: 100,
      successful: 95,
      failed: 5,
      successRate: 95
    }
  }
}

export function createMockEmailService(): MockEmailService {
  return new MockEmailService()
}
