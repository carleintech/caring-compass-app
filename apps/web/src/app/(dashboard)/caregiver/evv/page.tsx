'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { toast } from '@/hooks/use-toast'
import { 
  Timer, 
  MapPin, 
  Navigation, 
  Phone, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  Camera,
  FileText,
  User,
  Calendar,
  Pause,
  Play,
  Square
} from 'lucide-react'

// Mock data for current shift
const mockCurrentShift = {
  id: '1',
  client: {
    name: 'Margaret Johnson',
    address: '123 Oceanfront Ave, Virginia Beach, VA 23451',
    phone: '(757) 555-0123',
    photo: '',
    emergencyContact: 'John Johnson (Son) - (757) 555-0124'
  },
  scheduledStart: '10:00 AM',
  scheduledEnd: '2:00 PM',
  duration: 4,
  tasks: [
    { id: '1', name: 'Personal hygiene assistance', completed: false, required: true },
    { id: '2', name: 'Medication reminders', completed: false, required: true },
    { id: '3', name: 'Meal preparation', completed: false, required: false },
    { id: '4', name: 'Light housekeeping', completed: false, required: false },
    { id: '5', name: 'Companionship and conversation', completed: false, required: false },
    { id: '6', name: 'Safety check and documentation', completed: false, required: true }
  ],
  careNotes: 'Client prefers morning routine at 10:30 AM. Medications with breakfast.',
  status: 'not_started' // not_started, in_progress, break, completed
}

const mockGPSLocation = {
  latitude: 36.8508,
  longitude: -75.9776,
  accuracy: 12,
  timestamp: new Date().toISOString()
}

