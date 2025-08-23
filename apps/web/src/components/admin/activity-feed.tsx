// apps/web/src/components/admin/activity-feed.tsx
'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { 
  UserPlus, 
  Calendar, 
  DollarSign, 
  AlertCircle, 
  CheckCircle,
  Clock,
  Phone,
  Mail
} from 'lucide-react'

interface ActivityItem {
  id: string
  type: 'user_signup' | 'visit_completed' | 'payment_received' | 'alert' | 'call' | 'email'
  title: string
  description: string
  timestamp: Date
  user?: {
    name: string
    avatar?: string
  }
  priority?: 'low' | 'medium' | 'high'
}

interface ActivityFeedProps {
  activities: ActivityItem[]
  maxItems?: number
}

export function ActivityFeed({ activities, maxItems = 10 }: ActivityFeedProps) {
  const getActivityIcon = (type: ActivityItem['type']) => {
    switch (type) {
      case 'user_signup': return <UserPlus className="h-4 w-4 text-blue-500" />
      case 'visit_completed': return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'payment_received': return <DollarSign className="h-4 w-4 text-emerald-500" />
      case 'alert': return <AlertCircle className="h-4 w-4 text-red-500" />
      case 'call': return <Phone className="h-4 w-4 text-purple-500" />
      case 'email': return <Mail className="h-4 w-4 text-blue-500" />
      default: return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200'
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'low': return 'bg-green-100 text-green-800 border-green-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const formatTimeAgo = (date: Date) => {
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${diffInHours}h ago`
    return `${Math.floor(diffInHours / 24)}d ago`
  }

  const displayActivities = activities.slice(0, maxItems)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {displayActivities.map((activity) => (
            <div key={activity.id} className="flex items-start space-x-4 p-3 border rounded-lg">
              <div className="mt-1">
                {getActivityIcon(activity.type)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{activity.title}</p>
                <p className="text-sm text-muted-foreground">{activity.description}</p>
                <div className="flex items-center mt-2 space-x-2">
                  <span className="text-xs text-muted-foreground">
                    {formatTimeAgo(activity.timestamp)}
                  </span>
                  {activity.priority && (
                    <Badge className={getPriorityColor(activity.priority)} variant="outline">
                      {activity.priority}
                    </Badge>
                  )}
                </div>
              </div>
              {activity.user && (
                <Avatar className="h-8 w-8">
                  <AvatarImage src={activity.user.avatar} />
                  <AvatarFallback className="text-xs">
                    {activity.user.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}