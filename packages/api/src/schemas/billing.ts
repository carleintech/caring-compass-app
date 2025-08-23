import { z } from 'zod'
import { 
  uuidSchema, 
  invoiceStatusSchema,
  paymentMethodSchema,
  paymentStatusSchema,
  paginationSchema,
  dateRangeSchema,
  createOptionalUpdate
} from './shared'

// ===== INVOICE SCHEMAS =====

export const invoiceLineItemSchema = z.object({
  description: z.string().min(1, 'Description is required').max(200),
  quantity: z.number().min(0, 'Quantity must be positive'),
  unitPrice: z.number().min(0, 'Unit price must be positive'),
  totalPrice: z.number().min(0, 'Total price must be positive'),
  visitId: uuidSchema.optional() // Link to specific visit if applicable
})

export const invoiceCreateSchema = z.object({
  clientId: uuidSchema,
  billingPeriod: z.object({
    startDate: z.date(),
    endDate: z.date()
  }),
  
  lineItems: z.array(invoiceLineItemSchema).min(1, 'At least one line item is required'),
  
  // Optional overrides (calculated automatically if not provided)
  subtotal: z.number().min(0).optional(),
  taxAmount: z.number().min(0).default(0),
  totalAmount: z.number().min(0).optional(),
  
  // Invoice settings
  dueDate: z.date().optional(), // Defaults to 30 days from issue
  notes: z.string().max(1000).optional(),
  
  // Auto-generation from visits
  includeVisits: z.array(uuidSchema).optional(), // Specific visits to include
  autoCalculateFromPeriod: z.boolean().default(false) // Auto-calculate from all visits in period
}).refine(data => data.billingPeriod.endDate >= data.billingPeriod.startDate, {
  message: 'End date must be after start date',
  path: ['billingPeriod', 'endDate']
})

export const invoiceUpdateSchema = createOptionalUpdate(
  z.object({
    billingPeriod: z.object({
      startDate: z.date(),
      endDate: z.date()
    }),
    subtotal: z.number().min(0),
    taxAmount: z.number().min(0),
    totalAmount: z.number().min(0),
    status: invoiceStatusSchema,
    issuedAt: z.date(),
    dueDate: z.date(),
    paidAt: z.date(),
    notes: z.string().max(1000)
  })
)

export const invoiceSearchSchema = z.object({
  clientId: uuidSchema.optional(),
  status: invoiceStatusSchema.optional(),
  billingPeriodRange: dateRangeSchema.optional(),
  dueDateRange: dateRangeSchema.optional(),
  amountRange: z.object({
    min: z.number().min(0).optional(),
    max: z.number().min(0).optional()
  }).optional(),
  isOverdue: z.boolean().optional(),
  ...paginationSchema.shape
})

export const invoiceLineItemUpdateSchema = z.object({
  lineItemId: uuidSchema,
  description: z.string().min(1).max(200).optional(),
  quantity: z.number().min(0).optional(),
  unitPrice: z.number().min(0).optional(),
  visitId: uuidSchema.optional()
})

export const invoiceBulkActionSchema = z.object({
  invoiceIds: z.array(uuidSchema).min(1, 'At least one invoice ID is required'),
  action: z.enum(['ISSUE', 'VOID', 'MARK_PAID', 'SEND_REMINDER']),
  notes: z.string().optional()
})

// ===== PAYMENT SCHEMAS =====

export const paymentCreateSchema = z.object({
  invoiceId: uuidSchema,
  amount: z.number().min(0.01, 'Payment amount must be positive'),
  paymentMethod: paymentMethodSchema,
  
  // Payment processor data
  stripePaymentIntentId: z.string().optional(),
  externalTransactionId: z.string().optional(),
  
  // Check payments
  checkNumber: z.string().max(50).optional(),
  checkDate: z.date().optional(),
  
  // Notes
  notes: z.string().max(500).optional()
})

export const paymentUpdateSchema = createOptionalUpdate(
  z.object({
    amount: z.number().min(0.01),
    paymentMethod: paymentMethodSchema,
    status: paymentStatusSchema,
    processedAt: z.date(),
    failureReason: z.string().max(200),
    stripeChargeId: z.string(),
    notes: z.string().max(500)
  })
)

export const paymentSearchSchema = z.object({
  clientId: uuidSchema.optional(),
  invoiceId: uuidSchema.optional(),
  status: paymentStatusSchema.optional(),
  paymentMethod: paymentMethodSchema.optional(),
  processedDateRange: dateRangeSchema.optional(),
  amountRange: z.object({
    min: z.number().min(0).optional(),
    max: z.number().min(0).optional()
  }).optional(),
  ...paginationSchema.shape
})

// ===== STRIPE INTEGRATION SCHEMAS =====

