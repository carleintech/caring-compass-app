'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { 
  BarChart3, 
  LineChart, 
  PieChart, 
  TrendingUp, 
  TrendingDown,
  Download,
  Calendar,
  DollarSign,
  Users,
  Clock,
  Star,
  AlertCircle,
  CheckCircle,
  FileText,
  Filter,
  RefreshCw,
  Eye,
  Share,
  Settings
} from 'lucide-react'
import { trpc } from '@/lib/trpc'

interface ReportMetrics {
  totalRevenue: number
  revenueGrowth: number
  totalClients: number
  clientGrowth: number
  totalCaregivers: number
  caregiverRetention: number
  totalVisits: number
  visitCompletionRate: number
  averageVisitDuration: number
  clientSatisfactionScore: number
  overtimeHours: number
  evvCompliance: number
}

interface FinancialData {
  month: string
  revenue: number
  expenses: number
  profit: number
  invoicesPaid: number
  invoicesOverdue: number
}

interface OperationalData {
  date: string
  visitsScheduled: number
  visitsCompleted: number
  visitsCancelled: number
  noShows: number
  evvCompliance: number
}

interface CaregiverPerformance {
  id: string
  name: string
  avatar?: string
  hoursWorked: number
  visitsCompleted: number
  clientRating: number
  onTimePercentage: number
  evvCompliance: number
  status: 'active' | 'inactive' | 'training'
}

interface ClientMetrics {
  id: string
  name: string
  totalHours: number
  monthlyValue: number
  satisfactionScore: number
  visitsThisMonth: number
  caregiverConsistency: number
  status: 'active' | 'paused' | 'terminated'
}

