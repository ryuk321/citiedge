// Authentication and Authorization utilities for staff portal

import { Staff, StaffRole, StaffPermissions, defaultPermissions } from './staffData';

/**
 * Mock authentication service
 * In a real application, this would integrate with your auth provider (e.g., NextAuth, Auth0, Firebase)
 */

export interface AuthUser {
  id: string;
  email: string;
  role: StaffRole;
  staffId: string;
}

// Simulated current user session
let currentUser: AuthUser | null = null;

/**
 * Login function - in production, this would call your authentication API
 */
export const login = async (email: string, password: string): Promise<AuthUser> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Mock authentication - in real app, verify credentials with backend
  if (email && password) {
    currentUser = {
      id: 'user-123',
      email: email,
      role: determineRoleFromEmail(email),
      staffId: 'STF-2024-001',
    };
    return currentUser;
  }

  throw new Error('Invalid credentials');
};

/**
 * Logout function
 */
export const logout = async (): Promise<void> => {
  currentUser = null;
  // In real app, clear tokens, cookies, etc.
};

/**
 * Get current authenticated user
 */
export const getCurrentUser = (): AuthUser | null => {
  return currentUser;
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = (): boolean => {
  return currentUser !== null;
};

/**
 * Helper to determine role from email (mock - for demo purposes)
 */
const determineRoleFromEmail = (email: string): StaffRole => {
  if (email.includes('admin')) return 'admin';
  if (email.includes('lecturer') || email.includes('professor')) return 'lecturer';
  if (email.includes('office')) return 'office';
  if (email.includes('librarian')) return 'librarian';
  if (email.includes('counselor')) return 'counselor';
  return 'lecturer'; // default
};

/**
 * Check if user has a specific permission
 */
export const hasPermission = (
  staff: Staff | null,
  permission: keyof StaffPermissions
): boolean => {
  if (!staff) return false;
  return staff.permissions[permission] === true;
};

/**
 * Check if user has any of the specified permissions
 */
export const hasAnyPermission = (
  staff: Staff | null,
  permissions: (keyof StaffPermissions)[]
): boolean => {
  if (!staff) return false;
  return permissions.some(permission => staff.permissions[permission] === true);
};

/**
 * Check if user has all of the specified permissions
 */
export const hasAllPermissions = (
  staff: Staff | null,
  permissions: (keyof StaffPermissions)[]
): boolean => {
  if (!staff) return false;
  return permissions.every(permission => staff.permissions[permission] === true);
};

/**
 * Check if user has a specific role
 */
export const hasRole = (staff: Staff | null, role: StaffRole): boolean => {
  if (!staff) return false;
  return staff.role === role;
};

/**
 * Check if user has any of the specified roles
 */
export const hasAnyRole = (staff: Staff | null, roles: StaffRole[]): boolean => {
  if (!staff) return false;
  return roles.includes(staff.role);
};

/**
 * Get permissions for a specific role
 */
export const getPermissionsForRole = (role: StaffRole): StaffPermissions => {
  return defaultPermissions[role];
};

/**
 * Check if a staff member can access a specific route/feature
 */
export const canAccessFeature = (
  staff: Staff | null,
  feature: 'classes' | 'students' | 'financials' | 'library' | 'counseling' | 'reports' | 'admin'
): boolean => {
  if (!staff) return false;

  const featurePermissionMap: Record<string, keyof StaffPermissions | StaffRole> = {
    classes: 'canManageCourses',
    students: 'canManageStudents',
    financials: 'canViewFinancials',
    library: 'canManageLibrary',
    counseling: 'canCounselStudents',
    reports: 'canViewReports',
    admin: 'canManageSystem',
  };

  const requirement = featurePermissionMap[feature];
  
  // Check if it's a role-based requirement
  if (feature === 'classes' && staff.role === 'lecturer') {
    return true;
  }

  // Check permission
  return staff.permissions[requirement as keyof StaffPermissions] === true;
};

/**
 * Get accessible features for a staff member
 */
export const getAccessibleFeatures = (staff: Staff | null): string[] => {
  if (!staff) return [];

  const features: string[] = ['overview']; // Everyone can see overview

  if (canAccessFeature(staff, 'classes')) features.push('classes');
  if (canAccessFeature(staff, 'students')) features.push('students');
  if (canAccessFeature(staff, 'financials')) features.push('financials');
  if (canAccessFeature(staff, 'library')) features.push('library');
  if (canAccessFeature(staff, 'counseling')) features.push('counseling');
  if (canAccessFeature(staff, 'reports')) features.push('reports');
  if (canAccessFeature(staff, 'admin')) features.push('admin');

  return features;
};

/**
 * Audit log function - track user actions
 * In production, this would send logs to your backend
 */
export const auditLog = (
  action: string,
  resource: string,
  details?: Record<string, any>
): void => {
  const logEntry = {
    timestamp: new Date().toISOString(),
    user: currentUser?.email || 'unknown',
    staffId: currentUser?.staffId || 'unknown',
    role: currentUser?.role || 'unknown',
    action,
    resource,
    details,
  };

  // In production, send to backend
  console.log('Audit Log:', logEntry);
};

/**
 * Role-based access control decorator for functions
 */
export const requirePermission = (
  permission: keyof StaffPermissions
) => {
  return (
    target: any,
    propertyName: string,
    descriptor: PropertyDescriptor
  ) => {
    const originalMethod = descriptor.value;

    descriptor.value = function (...args: any[]) {
      const staff = args[0] as Staff; // Assume first argument is staff object
      
      if (!hasPermission(staff, permission)) {
        throw new Error(`Permission denied: ${permission} required`);
      }

      return originalMethod.apply(this, args);
    };

    return descriptor;
  };
};

/**
 * Create custom permissions for a staff member
 * Only admins can do this
 */
export const updateStaffPermissions = (
  adminStaff: Staff,
  targetStaffId: string,
  newPermissions: Partial<StaffPermissions>
): boolean => {
  if (!hasRole(adminStaff, 'admin')) {
    auditLog('PERMISSION_UPDATE_DENIED', 'staff', {
      reason: 'Not an admin',
      targetStaffId,
    });
    return false;
  }

  // In production, this would call your API
  auditLog('PERMISSION_UPDATE', 'staff', {
    targetStaffId,
    newPermissions,
  });

  return true;
};

/**
 * Validate staff access to specific student data
 */
export const canAccessStudentData = (
  staff: Staff,
  studentId: string
): boolean => {
  // Admin and office staff can access all student data
  if (hasAnyRole(staff, ['admin', 'office'])) {
    return true;
  }

  // Lecturers can only access their enrolled students
  // In production, check if student is enrolled in lecturer's class
  if (staff.role === 'lecturer') {
    // This would be a database query in production
    return true; // Simplified for demo
  }

  // Counselors can access students they're counseling
  if (staff.role === 'counselor') {
    // This would check counseling session records
    return true; // Simplified for demo
  }

  return false;
};

/**
 * Rate limiting helper for sensitive operations
 */
const operationAttempts = new Map<string, number[]>();

export const checkRateLimit = (
  operation: string,
  maxAttempts: number = 5,
  windowMs: number = 60000
): boolean => {
  const key = `${currentUser?.staffId || 'unknown'}_${operation}`;
  const now = Date.now();
  const attempts = operationAttempts.get(key) || [];

  // Filter attempts within the time window
  const recentAttempts = attempts.filter(time => now - time < windowMs);

  if (recentAttempts.length >= maxAttempts) {
    auditLog('RATE_LIMIT_EXCEEDED', operation, {
      attempts: recentAttempts.length,
      maxAttempts,
    });
    return false;
  }

  // Add current attempt
  recentAttempts.push(now);
  operationAttempts.set(key, recentAttempts);

  return true;
};

/**
 * Session timeout checker
 */
let lastActivity = Date.now();
const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes

export const updateActivity = (): void => {
  lastActivity = Date.now();
};

export const isSessionValid = (): boolean => {
  return Date.now() - lastActivity < SESSION_TIMEOUT;
};

export const getSessionTimeRemaining = (): number => {
  const remaining = SESSION_TIMEOUT - (Date.now() - lastActivity);
  return Math.max(0, remaining);
};

/**
 * Export types for use in other files
 */
export type { StaffPermissions, StaffRole };
