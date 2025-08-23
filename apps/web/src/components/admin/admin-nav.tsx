'use client'

import React from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  Users,
  UserPlus,
  Calendar,
  BarChart3,
  Settings,
  Shield,
  FileText,
  DollarSign,
  AlertCircle,
  CheckCircle,
  Clock,
  TrendingUp,
  Database,
  Bell,
  Search,
  HelpCircle
} from 'lucide-react'

interface NavigationItem {
  title: string
  href: string
  icon: React.ReactNode
  badge?: {
    text: string
    variant?: 'default' | 'secondary' | 'destructive' | 'outline'
  }
  description?: string
  children?: NavigationItem[]
}

interface AdminNavProps {
  className?: string
  collapsed?: boolean
}

export function AdminNav({ className, collapsed = false }: AdminNavProps) {
  const pathname = usePathname()

  const navigationItems: NavigationItem[] = [
    {
      title: 'Dashboard',
      href: '/admin/dashboard',
      icon: <LayoutDashboard className="h-4 w-4" />,
      description: 'Overview and key metrics'
    },
    {
      title: 'Leads',
      href: '/admin/leads',
      icon: <UserPlus className="h-4 w-4" />,
      badge: { text: '12', variant: 'secondary' },
      description: 'Lead management and pipeline'
    },
    {
      title: 'Scheduling',
      href: '/admin/scheduling',
      icon: <Calendar className="h-4 w-4" />,
      badge: { text: '3', variant: 'destructive' },
      description: 'Advanced scheduling and conflicts'
    },
    {
      title: 'Clients',
      href: '/admin/clients',
      icon: <Users className="h-4 w-4" />,
      description: 'Client management and records'
    },
    {
      title: 'Caregivers',
      href: '/admin/caregivers',
      icon: <Shield className="h-4 w-4" />,
      description: 'Caregiver management and performance'
    },
    {
      title: 'Billing',
      href: '/admin/billing',
      icon: <DollarSign className="h-4 w-4" />,
      badge: { text: '5', variant: 'outline' },
      description: 'Invoices, payments, and financials'
    },
    {
      title: 'Reports',
      href: '/admin/reports',
      icon: <BarChart3 className="h-4 w-4" />,
      description: 'Analytics and business intelligence'
    },
    {
      title: 'User Management',
      href: '/admin/user-management',
      icon: <Users className="h-4 w-4" />,
      description: 'Users, roles, and permissions'
    },
    {
      title: 'System Health',
      href: '/admin/system-health',
      icon: <Database className="h-4 w-4" />,
      badge: { text: '●', variant: 'default' },
      description: 'System monitoring and health'
    },
    {
      title: 'Settings',
      href: '/admin/settings',
      icon: <Settings className="h-4 w-4" />,
      description: 'System configuration and preferences'
    }
  ]

  const quickActions = [
    {
      title: 'Add Client',
      href: '/admin/clients/new',
      icon: <UserPlus className="h-4 w-4" />
    },
    {
      title: 'Schedule Visit',
      href: '/admin/scheduling/new',
      icon: <Calendar className="h-4 w-4" />
    },
    {
      title: 'Generate Report',
      href: '/admin/reports/generate',
      icon: <FileText className="h-4 w-4" />
    }
  ]

  const systemAlerts = [
    {
      type: 'warning',
      title: 'Low Caregiver Availability',
      count: 3
    },
    {
      type: 'error',
      title: 'Expired Credentials',
      count: 5
    },
    {
      type: 'info',
      title: 'Pending Approvals',
      count: 8
    }
  ]

  const isActive = (href: string) => {
    if (href === '/admin/dashboard') {
      return pathname === href
    }
    return pathname.startsWith(href)
  }

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'error': return <AlertCircle className="h-3 w-3 text-red-500" />
      case 'warning': return <Clock className="h-3 w-3 text-yellow-500" />
      case 'info': return <CheckCircle className="h-3 w-3 text-blue-500" />
      default: return <Bell className="h-3 w-3" />
    }
  }

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'error': return 'bg-red-100 text-red-800 border-red-200'
      case 'warning': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'info': return 'bg-blue-100 text-blue-800 border-blue-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  if (collapsed) {
    return (
      <nav className={cn("flex flex-col space-y-2", className)}>
        {navigationItems.map((item) => (
          <Link key={item.href} href={item.href}>
            <Button
              variant={isActive(item.href) ? "default" : "ghost"}
              size="sm"
              className="w-10 h-10 p-0 relative"
              title={item.title}
            >
              {item.icon}
              {item.badge && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-xs text-white font-bold">
                    {item.badge.text === '●' ? '●' : item.badge.text.length > 2 ? '9+' : item.badge.text}
                  </span>
                </div>
              )}
            </Button>
          </Link>
        ))}
      </nav>
    )
  }

  return (
    <div className={cn("space-y-8", className)}>
      {/* Main Navigation */}
      <div>
        <h3 className="mb-4 text-sm font-medium text-muted-foreground uppercase tracking-wider">
          Administration
        </h3>
        <nav className="space-y-1">
          {navigationItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <Button
                variant={isActive(item.href) ? "default" : "ghost"}
                className="w-full justify-start h-auto p-3"
              >
                <div className="flex items-center space-x-3 w-full">
                  {item.icon}
                  <div className="flex-1 text-left">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{item.title}</span>
                      {item.badge && (
                        <Badge 
                          variant={item.badge.variant || 'default'} 
                          className="ml-2 h-5"
                        >
                          {item.badge.text}
                        </Badge>
                      )}
                    </div>
                    {item.description && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {item.description}
                      </p>
                    )}
                  </div>
                </div>
              </Button>
            </Link>
          ))}
        </nav>
      </div>

      {/* Quick Actions */}
      <div>
        <h3 className="mb-4 text-sm font-medium text-muted-foreground uppercase tracking-wider">
          Quick Actions
        </h3>
        <div className="space-y-1">
          {quickActions.map((action) => (
            <Link key={action.href} href={action.href}>
              <Button variant="outline" className="w-full justify-start" size="sm">
                {action.icon}
                <span className="ml-2">{action.title}</span>
              </Button>
            </Link>
          ))}
        </div>
      </div>

      {/* System Alerts */}
      <div>
        <h3 className="mb-4 text-sm font-medium text-muted-foreground uppercase tracking-wider">
          System Alerts
        </h3>
        <div className="space-y-2">
          {systemAlerts.map((alert, index) => (
            <div 
              key={index}
              className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 cursor-pointer transition-colors"
            >
              <div className="flex items-center space-x-2">
                {getAlertIcon(alert.type)}
                <span className="text-sm font-medium">{alert.title}</span>
              </div>
              <Badge className={getAlertColor(alert.type)} variant="outline">
                {alert.count}
              </Badge>
            </div>
          ))}
        </div>
      </div>

      {/* Performance Overview */}
      <div>
        <h3 className="mb-4 text-sm font-medium text-muted-foreground uppercase tracking-wider">
          Performance
        </h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm">Revenue This Month</span>
            <div className="flex items-center space-x-1">
              <TrendingUp className="h-3 w-3 text-green-500" />
              <span className="text-sm font-medium text-green-600">+12.5%</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">Visit Completion</span>
            <span className="text-sm font-medium">94.8%</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">Client Satisfaction</span>
            <span className="text-sm font-medium">4.7/5</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">System Uptime</span>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm font-medium">99.9%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Help & Support */}
      <div>
        <h3 className="mb-4 text-sm font-medium text-muted-foreground uppercase tracking-wider">
          Support
        </h3>
        <div className="space-y-1">
          <Button variant="ghost" className="w-full justify-start" size="sm">
            <HelpCircle className="h-4 w-4" />
            <span className="ml-2">Help Center</span>
          </Button>
          <Button variant="ghost" className="w-full justify-start" size="sm">
            <Search className="h-4 w-4" />
            <span className="ml-2">Search Documentation</span>
          </Button>
        </div>
      </div>
    </div>
  )
}