export default function EVVPage() {
  const [currentShift, setCurrentShift] = useState(mockCurrentShift)
  const [isClockingIn, setIsClockingIn] = useState(false)
  const [isClockingOut, setIsClockingOut] = useState(false)
  const [clockInTime, setClockInTime] = useState<Date | null>(null)
  const [breakStartTime, setBreakStartTime] = useState<Date | null>(null)
  const [totalBreakTime, setTotalBreakTime] = useState(0)
  const [visitNotes, setVisitNotes] = useState('')
  const [location, setLocation] = useState(mockGPSLocation)

  // Simulate GPS location updates
  useEffect(() => {
    const interval = setInterval(() => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setLocation({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              accuracy: position.coords.accuracy,
              timestamp: new Date().toISOString()
            })
          },
          (error) => {
            console.log('GPS error:', error)
            // Use mock location for demo
          }
        )
      }
    }, 30000) // Update every 30 seconds

    return () => clearInterval(interval)
  }, [])

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 3959 // Earth's radius in miles
    const dLat = (lat2 - lat1) * Math.PI / 180
    const dLon = (lon2 - lon1) * Math.PI / 180
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon/2) * Math.sin(dLon/2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
    return R * c
  }

  const clientLocation = { lat: 36.8508, lon: -75.9776 } // Mock client location
  const distanceToClient = calculateDistance(
    location.latitude, 
    location.longitude, 
    clientLocation.lat, 
    clientLocation.lon
  )

  const handleClockIn = async () => {
    setIsClockingIn(true)
    
    // Simulate clock-in process
    setTimeout(() => {
      setClockInTime(new Date())
      setCurrentShift({ ...currentShift, status: 'in_progress' })
      setIsClockingIn(false)
      toast({
        title: "Clocked In Successfully",
        description: `Started visit at ${new Date().toLocaleTimeString()}`,
      })
    }, 2000)
  }

  const handleClockOut = async () => {
    setIsClockingOut(true)
    
    // Check if required tasks are completed
    const requiredTasks = currentShift.tasks.filter(task => task.required)
    const completedRequiredTasks = requiredTasks.filter(task => task.completed)
    
    if (completedRequiredTasks.length < requiredTasks.length) {
      setIsClockingOut(false)
      toast({
        title: "Cannot Clock Out",
        description: "Please complete all required tasks before clocking out.",
        variant: "destructive"
      })
      return
    }

    // Simulate clock-out process
    setTimeout(() => {
      setCurrentShift({ ...currentShift, status: 'completed' })
      setIsClockingOut(false)
      toast({
        title: "Clocked Out Successfully",
        description: `Visit completed at ${new Date().toLocaleTimeString()}`,
      })
    }, 2000)
  }

  const handleBreakToggle = () => {
    if (currentShift.status === 'in_progress') {
      // Start break
      setBreakStartTime(new Date())
      setCurrentShift({ ...currentShift, status: 'break' })
      toast({
        title: "Break Started",
        description: "Remember to clock back in when you return.",
      })
    } else if (currentShift.status === 'break') {
      // End break
      if (breakStartTime) {
        const breakDuration = Date.now() - breakStartTime.getTime()
        setTotalBreakTime(prev => prev + breakDuration)
      }
      setBreakStartTime(null)
      setCurrentShift({ ...currentShift, status: 'in_progress' })
      toast({
        title: "Break Ended",
        description: "You're back on duty.",
      })
    }
  }

  const toggleTask = (taskId: string) => {
    setCurrentShift({
      ...currentShift,
      tasks: currentShift.tasks.map(task =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    })
  }

  const getElapsedTime = () => {
    if (!clockInTime) return '00:00:00'
    
    const now = Date.now()
    const elapsed = now - clockInTime.getTime() - totalBreakTime
    const hours = Math.floor(elapsed / (1000 * 60 * 60))
    const minutes = Math.floor((elapsed % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((elapsed % (1000 * 60)) / 1000)
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }

  const completedTasksCount = currentShift.tasks.filter(task => task.completed).length
  const totalTasksCount = currentShift.tasks.length
  const progressPercentage = (completedTasksCount / totalTasksCount) * 100

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Electronic Visit Verification</h1>
          <p className="text-muted-foreground">
            Track your visit time and complete care tasks
          </p>
        </div>
        <Badge 
          variant={
            currentShift.status === 'in_progress' ? 'default' :
            currentShift.status === 'break' ? 'secondary' :
            currentShift.status === 'completed' ? 'success' : 'outline'
          }
          className="text-sm px-3 py-1"
        >
          {currentShift.status.replace('_', ' ').toUpperCase()}
        </Badge>
      </div>

      {/* Current Visit Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Current Visit
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src={currentShift.client.photo} alt={currentShift.client.name} />
              <AvatarFallback>
                {currentShift.client.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="font-semibold text-lg">{currentShift.client.name}</h3>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>{currentShift.client.address}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>{currentShift.scheduledStart} - {currentShift.scheduledEnd} ({currentShift.duration}h)</span>
              </div>
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
            </div>
          </div>

          {currentShift.careNotes && (
            <div className="bg-blue-50 p-3 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-1">Care Notes:</h4>
              <p className="text-sm text-blue-800">{currentShift.careNotes}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* GPS Location & Clock Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Location Verification
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Distance to client:</span>
                <span className={distanceToClient < 0.1 ? 'text-green-600 font-medium' : 'text-yellow-600'}>
                  {distanceToClient < 0.1 ? 'At location' : `${distanceToClient.toFixed(2)} miles away`}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span>GPS accuracy:</span>
                <span className="text-muted-foreground">±{location.accuracy.toFixed(0)} meters</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Last updated:</span>
                <span className="text-muted-foreground">
                  {new Date(location.timestamp).toLocaleTimeString()}
                </span>
              </div>
            </div>
            
            {distanceToClient > 0.1 && (
              <div className="flex items-start gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-yellow-800">Location Warning</p>
                  <p className="text-sm text-yellow-700">
                    You are not at the client&apos;s location. Please ensure you&apos;re at the correct address before clocking in.
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Timer className="h-5 w-5" />
              Time Tracking
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {clockInTime && (
              <div className="text-center">
                <div className="text-3xl font-mono font-bold text-primary">
                  {getElapsedTime()}
                </div>
                <p className="text-sm text-muted-foreground">
                  Started at {clockInTime.toLocaleTimeString()}
                </p>
              </div>
            )}

            <div className="space-y-2">
              {currentShift.status === 'not_started' && (
                <Button 
                  className="w-full"
                  onClick={handleClockIn}
                  disabled={isClockingIn || distanceToClient > 0.1}
                >
                  {isClockingIn ? (
                    <>
                      <Timer className="h-4 w-4 mr-2 animate-spin" />
                      Clocking In...
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 mr-2" />
                      Clock In
                    </>
                  )}
                </Button>
              )}

              {(currentShift.status === 'in_progress' || currentShift.status === 'break') && (
                <div className="space-y-2">
                  <Button 
                    variant="outline"
                    className="w-full"
                    onClick={handleBreakToggle}
                  >
                    {currentShift.status === 'break' ? (
                      <>
                        <Play className="h-4 w-4 mr-2" />
                        End Break
                      </>
                    ) : (
                      <>
                        <Pause className="h-4 w-4 mr-2" />
                        Take Break
                      </>
                    )}
                  </Button>
                  
                  <Button 
                    variant="destructive"
                    className="w-full"
                    onClick={handleClockOut}
                    disabled={isClockingOut}
                  >
                    {isClockingOut ? (
                      <>
                        <Timer className="h-4 w-4 mr-2 animate-spin" />
                        Clocking Out...
                      </>
                    ) : (
                      <>
                        <Square className="h-4 w-4 mr-2" />
                        Clock Out
                      </>
                    )}
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Task Checklist */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              Care Tasks
            </div>
            <Badge variant="outline">
              {completedTasksCount}/{totalTasksCount} completed
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span>{Math.round(progressPercentage)}%</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>

          <div className="space-y-3">
            {currentShift.tasks.map((task) => (
              <div 
                key={task.id} 
                className={`flex items-center space-x-3 p-3 rounded-lg border ${
                  task.completed ? 'bg-green-50 border-green-200' : 'bg-white'
                }`}
              >
                <Checkbox
                  id={task.id}
                  checked={task.completed}
                  onCheckedChange={() => toggleTask(task.id)}
                  disabled={currentShift.status === 'not_started' || currentShift.status === 'completed'}
                />
                <div className="flex-1">
                  <Label 
                    htmlFor={task.id}
                    className={`cursor-pointer ${task.completed ? 'line-through text-muted-foreground' : ''}`}
                  >
                    {task.name}
                  </Label>
                  {task.required && (
                    <Badge variant="outline" className="ml-2 text-xs">Required</Badge>
                  )}
                </div>
                {task.completed && (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Visit Notes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Visit Notes
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="visitNotes">Document any observations or incidents</Label>
            <Textarea
              id="visitNotes"
              placeholder="Enter notes about the client's condition, mood, any incidents, or other relevant observations..."
              value={visitNotes}
              onChange={(e) => setVisitNotes(e.target.value)}
              disabled={currentShift.status === 'not_started' || currentShift.status === 'completed'}
              rows={4}
            />
          </div>

          <div className="flex gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Camera className="h-4 w-4 mr-2" />
                  Add Photo
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Photo Documentation</DialogTitle>
                  <DialogDescription>
                    Take photos to document care activities or client condition (with permission)
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <Camera className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-500">Camera functionality would be implemented here</p>
                    <Button variant="outline" className="mt-2">
                      Take Photo
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            
            <Button variant="outline" size="sm">
              <FileText className="h-4 w-4 mr-2" />
              Templates
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Emergency Contacts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="h-5 w-5" />
            Emergency Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-red-50 border border-red-200 rounded-lg">
              <div>
                <p className="font-medium text-red-900">Emergency Services</p>
                <p className="text-sm text-red-700">Call 911 immediately for medical emergencies</p>
              </div>
              <Button variant="destructive" size="sm">
                <Phone className="h-4 w-4 mr-2" />
                911
              </Button>
            </div>
            
            <div className="flex justify-between items-center p-3 border rounded-lg">
              <div>
                <p className="font-medium">Client Emergency Contact</p>
                <p className="text-sm text-muted-foreground">{currentShift.client.emergencyContact}</p>
              </div>
              <Button variant="outline" size="sm">
                <Phone className="h-4 w-4 mr-2" />
                Call
              </Button>
            </div>
            
            <div className="flex justify-between items-center p-3 border rounded-lg">
              <div>
                <p className="font-medium">Caring Compass Support</p>
                <p className="text-sm text-muted-foreground">24/7 caregiver support line</p>
              </div>
              <Button variant="outline" size="sm">
                <Phone className="h-4 w-4 mr-2" />
                (757) 555-CARE
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}