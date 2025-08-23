import { TRPCError } from '@trpc/server'
import { z } from 'zod'
import { UserRole } from '@caring-compass/database'
import { 
  createTRPCRouter, 
  protectedProcedure, 
  staffProcedure,
  clientProcedure,
  createCRUDProcedures,
  handleDatabaseError,
  createPaginationQuery,
  createPaginatedResponse,
  checkResourceAccess
} from '../trpc/trpc'
import { billingSchemas } from '../schemas'

export const billingRouter = createTRPCRouter({
  // ===== INVOICE MANAGEMENT =====

  /**
   * Create a new invoice
   */
  createInvoice: staffProcedure
    .input(billingSchemas.invoiceCreate)
    .output(billingSchemas.invoiceWithDetails)
    .mutation(async ({ ctx, input }) => {
      try {
        const result = await ctx.prisma.$transaction(async (tx) => {
          // Auto-calculate from visits if requested
          let lineItems = input.lineItems
          
          if (input.autoCalculateFromPeriod) {
            const visits = await tx.visit.findMany({
              where: {
                clientId: input.clientId,
                status: 'COMPLETED',
                scheduledStart: {
                  gte: input.billingPeriod.startDate,
                  lte: input.billingPeriod.endDate
                },
                // Only include visits not already invoiced
                NOT: {
                  lineItems: {
                    some: {}
                  }
                }
              },
              include: {
                caregiver: { select: { firstName: true, lastName: true } }
              }
            })

            // Group visits by caregiver and create line items
            const visitsByCaregiver = visits.reduce((acc, visit) => {
              const key = visit.caregiverId || 'unassigned'
              if (!acc[key]) acc[key] = []
              acc[key].push(visit)
              return acc
            }, {} as Record<string, any[]>)

            lineItems = Object.entries(visitsByCaregiver).map(([caregiverId, visits]) => {
              const totalHours = visits.reduce((sum, visit) => sum + (visit.billableHours || 0), 0)
              const caregiver = visits[0]?.caregiver
              const description = caregiver 
                ? `Care services by ${caregiver.firstName} ${caregiver.lastName}`
                : 'Care services'

              return {
                description,
                quantity: totalHours,
                unitPrice: 25.00, // This should come from rate cards
                totalPrice: totalHours * 25.00,
                visitId: undefined // Multiple visits, can't link to single visit
              }
            })
          }

          // Calculate totals
          const subtotal = lineItems.reduce((sum, item) => sum + item.totalPrice, 0)
          const taxAmount = input.taxAmount || (subtotal * 0.0575) // Default VA sales tax
          const totalAmount = subtotal + taxAmount

          // Generate invoice number
          const invoiceNumber = await generateInvoiceNumber(tx)

          // Create invoice
          const invoice = await tx.invoice.create({
            data: {
              clientId: input.clientId,
              invoiceNumber,
              billingPeriod: input.billingPeriod,
              subtotal,
              taxAmount,
              totalAmount,
              status: 'DRAFT',
              dueDate: input.dueDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
              notes: input.notes
            }
          })

          // Create line items
          await tx.invoiceLineItem.createMany({
            data: lineItems.map(item => ({
              invoiceId: invoice.id,
              description: item.description,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              totalPrice: item.totalPrice,
              visitId: item.visitId
            }))
          })

          return invoice.id
        })

        // Return invoice with details
        return await getInvoiceWithDetails(ctx, result)
      } catch (error) {
        handleDatabaseError(error)
      }
    }),

  /**
   * Get invoice by ID
   */
  getInvoiceById: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .output(billingSchemas.invoiceWithDetails)
    .query(async ({ ctx, input }) => {
      try {
        const invoice = await getInvoiceWithDetails(ctx, input.id)

        if (!invoice) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Invoice not found'
          })
        }

        // Check access permissions
        const hasAccess = 
          checkResourceAccess(ctx.user, invoice.client.id, [UserRole.ADMIN, UserRole.COORDINATOR]) ||
          (ctx.user.role === UserRole.CLIENT && await isClientOwner(ctx, ctx.user.id, invoice.clientId)) ||
          (ctx.user.role === UserRole.FAMILY && await isFamilyMemberOfClient(ctx, ctx.user.id, invoice.clientId))

        if (!hasAccess) {
          throw new TRPCError({
            code: 'FORBIDDEN',
            message: 'Access denied'
          })
        }

        return invoice
      } catch (error) {
        if (error instanceof TRPCError) throw error
        handleDatabaseError(error)
      }
    }),

  /**
   * Update invoice
   */
  updateInvoice: staffProcedure
    .input(z.object({
      id: z.string().uuid(),
      data: billingSchemas.invoiceUpdate
    }))
    .output(billingSchemas.invoice)
    .mutation(async ({ ctx, input }) => {
      try {
        const updatedInvoice = await ctx.prisma.invoice.update({
          where: { id: input.id },
          data: input.data
        })

        return updatedInvoice
      } catch (error) {
        handleDatabaseError(error)
      }
    }),

  /**
   * Search invoices
   */
  searchInvoices: protectedProcedure
    .input(billingSchemas.invoiceSearch)
    .query(async ({ ctx, input }) => {
      try {
        const { page, limit, clientId, status, billingPeriodRange, dueDateRange, amountRange, isOverdue } = input
        const { skip, take } = createPaginationQuery(page, limit)

        let where: any = {}

        // Role-based filtering
        if (ctx.user.role === UserRole.CLIENT) {
          const userClientId = await getClientIdForUser(ctx, ctx.user.id)
          where.clientId = userClientId
        } else if (ctx.user.role === UserRole.FAMILY) {
          const familyClientId = await getFamilyMemberClientId(ctx, ctx.user.id)
          if (familyClientId) {
            where.clientId = familyClientId
          } else {
            where.clientId = 'non-existent'
          }
        }

        // Apply filters
        if (clientId) where.clientId = clientId
        if (status) where.status = status
        if (billingPeriodRange) {
          where.billingPeriod = {
            path: ['startDate'],
            gte: billingPeriodRange.from,
            lte: billingPeriodRange.to
          }
        }
        if (dueDateRange) {
          where.dueDate = {
            gte: dueDateRange.from,
            lte: dueDateRange.to
          }
        }
        if (amountRange) {
          where.totalAmount = {
            gte: amountRange.min,
            lte: amountRange.max
          }
        }
        if (isOverdue) {
          where.dueDate = { lt: new Date() }
          where.status = { in: ['ISSUED', 'OVERDUE'] }
        }

        const [invoices, totalCount] = await Promise.all([
          ctx.prisma.invoice.findMany({
            where,
            skip,
            take,
            include: {
              client: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                  primaryPhone: true,
                  user: { select: { email: true } }
                }
              },
              lineItems: true,
              payments: {
                select: {
                  amount: true,
                  status: true,
                  processedAt: true
                }
              }
            },
            orderBy: { createdAt: 'desc' }
          }),
          ctx.prisma.invoice.count({ where })
        ])

        // Calculate remaining balance for each invoice
        const invoicesWithBalance = invoices.map(invoice => {
          const paidAmount = invoice.payments
            .filter(p => p.status === 'COMPLETED')
            .reduce((sum, p) => sum + p.amount, 0)
          
          return {
            ...invoice,
            remainingBalance: invoice.totalAmount - paidAmount,
            isOverdue: invoice.dueDate ? invoice.dueDate < new Date() && invoice.status !== 'PAID' : false
          }
        })

        return createPaginatedResponse(invoicesWithBalance, totalCount, page, limit)
      } catch (error) {
        handleDatabaseError(error)
      }
    }),

  /**
   * Issue invoice (send to client)
   */
  issueInvoice: staffProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      try {
        const invoice = await ctx.prisma.invoice.findUnique({
          where: { id: input.id },
          include: { client: { include: { user: true } } }
        })

        if (!invoice) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Invoice not found'
          })
        }

        if (invoice.status !== 'DRAFT' && invoice.status !== 'PENDING_APPROVAL') {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Invoice cannot be issued in current status'
          })
        }

        const issuedInvoice = await ctx.prisma.invoice.update({
          where: { id: input.id },
          data: {
            status: 'ISSUED',
            issuedAt: new Date()
          }
        })

        // Send invoice email to client
        await sendInvoiceEmail(invoice.client.user.email, invoice)

        return { success: true, invoice: issuedInvoice }
      } catch (error) {
        if (error instanceof TRPCError) throw error
        handleDatabaseError(error)
      }
    }),

  // ===== PAYMENT MANAGEMENT =====

  /**
   * Create payment
   */
  createPayment: protectedProcedure
    .input(billingSchemas.paymentCreate)
    .output(billingSchemas.payment)
    .mutation(async ({ ctx, input }) => {
      try {
        const invoice = await ctx.prisma.invoice.findUnique({
          where: { id: input.invoiceId },
          include: { client: true }
        })

        if (!invoice) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Invoice not found'
          })
        }

        // Check access permissions
        const hasAccess = 
          checkResourceAccess(ctx.user, invoice.client.userId, [UserRole.ADMIN, UserRole.COORDINATOR]) ||
          (ctx.user.role === UserRole.CLIENT && await isClientOwner(ctx, ctx.user.id, invoice.clientId)) ||
          (ctx.user.role === UserRole.FAMILY && await isFamilyMemberOfClient(ctx, ctx.user.id, invoice.clientId))

        if (!hasAccess) {
          throw new TRPCError({
            code: 'FORBIDDEN',
            message: 'Access denied'
          })
        }

        const payment = await ctx.prisma.payment.create({
          data: {
            invoiceId: input.invoiceId,
            amount: input.amount,
            paymentMethod: input.paymentMethod,
            status: 'PENDING',
            stripePaymentIntentId: input.stripePaymentIntentId,
            externalTransactionId: input.externalTransactionId,
            notes: input.notes
          }
        })

        // If it's a Stripe payment, the webhook will update the status
        // For other payment methods, mark as completed immediately
        if (input.paymentMethod !== 'CREDIT_CARD') {
          await ctx.prisma.payment.update({
            where: { id: payment.id },
            data: {
              status: 'COMPLETED',
              processedAt: new Date()
            }
          })

          // Check if invoice is fully paid
          await updateInvoicePaymentStatus(ctx, input.invoiceId)
        }

        return payment
      } catch (error) {
        if (error instanceof TRPCError) throw error
        handleDatabaseError(error)
      }
    }),

  /**
   * Get payments for invoice
   */
  getInvoicePayments: protectedProcedure
    .input(z.object({ invoiceId: z.string().uuid() }))
    .output(z.array(billingSchemas.payment))
    .query(async ({ ctx, input }) => {
      try {
        const invoice = await ctx.prisma.invoice.findUnique({
          where: { id: input.invoiceId },
          include: { client: true }
        })

        if (!invoice) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Invoice not found'
          })
        }

        // Check access permissions
        const hasAccess = 
          checkResourceAccess(ctx.user, invoice.client.userId, [UserRole.ADMIN, UserRole.COORDINATOR]) ||
          (ctx.user.role === UserRole.CLIENT && await isClientOwner(ctx, ctx.user.id, invoice.clientId))

        if (!hasAccess) {
          throw new TRPCError({
            code: 'FORBIDDEN',
            message: 'Access denied'
          })
        }

        const payments = await ctx.prisma.payment.findMany({
          where: { invoiceId: input.invoiceId },
          orderBy: { createdAt: 'desc' }
        })

        return payments
      } catch (error) {
        if (error instanceof TRPCError) throw error
        handleDatabaseError(error)
      }
    }),

  // ===== STRIPE INTEGRATION =====

  /**
   * Create Stripe payment intent
   */
  createStripePaymentIntent: protectedProcedure
    .input(billingSchemas.stripePaymentIntentCreate)
    .mutation(async ({ ctx, input }) => {
      try {
        const invoice = await ctx.prisma.invoice.findUnique({
          where: { id: input.invoiceId },
          include: { client: { include: { user: true } } }
        })

        if (!invoice) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Invoice not found'
          })
        }

        // Check access permissions
        const hasAccess = 
          (ctx.user.role === UserRole.CLIENT && await isClientOwner(ctx, ctx.user.id, invoice.clientId)) ||
          (ctx.user.role === UserRole.FAMILY && await isFamilyMemberOfClient(ctx, ctx.user.id, invoice.clientId))

        if (!hasAccess) {
          throw new TRPCError({
            code: 'FORBIDDEN',
            message: 'Access denied'
          })
        }

        // Create Stripe customer if doesn't exist
        let stripeCustomerId = await getStripeCustomerId(ctx, invoice.clientId)
        if (!stripeCustomerId) {
          stripeCustomerId = await createStripeCustomer(ctx, invoice.client)
        }

        // Create payment intent via Stripe API
        const paymentIntent = await createStripePaymentIntentAPI({
          amount: Math.round(input.amount * 100), // Convert to cents
          currency: input.currency,
          customer: stripeCustomerId,
          payment_method: input.paymentMethodId,
          confirm: input.automaticConfirmation,
          metadata: {
            invoiceId: input.invoiceId,
            clientId: invoice.clientId
          }
        })

        return {
          clientSecret: paymentIntent.client_secret,
          paymentIntentId: paymentIntent.id,
          status: paymentIntent.status
        }
      } catch (error) {
        if (error instanceof TRPCError) throw error
        handleDatabaseError(error)
      }
    }),

  /**
   * Handle Stripe webhook
   */
  handleStripeWebhook: protectedProcedure
    .input(billingSchemas.stripeWebhook)
    .mutation(async ({ ctx, input }) => {
      try {
        const { type, data } = input

        switch (type) {
          case 'payment_intent.succeeded':
            await handlePaymentSuccess(ctx, data.object)
            break
          case 'payment_intent.payment_failed':
            await handlePaymentFailure(ctx, data.object)
            break
          case 'charge.dispute.created':
            await handleChargeDispute(ctx, data.object)
            break
          default:
            console.log(`Unhandled webhook event type: ${type}`)
        }

        return { success: true }
      } catch (error) {
        handleDatabaseError(error)
      }
    }),

  // ===== BILLING STATISTICS =====

  /**
   * Get billing statistics
   */
  getBillingStats: staffProcedure
    .input(z.object({
      dateRange: z.object({
        from: z.date(),
        to: z.date()
      }).optional()
    }))
    .output(billingSchemas.billingStats)
    .query(async ({ ctx, input }) => {
      try {
        const { dateRange } = input
        const where: any = {}
        
        if (dateRange) {
          where.createdAt = {
            gte: dateRange.from,
            lte: dateRange.to
          }
        }

        const [
          totalRevenue,
          outstandingInvoices,
          overdueInvoices,
          invoiceStats
        ] = await Promise.all([
          ctx.prisma.payment.aggregate({
            where: { status: 'COMPLETED', ...where },
            _sum: { amount: true }
          }),
          ctx.prisma.invoice.aggregate({
            where: { status: { in: ['ISSUED', 'OVERDUE'] } },
            _sum: { totalAmount: true }
          }),
          ctx.prisma.invoice.aggregate({
            where: { 
              status: 'OVERDUE',
              dueDate: { lt: new Date() }
            },
            _sum: { totalAmount: true }
          }),
          ctx.prisma.invoice.aggregate({
            where,
            _avg: { totalAmount: true },
            _count: true
          })
        ])

        // Get monthly trends
        const monthlyTrends = await getMonthlyBillingTrends(ctx, dateRange)

        // Calculate payment metrics
        const paidInvoices = await ctx.prisma.invoice.count({
          where: { status: 'PAID', ...where }
        })
        
        const totalInvoices = invoiceStats._count
        const paymentRate = totalInvoices > 0 ? (paidInvoices / totalInvoices) * 100 : 0

        // Calculate average days to payment
        const averageDaysToPayment = await calculateAverageDaysToPayment(ctx, where)

        return {
          totalRevenue: totalRevenue._sum.amount || 0,
          outstandingBalance: outstandingInvoices._sum.totalAmount || 0,
          overdueBalance: overdueInvoices._sum.totalAmount || 0,
          averageInvoiceAmount: invoiceStats._avg.totalAmount || 0,
          paymentRate,
          daysToPayment: averageDaysToPayment,
          monthlyTrends
        }
      } catch (error) {
        handleDatabaseError(error)
      }
    }),

  /**
   * Get aging report
   */
  getAgingReport: staffProcedure
    .input(billingSchemas.agingReport)
    .query(async ({ ctx, input }) => {
      try {
        const { asOfDate, includePaidInvoices, clientIds } = input
        
        const where: any = {
          issuedAt: { lte: asOfDate }
        }
        
        if (!includePaidInvoices) {
          where.status = { in: ['ISSUED', 'OVERDUE'] }
        }
        
        if (clientIds && clientIds.length > 0) {
          where.clientId = { in: clientIds }
        }

        const invoices = await ctx.prisma.invoice.findMany({
          where,
          include: {
            client: {
              select: {
                firstName: true,
                lastName: true,
                user: { select: { email: true } }
              }
            },
            payments: {
              where: { status: 'COMPLETED' },
              select: { amount: true }
            }
          }
        })

        // Calculate aging buckets
        const agingBuckets = {
          current: [],
          days30: [],
          days60: [],
          days90: [],
          over90: []
        }

        invoices.forEach(invoice => {
          const daysPastDue = invoice.dueDate 
            ? Math.max(0, Math.floor((asOfDate.getTime() - invoice.dueDate.getTime()) / (1000 * 60 * 60 * 24)))
            : 0

          const paidAmount = invoice.payments.reduce((sum, p) => sum + p.amount, 0)
          const balance = invoice.totalAmount - paidAmount

          if (balance <= 0) return // Skip fully paid invoices

          const invoiceData = {
            ...invoice,
            daysPastDue,
            remainingBalance: balance
          }

          if (daysPastDue <= 0) {
            agingBuckets.current.push(invoiceData)
          } else if (daysPastDue <= 30) {
            agingBuckets.days30.push(invoiceData)
          } else if (daysPastDue <= 60) {
            agingBuckets.days60.push(invoiceData)
          } else if (daysPastDue <= 90) {
            agingBuckets.days90.push(invoiceData)
          } else {
            agingBuckets.over90.push(invoiceData)
          }
        })

        return agingBuckets
      } catch (error) {
        handleDatabaseError(error)
      }
    })
})

