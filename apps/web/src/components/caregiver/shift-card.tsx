// apps/web/src/components/caregiver/shift-card.tsx
'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Phone, 
  Navigation,
  DollarSign,
  Star,
  Timer,
  ThumbsUp,
  ThumbsDown
} from 'lucide-react'

interface ShiftCardProps {
  shift: {
    id: string
    status: 'scheduled' | 'available' | 'completed' | 'cancelled' | 'in_progress'
    client: {
      name: string
      address: string
      phone?: string
      photo?: string
      rating?: number
    }
    date: string
    startTime: string
    endTime: string
    duration: number
    hourlyRate: number
    totalPay: number
    tasks: string[]
    distance?: number
    urgency?: 'high' | 'medium' | 'low'
    matchScore?: number
  }
  type?: 'assigned' | 'available'
  onAccept?: () => void
  onDecline?: () => void
  onStartEVV?: () => void
  onCallClient?: () => void
  onGetDirections?: () => void
}

export function ShiftCard({ 
  shift, 
  type = 'assigned',
  onAccept, 
  onDecline, 
  onStartEVV, 
  onCallClient, 
  onGetDirections 
}: ShiftCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'default'
      case 'available': return 'secondary'
      case 'completed': return 'success'
      case 'cancelled': return 'destructive'
      case 'in_progress': return 'default'
      default: return 'outline'
    }
  }

  const getUrgencyColor = (urgency?: string) => {
    switch (urgency) {
      case 'high': return 'destructive'
      case 'medium': return 'secondary'
      case 'low': return 'outline'
      default: return 'outline'
    }
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={shift.client.photo} alt={shift.client.name} />
              <AvatarFallback>
                {shift.client.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg">{shift.client.name}</CardTitle>
              {shift.client.rating && (
                <div className="flex items-center gap-1">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm text-muted-foreground">{shift.client.rating.toFixed(1)}</span>
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={getStatusColor(shift.status) as any}>
              {shift.status.replace('_', ' ')}
            </Badge>
            {shift.urgency && type === 'available' && (
              <Badge variant={getUrgencyColor(shift.urgency) as any}>
                {shift.urgency} priority
              </Badge>
            )}
            {shift.matchScore && type === 'available' && (
              <Badge variant="outline" className="text-green-600 border-green-600">
                {shift.matchScore}% match
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>{new Date(shift.date).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span>{shift.startTime} - {shift.endTime}</span>
          </div>
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-muted-foreground" />
            <span>${shift.totalPay} (${shift.hourlyRate}/hr)</span>
          </div>
          {shift.distance && (
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span>{shift.distance} miles</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4" />
          <span>{shift.client.address}</span>
        </div>

        <div className="space-y-2">
          <h4 className="font-medium text-sm">Care Tasks</h4>
          <div className="flex flex-wrap gap-1">
            {shift.tasks.map((task, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {task}
              </Badge>
            ))}
          </div>
        </div>

        <div className="flex gap-2 pt-2">
          {type === 'available' && (
            <>
              <Button variant="outline" size="sm" onClick={onDecline} className="flex-1">
                <ThumbsDown className="h-4 w-4 mr-2" />
                Decline
              </Button>
              <Button size="sm" onClick={onAccept} className="flex-1">
                <ThumbsUp className="h-4 w-4 mr-2" />
                Accept
              </Button>
            </>
          )}
          
          {type === 'assigned' && (
            <>
              <Button variant="outline" size="sm" onClick={onGetDirections}>
                <Navigation className="h-4 w-4 mr-2" />
                Directions
              </Button>
              {shift.client.phone && (
                <Button variant="outline" size="sm" onClick={onCallClient}>
                  <Phone className="h-4 w-4 mr-2" />
                  Call
                </Button>
              )}
              {shift.status === 'scheduled' && (
                <Button size="sm" onClick={onStartEVV}>
                  <Timer className="h-4 w-4 mr-2" />
                  Start EVV
                </Button>
              )}
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )
}