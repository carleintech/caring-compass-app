import React from 'react';
import { NextRequest, NextResponse } from 'next/server';
import { AuthService } from './auth-service';
import { RouteGuardConfig, Permission, AuthRequest } from './types';
import { UserRole } from '@caring-compass/database';
/**
 * Authentication middleware for Next.js API routes
 */
export declare class AuthMiddleware {
    private authService;
    constructor(authService: AuthService);
    /**
     * Middleware to verify JWT token and populate user in request
     */
    requireAuth: (handler: (req: AuthRequest, res: NextResponse) => Promise<NextResponse>) => (req: NextRequest) => Promise<NextResponse>;
    /**
     * Middleware to check specific permissions
     */
    requirePermissions: (permissions: Permission[], requireAll?: boolean) => (handler: (req: AuthRequest, res: NextResponse) => Promise<NextResponse>) => (req: NextRequest) => Promise<NextResponse>;
    /**
     * Middleware to check specific roles
     */
    requireRoles: (roles: UserRole[], requireAll?: boolean) => (handler: (req: AuthRequest, res: NextResponse) => Promise<NextResponse>) => (req: NextRequest) => Promise<NextResponse>;
    /**
     * Admin-only middleware
     */
    requireAdmin: (handler: (req: AuthRequest, res: NextResponse) => Promise<NextResponse>) => (req: NextRequest) => Promise<NextResponse>;
    /**
     * Staff-only middleware (Admin or Coordinator)
     */
    requireStaff: (handler: (req: AuthRequest, res: NextResponse) => Promise<NextResponse>) => (req: NextRequest) => Promise<NextResponse>;
    /**
     * Extract user from request headers
     */
    private extractUserFromRequest;
}
/**
 * Frontend route protection using Next.js middleware
 */
export declare class RouteGuard {
    private static instance;
    private routeConfigs;
    static getInstance(): RouteGuard;
    /**
     * Configure route protection
     */
    configureRoute(path: string, config: RouteGuardConfig): void;
    /**
     * Configure multiple routes at once
     */
    configureRoutes(routes: Record<string, RouteGuardConfig>): void;
    /**
     * Middleware function for Next.js
     */
    middleware: (request: NextRequest) => Promise<NextResponse>;
    private findRouteConfig;
    private matchPattern;
    private extractUserFromRequest;
    private getUserById;
}
/**
 * Helper function to create route configurations
 */
export declare const createRouteConfig: (config: RouteGuardConfig) => RouteGuardConfig;
/**
 * Predefined route configurations for common scenarios
 */
export declare const commonRouteConfigs: {
    adminOnly: RouteGuardConfig;
    staffOnly: RouteGuardConfig;
    clientPortal: RouteGuardConfig;
    caregiverPortal: RouteGuardConfig;
    coordinatorPortal: RouteGuardConfig;
    authenticatedOnly: RouteGuardConfig;
};
/**
 * Utility function to setup common route protections
 */
export declare const setupCommonRoutes: () => void;
/**
 * HOC for protecting React components
 */
export declare const withAuth: (WrappedComponent: React.ComponentType<any>, config?: RouteGuardConfig) => (props: any) => JSX.Element;
export default RouteGuard;
//# sourceMappingURL=middleware.d.ts.map