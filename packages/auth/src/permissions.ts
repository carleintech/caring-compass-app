import { UserRole } from '@caring-compass/database'
import { Permission, RolePermissions, AuthUser } from './types'

// Define all available permissions in the system
export const PERMISSIONS = {
  // User management
  USER_CREATE: { resource: 'user', action: 'create' as const },
  USER_READ: { resource: 'user', action: 'read' as const },
  USER_UPDATE: { resource: 'user', action: 'update' as const },
  USER_DELETE: { resource: 'user', action: 'delete' as const },

  // Client management
  CLIENT_CREATE: { resource: 'client', action: 'create' as const },
  CLIENT_READ: { resource: 'client', action: 'read' as const },
  CLIENT_UPDATE: { resource: 'client', action: 'update' as const },
  CLIENT_DELETE: { resource: 'client', action: 'delete' as const },

  // Caregiver management
  CAREGIVER_CREATE: { resource: 'caregiver', action: 'create' as const },
  CAREGIVER_READ: { resource: 'caregiver', action: 'read' as const },
  CAREGIVER_UPDATE: { resource: 'caregiver', action: 'update' as const },
  CAREGIVER_DELETE: { resource: 'caregiver', action: 'delete' as const },

  // Visit management
  VISIT_CREATE: { resource: 'visit', action: 'create' as const },
  VISIT_READ: { resource: 'visit', action: 'read' as const },
  VISIT_UPDATE: { resource: 'visit', action: 'update' as const },
  VISIT_DELETE: { resource: 'visit', action: 'delete' as const },

  // Schedule management
  SCHEDULE_CREATE: { resource: 'schedule', action: 'create' as const },
  SCHEDULE_READ: { resource: 'schedule', action: 'read' as const },
  SCHEDULE_UPDATE: { resource: 'schedule', action: 'update' as const },
  SCHEDULE_DELETE: { resource: 'schedule', action: 'delete' as const },

  // Plan of Care
  PLAN_CREATE: { resource: 'plan', action: 'create' as const },
  PLAN_READ: { resource: 'plan', action: 'read' as const },
  PLAN_UPDATE: { resource: 'plan', action: 'update' as const },
  PLAN_DELETE: { resource: 'plan', action: 'delete' as const },

  // Billing and invoices
  INVOICE_CREATE: { resource: 'invoice', action: 'create' as const },
  INVOICE_READ: { resource: 'invoice', action: 'read' as const },
  INVOICE_UPDATE: { resource: 'invoice', action: 'update' as const },
  INVOICE_DELETE: { resource: 'invoice', action: 'delete' as const },

  // Payments
  PAYMENT_CREATE: { resource: 'payment', action: 'create' as const },
  PAYMENT_READ: { resource: 'payment', action: 'read' as const },
  PAYMENT_UPDATE: { resource: 'payment', action: 'update' as const },
  PAYMENT_DELETE: { resource: 'payment', action: 'delete' as const },

  // Messaging
  MESSAGE_CREATE: { resource: 'message', action: 'create' as const },
  MESSAGE_READ: { resource: 'message', action: 'read' as const },
  MESSAGE_UPDATE: { resource: 'message', action: 'update' as const },
  MESSAGE_DELETE: { resource: 'message', action: 'delete' as const },

  // Documents
  DOCUMENT_CREATE: { resource: 'document', action: 'create' as const },
  DOCUMENT_READ: { resource: 'document', action: 'read' as const },
  DOCUMENT_UPDATE: { resource: 'document', action: 'update' as const },
  DOCUMENT_DELETE: { resource: 'document', action: 'delete' as const },

  // Reports and analytics
  REPORT_READ: { resource: 'report', action: 'read' as const },
  ANALYTICS_READ: { resource: 'analytics', action: 'read' as const },

  // System administration
  ADMIN_USERS: { resource: 'admin', action: 'create' as const, scope: 'all' as const },
  ADMIN_SETTINGS: { resource: 'admin', action: 'update' as const, scope: 'all' as const },
  ADMIN_AUDIT: { resource: 'admin', action: 'read' as const, scope: 'all' as const },
} as const

