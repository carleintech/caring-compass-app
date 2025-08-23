'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { 
  Phone, 
  Mail, 
  MapPin, 
  Calendar, 
  Clock, 
  Users, 
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  Edit,
  CheckCircle,
  XCircle,
  AlertCircle,
  TrendingUp,
  UserPlus,
  CalendarPlus,
  FileText,
  DollarSign
} from 'lucide-react'
import { trpc } from '@/lib/trpc'

interface Lead {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  zipCode: string
  status: 'new' | 'contacted' | 'assessment_scheduled' | 'assessment_completed' | 'proposal_sent' | 'contracted' | 'lost'
  priority: 'low' | 'medium' | 'high'
  source: 'website' | 'referral' | 'social_media' | 'google_ads' | 'print' | 'other'
  careNeeds: string[]
  preferredStartDate: Date
  estimatedHoursPerWeek: number
  estimatedMonthlyValue: number
  notes: string
  assignedTo?: {
    id: string
    name: string
    avatar?: string
  }
  createdAt: Date
  lastContactedAt?: Date
  nextFollowUpAt?: Date
}

interface LeadActivity {
  id: string
  leadId: string
  type: 'call' | 'email' | 'meeting' | 'note' | 'status_change'
  description: string
  details?: string
  performedBy: {
    id: string
    name: string
    avatar?: string
  }
  timestamp: Date
}

