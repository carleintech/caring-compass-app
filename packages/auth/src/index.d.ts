export { AuthService } from './auth-service';
export * from './types';
export { PermissionsManager, permissionsManager, PERMISSIONS, ROLE_PERMISSIONS, authUtils } from './permissions';
export { AuthMiddleware, RouteGuard, createRouteConfig, commonRouteConfigs, setupCommonRoutes, withAuth } from './middleware';
export declare const createAuthConfig: (overrides?: Partial<any>) => {
    supabase: {
        url: string;
        anonKey: string;
        serviceKey: string;
    };
    jwt: {
        secret: string;
        expiresIn: string;
        refreshExpiresIn: string;
    };
    passwords: {
        minLength: number;
        requireUppercase: boolean;
        requireLowercase: boolean;
        requireNumbers: boolean;
        requireSpecialChars: boolean;
        maxAttempts: number;
        lockoutDuration: number;
    };
    session: {
        timeout: number;
        extendOnActivity: boolean;
    };
    mfa: {
        issuer: string;
        enabled: boolean;
    };
    email: {
        from: string;
        templates: {
            welcome: string;
            passwordReset: string;
            emailVerification: string;
        };
    };
};
//# sourceMappingURL=index.d.ts.map