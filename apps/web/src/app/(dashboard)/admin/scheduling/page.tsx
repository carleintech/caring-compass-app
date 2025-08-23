'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  Plus,
  Search,
  Filter,
  AlertTriangle,
  CheckCircle,
  XCircle,
  RotateCcw,
  User,
  Home,
  Phone,
  Mail,
  Star,
  TrendingUp,
  AlertCircle,
  Settings,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Edit,
  Copy,
  Trash2
} from 'lucide-react'
import { trpc } from '@/lib/trpc'

interface Visit {
  id: string
  clientId: string
  client: {
    id: string
    name: string
    address: string
    phone: string
    preferences?: string[]
  }
  caregiverId?: string
  caregiver?: {
    id: string
    name: string
    avatar?: string
    skills: string[]
    rating: number
  }
  scheduledStart: Date
  scheduledEnd: Date
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled' | 'no_show'
  tasks: string[]
  notes?: string
  isRecurring: boolean
  recurrencePattern?: 'daily' | 'weekly' | 'biweekly' | 'monthly'
  priority: 'low' | 'medium' | 'high'
  estimatedDuration: number
  actualStart?: Date
  actualEnd?: Date
  conflicts?: string[]
  distance?: number
}

interface CaregiverAvailability {
  id: string
  caregiverId: string
  caregiver: {
    id: string
    name: string
    avatar?: string
    skills: string[]
    rating: number
  }
  dayOfWeek: number
  startTime: string
  endTime: string
  isAvailable: boolean
  maxHours: number
  currentHours: number
  travelRadius: number
}

interface ConflictAlert {
  id: string
  type: 'scheduling_conflict' | 'overtime_risk' | 'no_caregiver' | 'client_preference' | 'travel_distance'
  severity: 'low' | 'medium' | 'high'
  message: string
  visits: string[]
  suggestedActions: string[]
}

