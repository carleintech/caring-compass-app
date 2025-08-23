import { UserRole } from '@caring-compass/database';
import { Permission, RolePermissions, AuthUser } from './types';
export declare const PERMISSIONS: {
    readonly USER_CREATE: {
        readonly resource: "user";
        readonly action: "create";
    };
    readonly USER_READ: {
        readonly resource: "user";
        readonly action: "read";
    };
    readonly USER_UPDATE: {
        readonly resource: "user";
        readonly action: "update";
    };
    readonly USER_DELETE: {
        readonly resource: "user";
        readonly action: "delete";
    };
    readonly CLIENT_CREATE: {
        readonly resource: "client";
        readonly action: "create";
    };
    readonly CLIENT_READ: {
        readonly resource: "client";
        readonly action: "read";
    };
    readonly CLIENT_UPDATE: {
        readonly resource: "client";
        readonly action: "update";
    };
    readonly CLIENT_DELETE: {
        readonly resource: "client";
        readonly action: "delete";
    };
    readonly CAREGIVER_CREATE: {
        readonly resource: "caregiver";
        readonly action: "create";
    };
    readonly CAREGIVER_READ: {
        readonly resource: "caregiver";
        readonly action: "read";
    };
    readonly CAREGIVER_UPDATE: {
        readonly resource: "caregiver";
        readonly action: "update";
    };
    readonly CAREGIVER_DELETE: {
        readonly resource: "caregiver";
        readonly action: "delete";
    };
    readonly VISIT_CREATE: {
        readonly resource: "visit";
        readonly action: "create";
    };
    readonly VISIT_READ: {
        readonly resource: "visit";
        readonly action: "read";
    };
    readonly VISIT_UPDATE: {
        readonly resource: "visit";
        readonly action: "update";
    };
    readonly VISIT_DELETE: {
        readonly resource: "visit";
        readonly action: "delete";
    };
    readonly SCHEDULE_CREATE: {
        readonly resource: "schedule";
        readonly action: "create";
    };
    readonly SCHEDULE_READ: {
        readonly resource: "schedule";
        readonly action: "read";
    };
    readonly SCHEDULE_UPDATE: {
        readonly resource: "schedule";
        readonly action: "update";
    };
    readonly SCHEDULE_DELETE: {
        readonly resource: "schedule";
        readonly action: "delete";
    };
    readonly PLAN_CREATE: {
        readonly resource: "plan";
        readonly action: "create";
    };
    readonly PLAN_READ: {
        readonly resource: "plan";
        readonly action: "read";
    };
    readonly PLAN_UPDATE: {
        readonly resource: "plan";
        readonly action: "update";
    };
    readonly PLAN_DELETE: {
        readonly resource: "plan";
        readonly action: "delete";
    };
    readonly INVOICE_CREATE: {
        readonly resource: "invoice";
        readonly action: "create";
    };
    readonly INVOICE_READ: {
        readonly resource: "invoice";
        readonly action: "read";
    };
    readonly INVOICE_UPDATE: {
        readonly resource: "invoice";
        readonly action: "update";
    };
    readonly INVOICE_DELETE: {
        readonly resource: "invoice";
        readonly action: "delete";
    };
    readonly PAYMENT_CREATE: {
        readonly resource: "payment";
        readonly action: "create";
    };
    readonly PAYMENT_READ: {
        readonly resource: "payment";
        readonly action: "read";
    };
    readonly PAYMENT_UPDATE: {
        readonly resource: "payment";
        readonly action: "update";
    };
    readonly PAYMENT_DELETE: {
        readonly resource: "payment";
        readonly action: "delete";
    };
    readonly MESSAGE_CREATE: {
        readonly resource: "message";
        readonly action: "create";
    };
    readonly MESSAGE_READ: {
        readonly resource: "message";
        readonly action: "read";
    };
    readonly MESSAGE_UPDATE: {
        readonly resource: "message";
        readonly action: "update";
    };
    readonly MESSAGE_DELETE: {
        readonly resource: "message";
        readonly action: "delete";
    };
    readonly DOCUMENT_CREATE: {
        readonly resource: "document";
        readonly action: "create";
    };
    readonly DOCUMENT_READ: {
        readonly resource: "document";
        readonly action: "read";
    };
    readonly DOCUMENT_UPDATE: {
        readonly resource: "document";
        readonly action: "update";
    };
    readonly DOCUMENT_DELETE: {
        readonly resource: "document";
        readonly action: "delete";
    };
    readonly REPORT_READ: {
        readonly resource: "report";
        readonly action: "read";
    };
    readonly ANALYTICS_READ: {
        readonly resource: "analytics";
        readonly action: "read";
    };
    readonly ADMIN_USERS: {
        readonly resource: "admin";
        readonly action: "create";
        readonly scope: "all";
    };
    readonly ADMIN_SETTINGS: {
        readonly resource: "admin";
        readonly action: "update";
        readonly scope: "all";
    };
    readonly ADMIN_AUDIT: {
        readonly resource: "admin";
        readonly action: "read";
        readonly scope: "all";
    };
};
export declare const ROLE_PERMISSIONS: RolePermissions[];
export declare class PermissionsManager {
    private rolePermissions;
    constructor();
    private initializePermissions;
    /**
     * Check if a user has a specific permission
     */
    hasPermission(user: AuthUser, permission: Permission): boolean;
    /**
     * Check if a user has any of the specified permissions
     */
    hasAnyPermission(user: AuthUser, permissions: Permission[]): boolean;
    /**
     * Check if a user has all of the specified permissions
     */
    hasAllPermissions(user: AuthUser, permissions: Permission[]): boolean;
    /**
     * Get all permissions for a user role
     */
    getPermissionsForRole(role: UserRole): Permission[];
    /**
     * Check if a user has a specific role
     */
    hasRole(user: AuthUser, roles: UserRole | UserRole[]): boolean;
    /**
     * Check if a user can access a specific resource
     */
    canAccessResource(user: AuthUser, resource: string, action: Permission['action'], scope?: string): boolean;
    /**
     * Get filtered permissions based on scope
     */
    getFilteredPermissions(user: AuthUser, resourceType: string): Permission[];
    private checkScope;
}
export declare const permissionsManager: PermissionsManager;
export declare const authUtils: {
    isAdmin: (user: AuthUser) => boolean;
    isCoordinator: (user: AuthUser) => boolean;
    isCaregiver: (user: AuthUser) => boolean;
    isClient: (user: AuthUser) => boolean;
    isFamily: (user: AuthUser) => boolean;
    isStaff: (user: AuthUser) => boolean;
    canManageUsers: (user: AuthUser) => boolean;
    canManageClients: (user: AuthUser) => boolean;
    canManageCaregivers: (user: AuthUser) => boolean;
    canManageSchedule: (user: AuthUser) => boolean;
    canViewReports: (user: AuthUser) => boolean;
    canManageBilling: (user: AuthUser) => boolean;
};
//# sourceMappingURL=permissions.d.ts.map