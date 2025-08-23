# @caring-compass/services

Backend services package for the Caring Compass home care platform. This package provides job queues, notification services, payment processing, file storage, and background workers.

## 🏗️ Architecture

```
packages/services/
├── src/
│   ├── queue/           # Redis & BullMQ configuration
│   ├── jobs/            # Job type definitions
│   ├── notifications/   # Email, SMS, and scheduling
│   ├── integrations/    # Stripe, PandaDoc, etc.
│   ├── storage/         # File storage with Supabase
│   ├── workers/         # Background job processors
│   └── __tests__/       # Test suite
├── dist/                # Built output
└── README.md
```

## 🚀 Quick Start

### Development

```bash
# Install dependencies
pnpm install

# Build the package
pnpm run build

# Run tests
pnpm run test

# Start background workers
pnpm run worker:dev

# Check service health
pnpm run worker:dev health
```

### Production

```bash
# Build for production
pnpm run build

# Start workers
node dist/worker.js start

# Check status
node dist/worker.js health
```

## 📊 Services Overview

### 🔄 Queue Management
- **Redis**: Primary queue storage with BullMQ
- **10 Queue Types**: Email, SMS, reminders, billing, etc.
- **Job Scheduling**: Delayed, recurring, and prioritized jobs
- **Monitoring**: Real-time queue metrics and health checks

### 📧 Notification Services

#### Email Service
- **Providers**: SendGrid, Resend, Supabase
- **Templates**: Pre-built templates for common notifications
- **Features**: HTML/text content, attachments, priority levels
- **Tracking**: Delivery status and error logging

#### SMS Service
- **Provider**: Twilio
- **Templates**: Text-based notification templates  
- **Features**: International support, delivery tracking
- **Rate Limiting**: Automatic batching and delays

#### Notification Scheduler
- **Automated Scheduling**: Visit reminders, credential alerts
- **Cron-based**: Flexible scheduling with timezone support
- **Smart Timing**: 24h, 2h, 30min visit reminders

### 💳 Payment Processing
- **Stripe Integration**: Payment intents, subscriptions, refunds
- **Webhook Handling**: Automatic payment status updates
- **Multiple Methods**: Credit cards, ACH, bank transfers
- **Security**: PCI compliance and fraud detection

### 📁 File Storage
- **Provider**: Supabase Storage (S3 compatible)
- **Features**: Upload, download, compression, thumbnails
- **Security**: Access control, signed URLs, watermarking
- **Processing**: Image optimization, PDF compression

### 🤖 Background Workers
- **10 Worker Types**: Specialized processors for each job type
- **Auto-scaling**: Configurable concurrency per worker
- **Error Handling**: Retry logic with exponential backoff
- **Monitoring**: Real-time job execution tracking

## 🔧 Configuration

### Environment Variables

Required environment variables (see `.env.example`):

```bash
# Redis
REDIS_URL="redis://localhost:6379"

# Email (choose one)
SENDGRID_API_KEY="SG.your-key"
# OR
RESEND_API_KEY="re_your-key"

# SMS
TWILIO_ACCOUNT_SID="AC_your-sid"
TWILIO_AUTH_TOKEN="your-token"
TWILIO_PHONE_NUMBER="+1234567890"

# Payments
STRIPE_SECRET_KEY="sk_test_your-key"
STRIPE_WEBHOOK_SECRET="whsec_your-secret"

# Storage
SUPABASE_URL="https://project.supabase.co"
SUPABASE_SERVICE_KEY="your-service-key"
```

### Service Factory

Use the `ServicesFactory` to get singleton instances:

```typescript
import { ServicesFactory } from '@caring-compass/services'

// Get service instances
const emailService = ServicesFactory.getEmailService()
const smsService = ServicesFactory.getSmsService()
const stripeService = ServicesFactory.getStripeService()
const storageService = ServicesFactory.getFileStorageService()
const scheduler = ServicesFactory.getNotificationScheduler()
```

## 📋 Job Types

### Email Jobs
```typescript
import { JobFactory, QueueManager, QUEUES } from '@caring-compass/services'

const emailJob = JobFactory.createEmailJob({
  to: 'client@example.com',
  subject: 'Visit Reminder',
  templateId: 'visit-reminder-24h',
  templateData: {
    clientName: 'John Doe',
    visitTime: '2:00 PM'
  },
  priority: 'HIGH'
})

await QueueManager.addJob(QUEUES.EMAIL_NOTIFICATIONS, 'visit-reminder', emailJob)
```

### SMS Jobs
```typescript
const smsJob = JobFactory.createSmsJob({
  to: '+15551234567',
  templateId: 'visit-reminder-2h',
  templateData: {
    clientName: 'John Doe',
    visitTime: '2:00 PM'
  },
  priority: 'HIGH'
})

await QueueManager.addJob(QUEUES.SMS_NOTIFICATIONS, 'visit-reminder', smsJob)
```

### Visit Reminder Jobs
```typescript
const reminderJob = JobFactory.createVisitReminderJob({
  visitId: 'visit-123',
  clientId: 'client-123',
  caregiverId: 'caregiver-123',
  reminderType: '24_HOUR',
  visitDate: new Date().toISOString(),
  reminderMethods: ['EMAIL', 'SMS']
})

await QueueManager.addJob(QUEUES.VISIT_REMINDERS, 'visit-reminder', reminderJob)
```

### Invoice Generation
```typescript
const invoiceJob = JobFactory.createInvoiceJob({
  clientId: 'client-123',
  billingPeriod: {
    startDate: startDate.toISOString(),
    endDate: endDate.toISOString()
  },
  autoSend: true
})

await QueueManager.addJob(QUEUES.INVOICE_GENERATION, 'generate-invoice', invoiceJob)
```