// Define role-based permissions
export const ROLE_PERMISSIONS: RolePermissions[] = [
  {
    role: UserRole.ADMIN,
    permissions: [
      // Full system access
      { ...PERMISSIONS.USER_CREATE, scope: 'all' },
      { ...PERMISSIONS.USER_READ, scope: 'all' },
      { ...PERMISSIONS.USER_UPDATE, scope: 'all' },
      { ...PERMISSIONS.USER_DELETE, scope: 'all' },
      
      { ...PERMISSIONS.CLIENT_CREATE, scope: 'all' },
      { ...PERMISSIONS.CLIENT_READ, scope: 'all' },
      { ...PERMISSIONS.CLIENT_UPDATE, scope: 'all' },
      { ...PERMISSIONS.CLIENT_DELETE, scope: 'all' },
      
      { ...PERMISSIONS.CAREGIVER_CREATE, scope: 'all' },
      { ...PERMISSIONS.CAREGIVER_READ, scope: 'all' },
      { ...PERMISSIONS.CAREGIVER_UPDATE, scope: 'all' },
      { ...PERMISSIONS.CAREGIVER_DELETE, scope: 'all' },
      
      { ...PERMISSIONS.VISIT_CREATE, scope: 'all' },
      { ...PERMISSIONS.VISIT_READ, scope: 'all' },
      { ...PERMISSIONS.VISIT_UPDATE, scope: 'all' },
      { ...PERMISSIONS.VISIT_DELETE, scope: 'all' },
      
      { ...PERMISSIONS.SCHEDULE_CREATE, scope: 'all' },
      { ...PERMISSIONS.SCHEDULE_READ, scope: 'all' },
      { ...PERMISSIONS.SCHEDULE_UPDATE, scope: 'all' },
      { ...PERMISSIONS.SCHEDULE_DELETE, scope: 'all' },
      
      { ...PERMISSIONS.PLAN_CREATE, scope: 'all' },
      { ...PERMISSIONS.PLAN_READ, scope: 'all' },
      { ...PERMISSIONS.PLAN_UPDATE, scope: 'all' },
      { ...PERMISSIONS.PLAN_DELETE, scope: 'all' },
      
      { ...PERMISSIONS.INVOICE_CREATE, scope: 'all' },
      { ...PERMISSIONS.INVOICE_READ, scope: 'all' },
      { ...PERMISSIONS.INVOICE_UPDATE, scope: 'all' },
      { ...PERMISSIONS.INVOICE_DELETE, scope: 'all' },
      
      { ...PERMISSIONS.PAYMENT_CREATE, scope: 'all' },
      { ...PERMISSIONS.PAYMENT_READ, scope: 'all' },
      { ...PERMISSIONS.PAYMENT_UPDATE, scope: 'all' },
      { ...PERMISSIONS.PAYMENT_DELETE, scope: 'all' },
      
      { ...PERMISSIONS.MESSAGE_CREATE, scope: 'all' },
      { ...PERMISSIONS.MESSAGE_READ, scope: 'all' },
      { ...PERMISSIONS.MESSAGE_UPDATE, scope: 'all' },
      { ...PERMISSIONS.MESSAGE_DELETE, scope: 'all' },
      
      { ...PERMISSIONS.DOCUMENT_CREATE, scope: 'all' },
      { ...PERMISSIONS.DOCUMENT_READ, scope: 'all' },
      { ...PERMISSIONS.DOCUMENT_UPDATE, scope: 'all' },
      { ...PERMISSIONS.DOCUMENT_DELETE, scope: 'all' },
      
      { ...PERMISSIONS.REPORT_READ, scope: 'all' },
      { ...PERMISSIONS.ANALYTICS_READ, scope: 'all' },
      
      PERMISSIONS.ADMIN_USERS,
      PERMISSIONS.ADMIN_SETTINGS,
      PERMISSIONS.ADMIN_AUDIT,
    ]
  },
  
  {
    role: UserRole.COORDINATOR,
    permissions: [
      // User management (limited)
      { ...PERMISSIONS.USER_READ, scope: 'assigned' },
      { ...PERMISSIONS.USER_UPDATE, scope: 'assigned' },
      
      // Full client management
      { ...PERMISSIONS.CLIENT_CREATE, scope: 'all' },
      { ...PERMISSIONS.CLIENT_READ, scope: 'all' },
      { ...PERMISSIONS.CLIENT_UPDATE, scope: 'all' },
      
      // Full caregiver management
      { ...PERMISSIONS.CAREGIVER_CREATE, scope: 'all' },
      { ...PERMISSIONS.CAREGIVER_READ, scope: 'all' },
      { ...PERMISSIONS.CAREGIVER_UPDATE, scope: 'all' },
      
      // Full visit management
      { ...PERMISSIONS.VISIT_CREATE, scope: 'all' },
      { ...PERMISSIONS.VISIT_READ, scope: 'all' },
      { ...PERMISSIONS.VISIT_UPDATE, scope: 'all' },
      { ...PERMISSIONS.VISIT_DELETE, scope: 'all' },
      
      // Full schedule management
      { ...PERMISSIONS.SCHEDULE_CREATE, scope: 'all' },
      { ...PERMISSIONS.SCHEDULE_READ, scope: 'all' },
      { ...PERMISSIONS.SCHEDULE_UPDATE, scope: 'all' },
      { ...PERMISSIONS.SCHEDULE_DELETE, scope: 'all' },
      
      // Plan of care management
      { ...PERMISSIONS.PLAN_CREATE, scope: 'all' },
      { ...PERMISSIONS.PLAN_READ, scope: 'all' },
      { ...PERMISSIONS.PLAN_UPDATE, scope: 'all' },
      
      // Billing (read/create only)
      { ...PERMISSIONS.INVOICE_CREATE, scope: 'all' },
      { ...PERMISSIONS.INVOICE_READ, scope: 'all' },
      { ...PERMISSIONS.INVOICE_UPDATE, scope: 'all' },
      
      { ...PERMISSIONS.PAYMENT_READ, scope: 'all' },
      
      // Messaging
      { ...PERMISSIONS.MESSAGE_CREATE, scope: 'all' },
      { ...PERMISSIONS.MESSAGE_READ, scope: 'all' },
      
      // Documents
      { ...PERMISSIONS.DOCUMENT_CREATE, scope: 'all' },
      { ...PERMISSIONS.DOCUMENT_READ, scope: 'all' },
      { ...PERMISSIONS.DOCUMENT_UPDATE, scope: 'all' },
      
      // Reports
      { ...PERMISSIONS.REPORT_READ, scope: 'all' },
      { ...PERMISSIONS.ANALYTICS_READ, scope: 'all' },
    ]
  },
  
  {
    role: UserRole.CAREGIVER,
    permissions: [
      // Own profile management
      { ...PERMISSIONS.USER_READ, scope: 'own' },
      { ...PERMISSIONS.USER_UPDATE, scope: 'own' },
      
      // Assigned clients only
      { ...PERMISSIONS.CLIENT_READ, scope: 'assigned' },
      
      // Own caregiver profile
      { ...PERMISSIONS.CAREGIVER_READ, scope: 'own' },
      { ...PERMISSIONS.CAREGIVER_UPDATE, scope: 'own' },
      
      // Assigned visits
      { ...PERMISSIONS.VISIT_READ, scope: 'assigned' },
      { ...PERMISSIONS.VISIT_UPDATE, scope: 'assigned' },
      
      // Own schedule
      { ...PERMISSIONS.SCHEDULE_READ, scope: 'own' },
      { ...PERMISSIONS.SCHEDULE_UPDATE, scope: 'own' },
      
      // Assigned plans of care (read only)
      { ...PERMISSIONS.PLAN_READ, scope: 'assigned' },
      
      // Messaging with assigned clients/coordinators
      { ...PERMISSIONS.MESSAGE_CREATE, scope: 'assigned' },
      { ...PERMISSIONS.MESSAGE_READ, scope: 'assigned' },
      
      // Own documents
      { ...PERMISSIONS.DOCUMENT_CREATE, scope: 'own' },
      { ...PERMISSIONS.DOCUMENT_READ, scope: 'own' },
      { ...PERMISSIONS.DOCUMENT_UPDATE, scope: 'own' },
    ]
  },
  
  {
    role: UserRole.CLIENT,
    permissions: [
      // Own profile management
      { ...PERMISSIONS.USER_READ, scope: 'own' },
      { ...PERMISSIONS.USER_UPDATE, scope: 'own' },
      
      // Own client profile
      { ...PERMISSIONS.CLIENT_READ, scope: 'own' },
      { ...PERMISSIONS.CLIENT_UPDATE, scope: 'own' },
      
      // Assigned caregivers (read only)
      { ...PERMISSIONS.CAREGIVER_READ, scope: 'assigned' },
      
      // Own visits
      { ...PERMISSIONS.VISIT_READ, scope: 'own' },
      
      // Own schedule
      { ...PERMISSIONS.SCHEDULE_READ, scope: 'own' },
      
      // Own plan of care
      { ...PERMISSIONS.PLAN_READ, scope: 'own' },
      
      // Own billing
      { ...PERMISSIONS.INVOICE_READ, scope: 'own' },
      { ...PERMISSIONS.PAYMENT_CREATE, scope: 'own' },
      { ...PERMISSIONS.PAYMENT_READ, scope: 'own' },
      
      // Messaging with coordinators/caregivers
      { ...PERMISSIONS.MESSAGE_CREATE, scope: 'own' },
      { ...PERMISSIONS.MESSAGE_READ, scope: 'own' },
      
      // Own documents
      { ...PERMISSIONS.DOCUMENT_CREATE, scope: 'own' },
      { ...PERMISSIONS.DOCUMENT_READ, scope: 'own' },
      { ...PERMISSIONS.DOCUMENT_UPDATE, scope: 'own' },
    ]
  },
  
  {
    role: UserRole.FAMILY,
    permissions: [
      // Own profile management
      { ...PERMISSIONS.USER_READ, scope: 'own' },
      { ...PERMISSIONS.USER_UPDATE, scope: 'own' },
      
      // Associated client (read only)
      { ...PERMISSIONS.CLIENT_READ, scope: 'assigned' },
      
      // Associated caregivers (read only)
      { ...PERMISSIONS.CAREGIVER_READ, scope: 'assigned' },
      
      // Associated visits (read only)
      { ...PERMISSIONS.VISIT_READ, scope: 'assigned' },
      
      // Associated schedule (read only)
      { ...PERMISSIONS.SCHEDULE_READ, scope: 'assigned' },
      
      // Associated plan of care (read only)
      { ...PERMISSIONS.PLAN_READ, scope: 'assigned' },
      
      // Associated billing (read only)
      { ...PERMISSIONS.INVOICE_READ, scope: 'assigned' },
      { ...PERMISSIONS.PAYMENT_READ, scope: 'assigned' },
      
      // Messaging with coordinators
      { ...PERMISSIONS.MESSAGE_CREATE, scope: 'assigned' },
      { ...PERMISSIONS.MESSAGE_READ, scope: 'assigned' },
      
      // Associated documents (read only)
      { ...PERMISSIONS.DOCUMENT_READ, scope: 'assigned' },
    ]
  }
]

