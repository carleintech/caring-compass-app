'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import { useMobileResponsive } from '@/hooks/use-mobile-responsive'
import { MobileNav, MobileNavWrapper, BottomNav } from './mobile-nav'

interface MobileOptimizedLayoutProps {
  children: React.ReactNode
  navItems?: Array<{
    title: string
    href: string
    icon: React.ComponentType<{ className?: string }>
  }>
  user?: {
    name: string
    email: string
    avatar?: string
  }
  notifications?: {
    messages: number
    appointments: number
    billing: number
  }
}

export function MobileOptimizedLayout({
  children,
  navItems = [],
  user,
  notifications
}: MobileOptimizedLayoutProps) {
  const { isMobile } = useMobileResponsive()

  if (!isMobile) {
    return <>{children}</>
  }

  return (
    <MobileNavWrapper>
      <div className="min-h-screen bg-background">
        {children}
      </div>
      
      {navItems.length > 0 && (
        <BottomNav items={navItems} />
      )}
      
      <MobileNav 
        items={navItems} 
        user={user} 
        notifications={notifications} 
      />
    </MobileNavWrapper>
  )
}

// Hook for mobile-specific navigation
export function useMobileNavigation() {
  const { isMobile } = useMobileResponsive()
  
  const mobileNavItems = [
    {
      title: 'Dashboard',
      href: '/dashboard',
      icon: ({ className }: { className?: string }) => (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5a2 2 0 012 2v2a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2z" />
        </svg>
      )
    },
    {
      title: 'Patients',
      href: '/patients',
      icon: ({ className }: { className?: string }) => (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      )
    },
    {
      title: 'Appointments',
      href: '/appointments',
      icon: ({ className }: { className?: string }) => (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      )
    },
    {
      title: 'Billing',
      href: '/billing',
      icon: ({ className }: { className?: string }) => (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
      )
    },
    {
      title: 'Messages',
      href: '/messages',
      icon: ({ className }: { className?: string }) => (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      )
    }
  ]

  return {
    isMobile,
    mobileNavItems,
    MobileOptimizedLayout
  }
}
