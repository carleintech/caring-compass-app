'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'

export default function AuthLayoutClient({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    const checkAuth = () => {
      try {
        const token = localStorage.getItem('auth-token')
        if (token && pathname.startsWith('/auth')) {
          router.push('/dashboard')
          return
        }
      } catch (error) {
        console.error('Error checking authentication:', error)
      } finally {
        setIsChecking(false)
      }
    }

    checkAuth()
  }, [router, pathname])

  if (isChecking) {
    return null // Or a loading spinner
  }

  return children
}
