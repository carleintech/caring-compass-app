// apps/web/src/components/admin/dashboard-grid.tsx
'use client'

import React from 'react'
import { cn } from '@/lib/utils'

interface DashboardGridProps {
  children: React.ReactNode
  className?: string
  columns?: 1 | 2 | 3 | 4 | 5 | 6
}

export function DashboardGrid({ 
  children, 
  className, 
  columns = 4 
}: DashboardGridProps) {
  const gridClass = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
    5: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5',
    6: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6'
  }

  return (
    <div className={cn('grid gap-4', gridClass[columns], className)}>
      {children}
    </div>
  )
}