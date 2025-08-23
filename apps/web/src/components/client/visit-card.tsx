// apps/web/src/components/client/visit-card.tsx
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
  MessageCircle, 
  CheckCircle, 
  AlertCircle,
  Star
} from 'lucide-react'

interface VisitCardProps {
  visit: {
    id: string
    date: string
    timeSlot: string
    duration: number
    status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled'
    caregiver: {
      id: string
      name: string
      photo?: string
      rating: number
      specialties: string[]
    }
    tasks: string[]
    notes?: string
  }
  onMessage?: () => void
  onReschedule?: () => void
  onCancel?: () => void
}

export function VisitCard({ visit, onMessage, onReschedule, onCancel }: VisitCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'default'
      case 'in-progress': return 'secondary'
      case 'completed': return 'success'
      case 'cancelled': return 'destructive'
      default: return 'default'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'scheduled': return <Calendar className="h-4 w-4" />
      case 'in-progress': return <Clock className="h-4 w-4" />
      case 'completed': return <CheckCircle className="h-4 w-4" />
      case 'cancelled': return <AlertCircle className="h-4 w-4" />
      default: return <Calendar className="h-4 w-4" />
    }
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={visit.caregiver.photo} alt={visit.caregiver.name} />
              <AvatarFallback>
                {visit.caregiver.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg">{visit.caregiver.name}</CardTitle>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                <span>{visit.caregiver.rating.toFixed(1)}</span>
              </div>
            </div>
          </div>
          <Badge variant={getStatusColor(visit.status) as any} className="flex items-center gap-1">
            {getStatusIcon(visit.status)}
            {visit.status.replace('-', ' ')}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>{new Date(visit.date).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span>{visit.timeSlot} ({visit.duration}h)</span>
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="font-medium text-sm">Care Tasks</h4>
          <div className="flex flex-wrap gap-1">
            {visit.tasks.map((task, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {task}
              </Badge>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="font-medium text-sm">Caregiver Specialties</h4>
          <div className="flex flex-wrap gap-1">
            {visit.caregiver.specialties.map((specialty, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {specialty}
              </Badge>
            ))}
          </div>
        </div>

        {visit.notes && (
          <div className="space-y-2">
            <h4 className="font-medium text-sm">Notes</h4>
            <p className="text-sm text-muted-foreground">{visit.notes}</p>
          </div>
        )}

        {visit.status === 'scheduled' && (
          <div className="flex gap-2 pt-2">
            <Button variant="outline" size="sm" onClick={onMessage} className="flex-1">
              <MessageCircle className="h-4 w-4 mr-2" />
              Message
            </Button>
            <Button variant="outline" size="sm" onClick={onReschedule} className="flex-1">
              <Calendar className="h-4 w-4 mr-2" />
              Reschedule
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}