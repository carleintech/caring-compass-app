'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, CheckCircle2, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useState } from 'react'

interface AnimatedServiceCardProps {
  icon: LucideIcon
  title: string
  description: string
  features: string[]
  link: string
  className?: string
  delay?: number
}

export function AnimatedServiceCard({
  icon: Icon,
  title,
  description,
  features,
  link,
  className,
  delay = 0
}: AnimatedServiceCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      className={cn(
        "group relative animate-in fade-in-0 slide-in-from-bottom-4",
        className
      )}
      style={{
        animationDelay: `${delay}ms`,
        animationFillMode: 'both'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background glow effect */}
      <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 opacity-0 group-hover:opacity-75 blur transition-all duration-1000 group-hover:duration-300" />
      
      <Card className="relative h-full bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-2xl transition-all duration-500 group-hover:-translate-y-2 overflow-hidden">
        {/* Animated background pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-purple-50/30 to-pink-50/50 opacity-60" />
        <div 
          className={cn(
            "absolute inset-0 bg-gradient-to-r from-blue-400/20 via-purple-400/20 to-pink-400/20 transition-all duration-700",
            isHovered ? "scale-110 opacity-100" : "scale-100 opacity-0"
          )}
        />
        
        {/* Sparkle effects */}
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <Sparkles className="h-4 w-4 text-yellow-400 animate-pulse" />
        </div>
        
        <CardHeader className="relative space-y-4 pb-4">
          <div className="flex items-center justify-between">
            <div className={cn(
              "p-3 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg transition-all duration-500",
              isHovered && "scale-110 rotate-3"
            )}>
              <Icon className="h-8 w-8 text-white" />
            </div>
            <Badge 
              variant="secondary" 
              className="bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 border-0 font-medium"
            >
              Premium
            </Badge>
          </div>
          
          <div className="space-y-2">
            <CardTitle className="text-xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
              {title}
            </CardTitle>
            <CardDescription className="text-gray-600 font-medium leading-relaxed">
              {description}
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="relative space-y-6">
          {/* Features list */}
          <div className="space-y-3">
            {features.slice(0, 4).map((feature, index) => (
              <div 
                key={feature}
                className={cn(
                  "flex items-start gap-3 opacity-0 translate-x-4 transition-all duration-500",
                  isHovered && "opacity-100 translate-x-0"
                )}
                style={{
                  transitionDelay: `${index * 100}ms`
                }}
              >
                <div className="mt-0.5">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                </div>
                <span className="text-sm text-gray-700 font-medium leading-snug">
                  {feature}
                </span>
              </div>
            ))}
            
            {features.length > 4 && (
              <div className="text-xs text-gray-500 font-medium mt-2">
                +{features.length - 4} more features
              </div>
            )}
          </div>

          {/* Action button */}
          <div className="pt-4">
            <Button 
              asChild 
              className={cn(
                "w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg transition-all duration-500 group/btn",
                isHovered && "shadow-xl scale-105"
              )}
            >
              <Link href={link}>
                <span className="mr-2">Explore Service</span>
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
