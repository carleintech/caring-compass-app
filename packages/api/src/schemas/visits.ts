import { z } from 'zod'
import { 
  uuidSchema, 
  visitStatusSchema,
  taskCategorySchema,
  paginationSchema,
  dateRangeSchema,
  createOptionalUpdate
} from './shared'

// ===== VISIT SCHEMAS =====

export const visitCreateSchema = z.object({
  clientId: uuidSchema,
  caregiverId: uuidSchema.optional(), // Can be assigned later
  scheduledStart: z.date(),
  scheduledEnd: z.date(),
  visitType: z.enum(['REGULAR_CARE', 'RESPITE_CARE', 'EMERGENCY_CARE', 'ASSESSMENT', 'SUPERVISION']).default('REGULAR_CARE'),
  
  // Tasks for this visit
  tasks: z.array(z.object({
    taskName: z.string().min(1, 'Task name is required'),
    category: taskCategorySchema,
    isRequired: z.boolean().default(true),
    estimatedDuration: z.number().int().min(5).max(480).optional() // minutes
  })).optional(),
  
  // Special instructions
  specialInstructions: z.string().optional(),
  
  // Recurring visit setup
  isRecurring: z.boolean().default(false),
  recurrencePattern: z.object({
    frequency: z.enum(['DAILY', 'WEEKLY', 'BI_WEEKLY', 'MONTHLY']),
    interval: z.number().int().min(1).max(12).default(1),
    daysOfWeek: z.array(z.enum(['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'])).optional(),
    endDate: z.date().optional(),
    maxOccurrences: z.number().int().min(1).optional()
  }).optional()
}).refine(data => data.scheduledEnd > data.scheduledStart, {
  message: 'Scheduled end must be after scheduled start',
  path: ['scheduledEnd']
}).refine(data => {
  if (data.isRecurring) {
    return data.recurrencePattern !== undefined
  }
  return true
}, {
  message: 'Recurrence pattern is required for recurring visits',
  path: ['recurrencePattern']
})

export const visitUpdateSchema = createOptionalUpdate(
  z.object({
    caregiverId: uuidSchema,
    scheduledStart: z.date(),
    scheduledEnd: z.date(),
    actualStart: z.date(),
    actualEnd: z.date(),
    status: visitStatusSchema,
    visitType: z.enum(['REGULAR_CARE', 'RESPITE_CARE', 'EMERGENCY_CARE', 'ASSESSMENT', 'SUPERVISION']),
    notes: z.string(),
    clientSignature: z.string(), // Base64 or file path
    caregiverNotes: z.string(),
    billableHours: z.number().min(0).max(24),
    mileage: z.number().min(0)
  })
)

export const visitSearchSchema = z.object({
  clientId: uuidSchema.optional(),
  caregiverId: uuidSchema.optional(),
  status: visitStatusSchema.optional(),
  visitType: z.enum(['REGULAR_CARE', 'RESPITE_CARE', 'EMERGENCY_CARE', 'ASSESSMENT', 'SUPERVISION']).optional(),
  dateRange: dateRangeSchema.optional(),
  coordinatorId: uuidSchema.optional(),
  ...paginationSchema.shape
})

// ===== VISIT TASK SCHEMAS =====

export const visitTaskUpdateSchema = z.object({
  taskId: uuidSchema,
  isCompleted: z.boolean(),
  notes: z.string().optional(),
  completedAt: z.date().optional()
})

export const visitTaskBulkUpdateSchema = z.object({
  visitId: uuidSchema,
  tasks: z.array(z.object({
    taskId: uuidSchema,
    isCompleted: z.boolean(),
    notes: z.string().optional(),
    completedAt: z.date().optional()
  }))
})

// ===== EVV (ELECTRONIC VISIT VERIFICATION) SCHEMAS =====

export const evvClockInSchema = z.object({
  visitId: uuidSchema,
  timestamp: z.date().default(() => new Date()),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  deviceId: z.string().optional(),
  notes: z.string().optional()
})

export const evvClockOutSchema = z.object({
  visitId: uuidSchema,
  timestamp: z.date().default(() => new Date()),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  deviceId: z.string().optional(),
  completionNotes: z.string().optional(),
  clientSignature: z.string().optional() // Base64 signature
})

export const evvEventCreateSchema = z.object({
  visitId: uuidSchema,
  eventType: z.enum(['CLOCK_IN', 'CLOCK_OUT', 'BREAK_START', 'BREAK_END', 'LOCATION_UPDATE']),
  timestamp: z.date().default(() => new Date()),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
  deviceId: z.string().optional(),
  ipAddress: z.string().ip().optional(),
  userAgent: z.string().optional(),
  telephony: z.string().optional() // Phone number if phone verification
})

