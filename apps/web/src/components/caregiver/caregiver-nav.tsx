'use client'

import React from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { 
  Home,
  FileText,
  Calendar,
  Clock,
  Timer,
  CheckSquare,
  DollarSign,
  GraduationCap,
  User,
  Settings,
  MapPin,
  Shield,
  AlertTriangle,
  Bell,
  Phone
} from 'lucide-react'

interface CaregiverNavProps {
  className?: string
  notifications?: {
    shifts: number
    applications: number
    training: number
    certifications: number
  }
}

export function CaregiverNav({ className, notifications }: CaregiverNavProps) {
  const pathname = usePathname()

  const navItems = [
    {
      title: 'Dashboard',
      href: '/caregiver/dashboard',
      icon: Home,
      description: 'Overview and quick actions'
    },
    {
      title: 'My Shifts',
      href: '/caregiver/shifts',
      icon: Calendar,
      description: 'Schedule and shift management',
      badge: notifications?.shifts
    },
    {
      title: 'EVV Clock In/Out',
      href: '/caregiver/evv',
      icon: Timer,
      description: 'Electronic visit verification'
    },
    {
      title: 'Availability',
      href: '/caregiver/availability',
      icon: Clock,
      description: 'Set your working hours'
    },
    {
      title: 'Job Application',
      href: '/caregiver/application',
      icon: FileText,
      description: 'Complete your application',
      badge: notifications?.applications
    },
    {
      title: 'Background Check',
      href: '/caregiver/background-check',
      icon: Shield,
      description: 'Verification status'
    },
    {
      title: 'Tasks & Documentation',
      href: '/caregiver/tasks',
      icon: CheckSquare,
      description: 'Care task management'
    },
    {
      title: 'Payroll & Earnings',
      href: '/caregiver/payroll',
      icon: DollarSign,
      description: 'Pay stubs and earnings'
    },
    {
      title: 'Training & Certification',
      href: '/caregiver/training',
      icon: GraduationCap,
      description: 'Professional development',
      badge: notifications?.training || notifications?.certifications
    },
    {
      title: 'Profile',
      href: '/caregiver/profile',
      icon: User,
      description: 'Personal information'
    },
    {
      title: 'Settings',
      href: '/caregiver/settings',
      icon: Settings,
      description: 'Account preferences'
    }
  ]

  return (
    <nav className={cn('space-y-2', className)}>
      {navItems.map((item) => {
        const isActive = pathname === item.href
        const Icon = item.icon
        
        return (
          <Link key={item.href} href={item.href}>
            <Button
              variant={isActive ? 'default' : 'ghost'}
              className={cn(
                'w-full justify-start h-auto p-3',
                isActive && 'bg-primary text-primary-foreground'
              )}
            >
              <div className="flex items-center gap-3 w-full">
                <Icon className="h-4 w-4 shrink-0" />
                <div className="flex-1 text-left">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{item.title}</span>
                    {item.badge && item.badge > 0 && (
                      <Badge variant="destructive" className="h-5 px-1.5 text-xs">
                        {item.badge > 99 ? '99+' : item.badge}
                      </Badge>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {item.description}
                  </div>
                </div>
              </div>
            </Button>
          </Link>
        )
      })}
    </nav>
  )
}

// Caregiver-specific status indicators
interface CaregiverStatusProps {
  employmentStatus: 'active' | 'pending' | 'inactive' | 'under_review'
  nextShift?: string
  backgroundCheckStatus: 'pending' | 'in_progress' | 'completed' | 'requires_action'
  certificationsExpiring?: number
}

export function CaregiverStatus({ 
  employmentStatus, 
  nextShift, 
  backgroundCheckStatus,
  certificationsExpiring = 0
}: CaregiverStatusProps) {
  const getEmploymentStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-50'
      case 'pending': return 'text-yellow-600 bg-yellow-50'
      case 'under_review': return 'text-blue-600 bg-blue-50'
      case 'inactive': return 'text-red-600 bg-red-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  const getBackgroundStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-50'
      case 'in_progress': return 'text-blue-600 bg-blue-50'
      case 'requires_action': return 'text-red-600 bg-red-50'
      case 'pending': return 'text-yellow-600 bg-yellow-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  return (
    <div className="p-4 border-b space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-medium">Employment Status</h3>
        <div className={cn(
          'flex items-center gap-2 px-2 py-1 rounded-full text-xs font-medium',
          getEmploymentStatusColor(employmentStatus)
        )}>
          {employmentStatus === 'active' && <CheckSquare className="h-3 w-3" />}
          {employmentStatus === 'pending' && <Clock className="h-3 w-3" />}
          {employmentStatus === 'under_review' && <Timer className="h-3 w-3" />}
          {employmentStatus === 'inactive' && <AlertTriangle className="h-3 w-3" />}
          {employmentStatus.replace('_', ' ').toUpperCase()}
        </div>
      </div>

      {nextShift && (
        <div className="text-sm">
          <span className="text-muted-foreground">Next shift: </span>
          <span className="font-medium">
            {new Date(nextShift).toLocaleDateString('en-US', {
              weekday: 'short',
              month: 'short',
              day: 'numeric',
              hour: 'numeric',
              minute: '2-digit'
            })}
          </span>
        </div>
      )}

      <div className="space-y-2">
        <div className={cn(
          'flex items-center gap-2 px-2 py-1 rounded text-xs',
          getBackgroundStatusColor(backgroundCheckStatus)
        )}>
          <Shield className="h-3 w-3" />
          <span>Background Check: {backgroundCheckStatus.replace('_', ' ')}</span>
        </div>

        {certificationsExpiring > 0 && (
          <div className="flex items-center gap-2 px-2 py-1 rounded text-xs text-red-600 bg-red-50">
            <AlertTriangle className="h-3 w-3" />
            <span>{certificationsExpiring} certification{certificationsExpiring > 1 ? 's' : ''} expiring soon</span>
          </div>
        )}
      </div>
    </div>
  )
}

// Quick stats for caregiver dashboard
interface CaregiverQuickStatsProps {
  stats: {
    weeklyHours: number
    weeklyEarnings: number
    clientRating: number
    shiftsThisWeek: number
  }
}

export function CaregiverQuickStats({ stats }: CaregiverQuickStatsProps) {
  const statItems = [
    {
      label: 'This Week',
      value: stats.weeklyHours,
      suffix: 'h'
    },
    {
      label: 'Earnings',
      value: `$${stats.weeklyEarnings}`,
      suffix: ''
    },
    {
      label: 'Rating',
      value: stats.clientRating,
      suffix: '/5'
    },
    {
      label: 'Shifts',
      value: stats.shiftsThisWeek,
      suffix: ''
    }
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 p-4">
      {statItems.map((stat, index) => (
        <div key={index} className="text-center space-y-1">
          <div className="text-2xl font-bold text-primary">
            {typeof stat.value === 'number' && stat.suffix !== '/5' ? stat.value : stat.value}{stat.suffix}
          </div>
          <div className="text-xs text-muted-foreground">
            {stat.label}
          </div>
        </div>
      ))}
    </div>
  )
}

// Emergency contact component for caregivers
interface CaregiverEmergencyContactProps {
  onEmergencyCall: () => void
  onSupportCall: () => void
}

export function CaregiverEmergencyContact({ onEmergencyCall, onSupportCall }: CaregiverEmergencyContactProps) {
  return (
    <div className="p-4 border-t space-y-3">
      <div className="space-y-2">
        <Button 
          variant="destructive" 
          className="w-full"
          onClick={onEmergencyCall}
        >
          <AlertTriangle className="h-4 w-4 mr-2" />
          Emergency: 911
        </Button>
        <Button 
          variant="outline" 
          className="w-full"
          onClick={onSupportCall}
        >
          <Phone className="h-4 w-4 mr-2" />
          Caregiver Support
        </Button>
      </div>
      <p className="text-xs text-center text-muted-foreground">
        24/7 support: (757) 555-CARE
      </p>
    </div>
  )
}