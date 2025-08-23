import { z } from 'zod'
import { 
  uuidSchema, 
  emailSchema, 
  phoneSchema, 
  addressSchema, 
  emergencyContactSchema,
  clientStatusSchema, 
  genderSchema, 
  contactMethodSchema,
  clientPreferencesSchema,
  medicalInfoSchema,
  paginationSchema,
  dateRangeSchema,
  createOptionalUpdate
} from './shared'

// ===== CLIENT PROFILE SCHEMAS =====

export const clientCreateSchema = z.object({
  // User account info
  email: emailSchema,
  password: z.string().min(8),
  
  // Personal information
  firstName: z.string().min(1, 'First name is required').max(50),
  lastName: z.string().min(1, 'Last name is required').max(50),
  dateOfBirth: z.date(),
  gender: genderSchema.optional(),
  preferredName: z.string().max(50).optional(),
  
  // Contact information
  primaryPhone: phoneSchema,
  secondaryPhone: phoneSchema.optional(),
  emergencyContact: emergencyContactSchema,
  
  // Address
  address: addressSchema,
  
  // Status
  status: clientStatusSchema.default('INQUIRY'),
  enrollmentDate: z.date().optional(),
  
  // Preferences
  preferences: clientPreferencesSchema.optional(),
  medicalInfo: medicalInfoSchema.optional()
})

export const clientUpdateSchema = createOptionalUpdate(
  z.object({
    firstName: z.string().min(1).max(50),
    lastName: z.string().min(1).max(50),
    dateOfBirth: z.date(),
    gender: genderSchema,
    preferredName: z.string().max(50),
    primaryPhone: phoneSchema,
    secondaryPhone: phoneSchema,
    emergencyContact: emergencyContactSchema,
    address: addressSchema,
    status: clientStatusSchema,
    enrollmentDate: z.date(),
    preferences: clientPreferencesSchema,
    medicalInfo: medicalInfoSchema
  })
)

export const clientSearchSchema = z.object({
  query: z.string().optional(), // Search by name, email, or phone
  status: clientStatusSchema.optional(),
  enrollmentDateRange: dateRangeSchema.optional(),
  coordinatorId: uuidSchema.optional(),
  hasActivePlan: z.boolean().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  ...paginationSchema.shape
})

// ===== PLAN OF CARE SCHEMAS =====

export const careGoalSchema = z.object({
  title: z.string().min(1, 'Goal title is required').max(200),
  description: z.string().min(1, 'Goal description is required'),
  targetDate: z.date().optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).default('MEDIUM'),
  status: z.enum(['NOT_STARTED', 'IN_PROGRESS', 'COMPLETED', 'ON_HOLD', 'DISCONTINUED']).default('NOT_STARTED')
})

export const serviceTaskSchema = z.object({
  name: z.string().min(1, 'Task name is required').max(100),
  description: z.string().optional(),
  category: z.enum([
    'PERSONAL_CARE', 'MEDICATION_MANAGEMENT', 'HOUSEHOLD_TASKS', 
    'NUTRITION', 'TRANSPORTATION', 'COMPANIONSHIP', 
    'SAFETY_SUPERVISION', 'EXERCISE_MOBILITY'
  ]),
  frequency: z.enum(['EVERY_VISIT', 'DAILY', 'WEEKLY', 'BI_WEEKLY', 'MONTHLY', 'AS_NEEDED']),
  estimatedDuration: z.number().int().min(5).max(480), // 5 minutes to 8 hours
  requiredSkills: z.array(z.enum([
    'PERSONAL_CARE', 'MEDICATION_REMINDERS', 'MEAL_PREPARATION',
    'LIGHT_HOUSEKEEPING', 'TRANSPORTATION', 'COMPANIONSHIP',
    'DEMENTIA_CARE', 'MOBILITY_ASSISTANCE', 'TRANSFER_ASSISTANCE',
    'INCONTINENCE_CARE', 'WOUND_CARE', 'VITAL_SIGNS', 'OXYGEN_THERAPY'
  ])).default([]),
  isRequired: z.boolean().default(true)
})

