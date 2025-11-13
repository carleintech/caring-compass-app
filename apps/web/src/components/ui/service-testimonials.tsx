'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { useState, useEffect } from 'react'
import { Star, Quote, Heart, Users } from 'lucide-react'

interface Testimonial {
  id: number
  name: string
  location: string
  text: string
  rating: number
  relationship?: string
  avatar?: string
}

interface ServiceTestimonialsProps {
  testimonials: Testimonial[]
  title?: string
  subtitle?: string
  className?: string
}

export function ServiceTestimonials({ 
  testimonials, 
  title = "What Our Families Say",
  subtitle = "Real stories from families who trust us with their loved ones",
  className 
}: ServiceTestimonialsProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <section className={cn("py-20 bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20", className)}>
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className={cn(
          "text-center mb-16 transition-all duration-1000",
          isVisible ? "translate-y-0 opacity-100" : "-translate-y-8 opacity-0"
        )}>
          <Badge className="bg-gradient-to-r from-pink-500 to-rose-500 text-white px-4 py-2 rounded-full mb-6">
            <Heart className="w-4 h-4 mr-2" />
            Testimonials
          </Badge>
          
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4">
            <span className="bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
              {title}
            </span>
          </h2>
          
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {subtitle}
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card
              key={testimonial.id}
              className={cn(
                "group relative h-full bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden",
                "hover:-translate-y-2 cursor-pointer",
                hoveredCard === index && "ring-2 ring-pink-300"
              )}
              onMouseEnter={() => setHoveredCard(index)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              {/* Background Gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-pink-50/50 via-purple-50/30 to-blue-50/50 opacity-60" />
              <div 
                className={cn(
                  "absolute inset-0 bg-gradient-to-r from-pink-400/20 via-purple-400/20 to-blue-400/20 transition-all duration-700",
                  hoveredCard === index ? "scale-110 opacity-100" : "scale-100 opacity-0"
                )}
              />
              
              {/* Quote Icon */}
              <div className="absolute top-4 right-4 opacity-20">
                <Quote className="h-8 w-8 text-gray-600" />
              </div>

              <CardContent className="relative p-6 space-y-6">
                {/* Rating */}
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={cn(
                        "h-4 w-4 transition-colors duration-300",
                        i < testimonial.rating 
                          ? "text-yellow-400 fill-yellow-400" 
                          : "text-gray-300"
                      )}
                    />
                  ))}
                  <span className="text-sm text-gray-600 ml-2">
                    {testimonial.rating}.0
                  </span>
                </div>

                {/* Testimonial Text */}
                <blockquote className="text-gray-700 leading-relaxed italic relative">
                  &ldquo;{testimonial.text}&rdquo;
                </blockquote>

                {/* Author Info */}
                <div className="flex items-center space-x-3 pt-4 border-t border-gray-200/50">
                  {/* Avatar */}
                  <div className="flex-shrink-0">
                    {testimonial.avatar ? (
                      <img 
                        src={testimonial.avatar} 
                        alt={testimonial.name}
                        className="w-12 h-12 rounded-full object-cover ring-2 ring-gray-200"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <Users className="h-6 w-6 text-white" />
                      </div>
                    )}
                  </div>
                  
                  {/* Author Details */}
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-gray-900 truncate">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-gray-600 truncate">
                      {testimonial.location}
                    </div>
                    {testimonial.relationship && (
                      <div className="text-xs text-gray-500 truncate">
                        {testimonial.relationship}
                      </div>
                    )}
                  </div>
                </div>

                {/* Hover Effect Indicator */}
                <div className={cn(
                  "absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-pink-500 to-purple-500 transition-all duration-300",
                  hoveredCard === index ? "opacity-100" : "opacity-0"
                )} />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Bottom Stats */}
        <div className={cn(
          "mt-16 text-center transition-all duration-1000 delay-800",
          isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
        )}>
          <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                4.9/5
              </div>
              <div className="text-sm md:text-base text-gray-600 font-medium">Average Rating</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                500+
              </div>
              <div className="text-sm md:text-base text-gray-600 font-medium">Happy Families</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-pink-600 bg-clip-text text-transparent">
                98%
              </div>
              <div className="text-sm md:text-base text-gray-600 font-medium">Satisfaction Rate</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
