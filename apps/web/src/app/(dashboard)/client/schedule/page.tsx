'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { 
  CalendarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ClockIcon,
  MapPinIcon,
  UserIcon,
  PhoneIcon,
  MessageSquareIcon,
  AlertCircleIcon,
  CheckCircleIcon,
  NavigationIcon,
  StarIcon,
  PlusIcon
} from 'lucide-react'

// Mock data - in real app, this would come from API
const mockVisits = [
  {
    id: 'v-001',
    date: '2024-01-20',
    startTime: '09:00',
    endTime: '12:00',
    status: 'scheduled',
    caregiver: {
      name: 'Sarah Martinez',
      avatar: null,
      rating: 4.9,
      phone: '(757) 555-0147',
      specialties: ['Personal Care', 'Medication Management']
    },
    services: ['Personal Care', 'Medication Reminder', 'Light Housekeeping'],
    notes: 'Regular morning care routine',
    isRecurring: true,
    recurringPattern: 'Weekly on Saturdays'
  },
  {
    id: 'v-002',
    date: '2024-01-22',
    startTime: '14:00',
    endTime: '17:00',
    status: 'scheduled',
    caregiver: {
      name: 'Michael Chen',
      avatar: null,
      rating: 4.8,
      phone: '(757) 555-0189',
      specialties: ['Companionship', 'Transportation']
    },
    services: ['Companionship', 'Transportation', 'Meal Preparation'],
    notes: 'Doctor appointment at 2:30 PM - transportation needed',
    isRecurring: false
  },
  {
    id: 'v-003',
    date: '2024-01-24',
    startTime: '10:00',
    endTime: '13:00',
    status: 'confirmed',
    caregiver: {
      name: 'Sarah Martinez',
      avatar: null,
      rating: 4.9,
      phone: '(757) 555-0147',
      specialties: ['Personal Care', 'Medication Management']
    },
    services: ['Personal Care', 'Exercise Assistance', 'Social Activity'],
    notes: 'Physical therapy exercises scheduled',
    isRecurring: true,
    recurringPattern: 'Weekly on Wednesdays'
  },
  {
    id: 'v-004',
    date: '2024-01-18',
    startTime: '09:00',
    endTime: '12:00',
    status: 'completed',
    caregiver: {
      name: 'Sarah Martinez',
      avatar: null,
      rating: 4.9,
      phone: '(757) 555-0147',
      specialties: ['Personal Care', 'Medication Management']
    },
    services: ['Personal Care', 'Medication Reminder', 'Light Housekeeping'],
    notes: 'Completed successfully. Client in good spirits.',
    completedAt: '2024-01-18T12:15:00Z',
    caregiverNotes: 'Blood pressure normal (125/80). Assisted with shower and medication organization.',
    isRecurring: true,
    recurringPattern: 'Weekly on Saturdays'
  },
  {
    id: 'v-005',
    date: '2024-01-16',
    startTime: '14:00',
    endTime: '16:30',
    status: 'cancelled',
    caregiver: {
      name: 'Lisa Thompson',
      avatar: null,
      rating: 4.7,
      phone: '(757) 555-0156',
      specialties: ['Meal Preparation', 'Light Housekeeping']
    },
    services: ['Meal Preparation', 'Light Housekeeping'],
    notes: 'Cancelled due to caregiver illness - rescheduled to Jan 23',
    cancelledAt: '2024-01-16T08:30:00Z',
    cancelReason: 'Caregiver illness',
    isRecurring: false
  }
]

const getStatusColor = (status: string) => {
  switch (status) {
    case 'scheduled': return 'bg-blue-100 text-blue-800'
    case 'confirmed': return 'bg-green-100 text-green-800'
    case 'completed': return 'bg-gray-100 text-gray-800'
    case 'cancelled': return 'bg-red-100 text-red-800'
    case 'rescheduled': return 'bg-yellow-100 text-yellow-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'scheduled': return <ClockIcon className="h-4 w-4" />
    case 'confirmed': return <CheckCircleIcon className="h-4 w-4" />
    case 'completed': return <CheckCircleIcon className="h-4 w-4" />
    case 'cancelled': return <AlertCircleIcon className="h-4 w-4" />
    default: return <ClockIcon className="h-4 w-4" />
  }
}