export default function LeadManagement() {
  const [selectedTab, setSelectedTab] = useState('pipeline')
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [priorityFilter, setPriorityFilter] = useState<string>('all')
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
  const [showLeadDetails, setShowLeadDetails] = useState(false)
  const [showAddLead, setShowAddLead] = useState(false)

  // Mock data - replace with actual tRPC calls
  const [leads] = useState<Lead[]>([
    {
      id: '1',
      firstName: 'Margaret',
      lastName: 'Johnson',
      email: 'margaret.johnson@email.com',
      phone: '(757) 555-0123',
      address: '123 Oak Street',
      city: 'Virginia Beach',
      state: 'VA',
      zipCode: '23451',
      status: 'new',
      priority: 'high',
      source: 'website',
      careNeeds: ['Personal Care', 'Companionship', 'Meal Preparation'],
      preferredStartDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      estimatedHoursPerWeek: 20,
      estimatedMonthlyValue: 2000,
      notes: 'Needs assistance with daily activities. Lives alone, daughter lives out of state.',
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      assignedTo: {
        id: '1',
        name: 'Sarah Wilson',
        avatar: '/avatars/sarah.jpg'
      }
    },
    {
      id: '2',
      firstName: 'Robert',
      lastName: 'Chen',
      email: 'r.chen@email.com',
      phone: '(757) 555-0456',
      address: '456 Maple Ave',
      city: 'Norfolk',
      state: 'VA',
      zipCode: '23504',
      status: 'assessment_scheduled',
      priority: 'medium',
      source: 'referral',
      careNeeds: ['Transportation', 'Light Housekeeping', 'Medication Reminders'],
      preferredStartDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      estimatedHoursPerWeek: 15,
      estimatedMonthlyValue: 1500,
      notes: 'Referred by Dr. Martinez. Recent knee surgery, temporary assistance needed.',
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      lastContactedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      nextFollowUpAt: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
      assignedTo: {
        id: '2',
        name: 'Michael Davis',
        avatar: '/avatars/michael.jpg'
      }
    },
    {
      id: '3',
      firstName: 'Emily',
      lastName: 'Rodriguez',
      email: 'emily.rodriguez@email.com',
      phone: '(757) 555-0789',
      address: '789 Pine Street',
      city: 'Chesapeake',
      state: 'VA',
      zipCode: '23320',
      status: 'proposal_sent',
      priority: 'high',
      source: 'google_ads',
      careNeeds: ['Personal Care', 'Dementia Care', 'Meal Preparation', 'Companionship'],
      preferredStartDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      estimatedHoursPerWeek: 30,
      estimatedMonthlyValue: 3600,
      notes: 'Mother with early-stage Alzheimer\'s. Looking for compassionate care team.',
      createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      lastContactedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      nextFollowUpAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      assignedTo: {
        id: '1',
        name: 'Sarah Wilson',
        avatar: '/avatars/sarah.jpg'
      }
    }
  ])

  const [activities] = useState<LeadActivity[]>([
    {
      id: '1',
      leadId: '1',
      type: 'call',
      description: 'Initial consultation call',
      details: 'Discussed care needs and preferences. Very interested in our services.',
      performedBy: { id: '1', name: 'Sarah Wilson' },
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000)
    },
    {
      id: '2',
      leadId: '2',
      type: 'email',
      description: 'Sent intake forms',
      details: 'Emailed comprehensive intake package for review.',
      performedBy: { id: '2', name: 'Michael Davis' },
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000)
    }
  ])

  const getStatusColor = (status: Lead['status']) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'contacted': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'assessment_scheduled': return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'assessment_completed': return 'bg-indigo-100 text-indigo-800 border-indigo-200'
      case 'proposal_sent': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'contracted': return 'bg-green-100 text-green-800 border-green-200'
      case 'lost': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getPriorityColor = (priority: Lead['priority']) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200'
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'low': return 'bg-green-100 text-green-800 border-green-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusLabel = (status: Lead['status']) => {
    switch (status) {
      case 'new': return 'New'
      case 'contacted': return 'Contacted'
      case 'assessment_scheduled': return 'Assessment Scheduled'
      case 'assessment_completed': return 'Assessment Completed'
      case 'proposal_sent': return 'Proposal Sent'
      case 'contracted': return 'Contracted'
      case 'lost': return 'Lost'
      default: return status
    }
  }

  const getActivityIcon = (type: LeadActivity['type']) => {
    switch (type) {
      case 'call': return <Phone className="h-4 w-4 text-blue-500" />
      case 'email': return <Mail className="h-4 w-4 text-green-500" />
      case 'meeting': return <Calendar className="h-4 w-4 text-purple-500" />
      case 'note': return <FileText className="h-4 w-4 text-gray-500" />
      case 'status_change': return <TrendingUp className="h-4 w-4 text-orange-500" />
      default: return <FileText className="h-4 w-4" />
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date)
  }

  const formatTimeAgo = (date: Date) => {
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${diffInHours}h ago`
    return `${Math.floor(diffInHours / 24)}d ago`
  }

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || lead.status === statusFilter
    const matchesPriority = priorityFilter === 'all' || lead.priority === priorityFilter
    
    return matchesSearch && matchesStatus && matchesPriority
  })

  const leadsByStatus = {
    new: leads.filter(lead => lead.status === 'new').length,
    contacted: leads.filter(lead => lead.status === 'contacted').length,
    assessment_scheduled: leads.filter(lead => lead.status === 'assessment_scheduled').length,
    assessment_completed: leads.filter(lead => lead.status === 'assessment_completed').length,
    proposal_sent: leads.filter(lead => lead.status === 'proposal_sent').length,
    contracted: leads.filter(lead => lead.status === 'contracted').length,
    lost: leads.filter(lead => lead.status === 'lost').length,
  }

  const totalPipelineValue = leads
    .filter(lead => !['contracted', 'lost'].includes(lead.status))
    .reduce((sum, lead) => sum + (lead.estimatedMonthlyValue * 12), 0)

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Lead Management</h1>
          <p className="text-muted-foreground">
            Manage your sales pipeline and convert leads to clients
          </p>
        </div>
        <Dialog open={showAddLead} onOpenChange={setShowAddLead}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Lead
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Add New Lead</DialogTitle>
              <DialogDescription>
                Create a new lead record from an inquiry or referral
              </DialogDescription>
            </DialogHeader>
            {/* Add lead form would go here */}
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" placeholder="Enter first name" />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" placeholder="Enter last name" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="Enter email address" />
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" placeholder="Enter phone number" />
                </div>
              </div>
              <div>
                <Label htmlFor="address">Address</Label>
                <Input id="address" placeholder="Enter full address" />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input id="city" placeholder="City" />
                </div>
                <div>
                  <Label htmlFor="state">State</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select state" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="VA">Virginia</SelectItem>
                      <SelectItem value="NC">North Carolina</SelectItem>
                      <SelectItem value="MD">Maryland</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="zipCode">ZIP Code</Label>
                  <Input id="zipCode" placeholder="ZIP Code" />
                </div>
              </div>
              <div>
                <Label htmlFor="notes">Initial Notes</Label>
                <Textarea id="notes" placeholder="Enter any initial notes about the lead..." />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowAddLead(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setShowAddLead(false)}>
                  Create Lead
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Pipeline Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pipeline Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalPipelineValue)}</div>
            <p className="text-xs text-muted-foreground">
              Annual recurring revenue potential
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Leads</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {leads.filter(lead => !['contracted', 'lost'].includes(lead.status)).length}
            </div>
            <p className="text-xs text-muted-foreground">
              In sales pipeline
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">68%</div>
            <p className="text-xs text-muted-foreground">
              Lead to client conversion
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Sales Cycle</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12 days</div>
            <p className="text-xs text-muted-foreground">
              Lead to contract
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList>
          <TabsTrigger value="pipeline">Pipeline</TabsTrigger>
          <TabsTrigger value="leads">All Leads</TabsTrigger>
          <TabsTrigger value="activities">Activities</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="pipeline" className="space-y-4">
          {/* Pipeline Kanban Board */}
          <div className="grid grid-cols-7 gap-4 min-h-[600px]">
            {Object.entries(leadsByStatus).map(([status, count]) => (
              <Card key={status} className="flex flex-col">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center justify-between">
                    {getStatusLabel(status as Lead['status'])}
                    <Badge variant="secondary">{count}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-1 space-y-2">
                  {leads
                    .filter(lead => lead.status === status)
                    .map(lead => (
                      <Card 
                        key={lead.id} 
                        className="p-3 cursor-pointer hover:shadow-md transition-shadow"
                        onClick={() => {
                          setSelectedLead(lead)
                          setShowLeadDetails(true)
                        }}
                      >
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <p className="font-medium text-sm">
                              {lead.firstName} {lead.lastName}
                            </p>
                            <Badge className={getPriorityColor(lead.priority)} variant="outline">
                              {lead.priority}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {formatCurrency(lead.estimatedMonthlyValue)}/mo
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {lead.city}, {lead.state}
                          </p>
                          {lead.assignedTo && (
                            <div className="flex items-center space-x-1">
                              <Avatar className="h-4 w-4">
                                <AvatarImage src={lead.assignedTo.avatar} />
                                <AvatarFallback className="text-xs">
                                  {lead.assignedTo.name.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-xs text-muted-foreground">
                                {lead.assignedTo.name}
                              </span>
                            </div>
                          )}
                        </div>
                      </Card>
                    ))}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="leads" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex space-x-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search leads..."
                      className="pl-8"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="contacted">Contacted</SelectItem>
                    <SelectItem value="assessment_scheduled">Assessment Scheduled</SelectItem>
                    <SelectItem value="proposal_sent">Proposal Sent</SelectItem>
                    <SelectItem value="contracted">Contracted</SelectItem>
                    <SelectItem value="lost">Lost</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filter by priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Priorities</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Leads Table */}
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Lead</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Value</TableHead>
                  <TableHead>Assigned To</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLeads.map((lead) => (
                  <TableRow key={lead.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{lead.firstName} {lead.lastName}</p>
                        <p className="text-sm text-muted-foreground">
                          {lead.city}, {lead.state}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center space-x-1">
                          <Mail className="h-3 w-3" />
                          <span className="text-sm">{lead.email}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Phone className="h-3 w-3" />
                          <span className="text-sm">{lead.phone}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(lead.status)} variant="outline">
                        {getStatusLabel(lead.status)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getPriorityColor(lead.priority)} variant="outline">
                        {lead.priority}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{formatCurrency(lead.estimatedMonthlyValue)}</p>
                        <p className="text-xs text-muted-foreground">{lead.estimatedHoursPerWeek}h/week</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      {lead.assignedTo && (
                        <div className="flex items-center space-x-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={lead.assignedTo.avatar} />
                            <AvatarFallback className="text-xs">
                              {lead.assignedTo.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm">{lead.assignedTo.name}</span>
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">{formatDate(lead.createdAt)}</span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedLead(lead)
                          setShowLeadDetails(true)
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        <TabsContent value="activities" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activities</CardTitle>
              <CardDescription>
                Latest interactions with leads
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activities.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-4 p-4 border rounded-lg">
                    <div className="mt-1">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{activity.description}</p>
                      {activity.details && (
                        <p className="text-sm text-muted-foreground mt-1">{activity.details}</p>
                      )}
                      <div className="flex items-center mt-2 space-x-2">
                        <span className="text-xs text-muted-foreground">
                          {formatTimeAgo(activity.timestamp)}
                        </span>
                        <span className="text-xs text-muted-foreground">•</span>
                        <span className="text-xs text-muted-foreground">
                          by {activity.performedBy.name}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Pipeline Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center border border-dashed rounded-lg">
                  <div className="text-center">
                    <TrendingUp className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">Pipeline analytics would go here</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Lead Sources</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center border border-dashed rounded-lg">
                  <div className="text-center">
                    <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">Source breakdown would go here</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Lead Details Dialog */}
      <Dialog open={showLeadDetails} onOpenChange={setShowLeadDetails}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>
              {selectedLead && `${selectedLead.firstName} ${selectedLead.lastName}`}
            </DialogTitle>
            <DialogDescription>
              Lead details and activity history
            </DialogDescription>
          </DialogHeader>
          {selectedLead && (
            <div className="grid gap-6 py-4">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Contact Information</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center space-x-2">
                        <Mail className="h-4 w-4" />
                        <span>{selectedLead.email}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Phone className="h-4 w-4" />
                        <span>{selectedLead.phone}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4" />
                        <span>
                          {selectedLead.address}, {selectedLead.city}, {selectedLead.state} {selectedLead.zipCode}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Care Requirements</h4>
                    <div className="flex flex-wrap gap-1">
                      {selectedLead.careNeeds.map((need) => (
                        <Badge key={need} variant="secondary">
                          {need}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Lead Status</h4>
                    <div className="space-y-2">
                      <Badge className={getStatusColor(selectedLead.status)} variant="outline">
                        {getStatusLabel(selectedLead.status)}
                      </Badge>
                      <Badge className={getPriorityColor(selectedLead.priority)} variant="outline">
                        {selectedLead.priority} priority
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Estimated Value</h4>
                    <div className="text-sm space-y-1">
                      <p>Monthly: {formatCurrency(selectedLead.estimatedMonthlyValue)}</p>
                      <p>Hours/week: {selectedLead.estimatedHoursPerWeek}</p>
                      <p>Annual: {formatCurrency(selectedLead.estimatedMonthlyValue * 12)}</p>
                    </div>
                  </div>
                </div>
              </div>
              {selectedLead.notes && (
                <div>
                  <h4 className="font-medium mb-2">Notes</h4>
                  <p className="text-sm text-muted-foreground">{selectedLead.notes}</p>
                </div>
              )}
              <div className="flex space-x-2">
                <Button className="flex-1">
                  <Phone className="h-4 w-4 mr-2" />
                  Call Lead
                </Button>
                <Button variant="outline" className="flex-1">
                  <Mail className="h-4 w-4 mr-2" />
                  Send Email
                </Button>
                <Button variant="outline" className="flex-1">
                  <CalendarPlus className="h-4 w-4 mr-2" />
                  Schedule Assessment
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}