// ===== SCHEDULE MANAGEMENT SCHEMAS =====

export const scheduleTemplateSchema = z.object({
  name: z.string().min(1, 'Template name is required').max(100),
  description: z.string().optional(),
  isActive: z.boolean().default(true),
  
  schedule: z.array(z.object({
    dayOfWeek: z.enum(['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY']),
    startTime: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/),
    endTime: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/),
    visitType: z.enum(['REGULAR_CARE', 'RESPITE_CARE', 'EMERGENCY_CARE', 'ASSESSMENT', 'SUPERVISION']).default('REGULAR_CARE')
  })),
  
  defaultTasks: z.array(z.object({
    taskName: z.string(),
    category: taskCategorySchema,
    estimatedDuration: z.number().int().min(5)
  })).optional()
})

export const bulkScheduleCreateSchema = z.object({
  clientId: uuidSchema,
  caregiverId: uuidSchema.optional(),
  templateId: uuidSchema.optional(),
  
  dateRange: z.object({
    startDate: z.date(),
    endDate: z.date()
  }),
  
  pattern: z.object({
    daysOfWeek: z.array(z.enum(['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'])),
    startTime: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/),
    endTime: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/),
    visitType: z.enum(['REGULAR_CARE', 'RESPITE_CARE', 'EMERGENCY_CARE', 'ASSESSMENT', 'SUPERVISION']).default('REGULAR_CARE')
  }),
  
  excludeDates: z.array(z.date()).optional(), // Holidays, blackout dates
  includeWeekends: z.boolean().default(false),
  
  tasks: z.array(z.object({
    taskName: z.string(),
    category: taskCategorySchema,
    estimatedDuration: z.number().int().min(5)
  })).optional()
}).refine(data => data.dateRange.endDate >= data.dateRange.startDate, {
  message: 'End date must be after start date',
  path: ['dateRange', 'endDate']
})

// ===== CONFLICT DETECTION SCHEMAS =====

export const scheduleConflictCheckSchema = z.object({
  caregiverId: uuidSchema.optional(),
  clientId: uuidSchema.optional(),
  scheduledStart: z.date(),
  scheduledEnd: z.date(),
  excludeVisitId: uuidSchema.optional() // Exclude this visit from conflict check (for updates)
})

export const conflictResolutionSchema = z.object({
  conflictId: uuidSchema,
  resolution: z.enum(['RESCHEDULE', 'REASSIGN_CAREGIVER', 'SPLIT_VISIT', 'CANCEL']),
  newSchedule: z.object({
    scheduledStart: z.date(),
    scheduledEnd: z.date(),
    caregiverId: uuidSchema.optional()
  }).optional(),
  notes: z.string().optional()
})

// ===== VISIT CANCELLATION SCHEMAS =====

export const visitCancellationSchema = z.object({
  visitId: uuidSchema,
  reason: z.enum([
    'CLIENT_ILLNESS', 'CLIENT_REQUEST', 'CAREGIVER_ILLNESS', 'CAREGIVER_UNAVAILABLE',
    'WEATHER', 'EMERGENCY', 'SCHEDULING_CONFLICT', 'OTHER'
  ]),
  cancellationNotes: z.string().optional(),
  cancelledBy: uuidSchema,
  notifyClient: z.boolean().default(true),
  notifyCaregiver: z.boolean().default(true),
  
  // Rescheduling options
  reschedule: z.object({
    proposedDate: z.date(),
    proposedStartTime: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/),
    proposedEndTime: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/),
    alternativeCaregiver: uuidSchema.optional()
  }).optional()
})

// ===== OVERTIME MANAGEMENT SCHEMAS =====

export const overtimeRequestSchema = z.object({
  visitId: uuidSchema,
  requestedBy: uuidSchema,
  reason: z.string().min(1, 'Reason for overtime is required'),
  estimatedAdditionalMinutes: z.number().int().min(1).max(480),
  isEmergency: z.boolean().default(false),
  clientApproval: z.boolean().default(false)
})

export const overtimeApprovalSchema = z.object({
  overtimeRequestId: uuidSchema,
  approved: z.boolean(),
  approvedBy: uuidSchema,
  approvalNotes: z.string().optional(),
  maxAdditionalMinutes: z.number().int().min(1).optional() // If approved for less than requested
})