// Simple calendar component
const Calendar = ({ visits, selectedDate, onDateSelect }: any) => {
  const [currentMonth, setCurrentMonth] = useState(new Date(2024, 0, 1)) // January 2024
  
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }
  
  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }
  
  const daysInMonth = getDaysInMonth(currentMonth)
  const firstDay = getFirstDayOfMonth(currentMonth)
  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"]
  
  const days = []
  
  // Empty cells for days before the first day of the month
  for (let i = 0; i < firstDay; i++) {
    days.push(null)
  }
  
  // Days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    days.push(day)
  }
  
  const getVisitsForDate = (day: number) => {
    const dateStr = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    return visits.filter((visit: any) => visit.date === dateStr)
  }
  
  const previousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))
  }
  
  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))
  }
  
  return (
    <div className="bg-white rounded-lg border">
      <div className="flex items-center justify-between p-4 border-b">
        <h3 className="text-lg font-semibold">
          {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </h3>
        <div className="flex space-x-1">
          <Button variant="outline" size="sm" onClick={previousMonth}>
            <ChevronLeftIcon className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={nextMonth}>
            <ChevronRightIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-7 gap-px bg-gray-200">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="bg-white p-2 text-center text-sm font-medium text-gray-700">
            {day}
          </div>
        ))}
        
        {days.map((day, index) => {
          if (day === null) {
            return <div key={index} className="bg-white p-2 h-24" />
          }
          
          const visitsForDay = getVisitsForDate(day)
          const isSelected = selectedDate === `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
          const isToday = new Date().getDate() === day && new Date().getMonth() === currentMonth.getMonth()
          
          return (
            <div
              key={day}
              className={`bg-white p-2 h-24 cursor-pointer border-2 ${
                isSelected ? 'border-blue-500' : 'border-transparent'
              } ${isToday ? 'bg-blue-50' : ''} hover:bg-gray-50`}
              onClick={() => onDateSelect(`${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`)}
            >
              <div className="text-sm font-medium">{day}</div>
              <div className="mt-1 space-y-1">
                {visitsForDay.slice(0, 2).map((visit: any, idx: number) => (
                  <div
                    key={idx}
                    className={`text-xs p-1 rounded ${getStatusColor(visit.status)} truncate`}
                  >
                    {visit.startTime} {visit.caregiver.name.split(' ')[0]}
                  </div>
                ))}
                {visitsForDay.length > 2 && (
                  <div className="text-xs text-gray-500">
                    +{visitsForDay.length - 2} more
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

const VisitCard = ({ visit, showDate = false }: any) => {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  
  return (
    <Card className="mb-4">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4 flex-1">
            <Avatar className="h-12 w-12">
              <AvatarImage src={visit.caregiver.avatar || undefined} />
              <AvatarFallback>
                {visit.caregiver.name.split(' ').map((n: string) => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <h3 className="font-semibold">{visit.caregiver.name}</h3>
                <Badge className={getStatusColor(visit.status)}>
                  {getStatusIcon(visit.status)}
                  <span className="ml-1">{visit.status}</span>
                </Badge>
                {visit.isRecurring && (
                  <Badge variant="outline" className="text-xs">
                    Recurring
                  </Badge>
                )}
              </div>
              
              <div className="space-y-1 text-sm text-gray-600">
                {showDate && (
                  <div className="flex items-center">
                    <CalendarIcon className="h-4 w-4 mr-1" />
                    {new Date(visit.date).toLocaleDateString()}
                  </div>
                )}
                <div className="flex items-center">
                  <ClockIcon className="h-4 w-4 mr-1" />
                  {visit.startTime} - {visit.endTime}
                </div>
                <div className="flex items-center">
                  <StarIcon className="h-4 w-4 mr-1 fill-yellow-400 text-yellow-400" />
                  {visit.caregiver.rating}
                </div>
              </div>
              
              <div className="mt-2 flex flex-wrap gap-1">
                {visit.services.map((service: string, index: number) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {service}
                  </Badge>
                ))}
              </div>
              
              {visit.notes && (
                <p className="mt-2 text-sm text-gray-700">{visit.notes}</p>
              )}
              
              {visit.status === 'completed' && visit.caregiverNotes && (
                <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded">
                  <h4 className="text-sm font-medium text-green-800 mb-1">Care Notes:</h4>
                  <p className="text-sm text-green-700">{visit.caregiverNotes}</p>
                </div>
              )}
              
              {visit.status === 'cancelled' && visit.cancelReason && (
                <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded">
                  <h4 className="text-sm font-medium text-red-800 mb-1">Cancellation Reason:</h4>
                  <p className="text-sm text-red-700">{visit.cancelReason}</p>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex flex-col space-y-2">
            {visit.status === 'scheduled' || visit.status === 'confirmed' ? (
              <>
                <Button size="sm" variant="outline">
                  <PhoneIcon className="h-4 w-4 mr-1" />
                  Call
                </Button>
                <Button size="sm" variant="outline">
                  <MessageSquareIcon className="h-4 w-4 mr-1" />
                  Message
                </Button>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button size="sm" variant="outline">
                      Details
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Visit Details</DialogTitle>
                      <DialogDescription>
                        {new Date(visit.date).toLocaleDateString()} at {visit.startTime} - {visit.endTime}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium mb-2">Caregiver</h4>
                          <div className="flex items-center space-x-3">
                            <Avatar>
                              <AvatarFallback>
                                {visit.caregiver.name.split(' ').map((n: string) => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{visit.caregiver.name}</p>
                              <p className="text-sm text-gray-600">{visit.caregiver.phone}</p>
                              <div className="flex items-center mt-1">
                                <StarIcon className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                <span className="text-sm ml-1">{visit.caregiver.rating}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-medium mb-2">Specialties</h4>
                          <div className="space-y-1">
                            {visit.caregiver.specialties.map((specialty: string, index: number) => (
                              <Badge key={index} variant="outline" className="text-xs mr-1">
                                {specialty}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2">Scheduled Services</h4>
                        <div className="grid grid-cols-2 gap-2">
                          {visit.services.map((service: string, index: number) => (
                            <div key={index} className="flex items-center p-2 border rounded">
                              <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2" />
                              <span className="text-sm">{service}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      {visit.isRecurring && (
                        <div>
                          <h4 className="font-medium mb-2">Recurring Pattern</h4>
                          <p className="text-sm text-gray-600">{visit.recurringPattern}</p>
                        </div>
                      )}
                      
                      <div className="flex space-x-2">
                        <Button className="flex-1">
                          <PhoneIcon className="h-4 w-4 mr-2" />
                          Call Caregiver
                        </Button>
                        <Button variant="outline" className="flex-1">
                          <MessageSquareIcon className="h-4 w-4 mr-2" />
                          Send Message
                        </Button>
                        <Button variant="outline">
                          <NavigationIcon className="h-4 w-4 mr-2" />
                          Directions
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </>
            ) : (
              <Button size="sm" variant="outline" onClick={() => setIsDetailsOpen(true)}>
                View Details
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default function SchedulePage() {
  const [selectedDate, setSelectedDate] = useState('2024-01-20')
  const [activeTab, setActiveTab] = useState('calendar')
  
  const upcomingVisits = mockVisits
    .filter(visit => visit.status === 'scheduled' || visit.status === 'confirmed')
    .sort((a, b) => new Date(a.date + ' ' + a.startTime).getTime() - new Date(b.date + ' ' + b.startTime).getTime())
  
  const completedVisits = mockVisits
    .filter(visit => visit.status === 'completed')
    .sort((a, b) => new Date(b.date + ' ' + b.startTime).getTime() - new Date(a.date + ' ' + a.startTime).getTime())
  
  const selectedDateVisits = mockVisits.filter(visit => visit.date === selectedDate)
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Visit Schedule</h1>
          <p className="text-gray-600 mt-1">
            Manage your care visits and appointments
          </p>
        </div>
        
        <Button>
          <PlusIcon className="h-4 w-4 mr-2" />
          Request Visit
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Week</CardTitle>
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4</div>
            <p className="text-xs text-muted-foreground">
              visits scheduled
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Next Visit</CardTitle>
            <ClockIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Jan 20</div>
            <p className="text-xs text-muted-foreground">
              9:00 AM - Sarah M.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <CheckCircleIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              visits completed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Satisfaction</CardTitle>
            <StarIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.9</div>
            <p className="text-xs text-muted-foreground">
              average rating
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="calendar">Calendar View</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming Visits</TabsTrigger>
          <TabsTrigger value="history">Visit History</TabsTrigger>
        </TabsList>

        <TabsContent value="calendar" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Calendar 
                visits={mockVisits}
                selectedDate={selectedDate}
                onDateSelect={setSelectedDate}
              />
            </div>
            
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>
                    {new Date(selectedDate).toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </CardTitle>
                  <CardDescription>
                    {selectedDateVisits.length} visit{selectedDateVisits.length !== 1 ? 's' : ''} scheduled
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {selectedDateVisits.length === 0 ? (
                    <div className="text-center py-6">
                      <CalendarIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-500">No visits scheduled for this day</p>
                      <Button className="mt-3" size="sm">
                        <PlusIcon className="h-4 w-4 mr-2" />
                        Request Visit
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {selectedDateVisits.map((visit) => (
                        <div key={visit.id} className="border rounded-lg p-3">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              <Badge className={getStatusColor(visit.status)}>
                                {visit.status}
                              </Badge>
                              <span className="text-sm font-medium">
                                {visit.startTime} - {visit.endTime}
                              </span>
                            </div>
                          </div>
                          <p className="font-medium">{visit.caregiver.name}</p>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {visit.services.slice(0, 2).map((service, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {service}
                              </Badge>
                            ))}
                            {visit.services.length > 2 && (
                              <Badge variant="secondary" className="text-xs">
                                +{visit.services.length - 2} more
                              </Badge>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="upcoming" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Visits</CardTitle>
              <CardDescription>
                Your scheduled care visits
              </CardDescription>
            </CardHeader>
            <CardContent>
              {upcomingVisits.length === 0 ? (
                <div className="text-center py-8">
                  <CalendarIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No upcoming visits</h3>
                  <p className="text-gray-500 mb-4">You don&apos;t have any visits scheduled at the moment.</p>
                  <Button>
                    <PlusIcon className="h-4 w-4 mr-2" />
                    Request Visit
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {upcomingVisits.map((visit) => (
                    <VisitCard key={visit.id} visit={visit} showDate={true} />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Visit History</CardTitle>
              <CardDescription>
                Your completed and cancelled visits
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {completedVisits.map((visit) => (
                  <VisitCard key={visit.id} visit={visit} showDate={true} />
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}