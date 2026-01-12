'use client'

import { ReactNode } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Heart } from 'lucide-react'

interface NavItem {
  label: string
  href: string
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
}

interface AppShellProps {
  children: ReactNode
  navItems: NavItem[]
  title: string
  subtitle?: string
  badge?: string
}

export function AppShell({
  children,
  navItems,
  title,
  subtitle,
  badge,
}: AppShellProps) {
  const pathname = usePathname()

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="hidden md:flex md:w-64 lg:w-72 flex-col border-r bg-white">
        <div className="h-16 px-6 border-b flex items-center gap-2">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-indigo-500 to-sky-500 flex items-center justify-center text-white">
            <Heart className="h-5 w-5 fill-white" />
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-slate-900">Caring Compass</span>
            <span className="text-xs text-slate-500">Home Care Platform</span>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const active = pathname.startsWith(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all',
                  active
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                )}
              >
                <Icon className={cn('h-4 w-4', active ? 'text-indigo-600' : 'text-slate-400')} />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>

        <div className="px-4 py-4 border-t text-xs text-slate-500">
          HIPAA-ready · Secure by design
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="h-16 border-b bg-white flex items-center justify-between px-4 md:px-8">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <h1 className="text-lg md:text-xl font-semibold text-slate-900">{title}</h1>
              {badge && (
                <span className="inline-flex items-center rounded-full bg-indigo-50 px-2 py-0.5 text-[11px] font-medium text-indigo-700">
                  {badge}
                </span>
              )}
            </div>
            {subtitle && (
              <p className="text-xs md:text-sm text-slate-500">{subtitle}</p>
            )}
          </div>

          <div className="flex items-center gap-4">
            <button className="text-xs md:text-sm text-slate-600 hover:text-slate-900">
              Help
            </button>
            <div className="h-9 w-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 text-white flex items-center justify-center text-xs font-semibold">
              CC
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 md:p-8">{children}</main>
      </div>
    </div>
  )
}
