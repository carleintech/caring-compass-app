import { z } from 'zod'
import { emailSchema, passwordSchema, userRoleSchema, phoneSchema } from './shared'

// ===== AUTHENTICATION SCHEMAS =====

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().optional().default(false)
})

export const registerSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  firstName: z.string().min(1, 'First name is required').max(50),
  lastName: z.string().min(1, 'Last name is required').max(50),
  role: userRoleSchema,
  phone: phoneSchema.optional(),
  inviteCode: z.string().optional()
})

export const passwordResetRequestSchema = z.object({
  email: emailSchema,
  redirectTo: z.string().url().optional()
})

export const passwordUpdateSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: passwordSchema
})

export const emailUpdateSchema = z.object({
  newEmail: emailSchema,
  password: z.string().min(1, 'Password is required for email change')
})

export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required')
})

// ===== USER MANAGEMENT SCHEMAS =====

export const userCreateSchema = z.object({
  email: emailSchema,
  role: userRoleSchema,
  isActive: z.boolean().default(true),
  profileData: z.any().optional() // Role-specific profile data
})

export const userUpdateSchema = z.object({
  email: emailSchema.optional(),
  role: userRoleSchema.optional(),
  isActive: z.boolean().optional()
})

export const userSearchSchema = z.object({
  query: z.string().optional(),
  role: userRoleSchema.optional(),
  isActive: z.boolean().optional(),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(20)
})

// ===== INVITE SYSTEM SCHEMAS =====

export const inviteUserSchema = z.object({
  email: emailSchema,
  role: userRoleSchema,
  profileData: z.any().optional(),
  sendEmail: z.boolean().default(true),
  customMessage: z.string().optional(),
  expirationDays: z.number().int().min(1).max(30).default(7)
})

export const acceptInviteSchema = z.object({
  inviteCode: z.string().min(1, 'Invite code is required'),
  password: passwordSchema,
  firstName: z.string().min(1, 'First name is required').max(50),
  lastName: z.string().min(1, 'Last name is required').max(50),
  additionalData: z.record(z.any()).optional()
})

export const resendInviteSchema = z.object({
  inviteId: z.string().uuid(),
  customMessage: z.string().optional()
})

// ===== MULTI-FACTOR AUTHENTICATION SCHEMAS =====

export const mfaSetupSchema = z.object({
  password: z.string().min(1, 'Password is required to setup MFA')
})

export const mfaVerifySchema = z.object({
  token: z.string().min(6, 'MFA token must be at least 6 characters').max(8),
  type: z.enum(['totp', 'backup']).default('totp')
})

export const mfaDisableSchema = z.object({
  password: z.string().min(1, 'Password is required to disable MFA'),
  confirmationToken: z.string().min(6, 'Confirmation token is required')
})

// ===== PROFILE MANAGEMENT SCHEMAS =====

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: passwordSchema,
  confirmPassword: z.string().min(1, 'Password confirmation is required')
}).refine(data => data.newPassword === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword']
})

export const updateProfileSchema = z.object({
  firstName: z.string().min(1).max(50).optional(),
  lastName: z.string().min(1).max(50).optional(),
  phone: phoneSchema.optional(),
  preferences: z.record(z.any()).optional()
})

// ===== SESSION MANAGEMENT SCHEMAS =====

export const sessionInfoSchema = z.object({
  includePermissions: z.boolean().default(false),
  includeProfile: z.boolean().default(true)
})

export const logoutSchema = z.object({
  logoutAllDevices: z.boolean().default(false)
})

// ===== PERMISSION SCHEMAS =====

export const checkPermissionSchema = z.object({
  resource: z.string().min(1, 'Resource is required'),
  action: z.enum(['create', 'read', 'update', 'delete']),
  scope: z.enum(['own', 'assigned', 'all']).optional()
})

export const checkMultiplePermissionsSchema = z.object({
  permissions: z.array(checkPermissionSchema),
  requireAll: z.boolean().default(false)
})

export const hasRoleSchema = z.object({
  roles: z.union([userRoleSchema, z.array(userRoleSchema)]),
  requireAll: z.boolean().default(false)
})

// ===== AUDIT LOG SCHEMAS =====

