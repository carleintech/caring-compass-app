'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ConsultationModal } from '@/components/modals/consultation-modal'
import { 
  Home, 
  Utensils, 
  ShoppingCart, 
  Shirt, 
  Car, 
  CheckCircle, 
  Clock, 
  Users, 
  Phone,
  Mail,
  Star,
  Heart,
  Shield,
  Award
} from 'lucide-react'

export default function HouseholdSupportPage() {
  const router = useRouter()
  const [isConsultationOpen, setIsConsultationOpen] = useState(false)
  const householdServices = [
    {
      icon: <Home className="h-8 w-8" />,
      title: "Light Housekeeping",
      description: "Maintaining a clean, safe, and comfortable living environment",
      details: [
        "Dusting and wiping surfaces",
        "Vacuuming and sweeping floors",
        "Bathroom and kitchen cleaning",
        "Bed making and linen changing",
        "Organizing living spaces"
      ]
    },
    {
      icon: <Shirt className="h-8 w-8" />,
      title: "Laundry Services",
      description: "Complete laundry care to keep clothing fresh and organized",
      details: [
        "Washing and drying clothes",
        "Folding and organizing garments",
        "Ironing and pressing",
        "Putting clothes away",
        "Linen and towel management"
      ]
    },
    {
      icon: <Utensils className="h-8 w-8" />,
      title: "Meal Preparation",
      description: "Nutritious meal planning and preparation for healthy living",
      details: [
        "Menu planning and preparation",
        "Grocery list creation",
        "Cooking nutritious meals",
        "Kitchen cleanup",
        "Special dietary accommodations"
      ]
    },
    {
      icon: <ShoppingCart className="h-8 w-8" />,
      title: "Errands & Shopping",
      description: "Assistance with daily errands and essential shopping needs",
      details: [
        "Grocery shopping",
        "Pharmacy visits",
        "Banking errands",
        "Post office services",
        "Other essential errands"
      ]
    },
    {
      icon: <Car className="h-8 w-8" />,
      title: "Transportation",
      description: "Safe, reliable transportation for appointments and activities",
      details: [
        "Medical appointments",
        "Social activities",
        "Religious services",
        "Family visits",
        "Community events"
      ]
    }
  ]

  const benefits = [
    {
      icon: <Heart className="h-6 w-6 text-red-500" />,
      title: "Peace of Mind",
      description: "Family members can rest assured their loved one is well cared for"
    },
    {
      icon: <Shield className="h-6 w-6 text-blue-500" />,
      title: "Safety First",
      description: "Reducing fall risks and maintaining a safe home environment"
    },
    {
      icon: <Users className="h-6 w-6 text-green-500" />,
      title: "Independence",
      description: "Helping clients maintain their independence in their own homes"
    },
    {
      icon: <Award className="h-6 w-6 text-purple-500" />,
      title: "Quality Care",
      description: "Professional caregivers trained in household management"
    }
  ]

  const testimonials = [
    {
      name: "Margaret Thompson",
      location: "Virginia Beach, VA",
      rating: 5,
      text: "The household support has been a game-changer for me. My caregiver Sarah helps keep my home spotless and even does my grocery shopping. I feel so much more relaxed knowing everything is taken care of."
    },
    {
      name: "Robert Chen",
      location: "Norfolk, VA",
      rating: 5,
      text: "After my wife passed, I struggled with keeping up the house. Caring Compass assigned Maria to help with cleaning and meal prep. She's become like family to me, and my home has never looked better."
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-teal-600 text-white">
        <div className="container mx-auto px-4 py-16">
          <Button
            variant="outline"
            onClick={() => router.push('/')}
            className="mb-6 border-white text-white hover:bg-white/10"
          >
            ← Back to Home
          </Button>

          <div className="text-center max-w-4xl mx-auto">
            <div className="flex justify-center mb-6">
              <div className="bg-white/20 p-4 rounded-full">
                <Home className="h-12 w-12" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Household Support Services
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              Maintaining comfort, cleanliness, and independence in your own home
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50" onClick={() => window.location.href = 'tel:+17575552273'}>
                <Phone className="mr-2 h-5 w-5" />
                Call (757) 555-CARE
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10" onClick={() => setIsConsultationOpen(true)}>
                Request Free Assessment
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
            Supporting Your Daily Life at Home
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            Our household support services are designed to help you maintain a comfortable, 
            clean, and well-organized home environment. We understand that managing household 
            tasks can become challenging, and our compassionate caregivers are here to provide 
            the assistance you need to continue living independently in the place you love most.
          </p>
        </div>

        {/* Services Grid */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Our Household Support Services
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {householdServices.map((service, index) => (
              <Card key={index} className="h-full hover:shadow-lg transition-all duration-300 border-0 shadow-md">
                <CardHeader className="text-center pb-4">
                  <div className="flex justify-center mb-4">
                    <div className="bg-gradient-to-r from-blue-500 to-teal-500 text-white p-3 rounded-full">
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

        {/* Benefits Section */}
        <div className="mb-16 bg-gradient-to-r from-blue-50 to-teal-50 rounded-2xl p-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Why Choose Our Household Support?
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

        {/* Service Process */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            How Our Household Support Works
          </h2>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                step: "1",
                title: "Home Assessment",
                description: "We visit your home to understand your specific household needs and preferences"
              },
              {
                step: "2", 
                title: "Care Plan Creation",
                description: "We develop a personalized household support plan tailored to your lifestyle"
              },
              {
                step: "3",
                title: "Caregiver Matching",
                description: "We assign a qualified caregiver who fits your personality and requirements"
              },
              {
                step: "4",
                title: "Ongoing Support",
                description: "Regular household assistance with quality monitoring and plan adjustments"
              }
            ].map((step, index) => (
              <div key={index} className="text-center">
                <div className="bg-gradient-to-r from-blue-500 to-teal-500 text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
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
            What Our Clients Say
          </h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-4 italic">
                    &quot;{testimonial.text}&quot;
                  </p>
                  <div className="flex items-center">
                    <div className="bg-gradient-to-r from-blue-500 to-teal-500 text-white w-10 h-10 rounded-full flex items-center justify-center font-semibold mr-3">
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
        <div className="bg-gradient-to-r from-blue-600 to-teal-600 text-white rounded-2xl p-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Get Household Support?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Let us help you maintain a comfortable, clean home environment
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 flex-1" onClick={() => window.location.href = 'tel:+17575552273'}>
              <Phone className="mr-2 h-5 w-5" />
              Call Now
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 flex-1" onClick={() => setIsConsultationOpen(true)}>
              <Mail className="mr-2 h-5 w-5" />
              Get Quote
            </Button>
          </div>
          <p className="text-blue-100 mt-4 text-sm">
            Free consultation • Licensed & insured • Available 24/7
          </p>
        </div>
      </div>

      <ConsultationModal 
        isOpen={isConsultationOpen}
        onClose={() => setIsConsultationOpen(false)}
        serviceType="Household Support Services"
      />
    </div>
  )
}