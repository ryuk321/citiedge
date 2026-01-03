import React, { useState, useEffect } from 'react';
import { useProtectedRoute, logout, getAuthUser } from '../../lib/auth';
import '../../app/globals.css';

// Import section components (will create these next)
import StudentsPage from './students/StudentsPage';
import StaffPage from './staff/StaffPage';
import LibraryPage from './library/LibraryPage';
import TuitionPage from './tuition/TuitionPage';
import AttendancePage from './attendance/AttendancePage';
import UsersPage from './users/UsersPage';
import DashboardPage from './components/Dashboard';
import AcademicCalendarPage from './calendar/AcademicCalendarPage';
import StudentFinancePage from './finance/StudentFinancePage';
import AccountsPage from './finance/AccountsPage';
import AddStudent from './students/NewAddStudent';

interface SubMenuItem {
    id: string;
    name: string;
}

interface MenuItem {
    id: string;
    name: string;
    icon: React.ReactElement;
    subItems?: SubMenuItem[];
}

const AdminPage: React.FC = () => {
    // Protect this page - only admin and super_admin can access
    useProtectedRoute(['super_admin', 'admin', ]);
    
    const [currentUser, setCurrentUser] = useState<ReturnType<typeof getAuthUser>>(null);
    const [activeMenu, setActiveMenu] = useState('dashboard');
    const [activeSubMenu, setActiveSubMenu] = useState('');
    const [expandedMenus, setExpandedMenus] = useState<string[]>(['dashboard']);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        setCurrentUser(getAuthUser());
    }, []);

    // Menu items configuration with sub-items
    const menuItems: MenuItem[] = [
        {
            id: 'dashboard',
            name: 'Dashboard',
            icon: (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
            ),
            subItems: [
                { id: 'overview', name: 'Overview' },
                // { id: 'analytics', name: 'Analytics' },
                // { id: 'reports', name: 'Reports' },
            ],
        },
        {
            id: 'students',
            name: 'Students',
            icon: (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
            ),
            subItems: [
                { id: 'all-students', name: 'All Students' },
                // { id: 'add-student', name: 'Add Student' },
                // { id: 'student-records', name: 'Student Records' },
                // { id: 'enrollment', name: 'Enrollment' },
            ],
        },
        {
            id: 'staff',
            name: 'Staff',
            icon: (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
            ),
            subItems: [
                { id: 'all-staff', name: 'All Staff' },
                // { id: 'add-staff', name: 'Add Staff' },
                // { id: 'staff-schedule', name: 'Schedule' },
                // { id: 'departments', name: 'Departments' },
            ],
        },
        {
            id: 'library',
            name: 'E-Learning Library',
            icon: (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
            ),
            subItems: [
                { id: 'all-resources', name: 'All Resources' },
                // { id: 'add-resource', name: 'Add Resource' },
                // { id: 'categories', name: 'Categories' },
                // { id: 'borrowed-items', name: 'Borrowed Items' },
            ],
        },
        {
            id: 'tuition',
            name: 'Tuition',
            icon: (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            subItems: [
                { id: 'fee-structure', name: 'Fee Structure' },
                { id: 'payments', name: 'Payments' },
                { id: 'invoices', name: 'Invoices' },
                { id: 'scholarships', name: 'Scholarships' },
            ],
        },
        {
            id: 'attendance',
            name: 'Attendance',
            icon: (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
            ),
            subItems: [
                { id: 'mark-attendance', name: 'Mark Attendance' },
                { id: 'attendance-reports', name: 'Reports' },
                { id: 'attendance-settings', name: 'Settings' },
            ],
        },
        {
            id: 'calendar',
            name: 'Academic Calendar',
            icon: (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
            ),
            subItems: [
                { id: 'view-calendar', name: 'View Calendar' },
                { id: 'add-event', name: 'Add Event' },
                { id: 'exam-schedule', name: 'Exam Schedule' },
                { id: 'holidays', name: 'Holidays' },
            ],
        },
        {
            id: 'finance',
            name: 'Student Finance',
            icon: (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            subItems: [
                { id: 'accounts', name: 'Accounts' },
                { id: 'transactions', name: 'Transactions' },
                { id: 'payment-history', name: 'Payment History' },
                { id: 'financial-aid', name: 'Financial Aid' },
                { id: 'billing', name: 'Billing' },
            ],
        },
        {
            id: 'users',
            name: 'Users',
            icon: (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
            ),
            subItems: [
                { id: 'all-users', name: 'All Users' },
                { id: 'add-user', name: 'Add User' },
                { id: 'roles', name: 'Roles & Permissions' },
                { id: 'activity-log', name: 'Activity Log' },
            ],
        },
    ];

    const toggleMenu = (menuId: string) => {
        setExpandedMenus(prev =>
            prev.includes(menuId) ? prev.filter(id => id !== menuId) : [...prev, menuId]
        );
    };

    const handleMenuClick = (menuId: string, subMenuId?: string) => {
        setActiveMenu(menuId);
        if (subMenuId) {
            setActiveSubMenu(subMenuId);
            // Special handling for add-student - trigger modal
            // if (subMenuId === 'add-student') {
            //     setTimeout(() => showAddStudentModal(), 100);
            // }
        } else {
            setActiveSubMenu('');
        }
        // Ensure the menu is expanded when clicking
        if (!expandedMenus.includes(menuId)) {
            setExpandedMenus(prev => [...prev, menuId]);
        }
    };

    // Render active page content
    const renderContent = () => {
        const pageKey = activeSubMenu || activeMenu;

        switch (pageKey) {
            // Dashboard menu
            case 'dashboard':
            case 'overview':
                return <DashboardPage />;
            case 'analytics':
                return <div className="p-6 bg-white rounded-lg shadow"><h3 className="text-xl font-bold">Analytics</h3><p className="text-gray-600 mt-2">Analytics dashboard coming soon...</p></div>;
            case 'reports':
                return <div className="p-6 bg-white rounded-lg shadow"><h3 className="text-xl font-bold">Reports</h3><p className="text-gray-600 mt-2">Reports section coming soon...</p></div>;
            
            // Students menu
            case 'students':
            case 'all-students':
                return <StudentsPage />;
            case 'add-student':
                return <AddStudent />;
            case 'student-records':
                return <div className="p-6 bg-white rounded-lg shadow"><h3 className="text-xl font-bold">Student Records</h3><p className="text-gray-600 mt-2">Student records management coming soon...</p></div>;
            case 'enrollment':
                return <div className="p-6 bg-white rounded-lg shadow"><h3 className="text-xl font-bold">Enrollment</h3><p className="text-gray-600 mt-2">Enrollment management coming soon...</p></div>;
            
            // Staff menu
            case 'staff':
            case 'all-staff':
                return <StaffPage />;
            case 'add-staff':
                return <StaffPage />;
            case 'staff-schedule':
                return <div className="p-6 bg-white rounded-lg shadow"><h3 className="text-xl font-bold">Staff Schedule</h3><p className="text-gray-600 mt-2">Staff scheduling coming soon...</p></div>;
            case 'departments':
                return <div className="p-6 bg-white rounded-lg shadow"><h3 className="text-xl font-bold">Departments</h3><p className="text-gray-600 mt-2">Department management coming soon...</p></div>;
            
            // Library menu
            case 'library':
            case 'all-resources':
                return <div className="p-6 bg-white rounded-lg shadow"><h3 className="text-xl font-bold">Categories</h3><p className="text-gray-600 mt-2">Resource categories management coming soon...</p></div>;;
            case 'add-resource':
                return <div className="p-6 bg-white rounded-lg shadow"><h3 className="text-xl font-bold">Categories</h3><p className="text-gray-600 mt-2">Resource categories management coming soon...</p></div>;;
            case 'categories':
                return <div className="p-6 bg-white rounded-lg shadow"><h3 className="text-xl font-bold">Categories</h3><p className="text-gray-600 mt-2">Resource categories management coming soon...</p></div>;
            case 'borrowed-items':
                return <div className="p-6 bg-white rounded-lg shadow"><h3 className="text-xl font-bold">Borrowed Items</h3><p className="text-gray-600 mt-2">Borrowed items tracking coming soon...</p></div>;
            
            // Tuition menu
            case 'tuition':
            case 'fee-structure':
                return <TuitionPage />;
            case 'payments':
                return <TuitionPage />;
            case 'invoices':
                return <div className="p-6 bg-white rounded-lg shadow"><h3 className="text-xl font-bold">Invoices</h3><p className="text-gray-600 mt-2">Invoice management coming soon...</p></div>;
            case 'scholarships':
                return <div className="p-6 bg-white rounded-lg shadow"><h3 className="text-xl font-bold">Scholarships</h3><p className="text-gray-600 mt-2">Scholarship management coming soon...</p></div>;
            
            // Attendance menu
            case 'attendance':
            case 'mark-attendance':
                return <div className="p-6 bg-white rounded-lg shadow"><h3 className="text-xl font-bold">Attendance Page</h3><p className="text-gray-600 mt-2">Attendance reports coming soon...</p></div>;
            case 'attendance-reports':
                return <div className="p-6 bg-white rounded-lg shadow"><h3 className="text-xl font-bold">Attendance Reports</h3><p className="text-gray-600 mt-2">Attendance reports coming soon...</p></div>;
            case 'attendance-settings':
                return <div className="p-6 bg-white rounded-lg shadow"><h3 className="text-xl font-bold">Attendance Settings</h3><p className="text-gray-600 mt-2">Attendance settings coming soon...</p></div>;
            
            // Calendar menu
            case 'calendar':
            case 'view-calendar':
                return <AcademicCalendarPage />;
            case 'add-event':
                return <AcademicCalendarPage />;
            case 'exam-schedule':
                return <div className="p-6 bg-white rounded-lg shadow"><h3 className="text-xl font-bold">Exam Schedule</h3><p className="text-gray-600 mt-2">Exam scheduling coming soon...</p></div>;
            case 'holidays':
                return <div className="p-6 bg-white rounded-lg shadow"><h3 className="text-xl font-bold">Holidays</h3><p className="text-gray-600 mt-2">Holiday management coming soon...</p></div>;
            
            // Finance menu
            case 'finance':
            case 'accounts':
                return <AccountsPage />;
            case 'transactions':
                return <StudentFinancePage />;
            case 'payment-history':
                return <StudentFinancePage />;
            case 'financial-aid':
                return <div className="p-6 bg-white rounded-lg shadow"><h3 className="text-xl font-bold">Financial Aid</h3><p className="text-gray-600 mt-2">Financial aid management coming soon...</p></div>;
            case 'billing':
                return <div className="p-6 bg-white rounded-lg shadow"><h3 className="text-xl font-bold">Billing</h3><p className="text-gray-600 mt-2">Billing management coming soon...</p></div>;
            
            // Users menu
            case 'users':
            case 'all-users':
                return <UsersPage />;
            case 'add-user':
                return <UsersPage />;
            case 'roles':
                return <div className="p-6 bg-white rounded-lg shadow"><h3 className="text-xl font-bold">Roles & Permissions</h3><p className="text-gray-600 mt-2">Role management coming soon...</p></div>;
            case 'activity-log':
                return <div className="p-6 bg-white rounded-lg shadow"><h3 className="text-xl font-bold">Activity Log</h3><p className="text-gray-600 mt-2">Activity logging coming soon...</p></div>;
            
            default:
                return <DashboardPage />;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar - Stripe-style */}
            <aside className="w-72 bg-gray-900 text-gray-300 flex flex-col h-screen sticky top-0 border-r border-gray-800">
                {/* Header */}
                <div className="p-6 border-b border-gray-800">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-sm">C</span>
                            </div>
                            <div>
                                <h1 className="text-white font-bold text-lg">CITIEDGE</h1>
                                <p className="text-xs text-gray-500">Admin Portal</p>
                            </div>
                        </div>
                    </div>
                    
                    {/* Search */}
                    <div className="relative">
                        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input
                            type="text"
                            placeholder="Find anything"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                </div>

                {/* Navigation Menu */}
                <nav className="flex-1 overflow-y-auto p-4 space-y-1">
                    {menuItems.map((item) => (
                        <div key={item.id}>
                            <button
                                onClick={() => {
                                    toggleMenu(item.id);
                                    handleMenuClick(item.id);
                                }}
                                className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-sm transition-colors ${
                                    activeMenu === item.id && !activeSubMenu
                                        ? 'bg-gray-800 text-white'
                                        : 'text-gray-400 hover:text-white hover:bg-gray-800'
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    {item.icon}
                                    <span className="font-medium">{item.name}</span>
                                </div>
                                {item.subItems && (
                                    <svg
                                        className={`w-4 h-4 transition-transform ${
                                            expandedMenus.includes(item.id) ? 'rotate-90' : ''
                                        }`}
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                )}
                            </button>
                            
                            {/* Sub-menu items */}
                            {item.subItems && expandedMenus.includes(item.id) && (
                                <div className="ml-4 mt-1 space-y-1 border-l border-gray-800 pl-3">
                                    {item.subItems.map((subItem) => (
                                        <button
                                            key={subItem.id}
                                            onClick={() => handleMenuClick(item.id, subItem.id)}
                                            className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                                                activeSubMenu === subItem.id
                                                    ? 'bg-gray-800 text-blue-400 font-medium'
                                                    : 'text-gray-500 hover:text-gray-300 hover:bg-gray-800/50'
                                            }`}
                                        >
                                            {subItem.name}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </nav>

                {/* User Profile & Logout */}
                <div className="p-4 border-t border-gray-800">
                    <div className="flex items-center gap-3 mb-3 px-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm">
                            {currentUser?.username?.[0]?.toUpperCase() || currentUser?.email?.[0]?.toUpperCase() || 'U'}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-white truncate">
                                {currentUser?.username || currentUser?.email}
                            </p>
                            <p className="text-xs text-gray-500 capitalize truncate">
                                {currentUser?.role?.replace('_', ' ')}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={logout}
                        className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col h-screen overflow-hidden">
                {/* Add Student Modal - Always rendered, manages its own visibility */}
                {/* <AddStudent /> */}
                
                {/* Top Header Bar */}
                <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between sticky top-0 z-10">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">
                            {activeSubMenu 
                                ? menuItems.find(m => m.id === activeMenu)?.subItems?.find(s => s.id === activeSubMenu)?.name
                                : menuItems.find(m => m.id === activeMenu)?.name
                            }
                        </h2>
                        <p className="text-sm text-gray-500 mt-1">
                            {activeSubMenu ? `${menuItems.find(m => m.id === activeMenu)?.name} / ${menuItems.find(m => m.id === activeMenu)?.subItems?.find(s => s.id === activeSubMenu)?.name}` : `Manage ${activeMenu}`}
                        </p>
                    </div>
                    <div className="flex items-center gap-4">
                        {/* Quick Actions */}
                        <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors relative">
                            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                            </svg>
                            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                        </button>
                        <button className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
                            Quick Action
                        </button>
                    </div>
                </header>

                {/* Page Content */}
                <div className="flex-1 overflow-y-auto bg-gray-50">
                    <div className="max-w-7xl mx-auto p-8">
                        {renderContent()}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminPage;
