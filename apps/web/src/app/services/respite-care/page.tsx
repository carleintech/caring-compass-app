'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ConsultationModal } from '@/components/modals/consultation-modal'
import { 
  Coffee, 
  Clock, 
  Heart, 
  Users, 
  Calendar, 
  CheckCircle, 
  Phone,
  Mail,
  Star,
  Shield,
  RefreshCw,
  Battery,
  Sun,
  Moon,
  Plane,
  Briefcase
} from 'lucide-react'

export default function RespiteCarePage() {
  const [isConsultationOpen, setIsConsultationOpen] = useState(false)
  const respiteOptions = [
    {
      icon: <Clock className="h-8 w-8" />,
      title: "Hourly Respite Care",
      description: "Short-term relief for a few hours when you need a break",
      duration: "2-8 hours",
      ideal: "Errands, appointments, personal time",
      features: [
        "Minimum 2-hour blocks",
        "Same-day availability",
        "Flexible scheduling",
        "Trusted caregivers",
        "Activity engagement"
      ]
    },
    {
      icon: <Sun className="h-8 w-8" />,
      title: "Day Respite Care",
      description: "Full day care allowing family caregivers to work or rest",
      duration: "8-12 hours",
      ideal: "Work days, special events, rest days",
      features: [
        "Morning to evening care",
        "Meal preparation included",
        "Activity planning",
        "Medication reminders",
        "Regular updates to family"
      ]
    },
    {
      icon: <Moon className="h-8 w-8" />,
      title: "Overnight Respite",
      description: "Overnight care so family caregivers can get restful sleep",
      duration: "8-12 hours",
      ideal: "Restful sleep, emergency coverage",
      features: [
        "10 PM to 8 AM coverage",
        "Safety monitoring",
        "Night-time assistance",
        "Emergency response",
        "Peaceful environment"
      ]
    },
    {
      icon: <Plane className="h-8 w-8" />,
      title: "Extended Respite",
      description: "Multi-day care for vacations or extended breaks",
      duration: "2-14 days",
      ideal: "Vacations, business trips, recovery",
      features: [
        "Live-in or rotating care",
        "Comprehensive care plans",
        "Regular family updates",
        "Emergency contact protocols",
        "Medication management"
      ]
    }
  ]

  const benefits = [
    {
      icon: <Battery className="h-6 w-6 text-green-500" />,
      title: "Recharge & Refresh",
      description: "Time to rest, recharge, and attend to your own health and well-being"
    },
    {
      icon: <Heart className="h-6 w-6 text-red-500" />,
      title: "Maintain Relationships",
      description: "Preserve important relationships with spouse, friends, and other family"
    },
    {
      icon: <Briefcase className="h-6 w-6 text-blue-500" />,
      title: "Work & Personal Time",
      description: "Attend work obligations, appointments, or pursue personal interests"
    },
    {
      icon: <Shield className="h-6 w-6 text-purple-500" />,
      title: "Peace of Mind",
      description: "Know your loved one is safe and well-cared for in your absence"
    }
  ]

  const careActivities = [
    "Personal care assistance",
    "Medication reminders",
    "Meal preparation and feeding",
    "Light housekeeping",
    "Companionship and conversation",
    "Mobility assistance",
    "Safety supervision",
    "Engagement activities",
    "Transportation (if needed)",
    "Emergency response"
  ]

  const testimonials = [
    {
      name: "Susan Martinez",
      role: "Daughter & Primary Caregiver",
      location: "Virginia Beach, VA",
      rating: 5,
      text: "Respite care has been a lifesaver for our family. I was completely burned out caring for Mom with dementia. Now I can take a few hours each week to grocery shop and just breathe. Mom loves her caregiver Linda, and I feel so much more balanced."
    },
    {
      name: "Michael Thompson",
      role: "Spouse Caregiver",
      location: "Norfolk, VA", 
      rating: 5,
      text: "After my wife's stroke, I became her full-time caregiver. The overnight respite care allowed me to finally sleep through the night knowing she was safe. It saved our marriage and my sanity."
    }
  ]

  const signs = [
    "Feeling overwhelmed or exhausted constantly",
    "Difficulty sleeping or increased anxiety",
    "Neglecting your own health appointments",
    "Increased irritability or impatience",
    "Social isolation from friends and family",
    "Difficulty concentrating at work",
    "Physical symptoms of stress",
    "Feeling resentful about caregiving duties"
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center max-w-4xl mx-auto">
            <div className="flex justify-center mb-6">
              <div className="bg-white/20 p-4 rounded-full">
                <Coffee className="h-12 w-12" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Respite Care Services
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-green-100">
              Take a well-deserved break while your loved one receives quality care
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-green-600 hover:bg-green-50" onClick={() => window.location.href = 'tel:+17575552273'}>
                <Phone className="mr-2 h-5 w-5" />
                Call (757) 555-CARE
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10" onClick={() => setIsConsultationOpen(true)}>
                Schedule Respite Care
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16">
        {/* Introduction */}
        <div className="max-w-4xl mx-auto mb-16 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            You Deserve a Break Too
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            Being a family caregiver is one of the most challenging yet rewarding roles you can take on. 
            However, without proper support and breaks, caregiver burnout is real and can affect both 
            your health and your ability to provide care. Our respite care services give you the time 
            you need to rest, recharge, and maintain your own well-being while ensuring your loved one 
            receives professional, compassionate care.
          </p>
        </div>

        {/* Respite Options */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Flexible Respite Care Options
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {respiteOptions.map((option, index) => (
              <Card key={index} className="h-full hover:shadow-lg transition-all duration-300 border-0 shadow-md">
                <CardHeader className="text-center pb-4">
                  <div className="flex justify-center mb-4">
                    <div className="bg-gradient-to-r from-green-500 to-blue-500 text-white p-3 rounded-full">
                      {option.icon}
                    </div>
                  </div>
                  <CardTitle className="text-xl font-bold text-gray-900">
                    {option.title}
                  </CardTitle>
                  <CardDescription className="text-gray-600 mb-4">
                    {option.description}
                  </CardDescription>
                  <div className="flex justify-center gap-4 mb-4">
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      {option.duration}
                    </Badge>
                    <Badge variant="outline">
                      {option.ideal}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {option.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-1 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Benefits for Caregivers */}
        <div className="mb-16 bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Benefits of Respite Care for You
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="bg-white p-3 rounded-full shadow-md">
                    {benefit.icon}
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {benefit.title}
                </h3>
                <p className="text-gray-600 text-sm">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* What Our Respite Caregivers Provide */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            What Our Respite Caregivers Provide
          </h2>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-gray-600 mb-6">
                Our respite caregivers are experienced professionals who step seamlessly 
                into your caregiving routine. They provide the same level of compassionate 
                care your loved one is accustomed to, following their established routines 
                and preferences.
              </p>
              <div className="grid grid-cols-2 gap-3">
                {careActivities.map((activity, index) => (
                  <div key={index} className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                    <span className="text-sm text-gray-700">{activity}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-gradient-to-br from-green-100 to-blue-100 rounded-2xl p-8">
              <div className="text-center">
                <div className="bg-white p-4 rounded-full inline-block mb-4">
                  <RefreshCw className="h-12 w-12 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Seamless Care Transition
                </h3>
                <p className="text-gray-700 mb-6">
                  We take time to understand your loved one&apos;s routine, preferences, and 
                  needs before your respite period begins, ensuring a smooth transition 
                  and consistent care.
                </p>
                <Button className="bg-gradient-to-r from-green-500 to-blue-500 text-white">
                  Schedule Care Planning
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Signs You Need Respite Care */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Signs You May Need Respite Care
          </h2>
          <div className="max-w-4xl mx-auto">
            <p className="text-center text-gray-600 mb-8">
              Recognizing caregiver burnout is important for both your health and your ability to provide care. 
              Consider respite care if you&apos;re experiencing any of these signs:
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              {signs.map((sign, index) => (
                <div key={index} className="flex items-start bg-white p-4 rounded-lg shadow-sm">
                  <div className="bg-orange-100 p-2 rounded-full mr-3 mt-1">
                    <Heart className="h-4 w-4 text-orange-600" />
                  </div>
                  <p className="text-gray-700 text-sm">{sign}</p>
                </div>
              ))}
            </div>
            <div className="text-center mt-8">
              <p className="text-gray-600 mb-4">
                If you&apos;re experiencing several of these signs, it&apos;s time to consider respite care.
              </p>
              <Button className="bg-gradient-to-r from-green-500 to-blue-500 text-white">
                Get Help Today
              </Button>
            </div>
          </div>
        </div>

        {/* How to Schedule */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            How to Schedule Respite Care
          </h2>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                step: "1",
                title: "Contact Us",
                description: "Call us to discuss your respite care needs and schedule preferences"
              },
              {
                step: "2",
                title: "Care Assessment",
                description: "We'll assess your loved one's needs and create a care plan"
              },
              {
                step: "3",
                title: "Caregiver Match",
                description: "We'll match you with the perfect respite caregiver"
              },
              {
                step: "4",
                title: "Enjoy Your Break",
                description: "Relax knowing your loved one is in capable, caring hands"
              }
            ].map((step, index) => (
              <div key={index} className="text-center">
                <div className="bg-gradient-to-r from-green-500 to-blue-500 text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  {step.step}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-gray-600 text-sm">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonials */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            What Family Caregivers Say
          </h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      {testimonial.role}
                    </Badge>
                  </div>
                  <p className="text-gray-700 mb-4 italic">
                    &quot;{testimonial.text}&quot;
                  </p>
                  <div className="flex items-center">
                    <div className="bg-gradient-to-r from-green-500 to-blue-500 text-white w-10 h-10 rounded-full flex items-center justify-center font-semibold mr-3">
                      {testimonial.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{testimonial.name}</p>
                      <p className="text-sm text-gray-600">{testimonial.location}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Emergency Respite */}
        <div className="mb-16 bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl p-8">
          <div className="text-center">
            <div className="bg-red-100 p-4 rounded-full inline-block mb-4">
              <Phone className="h-8 w-8 text-red-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Need Emergency Respite Care?
            </h2>
            <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
              Sometimes urgent situations arise. We offer emergency respite care with 
              as little as 2 hours notice, 24/7. Don&apos;t hesitate to reach out when you need help.
            </p>
            <Button size="lg" className="bg-red-600 hover:bg-red-700 text-white">
              <Phone className="mr-2 h-5 w-5" />
              Call Emergency Line: (757) 555-HELP
            </Button>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-2xl p-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Take the Break You Deserve
          </h2>
          <p className="text-xl mb-8 text-green-100">
            Professional respite care that gives you peace of mind
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <Button size="lg" className="bg-white text-green-600 hover:bg-green-50 flex-1" onClick={() => window.location.href = 'tel:+17575552273'}>
              <Phone className="mr-2 h-5 w-5" />
              Call Now
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 flex-1" onClick={() => setIsConsultationOpen(true)}>
              <Calendar className="mr-2 h-5 w-5" />
              Schedule Care
            </Button>
          </div>
          <p className="text-green-100 mt-4 text-sm">
            Same-day availability • Emergency care • Licensed & insured
          </p>
        </div>
      </div>
      <ConsultationModal isOpen={isConsultationOpen} onClose={() => setIsConsultationOpen(false)} />
    </div>
  )
}