export default function ReportsAnalytics() {
  const [selectedTimeRange, setSelectedTimeRange] = useState<'week' | 'month' | 'quarter' | 'year'>('month')
  const [selectedReport, setSelectedReport] = useState('overview')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  // Mock data - replace with actual tRPC calls
  const [metrics] = useState<ReportMetrics>({
    totalRevenue: 186750,
    revenueGrowth: 12.5,
    totalClients: 247,
    clientGrowth: 8.3,
    totalCaregivers: 156,
    caregiverRetention: 89.2,
    totalVisits: 1456,
    visitCompletionRate: 94.8,
    averageVisitDuration: 125,
    clientSatisfactionScore: 4.7,
    overtimeHours: 42,
    evvCompliance: 98.2
  })

  const [financialData] = useState<FinancialData[]>([
    { month: 'Jan', revenue: 142000, expenses: 98000, profit: 44000, invoicesPaid: 89, invoicesOverdue: 3 },
    { month: 'Feb', revenue: 155000, expenses: 105000, profit: 50000, invoicesPaid: 92, invoicesOverdue: 2 },
    { month: 'Mar', revenue: 168000, expenses: 112000, profit: 56000, invoicesPaid: 94, invoicesOverdue: 1 },
    { month: 'Apr', revenue: 174000, expenses: 118000, profit: 56000, invoicesPaid: 91, invoicesOverdue: 4 },
    { month: 'May', revenue: 182000, expenses: 124000, profit: 58000, invoicesPaid: 95, invoicesOverdue: 2 },
    { month: 'Jun', revenue: 186750, expenses: 128000, profit: 58750, invoicesPaid: 96, invoicesOverdue: 1 }
  ])

  const [operationalData] = useState<OperationalData[]>([
    { date: '2024-03-01', visitsScheduled: 45, visitsCompleted: 42, visitsCancelled: 2, noShows: 1, evvCompliance: 97.6 },
    { date: '2024-03-02', visitsScheduled: 48, visitsCompleted: 46, visitsCancelled: 1, noShows: 1, evvCompliance: 98.9 },
    { date: '2024-03-03', visitsScheduled: 52, visitsCompleted: 51, visitsCancelled: 0, noShows: 1, evvCompliance: 99.1 },
    { date: '2024-03-04', visitsScheduled: 49, visitsCompleted: 47, visitsCancelled: 1, noShows: 1, evvCompliance: 98.3 },
    { date: '2024-03-05', visitsScheduled: 51, visitsCompleted: 49, visitsCancelled: 2, noShows: 0, evvCompliance: 98.7 }
  ])

  const [caregiverPerformance] = useState<CaregiverPerformance[]>([
    {
      id: '1',
      name: 'Sarah Wilson',
      avatar: '/avatars/sarah.jpg',
      hoursWorked: 156,
      visitsCompleted: 89,
      clientRating: 4.9,
      onTimePercentage: 98.5,
      evvCompliance: 99.2,
      status: 'active'
    },
    {
      id: '2',
      name: 'Michael Davis',
      avatar: '/avatars/michael.jpg',
      hoursWorked: 142,
      visitsCompleted: 78,
      clientRating: 4.7,
      onTimePercentage: 95.8,
      evvCompliance: 97.8,
      status: 'active'
    },
    {
      id: '3',
      name: 'Jennifer Garcia',
      avatar: '/avatars/jennifer.jpg',
      hoursWorked: 134,
      visitsCompleted: 72,
      clientRating: 4.8,
      onTimePercentage: 97.2,
      evvCompliance: 98.5,
      status: 'active'
    },
    {
      id: '4',
      name: 'David Thompson',
      avatar: '/avatars/david.jpg',
      hoursWorked: 89,
      visitsCompleted: 45,
      clientRating: 4.6,
      onTimePercentage: 94.1,
      evvCompliance: 96.8,
      status: 'training'
    }
  ])

  const [clientMetrics] = useState<ClientMetrics[]>([
    {
      id: '1',
      name: 'Margaret Johnson',
      totalHours: 78,
      monthlyValue: 2850,
      satisfactionScore: 4.9,
      visitsThisMonth: 24,
      caregiverConsistency: 95,
      status: 'active'
    },
    {
      id: '2',
      name: 'Robert Chen',
      totalHours: 56,
      monthlyValue: 2240,
      satisfactionScore: 4.7,
      visitsThisMonth: 18,
      caregiverConsistency: 88,
      status: 'active'
    },
    {
      id: '3',
      name: 'Emily Rodriguez',
      totalHours: 92,
      monthlyValue: 3680,
      satisfactionScore: 4.8,
      visitsThisMonth: 28,
      caregiverConsistency: 92,
      status: 'active'
    }
  ])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200'
      case 'inactive': return 'bg-red-100 text-red-800 border-red-200'
      case 'training': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'paused': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'terminated': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const exportReport = () => {
    // Implementation for exporting reports
    console.log('Exporting report...')
  }

  const scheduleReport = () => {
    // Implementation for scheduling automatic reports
    console.log('Scheduling report...')
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reports & Analytics</h1>
          <p className="text-muted-foreground">
            Comprehensive business intelligence and performance metrics
          </p>
        </div>
        <div className="flex items-center space-x-4">
          {/* Time Range Selector */}
          <Select value={selectedTimeRange} onValueChange={(value: any) => setSelectedTimeRange(value)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Last Week</SelectItem>
              <SelectItem value="month">Last Month</SelectItem>
              <SelectItem value="quarter">Last Quarter</SelectItem>
              <SelectItem value="year">Last Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={exportReport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(metrics.totalRevenue)}</div>
            <p className="text-xs text-muted-foreground flex items-center">
              <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
              +{formatPercentage(metrics.revenueGrowth)} from last period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Clients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalClients}</div>
            <p className="text-xs text-muted-foreground flex items-center">
              <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
              +{formatPercentage(metrics.clientGrowth)} growth
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Visit Completion</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPercentage(metrics.visitCompletionRate)}</div>
            <p className="text-xs text-muted-foreground">
              {metrics.totalVisits} visits completed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Client Satisfaction</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.clientSatisfactionScore}/5</div>
            <p className="text-xs text-muted-foreground">
              Average satisfaction score
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Report Tabs */}
      <Tabs value={selectedReport} onValueChange={setSelectedReport}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="financial">Financial</TabsTrigger>
          <TabsTrigger value="operational">Operational</TabsTrigger>
          <TabsTrigger value="caregivers">Caregivers</TabsTrigger>
          <TabsTrigger value="clients">Clients</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Revenue Trend Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Revenue Trend</CardTitle>
                <CardDescription>Monthly revenue over the last 6 months</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center border border-dashed rounded-lg">
                  <div className="text-center">
                    <LineChart className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">Revenue trend chart</p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Latest: {formatCurrency(financialData[financialData.length - 1]?.revenue || 0)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Visit Completion Rate */}
            <Card>
              <CardHeader>
                <CardTitle>Visit Completion Rate</CardTitle>
                <CardDescription>Daily completion rates for the last week</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center border border-dashed rounded-lg">
                  <div className="text-center">
                    <BarChart3 className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">Visit completion chart</p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Average: {formatPercentage(metrics.visitCompletionRate)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Key Performance Indicators */}
          <Card>
            <CardHeader>
              <CardTitle>Key Performance Indicators</CardTitle>
              <CardDescription>Critical metrics for business health</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Caregiver Retention</span>
                    <span className="text-sm">{formatPercentage(metrics.caregiverRetention)}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full" 
                      style={{ width: `${metrics.caregiverRetention}%` }}
                    ></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">EVV Compliance</span>
                    <span className="text-sm">{formatPercentage(metrics.evvCompliance)}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${metrics.evvCompliance}%` }}
                    ></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">On-Time Performance</span>
                    <span className="text-sm">96.8%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-purple-600 h-2 rounded-full" 
                      style={{ width: '96.8%' }}
                    ></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="financial" className="space-y-4">
          {/* Financial Summary */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {formatCurrency(metrics.totalRevenue)}
                </div>
                <p className="text-sm text-muted-foreground">
                  +{formatPercentage(metrics.revenueGrowth)} vs last period
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Profit Margin</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">31.4%</div>
                <p className="text-sm text-muted-foreground">
                  +2.1% vs last period
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Collection Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">94.8%</div>
                <p className="text-sm text-muted-foreground">
                  Average payment collection
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Financial Table */}
          <Card>
            <CardHeader>
              <CardTitle>Monthly Financial Performance</CardTitle>
              <CardDescription>Detailed breakdown by month</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Month</TableHead>
                    <TableHead>Revenue</TableHead>
                    <TableHead>Expenses</TableHead>
                    <TableHead>Profit</TableHead>
                    <TableHead>Invoices Paid</TableHead>
                    <TableHead>Overdue</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {financialData.map((data) => (
                    <TableRow key={data.month}>
                      <TableCell className="font-medium">{data.month}</TableCell>
                      <TableCell>{formatCurrency(data.revenue)}</TableCell>
                      <TableCell>{formatCurrency(data.expenses)}</TableCell>
                      <TableCell className="text-green-600">{formatCurrency(data.profit)}</TableCell>
                      <TableCell>
                        <Badge className="bg-green-100 text-green-800 border-green-200" variant="outline">
                          {data.invoicesPaid}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={data.invoicesOverdue > 2 ? 
                          'bg-red-100 text-red-800 border-red-200' : 
                          'bg-yellow-100 text-yellow-800 border-yellow-200'
                        } variant="outline">
                          {data.invoicesOverdue}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="operational" className="space-y-4">
          {/* Operational Metrics */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Average Visit Duration</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics.averageVisitDuration}min</div>
                <p className="text-sm text-muted-foreground">
                  Across all services
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">EVV Compliance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatPercentage(metrics.evvCompliance)}</div>
                <p className="text-sm text-muted-foreground">
                  Electronic visit verification
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Overtime Hours</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics.overtimeHours}h</div>
                <p className="text-sm text-muted-foreground">
                  This month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">No-Show Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2.1%</div>
                <p className="text-sm text-muted-foreground">
                  Below industry average
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Operational Data Table */}
          <Card>
            <CardHeader>
              <CardTitle>Daily Operational Summary</CardTitle>
              <CardDescription>Visit statistics for the last 5 days</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Scheduled</TableHead>
                    <TableHead>Completed</TableHead>
                    <TableHead>Cancelled</TableHead>
                    <TableHead>No Shows</TableHead>
                    <TableHead>Completion Rate</TableHead>
                    <TableHead>EVV Compliance</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {operationalData.map((data) => (
                    <TableRow key={data.date}>
                      <TableCell className="font-medium">
                        {new Date(data.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </TableCell>
                      <TableCell>{data.visitsScheduled}</TableCell>
                      <TableCell className="text-green-600">{data.visitsCompleted}</TableCell>
                      <TableCell className="text-orange-600">{data.visitsCancelled}</TableCell>
                      <TableCell className="text-red-600">{data.noShows}</TableCell>
                      <TableCell>
                        {formatPercentage((data.visitsCompleted / data.visitsScheduled) * 100)}
                      </TableCell>
                      <TableCell>
                        <Badge className={data.evvCompliance >= 98 ? 
                          'bg-green-100 text-green-800 border-green-200' : 
                          'bg-yellow-100 text-yellow-800 border-yellow-200'
                        } variant="outline">
                          {formatPercentage(data.evvCompliance)}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="caregivers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Caregiver Performance Summary</CardTitle>
              <CardDescription>Individual performance metrics and rankings</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Caregiver</TableHead>
                    <TableHead>Hours Worked</TableHead>
                    <TableHead>Visits Completed</TableHead>
                    <TableHead>Client Rating</TableHead>
                    <TableHead>On-Time %</TableHead>
                    <TableHead>EVV Compliance</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {caregiverPerformance.map((caregiver) => (
                    <TableRow key={caregiver.id}>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                            {caregiver.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <span className="font-medium">{caregiver.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>{caregiver.hoursWorked}h</TableCell>
                      <TableCell>{caregiver.visitsCompleted}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span>{caregiver.clientRating}</span>
                        </div>
                      </TableCell>
                      <TableCell>{formatPercentage(caregiver.onTimePercentage)}</TableCell>
                      <TableCell>{formatPercentage(caregiver.evvCompliance)}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(caregiver.status)} variant="outline">
                          {caregiver.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="clients" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Client Value Analysis</CardTitle>
              <CardDescription>Client satisfaction and revenue metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Client</TableHead>
                    <TableHead>Total Hours</TableHead>
                    <TableHead>Monthly Value</TableHead>
                    <TableHead>Satisfaction</TableHead>
                    <TableHead>Visits This Month</TableHead>
                    <TableHead>Caregiver Consistency</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {clientMetrics.map((client) => (
                    <TableRow key={client.id}>
                      <TableCell className="font-medium">{client.name}</TableCell>
                      <TableCell>{client.totalHours}h</TableCell>
                      <TableCell>{formatCurrency(client.monthlyValue)}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span>{client.satisfactionScore}</span>
                        </div>
                      </TableCell>
                      <TableCell>{client.visitsThisMonth}</TableCell>
                      <TableCell>{formatPercentage(client.caregiverConsistency)}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(client.status)} variant="outline">
                          {client.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Report Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Report Actions</CardTitle>
          <CardDescription>Export, schedule, and customize reports</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4">
            <Button onClick={exportReport}>
              <Download className="h-4 w-4 mr-2" />
              Export to PDF
            </Button>
            <Button variant="outline" onClick={exportReport}>
              <FileText className="h-4 w-4 mr-2" />
              Export to Excel
            </Button>
            <Button variant="outline" onClick={scheduleReport}>
              <Calendar className="h-4 w-4 mr-2" />
              Schedule Report
            </Button>
            <Button variant="outline">
              <Share className="h-4 w-4 mr-2" />
              Share Report
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}