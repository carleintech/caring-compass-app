// apps/web/src/components/admin/quick-stats.tsx
'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'

interface QuickStatsProps {
  title: string
  stats: Array<{
    label: string
    value: number
    total?: number
    color?: string
    badge?: string
  }>
}

export function QuickStats({ title, stats }: QuickStatsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {stats.map((stat, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">{stat.label}</span>
                <div className="flex items-center space-x-2">
                  {stat.badge && (
                    <Badge variant="secondary" className="text-xs">
                      {stat.badge}
                    </Badge>
                  )}
                  <span className="text-sm">
                    {stat.total ? `${stat.value}/${stat.total}` : stat.value}
                  </span>
                </div>
              </div>
              {stat.total && (
                <Progress 
                  value={(stat.value / stat.total) * 100} 
                  className="h-2"
                />
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}