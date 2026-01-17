import React, { useEffect, useState } from 'react';
import { StaffPermissionRecord } from '../../lib/DB_Table';
import { checkStaffPermission, StaffPermissionRecord as ConfigPermission } from '../../lib/staffPermissions';

interface PermissionWrapperProps {
  children: React.ReactNode;
  pageId: string;
  staffId: string;
  action?: 'view' | 'edit' | 'delete';
  fallback?: React.ReactNode;
  onUnauthorized?: () => void;
}

/**
 * PermissionWrapper Component
 * 
 * Wraps content and only renders it if the staff member has the required permission.
 * If the staff doesn't have permission, it renders the fallback component or nothing.
 * 
 * Usage:
 * <PermissionWrapper pageId="admitted_students" staffId={staffId} action="view">
 *   <YourProtectedContent />
 * </PermissionWrapper>
 */
export const PermissionWrapper: React.FC<PermissionWrapperProps> = ({
  children,
  pageId,
  staffId,
  action = 'view',
  fallback = null,
  onUnauthorized
}) => {
  const [hasPermission, setHasPermission] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkPermission();
  }, [staffId, pageId, action]);

  const checkPermission = async () => {
    try {
      setLoading(true);
      
      // Fetch staff permissions from API
      const response = await fetch(`/api/staff/permissions?staff_id=${staffId}`);
      const data = await response.json();
      
      if (data.success) {
        const permissions: StaffPermissionRecord[] = data.data;
        const allowed = checkStaffPermission(permissions as any, pageId, action);
        setHasPermission(allowed);
        
        if (!allowed && onUnauthorized) {
          onUnauthorized();
        }
      } else {
        setHasPermission(false);
      }
    } catch (error) {
      console.error('Error checking permissions:', error);
      setHasPermission(false);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!hasPermission) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

/**
 * useStaffPermissions Hook
 * 
 * Custom hook to check permissions programmatically
 */
export const useStaffPermissions = (staffId: string) => {
  const [permissions, setPermissions] = useState<StaffPermissionRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPermissions();
  }, [staffId]);

  const loadPermissions = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/staff/permissions?staff_id=${staffId}`);
      const data = await response.json();
      
      if (data.success) {
        setPermissions(data.data);
      }
    } catch (error) {
      console.error('Error loading permissions:', error);
    } finally {
      setLoading(false);
    }
  };

  const hasPermission = (pageId: string, action: 'view' | 'edit' | 'delete' = 'view'): boolean => {
    return checkStaffPermission(permissions as any, pageId, action);
  };

  const canView = (pageId: string) => hasPermission(pageId, 'view');
  const canEdit = (pageId: string) => hasPermission(pageId, 'edit');
  const canDelete = (pageId: string) => hasPermission(pageId, 'delete');

  return {
    permissions,
    loading,
    hasPermission,
    canView,
    canEdit,
    canDelete,
    refresh: loadPermissions
  };
};

export default PermissionWrapper;