export class PermissionsManager {
  private rolePermissions: Map<UserRole, Permission[]>

  constructor() {
    this.rolePermissions = new Map()
    this.initializePermissions()
  }

  private initializePermissions(): void {
    ROLE_PERMISSIONS.forEach(({ role, permissions }) => {
      this.rolePermissions.set(role, permissions)
    })
  }

  /**
   * Check if a user has a specific permission
   */
  hasPermission(user: AuthUser, permission: Permission): boolean {
    const userPermissions = this.rolePermissions.get(user.role)
    if (!userPermissions) return false

    return userPermissions.some(p => 
      p.resource === permission.resource &&
      p.action === permission.action &&
      this.checkScope(p.scope, permission.scope)
    )
  }

  /**
   * Check if a user has any of the specified permissions
   */
  hasAnyPermission(user: AuthUser, permissions: Permission[]): boolean {
    return permissions.some(permission => this.hasPermission(user, permission))
  }

  /**
   * Check if a user has all of the specified permissions
   */
  hasAllPermissions(user: AuthUser, permissions: Permission[]): boolean {
    return permissions.every(permission => this.hasPermission(user, permission))
  }

  /**
   * Get all permissions for a user role
   */
  getPermissionsForRole(role: UserRole): Permission[] {
    return this.rolePermissions.get(role) || []
  }

