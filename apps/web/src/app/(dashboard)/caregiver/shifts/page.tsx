'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Calendar } from '@/components/ui/calendar'
import { toast } from '@/hooks/use-toast'
import { 
  Calendar as CalendarIcon, 
  Clock, 
  MapPin, 
  Phone, 
  Navigation,
  CheckCircle,
  X,
  AlertCircle,
  Star,
  Timer,
  DollarSign,
  FileText,
  Filter,
  Search,
  Plus,
  Eye,
  MessageCircle,
  Users,
  ThumbsUp,
  ThumbsDown
} from 'lucide-react'

// Mock data for shifts
const mockShifts = [
  {
    id: '1',
    status: 'scheduled',
    client: {
      name: 'Margaret Johnson',
      address: '123 Oceanfront Ave, Virginia Beach, VA 23451',
      phone: '(757) 555-0123',
      photo: '',
      preferences: 'Prefers morning care routine at 10:30 AM',
      emergencyContact: 'John Johnson (Son) - (757) 555-0124'
    },
    date: '2025-01-20',
    startTime: '10:00',
    endTime: '14:00',
    duration: 4,
    hourlyRate: 24.00,
    totalPay: 96.00,
    tasks: ['Personal care', 'Meal preparation', 'Light housekeeping', 'Medication reminders'],
    specialInstructions: 'Client has mobility issues, assist with transfers',
    mileage: 12.5,
    isRecurring: true,
    recurringType: 'weekly'
  },
  {
    id: '2',
    status: 'available',
    client: {
      name: 'Robert Chen',
      address: '456 Shore Dr, Norfolk, VA 23503',
      phone: '(757) 555-0456',
      photo: '',
      preferences: 'Quiet environment, enjoys reading',
      emergencyContact: 'Linda Chen (Wife) - (757) 555-0457'
    },
    date: '2025-01-21',
    startTime: '16:00',
    endTime: '20:00',
    duration: 4,
    hourlyRate: 26.00,
    totalPay: 104.00,
    tasks: ['Companionship', 'Evening routine', 'Dinner preparation'],
    specialInstructions: 'Client has dementia, use calm and patient approach',
    mileage: 18.2,
    isRecurring: false,
    urgency: 'high'
  },
  {
    id: '3',
    status: 'completed',
    client: {
      name: 'Eleanor Martinez',
      address: '789 Atlantic Ave, Virginia Beach, VA 23451',
      phone: '(757) 555-0789',
      photo: '',
      preferences: 'Spanish speaking preferred',
      emergencyContact: 'Carlos Martinez (Son) - (757) 555-0790'
    },
    date: '2025-01-18',
    startTime: '08:00',
    endTime: '14:00',
    duration: 6,
    hourlyRate: 24.00,
    totalPay: 144.00,
    tasks: ['Personal care', 'Physical therapy exercises', 'Meal preparation', 'Transportation'],
    specialInstructions: 'Post-surgery care, monitor incision site',
    mileage: 8.3,
    isRecurring: true,
    recurringType: 'daily',
    rating: 5,
    feedback: 'Excellent care provided, very professional'
  },
  {
    id: '4',
    status: 'cancelled',
    client: {
      name: 'William Thompson',
      address: '321 Main St, Chesapeake, VA 23320',
      phone: '(757) 555-0321',
      photo: '',
      preferences: 'Male caregiver preferred',
      emergencyContact: 'Sarah Thompson (Daughter) - (757) 555-0322'
    },
    date: '2025-01-19',
    startTime: '12:00',
    endTime: '18:00',
    duration: 6,
    hourlyRate: 25.00,
    totalPay: 150.00,
    tasks: ['Personal care', 'Mobility assistance', 'Meal preparation'],
    specialInstructions: 'Client hospitalized',
    mileage: 22.1,
    isRecurring: false,
    cancellationReason: 'Client hospitalized',
    cancellationDate: '2025-01-19T08:00:00Z'
  }
]

