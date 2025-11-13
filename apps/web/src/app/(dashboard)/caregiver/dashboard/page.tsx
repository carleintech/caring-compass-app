'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { BackToHomeButton } from '@/components/ui/back-to-home-button'
import { 
  Clock, 
  MapPin, 
  DollarSign, 
  Calendar, 
  Users, 
  Star,
  TrendingUp,
  CheckCircle,
  AlertTriangle,
  Navigation,
  Timer,
  BookOpen,
  Award,
  Phone
} from 'lucide-react'

// Mock data for demonstration
const mockCaregiver = {
  id: '1',
  firstName: 'Sarah',
  lastName: 'Wilson',
  photo: '',
  rating: 4.8,
  totalHours: 1250,
  employmentStatus: 'active',
  certifications: ['CNA', 'CPR', 'First Aid'],
  specialties: ['Dementia Care', 'Mobility Assistance', 'Medication Management']
}

const mockShifts = [
  {
    id: '1',
    client: {
      name: 'Margaret Johnson',
      address: '123 Oceanfront Ave, Virginia Beach, VA',
      photo: ''
    },
    date: '2025-01-20',
    startTime: '10:00',
    endTime: '14:00',
    duration: 4,
    status: 'scheduled',
    tasks: ['Personal care', 'Meal preparation', 'Light housekeeping'],
    notes: 'Client prefers morning care routine at 10:30 AM'
  },
  {
    id: '2',
    client: {
      name: 'Robert Chen',
      address: '456 Shore Dr, Norfolk, VA',
      photo: ''
    },
    date: '2025-01-20',
    startTime: '16:00',
    endTime: '20:00',
    duration: 4,
    status: 'scheduled',
    tasks: ['Medication reminders', 'Companionship', 'Evening routine'],
    notes: 'Dinner at 6 PM, medications at 7 PM'
  }
]

const mockMetrics = {
  weeklyHours: 32,
  weeklyEarnings: 768.00,
  clientRating: 4.8,
  completedVisits: 156,
  thisWeekShifts: 8,
  nextPayDate: '2025-01-24',
  availableShifts: 12
}

const mockRecentActivity = [
  {
    id: '1',
    type: 'shift_completed',
    client: 'Margaret Johnson',
    date: '2025-01-18',
    duration: 4,
    rating: 5
  },
  {
    id: '2',
    type: 'payment_processed',
    amount: 768.00,
    date: '2025-01-17',
    period: 'Week of Jan 8-14'
  },
  {
    id: '3',
    type: 'new_shift_assigned',
    client: 'Eleanor Martinez',
    date: '2025-01-22',
    duration: 6
  }
]

