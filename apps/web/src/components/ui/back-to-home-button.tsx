'use client'

import { Button } from '@/components/ui/button'
import { ArrowLeft, Home } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

interface BackToHomeButtonProps {
  className?: string
  variant?: 'default' | 'outline' | 'ghost' | 'link'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  showIcon?: boolean
  children?: React.ReactNode
}

export function BackToHomeButton({ 
  className,
  variant = 'outline',
  size = 'default',
  showIcon = true,
  children = 'Back to Home'
}: BackToHomeButtonProps) {
  return (
    <Button
      variant={variant}
      size={size}
      className={cn('gap-2', className)}
      asChild
    >
      <Link href="/">
        {showIcon && <ArrowLeft className="h-4 w-4" />}
        {children}
      </Link>
    </Button>
  )
}

export function HomeButton({ 
  className,
  variant = 'outline',
  size = 'default'
}: Omit<BackToHomeButtonProps, 'showIcon' | 'children'>) {
  return (
    <Button
      variant={variant}
      size={size}
      className={cn('gap-2', className)}
      asChild
    >
      <Link href="/">
        <Home className="h-4 w-4" />
        Home
      </Link>
    </Button>
  )
}
