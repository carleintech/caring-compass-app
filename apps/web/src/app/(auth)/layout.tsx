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
      <div className="min-h-screen w-full bg-gray-50 flex items-center justify-center">
        {children}
      </div>
    </AuthLayoutClient>
  )
}