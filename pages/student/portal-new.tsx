"use client";

import { useEffect, useState } from 'react';
import { useProtectedRoute, getAuthUser, logout } from '../../lib/auth';
import { useRouter } from 'next/router';
import Link from 'next/link';

// Import components
import Dashboard from './components/Dashboard';
import Finance from './components/Finance';
import Classes from './components/Classes';
import Profile from './components/Profile';

interface TabConfig {
  id: string;
  label: string;
  icon: React.ReactNode;
  description: string;
}

export default function StudentPortal() {
  useProtectedRoute(['student']);
  
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Student data from auth
  const [studentData, setStudentData] = useState({
    id: 1,
    name: 'John Doe',
    email: 'john.doe@student.citiedge.uk'
  });

  useEffect(() => {
    // Get authenticated user
    const user = getAuthUser();
    if (user) {
      setCurrentUser(user);
      fetchStudentData(user.email);
    }
    setLoading(false);
  }, []);

  const fetchStudentData = async (email: string | null) => {
    // TODO: Implement API call to fetch student data from database
    // For now using auth user data
    const user = getAuthUser();
    // alert(JSON.stringify(user))
    if (user && user.details) {
      setStudentData({
        id: parseInt(user.details.student_number),
        name: user.details.name || user.username || 'Student',
        email: user.email
      });
    }
  };

  const tabConfigs: TabConfig[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
      description: 'Overview of your academic progress'
    },
    {
      id: 'finance',
      label: 'Finance',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      description: 'Manage tuition fees and payments'
    },
    {
      id: 'classes',
      label: 'Classes',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
      description: 'View your enrolled courses'
    },
    {
      id: 'grades',
      label: 'Grades',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
      ),
      description: 'Check your academic performance'
    },
    {
      id: 'attendance',
      label: 'Attendance',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      description: 'View your attendance records'
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      description: 'Manage your personal information'
    }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard studentId={studentData.id} studentName={studentData.name} studentEmail={studentData.email} />;
      case 'finance':
        return <Finance studentId={studentData.id} studentName={studentData.name} studentEmail={studentData.email} />;
      case 'classes':
        return <Classes studentId={studentData.id} />;
      case 'profile':
        return <Profile studentId={studentData.id} studentName={studentData.name} studentEmail={studentData.email} />;
      default:
        return (
          <div className="p-6 text-center">
            <p className="text-slate-500">This section is coming soon...</p>
          </div>
        );
    }
  };

  const currentTabConfig = tabConfigs.find(t => t.id === activeTab);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F8FA] font-[system-ui,-apple-system,BlinkMacSystemFont,'Segoe_UI',Roboto,sans-serif] overflow-x-hidden">
      
      {/* Mobile Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-slate-200 lg:hidden">
        <div className="flex items-center justify-between px-4 h-14">
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 -ml-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          
          <h1 className="text-[15px] font-medium text-slate-900 truncate max-w-[200px]">
            Student Portal
          </h1>
          
          <div className="flex items-center gap-1">
            <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
              <svg className="w-5 h-5 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Slide-out Menu */}
      {isMobileMenuOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black/20 z-40 lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="fixed left-0 top-0 bottom-0 w-[280px] bg-white z-50 shadow-2xl lg:hidden overflow-y-auto">
            <div className="p-4 border-b border-slate-200">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-semibold text-slate-900">Menu</h2>
                <button 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 -mr-2 hover:bg-slate-100 rounded-lg"
                >
                  <svg className="w-5 h-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-sm font-medium text-slate-700">
                  {currentUser?.username?.[0]?.toUpperCase() || currentUser?.email?.[0]?.toUpperCase() || "S"}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-slate-900 truncate">
                    {currentUser?.username || studentData.name}
                  </div>
                  <div className="text-xs text-slate-500 truncate">
                    {currentUser?.email}
                  </div>
                </div>
              </div>
            </div>
            
            <nav className="p-2">
              {tabConfigs.map((tabConfig) => (
                <button
                  key={tabConfig.id}
                  onClick={() => {
                    setActiveTab(tabConfig.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors mb-1 ${
                    activeTab === tabConfig.id
                      ? "bg-slate-100 text-slate-900"
                      : "text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <span className={activeTab === tabConfig.id ? "text-slate-900" : "text-slate-500"}>
                    {tabConfig.icon}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className={`text-[13px] font-medium ${activeTab === tabConfig.id ? "text-slate-900" : "text-slate-700"}`}>
                      {tabConfig.label}
                    </div>
                  </div>
                </button>
              ))}
            </nav>
            
            {/* Logout Button */}
            <div className="p-3 border-t border-slate-200 mt-2">
              <button 
                onClick={() => {
                  logout();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors text-red-600 hover:bg-red-50"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span className="text-[13px] font-medium">Logout</span>
              </button>
            </div>
          </div>
        </>
      )}

      {/* Desktop Layout with Left Sidebar */}
      <div className="hidden lg:flex min-h-screen">
        
        {/* Desktop Left Sidebar */}
        <aside className="w-[240px] bg-white border-r border-slate-200 fixed left-0 top-0 bottom-0 flex flex-col">
          
          {/* Logo/Brand */}
          <div className="h-16 flex items-center justify-between px-6 border-b border-slate-200 flex-shrink-0">
            <h1 className="text-[15px] font-semibold text-slate-900">Student Portal</h1>
            <Link href="/">
              <svg
                className="w-4 h-4 text-slate-500 hover:text-slate-700 cursor-pointer"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 9.75L12 3l9 6.75V20a1 1 0 01-1 1h-5a1 1 0 01-1-1v-5H10v5a1 1 0 01-1 1H4a1 1 0 01-1-1V9.75z"
                />
              </svg>
            </Link>
          </div>

          {/* User Profile Section */}
          <div className="p-4 border-b border-slate-200 flex-shrink-0">
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer">
              <div className="w-9 h-9 rounded-full bg-slate-200 flex items-center justify-center text-sm font-medium text-slate-700">
                {currentUser?.username?.[0]?.toUpperCase() || currentUser?.email?.[0]?.toUpperCase() || "S"}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[13px] font-medium text-slate-900 truncate">
                  {currentUser?.username || studentData.name}
                </div>
                <div className="text-xs text-slate-500 truncate">
                  {currentUser?.email}
                </div>
              </div>
            </div>
          </div>
          
          {/* Navigation - Scrollable */}
          <nav className="p-3 flex-1 overflow-y-auto">
            <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider px-3 py-2 mb-1">
              Main Menu
            </div>
            {tabConfigs.map((tabConfig) => (
              <button
                key={tabConfig.id}
                onClick={() => setActiveTab(tabConfig.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all mb-1 ${
                  activeTab === tabConfig.id
                    ? "bg-slate-900 text-white shadow-sm"
                    : "text-slate-700 hover:bg-slate-100"
                }`}
              >
                <span className={activeTab === tabConfig.id ? "text-white" : "text-slate-500"}>
                  {tabConfig.icon}
                </span>
                <div className="flex-1 min-w-0">
                  <div className={`text-[13px] font-medium ${activeTab === tabConfig.id ? "text-white" : "text-slate-700"}`}>
                    {tabConfig.label}
                  </div>
                </div>
              </button>
            ))}
          </nav>

          {/* Logout at Bottom */}
          <div className="p-3 border-t border-slate-200 bg-white space-y-1 flex-shrink-0">
            <button 
              onClick={() => {
                logout();
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors text-red-600 hover:bg-red-50"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span className="text-[13px] font-medium">Logout</span>
            </button>
          </div>
        </aside>

        {/* Desktop Main Content */}
        <main className="flex-1 ml-[240px] min-w-0 overflow-x-hidden">
          {/* Top Bar */}
          <header className="sticky top-0 z-40 bg-white border-b border-slate-200 h-16 flex items-center justify-between px-6">
            <div>
              <h2 className="text-base font-semibold text-slate-900">
                {currentTabConfig?.label || activeTab}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                {currentTabConfig?.description}
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                <svg className="w-5 h-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </button>
            </div>
          </header>

          {/* Content Area */}
          <div className="overflow-x-hidden">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden max-w-full m-6">
              {renderTabContent()}
            </div>
          </div>
        </main>
      </div>

      {/* Mobile Main Content */}
      <main className="lg:hidden px-4 py-4 overflow-x-hidden">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden max-w-full">
          {renderTabContent()}
        </div>
      </main>
    </div>
  );
}
