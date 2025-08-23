import { Job } from 'bullmq'
import { 
  EmailJobData, 
  SmsJobData, 
  PaymentJobData,
  FileJobData,
  NotificationJobData,
  EmailJobResult,
  SmsJobResult,
  PaymentJobResult,
  FileJobResult,
  NotificationJobResult
} from './types'

export class JobFactory {
  static createEmailJob(data: Omit<EmailJobData, 'id' | 'timestamp'>): EmailJobData {
    return {
      id: this.generateId(),
      timestamp: new Date(),
      ...data,
      type: 'email'
    }
  }

  static createSmsJob(data: Omit<SmsJobData, 'id' | 'timestamp'>): SmsJobData {
    return {
      id: this.generateId(),
      timestamp: new Date(),
      ...data,
      type: 'sms'
    }
  }

  static createPaymentJob(data: Omit<PaymentJobData, 'id' | 'timestamp'>): PaymentJobData {
    return {
      id: this.generateId(),
      timestamp: new Date(),
      ...data,
      type: 'payment'
    }
  }

  static createFileJob(data: Omit<FileJobData, 'id' | 'timestamp'>): FileJobData {
    return {
      id: this.generateId(),
      timestamp: new Date(),
      ...data,
      type: 'file'
    }
  }

  static createNotificationJob(data: Omit<NotificationJobData, 'id' | 'timestamp'>): NotificationJobData {
    return {
      id: this.generateId(),
      timestamp: new Date(),
      ...data,
      type: 'notification'
    }
  }

  private static generateId(): string {
    return `job_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }
}
