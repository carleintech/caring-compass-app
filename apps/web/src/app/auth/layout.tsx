import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Authentication - Caring Compass',
  description: 'Sign in to your Caring Compass account',
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        {children}
      </div>
    </div>
  )
}