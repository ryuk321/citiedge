"use client";

import { useState } from 'react';
import { StaffRole, StaffPermissions, defaultPermissions } from '../../lib/staffData';

interface NewStaffForm {
  name: string;
  email: string;
  staffId: string;
  role: StaffRole;
  department: string;
  phoneNumber: string;
  customPermissions?: Partial<StaffPermissions>;
}

export default function StaffManagement() {
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedRole, setSelectedRole] = useState<StaffRole>('lecturer');
  const [useCustomPermissions, setUseCustomPermissions] = useState(false);
  const [formData, setFormData] = useState<NewStaffForm>({
    name: '',
    email: '',
    staffId: '',
    role: 'lecturer',
    department: '',
    phoneNumber: '',
  });

  const roleDescriptions = {
    admin: 'Full system access - manages all aspects of the university system',
    lecturer: 'Teaching focused - manages courses, grades, and academic counseling',
    office: 'Administrative work - handles student records, registration, and finances',
    librarian: 'Library management - manages books, lending, and catalog',
    counselor: 'Student support - conducts counseling sessions and provides guidance',
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In production, this would call your API
    console.log('Creating new staff member:', formData);
    
    alert(`Staff member created successfully!\n\nName: ${formData.name}\nRole: ${formData.role}\nEmail: ${formData.email}`);
    
    // Reset form
    setFormData({
      name: '',
      email: '',
      staffId: '',
      role: 'lecturer',
      department: '',
      phoneNumber: '',
    });
    setShowAddForm(false);
  };

  const currentPermissions = useCustomPermissions 
    ? formData.customPermissions 
    : defaultPermissions[selectedRole];

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Staff Management</h1>
          <p className="text-gray-600">Create and manage staff accounts with role-based permissions</p>
        </div>

        {/* Add Staff Button */}
        <div className="mb-6">
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 flex items-center gap-2"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add New Staff Member
          </button>
        </div>

        {/* Add Staff Form */}
        {showAddForm && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Create New Staff Account</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Dr. Sarah Johnson"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="sarah.johnson@university.edu"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Staff ID *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.staffId}
                    onChange={(e) => setFormData({ ...formData, staffId: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="STF-2024-001"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Department *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Computer Science"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
              </div>

              {/* Role Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Select Role *
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {(Object.keys(roleDescriptions) as StaffRole[]).map((role) => (
                    <div
                      key={role}
                      onClick={() => {
                        setSelectedRole(role);
                        setFormData({ ...formData, role });
                      }}
                      className={`cursor-pointer p-4 border-2 rounded-lg transition-all ${
                        formData.role === role
                          ? 'border-indigo-600 bg-indigo-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-gray-900 capitalize">{role}</span>
                        {formData.role === role && (
                          <svg className="h-5 w-5 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">{roleDescriptions[role]}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Permissions Preview */}
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Permissions for {formData.role}</h3>
                  <button
                    type="button"
                    onClick={() => setUseCustomPermissions(!useCustomPermissions)}
                    className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
                  >
                    {useCustomPermissions ? 'Use Default Permissions' : 'Customize Permissions'}
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {Object.entries(defaultPermissions[selectedRole]).map(([permission, enabled]) => {
                    const permissionLabels: Record<string, string> = {
                      canManageStudents: 'Manage Students',
                      canManageStaff: 'Manage Staff',
                      canManageCourses: 'Manage Courses',
                      canViewFinancials: 'View Financials',
                      canManageFinancials: 'Manage Financials',
                      canViewReports: 'View Reports',
                      canManageSystem: 'System Administration',
                      canManageLibrary: 'Manage Library',
                      canCounselStudents: 'Counsel Students',
                    };

                    return (
                      <div
                        key={permission}
                        className={`flex items-center justify-between p-3 rounded-lg ${
                          enabled ? 'bg-green-50' : 'bg-gray-100'
                        }`}
                      >
                        <span className={`text-sm font-medium ${
                          enabled ? 'text-green-900' : 'text-gray-500'
                        }`}>
                          {permissionLabels[permission]}
                        </span>
                        {useCustomPermissions ? (
                          <input
                            type="checkbox"
                            checked={currentPermissions?.[permission as keyof StaffPermissions] ?? enabled}
                            onChange={(e) => {
                              setFormData({
                                ...formData,
                                customPermissions: {
                                  ...formData.customPermissions,
                                  [permission]: e.target.checked,
                                },
                              });
                            }}
                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                          />
                        ) : (
                          enabled ? (
                            <svg className="h-5 w-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          ) : (
                            <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                          )
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 font-medium"
                >
                  Create Staff Account
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Quick Guide */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Role Permissions Guide</h2>
          
          <div className="space-y-4">
            {(Object.keys(roleDescriptions) as StaffRole[]).map((role) => (
              <div key={role} className="border-l-4 border-indigo-600 pl-4">
                <h3 className="font-semibold text-gray-900 capitalize mb-2">{role}</h3>
                <p className="text-sm text-gray-600 mb-2">{roleDescriptions[role]}</p>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(defaultPermissions[role])
                    .filter(([_, enabled]) => enabled)
                    .map(([permission]) => (
                      <span
                        key={permission}
                        className="px-2 py-1 text-xs bg-indigo-100 text-indigo-700 rounded-full"
                      >
                        {permission.replace('can', '').replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex gap-3">
            <svg className="h-6 w-6 text-blue-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h3 className="text-sm font-semibold text-blue-900 mb-2">Implementation Note</h3>
              <p className="text-sm text-blue-800">
                This is currently a demo interface. To fully implement staff management:
              </p>
              <ul className="mt-2 text-sm text-blue-800 list-disc list-inside space-y-1">
                <li>Connect to your authentication system (NextAuth, Auth0, etc.)</li>
                <li>Create API endpoints for staff CRUD operations</li>
                <li>Store staff data in your database</li>
                <li>Implement email verification for new accounts</li>
                <li>Add password reset functionality</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
