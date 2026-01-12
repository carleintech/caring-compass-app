'use client'

import { ReactNode, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { trpc } from '@/lib/trpc'

type AllowedRole = 'ADMIN' | 'COORDINATOR' | 'CAREGIVER' | 'CLIENT' | 'FAMILY'

interface RoleProtectedRouteProps {
  children: ReactNode
  allowedRoles: AllowedRole[]
  redirectTo?: string
}

export function RoleProtectedRoute({
  children,
  allowedRoles,
  redirectTo = '/login',
}: RoleProtectedRouteProps) {
  const router = useRouter()

  // Get current user from auth.me endpoint
  const { data, isLoading, error } = (trpc as any).auth.me.useQuery(undefined, {
    retry: false,
  })

  useEffect(() => {
    if (!isLoading) {
      if (!data?.user || error) {
        router.replace(redirectTo)
        return
      }

      if (!allowedRoles.includes(data.user.role as AllowedRole)) {
        router.replace('/not-authorized')
      }
    }
  }, [data, isLoading, error, router, allowedRoles, redirectTo])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="h-6 w-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-slate-600">Checking your access…</p>
        </div>
      </div>
    )
  }

  if (!data?.user || !allowedRoles.includes(data.user.role as AllowedRole)) {
    return null
  }

  return <>{children}</>
}