// ===== RESPONSE SCHEMAS =====

export const visitSchema = z.object({
  id: uuidSchema,
  clientId: uuidSchema,
  caregiverId: uuidSchema.nullable(),
  scheduledStart: z.date(),
  scheduledEnd: z.date(),
  actualStart: z.date().nullable(),
  actualEnd: z.date().nullable(),
  status: visitStatusSchema,
  visitType: z.enum(['REGULAR_CARE', 'RESPITE_CARE', 'EMERGENCY_CARE', 'ASSESSMENT', 'SUPERVISION']),
  notes: z.string().nullable(),
  clientSignature: z.string().nullable(),
  caregiverNotes: z.string().nullable(),
  billableHours: z.number().nullable(),
  mileage: z.number().nullable(),
  createdAt: z.date(),
  updatedAt: z.date()
})

export const visitTaskSchema = z.object({
  id: uuidSchema,
  visitId: uuidSchema,
  taskName: z.string(),
  category: taskCategorySchema,
  isCompleted: z.boolean(),
  notes: z.string().nullable(),
  completedAt: z.date().nullable()
})

export const evvEventSchema = z.object({
  id: uuidSchema,
  visitId: uuidSchema,
  eventType: z.enum(['CLOCK_IN', 'CLOCK_OUT', 'BREAK_START', 'BREAK_END', 'LOCATION_UPDATE']),
  timestamp: z.date(),
  latitude: z.number().nullable(),
  longitude: z.number().nullable(),
  deviceId: z.string().nullable(),
  ipAddress: z.string().nullable(),
  userAgent: z.string().nullable(),
  telephony: z.string().nullable(),
  createdAt: z.date()
})

export const visitWithDetailsSchema = visitSchema.extend({
  client: z.object({
    id: uuidSchema,
    firstName: z.string(),
    lastName: z.string(),
    address: z.object({
      street1: z.string(),
      city: z.string(),
      state: z.string(),
      zipCode: z.string()
    })
  }),
  caregiver: z.object({
    id: uuidSchema,
    firstName: z.string(),
    lastName: z.string(),
    primaryPhone: z.string()
  }).nullable(),
  tasks: z.array(visitTaskSchema),
  evvEvents: z.array(evvEventSchema)
})

export const scheduleConflictSchema = z.object({
  conflictType: z.enum(['CAREGIVER_DOUBLE_BOOKED', 'CLIENT_OVERLAP', 'OUTSIDE_AVAILABILITY', 'TRAVEL_TIME']),
  message: z.string(),
  conflictingVisits: z.array(visitSchema),
  suggestions: z.array(z.object({
    type: z.enum(['RESCHEDULE', 'REASSIGN', 'SPLIT'],),
    description: z.string(),
    proposedChange: z.any()
  }))
})

export const scheduleStatsSchema = z.object({
  totalVisits: z.number(),
  completedVisits: z.number(),
  cancelledVisits: z.number(),
  noShowVisits: z.number(),
  totalHours: z.number(),
  billableHours: z.number(),
  averageVisitDuration: z.number(),
  punctualityRate: z.number(), // Percentage of on-time visits
  completionRate: z.number() // Percentage of visits completed
})

// ===== EXPORT ALL VISIT SCHEMAS =====

export const visitSchemas = {
  // Core CRUD
  visitCreate: visitCreateSchema,
  visitUpdate: visitUpdateSchema,
  visitSearch: visitSearchSchema,
  
  // Visit Tasks
  visitTaskUpdate: visitTaskUpdateSchema,
  visitTaskBulkUpdate: visitTaskBulkUpdateSchema,
  
  // EVV
  evvClockIn: evvClockInSchema,
  evvClockOut: evvClockOutSchema,
  evvEventCreate: evvEventCreateSchema,
  
  // Scheduling
  scheduleTemplate: scheduleTemplateSchema,
  bulkScheduleCreate: bulkScheduleCreateSchema,
  scheduleConflictCheck: scheduleConflictCheckSchema,
  conflictResolution: conflictResolutionSchema,
  
  // Cancellation
  visitCancellation: visitCancellationSchema,
  
  // Overtime
  overtimeRequest: overtimeRequestSchema,
  overtimeApproval: overtimeApprovalSchema,
  
  // Responses
  visit: visitSchema,
  visitTask: visitTaskSchema,
  evvEvent: evvEventSchema,
  visitWithDetails: visitWithDetailsSchema,
  scheduleConflict: scheduleConflictSchema,
  scheduleStats: scheduleStatsSchema
}