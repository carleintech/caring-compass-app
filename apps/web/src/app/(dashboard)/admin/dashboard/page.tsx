'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Calendar, 
  DollarSign, 
  AlertCircle,
  CheckCircle,
  Clock,
  MapPin,
  Phone,
  Mail,
  UserPlus,
  CalendarClock,
  CreditCard,
  Activity,
  BarChart3,
  PieChart,
  LineChart
} from 'lucide-react'
import { trpc } from '@/lib/trpc'

interface DashboardMetrics {
  totalClients: number
  activeClients: number
  totalCaregivers: number
  activeCaregivers: number
  monthlyRevenue: number
  revenueGrowth: number
  scheduledVisits: number
  completedVisits: number
  pendingInvoices: number
  overduePayments: number
}

interface RecentActivity {
  id: string
  type: 'client_signup' | 'caregiver_application' | 'visit_completed' | 'payment_received' | 'issue_reported'
  description: string
  timestamp: Date
  priority: 'low' | 'medium' | 'high'
  user?: {
    name: string
    avatar?: string
  }
}

interface Alert {
  id: string
  type: 'warning' | 'error' | 'info'
  title: string
  message: string
  timestamp: Date
  actionRequired: boolean
}

export default function AdminDashboard() {
  const [timeRange, setTimeRange] = useState<'day' | 'week' | 'month' | 'quarter'>('month')
  
  // Mock data - replace with actual tRPC calls
  const [metrics] = useState<DashboardMetrics>({
    totalClients: 247,
    activeClients: 186,
    totalCaregivers: 156,
    activeCaregivers: 128,
    monthlyRevenue: 156750,
    revenueGrowth: 12.5,
    scheduledVisits: 1248,
    completedVisits: 1156,
    pendingInvoices: 23,
    overduePayments: 5
  })

  const [recentActivity] = useState<RecentActivity[]>([
    {
      id: '1',
      type: 'client_signup',
      description: 'New client registration: Sarah Johnson',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      priority: 'medium',
      user: { name: 'Sarah Johnson' }
    },
    {
      id: '2',
      type: 'visit_completed',
      description: 'Visit completed for Margaret Smith',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
      priority: 'low',
      user: { name: 'Jennifer Davis' }
    },
    {
      id: '3',
      type: 'payment_received',
      description: 'Payment received: $2,450.00',
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
      priority: 'low'
    },
    {
      id: '4',
      type: 'caregiver_application',
      description: 'New caregiver application: Michael Rodriguez',
      timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000),
      priority: 'high',
      user: { name: 'Michael Rodriguez' }
    },
    {
      id: '5',
      type: 'issue_reported',
      description: 'Client concern reported - requires follow-up',
      timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000),
      priority: 'high'
    }
  ])

  const [alerts] = useState<Alert[]>([
    {
      id: '1',
      type: 'warning',
      title: 'Low Caregiver Availability',
      message: '3 clients may not have coverage for next week',
      timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
      actionRequired: true
    },
    {
      id: '2',
      type: 'error',
      title: 'Credential Expiry Alert',
      message: '5 caregivers have credentials expiring within 30 days',
      timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
      actionRequired: true
    },
    {
      id: '3',
      type: 'info',
      title: 'System Maintenance',
      message: 'Scheduled maintenance window: Sunday 2:00 AM - 4:00 AM',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
      actionRequired: false
    }
  ])

  const getActivityIcon = (type: RecentActivity['type']) => {
    switch (type) {
      case 'client_signup': return <UserPlus className="h-4 w-4 text-blue-500" />
      case 'caregiver_application': return <Users className="h-4 w-4 text-green-500" />
      case 'visit_completed': return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'payment_received': return <CreditCard className="h-4 w-4 text-emerald-500" />
      case 'issue_reported': return <AlertCircle className="h-4 w-4 text-red-500" />
      default: return <Activity className="h-4 w-4" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200'
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'low': return 'bg-green-100 text-green-800 border-green-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getAlertIcon = (type: Alert['type']) => {
    switch (type) {
      case 'error': return <AlertCircle className="h-4 w-4 text-red-500" />
      case 'warning': return <AlertCircle className="h-4 w-4 text-yellow-500" />
      case 'info': return <AlertCircle className="h-4 w-4 text-blue-500" />
      default: return <AlertCircle className="h-4 w-4" />
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
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
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Overview of your home care operations
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <Tabs value={timeRange} onValueChange={(value: any) => setTimeRange(value)}>
            <TabsList>
              <TabsTrigger value="day">Day</TabsTrigger>
              <TabsTrigger value="week">Week</TabsTrigger>
              <TabsTrigger value="month">Month</TabsTrigger>
              <TabsTrigger value="quarter">Quarter</TabsTrigger>
            </TabsList>
          </Tabs>
          <Button>
            <BarChart3 className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Alerts */}
      {alerts.filter(alert => alert.actionRequired).length > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="text-red-800 flex items-center">
              <AlertCircle className="h-5 w-5 mr-2" />
              Action Required ({alerts.filter(alert => alert.actionRequired).length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {alerts.filter(alert => alert.actionRequired).map((alert) => (
                <div key={alert.id} className="flex items-center justify-between p-3 bg-white rounded-lg border">
                  <div className="flex items-center space-x-3">
                    {getAlertIcon(alert.type)}
                    <div>
                      <p className="font-medium">{alert.title}</p>
                      <p className="text-sm text-muted-foreground">{alert.message}</p>
                    </div>
                  </div>
                  <Button size="sm" variant="outline">
                    View Details
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Clients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.activeClients}</div>
            <p className="text-xs text-muted-foreground">
              of {metrics.totalClients} total clients
            </p>
            <Progress value={(metrics.activeClients / metrics.totalClients) * 100} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Caregivers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.activeCaregivers}</div>
            <p className="text-xs text-muted-foreground">
              of {metrics.totalCaregivers} total caregivers
            </p>
            <Progress value={(metrics.activeCaregivers / metrics.totalCaregivers) * 100} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(metrics.monthlyRevenue)}</div>
            <p className="text-xs text-muted-foreground flex items-center">
              <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
              +{metrics.revenueGrowth}% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Visit Completion</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round((metrics.completedVisits / metrics.scheduledVisits) * 100)}%
            </div>
            <p className="text-xs text-muted-foreground">
              {metrics.completedVisits} of {metrics.scheduledVisits} visits
            </p>
            <Progress value={(metrics.completedVisits / metrics.scheduledVisits) * 100} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="activity">Recent Activity</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="alerts">All Alerts</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            {/* Quick Actions */}
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>
                  Common administrative tasks
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Button className="h-20 flex-col space-y-2">
                    <UserPlus className="h-6 w-6" />
                    <span>Add New Client</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex-col space-y-2">
                    <CalendarClock className="h-6 w-6" />
                    <span>Schedule Visit</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex-col space-y-2">
                    <Users className="h-6 w-6" />
                    <span>Review Applications</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex-col space-y-2">
                    <CreditCard className="h-6 w-6" />
                    <span>Process Billing</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Financial Summary */}
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Financial Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Pending Invoices</span>
                    <Badge variant="secondary">{metrics.pendingInvoices}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Overdue Payments</span>
                    <Badge variant="destructive">{metrics.overduePayments}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Revenue This Month</span>
                    <span className="font-medium">{formatCurrency(metrics.monthlyRevenue)}</span>
                  </div>
                </div>
                <Button className="w-full" variant="outline">
                  View Financial Reports
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Operational Status */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Today&apos;s Schedule</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Total Visits</span>
                    <Badge>42</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>In Progress</span>
                    <Badge variant="secondary">8</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Completed</span>
                    <Badge className="bg-green-500">28</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Cancelled</span>
                    <Badge variant="destructive">2</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Caregiver Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>On Duty</span>
                    <Badge className="bg-green-500">24</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Available</span>
                    <Badge variant="secondary">15</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Off Today</span>
                    <Badge variant="outline">89</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Training</span>
                    <Badge className="bg-blue-500">3</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">System Health</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span>API Status</span>
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                      <span className="text-sm">Operational</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Database</span>
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                      <span className="text-sm">Healthy</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Background Jobs</span>
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
                      <span className="text-sm">2 Pending</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                Latest events and activities across the platform
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
                      <div className="flex items-center mt-1 space-x-2">
                        <Badge className={getPriorityColor(activity.priority)} variant="outline">
                          {activity.priority}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {formatTimeAgo(activity.timestamp)}
                        </span>
                      </div>
                    </div>
                    {activity.user && (
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={activity.user.avatar} />
                        <AvatarFallback>
                          {activity.user.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center border border-dashed rounded-lg">
                  <div className="text-center">
                    <LineChart className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">Revenue chart would go here</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Client Growth</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center border border-dashed rounded-lg">
                  <div className="text-center">
                    <BarChart3 className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">Growth chart would go here</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>System Alerts</CardTitle>
              <CardDescription>
                All system notifications and alerts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {alerts.map((alert) => (
                  <div key={alert.id} className="flex items-start space-x-4 p-4 border rounded-lg">
                    <div className="mt-1">
                      {getAlertIcon(alert.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{alert.title}</p>
                      <p className="text-sm text-muted-foreground">{alert.message}</p>
                      <span className="text-xs text-muted-foreground">
                        {formatTimeAgo(alert.timestamp)}
                      </span>
                    </div>
                    {alert.actionRequired && (
                      <Button size="sm" variant="outline">
                        Take Action
                      </Button>
                    )}
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