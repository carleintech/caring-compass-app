import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { PrismaClient, UserRole } from '@caring-compass/database'
import * as bcrypt from 'bcryptjs'
import * as jwt from 'jsonwebtoken'
import { 
  AuthUser, 
  AuthSession, 
  LoginCredentials, 
  RegisterCredentials,
  AuthError,
  AuthErrorCode,
  LoginResponse,
  RegisterResponse,
  AuthConfig,
  PasswordResetRequest,
  PasswordUpdateRequest,
  EmailUpdateRequest,
  AuthAuditEvent,
  AuthAction,
  UserInvite,
  InviteUserRequest,
  AcceptInviteRequest
} from './types'

export class AuthService {
  private supabase: SupabaseClient
  private prisma: PrismaClient
  private config: AuthConfig

  constructor(config: AuthConfig, prisma: PrismaClient) {
    this.config = config
    this.prisma = prisma
    this.supabase = createClient(
      config.supabase.url,
      config.supabase.serviceKey
    )
  }

  // ===== AUTHENTICATION METHODS =====

  async signIn(credentials: LoginCredentials, metadata?: Record<string, any>): Promise<LoginResponse> {
    try {
      // Validate input
      if (!credentials.email || !credentials.password) {
        throw new AuthError('Email and password are required', AuthErrorCode.INVALID_CREDENTIALS)
      }

      // Check rate limiting
      await this.checkRateLimit(credentials.email)

      // Authenticate with Supabase
      const { data: authData, error: authError } = await this.supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password
      })

      if (authError || !authData.user) {
        await this.logAuthEvent({
          action: AuthAction.LOGIN,
          success: false,
          metadata: { email: credentials.email, error: authError?.message },
          ...metadata
        })
        throw new AuthError('Invalid email or password', AuthErrorCode.INVALID_CREDENTIALS)
      }

      // Get user profile from database
      const user = await this.getUserById(authData.user.id)
      if (!user) {
        throw new AuthError('User profile not found', AuthErrorCode.USER_NOT_FOUND)
      }

      // Check if user is active
      if (!user.isActive) {
        throw new AuthError('Account is disabled', AuthErrorCode.ACCOUNT_DISABLED)
      }

      // Update last login
      await this.prisma.user.update({
        where: { id: user.id },
        data: { lastLoginAt: new Date() }
      })

      // Create session
      const session = await this.createSession(user, authData.session!)

      // Log successful login
      await this.logAuthEvent({
        userId: user.id,
        action: AuthAction.LOGIN,
        success: true,
        metadata: { email: credentials.email },
        ...metadata
      })

