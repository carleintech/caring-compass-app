// apps/web/src/components/caregiver/availability-quick-update.tsx
'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { toast } from '@/hooks/use-toast'
import { 
  Calendar, 
  Clock, 
  Plus,
  Settings
} from 'lucide-react'

interface AvailabilityQuickUpdateProps {
  availability: {
    [key: string]: {
      available: boolean
      start: string
      end: string
    }
  }
  onUpdate: (availability: any) => void
}

export function AvailabilityQuickUpdate({ availability, onUpdate }: AvailabilityQuickUpdateProps) {
  const [isUpdating, setIsUpdating] = useState(false)
  const [localAvailability, setLocalAvailability] = useState(availability)

  const daysOfWeek = [
    { key: 'monday', label: 'Mon' },
    { key: 'tuesday', label: 'Tue' },
    { key: 'wednesday', label: 'Wed' },
    { key: 'thursday', label: 'Thu' },
    { key: 'friday', label: 'Fri' },
    { key: 'saturday', label: 'Sat' },
    { key: 'sunday', label: 'Sun' }
  ]

  const handleToggleDay = (day: string) => {
    const updated = {
      ...localAvailability,
      [day]: {
        ...localAvailability[day],
        available: !localAvailability[day].available
      }
    }
    setLocalAvailability(updated)
  }

  const handleSaveChanges = () => {
    setIsUpdating(true)
    setTimeout(() => {
      onUpdate(localAvailability)
      setIsUpdating(false)
      toast({
        title: "Availability Updated",
        description: "Your availability has been saved successfully.",
      })
    }, 1000)
  }

  const handleAddTimeOff = () => {
    toast({
      title: "Time Off Requested",
      description: "Your time off request has been submitted for approval.",
    })
  }

  const availableDays = daysOfWeek.filter(day => 
    localAvailability[day.key]?.available
  ).length

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Quick Availability
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <p className="text-2xl font-bold">{availableDays}/7</p>
          <p className="text-sm text-muted-foreground">Days available this week</p>
        </div>

        <div className="grid grid-cols-7 gap-1">
          {daysOfWeek.map((day) => (
            <div key={day.key} className="text-center">
              <label className="cursor-pointer">
                <div className={`p-2 rounded text-xs font-medium border ${
                  localAvailability[day.key]?.available 
                    ? 'bg-green-100 border-green-300 text-green-800' 
                    : 'bg-gray-100 border-gray-300 text-gray-600'
                }`}>
                  {day.label}
                </div>
                <Switch
                  checked={localAvailability[day.key]?.available || false}
                  onCheckedChange={() => handleToggleDay(day.key)}
                  className="mt-1 scale-75"
                />
              </label>
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <Button 
            onClick={handleSaveChanges} 
            disabled={isUpdating}
            className="flex-1"
          >
            {isUpdating ? 'Saving...' : 'Save Changes'}
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Time Off</DialogTitle>
                <DialogDescription>
                  Request time off for specific dates
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="start-date">Start Date</Label>
                    <Input id="start-date" type="date" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="end-date">End Date</Label>
                    <Input id="end-date" type="date" />
                  </div>
                </div>
                <Button onClick={handleAddTimeOff} className="w-full">
                  Request Time Off
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  )
}