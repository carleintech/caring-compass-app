// apps/web/src/components/client/care-task-tracker.tsx
'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, Clock, Target } from 'lucide-react'

interface CareTask {
  id: string
  name: string
  category: 'personal-care' | 'medication' | 'mobility' | 'nutrition' | 'social'
  frequency: 'daily' | 'weekly' | 'monthly'
  completedThisWeek: number
  targetPerWeek: number
  status: 'on-track' | 'needs-attention' | 'completed'
}

interface CareTaskTrackerProps {
  tasks: CareTask[]
}

export function CareTaskTracker({ tasks }: CareTaskTrackerProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'success'
      case 'on-track': return 'default'
      case 'needs-attention': return 'destructive'
      default: return 'default'
    }
  }

  const getCategoryIcon = (category: string) => {
    // You can add specific icons for each category
    return <Target className="h-4 w-4" />
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle className="h-5 w-5" />
          Care Task Progress
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {tasks.map((task) => {
          const progressPercentage = (task.completedThisWeek / task.targetPerWeek) * 100
          
          return (
            <div key={task.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getCategoryIcon(task.category)}
                  <span className="font-medium">{task.name}</span>
                  <Badge variant="outline" className="text-xs">
                    {task.frequency}
                  </Badge>
                </div>
                <Badge variant={getStatusColor(task.status) as any}>
                  {task.status.replace('-', ' ')}
                </Badge>
              </div>
              
              <div className="space-y-1">
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>{task.completedThisWeek} of {task.targetPerWeek} this week</span>
                  <span>{Math.round(progressPercentage)}%</span>
                </div>
                <Progress value={progressPercentage} className="h-2" />
              </div>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}