'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { 
  FileTextIcon, 
  CalendarIcon, 
  ClockIcon, 
  UserIcon, 
  HeartIcon,
  CheckCircleIcon,
  AlertCircleIcon,
  TrendingUpIcon,
  EditIcon,
  DownloadIcon,
  PrinterIcon,
  MessageSquareIcon,
  StarIcon
} from 'lucide-react'

// Mock data - in real app, this would come from API
const mockCarePlan = {
  id: 'cp-2024-001',
  clientName: 'Robert Johnson',
  startDate: '2024-01-15',
  lastUpdated: '2024-01-18',
  status: 'active',
  coordinator: {
    name: 'Maria Rodriguez',
    title: 'Senior Care Coordinator',
    phone: '(757) 555-0123',
    email: 'maria.rodriguez@caringcompass.com',
    avatar: null
  },
  primaryCaregiver: {
    name: 'Sarah Martinez',
    title: 'Certified Nursing Assistant',
    rating: 4.9,
    avatar: null,
    specialties: ['Dementia Care', 'Mobility Assistance', 'Medication Management']
  },
  goals: [
    {
      id: 1,
      category: 'Safety',
      description: 'Maintain independence while ensuring fall prevention',
      targetDate: '2024-06-15',
      progress: 75,
      status: 'on-track'
    },
    {
      id: 2,
      category: 'Health',
      description: 'Improve medication adherence to 100%',
      targetDate: '2024-03-15',
      progress: 90,
      status: 'on-track'
    },
    {
      id: 3,
      category: 'Social',
      description: 'Participate in weekly community activities',
      targetDate: '2024-12-31',
      progress: 45,
      status: 'needs-attention'
    },
    {
      id: 4,
      category: 'Nutrition',
      description: 'Maintain healthy weight and balanced diet',
      targetDate: '2024-04-15',
      progress: 85,
      status: 'on-track'
    }
  ],
  services: [
    {
      category: 'Personal Care',
      tasks: [
        { name: 'Bathing assistance', frequency: '3x/week', duration: '45 minutes' },
        { name: 'Grooming and dressing', frequency: 'Daily', duration: '30 minutes' },
        { name: 'Mobility assistance', frequency: 'As needed', duration: 'Varies' }
      ]
    },
    {
      category: 'Health Management',
      tasks: [
        { name: 'Medication reminders', frequency: 'Daily', duration: '15 minutes' },
        { name: 'Vital signs monitoring', frequency: 'Weekly', duration: '10 minutes' },
        { name: 'Exercise supervision', frequency: '3x/week', duration: '30 minutes' }
      ]
    },
    {
      category: 'Household Support',
      tasks: [
        { name: 'Light housekeeping', frequency: '2x/week', duration: '60 minutes' },
        { name: 'Meal preparation', frequency: 'Daily', duration: '45 minutes' },
        { name: 'Laundry assistance', frequency: '1x/week', duration: '30 minutes' }
      ]
    },
    {
      category: 'Companionship',
      tasks: [
        { name: 'Social interaction', frequency: 'During all visits', duration: 'Ongoing' },
        { name: 'Activity engagement', frequency: 'Daily', duration: '30 minutes' },
        { name: 'Transportation', frequency: 'As needed', duration: 'Varies' }
      ]
    }
  ],
  schedule: {
    totalWeeklyHours: 20,
    preferredTimes: ['Morning (8-11 AM)', 'Afternoon (1-4 PM)'],
    flexibilityLevel: 'Moderate',
    blackoutDates: ['2024-02-14', '2024-03-17'] // Family visits
  },
  emergencyPlan: {
    primaryContact: 'Emily Johnson (Daughter)',
    backupCaregiver: 'Michael Chen',
    hospitalPreference: 'Sentara Virginia Beach General',
    specialInstructions: 'Has anxiety about medical procedures - please use calm, reassuring approach'
  },
  assessments: [
    {
      date: '2024-01-15',
      type: 'Initial Assessment',
      conductor: 'Maria Rodriguez',
      summary: 'Comprehensive intake completed. Client requires moderate assistance with ADLs.',
      nextReview: '2024-04-15'
    },
    {
      date: '2024-01-10',
      type: 'Home Safety Assessment',
      conductor: 'James Wilson',
      summary: 'Minor fall risks identified. Recommended grab bars in bathroom.',
      nextReview: '2024-07-10'
    }
  ],
  progressNotes: [
    {
      date: '2024-01-18',
      caregiver: 'Sarah Martinez',
      note: 'Client was in good spirits today. Assisted with shower and meal prep. Blood pressure normal at 128/82.',
      mood: 'good',
      concerns: []
    },
    {
      date: '2024-01-16',
      caregiver: 'Sarah Martinez', 
      note: 'Completed medication review with client. All medications properly organized. Light housekeeping completed.',
      mood: 'fair',
      concerns: ['Seemed tired - may need rest period adjustment']
    }
  ]
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'on-track': return 'bg-green-100 text-green-800'
    case 'needs-attention': return 'bg-yellow-100 text-yellow-800'
    case 'behind': return 'bg-red-100 text-red-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

export default function CarePlanPage() {
  const [activeTab, setActiveTab] = useState('overview')

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Care Plan</h1>
          <p className="text-gray-600 mt-1">
            Your personalized care plan and progress tracking
          </p>
        </div>
        
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <PrinterIcon className="h-4 w-4 mr-2" />
            Print
          </Button>
          <Button variant="outline" size="sm">
            <DownloadIcon className="h-4 w-4 mr-2" />
            Download PDF
          </Button>
          <Button size="sm">
            <MessageSquareIcon className="h-4 w-4 mr-2" />
            Contact Coordinator
          </Button>
        </div>
      </div>

      {/* Plan Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Plan Status</CardTitle>
            <FileTextIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Active</div>
            <p className="text-xs text-muted-foreground">
              Since {mockCarePlan.startDate}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Weekly Hours</CardTitle>
            <ClockIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockCarePlan.schedule.totalWeeklyHours}</div>
            <p className="text-xs text-muted-foreground">
              hours per week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Goals Progress</CardTitle>
            <TrendingUpIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">74%</div>
            <p className="text-xs text-muted-foreground">
              average completion
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Last Updated</CardTitle>
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Jan 18</div>
            <p className="text-xs text-muted-foreground">
              {mockCarePlan.lastUpdated}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="goals">Goals & Progress</TabsTrigger>
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="assessments">Assessments</TabsTrigger>
          <TabsTrigger value="notes">Progress Notes</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Care Team */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Your Care Team</CardTitle>
                <CardDescription>
                  The professionals dedicated to your care
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-start space-x-4 p-4 border rounded-lg">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={mockCarePlan.coordinator.avatar || undefined} />
                    <AvatarFallback>
                      {mockCarePlan.coordinator.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="font-semibold">{mockCarePlan.coordinator.name}</h3>
                    <p className="text-sm text-gray-600">{mockCarePlan.coordinator.title}</p>
                    <div className="mt-2 space-y-1">
                      <p className="text-sm">{mockCarePlan.coordinator.phone}</p>
                      <p className="text-sm text-blue-600">{mockCarePlan.coordinator.email}</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    <MessageSquareIcon className="h-4 w-4 mr-2" />
                    Message
                  </Button>
                </div>

                <div className="flex items-start space-x-4 p-4 border rounded-lg bg-blue-50 border-blue-200">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={mockCarePlan.primaryCaregiver.avatar || undefined} />
                    <AvatarFallback>
                      {mockCarePlan.primaryCaregiver.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-semibold">{mockCarePlan.primaryCaregiver.name}</h3>
                      <Badge variant="secondary">Primary Caregiver</Badge>
                    </div>
                    <p className="text-sm text-gray-600">{mockCarePlan.primaryCaregiver.title}</p>
                    <div className="flex items-center mt-1">
                      <StarIcon className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm ml-1">{mockCarePlan.primaryCaregiver.rating}</span>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {mockCarePlan.primaryCaregiver.specialties.map((specialty, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    <MessageSquareIcon className="h-4 w-4 mr-2" />
                    Message
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Plan Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Goals on Track</span>
                    <span className="font-medium">3 of 4</span>
                  </div>
                  <Progress value={75} className="h-2" />
                </div>

                <Separator />

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span>Service Categories</span>
                    <span className="font-medium">4</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Tasks</span>
                    <span className="font-medium">12</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Flexibility Level</span>
                    <span className="font-medium">{mockCarePlan.schedule.flexibilityLevel}</span>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Preferred Times</h4>
                  {mockCarePlan.schedule.preferredTimes.map((time, index) => (
                    <Badge key={index} variant="outline" className="text-xs mr-1">
                      {time}
                    </Badge>
                  ))}
                </div>

                <Button className="w-full" variant="outline">
                  <EditIcon className="h-4 w-4 mr-2" />
                  Request Changes
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Emergency Plan */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertCircleIcon className="h-5 w-5 mr-2 text-red-500" />
                Emergency Plan
              </CardTitle>
              <CardDescription>
                Important information for emergency situations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium">Primary Emergency Contact</h4>
                    <p className="text-sm text-gray-600">{mockCarePlan.emergencyPlan.primaryContact}</p>
                  </div>
                  <div>
                    <h4 className="font-medium">Backup Caregiver</h4>
                    <p className="text-sm text-gray-600">{mockCarePlan.emergencyPlan.backupCaregiver}</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium">Preferred Hospital</h4>
                    <p className="text-sm text-gray-600">{mockCarePlan.emergencyPlan.hospitalPreference}</p>
                  </div>
                  <div>
                    <h4 className="font-medium">Special Instructions</h4>
                    <p className="text-sm text-gray-600">{mockCarePlan.emergencyPlan.specialInstructions}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="goals" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Care Goals & Progress</CardTitle>
              <CardDescription>
                Track your progress toward important care objectives
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {mockCarePlan.goals.map((goal) => (
                  <div key={goal.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <Badge variant="outline">{goal.category}</Badge>
                          <Badge className={getStatusColor(goal.status)}>
                            {goal.status.replace('-', ' ')}
                          </Badge>
                        </div>
                        <h3 className="font-medium">{goal.description}</h3>
                        <p className="text-sm text-gray-600">Target: {goal.targetDate}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold">{goal.progress}%</div>
                        <p className="text-xs text-gray-600">Complete</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{goal.progress}%</span>
                      </div>
                      <Progress value={goal.progress} className="h-2" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="services" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Care Services</CardTitle>
              <CardDescription>
                Detailed breakdown of your care services and tasks
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {mockCarePlan.services.map((service, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <h3 className="font-semibold mb-3">{service.category}</h3>
                    <div className="space-y-3">
                      {service.tasks.map((task, taskIndex) => (
                        <div key={taskIndex} className="flex justify-between items-center py-2 border-b last:border-b-0">
                          <div>
                            <p className="font-medium">{task.name}</p>
                            <p className="text-sm text-gray-600">Duration: {task.duration}</p>
                          </div>
                          <Badge variant="outline">{task.frequency}</Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="assessments" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Care Assessments</CardTitle>
              <CardDescription>
                Regular evaluations to ensure optimal care
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockCarePlan.assessments.map((assessment, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold">{assessment.type}</h3>
                        <p className="text-sm text-gray-600">Conducted by {assessment.conductor}</p>
                        <p className="text-sm text-gray-600">{assessment.date}</p>
                      </div>
                      <Badge variant="outline">
                        Next: {assessment.nextReview}
                      </Badge>
                    </div>
                    <p className="text-sm">{assessment.summary}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notes" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Progress Notes</CardTitle>
              <CardDescription>
                Daily observations and updates from your caregivers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockCarePlan.progressNotes.map((note, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold">{note.caregiver}</h3>
                        <p className="text-sm text-gray-600">{note.date}</p>
                      </div>
                      <Badge variant={note.mood === 'good' ? 'default' : 'secondary'}>
                        Mood: {note.mood}
                      </Badge>
                    </div>
                    <p className="text-sm mb-3">{note.note}</p>
                    
                    {note.concerns.length > 0 && (
                      <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded">
                        <h4 className="text-sm font-medium mb-1">Concerns Noted:</h4>
                        <ul className="text-sm text-gray-700">
                          {note.concerns.map((concern, idx) => (
                            <li key={idx}>• {concern}</li>
                          ))}
                        </ul>
                      </div>
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