export const clientSchedulePreferenceSchema = z.object({
  dayOfWeek: z.enum(['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY']),
  startTime: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:MM)'),
  endTime: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:MM)'),
  duration: z.number().int().min(30).max(720) // 30 minutes to 12 hours
})

export const planOfCareCreateSchema = z.object({
  clientId: uuidSchema,
  effectiveDate: z.date(),
  expirationDate: z.date().optional(),
  totalWeeklyHours: z.number().int().min(1).max(168), // Max hours in a week
  
  goals: z.array(careGoalSchema).min(1, 'At least one care goal is required'),
  tasks: z.array(serviceTaskSchema).min(1, 'At least one service task is required'),
  preferredSchedule: z.array(clientSchedulePreferenceSchema).optional(),
  
  notes: z.string().optional()
}).refine(data => !data.expirationDate || data.expirationDate > data.effectiveDate, {
  message: 'Expiration date must be after effective date',
  path: ['expirationDate']
})

export const planOfCareUpdateSchema = createOptionalUpdate(
  z.object({
    effectiveDate: z.date(),
    expirationDate: z.date(),
    totalWeeklyHours: z.number().int().min(1).max(168),
    status: z.enum(['DRAFT', 'PENDING_APPROVAL', 'ACTIVE', 'SUSPENDED', 'EXPIRED']),
    notes: z.string()
  })
)

export const careGoalUpdateSchema = createOptionalUpdate(careGoalSchema)
export const serviceTaskUpdateSchema = createOptionalUpdate(serviceTaskSchema)

// ===== FAMILY MEMBER SCHEMAS =====

export const familyMemberCreateSchema = z.object({
  clientId: uuidSchema,
  email: emailSchema,
  firstName: z.string().min(1).max(50),
  lastName: z.string().min(1).max(50),
  relationship: z.string().min(1, 'Relationship is required').max(50),
  primaryPhone: phoneSchema,
  secondaryPhone: phoneSchema.optional(),
  
  // Permissions
  canViewSchedule: z.boolean().default(true),
  canViewBilling: z.boolean().default(false),
  canReceiveUpdates: z.boolean().default(true),
  preferredContact: contactMethodSchema.default('EMAIL'),
  
  // Send invite
  sendInviteEmail: z.boolean().default(true)
})

export const familyMemberUpdateSchema = createOptionalUpdate(
  z.object({
    firstName: z.string().min(1).max(50),
    lastName: z.string().min(1).max(50),
    relationship: z.string().min(1).max(50),
    primaryPhone: phoneSchema,
    secondaryPhone: phoneSchema,
    canViewSchedule: z.boolean(),
    canViewBilling: z.boolean(),
    canReceiveUpdates: z.boolean(),
    preferredContact: contactMethodSchema
  })
)

// ===== CLIENT ASSESSMENT SCHEMAS =====

export const assessmentQuestionSchema = z.object({
  category: z.string(),
  question: z.string(),
  answer: z.string(),
  notes: z.string().optional(),
  requiresAction: z.boolean().default(false)
})

export const clientAssessmentSchema = z.object({
  clientId: uuidSchema,
  assessmentType: z.enum(['INITIAL', 'FOLLOW_UP', 'ANNUAL', 'CHANGE_IN_CONDITION']),
  assessmentDate: z.date(),
  assessorName: z.string().min(1),
  
  // Assessment categories
  adlAssessment: z.array(assessmentQuestionSchema), // Activities of Daily Living
  iadlAssessment: z.array(assessmentQuestionSchema), // Instrumental ADLs
  cognitiveAssessment: z.array(assessmentQuestionSchema),
  safetyAssessment: z.array(assessmentQuestionSchema),
  socialAssessment: z.array(assessmentQuestionSchema),
  
  // Summary
  overallSummary: z.string(),
  recommendations: z.array(z.string()),
  riskLevel: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).default('MEDIUM'),
  
  // Follow-up
  nextAssessmentDate: z.date().optional(),
  requiresPhysicianReview: z.boolean().default(false)
})

// ===== CLIENT ONBOARDING SCHEMAS =====

export const onboardingStepSchema = z.object({
  stepName: z.string(),
  isCompleted: z.boolean().default(false),
  completedAt: z.date().optional(),
  notes: z.string().optional()
})

