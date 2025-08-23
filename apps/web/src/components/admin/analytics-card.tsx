// apps/web/src/components/admin/analytics-card.tsx
'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

interface AnalyticsCardProps {
  title: string
  value: string | number
  change?: {
    value: number
    period: string
    type: 'increase' | 'decrease' | 'neutral'
  }
  icon?: React.ReactNode
  description?: string
  className?: string
}

export function AnalyticsCard({ 
  title, 
  value, 
  change, 
  icon, 
  description, 
  className 
}: AnalyticsCardProps) {
  const getTrendIcon = () => {
    if (!change) return null
    
    switch (change.type) {
      case 'increase': return <TrendingUp className="h-3 w-3 text-green-500" />
      case 'decrease': return <TrendingDown className="h-3 w-3 text-red-500" />
      case 'neutral': return <Minus className="h-3 w-3 text-gray-500" />
    }
  }

  const getTrendColor = () => {
    if (!change) return ''
    
    switch (change.type) {
      case 'increase': return 'text-green-600'
      case 'decrease': return 'text-red-600'
      case 'neutral': return 'text-gray-600'
    }
  }

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon && <div className="text-muted-foreground">{icon}</div>}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {change && (
          <p className={`text-xs flex items-center ${getTrendColor()}`}>
            {getTrendIcon()}
            <span className="ml-1">
              {Math.abs(change.value)}% from {change.period}
            </span>
          </p>
        )}
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
      </CardContent>
    </Card>
  )
}