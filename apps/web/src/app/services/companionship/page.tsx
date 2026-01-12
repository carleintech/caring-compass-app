'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ConsultationModal } from '@/components/modals/consultation-modal'
import { 
  Heart, 
  Users, 
  BookOpen, 
  Coffee,
  Gamepad2,
  Car,
  Phone,
  MessageCircle,
  Music,
  Star,
  CheckCircle,
  ArrowRight,
  Camera,
  Calendar,
  MapPin,
  Clock,
  Shield,
  Award,
  Sparkles
} from 'lucide-react'

const CompanionshipPage = () => {
  const router = useRouter()
  const [selectedActivity, setSelectedActivity] = useState(null)
  const [isConsultationOpen, setIsConsultationOpen] = useState(false)

  const companionshipServices = [
    {
      title: "Engaging Conversation",
      description: "Meaningful dialogue, active listening, and emotional support to combat loneliness and isolation.",
      icon: MessageCircle,
      details: [
        "Active listening and empathetic responses",
        "Sharing stories and life experiences",
        "Discussing current events and interests",
        "Providing emotional support and encouragement",
        "Helping process feelings and concerns"
      ]
    },
    {
      title: "Social Activities",
      description: "Fun, engaging activities tailored to interests and abilities to maintain mental stimulation.",
      icon: Gamepad2,
      details: [
        "Board games, puzzles, and card games",
        "Arts and crafts projects",
        "Reading books or newspapers together",
        "Watching favorite movies or TV shows",
        "Listening to music and reminiscing"
      ]
    },
    {
      title: "Outings & Transportation",
      description: "Safe transportation and accompaniment to appointments, errands, and social activities.",
      icon: Car,
      details: [
        "Medical and therapy appointments",
        "Grocery shopping and errands",
        "Religious services and community events",
        "Social visits with friends and family",
        "Recreational outings and activities"
      ]
    },
    {
      title: "Hobby Support",
      description: "Assistance with maintaining lifelong hobbies and interests that bring joy and purpose.",
      icon: Camera,
      details: [
        "Gardening and plant care assistance",
        "Photography and scrapbooking",
        "Crafting and artistic projects",
        "Cooking and baking together",
        "Technology assistance for video calls"
      ]
    },
    {
      title: "Memory Stimulation",
      description: "Activities designed to engage memory and cognitive function through reminiscence and storytelling.",
      icon: BookOpen,
      details: [
        "Life story sharing and documentation",
        "Photo album review and organization",
        "Memory games and cognitive exercises",
        "Family history discussions",
        "Creating memory books and journals"
      ]
    },
    {
      title: "Meal Companionship",
      description: "Sharing meals and ensuring proper nutrition while providing social interaction during dining.",
      icon: Coffee,
      details: [
        "Preparing meals together",
        "Dining companionship and conversation",
        "Encouraging proper nutrition and hydration",
        "Special occasion meal preparation",
        "Restaurant outings and social dining"
      ]
    }
  ]

  const benefits = [
    {
      title: "Reduced Isolation",
      description: "Combat loneliness with regular, meaningful social interaction and emotional support.",
      icon: Heart
    },
    {
      title: "Mental Stimulation",
      description: "Keep the mind active and engaged through various activities and conversations.",
      icon: Sparkles
    },
    {
      title: "Emotional Wellbeing",
      description: "Provide emotional support, validation, and encouragement to improve overall mood.",
      icon: Users
    },
    {
      title: "Maintained Independence",
      description: "Support participation in community activities while preserving autonomy and dignity.",
      icon: Star
    }
  ]

  const activities = [
    { category: "Indoor Activities", items: ["Board games & puzzles", "Reading & storytelling", "Arts & crafts", "Music & singing", "Cooking together", "Movie watching"] },
    { category: "Outdoor Activities", items: ["Garden walks", "Bird watching", "Porch sitting", "Photography", "Outdoor dining", "Nature observation"] },
    { category: "Social Outings", items: ["Shopping trips", "Restaurant visits", "Community events", "Religious services", "Library visits", "Museum tours"] },
    { category: "Memory Activities", items: ["Photo albums", "Life stories", "Family history", "Scrapbooking", "Letter writing", "Memory games"] }
  ]

  const companionshipSchedule = [
    {
      duration: "2-4 Hours",
      description: "Perfect for social visits, light activities, and meal companionship",
      activities: ["Conversation", "Light activities", "Meal preparation", "Short outings"]
    },
    {
      duration: "4-8 Hours", 
      description: "Ideal for longer outings, multiple activities, and comprehensive companionship",
      activities: ["Extended outings", "Multiple activities", "Appointment accompaniment", "Social events"]
    },
    {
      duration: "Overnight",
      description: "Continuous companionship and peace of mind for families",
      activities: ["Evening activities", "Safety supervision", "Morning routines", "Emergency support"]
    }
  ]

  const testimonials = [
    {
      name: "Dorothy Williams",
      age: "82",
      location: "Virginia Beach, VA",
      text: "My companion Sarah has become like a daughter to me. We cook together, tend to my garden, and she listens to all my stories. I don't feel lonely anymore.",
      rating: 5
    },
    {
      name: "Family of Robert Johnson",
      location: "Norfolk, VA",
      text: "Dad was becoming isolated after Mom passed. His companion has brought back his smile. They play chess, watch old movies, and Dad looks forward to every visit.",
      rating: 5
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-teal-50" />
        
        <div className="relative container mx-auto px-4">
          <Button
            variant="outline"
            onClick={() => router.push('/')}
            className="mb-6 hover:bg-slate-100"
          >
            ← Back to Home
          </Button>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-6 bg-blue-100 text-blue-700 border-blue-200">
                <Users className="w-3 h-3 mr-1" />
                Meaningful Connections & Emotional Support
              </Badge>
              
              <h1 className="text-4xl lg:text-6xl font-bold text-slate-900 mb-6 leading-tight">
                Companionship
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-500"> Services </span>
              </h1>
              
              <p className="text-xl text-slate-600 mb-8 leading-relaxed">
                Combat loneliness and isolation with compassionate companionship services. Our trained companions provide meaningful social interaction, emotional support, and engaging activities to enhance quality of life.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-blue-600 to-teal-500 text-white px-8"
                  onClick={() => setIsConsultationOpen(true)}
                >
                  Start Companionship Services
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                
                <Button 
                  variant="outline" 
                  size="lg"
                  className="px-8 border-slate-300 hover:bg-slate-50"
                  onClick={() => window.location.href = 'tel:+17575552273'}
                >
                  <Phone className="mr-2 w-5 h-5" />
                  Call (757) 555-CARE
                </Button>
              </div>

              <div className="flex items-center space-x-6 text-sm text-slate-600">
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Licensed & Insured
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Background Checked
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Flexible Scheduling
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="bg-white rounded-2xl shadow-2xl p-8 border border-slate-200">
                <h3 className="text-2xl font-bold text-slate-900 mb-6">Companionship Benefits:</h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Heart className="w-5 h-5 text-red-500" />
                    <span className="text-slate-700">Reduces loneliness and depression</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Users className="w-5 h-5 text-blue-500" />
                    <span className="text-slate-700">Provides meaningful social interaction</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Sparkles className="w-5 h-5 text-purple-500" />
                    <span className="text-slate-700">Stimulates cognitive function</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Star className="w-5 h-5 text-yellow-500" />
                    <span className="text-slate-700">Improves overall quality of life</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Shield className="w-5 h-5 text-green-500" />
                    <span className="text-slate-700">Provides emotional support and safety</span>
                  </div>
                </div>

                <Separator className="my-6" />

                <div className="bg-gradient-to-r from-blue-50 to-teal-50 rounded-lg p-4">
                  <p className="text-sm text-slate-700 text-center">
                    <Clock className="w-4 h-4 inline mr-1 text-blue-600" />
                    Available 2-24 hours per day, 7 days a week
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
              Comprehensive Companionship Services
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Our companions are more than caregivers - they&apos;re friends who bring joy, conversation, and meaningful connection to your loved one&apos;s daily life.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {companionshipServices.map((service, index) => (
              <Card 
                key={index} 
                className={`group cursor-pointer transition-all duration-300 border-slate-200 hover:shadow-lg ${
                  selectedActivity === index ? 'ring-2 ring-blue-500 shadow-lg' : ''
                }`}
                onClick={() => setSelectedActivity(selectedActivity === index ? null : index)}
              >
                <CardHeader>
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-teal-100 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <service.icon className="w-8 h-8 text-blue-600" />
                  </div>
                  <CardTitle className="text-xl">{service.title}</CardTitle>
                  <p className="text-slate-600">{service.description}</p>
                </CardHeader>
                {selectedActivity === index && (
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

      {/* Activities Section */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Engaging Activities & Experiences
            </h2>
            <p className="text-xl text-slate-600">
              Every companion visit is tailored to your loved one&apos;s interests, hobbies, and preferences
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {activities.map((category, index) => (
              <Card key={index} className="border-slate-200 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg text-center text-slate-900">{category.category}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {category.items.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span className="text-slate-600 text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Schedule Options */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Flexible Companionship Scheduling
            </h2>
            <p className="text-xl text-slate-600">
              Choose the schedule that works best for your family&apos;s needs
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {companionshipSchedule.map((schedule, index) => (
              <Card key={index} className="border-slate-200 shadow-lg text-center">
                <CardHeader>
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Clock className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-2xl text-blue-600">{schedule.duration}</CardTitle>
                  <p className="text-slate-600">{schedule.description}</p>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {schedule.activities.map((activity, activityIndex) => (
                      <li key={activityIndex} className="flex items-center justify-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-slate-600 text-sm">{activity}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
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
              The Power of Companionship
            </h2>
            <p className="text-xl text-slate-600">
              Research shows that social connection is vital for physical and mental health
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

      {/* Companion Qualifications */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-slate-900 mb-6">
                Our Qualified Companions
              </h2>
              <p className="text-xl text-slate-600 mb-8">
                Every companion is carefully selected and trained to provide meaningful social interaction and emotional support.
              </p>

              <div className="space-y-4">
                {[
                  "Extensive background checks and reference verification",
                  "Training in active listening and empathetic communication",
                  "Understanding of age-related challenges and conditions",
                  "Certification in CPR and basic first aid",
                  "Experience working with seniors and understanding their needs",
                  "Ongoing training in activities and engagement techniques"
                ].map((qualification, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <Award className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
                    <span className="text-slate-700">{qualification}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-teal-50 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-slate-900 mb-6">Companion Matching Process:</h3>
              <div className="space-y-4">
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <h4 className="font-semibold text-slate-900 mb-2">1. Personal Assessment</h4>
                  <p className="text-sm text-slate-600">We learn about your loved one&apos;s interests, hobbies, and personality</p>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <h4 className="font-semibold text-slate-900 mb-2">2. Careful Matching</h4>
                  <p className="text-sm text-slate-600">We match companions based on shared interests and compatible personalities</p>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <h4 className="font-semibold text-slate-900 mb-2">3. Meet & Greet</h4>
                  <p className="text-sm text-slate-600">Introduction visit to ensure a good connection before services begin</p>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <h4 className="font-semibold text-slate-900 mb-2">4. Ongoing Support</h4>
                  <p className="text-sm text-slate-600">Regular check-ins to ensure the relationship continues to flourish</p>
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
              Stories of Connection
            </h2>
            <p className="text-xl text-slate-600">
              Real experiences from clients and families who&apos;ve discovered the joy of companionship
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
                    {testimonial.age && <div className="text-slate-600 text-sm">Age {testimonial.age}</div>}
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
              Bring Joy and Connection Back Into Your Loved One&apos;s Life
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Contact us today to learn how our companionship services can reduce isolation and bring back the joy of meaningful relationships.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-white text-blue-600 hover:bg-blue-50 px-8"
                onClick={() => window.location.href = 'tel:+17575552273'}
              >
                <Phone className="mr-2 w-5 h-5" />
                Call (757) 555-CARE
              </Button>
              
              <Button 
                variant="outline" 
                size="lg"
                className="px-8 border-white text-white hover:bg-white hover:text-blue-600"
                onClick={() => setIsConsultationOpen(true)}
              >
                Schedule Free Consultation
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      <ConsultationModal 
        isOpen={isConsultationOpen}
        onClose={() => setIsConsultationOpen(false)}
        serviceType="Companionship Services"
      />
    </div>
  )
}

export default CompanionshipPage