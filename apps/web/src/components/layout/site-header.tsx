'use client'

import * as React from 'react'
import Link from 'next/link'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { MainNav } from './main-nav'
import { 
  Moon, 
  Sun, 
  User, 
  Settings, 
  LogOut, 
  Phone, 
  Mail,
  Heart,
  Bell
} from 'lucide-react'
import { getInitials } from '@/lib/utils'

interface SiteHeaderProps {
  user?: {
    id: string
    name: string
    email: string
    role: string
    avatar?: string
  }
  isAuthenticated?: boolean
}

export function SiteHeader({ user, isAuthenticated = false }: SiteHeaderProps) {
  const { setTheme, theme } = useTheme()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container-responsive flex h-16 items-center justify-between">
        {/* Logo and Company Name */}
        <div className="flex items-center space-x-4">
          <Link href="/" className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-caring">
              <Heart className="h-4 w-4 text-white" />
            </div>
            <div className="hidden sm:block">
              <span className="text-lg font-bold">Caring Compass</span>
              <span className="ml-2 hidden text-sm text-muted-foreground lg:inline">
                Home Care
              </span>
            </div>
          </Link>
        </div>

        {/* Main Navigation */}
        <MainNav 
          isAuthenticated={isAuthenticated} 
          userRole={user?.role}
        />

        {/* Right Side Actions */}
        <div className="flex items-center space-x-2">
          {/* Contact Info for Public Site */}
          {!isAuthenticated && (
            <div className="hidden items-center space-x-2 lg:flex">
              <Button variant="ghost" size="sm" asChild>
                <Link href="tel:+1-757-555-0123">
                  <Phone className="mr-1 h-3 w-3" />
                  <span className="text-xs">(757) 555-0123</span>
                </Link>
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <Link href="mailto:info@caringcompass.com">
                  <Mail className="mr-1 h-3 w-3" />
                  <span className="text-xs">Contact</span>
                </Link>
              </Button>
            </div>
          )}

          {/* Notifications for Authenticated Users */}
          {isAuthenticated && (
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-4 w-4" />
              <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-red-500" />
              <span className="sr-only">Notifications</span>
            </Button>
          )}

          {/* Theme Toggle */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setTheme('light')}>
                Light
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme('dark')}>
                Dark
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme('system')}>
                System
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Menu or Auth Buttons */}
          {isAuthenticated && user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback>
                      {getInitials(user.name)}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                    <div className="pt-1">
                      <Badge variant="secondary" className="text-xs">
                        {user.role.toLowerCase().replace('_', ' ')}
                      </Badge>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center space-x-2">
              <Button variant="ghost" asChild>
                <Link href="/auth/login">Sign In</Link>
              </Button>
              <Button asChild>
                <Link href="/request-care">Request Care</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}