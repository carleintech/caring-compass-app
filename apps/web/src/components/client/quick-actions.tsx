// apps/web/src/components/client/quick-actions.tsx
'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  MessageCircle, 
  Calendar, 
  FileText, 
  Phone, 
  Settings,
  Users
} from 'lucide-react'

interface QuickActionsProps {
  onMessage?: () => void
  onSchedule?: () => void
  onDocuments?: () => void
  onContact?: () => void
  onSettings?: () => void
  onFamily?: () => void
}

export function QuickActions({ 
  onMessage, 
  onSchedule, 
  onDocuments, 
  onContact, 
  onSettings, 
  onFamily 
}: QuickActionsProps) {
  const actions = [
    {
      icon: MessageCircle,
      label: 'Send Message',
      description: 'Contact your care coordinator',
      onClick: onMessage
    },
    {
      icon: Calendar,
      label: 'Schedule Care',
      description: 'Request additional visits',
      onClick: onSchedule
    },
    {
      icon: FileText,
      label: 'View Documents',
      description: 'Access care plans and reports',
      onClick: onDocuments
    },
    {
      icon: Phone,
      label: 'Emergency Contact',
      description: '24/7 support hotline',
      onClick: onContact
    },
    {
      icon: Users,
      label: 'Family Access',
      description: 'Manage family member access',
      onClick: onFamily
    },
    {
      icon: Settings,
      label: 'Settings',
      description: 'Update preferences',
      onClick: onSettings
    }
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {actions.map((action, index) => (
            <Button
              key={index}
              variant="outline"
              className="h-auto p-4 flex-col items-start space-y-2"
              onClick={action.onClick}
            >
              <action.icon className="h-5 w-5" />
              <div className="text-left">
                <div className="font-medium">{action.label}</div>
                <div className="text-xs text-muted-foreground">
                  {action.description}
                </div>
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}