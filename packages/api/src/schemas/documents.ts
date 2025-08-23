import { z } from 'zod'
import { 
  uuidSchema, 
  paginationSchema,
  dateRangeSchema,
  createOptionalUpdate
} from './shared'

// ===== DOCUMENT UPLOAD SCHEMAS =====

export const documentUploadSchema = z.object({
  fileName: z.string().min(1, 'File name is required').max(255),
  originalName: z.string().min(1, 'Original file name is required').max(255),
  fileSize: z.number().positive('File size must be positive').max(50 * 1024 * 1024), // 50MB max
  mimeType: z.string().min(1, 'MIME type is required'),
  fileUrl: z.string().url('Valid file URL is required'),
  
  // Metadata
  documentType: z.enum([
    'SERVICE_AGREEMENT', 'CARE_PLAN', 'ASSESSMENT', 'INCIDENT_REPORT',
    'CREDENTIAL', 'IDENTIFICATION', 'INSURANCE_CARD', 'EMERGENCY_CONTACT',
    'MEDICAL_FORM', 'PHOTO', 'OTHER'
  ]),
  
  tags: z.array(z.string().max(50)).max(10, 'Maximum 10 tags allowed').default([]),
  description: z.string().max(500).optional(),
  
  // Access control
  accessLevel: z.enum(['PUBLIC', 'INTERNAL', 'PRIVATE', 'CONFIDENTIAL']).default('PRIVATE'),
  
  // Associations
  clientId: uuidSchema.optional(),
  caregiverId: uuidSchema.optional(),
  visitId: uuidSchema.optional(),
  
  // Security
  isEncrypted: z.boolean().default(false),
  requiresSignature: z.boolean().default(false),
  
  // Compliance
  retentionPeriod: z.number().int().min(0).optional(), // Days to retain
  isComplianceDocument: z.boolean().default(false)
})

export const documentUpdateSchema = createOptionalUpdate(
  z.object({
    fileName: z.string().min(1).max(255),
    documentType: z.enum([
      'SERVICE_AGREEMENT', 'CARE_PLAN', 'ASSESSMENT', 'INCIDENT_REPORT',
      'CREDENTIAL', 'IDENTIFICATION', 'INSURANCE_CARD', 'EMERGENCY_CONTACT',
      'MEDICAL_FORM', 'PHOTO', 'OTHER'
    ]),
    tags: z.array(z.string().max(50)).max(10),
    description: z.string().max(500),
    accessLevel: z.enum(['PUBLIC', 'INTERNAL', 'PRIVATE', 'CONFIDENTIAL']),
    status: z.enum(['ACTIVE', 'ARCHIVED', 'DELETED']),
    retentionPeriod: z.number().int().min(0)
  })
)

export const documentSearchSchema = z.object({
  query: z.string().optional(), // Search in file name, description, tags
  documentType: z.enum([
    'SERVICE_AGREEMENT', 'CARE_PLAN', 'ASSESSMENT', 'INCIDENT_REPORT',
    'CREDENTIAL', 'IDENTIFICATION', 'INSURANCE_CARD', 'EMERGENCY_CONTACT',
    'MEDICAL_FORM', 'PHOTO', 'OTHER'
  ]).optional(),
  tags: z.array(z.string()).optional(),
  clientId: uuidSchema.optional(),
  caregiverId: uuidSchema.optional(),
  uploadedBy: uuidSchema.optional(),
  accessLevel: z.enum(['PUBLIC', 'INTERNAL', 'PRIVATE', 'CONFIDENTIAL']).optional(),
  status: z.enum(['ACTIVE', 'ARCHIVED', 'DELETED']).optional(),
  isEncrypted: z.boolean().optional(),
  uploadDateRange: dateRangeSchema.optional(),
  fileSizeRange: z.object({
    min: z.number().min(0).optional(),
    max: z.number().min(0).optional()
  }).optional(),
  mimeTypes: z.array(z.string()).optional(),
  ...paginationSchema.shape
})

// ===== DOCUMENT VERSION SCHEMAS =====

export const documentVersionCreateSchema = z.object({
  documentId: uuidSchema,
  fileName: z.string().min(1).max(255),
  fileSize: z.number().positive(),
  mimeType: z.string().min(1),
  fileUrl: z.string().url(),
  versionNotes: z.string().max(500).optional(),
  
  // Changes from previous version
  changesSummary: z.string().max(1000).optional(),
  majorVersion: z.boolean().default(false) // Major vs minor version
})

