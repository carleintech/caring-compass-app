'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  Heart, 
  Shield, 
  Clock, 
  Users, 
  Star,
  CheckCircle,
  ArrowRight,
  Phone,
  Bath,
  Shirt,
  Utensils,
  AlertCircle,
  Timer,
  Home,
  Award,
  UserCheck
} from 'lucide-react'

const PersonalCarePage = () => {
  const [selectedService, setSelectedService] = useState(null)

  const personalCareServices = [
    {
      title: "Bathing & Hygiene Assistance",
      description: "Gentle, respectful assistance with bathing, showering, and personal hygiene to maintain dignity and cleanliness.",
      icon: Bath,
      details: [
        "Safe transfer in and out of tub/shower",
        "Assistance with washing and shampooing",
        "Help with dental care and oral hygiene",
        "Nail care and grooming assistance",
        "Respectful assistance maintaining privacy"
      ]
    },
    {
      title: "Dressing & Grooming",
      description: "Compassionate help with selecting appropriate clothing and maintaining personal appearance.",
      icon: Shirt,
      details: [
        "Assistance choosing weather-appropriate clothing",
        "Help with dressing and undressing",
        "Hair care and styling assistance",
        "Shaving assistance for men",
        "Makeup application if desired"
      ]
    },
    {
      title: "Mobility & Transfer Assistance",
      description: "Safe support for moving around the home and transferring between furniture, wheelchair, or bed.",
      icon: UserCheck,
      details: [
        "Safe transfers from bed to chair",
        "Assistance with walking and balance",
        "Help using mobility aids properly",
        "Support getting in and out of vehicles",
        "Fall prevention strategies"
      ]
    },
    {
      title: "Toileting & Incontinence Care",
      description: "Respectful assistance with bathroom needs while preserving dignity and promoting independence.",
      icon: Home,
      details: [
        "Assistance getting to and from bathroom",
        "Help with clothing management",
        "Incontinence care and cleanup",
        "Monitoring for urinary tract infections",
        "Maintaining skin integrity and comfort"
      ]
    },
    {
      title: "Medication Reminders",
      description: "Gentle reminders to take medications on schedule (no administration - reminders only).",
      icon: Timer,
      details: [
        "Verbal reminders for medication times",
        "Help organizing pill organizers",
        "Monitoring for medication side effects",
        "Communication with family about concerns",
        "Documentation of reminder times"
      ]
    },
    {
      title: "Feeding Assistance",
      description: "Support with eating and drinking to ensure proper nutrition and hydration.",
      icon: Utensils,
      details: [
        "Assistance with eating meals",
        "Help with drinking fluids",
        "Monitoring nutritional intake",
        "Assistance with special diets",
        "Encouraging proper hydration"
      ]
    }
  ]

  const benefits = [
    {
      title: "Maintains Dignity",
      description: "Our caregivers are trained to provide assistance while preserving your loved one's dignity and self-respect.",
      icon: Heart
    },
    {
      title: "Promotes Independence", 
      description: "We encourage self-care to the extent possible, helping maintain independence and confidence.",
      icon: Star
    },
    {
      title: "Safety First",
      description: "All personal care is provided with safety as the top priority, preventing falls and injuries.",
      icon: Shield
    },
    {
      title: "Family Peace of Mind",
      description: "Regular updates keep families informed about their loved one's personal care needs and progress.",
      icon: Users
    }
  ]

  const caregiverQualifications = [
    "Certified Nursing Assistants (CNAs) or Personal Care Aides (PCAs)",
    "Minimum 2 years experience in senior care",
    "Comprehensive background checks and drug screening",
    "40 hours of specialized training in personal care techniques",
    "CPR and First Aid certification",
    "Ongoing training in dignity-preserving care methods"
  ]

  const testimonials = [
    {
      name: "Margaret Johnson",
      location: "Virginia Beach, VA",
      text: "The personal care assistance has been a blessing. My mother maintains her dignity while getting the help she needs with bathing and dressing. The caregivers are so gentle and patient.",
      rating: 5
    },
    {
      name: "Robert Chen",
      location: "Norfolk, VA", 
      text: "After my father's stroke, he needed help with personal care. The Caring Compass team helped him regain confidence while ensuring his safety. Truly professional and compassionate.",
      rating: 5
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-teal-50" />
        
        <div className="relative container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-6 bg-blue-100 text-blue-700 border-blue-200">
                <Heart className="w-3 h-3 mr-1" />
                Dignity-Preserving Personal Care
              </Badge>
              
              <h1 className="text-4xl lg:text-6xl font-bold text-slate-900 mb-6 leading-tight">
                Personal Care
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-500"> Services </span>
              </h1>
              
              <p className="text-xl text-slate-600 mb-8 leading-relaxed">
                Compassionate assistance with daily personal care activities, designed to maintain dignity, promote independence, and ensure safety in the comfort of your own home.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-blue-600 to-teal-500 text-white px-8"
                >
                  Start Care Today
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                
                <Button 
                  variant="outline" 
                  size="lg"
                  className="px-8 border-slate-300 hover:bg-slate-50"
                >
                  <Phone className="mr-2 w-5 h-5" />
                  Call (850) 861-0959
                </Button>
              </div>

              <div className="flex items-center space-x-6 text-sm text-slate-600">
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Licensed & Insured
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Trained CNAs & PCAs
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Available 24/7
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="bg-white rounded-2xl shadow-2xl p-8 border border-slate-200">
                <h3 className="text-2xl font-bold text-slate-900 mb-6">Personal Care Includes:</h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-slate-700">Bathing and hygiene assistance</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-slate-700">Dressing and grooming support</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-slate-700">Mobility and transfer assistance</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-slate-700">Toileting and incontinence care</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-slate-700">Medication reminders</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-slate-700">Feeding assistance</span>
                  </div>
                </div>

                <Separator className="my-6" />

                <div className="bg-gradient-to-r from-blue-50 to-teal-50 rounded-lg p-4">
                  <p className="text-sm text-slate-700 text-center">
                    <AlertCircle className="w-4 h-4 inline mr-1 text-blue-600" />
                    All care provided with dignity, respect, and professional expertise
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Comprehensive Personal Care Services
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Our trained caregivers provide gentle, respectful assistance with all aspects of personal care, helping your loved one maintain their dignity and independence.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {personalCareServices.map((service, index) => (
              <Card 
                key={index} 
                className={`group cursor-pointer transition-all duration-300 border-slate-200 hover:shadow-lg ${
                  selectedService === index ? 'ring-2 ring-blue-500 shadow-lg' : ''
                }`}
                onClick={() => setSelectedService(selectedService === index ? null : index)}
              >
                <CardHeader>
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-teal-100 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <service.icon className="w-8 h-8 text-blue-600" />
                  </div>
                  <CardTitle className="text-xl">{service.title}</CardTitle>
                  <p className="text-slate-600">{service.description}</p>
                </CardHeader>
                {selectedService === index && (
                  <CardContent>
                    <Separator className="mb-4" />
                    <h4 className="font-semibold text-slate-900 mb-3">This service includes:</h4>
                    <ul className="space-y-2">
                      {service.details.map((detail, detailIndex) => (
                        <li key={detailIndex} className="flex items-start space-x-2">
                          <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-slate-600">{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Why Choose Our Personal Care Services?
            </h2>
            <p className="text-xl text-slate-600">
              We understand that personal care is intimate and requires the highest level of trust and professionalism.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <Card key={index} className="border-slate-200 shadow-lg text-center">
                <CardHeader>
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <benefit.icon className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-xl">{benefit.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Caregiver Qualifications */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-slate-900 mb-6">
                Our Qualified Caregivers
              </h2>
              <p className="text-xl text-slate-600 mb-8">
                Every caregiver providing personal care services is thoroughly vetted, trained, and committed to treating your loved one with the utmost respect and dignity.
              </p>

              <div className="space-y-4">
                {caregiverQualifications.map((qualification, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <Award className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
                    <span className="text-slate-700">{qualification}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-teal-50 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-slate-900 mb-6">Personal Care Training Includes:</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <h4 className="font-semibold text-slate-900 mb-2">Safety Protocols</h4>
                  <p className="text-sm text-slate-600">Proper transfer techniques, fall prevention, and infection control</p>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <h4 className="font-semibold text-slate-900 mb-2">Dignity Preservation</h4>
                  <p className="text-sm text-slate-600">Respectful communication and privacy protection techniques</p>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <h4 className="font-semibold text-slate-900 mb-2">Health Monitoring</h4>
                  <p className="text-sm text-slate-600">Recognizing changes in condition and proper reporting</p>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <h4 className="font-semibold text-slate-900 mb-2">Family Communication</h4>
                  <p className="text-sm text-slate-600">Regular updates and collaborative care planning</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              What Families Are Saying
            </h2>
            <p className="text-xl text-slate-600">
              Real experiences from families who&apos;ve chosen our personal care services
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-slate-200 shadow-lg">
                <CardHeader>
                  <div className="flex justify-center mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                </CardHeader>
                <CardContent>
                  <blockquote className="text-slate-700 mb-4 italic">
                    &quot;{testimonial.text}&quot;
                  </blockquote>
                  <div className="text-center">
                    <div className="font-semibold text-slate-900">{testimonial.name}</div>
                    <div className="text-slate-600 text-sm">{testimonial.location}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-teal-500">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h2 className="text-4xl font-bold mb-6">
              Ready to Start Personal Care Services?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Contact us today for a free consultation and personalized care assessment. We&apos;re here to help your loved one maintain their dignity and independence.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-white text-blue-600 hover:bg-blue-50 px-8"
              >
                <Phone className="mr-2 w-5 h-5" />
                Call (850) 861-0959
              </Button>
              
              <Button 
                variant="outline" 
                size="lg"
                className="px-8 border-white text-white hover:bg-white hover:text-blue-600"
              >
                Request Free Consultation
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default PersonalCarePage