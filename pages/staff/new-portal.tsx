"use client";

import React, { useState, useEffect } from 'react';
import { useProtectedRoute, logout, getAuthUser } from '../../lib/auth';
import { useStaffPermissions } from '../../components/staff/PermissionWrapper';
import AdmittedStudentsPage from './AdmittedStudentsPage';
import '../../app/globals.css';
import { json } from 'stream/consumers';

interface MenuItem {
  id: string;
  name: string;
  icon: React.ReactElement;
  requiredPermission: string;
}

const NewStaffPortal: React.FC = () => {
  // Protect this page - only staff can access
  useProtectedRoute(['staff', 'lecturer']);
  
  const [currentUser, setCurrentUser] = useState<ReturnType<typeof getAuthUser>>(null);
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [staffId, setStaffId] = useState<string>('');
  const [staffName, setStaffName] = useState('');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    const user = getAuthUser();
    setCurrentUser(user);
    // Fetch staff_id from user.reference_id
    if (user && 'reference_id' in user) {
      setStaffId((user as any).reference_id);
    }
    if (user?.username) {
      setStaffName(user.username);
    }
  }, []);

  // Use permissions hook - only fetch when we have a valid staffId
  const { permissions, loading: permissionsLoading, canView } = useStaffPermissions(staffId);

  // Menu items with permission requirements
  const menuItems: MenuItem[] = [
    {
      id: 'dashboard',
      name: 'Dashboard',
      requiredPermission: 'dashboard',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
    },
    {
      id: 'admitted_students',
      name: 'Admitted Students',
      requiredPermission: 'admitted_students',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
    },
    {
      id: 'applications',
      name: 'Applications',
      requiredPermission: 'applications',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
    },
    {
      id: 'attendance',
      name: 'Attendance',
      requiredPermission: 'attendance',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      ),
    },
    {
      id: 'library',
      name: 'E-Learning Library',
      requiredPermission: 'library',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
    },
    {
      id: 'reports',
      name: 'Reports',
      requiredPermission: 'reports',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
    },
  ];

  // Filter menu items based on permissions
  const accessibleMenuItems = menuItems.filter(item => 
    canView(item.requiredPermission)
  );

  // Render content based on active menu
  const renderContent = () => {
    if (!canView(activeMenu)) {
      return (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <svg className="w-16 h-16 text-red-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h3 className="text-xl font-semibold text-red-800 mb-2">Access Denied</h3>
          <p className="text-red-700">You do not have permission to access this page.</p>
        </div>
      );
    }

    switch (activeMenu) {
      case 'dashboard':
        return <DashboardContent staffName={staffName} />;
      case 'admitted_students':
        return <AdmittedStudentsPage staffId={staffId} staffName={staffName} />;
      case 'applications':
        return <ComingSoonContent pageName="Applications" />;
      case 'attendance':
        return <ComingSoonContent pageName="Attendance" />;
      case 'library':
        return <ComingSoonContent pageName="E-Learning Library" />;
      case 'reports':
        return <ComingSoonContent pageName="Reports" />;
      default:
        return <DashboardContent staffName={staffName} />;
    }
  };

  if (permissionsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your portal...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className={`${sidebarCollapsed ? 'w-20' : 'w-64'} bg-gradient-to-b from-blue-900 to-indigo-900 text-white fixed h-full overflow-y-auto transition-all duration-300`}>
        <div className={`${sidebarCollapsed ? 'p-2' : 'p-6'}`}>
          <div className={`flex items-center ${sidebarCollapsed ? 'justify-center mb-6 mt-4' : 'gap-3 mb-8'}`}>
            {/* Toggle Button */}
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="absolute top-6 -right-3 bg-white text-blue-900 rounded-full p-1.5 shadow-lg hover:shadow-xl transition-all z-10"
              title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {sidebarCollapsed ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                )}
              </svg>
            </button>
            <div className={`${sidebarCollapsed ? 'w-10 h-10' : 'w-10 h-10'}  rounded-lg flex items-center justify-center ${sidebarCollapsed ? '' : ''}`}>
              <div className={`inline-flex items-center justify-center w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full overflow-hidden ${sidebarCollapsed ? 'mb-0' : 'mb-4'} shadow-lg`}>
  <img
    src="/citiedge-logo.png"
    alt="CITIEDGE Logo"
    className="w-full h-full object-cover "
  />