// Helper functions
async function getInvoiceWithDetails(ctx: any, invoiceId: string) {
  return await ctx.prisma.invoice.findUnique({
    where: { id: invoiceId },
    include: {
      client: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          primaryPhone: true,
          address: true,
          user: { select: { email: true } }
        }
      },
      lineItems: true,
      payments: {
        orderBy: { createdAt: 'desc' }
      }
    }
  })
}

async function generateInvoiceNumber(tx: any): Promise<string> {
  const count = await tx.invoice.count()
  const year = new Date().getFullYear()
  return `INV-${year}-${String(count + 1).padStart(6, '0')}`
}

async function updateInvoicePaymentStatus(ctx: any, invoiceId: string) {
  const invoice = await ctx.prisma.invoice.findUnique({
    where: { id: invoiceId },
    include: {
      payments: {
        where: { status: 'COMPLETED' }
      }
    }
  })

  if (!invoice) return

  const totalPaid = invoice.payments.reduce((sum, p) => sum + p.amount, 0)
  
  if (totalPaid >= invoice.totalAmount) {
    await ctx.prisma.invoice.update({
      where: { id: invoiceId },
      data: {
        status: 'PAID',
        paidAt: new Date()
      }
    })
  }
}

async function sendInvoiceEmail(email: string, invoice: any) {
  // Implement email sending logic
  console.log(`Sending invoice ${invoice.invoiceNumber} to ${email}`)
}