  /**
   * Check if a user has a specific role
   */
  hasRole(user: AuthUser, roles: UserRole | UserRole[]): boolean {
    const targetRoles = Array.isArray(roles) ? roles : [roles]
    return targetRoles.includes(user.role)
  }

  /**
   * Check if a user can access a specific resource
   */
  canAccessResource(user: AuthUser, resource: string, action: Permission['action'], scope?: Permission['scope']): boolean {
    return this.hasPermission(user, { resource, action, scope })
  }

  /**
   * Get filtered permissions based on scope
   */
  getFilteredPermissions(user: AuthUser, resourceType: string): Permission[] {
    const userPermissions = this.rolePermissions.get(user.role) || []
    return userPermissions.filter(p => p.resource === resourceType)
  }

  private checkScope(userScope?: string, requiredScope?: string): boolean {
    // If no scope is specified, permission is granted
    if (!requiredScope) return true
    
    // If user has 'all' scope, they can access everything
    if (userScope === 'all') return true
    
    // If user has specific scope, it must match required scope
    if (userScope === requiredScope) return true
    
    // If user has 'own' scope, they can access their own resources
    if (userScope === 'own' && (requiredScope === 'own' || !requiredScope)) return true
    
    // If user has 'assigned' scope, they can access assigned resources
    if (userScope === 'assigned' && (requiredScope === 'assigned' || requiredScope === 'own' || !requiredScope)) return true
    
    return false
  }
}

