'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Calendar } from '@/components/ui/calendar'
import { toast } from '@/hooks/use-toast'
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Plus, 
  Trash2, 
  Edit, 
  Save,
  AlertCircle,
  CheckCircle,
  X,
  MapPin,
  RefreshCw
} from 'lucide-react'

// Mock data for current availability
const mockWeeklyAvailability = {
  monday: { available: true, start: '08:00', end: '18:00' },
  tuesday: { available: true, start: '08:00', end: '18:00' },
  wednesday: { available: true, start: '08:00', end: '18:00' },
  thursday: { available: true, start: '08:00', end: '18:00' },
  friday: { available: true, start: '08:00', end: '18:00' },
  saturday: { available: false, start: '08:00', end: '18:00' },
  sunday: { available: false, start: '08:00', end: '18:00' }
}

const mockBlackoutDates = [
  {
    id: '1',
    date: '2025-01-25',
    reason: 'Doctor Appointment',
    type: 'partial',
    timeRange: '2:00 PM - 4:00 PM'
  },
  {
    id: '2',
    date: '2025-02-14',
    reason: 'Valentine\'s Day',
    type: 'full',
    timeRange: 'All day'
  },
  {
    id: '3',
    date: '2025-02-20',
    reason: 'Family Event',
    type: 'full',
    timeRange: 'All day'
  }
]

const mockPreferences = {
  maxDailyHours: 8,
  maxWeeklyHours: 40,
  preferredShiftLength: 4,
  travelRadius: 15,
  minimumNotice: 24,
  acceptLastMinute: true,
  acceptOvernights: false,
  acceptWeekends: false,
  preferredClients: ['long-term', 'recurring'],
  specialtyAreas: ['dementia-care', 'mobility-assistance']
}

const daysOfWeek = [
  { key: 'monday', label: 'Monday' },
  { key: 'tuesday', label: 'Tuesday' },
  { key: 'wednesday', label: 'Wednesday' },
  { key: 'thursday', label: 'Thursday' },
  { key: 'friday', label: 'Friday' },
  { key: 'saturday', label: 'Saturday' },
  { key: 'sunday', label: 'Sunday' }
]

