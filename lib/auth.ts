// Authentication and Authorization utilities

import { useRouter } from 'next/router';
import { useEffect } from 'react';

const API_BASE_URL = 'https://citiedgecollege.co.uk/student_api.php';

export interface AuthUser {
  id: string;
  student_number?: string;
  email: string;
  username: string;
  role: 'student' | 'staff' | 'lecturer' | 'admin' | 'super_admin' | 'agent';
  status: string;
  details?: any; // Additional user details (student_info or staff_info)
  reference_id?: string;
}

/**
 * Login function - authenticates user with backend API
 */
export const login = async (email: string, password: string): Promise<{ success: boolean; user?: AuthUser; error?: string }> => {
  try {
    const response = await fetch(`${API_BASE_URL}?action=login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-KEY': process.env.NEXT_PUBLIC_API_KEY as string,
      },
      body: JSON.stringify({ email, password }),
    });

    const result = await response.json();

    if (result.success && result.user) {
      const authUser: AuthUser = {
        id: result.user.id,
        student_number: result.user.student_number,
        email: result.user.email,
        username: result.user.username,
        role: result.user.role,
        status: result.user.status,
        details: result.details,
        reference_id: result.user.reference_id,
      };

      // Store user in localStorage
      setAuthUser(authUser);
      
      return { success: true, user: authUser };
    } else {
      return { success: false, error: result.error || 'Login failed' };
    }
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, error: 'Network error. Please try again.' };
  }
};

/**
 * Logout function - clears authentication
 */
export const logout = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('authUser');
    localStorage.removeItem('authToken');
    window.location.href = '/Login/login';
  }
};

/**
 * Get current authenticated user from localStorage
 */
export const getAuthUser = (): AuthUser | null => {
  if (typeof window === 'undefined') return null;
  
  try {
    const userStr = localStorage.getItem('authUser');
    if (userStr) {
      return JSON.parse(userStr) as AuthUser;
    }
  } catch (error) {
    console.error('Error parsing auth user:', error);
  }
  return null;
};

/**
 * Set authenticated user in localStorage
 */
export const setAuthUser = (user: AuthUser): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('authUser', JSON.stringify(user));
  }
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = (): boolean => {
  return getAuthUser() !== null;
};

/**
 * Check if user has a specific role
 */
export const hasRole = (role: string | string[]): boolean => {
  const user = getAuthUser();
  if (!user) return false;
  
  if (Array.isArray(role)) {
    return role.includes(user.role);
  }
  return user.role === role;
};

/**
 * Get redirect path based on user role
 */
export const getRoleBasedPath = (role: string): string => {
  switch (role) {
    case 'super_admin':
    case 'admin':
      return '/Admin/adminpage';
    case 'staff':
      return '/staff/new-portal';
    case 'lecturer':
      return '/staff/portal';
    case 'student':
      return '/student/portal-new';
    case 'agent':
      return '/Admin/adminpage';
    default:
      return '/Login/login';
  }
};

/**
 * Protected Route Hook - redirect to login if not authenticated
 * Usage: useProtectedRoute() or useProtectedRoute(['admin', 'staff'])
 */
export const useProtectedRoute = (allowedRoles?: string[]) => {
  const router = useRouter();

  useEffect(() => {
    const user = getAuthUser();
    
    if (!user) {
      // Not authenticated, redirect to login
      router.push('/Login/login');
      return;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
      // User doesn't have required role, redirect to their dashboard
      router.push(getRoleBasedPath(user.role));
    }
  }, [router, allowedRoles]);

  return getAuthUser();
};
