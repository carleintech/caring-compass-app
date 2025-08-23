// apps/web/src/components/admin/system-health.tsx
'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { 
  Server, 
  Database, 
  Wifi, 
  HardDrive, 
  Cpu, 
  AlertTriangle,
  CheckCircle,
  RefreshCw
} from 'lucide-react'

interface SystemMetric {
  name: string
  status: 'healthy' | 'warning' | 'critical'
  value?: number
  maxValue?: number
  details?: string
  lastChecked: Date
}

interface SystemHealthProps {
  metrics: SystemMetric[]
  onRefresh?: () => void
}

export function SystemHealth({ metrics, onRefresh }: SystemHealthProps) {
  const getStatusIcon = (status: SystemMetric['status']) => {
    switch (status) {
      case 'healthy': return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case 'critical': return <AlertTriangle className="h-4 w-4 text-red-500" />
    }
  }

  const getStatusColor = (status: SystemMetric['status']) => {
    switch (status) {
      case 'healthy': return 'bg-green-100 text-green-800 border-green-200'
      case 'warning': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'critical': return 'bg-red-100 text-red-800 border-red-200'
    }
  }

  const getMetricIcon = (name: string) => {
    const iconName = name.toLowerCase()
    if (iconName.includes('database')) return <Database className="h-5 w-5" />
    if (iconName.includes('api') || iconName.includes('server')) return <Server className="h-5 w-5" />
    if (iconName.includes('network') || iconName.includes('connectivity')) return <Wifi className="h-5 w-5" />
    if (iconName.includes('storage') || iconName.includes('disk')) return <HardDrive className="h-5 w-5" />
    if (iconName.includes('cpu') || iconName.includes('memory')) return <Cpu className="h-5 w-5" />
    return <Server className="h-5 w-5" />
  }

  const formatLastChecked = (date: Date) => {
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
    
    if (diffInMinutes < 1) return 'Just now'
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    return `${Math.floor(diffInMinutes / 60)}h ago`
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>System Health</CardTitle>
        {onRefresh && (
          <Button variant="outline" size="sm" onClick={onRefresh}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {metrics.map((metric, index) => (
            <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center space-x-3">
                {getMetricIcon(metric.name)}
                <div>
                  <p className="font-medium text-sm">{metric.name}</p>
                  {metric.details && (
                    <p className="text-xs text-muted-foreground">{metric.details}</p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Last checked: {formatLastChecked(metric.lastChecked)}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                {metric.value !== undefined && metric.maxValue && (
                  <div className="text-right">
                    <p className="text-sm font-medium">
                      {Math.round((metric.value / metric.maxValue) * 100)}%
                    </p>
                    <Progress 
                      value={(metric.value / metric.maxValue) * 100} 
                      className="w-20 h-2"
                    />
                  </div>
                )}
                <div className="flex items-center space-x-2">
                  {getStatusIcon(metric.status)}
                  <Badge className={getStatusColor(metric.status)} variant="outline">
                    {metric.status}
                  </Badge>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}