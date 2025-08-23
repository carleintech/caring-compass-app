'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
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
  Compass
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

  const handleSubmit = () => {
    // Basic validation
    if (!formData.name || !formData.email || !formData.phone) {
      alert('Please fill in all required fields.')
      return
    }
    
    alert('Thank you! We\'ll contact you within 2 hours to discuss your care needs.')
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
  }

  const contactMethods = [
    {
      icon: Phone,
      title: "Call Us 24/7",
      primary: "(850) 861-0959",
      secondary: "Available around the clock for emergencies",
      action: "tel:+18508610959",
      buttonText: "Call Now"
    },
    {
      icon: Mail,
      title: "Email Us",
      primary: "admin@caringcompasshomecare.com",
      secondary: "We respond within 4 hours during business days",
      action: "mailto:admin@caringcompasshomecare.com",
      buttonText: "Send Email"
    },
    {
      icon: MapPin,
      title: "Service Areas",
      primary: "Hampton Roads, Virginia",
      secondary: "Virginia Beach, Norfolk, Newport News, Portsmouth, Chesapeake, Suffolk",
      action: null,
      buttonText: "View Coverage"
    }
  ]

  const officeHours = [
    { day: "Monday - Friday", hours: "8:00 AM - 6:00 PM" },
    { day: "Saturday", hours: "9:00 AM - 3:00 PM" },
    { day: "Sunday", hours: "Emergency calls only" },
    { day: "Holidays", hours: "Emergency calls only" }
  ]

  const responsePromises = [
    {
      icon: Clock,
      title: "Quick Response",
      description: "We respond to all inquiries within 2 hours during business hours"
    },
    {
      icon: Users,
      title: "Personal Consultation",
      description: "Every family receives a personalized consultation with our care coordinator"
    },
    {
      icon: Shield,
      title: "No Obligation",
      description: "Free consultation with no pressure or commitment required"
    },
    {
      icon: Heart,
      title: "Compassionate Care",
      description: "We understand this is an important decision for your family"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-teal-50" />
        
        <div className="relative container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <Badge className="mb-6 bg-blue-100 text-blue-700 border-blue-200">
              <Compass className="w-3 h-3 mr-1" />
              Available 24/7 for Your Family
            </Badge>
            
            <h1 className="text-4xl lg:text-6xl font-bold text-slate-900 mb-6 leading-tight">
              Contact 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-500"> Caring Compass </span>
            </h1>
            
            <p className="text-xl text-slate-600 mb-8 leading-relaxed">
              Ready to learn more about our home care services? We&apos;re here to answer your questions and help you find the perfect care solution for your loved one.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-blue-600 to-teal-500 text-white px-8"
                onClick={() => window.location.href = 'tel:+18508610959'}
              >
                <Phone className="mr-2 w-5 h-5" />
                Call (850) 861-0959
              </Button>
              
              <Button 
                variant="outline" 
                size="lg"
                className="px-8 border-slate-300 hover:bg-slate-50"
                onClick={() => document.getElementById('contact-form').scrollIntoView({ behavior: 'smooth' })}
              >
                <MessageCircle className="mr-2 w-5 h-5" />
                Send Message
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Multiple Ways to Reach Us
            </h2>
            <p className="text-xl text-slate-600">
              Choose the contact method that works best for you
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {contactMethods.map((method, index) => (
              <Card key={index} className="border-slate-200 shadow-lg hover:shadow-xl transition-shadow text-center">
                <CardHeader>
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-teal-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <method.icon className="w-8 h-8 text-blue-600" />
                  </div>
                  <CardTitle className="text-xl text-slate-900">{method.title}</CardTitle>
                  <p className="text-lg font-semibold text-blue-600">{method.primary}</p>
                  <p className="text-sm text-slate-600">{method.secondary}</p>
                </CardHeader>
                <CardContent>
                  {method.action && (
                    <Button 
                      className="w-full"
                      onClick={() => window.location.href = method.action}
                    >
                      {method.buttonText}
                    </Button>
                  )}
                  {!method.action && (
                    <Button className="w-full" variant="outline">
                      {method.buttonText}
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section id="contact-form" className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-slate-900 mb-4">
                Request Your Free Consultation
              </h2>
              <p className="text-xl text-slate-600">
                Tell us about your care needs and we&apos;ll create a personalized plan
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-12">
              {/* Contact Form */}
              <Card className="border-slate-200 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-2xl">Get Started Today</CardTitle>
                  <p className="text-slate-600">
                    Fill out this form and we&apos;ll contact you within 2 hours
                  </p>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-slate-700 mb-2 block">
                        Your Name *
                      </label>
                      <Input
                        placeholder="Enter your full name"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        required
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-700 mb-2 block">
                        Email Address *
                      </label>
                      <Input
                        type="email"
                        placeholder="your@email.com"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-slate-700 mb-2 block">
                        Phone Number *
                      </label>
                      <Input
                        type="tel"
                        placeholder="(555) 123-4567"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        required
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-700 mb-2 block">
                        Zip Code
                      </label>
                      <Input
                        placeholder="23456"
                        value={formData.zipCode}
                        onChange={(e) => setFormData({...formData, zipCode: e.target.value})}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-slate-700 mb-2 block">
                      Type of Care Needed
                    </label>
                    <select 
                      className="w-full p-3 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                    <label className="text-sm font-medium text-slate-700 mb-2 block">
                      How Soon Do You Need Care?
                    </label>
                    <select 
                      className="w-full p-3 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                    <label className="text-sm font-medium text-slate-700 mb-2 block">
                      Preferred Contact Method
                    </label>
                    <div className="flex space-x-4">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="contact"
                          value="phone"
                          checked={formData.preferredContact === 'phone'}
                          onChange={(e) => setFormData({...formData, preferredContact: e.target.value})}
                          className="mr-2"
                        />
                        Phone Call
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="contact"
                          value="email"
                          checked={formData.preferredContact === 'email'}
                          onChange={(e) => setFormData({...formData, preferredContact: e.target.value})}
                          className="mr-2"
                        />
                        Email
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-slate-700 mb-2 block">
                      Tell Us About Your Care Needs
                    </label>
                    <Textarea
                      placeholder="Please describe the specific care needs, any health conditions, mobility requirements, or other important details we should know..."
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                      rows={4}
                    />
                  </div>

                  <Button 
                    onClick={handleSubmit}
                    className="w-full bg-gradient-to-r from-blue-600 to-teal-500 text-white"
                    size="lg"
                  >
                    <Send className="mr-2 w-5 h-5" />
                    Request Free Consultation
                  </Button>

                  <div className="bg-blue-50 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                      <div className="text-sm text-blue-800">
                        <p className="font-medium mb-1">Your Privacy is Protected</p>
                        <p>All information is kept confidential and used only to provide you with care information. We never share your data with third parties.</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Additional Information */}
              <div className="space-y-8">
                {/* What to Expect */}
                <Card className="border-slate-200 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-2xl">What to Expect</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {responsePromises.map((promise, index) => (
                        <div key={index} className="flex items-start space-x-4">
                          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                            <promise.icon className="w-6 h-6 text-blue-600" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-slate-900 mb-1">{promise.title}</h4>
                            <p className="text-slate-600 text-sm">{promise.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Office Hours */}
                <Card className="border-slate-200 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-2xl flex items-center">
                      <Clock className="w-6 h-6 mr-2 text-blue-600" />
                      Office Hours
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {officeHours.map((schedule, index) => (
                        <div key={index} className="flex justify-between items-center py-2 border-b border-slate-100 last:border-b-0">
                          <span className="font-medium text-slate-900">{schedule.day}</span>
                          <span className="text-slate-600">{schedule.hours}</span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-6 bg-red-50 rounded-lg p-4">
                      <div className="flex items-center space-x-2 text-red-800">
                        <AlertCircle className="w-5 h-5" />
                        <span className="font-medium">Emergency Care Available 24/7</span>
                      </div>
                      <p className="text-red-700 text-sm mt-1">
                        For urgent care needs outside business hours, call our emergency line.
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Emergency Contact */}
                <Card className="bg-gradient-to-br from-red-50 to-orange-50 border-red-200">
                  <CardHeader>
                    <CardTitle className="text-2xl text-red-800">Emergency Care</CardTitle>
                    <p className="text-red-700">
                      Need care immediately? We can arrange qualified caregivers within 24 hours for emergency situations.
                    </p>
                  </CardHeader>
                  <CardContent>
                    <Button 
                      className="w-full bg-red-600 hover:bg-red-700 text-white"
                      size="lg"
                      onClick={() => window.location.href = 'tel:+18508610959'}
                    >
                      <Phone className="mr-2 w-5 h-5" />
                      Call Emergency Line Now
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Service Areas Map */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Service Areas in Hampton Roads
            </h2>
            <p className="text-xl text-slate-600">
              We proudly serve families throughout the Hampton Roads region
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { city: "Virginia Beach", description: "Complete coverage including Oceanfront, Town Center, and all residential areas" },
              { city: "Norfolk", description: "Including Ghent, Larchmont, and all surrounding neighborhoods" },
              { city: "Newport News", description: "Full city coverage including Denbigh and City Center areas" },
              { city: "Portsmouth", description: "Comprehensive service throughout all Portsmouth districts" },
              { city: "Chesapeake", description: "Including Great Bridge, Western Branch, and all suburban areas" },
              { city: "Suffolk", description: "Rural and suburban areas with flexible scheduling options" }
            ].map((area, index) => (
              <Card key={index} className="border-slate-200 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-xl flex items-center">
                    <MapPin className="w-5 h-5 mr-2 text-blue-600" />
                    {area.city}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 text-sm">{area.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default ContactPage