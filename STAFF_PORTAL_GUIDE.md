# Staff Portal System - Implementation Guide

## Overview

This staff portal system provides role-based access control for different types of university staff including Admins, Lecturers, Office Staff, Librarians, and Counselors.

## Features

✅ **Role-Based Access Control**
- 5 predefined roles with customizable permissions
- Dynamic UI based on user permissions
- Fine-grained permission system

✅ **Staff Roles**
- **Admin**: Full system access, user management, system configuration
- **Lecturer**: Class management, grade students, view course reports
- **Office**: Student records, course registration, financial management
- **Librarian**: Library inventory, book lending, catalog management
- **Counselor**: Student counseling sessions, appointments, academic guidance

✅ **Key Components**
- Dashboard with role-specific widgets
- Class management (for lecturers)
- Student records management
- Financial tracking
- Library management
- Counseling session tracking
- System administration tools
- Comprehensive reporting

## File Structure

```
lib/
  ├── staffData.ts          # Data models and mock API functions
  └── auth.ts               # Authentication and authorization utilities

pages/
  └── staff/
      └── portal.tsx        # Main staff portal page

components/
  └── staff/
      └── StaffComponents.tsx  # Reusable staff UI components
```

## Getting Started

### 1. Configure Staff Roles

Edit the `fetchStaffProfile` function in [lib/staffData.ts](lib/staffData.ts) to change the current user's role:

```typescript
return {
  // ...
  role: "admin", // Change to: admin, lecturer, office, librarian, or counselor
  // ...
};
```

### 2. Test Different Roles

Each role provides different access:

**Admin** sees all tabs:
- Overview, Classes, Students, Financials, Library, Counseling, Reports, System Admin

**Lecturer** sees:
- Overview, My Classes, Counseling, Reports

**Office** sees:
- Overview, Students, Financials, Reports

**Librarian** sees:
- Overview, Library

**Counselor** sees:
- Overview, Counseling, Reports

### 3. Customize Permissions

To create custom permission sets, modify [lib/staffData.ts](lib/staffData.ts):

```typescript
export const customPermissions: StaffPermissions = {
  canManageStudents: true,
  canManageStaff: false,
  canManageCourses: true,
  canViewFinancials: true,
  canManageFinancials: false,
  canViewReports: true,
  canManageSystem: false,
  canManageLibrary: false,
  canCounselStudents: true,
};
```

## Using Authentication

### Login System

```typescript
import { login, logout, getCurrentUser } from '@/lib/auth';

// Login
const user = await login('admin@university.edu', 'password');

// Check authentication
if (isAuthenticated()) {
  const user = getCurrentUser();
}

// Logout
await logout();
```

### Permission Checks

```typescript
import { hasPermission, canAccessFeature } from '@/lib/auth';

// Check specific permission
if (hasPermission(staff, 'canManageStudents')) {
  // Show student management UI
}

// Check feature access
if (canAccessFeature(staff, 'financials')) {
  // Show financial data
}
```

### Using Permission Gates in Components

```typescript
import { PermissionGate } from '@/components/staff/StaffComponents';

<PermissionGate staff={staff} permission="canManageStudents">
  <button>Add Student</button>
</PermissionGate>
```

## Integrating with Real Authentication

### Step 1: Replace Mock Authentication

Currently using mock authentication in [lib/auth.ts](lib/auth.ts). To integrate with real auth:

**NextAuth.js Example:**

```typescript
// pages/api/auth/[...nextauth].ts
import NextAuth from 'next-auth';

export default NextAuth({
  providers: [
    // Your auth providers
  ],
  callbacks: {
    async session({ session, token }) {
      session.user.role = token.role;
      session.user.staffId = token.staffId;
      return session;
    },
  },
});
```

**Update the portal to use NextAuth:**

```typescript
import { useSession } from 'next-auth/react';

function StaffPortal() {
  const { data: session } = useSession();
  
  useEffect(() => {
    if (session?.user) {
      loadStaffData(session.user.staffId);
    }
  }, [session]);
}
```

### Step 2: Connect to Database

Replace mock data functions in [lib/staffData.ts](lib/staffData.ts) with real API calls:

```typescript
export const fetchStaffProfile = async (staffId: string): Promise<Staff> => {
  const response = await fetch(`/api/staff/${staffId}`);
  return response.json();
};

export const fetchLecturerClasses = async (staffId: string): Promise<LecturerClass[]> => {
  const response = await fetch(`/api/staff/${staffId}/classes`);
  return response.json();
};
```

### Step 3: Create API Routes

```typescript
// pages/api/staff/[staffId].ts
export default async function handler(req, res) {
  const { staffId } = req.query;
  
  // Authenticate request
  const session = await getSession({ req });
  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  // Fetch from database
  const staff = await db.staff.findUnique({
    where: { id: staffId },
  });
  
  res.json(staff);
}
```