export const documentVersionUpdateSchema = createOptionalUpdate(
  z.object({
    versionNotes: z.string().max(500),
    changesSummary: z.string().max(1000),
    isLatest: z.boolean()
  })
)

// ===== DOCUMENT SHARING SCHEMAS =====

export const documentShareSchema = z.object({
  documentId: uuidSchema,
  shareWithUserIds: z.array(uuidSchema).min(1, 'At least one user must be specified'),
  permissions: z.object({
    canView: z.boolean().default(true),
    canDownload: z.boolean().default(true),
    canComment: z.boolean().default(false),
    canEdit: z.boolean().default(false),
    canShare: z.boolean().default(false)
  }),
  
  // Expiration
  expiresAt: z.date().optional(),
  
  // Notification
  notifyUsers: z.boolean().default(true),
  shareMessage: z.string().max(500).optional()
})

export const documentShareLinkSchema = z.object({
  documentId: uuidSchema,
  allowAnonymousAccess: z.boolean().default(false),
  requiresPassword: z.boolean().default(false),
  password: z.string().min(8).optional(),
  maxDownloads: z.number().int().min(1).optional(),
  expiresAt: z.date().optional(),
  
  // Tracking
  trackDownloads: z.boolean().default(true),
  trackViews: z.boolean().default(true)
})

// ===== DOCUMENT SIGNATURE SCHEMAS =====

export const documentSignatureRequestSchema = z.object({
  documentId: uuidSchema,
  signerUserIds: z.array(uuidSchema).min(1, 'At least one signer is required'),
  
  // Signature fields
  signatureFields: z.array(z.object({
    id: z.string().min(1),
    type: z.enum(['SIGNATURE', 'INITIAL', 'DATE', 'TEXT']),
    required: z.boolean().default(true),
    signerUserId: uuidSchema,
    
    // Position on document (if PDF)
    page: z.number().int().min(1).optional(),
    x: z.number().min(0).optional(),
    y: z.number().min(0).optional(),
    width: z.number().positive().optional(),
    height: z.number().positive().optional(),
    
    // Field-specific properties
    placeholder: z.string().max(100).optional(),
    validation: z.string().optional() // Regex for text fields
  })),
  
  // Settings
  requireAllSignatures: z.boolean().default(true),
  signingOrder: z.array(uuidSchema).optional(), // Order if sequential signing required
  
  // Notifications
  sendReminders: z.boolean().default(true),
  reminderInterval: z.number().int().min(1).max(30).default(3), // Days
  
  // Deadline
  dueDate: z.date().optional(),
  
  // Message to signers
  message: z.string().max(1000).optional()
})

export const documentSignatureSubmitSchema = z.object({
  signatureRequestId: uuidSchema,
  signatures: z.array(z.object({
    fieldId: z.string(),
    value: z.string().min(1), // Signature data, date, or text
    signedAt: z.date().default(() => new Date()),
    
    // For image signatures
    imageData: z.string().optional(), // Base64 encoded signature image
    
    // For typed signatures
    fontFamily: z.string().optional(),
    fontSize: z.number().positive().optional()
  })).min(1, 'At least one signature is required'),
  
  // Optional client information
  ipAddress: z.string().ip().optional(),
  userAgent: z.string().optional(),
  location: z.object({
    latitude: z.number(),
    longitude: z.number()
  }).optional()
})

// ===== DOCUMENT COMMENT SCHEMAS =====

export const documentCommentCreateSchema = z.object({
  documentId: uuidSchema,
  content: z.string().min(1, 'Comment content is required').max(1000),
  
  // Position (for PDF annotations)
  page: z.number().int().min(1).optional(),
  x: z.number().min(0).optional(),
  y: z.number().min(0).optional(),
  
  // Comment type
  commentType: z.enum(['GENERAL', 'ANNOTATION', 'REVIEW', 'APPROVAL_REQUEST']).default('GENERAL'),
  
  // Reply context
  replyToCommentId: uuidSchema.optional(),
  
  // Visibility
  isPrivate: z.boolean().default(false), // Only visible to commenter and document owner
  
  // Status (for review comments)
  status: z.enum(['PENDING', 'RESOLVED', 'REJECTED']).optional()
})

