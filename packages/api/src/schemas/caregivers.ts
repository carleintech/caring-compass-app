import { z } from 'zod'
import { 
  uuidSchema, 
  emailSchema, 
  phoneSchema, 
  addressSchema,
  caregiverStatusSchema, 
  genderSchema, 
  employmentTypeSchema,
  skillTypeSchema,
  skillLevelSchema,
  languageProficiencySchema,
  credentialTypeSchema,
  credentialStatusSchema,
  dayOfWeekSchema,
  caregiverPreferencesSchema,
  paginationSchema,
  dateRangeSchema,
  createOptionalUpdate,
  availabilitySchema
} from './shared'

// ===== CAREGIVER PROFILE SCHEMAS =====

export const caregiverCreateSchema = z.object({
  // User account info
  email: emailSchema,
  password: z.string().min(8),
  
  // Personal information
  firstName: z.string().min(1, 'First name is required').max(50),
  lastName: z.string().min(1, 'Last name is required').max(50),
  dateOfBirth: z.date(),
  gender: genderSchema.optional(),
  
  // Contact information
  primaryPhone: phoneSchema,
  secondaryPhone: phoneSchema.optional(),
  address: addressSchema,
  
  // Employment information
  employeeId: z.string().max(20).optional(),
  hireDate: z.date().optional(),
  status: caregiverStatusSchema.default('APPLICATION_SUBMITTED'),
  employmentType: employmentTypeSchema.default('PART_TIME'),
  
  // Preferences
  preferences: caregiverPreferencesSchema.optional(),
  
  // Application data
  applicationData: z.object({
    experience: z.string().min(1, 'Experience description is required'),
    education: z.string().optional(),
    references: z.array(z.object({
      name: z.string().min(1),
      relationship: z.string().min(1),
      phone: phoneSchema,
      email: emailSchema.optional()
    })).min(2, 'At least 2 references are required'),
    availability: z.string().optional(),
    specialNotes: z.string().optional()
  }).optional()
})

export const caregiverUpdateSchema = createOptionalUpdate(
  z.object({
    firstName: z.string().min(1).max(50),
    lastName: z.string().min(1).max(50),
    dateOfBirth: z.date(),
    gender: genderSchema,
    primaryPhone: phoneSchema,
    secondaryPhone: phoneSchema,
    address: addressSchema,
    employeeId: z.string().max(20),
    status: caregiverStatusSchema,
    employmentType: employmentTypeSchema,
    preferences: caregiverPreferencesSchema
  })
)

export const caregiverSearchSchema = z.object({
  query: z.string().optional(), // Search by name, email, or employee ID
  status: caregiverStatusSchema.optional(),
  employmentType: employmentTypeSchema.optional(),
  skills: z.array(skillTypeSchema).optional(),
  languages: z.array(z.string()).optional(),
  availableOn: dayOfWeekSchema.optional(),
  hireDateRange: dateRangeSchema.optional(),
  coordinatorId: uuidSchema.optional(),
  location: z.object({
    city: z.string().optional(),
    state: z.string().optional(),
    zipCode: z.string().optional(),
    radius: z.number().int().min(1).max(100).optional() // miles
  }).optional(),
  ...paginationSchema.shape
})

// ===== CREDENTIAL SCHEMAS =====

export const credentialCreateSchema = z.object({
  caregiverId: uuidSchema,
  type: credentialTypeSchema,
  credentialNumber: z.string().max(50).optional(),
  issuingOrganization: z.string().min(1, 'Issuing organization is required').max(100),
  issueDate: z.date(),
  expirationDate: z.date().optional(),
  documentUrl: z.string().url().optional(),
  status: credentialStatusSchema.default('PENDING_VERIFICATION')
}).refine(data => !data.expirationDate || data.expirationDate > data.issueDate, {
  message: 'Expiration date must be after issue date',
  path: ['expirationDate']
})

export const credentialUpdateSchema = createOptionalUpdate(
  z.object({
    credentialNumber: z.string().max(50),
    issuingOrganization: z.string().min(1).max(100),
    issueDate: z.date(),
    expirationDate: z.date(),
    documentUrl: z.string().url(),
    status: credentialStatusSchema
  })
)

export const credentialVerifySchema = z.object({
  credentialId: uuidSchema,
  status: z.enum(['VERIFIED', 'REJECTED']),
  verificationNotes: z.string().optional(),
  verifiedBy: uuidSchema
})

// ===== SKILL SCHEMAS =====

export const skillCreateSchema = z.object({
  caregiverId: uuidSchema,
  skill: skillTypeSchema,
  level: skillLevelSchema.default('BASIC'),
  certifiedAt: z.date().optional(),
  certificationDocument: z.string().url().optional()
})

export const skillUpdateSchema = z.object({
  skillId: uuidSchema,
  level: skillLevelSchema,
  certifiedAt: z.date().optional(),
  certificationDocument: z.string().url().optional()
})

export const skillBulkUpdateSchema = z.object({
  caregiverId: uuidSchema,
  skills: z.array(z.object({
    skill: skillTypeSchema,
    level: skillLevelSchema,
    certifiedAt: z.date().optional()
  }))
})

