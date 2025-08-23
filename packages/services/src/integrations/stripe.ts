import Stripe from 'stripe'
import { PaymentProcessingJobData, PaymentJobResult } from '../jobs/types'
import { getPrismaClient } from '@caring-compass/database/src/utils'

const prisma = getPrismaClient()

// Stripe configuration
interface StripeConfig {
  secretKey: string
  publishableKey: string
  webhookSecret: string
  environment: 'test' | 'live'
  currency: string
  country: string
}

// Payment method types supported
export type PaymentMethodType = 'card' | 'ach_debit' | 'us_bank_account'

// Payment intent metadata
export interface PaymentMetadata {
  invoiceId: string
  clientId: string
  userId: string
  description?: string
  source: 'client_portal' | 'admin' | 'auto_payment'
}

// Customer information for Stripe
export interface CustomerInfo {
  email: string
  name: string
  phone?: string
  address?: {
    line1: string
    line2?: string
    city: string
    state: string
    postal_code: string
    country: string
  }
}

// Payment intent creation options
export interface CreatePaymentIntentOptions {
  amount: number // Amount in cents
  currency?: string
  paymentMethodTypes?: PaymentMethodType[]
  metadata: PaymentMetadata
  customerId?: string
  customerInfo?: CustomerInfo
  description?: string
  receiptEmail?: string
  setupFutureUsage?: 'on_session' | 'off_session'
  automaticPaymentMethods?: boolean
}

// Subscription options for recurring payments
export interface SubscriptionOptions {
  customerId: string
  priceId: string
  metadata: Record<string, string>
  trialPeriodDays?: number
  prorationBehavior?: 'create_prorations' | 'none'
}

// Stripe service class
export class StripeService {
  private stripe: Stripe
  private config: StripeConfig

  constructor(config: StripeConfig) {
    this.config = config
    this.stripe = new Stripe(config.secretKey, {
      apiVersion: '2023-10-16',
      typescript: true,
    })
  }

