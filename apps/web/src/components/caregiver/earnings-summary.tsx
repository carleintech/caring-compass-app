// apps/web/src/components/caregiver/earnings-summary.tsx
'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  DollarSign, 
  Clock, 
  TrendingUp, 
  Calendar,
  Target
} from 'lucide-react'

interface EarningsSummaryProps {
  earnings: {
    currentWeek: {
      hours: number
      gross: number
      shifts: number
    }
    currentMonth: {
      hours: number
      gross: number
      shifts: number
    }
    yearToDate: {
      hours: number
      gross: number
      shifts: number
    }
    goals: {
      weeklyHours: number
      monthlyEarnings: number
    }
  }
}

export function EarningsSummary({ earnings }: EarningsSummaryProps) {
  const weeklyProgress = (earnings.currentWeek.hours / earnings.goals.weeklyHours) * 100
  const monthlyProgress = (earnings.currentMonth.gross / earnings.goals.monthlyEarnings) * 100

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-5 w-5" />
          Earnings Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Week */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">This Week</h3>
            <Badge variant="outline">
              {earnings.currentWeek.shifts} shifts
            </Badge>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-2xl font-bold">${earnings.currentWeek.gross}</p>
              <p className="text-sm text-muted-foreground">Gross earnings</p>
            </div>
            <div>
              <p className="text-2xl font-bold">{earnings.currentWeek.hours}h</p>
              <p className="text-sm text-muted-foreground">Hours worked</p>
            </div>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span>Weekly goal progress</span>
              <span>{Math.round(weeklyProgress)}%</span>
            </div>
            <Progress value={weeklyProgress} className="h-2" />
          </div>
        </div>

        {/* Current Month */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">This Month</h3>
            <Badge variant="outline">
              {earnings.currentMonth.shifts} shifts
            </Badge>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xl font-bold">${earnings.currentMonth.gross}</p>
              <p className="text-sm text-muted-foreground">Gross earnings</p>
            </div>
            <div>
              <p className="text-xl font-bold">{earnings.currentMonth.hours}h</p>
              <p className="text-sm text-muted-foreground">Hours worked</p>
            </div>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span>Monthly goal progress</span>
              <span>{Math.round(monthlyProgress)}%</span>
            </div>
            <Progress value={monthlyProgress} className="h-2" />
          </div>
        </div>

        {/* Year to Date */}
        <div className="space-y-3">
          <h3 className="font-medium">Year to Date</h3>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-lg font-bold">${earnings.yearToDate.gross.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">Total earnings</p>
            </div>
            <div>
              <p className="text-lg font-bold">{earnings.yearToDate.hours}</p>
              <p className="text-xs text-muted-foreground">Total hours</p>
            </div>
            <div>
              <p className="text-lg font-bold">{earnings.yearToDate.shifts}</p>
              <p className="text-xs text-muted-foreground">Total shifts</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}