import { ReactNode } from 'react'
import { RoleProtectedRoute } from '@/components/auth/RoleProtectedRoute'
import { AppShell } from '@/components/layout/AppShell'
import { HomeIcon, Users, CalendarDays, ClipboardList, MessageSquare, Settings } from 'lucide-react'

const adminNav = [
  { label: 'Overview', href: '/admin/dashboard', icon: HomeIcon },
  { label: 'Caregivers', href: '/admin/caregivers', icon: Users },
  { label: 'Clients', href: '/admin/clients', icon: Users },
  { label: 'Scheduling', href: '/admin/scheduling', icon: CalendarDays },
  { label: 'Visit Logs', href: '/admin/visits', icon: ClipboardList },
  { label: 'Messages', href: '/admin/messages', icon: MessageSquare },
  { label: 'Settings', href: '/admin/settings', icon: Settings },
]

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <RoleProtectedRoute allowedRoles={['ADMIN']}>
      <AppShell
        navItems={adminNav}
        title="Admin Console"
        subtitle="Agency-wide overview, staffing, and compliance"
        badge="Admin"
      >
        {children}
      </AppShell>
    </RoleProtectedRoute>
  )
}