export const stripePaymentIntentCreateSchema = z.object({
  invoiceId: uuidSchema,
  amount: z.number().min(50), // Stripe minimum is $0.50
  currency: z.string().length(3).default('USD'),
  paymentMethodId: z.string().optional(), // Existing payment method
  savePaymentMethod: z.boolean().default(false),
  automaticConfirmation: z.boolean().default(true)
})

export const stripeWebhookSchema = z.object({
  id: z.string(),
  object: z.literal('event'),
  type: z.string(),
  data: z.object({
    object: z.any()
  }),
  created: z.number(),
  livemode: z.boolean()
})

export const stripeCustomerCreateSchema = z.object({
  clientId: uuidSchema,
  email: z.string().email(),
  name: z.string().min(1),
  phone: z.string().optional(),
  address: z.object({
    line1: z.string(),
    line2: z.string().optional(),
    city: z.string(),
    state: z.string(),
    postal_code: z.string(),
    country: z.string().default('US')
  }).optional()
})

// ===== PAYMENT METHOD SCHEMAS =====

export const paymentMethodCreateSchema = z.object({
  clientId: uuidSchema,
  type: z.enum(['CREDIT_CARD', 'ACH', 'CHECK']),
  
  // Credit card data (handled by Stripe on frontend)
  stripePaymentMethodId: z.string().optional(),
  
  // ACH data
  achData: z.object({
    routingNumber: z.string().regex(/^\d{9}$/, 'Routing number must be 9 digits'),
    accountNumber: z.string().min(4).max(20),
    accountType: z.enum(['CHECKING', 'SAVINGS']),
    bankName: z.string().min(1)
  }).optional(),
  
  // Display info
  nickname: z.string().max(50).optional(),
  isDefault: z.boolean().default(false)
})

export const paymentMethodUpdateSchema = createOptionalUpdate(
  z.object({
    nickname: z.string().max(50),
    isDefault: z.boolean()
  })
)

// ===== BILLING CONFIGURATION SCHEMAS =====

export const rateCardSchema = z.object({
  name: z.string().min(1, 'Rate card name is required').max(100),
  description: z.string().optional(),
  isActive: z.boolean().default(true),
  effectiveDate: z.date().default(() => new Date()),
  
  rates: z.array(z.object({
    serviceType: z.enum(['PERSONAL_CARE', 'COMPANIONSHIP', 'HOMEMAKER', 'TRANSPORTATION', 'RESPITE']),
    skillLevel: z.enum(['BASIC', 'INTERMEDIATE', 'ADVANCED', 'SPECIALIZED']).optional(),
    
    // Rate structure
    hourlyRate: z.number().min(0),
    weekendRate: z.number().min(0).optional(), // Weekend surcharge
    holidayRate: z.number().min(0).optional(), // Holiday surcharge
    overnightRate: z.number().min(0).optional(), // Overnight rate
    
    // Minimum charges
    minimumHours: z.number().min(0.5).default(2), // Minimum billable hours
    cancellationFee: z.number().min(0).default(0),
    
    // Mileage
    mileageRate: z.number().min(0).default(0.67) // IRS standard rate
  }))
})

export const billingConfigSchema = z.object({
  defaultRateCardId: uuidSchema.optional(),
  
  // Invoice settings
  invoiceFrequency: z.enum(['WEEKLY', 'BI_WEEKLY', 'MONTHLY']).default('BI_WEEKLY'),
  paymentTerms: z.number().int().min(1).max(90).default(30), // Days
  lateFeePercent: z.number().min(0).max(50).default(0),
  lateFeeGracePeriod: z.number().int().min(0).default(5), // Days
  
  // Auto-billing
  autoGenerateInvoices: z.boolean().default(true),
  autoSendInvoices: z.boolean().default(true),
  
  // Tax settings
  taxRate: z.number().min(0).max(50).default(0), // Percentage
  taxNumber: z.string().optional(),
  
  // Contact info
  billingContactEmail: z.string().email(),
  billingContactPhone: z.string().optional(),
  
  // Templates
  invoiceTemplate: z.string().default('standard'),
  emailTemplate: z.string().default('standard')
})

// ===== FINANCIAL REPORTING SCHEMAS =====

export const revenueReportSchema = z.object({
  dateRange: dateRangeSchema,
  groupBy: z.enum(['DAY', 'WEEK', 'MONTH', 'QUARTER', 'YEAR']).default('MONTH'),
  includeProjections: z.boolean().default(false),
  clientIds: z.array(uuidSchema).optional(), // Filter by specific clients
  serviceTypes: z.array(z.string()).optional()
})

export const agingReportSchema = z.object({
  asOfDate: z.date().default(() => new Date()),
  includePaidInvoices: z.boolean().default(false),
  clientIds: z.array(uuidSchema).optional()
})

