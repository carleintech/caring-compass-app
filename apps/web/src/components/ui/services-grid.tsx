'use client'

import { AnimatedServiceCard } from '@/components/ui/animated-service-card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Heart, 
  Users, 
  Car, 
  Home, 
  Utensils, 
  Shield, 
  Calendar,
  Phone,
  MapPin,
  Plus,
  ArrowRight,
  Sparkles
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useState, useEffect } from 'react'

const mainServices = [
  {
    icon: Heart,
    title: "Personal Care",
    description: "Compassionate assistance with daily living activities, medication management, and health monitoring",
    features: ["Bathing & Grooming", "Medication Reminders", "Health Monitoring", "24/7 Support"],
    link: "/services/personal-care"
  },
  {
    icon: Users,
    title: "Companionship",
    description: "Meaningful social interaction, emotional support, and engaging activities to combat loneliness",
    features: ["Conversation & Friendship", "Social Activities", "Emotional Support", "Regular Check-ins"],
    link: "/services/companionship"
  },
  {
    icon: Car,
    title: "Transportation",
    description: "Safe and reliable transportation to appointments, errands, and social activities",
    features: ["Medical Appointments", "Shopping Trips", "Social Outings", "Professional Drivers"],
    link: "/services/transportation"
  },
  {
    icon: Home,
    title: "Housekeeping",
    description: "Professional cleaning and organization services to maintain a comfortable living environment",
    features: ["Deep Cleaning", "Laundry Service", "Organization", "Maintenance"],
    link: "/services/housekeeping"
  },
  {
    icon: Utensils,
    title: "Meal Preparation",
    description: "Nutritious meal planning, preparation, and special dietary accommodations",
    features: ["Custom Meal Plans", "Dietary Restrictions", "Grocery Shopping", "Nutrition Counseling"],
    link: "/services/meal-preparation"
  },
  {
    icon: Shield,
    title: "Specialized Care",
    description: "Expert care for specific conditions including dementia, post-surgery, and chronic illness management",
    features: ["Dementia Care", "Post-Surgery Support", "Chronic Illness", "Specialized Training"],
    link: "/services/specialized-care"
  }
]

const additionalServices = [
  {
    icon: Calendar,
    title: "Appointment Scheduling",
    description: "Professional coordination of all your healthcare and personal appointments",
    color: "emerald"
  },
  {
    icon: Phone,
    title: "Emergency Response",
    description: "24/7 emergency support system with immediate response capabilities",
    color: "red"
  },
  {
    icon: MapPin,
    title: "Care Coordination",
    description: "Seamless coordination between healthcare providers and family members",
    color: "blue"
  }
]

export function ServicesGrid() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
      <div className="container px-4 md:px-6">
        {/* Section header */}
        <div className={cn(
          "text-center space-y-6 mb-16 transition-all duration-1000",
          isVisible ? "translate-y-0 opacity-100" : "-translate-y-8 opacity-0"
        )}>
          <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-full">
            🌟 Our Core Services
          </Badge>
          
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
            <span className="bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
              Comprehensive Care Solutions
            </span>
          </h2>
          
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Our expert team provides personalized care services tailored to your unique needs, 
            ensuring comfort, safety, and independence in your own home.
          </p>
        </div>

        {/* Main services grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {mainServices.map((service, index) => (
            <div
              key={service.title}
              className={cn(
                "transition-all duration-1000",
                isVisible 
                  ? "translate-y-0 opacity-100" 
                  : "translate-y-8 opacity-0",
                index === 0 && "delay-0",
                index === 1 && "delay-150",
                index === 2 && "delay-300",
                index === 3 && "[animation-delay:450ms]",
                index === 4 && "[animation-delay:600ms]",
                index === 5 && "[animation-delay:750ms]"
              )}
            >
              <AnimatedServiceCard {...service} />
            </div>
          ))}
        </div>

        {/* Additional services section */}
        <div className={cn(
          "transition-all duration-1000 delay-1000",
          isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
        )}>
          <div className="text-center mb-12">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Additional Support Services
            </h3>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Enhance your care experience with our comprehensive support services
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {additionalServices.map((service, index) => (
              <div
                key={service.title}
                className={cn(
                  "group relative p-6 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-gray-200 overflow-hidden",
                  "hover:-translate-y-2",
                  index === 0 && "delay-0",
                  index === 1 && "delay-100",
                  index === 2 && "delay-200"
                )}
              >
                {/* Background gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-gray-50/50 group-hover:to-blue-50/50 transition-colors duration-500" />
                
                <div className="relative z-10">
                  <div className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-all duration-300 group-hover:scale-110",
                    service.color === 'emerald' && "bg-emerald-100 text-emerald-600 group-hover:bg-emerald-200",
                    service.color === 'red' && "bg-red-100 text-red-600 group-hover:bg-red-200",
                    service.color === 'blue' && "bg-blue-100 text-blue-600 group-hover:bg-blue-200"
                  )}>
                    <service.icon className="h-6 w-6" />
                  </div>
                  
                  <h4 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-900 transition-colors">
                    {service.title}
                  </h4>
                  
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {service.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Call to action */}
        <div className={cn(
          "text-center space-y-8 transition-all duration-1000 delay-1200",
          isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
        )}>
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-8 md:p-12 text-white relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
              <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/5 rounded-full blur-3xl" />
            </div>
            
            <div className="relative z-10 max-w-3xl mx-auto">
              <Sparkles className="h-12 w-12 mx-auto mb-6 text-yellow-300" />
              
              <h3 className="text-2xl md:text-3xl font-bold mb-4">
                Ready to Build Your Perfect Care Package?
              </h3>
              
              <p className="text-lg md:text-xl text-blue-100 mb-8 leading-relaxed">
                Combine our services to create a personalized care plan that meets your unique needs and budget.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg"
                  className="bg-white text-blue-600 hover:bg-gray-50 font-semibold px-8 py-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  <Plus className="mr-2 h-5 w-5" />
                  Build Care Package
                </Button>
                
                <Button 
                  variant="outline"
                  size="lg"
                  className="border-white/30 text-white hover:bg-white/10 font-semibold px-8 py-6 rounded-xl transition-all duration-300"
                >
                  Schedule Consultation
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
