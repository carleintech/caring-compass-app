'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'

// Helper function to decode JWT and get user role
function getUserRoleFromToken(token: string): string | null {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    return payload.role || null
  } catch {
    return null
  }
}

// Get role-specific dashboard path
function getRoleDashboard(role: string): string {
  switch (role) {
    case 'ADMIN':
    case 'COORDINATOR':
      return '/admin/dashboard'
    case 'CAREGIVER':
      return '/caregiver/dashboard'
    case 'CLIENT':
    case 'FAMILY':
      return '/client/dashboard'
    default:
      return '/login'
  }
}

export default function AuthLayoutClient({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    const checkAuth = () => {
      try {
        const token = localStorage.getItem('auth-token')
        if (token && pathname.startsWith('/auth')) {
          // Get user role from token and redirect to appropriate dashboard
          const role = getUserRoleFromToken(token)
          const dashboardPath = role ? getRoleDashboard(role) : '/login'
          router.push(dashboardPath)
          return
        }
      } catch (error) {
        console.error('Error checking authentication:', error)
      } finally {
        setIsChecking(false)
      }
    }

    checkAuth()
  }, [router, pathname])

  if (isChecking) {
    return null // Or a loading spinner
  }

  return children
}