export const documentCommentUpdateSchema = createOptionalUpdate(
  z.object({
    content: z.string().min(1).max(1000),
    status: z.enum(['PENDING', 'RESOLVED', 'REJECTED']),
    isPrivate: z.boolean()
  })
)

// ===== DOCUMENT APPROVAL SCHEMAS =====

export const documentApprovalRequestSchema = z.object({
  documentId: uuidSchema,
  approverUserIds: z.array(uuidSchema).min(1, 'At least one approver is required'),
  
  // Approval requirements
  requireAllApprovals: z.boolean().default(false), // If false, any one approval is sufficient
  approvalOrder: z.array(uuidSchema).optional(), // Sequential approval order
  
  // Settings
  dueDate: z.date().optional(),
  allowComments: z.boolean().default(true),
  requireComments: z.boolean().default(false),
  
  // Notifications
  sendReminders: z.boolean().default(true),
  reminderInterval: z.number().int().min(1).max(30).default(7), // Days
  
  // Message to approvers
  message: z.string().max(1000).optional()
})

export const documentApprovalSubmitSchema = z.object({
  approvalRequestId: uuidSchema,
  approved: z.boolean(),
  comments: z.string().max(1000).optional(),
  
  // Conditional approval
  isConditional: z.boolean().default(false),
  conditions: z.string().max(500).optional() // Required if isConditional is true
})

// ===== DOCUMENT TEMPLATE SCHEMAS =====

export const documentTemplateCreateSchema = z.object({
  name: z.string().min(1, 'Template name is required').max(100),
  description: z.string().max(500).optional(),
  category: z.enum([
    'SERVICE_AGREEMENT', 'CARE_PLAN', 'ASSESSMENT_FORM', 'INCIDENT_REPORT',
    'CONSENT_FORM', 'INVOICE_TEMPLATE', 'OTHER'
  ]),
  
  // Template file
  templateFileUrl: z.string().url('Valid template file URL is required'),
  fileName: z.string().min(1).max(255),
  mimeType: z.string().min(1),
  
  // Variables that can be replaced
  variables: z.array(z.object({
    name: z.string().min(1, 'Variable name is required'),
    description: z.string().optional(),
    type: z.enum(['TEXT', 'DATE', 'NUMBER', 'BOOLEAN', 'SIGNATURE']),
    required: z.boolean().default(false),
    defaultValue: z.string().optional(),
    
    // Validation
    validation: z.object({
      minLength: z.number().min(0).optional(),
      maxLength: z.number().min(0).optional(),
      pattern: z.string().optional(), // Regex pattern
      options: z.array(z.string()).optional() // For dropdown/select fields
    }).optional()
  })).optional(),
  
  // Settings
  isActive: z.boolean().default(true),
  accessLevel: z.enum(['PUBLIC', 'INTERNAL', 'PRIVATE']).default('INTERNAL')
})

export const documentFromTemplateSchema = z.object({
  templateId: uuidSchema,
  fileName: z.string().min(1).max(255),
  
  // Variable values
  variables: z.record(z.any()).optional(),
  
  // Target associations
  clientId: uuidSchema.optional(),
  caregiverId: uuidSchema.optional(),
  
  // Settings
  accessLevel: z.enum(['PUBLIC', 'INTERNAL', 'PRIVATE', 'CONFIDENTIAL']).default('PRIVATE'),
  requiresSignature: z.boolean().default(false),
  
  // Auto-processing
  autoShare: z.object({
    userIds: z.array(uuidSchema),
    message: z.string().max(500).optional()
  }).optional()
})

// ===== RESPONSE SCHEMAS =====

export const documentSchema = z.object({
  id: uuidSchema,
  uploadedById: uuidSchema,
  clientId: uuidSchema.nullable(),
  fileName: z.string(),
  originalName: z.string(),
  fileSize: z.number(),
  mimeType: z.string(),
  fileUrl: z.string(),
  documentType: z.enum([
    'SERVICE_AGREEMENT', 'CARE_PLAN', 'ASSESSMENT', 'INCIDENT_REPORT',
    'CREDENTIAL', 'IDENTIFICATION', 'INSURANCE_CARD', 'EMERGENCY_CONTACT',
    'MEDICAL_FORM', 'PHOTO', 'OTHER'
  ]),
  tags: z.array(z.string()),
  description: z.string().nullable(),
  status: z.enum(['ACTIVE', 'ARCHIVED', 'DELETED']),
  isEncrypted: z.boolean(),
  accessLevel: z.enum(['PUBLIC', 'INTERNAL', 'PRIVATE', 'CONFIDENTIAL']),
  createdAt: z.date(),
  updatedAt: z.date()
})

