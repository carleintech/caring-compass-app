'use client'

import { Button } from '@/components/ui/button'
import { ArrowLeft, Sparkles, Plus } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { ReactNode } from 'react'

interface ServicePageLayoutProps {
  children: ReactNode
  className?: string
  onBuildPackageClick?: () => void
}

export function ServicePageLayout({ children, className, onBuildPackageClick }: ServicePageLayoutProps) {
  return (
    <div className={cn("min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20", className)}>
      {/* Navigation Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200/50 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Back Button */}
            <Link href="/" className="group">
              <Button 
                variant="ghost" 
                size="sm"
                className="text-gray-600 hover:text-gray-900 transition-all duration-300 hover:bg-gray-100/80"
              >
                <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
                Back to Home
              </Button>
            </Link>

            {/* Logo or Brand */}
            <div className="absolute left-1/2 transform -translate-x-1/2">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <Sparkles className="h-4 w-4 text-white" />
                </div>
                <span className="font-bold text-xl bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
                  Caring Compass
                </span>
              </div>
            </div>

            {/* Build Package Button */}
            <div className="flex items-center space-x-4">
              <Button 
                onClick={onBuildPackageClick}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <Plus className="mr-2 h-4 w-4" />
                Build Package
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative">
        {children}
      </main>

      {/* Background Decorations */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-10 w-64 h-64 bg-blue-300/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-40 right-20 w-80 h-80 bg-purple-300/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-20 left-1/3 w-72 h-72 bg-pink-300/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>
    </div>
  )
}