// Create singleton instance
export const permissionsManager = new PermissionsManager()

// Utility functions for common permission checks
export const authUtils = {
  isAdmin: (user: AuthUser): boolean => user.role === UserRole.ADMIN,
  isCoordinator: (user: AuthUser): boolean => user.role === UserRole.COORDINATOR,
  isCaregiver: (user: AuthUser): boolean => user.role === UserRole.CAREGIVER,
  isClient: (user: AuthUser): boolean => user.role === UserRole.CLIENT,
  isFamily: (user: AuthUser): boolean => user.role === UserRole.FAMILY,
  
  isStaff: (user: AuthUser): boolean => 
    user.role === UserRole.ADMIN || user.role === UserRole.COORDINATOR,
    
  canManageUsers: (user: AuthUser): boolean =>
    permissionsManager.hasPermission(user, PERMISSIONS.USER_CREATE),
    
  canManageClients: (user: AuthUser): boolean =>
    permissionsManager.hasPermission(user, PERMISSIONS.CLIENT_CREATE),
    
  canManageCaregivers: (user: AuthUser): boolean =>
    permissionsManager.hasPermission(user, PERMISSIONS.CAREGIVER_CREATE),
    
  canManageSchedule: (user: AuthUser): boolean =>
    permissionsManager.hasPermission(user, PERMISSIONS.SCHEDULE_CREATE),
    
  canViewReports: (user: AuthUser): boolean =>
    permissionsManager.hasPermission(user, PERMISSIONS.REPORT_READ),
    
  canManageBilling: (user: AuthUser): boolean =>
    permissionsManager.hasPermission(user, PERMISSIONS.INVOICE_CREATE)
}