// Staff Permissions Configuration
// This file defines page permissions and access control for staff members

export interface StaffPagePermission {
  pageId: string;
  pageName: string;
  path: string;
  requiredPermission: string[];
  description?: string;
}

export interface StaffPermissionRecord {
  staff_id: string;
  pageId: string;
  canView: boolean;
  canEdit: boolean;
  canDelete: boolean;
  grantedBy: string; // admin who granted the permission
  grantedAt?: string;
}

// Define all staff pages and their required permissions
export const STAFF_PAGES: StaffPagePermission[] = [
  {
    pageId: 'dashboard',
    pageName: 'Dashboard',
    path: '/staff/portal',
    requiredPermission: ['view_dashboard'],
    description: 'Staff dashboard overview'
  },
  {
    pageId: 'admitted_students',
    pageName: 'Admitted Students',
    path: '/staff/admitted-students',
    requiredPermission: ['view_students', 'manage_students'],
    description: 'View and manage admitted students list'
  },
  {
    pageId: 'applications',
    pageName: 'Applications',
    path: '/staff/applications',
    requiredPermission: ['view_applications', 'manage_applications'],
    description: 'View and process student applications'
  },
  {
    pageId: 'attendance',
    pageName: 'Attendance',
    path: '/staff/attendance',
    requiredPermission: ['view_attendance', 'manage_attendance'],
    description: 'Track and manage student attendance'
  },
  {
    pageId: 'grades',
    pageName: 'Grades',
    path: '/staff/grades',
    requiredPermission: ['view_grades', 'manage_grades'],
    description: 'View and manage student grades'
  },
  {
    pageId: 'library',
    pageName: 'E-Learning Library',
    path: '/staff/library',
    requiredPermission: ['view_library', 'manage_library'],
    description: 'Manage e-learning resources'
  },
  {
    pageId: 'reports',
    pageName: 'Reports',
    path: '/staff/reports',
    requiredPermission: ['view_reports'],
    description: 'View system reports and analytics'
  },
];

// Permission levels
export enum PermissionLevel {
  NONE = 'none',
  VIEW = 'view',
  EDIT = 'edit',
  FULL = 'full' // view, edit, delete
}

// Check if staff has permission to access a page
export function checkStaffPermission(
  staffPermissions: StaffPermissionRecord[],
  pageId: string,
  action: 'view' | 'edit' | 'delete' = 'view'
): boolean {
  const permission = staffPermissions.find(p => p.pageId === pageId);
  
  if (!permission) return false;
  
  switch (action) {
    case 'view':
      return permission.canView;
    case 'edit':
      return permission.canEdit;
    case 'delete':
      return permission.canDelete;
    default:
      return false;
  }
}

// Get accessible pages for a staff member
export function getAccessiblePages(
  staffPermissions: StaffPermissionRecord[]
): StaffPagePermission[] {
  return STAFF_PAGES.filter(page => {
    const permission = staffPermissions.find(p => p.pageId === page.pageId);
    return permission && permission.canView;
  });
}

// Default permissions for different staff roles
export const DEFAULT_ROLE_PERMISSIONS: Record<string, string[]> = {
  lecturer: [
    'view_dashboard',
    'view_students',
    'view_attendance',
    'manage_attendance',
    'view_grades',
    'manage_grades',
    'view_library',
  ],
  admin_staff: [
    'view_dashboard',
    'view_students',
    'manage_students',
    'view_applications',
    'manage_applications',
    'view_attendance',
    'view_reports',
  ],
  librarian: [
    'view_dashboard',
    'view_library',
    'manage_library',
  ],
  counselor: [
    'view_dashboard',
    'view_students',
    'view_applications',
  ],
};