</div>
            </div>
            {!sidebarCollapsed && (
              <div>
                <h1 className="text-lg font-bold">Staff Portal</h1>
                <p className="text-xs text-blue-200">CITIEDGE</p>
              </div>
            )}
          </div>

          <nav className="space-y-2">
            {accessibleMenuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveMenu(item.id)}
                className={`w-full flex items-center ${sidebarCollapsed ? 'justify-center px-2' : 'gap-3 px-4'} py-3 rounded-lg transition-all ${
                  activeMenu === item.id
                    ? 'bg-white text-blue-900 shadow-lg'
                    : 'text-white hover:bg-blue-800'
                }`}
                title={sidebarCollapsed ? item.name : ''}
              >
                {item.icon}
                {!sidebarCollapsed && <span className="text-sm font-medium">{item.name}</span>}
              </button>
            ))}
          </nav>

          {/* Staff Info at bottom */}
          <div className="mt-8 pt-6 border-t border-blue-800">
            <div className={`flex items-center ${sidebarCollapsed ? 'justify-center' : 'gap-3'} mb-4`}>
              <div className="w-10 h-10 bg-blue-700 rounded-full flex items-center justify-center">
                <span className="text-sm font-bold">
                  {staffName ? staffName.split(' ').map(n => n[0]).join('').toUpperCase() : 'ST'}
                </span>
              </div>
              {!sidebarCollapsed && (
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{staffName || 'Staff Member'}</p>
                  <p className="text-xs text-blue-300 truncate">{staffId}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className={`flex-1 ${sidebarCollapsed ? 'ml-20' : 'ml-64'} transition-all duration-300`}>
        {/* Header */}
        <header className="bg-white shadow-sm sticky top-0 z-10">
          <div className="px-8 py-4 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {menuItems.find(m => m.id === activeMenu)?.name || 'Dashboard'}
              </h2>
              <p className="text-sm text-gray-600 mt-1">Welcome back, {staffName || 'Staff Member'}</p>
            </div>

            {/* User Menu */}
            <div className="flex items-center gap-4">
              {/* Notifications */}
              <button className="relative p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </button>

              {/* User Profile & Logout */}
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{currentUser?.username || currentUser?.email}</p>
                  <p className="text-xs text-gray-500 capitalize">{currentUser?.role?.replace('_', ' ')}</p>
                </div>
                <div className="relative group">
                  <button className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold hover:shadow-lg transition-all">
                    {currentUser?.username?.[0]?.toUpperCase() || currentUser?.email?.[0]?.toUpperCase() || 'U'}
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                    <button
                      onClick={logout}
                      className="w-full px-4 py-3 text-left text-sm text-red-600 hover:bg-red-50 rounded-lg flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="p-8">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

// Dashboard Content Component
const DashboardContent: React.FC<{ staffName: string }> = ({ staffName }) => {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">Welcome to Your Portal</h2>
        <p className="text-blue-100">Hello {staffName}! Here's your dashboard overview.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">My Tasks</p>
              <p className="text-3xl font-bold text-blue-600 mt-2">12</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Students</p>
              <p className="text-3xl font-bold text-green-600 mt-2">48</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Notifications</p>
              <p className="text-3xl font-bold text-orange-600 mt-2">5</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all">
            <svg className="w-8 h-8 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <p className="text-sm text-gray-600">Add Task</p>
          </button>
          <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-all">
            <svg className="w-8 h-8 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-sm text-gray-600">Create Report</p>
          </button>
          <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-all">
            <svg className="w-8 h-8 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-sm text-gray-600">Schedule Event</p>
          </button>
          <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition-all">
            <svg className="w-8 h-8 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <p className="text-sm text-gray-600">Send Message</p>
          </button>
        </div>
      </div>
    </div>
  );
};

// Coming Soon Component
const ComingSoonContent: React.FC<{ pageName: string }> = ({ pageName }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
      <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h3 className="text-2xl font-bold text-gray-900 mb-3">{pageName}</h3>
      <p className="text-gray-600 mb-6">This page is under development and will be available soon.</p>
      <p className="text-sm text-gray-500">Check back later for updates!</p>
    </div>
  );
};

export default NewStaffPortal;