export default function AvailabilityPage() {
  const [weeklyAvailability, setWeeklyAvailability] = useState(mockWeeklyAvailability)
  const [blackoutDates, setBlackoutDates] = useState(mockBlackoutDates)
  const [preferences, setPreferences] = useState(mockPreferences)
  const [isEditing, setIsEditing] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [newBlackout, setNewBlackout] = useState({
    date: '',
    reason: '',
    type: 'full' as 'full' | 'partial',
    timeRange: 'All day'
  })

  const handleDayToggle = (day: string) => {
    setWeeklyAvailability(prev => ({
      ...prev,
      [day]: {
        ...prev[day as keyof typeof prev],
        available: !prev[day as keyof typeof prev].available
      }
    }))
  }

  const handleTimeChange = (day: string, type: 'start' | 'end', value: string) => {
    setWeeklyAvailability(prev => ({
      ...prev,
      [day]: {
        ...prev[day as keyof typeof prev],
        [type]: value
      }
    }))
  }

  const handleSaveAvailability = () => {
    setIsEditing(false)
    toast({
      title: "Availability Updated",
      description: "Your weekly availability has been saved successfully.",
    })
  }

  const handleAddBlackout = () => {
    if (!newBlackout.date || !newBlackout.reason) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      })
      return
    }

    const blackout = {
      id: Date.now().toString(),
      ...newBlackout
    }

    setBlackoutDates(prev => [...prev, blackout])
    setNewBlackout({
      date: '',
      reason: '',
      type: 'full',
      timeRange: 'All day'
    })

    toast({
      title: "Blackout Date Added",
      description: "Your unavailable date has been added to your calendar.",
    })
  }

  const handleRemoveBlackout = (id: string) => {
    setBlackoutDates(prev => prev.filter(date => date.id !== id))
    toast({
      title: "Blackout Date Removed",
      description: "The date has been removed from your unavailable list.",
    })
  }

  const handlePreferenceChange = (key: string, value: any) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const calculateWeeklyHours = () => {
    return Object.values(weeklyAvailability).reduce((total, day) => {
      if (!day.available) return total
      const start = new Date(`2000-01-01T${day.start}:00`)
      const end = new Date(`2000-01-01T${day.end}:00`)
      const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60)
      return total + hours
    }, 0)
  }

  const weeklyHours = calculateWeeklyHours()

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Availability Management</h1>
          <p className="text-muted-foreground">
            Set your working hours and manage unavailable dates
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="text-sm">
            {weeklyHours.toFixed(1)} hours/week
          </Badge>
          <Button variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Sync Calendar
          </Button>
        </div>
      </div>

      <Tabs defaultValue="weekly" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="weekly">Weekly Schedule</TabsTrigger>
          <TabsTrigger value="blackouts">Blackout Dates</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
        </TabsList>

        <TabsContent value="weekly" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Weekly Availability
                </CardTitle>
                <Button 
                  variant={isEditing ? "default" : "outline"}
                  onClick={isEditing ? handleSaveAvailability : () => setIsEditing(true)}
                >
                  {isEditing ? (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </>
                  ) : (
                    <>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Schedule
                    </>
                  )}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {daysOfWeek.map((day) => {
                const dayData = weeklyAvailability[day.key as keyof typeof weeklyAvailability]
                
                return (
                  <div key={day.key} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-20">
                        <span className="font-medium">{day.label}</span>
                      </div>
                      <Switch
                        checked={dayData.available}
                        onCheckedChange={() => handleDayToggle(day.key)}
                        disabled={!isEditing}
                      />
                    </div>
                    
                    {dayData.available ? (
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <Label className="text-sm">From:</Label>
                          <Input
                            type="time"
                            value={dayData.start}
                            onChange={(e) => handleTimeChange(day.key, 'start', e.target.value)}
                            disabled={!isEditing}
                            className="w-32"
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <Label className="text-sm">To:</Label>
                          <Input
                            type="time"
                            value={dayData.end}
                            onChange={(e) => handleTimeChange(day.key, 'end', e.target.value)}
                            disabled={!isEditing}
                            className="w-32"
                          />
                        </div>
                        <Badge variant="outline" className="text-sm">
                          {(() => {
                            const start = new Date(`2000-01-01T${dayData.start}:00`)
                            const end = new Date(`2000-01-01T${dayData.end}:00`)
                            const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60)
                            return `${hours}h`
                          })()}
                        </Badge>
                      </div>
                    ) : (
                      <Badge variant="secondary">Unavailable</Badge>
                    )}
                  </div>
                )
              })}

              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-blue-900">Schedule Summary</p>
                    <p className="text-sm text-blue-800">
                      Total weekly availability: {weeklyHours.toFixed(1)} hours across {Object.values(weeklyAvailability).filter(day => day.available).length} days
                    </p>
                    {weeklyHours > preferences.maxWeeklyHours && (
                      <p className="text-sm text-orange-600 mt-1">
                        ⚠️ Your availability exceeds your preferred maximum of {preferences.maxWeeklyHours} hours/week
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="blackouts" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarIcon className="h-5 w-5" />
                Blackout Dates
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Add New Blackout */}
              <div className="border rounded-lg p-4 space-y-4">
                <h3 className="font-medium">Add Unavailable Date</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="blackout-date">Date</Label>
                    <Input
                      id="blackout-date"
                      type="date"
                      value={newBlackout.date}
                      onChange={(e) => setNewBlackout(prev => ({ ...prev, date: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="blackout-type">Type</Label>
                    <Select
                      value={newBlackout.type}
                      onValueChange={(value: 'full' | 'partial') => setNewBlackout(prev => ({ ...prev, type: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="full">Full Day</SelectItem>
                        <SelectItem value="partial">Partial Day</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="blackout-time">Time Range</Label>
                    <Input
                      id="blackout-time"
                      placeholder="e.g., 2:00 PM - 4:00 PM"
                      value={newBlackout.timeRange}
                      onChange={(e) => setNewBlackout(prev => ({ ...prev, timeRange: e.target.value }))}
                      disabled={newBlackout.type === 'full'}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="blackout-reason">Reason</Label>
                    <Input
                      id="blackout-reason"
                      placeholder="e.g., Doctor appointment"
                      value={newBlackout.reason}
                      onChange={(e) => setNewBlackout(prev => ({ ...prev, reason: e.target.value }))}
                    />
                  </div>
                </div>
                <Button onClick={handleAddBlackout}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Blackout Date
                </Button>
              </div>

              {/* Existing Blackouts */}
              <div className="space-y-3">
                <h3 className="font-medium">Upcoming Unavailable Dates</h3>
                {blackoutDates.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <CalendarIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>No blackout dates scheduled</p>
                  </div>
                ) : (
                  blackoutDates.map((blackout) => (
                    <div key={blackout.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">
                            {new Date(blackout.date).toLocaleDateString('en-US', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </span>
                          <Badge variant={blackout.type === 'full' ? 'destructive' : 'secondary'}>
                            {blackout.type === 'full' ? 'Full Day' : 'Partial'}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{blackout.reason}</p>
                        <p className="text-sm text-muted-foreground">{blackout.timeRange}</p>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleRemoveBlackout(blackout.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preferences" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Work Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Working Hours Limits */}
              <div className="space-y-4">
                <h3 className="font-medium">Working Hours</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="max-daily">Max Daily Hours</Label>
                    <Select
                      value={preferences.maxDailyHours.toString()}
                      onValueChange={(value) => handlePreferenceChange('maxDailyHours', parseInt(value))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[4, 6, 8, 10, 12].map(hours => (
                          <SelectItem key={hours} value={hours.toString()}>{hours} hours</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="max-weekly">Max Weekly Hours</Label>
                    <Select
                      value={preferences.maxWeeklyHours.toString()}
                      onValueChange={(value) => handlePreferenceChange('maxWeeklyHours', parseInt(value))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[20, 25, 30, 35, 40, 45, 50].map(hours => (
                          <SelectItem key={hours} value={hours.toString()}>{hours} hours</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="preferred-shift">Preferred Shift Length</Label>
                    <Select
                      value={preferences.preferredShiftLength.toString()}
                      onValueChange={(value) => handlePreferenceChange('preferredShiftLength', parseInt(value))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[2, 3, 4, 6, 8, 12].map(hours => (
                          <SelectItem key={hours} value={hours.toString()}>{hours} hours</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Geographic and Scheduling */}
              <div className="space-y-4">
                <h3 className="font-medium">Geographic & Scheduling</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="travel-radius">Travel Radius (miles)</Label>
                    <Select
                      value={preferences.travelRadius.toString()}
                      onValueChange={(value) => handlePreferenceChange('travelRadius', parseInt(value))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[5, 10, 15, 20, 25, 30].map(miles => (
                          <SelectItem key={miles} value={miles.toString()}>{miles} miles</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="minimum-notice">Minimum Notice (hours)</Label>
                    <Select
                      value={preferences.minimumNotice.toString()}
                      onValueChange={(value) => handlePreferenceChange('minimumNotice', parseInt(value))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[2, 4, 8, 12, 24, 48, 72].map(hours => (
                          <SelectItem key={hours} value={hours.toString()}>{hours} hours</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Shift Type Preferences */}
              <div className="space-y-4">
                <h3 className="font-medium">Shift Type Preferences</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Accept Last-Minute Shifts</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive notifications for shifts with short notice
                      </p>
                    </div>
                    <Switch
                      checked={preferences.acceptLastMinute}
                      onCheckedChange={(checked) => handlePreferenceChange('acceptLastMinute', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Accept Overnight Shifts</Label>
                      <p className="text-sm text-muted-foreground">
                        Willing to work overnight hours (11 PM - 7 AM)
                      </p>
                    </div>
                    <Switch
                      checked={preferences.acceptOvernights}
                      onCheckedChange={(checked) => handlePreferenceChange('acceptOvernights', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Accept Weekend Shifts</Label>
                      <p className="text-sm text-muted-foreground">
                        Override weekly availability for weekend opportunities
                      </p>
                    </div>
                    <Switch
                      checked={preferences.acceptWeekends}
                      onCheckedChange={(checked) => handlePreferenceChange('acceptWeekends', checked)}
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={() => {
                  toast({
                    title: "Preferences Updated",
                    description: "Your work preferences have been saved successfully.",
                  })
                }}>
                  Save Preferences
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}