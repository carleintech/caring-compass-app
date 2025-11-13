'use client'

import { Button } from '@/components/ui/button'
import { BackToHomeButton } from '@/components/ui/back-to-home-button'
import { Badge } from '@/components/ui/badge'
import { Heart, Star, Users, Sparkles, ArrowDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useEffect, useState } from 'react'

export function ServicesHero() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        {/* Floating shapes */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-300/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-40 right-20 w-96 h-96 bg-purple-300/20 rounded-full blur-3xl animate-pulse [animation-delay:1s]" />
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-pink-300/20 rounded-full blur-3xl animate-pulse [animation-delay:2s]" />
        
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-40">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-100/10 via-purple-100/10 to-pink-100/10" />
        </div>
      </div>

      {/* Floating icons */}
      <div className="absolute inset-0 pointer-events-none">
        <Heart className="absolute top-1/4 left-1/4 h-6 w-6 text-pink-400/60 animate-bounce [animation-delay:0s]" />
        <Star className="absolute top-1/3 right-1/4 h-5 w-5 text-yellow-400/60 animate-bounce [animation-delay:0.5s]" />
        <Users className="absolute bottom-1/3 left-1/5 h-7 w-7 text-blue-400/60 animate-bounce [animation-delay:1s]" />
        <Sparkles className="absolute top-1/2 right-1/3 h-4 w-4 text-purple-400/60 animate-bounce [animation-delay:1.5s]" />
      </div>

      <div className="container relative z-10 px-4 md:px-6">
        {/* Back button */}
        <div className={cn(
          "mb-8 transition-all duration-1000",
          isVisible ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0"
        )}>
          <BackToHomeButton 
            variant="ghost" 
            className="bg-white/80 backdrop-blur-sm hover:bg-white/90 shadow-lg border border-white/20 text-gray-700 hover:text-gray-900"
          />
        </div>

        <div className="flex flex-col items-center text-center space-y-8 max-w-4xl mx-auto">
          {/* Badge */}
          <div className={cn(
            "transition-all duration-1000 delay-200",
            isVisible ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0"
          )}>
            <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-full text-sm font-semibold shadow-lg">
              ✨ Premium Care Services
            </Badge>
          </div>

          {/* Main title */}
          <div className={cn(
            "space-y-4 transition-all duration-1000 delay-400",
            isVisible ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0"
          )}>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight">
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Exceptional Care
              </span>
              <br />
              <span className="text-gray-900">
                Services
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 font-medium leading-relaxed max-w-3xl mx-auto">
              Discover our comprehensive range of personalized care services designed to enhance 
              <span className="text-blue-600 font-semibold"> quality of life</span> and promote 
              <span className="text-purple-600 font-semibold"> independence at home</span>
            </p>
          </div>

          {/* Action buttons */}
          <div className={cn(
            "flex flex-col sm:flex-row gap-4 transition-all duration-1000 delay-600",
            isVisible ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0"
          )}>
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-8 py-6 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
            >
              <Sparkles className="mr-2 h-5 w-5" />
              Build Your Care Package
            </Button>
            
            <Button 
              variant="outline" 
              size="lg"
              className="bg-white/80 backdrop-blur-sm hover:bg-white/90 border-2 border-gray-200 hover:border-gray-300 text-gray-700 hover:text-gray-900 font-semibold px-8 py-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Schedule Consultation
            </Button>
          </div>

          {/* Stats */}
          <div className={cn(
            "grid grid-cols-3 gap-8 pt-8 transition-all duration-1000 delay-800",
            isVisible ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0"
          )}>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                50+
              </div>
              <div className="text-sm md:text-base text-gray-600 font-medium">Services Available</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                24/7
              </div>
              <div className="text-sm md:text-base text-gray-600 font-medium">Support Available</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-pink-600 to-blue-600 bg-clip-text text-transparent">
                100%
              </div>
              <div className="text-sm md:text-base text-gray-600 font-medium">Satisfaction Rate</div>
            </div>
          </div>

          {/* Scroll indicator */}
          <div className={cn(
            "pt-8 transition-all duration-1000 delay-1000",
            isVisible ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0"
          )}>
            <div className="flex flex-col items-center space-y-2">
              <span className="text-sm text-gray-500 font-medium">Explore our services</span>
              <ArrowDown className="h-5 w-5 text-gray-400 animate-bounce" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