const mockAvailableShifts = [
  {
    id: '5',
    client: {
      name: 'Dorothy Williams',
      address: '555 Pembroke Ln, Virginia Beach, VA 23462',
      preferences: 'Pet-friendly caregiver needed (small dog)'
    },
    date: '2025-01-22',
    startTime: '09:00',
    endTime: '15:00',
    duration: 6,
    hourlyRate: 25.00,
    totalPay: 150.00,
    tasks: ['Personal care', 'Pet care', 'Light housekeeping'],
    urgency: 'medium',
    distance: 8.5,
    matchScore: 92
  },
  {
    id: '6',
    client: {
      name: 'James Rodriguez',
      address: '777 Independence Blvd, Norfolk, VA 23513',
      preferences: 'Bilingual caregiver preferred (English/Spanish)'
    },
    date: '2025-01-23',
    startTime: '18:00',
    endTime: '22:00',
    duration: 4,
    hourlyRate: 28.00,
    totalPay: 112.00,
    tasks: ['Evening care', 'Medication management', 'Companionship'],
    urgency: 'high',
    distance: 15.2,
    matchScore: 88
  }
]

export default function ShiftsPage() {
  const [activeTab, setActiveTab] = useState('my-shifts')
  const [filterStatus, setFilterStatus] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'default'
      case 'available': return 'secondary'
      case 'completed': return 'success'
      case 'cancelled': return 'destructive'
      case 'in_progress': return 'default'
      default: return 'outline'
    }
  }

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'destructive'
      case 'medium': return 'secondary'
      case 'low': return 'outline'
      default: return 'outline'
    }
  }

  const handleAcceptShift = (shiftId: string) => {
    toast({
      title: "Shift Accepted",
      description: "You have successfully accepted this shift. Details have been sent to your email.",
    })
  }

  const handleDeclineShift = (shiftId: string) => {
    toast({
      title: "Shift Declined",
      description: "You have declined this shift. It will be offered to other caregivers.",
    })
  }

  const handleRequestTimeOff = () => {
    toast({
      title: "Time Off Request Submitted",
      description: "Your time off request has been submitted for approval.",
    })
  }

  const filteredShifts = mockShifts.filter(shift => {
    const matchesStatus = filterStatus === 'all' || shift.status === filterStatus
    const matchesSearch = shift.client.name.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesStatus && matchesSearch
  })

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Shift Management</h1>
          <p className="text-muted-foreground">
            Manage your schedule and find available shifts
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">
                <CalendarIcon className="h-4 w-4 mr-2" />
                Request Time Off
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Request Time Off</DialogTitle>
                <DialogDescription>
                  Submit a request for time off or schedule changes
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
                <div className="space-y-2">
                  <Label htmlFor="reason">Reason</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select reason" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="vacation">Vacation</SelectItem>
                      <SelectItem value="sick">Sick Leave</SelectItem>
                      <SelectItem value="personal">Personal</SelectItem>
                      <SelectItem value="family">Family Emergency</SelectItem>
                      <SelectItem value="medical">Medical Appointment</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes">Additional Notes</Label>
                  <Textarea id="notes" placeholder="Any additional information..." />
                </div>
                <Button onClick={handleRequestTimeOff} className="w-full">
                  Submit Request
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="my-shifts">My Shifts</TabsTrigger>
          <TabsTrigger value="available">Available Shifts</TabsTrigger>
          <TabsTrigger value="calendar">Calendar View</TabsTrigger>
        </TabsList>

        <TabsContent value="my-shifts" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-wrap gap-4 items-center">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  <Label>Filter by status:</Label>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Shifts</SelectItem>
                      <SelectItem value="scheduled">Scheduled</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-2">
                  <Search className="h-4 w-4" />
                  <Input
                    placeholder="Search by client name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-64"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Shifts List */}
          <div className="space-y-4">
            {filteredShifts.map((shift) => (
              <Card key={shift.id}>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={shift.client.photo} alt={shift.client.name} />
                          <AvatarFallback>
                            {shift.client.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold text-lg">{shift.client.name}</h3>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <CalendarIcon className="h-4 w-4" />
                              {new Date(shift.date).toLocaleDateString()}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {shift.startTime} - {shift.endTime} ({shift.duration}h)
                            </span>
                            <span className="flex items-center gap-1">
                              <DollarSign className="h-4 w-4" />
                              ${shift.totalPay}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={getStatusColor(shift.status) as any}>
                          {shift.status.replace('_', ' ')}
                        </Badge>
                        {shift.isRecurring && (
                          <Badge variant="outline">
                            Recurring ({shift.recurringType})
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>{shift.client.address}</span>
                      <span>• {shift.mileage} miles</span>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Care Tasks:</Label>
                      <div className="flex flex-wrap gap-1">
                        {shift.tasks.map((task, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {task}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {shift.specialInstructions && (
                      <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <Label className="text-sm font-medium text-blue-900">Special Instructions:</Label>
                        <p className="text-sm text-blue-800 mt-1">{shift.specialInstructions}</p>
                      </div>
                    )}

                    {shift.status === 'completed' && shift.rating && (
                      <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-center gap-2 mb-1">
                          <Label className="text-sm font-medium text-green-900">Client Rating:</Label>
                          <div className="flex items-center gap-1">
                            {Array.from({ length: 5 }, (_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < shift.rating! ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        {shift.feedback && (
                          <p className="text-sm text-green-800">{shift.feedback}</p>
                        )}
                      </div>
                    )}

                    {shift.status === 'cancelled' && (
                      <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                        <Label className="text-sm font-medium text-red-900">Cancellation Reason:</Label>
                        <p className="text-sm text-red-800 mt-1">{shift.cancellationReason}</p>
                        <p className="text-xs text-red-600 mt-1">
                          Cancelled on {new Date(shift.cancellationDate!).toLocaleString()}
                        </p>
                      </div>
                    )}

                    <div className="flex justify-between items-center pt-2 border-t">
                      <div className="text-sm text-muted-foreground">
                        Rate: ${shift.hourlyRate}/hr
                        {shift.client.preferences && (
                          <span className="ml-4">Preferences: {shift.client.preferences}</span>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Navigation className="h-4 w-4 mr-2" />
                          Directions
                        </Button>
                        <Button variant="outline" size="sm">
                          <Phone className="h-4 w-4 mr-2" />
                          Call
                        </Button>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          Details
                        </Button>
                        {shift.status === 'scheduled' && (
                          <Button size="sm">
                            <Timer className="h-4 w-4 mr-2" />
                            Start EVV
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="available" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Available Shifts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {mockAvailableShifts.map((shift) => (
                <div key={shift.id} className="border rounded-lg p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{shift.client.name}</h3>
                        <Badge variant={getUrgencyColor(shift.urgency!) as any}>
                          {shift.urgency} priority
                        </Badge>
                        <Badge variant="outline" className="text-green-600 border-green-600">
                          {shift.matchScore}% match
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <CalendarIcon className="h-4 w-4" />
                          {new Date(shift.date).toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {shift.startTime} - {shift.endTime} ({shift.duration}h)
                        </span>
                        <span className="flex items-center gap-1">
                          <DollarSign className="h-4 w-4" />
                          ${shift.totalPay}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {shift.distance} miles
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold">${shift.hourlyRate}/hr</div>
                      <div className="text-sm text-muted-foreground">Hourly Rate</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>{shift.client.address}</span>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Tasks:</Label>
                    <div className="flex flex-wrap gap-1">
                      {shift.tasks.map((task, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {task}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {shift.client.preferences && (
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <Label className="text-sm font-medium text-blue-900">Client Preferences:</Label>
                      <p className="text-sm text-blue-800 mt-1">{shift.client.preferences}</p>
                    </div>
                  )}

                  <div className="flex justify-between items-center pt-2 border-t">
                    <div className="text-xs text-muted-foreground">
                      Posted 2 hours ago • 3 caregivers interested
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeclineShift(shift.id)}
                      >
                        <ThumbsDown className="h-4 w-4 mr-2" />
                        Not Interested
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleAcceptShift(shift.id)}
                      >
                        <ThumbsUp className="h-4 w-4 mr-2" />
                        Accept Shift
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="calendar" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Calendar</CardTitle>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md border"
                />
              </CardContent>
            </Card>
            
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5" />
                  Schedule for {selectedDate?.toLocaleDateString()}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {selectedDate && (
                  <div className="space-y-4">
                    {filteredShifts
                      .filter(shift => shift.date === selectedDate.toISOString().split('T')[0])
                      .map((shift) => (
                        <div key={shift.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className={`w-3 h-3 rounded-full ${
                              shift.status === 'scheduled' ? 'bg-blue-500' :
                              shift.status === 'completed' ? 'bg-green-500' :
                              shift.status === 'cancelled' ? 'bg-red-500' : 'bg-gray-500'
                            }`} />
                            <div>
                              <p className="font-medium">{shift.client.name}</p>
                              <p className="text-sm text-muted-foreground">
                                {shift.startTime} - {shift.endTime}
                              </p>
                            </div>
                          </div>
                          <Badge variant={getStatusColor(shift.status) as any}>
                            {shift.status}
                          </Badge>
                        </div>
                      ))}
                    {filteredShifts.filter(shift => shift.date === selectedDate.toISOString().split('T')[0]).length === 0 && (
                      <div className="text-center py-8 text-muted-foreground">
                        <CalendarIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                        <p>No shifts scheduled for this date</p>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}