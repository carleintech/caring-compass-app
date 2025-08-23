'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { useMobileResponsive } from '@/hooks/use-mobile-responsive'
import { 
  Menu, 
  X, 
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
  ChevronRight
} from 'lucide-react'

interface MobileNavItem {
  title: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  description?: string
  badge?: number
}

interface MobileNavProps {
  items: MobileNavItem[]
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

export function MobileNav({ items, user, notifications }: MobileNavProps) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const { isMobile } = useMobileResponsive()

  // Close sheet on route change
  useEffect(() => {
    setOpen(false)
  }, [pathname])

  const getTotalNotifications = () => {
    if (!notifications) return 0
    return notifications.messages + notifications.appointments + notifications.billing
  }

  if (!isMobile) return null

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="fixed top-4 left-4 z-50 bg-background/80 backdrop-blur-sm"
          aria-label="Toggle navigation"
        >
          {open ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </Button>
      </SheetTrigger>
      
      <SheetContent side="left" className="w-full max-w-sm p-0">
        <ScrollArea className="h-full">
          {/* Header */}
          <div className="border-b p-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Menu</h2>
              {getTotalNotifications() > 0 && (
                <Badge variant="destructive" className="ml-auto">
                  {getTotalNotifications()}
                </Badge>
              )}
            </div>
            {user && (
              <div className="mt-3">
                <p className="text-sm font-medium">{user.name}</p>
                <p className="text-xs text-muted-foreground">{user.email}</p>
              </div>
            )}
          </div>

          {/* Navigation Items */}
          <nav className="p-4">
            <ul className="space-y-1">
              {items.map((item) => {
                const isActive = pathname === item.href
                const Icon = item.icon
                
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        'flex items-center justify-between rounded-lg p-3 transition-colors',
                        'hover:bg-accent hover:text-accent-foreground',
                        isActive && 'bg-primary text-primary-foreground'
                      )}
                    >
                      <div className="flex items-center space-x-3">
                        <Icon className="h-5 w-5" />
                        <div>
                          <p className="font-medium">{item.title}</p>
                          {item.description && (
                            <p className="text-xs text-muted-foreground">
                              {item.description}
                            </p>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        {item.badge && item.badge > 0 && (
                          <Badge variant="destructive" className="h-5 px-1.5 text-xs">
                            {item.badge > 99 ? '99+' : item.badge}
                          </Badge>
                        )}
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>

          {/* Emergency Contact */}
          <div className="border-t p-4">
            <Button 
              variant="destructive" 
              className="w-full"
              asChild
            >
              <a href="tel:+17575550123">
                Emergency Contact
              </a>
            </Button>
            <p className="text-xs text-center text-muted-foreground mt-2">
              24/7 support: (757) 555-0123
            </p>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}

// Mobile-optimized navigation wrapper
export function MobileNavWrapper({ children }: { children: React.ReactNode }) {
  const { isMobile } = useMobileResponsive()
  
  if (!isMobile) return <>{children}</>
  
  return (
    <div className="pb-16">
      {children}
    </div>
  )
}

// Bottom navigation for mobile
interface BottomNavProps {
  items: Array<{
    title: string
    href: string
    icon: React.ComponentType<{ className?: string }>
  }>
}

export function BottomNav({ items }: BottomNavProps) {
  const pathname = usePathname()
  const { isMobile } = useMobileResponsive()
  
  if (!isMobile) return null
  
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t bg-background/95 backdrop-blur-sm">
      <div className="flex items-center justify-around">
        {items.slice(0, 5).map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center justify-center py-2 px-1 flex-1',
                'transition-colors hover:bg-accent',
                isActive && 'text-primary'
              )}
            >
              <Icon className="h-5 w-5 mb-1" />
              <span className="text-xs">{item.title}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
