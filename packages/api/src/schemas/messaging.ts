import { z } from 'zod'
import { 
  uuidSchema, 
  paginationSchema,
  dateRangeSchema,
  createOptionalUpdate
} from './shared'

// ===== MESSAGE THREAD SCHEMAS =====

export const messageThreadCreateSchema = z.object({
  subject: z.string().min(1, 'Subject is required').max(200).optional(),
  threadType: z.enum(['GENERAL', 'INCIDENT', 'COORDINATION', 'FAMILY_UPDATES', 'BILLING']).default('GENERAL'),
  
  // Participants
  participantIds: z.array(uuidSchema).min(2, 'At least 2 participants are required'),
  
  // Initial message
  initialMessage: z.object({
    content: z.string().min(1, 'Message content is required').max(2000),
    messageType: z.enum(['TEXT', 'SYSTEM', 'INCIDENT_REPORT', 'REMINDER']).default('TEXT'),
    attachments: z.array(z.object({
      fileName: z.string(),
      fileSize: z.number().positive(),
      mimeType: z.string(),
      fileUrl: z.string().url()
    })).optional()
  }),
  
  // Context
  clientId: uuidSchema.optional(), // Link to specific client if relevant
  visitId: uuidSchema.optional(), // Link to specific visit if relevant
  
  // Settings
  isUrgent: z.boolean().default(false),
  allowFileAttachments: z.boolean().default(true)
})

export const messageThreadUpdateSchema = createOptionalUpdate(
  z.object({
    subject: z.string().min(1).max(200),
    isActive: z.boolean(),
    allowFileAttachments: z.boolean()
  })
)

export const messageThreadSearchSchema = z.object({
  participantId: uuidSchema.optional(), // Messages where user is participant
  threadType: z.enum(['GENERAL', 'INCIDENT', 'COORDINATION', 'FAMILY_UPDATES', 'BILLING']).optional(),
  clientId: uuidSchema.optional(),
  hasUnreadMessages: z.boolean().optional(),
  isUrgent: z.boolean().optional(),
  dateRange: dateRangeSchema.optional(),
  query: z.string().optional(), // Search in subject and message content
  ...paginationSchema.shape
})

// ===== MESSAGE SCHEMAS =====

export const messageCreateSchema = z.object({
  threadId: uuidSchema,
  content: z.string().min(1, 'Message content is required').max(2000),
  messageType: z.enum(['TEXT', 'SYSTEM', 'INCIDENT_REPORT', 'REMINDER']).default('TEXT'),
  
  // Attachments
  attachments: z.array(z.object({
    fileName: z.string().min(1, 'File name is required'),
    fileSize: z.number().positive('File size must be positive'),
    mimeType: z.string().min(1, 'MIME type is required'),
    fileUrl: z.string().url('Valid file URL is required')
  })).max(5, 'Maximum 5 attachments per message').optional(),
  
  // Special message properties
  isUrgent: z.boolean().default(false),
  expiresAt: z.date().optional(), // For temporary messages
  
  // Reply context
  replyToMessageId: uuidSchema.optional(),
  
  // Scheduling (for reminders)
  scheduledFor: z.date().optional()
})

export const messageUpdateSchema = createOptionalUpdate(
  z.object({
    content: z.string().min(1).max(2000),
    isUrgent: z.boolean(),
    expiresAt: z.date()
  })
)

export const messageSearchSchema = z.object({
  threadId: uuidSchema.optional(),
  senderId: uuidSchema.optional(),
  messageType: z.enum(['TEXT', 'SYSTEM', 'INCIDENT_REPORT', 'REMINDER']).optional(),
  hasAttachments: z.boolean().optional(),
  isUrgent: z.boolean().optional(),
  dateRange: dateRangeSchema.optional(),
  query: z.string().optional(), // Full-text search in content
  ...paginationSchema.shape
})

// ===== PARTICIPANT MANAGEMENT SCHEMAS =====

export const addParticipantSchema = z.object({
  threadId: uuidSchema,
  userId: uuidSchema,
  addedBy: uuidSchema.optional() // Who added this participant
})

export const removeParticipantSchema = z.object({
  threadId: uuidSchema,
  userId: uuidSchema,
  removedBy: uuidSchema.optional() // Who removed this participant
})

export const participantUpdateSchema = z.object({
  threadId: uuidSchema,
  userId: uuidSchema,
  permissions: z.object({
    canAddParticipants: z.boolean().default(false),
    canRemoveParticipants: z.boolean().default(false),
    canUploadFiles: z.boolean().default(true),
    canDeleteMessages: z.boolean().default(false)
  }).optional()
})

// ===== MESSAGE READ STATUS SCHEMAS =====

export const markMessageReadSchema = z.object({
  messageId: uuidSchema,
  readAt: z.date().default(() => new Date())
})

export const markMultipleReadSchema = z.object({
  messageIds: z.array(uuidSchema).min(1, 'At least one message ID is required'),
  readAt: z.date().default(() => new Date())
})

