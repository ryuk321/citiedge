/**
 * Agent Portal Menu Configuration
 * 
 * This JSON-based configuration file defines all menu items and sections
 * for the Agent Portal. Easy to edit manually for customization.
 */

import { MenuSection } from '@/components/layouts/UniversalPortalLayout';
import { 
  LayoutDashboard, 
  Bell, 
  PlusCircle, 
  FileText, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Users, 
  File, 
  TrendingUp, 
  DollarSign, 
  User, 
  Settings, 
  MessageCircle 
} from 'lucide-react';

export const agentMenuConfig: MenuSection[] = [
  {
    title: 'Dashboard',
    items: [
      {
        id: 'overview',
        label: 'Overview',
        icon: LayoutDashboard,
        href: '/agent/portal',
      },
      {
        id: 'notifications',
        label: 'Notifications',
        icon: Bell,
        badge: 0, // Will be updated dynamically
      }
    ]
  },
  {
    title: 'Applications',
    items: [
      {
        id: 'new-application',
        label: 'New Application',
        icon: PlusCircle,
      },
      {
        id: 'my-applications',
        label: 'My Applications',
        icon: FileText,
      },
      {
        id: 'pending-applications',
        label: 'Pending Review',
        icon: Clock,
        badge: 0,
      },
      {
        id: 'approved-applications',
        label: 'Approved',
        icon: CheckCircle,
      },
      {
        id: 'rejected-applications',
        label: 'Rejected',
        icon: XCircle,
      }
    ]
  },
  {
    title: 'Students',
    items: [
      {
        id: 'my-students',
        label: 'My Students',
        icon: Users,
      },
      {
        id: 'student-documents',
        label: 'Documents',
        icon: File,
      }
    ]
  },
  {
    title: 'Reports',
    items: [
      {
        id: 'application-report',
        label: 'Application Reports',
        icon: TrendingUp,
      },
      {
        id: 'commission-report',
        label: 'Commission Reports',
        icon: DollarSign,
      }
    ]
  },
  {
    title: 'Account',
    items: [
      {
        id: 'profile',
        label: 'My Profile',
        icon: User,
      },
      {
        id: 'settings',
        label: 'Settings',
        icon: Settings,
      },
      {
        id: 'support',
        label: 'Support',
        icon: MessageCircle,
      }
    ]
  }
];

// Export individual sections for easy access
export const dashboardSection = agentMenuConfig[0];
export const applicationsSection = agentMenuConfig[1];
export const studentsSection = agentMenuConfig[2];
export const reportsSection = agentMenuConfig[3];
export const accountSection = agentMenuConfig[4];
