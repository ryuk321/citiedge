import React, { useState, useEffect } from 'react';
import { useProtectedRoute, getAuthUser } from '../../../lib/auth';
import { staffAPI } from '../../../lib/api';
import Notification, { NotificationProps } from '../../../components/Notification';
import { StaffInfo, User } from '../../../lib/DB_Table';
import { STAFF_PAGES } from '../../../lib/staffPermissions';
import { usersAPI } from '../../../lib/api';

interface StaffPermission {
  id?: number;
  staff_id: string;
  pageId: string;
  page_name: string;
  canView: boolean;
  canEdit: boolean;
  canDelete: boolean;
  grantedBy: string;
  grantedAt?: string;
}

interface StaffWithUser extends StaffInfo {
  userRole?: string;
  userStatus?: string;
  userId?: number;
}

const StaffRolesPage: React.FC = () => {
  useProtectedRoute(['super_admin', 'admin']);
  
  const [currentUser, setCurrentUser] = useState<ReturnType<typeof getAuthUser>>(null);
  const [staff, setStaff] = useState<StaffWithUser[]>([]);
  const [selectedStaff, setSelectedStaff] = useState<StaffWithUser | null>(null);
  const [permissions, setPermissions] = useState<StaffPermission[]>([]);
  const [loading, setLoading] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [notification, setNotification] = useState<NotificationProps | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Role editing
  const [newRole, setNewRole] = useState<'student' | 'admin' | 'staff' | 'super_admin' | 'lecturer' | 'agent'>('staff');
  const [newStatus, setNewStatus] = useState<'active' | 'inactive' | 'suspended'>('active');

  useEffect(() => {
    const user = getAuthUser();
    setCurrentUser(user);
    loadStaffWithUsers();
  }, []);

  // Load staff and match with users table
  const loadStaffWithUsers = async () => {
    setLoading(true);
    try {
      // Load all staff
      const staffResult = await staffAPI.getAll();
      
      if (staffResult.success) {
        const staffData = staffResult.data.data || staffResult.data;
        const staffList = Array.isArray(staffData) ? staffData : [];
        
        // Load all users to match with staff
        // const usersResponse = await fetch('/api/users');
         const usersResponse = await usersAPI.getAll();
      
        
        if (usersResponse.success) {
        //   const usersData = usersResponse.data;
          const users = usersResponse.data.data || [];
        
        //   alert('Users loaded: ' + JSON.stringify(users));
          
          // Match staff with users by staff_id = reference_id
          const staffWithUsers = staffList.map(staffMember => {
            const user = users.find((u: User) => u.reference_id === staffMember.staff_id);
            return {
              ...staffMember,
              userRole: user?.role,
              userStatus: user?.status,
              userId: user?.id
            };
          });
          
          setStaff(staffWithUsers);
        } else {
          setStaff(staffList);
        }
      }
    } catch (error) {
      console.error('Error loading staff:', error);
      setNotification({ type: 'error', message: 'Failed to load staff data', duration: 4000 });
    }
    setLoading(false);
  };

  // Load permissions for selected staff
  const loadStaffPermissions = async (staffId: string) => {
    try {
      const response = await fetch(`/api/staff/permissions?staff_id=${staffId}`);
      const data = await response.json();
      
      if (data.success) {
        setPermissions(data.data || []);
      } else {
        setPermissions([]);
      }
    } catch (error) {
      console.error('Error loading permissions:', error);
      setPermissions([]);
    }
  };

  // Open role editing modal
  const openRoleModal = (staffMember: StaffWithUser) => {
    setSelectedStaff(staffMember);
    setNewRole(staffMember.userRole as any || 'staff');
    setNewStatus(staffMember.userStatus as any || 'active');
    setShowRoleModal(true);
  };

  // Open permission management modal
  const openPermissionModal = async (staffMember: StaffWithUser) => {
    setSelectedStaff(staffMember);
    await loadStaffPermissions(staffMember.staff_id);
    setShowPermissionModal(true);
  };

  // Update user role and status
  const handleUpdateRole = async () => {
    if (!selectedStaff || !selectedStaff.userId) {
      setNotification({ type: 'error', message: 'No user account found for this staff member', duration: 4000 });
      return;
    }

    try {
      const response = await fetch(`/api/users/${selectedStaff.userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role: newRole,
          status: newStatus
        })
      });

      const result = await response.json();
      
      if (result.success) {
        setNotification({ type: 'success', message: 'Role and status updated successfully!', duration: 4000 });
        loadStaffWithUsers();
        setShowRoleModal(false);
        
        // Log activity
        const userWithRef = currentUser as any;
        if (userWithRef?.reference_id || userWithRef?.student_number) {
          await logActivity(
            selectedStaff.staff_id,
            `Role changed to ${newRole}, Status changed to ${newStatus}`,
            'update'
          );
        }
      } else {
        setNotification({ type: 'error', message: result.error || 'Failed to update role', duration: 4000 });
      }
    } catch (error) {
      console.error('Error updating role:', error);
      setNotification({ type: 'error', message: 'Error updating role', duration: 4000 });
    }
  };

  // Update single permission
  const handleTogglePermission = async (pageId: string, permissionType: 'canView' | 'canEdit' | 'canDelete', value: boolean) => {
    const userWithRef = currentUser as any;
    if (!selectedStaff || (!userWithRef?.reference_id && !userWithRef?.student_number)) return;

    const existingPermission = permissions.find(p => p.pageId === pageId);
    const page = STAFF_PAGES.find(p => p.pageId === pageId);
    
    if (!page) return;

    try {
      const permissionData = {
        staff_id: selectedStaff.staff_id,
        pageId: pageId,
        page_name: page.pageName,
        canView: existingPermission?.canView || false,
        canEdit: existingPermission?.canEdit || false,
        canDelete: existingPermission?.canDelete || false,
        [permissionType]: value,
        grantedBy: userWithRef.reference_id || userWithRef.student_number || (currentUser?.email || 'system')
      };

      const response = await fetch('/api/staff/permissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(permissionData)
      });

      const result = await response.json();
      
      if (result.success) {
        await loadStaffPermissions(selectedStaff.staff_id);
        setNotification({ type: 'success', message: 'Permission updated successfully!', duration: 3000 });
        
        // Log activity
        await logActivity(
          selectedStaff.staff_id,
          `Permission ${permissionType} ${value ? 'granted' : 'revoked'} for ${page.pageName}`,
          'update'
        );
      } else {
        setNotification({ type: 'error', message: result.error || 'Failed to update permission', duration: 4000 });
      }
    } catch (error) {
      console.error('Error updating permission:', error);
      setNotification({ type: 'error', message: 'Error updating permission', duration: 4000 });
    }
  };

  // Grant all permissions for a page
  const handleGrantAllForPage = async (pageId: string) => {
    // alert("Selected Staff: " + JSON.stringify(selectedStaff));
   
    const userWithRef = currentUser as any;
    
    // if (!selectedStaff || (!userWithRef?.reference_id && !userWithRef?.student_number)) return;
  
    const page = STAFF_PAGES.find(p => p.pageId === pageId);
    
    if (!page) return;
   
    
    try {
      const response = await fetch('/api/staff/permissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          staff_id: selectedStaff?.staff_id ?? '',
          pageId: pageId,
          page_name: page.pageName,
          canView: true,
          canEdit: true,
          canDelete: true,
          grantedBy: userWithRef.reference_id || userWithRef.student_number || (currentUser?.email || 'system')
        })
      });
   
      const result = await response.json();
    
      
      if (result.success) {
        await loadStaffPermissions(selectedStaff?.staff_id ?? '');
        setNotification({ type: 'success', message: 'Full access granted!', duration: 3000 });
        
        await logActivity(
          selectedStaff?.staff_id ?? '',
          `Full access granted for ${page.pageName}`,
          'update'
        );
      }
    } catch (error) {
      console.error('Error granting permissions:', error);
    }
  };

  // Revoke all permissions for a page
  const handleRevokeAllForPage = async (pageId: string) => {
    if (!selectedStaff || !currentUser) return;

    const existingPermission = permissions.find(p => p.pageId === pageId);
    if (!existingPermission?.id) return;

    const page = STAFF_PAGES.find(p => p.pageId === pageId);

    try {
      const response = await fetch(`/api/staff/permissions?id=${existingPermission.id}`, {
        method: 'DELETE'
      });

      const result = await response.json();
      
      if (result.success) {
        await loadStaffPermissions(selectedStaff.staff_id);
        setNotification({ type: 'success', message: 'All permissions revoked!', duration: 3000 });
        
        if (page) {
          await logActivity(
            selectedStaff.staff_id,
            `All permissions revoked for ${page.pageName}`,
            'delete'
          );
        }
      }
    } catch (error) {
      console.error('Error revoking permissions:', error);
    }
  };

  // Log activity
  const logActivity = async (targetStaffId: string, changes: string, action: string) => {
    const userWithRef = currentUser as any;
    if (!currentUser) return;

    try {
      await fetch('/api/staff/activity-log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          staff_id: userWithRef.reference_id || userWithRef.student_number || currentUser.id,
          staff_name: currentUser.username || currentUser.email,
          action: action,
          target_type: 'staff',
          target_id: targetStaffId,
          target_name: selectedStaff ? `${selectedStaff.first_name} ${selectedStaff.last_name}` : '',
          changes: changes
        })
      });
    } catch (error) {
      console.error('Error logging activity:', error);
    }
  };

  // Filter staff
  const filteredStaff = staff.filter(s => {
    const searchLower = searchTerm.toLowerCase();
    return (
      s.staff_id.toLowerCase().includes(searchLower) ||
      s.first_name.toLowerCase().includes(searchLower) ||
      s.last_name.toLowerCase().includes(searchLower) ||
      s.email.toLowerCase().includes(searchLower) ||
      s.position.toLowerCase().includes(searchLower) ||
      s.department.toLowerCase().includes(searchLower) ||
      (s.userRole && s.userRole.toLowerCase().includes(searchLower))
    );
  });

  // Get permission for a page
  const getPermissionForPage = (pageId: string) => {
    return permissions.find(p => p.pageId === pageId);
  };

  // Role badge colors
  const getRoleBadgeColor = (role?: string) => {
    switch (role) {
      case 'super_admin': return 'bg-red-100 text-red-800';
      case 'admin': return 'bg-purple-100 text-purple-800';
      case 'staff': return 'bg-blue-100 text-blue-800';
      case 'lecturer': return 'bg-green-100 text-green-800';
      case 'agent': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Status badge colors
  const getStatusBadgeColor = (status?: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'suspended': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      {notification && <Notification {...notification} />}
      
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Staff Roles & Permissions</h1>
          <p className="text-gray-600">Manage staff user roles, access levels, and page permissions</p>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center gap-4">
            <input
              type="text"
              placeholder="Search by staff ID, name, email, position, department, or role..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 text-black"
            />
            <button
              onClick={loadStaffWithUsers}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2"
            >
              🔄 Refresh
            </button>
          </div>
        </div>

        {/* Staff List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            <p className="text-gray-600 mt-4">Loading staff...</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Staff Info
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Position & Department
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredStaff.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                        No staff members found
                      </td>
                    </tr>
                  ) : (
                    filteredStaff.map((staffMember) => (
                      <tr key={staffMember.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="text-sm font-medium text-gray-900">
                              {staffMember.first_name} {staffMember.last_name}
                            </span>
                            <span className="text-sm text-gray-500">{staffMember.staff_id}</span>
                            <span className="text-xs text-gray-400">{staffMember.email}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="text-sm text-gray-900">{staffMember.position}</span>
                            <span className="text-xs text-gray-500">{staffMember.department}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(staffMember.userRole)}`}>
                            {staffMember.userRole || 'No Account'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(staffMember.userStatus)}`}>
                            {staffMember.userStatus || 'N/A'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <button
                              onClick={() => openRoleModal(staffMember)}
                              className="px-3 py-1 bg-indigo-600 text-white text-sm rounded hover:bg-indigo-700"
                              disabled={!staffMember.userId}
                            >
                              Edit Role
                            </button>
                            <button
                              onClick={() => openPermissionModal(staffMember)}
                              className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                            >
                              Permissions
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Role Edit Modal */}
      {showRoleModal && selectedStaff && (
        <div className="fixed inset-0 bg-gray-500/20 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900">
                Edit User Role & Status
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                {selectedStaff.first_name} {selectedStaff.last_name} ({selectedStaff.staff_id})
              </p>
            </div>
            
            <div className="p-6 space-y-4">
              {/* Role Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  User Role
                </label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value as any)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 text-black"
                >
                  <option value="staff">Staff</option>
                  <option value="lecturer">Lecturer</option>
                  <option value="admin">Admin</option>
                  <option value="super_admin">Super Admin</option>
                  <option value="agent">Agent</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  {newRole === 'super_admin' && '⚠️ Full system access'}
                  {newRole === 'admin' && '✓ Admin panel access'}
                  {newRole === 'staff' && '✓ Staff portal access (permission-based)'}
                  {newRole === 'lecturer' && '✓ Lecturer portal access'}
                  {newRole === 'agent' && '✓ Agent portal access'}
                </p>
              </div>

              {/* Status Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Account Status
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as any)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 text-black"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="suspended">Suspended</option>
                </select>
              </div>
            </div>

            <div className="p-6 bg-gray-50 flex justify-end gap-3 rounded-b-lg">
              <button
                onClick={() => setShowRoleModal(false)}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateRole}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                Update Role
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Permission Management Modal */}
      {showPermissionModal && selectedStaff && (
        <div className="fixed inset-0 bg-gray-500/20 bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-lg shadow-xl max-w-5xl w-full my-8">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900">
                Manage Page Permissions
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                {selectedStaff.first_name} {selectedStaff.last_name} ({selectedStaff.staff_id})
              </p>
              <p className="text-xs text-gray-500 mt-1">
                User Role: <span className={`px-2 py-0.5 rounded ${getRoleBadgeColor(selectedStaff.userRole)}`}>
                  {selectedStaff.userRole || 'No Account'}
                </span>
              </p>
            </div>
            
            <div className="p-6 max-h-[70vh] overflow-y-auto">
              <div className="space-y-4">
                {STAFF_PAGES.map((page) => {
                  const permission = getPermissionForPage(page.pageId);
                  const hasAnyPermission = permission && (permission.canView || permission.canEdit || permission.canDelete);

                  return (
                    <div key={page.pageId} className="border border-gray-200 rounded-lg p-4 hover:border-indigo-300 transition-colors">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h4 className="text-lg font-semibold text-gray-900">{page.pageName}</h4>
                          <p className="text-sm text-gray-500">{page.description}</p>
                          <p className="text-xs text-gray-400 mt-1">Path: {page.path}</p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleGrantAllForPage(page.pageId)}
                            className="px-3 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700"
                          >
                            ✓ Grant All
                          </button>
                          {hasAnyPermission && (
                            <button
                              onClick={() => handleRevokeAllForPage(page.pageId)}
                              className="px-3 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700"
                            >
                              ✗ Revoke All
                            </button>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        {/* View Permission */}
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id={`${page.pageId}-view`}
                            checked={permission?.canView || false}
                            onChange={(e) => handleTogglePermission(page.pageId, 'canView', e.target.checked)}
                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                          />
                          <label htmlFor={`${page.pageId}-view`} className="ml-2 text-sm text-gray-700">
                            👁️ Can View
                          </label>
                        </div>

                        {/* Edit Permission */}
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id={`${page.pageId}-edit`}
                            checked={permission?.canEdit || false}
                            onChange={(e) => handleTogglePermission(page.pageId, 'canEdit', e.target.checked)}
                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                          />
                          <label htmlFor={`${page.pageId}-edit`} className="ml-2 text-sm text-gray-700">
                            ✏️ Can Edit
                          </label>
                        </div>

                        {/* Delete Permission */}
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id={`${page.pageId}-delete`}
                            checked={permission?.canDelete || false}
                            onChange={(e) => handleTogglePermission(page.pageId, 'canDelete', e.target.checked)}
                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                          />
                          <label htmlFor={`${page.pageId}-delete`} className="ml-2 text-sm text-gray-700">
                            🗑️ Can Delete
                          </label>
                        </div>
                      </div>

                      {permission && permission.grantedBy && (
                        <p className="text-xs text-gray-400 mt-2">
                          Granted by: {permission.grantedBy} {permission.grantedAt && `on ${new Date(permission.grantedAt).toLocaleDateString()}`}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="p-6 bg-gray-50 flex justify-end rounded-b-lg">
              <button
                onClick={() => setShowPermissionModal(false)}
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffRolesPage;