async function isClientOwner(ctx: any, userId: string, clientId: string): Promise<boolean> {
  const client = await ctx.prisma.clientProfile.findUnique({
    where: { id: clientId }
  })
  return client?.userId === userId
}

async function isFamilyMemberOfClient(ctx: any, userId: string, clientId: string): Promise<boolean> {
  const familyMember = await ctx.prisma.familyProfile.findFirst({
    where: { userId, clientId }
  })
  return !!familyMember
}

async function getClientIdForUser(ctx: any, userId: string): Promise<string | null> {
  const client = await ctx.prisma.clientProfile.findUnique({
    where: { userId }
  })
  return client?.id || null
}

async function getFamilyMemberClientId(ctx: any, userId: string): Promise<string | null> {
  const familyMember = await ctx.prisma.familyProfile.findUnique({
    where: { userId }
  })
  return familyMember?.clientId || null
}

// Stripe helper functions (would integrate with actual Stripe SDK)
async function getStripeCustomerId(ctx: any, clientId: string): Promise<string | null> {
  // Implementation to get Stripe customer ID from database
  return null
}

async function createStripeCustomer(ctx: any, client: any): Promise<string> {
  // Implementation to create Stripe customer
  return 'cus_example'
}

async function createStripePaymentIntentAPI(params: any): Promise<any> {
  // Implementation using Stripe SDK
  return {
    id: 'pi_example',
    client_secret: 'pi_example_secret',
    status: 'requires_payment_method'
  }
}

async function handlePaymentSuccess(ctx: any, paymentIntent: any) {
  const invoiceId = paymentIntent.metadata.invoiceId
  
  await ctx.prisma.payment.update({
    where: { stripePaymentIntentId: paymentIntent.id },
    data: {
      status: 'COMPLETED',
      processedAt: new Date(),
      stripeChargeId: paymentIntent.latest_charge
    }
  })

  await updateInvoicePaymentStatus(ctx, invoiceId)
}

async function handlePaymentFailure(ctx: any, paymentIntent: any) {
  await ctx.prisma.payment.update({
    where: { stripePaymentIntentId: paymentIntent.id },
    data: {
      status: 'FAILED',
      failureReason: paymentIntent.last_payment_error?.message
    }
  })
}

async function handleChargeDispute(ctx: any, dispute: any) {
  // Handle chargeback/dispute logic
  console.log('Handling charge dispute:', dispute.id)
}

async function getMonthlyBillingTrends(ctx: any, dateRange: any) {
  // Implementation to get monthly billing trends
  return []
}

async function calculateAverageDaysToPayment(ctx: any, where: any): Promise<number> {
  // Implementation to calculate average days to payment
  return 0
}