      return {
        success: true,
        data: session,
        message: 'Login successful'
      }
    } catch (error) {
      if (error instanceof AuthError) {
        throw error
      }
      throw new AuthError('Login failed', AuthErrorCode.INVALID_CREDENTIALS)
    }
  }

  async signUp(credentials: RegisterCredentials, metadata?: Record<string, any>): Promise<RegisterResponse> {
    try {
      // Validate password strength
      this.validatePassword(credentials.password)

      // Check if user already exists
      const existingUser = await this.prisma.user.findUnique({
        where: { email: credentials.email }
      })

      if (existingUser) {
        throw new AuthError('User already exists', AuthErrorCode.USER_ALREADY_EXISTS)
      }

      // Create user in Supabase Auth
      const { data: authData, error: authError } = await this.supabase.auth.admin.createUser({
        email: credentials.email,
        password: credentials.password,
        email_confirm: false // We'll handle email verification separately
      })

      if (authError || !authData.user) {
        throw new AuthError('Failed to create user account', AuthErrorCode.INVALID_CREDENTIALS)
      }

      // Create user profile in database
      const user = await this.prisma.user.create({
        data: {
          id: authData.user.id,
          email: credentials.email,
          role: credentials.role,
          isActive: true
        }
      })

      // Create role-specific profile based on user role
      await this.createRoleProfile(user.id, credentials)

      // Send email verification
      await this.sendEmailVerification(credentials.email)

      // Log registration
      await this.logAuthEvent({
        userId: user.id,
        action: AuthAction.REGISTER,
        success: true,
        metadata: { email: credentials.email, role: credentials.role },
        ...metadata
      })

      return {
        success: true,
        message: 'Account created successfully. Please check your email to verify your account.',
        emailVerificationRequired: true
      }
    } catch (error) {
      if (error instanceof AuthError) {
        throw error
      }
      throw new AuthError('Registration failed', AuthErrorCode.INVALID_CREDENTIALS)
    }
  }

  async signOut(userId: string, metadata?: Record<string, any>): Promise<void> {
    try {
      // Sign out from Supabase
      await this.supabase.auth.signOut()

      // Log logout
      await this.logAuthEvent({
        userId,
        action: AuthAction.LOGOUT,
        success: true,
        ...metadata
      })
    } catch (error) {
      // Don't throw on logout errors, just log them
      console.error('Logout error:', error)
    }
  }

  async resetPassword(request: PasswordResetRequest, metadata?: Record<string, any>): Promise<void> {
    try {
      // Check if user exists
      const user = await this.prisma.user.findUnique({
        where: { email: request.email }
      })

      if (!user) {
        // Don't reveal if user exists or not for security
        return
      }

      // Send password reset email via Supabase
      const { error } = await this.supabase.auth.resetPasswordForEmail(
        request.email,
        { redirectTo: request.redirectTo }
      )

      if (error) {
        throw new AuthError('Failed to send password reset email', AuthErrorCode.INVALID_EMAIL)
      }

      // Log password reset request
      await this.logAuthEvent({
        userId: user.id,
        action: AuthAction.PASSWORD_RESET_REQUEST,
        success: true,
        metadata: { email: request.email },
        ...metadata
      })
    } catch (error) {
      if (error instanceof AuthError) {
        throw error
      }
      throw new AuthError('Password reset failed', AuthErrorCode.INVALID_EMAIL)
    }
  }

  async updatePassword(userId: string, request: PasswordUpdateRequest, metadata?: Record<string, any>): Promise<void> {
    try {
      // Validate new password
      this.validatePassword(request.newPassword)

      // Update password in Supabase
      const { error } = await this.supabase.auth.admin.updateUserById(userId, {
        password: request.newPassword
      })

      if (error) {
        throw new AuthError('Failed to update password', AuthErrorCode.INVALID_CREDENTIALS)
      }

      // Log password update
      await this.logAuthEvent({
        userId,
        action: AuthAction.PASSWORD_UPDATE,
        success: true,
        ...metadata
      })
    } catch (error) {
      if (error instanceof AuthError) {
        throw error
      }
      throw new AuthError('Password update failed', AuthErrorCode.INVALID_CREDENTIALS)
    }
  }

  async updateEmail(userId: string, request: EmailUpdateRequest, metadata?: Record<string, any>): Promise<void> {
    try {
      // Update email in Supabase
      const { error } = await this.supabase.auth.admin.updateUserById(userId, {
        email: request.newEmail
      })

      if (error) {
        throw new AuthError('Failed to update email', AuthErrorCode.INVALID_EMAIL)
      }

      // Update email in database
      await this.prisma.user.update({
        where: { id: userId },
        data: { email: request.newEmail }
      })

      // Log email update
      await this.logAuthEvent({
        userId,
        action: AuthAction.EMAIL_UPDATE,
        success: true,
        metadata: { newEmail: request.newEmail },
        ...metadata
      })
    } catch (error) {
      if (error instanceof AuthError) {
        throw error
      }
      throw new AuthError('Email update failed', AuthErrorCode.INVALID_EMAIL)
    }
  }

  // ===== USER MANAGEMENT =====

  async getUserById(id: string): Promise<AuthUser | null> {
    const user = await this.prisma.user.findUnique({
      where: { id }
    })

    if (!user) return null

    return {
      id: user.id,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
      emailVerified: true, // Managed by Supabase
      lastLoginAt: user.lastLoginAt || undefined,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    }
  }

  async getUserByEmail(email: string): Promise<AuthUser | null> {
    const user = await this.prisma.user.findUnique({
      where: { email }
    })

    if (!user) return null

    return this.getUserById(user.id)
  }

  async refreshSession(refreshToken: string): Promise<AuthSession | null> {
    try {
      const { data, error } = await this.supabase.auth.refreshSession({
        refresh_token: refreshToken
      })

      if (error || !data.session || !data.user) {
        return null
      }

      const user = await this.getUserById(data.user.id)
      if (!user) {
        return null
      }

      return await this.createSession(user, data.session)
    } catch (error) {
      return null
    }
  }

  // ===== INVITE SYSTEM =====

  async inviteUser(request: InviteUserRequest, invitedBy: string): Promise<UserInvite> {
    try {
      // Check if user already exists
      const existingUser = await this.prisma.user.findUnique({
        where: { email: request.email }
      })

      if (existingUser) {
        throw new AuthError('User already exists', AuthErrorCode.USER_ALREADY_EXISTS)
      }

      // Generate invite code
      const inviteCode = this.generateInviteCode()
      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days

      // Create invite record
      const invite = await this.prisma.userInvite.create({
        data: {
          email: request.email,
          role: request.role,
          invitedBy: invitedBy,
          inviteCode: inviteCode,
          expiresAt: expiresAt,
        }
      })

      // Send invite email if requested
      if (request.sendEmail) {
        await this.sendInviteEmail(request.email, inviteCode, request.role)
      }

      return {
        id: invite.id.toString(),
        email: request.email,
        role: request.role,
        invitedBy,
        inviteCode,
        expiresAt,
        createdAt: new Date()
      }
    } catch (error) {
      if (error instanceof AuthError) {
        throw error
      }
      throw new AuthError('Failed to create invite', AuthErrorCode.INVALID_EMAIL)
    }
  }

  async acceptInvite(request: AcceptInviteRequest): Promise<RegisterResponse> {
    try {
      // Find and validate invite
      const invite = await this.prisma.$queryRaw`
        SELECT * FROM user_invites 
        WHERE invite_code = ${request.inviteCode} 
        AND expires_at > NOW() 
        AND accepted_at IS NULL
      ` as any[]

      if (!invite || invite.length === 0) {
        throw new AuthError('Invalid or expired invite', AuthErrorCode.INVITE_INVALID)
      }

      const inviteData = invite[0]

      // Create user account
      const registerData: RegisterCredentials = {
        email: inviteData.email,
        password: request.password,
        firstName: request.firstName,
        lastName: request.lastName,
        role: inviteData.role
      }

      const result = await this.signUp(registerData)

      // Mark invite as accepted
      await this.prisma.$executeRaw`
        UPDATE user_invites 
        SET accepted_at = NOW() 
        WHERE invite_code = ${request.inviteCode}
      `

      return result
    } catch (error) {
      if (error instanceof AuthError) {
        throw error
      }
      throw new AuthError('Failed to accept invite', AuthErrorCode.INVITE_INVALID)
    }
  }

  // ===== HELPER METHODS =====

  private async createSession(user: AuthUser, supabaseSession: any): Promise<AuthSession> {
    return {
      user,
      accessToken: supabaseSession.access_token,
      refreshToken: supabaseSession.refresh_token,
      expiresAt: new Date(supabaseSession.expires_at * 1000)
    }
  }

  private async createRoleProfile(userId: string, credentials: RegisterCredentials): Promise<void> {
    switch (credentials.role) {
      case UserRole.CLIENT:
        await this.prisma.clientProfile.create({
          data: {
            userId,
            firstName: credentials.firstName,
            lastName: credentials.lastName,
            dateOfBirth: new Date('1950-01-01'), // Placeholder - will be updated during onboarding
            primaryPhone: credentials.phone || '',
            address: {
              create: {
                street1: '',
                city: '',
                state: '',
                zipCode: '',
                country: 'US'
              }
            },
            status: 'INQUIRY'
          }
        })
        break

      case UserRole.CAREGIVER:
        await this.prisma.caregiverProfile.create({
          data: {
            userId,
            firstName: credentials.firstName,
            lastName: credentials.lastName,
            dateOfBirth: new Date('1990-01-01'), // Placeholder
            primaryPhone: credentials.phone || '',
            address: {
              create: [{
                street1: '',
                city: '',
                state: '',
                zipCode: '',
                country: 'US'
              }]
            },
            status: 'APPLICATION_SUBMITTED'
          }
        })
        break

      case UserRole.COORDINATOR:
      case UserRole.ADMIN:
        await this.prisma.coordinatorProfile.create({
          data: {
            userId,
            firstName: credentials.firstName,
            lastName: credentials.lastName,
            title: credentials.role === UserRole.ADMIN ? 'Administrator' : 'Care Coordinator',
            department: 'Care Management'
          }
        })
        break

      case UserRole.FAMILY:
        // Family profiles are created when they're associated with a client
        break
    }
  }

  private validatePassword(password: string): void {
    const config = this.config.passwords

    if (password.length < config.minLength) {
      throw new AuthError(`Password must be at least ${config.minLength} characters`, AuthErrorCode.WEAK_PASSWORD)
    }

    if (config.requireUppercase && !/[A-Z]/.test(password)) {
      throw new AuthError('Password must contain at least one uppercase letter', AuthErrorCode.WEAK_PASSWORD)
    }

    if (config.requireLowercase && !/[a-z]/.test(password)) {
      throw new AuthError('Password must contain at least one lowercase letter', AuthErrorCode.WEAK_PASSWORD)
    }

    if (config.requireNumbers && !/\d/.test(password)) {
      throw new AuthError('Password must contain at least one number', AuthErrorCode.WEAK_PASSWORD)
    }

    if (config.requireSpecialChars && !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      throw new AuthError('Password must contain at least one special character', AuthErrorCode.WEAK_PASSWORD)
    }
  }

  private async checkRateLimit(email: string): Promise<void> {
    // Implement rate limiting logic here
    // For now, this is a placeholder
  }

  private async sendEmailVerification(email: string): Promise<void> {
    // Send email verification via Supabase
    await this.supabase.auth.resend({
      type: 'signup',
      email
    })
  }

  private async sendInviteEmail(email: string, inviteCode: string, role: UserRole): Promise<void> {
    // Implement email sending logic here
    // This would typically use a service like SendGrid or AWS SES
    console.log(`Sending invite email to ${email} for role ${role} with code ${inviteCode}`)
  }

  private generateInviteCode(): string {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
  }

  private async logAuthEvent(event: Partial<AuthAuditEvent> & { action: AuthAction }): Promise<void> {
    try {
      await this.prisma.auditLog.create({
        data: {
          userId: event.userId,
          action: event.action as any, // Type assertion needed here
          resourceType: 'AuthEvent',
          resourceId: event.userId,
          newValues: event.metadata || {},
          ipAddress: event.ipAddress,
          userAgent: event.userAgent,
          timestamp: event.timestamp || new Date()
        }
      })
    } catch (error) {
      console.error('Failed to log auth event:', error)
    }
  }
}