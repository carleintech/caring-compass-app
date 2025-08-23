'use client'

import React from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { 
  Home,
  UserCheck,
  Calendar,
  CreditCard,
  MessageCircle,
  FileText,
  Users,
  User,
  Settings,
  Bell,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react'

interface ClientNavProps {
  className?: string
  notifications?: {
    messages: number
    appointments: number
    billing: number
  }
}

export function ClientNav({ className, notifications }: ClientNavProps) {
  const pathname = usePathname()

  const navItems = [
    {
      title: 'Dashboard',
      href: '/client/dashboard',
      icon: Home,
      description: 'Overview of your care'
    },
    {
      title: 'Care Plan',
      href: '/client/care-plan',
      icon: UserCheck,
      description: 'Your personalized care plan'
    },
    {
      title: 'Schedule',
      href: '/client/schedule',
      icon: Calendar,
      description: 'Upcoming visits and appointments',
      badge: notifications?.appointments
    },
    {
      title: 'Billing',
      href: '/client/billing',
      icon: CreditCard,
      description: 'Invoices and payment history',
      badge: notifications?.billing
    },
    {
      title: 'Messages',
      href: '/client/messages',
      icon: MessageCircle,
      description: 'Secure communication',
      badge: notifications?.messages
    },
    {
      title: 'Documents',
      href: '/client/documents',
      icon: FileText,
      description: 'Care reports and documents'
    },
    {
      title: 'Family Portal',
      href: '/client/family',
      icon: Users,
      description: 'Family member access'
    },
    {
      title: 'Profile',
      href: '/client/profile',
      icon: User,
      description: 'Personal information'
    },
    {
      title: 'Settings',
      href: '/client/settings',
      icon: Settings,
      description: 'Account and preferences'
    }
  ]

  return (
    <nav 
      className={cn('flex flex-col space-y-2', className)}
      role="navigation"
    >
      {navItems.map((item) => {
        const isActive = pathname === item.href
        const Icon = item.icon
        
        return (
          <Link 
            key={item.href} 
            href={item.href as any}
            role="link"
            className={cn(
              'flex items-center gap-3 w-full p-3 rounded-md transition-colors',
              'hover:bg-accent hover:text-accent-foreground',
              isActive && 'bg-primary text-primary-foreground'
            )}
          >
            <Icon className="h-4 w-4 shrink-0" role="img" aria-hidden="true" />
            <span className="font-medium">{item.title}</span>
            {item.badge && item.badge > 0 && (
              <Badge 
                variant="destructive" 
                className="ml-auto h-5 px-1.5 text-xs"
                role="status"
              >
                {item.badge > 99 ? '99+' : item.badge}
              </Badge>
            )}
          </Link>
        )
      })}
    </nav>
  )
}

// Client-specific status indicators
interface ClientStatusProps {
  careStatus: 'active' | 'pending' | 'paused'
  nextVisit?: string
  recentActivity?: number
  billingStatus: 'current' | 'pending' | 'overdue'
}

export function ClientStatus({ 
  careStatus, 
  nextVisit, 
  recentActivity = 0,
  billingStatus 
}: ClientStatusProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
      case 'current': 
        return 'text-green-600 bg-green-50'
      case 'pending': 
        return 'text-yellow-600 bg-yellow-50'
      case 'paused':
      case 'overdue': 
        return 'text-red-600 bg-red-50'
      default: 
        return 'text-gray-600 bg-gray-50'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
      case 'current': 
        return <CheckCircle className="h-4 w-4" />
      case 'pending': 
        return <Clock className="h-4 w-4" />
      case 'paused':
      case 'overdue': 
        return <AlertCircle className="h-4 w-4" />
      default: 
        return <Clock className="h-4 w-4" />
    }
  }

  return (
    <div className="p-4 border-b space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-medium">Care Status</h3>
        <div className={cn(
          'flex items-center gap-2 px-2 py-1 rounded-full text-xs font-medium',
          getStatusColor(careStatus)
        )}>
          {getStatusIcon(careStatus)}
          {careStatus.charAt(0).toUpperCase() + careStatus.slice(1)}
        </div>
      </div>

      {nextVisit && (
        <div className="text-sm">
          <span className="text-muted-foreground">Next visit: </span>
          <span className="font-medium">
            {new Date(nextVisit).toLocaleDateString('en-US', {
              weekday: 'short',
              month: 'short',
              day: 'numeric',
              hour: 'numeric',
              minute: '2-digit'
            })}
          </span>
        </div>
      )}

      <div className="flex justify-between text-xs text-muted-foreground">
        <span>Activity (7 days): {recentActivity}</span>
        <span className={cn(
          'font-medium',
          billingStatus === 'current' ? 'text-green-600' :
          billingStatus === 'pending' ? 'text-yellow-600' : 'text-red-600'
        )}>
          Billing: {billingStatus}
        </span>
      </div>
    </div>
  )
}

// Quick stats for client dashboard
interface QuickStatsProps {
  stats: {
    totalVisits: number
    hoursThisMonth: number
    satisfactionScore: number
    upcomingAppointments: number
  }
}

export function QuickStats({ stats }: QuickStatsProps) {
  const statItems = [
    {
      label: 'Total Visits',
      value: stats.totalVisits,
      suffix: ''
    },
    {
      label: 'Hours This Month',
      value: stats.hoursThisMonth,
      suffix: 'h'
    },
    {
      label: 'Satisfaction',
      value: stats.satisfactionScore,
      suffix: '/5'
    },
    {
      label: 'Upcoming',
      value: stats.upcomingAppointments,
      suffix: ''
    }
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 p-4">
      {statItems.map((stat, index) => (
        <div key={index} className="text-center space-y-1">
          <div className="text-2xl font-bold text-primary">
            {stat.value}{stat.suffix}
          </div>
          <div className="text-xs text-muted-foreground">
            {stat.label}
          </div>
        </div>
      ))}
    </div>
  )
}

// Emergency contact button
interface EmergencyContactProps {
  onEmergencyCall: () => void
}

export function EmergencyContact({ onEmergencyCall }: EmergencyContactProps) {
  return (
    <div className="p-4 border-t">
      <Button 
        variant="destructive" 
        className="w-full"
        onClick={onEmergencyCall}
      >
        <AlertCircle className="h-4 w-4 mr-2" />
        Emergency Contact
      </Button>
      <p className="text-xs text-center text-muted-foreground mt-2">
        24/7 support: (757) 555-CARE
      </p>
    </div>
  )
}