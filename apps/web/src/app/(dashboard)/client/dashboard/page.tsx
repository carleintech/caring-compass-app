'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { BackToHomeButton } from '@/components/ui/back-to-home-button'
import { 
  Calendar, 
  Clock, 
  Heart, 
  MessageSquare, 
  FileText, 
  CreditCard,
  User,
  Phone,
  MapPin,
  CheckCircle,
  AlertCircle,
  Star,
  Activity,
  Bell,
  Settings
} from 'lucide-react'

interface UpcomingVisit {
  id: string
  caregiverName: string
  caregiverAvatar?: string
  date: Date
  duration: string
  services: string[]
  status: 'confirmed' | 'pending' | 'completed'
}

interface RecentActivity {
  id: string
  type: 'visit_completed' | 'message_received' | 'care_plan_updated' | 'payment_processed'
  description: string
  timestamp: Date
  caregiverName?: string
}

export default function ClientDashboard() {
  const [upcomingVisits] = useState<UpcomingVisit[]>([
    {
      id: '1',
      caregiverName: 'Sarah Johnson',
      date: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
      duration: '2 hours',
      services: ['Personal Care', 'Medication Reminder'],
      status: 'confirmed'
    },
    {
      id: '2',
      caregiverName: 'Michael Davis',
      date: new Date(Date.now() + 26 * 60 * 60 * 1000), // Tomorrow
      duration: '3 hours',
      services: ['Companionship', 'Light Housekeeping'],
      status: 'confirmed'
    },
    {
      id: '3',
      caregiverName: 'Jennifer Wilson',
      date: new Date(Date.now() + 50 * 60 * 60 * 1000), // Day after tomorrow
      duration: '2.5 hours',
      services: ['Personal Care', 'Meal Preparation'],
      status: 'pending'
    }
  ])

  const [recentActivity] = useState<RecentActivity[]>([
    {
      id: '1',
      type: 'visit_completed',
      description: 'Visit completed successfully',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
      caregiverName: 'Sarah Johnson'
    },
    {
      id: '2',
      type: 'message_received',
      description: 'New message from your care team',
      timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000)
    },
    {
      id: '3',
      type: 'care_plan_updated',
      description: 'Care plan has been updated',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000)
    },
    {
      id: '4',
      type: 'payment_processed',
      description: 'Payment processed successfully',
      timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000)
    }
  ])

  const getActivityIcon = (type: RecentActivity['type']) => {
    switch (type) {
      case 'visit_completed': return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'message_received': return <MessageSquare className="h-4 w-4 text-blue-500" />
      case 'care_plan_updated': return <FileText className="h-4 w-4 text-orange-500" />
      case 'payment_processed': return <CreditCard className="h-4 w-4 text-emerald-500" />
      default: return <Activity className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'completed': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
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
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    if (date.toDateString() === today.toDateString()) {
      return 'Today'
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow'
    } else {
      return date.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'short',
        day: 'numeric'
      })
    }
  }

  const formatTimeAgo = (date: Date) => {
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${diffInHours}h ago`
    return `${Math.floor(diffInHours / 24)}d ago`
  }

  return (
    <div className="space-y-8">
      {/* Back Button */}
      <div className="flex justify-start">
        <BackToHomeButton />
      </div>
      
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome back, Margaret</h1>
          <p className="text-muted-foreground">
            Here&apos;s an overview of your care services
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm">
            <Bell className="h-4 w-4 mr-2" />
            Notifications
          </Button>
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Next Visit</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {upcomingVisits.length > 0 ? formatTime(upcomingVisits[0].date) : 'None'}
            </div>
            <p className="text-xs text-muted-foreground">
              {upcomingVisits.length > 0 ? formatDate(upcomingVisits[0].date) : 'No upcoming visits'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Week</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">
              Scheduled visits
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Care Team</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">
              Active caregivers
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Satisfaction</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.9</div>
            <p className="text-xs text-muted-foreground">
              Average rating
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="visits">Upcoming Visits</TabsTrigger>
          <TabsTrigger value="activity">Recent Activity</TabsTrigger>
          <TabsTrigger value="care-team">Care Team</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            {/* Next Visit Card */}
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Next Visit</CardTitle>
                <CardDescription>
                  Your upcoming care appointment
                </CardDescription>
              </CardHeader>
              <CardContent>
                {upcomingVisits.length > 0 ? (
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={upcomingVisits[0].caregiverAvatar} />
                        <AvatarFallback>
                          {upcomingVisits[0].caregiverName.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="font-medium">{upcomingVisits[0].caregiverName}</p>
                        <p className="text-sm text-muted-foreground">
                          {formatDate(upcomingVisits[0].date)} at {formatTime(upcomingVisits[0].date)}
                        </p>
                      </div>
                      <Badge className={getStatusColor(upcomingVisits[0].status)}>
                        {upcomingVisits[0].status}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Duration:</span>
                        <span>{upcomingVisits[0].duration}</span>
                      </div>
                      <div className="space-y-1">
                        <span className="text-sm font-medium">Services:</span>
                        <div className="flex flex-wrap gap-1">
                          {upcomingVisits[0].services.map((service, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {service}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm">
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Message Caregiver
                      </Button>
                      <Button size="sm" variant="outline">
                        <Phone className="h-4 w-4 mr-2" />
                        Call
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">No upcoming visits scheduled</p>
                    <Button className="mt-4">Schedule a Visit</Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button className="w-full justify-start" variant="outline">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Send Message
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule Visit
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <FileText className="h-4 w-4 mr-2" />
                  View Care Plan
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <CreditCard className="h-4 w-4 mr-2" />
                  Billing & Payments
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Care Progress */}
          <Card>
            <CardHeader>
              <CardTitle>Care Progress</CardTitle>
              <CardDescription>
                Your health and wellness journey
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Medication Adherence</span>
                    <span>95%</span>
                  </div>
                  <Progress value={95} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Physical Activity Goals</span>
                    <span>78%</span>
                  </div>
                  <Progress value={78} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Nutrition Goals</span>
                    <span>88%</span>
                  </div>
                  <Progress value={88} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="visits" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Visits</CardTitle>
              <CardDescription>
                Your scheduled care appointments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingVisits.map((visit) => (
                  <div key={visit.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={visit.caregiverAvatar} />
                      <AvatarFallback>
                        {visit.caregiverName.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium">{visit.caregiverName}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(visit.date)} at {formatTime(visit.date)} • {visit.duration}
                      </p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {visit.services.map((service, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {service}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <Badge className={getStatusColor(visit.status)}>
                      {visit.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                Latest updates and activities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-4 p-4 border rounded-lg">
                    <div className="mt-1">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{activity.description}</p>
                      {activity.caregiverName && (
                        <p className="text-sm text-muted-foreground">
                          by {activity.caregiverName}
                        </p>
                      )}
                      <span className="text-xs text-muted-foreground">
                        {formatTimeAgo(activity.timestamp)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="care-team" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Your Care Team</CardTitle>
              <CardDescription>
                The professionals caring for you
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {['Sarah Johnson', 'Michael Davis', 'Jennifer Wilson'].map((name, index) => (
                  <div key={index} className="flex items-center space-x-4 p-4 border rounded-lg">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback>
                        {name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-medium">{name}</p>
                      <p className="text-sm text-muted-foreground">Certified Home Care Aide</p>
                      <div className="flex items-center mt-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-sm ml-1">4.9</span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">
                        <MessageSquare className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Phone className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
