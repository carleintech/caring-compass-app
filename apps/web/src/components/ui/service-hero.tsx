'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useState, useEffect } from 'react'
import { 
  Heart, 
  Star, 
  CheckCircle, 
  Sparkles, 
  ArrowRight,
  Bath,
  Shirt,
  Utensils,
  AlertCircle,
  Timer,
  UserCheck,
  Shield,
  Home,
  Clock
} from 'lucide-react'

// Import modals
import { ConsultationModal } from '@/components/modals/consultation-modal'
import { CustomPackageModal } from '@/components/modals/custom-package-modal'

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

interface ServiceHeroProps {
  title: string
  subtitle: string
  description: string
  icon: string | keyof typeof iconMap
  pricing?: string
  features?: string[]
  badge?: string
  className?: string
}

export function ServiceHero({
  title,
  subtitle,
  description,
  icon,
  pricing,
  features = [],
  badge = "Premium Service",
  className
}: ServiceHeroProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [isConsultationModalOpen, setIsConsultationModalOpen] = useState(false)
  const [isCustomPackageModalOpen, setIsCustomPackageModalOpen] = useState(false)
  const IconComponent = iconMap[icon as keyof typeof iconMap] || iconMap.Heart;

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <section className={cn("relative py-20 overflow-hidden", className)}>
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-purple-50/30 to-pink-50/40" />
      
      {/* Floating Icons */}
      <div className="absolute inset-0 pointer-events-none">
        <Heart className="absolute top-1/4 left-1/5 h-6 w-6 text-pink-400/40 animate-bounce" style={{ animationDelay: '0s' }} />
        <Star className="absolute top-1/3 right-1/4 h-5 w-5 text-yellow-400/40 animate-bounce" style={{ animationDelay: '0.5s' }} />
        <CheckCircle className="absolute bottom-1/3 left-1/4 h-7 w-7 text-green-400/40 animate-bounce" style={{ animationDelay: '1s' }} />
        <Sparkles className="absolute top-1/2 right-1/5 h-4 w-4 text-purple-400/40 animate-bounce" style={{ animationDelay: '1.5s' }} />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className={cn(
            "mb-6 transition-all duration-1000 delay-200",
            isVisible ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0"
          )}>
            <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-full text-sm font-semibold shadow-lg">
              ✨ {badge}
            </Badge>
          </div>

          {/* Icon */}
          <div className={cn(
            "mb-8 transition-all duration-1000 delay-400",
            isVisible ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0"
          )}>
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-2xl">
              <IconComponent className="h-10 w-10 text-white" />
            </div>
          </div>

          {/* Title */}
          <div className={cn(
            "mb-6 transition-all duration-1000 delay-600",
            isVisible ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0"
          )}>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-4">
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                {title}
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 font-medium">
              {subtitle}
            </p>
          </div>

          {/* Description */}
          <div className={cn(
            "mb-8 transition-all duration-1000 delay-800",
            isVisible ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0"
          )}>
            <p className="text-lg text-gray-700 leading-relaxed max-w-3xl mx-auto">
              {description}
            </p>
          </div>

          {/* Features */}
          {features.length > 0 && (
            <div className={cn(
              "mb-8 transition-all duration-1000 delay-1000",
              isVisible ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0"
            )}>
              <div className="flex flex-wrap justify-center gap-4 max-w-3xl mx-auto">
                {features.slice(0, 4).map((feature) => (
                  <div 
                    key={feature}
                    className="flex items-center bg-white/60 backdrop-blur-sm rounded-full px-4 py-2 shadow-md border border-gray-200/50"
                  >
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    <span className="text-sm font-medium text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CTA Buttons */}
          <div className={cn(
            "flex flex-col sm:flex-row gap-4 justify-center transition-all duration-1000 delay-1200",
            isVisible ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0"
          )}>
            <Button 
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-8 py-6 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
              onClick={() => setIsCustomPackageModalOpen(true)}
            >
              <Sparkles className="mr-2 h-5 w-5" />
              Add to Package
            </Button>
            
            <Button 
              variant="outline"
              size="lg"
              className="bg-white/80 backdrop-blur-sm hover:bg-white/90 border-2 border-gray-200 hover:border-gray-300 text-gray-700 hover:text-gray-900 font-semibold px-8 py-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              onClick={() => setIsConsultationModalOpen(true)}
            >
              Schedule Consultation
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>

          {/* Pricing */}
          {pricing && (
            <div className={cn(
              "mt-8 transition-all duration-1000 delay-1400",
              isVisible ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0"
            )}>
              <p className="text-lg text-gray-600">
                Starting at <span className="text-2xl font-bold text-blue-600">{pricing}</span>
              </p>
            </div>
          )}
        </div>
      </div>
      
      {/* Modals */}
      <ConsultationModal
        isOpen={isConsultationModalOpen}
        onClose={() => setIsConsultationModalOpen(false)}
        serviceType={title}
      />
      
      <CustomPackageModal
        isOpen={isCustomPackageModalOpen}
        onClose={() => setIsCustomPackageModalOpen(false)}
      />
    </section>
  )
}
