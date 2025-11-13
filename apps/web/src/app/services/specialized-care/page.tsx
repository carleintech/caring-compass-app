'use client'

import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  Brain, 
  Heart, 
  Activity, 
  CheckCircle, 
  Clock, 
  Users, 
  Phone,
  Mail,
  Star,
  Shield,
  Award,
  Stethoscope,
  AlertCircle,
  Eye
} from 'lucide-react'

export default function SpecializedCarePage() {
  const specializedServices = [
    {
      icon: <Brain className="h-8 w-8" />,
      title: "Dementia & Alzheimer's Care",
      description: "Compassionate, specialized care for memory-related conditions",
      details: [
        "Memory stimulation activities",
        "Routine establishment and maintenance",
        "Behavioral management techniques",
        "Family education and support",
        "Safety monitoring and fall prevention"
      ],
      badge: "Most Popular"
    },
    {
      icon: <Heart className="h-8 w-8" />,
      title: "Post-Hospital Recovery",
      description: "Transitional care to ensure safe recovery at home",
      details: [
        "Medication management reminders",
        "Wound care assistance",
        "Physical therapy support",
        "Follow-up appointment coordination",
        "Diet and nutrition monitoring"
      ]
    },
    {
      icon: <Heart className="h-8 w-8" />,
      title: "Chronic Condition Management",
      description: "Ongoing support for diabetes, heart disease, and other conditions",
      details: [
        "Vital signs monitoring",
        "Medication adherence support",
        "Symptom tracking and reporting",
        "Lifestyle modification assistance",
        "Emergency response protocols"
      ]
    },
    {
      icon: <Stethoscope className="h-8 w-8" />,
      title: "Palliative & End-of-Life Care",
      description: "Comfort-focused care with dignity and compassion",
      details: [
        "Pain and symptom management support",
        "Emotional and spiritual comfort",
        "Family support and guidance",
        "Coordination with hospice services",
        "24/7 on-call availability"
      ]
    },
    {
      icon: <Eye className="h-8 w-8" />,
      title: "Vision & Mobility Impairment",
      description: "Specialized assistance for clients with sensory or mobility challenges",
      details: [
        "Mobility assistance and transfers",
        "Fall prevention strategies",
        "Environmental safety modifications",
        "Assistive device support",
        "Independence skill development"
      ]
    },
    {
      icon: <Activity className="h-8 w-8" />,
      title: "Rehabilitation Support",
      description: "Assistance with recovery and rehabilitation goals",
      details: [
        "Exercise program support",
        "Physical therapy reinforcement",
        "Occupational therapy assistance",
        "Speech therapy practice",
        "Progress tracking and reporting"
      ]
    }
  ]

  const careApproach = [
    {
      icon: <Users className="h-6 w-6 text-blue-500" />,
      title: "Individualized Care Plans",
      description: "Every care plan is tailored to the specific condition and personal preferences"
    },
    {
      icon: <Award className="h-6 w-6 text-green-500" />,
      title: "Specialized Training",
      description: "Our caregivers receive specialized training for each condition we serve"
    },
    {
      icon: <Shield className="h-6 w-6 text-purple-500" />,
      title: "Safety Protocols",
      description: "Enhanced safety measures and emergency response procedures"
    },
    {
      icon: <Heart className="h-6 w-6 text-red-500" />,
      title: "Family Involvement",
      description: "Regular communication and education for family members"
    }
  ]

  const conditions = [
    "Alzheimer's Disease",
    "Dementia",
    "Parkinson's Disease",
    "Stroke Recovery",
    "Diabetes Management",
    "Heart Disease",
    "COPD",
    "Cancer Care Support",
    "Multiple Sclerosis",
    "Arthritis",
    "Vision Impairment",
    "Mobility Disorders"
  ]

  const testimonials = [
    {
      name: "Patricia Williams",
      condition: "Alzheimer's Care",
      location: "Chesapeake, VA",
      rating: 5,
      text: "Caring Compass has been a blessing for our family. Their specialized Alzheimer's care has allowed my mother to remain at home with dignity. The caregiver understands her needs perfectly and has become like family to us."
    },
    {
      name: "James Rodriguez",
      condition: "Post-Stroke Recovery",
      location: "Newport News, VA",
      rating: 5,
      text: "After my stroke, I thought I'd never be independent again. The specialized care team helped me with my rehabilitation exercises and daily activities. I'm now more confident and mobile than I thought possible."
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center max-w-4xl mx-auto">
            <div className="flex justify-center mb-6">
              <div className="bg-white/20 p-4 rounded-full">
                <Brain className="h-12 w-12" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Specialized Care Services
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-purple-100">
              Expert care for complex medical conditions and special needs
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-purple-600 hover:bg-purple-50">
                <Phone className="mr-2 h-5 w-5" />
                Call (757) 555-CARE
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                Discuss Your Needs
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
            Specialized Care for Unique Needs
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            When facing complex medical conditions or special circumstances, you need more than 
            basic care. Our specialized care services provide expert, compassionate support 
            tailored to specific conditions and recovery needs. Our highly trained caregivers 
            understand the unique challenges you face and are equipped to provide the specialized 
            attention required for optimal care and comfort.
          </p>
        </div>

        {/* Services Grid */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Our Specialized Care Services
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {specializedServices.map((service, index) => (
              <Card key={index} className="h-full hover:shadow-lg transition-all duration-300 border-0 shadow-md relative">
                {service.badge && (
                  <Badge className="absolute -top-2 -right-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white">
                    {service.badge}
                  </Badge>
                )}
                <CardHeader className="text-center pb-4">
                  <div className="flex justify-center mb-4">
                    <div className="bg-gradient-to-r from-purple-500 to-blue-500 text-white p-3 rounded-full">
                      {service.icon}
                    </div>
                  </div>
                  <CardTitle className="text-xl font-bold text-gray-900">
                    {service.title}
                  </CardTitle>
                  <CardDescription className="text-gray-600">
                    {service.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {service.details.map((detail, idx) => (
                      <li key={idx} className="flex items-start">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-1 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{detail}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Conditions We Serve */}
        <div className="mb-16 bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
            Conditions We Specialize In
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {conditions.map((condition, index) => (
              <div key={index} className="bg-white rounded-lg p-4 text-center shadow-sm">
                <div className="flex justify-center mb-2">
                  <AlertCircle className="h-5 w-5 text-purple-500" />
                </div>
                <p className="text-sm font-medium text-gray-800">{condition}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Care Approach */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Our Specialized Care Approach
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {careApproach.map((approach, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="bg-white p-3 rounded-full shadow-md">
                    {approach.icon}
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {approach.title}
                </h3>
                <p className="text-gray-600 text-sm">
                  {approach.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Why Choose Our Specialized Care */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Why Choose Our Specialized Care?
          </h2>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="bg-gradient-to-r from-purple-500 to-blue-500 text-white p-2 rounded-full mr-4 mt-1">
                    <CheckCircle className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Expert Training & Certification
                    </h3>
                    <p className="text-gray-600">
                      Our caregivers receive specialized training for each condition we serve, 
                      including ongoing education and certification maintenance.
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-gradient-to-r from-purple-500 to-blue-500 text-white p-2 rounded-full mr-4 mt-1">
                    <CheckCircle className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      24/7 Support & Monitoring
                    </h3>
                    <p className="text-gray-600">
                      Round-the-clock support with emergency protocols and immediate 
                      response capabilities for urgent situations.
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-gradient-to-r from-purple-500 to-blue-500 text-white p-2 rounded-full mr-4 mt-1">
                    <CheckCircle className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Collaborative Care Team
                    </h3>
                    <p className="text-gray-600">
                      We work closely with your healthcare providers, therapists, 
                      and family members to ensure coordinated care.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-purple-100 to-blue-100 rounded-2xl p-8">
              <div className="text-center">
                <div className="bg-white p-4 rounded-full inline-block mb-4">
                  <Heart className="h-12 w-12 text-purple-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Compassionate Expertise
                </h3>
                <p className="text-gray-700 mb-6">
                  Our specialized care combines medical knowledge with genuine compassion, 
                  ensuring your loved one receives not just expert care, but also the 
                  emotional support they need.
                </p>
                <Button className="bg-gradient-to-r from-purple-500 to-blue-500 text-white">
                  Learn More About Our Approach
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Testimonials */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Success Stories from Our Specialized Care
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
                    <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                      {testimonial.condition}
                    </Badge>
                  </div>
                  <p className="text-gray-700 mb-4 italic">
                    &quot;{testimonial.text}&quot;
                  </p>
                  <div className="flex items-center">
                    <div className="bg-gradient-to-r from-purple-500 to-blue-500 text-white w-10 h-10 rounded-full flex items-center justify-center font-semibold mr-3">
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

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-2xl p-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Get Specialized Care Today
          </h2>
          <p className="text-xl mb-8 text-purple-100">
            Expert care tailored to your specific condition and needs
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <Button size="lg" className="bg-white text-purple-600 hover:bg-purple-50 flex-1">
              <Phone className="mr-2 h-5 w-5" />
              Call Now
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 flex-1">
              <Mail className="mr-2 h-5 w-5" />
              Get Assessment
            </Button>
          </div>
          <p className="text-purple-100 mt-4 text-sm">
            Free specialized assessment • Licensed & insured • Available 24/7
          </p>
        </div>
      </div>
    </div>
  )
}