export default function CaregiverDashboard() {
  const [activeTab, setActiveTab] = useState('overview')

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'default'
      case 'in-progress': return 'secondary'
      case 'completed': return 'success'
      case 'cancelled': return 'destructive'
      default: return 'default'
    }
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Back Button */}
      <div className="flex justify-start">
        <BackToHomeButton />
      </div>
      
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">
            Welcome back, {mockCaregiver.firstName}!
          </h1>
          <p className="text-muted-foreground">
            You have {mockShifts.filter(s => s.status === 'scheduled').length} shifts scheduled today
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12">
            <AvatarImage src={mockCaregiver.photo} alt={mockCaregiver.firstName} />
            <AvatarFallback>
              {mockCaregiver.firstName[0]}{mockCaregiver.lastName[0]}
            </AvatarFallback>
          </Avatar>
          <div className="text-right">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="font-medium">{mockCaregiver.rating}</span>
            </div>
            <Badge variant="success" className="text-xs">
              {mockCaregiver.employmentStatus}
            </Badge>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">This Week</p>
                <p className="text-2xl font-bold">{mockMetrics.weeklyHours}h</p>
              </div>
              <Clock className="h-8 w-8 text-blue-600" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              +4h from last week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Weekly Earnings</p>
                <p className="text-2xl font-bold">${mockMetrics.weeklyEarnings}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Next pay: {new Date(mockMetrics.nextPayDate).toLocaleDateString()}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Client Rating</p>
                <p className="text-2xl font-bold">{mockMetrics.clientRating}/5</p>
              </div>
              <Star className="h-8 w-8 text-yellow-500" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Based on {mockMetrics.completedVisits} visits
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Available Shifts</p>
                <p className="text-2xl font-bold">{mockMetrics.availableShifts}</p>
              </div>
              <Calendar className="h-8 w-8 text-purple-600" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Pick up extra hours
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Today&apos;s Overview</TabsTrigger>
          <TabsTrigger value="shifts">My Shifts</TabsTrigger>
          <TabsTrigger value="activity">Recent Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Today's Shifts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Today&apos;s Shifts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {mockShifts.filter(shift => shift.date === '2025-01-20').map((shift) => (
                <div key={shift.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback>
                          {shift.client.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-medium">{shift.client.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {shift.startTime} - {shift.endTime} ({shift.duration}h)
                        </p>
                      </div>
                    </div>
                    <Badge variant={getStatusColor(shift.status) as any}>
                      {shift.status}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{shift.client.address}</span>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm font-medium">Tasks:</p>
                    <div className="flex flex-wrap gap-1">
                      {shift.tasks.map((task, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {task}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {shift.notes && (
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <p className="text-sm font-medium text-blue-900">Care Notes:</p>
                      <p className="text-sm text-blue-800">{shift.notes}</p>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="flex-1">
                      <Navigation className="h-4 w-4 mr-2" />
                      Get Directions
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1">
                      <Phone className="h-4 w-4 mr-2" />
                      Call Client
                    </Button>
                    <Button size="sm" className="flex-1">
                      <Timer className="h-4 w-4 mr-2" />
                      Clock In
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <Button variant="outline" className="h-20 flex-col gap-2">
                  <Calendar className="h-6 w-6" />
                  <span className="text-sm">View Schedule</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col gap-2">
                  <Clock className="h-6 w-6" />
                  <span className="text-sm">Availability</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col gap-2">
                  <DollarSign className="h-6 w-6" />
                  <span className="text-sm">Pay Stubs</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col gap-2">
                  <BookOpen className="h-6 w-6" />
                  <span className="text-sm">Training</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="shifts" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Shifts</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {mockShifts.map((shift) => (
                <div key={shift.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback>
                          {shift.client.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-medium">{shift.client.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {new Date(shift.date).toLocaleDateString()} • {shift.startTime} - {shift.endTime}
                        </p>
                      </div>
                    </div>
                    <Badge variant={getStatusColor(shift.status) as any}>
                      {shift.status}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                    <MapPin className="h-4 w-4" />
                    <span>{shift.client.address}</span>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {shift.tasks.map((task, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {task}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {mockRecentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center gap-4 p-3 border rounded-lg">
                  {activity.type === 'shift_completed' && (
                    <>
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <div className="flex-1">
                        <p className="font-medium">Shift Completed</p>
                        <p className="text-sm text-muted-foreground">
                          {activity.client} • {activity.duration}h • {activity.rating}/5 rating
                        </p>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {new Date(activity.date).toLocaleDateString()}
                      </span>
                    </>
                  )}
                  
                  {activity.type === 'payment_processed' && (
                    <>
                      <DollarSign className="h-5 w-5 text-green-600" />
                      <div className="flex-1">
                        <p className="font-medium">Payment Processed</p>
                        <p className="text-sm text-muted-foreground">
                          ${activity.amount} • {activity.period}
                        </p>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {new Date(activity.date).toLocaleDateString()}
                      </span>
                    </>
                  )}
                  
                  {activity.type === 'new_shift_assigned' && (
                    <>
                      <Calendar className="h-5 w-5 text-blue-600" />
                      <div className="flex-1">
                        <p className="font-medium">New Shift Assigned</p>
                        <p className="text-sm text-muted-foreground">
                          {activity.client} • {activity.duration}h
                        </p>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {new Date(activity.date).toLocaleDateString()}
                      </span>
                    </>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Certifications Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Certifications & Training
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {mockCaregiver.certifications.map((cert, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="font-medium">{cert}</span>
                </div>
                <Badge variant="success">Valid</Badge>
              </div>
            ))}
          </div>
          
          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div>
                <p className="font-medium text-yellow-800">Certification Reminder</p>
                <p className="text-sm text-yellow-700">
                  Your CPR certification expires in 45 days. Renew now to avoid any service interruptions.
                </p>
                <Button size="sm" variant="outline" className="mt-2">
                  Schedule Renewal
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}