## Permission System Details

### Available Permissions

| Permission | Description |
|-----------|-------------|
| `canManageStudents` | View, edit, add student records |
| `canManageStaff` | Manage staff accounts and roles |
| `canManageCourses` | Create and manage courses |
| `canViewFinancials` | View financial reports |
| `canManageFinancials` | Approve payments, manage budgets |
| `canViewReports` | Access system reports |
| `canManageSystem` | System configuration and settings |
| `canManageLibrary` | Library inventory management |
| `canCounselStudents` | Schedule and conduct counseling |

### Default Role Permissions

```typescript
// Admin - Full Access
{
  canManageStudents: true,
  canManageStaff: true,
  canManageCourses: true,
  canViewFinancials: true,
  canManageFinancials: true,
  canViewReports: true,
  canManageSystem: true,
  canManageLibrary: true,
  canCounselStudents: true,
}

// Lecturer - Teaching Focused
{
  canManageStudents: false,
  canManageStaff: false,
  canManageCourses: true,    // Their courses only
  canViewFinancials: false,
  canManageFinancials: false,
  canViewReports: true,       // Course reports
  canManageSystem: false,
  canManageLibrary: false,
  canCounselStudents: true,   // Academic counseling
}

// Office - Administrative
{
  canManageStudents: true,    // Records management
  canManageStaff: false,
  canManageCourses: true,     // Registration
  canViewFinancials: true,
  canManageFinancials: true,
  canViewReports: true,
  canManageSystem: false,
  canManageLibrary: false,
  canCounselStudents: false,
}
```

## Security Features

### Audit Logging

All sensitive operations are logged:

```typescript
import { auditLog } from '@/lib/auth';

auditLog('STUDENT_RECORD_UPDATED', 'student', {
  studentId: 'STD-2024-001',
  changes: { gpa: 3.7 },
});
```

### Rate Limiting

Prevent abuse of sensitive operations:

```typescript
import { checkRateLimit } from '@/lib/auth';

if (!checkRateLimit('delete_student', 5, 60000)) {
  alert('Too many attempts. Please wait.');
  return;
}
```

### Session Management

Automatic timeout after 30 minutes of inactivity:

```typescript
import { isSessionValid, getSessionTimeRemaining } from '@/lib/auth';

if (!isSessionValid()) {
  // Redirect to login
}
```

## Customization

### Adding New Roles

1. Add role to type in [lib/staffData.ts](lib/staffData.ts):

```typescript
export type StaffRole = 'admin' | 'lecturer' | 'office' | 'librarian' | 'counselor' | 'registrar';
```

2. Add default permissions:

```typescript
export const defaultPermissions: Record<StaffRole, StaffPermissions> = {
  // ...existing roles
  registrar: {
    canManageStudents: true,
    canManageStaff: false,
    canManageCourses: true,
    // ...other permissions
  },
};
```

3. Update role badge in [components/staff/StaffComponents.tsx](components/staff/StaffComponents.tsx)

### Adding New Permissions

1. Update the interface in [lib/staffData.ts](lib/staffData.ts):

```typescript
export interface StaffPermissions {
  // ...existing permissions
  canApproveGrades: boolean;
  canAccessTranscripts: boolean;
}
```

2. Update all role definitions in `defaultPermissions`

### Adding New Features/Tabs

1. Add permission check to navigation in [pages/staff/portal.tsx](pages/staff/portal.tsx):

```typescript
{staff.permissions.canAccessNewFeature && (
  <button onClick={() => setActiveTab('newfeature')}>
    New Feature
  </button>
)}
```

2. Create the tab component and add to main content area

## Testing

### Test Different Scenarios

```typescript
// Test as Admin
// In lib/staffData.ts, set role: 'admin'

// Test as Lecturer
// In lib/staffData.ts, set role: 'lecturer'

// Test custom permissions
const customStaff = {
  ...staff,
  permissions: {
    ...defaultPermissions.lecturer,
    canViewFinancials: true, // Custom permission
  },
};
```

## Deployment Checklist

- [ ] Replace mock authentication with real auth provider
- [ ] Connect to production database
- [ ] Implement proper API endpoints
- [ ] Set up audit logging to database
- [ ] Configure session management (Redis/Database)
- [ ] Enable rate limiting middleware
- [ ] Set up role management UI for admins
- [ ] Test all permission combinations
- [ ] Configure environment variables
- [ ] Enable HTTPS/SSL
- [ ] Set up monitoring and alerts

## Support

For questions or issues:
1. Check the implementation in the code files
2. Review permission configurations
3. Test with different roles
4. Check console logs for audit trails

## Next Steps

1. **Immediate**: Test the portal by accessing `/pages/staff/portal`
2. **Integration**: Connect to your authentication system
3. **Database**: Replace mock data with real API calls
4. **UI/UX**: Customize components to match your brand
5. **Features**: Add additional modules as needed