export default function AdvancedScheduling() {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [selectedView, setSelectedView] = useState<'day' | 'week' | 'month'>('week')
  const [showCreateVisit, setShowCreateVisit] = useState(false)
  const [selectedVisit, setSelectedVisit] = useState<Visit | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [filterCaregiver, setFilterCaregiver] = useState<string>('all')

  // Mock data - replace with actual tRPC calls
  const [visits] = useState<Visit[]>([
    {
      id: '1',
      clientId: 'client1',
      client: {
        id: 'client1',
        name: 'Margaret Johnson',
        address: '123 Oak Street, Virginia Beach, VA',
        phone: '(757) 555-0123',
        preferences: ['Female caregiver', 'No pets', 'Morning visits']
      },
      caregiverId: 'caregiver1',
      caregiver: {
        id: 'caregiver1',
        name: 'Sarah Wilson',
        avatar: '/avatars/sarah.jpg',
        skills: ['Personal Care', 'Dementia Care', 'Meal Preparation'],
        rating: 4.8
      },
      scheduledStart: new Date(2024, 2, 15, 9, 0),
      scheduledEnd: new Date(2024, 2, 15, 11, 0),
      status: 'scheduled',
      tasks: ['Personal hygiene assistance', 'Meal preparation', 'Light housekeeping'],
      isRecurring: true,
      recurrencePattern: 'weekly',
      priority: 'high',
      estimatedDuration: 120,
      distance: 2.3
    },
    {
      id: '2',
      clientId: 'client2',
      client: {
        id: 'client2',
        name: 'Robert Chen',
        address: '456 Maple Ave, Norfolk, VA',
        phone: '(757) 555-0456'
      },
      caregiverId: 'caregiver2',
      caregiver: {
        id: 'caregiver2',
        name: 'Michael Davis',
        avatar: '/avatars/michael.jpg',
        skills: ['Transportation', 'Companionship', 'Medication Reminders'],
        rating: 4.6
      },
      scheduledStart: new Date(2024, 2, 15, 14, 0),
      scheduledEnd: new Date(2024, 2, 15, 16, 30),
      status: 'in_progress',
      tasks: ['Transportation to appointment', 'Companionship'],
      isRecurring: false,
      priority: 'medium',
      estimatedDuration: 150,
      actualStart: new Date(2024, 2, 15, 14, 5),
      distance: 5.1
    },
    {
      id: '3',
      clientId: 'client3',
      client: {
        id: 'client3',
        name: 'Emily Rodriguez',
        address: '789 Pine Street, Chesapeake, VA',
        phone: '(757) 555-0789',
        preferences: ['Bilingual (Spanish)', 'Pet friendly']
      },
      scheduledStart: new Date(2024, 2, 15, 16, 0),
      scheduledEnd: new Date(2024, 2, 15, 18, 0),
      status: 'scheduled',
      tasks: ['Personal care', 'Dementia care', 'Evening routine'],
      isRecurring: true,
      recurrencePattern: 'daily',
      priority: 'high',
      estimatedDuration: 120,
      conflicts: ['No assigned caregiver', 'Client prefers Spanish-speaking caregiver']
    }
  ])

  const [availability] = useState<CaregiverAvailability[]>([
    {
      id: '1',
      caregiverId: 'caregiver1',
      caregiver: {
        id: 'caregiver1',
        name: 'Sarah Wilson',
        avatar: '/avatars/sarah.jpg',
        skills: ['Personal Care', 'Dementia Care', 'Meal Preparation'],
        rating: 4.8
      },
      dayOfWeek: 1, // Monday
      startTime: '08:00',
      endTime: '16:00',
      isAvailable: true,
      maxHours: 8,
      currentHours: 6,
      travelRadius: 15
    },
    {
      id: '2',
      caregiverId: 'caregiver2',
      caregiver: {
        id: 'caregiver2',
        name: 'Michael Davis',
        avatar: '/avatars/michael.jpg',
        skills: ['Transportation', 'Companionship', 'Medication Reminders'],
        rating: 4.6
      },
      dayOfWeek: 1, // Monday
      startTime: '12:00',
      endTime: '20:00',
      isAvailable: true,
      maxHours: 8,
      currentHours: 4,
      travelRadius: 20
    }
  ])

  const [conflicts] = useState<ConflictAlert[]>([
    {
      id: '1',
      type: 'no_caregiver',
      severity: 'high',
      message: 'Visit scheduled without assigned caregiver',
      visits: ['3'],
      suggestedActions: [
        'Assign available caregiver',
        'Reschedule visit',
        'Contact client for alternative time'
      ]
    },
    {
      id: '2',
      type: 'overtime_risk',
      severity: 'medium',
      message: 'Sarah Wilson approaching overtime threshold',
      visits: ['1'],
      suggestedActions: [
        'Redistribute visits to other caregivers',
        'Adjust schedule to avoid overtime',
        'Approve overtime if necessary'
      ]
    },
    {
      id: '3',
      type: 'client_preference',
      severity: 'medium',
      message: 'Client preference not met: Spanish-speaking caregiver required',
      visits: ['3'],
      suggestedActions: [
        'Assign bilingual caregiver',
        'Contact client about alternative options',
        'Schedule translator if available'
      ]
    }
  ])

  const getStatusColor = (status: Visit['status']) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'in_progress': return 'bg-green-100 text-green-800 border-green-200'
      case 'completed': return 'bg-gray-100 text-gray-800 border-gray-200'
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200'
      case 'no_show': return 'bg-orange-100 text-orange-800 border-orange-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getPriorityColor = (priority: Visit['priority']) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200'
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'low': return 'bg-green-100 text-green-800 border-green-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getConflictIcon = (type: ConflictAlert['type']) => {
    switch (type) {
      case 'scheduling_conflict': return <AlertCircle className="h-4 w-4 text-red-500" />
      case 'overtime_risk': return <Clock className="h-4 w-4 text-yellow-500" />
      case 'no_caregiver': return <Users className="h-4 w-4 text-red-500" />
      case 'client_preference': return <User className="h-4 w-4 text-blue-500" />
      case 'travel_distance': return <MapPin className="h-4 w-4 text-orange-500" />
      default: return <AlertTriangle className="h-4 w-4" />
    }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    })
  }

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`
  }

  const getWeekDates = (date: Date) => {
    const week = []
    const startOfWeek = new Date(date)
    startOfWeek.setDate(date.getDate() - date.getDay())
    
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek)
      day.setDate(startOfWeek.getDate() + i)
      week.push(day)
    }
    return week
  }

  const timeSlots = Array.from({ length: 24 }, (_, i) => {
    const hour = i
    return `${hour.toString().padStart(2, '0')}:00`
  })

  const weekDates = getWeekDates(selectedDate)

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Advanced Scheduling</h1>
          <p className="text-muted-foreground">
            Manage visits, assignments, and resolve scheduling conflicts
          </p>
        </div>
        <div className="flex items-center space-x-4">
          {/* View Toggle */}
          <Tabs value={selectedView} onValueChange={(value: any) => setSelectedView(value)}>
            <TabsList>
              <TabsTrigger value="day">Day</TabsTrigger>
              <TabsTrigger value="week">Week</TabsTrigger>
              <TabsTrigger value="month">Month</TabsTrigger>
            </TabsList>
          </Tabs>
          
          <Dialog open={showCreateVisit} onOpenChange={setShowCreateVisit}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Schedule Visit
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Schedule New Visit</DialogTitle>
                <DialogDescription>
                  Create a new visit appointment for a client
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="client">Client</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select client" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="client1">Margaret Johnson</SelectItem>
                        <SelectItem value="client2">Robert Chen</SelectItem>
                        <SelectItem value="client3">Emily Rodriguez</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="caregiver">Caregiver</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select caregiver" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="caregiver1">Sarah Wilson</SelectItem>
                        <SelectItem value="caregiver2">Michael Davis</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="date">Date</Label>
                    <Input type="date" />
                  </div>
                  <div>
                    <Label htmlFor="startTime">Start Time</Label>
                    <Input type="time" />
                  </div>
                  <div>
                    <Label htmlFor="endTime">End Time</Label>
                    <Input type="time" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="tasks">Care Tasks</Label>
                  <Textarea placeholder="Enter care tasks and instructions..." />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="recurring" />
                  <Label htmlFor="recurring">Recurring visit</Label>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setShowCreateVisit(false)}>
                    Cancel
                  </Button>
                  <Button onClick={() => setShowCreateVisit(false)}>
                    Schedule Visit
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Conflict Alerts */}
      {conflicts.length > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="text-red-800 flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2" />
              Scheduling Conflicts ({conflicts.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {conflicts.map((conflict) => (
                <div key={conflict.id} className="flex items-start justify-between p-3 bg-white rounded-lg border">
                  <div className="flex items-start space-x-3">
                    {getConflictIcon(conflict.type)}
                    <div className="flex-1">
                      <p className="font-medium text-sm">{conflict.message}</p>
                      <div className="mt-2">
                        <p className="text-xs text-muted-foreground mb-1">Suggested actions:</p>
                        <ul className="text-xs text-muted-foreground space-y-1">
                          {conflict.suggestedActions.map((action, index) => (
                            <li key={index}>• {action}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline">
                      Resolve
                    </Button>
                    <Button size="sm">
                      Auto-Fix
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Schedule View */}
      <Tabs value={selectedView} className="space-y-4">
        <TabsContent value="week" className="space-y-4">
          {/* Week Navigation */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const newDate = new Date(selectedDate)
                  newDate.setDate(selectedDate.getDate() - 7)
                  setSelectedDate(newDate)
                }}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <h2 className="text-xl font-semibold">
                {weekDates[0]?.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} - 
                {weekDates[6]?.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </h2>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const newDate = new Date(selectedDate)
                  newDate.setDate(selectedDate.getDate() + 7)
                  setSelectedDate(newDate)
                }}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            
            {/* Filters */}
            <div className="flex space-x-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search visits..."
                  className="pl-8 w-48"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Weekly Calendar Grid */}
          <Card>
            <CardContent className="p-0">
              <div className="grid grid-cols-8 min-h-[600px]">
                {/* Time Column */}
                <div className="border-r">
                  <div className="h-12 border-b flex items-center justify-center text-sm font-medium">
                    Time
                  </div>
                  <div className="space-y-0">
                    {timeSlots.filter((_, index) => index >= 6 && index <= 22).map((time) => (
                      <div key={time} className="h-12 border-b flex items-center justify-center text-xs text-muted-foreground">
                        {time}
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Day Columns */}
                {weekDates.map((date, dayIndex) => (
                  <div key={dayIndex} className="border-r last:border-r-0">
                    <div className="h-12 border-b flex flex-col items-center justify-center">
                      <span className="text-xs text-muted-foreground">
                        {date.toLocaleDateString('en-US', { weekday: 'short' })}
                      </span>
                      <span className="text-sm font-medium">
                        {date.getDate()}
                      </span>
                    </div>
                    <div className="relative">
                      {timeSlots.filter((_, index) => index >= 6 && index <= 22).map((time, timeIndex) => (
                        <div key={time} className="h-12 border-b"></div>
                      ))}
                      
                      {/* Visit Cards */}
                      {visits
                        .filter(visit => 
                          visit.scheduledStart.toDateString() === date.toDateString()
                        )
                        .map((visit) => {
                          const startHour = visit.scheduledStart.getHours()
                          const startMinute = visit.scheduledStart.getMinutes()
                          const endHour = visit.scheduledEnd.getHours()
                          const endMinute = visit.scheduledEnd.getMinutes()
                          
                          const top = ((startHour - 6) * 48) + (startMinute / 60 * 48)
                          const height = ((endHour - startHour) * 48) + ((endMinute - startMinute) / 60 * 48)
                          
                          return (
                            <div
                              key={visit.id}
                              className="absolute left-1 right-1 bg-white border-l-4 border-blue-500 rounded shadow-sm cursor-pointer hover:shadow-md transition-shadow"
                              style={{ top: `${top}px`, height: `${height}px` }}
                              onClick={() => setSelectedVisit(visit)}
                            >
                              <div className="p-2 text-xs space-y-1">
                                <div className="font-medium truncate">
                                  {visit.client.name}
                                </div>
                                <div className="text-muted-foreground">
                                  {formatTime(visit.scheduledStart)} - {formatTime(visit.scheduledEnd)}
                                </div>
                                {visit.caregiver ? (
                                  <div className="flex items-center space-x-1">
                                    <Avatar className="h-3 w-3">
                                      <AvatarImage src={visit.caregiver.avatar} />
                                      <AvatarFallback className="text-xs">
                                        {visit.caregiver.name.split(' ').map(n => n[0]).join('')}
                                      </AvatarFallback>
                                    </Avatar>
                                    <span className="truncate">{visit.caregiver.name}</span>
                                  </div>
                                ) : (
                                  <div className="text-red-500">No caregiver assigned</div>
                                )}
                                <div className="flex items-center space-x-1">
                                  <Badge className={getStatusColor(visit.status)} variant="outline">
                                    {visit.status.replace('_', ' ')}
                                  </Badge>
                                  {visit.conflicts && visit.conflicts.length > 0 && (
                                    <AlertTriangle className="h-3 w-3 text-red-500" />
                                  )}
                                </div>
                              </div>
                            </div>
                          )
                        })}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="day" className="space-y-4">
          {/* Day view would be implemented here */}
          <Card>
            <CardContent className="h-96 flex items-center justify-center">
              <div className="text-center">
                <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">Day view would be implemented here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="month" className="space-y-4">
          {/* Month view would be implemented here */}
          <Card>
            <CardContent className="h-96 flex items-center justify-center">
              <div className="text-center">
                <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">Month view would be implemented here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Caregiver Availability Panel */}
      <Card>
        <CardHeader>
          <CardTitle>Caregiver Availability</CardTitle>
          <CardDescription>
            Current availability and capacity for scheduling
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {availability.map((avail) => (
              <div key={avail.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage src={avail.caregiver.avatar} />
                    <AvatarFallback>
                      {avail.caregiver.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{avail.caregiver.name}</p>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <span>Available: {avail.startTime} - {avail.endTime}</span>
                      <span>•</span>
                      <span>{avail.currentHours}/{avail.maxHours} hours</span>
                      <span>•</span>
                      <div className="flex items-center space-x-1">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span>{avail.caregiver.rating}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-sm">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${(avail.currentHours / avail.maxHours) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  <Badge 
                    className={avail.isAvailable ? 
                      'bg-green-100 text-green-800 border-green-200' : 
                      'bg-red-100 text-red-800 border-red-200'
                    } 
                    variant="outline"
                  >
                    {avail.isAvailable ? 'Available' : 'Unavailable'}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Visit Details Dialog */}
      <Dialog open={!!selectedVisit} onOpenChange={() => setSelectedVisit(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Visit Details</DialogTitle>
            <DialogDescription>
              View and edit visit information
            </DialogDescription>
          </DialogHeader>
          {selectedVisit && (
            <div className="grid gap-6 py-4">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Client Information</h4>
                    <div className="space-y-2 text-sm">
                      <p className="font-medium">{selectedVisit.client.name}</p>
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4" />
                        <span>{selectedVisit.client.address}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Phone className="h-4 w-4" />
                        <span>{selectedVisit.client.phone}</span>
                      </div>
                    </div>
                  </div>
                  {selectedVisit.client.preferences && (
                    <div>
                      <h4 className="font-medium mb-2">Client Preferences</h4>
                      <div className="flex flex-wrap gap-1">
                        {selectedVisit.client.preferences.map((pref) => (
                          <Badge key={pref} variant="secondary">
                            {pref}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Visit Schedule</h4>
                    <div className="space-y-2 text-sm">
                      <p>{formatDate(selectedVisit.scheduledStart)} at {formatTime(selectedVisit.scheduledStart)}</p>
                      <p>Duration: {formatDuration(selectedVisit.estimatedDuration)}</p>
                      <Badge className={getStatusColor(selectedVisit.status)} variant="outline">
                        {selectedVisit.status.replace('_', ' ')}
                      </Badge>
                      <Badge className={getPriorityColor(selectedVisit.priority)} variant="outline">
                        {selectedVisit.priority} priority
                      </Badge>
                    </div>
                  </div>
                  {selectedVisit.caregiver && (
                    <div>
                      <h4 className="font-medium mb-2">Assigned Caregiver</h4>
                      <div className="flex items-center space-x-2">
                        <Avatar>
                          <AvatarImage src={selectedVisit.caregiver.avatar} />
                          <AvatarFallback>
                            {selectedVisit.caregiver.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{selectedVisit.caregiver.name}</p>
                          <div className="flex items-center space-x-1">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm">{selectedVisit.caregiver.rating}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-2">Care Tasks</h4>
                <ul className="text-sm space-y-1">
                  {selectedVisit.tasks.map((task, index) => (
                    <li key={index}>• {task}</li>
                  ))}
                </ul>
              </div>
              {selectedVisit.conflicts && selectedVisit.conflicts.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2 text-red-600">Conflicts</h4>
                  <ul className="text-sm space-y-1">
                    {selectedVisit.conflicts.map((conflict, index) => (
                      <li key={index} className="text-red-600">• {conflict}</li>
                    ))}
                  </ul>
                </div>
              )}
              <div className="flex space-x-2">
                <Button className="flex-1">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Visit
                </Button>
                <Button variant="outline" className="flex-1">
                  <Copy className="h-4 w-4 mr-2" />
                  Duplicate
                </Button>
                <Button variant="outline" className="flex-1">
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Reschedule
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}