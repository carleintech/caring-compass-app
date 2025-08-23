import { z } from 'zod'
import { 
  UserRole, 
  ClientStatus, 
  CaregiverStatus, 
  VisitStatus, 
  InvoiceStatus,
  TaskCategory,
  TaskFrequency,
  SkillType,
  SkillLevel,
  LanguageProficiency,
  DayOfWeek,
  PaymentMethod,
  PaymentStatus,
  Gender,
  ContactMethod,
  Priority,
  GoalStatus,
  CredentialType,
  CredentialStatus,
  EmploymentType
} from '@caring-compass/database'

// ===== BASIC VALIDATION SCHEMAS =====

export const uuidSchema = z.string().uuid()
export const emailSchema = z.string().email()
export const phoneSchema = z.string().regex(/^\d{3}-\d{3}-\d{4}$/, 'Phone must be in format XXX-XXX-XXXX')
export const zipCodeSchema = z.string().regex(/^\d{5}(-\d{4})?$/, 'Invalid ZIP code format')

// Password validation
export const passwordSchema = z.string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/\d/, 'Password must contain at least one number')
  .regex(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/, 'Password must contain at least one special character')

// ===== ENUM SCHEMAS =====

export const userRoleSchema = z.nativeEnum(UserRole)
export const clientStatusSchema = z.nativeEnum(ClientStatus)
export const caregiverStatusSchema = z.nativeEnum(CaregiverStatus)
export const visitStatusSchema = z.nativeEnum(VisitStatus)
export const invoiceStatusSchema = z.nativeEnum(InvoiceStatus)
export const taskCategorySchema = z.nativeEnum(TaskCategory)
export const taskFrequencySchema = z.nativeEnum(TaskFrequency)
export const skillTypeSchema = z.nativeEnum(SkillType)
export const skillLevelSchema = z.nativeEnum(SkillLevel)
export const languageProficiencySchema = z.nativeEnum(LanguageProficiency)
export const dayOfWeekSchema = z.nativeEnum(DayOfWeek)
export const paymentMethodSchema = z.nativeEnum(PaymentMethod)
export const paymentStatusSchema = z.nativeEnum(PaymentStatus)
export const genderSchema = z.nativeEnum(Gender)
export const contactMethodSchema = z.nativeEnum(ContactMethod)
export const prioritySchema = z.nativeEnum(Priority)
export const goalStatusSchema = z.nativeEnum(GoalStatus)
export const credentialTypeSchema = z.nativeEnum(CredentialType)
export const credentialStatusSchema = z.nativeEnum(CredentialStatus)
export const employmentTypeSchema = z.nativeEnum(EmploymentType)

// ===== COMMON OBJECT SCHEMAS =====

export const addressSchema = z.object({
  street1: z.string().min(1, 'Street address is required'),
  street2: z.string().optional(),
  city: z.string().min(1, 'City is required'),
  state: z.string().length(2, 'State must be 2 characters'),
  zipCode: zipCodeSchema,
  country: z.string().default('US')
})

export const emergencyContactSchema = z.object({
  name: z.string().min(1, 'Emergency contact name is required'),
  relationship: z.string().min(1, 'Relationship is required'),
  primaryPhone: phoneSchema,
  secondaryPhone: phoneSchema.optional(),
  address: addressSchema.optional()
})

export const dateRangeSchema = z.object({
  startDate: z.date(),
  endDate: z.date()
}).refine(data => data.endDate >= data.startDate, {
  message: 'End date must be after start date',
  path: ['endDate']
})

export const timeSlotSchema = z.object({
  startTime: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:MM)'),
  endTime: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:MM)')
}).refine(data => data.endTime > data.startTime, {
  message: 'End time must be after start time',
  path: ['endTime']
})

// ===== PAGINATION SCHEMAS =====

export const paginationSchema = z.object({
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(20),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc')
})

export const paginatedResponseSchema = <T extends z.ZodTypeAny>(itemSchema: T) =>
  z.object({
    items: z.array(itemSchema),
    totalCount: z.number(),
    totalPages: z.number(),
    currentPage: z.number(),
    hasNextPage: z.boolean(),
    hasPreviousPage: z.boolean()
  })

// ===== SEARCH AND FILTER SCHEMAS =====

export const searchSchema = z.object({
  query: z.string().optional(),
  filters: z.record(z.any()).optional(),
  dateRange: dateRangeSchema.optional(),
  ...paginationSchema.shape
})

export const dateFilterSchema = z.object({
  from: z.date().optional(),
  to: z.date().optional(),
  preset: z.enum(['today', 'yesterday', 'thisWeek', 'lastWeek', 'thisMonth', 'lastMonth', 'thisYear']).optional()
})

// ===== FILE UPLOAD SCHEMAS =====

export const fileUploadSchema = z.object({
  fileName: z.string().min(1),
  fileSize: z.number().positive(),
  mimeType: z.string().min(1),
  fileUrl: z.string().url(),
  description: z.string().optional()
})

// ===== RESPONSE SCHEMAS =====

export const successResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    success: z.literal(true),
    data: dataSchema,
    message: z.string().optional()
  })

export const errorResponseSchema = z.object({
  success: z.literal(false),
  error: z.object({
    code: z.string(),
    message: z.string(),
    details: z.any().optional()
  })
})

