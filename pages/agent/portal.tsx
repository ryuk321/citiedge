"use client";

/**
 * Agent Portal - Main Entry Point
 * 
 * Features:
 * - Dashboard with statistics
 * - Application management
 * - Student tracking
 * - Reports and analytics
 * - Profile management
 */
import { logout, getAuthUser } from '../../lib/auth';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import UniversalPortalLayout, { PortalUser } from '@/components/layouts/UniversalPortalLayout';
import { agentMenuConfig } from '@/config/agentMenuConfig';
import ApplicationUploadForm from '@/components/agent/ApplicationUploadForm';
import {
  fetchAgentProfile,
  fetchAgentApplications,
  fetchAgentNotifications,
  Agent,
  AgentApplication,
  AgentNotification
} from '@/lib/agentData';

export default function AgentPortal() {
  const [currentUser, setCurrentUser] = useState<ReturnType<typeof getAuthUser>>(null);

  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [agent, setAgent] = useState<Agent | null>(null);
  const [applications, setApplications] = useState<AgentApplication[]>([]);
  const [notifications, setNotifications] = useState<AgentNotification[]>([]);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    // Check authentication
    const user = getAuthUser();
    
    if (!user) {
      // No user logged in, redirect to login
      console.log('No user logged in, redirecting to login');
      router.push('/Login/login');
      return;
    }
    
    if (user.role !== 'agent') {
      // User is not an agent, redirect to appropriate portal or login
      console.log('User is not an agent, redirecting');
      if (user.role === 'student') {
        router.push('/student/portal');
      } else if (user.role === 'staff') {
        router.push('/staff/portal');
      } else {
        router.push('/Login/login');
      }
      return;
    }
    
    // User is authenticated as agent
    setCurrentUser(user);
    loadAgentData(user);
  }, [router]);

  const loadAgentData = async (user: NonNullable<ReturnType<typeof getAuthUser>>) => {
    try {
      setLoading(true);
      
      // Get agent ID from authenticated user's reference_id
      const agentId = user.reference_id;
      
      if (!agentId) {
        // console.error('No agent reference_id found for user');
        router.push('/Login/login');
        return;
      }

      console.log('Loading data for agent:', agentId);

      const [profileData, applicationsData, notificationsData] = await Promise.all([
        fetchAgentProfile(agentId),
        fetchAgentApplications(agentId),
        fetchAgentNotifications(agentId)
      ]);

      setAgent(profileData);
      setApplications(applicationsData);
      setNotifications(notificationsData);
    } catch (error) {
      // console.error('Error loading agent data:', error);
      // If there's an error loading data, might be auth issue
      alert('Failed to load agent data. Please try logging in again.');
      logout();
      router.push('/Login/login');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/Login/login');
  };

  if (loading || !agent) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading Agent Portal...</p>
        <style jsx>{`
          .loading-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100vh;
            background: #f5f7fa;
          }
          .spinner {
            width: 50px;
            height: 50px;
            border: 4px solid #e2e8f0;
            border-top: 4px solid #003366;
            border-radius: 50%;
            animation: spin 1s linear infinite;
          }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  const portalUser: PortalUser = {
    id: agent.agent_id || String(agent.id),
    name: `${agent.contact_person_first_name || ''} ${agent.contact_person_last_name || ''}`.trim() || agent.company_name || 'Agent',
    email: agent.email,
    role: 'Agent',
    permissions: []
  };

  // Update menu config with dynamic badges
  const menuConfigWithBadges = agentMenuConfig.map(section => ({
    ...section,
    items: section.items.map(item => {
      if (item.id === 'notifications') {
        return { ...item, badge: notifications.filter(n => !n.read).length };
      }
      if (item.id === 'pending-applications') {
        return { ...item, badge: applications.filter(a => a.status === 'submitted').length };
      }
      return item;
    })
  }));

  return (
    <UniversalPortalLayout
      user={portalUser}
      menuConfig={menuConfigWithBadges}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      onLogout={handleLogout}
      portalTitle="Agent Portal"
      portalColor="#0052a3"
    >
      {activeTab === 'overview' && <OverviewTab agent={agent} applications={applications} />}
      {activeTab === 'notifications' && <NotificationsTab notifications={notifications} onNotificationsUpdate={async () => {
        if (currentUser && currentUser.reference_id) {
          const updatedNotifications = await fetchAgentNotifications(currentUser.reference_id);
          setNotifications(updatedNotifications);
        }
      }} />}
      {activeTab === 'new-application' && <NewApplicationTab agent={agent} onSuccess={() => currentUser && loadAgentData(currentUser)} />}
      {activeTab === 'my-applications' && <ApplicationsTab applications={applications} status="all" />}
      {activeTab === 'pending-applications' && <ApplicationsTab applications={applications} status="pending" />}
      {activeTab === 'approved-applications' && <ApplicationsTab applications={applications} status="approved" />}
      {activeTab === 'rejected-applications' && <ApplicationsTab applications={applications} status="rejected" />}
      {activeTab === 'my-students' && <StudentsTab applications={applications.filter(a => a.status === 'approved')} />}
      {activeTab === 'student-documents' && <DocumentsTab applications={applications} />}
      {activeTab === 'application-report' && <ApplicationReportTab applications={applications} />}
      {activeTab === 'commission-report' && <CommissionReportTab agent={agent} applications={applications} />}
      {activeTab === 'profile' && <ProfileTab agent={agent} />}
      {activeTab === 'settings' && <SettingsTab />}
      {activeTab === 'support' && <SupportTab />}
    </UniversalPortalLayout>
  );
}

// ========================================
// TAB COMPONENTS
// ========================================

function OverviewTab({ agent, applications }: { agent: Agent; applications: AgentApplication[] }) {
  const pendingCount = applications.filter(a => a.status === 'submitted').length;
  const approvedCount = applications.filter(a => a.status === 'approved').length;
  const rejectedCount = applications.filter(a => a.status === 'rejected').length;
  const draftCount = applications.filter(a => a.status === 'draft').length;

  // Get agent name from database fields
  const agentName = `${agent.contact_person_first_name || ''} ${agent.contact_person_last_name || ''}`.trim() || agent.company_name;
  
  // Calculate total commission from applications
  const totalCommission = applications
    .filter(a => a.status === 'approved' || a.status === 'enrolled')
    .reduce((sum, app) => sum + (parseFloat(app.commission_amount as any) || 0), 0);

  return (
    <div className="overview-tab">
      <h2>Welcome back, {agentName}! 👋</h2>
      <p className="subtitle">Here's your agent dashboard overview</p>

      <div className="stats-grid">
        <div className="stat-card primary">
          <div className="stat-icon">📝</div>
          <div className="stat-content">
            <div className="stat-value">{agent.total_applications || applications.length}</div>
            <div className="stat-label">Total Applications</div>
          </div>
        </div>

        <div className="stat-card success">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <div className="stat-value">{agent.successful_enrollments || approvedCount}</div>
            <div className="stat-label">Successful Enrollments</div>
          </div>
        </div>

        <div className="stat-card warning">
          <div className="stat-icon">⏳</div>
          <div className="stat-content">
            <div className="stat-value">{agent.pending_applications || pendingCount}</div>
            <div className="stat-label">Pending Review</div>
          </div>
        </div>

        <div className="stat-card info">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <div className="stat-value">£{totalCommission.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</div>
            <div className="stat-label">Total Commission</div>
          </div>
        </div>
      </div>

      <div className="content-grid">
        <div className="card">
          <h3>📊 Application Status Breakdown</h3>
          <div className="status-list">
            <div className="status-item">
              <span className="status-label">Pending Review</span>
              <span className="status-count">{agent.pending_applications || pendingCount}</span>
            </div>
            <div className="status-item">
              <span className="status-label">Successful Enrollments</span>
              <span className="status-count success">{agent.successful_enrollments || approvedCount}</span>
            </div>
            <div className="status-item">
              <span className="status-label">Rejected</span>
              <span className="status-count danger">{agent.rejected_applications || rejectedCount}</span>
            </div>
            <div className="status-item">
              <span className="status-label">Conversion Rate</span>
              <span className="status-count">{agent.conversion_rate || 0}%</span>
            </div>
          </div>
        </div>

        <div className="card">
          <h3>🏢 Agent Information</h3>
          <div className="info-list">
            <div className="info-item">
              <span className="info-label">Company:</span>
              <span className="info-value">{agent.company_name || 'N/A'}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Country:</span>
              <span className="info-value">{agent.country || 'N/A'}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Commission Rate:</span>
              <span className="info-value">{agent.commission_rate || 0}%</span>
            </div>
            <div className="info-item">
              <span className="info-label">Status:</span>
              <span className={`status-badge ${agent.status}`}>{agent.status || 'N/A'}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <h3>📋 Recent Applications</h3>
        <div className="applications-table">
          {applications.slice(0, 5).map(app => (
            <div key={app.id} className="application-row">
              <div className="app-info">
                <div className="app-name">{app.firstName} {app.lastName}</div>
                <div className="app-details">{app.programme} • {app.submission_date || app.submissionDate}</div>
              </div>
              <span className={`status-badge ${app.status}`}>{app.status}</span>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .overview-tab {
          max-width: 1400px;
        }

        h2 {
          font-size: 2rem;
          color: #1a202c;
          margin-bottom: 0.5rem;
        }

        .subtitle {
          color: #64748b;
          margin-bottom: 2rem;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .stat-card {
          background: white;
          padding: 1.5rem;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
          display: flex;
          align-items: center;
          gap: 1rem;
          border-left: 4px solid;
        }

        .stat-card.primary { border-left-color: #0052a3; }
        .stat-card.success { border-left-color: #10b981; }
        .stat-card.warning { border-left-color: #f59e0b; }
        .stat-card.info { border-left-color: #8b5cf6; }

        .stat-icon {
          font-size: 2.5rem;
          opacity: 0.8;
        }

        .stat-value {
          font-size: 2rem;
          font-weight: 700;
          color: #1a202c;
          line-height: 1;
        }

        .stat-label {
          font-size: 0.9rem;
          color: #64748b;
          margin-top: 0.25rem;
        }

        .content-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .card {
          background: white;
          padding: 1.5rem;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
        }

        .card h3 {
          font-size: 1.1rem;
          color: #1a202c;
          margin-bottom: 1rem;
          padding-bottom: 0.75rem;
          border-bottom: 2px solid #f1f5f9;
        }

        .status-list, .info-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .status-item, .info-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.75rem;
          background: #f8fafc;
          border-radius: 8px;
        }

        .status-label, .info-label {
          color: #475569;
          font-weight: 500;
        }

        .status-count {
          font-weight: 700;
          font-size: 1.1rem;
          color: #1a202c;
        }

        .status-count.success { color: #10b981; }
        .status-count.danger { color: #ef4444; }

        .info-value {
          color: #1a202c;
          font-weight: 600;
        }

        .status-badge {
          padding: 0.375rem 0.75rem;
          border-radius: 6px;
          font-size: 0.85rem;
          font-weight: 600;
          text-transform: capitalize;
        }

        .status-badge.active {
          background: #d1fae5;
          color: #065f46;
        }

        .status-badge.pending {
          background: #fef3c7;
          color: #92400e;
        }

        .status-badge.approved {
          background: #d1fae5;
          color: #065f46;
        }

        .status-badge.rejected {
          background: #fee2e2;
          color: #991b1b;
        }

        .status-badge.draft {
          background: #e0e7ff;
          color: #3730a3;
        }

        .applications-table {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .application-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem;
          background: #f8fafc;
          border-radius: 8px;
          transition: all 0.3s;
        }

        .application-row:hover {
          background: #f1f5f9;
          transform: translateX(4px);
        }

        .app-name {
          font-weight: 600;
          color: #1a202c;
          margin-bottom: 0.25rem;
        }

        .app-details {
          font-size: 0.85rem;
          color: #64748b;
        }

        @media (max-width: 768px) {
          .stats-grid, .content-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}

function NotificationsTab({ notifications, onNotificationsUpdate }: { notifications: AgentNotification[]; onNotificationsUpdate: () => Promise<void> }) {
  const [isMarkingRead, setIsMarkingRead] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [localNotifications, setLocalNotifications] = useState(notifications);
  const unreadCount = localNotifications.filter(n => !n.read).length;
  
  // Update local state when notifications prop changes
  useEffect(() => {
    setLocalNotifications(notifications);
  }, [notifications]);
  
  const handleMarkAllRead = async () => {
    setIsMarkingRead(true);
    
    try {
      // Get agent_id from notifications or use first notification
      const agentId = localNotifications[0]?.agent_id;
      
      if (!agentId) {
        throw new Error('No agent ID found');
      }

      // Call API to mark all as read in database
      const response = await fetch('/api/agent/notifications/mark-read', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agent_id: agentId })
      });
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to mark notifications as read');
      }
      
      // Update local state optimistically
      setLocalNotifications(prev => prev.map(n => ({ ...n, read: true })));
      
      // Show success feedback
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
      
      // Reload notifications from database to update the badge count
      setTimeout(async () => {
        await onNotificationsUpdate();
      }, 500);
      
    } catch (error) {
      console.error('Error marking notifications as read:', error);
      alert('Failed to mark notifications as read: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setIsMarkingRead(false);
    }
  };
  
  const getNotificationIcon = (type: string) => {
    switch(type) {
      case 'success': return '✅';
      case 'warning': return '⚠️';
      case 'error': return '❌';
      case 'info':
      default: return 'ℹ️';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <div className="notifications-tab">
      <div className="notifications-header">
        <div>
          <h2>🔔 Notifications</h2>
          <p className="subtitle">
            {unreadCount > 0 ? `You have ${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` : 'All caught up!'}
          </p>
        </div>
        {unreadCount > 0 && (
          <button 
            className={`mark-read-btn ${isMarkingRead ? 'loading' : ''} ${showSuccess ? 'success' : ''}`}
            onClick={handleMarkAllRead}
            disabled={isMarkingRead}
          >
            {isMarkingRead ? (
              <>
                <span className="spinner-small"></span>
                Marking...
              </>
            ) : showSuccess ? (
              <>
                <span className="check-icon">✓</span>
                Marked!
              </>
            ) : (
              'Mark all as read'
            )}
          </button>
        )}
      </div>

      {localNotifications.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📭</div>
          <h3>No notifications yet</h3>
          <p>When you receive notifications, they'll appear here</p>
        </div>
      ) : (
        <div className="notifications-list">
          {localNotifications.map((notif, index) => (
            <div 
              key={notif.id} 
              className={`notification-card ${notif.type} ${notif.read ? 'read' : 'unread'}`}
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className="notif-icon-wrapper">
                <span className="notif-icon">{getNotificationIcon(notif.type)}</span>
              </div>
              <div className="notif-content">
                <div className="notif-header">
                  <div className="notif-title-wrapper">
                    <span className="notif-title">{notif.title}</span>
                    {!notif.read && <span className="unread-dot"></span>}
                  </div>
                  <span className="notif-date">{formatDate(notif.date || notif.created_at || new Date().toISOString())}</span>
                </div>
                <p className="notif-message">{notif.message}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <style jsx>{`
        .notifications-tab {
          max-width: 1000px;
        }

        .notifications-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 2rem;
        }

        h2 {
          font-size: 2rem;
          color: #1a202c;
          margin-bottom: 0.5rem;
        }

        .subtitle {
          color: #64748b;
          font-size: 0.95rem;
        }

        .mark-read-btn {
          padding: 0.625rem 1.25rem;
          background: #0052a3;
          color: white;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.3s;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          min-width: 150px;
          justify-content: center;
        }

        .mark-read-btn:hover:not(:disabled) {
          background: #003d7a;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 82, 163, 0.3);
        }

        .mark-read-btn:disabled {
          cursor: not-allowed;
          opacity: 0.7;
        }

        .mark-read-btn.loading {
          background: #64748b;
        }

        .mark-read-btn.success {
          background: #10b981;
          animation: successPulse 0.6s ease;
        }

        @keyframes successPulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }

        .spinner-small {
          width: 14px;
          height: 14px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top: 2px solid white;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .check-icon {
          font-size: 1.2rem;
          font-weight: bold;
          animation: checkBounce 0.4s ease;
        }

        @keyframes checkBounce {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.3);
          }
        }

        .empty-state {
          text-align: center;
          padding: 4rem 2rem;
          background: white;
          border-radius: 16px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
        }

        .empty-icon {
          font-size: 4rem;
          margin-bottom: 1rem;
          opacity: 0.5;
        }

        .empty-state h3 {
          font-size: 1.5rem;
          color: #1a202c;
          margin-bottom: 0.5rem;
        }

        .empty-state p {
          color: #64748b;
        }

        .notifications-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .notification-card {
          display: flex;
          gap: 1.25rem;
          background: white;
          padding: 1.5rem;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
          border-left: 4px solid;
          position: relative;
          transition: all 0.3s ease;
          animation: slideIn 0.4s ease-out forwards;
          opacity: 0;
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .notification-card:hover {
          transform: translateX(4px);
          box-shadow: 0 4px 16px rgba(0,0,0,0.12);
        }

        .notification-card.info { border-left-color: #3b82f6; }
        .notification-card.success { border-left-color: #10b981; }
        .notification-card.warning { border-left-color: #f59e0b; }
        .notification-card.error { border-left-color: #ef4444; }

        .notification-card.unread {
          background: linear-gradient(to right, #f8fafc, white);
          box-shadow: 0 2px 12px rgba(0,0,0,0.1);
        }

        .notification-card.read {
          opacity: 0.65;
          background: #fafbfc;
        }

        .notification-card.read:hover {
          opacity: 0.85;
        }

        .notif-icon-wrapper {
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 48px;
          height: 48px;
          border-radius: 12px;
          background: #f8fafc;
        }

        .notification-card.info .notif-icon-wrapper { background: #dbeafe; }
        .notification-card.success .notif-icon-wrapper { background: #d1fae5; }
        .notification-card.warning .notif-icon-wrapper { background: #fef3c7; }
        .notification-card.error .notif-icon-wrapper { background: #fee2e2; }

        .notif-icon {
          font-size: 1.5rem;
        }

        .notif-content {
          flex: 1;
          min-width: 0;
        }

        .notif-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 1rem;
          margin-bottom: 0.5rem;
        }

        .notif-title-wrapper {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .notif-title {
          font-weight: 700;
          color: #1a202c;
          font-size: 1.05rem;
          line-height: 1.4;
        }

        .unread-dot {
          width: 8px;
          height: 8px;
          background: #ef4444;
          border-radius: 50%;
          flex-shrink: 0;
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.5;
            transform: scale(1.1);
          }
        }

        .notif-date {
          font-size: 0.85rem;
          color: #94a3b8;
          white-space: nowrap;
          flex-shrink: 0;
        }

        .notif-message {
          color: #475569;
          line-height: 1.6;
          font-size: 0.95rem;
        }

        .notification-card.read .notif-title,
        .notification-card.read .notif-message {
          opacity: 0.7;
        }

        @media (max-width: 768px) {
          .notifications-header {
            flex-direction: column;
            gap: 1rem;
          }

          .mark-read-btn {
            width: 100%;
          }

          .notification-card {
            flex-direction: column;
            gap: 1rem;
          }

          .notif-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.5rem;
          }
        }
      `}</style>
    </div>
  );
}

function NewApplicationTab({ agent, onSuccess }: { agent: Agent; onSuccess: () => void }) {
  const agentName = `${agent.contact_person_first_name || ''} ${agent.contact_person_last_name || ''}`.trim() || agent.company_name || 'Agent';
  const companyNname = agent.company_name || 'Agent';
  
  return (
    <div className="new-application-tab">
      <h2>➕ New Application</h2>
      <p className="subtitle">Submit a new student application</p>
      
      <ApplicationUploadForm 
        agentId={agent.agent_id || String(agent.id)}
        agentName={agentName}
        company_name={companyNname}
        onSuccess={onSuccess}
      />

      <style jsx>{`
        .new-application-tab h2 {
          font-size: 2rem;
          color: #1a202c;
          margin-bottom: 0.5rem;
        }

        .subtitle {
          color: #64748b;
          margin-bottom: 2rem;
        }
      `}</style>
    </div>
  );
}

function ApplicationsTab({ applications, status }: { applications: AgentApplication[]; status: string }) {
  const filteredApps = status === 'all' 
    ? applications 
    : applications.filter(app => app.status === status);

  return (
    <div className="applications-tab">
      <h2>📝 Applications {status !== 'all' && `(${status})`}</h2>
      <p className="subtitle">Total: {filteredApps.length} applications</p>

      <div className="applications-grid">
        {filteredApps.map(app => (
          <div key={app.id} className="application-card">
            <div className="card-header">
              <h3>{app.firstName} {app.lastName}</h3>
              <span className={`status-badge ${app.status}`}>{app.status}</span>
            </div>
            <div className="card-body">
              <div className="info-row">
                <span className="label">Programme:</span>
                <span className="value">{app.programme}</span>
              </div>
              <div className="info-row">
                <span className="label">Email:</span>
                <span className="value">{app.email}</span>
              </div>
              <div className="info-row">
                <span className="label">Submitted:</span>
                <span className="value">{app.submission_date || app.submissionDate}</span>
              </div>
            </div>
            <div className="card-footer">
              <button className="btn-view">View Details</button>
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        h2 {
          font-size: 2rem;
          color: #1a202c;
          margin-bottom: 0.5rem;
          text-transform: capitalize;
        }

        .subtitle {
          color: #64748b;
          margin-bottom: 2rem;
        }

        .applications-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 1.5rem;
        }

        .application-card {
          background: white;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
          overflow: hidden;
        }

        .card-header {
          padding: 1.25rem;
          background: #f8fafc;
          border-bottom: 1px solid #e2e8f0;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .card-header h3 {
          font-size: 1.1rem;
          color: #1a202c;
          margin: 0;
        }

        .status-badge {
          padding: 0.375rem 0.75rem;
          border-radius: 6px;
          font-size: 0.85rem;
          font-weight: 600;
          text-transform: capitalize;
        }

        .status-badge.pending {
          background: #fef3c7;
          color: #92400e;
        }

        .status-badge.approved {
          background: #d1fae5;
          color: #065f46;
        }

        .status-badge.rejected {
          background: #fee2e2;
          color: #991b1b;
        }

        .status-badge.draft {
          background: #e0e7ff;
          color: #3730a3;
        }

        .card-body {
          padding: 1.25rem;
        }

        .info-row {
          display: flex;
          justify-content: space-between;
          padding: 0.5rem 0;
          border-bottom: 1px solid #f1f5f9;
        }

        .info-row:last-child {
          border-bottom: none;
        }

        .label {
          color: #64748b;
          font-weight: 500;
        }

        .value {
          color: #1a202c;
          font-weight: 600;
        }

        .card-footer {
          padding: 1rem 1.25rem;
          background: #f8fafc;
          border-top: 1px solid #e2e8f0;
        }

        .btn-view {
          width: 100%;
          padding: 0.75rem;
          background: #0052a3;
          color: white;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
        }

        .btn-view:hover {
          background: #003d7a;
          transform: translateY(-2px);
        }

        @media (max-width: 768px) {
          .applications-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}

function StudentsTab({ applications }: { applications: AgentApplication[] }) {
  return (
    <div className="students-tab">
      <h2>👥 My Students</h2>
      <p className="subtitle">Approved students you've referred</p>
      
      <ApplicationsTab applications={applications} status="all" />
    </div>
  );
}

function DocumentsTab({ applications }: { applications: AgentApplication[] }) {
  return (
    <div className="documents-tab">
      <h2>📄 Documents</h2>
      <p className="subtitle">Manage student documents</p>
      
      <div className="card">
        <p style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
          Document management interface will be displayed here
        </p>
      </div>

      <style jsx>{`
        h2 {
          font-size: 2rem;
          color: #1a202c;
          margin-bottom: 0.5rem;
        }

        .subtitle {
          color: #64748b;
          margin-bottom: 2rem;
        }

        .card {
          background: white;
          padding: 2rem;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
        }
      `}</style>
    </div>
  );
}

function ApplicationReportTab({ applications }: { applications: AgentApplication[] }) {
  return (
    <div className="report-tab">
      <h2>📈 Application Reports</h2>
      <p className="subtitle">View application analytics and trends</p>
      
      <div className="card">
        <h3>Application Statistics</h3>
        <p>Total Applications: {applications.length}</p>
        <p>Approved: {applications.filter(a => a.status === 'approved').length}</p>
        <p>Submitted: {applications.filter(a => a.status === 'submitted').length}</p>
        <p>Rejected: {applications.filter(a => a.status === 'rejected').length}</p>
      </div>

      <style jsx>{`
        h2 {
          font-size: 2rem;
          color: #1a202c;
          margin-bottom: 0.5rem;
        }

        .subtitle {
          color: #64748b;
          margin-bottom: 2rem;
        }

        .card {
          background: white;
          padding: 2rem;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
        }

        .card h3 {
          margin-bottom: 1rem;
          color: #1a202c;
        }

        .card p {
          padding: 0.5rem 0;
          border-bottom: 1px solid #f1f5f9;
        }
      `}</style>
    </div>
  );
}

function CommissionReportTab({ agent, applications }: { agent: Agent; applications: AgentApplication[] }) {
  // Calculate commissions from applications
  const totalCommissionEarned = applications
    .filter(a => a.status === 'approved' || a.status === 'enrolled')
    .reduce((sum, app) => sum + (parseFloat(app.commission_amount as any) || 0), 0);
  
  const pendingCommission = applications
    .filter(a => a.commission_status === 'pending')
    .reduce((sum, app) => sum + (parseFloat(app.commission_amount as any) || 0), 0);
  
  const paidCommission = applications
    .filter(a => a.commission_status === 'paid')
    .reduce((sum, app) => sum + (parseFloat(app.commission_amount as any) || 0), 0);
  
  return (
    <div className="commission-tab">
      <h2>💰 Commission Reports</h2>
      <p className="subtitle">Track your commission earnings</p>
      
      <div className="card">
        <h3>Commission Summary</h3>
        <p>Commission Rate: {agent.commission_rate || 0}%</p>
        <p>Total Commission Earned: £{totalCommissionEarned.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
        <p>Pending Commission: £{pendingCommission.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
        <p>Paid Commission: £{paidCommission.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
        <p>Successful Enrollments: {agent.successful_enrollments || 0}</p>
        <p>Conversion Rate: {agent.conversion_rate || 0}%</p>
      </div>

      <style jsx>{`
        h2 {
          font-size: 2rem;
          color: #1a202c;
          margin-bottom: 0.5rem;
        }

        .subtitle {
          color: #64748b;
          margin-bottom: 2rem;
        }

        .card {
          background: white;
          padding: 2rem;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
        }

        .card h3 {
          margin-bottom: 1rem;
          color: #1a202c;
        }

        .card p {
          padding: 0.5rem 0;
          border-bottom: 1px solid #f1f5f9;
          font-size: 1.1rem;
        }
      `}</style>
    </div>
  );
}

function ProfileTab({ agent }: { agent: Agent }) {
  const agentName = `${agent.contact_person_title || ''} ${agent.contact_person_first_name || ''} ${agent.contact_person_last_name || ''}`.trim();
  const registrationDate = agent.created_at ? new Date(agent.created_at).toLocaleDateString() : 'N/A';
  
  return (
    <div className="profile-tab">
      <h2>👤 My Profile</h2>
      <p className="subtitle">View and manage your agent profile</p>
      
      <div className="card">
        <div className="profile-section">
          <h3>Personal Information</h3>
          <div className="info-grid">
            <div className="info-item">
              <label>Name:</label>
              <span>{agentName}</span>
            </div>
            <div className="info-item">
              <label>Email:</label>
              <span>{agent.email || 'N/A'}</span>
            </div>
            <div className="info-item">
              <label>Phone:</label>
              <span>{agent.phone || agent.mobile || 'N/A'}</span>
            </div>
            <div className="info-item">
              <label>Company:</label>
              <span>{agent.company_name || 'N/A'}</span>
            </div>
            <div className="info-item">
              <label>Country:</label>
              <span>{agent.country || 'N/A'}</span>
            </div>
            <div className="info-item">
              <label>Registration Date:</label>
              <span>{registrationDate}</span>
            </div>
            <div className="info-item">
              <label>Agent ID:</label>
              <span>{agent.agent_id || 'N/A'}</span>
            </div>
            <div className="info-item">
              <label>Position:</label>
              <span>{agent.contact_person_position || 'N/A'}</span>
            </div>
            <div className="info-item">
              <label>City:</label>
              <span>{agent.city || 'N/A'}</span>
            </div>
            <div className="info-item">
              <label>Website:</label>
              <span>{agent.website || 'N/A'}</span>
            </div>
            <div className="info-item">
              <label>Specialization:</label>
              <span>{agent.specialization || 'N/A'}</span>
            </div>
            <div className="info-item">
              <label>Years in Business:</label>
              <span>{agent.years_in_business || 'N/A'}</span>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        h2 {
          font-size: 2rem;
          color: #1a202c;
          margin-bottom: 0.5rem;
        }

        .subtitle {
          color: #64748b;
          margin-bottom: 2rem;
        }

        .card {
          background: white;
          padding: 2rem;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
          max-width: 800px;
        }

        .profile-section h3 {
          font-size: 1.2rem;
          color: #1a202c;
          margin-bottom: 1.5rem;
          padding-bottom: 0.75rem;
          border-bottom: 2px solid #f1f5f9;
        }

        .info-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1.5rem;
        }

        .info-item {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .info-item label {
          font-weight: 600;
          color: #64748b;
          font-size: 0.9rem;
        }

        .info-item span {
          color: #1a202c;
          font-size: 1.05rem;
        }
      `}</style>
    </div>
  );
}

function SettingsTab() {
  return (
    <div className="settings-tab">
      <h2>⚙️ Settings</h2>
      <p className="subtitle">Manage your account settings</p>
      
      <div className="card">
        <p style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
          Settings interface will be displayed here
        </p>
      </div>

      <style jsx>{`
        h2 {
          font-size: 2rem;
          color: #1a202c;
          margin-bottom: 0.5rem;
        }

        .subtitle {
          color: #64748b;
          margin-bottom: 2rem;
        }

        .card {
          background: white;
          padding: 2rem;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
        }
      `}</style>
    </div>
  );
}

function SupportTab() {
  return (
    <div className="support-tab">
      <h2>💬 Support</h2>
      <p className="subtitle">Get help and contact support</p>
      
      <div className="card">
        <h3>Contact Information</h3>
        <p>Email: support@citiedgecollege.co.uk</p>
        <p>Phone: +44 7454 289604</p>
        <p>Hours: Monday - Friday, 9:00 AM - 5:00 PM GMT</p>
      </div>

      <style jsx>{`
        h2 {
          font-size: 2rem;
          color: #1a202c;
          margin-bottom: 0.5rem;
        }

        .subtitle {
          color: #64748b;
          margin-bottom: 2rem;
        }

        .card {
          background: white;
          padding: 2rem;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
          max-width: 600px;
        }

        .card h3 {
          margin-bottom: 1rem;
          color: #1a202c;
        }

        .card p {
          padding: 0.5rem 0;
          border-bottom: 1px solid #f1f5f9;
          font-size: 1.05rem;
        }

        .card p:last-child {
          border-bottom: none;
        }
      `}</style>
    </div>
  );
}
