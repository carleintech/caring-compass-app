'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/components/ui/use-toast'
import { useServices } from '@/hooks/use-services'
import ApplicationModal from '@/components/ApplicationModal'
import { 
  Heart, 
  DollarSign, 
  Clock, 
  Award, 
  Users, 
  Star,
  CheckCircle,
  ArrowRight,
  Phone,
  Mail,
  Briefcase,
  GraduationCap,
  Shield,
  TrendingUp,
  Home,
  Sparkles,
  MapPin,
  Building2,
  Crown,
  MessageCircle,
  FileText,
  Rocket,
  Gift
} from 'lucide-react'

const CareersPage = () => {
  const [applicationData, setApplicationData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    zipCode: '',
    position: '',
    experience: '',
    availability: '',
    transportation: '',
    certifications: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedPosition, setSelectedPosition] = useState('')

  const { toast } = useToast()
  const { 
    speakWithCoordinator,
    scheduleConsultation 
  } = useServices()

  // Quick application handler (simplified form at bottom)
  const handleQuickSubmit = async () => {
    if (!applicationData.firstName || !applicationData.lastName || !applicationData.email || !applicationData.phone) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields to continue.",
        variant: "destructive"
      })
      return
    }
    
    setIsSubmitting(true)
    
    try {
      // Simulate backend submission for quick form
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      toast({
        title: "Interest Recorded! 🎉",
        description: "We'll contact you within 24 hours to discuss opportunities.",
      })
      
      // Clear form
      setApplicationData({ 
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        zipCode: '',
        position: '',
        experience: '',
        availability: '',
        transportation: '',
        certifications: '',
        message: ''
      })
    } catch (error) {
      toast({
        title: "Submission Error",
        description: "Please try again or call us directly at (850) 861-0959",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Enhanced position application handler
  const handlePositionApply = (position: string) => {
    setSelectedPosition(position)
    setIsModalOpen(true)
  }

  // Contact handlers
  const handleContactCall = async () => {
    try {
      await speakWithCoordinator('careers')
      toast({
        title: "Connecting you now...",
        description: "Our HR team will be with you shortly!"
      })
    } catch (error) {
      toast({
        title: "Call initiated",
        description: "Dialing (757) 555-CARE now..."
      })
    }
  }

  const handleEmailContact = async () => {
    try {
      window.location.href = 'mailto:hr@caringcompass.com'
      toast({
        title: "Opening email client...",
        description: "Preparing email to hr@caringcompass.com"
      })
    } catch (error) {
      toast({
        title: "Email Error",
        description: "Please try calling us at (757) 555-CARE"
      })
    }
  }

  const handlePositionInquiry = async (position: string) => {
    try {
      await scheduleConsultation('career-inquiry')
      toast({
        title: "Interest Recorded! 💼",
        description: `We'll contact you about the ${position} position soon.`
      })
    } catch (error) {
      toast({
        title: "Thank you for your interest!",
        description: `We've noted your interest in the ${position} position.`
      })
    }
  }

  const benefits = [
    {
      icon: DollarSign,
      title: "Competitive Pay",
      description: "$18 - $25 per hour",
      details: ["Weekly pay with direct deposit", "Performance bonuses", "Mileage reimbursement", "Holiday pay rates"]
    },
    {
      icon: Clock,
      title: "Flexible Scheduling",
      description: "Work when it fits your life",
      details: ["Choose your own hours", "Part-time and full-time options", "Weekend availability optional", "No mandatory overtime"]
    },
    {
      icon: Award,
      title: "Professional Growth",
      description: "Advance your career",
      details: ["40 hours paid training", "Continuing education opportunities", "Leadership development programs", "Tuition assistance available"]
    },
    {
      icon: Heart,
      title: "Meaningful Work",
      description: "Make a real difference",
      details: ["Help seniors age in place", "Build lasting relationships", "Supportive team environment", "Recognition programs"]
    }
  ]

  const positions = [
    {
      title: "Certified Nursing Assistant (CNA)",
      type: "Full-time / Part-time",
      pay: "$20 - $25/hour",
      requirements: ["Current CNA certification", "2+ years experience preferred", "Reliable transportation", "CPR certification"],
      description: "Provide personal care assistance including bathing, dressing, mobility support, and medication reminders."
    },
    {
      title: "Personal Care Aide (PCA)",
      type: "Full-time / Part-time", 
      pay: "$18 - $22/hour",
      requirements: ["PCA certification or equivalent", "1+ years experience", "Reliable transportation", "First Aid certification"],
      description: "Assist with activities of daily living, companionship, and light housekeeping tasks."
    },
    {
      title: "Home Health Aide (HHA)",
      type: "Full-time / Part-time",
      pay: "$19 - $24/hour",
      requirements: ["HHA certification", "2+ years experience", "Reliable transportation", "Background check"],
      description: "Provide comprehensive non-medical care including personal care, medication reminders, and health monitoring."
    },
    {
      title: "Companion Caregiver",
      type: "Part-time / Full-time",
      pay: "$16 - $20/hour",
      requirements: ["High school diploma", "Compassionate personality", "Reliable transportation", "Clean driving record"],
      description: "Provide companionship, light housekeeping, meal preparation, and transportation assistance."
    }
  ]

  const whyChooseUs = [
    {
      icon: Users,
      title: "Supportive Team",
      description: "Join a caring team that supports each other and celebrates successes together."
    },
    {
      icon: GraduationCap,
      title: "Comprehensive Training",
      description: "Receive thorough training in our Compass Care Philosophy™ and ongoing professional development."
    },
    {
      icon: Shield,
      title: "Job Security",
      description: "Growing demand for home care means stable employment in a recession-proof industry."
    },
    {
      icon: TrendingUp,
      title: "Career Growth",
      description: "Clear advancement opportunities from caregiver to supervisor to management roles."
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50 relative overflow-hidden">
      {/* Enhanced Floating Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-violet-200/30 to-purple-300/30 rounded-full blur-3xl animate-pulse [animation-delay:2s]" />
        <div className="absolute top-1/3 -left-32 w-64 h-64 bg-gradient-to-br from-fuchsia-200/40 to-pink-300/40 rounded-full blur-2xl animate-bounce [animation-delay:3s] [animation-duration:8s]" />
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-gradient-to-br from-indigo-200/30 to-purple-200/30 rounded-full blur-xl animate-pulse [animation-delay:4s]" />
        <div className="absolute top-3/4 left-1/3 w-32 h-32 bg-gradient-to-br from-violet-300/50 to-purple-400/50 rounded-full blur-lg animate-bounce [animation-delay:1s] [animation-duration:6s]" />
      </div>

      {/* Stunning Header Section */}
      <header className="relative z-10 bg-white/80 backdrop-blur-lg border-b border-violet-100/50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            {/* Logo & Navigation */}
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-3 animate-fade-in">
                <div className="relative">
                  <div className="bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500 text-white p-3 rounded-xl shadow-lg animate-pulse [animation-delay:500ms]">
                    <Briefcase className="h-8 w-8" />
                  </div>
                  <div className="absolute -top-1 -right-1 bg-yellow-400 text-violet-900 p-1 rounded-full animate-bounce [animation-delay:800ms]">
                    <Sparkles className="h-3 w-3" />
                  </div>
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 bg-clip-text text-transparent">
                    Caring Compass
                  </h1>
                  <p className="text-sm text-gray-600 font-medium">Career Opportunities</p>
                </div>
              </div>

              {/* Enhanced Navigation Links */}
              <nav className="hidden md:flex items-center space-x-6 animate-fade-in [animation-delay:600ms]">
                <Badge variant="outline" className="bg-violet-50 text-violet-700 border-violet-200 hover:bg-violet-100 transition-colors duration-300">
                  <Crown className="mr-1 h-3 w-3" />
                  Now Hiring
                </Badge>
                <div className="flex items-center text-gray-600 hover:text-violet-600 transition-colors duration-300">
                  <MapPin className="mr-1 h-4 w-4" />
                  <span className="text-sm font-medium">Hampton Roads, VA</span>
                </div>
              </nav>
            </div>

            {/* Enhanced Action Buttons */}
            <div className="flex items-center space-x-4 animate-fade-in [animation-delay:700ms]">
              <Link href="/">
                <Button 
                  variant="ghost" 
                  className="text-violet-600 hover:text-violet-700 hover:bg-violet-50 transition-all duration-300 group"
                >
                  <Home className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform duration-300" />
                  Back to Home
                </Button>
              </Link>
              
              <Button 
                onClick={handleContactCall}
                className="bg-gradient-to-r from-violet-500 to-purple-500 text-white hover:from-violet-600 hover:to-purple-600 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <Phone className="mr-2 h-4 w-4" />
                Call HR Team
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Enhanced Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-100/30 via-purple-50/20 to-fuchsia-100/30" />
        
        <div className="relative container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in [animation-delay:300ms]">
              <Badge className="mb-6 bg-gradient-to-r from-violet-100 to-purple-100 text-violet-700 border-violet-200 shadow-lg animate-bounce [animation-delay:800ms]">
                <Sparkles className="w-3 h-3 mr-1 animate-pulse" />
                Transform Lives • Build Your Future
              </Badge>
              
              <h1 className="text-5xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
                Join Our 
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 animate-pulse [animation-delay:1s]"> 
                  Caring Revolution
                </span>
              </h1>
              
              <p className="text-xl text-gray-700 mb-8 leading-relaxed">
                Make a meaningful difference in seniors' lives while building a rewarding career. We offer competitive pay, flexible schedules, and comprehensive benefits in the growing field of home care.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-8 animate-fade-in [animation-delay:1200ms]">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-violet-600 to-purple-600 text-white px-8 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl group"
                  onClick={() => handlePositionApply('')}
                >
                  <Rocket className="mr-2 w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                  Start Your Journey
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                </Button>
                
                <Button 
                  variant="outline" 
                  size="lg"
                  className="px-8 border-2 border-violet-200 text-violet-700 hover:bg-violet-50 hover:border-violet-300 transform hover:scale-105 transition-all duration-300"
                  onClick={handleContactCall}
                >
                  <Phone className="mr-2 w-5 h-5" />
                  Talk to Our Team
                </Button>
              </div>

              {/* Enhanced Benefits Preview */}
              <div className="grid grid-cols-3 gap-6 animate-fade-in [animation-delay:1400ms]">
                <div className="text-center group">
                  <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                    <DollarSign className="h-8 w-8 text-green-600 mx-auto mb-2 group-hover:scale-110 transition-transform duration-300" />
                    <div className="text-lg font-bold text-gray-900">$18-$25</div>
                    <div className="text-sm text-gray-600">per hour</div>
                  </div>
                </div>
                <div className="text-center group">
                  <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                    <Clock className="h-8 w-8 text-blue-600 mx-auto mb-2 group-hover:scale-110 transition-transform duration-300" />
                    <div className="text-lg font-bold text-gray-900">Flexible</div>
                    <div className="text-sm text-gray-600">Schedule</div>
                  </div>
                </div>
                <div className="text-center group">
                  <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                    <Award className="h-8 w-8 text-violet-600 mx-auto mb-2 group-hover:scale-110 transition-transform duration-300" />
                    <div className="text-lg font-bold text-gray-900">40 Hours</div>
                    <div className="text-sm text-gray-600">Paid Training</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Right Side Card */}
            <div className="relative animate-fade-in [animation-delay:600ms]">
              <div className="absolute -top-4 -left-4 w-full h-full bg-gradient-to-br from-violet-200/30 to-purple-300/30 rounded-3xl blur-xl" />
              
              <Card className="relative bg-white/90 backdrop-blur-sm border-0 shadow-2xl hover:shadow-3xl transition-all duration-500 overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-violet-200/20 to-purple-200/20 rounded-full blur-lg -translate-y-16 translate-x-16" />
                
                <CardHeader className="text-center relative">
                  <div className="flex justify-center mb-6">
                    <div className="bg-gradient-to-r from-violet-500 to-purple-500 text-white p-4 rounded-full shadow-xl animate-pulse [animation-delay:1000ms]">
                      <Heart className="h-8 w-8" />
                    </div>
                  </div>
                  <CardTitle className="text-2xl font-bold text-gray-900 bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                    Why Our Team Loves Working Here
                  </CardTitle>
                  <CardDescription className="text-gray-700 mt-2">
                    Join hundreds of caregivers who've found their calling with us
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="relative">
                  <div className="space-y-4 mb-6">
                    {[
                      { icon: DollarSign, text: "Competitive wages with weekly pay", color: "green" },
                      { icon: Clock, text: "Choose your own schedule and clients", color: "blue" },
                      { icon: Heart, text: "Make a real difference in people's lives", color: "red" },
                      { icon: Award, text: "40 hours of paid training provided", color: "violet" }
                    ].map((item, index) => (
                      <div 
                        key={index} 
                        className="flex items-center space-x-3 group animate-fade-in"
                        style={{ animationDelay: `${index * 200 + 1200}ms` }}
                      >
                        <div className={`w-10 h-10 bg-${item.color}-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                          <item.icon className={`w-5 h-5 text-${item.color}-600`} />
                        </div>
                        <p className="text-gray-700 group-hover:text-gray-900 transition-colors duration-300">{item.text}</p>
                      </div>
                    ))}
                  </div>

                  <Button 
                    className="w-full bg-gradient-to-r from-violet-600 to-purple-600 text-white hover:from-violet-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                    size="lg"
                    onClick={() => handlePositionApply('')}
                  >
                    <Rocket className="mr-2 w-5 h-5" />
                    Start Your Application
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Benefits Section */}
      <section className="py-20 bg-white/80 backdrop-blur-sm relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-50/30 to-purple-50/30" />
        
        <div className="container mx-auto px-4 relative">
          <div className="text-center mb-16 animate-fade-in [animation-delay:200ms]">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="bg-gradient-to-r from-violet-500 to-purple-500 text-white p-4 rounded-full animate-bounce [animation-delay:400ms] shadow-xl">
                  <Gift className="h-8 w-8" />
                </div>
                <div className="absolute -top-2 -right-2 bg-yellow-400 text-violet-900 p-1 rounded-full animate-pulse [animation-delay:600ms]">
                  <Star className="h-4 w-4" />
                </div>
              </div>
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
              Exceptional Benefits & Compensation
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
              We value our caregivers and offer competitive compensation along with benefits that support your personal and professional growth.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <Card 
                key={index} 
                className="group border-0 shadow-xl bg-white/90 backdrop-blur-sm hover:shadow-2xl transition-all duration-500 h-full animate-fade-in overflow-hidden hover:scale-[1.02]"
                style={{ animationDelay: `${index * 150 + 600}ms` }}
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-violet-200/20 to-purple-200/20 rounded-full blur-lg -translate-y-12 translate-x-12" />
                
                <CardHeader className="text-center relative">
                  <div className="w-16 h-16 bg-gradient-to-br from-violet-100 to-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <benefit.icon className="w-8 h-8 text-violet-600 group-hover:rotate-12 transition-transform duration-300" />
                  </div>
                  <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-violet-600 transition-colors duration-300">
                    {benefit.title}
                  </CardTitle>
                  <p className="text-violet-600 font-semibold text-lg">{benefit.description}</p>
                </CardHeader>

                <CardContent className="relative">
                  <ul className="space-y-3">
                    {benefit.details.map((detail, i) => (
                      <li 
                        key={i} 
                        className="flex items-center text-sm text-gray-700 group-hover:text-gray-900 transition-colors duration-300"
                      >
                        <CheckCircle className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" />
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <div className="mt-6 pt-4 border-t border-gray-100">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handlePositionInquiry(benefit.title)}
                      className="w-full text-violet-600 hover:text-violet-700 hover:bg-violet-50 transition-colors duration-300"
                    >
                      Learn More
                      <ArrowRight className="ml-2 h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Enhanced Why Choose Us Section */}
          <div className="mt-20">
            <div className="text-center mb-12 animate-fade-in [animation-delay:1000ms]">
              <h3 className="text-3xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                Why Choose Caring Compass?
              </h3>
              <p className="text-gray-700 text-lg">Join a team that truly cares about your success and well-being</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {whyChooseUs.map((item, index) => (
                <Card 
                  key={index} 
                  className="group text-center border-0 shadow-lg bg-gradient-to-br from-white to-violet-50/30 hover:shadow-xl transition-all duration-300 animate-fade-in hover:scale-105"
                  style={{ animationDelay: `${index * 100 + 1200}ms` }}
                >
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-purple-500 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                      <item.icon className="w-6 h-6 text-white" />
                    </div>
                    <h4 className="font-bold text-gray-900 mb-2 group-hover:text-violet-600 transition-colors duration-300">
                      {item.title}
                    </h4>
                    <p className="text-sm text-gray-700 leading-relaxed">{item.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Open Positions Section */}
      <section className="py-20 bg-gradient-to-br from-violet-50/50 to-purple-50/50 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-violet-100/20 to-purple-100/20" />
        
        <div className="container mx-auto px-4 relative">
          <div className="text-center mb-16 animate-fade-in [animation-delay:200ms]">
            <div className="flex justify-center mb-6">
              <div className="bg-gradient-to-r from-violet-500 to-purple-500 text-white p-4 rounded-full animate-bounce [animation-delay:400ms] shadow-xl">
                <Briefcase className="h-8 w-8" />
              </div>
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
              Current Open Positions
            </h2>
            <p className="text-xl text-gray-700 leading-relaxed">
              Find the perfect role that matches your skills and availability
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {positions.map((position, index) => (
              <Card 
                key={index} 
                className="group border-0 shadow-xl bg-white/90 backdrop-blur-sm hover:shadow-2xl transition-all duration-500 animate-fade-in overflow-hidden hover:scale-[1.02]"
                style={{ animationDelay: `${index * 200 + 600}ms` }}
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-violet-200/20 to-purple-200/20 rounded-full blur-lg -translate-y-16 translate-x-16" />
                
                <CardHeader className="relative">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <CardTitle className="text-2xl font-bold text-gray-900 group-hover:text-violet-600 transition-colors duration-300 mb-2">
                        {position.title}
                      </CardTitle>
                      <div className="flex flex-wrap gap-2 mb-3">
                        <Badge variant="outline" className="bg-violet-50 text-violet-700 border-violet-200">
                          <Clock className="mr-1 h-3 w-3" />
                          {position.type}
                        </Badge>
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          <DollarSign className="mr-1 h-3 w-3" />
                          {position.pay}
                        </Badge>
                      </div>
                    </div>
                    <div className="bg-gradient-to-br from-violet-100 to-purple-100 p-3 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <Building2 className="h-6 w-6 text-violet-600" />
                    </div>
                  </div>
                  <CardDescription className="text-gray-700 leading-relaxed">
                    {position.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="relative">
                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                      <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                      Requirements:
                    </h4>
                    <ul className="space-y-2">
                      {position.requirements.map((req, i) => (
                        <li key={i} className="flex items-start text-sm text-gray-700">
                          <div className="w-1.5 h-1.5 bg-violet-400 rounded-full mt-2 mr-3 flex-shrink-0" />
                          <span>{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button 
                      onClick={() => handlePositionApply(position.title)}
                      className="flex-1 bg-gradient-to-r from-violet-600 to-purple-600 text-white hover:from-violet-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                      <Rocket className="mr-2 h-4 w-4" />
                      Apply Now
                    </Button>
                    
                    <Button 
                      onClick={() => handlePositionInquiry(position.title)}
                      variant="outline"
                      className="border-2 border-violet-200 text-violet-700 hover:bg-violet-50 hover:border-violet-300 transform hover:scale-105 transition-all duration-300"
                    >
                      <MessageCircle className="mr-2 h-4 w-4" />
                      Learn More
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      
      {/* Application Modal */}
      <ApplicationModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedPosition={selectedPosition}
      />
    </div>
  )
}

export default CareersPage