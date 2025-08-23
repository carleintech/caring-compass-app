import { UserRole } from '@caring-compass/database'

// Core auth types
export interface AuthUser {
  id: string
  email: string
  role: UserRole
  isActive: boolean
  emailVerified: boolean
  lastLoginAt?: Date
  createdAt: Date
  updatedAt: Date
}

export interface AuthSession {
  user: AuthUser
  accessToken: string
  refreshToken: string
  expiresAt: Date
}

export interface LoginCredentials {
  email: string
  password: string
  rememberMe?: boolean
}

export interface RegisterCredentials {
  email: string
  password: string
  firstName: string
  lastName: string
  role: UserRole
  phone?: string
  inviteCode?: string
}

export interface PasswordResetRequest {
  email: string
  redirectTo?: string
}

export interface PasswordUpdateRequest {
  currentPassword: string
  newPassword: string
}

export interface EmailUpdateRequest {
  newEmail: string
  password: string
}

// Role-based permissions
export interface Permission {
  resource: string
  action: 'create' | 'read' | 'update' | 'delete'
  scope?: 'own' | 'assigned' | 'all'
}

export interface RolePermissions {
  role: UserRole
  permissions: Permission[]
}

// Auth context for frontend
export interface AuthContextType {
  user: AuthUser | null
  session: AuthSession | null
  loading: boolean
  signIn: (credentials: LoginCredentials) => Promise<AuthSession>
  signUp: (credentials: RegisterCredentials) => Promise<void>
  signOut: () => Promise<void>
  resetPassword: (request: PasswordResetRequest) => Promise<void>
  updatePassword: (request: PasswordUpdateRequest) => Promise<void>
  updateEmail: (request: EmailUpdateRequest) => Promise<void>
  refreshSession: () => Promise<AuthSession | null>
  hasPermission: (permission: Permission) => boolean
  hasRole: (roles: UserRole | UserRole[]) => boolean
}

// Auth middleware types
export interface AuthRequest extends Request {
  user?: AuthUser
  session?: AuthSession
}

export interface RouteGuardConfig {
  roles?: UserRole[]
  permissions?: Permission[]
  requireAll?: boolean // If true, user must have ALL roles/permissions
  redirectTo?: string
}

// Multi-factor authentication
export interface MFASetupResponse {
  secret: string
  qrCode: string
  backupCodes: string[]
}

export interface MFAVerificationRequest {
  token: string
  type: 'totp' | 'backup'
}

// Audit logging for auth events
export interface AuthAuditEvent {
  userId?: string
  action: AuthAction
  success: boolean
  ipAddress?: string
  userAgent?: string
  metadata?: Record<string, any>
  timestamp: Date
}

export enum AuthAction {
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
  REGISTER = 'REGISTER',
  PASSWORD_RESET_REQUEST = 'PASSWORD_RESET_REQUEST',
  PASSWORD_RESET_CONFIRM = 'PASSWORD_RESET_CONFIRM',
  PASSWORD_UPDATE = 'PASSWORD_UPDATE',
  EMAIL_UPDATE = 'EMAIL_UPDATE',
  EMAIL_VERIFY = 'EMAIL_VERIFY',
  MFA_ENABLE = 'MFA_ENABLE',
  MFA_DISABLE = 'MFA_DISABLE',
  MFA_VERIFY = 'MFA_VERIFY',
  TOKEN_REFRESH = 'TOKEN_REFRESH',
  ACCOUNT_LOCK = 'ACCOUNT_LOCK',
  ACCOUNT_UNLOCK = 'ACCOUNT_UNLOCK'
}

// Error types
export class AuthError extends Error {
  constructor(
    message: string,
    public code: AuthErrorCode,
    public statusCode: number = 400
  ) {
    super(message)
    this.name = 'AuthError'
  }
}

export enum AuthErrorCode {
  INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
  USER_NOT_FOUND = 'USER_NOT_FOUND',
  USER_ALREADY_EXISTS = 'USER_ALREADY_EXISTS',
  EMAIL_NOT_VERIFIED = 'EMAIL_NOT_VERIFIED',
  ACCOUNT_DISABLED = 'ACCOUNT_DISABLED',
  TOKEN_EXPIRED = 'TOKEN_EXPIRED',
  TOKEN_INVALID = 'TOKEN_INVALID',
  PERMISSION_DENIED = 'PERMISSION_DENIED',
  WEAK_PASSWORD = 'WEAK_PASSWORD',
  INVALID_EMAIL = 'INVALID_EMAIL',
  MFA_REQUIRED = 'MFA_REQUIRED',
  MFA_INVALID = 'MFA_INVALID',
  RATE_LIMITED = 'RATE_LIMITED',
  INVITE_INVALID = 'INVITE_INVALID',
  INVITE_EXPIRED = 'INVITE_EXPIRED'
}

// Success response types
export interface AuthResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  errors?: AuthError[]
}

export interface LoginResponse extends AuthResponse<AuthSession> {
  requiresMfa?: boolean
  mfaToken?: string
}

export interface RegisterResponse extends AuthResponse {
  emailVerificationRequired?: boolean
}

// Configuration types
export interface AuthConfig {
  supabase: {
    url: string
    anonKey: string
    serviceKey: string
  }
  jwt: {
    secret: string
    expiresIn: string
    refreshExpiresIn: string
  }
  passwords: {
    minLength: number
    requireUppercase: boolean
    requireLowercase: boolean
    requireNumbers: boolean
    requireSpecialChars: boolean
    maxAttempts: number
    lockoutDuration: number // in minutes
  }
  session: {
    timeout: number // in minutes
    extendOnActivity: boolean
  }
  mfa: {
    issuer: string
    enabled: boolean
  }
  email: {
    from: string
    templates: {
      welcome: string
      passwordReset: string
      emailVerification: string
    }
  }
}

// Role-based profile data types
export interface ClientProfileData {
  firstName: string
  lastName: string
  dateOfBirth: string
  phone: string
  address: {
    street1: string
    street2?: string
    city: string
    state: string
    zipCode: string
  }
  emergencyContact: {
    name: string
    relationship: string
    phone: string
  }
}

export interface CaregiverProfileData {
  firstName: string
  lastName: string
  dateOfBirth: string
  phone: string
  address: {
    street1: string
    street2?: string
    city: string
    state: string
    zipCode: string
  }
  certifications: string[]
  experience: string
  availability: {
    monday?: { start: string; end: string }
    tuesday?: { start: string; end: string }
    wednesday?: { start: string; end: string }
    thursday?: { start: string; end: string }
    friday?: { start: string; end: string }
    saturday?: { start: string; end: string }
    sunday?: { start: string; end: string }
  }
}

export interface CoordinatorProfileData {
  firstName: string
  lastName: string
  title: string
  department: string
  phone: string
}

// Invite system types
export interface UserInvite {
  id: string
  email: string
  role: UserRole
  invitedBy: string
  inviteCode: string
  expiresAt: Date
  acceptedAt?: Date
  createdAt: Date
}

export interface InviteUserRequest {
  email: string
  role: UserRole
  profileData?: ClientProfileData | CaregiverProfileData | CoordinatorProfileData
  sendEmail?: boolean
  customMessage?: string
}

export interface AcceptInviteRequest {
  inviteCode: string
  password: string
  firstName: string
  lastName: string
  additionalData?: Record<string, any>
}