### Payment Processing
```typescript
const paymentJob = JobFactory.createPaymentProcessingJob({
  invoiceId: 'invoice-123',
  paymentIntentId: 'pi_stripe_payment_intent',
  amount: 150.00,
  paymentMethod: 'STRIPE'
})

await QueueManager.addJob(QUEUES.PAYMENT_PROCESSING, 'process-payment', paymentJob)
```

## 🔄 Scheduled Jobs

The notification scheduler automatically handles:

### Visit Reminders
- **24 hours before**: Email + SMS to caregiver
- **2 hours before**: SMS to caregiver  
- **30 minutes before**: SMS to caregiver

### Billing Automation
- **Monthly invoices**: 1st of each month at 6 AM
- **Weekly invoices**: Every Monday at 6 AM
- **Overdue reminders**: Daily at 10 AM

### Credential Monitoring
- **30-day warning**: Daily check at 9 AM
- **7-day warning**: Daily check at 9 AM
- **1-day warning**: Daily check at 9 AM
- **Expired alerts**: Daily check at 9 AM

### System Maintenance
- **Database cleanup**: Daily at 2 AM
- **File cleanup**: Daily at 2 AM
- **Health checks**: Daily at 2 AM
- **Metrics collection**: Every hour

## 📊 Monitoring

### Health Checks
```bash
# Check all services
npm run services:health

# Check queue status
npm run services:queues

# View configuration
npm run services:config
```

### Queue Metrics
```typescript
import { QueueMonitor } from '@caring-compass/services'

const metrics = await QueueMonitor.getMetrics()
console.log(metrics)
// {
//   queues: [...],
//   totals: { jobs: 150, queues: 10, healthy: true },
//   timestamp: '2024-01-01T00:00:00.000Z'
// }
```

### Service Health
```typescript
import { ServicesHealthChecker } from '@caring-compass/services'

const health = await ServicesHealthChecker.checkAllServices()
console.log(health)
// {
//   overall: 'healthy',
//   services: {
//     redis: { status: 'healthy', responseTime: 5 },
//     email: { status: 'healthy' },
//     sms: { status: 'healthy' },
//     // ...
//   }
// }
```

## 🧪 Testing

### Unit Tests
```bash
# Run all tests
pnpm test

# Run with coverage
pnpm test -- --coverage

# Watch mode
pnpm test:watch
```

### Integration Tests
```bash
# Test with real services (requires config)
NODE_ENV=test pnpm test
```

### Mock Services
```typescript
import { createMockEmailJob, createMockSmsJob } from '@caring-compass/services'

const emailJob = createMockEmailJob()
const smsJob = createMockSmsJob()
```

## 🚀 Deployment

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY . .
RUN pnpm install --frozen-lockfile
RUN pnpm run build
CMD ["node", "dist/worker.js", "start"]
```

### Kubernetes
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: caring-compass-workers
spec:
  replicas: 3
  selector:
    matchLabels:
      app: caring-compass-workers
  template:
    metadata:
      labels:
        app: caring-compass-workers
    spec:
      containers:
      - name: worker
        image: caring-compass/workers:latest
        env:
        - name: REDIS_URL
          value: "redis://redis:6379"
        - name: NODE_ENV
          value: "production"
```

### Process Manager (PM2)
```javascript
// ecosystem.config.js
module.exports = {
  apps: [{
    name: 'caring-compass-workers',
    script: 'dist/worker.js',
    args: 'start',
    instances: 2,
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production'
    }
  }]
}
```

## 🔒 Security

### Access Control
- **Service Keys**: Secure API key management
- **Row Level Security**: Database-level access control
- **File Permissions**: Granular file access control
- **Audit Logging**: All operations logged with user context

### Data Protection
- **Encryption**: AES-256 at rest, TLS in transit
- **PII Handling**: Secure processing of personal information
- **HIPAA Compliance**: Healthcare data protection standards
- **Data Retention**: Configurable retention policies

## 🐛 Troubleshooting

### Common Issues

#### Redis Connection Failed
```bash
# Check Redis status
redis-cli ping

# Check connection string
echo $REDIS_URL
```

#### Email Delivery Issues
```bash
# Check email service health
npm run services:health

# View email logs
tail -f logs/email.log
```

#### Worker Not Processing Jobs
```bash
# Check queue status
npm run services:queues

# Restart workers
pm2 restart caring-compass-workers
```

### Debug Mode
```bash
# Enable debug logging
DEBUG=true npm run worker:dev
```

## 📚 API Reference

### Service Factory
- `ServicesFactory.getEmailService()`
- `ServicesFactory.getSmsService()`
- `ServicesFactory.getStripeService()`
- `ServicesFactory.getFileStorageService()`

### Queue Management
- `QueueManager.addJob(queue, name, data, options)`
- `QueueManager.addDelayedJob(queue, name, data, delay)`
- `QueueManager.addScheduledJob(queue, name, data, date)`
- `QueueManager.addRecurringJob(queue, name, data, cron)`

### Job Factories
- `JobFactory.createEmailJob(data)`
- `JobFactory.createSmsJob(data)`
- `JobFactory.createVisitReminderJob(data)`
- `JobFactory.createInvoiceJob(data)`
- `JobFactory.createPaymentProcessingJob(data)`

### Utilities
- `ServiceUtils.sendNotification(options)`
- `ServiceUtils.scheduleVisitReminder(options)`
- `ServiceUtils.generateInvoice(options)`
- `ServiceUtils.processPayment(options)`

## 🤝 Contributing

1. Follow TypeScript best practices
2. Add tests for new services
3. Update documentation
4. Use conventional commits
5. Ensure all health checks pass

## 📄 License

Private - Caring Compass Home Care LLC