export const markThreadReadSchema = z.object({
  threadId: uuidSchema,
  readUpToMessageId: uuidSchema.optional(), // Mark all messages up to this one as read
  readAt: z.date().default(() => new Date())
})

// ===== NOTIFICATION SCHEMAS =====

export const notificationPreferencesSchema = z.object({
  userId: uuidSchema,
  preferences: z.object({
    emailNotifications: z.boolean().default(true),
    smsNotifications: z.boolean().default(false),
    pushNotifications: z.boolean().default(true),
    
    // Specific notification types
    newMessage: z.boolean().default(true),
    urgentMessage: z.boolean().default(true),
    visitReminder: z.boolean().default(true),
    scheduleChange: z.boolean().default(true),
    paymentDue: z.boolean().default(true),
    
    // Timing
    quietHoursStart: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/).default('22:00'),
    quietHoursEnd: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/).default('08:00'),
    timezone: z.string().default('America/New_York')
  })
})

export const sendNotificationSchema = z.object({
  recipientIds: z.array(uuidSchema).min(1, 'At least one recipient is required'),
  type: z.enum([
    'NEW_MESSAGE', 'URGENT_MESSAGE', 'VISIT_REMINDER', 'VISIT_CANCELLED',
    'SCHEDULE_CHANGE', 'PAYMENT_DUE', 'PAYMENT_RECEIVED', 'DOCUMENT_UPLOADED',
    'CREDENTIAL_EXPIRING', 'INCIDENT_REPORTED', 'SYSTEM_MAINTENANCE'
  ]),
  title: z.string().min(1, 'Notification title is required').max(100),
  message: z.string().min(1, 'Notification message is required').max(500),
  
  // Delivery channels
  channels: z.object({
    email: z.boolean().default(true),
    sms: z.boolean().default(false),
    push: z.boolean().default(true),
    inApp: z.boolean().default(true)
  }),
  
  // Context
  relatedEntityType: z.enum(['MESSAGE', 'VISIT', 'INVOICE', 'DOCUMENT', 'USER']).optional(),
  relatedEntityId: uuidSchema.optional(),
  
  // Scheduling
  sendAt: z.date().optional(), // Send immediately if not specified
  
  // Priority
  priority: z.enum(['LOW', 'NORMAL', 'HIGH', 'URGENT']).default('NORMAL')
})

// ===== TEMPLATE SCHEMAS =====

export const messageTemplateSchema = z.object({
  name: z.string().min(1, 'Template name is required').max(100),
  description: z.string().max(500).optional(),
  category: z.enum([
    'VISIT_REMINDER', 'VISIT_CONFIRMATION', 'CANCELLATION', 'SCHEDULE_CHANGE',
    'PAYMENT_REMINDER', 'WELCOME', 'INCIDENT_FOLLOW_UP', 'SATISFACTION_SURVEY'
  ]),
  
  // Template content
  subject: z.string().min(1, 'Subject template is required').max(200),
  content: z.string().min(1, 'Content template is required').max(2000),
  
  // Variables that can be used in the template
  variables: z.array(z.object({
    name: z.string(),
    description: z.string(),
    defaultValue: z.string().optional(),
    required: z.boolean().default(false)
  })).optional(),
  
  // Settings
  isActive: z.boolean().default(true),
  allowCustomization: z.boolean().default(true)
})

export const messageFromTemplateSchema = z.object({
  templateId: uuidSchema,
  recipientIds: z.array(uuidSchema).min(1, 'At least one recipient is required'),
  
  // Variable substitutions
  variables: z.record(z.string()).optional(),
  
  // Overrides
  customSubject: z.string().max(200).optional(),
  customContent: z.string().max(2000).optional(),
  
  // Context
  clientId: uuidSchema.optional(),
  visitId: uuidSchema.optional(),
  
  // Scheduling
  sendAt: z.date().optional()
})

// ===== MASS COMMUNICATION SCHEMAS =====

export const broadcastMessageSchema = z.object({
  subject: z.string().min(1, 'Subject is required').max(200),
  content: z.string().min(1, 'Content is required').max(2000),
  
  // Recipient filters
  recipientFilters: z.object({
    roles: z.array(z.enum(['CLIENT', 'FAMILY', 'CAREGIVER', 'COORDINATOR', 'ADMIN'])).optional(),
    clientIds: z.array(uuidSchema).optional(),
    caregiverIds: z.array(uuidSchema).optional(),
    hasActiveVisits: z.boolean().optional(),
    location: z.object({
      cities: z.array(z.string()).optional(),
      states: z.array(z.string()).optional(),
      zipCodes: z.array(z.string()).optional()
    }).optional()
  }),
  
  // Delivery options
  deliveryChannels: z.object({
    email: z.boolean().default(true),
    sms: z.boolean().default(false),
    inApp: z.boolean().default(true)
  }),
  
  // Scheduling
  sendAt: z.date().optional(),
  
  // Tracking
  trackDelivery: z.boolean().default(true),
  trackReads: z.boolean().default(true)
})

