'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Progress } from '@/components/ui/progress'
import { 
  Heart, 
  Home, 
  Users, 
  Shield, 
  Star,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Clock,
  CheckCircle,
  ArrowRight,
  Sparkles,
  Gift,
  Award,
  Compass,
  Play,
  MessageCircle,
  FileText,
  HelpCircle,
  BookOpen,
  UserPlus,
  LogIn,
  Plus,
  Minus,
  Calculator,
  Package,
  Zap,
  Target,
  TrendingUp,
  Eye,
  Lock,
  Scale,
  Quote
} from 'lucide-react'

export default function StunningHomepage() {
  const [serviceModal, setServiceModal] = useState(false)
  const [packageBuilder, setPackageBuilder] = useState({
    personalCare: {},
    companionship: {},
    household: {},
    specialized: {},
    schedule: {
      frequency: '',
      hours: '',
      timeOfDay: ''
    },
    contact: {
      name: '',
      email: '',
      phone: '',
      address: '',
      urgency: 'routine'
    }
  })
  const [builderStep, setBuilderStep] = useState(1)
  const [estimatedCost, setEstimatedCost] = useState(0)
  const [currentTestimonial, setCurrentTestimonial] = useState(0)

  // Animated statistics
  const [stats, setStats] = useState({
    clients: 0,
    hours: 0,
    satisfaction: 0,
    caregivers: 0
  })

  useEffect(() => {
    const finalStats = { clients: 250, hours: 15000, satisfaction: 98, caregivers: 85 }
    const duration = 2000
    const steps = 50
    const stepDuration = duration / steps

    let step = 0
    const interval = setInterval(() => {
      step++
      setStats({
        clients: Math.floor((finalStats.clients * step) / steps),
        hours: Math.floor((finalStats.hours * step) / steps),
        satisfaction: Math.floor((finalStats.satisfaction * step) / steps),
        caregivers: Math.floor((finalStats.caregivers * step) / steps)
      })
      
      if (step >= steps) clearInterval(interval)
    }, stepDuration)

    return () => clearInterval(interval)
  }, [])

  // Auto-rotating testimonials
  const testimonials = [
    {
      name: "Margaret Thompson",
      text: "Caring Compass gave my father the dignity and independence he deserved in his final years.",
      rating: 5,
      location: "Virginia Beach"
    },
    {
      name: "Robert Chen", 
      text: "The companionship care helped me overcome loneliness after my wife passed. Linda is like family now.",
      rating: 5,
      location: "Norfolk"
    },
    {
      name: "Patricia Williams",
      text: "Their specialized Alzheimer's care has been a blessing for our entire family.",
      rating: 5,
      location: "Chesapeake"
    }
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [testimonials.length])

  // Service packages configuration
  const servicePackages = React.useMemo(() => ({
    personalCare: {
      title: "Personal Care Assistance",
      icon: <Heart className="h-6 w-6" />,
      basePrice: 25,
      services: [
        { id: 'bathing', name: 'Bathing Assistance', price: 5, description: 'Safe, dignified bathing support' },
        { id: 'dressing', name: 'Dressing Support', price: 3, description: 'Help with clothing and grooming' },
        { id: 'grooming', name: 'Personal Grooming', price: 4, description: 'Hair care, nail care, oral hygiene' },
        { id: 'mobility', name: 'Mobility Assistance', price: 6, description: 'Walking, transfers, positioning' },
        { id: 'toileting', name: 'Toileting Support', price: 4, description: 'Dignified bathroom assistance' },
        { id: 'medication', name: 'Medication Reminders', price: 3, description: 'Timely medication prompts' }
      ]
    },
    companionship: {
      title: "Companionship Services",
      icon: <Users className="h-6 w-6" />,
      basePrice: 20,
      services: [
        { id: 'conversation', name: 'Meaningful Conversation', price: 0, description: 'Engaging social interaction' },
        { id: 'activities', name: 'Activity Engagement', price: 5, description: 'Games, puzzles, hobbies' },
        { id: 'reading', name: 'Reading Companion', price: 3, description: 'Read books, newspapers, letters' },
        { id: 'technology', name: 'Technology Help', price: 8, description: 'Video calls, internet, devices' },
        { id: 'outings', name: 'Social Outings', price: 12, description: 'Accompanied community visits' },
        { id: 'pets', name: 'Pet Care Support', price: 6, description: 'Help caring for beloved pets' }
      ]
    },
    household: {
      title: "Household Support",
      icon: <Home className="h-6 w-6" />,
      basePrice: 22,
      services: [
        { id: 'cleaning', name: 'Light Housekeeping', price: 8, description: 'Dusting, tidying, organizing' },
        { id: 'laundry', name: 'Laundry Services', price: 6, description: 'Washing, folding, organizing clothes' },
        { id: 'meals', name: 'Meal Preparation', price: 10, description: 'Nutritious meal planning and cooking' },
        { id: 'shopping', name: 'Grocery Shopping', price: 12, description: 'Shopping for essentials' },
        { id: 'errands', name: 'Errands & Transportation', price: 15, description: 'Appointments, banking, pharmacy' },
        { id: 'maintenance', name: 'Home Maintenance', price: 18, description: 'Minor repairs and upkeep' }
      ]
    },
    specialized: {
      title: "Specialized Care",
      icon: <Shield className="h-6 w-6" />,
      basePrice: 35,
      services: [
        { id: 'dementia', name: 'Dementia Care', price: 15, description: 'Memory care and behavioral support' },
        { id: 'recovery', name: 'Post-Hospital Recovery', price: 18, description: 'Rehabilitation and recovery support' },
        { id: 'chronic', name: 'Chronic Condition Management', price: 12, description: 'Ongoing health condition support' },
        { id: 'palliative', name: 'Palliative Care Support', price: 20, description: 'Comfort-focused care assistance' },
        { id: 'respite', name: 'Respite Care', price: 10, description: 'Relief for family caregivers' },
        { id: 'overnight', name: 'Overnight Care', price: 25, description: '24/7 supervision and support' }
      ]
    }
  }), [])

  // Calculate estimated cost
  useEffect(() => {
    let total = 0
    Object.entries(packageBuilder).forEach(([category, services]) => {
      if (category === 'schedule' || category === 'contact') return
      
      const categoryConfig = servicePackages[category]
      if (!categoryConfig) return
      
      const selectedServices = Object.keys(services).filter(key => services[key])
      if (selectedServices.length > 0) {
        total += categoryConfig.basePrice
        selectedServices.forEach(serviceId => {
          const service = categoryConfig.services.find(s => s.id === serviceId)
          if (service) total += service.price
        })
      }
    })
    
    // Apply frequency multiplier
    const frequencyMultipliers = { daily: 7, '3times': 3, weekly: 1, biweekly: 0.5 }
    const multiplier = frequencyMultipliers[packageBuilder.schedule.frequency] || 1
    
    setEstimatedCost(total * multiplier)
  }, [packageBuilder, servicePackages])

  const submitServiceRequest = async () => {
    try {
      // This would connect to your tRPC API
      // const response = await trpc.serviceRequest.create.mutate({
      //   services: packageBuilder,
      //   estimatedCost,
      //   urgency: packageBuilder.contact.urgency
      // })
      
      alert('Service request submitted successfully! We\'ll contact you within 2 hours.')
      setServiceModal(false)
      setPackageBuilder({
        personalCare: {},
        companionship: {},
        household: {},
        specialized: {},
        schedule: { frequency: '', hours: '', timeOfDay: '' },
        contact: { name: '', email: '', phone: '', address: '', urgency: 'routine' }
      })
      setBuilderStep(1)
    } catch (error) {
      alert('Error submitting request. Please try again.')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Floating particles background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="floating-heart"
            style={{
              '--left': `${Math.random() * 100}%`,
              '--delay': `${Math.random() * 2}s`,
              '--top': '0px',
              '--opacity': '0.5',
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          >
            <Sparkles className="h-4 w-4 text-blue-300 opacity-30" />
          </div>
        ))}
      </div>

      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-full">
                <Compass className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Caring Compass
              </span>
            </div>
            
            <div className="hidden lg:flex items-center space-x-8">
              <a href="/services/personal-care" className="text-gray-700 hover:text-blue-600 transition-colors">Services</a>
              <a href="/about" className="text-gray-700 hover:text-blue-600 transition-colors">About</a>
              <a href="/our-story" className="text-gray-700 hover:text-blue-600 transition-colors">Our Story</a>
              <a href="/reviews" className="text-gray-700 hover:text-blue-600 transition-colors">Reviews</a>
              <a href="/blog" className="text-gray-700 hover:text-blue-600 transition-colors">Resources</a>
              <a href="/careers" className="text-gray-700 hover:text-blue-600 transition-colors">Careers</a>
              <a href="/contact" className="text-gray-700 hover:text-blue-600 transition-colors">Contact</a>
            </div>

            <div className="flex items-center space-x-4">
              <Link href="/login">
                <Button 
                  variant="outline"
                  className="hidden sm:flex"
                >
                  <LogIn className="mr-2 h-4 w-4" />
                  Sign In
                </Button>
              </Link>
              <Link href="/register">
                <Button 
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white hidden sm:flex"
                >
                  <UserPlus className="mr-2 h-4 w-4" />
                  Register
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="container mx-auto px-4 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge className="bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 px-4 py-2">
                  <Sparkles className="mr-2 h-4 w-4" />
                  Virginia&apos;s Most Trusted Home Care
                </Badge>
                <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                  <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                    Compassionate Care
                  </span>
                  <br />
                  <span className="text-gray-800">
                    Where You Feel Most
                  </span>
                  <br />
                  <span className="bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
                    At Home
                  </span>
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  Experience personalized, non-medical home care that honors your independence 
                  and preserves your dignity. Our Compass Care Philosophy™ ensures you receive 
                  exceptional support in the comfort of your own home.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  onClick={() => setServiceModal(true)}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-lg px-8 py-4 rounded-full hover:scale-105 transition-all duration-300 shadow-lg"
                >
                  <Package className="mr-2 h-5 w-5" />
                  Build Your Care Package
                  <Sparkles className="ml-2 h-5 w-5" />
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  className="text-lg px-8 py-4 rounded-full hover:bg-blue-50 transition-all duration-300"
                >
                  <Play className="mr-2 h-5 w-5" />
                  Watch Our Story
                </Button>
              </div>

              <div className="flex items-center space-x-8 pt-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">{stats.clients}+</div>
                  <div className="text-sm text-gray-600">Families Served</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600">{stats.hours.toLocaleString()}+</div>
                  <div className="text-sm text-gray-600">Care Hours</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-pink-600">{stats.satisfaction}%</div>
                  <div className="text-sm text-gray-600">Satisfaction</div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 rounded-3xl p-8 transform rotate-3 hover:rotate-0 transition-transform duration-500">
                <div className="bg-white rounded-2xl p-6 shadow-xl">
                  <div className="text-center space-y-4">
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
                      <Heart className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800">24/7 Support</h3>
                    <p className="text-gray-600">Always here when you need us most</p>
                    <div className="flex justify-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Floating elements */}
              <div className="absolute -top-4 -right-4 bg-yellow-400 rounded-full p-3 animate-bounce">
                <Award className="h-6 w-6 text-white" />
              </div>
              <div className="absolute -bottom-4 -left-4 bg-green-400 rounded-full p-3 animate-pulse">
                <Shield className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="py-16 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Comprehensive Care Services
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From personal care to specialized support, we provide everything you need 
              to live comfortably and independently at home.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { 
                title: "Personal Care", 
                icon: <Heart className="h-8 w-8" />, 
                color: "from-red-500 to-pink-500",
                link: "/services/personal-care",
                description: "Bathing, dressing, grooming, and mobility assistance"
              },
              { 
                title: "Companionship", 
                icon: <Users className="h-8 w-8" />, 
                color: "from-blue-500 to-cyan-500",
                link: "/services/companionship",
                description: "Social interaction, activities, and emotional support"
              },
              { 
                title: "Household Support", 
                icon: <Home className="h-8 w-8" />, 
                color: "from-green-500 to-emerald-500",
                link: "/services/household-support",
                description: "Cleaning, cooking, errands, and home maintenance"
              },
              { 
                title: "Specialized Care", 
                icon: <Shield className="h-8 w-8" />, 
                color: "from-purple-500 to-violet-500",
                link: "/services/specialized-care",
                description: "Dementia care, recovery support, and chronic conditions"
              }
            ].map((service, index) => (
              <Card key={index} className="group hover:shadow-2xl transition-all duration-300 border-0 overflow-hidden">
                <CardContent className="p-6 text-center">
                  <div className={`bg-gradient-to-r ${service.color} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <div className="text-white">
                      {service.icon}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{service.title}</h3>
                  <p className="text-gray-600 mb-4 text-sm">{service.description}</p>
                  <Button 
                    variant="outline" 
                    className="w-full group-hover:bg-blue-50"
                    onClick={() => window.location.href = service.link}
                  >
                    Learn More
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Service Builder Modal */}
      <Dialog open={serviceModal} onOpenChange={setServiceModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              <Package className="inline mr-2 h-6 w-6" />
              Build Your Personalized Care Package
            </DialogTitle>
            <DialogDescription>
              Select the services you need and get an instant estimate
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Progress Bar */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium">Step {builderStep} of 4</span>
                <Progress value={(builderStep / 4) * 100} className="w-32" />
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-green-600">
                  ${estimatedCost}/week
                </div>
                <div className="text-sm text-gray-500">Estimated cost</div>
              </div>
            </div>

            <Tabs value={`step${builderStep}`} onValueChange={(value) => setBuilderStep(parseInt(value.replace('step', '')))}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="step1">Services</TabsTrigger>
                <TabsTrigger value="step2">Schedule</TabsTrigger>
                <TabsTrigger value="step3">Contact</TabsTrigger>
                <TabsTrigger value="step4">Review</TabsTrigger>
              </TabsList>

              <TabsContent value="step1" className="space-y-6">
                <h3 className="text-xl font-semibold">Select Your Care Services</h3>
                
                {Object.entries(servicePackages).map(([categoryKey, category]) => (
                  <Card key={categoryKey} className="border-2 border-gray-100 hover:border-blue-200 transition-colors">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-2 rounded-full text-white">
                            {category.icon}
                          </div>
                          <div>
                            <CardTitle className="text-lg">{category.title}</CardTitle>
                            <CardDescription>Base rate: ${category.basePrice}/hour</CardDescription>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          onClick={() => {
                            const allSelected = category.services.every(service => 
                              packageBuilder[categoryKey][service.id]
                            )
                            if (allSelected) {
                              setPackageBuilder(prev => ({
                                ...prev,
                                [categoryKey]: {}
                              }))
                            } else {
                              const newSelection = {}
                              category.services.forEach(service => {
                                newSelection[service.id] = true
                              })
                              setPackageBuilder(prev => ({
                                ...prev,
                                [categoryKey]: newSelection
                              }))
                            }
                          }}
                        >
                          {category.services.every(service => packageBuilder[categoryKey][service.id]) 
                            ? 'Deselect All' 
                            : 'Select All'
                          }
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-2 gap-4">
                        {category.services.map((service) => (
                          <div key={service.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50">
                            <Checkbox
                              id={`${categoryKey}-${service.id}`}
                              checked={!!packageBuilder[categoryKey][service.id]}
                              onCheckedChange={(checked) => {
                                setPackageBuilder(prev => ({
                                  ...prev,
                                  [categoryKey]: {
                                    ...prev[categoryKey],
                                    [service.id]: checked
                                  }
                                }))
                              }}
                            />
                            <div className="flex-1">
                              <label 
                                htmlFor={`${categoryKey}-${service.id}`}
                                className="font-medium cursor-pointer"
                              >
                                {service.name}
                              </label>
                              <p className="text-sm text-gray-600">{service.description}</p>
                              <span className="text-sm font-medium text-green-600">
                                +${service.price}/hour
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}

                <Button 
                  onClick={() => setBuilderStep(2)}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                  disabled={Object.values(packageBuilder).slice(0, 4).every(category => Object.keys(category).length === 0)}
                >
                  Continue to Schedule
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </TabsContent>

              <TabsContent value="step2" className="space-y-6">
                <h3 className="text-xl font-semibold">Schedule Your Care</h3>
                
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label>How often do you need care?</Label>
                    <Select 
                      value={packageBuilder.schedule.frequency}
                      onValueChange={(value) => setPackageBuilder(prev => ({
                        ...prev,
                        schedule: { ...prev.schedule, frequency: value }
                      }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Daily (7 days/week)</SelectItem>
                        <SelectItem value="3times">3 times per week</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="biweekly">Bi-weekly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Hours per visit</Label>
                    <Select 
                      value={packageBuilder.schedule.hours}
                      onValueChange={(value) => setPackageBuilder(prev => ({
                        ...prev,
                        schedule: { ...prev.schedule, hours: value }
                      }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select hours" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2-4">2-4 hours</SelectItem>
                        <SelectItem value="4-6">4-6 hours</SelectItem>
                        <SelectItem value="6-8">6-8 hours</SelectItem>
                        <SelectItem value="8+">8+ hours</SelectItem>
                        <SelectItem value="24">24/7 live-in care</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Preferred time of day</Label>
                    <Select 
                      value={packageBuilder.schedule.timeOfDay}
                      onValueChange={(value) => setPackageBuilder(prev => ({
                        ...prev,
                        schedule: { ...prev.schedule, timeOfDay: value }
                      }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select time" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="morning">Morning (6AM-12PM)</SelectItem>
                        <SelectItem value="afternoon">Afternoon (12PM-6PM)</SelectItem>
                        <SelectItem value="evening">Evening (6PM-10PM)</SelectItem>
                        <SelectItem value="overnight">Overnight (10PM-6AM)</SelectItem>
                        <SelectItem value="flexible">Flexible</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex justify-between">
                  <Button variant="outline" onClick={() => setBuilderStep(1)}>
                    Back
                  </Button>
                  <Button 
                    onClick={() => setBuilderStep(3)}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                    disabled={!packageBuilder.schedule.frequency || !packageBuilder.schedule.hours}
                  >
                    Continue to Contact
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="step3" className="space-y-6">
                <h3 className="text-xl font-semibold">Contact Information</h3>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Full Name *</Label>
                      <Input 
                        value={packageBuilder.contact.name}
                        onChange={(e) => setPackageBuilder(prev => ({
                          ...prev,
                          contact: { ...prev.contact, name: e.target.value }
                        }))}
                        placeholder="Enter your full name"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Email Address *</Label>
                      <Input 
                        type="email"
                        value={packageBuilder.contact.email}
                        onChange={(e) => setPackageBuilder(prev => ({
                          ...prev,
                          contact: { ...prev.contact, email: e.target.value }
                        }))}
                        placeholder="Enter your email"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Phone Number *</Label>
                      <Input 
                        type="tel"
                        value={packageBuilder.contact.phone}
                        onChange={(e) => setPackageBuilder(prev => ({
                          ...prev,
                          contact: { ...prev.contact, phone: e.target.value }
                        }))}
                        placeholder="(757) 555-0123"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Home Address *</Label>
                      <Textarea 
                        value={packageBuilder.contact.address}
                        onChange={(e) => setPackageBuilder(prev => ({
                          ...prev,
                          contact: { ...prev.contact, address: e.target.value }
                        }))}
                        placeholder="Enter your complete address"
                        rows={3}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>When do you need care to start?</Label>
                      <Select 
                        value={packageBuilder.contact.urgency}
                        onValueChange={(value) => setPackageBuilder(prev => ({
                          ...prev,
                          contact: { ...prev.contact, urgency: value }
                        }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select urgency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="immediate">Immediately (within 24 hours)</SelectItem>
                          <SelectItem value="urgent">Within a few days</SelectItem>
                          <SelectItem value="routine">Within 1-2 weeks</SelectItem>
                          <SelectItem value="future">Planning for the future</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between">
                  <Button variant="outline" onClick={() => setBuilderStep(2)}>
                    Back
                  </Button>
                  <Button 
                    onClick={() => setBuilderStep(4)}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                    disabled={!packageBuilder.contact.name || !packageBuilder.contact.email || !packageBuilder.contact.phone}
                  >
                    Review Package
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="step4" className="space-y-6">
                <h3 className="text-xl font-semibold">Review Your Care Package</h3>
                
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <Card className="border-2 border-green-200 bg-green-50">
                      <CardHeader>
                        <CardTitle className="text-2xl text-green-800">
                          <Calculator className="inline mr-2 h-6 w-6" />
                          Package Summary
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex justify-between">
                          <span>Estimated weekly cost:</span>
                          <span className="text-2xl font-bold text-green-600">${estimatedCost}</span>
                        </div>
                        <div className="flex justify-between text-sm text-gray-600">
                          <span>Schedule:</span>
                          <span>{packageBuilder.schedule.frequency} • {packageBuilder.schedule.hours} hours</span>
                        </div>
                        <div className="flex justify-between text-sm text-gray-600">
                          <span>Start date:</span>
                          <span className="capitalize">{packageBuilder.contact.urgency}</span>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Contact Information</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2 text-sm">
                        <div><strong>Name:</strong> {packageBuilder.contact.name}</div>
                        <div><strong>Email:</strong> {packageBuilder.contact.email}</div>
                        <div><strong>Phone:</strong> {packageBuilder.contact.phone}</div>
                        <div><strong>Address:</strong> {packageBuilder.contact.address}</div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-semibold">Selected Services:</h4>
                    {Object.entries(packageBuilder).slice(0, 4).map(([categoryKey, services]) => {
                      const selectedServices = Object.keys(services).filter(key => services[key])
                      if (selectedServices.length === 0) return null
                      
                      const category = servicePackages[categoryKey]
                      return (
                        <Card key={categoryKey} className="border border-blue-200">
                          <CardHeader className="pb-2">
                            <CardTitle className="text-sm flex items-center">
                              {category.icon}
                              <span className="ml-2">{category.title}</span>
                              <Badge className="ml-auto">${category.basePrice}/hr base</Badge>
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="pt-0">
                            <div className="space-y-1">
                              {selectedServices.map(serviceId => {
                                const service = category.services.find(s => s.id === serviceId)
                                return (
                                  <div key={serviceId} className="flex justify-between text-sm">
                                    <span>• {service.name}</span>
                                    <span className="text-green-600">+${service.price}/hr</span>
                                  </div>
                                )
                              })}
                            </div>
                          </CardContent>
                        </Card>
                      )
                    })}
                  </div>
                </div>

                <div className="flex justify-between">
                  <Button variant="outline" onClick={() => setBuilderStep(3)}>
                    Back
                  </Button>
                  <Button 
                    onClick={submitServiceRequest}
                    className="bg-gradient-to-r from-green-600 to-blue-600 text-white"
                  >
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Submit Request
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </DialogContent>
      </Dialog>

      {/* Testimonials */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              What Families Are Saying
            </h2>
            <div className="flex justify-center items-center space-x-2 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-6 w-6 text-yellow-400 fill-current" />
              ))}
              <span className="text-2xl font-bold text-gray-800 ml-2">4.8/5</span>
              <span className="text-gray-600 ml-2">from 127 reviews</span>
            </div>
          </div>

          <div className="max-w-4xl mx-auto">
            <Card className="border-0 shadow-2xl bg-gradient-to-br from-blue-50 to-purple-50">
              <CardContent className="p-8 text-center">
                <div className="mb-6">
                  <Quote className="h-12 w-12 text-blue-300 mx-auto mb-4" />
                  <p className="text-xl text-gray-700 italic leading-relaxed">
                    &quot;{testimonials[currentTestimonial].text}&quot;
                  </p>
                </div>
                <div className="flex items-center justify-center space-x-2 mb-4">
                  {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <div className="text-center">
                  <div className="font-semibold text-gray-800">{testimonials[currentTestimonial].name}</div>
                  <div className="text-gray-600">{testimonials[currentTestimonial].location}</div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-center space-x-2 mt-6">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  aria-label={`View testimonial ${index + 1}`}
                  title={`View testimonial ${index + 1}`}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentTestimonial ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Quick Links Grid */}
      <section className="py-16 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Explore Our Resources
            </h2>
            <p className="text-xl text-gray-600">
              Everything you need to know about quality home care
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { 
                title: "Frequently Asked Questions", 
                icon: <HelpCircle className="h-8 w-8" />, 
                color: "from-blue-500 to-cyan-500",
                link: "/faq",
                description: "Get answers to common questions about our services"
              },
              { 
                title: "Blog & Resources", 
                icon: <BookOpen className="h-8 w-8" />, 
                color: "from-green-500 to-emerald-500",
                link: "/blog",
                description: "Expert articles and caregiving tips"
              },
              { 
                title: "Privacy Policy", 
                icon: <Lock className="h-8 w-8" />, 
                color: "from-purple-500 to-violet-500",
                link: "/privacy",
                description: "How we protect your personal information"
              },
              { 
                title: "HIPAA Compliance", 
                icon: <Shield className="h-8 w-8" />, 
                color: "from-red-500 to-pink-500",
                link: "/hipaa-compliance",
                description: "Your healthcare privacy rights and our duties"
              }
            ].map((item, index) => (
              <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-0 cursor-pointer" onClick={() => window.location.href = item.link}>
                <CardContent className="p-6 text-center">
                  <div className={`bg-gradient-to-r ${item.color} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <div className="text-white">
                      {item.icon}
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-gray-800 mb-2">{item.title}</h3>
                  <p className="text-gray-600 text-sm mb-4">{item.description}</p>
                  <Button variant="outline" className="w-full group-hover:bg-blue-50">
                    Learn More
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1">
              <div className="flex items-center space-x-3 mb-6">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-full">
                  <Compass className="h-6 w-6 text-white" />
                </div>
                <span className="text-xl font-bold">Caring Compass</span>
              </div>
              <p className="text-gray-400 mb-6">
                Providing compassionate, personalized home care that honors your independence and preserves your dignity.
              </p>
              <div className="space-y-2">
                <a href="tel:+17575552273" className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors">
                  <Phone className="h-4 w-4 text-blue-400" />
                  <span>(757) 555-CARE</span>
                </a>
                <a href="mailto:info@caringcompasshomescare.com" className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors">
                  <Mail className="h-4 w-4 text-blue-400" />
                  <span>info@caringcompasshomescare.com</span>
                </a>
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-blue-400" />
                  <span>Serving Hampton Roads, VA</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Services</h3>
              <div className="space-y-2">
                <a href="/services/personal-care" className="block text-gray-400 hover:text-white transition-colors">Personal Care</a>
                <a href="/services/companionship" className="block text-gray-400 hover:text-white transition-colors">Companionship</a>
                <a href="/services/household-support" className="block text-gray-400 hover:text-white transition-colors">Household Support</a>
                <a href="/services/specialized-care" className="block text-gray-400 hover:text-white transition-colors">Specialized Care</a>
                <a href="/services/respite-care" className="block text-gray-400 hover:text-white transition-colors">Respite Care</a>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Company</h3>
              <div className="space-y-2">
                <a href="/about" className="block text-gray-400 hover:text-white transition-colors">About Us</a>
                <a href="/our-story" className="block text-gray-400 hover:text-white transition-colors">Our Story</a>
                <a href="/careers" className="block text-gray-400 hover:text-white transition-colors">Careers</a>
                <a href="/blog" className="block text-gray-400 hover:text-white transition-colors">Blog</a>
                <a href="/reviews" className="block text-gray-400 hover:text-white transition-colors">Reviews</a>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Support</h3>
              <div className="space-y-2">
                <a href="/contact" className="block text-gray-400 hover:text-white transition-colors">Contact Us</a>
                <a href="/faq" className="block text-gray-400 hover:text-white transition-colors">FAQ</a>
                <a href="/privacy" className="block text-gray-400 hover:text-white transition-colors">Privacy Policy</a>
                <a href="/terms" className="block text-gray-400 hover:text-white transition-colors">Terms of Service</a>
                <a href="/hipaa-compliance" className="block text-gray-400 hover:text-white transition-colors">HIPAA Compliance</a>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 text-center">
            <p className="text-gray-400">
              © 2024 Caring Compass Home Care LLC. All rights reserved. Licensed & Insured.
            </p>
            <p className="text-gray-500 text-sm mt-2">
              Developed by <a href="https://techklein.com" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 transition-colors">TECHKLEIN</a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}