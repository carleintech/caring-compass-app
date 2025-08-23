import { 
  Home, 
  Users, 
  Calendar, 
  CreditCard, 
  MessageCircle, 
  FileText, 
  Settings,
  User,
  Bell,
  Shield,
  Heart,
  Phone,
  Activity,
  ClipboardList,
  Clock,
  TrendingUp
} from 'lucide-react'

export interface MobileNavItem {
  title: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  description?: string
  badge?: number
  category?: string
  priority?: 'high' | 'medium' | 'low'
}

export interface MobileNavigationConfig {
  primary: MobileNavItem[]
  secondary: MobileNavItem[]
  emergency: MobileNavItem[]
  settings: MobileNavItem[]
  quickActions: MobileNavItem[]
}

export const mobileNavigationConfig: MobileNavigationConfig = {
  primary: [
    {
      title: 'Dashboard',
      href: '/dashboard',
      icon: Home,
      description: 'Overview and quick stats',
      category: 'main',
      priority: 'high'
    },
    {
      title: 'Patients',
      href: '/patients',
      icon: Users,
      description: 'Manage patient records',
      category: 'main',
      priority: 'high'
    },
    {
      title: 'Appointments',
      href: '/appointments',
      icon: Calendar,
      description: 'Schedule and manage appointments',
      category: 'main',
      priority: 'high'
    },
    {
      title: 'Billing',
      href: '/billing',
      icon: CreditCard,
      description: 'Invoices and payments',
      category: 'main',
      priority: 'medium'
    },
    {
      title: 'Messages',
      href: '/messages',
      icon: MessageCircle,
      description: 'Patient communications',
      category: 'main',
      priority: 'medium',
      badge: 0
    }
  ],
  
  secondary: [
    {
      title: 'Reports',
      href: '/reports',
      icon: TrendingUp,
      description: 'Analytics and insights',
      category: 'analytics',
      priority: 'medium'
    },
    {
      title: 'Tasks',
      href: '/tasks',
      icon: ClipboardList,
      description: 'Daily tasks and reminders',
      category: 'productivity',
      priority: 'medium'
    },
    {
      title: 'Documents',
      href: '/documents',
      icon: FileText,
      description: 'Patient documents and forms',
      category: 'documents',
      priority: 'low'
    },
    {
      title: 'Activity',
      href: '/activity',
      icon: Activity,
      description: 'Recent activity feed',
      category: 'tracking',
      priority: 'low'
    }
  ],
  
  emergency: [
    {
      title: 'Emergency Contacts',
      href: '/emergency/contacts',
      icon: Phone,
      description: 'Quick access to emergency contacts',
      category: 'emergency',
      priority: 'high'
    },
    {
      title: 'Critical Alerts',
      href: '/emergency/alerts',
      icon: Bell,
      description: 'Urgent patient alerts',
      category: 'emergency',
      priority: 'high',
      badge: 0
    }
  ],
  
  settings: [
    {
      title: 'Profile',
      href: '/settings/profile',
      icon: User,
      description: 'Your profile settings',
      category: 'settings',
      priority: 'medium'
    },
    {
      title: 'Security',
      href: '/settings/security',
      icon: Shield,
      description: 'Security and privacy',
      category: 'settings',
      priority: 'high'
    },
    {
      title: 'Notifications',
      href: '/settings/notifications',
      icon: Bell,
      description: 'Notification preferences',
      category: 'settings',
      priority: 'medium'
    },
    {
      title: 'Preferences',
      href: '/settings/preferences',
      icon: Settings,
      description: 'App preferences',
      category: 'settings',
      priority: 'low'
    }
  ],
  
  quickActions: [
    {
      title: 'New Patient',
      href: '/patients/new',
      icon: User,
      description: 'Add new patient',
      category: 'quick',
      priority: 'high'
    },
    {
      title: 'Book Appointment',
      href: '/appointments/new',
      icon: Calendar,
      description: 'Schedule appointment',
      category: 'quick',
      priority: 'high'
    },
    {
      title: 'Send Message',
      href: '/messages/new',
      icon: MessageCircle,
      description: 'Send patient message',
      category: 'quick',
      priority: 'medium'
    },
    {
      title: 'Create Invoice',
      href: '/billing/new',
      icon: CreditCard,
      description: 'Generate invoice',
      category: 'quick',
      priority: 'medium'
    }
  ]
}

// Helper functions for mobile navigation
export const getMobileNavItems = (category?: string) => {
  const allItems = [
    ...mobileNavigationConfig.primary,
    ...mobileNavigationConfig.secondary,
    ...mobileNavigationConfig.emergency,
    ...mobileNavigationConfig.settings,
    ...mobileNavigationConfig.quickActions
  ]
  
  if (category) {
    return allItems.filter(item => item.category === category)
  }
  
  return allItems
}

export const getPriorityNavItems = (priority: 'high' | 'medium' | 'low') => {
  const allItems = [
    ...mobileNavigationConfig.primary,
    ...mobileNavigationConfig.secondary,
    ...mobileNavigationConfig.emergency,
    ...mobileNavigationConfig.settings,
    ...mobileNavigationConfig.quickActions
  ]
  
  return allItems.filter(item => item.priority === priority)
}

export const getBottomNavItems = () => {
  return mobileNavigationConfig.primary.filter(item => 
    ['dashboard', 'patients', 'appointments', 'messages'].includes(
      item.href.split('/')[1] || 'dashboard'
    )
  )
}

// Badge configuration
export const updateNavBadge = (href: string, count: number) => {
  const allItems = [
    ...mobileNavigationConfig.primary,
    ...mobileNavigationConfig.secondary,
    ...mobileNavigationConfig.emergency
  ]
  
  const item = allItems.find(navItem => navItem.href === href)
  if (item) {
    item.badge = count
  }
}