export const clientOnboardingSchema = z.object({
  clientId: uuidSchema,
  startedAt: z.date().default(() => new Date()),
  completedAt: z.date().optional(),
  currentStep: z.string(),
  
  steps: z.array(onboardingStepSchema),
  
  // Document requirements
  requiredDocuments: z.array(z.object({
    documentType: z.string(),
    isRequired: z.boolean(),
    isUploaded: z.boolean().default(false),
    uploadedAt: z.date().optional()
  })),
  
  // Coordinator notes
  coordinatorNotes: z.string().optional(),
  specialInstructions: z.string().optional()
})

// ===== RESPONSE SCHEMAS =====

export const clientProfileSchema = z.object({
  id: uuidSchema,
  userId: uuidSchema,
  firstName: z.string(),
  lastName: z.string(),
  email: emailSchema,
  dateOfBirth: z.date(),
  gender: genderSchema.nullable(),
  preferredName: z.string().nullable(),
  primaryPhone: phoneSchema,
  secondaryPhone: phoneSchema.nullable(),
  emergencyContact: emergencyContactSchema.nullable(),
  address: addressSchema,
  status: clientStatusSchema,
  enrollmentDate: z.date().nullable(),
  preferences: clientPreferencesSchema.nullable(),
  medicalInfo: medicalInfoSchema.nullable(),
  createdAt: z.date(),
  updatedAt: z.date()
})

export const planOfCareSchema = z.object({
  id: uuidSchema,
  clientId: uuidSchema,
  effectiveDate: z.date(),
  expirationDate: z.date().nullable(),
  totalWeeklyHours: z.number(),
  status: z.enum(['DRAFT', 'PENDING_APPROVAL', 'ACTIVE', 'SUSPENDED', 'EXPIRED']),
  approvedAt: z.date().nullable(),
  approvedBy: z.string().nullable(),
  goals: z.array(careGoalSchema),
  tasks: z.array(serviceTaskSchema),
  preferredSchedule: z.array(clientSchedulePreferenceSchema),
  createdAt: z.date(),
  updatedAt: z.date()
})

export const familyMemberSchema = z.object({
  id: uuidSchema,
  userId: uuidSchema,
  clientId: uuidSchema,
  firstName: z.string(),
  lastName: z.string(),
  email: emailSchema,
  relationship: z.string(),
  primaryPhone: phoneSchema,
  secondaryPhone: phoneSchema.nullable(),
  canViewSchedule: z.boolean(),
  canViewBilling: z.boolean(),
  canReceiveUpdates: z.boolean(),
  preferredContact: contactMethodSchema,
  createdAt: z.date(),
  updatedAt: z.date()
})

export const clientWithRelationsSchema = clientProfileSchema.extend({
  planOfCare: planOfCareSchema.nullable(),
  familyMembers: z.array(familyMemberSchema),
  activeVisits: z.number().default(0),
  totalVisits: z.number().default(0),
  lastVisitDate: z.date().nullable()
})

// ===== EXPORT ALL CLIENT SCHEMAS =====

export const clientSchemas = {
  // Core CRUD
  clientCreate: clientCreateSchema,
  clientUpdate: clientUpdateSchema,
  clientSearch: clientSearchSchema,
  
  // Plan of Care
  planOfCareCreate: planOfCareCreateSchema,
  planOfCareUpdate: planOfCareUpdateSchema,
  careGoal: careGoalSchema,
  careGoalUpdate: careGoalUpdateSchema,
  serviceTask: serviceTaskSchema,
  serviceTaskUpdate: serviceTaskUpdateSchema,
  
  // Family Members
  familyMemberCreate: familyMemberCreateSchema,
  familyMemberUpdate: familyMemberUpdateSchema,
  
  // Assessment
  clientAssessment: clientAssessmentSchema,
  assessmentQuestion: assessmentQuestionSchema,
  
  // Onboarding
  clientOnboarding: clientOnboardingSchema,
  onboardingStep: onboardingStepSchema,
  
  // Responses
  clientProfile: clientProfileSchema,
  planOfCare: planOfCareSchema,
  familyMember: familyMemberSchema,
  clientWithRelations: clientWithRelationsSchema
}