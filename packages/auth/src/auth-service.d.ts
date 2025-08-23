import { PrismaClient } from '@caring-compass/database';
import { AuthUser, AuthSession, LoginCredentials, RegisterCredentials, LoginResponse, RegisterResponse, AuthConfig, PasswordResetRequest, PasswordUpdateRequest, EmailUpdateRequest, UserInvite, InviteUserRequest, AcceptInviteRequest } from './types';
export declare class AuthService {
    private supabase;
    private prisma;
    private config;
    constructor(config: AuthConfig, prisma: PrismaClient);
    signIn(credentials: LoginCredentials, metadata?: Record<string, any>): Promise<LoginResponse>;
    signUp(credentials: RegisterCredentials, metadata?: Record<string, any>): Promise<RegisterResponse>;
    signOut(userId: string, metadata?: Record<string, any>): Promise<void>;
    resetPassword(request: PasswordResetRequest, metadata?: Record<string, any>): Promise<void>;
    updatePassword(userId: string, request: PasswordUpdateRequest, metadata?: Record<string, any>): Promise<void>;
    updateEmail(userId: string, request: EmailUpdateRequest, metadata?: Record<string, any>): Promise<void>;
    getUserById(id: string): Promise<AuthUser | null>;
    getUserByEmail(email: string): Promise<AuthUser | null>;
    refreshSession(refreshToken: string): Promise<AuthSession | null>;
    inviteUser(request: InviteUserRequest, invitedBy: string): Promise<UserInvite>;
    acceptInvite(request: AcceptInviteRequest): Promise<RegisterResponse>;
    private createSession;
    private createRoleProfile;
    private validatePassword;
    private checkRateLimit;
    private sendEmailVerification;
    private sendInviteEmail;
    private generateInviteCode;
    private logAuthEvent;
}
//# sourceMappingURL=auth-service.d.ts.map