  // Payment Intent Management
  async createPaymentIntent(options: CreatePaymentIntentOptions): Promise<Stripe.PaymentIntent> {
    try {
      const paymentIntentData: Stripe.PaymentIntentCreateParams = {
        amount: options.amount,
        currency: options.currency || this.config.currency,
        metadata: options.metadata,
        description: options.description,
        receipt_email: options.receiptEmail,
        setup_future_usage: options.setupFutureUsage,
      }

      // Handle customer
      if (options.customerId) {
        paymentIntentData.customer = options.customerId
      } else if (options.customerInfo) {
        const customer = await this.createOrUpdateCustomer(options.customerInfo)
        paymentIntentData.customer = customer.id
      }

      // Set payment method types
      if (options.paymentMethodTypes) {
        paymentIntentData.payment_method_types = options.paymentMethodTypes
      } else if (options.automaticPaymentMethods) {
        paymentIntentData.automatic_payment_methods = { enabled: true }
      } else {
        paymentIntentData.payment_method_types = ['card']
      }

      const paymentIntent = await this.stripe.paymentIntents.create(paymentIntentData)

      // Log payment intent creation
      await this.logPaymentActivity('payment_intent_created', {
        paymentIntentId: paymentIntent.id,
        amount: options.amount,
        currency: paymentIntent.currency,
        customerId: paymentIntent.customer as string,
        metadata: options.metadata
      })

      return paymentIntent

    } catch (error) {
      console.error('Error creating payment intent:', error)
      throw new Error(`Failed to create payment intent: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  async confirmPaymentIntent(
    paymentIntentId: string,
    paymentMethodId?: string
  ): Promise<Stripe.PaymentIntent> {
    try {
      const confirmParams: Stripe.PaymentIntentConfirmParams = {}
      
      if (paymentMethodId) {
        confirmParams.payment_method = paymentMethodId
      }

      const paymentIntent = await this.stripe.paymentIntents.confirm(
        paymentIntentId,
        confirmParams
      )

      await this.logPaymentActivity('payment_intent_confirmed', {
        paymentIntentId: paymentIntent.id,
        status: paymentIntent.status,
        paymentMethodId
      })

      return paymentIntent

    } catch (error) {
      console.error('Error confirming payment intent:', error)
      throw new Error(`Failed to confirm payment intent: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  async retrievePaymentIntent(paymentIntentId: string): Promise<Stripe.PaymentIntent> {
    return await this.stripe.paymentIntents.retrieve(paymentIntentId)
  }

  async cancelPaymentIntent(paymentIntentId: string): Promise<Stripe.PaymentIntent> {
    const paymentIntent = await this.stripe.paymentIntents.cancel(paymentIntentId)
    
    await this.logPaymentActivity('payment_intent_cancelled', {
      paymentIntentId: paymentIntent.id
    })

    return paymentIntent
  }

  // Customer Management
  async createOrUpdateCustomer(customerInfo: CustomerInfo): Promise<Stripe.Customer> {
    try {
      // Check if customer already exists
      const existingCustomers = await this.stripe.customers.list({
        email: customerInfo.email,
        limit: 1
      })

      if (existingCustomers.data.length > 0) {
        // Update existing customer
        const customer = await this.stripe.customers.update(existingCustomers.data[0].id, {
          name: customerInfo.name,
          phone: customerInfo.phone,
          address: customerInfo.address
        })
        return customer
      } else {
        // Create new customer
        const customer = await this.stripe.customers.create({
          email: customerInfo.email,
          name: customerInfo.name,
          phone: customerInfo.phone,
          address: customerInfo.address
        })
        return customer
      }
    } catch (error) {
      console.error('Error managing customer:', error)
      throw new Error(`Failed to manage customer: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  async getCustomer(customerId: string): Promise<Stripe.Customer> {
    return await this.stripe.customers.retrieve(customerId) as Stripe.Customer
  }

  async updateCustomer(customerId: string, updates: Partial<CustomerInfo>): Promise<Stripe.Customer> {
    return await this.stripe.customers.update(customerId, updates)
  }

  async deleteCustomer(customerId: string): Promise<Stripe.DeletedCustomer> {
    return await this.stripe.customers.del(customerId)
  }

  // Payment Methods
  async createSetupIntent(customerId: string, paymentMethodTypes: PaymentMethodType[] = ['card']): Promise<Stripe.SetupIntent> {
    return await this.stripe.setupIntents.create({
      customer: customerId,
      payment_method_types: paymentMethodTypes,
      usage: 'off_session'
    })
  }

  async listPaymentMethods(customerId: string, type: PaymentMethodType = 'card'): Promise<Stripe.PaymentMethod[]> {
    const paymentMethods = await this.stripe.paymentMethods.list({
      customer: customerId,
      type
    })
    return paymentMethods.data
  }

  async detachPaymentMethod(paymentMethodId: string): Promise<Stripe.PaymentMethod> {
    return await this.stripe.paymentMethods.detach(paymentMethodId)
  }

  // Refunds
  async createRefund(
    paymentIntentId: string,
    amount?: number,
    reason?: 'duplicate' | 'fraudulent' | 'requested_by_customer'
  ): Promise<Stripe.Refund> {
    try {
      const refundParams: Stripe.RefundCreateParams = {
        payment_intent: paymentIntentId,
        reason
      }

      if (amount) {
        refundParams.amount = amount
      }

      const refund = await this.stripe.refunds.create(refundParams)

      await this.logPaymentActivity('refund_created', {
        refundId: refund.id,
        paymentIntentId,
        amount: refund.amount,
        reason
      })

      return refund

    } catch (error) {
      console.error('Error creating refund:', error)
      throw new Error(`Failed to create refund: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  // Subscriptions (for recurring payments)
  async createSubscription(options: SubscriptionOptions): Promise<Stripe.Subscription> {
    try {
      const subscription = await this.stripe.subscriptions.create({
        customer: options.customerId,
        items: [{ price: options.priceId }],
        metadata: options.metadata,
        trial_period_days: options.trialPeriodDays,
        proration_behavior: options.prorationBehavior,
        expand: ['latest_invoice.payment_intent']
      })

      await this.logPaymentActivity('subscription_created', {
        subscriptionId: subscription.id,
        customerId: options.customerId,
        priceId: options.priceId
      })

      return subscription

    } catch (error) {
      console.error('Error creating subscription:', error)
      throw new Error(`Failed to create subscription: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  async cancelSubscription(subscriptionId: string, cancelAtPeriodEnd: boolean = false): Promise<Stripe.Subscription> {
    const subscription = await this.stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: cancelAtPeriodEnd
    })

    if (!cancelAtPeriodEnd) {
      await this.stripe.subscriptions.cancel(subscriptionId)
    }

    await this.logPaymentActivity('subscription_cancelled', {
      subscriptionId,
      cancelAtPeriodEnd
    })

    return subscription
  }

  // Webhook handling
  async constructWebhookEvent(payload: string | Buffer, signature: string): Promise<Stripe.Event> {
    try {
      return this.stripe.webhooks.constructEvent(
        payload,
        signature,
        this.config.webhookSecret
      )
    } catch (error) {
      console.error('Webhook signature verification failed:', error)
      throw new Error('Webhook signature verification failed')
    }
  }

  async handleWebhookEvent(event: Stripe.Event): Promise<void> {
    try {
      console.log(`Processing webhook event: ${event.type}`)

      switch (event.type) {
        case 'payment_intent.succeeded':
          await this.handlePaymentSucceeded(event.data.object as Stripe.PaymentIntent)
          break

        case 'payment_intent.payment_failed':
          await this.handlePaymentFailed(event.data.object as Stripe.PaymentIntent)
          break

        case 'payment_intent.requires_action':
          await this.handlePaymentRequiresAction(event.data.object as Stripe.PaymentIntent)
          break

        case 'customer.subscription.created':
        case 'customer.subscription.updated':
        case 'customer.subscription.deleted':
          await this.handleSubscriptionEvent(event.data.object as Stripe.Subscription, event.type)
          break

        case 'invoice.payment_succeeded':
          await this.handleInvoicePaymentSucceeded(event.data.object as Stripe.Invoice)
          break

        case 'invoice.payment_failed':
          await this.handleInvoicePaymentFailed(event.data.object as Stripe.Invoice)
          break

        default:
          console.log(`Unhandled webhook event type: ${event.type}`)
      }

      // Log webhook processing
      await this.logPaymentActivity('webhook_processed', {
        eventId: event.id,
        eventType: event.type,
        processed: true
      })

    } catch (error) {
      console.error(`Error processing webhook event ${event.type}:`, error)
      
      await this.logPaymentActivity('webhook_error', {
        eventId: event.id,
        eventType: event.type,
        error: error instanceof Error ? error.message : 'Unknown error'
      })
      
      throw error
    }
  }

  private async handlePaymentSucceeded(paymentIntent: Stripe.PaymentIntent): Promise<void> {
    const metadata = paymentIntent.metadata as PaymentMetadata

    if (metadata.invoiceId) {
      // Update invoice status to paid
      await prisma.invoice.update({
        where: { id: metadata.invoiceId },
        data: {
          status: 'PAID',
          paidAt: new Date(),
          payments: {
            create: {
              amount: paymentIntent.amount / 100, // Convert from cents
              currency: paymentIntent.currency.toUpperCase(),
              paymentMethod: 'STRIPE',
              stripePaymentIntentId: paymentIntent.id,
              status: 'COMPLETED',
              processedAt: new Date(),
              metadata: {
                stripeChargeId: paymentIntent.charges.data[0]?.id,
                paymentMethodType: paymentIntent.charges.data[0]?.payment_method_details?.type
              }
            }
          }
        }
      })

      // Send payment confirmation notification
      // This would trigger an email/SMS job
    }
  }

  private async handlePaymentFailed(paymentIntent: Stripe.PaymentIntent): Promise<void> {
    const metadata = paymentIntent.metadata as PaymentMetadata

    if (metadata.invoiceId) {
      // Log failed payment attempt
      await prisma.payment.create({
        data: {
          invoiceId: metadata.invoiceId,
          amount: paymentIntent.amount / 100,
          currency: paymentIntent.currency.toUpperCase(),
          paymentMethod: 'STRIPE',
          stripePaymentIntentId: paymentIntent.id,
          status: 'FAILED',
          metadata: {
            failureReason: paymentIntent.last_payment_error?.message,
            failureCode: paymentIntent.last_payment_error?.code
          }
        }
      })

      // Send payment failure notification
      // This would trigger an email/SMS job
    }
  }

  private async handlePaymentRequiresAction(paymentIntent: Stripe.PaymentIntent): Promise<void> {
    // Handle 3D Secure or other authentication requirements
    console.log(`Payment ${paymentIntent.id} requires additional action`)
    
    // Update payment status to indicate action required
    const metadata = paymentIntent.metadata as PaymentMetadata
    if (metadata.invoiceId) {
      await prisma.payment.create({
        data: {
          invoiceId: metadata.invoiceId,
          amount: paymentIntent.amount / 100,
          currency: paymentIntent.currency.toUpperCase(),
          paymentMethod: 'STRIPE',
          stripePaymentIntentId: paymentIntent.id,
          status: 'REQUIRES_ACTION',
          metadata: {
            nextAction: paymentIntent.next_action?.type,
            clientSecret: paymentIntent.client_secret
          }
        }
      })
    }
  }

  private async handleSubscriptionEvent(subscription: Stripe.Subscription, eventType: string): Promise<void> {
    // Handle subscription lifecycle events
    console.log(`Subscription ${subscription.id} event: ${eventType}`)
    
    // This would update subscription records in your database
    // For now, just log the event
  }

  private async handleInvoicePaymentSucceeded(invoice: Stripe.Invoice): Promise<void> {
    // Handle successful subscription invoice payments
    console.log(`Invoice ${invoice.id} payment succeeded`)
  }

  private async handleInvoicePaymentFailed(invoice: Stripe.Invoice): Promise<void> {
    // Handle failed subscription invoice payments
    console.log(`Invoice ${invoice.id} payment failed`)
  }

  // Analytics and reporting
  async getPaymentStats(dateRange?: { startDate: Date; endDate: Date }) {
    const where: any = {}
    if (dateRange) {
      where.processedAt = {
        gte: dateRange.startDate,
        lte: dateRange.endDate
      }
    }

    const [
      totalPayments,
      successfulPayments,
      failedPayments,
      totalAmount,
      averageAmount
    ] = await Promise.all([
      prisma.payment.count({ where }),
      prisma.payment.count({ where: { ...where, status: 'COMPLETED' } }),
      prisma.payment.count({ where: { ...where, status: 'FAILED' } }),
      prisma.payment.aggregate({
        where: { ...where, status: 'COMPLETED' },
        _sum: { amount: true }
      }),
      prisma.payment.aggregate({
        where: { ...where, status: 'COMPLETED' },
        _avg: { amount: true }
      })
    ])

    return {
      totalPayments,
      successfulPayments,
      failedPayments,
      successRate: totalPayments > 0 ? (successfulPayments / totalPayments) * 100 : 0,
      totalAmount: totalAmount._sum.amount || 0,
      averageAmount: averageAmount._avg.amount || 0
    }
  }

  private async logPaymentActivity(action: string, data: any): Promise<void> {
    try {
      await prisma.auditLog.create({
        data: {
          action,
          resourceType: 'PAYMENT',
          resourceId: data.paymentIntentId || data.subscriptionId || data.eventId || 'unknown',
          details: `Stripe ${action}`,
          metadata: data,
          timestamp: new Date()
        }
      })
    } catch (error) {
      console.error('Failed to log payment activity:', error)
    }
  }

  // Test helper methods
  async createTestPaymentMethod(customerId: string): Promise<Stripe.PaymentMethod> {
    if (this.config.environment !== 'test') {
      throw new Error('Test payment methods can only be created in test mode')
    }

    return await this.stripe.paymentMethods.create({
      type: 'card',
      card: {
        number: '4242424242424242',
        exp_month: 12,
        exp_year: 2025,
        cvc: '123'
      }
    })
  }
}

// Stripe service factory
export function createStripeService(): StripeService {
  const config: StripeConfig = {
    secretKey: process.env.STRIPE_SECRET_KEY!,
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY!,
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET!,
    environment: process.env.NODE_ENV === 'production' ? 'live' : 'test',
    currency: process.env.DEFAULT_CURRENCY || 'usd',
    country: process.env.DEFAULT_COUNTRY || 'US'
  }

  return new StripeService(config)
}

export default StripeService