import { SiteHeader } from './site-header'
import { SiteFooter } from './site-footer'
import { ErrorBoundary } from '@/components/ui/error-boundary'
import { cn } from '@/lib/utils'

interface PageLayoutProps {
  children: React.ReactNode
  className?: string
  user?: {
    id: string
    name: string
    email: string
    role: string
    avatar?: string
  }
  isAuthenticated?: boolean
  showFooter?: boolean
  maxWidth?: 'full' | 'container'
}

export function PageLayout({
  children,
  className,
  user,
  isAuthenticated = false,
  showFooter = true,
  maxWidth = 'container',
}: PageLayoutProps) {
  return (
    <div className="relative flex min-h-screen flex-col">
      <SiteHeader user={user} isAuthenticated={isAuthenticated} />
      
      <main 
        id="main-content"
        className={cn(
          'flex-1',
          maxWidth === 'container' && 'container-responsive',
          className
        )}
      >
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
      </main>
      
      {showFooter && <SiteFooter />}
    </div>
  )
}

// Specialized layout for authenticated dashboard pages
interface DashboardLayoutProps {
  children: React.ReactNode
  className?: string
  user: {
    id: string
    name: string
    email: string
    role: string
    avatar?: string
  }
  sidebar?: React.ReactNode
  header?: React.ReactNode
}

export function DashboardLayout({
  children,
  className,
  user,
  sidebar,
  header,
}: DashboardLayoutProps) {
  return (
    <div className="relative flex min-h-screen flex-col">
      <SiteHeader user={user} isAuthenticated={true} />
      
      <div className="flex flex-1">
        {sidebar && (
          <aside className="dashboard-sidebar">
            {sidebar}
          </aside>
        )}
        
        <div className="flex flex-1 flex-col">
          {header && (
            <div className="dashboard-header">
              {header}
            </div>
          )}
          
          <main 
            id="main-content"
            className={cn('dashboard-main', className)}
          >
            <ErrorBoundary>
              {children}
            </ErrorBoundary>
          </main>
        </div>
      </div>
    </div>
  )
}

// Specialized layout for authentication pages
interface AuthLayoutProps {
  children: React.ReactNode
  className?: string
}

export function AuthLayout({ children, className }: AuthLayoutProps) {
  return (
    <div className="relative flex min-h-screen flex-col">
      <SiteHeader isAuthenticated={false} />
      
      <main 
        id="main-content"
        className={cn(
          'flex flex-1 items-center justify-center px-4 py-12',
          className
        )}
      >
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
      </main>
      
      <SiteFooter />
    </div>
  )
}

// Specialized layout for public marketing pages
interface MarketingLayoutProps {
  children: React.ReactNode
  className?: string
  hero?: React.ReactNode
}

export function MarketingLayout({ 
  children, 
  className,
  hero 
}: MarketingLayoutProps) {
  return (
    <div className="relative flex min-h-screen flex-col">
      <SiteHeader isAuthenticated={false} />
      
      {hero && (
        <section className="relative">
          {hero}
        </section>
      )}
      
      <main 
        id="main-content"
        className={cn('flex-1', className)}
      >
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
      </main>
      
      <SiteFooter />
    </div>
  )
}