// ===== LANGUAGE SCHEMAS =====

export const languageCreateSchema = z.object({
  caregiverId: uuidSchema,
  language: z.string().min(1, 'Language is required').max(50),
  proficiency: languageProficiencySchema
})

export const languageUpdateSchema = z.object({
  languageId: uuidSchema,
  proficiency: languageProficiencySchema
})

export const languageBulkUpdateSchema = z.object({
  caregiverId: uuidSchema,
  languages: z.array(z.object({
    language: z.string().min(1).max(50),
    proficiency: languageProficiencySchema
  }))
})

// ===== AVAILABILITY SCHEMAS =====

export const availabilityCreateSchema = z.object({
  caregiverId: uuidSchema,
  dayOfWeek: dayOfWeekSchema,
  startTime: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:MM)'),
  endTime: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:MM)'),
  isRecurring: z.boolean().default(true),
  effectiveDate: z.date().default(() => new Date()),
  endDate: z.date().optional()
}).refine(data => data.endTime > data.startTime, {
  message: 'End time must be after start time',
  path: ['endTime']
}).refine(data => !data.endDate || data.endDate >= data.effectiveDate, {
  message: 'End date must be after effective date',
  path: ['endDate']
})

export const availabilityUpdateSchema = createOptionalUpdate(
  z.object({
    startTime: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/),
    endTime: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/),
    isRecurring: z.boolean(),
    effectiveDate: z.date(),
    endDate: z.date()
  })
)

export const availabilityBulkUpdateSchema = z.object({
  caregiverId: uuidSchema,
  availability: z.array(availabilitySchema)
})

export const blackoutDateSchema = z.object({
  caregiverId: uuidSchema,
  startDate: z.date(),
  endDate: z.date(),
  reason: z.string().min(1, 'Reason is required').max(200),
  isAllDay: z.boolean().default(true),
  startTime: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/).optional(),
  endTime: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/).optional()
}).refine(data => data.endDate >= data.startDate, {
  message: 'End date must be after start date',
  path: ['endDate']
}).refine(data => {
  if (!data.isAllDay) {
    return data.startTime && data.endTime && data.endTime > data.startTime
  }
  return true
}, {
  message: 'End time must be after start time for partial day blackouts',
  path: ['endTime']
})

// ===== BACKGROUND CHECK SCHEMAS =====

export const backgroundCheckCreateSchema = z.object({
  caregiverId: uuidSchema,
  provider: z.string().min(1, 'Background check provider is required'),
  requestedAt: z.date().default(() => new Date()),
  status: z.enum(['PENDING', 'IN_PROGRESS', 'COMPLETED', 'FAILED']).default('PENDING'),
  externalId: z.string().optional() // ID from background check service
})

export const backgroundCheckUpdateSchema = z.object({
  backgroundCheckId: uuidSchema,
  status: z.enum(['PENDING', 'IN_PROGRESS', 'COMPLETED', 'FAILED']),
  completedAt: z.date().optional(),
  results: z.object({
    criminalRecord: z.boolean().optional(),
    sexOffenderRegistry: z.boolean().optional(),
    globalWatchlist: z.boolean().optional(),
    additionalDetails: z.string().optional()
  }).optional(),
  documentUrl: z.string().url().optional()
})

// ===== PERFORMANCE SCHEMAS =====

export const performanceReviewSchema = z.object({
  caregiverId: uuidSchema,
  reviewPeriod: dateRangeSchema,
  reviewedBy: uuidSchema,
  
  ratings: z.object({
    punctuality: z.number().int().min(1).max(5),
    qualityOfCare: z.number().int().min(1).max(5),
    communication: z.number().int().min(1).max(5),
    professionalism: z.number().int().min(1).max(5),
    reliability: z.number().int().min(1).max(5)
  }),
  
  overallRating: z.number().int().min(1).max(5),
  
  strengths: z.array(z.string()),
  areasForImprovement: z.array(z.string()),
  goals: z.array(z.string()),
  
  comments: z.string().optional(),
  nextReviewDate: z.date().optional(),
  
  actionPlan: z.object({
    items: z.array(z.object({
      description: z.string(),
      dueDate: z.date(),
      completed: z.boolean().default(false)
    }))
  }).optional()
})

// ===== CAREGIVER MATCHING SCHEMAS =====

export const caregiverMatchRequestSchema = z.object({
  clientId: uuidSchema,
  requiredSkills: z.array(skillTypeSchema).optional(),
  preferredLanguages: z.array(z.string()).optional(),
  genderPreference: genderSchema.optional(),
  availabilityNeeded: z.array(z.object({
    dayOfWeek: dayOfWeekSchema,
    startTime: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/),
    endTime: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)
  })).optional(),
  maxDistance: z.number().int().min(1).max(100).default(25),
  experienceLevel: z.enum(['ENTRY', 'INTERMEDIATE', 'SENIOR', 'EXPERT']).optional(),
  continuityOfCare: z.boolean().default(true) // Prefer caregivers who have worked with client before
})