export const apiResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.union([successResponseSchema(dataSchema), errorResponseSchema])

// ===== ID VALIDATION SCHEMAS =====

export const clientIdSchema = z.object({
  clientId: uuidSchema
})

export const caregiverIdSchema = z.object({
  caregiverId: uuidSchema
})

export const visitIdSchema = z.object({
  visitId: uuidSchema
})

export const invoiceIdSchema = z.object({
  invoiceId: uuidSchema
})

export const messageIdSchema = z.object({
  messageId: uuidSchema
})

export const documentIdSchema = z.object({
  documentId: uuidSchema
})

// ===== BULK OPERATION SCHEMAS =====

export const bulkIdSchema = z.object({
  ids: z.array(uuidSchema).min(1, 'At least one ID is required')
})

export const bulkUpdateSchema = <T extends z.ZodTypeAny>(updateSchema: T) =>
  z.object({
    ids: z.array(uuidSchema).min(1),
    data: updateSchema
  })

// ===== PREFERENCE SCHEMAS =====

export const clientPreferencesSchema = z.object({
  genderPreference: z.string().optional(),
  languagePreference: z.array(z.string()).default([]),
  petAllergies: z.boolean().default(false),
  smokingPolicy: z.string().optional(),
  specialRequests: z.string().optional()
})

export const caregiverPreferencesSchema = z.object({
  maxTravelDistance: z.number().int().min(1).max(100).default(25),
  preferredClients: z.array(z.string()).default([]),
  availableForEmergency: z.boolean().default(false),
  transportationAvailable: z.boolean().default(true)
})

// ===== MEDICAL INFO SCHEMA =====

export const medicalInfoSchema = z.object({
  allergies: z.array(z.string()).default([]),
  medications: z.array(z.string()).default([]),
  conditions: z.array(z.string()).default([]),
  physicians: z.array(z.any()).default([]),
  insuranceInfo: z.any().optional()
})

// ===== SCHEDULE SCHEMAS =====

export const schedulePreferenceSchema = z.object({
  dayOfWeek: dayOfWeekSchema,
  startTime: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/),
  endTime: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/),
  duration: z.number().int().positive() // in minutes
})

export const availabilitySchema = z.object({
  dayOfWeek: dayOfWeekSchema,
  startTime: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/),
  endTime: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/),
  isRecurring: z.boolean().default(true),
  effectiveDate: z.date().default(() => new Date()),
  endDate: z.date().optional()
})

// ===== VALIDATION UTILITIES =====

export const validatePhoneNumber = (phone: string): boolean => {
  return /^\d{3}-\d{3}-\d{4}$/.test(phone)
}

export const validateZipCode = (zipCode: string): boolean => {
  return /^\d{5}(-\d{4})?$/.test(zipCode)
}

export const validateTimeFormat = (time: string): boolean => {
  return /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(time)
}

export const validateDateRange = (startDate: Date, endDate: Date): boolean => {
  return endDate >= startDate
}

// ===== CUSTOM VALIDATION HELPERS =====

export const createOptionalUpdate = <T extends z.ZodRawShape>(schema: z.ZodObject<T>) => {
  const shape = schema.shape
  const optionalShape = Object.keys(shape).reduce((acc, key) => {
    acc[key] = shape[key].optional()
    return acc
  }, {} as any)
  
  return z.object(optionalShape)
}

export const createArrayResponse = <T extends z.ZodTypeAny>(itemSchema: T) =>
  z.object({
    items: z.array(itemSchema),
    count: z.number()
  })

export const createStandardResponse = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    success: z.boolean(),
    data: dataSchema.optional(),
    message: z.string().optional(),
    errors: z.array(z.string()).optional()
  })

// Export all schemas for use in routers
export const schemas = {
  // Basic
  uuid: uuidSchema,
  email: emailSchema,
  phone: phoneSchema,
  zipCode: zipCodeSchema,
  password: passwordSchema,
  
  // Enums
  userRole: userRoleSchema,
  clientStatus: clientStatusSchema,
  caregiverStatus: caregiverStatusSchema,
  visitStatus: visitStatusSchema,
  invoiceStatus: invoiceStatusSchema,
  taskCategory: taskCategorySchema,
  taskFrequency: taskFrequencySchema,
  skillType: skillTypeSchema,
  skillLevel: skillLevelSchema,
  dayOfWeek: dayOfWeekSchema,
  gender: genderSchema,
  
  // Objects
  address: addressSchema,
  emergencyContact: emergencyContactSchema,
  dateRange: dateRangeSchema,
  timeSlot: timeSlotSchema,
  pagination: paginationSchema,
  search: searchSchema,
  
  // Preferences
  clientPreferences: clientPreferencesSchema,
  caregiverPreferences: caregiverPreferencesSchema,
  medicalInfo: medicalInfoSchema,
  
  // Schedule
  schedulePreference: schedulePreferenceSchema,
  availability: availabilitySchema,
  
  // Responses
  successResponse: successResponseSchema,
  errorResponse: errorResponseSchema,
  paginatedResponse: paginatedResponseSchema,
  
  // Utilities
  createOptionalUpdate,
  createArrayResponse,
  createStandardResponse
}