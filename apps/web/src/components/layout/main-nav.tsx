'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Menu, Phone, Mail } from 'lucide-react'

const publicNavItems = [
  {
    title: 'Home',
    href: '/',
  },
  {
    title: 'Services',
    href: '/services',
    description: 'Learn about our comprehensive home care services',
    items: [
      {
        title: 'Personal Care',
        href: '/services/personal-care',
        description: 'Assistance with daily living activities',
      },
      {
        title: 'Companionship',
        href: '/services/companionship',
        description: 'Social support and emotional care',
      },
      {
        title: 'Specialized Care',
        href: '/services/specialized-care',
        description: 'Memory care and specialized assistance',
      },
    ],
  },
  {
    title: 'About',
    href: '/about',
  },
  {
    title: 'Careers',
    href: '/careers',
  },
  {
    title: 'Contact',
    href: '/contact',
  },
]

const authNavItems = [
  {
    title: 'Dashboard',
    href: '/dashboard',
  },
  {
    title: 'My Care',
    href: '/client',
    roles: ['CLIENT', 'FAMILY'],
  },
  {
    title: 'My Shifts',
    href: '/caregiver',
    roles: ['CAREGIVER'],
  },
  {
    title: 'Administration',
    href: '/admin',
    roles: ['ADMIN', 'COORDINATOR'],
  },
]

interface MainNavProps {
  isAuthenticated?: boolean
  userRole?: string
}

export function MainNav({ isAuthenticated = false, userRole }: MainNavProps) {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = React.useState(false)

  const navItems = isAuthenticated ? authNavItems : publicNavItems
  const filteredNavItems = navItems.filter(item => 
    !item.roles || item.roles.includes(userRole || '')
  )

  return (
    <div className="flex items-center space-x-4 lg:space-x-6">
      {/* Desktop Navigation */}
      <NavigationMenu className="hidden lg:flex">
        <NavigationMenuList>
          {filteredNavItems.map((item) => (
            <NavigationMenuItem key={item.title}>
              {item.items ? (
                <>
                  <NavigationMenuTrigger>{item.title}</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                      {item.items.map((subItem) => (
                        <ListItem
                          key={subItem.title}
                          title={subItem.title}
                          href={subItem.href}
                        >
                          {subItem.description}
                        </ListItem>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </>
              ) : (
                <Link href={item.href} legacyBehavior passHref>
                  <NavigationMenuLink
                    className={cn(
                      navigationMenuTriggerStyle(),
                      pathname === item.href && 'bg-accent text-accent-foreground'
                    )}
                  >
                    {item.title}
                  </NavigationMenuLink>
                </Link>
              )}
            </NavigationMenuItem>
          ))}
        </NavigationMenuList>
      </NavigationMenu>

      {/* Mobile Navigation */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild className="lg:hidden">
          <Button variant="ghost" size="icon">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[300px] sm:w-[400px]">
          <nav className="flex flex-col space-y-4">
            <div className="mb-4 border-b pb-4">
              <h2 className="text-lg font-semibold">Navigation</h2>
            </div>
            
            {filteredNavItems.map((item) => (
              <div key={item.title}>
                {item.items ? (
                  <div className="space-y-2">
                    <h3 className="font-medium">{item.title}</h3>
                    <div className="ml-4 space-y-1">
                      {item.items.map((subItem) => (
                        <Link
                          key={subItem.title}
                          href={subItem.href}
                          className={cn(
                            'block rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground',
                            pathname === subItem.href && 'bg-accent text-accent-foreground'
                          )}
                          onClick={() => setIsOpen(false)}
                        >
                          {subItem.title}
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : (
                  <Link
                    href={item.href}
                    className={cn(
                      'block rounded-md px-3 py-2 font-medium transition-colors hover:bg-accent hover:text-accent-foreground',
                      pathname === item.href && 'bg-accent text-accent-foreground'
                    )}
                    onClick={() => setIsOpen(false)}
                  >
                    {item.title}
                  </Link>
                )}
              </div>
            ))}
            
            {!isAuthenticated && (
              <div className="mt-6 space-y-3 border-t pt-6">
                <Button asChild className="w-full">
                  <Link href="/auth/login">Sign In</Link>
                </Button>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" asChild className="flex-1">
                    <Link href="tel:+1-757-555-0123">
                      <Phone className="mr-2 h-4 w-4" />
                      Call
                    </Link>
                  </Button>
                  <Button variant="outline" size="sm" asChild className="flex-1">
                    <Link href="mailto:info@caringcompass.com">
                      <Mail className="mr-2 h-4 w-4" />
                      Email
                    </Link>
                  </Button>
                </div>
              </div>
            )}
          </nav>
        </SheetContent>
      </Sheet>
    </div>
  )
}

const ListItem = React.forwardRef<
  React.ElementRef<'a'>,
  React.ComponentPropsWithoutRef<'a'> & { title: string }
>(({ className, title, children, href, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <Link
          ref={ref}
          href={href || '#'}
          className={cn(
            'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  )
})
ListItem.displayName = 'ListItem'