export const caregiverMatchResultSchema = z.object({
  caregiverId: uuidSchema,
  caregiver: z.object({
    firstName: z.string(),
    lastName: z.string(),
    photo: z.string().url().optional()
  }),
  matchScore: z.number().min(0).max(100),
  matchFactors: z.object({
    skillsMatch: z.number().min(0).max(25),
    languageMatch: z.number().min(0).max(15),
    genderMatch: z.number().min(0).max(10),
    distanceScore: z.number().min(0).max(10),
    availabilityMatch: z.number().min(0).max(20),
    continuityBonus: z.number().min(0).max(10),
    experienceBonus: z.number().min(0).max(10)
  }),
  distance: z.number().optional(), // in miles
  availability: z.array(z.string()), // Available days
  languages: z.array(z.string()),
  skills: z.array(skillTypeSchema),
  reasonsToChoose: z.array(z.string()),
  potentialConcerns: z.array(z.string())
})

// ===== RESPONSE SCHEMAS =====

export const caregiverProfileSchema = z.object({
  id: uuidSchema,
  userId: uuidSchema,
  firstName: z.string(),
  lastName: z.string(),
  email: emailSchema,
  dateOfBirth: z.date(),
  gender: genderSchema.nullable(),
  primaryPhone: phoneSchema,
  secondaryPhone: phoneSchema.nullable(),
  address: addressSchema,
  employeeId: z.string().nullable(),
  hireDate: z.date().nullable(),
  status: caregiverStatusSchema,
  employmentType: employmentTypeSchema,
  preferences: caregiverPreferencesSchema.nullable(),
  createdAt: z.date(),
  updatedAt: z.date()
})

export const credentialSchema = z.object({
  id: uuidSchema,
  caregiverId: uuidSchema,
  type: credentialTypeSchema,
  credentialNumber: z.string().nullable(),
  issuingOrganization: z.string(),
  issueDate: z.date(),
  expirationDate: z.date().nullable(),
  documentUrl: z.string().nullable(),
  status: credentialStatusSchema,
  createdAt: z.date(),
  updatedAt: z.date()
})

export const skillSchema = z.object({
  id: uuidSchema,
  caregiverId: uuidSchema,
  skill: skillTypeSchema,
  level: skillLevelSchema,
  certifiedAt: z.date().nullable()
})

export const languageSchema = z.object({
  id: uuidSchema,
  caregiverId: uuidSchema,
  language: z.string(),
  proficiency: languageProficiencySchema
})

export const availabilityDetailSchema = z.object({
  id: uuidSchema,
  caregiverId: uuidSchema,
  dayOfWeek: dayOfWeekSchema,
  startTime: z.string(),
  endTime: z.string(),
  isRecurring: z.boolean(),
  effectiveDate: z.date(),
  endDate: z.date().nullable(),
  createdAt: z.date(),
  updatedAt: z.date()
})

export const caregiverWithRelationsSchema = caregiverProfileSchema.extend({
  credentials: z.array(credentialSchema),
  skills: z.array(skillSchema),
  languages: z.array(languageSchema),
  availability: z.array(availabilityDetailSchema),
  activeVisits: z.number().default(0),
  totalVisits: z.number().default(0),
  averageRating: z.number().nullable(),
  lastVisitDate: z.date().nullable()
})

// ===== EXPORT ALL CAREGIVER SCHEMAS =====

export const caregiverSchemas = {
  // Core CRUD
  caregiverCreate: caregiverCreateSchema,
  caregiverUpdate: caregiverUpdateSchema,
  caregiverSearch: caregiverSearchSchema,
  
  // Credentials
  credentialCreate: credentialCreateSchema,
  credentialUpdate: credentialUpdateSchema,
  credentialVerify: credentialVerifySchema,
  
  // Skills
  skillCreate: skillCreateSchema,
  skillUpdate: skillUpdateSchema,
  skillBulkUpdate: skillBulkUpdateSchema,
  
  // Languages
  languageCreate: languageCreateSchema,
  languageUpdate: languageUpdateSchema,
  languageBulkUpdate: languageBulkUpdateSchema,
  
  // Availability
  availabilityCreate: availabilityCreateSchema,
  availabilityUpdate: availabilityUpdateSchema,
  availabilityBulkUpdate: availabilityBulkUpdateSchema,
  blackoutDate: blackoutDateSchema,
  
  // Background Checks
  backgroundCheckCreate: backgroundCheckCreateSchema,
  backgroundCheckUpdate: backgroundCheckUpdateSchema,
  
  // Performance
  performanceReview: performanceReviewSchema,
  
  // Matching
  caregiverMatchRequest: caregiverMatchRequestSchema,
  caregiverMatchResult: caregiverMatchResultSchema,
  
  // Responses
  caregiverProfile: caregiverProfileSchema,
  credential: credentialSchema,
  skill: skillSchema,
  language: languageSchema,
  availability: availabilityDetailSchema,
  caregiverWithRelations: caregiverWithRelationsSchema
}