export const profitabilityReportSchema = z.object({
  dateRange: dateRangeSchema,
  includeCaregoverCosts: z.boolean().default(true),
  includeOverhead: z.boolean().default(false),
  groupBy: z.enum(['CLIENT', 'CAREGIVER', 'SERVICE_TYPE', 'MONTH']).default('CLIENT')
})

// ===== RESPONSE SCHEMAS =====

export const invoiceSchema = z.object({
  id: uuidSchema,
  clientId: uuidSchema,
  invoiceNumber: z.string(),
  billingPeriod: z.object({
    startDate: z.date(),
    endDate: z.date()
  }),
  subtotal: z.number(),
  taxAmount: z.number(),
  totalAmount: z.number(),
  status: invoiceStatusSchema,
  issuedAt: z.date().nullable(),
  dueDate: z.date().nullable(),
  paidAt: z.date().nullable(),
  notes: z.string().nullable(),
  createdAt: z.date(),
  updatedAt: z.date()
})

export const invoiceLineItemResponseSchema = z.object({
  id: uuidSchema,
  invoiceId: uuidSchema,
  description: z.string(),
  quantity: z.number(),
  unitPrice: z.number(),
  totalPrice: z.number(),
  visitId: uuidSchema.nullable()
})

export const paymentSchema = z.object({
  id: uuidSchema,
  invoiceId: uuidSchema,
  amount: z.number(),
  paymentMethod: paymentMethodSchema,
  status: paymentStatusSchema,
  stripePaymentId: z.string().nullable(),
  stripeChargeId: z.string().nullable(),
  processedAt: z.date().nullable(),
  failureReason: z.string().nullable(),
  notes: z.string().nullable(),
  createdAt: z.date(),
  updatedAt: z.date()
})

export const invoiceWithDetailsSchema = invoiceSchema.extend({
  client: z.object({
    id: uuidSchema,
    firstName: z.string(),
    lastName: z.string(),
    email: z.string(),
    address: z.object({
      street1: z.string(),
      city: z.string(),
      state: z.string(),
      zipCode: z.string()
    })
  }),
  lineItems: z.array(invoiceLineItemResponseSchema),
  payments: z.array(paymentSchema),
  remainingBalance: z.number(),
  isOverdue: z.boolean()
})

export const paymentMethodResponseSchema = z.object({
  id: uuidSchema,
  clientId: uuidSchema,
  type: z.enum(['CREDIT_CARD', 'ACH', 'CHECK']),
  stripePaymentMethodId: z.string().nullable(),
  lastFourDigits: z.string().nullable(),
  expiryMonth: z.number().nullable(),
  expiryYear: z.number().nullable(),
  bankName: z.string().nullable(),
  nickname: z.string().nullable(),
  isDefault: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date()
})

export const billingStatsSchema = z.object({
  totalRevenue: z.number(),
  outstandingBalance: z.number(),
  overdueBalance: z.number(),
  averageInvoiceAmount: z.number(),
  paymentRate: z.number(), // Percentage of invoices paid on time
  daysToPayment: z.number(), // Average days to payment
  
  monthlyTrends: z.array(z.object({
    month: z.string(),
    revenue: z.number(),
    invoicesIssued: z.number(),
    invoicesPaid: z.number()
  }))
})

// ===== EXPORT ALL BILLING SCHEMAS =====

export const billingSchemas = {
  // Invoices
  invoiceCreate: invoiceCreateSchema,
  invoiceUpdate: invoiceUpdateSchema,
  invoiceSearch: invoiceSearchSchema,
  invoiceLineItem: invoiceLineItemSchema,
  invoiceLineItemUpdate: invoiceLineItemUpdateSchema,
  invoiceBulkAction: invoiceBulkActionSchema,
  
  // Payments
  paymentCreate: paymentCreateSchema,
  paymentUpdate: paymentUpdateSchema,
  paymentSearch: paymentSearchSchema,
  
  // Stripe
  stripePaymentIntentCreate: stripePaymentIntentCreateSchema,
  stripeWebhook: stripeWebhookSchema,
  stripeCustomerCreate: stripeCustomerCreateSchema,
  
  // Payment Methods
  paymentMethodCreate: paymentMethodCreateSchema,
  paymentMethodUpdate: paymentMethodUpdateSchema,
  
  // Configuration
  rateCard: rateCardSchema,
  billingConfig: billingConfigSchema,
  
  // Reporting
  revenueReport: revenueReportSchema,
  agingReport: agingReportSchema,
  profitabilityReport: profitabilityReportSchema,
  
  // Responses
  invoice: invoiceSchema,
  invoiceLineItemResponse: invoiceLineItemResponseSchema,
  payment: paymentSchema,
  invoiceWithDetails: invoiceWithDetailsSchema,
  paymentMethod: paymentMethodResponseSchema,
  billingStats: billingStatsSchema
}