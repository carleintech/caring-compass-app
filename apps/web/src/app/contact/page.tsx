'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { useToast } from '@/components/ui/use-toast'
import { useServices } from '@/hooks/use-services'
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Calendar,
  MessageCircle,
  Heart,
  Shield,
  Users,
  CheckCircle,
  AlertCircle,
  Send,
  Compass,
  Home,
  Sparkles,
  ArrowRight,
  Star,
  Zap,
  Globe,
  Headphones,
  Award,
  Building2,
  Timer,
  UserCheck,
  PhoneCall,
  Mail as MailIcon,
  Navigation,
  Coffee,
  Sunrise,
  Moon,
  Gift
} from 'lucide-react'

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    zipCode: '',
    careType: '',
    urgency: '',
    message: '',
    preferredContact: 'phone'
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { toast } = useToast()
  const { 
    speakWithCoordinator,
    scheduleConsultation,
    requestCareAssessment 
  } = useServices()

  // Enhanced submit handler with backend integration
  const handleSubmit = async () => {
    if (!formData.name || !formData.email || !formData.phone) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields to continue.",
        variant: "destructive"
      })
      return
    }
    
    setIsSubmitting(true)
    
    try {
      // Simulate backend submission
      await requestCareAssessment(formData)
      
      toast({
        title: "Message Sent Successfully! 🎉",
        description: "We'll contact you within 2 hours to discuss your care needs.",
      })
      
      // Clear form
      setFormData({ 
        name: '', 
        email: '', 
        phone: '', 
        zipCode: '',
        careType: '', 
        urgency: '',
        message: '', 
        preferredContact: 'phone' 
      })
      
    } catch (error) {
      console.error('Error submitting contact form:', error)
      toast({
        title: "Submission Error",
        description: "Failed to send message. Please try again or call us directly.",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Quick action handlers
  const handleQuickCall = async () => {
    try {
      await speakWithCoordinator()
      toast({
        title: "Call Request Initiated! ☎️",
        description: "A care coordinator will call you back within 15 minutes."
      })
    } catch (error) {
      console.error('Call request error:', error)
    }
  }

  const handleQuickConsultation = async () => {
    try {
      await scheduleConsultation()
      toast({
        title: "Consultation Scheduled! 📅",
        description: "Your free consultation has been booked. Check your email for details."
      })
    } catch (error) {
      console.error('Consultation scheduling error:', error)
    }
  }

  // Floating elements for stunning background
  const FloatingElement = ({ 
    icon: Icon, 
    className = "", 
    delay = "0s",
    size = "w-8 h-8"
  }: { 
    icon: any, 
    className?: string, 
    delay?: string,
    size?: string 
  }) => (
    <div 
      className={`absolute ${size} text-emerald-400/10 animate-float ${className}`}
      style={{ 
        animationDelay: delay,
        animationDuration: '6s'
      }}
    >
      <Icon className="w-full h-full" />
    </div>
  )

  // Enhanced contact methods with emergency option
  const contactMethods = [
    {
      icon: Phone,
      title: 'Emergency Care Line',
      description: '24/7 Immediate Response',
      value: '(850) 861-0959',
      action: 'tel:+18508610959',
      gradient: 'from-red-500 to-pink-600',
      urgent: true
    },
    {
      icon: PhoneCall,
      title: 'General Inquiries',
      description: 'Consultation & Information',
      value: '(850) 861-0959',
      action: 'tel:+18508610959',
      gradient: 'from-emerald-500 to-teal-600',
      urgent: false
    },
    {
      icon: MailIcon,
      title: 'Email Support',
      description: 'Detailed Care Planning',
      value: 'admin@caringcompasshomecare.com',
      action: 'mailto:admin@caringcompasshomecare.com',
      gradient: 'from-blue-500 to-cyan-600',
      urgent: false
    },
    {
      icon: MapPin,
      title: 'Service Areas',
      description: 'Hampton Roads, Virginia',
      value: 'Multiple Locations',
      action: '#service-areas',
      gradient: 'from-purple-500 to-indigo-600',
      urgent: false
    }
  ]

  // Enhanced office hours with better display
  const officeHours = [
    { day: 'Monday - Friday', hours: '8:00 AM - 6:00 PM', icon: Sunrise, status: 'open' },
    { day: 'Saturday', hours: '9:00 AM - 3:00 PM', icon: Coffee, status: 'limited' },
    { day: 'Sunday', hours: 'Emergency Only', icon: Moon, status: 'emergency' },
    { day: 'Holidays', hours: 'Emergency Care Available', icon: Gift, status: 'emergency' }
  ]

  // Service response promises
  const responsePromises = [
    {
      icon: Timer,
      title: 'Emergency Response',
      description: 'Within 2 hours',
      color: 'text-red-500'
    },
    {
      icon: UserCheck,
      title: 'General Inquiries',
      description: 'Same business day',
      color: 'text-emerald-500'
    },
    {
      icon: Calendar,
      title: 'Care Assessment',
      description: 'Within 24 hours',
      color: 'text-blue-500'
    },
    {
      icon: Award,
      title: 'Follow-up Support',
      description: 'Ongoing availability',
      color: 'text-purple-500'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-900 to-teal-900 relative overflow-hidden">
      {/* Stunning Floating Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <FloatingElement icon={Heart} className="top-20 left-10" delay="0s" />
        <FloatingElement icon={Shield} className="top-32 right-20" delay="1s" />
        <FloatingElement icon={Users} className="top-64 left-1/4" delay="2s" />
        <FloatingElement icon={Sparkles} className="top-80 right-1/3" delay="3s" />
        <FloatingElement icon={Star} className="bottom-32 left-20" delay="4s" />
        <FloatingElement icon={Zap} className="bottom-48 right-16" delay="5s" />
        <FloatingElement icon={Globe} className="top-1/2 left-16" delay="6s" />
        <FloatingElement icon={Headphones} className="top-1/3 right-12" delay="7s" />
        <FloatingElement icon={Building2} className="bottom-64 left-1/3" delay="8s" />
        <FloatingElement icon={Navigation} className="bottom-80 right-1/4" delay="9s" />
        
        {/* Larger floating elements */}
        <FloatingElement icon={Compass} className="top-40 right-40" delay="2.5s" size="w-16 h-16" />
        <FloatingElement icon={Heart} className="bottom-40 left-40" delay="4.5s" size="w-12 h-12" />
        
        {/* Gradient overlays for depth */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-radial from-emerald-500/20 to-transparent blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-radial from-teal-500/20 to-transparent blur-3xl" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-radial from-cyan-500/10 to-transparent blur-3xl" />
      </div>

      {/* Enhanced Header with Consistent Style */}
      <div className="relative z-10">
        <div className="container mx-auto px-6 pt-8">
          <div className="flex items-center justify-between mb-8">
            <Link 
              href="/"
              className="group flex items-center space-x-3 text-white hover:text-emerald-300 transition-all duration-300 transform hover:scale-105"
            >
              <div className="w-10 h-10 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full flex items-center justify-center shadow-lg group-hover:shadow-emerald-500/50 transition-all duration-300">
                <Home className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-semibold">Back to Home</span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </Link>
            
            <div className="flex items-center space-x-4">
              <Badge 
                variant="outline" 
                className="border-emerald-400 text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 transition-colors"
              >
                <Phone className="w-3 h-3 mr-1" />
                24/7 Emergency Care
              </Badge>
              <Badge 
                variant="outline" 
                className="border-teal-400 text-teal-300 bg-teal-500/10 hover:bg-teal-500/20 transition-colors"
              >
                <CheckCircle className="w-3 h-3 mr-1" />
                Licensed & Insured
              </Badge>
            </div>
          </div>

          {/* Hero Section with Floating Header Style */}
          <div className="text-center mb-16 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/20 to-teal-600/20 blur-3xl rounded-full transform -rotate-6" />
            
            <div className="relative z-10">
              <div className="inline-flex items-center space-x-2 bg-emerald-500/10 backdrop-blur-sm border border-emerald-400/30 rounded-full px-6 py-2 mb-6">
                <MessageCircle className="w-5 h-5 text-emerald-400" />
                <span className="text-emerald-300 font-medium">Connect With Our Care Team</span>
                <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" />
              </div>
              
              <h1 className="text-6xl md:text-7xl font-bold text-white mb-6 leading-tight">
                Get in{' '}
                <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent animate-pulse">
                  Touch
                </span>
              </h1>
              
              <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed mb-8">
                Ready to start your journey with compassionate home care? Our experienced team is here to provide 
                personalized support for you and your loved ones, available 24/7 for emergencies.
              </p>
              
              {/* Quick Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
                <Button 
                  onClick={handleQuickCall}
                  className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-8 py-3 rounded-full text-lg font-semibold shadow-lg hover:shadow-emerald-500/50 transition-all duration-300 transform hover:scale-105 group"
                >
                  <Phone className="w-5 h-5 mr-2 group-hover:animate-pulse" />
                  Call Now - Free Consultation
                  <ArrowRight className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" />
                </Button>
                
                <Button 
                  onClick={handleQuickConsultation}
                  variant="outline" 
                  className="border-2 border-emerald-400 text-emerald-300 hover:bg-emerald-500/20 px-8 py-3 rounded-full text-lg font-semibold backdrop-blur-sm transition-all duration-300 transform hover:scale-105 group"
                >
                  <Calendar className="w-5 h-5 mr-2 group-hover:animate-pulse" />
                  Schedule Assessment
                  <Sparkles className="w-4 h-4 ml-2 group-hover:animate-spin transition-transform" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Stunning Contact Methods Section */}
      <div className="relative z-10 py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 bg-emerald-500/10 backdrop-blur-sm border border-emerald-400/30 rounded-full px-6 py-2 mb-6">
              <Phone className="w-5 h-5 text-emerald-400" />
              <span className="text-emerald-300 font-medium">Multiple Ways to Connect</span>
            </div>
            
            <h2 className="text-5xl font-bold text-white mb-6">
              Choose Your{' '}
              <span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
                Preferred
              </span>{' '}
              Method
            </h2>
            
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              We're available through multiple channels to ensure you can reach us when you need us most
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {contactMethods.map((method, index) => (
              <Card 
                key={index} 
                className={`group relative overflow-hidden bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 hover:border-${method.urgent ? 'red' : 'emerald'}-400/50 transition-all duration-500 transform hover:scale-105 hover:shadow-2xl cursor-pointer`}
                onClick={() => method.action !== '#service-areas' && window.open(method.action, '_self')}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${method.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
                
                <CardHeader className="text-center p-6">
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r ${method.gradient} flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300`}>
                    <method.icon className="w-8 h-8 text-white" />
                  </div>
                  
                  <CardTitle className="text-xl text-white mb-2 group-hover:text-emerald-300 transition-colors">
                    {method.title}
                  </CardTitle>
                  
                  <CardDescription className="text-slate-400 text-sm mb-4">
                    {method.description}
                  </CardDescription>
                  
                  <div className="text-lg font-semibold text-emerald-300 mb-4">
                    {method.value}
                  </div>
                  
                  <Button 
                    className={`w-full bg-gradient-to-r ${method.gradient} hover:shadow-lg transition-all duration-300 transform group-hover:scale-105`}
                    onClick={(e) => {
                      e.stopPropagation()
                      if (method.action !== '#service-areas') {
                        window.open(method.action, '_self')
                      }
                    }}
                  >
                    {method.urgent ? '🚨 Emergency Call' : 'Contact Now'}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Enhanced Contact Form Section */}
      <div className="relative z-10 py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center space-x-2 bg-teal-500/10 backdrop-blur-sm border border-teal-400/30 rounded-full px-6 py-2 mb-6">
                <Send className="w-5 h-5 text-teal-400" />
                <span className="text-teal-300 font-medium">Start Your Care Journey</span>
              </div>
              
              <h2 className="text-5xl font-bold text-white mb-6">
                Request Your{' '}
                <span className="bg-gradient-to-r from-teal-400 to-cyan-300 bg-clip-text text-transparent">
                  Free
                </span>{' '}
                Consultation
              </h2>
              
              <p className="text-xl text-slate-300 max-w-3xl mx-auto">
                Tell us about your care needs and we'll create a personalized plan that works for your family
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-12">
              {/* Enhanced Contact Form */}
              <Card className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 shadow-2xl">
                <CardHeader className="text-center">
                  <CardTitle className="text-3xl text-white mb-2">Get Started Today</CardTitle>
                  <CardDescription className="text-slate-300 text-lg">
                    Fill out this form and we'll contact you within 2 hours during business hours
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-6 p-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-emerald-300 mb-2 block">
                        Your Name *
                      </label>
                      <Input
                        placeholder="Enter your full name"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-emerald-400 focus:ring-emerald-400"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-emerald-300 mb-2 block">
                        Email Address *
                      </label>
                      <Input
                        type="email"
                        placeholder="your@email.com"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-emerald-400 focus:ring-emerald-400"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-emerald-300 mb-2 block">
                        Phone Number *
                      </label>
                      <Input
                        type="tel"
                        placeholder="(555) 123-4567"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-emerald-400 focus:ring-emerald-400"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-emerald-300 mb-2 block">
                        Zip Code
                      </label>
                      <Input
                        placeholder="23456"
                        value={formData.zipCode}
                        onChange={(e) => setFormData({...formData, zipCode: e.target.value})}
                        className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-emerald-400 focus:ring-emerald-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-emerald-300 mb-2 block">
                      Type of Care Needed
                    </label>
                    <select 
                      className="w-full p-3 bg-slate-700/50 border border-slate-600 rounded-md text-white focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400"
                      value={formData.careType}
                      onChange={(e) => setFormData({...formData, careType: e.target.value})}
                    >
                      <option value="">Select type of care</option>
                      <option value="personal-care">Personal Care</option>
                      <option value="companionship">Companionship</option>
                      <option value="household-support">Household Support</option>
                      <option value="specialized-care">Specialized Care (Memory Care)</option>
                      <option value="respite-care">Respite Care</option>
                      <option value="not-sure">Not Sure / Need Guidance</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-emerald-300 mb-2 block">
                      How Soon Do You Need Care?
                    </label>
                    <select 
                      className="w-full p-3 bg-slate-700/50 border border-slate-600 rounded-md text-white focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400"
                      value={formData.urgency}
                      onChange={(e) => setFormData({...formData, urgency: e.target.value})}
                    >
                      <option value="">Select timeframe</option>
                      <option value="immediate">Immediately (within 24 hours)</option>
                      <option value="within-week">Within a week</option>
                      <option value="within-month">Within a month</option>
                      <option value="planning-ahead">Planning ahead (2+ months)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-emerald-300 mb-2 block">
                      Preferred Contact Method
                    </label>
                    <div className="flex space-x-6">
                      <label className="flex items-center text-white">
                        <input
                          type="radio"
                          name="contact"
                          value="phone"
                          checked={formData.preferredContact === 'phone'}
                          onChange={(e) => setFormData({...formData, preferredContact: e.target.value})}
                          className="mr-2 text-emerald-500 focus:ring-emerald-400"
                        />
                        📞 Phone Call
                      </label>
                      <label className="flex items-center text-white">
                        <input
                          type="radio"
                          name="contact"
                          value="email"
                          checked={formData.preferredContact === 'email'}
                          onChange={(e) => setFormData({...formData, preferredContact: e.target.value})}
                          className="mr-2 text-emerald-500 focus:ring-emerald-400"
                        />
                        📧 Email
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-emerald-300 mb-2 block">
                      Tell Us About Your Care Needs
                    </label>
                    <Textarea
                      placeholder="Please describe the specific care needs, any health conditions, mobility requirements, or other important details we should know..."
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                      rows={4}
                      className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-emerald-400 focus:ring-emerald-400"
                    />
                  </div>

                  <Button 
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white py-4 text-lg font-semibold shadow-lg hover:shadow-emerald-500/50 transition-all duration-300 transform hover:scale-105"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 mr-2 animate-spin border-2 border-white border-t-transparent rounded-full" />
                        Sending Request...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5 mr-2" />
                        Request Free Consultation
                        <Sparkles className="w-4 h-4 ml-2 animate-pulse" />
                      </>
                    )}
                  </Button>

                  <div className="bg-emerald-500/10 border border-emerald-400/20 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <Shield className="w-5 h-5 text-emerald-400 mt-0.5" />
                      <div className="text-sm text-emerald-300">
                        <p className="font-medium mb-1">🔒 Your Privacy is Protected</p>
                        <p className="text-slate-300">All information is kept confidential and used only to provide you with care information. We never share your data with third parties.</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Response Times & Office Hours */}
              <div className="space-y-8">
                {/* Response Promises */}
                <Card className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 shadow-2xl">
                  <CardHeader>
                    <CardTitle className="text-2xl text-white flex items-center">
                      <Timer className="w-6 h-6 mr-3 text-emerald-400" />
                      What to Expect
                    </CardTitle>
                    <CardDescription className="text-slate-300">
                      Our commitment to timely, professional service
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="space-y-6">
                      {responsePromises.map((promise, index) => (
                        <div key={index} className="flex items-start space-x-4 group">
                          <div className="w-12 h-12 bg-gradient-to-r from-slate-700 to-slate-600 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                            <promise.icon className={`w-6 h-6 ${promise.color}`} />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-white mb-1 group-hover:text-emerald-300 transition-colors">
                              {promise.title}
                            </h4>
                            <p className="text-slate-400 text-sm">{promise.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Enhanced Office Hours */}
                <Card className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 shadow-2xl">
                  <CardHeader>
                    <CardTitle className="text-2xl text-white flex items-center">
                      <Clock className="w-6 h-6 mr-3 text-teal-400" />
                      Office Hours
                    </CardTitle>
                    <CardDescription className="text-slate-300">
                      When you can reach our team
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="space-y-3">
                      {officeHours.map((schedule, index) => (
                        <div key={index} className="flex justify-between items-center py-3 border-b border-slate-700/50 last:border-b-0 group hover:bg-slate-700/20 rounded-lg px-3 transition-all duration-300">
                          <div className="flex items-center space-x-3">
                            <schedule.icon className={`w-5 h-5 ${
                              schedule.status === 'open' ? 'text-green-400' :
                              schedule.status === 'limited' ? 'text-yellow-400' :
                              'text-red-400'
                            }`} />
                            <span className="font-medium text-white">{schedule.day}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-slate-300">{schedule.hours}</span>
                            <div className={`w-2 h-2 rounded-full ${
                              schedule.status === 'open' ? 'bg-green-400' :
                              schedule.status === 'limited' ? 'bg-yellow-400' :
                              'bg-red-400'
                            } animate-pulse`} />
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-6 bg-red-500/10 border border-red-400/20 rounded-lg p-4">
                      <div className="flex items-center space-x-2 text-red-300">
                        <AlertCircle className="w-5 h-5" />
                        <span className="font-medium">🚨 Emergency Care Available 24/7</span>
                      </div>
                      <p className="text-red-200 text-sm mt-1">
                        For urgent care needs outside business hours, call our emergency line immediately.
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Emergency Contact Card */}
                <Card className="bg-gradient-to-br from-red-900/50 to-orange-900/50 backdrop-blur-sm border border-red-500/30 shadow-2xl">
                  <CardHeader>
                    <CardTitle className="text-2xl text-red-300 flex items-center">
                      🚨 Emergency Care
                    </CardTitle>
                    <CardDescription className="text-red-200">
                      Need care immediately? We can arrange qualified caregivers within 24 hours for emergency situations.
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent>
                    <Button 
                      onClick={() => window.open('tel:+18508610959', '_self')}
                      className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold py-4 text-lg shadow-lg hover:shadow-red-500/50 transition-all duration-300 transform hover:scale-105"
                    >
                      <Phone className="w-5 h-5 mr-2 animate-pulse" />
                      Call Emergency Line Now
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Section */}
      <div className="relative z-10 py-12 border-t border-slate-700/50">
        <div className="container mx-auto px-6 text-center">
          <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-8">
            <div className="flex items-center space-x-2 text-slate-300">
              <CheckCircle className="w-5 h-5 text-emerald-400" />
              <span>Licensed & Insured</span>
            </div>
            <div className="flex items-center space-x-2 text-slate-300">
              <Award className="w-5 h-5 text-teal-400" />
              <span>Trusted by 500+ Families</span>
            </div>
            <div className="flex items-center space-x-2 text-slate-300">
              <Heart className="w-5 h-5 text-red-400" />
              <span>Compassionate Care Since 2020</span>
            </div>
          </div>
          
          <Separator className="my-8 bg-slate-700/50" />
          
          <p className="text-slate-400 text-sm">
            © 2024 Caring Compass Home Care. All rights reserved. | 
            <span className="text-emerald-300 mx-2">Hampton Roads, Virginia</span> | 
            <span className="text-teal-300 mx-2">Available 24/7 for Your Family</span>
          </p>
        </div>
      </div>
    </div>
  )
}

export default ContactPage