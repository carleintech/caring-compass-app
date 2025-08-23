// apps/web/src/components/client/care-team.tsx
'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Phone, MessageCircle, Star, Calendar, Users } from 'lucide-react'

interface TeamMember {
  id: string
  name: string
  role: 'primary-caregiver' | 'backup-caregiver' | 'coordinator' | 'nurse'
  photo?: string
  phone?: string
  email: string
  rating?: number
  specialties: string[]
  nextVisit?: string
  totalHours: number
}

interface CareTeamProps {
  teamMembers: TeamMember[]
  onMessage: (memberId: string) => void
  onCall: (memberId: string) => void
}

export function CareTeam({ teamMembers, onMessage, onCall }: CareTeamProps) {
  const getRoleColor = (role: string) => {
    switch (role) {
      case 'primary-caregiver': return 'default'
      case 'backup-caregiver': return 'secondary'
      case 'coordinator': return 'outline'
      case 'nurse': return 'success'
      default: return 'outline'
    }
  }

  const getRoleLabel = (role: string) => {
    return role.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ')
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Your Care Team
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {teamMembers.map((member) => (
          <div key={member.id} className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src={member.photo} alt={member.name} />
                <AvatarFallback>
                  {member.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{member.name}</span>
                  <Badge variant={getRoleColor(member.role) as any}>
                    {getRoleLabel(member.role)}
                  </Badge>
                </div>
                {member.rating && (
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    <span>{member.rating.toFixed(1)}</span>
                    <span>•</span>
                    <span>{member.totalHours}h total</span>
                  </div>
                )}
                {member.nextVisit && (
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    <span>Next visit: {new Date(member.nextVisit).toLocaleDateString()}</span>
                  </div>
                )}
                <div className="flex flex-wrap gap-1">
                  {member.specialties.slice(0, 3).map((specialty, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {specialty}
                    </Badge>
                  ))}
                  {member.specialties.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{member.specialties.length - 3} more
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => onMessage(member.id)}
              >
                <MessageCircle className="h-4 w-4" />
              </Button>
              {member.phone && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => onCall(member.id)}
                >
                  <Phone className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

// Export all components
export { VisitCard, CareTaskTracker, InvoiceSummary, QuickActions, CareTeam }