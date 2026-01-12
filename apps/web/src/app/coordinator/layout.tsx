import { ReactNode } from 'react'
import { RoleProtectedRoute } from '@/components/auth/RoleProtectedRoute'
import { AppShell } from '@/components/layout/AppShell'
import { HomeIcon, Users, CalendarDays, ClipboardList, MessageSquare } from 'lucide-react'

const coordinatorNav = [
  { label: 'Overview', href: '/coordinator/dashboard', icon: HomeIcon },
  { label: 'My Caregivers', href: '/coordinator/caregivers', icon: Users },
  { label: 'My Clients', href: '/coordinator/clients', icon: Users },
  { label: 'Schedule', href: '/coordinator/scheduling', icon: CalendarDays },
  { label: 'Visit Logs', href: '/coordinator/visits', icon: ClipboardList },
  { label: 'Messages', href: '/coordinator/messages', icon: MessageSquare },
]

export default function CoordinatorLayout({ children }: { children: ReactNode }) {
  return (
    <RoleProtectedRoute allowedRoles={['COORDINATOR']}>
      <AppShell
        navItems={coordinatorNav}
        title="Coordinator Workspace"
        subtitle="Manage caregivers, clients, and daily schedules"
        badge="Coordinator"
      >
        {children}
      </AppShell>
    </RoleProtectedRoute>
  )
}
