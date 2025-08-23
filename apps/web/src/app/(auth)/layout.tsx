import { Metadata } from 'next'
import AuthLayoutClient from './auth-layout-client'

export const metadata: Metadata = {
  title: 'Authentication | Caring Compass',
  description: 'Sign in to your Caring Compass account',
}

interface AuthLayoutProps {
  children: React.ReactNode
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <AuthLayoutClient>
      <div className="grid min-h-screen grid-cols-1 grid-rows-1 bg-gray-50">
        <div className="col-start-1 row-start-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
          <div className="w-full max-w-md space-y-8">
            <div className="text-center">
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                Caring Compass
              </h1>
              <p className="mt-2 text-sm text-gray-600">
                Home Care Management Platform
              </p>
            </div>
            {children}
          </div>
        </div>
      </div>
    </AuthLayoutClient>
  )
}