// apps/web/src/components/caregiver/performance-metrics.tsx
'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  Star, 
  TrendingUp, 
  Clock, 
  CheckCircle,
  Target,
  Award
} from 'lucide-react'

interface PerformanceMetricsProps {
  metrics: {
    overallRating: number
    totalReviews: number
    onTimePercentage: number
    completionRate: number
    clientRetention: number
    monthlyGoals: {
      hoursTarget: number
      hoursCompleted: number
      shiftsTarget: number
      shiftsCompleted: number
    }
  }
}

export function PerformanceMetrics({ metrics }: PerformanceMetricsProps) {
  const hoursProgress = (metrics.monthlyGoals.hoursCompleted / metrics.monthlyGoals.hoursTarget) * 100
  const shiftsProgress = (metrics.monthlyGoals.shiftsCompleted / metrics.monthlyGoals.shiftsTarget) * 100

  const getPerformanceColor = (value: number, threshold: number = 90) => {
    if (value >= threshold) return 'text-green-600'
    if (value >= threshold - 10) return 'text-yellow-600'
    return 'text-red-600'
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Performance Metrics
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Rating */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2">
            <div className="flex">
              {Array.from({ length: 5 }, (_, i) => (
                <Star
                  key={i}
                  className={`h-6 w-6 ${
                    i < Math.floor(metrics.overallRating) 
                      ? 'fill-yellow-400 text-yellow-400' 
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-2xl font-bold">{metrics.overallRating.toFixed(1)}</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Based on {metrics.totalReviews} client reviews
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="space-y-1">
            <p className={`text-xl font-bold ${getPerformanceColor(metrics.onTimePercentage)}`}>
              {metrics.onTimePercentage}%
            </p>
            <p className="text-xs text-muted-foreground">On-Time Rate</p>
          </div>
          <div className="space-y-1">
            <p className={`text-xl font-bold ${getPerformanceColor(metrics.completionRate)}`}>
              {metrics.completionRate}%
            </p>
            <p className="text-xs text-muted-foreground">Completion Rate</p>
          </div>
          <div className="space-y-1">
            <p className={`text-xl font-bold ${getPerformanceColor(metrics.clientRetention, 85)}`}>
              {metrics.clientRetention}%
            </p>
            <p className="text-xs text-muted-foreground">Client Retention</p>
          </div>
        </div>

        {/* Monthly Goals */}
        <div className="space-y-4">
          <h4 className="font-medium">Monthly Goals</h4>
          
          <div className="space-y-3">
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span>Hours Goal</span>
                <span>{metrics.monthlyGoals.hoursCompleted}/{metrics.monthlyGoals.hoursTarget} hours</span>
              </div>
              <Progress value={hoursProgress} className="h-2" />
            </div>
            
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span>Shifts Goal</span>
                <span>{metrics.monthlyGoals.shiftsCompleted}/{metrics.monthlyGoals.shiftsTarget} shifts</span>
              </div>
              <Progress value={shiftsProgress} className="h-2" />
            </div>
          </div>
        </div>

        {/* Performance Badges */}
        {metrics.overallRating >= 4.8 && (
          <div className="flex justify-center">
            <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
              <Award className="h-3 w-3 mr-1" />
              Top Performer
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Export all components
export { 
  ShiftCard, 
  EarningsSummary, 
  CertificationStatus, 
  AvailabilityQuickUpdate, 
  PerformanceMetrics 
}