export const documentVersionSchema = z.object({
  id: uuidSchema,
  documentId: uuidSchema,
  versionNumber: z.string(),
  fileName: z.string(),
  fileSize: z.number(),
  mimeType: z.string(),
  fileUrl: z.string(),
  versionNotes: z.string().nullable(),
  changesSummary: z.string().nullable(),
  isLatest: z.boolean(),
  createdAt: z.date()
})

export const documentShareResponseSchema = z.object({
  id: uuidSchema,
  documentId: uuidSchema,
  sharedById: uuidSchema,
  sharedWithUserId: uuidSchema,
  permissions: z.object({
    canView: z.boolean(),
    canDownload: z.boolean(),
    canComment: z.boolean(),
    canEdit: z.boolean(),
    canShare: z.boolean()
  }),
  expiresAt: z.date().nullable(),
  createdAt: z.date()
})

export const documentCommentSchema = z.object({
  id: uuidSchema,
  documentId: uuidSchema,
  userId: uuidSchema,
  content: z.string(),
  commentType: z.enum(['GENERAL', 'ANNOTATION', 'REVIEW', 'APPROVAL_REQUEST']),
  page: z.number().nullable(),
  x: z.number().nullable(),
  y: z.number().nullable(),
  replyToCommentId: uuidSchema.nullable(),
  isPrivate: z.boolean(),
  status: z.enum(['PENDING', 'RESOLVED', 'REJECTED']).nullable(),
  createdAt: z.date(),
  updatedAt: z.date()
})

export const documentWithDetailsSchema = documentSchema.extend({
  uploadedBy: z.object({
    id: uuidSchema,
    firstName: z.string(),
    lastName: z.string(),
    role: z.enum(['CLIENT', 'FAMILY', 'CAREGIVER', 'COORDINATOR', 'ADMIN'])
  }),
  client: z.object({
    id: uuidSchema,
    firstName: z.string(),
    lastName: z.string()
  }).nullable(),
  versions: z.array(documentVersionSchema),
  shares: z.array(documentShareResponseSchema),
  comments: z.array(documentCommentSchema),
  downloadCount: z.number(),
  lastDownloadedAt: z.date().nullable()
})

export const documentStatsSchema = z.object({
  totalDocuments: z.number(),
  documentsByType: z.record(z.number()),
  documentsByStatus: z.record(z.number()),
  totalStorage: z.number(), // in bytes
  documentsUploadedThisMonth: z.number(),
  pendingApprovals: z.number(),
  expiringDocuments: z.number(), // Documents with retention periods expiring soon
  
  // Usage stats
  mostDownloadedDocuments: z.array(z.object({
    id: uuidSchema,
    fileName: z.string(),
    downloadCount: z.number()
  })),
  
  // Activity over time
  dailyUploads: z.array(z.object({
    date: z.string(),
    count: z.number(),
    size: z.number()
  }))
})

// ===== EXPORT ALL DOCUMENT SCHEMAS =====

export const documentSchemas = {
  // Core CRUD
  documentUpload: documentUploadSchema,
  documentUpdate: documentUpdateSchema,
  documentSearch: documentSearchSchema,
  
  // Versions
  documentVersionCreate: documentVersionCreateSchema,
  documentVersionUpdate: documentVersionUpdateSchema,
  
  // Sharing
  documentShare: documentShareSchema,
  documentShareLink: documentShareLinkSchema,
  
  // Signatures
  documentSignatureRequest: documentSignatureRequestSchema,
  documentSignatureSubmit: documentSignatureSubmitSchema,
  
  // Comments
  documentCommentCreate: documentCommentCreateSchema,
  documentCommentUpdate: documentCommentUpdateSchema,
  
  // Approvals
  documentApprovalRequest: documentApprovalRequestSchema,
  documentApprovalSubmit: documentApprovalSubmitSchema,
  
  // Templates
  documentTemplateCreate: documentTemplateCreateSchema,
  documentFromTemplate: documentFromTemplateSchema,
  
  // Responses
  document: documentSchema,
  documentVersion: documentVersionSchema,
  documentShareResponse: documentShareResponseSchema,
  documentComment: documentCommentSchema,
  documentWithDetails: documentWithDetailsSchema,
  documentStats: documentStatsSchema
}