// ===== RESPONSE SCHEMAS =====

export const messageThreadSchema = z.object({
  id: uuidSchema,
  subject: z.string().nullable(),
  threadType: z.enum(['GENERAL', 'INCIDENT', 'COORDINATION', 'FAMILY_UPDATES', 'BILLING']),
  isActive: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date()
})

export const messageSchema = z.object({
  id: uuidSchema,
  threadId: uuidSchema,
  senderId: uuidSchema,
  content: z.string(),
  messageType: z.enum(['TEXT', 'SYSTEM', 'INCIDENT_REPORT', 'REMINDER']),
  isUrgent: z.boolean(),
  replyToMessageId: uuidSchema.nullable(),
  scheduledFor: z.date().nullable(),
  expiresAt: z.date().nullable(),
  createdAt: z.date(),
  updatedAt: z.date()
})

export const messageAttachmentSchema = z.object({
  id: uuidSchema,
  messageId: uuidSchema,
  fileName: z.string(),
  fileSize: z.number(),
  mimeType: z.string(),
  fileUrl: z.string(),
  createdAt: z.date()
})

export const threadParticipantSchema = z.object({
  threadId: uuidSchema,
  userId: uuidSchema,
  user: z.object({
    id: uuidSchema,
    firstName: z.string(),
    lastName: z.string(),
    email: z.string(),
    role: z.enum(['CLIENT', 'FAMILY', 'CAREGIVER', 'COORDINATOR', 'ADMIN'])
  }),
  joinedAt: z.date(),
  leftAt: z.date().nullable()
})

export const messageReadSchema = z.object({
  messageId: uuidSchema,
  userId: uuidSchema,
  readAt: z.date()
})

export const messageWithDetailsSchema = messageSchema.extend({
  sender: z.object({
    id: uuidSchema,
    firstName: z.string(),
    lastName: z.string(),
    role: z.enum(['CLIENT', 'FAMILY', 'CAREGIVER', 'COORDINATOR', 'ADMIN'])
  }),
  attachments: z.array(messageAttachmentSchema),
  readBy: z.array(messageReadSchema),
  replyTo: messageSchema.nullable()
})

export const threadWithDetailsSchema = messageThreadSchema.extend({
  participants: z.array(threadParticipantSchema),
  lastMessage: messageWithDetailsSchema.nullable(),
  unreadCount: z.number(),
  totalMessages: z.number()
})

export const notificationSchema = z.object({
  id: uuidSchema,
  recipientId: uuidSchema,
  type: z.string(),
  title: z.string(),
  message: z.string(),
  relatedEntityType: z.string().nullable(),
  relatedEntityId: uuidSchema.nullable(),
  isRead: z.boolean(),
  deliveredAt: z.date().nullable(),
  readAt: z.date().nullable(),
  createdAt: z.date()
})

export const messagingStatsSchema = z.object({
  totalThreads: z.number(),
  activeThreads: z.number(),
  totalMessages: z.number(),
  unreadMessages: z.number(),
  messagesSentToday: z.number(),
  averageResponseTime: z.number(), // in minutes
  
  // By thread type
  threadsByType: z.record(z.number()),
  
  // Activity over time
  dailyActivity: z.array(z.object({
    date: z.string(),
    messagesCount: z.number(),
    threadsCreated: z.number()
  }))
})

// ===== EXPORT ALL MESSAGING SCHEMAS =====

export const messagingSchemas = {
  // Threads
  messageThreadCreate: messageThreadCreateSchema,
  messageThreadUpdate: messageThreadUpdateSchema,
  messageThreadSearch: messageThreadSearchSchema,
  
  // Messages
  messageCreate: messageCreateSchema,
  messageUpdate: messageUpdateSchema,
  messageSearch: messageSearchSchema,
  
  // Participants
  addParticipant: addParticipantSchema,
  removeParticipant: removeParticipantSchema,
  participantUpdate: participantUpdateSchema,
  
  // Read Status
  markMessageRead: markMessageReadSchema,
  markMultipleRead: markMultipleReadSchema,
  markThreadRead: markThreadReadSchema,
  
  // Notifications
  notificationPreferences: notificationPreferencesSchema,
  sendNotification: sendNotificationSchema,
  
  // Templates
  messageTemplate: messageTemplateSchema,
  messageFromTemplate: messageFromTemplateSchema,
  
  // Mass Communication
  broadcastMessage: broadcastMessageSchema,
  
  // Responses
  messageThread: messageThreadSchema,
  message: messageSchema,
  messageAttachment: messageAttachmentSchema,
  threadParticipant: threadParticipantSchema,
  messageRead: messageReadSchema,
  messageWithDetails: messageWithDetailsSchema,
  threadWithDetails: threadWithDetailsSchema,
  notification: notificationSchema,
  messagingStats: messagingStatsSchema
}