export const auditLogSearchSchema = z.object({
  userId: z.string().uuid().optional(),
  action: z.string().optional(),
  resourceType: z.string().optional(),
  dateRange: z.object({
    from: z.date(),
    to: z.date()
  }).optional(),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(20)
})

// ===== RESPONSE SCHEMAS =====

export const authUserSchema = z.object({
  id: z.string().uuid(),
  email: emailSchema,
  role: userRoleSchema,
  isActive: z.boolean(),
  emailVerified: z.boolean(),
  lastLoginAt: z.date().nullable(),
  createdAt: z.date(),
  updatedAt: z.date()
})

export const authSessionSchema = z.object({
  user: authUserSchema,
  accessToken: z.string(),
  refreshToken: z.string(),
  expiresAt: z.date()
})

export const loginResponseSchema = z.object({
  success: z.boolean(),
  data: authSessionSchema.optional(),
  message: z.string().optional(),
  requiresMfa: z.boolean().optional(),
  mfaToken: z.string().optional()
})

export const registerResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  emailVerificationRequired: z.boolean().optional()
})

export const userInviteSchema = z.object({
  id: z.string().uuid(),
  email: emailSchema,
  role: userRoleSchema,
  invitedBy: z.string().uuid(),
  inviteCode: z.string(),
  expiresAt: z.date(),
  acceptedAt: z.date().nullable(),
  createdAt: z.date()
})

export const mfaSetupResponseSchema = z.object({
  secret: z.string(),
  qrCode: z.string(), // Base64 encoded QR code
  backupCodes: z.array(z.string())
})

export const permissionCheckResponseSchema = z.object({
  hasPermission: z.boolean(),
  reason: z.string().optional()
})

export const auditLogSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid().nullable(),
  action: z.string(),
  resourceType: z.string(),
  resourceId: z.string().nullable(),
  oldValues: z.any().nullable(),
  newValues: z.any().nullable(),
  ipAddress: z.string().nullable(),
  userAgent: z.string().nullable(),
  timestamp: z.date()
})

// ===== ERROR SCHEMAS =====

export const authErrorSchema = z.object({
  code: z.string(),
  message: z.string(),
  statusCode: z.number().int(),
  details: z.any().optional()
})

// ===== VALIDATION HELPERS =====

export const validateInviteCode = (code: string): boolean => {
  return /^[a-zA-Z0-9]{16,32}$/.test(code)
}

export const validateMfaToken = (token: string): boolean => {
  return /^\d{6}$/.test(token) || /^[a-zA-Z0-9]{8}$/.test(token) // 6-digit TOTP or 8-char backup code
}

// ===== EXPORT ALL AUTH SCHEMAS =====

export const authSchemas = {
  // Authentication
  login: loginSchema,
  register: registerSchema,
  passwordResetRequest: passwordResetRequestSchema,
  passwordUpdate: passwordUpdateSchema,
  emailUpdate: emailUpdateSchema,
  refreshToken: refreshTokenSchema,
  
  // User Management
  userCreate: userCreateSchema,
  userUpdate: userUpdateSchema,
  userSearch: userSearchSchema,
  
  // Invites
  inviteUser: inviteUserSchema,
  acceptInvite: acceptInviteSchema,
  resendInvite: resendInviteSchema,
  
  // MFA
  mfaSetup: mfaSetupSchema,
  mfaVerify: mfaVerifySchema,
  mfaDisable: mfaDisableSchema,
  
  // Profile
  changePassword: changePasswordSchema,
  updateProfile: updateProfileSchema,
  
  // Session
  sessionInfo: sessionInfoSchema,
  logout: logoutSchema,
  
  // Permissions
  checkPermission: checkPermissionSchema,
  checkMultiplePermissions: checkMultiplePermissionsSchema,
  hasRole: hasRoleSchema,
  
  // Audit
  auditLogSearch: auditLogSearchSchema,
  
  // Responses
  authUser: authUserSchema,
  authSession: authSessionSchema,
  loginResponse: loginResponseSchema,
  registerResponse: registerResponseSchema,
  userInvite: userInviteSchema,
  mfaSetupResponse: mfaSetupResponseSchema,
  permissionCheckResponse: permissionCheckResponseSchema,
  auditLog: auditLogSchema,
  authError: authErrorSchema
}