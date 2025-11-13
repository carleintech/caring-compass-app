'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { useState } from 'react'
import { 
  CheckCircle, 
  Star, 
  ArrowRight, 
  Plus,
  Bath,
  Shirt,
  Utensils,
  AlertCircle,
  Timer,
  UserCheck,
  Shield,
  Heart,
  Home,
  Clock
} from 'lucide-react'

// Import modals
import { ConsultationModal } from '@/components/modals/consultation-modal'
import { CustomPackageModal } from '@/components/modals/custom-package-modal'
import { CoordinatorModal } from '@/components/modals/coordinator-modal'

// Icon mapping for string-based icons
const iconMap = {
  Bath,
  Shirt,
  Utensils,
  AlertCircle,
  Timer,
  UserCheck,
  Shield,
  Heart,
  Home,
  Clock,
  CheckCircle,
  Star
}

interface ServiceFeature {
  title: string
  description: string
  icon: string | keyof typeof iconMap
  details: string[]
  price?: string
  duration?: string
  popular?: boolean
}

interface ServiceFeaturesProps {
  title: string
  subtitle?: string
  features: ServiceFeature[]
  className?: string
}

export function ServiceFeatures({ title, subtitle, features, className }: ServiceFeaturesProps) {
  const [selectedFeature, setSelectedFeature] = useState<number | null>(null)
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)
  
  // Modal states
  const [isConsultationModalOpen, setIsConsultationModalOpen] = useState(false)
  const [isCustomPackageModalOpen, setIsCustomPackageModalOpen] = useState(false)
  const [isCoordinatorModalOpen, setIsCoordinatorModalOpen] = useState(false)
  const [selectedServiceForPackage, setSelectedServiceForPackage] = useState<ServiceFeature | null>(null)

  return (
    <section className={cn("py-20 relative", className)}>
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4">
            <span className="bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
              {title}
            </span>
          </h2>
          {subtitle && (
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const IconComponent = iconMap[feature.icon as keyof typeof iconMap] || iconMap.Heart;
            
            return (
            <Card
              key={feature.title}
              className={cn(
                "group relative h-full bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer overflow-hidden",
                selectedFeature === index && "ring-2 ring-blue-500 shadow-2xl",
                hoveredCard === index && "-translate-y-2"
              )}
              onMouseEnter={() => setHoveredCard(index)}
              onMouseLeave={() => setHoveredCard(null)}
              onClick={() => setSelectedFeature(selectedFeature === index ? null : index)}
            >
              {/* Background Gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-purple-50/30 to-pink-50/50 opacity-60" />
              <div 
                className={cn(
                  "absolute inset-0 bg-gradient-to-r from-blue-400/20 via-purple-400/20 to-pink-400/20 transition-all duration-700",
                  hoveredCard === index ? "scale-110 opacity-100" : "scale-100 opacity-0"
                )}
              />
              
              {/* Popular Badge */}
              {feature.popular && (
                <div className="absolute top-4 right-4 z-10">
                  <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                    <Star className="w-3 h-3 mr-1" />
                    Popular
                  </Badge>
                </div>
              )}

              <CardHeader className="relative space-y-4 pb-4">
                <div className="flex items-center justify-between">
                  <div className={cn(
                    "p-3 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg transition-all duration-500",
                    hoveredCard === index && "scale-110 rotate-3"
                  )}>
                    <IconComponent className="h-8 w-8 text-white" />
                  </div>
                  
                  {feature.duration && (
                    <Badge variant="secondary" className="bg-gray-100 text-gray-700 font-medium">
                      {feature.duration}
                    </Badge>
                  )}
                </div>
                
                <div className="space-y-2">
                  <CardTitle className="text-xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
                    {feature.title}
                  </CardTitle>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </CardHeader>

              <CardContent className="relative space-y-6">
                {/* Feature Details */}
                <div className="space-y-3">
                  {feature.details.slice(0, selectedFeature === index ? feature.details.length : 3).map((detail, detailIndex) => (
                    <div 
                      key={detail}
                      className={cn(
                        "flex items-start gap-3 transition-all duration-500",
                        selectedFeature === index 
                          ? "opacity-100 translate-x-0" 
                          : detailIndex < 3 
                            ? "opacity-100 translate-x-0" 
                            : "opacity-0 translate-x-4",
                        selectedFeature === index && detailIndex === 0 && "delay-0",
                        selectedFeature === index && detailIndex === 1 && "delay-100",
                        selectedFeature === index && detailIndex === 2 && "delay-200",
                        selectedFeature === index && detailIndex === 3 && "delay-300",
                        selectedFeature === index && detailIndex === 4 && "[animation-delay:400ms]",
                        selectedFeature === index && detailIndex === 5 && "[animation-delay:500ms]"
                      )}
                    >
                      <div className="mt-0.5">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      </div>
                      <span className="text-sm text-gray-700 font-medium leading-snug">
                        {detail}
                      </span>
                    </div>
                  ))}
                  
                  {feature.details.length > 3 && selectedFeature !== index && (
                    <div className="text-xs text-gray-500 font-medium mt-2">
                      +{feature.details.length - 3} more details
                    </div>
                  )}
                </div>

                {/* Price and Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-200/50">
                  {feature.price && (
                    <div>
                      <span className="text-2xl font-bold text-blue-600">{feature.price}</span>
                      <span className="text-sm text-gray-500 ml-1">per hour</span>
                    </div>
                  )}
                  
                  <div className="flex space-x-2 ml-auto">
                    <Button 
                      size="sm"
                      variant="outline"
                      className={cn(
                        "transition-all duration-300",
                        hoveredCard === index && "scale-105"
                      )}
                      onClick={(e) => {
                        e.stopPropagation()
                        setSelectedServiceForPackage(feature)
                        setIsCustomPackageModalOpen(true)
                      }}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add
                    </Button>
                    
                    <Button 
                      size="sm"
                      className={cn(
                        "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-300",
                        hoveredCard === index && "scale-105 shadow-lg"
                      )}
                      onClick={(e) => {
                        e.stopPropagation()
                        setIsConsultationModalOpen(true)
                      }}
                    >
                      Learn More
                      <ArrowRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            )
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-8 md:p-12 text-white relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
              <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/5 rounded-full blur-3xl" />
            </div>
            
            <div className="relative z-10 max-w-3xl mx-auto">
              <h3 className="text-2xl md:text-3xl font-bold mb-4">
                Need a Custom Care Package?
              </h3>
              
              <p className="text-lg md:text-xl text-blue-100 mb-8 leading-relaxed">
                Our care coordinators will work with you to create a personalized plan that meets your specific needs and budget.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg"
                  className="bg-white text-blue-600 hover:bg-gray-50 font-semibold px-8 py-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                  onClick={() => setIsCustomPackageModalOpen(true)}
                >
                  <Plus className="mr-2 h-5 w-5" />
                  Build Custom Package
                </Button>
                
                <Button 
                  variant="outline"
                  size="lg"
                  className="border-white/30 text-white hover:bg-white/10 font-semibold px-8 py-6 rounded-xl transition-all duration-300"
                  onClick={() => setIsCoordinatorModalOpen(true)}
                >
                  Speak with Coordinator
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Modals */}
      <ConsultationModal
        isOpen={isConsultationModalOpen}
        onClose={() => setIsConsultationModalOpen(false)}
        serviceType="Personal Care Services"
      />
      
      <CustomPackageModal
        isOpen={isCustomPackageModalOpen}
        onClose={() => {
          setIsCustomPackageModalOpen(false)
          setSelectedServiceForPackage(null)
        }}
        preselectedService={selectedServiceForPackage ? {
          id: `${selectedServiceForPackage.title.toLowerCase().replace(/\s+/g, '-')}`,
          title: selectedServiceForPackage.title,
          description: selectedServiceForPackage.description,
          price: selectedServiceForPackage.price || '$0',
          duration: selectedServiceForPackage.duration || '30 min',
          icon: selectedServiceForPackage.icon,
          popular: selectedServiceForPackage.popular,
          details: selectedServiceForPackage.details
        } : undefined}
      />
      
      <CoordinatorModal
        isOpen={isCoordinatorModalOpen}
        onClose={() => setIsCoordinatorModalOpen(false)}
      />
    </section>
  )
}
