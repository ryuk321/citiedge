/**
 * Universal Portal Layout Component
 * 
 * A flexible, reusable layout for all portal types (Admin, Staff, Agent, Student)
 * Features:
 * - Left sidebar navigation with JSON-configurable menu items
 * - Top header with user info and actions
 * - Responsive design
 * - Permission-based menu item visibility
 */

import { useState } from 'react';
import { useRouter } from 'next/router';

export interface MenuItem {
 id: string;
  label: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  onClick?: () => void;
  href?: string;
  badge?: number;
  requiredPermission?: string;
  subItems?: MenuItem[];

}

export interface MenuSection {
  title: string;
  items: MenuItem[];
}

export interface PortalUser {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  permissions?: string[];
}

interface UniversalPortalLayoutProps {
  user: PortalUser;
  menuConfig: MenuSection[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  onLogout: () => void;
  portalTitle: string;
  portalColor?: string;
  children: React.ReactNode;
}

export default function UniversalPortalLayout({
  user,
  menuConfig,
  activeTab,
  onTabChange,
  onLogout,
  portalTitle,
  portalColor = '#003366',
  children
}: UniversalPortalLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const toggleMenu = (menuId: string) => {
    setExpandedMenus(prev =>
      prev.includes(menuId) ? prev.filter(id => id !== menuId) : [...prev, menuId]
    );
  };

  const handleMenuItemClick = (item: MenuItem, parentId?: string) => {
    if (item.onClick) {
      item.onClick();
    } else if (item.href) {
      router.push(item.href);
    }
    onTabChange(item.id);
    
    // Ensure parent menu is expanded when clicking a sub-item
    if (parentId && !expandedMenus.includes(parentId)) {
      setExpandedMenus(prev => [...prev, parentId]);
    }
  };

  const hasPermission = (requiredPermission?: string) => {
    if (!requiredPermission) return true;
    return user.permissions?.includes(requiredPermission) || false;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar - Stripe-style */}
      <aside className={`${sidebarCollapsed ? 'w-20' : 'w-72'} bg-gray-900 text-gray-300 flex flex-col h-screen sticky top-0 border-r border-gray-800 transition-all duration-300`}>
        {/* Toggle Button */}
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="absolute top-6 -right-3 bg-white text-gray-900 rounded-full p-1.5 shadow-lg hover:shadow-xl transition-all z-10"
          title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
            {sidebarCollapsed ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            )}
          </svg>
        </button>

        {/* Header */}
        <div className={`${sidebarCollapsed ? 'p-3' : 'p-6'} border-b border-gray-800`}>
          <div className={`flex items-center justify-between ${sidebarCollapsed ? 'mb-2' : 'mb-4'}`}>
            <div className={`flex items-center ${sidebarCollapsed ? 'justify-center w-full' : 'gap-2'}`}>
              <div className={`inline-flex items-center justify-center w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full overflow-hidden ${sidebarCollapsed ? 'mb-0' : 'mb-4'} shadow-lg`}>
                <img
                  src="/citiedge-logo.png"
                  alt="CITIEDGE Logo"
                  className="w-full h-full object-cover"
                />
              </div>
              {!sidebarCollapsed && (
                <div>
                  <h1 className="text-white font-bold text-lg">{portalTitle}</h1>
                  <p className="text-xs text-gray-500">{user.role}</p>
                </div>
              )}
            </div>
          </div>
          
          {/* Search */}
          {!sidebarCollapsed && (
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Find anything"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          )}
        </div>

        {/* Navigation Menu */}
        <nav className={`flex-1 overflow-y-auto ${sidebarCollapsed ? 'p-2' : 'p-4'} space-y-1`}>
          {menuConfig.map((section) => (
            <div key={section.title}>
              {section.items
                .filter(item => hasPermission(item.requiredPermission))
                .map((item) => (
                  <div key={item.id}>
                    <button
                      onClick={() => {
                        if (item.subItems) {
                          toggleMenu(item.id);
                        }
                        handleMenuItemClick(item);
                      }}
                      className={`w-full flex items-center ${sidebarCollapsed ? 'justify-center px-2' : 'justify-between px-3'} py-2 rounded-md text-sm transition-colors ${
                        activeTab === item.id && !item.subItems
                          ? 'bg-gray-800 text-white'
                          : 'text-gray-400 hover:text-white hover:bg-gray-800'
                      }`}
                      title={sidebarCollapsed ? item.label : ''}
                    >
                      <div className={`flex items-center ${sidebarCollapsed ? '' : 'gap-3'}`}>
                        <item.icon className="w-5 h-5" />
                        {!sidebarCollapsed && <span className="font-medium">{item.label}</span>}
                      </div>
                      {item.subItems && !sidebarCollapsed && (
                        <svg
                          className={`w-4 h-4 transition-transform ${
                            expandedMenus.includes(item.id) ? 'rotate-90' : ''
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                      )}
                      {item.badge !== undefined && item.badge > 0 && !sidebarCollapsed && (
                        <span className="ml-auto bg-red-500 text-white text-xs font-bold rounded-full px-2 py-0.5">
                          {item.badge}
                        </span>
                      )}
                    </button>
                    
                    {/* Sub-menu items */}
                    {item.subItems && expandedMenus.includes(item.id) && !sidebarCollapsed && (
                      <div className="ml-4 mt-1 space-y-1 border-l border-gray-800 pl-3">
                        {item.subItems
                          .filter(subItem => hasPermission(subItem.requiredPermission))
                          .map((subItem) => (
                            <button
                              key={subItem.id}
                              onClick={() => handleMenuItemClick(subItem, item.id)}
                              className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                                activeTab === subItem.id
                                  ? 'bg-gray-800 text-blue-400 font-medium'
                                  : 'text-gray-500 hover:text-gray-300 hover:bg-gray-800/50'
                              }`}
                            >
                              {subItem.label}
                            </button>
                          ))}
                      </div>
                    )}
                  </div>
                ))}
            </div>
          ))}
        </nav>

        {/* User Profile & Logout */}
        <div className={`${sidebarCollapsed ? 'p-2' : 'p-4'} border-t border-gray-800`}>
          <div className={`flex items-center ${sidebarCollapsed ? 'justify-center mb-2 px-0' : 'gap-3 mb-3 px-3'}`}>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm">
              {user.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover" />
              ) : (
                user.name.charAt(0).toUpperCase()
              )}
            </div>
            {!sidebarCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{user.name}</p>
                <p className="text-xs text-gray-500 capitalize truncate">{user.role.replace('_', ' ')}</p>
              </div>
            )}
          </div>
          <button
            onClick={onLogout}
            className={`w-full flex items-center ${sidebarCollapsed ? 'justify-center px-2' : 'gap-3 px-3'} py-2 rounded-md text-sm text-gray-400 hover:text-white hover:bg-gray-800 transition-colors`}
            title={sidebarCollapsed ? 'Logout' : ''}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            {!sidebarCollapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Header Bar */}
        <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between sticky top-0 z-10">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {menuConfig
                .flatMap(section => section.items)
                .find(item => item.id === activeTab)?.label || 'Dashboard'}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Welcome back, {user.name}
            </p>
          </div>
          <div className="flex items-center gap-4">
            {/* Quick Actions */}
            <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors relative">
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto bg-gray-50">
          <div className="max-w-7xl mx-auto p-8">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
