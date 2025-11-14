'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/components/ui/use-toast'
import { useServices } from '@/hooks/use-services'
import { 
  Star, 
  Heart, 
  Quote, 
  Award, 
  ThumbsUp,
  MessageCircle,
  Filter,
  Search,
  Phone,
  Mail,
  MapPin,
  Calendar,
  CheckCircle,
  Home,
  Sparkles,
  TrendingUp,
  Send,
  PenTool,
  Share2,
  Facebook,
  Twitter,
  Instagram
} from 'lucide-react'

export default function ReviewsPage() {
  const [selectedFilter, setSelectedFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [isWritingReview, setIsWritingReview] = useState(false)
  const [newReview, setNewReview] = useState({
    name: '',
    email: '',
    rating: 5,
    title: '',
    review: '',
    service: 'personal-care'
  })

  const { toast } = useToast()
  const { 
    scheduleConsultation,
    speakWithCoordinator,
    isSubmitting 
  } = useServices()

  const handleSubmitReview = () => {
    if (!newReview.name || !newReview.email || !newReview.title || !newReview.review) {
      toast({
        title: "Please fill in all fields",
        description: "All fields are required to submit your review."
      })
      return
    }

    // Here you would typically submit to your backend
    toast({
      title: "Review Submitted Successfully! ⭐",
      description: "Thank you for sharing your experience. Your review will be published after verification."
    })
    
    setIsWritingReview(false)
    setNewReview({
      name: '',
      email: '',
      rating: 5,
      title: '',
      review: '',
      service: 'personal-care'
    })
  }

  const handleContactCall = () => {
    // Track analytics or handle the call action
    window.location.href = 'tel:+17575552273'
    toast({
      title: "Calling Caring Compass! 📞",
      description: "You're being connected to our care coordinators."
    })
  }

  const handleGetConsultation = async () => {
    try {
      await scheduleConsultation({
        name: 'Review Page Visitor',
        email: '',
        phone: '',
        preferredDate: new Date().toISOString().split('T')[0],
        timeSlot: 'morning',
        serviceType: 'general',
        notes: 'Interested after reading reviews'
      })
    } catch (error) {
      console.error('Error scheduling consultation:', error)
    }
  }

  const handleWriteReview = () => {
    setIsWritingReview(true)
    toast({
      title: "Share Your Experience ✨",
      description: "Help other families by sharing your story with Caring Compass."
    })
  }

  const handleShareStory = async () => {
    try {
      await speakWithCoordinator({
        name: 'Review Page Visitor',
        email: '',
        phone: '',
        reason: 'I would like to share my care story and experience',
        urgency: 'low'
      })
    } catch (error) {
      console.error('Error submitting story request:', error)
    }
  }

  const handleSocialShare = (platform: string, reviewTitle: string) => {
    const url = encodeURIComponent(window.location.href)
    const text = encodeURIComponent(`Check out this review: "${reviewTitle}" - Caring Compass Home Care`)
    
    let shareUrl = ''
    switch(platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`
        break
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${text}`
        break
      case 'instagram':
        toast({
          title: "Instagram Sharing",
          description: "Please screenshot this review to share on Instagram!"
        })
        return
      default:
        return
    }
    
    window.open(shareUrl, '_blank', 'width=600,height=400')
    toast({
      title: "Thanks for sharing! 🎉",
      description: "Help spread the word about quality home care."
    })
  }

  const overallStats = {
    averageRating: 4.8,
    totalReviews: 127,
    satisfaction: 98,
    recommendation: 96
  }

  const ratingBreakdown = [
    { stars: 5, count: 89, percentage: 70 },
    { stars: 4, count: 31, percentage: 24 },
    { stars: 3, count: 5, percentage: 4 },
    { stars: 2, count: 2, percentage: 2 },
    { stars: 1, count: 0, percentage: 0 }
  ]

  const filters = [
    { id: 'all', name: 'All Reviews', count: 127 },
    { id: 'personal-care', name: 'Personal Care', count: 45 },
    { id: 'companionship', name: 'Companionship', count: 38 },
    { id: 'specialized', name: 'Specialized Care', count: 22 },
    { id: 'respite', name: 'Respite Care', count: 15 },
    { id: 'household', name: 'Household Support', count: 7 }
  ]

  const reviews = [
    {
      id: 1,
      name: "Margaret Thompson",
      location: "Virginia Beach, VA",
      service: "personal-care",
      serviceLabel: "Personal Care",
      rating: 5,
      date: "2024-08-15",
      title: "Exceptional care that gave us peace of mind",
      review: "After my father's stroke, we were worried about him living alone. Caring Compass matched us with Maria, who has been absolutely wonderful. She helps Dad with his daily routines, ensures he takes his medications, and most importantly, treats him with such dignity and respect. Dad actually looks forward to her visits now, and we can see his confidence returning. The family communication is excellent - we get regular updates and feel completely involved in his care.",
      caregiver: "Maria Rodriguez",
      helpful: 23,
      verified: true
    },
    {
      id: 2,
      name: "Robert Chen",
      location: "Norfolk, VA", 
      service: "companionship",
      serviceLabel: "Companionship",
      rating: 5,
      date: "2024-08-10",
      title: "Like having a caring family member",
      review: "Since my wife passed, I've been struggling with loneliness. My daughter arranged for companionship care, and I was skeptical at first. But Linda has become like family to me. We play chess, she helps me with my crossword puzzles, and she's even taught me how to video call my grandchildren. She's patient, kind, and genuinely cares about my wellbeing. I actually miss her on her days off!",
      caregiver: "Linda Washington",
      helpful: 18,
      verified: true
    },
    {
      id: 3,
      name: "Patricia Williams",
      location: "Chesapeake, VA",
      service: "specialized",
      serviceLabel: "Alzheimer's Care", 
      rating: 5,
      date: "2024-08-05",
      title: "Specialized Alzheimer's care with true understanding",
      review: "Mom has moderate Alzheimer's, and finding the right care was challenging. Caring Compass assigned Sarah, who has specialized dementia training, and the difference has been remarkable. Sarah understands Mom's routine, knows how to redirect when she gets confused, and engages her in activities that bring joy. Mom is calmer and happier, and our family finally feels supported. The care coordinators check in regularly and adjust the care plan as needed.",
      caregiver: "Sarah Johnson",
      helpful: 31,
      verified: true
    },
    {
      id: 4,
      name: "Michael Davis",
      location: "Newport News, VA",
      service: "respite",
      serviceLabel: "Respite Care",
      rating: 5,
      date: "2024-07-28",
      title: "Lifesaver for family caregivers",
      review: "I've been caring for my wife with Parkinson's for three years, and I was completely burned out. The respite care service has been a lifesaver. Knowing that trained, compassionate caregivers are with my wife allows me to actually rest, see friends, and take care of my own health. The caregivers follow our established routines perfectly, and my wife is comfortable with them. This service has probably saved our marriage and definitely saved my sanity.",
      caregiver: "Multiple Caregivers",
      helpful: 27,
      verified: true
    },
    {
      id: 5,
      name: "Susan Martinez",
      location: "Portsmouth, VA",
      service: "household",
      serviceLabel: "Household Support",
      rating: 4,
      date: "2024-07-20",
      title: "Great help with daily tasks",
      review: "As I've gotten older, keeping up with housework became overwhelming. My caregiver helps with light cleaning, laundry, and meal preparation. She's efficient, respectful of my belongings, and has become a trusted presence in my home. The only reason I didn't give 5 stars is that I wish the service was available on weekends too, but I understand staffing limitations.",
      caregiver: "Carmen Lopez", 
      helpful: 12,
      verified: true
    },
    {
      id: 6,
      name: "James Rodriguez",
      location: "Suffolk, VA",
      service: "specialized",
      serviceLabel: "Post-Stroke Recovery",
      rating: 5,
      date: "2024-07-15",
      title: "Professional recovery support at home",
      review: "After my stroke, I thought I'd never be independent again. The recovery support team has been incredible. They help me with my physical therapy exercises, speech practice, and daily activities while encouraging my independence. My progress has been faster than expected, and I'm now much more confident moving around my home. The coordination with my medical team is seamless.",
      caregiver: "David Thompson",
      helpful: 19,
      verified: true
    },
    {
      id: 7,
      name: "Dorothy Johnson",
      location: "Virginia Beach, VA",
      service: "personal-care",
      serviceLabel: "Personal Care",
      rating: 5,
      date: "2024-07-08",
      title: "Dignity preserved, independence maintained",
      review: "At 89, I was struggling with bathing and dressing safely. My caregiver helps me with these personal tasks while preserving my dignity and encouraging me to do what I can independently. She's patient, gentle, and never makes me feel helpless. The care plan was developed with my input, and they adjust it as my needs change. I'm able to stay in my beloved home because of this support.",
      caregiver: "Rebecca Williams",
      helpful: 25,
      verified: true
    },
    {
      id: 8,
      name: "William Brown",
      location: "Chesapeake, VA",
      service: "companionship",
      serviceLabel: "Companionship",
      rating: 4,
      date: "2024-06-30",
      title: "Good conversation and reliable company",
      review: "My caregiver visits three times a week and has become a good friend. We discuss current events, play cards, and she helps me with technology so I can stay connected with family. She's reliable, punctual, and genuinely interested in my wellbeing. The only improvement I'd suggest is more flexibility in scheduling for special occasions.",
      caregiver: "Jennifer Clark",
      helpful: 8,
      verified: true
    }
  ]

  const filteredReviews = reviews.filter(review => {
    const matchesFilter = selectedFilter === 'all' || review.service === selectedFilter
    const matchesSearch = review.review.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         review.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         review.serviceLabel.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesFilter && matchesSearch
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50 relative overflow-hidden">
      {/* Floating Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-amber-200/30 to-orange-200/30 rounded-full blur-xl animate-pulse [animation-delay:0ms]" />
        <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-br from-blue-200/30 to-indigo-200/30 rounded-full blur-xl animate-pulse [animation-delay:400ms]" />
        <div className="absolute bottom-40 left-1/4 w-40 h-40 bg-gradient-to-br from-purple-200/30 to-pink-200/30 rounded-full blur-xl animate-pulse [animation-delay:800ms]" />
        <div className="absolute bottom-20 right-1/4 w-28 h-28 bg-gradient-to-br from-green-200/30 to-emerald-200/30 rounded-full blur-xl animate-pulse [animation-delay:1200ms]" />
      </div>

      {/* Navigation Header */}
      <div className="relative z-10 bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link 
              href="/" 
              className="group flex items-center space-x-3 text-amber-700 hover:text-amber-600 transition-all duration-300"
            >
              <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white p-2 rounded-full group-hover:scale-110 transition-transform duration-300">
                <Home className="h-5 w-5" />
              </div>
              <span className="font-semibold text-lg group-hover:translate-x-1 transition-transform duration-300">
                Back to Home
              </span>
            </Link>

            <div className="flex items-center space-x-4">
              <Button
                onClick={handleContactCall}
                className="bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <Phone className="mr-2 h-4 w-4" />
                Call Now
              </Button>
              <Button
                onClick={handleGetConsultation}
                disabled={isSubmitting}
                className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:from-blue-600 hover:to-indigo-600 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <Calendar className="mr-2 h-4 w-4" />
                {isSubmitting ? 'Scheduling...' : 'Free Consultation'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Header */}
      <div className="relative z-10 bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 text-white overflow-hidden">
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1)_0%,transparent_50%)] animate-pulse" />
          <div className="absolute top-0 left-0 w-full h-full bg-[conic-gradient(from_0deg_at_50%_50%,transparent_0deg,rgba(255,255,255,0.1)_45deg,transparent_90deg,rgba(255,255,255,0.1)_135deg,transparent_180deg)] animate-spin [animation-duration:20s]" />
        </div>
        
        <div className="container mx-auto px-4 py-20 relative">
          <div className="text-center max-w-4xl mx-auto">
            {/* Animated Icon */}
            <div className="flex justify-center mb-8">
              <div className="relative">
                <div className="bg-white/20 p-6 rounded-full backdrop-blur-sm animate-bounce [animation-delay:200ms]">
                  <Star className="h-16 w-16" />
                </div>
                <div className="absolute -top-2 -right-2 bg-yellow-400 text-amber-900 p-2 rounded-full animate-pulse [animation-delay:600ms]">
                  <Sparkles className="h-4 w-4" />
                </div>
              </div>
            </div>

            {/* Animated Title */}
            <h1 className="text-5xl md:text-7xl font-bold mb-8 bg-gradient-to-r from-white via-yellow-100 to-white bg-clip-text text-transparent animate-fade-in [animation-delay:300ms]">
              Client Reviews & Testimonials
            </h1>
            
            {/* Animated Subtitle */}
            <p className="text-xl md:text-3xl mb-10 text-amber-100 animate-fade-in [animation-delay:600ms]">
              Real stories from families we&apos;ve had the privilege to serve
            </p>

            {/* Enhanced Rating Display */}
            <div className="flex justify-center items-center space-x-4 mb-8 animate-fade-in [animation-delay:900ms]">
              <div className="flex items-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className="h-10 w-10 text-yellow-300 fill-current animate-pulse"
                    style={{ animationDelay: `${i * 100 + 1000}ms` }}
                  />
                ))}
              </div>
              <div className="text-3xl font-bold bg-white/20 px-4 py-2 rounded-full backdrop-blur-sm">
                {overallStats.averageRating}/5
              </div>
              <div className="flex items-center bg-white/20 px-4 py-2 rounded-full backdrop-blur-sm">
                <TrendingUp className="h-5 w-5 mr-2" />
                <span className="font-semibold">{overallStats.totalReviews}+ Reviews</span>
              </div>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center gap-4 animate-fade-in [animation-delay:1200ms]">
              <Badge className="bg-white/20 text-white border-white/30 px-4 py-2 text-sm backdrop-blur-sm hover:bg-white/30 transition-all duration-300">
                <CheckCircle className="mr-2 h-4 w-4" />
                100% Verified Reviews
              </Badge>
              <Badge className="bg-white/20 text-white border-white/30 px-4 py-2 text-sm backdrop-blur-sm hover:bg-white/30 transition-all duration-300">
                <Award className="mr-2 h-4 w-4" />
                Award-Winning Care
              </Badge>
              <Badge className="bg-white/20 text-white border-white/30 px-4 py-2 text-sm backdrop-blur-sm hover:bg-white/30 transition-all duration-300">
                <Heart className="mr-2 h-4 w-4" />
                Family Trusted
              </Badge>
            </div>
          </div>
        </div>

        {/* Decorative Wave */}
        <div className="absolute bottom-0 left-0 w-full">
          <svg className="relative block w-full h-12" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
                  opacity=".25" fill="currentColor"></path>
            <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z"
                  opacity=".5" fill="currentColor"></path>
            <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z"
                  fill="currentColor"></path>
          </svg>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-20 relative z-10">
        {/* Enhanced Overview Stats */}
        <div className="max-w-6xl mx-auto mb-20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <Card className="group text-center border-0 shadow-xl bg-white/90 backdrop-blur-sm hover:shadow-2xl hover:scale-105 transition-all duration-500 animate-fade-in [animation-delay:100ms]">
              <CardContent className="p-8">
                <div className="text-4xl font-bold text-amber-600 mb-3 group-hover:scale-110 transition-transform duration-300">
                  {overallStats.averageRating}
                </div>
                <div className="text-gray-700 text-sm font-medium mb-3">Average Rating</div>
                <div className="flex justify-center">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className="h-5 w-5 text-yellow-400 fill-current group-hover:animate-pulse"
                      style={{ animationDelay: `${i * 50}ms` }}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="group text-center border-0 shadow-xl bg-white/90 backdrop-blur-sm hover:shadow-2xl hover:scale-105 transition-all duration-500 animate-fade-in [animation-delay:200ms]">
              <CardContent className="p-8">
                <div className="text-4xl font-bold text-blue-600 mb-3 group-hover:scale-110 transition-transform duration-300">
                  {overallStats.totalReviews}
                </div>
                <div className="text-gray-700 text-sm font-medium mb-3">Total Reviews</div>
                <div className="text-green-600 text-xs font-semibold bg-green-50 px-3 py-1 rounded-full">
                  All Verified ✓
                </div>
              </CardContent>
            </Card>

            <Card className="group text-center border-0 shadow-xl bg-white/90 backdrop-blur-sm hover:shadow-2xl hover:scale-105 transition-all duration-500 animate-fade-in [animation-delay:300ms]">
              <CardContent className="p-8">
                <div className="text-4xl font-bold text-green-600 mb-3 group-hover:scale-110 transition-transform duration-300">
                  {overallStats.satisfaction}%
                </div>
                <div className="text-gray-700 text-sm font-medium mb-3">Client Satisfaction</div>
                <div className="text-green-600 text-xs font-semibold bg-green-50 px-3 py-1 rounded-full">
                  Exceeded Expectations
                </div>
              </CardContent>
            </Card>

            <Card className="group text-center border-0 shadow-xl bg-white/90 backdrop-blur-sm hover:shadow-2xl hover:scale-105 transition-all duration-500 animate-fade-in [animation-delay:400ms]">
              <CardContent className="p-8">
                <div className="text-4xl font-bold text-purple-600 mb-3 group-hover:scale-110 transition-transform duration-300">
                  {overallStats.recommendation}%
                </div>
                <div className="text-gray-700 text-sm font-medium mb-3">Would Recommend</div>
                <div className="text-purple-600 text-xs font-semibold bg-purple-50 px-3 py-1 rounded-full">
                  To Family & Friends
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Enhanced Rating Breakdown */}
        <div className="max-w-4xl mx-auto mb-20">
          <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm animate-fade-in [animation-delay:500ms]">
            <CardHeader className="text-center pb-8">
              <div className="flex justify-center mb-4">
                <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white p-3 rounded-full">
                  <TrendingUp className="h-6 w-6" />
                </div>
              </div>
              <CardTitle className="text-3xl font-bold text-gray-900 bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                Rating Breakdown
              </CardTitle>
              <p className="text-gray-600 mt-2">See how our clients rate their experience</p>
            </CardHeader>
            <CardContent className="pb-8">
              <div className="space-y-4">
                {ratingBreakdown.map((rating, index) => (
                  <div key={index} className="flex items-center group hover:bg-amber-50/50 p-3 rounded-lg transition-all duration-300">
                    <div className="flex items-center w-24">
                      <span className="text-lg font-semibold mr-3 text-gray-700 group-hover:text-amber-700">
                        {rating.stars}
                      </span>
                      <Star className="h-5 w-5 text-yellow-400 fill-current group-hover:scale-110 transition-transform duration-300" />
                    </div>
                    <div className="flex-1 mx-6">
                      <div className="bg-gray-200 rounded-full h-3 overflow-hidden">
                        <div 
                          className={`bg-gradient-to-r from-amber-500 to-orange-500 h-3 rounded-full transition-all duration-1000 ease-out group-hover:from-amber-400 group-hover:to-orange-400`}
                          style={{ 
                            width: `min(${rating.percentage}%, 100%)`,
                          }}
                        />
                      </div>
                    </div>
                    <div className="text-lg font-medium text-gray-700 w-24 text-right group-hover:text-amber-700">
                      {rating.count} reviews
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Search and Filter */}
        <div className="max-w-6xl mx-auto mb-16">
          {/* Search Bar */}
          <div className="relative mb-8 animate-fade-in [animation-delay:600ms]">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-6 w-6 group-hover:text-amber-500 transition-colors duration-300" />
              <Input
                type="text"
                placeholder="Search reviews by service, name, or keyword..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 pr-6 py-4 text-lg border-2 border-gray-200 rounded-xl shadow-lg focus:border-amber-500 focus:ring-4 focus:ring-amber-500/20 transition-all duration-300 bg-white/90 backdrop-blur-sm hover:shadow-xl"
              />
              {searchTerm && (
                <Button
                  onClick={() => setSearchTerm('')}
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  ×
                </Button>
              )}
            </div>
          </div>

          {/* Enhanced Service Filter */}
          <div className="animate-fade-in [animation-delay:700ms]">
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Filter by Service Type</h3>
              <p className="text-gray-600">Find reviews for specific care services</p>
            </div>
            <div className="flex flex-wrap gap-3 justify-center">
              {filters.map((filter, index) => (
                <Button
                  key={filter.id}
                  variant={selectedFilter === filter.id ? "default" : "outline"}
                  onClick={() => setSelectedFilter(filter.id)}
                  className={`group relative overflow-hidden transition-all duration-300 transform hover:scale-105 ${
                    selectedFilter === filter.id 
                      ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg hover:shadow-xl" 
                      : "bg-white/90 backdrop-blur-sm border-2 border-gray-200 hover:border-amber-300 hover:bg-amber-50 text-gray-700 hover:text-amber-700 shadow-md hover:shadow-lg"
                  }`}
                  style={{ animationDelay: `${index * 100 + 800}ms` }}
                >
                  <div className="flex items-center space-x-2">
                    <Filter className="h-4 w-4" />
                    <span className="font-medium">{filter.name}</span>
                    <Badge 
                      variant={selectedFilter === filter.id ? "secondary" : "outline"}
                      className={`transition-all duration-300 ${
                        selectedFilter === filter.id 
                          ? "bg-white/20 text-white border-white/30" 
                          : "bg-amber-50 text-amber-700 border-amber-200"
                      }`}
                    >
                      {filter.count}
                    </Badge>
                  </div>
                  
                  {/* Animated Background */}
                  <div className={`absolute inset-0 bg-gradient-to-r from-amber-500/20 to-orange-500/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left ${
                    selectedFilter === filter.id ? 'scale-x-100' : ''
                  }`} />
                </Button>
              ))}
            </div>
            
            {/* Results Count */}
            <div className="text-center mt-6">
              <p className="text-gray-600 bg-white/70 backdrop-blur-sm px-4 py-2 rounded-full inline-block shadow-sm">
                Showing <span className="font-bold text-amber-600">{filteredReviews.length}</span> of <span className="font-bold">{reviews.length}</span> reviews
                {searchTerm && (
                  <span className="ml-2">
                    for &quot;<span className="font-semibold text-amber-700">{searchTerm}</span>&quot;
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Enhanced Reviews Grid */}
        <div className="max-w-6xl mx-auto mb-20">
          <div className="grid lg:grid-cols-2 gap-8">
            {filteredReviews.map((review, index) => (
              <Card 
                key={review.id} 
                className="group border-0 shadow-xl bg-white/90 backdrop-blur-sm hover:shadow-2xl hover:scale-[1.02] transition-all duration-500 animate-fade-in overflow-hidden"
                style={{ animationDelay: `${index * 100 + 900}ms` }}
              >
                {/* Animated Card Header */}
                <CardHeader className="relative">
                  {/* Background Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-50/50 to-orange-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <div className="relative flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      {/* Enhanced Avatar */}
                      <div className="relative">
                        <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white w-14 h-14 rounded-full flex items-center justify-center font-bold text-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                          {review.name.charAt(0)}
                        </div>
                        <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1 shadow-md">
                          {review.verified && (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          )}
                        </div>
                      </div>
                      
                      {/* Enhanced User Info */}
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="font-bold text-lg text-gray-900 group-hover:text-amber-700 transition-colors duration-300">
                            {review.name}
                          </h3>
                          {review.verified && (
                            <Badge className="bg-green-100 text-green-800 text-xs px-2 py-1 animate-pulse">
                              <CheckCircle className="mr-1 h-3 w-3" />
                              Verified
                            </Badge>
                          )}
                        </div>
                        
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <MapPin className="h-4 w-4 text-amber-500" />
                            <span className="font-medium">{review.location}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <Calendar className="h-4 w-4 text-blue-500" />
                            <span>{new Date(review.date).toLocaleDateString('en-US', { 
                              year: 'numeric', 
                              month: 'long', 
                              day: 'numeric' 
                            })}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Service Badge */}
                    <Badge 
                      variant="outline" 
                      className="bg-white/80 border-amber-200 text-amber-700 font-medium shadow-sm group-hover:bg-amber-50 transition-colors duration-300"
                    >
                      {review.serviceLabel}
                    </Badge>
                  </div>
                  
                  {/* Enhanced Rating Display */}
                  <div className="relative mt-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`h-5 w-5 transition-all duration-300 group-hover:scale-110 ${
                                i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                              }`}
                              style={{ animationDelay: `${i * 50}ms` }}
                            />
                          ))}
                        </div>
                        <span className="text-lg font-bold text-gray-700 bg-gray-100 px-3 py-1 rounded-full">
                          {review.rating}/5
                        </span>
                      </div>
                    </div>
                    
                    {/* Review Title */}
                    <CardTitle className="text-xl font-bold text-gray-900 mt-3 group-hover:text-amber-800 transition-colors duration-300">
                      {review.title}
                    </CardTitle>
                  </div>
                </CardHeader>
                
                {/* Enhanced Card Content */}
                <CardContent className="relative">
                  {/* Quote Design */}
                  <div className="relative mb-6">
                    <Quote className="absolute -top-2 -left-2 h-8 w-8 text-amber-300/60 group-hover:text-amber-400/80 transition-colors duration-300" />
                    <div className="bg-gradient-to-r from-gray-50 to-amber-50/30 p-6 rounded-xl border-l-4 border-amber-400 shadow-inner">
                      <p className="text-gray-700 leading-relaxed font-medium italic pl-6 group-hover:text-gray-800 transition-colors duration-300">
                        {review.review}
                      </p>
                    </div>
                  </div>
                  
                  {/* Enhanced Footer */}
                  <div className="space-y-3 pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 text-sm">
                        <div className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-medium">
                          <span>Caregiver: {review.caregiver}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600 bg-gray-50 px-3 py-1 rounded-full group-hover:bg-gray-100 transition-colors duration-300">
                        <ThumbsUp className="h-4 w-4 text-green-600" />
                        <span className="font-medium">{review.helpful} found helpful</span>
                      </div>
                    </div>
                    
                    {/* Social Sharing Buttons */}
                    <div className="flex items-center justify-between pt-2">
                      <span className="text-sm text-gray-600 font-medium">Share this review:</span>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleSocialShare('facebook', review.title)}
                          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 transition-all duration-300"
                        >
                          <Facebook className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleSocialShare('twitter', review.title)}
                          className="text-sky-600 hover:text-sky-700 hover:bg-sky-50 transition-all duration-300"
                        >
                          <Twitter className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleSocialShare('instagram', review.title)}
                          className="text-pink-600 hover:text-pink-700 hover:bg-pink-50 transition-all duration-300"
                        >
                          <Instagram className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>

                {/* Hover Effect Border */}
                <div className="absolute inset-0 border-2 border-transparent group-hover:border-amber-200 rounded-lg transition-colors duration-300 pointer-events-none" />
              </Card>
            ))}
          </div>

          {/* No Results Message */}
          {filteredReviews.length === 0 && (
            <div className="text-center py-16 animate-fade-in">
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-8 shadow-lg max-w-md mx-auto">
                <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Reviews Found</h3>
                <p className="text-gray-600 mb-4">
                  No reviews match your search criteria. Try adjusting your filters or search terms.
                </p>
                <Button 
                  onClick={() => {
                    setSearchTerm('')
                    setSelectedFilter('all')
                  }}
                  className="bg-gradient-to-r from-amber-500 to-orange-500 text-white"
                >
                  Clear Filters
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Enhanced Awards and Recognition */}
        <div className="max-w-4xl mx-auto mb-20">
          <Card className="border-0 shadow-xl bg-gradient-to-br from-amber-50 via-white to-orange-50 overflow-hidden animate-fade-in [animation-delay:1000ms]">
            <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 to-orange-500/5" />
            <CardHeader className="text-center pb-8 relative">
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white p-4 rounded-full shadow-lg animate-bounce [animation-delay:1200ms]">
                    <Award className="h-10 w-10" />
                  </div>
                  <div className="absolute -top-2 -right-2 bg-yellow-400 text-amber-900 p-1 rounded-full animate-pulse [animation-delay:1400ms]">
                    <Sparkles className="h-4 w-4" />
                  </div>
                </div>
              </div>
              <CardTitle className="text-3xl font-bold text-gray-900 bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent mb-3">
                Awards & Recognition
              </CardTitle>
              <p className="text-gray-600 text-lg">
                Recognized excellence in home care services
              </p>
            </CardHeader>
            <CardContent className="relative">
              <div className="grid md:grid-cols-3 gap-8 text-center">
                <div className="group space-y-3 p-6 rounded-xl bg-white/50 backdrop-blur-sm shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105">
                  <div className="text-3xl font-bold text-amber-600 group-hover:scale-110 transition-transform duration-300">
                    2024
                  </div>
                  <div className="font-bold text-gray-900 text-lg">Best New Home Care Agency</div>
                  <div className="text-sm text-gray-600 bg-amber-50 px-3 py-1 rounded-full">
                    Hampton Roads Health Awards
                  </div>
                </div>
                <div className="group space-y-3 p-6 rounded-xl bg-white/50 backdrop-blur-sm shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105">
                  <div className="text-3xl font-bold text-orange-600 group-hover:scale-110 transition-transform duration-300">
                    4.8/5
                  </div>
                  <div className="font-bold text-gray-900 text-lg">Google Reviews Rating</div>
                  <div className="text-sm text-gray-600 bg-orange-50 px-3 py-1 rounded-full">
                    Based on 100+ reviews
                  </div>
                </div>
                <div className="group space-y-3 p-6 rounded-xl bg-white/50 backdrop-blur-sm shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105">
                  <div className="text-3xl font-bold text-purple-600 group-hover:scale-110 transition-transform duration-300">
                    98%
                  </div>
                  <div className="font-bold text-gray-900 text-lg">Client Satisfaction</div>
                  <div className="text-sm text-gray-600 bg-purple-50 px-3 py-1 rounded-full">
                    2024 Client Survey
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Write a Review Section */}
        <div className="max-w-4xl mx-auto mb-20">
          <Card className="border-0 shadow-xl bg-gradient-to-br from-blue-50 via-white to-indigo-50 overflow-hidden animate-fade-in [animation-delay:1100ms]">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-indigo-500/5" />
            
            <CardContent className="p-10 text-center relative">
              {/* Floating Elements */}
              <div className="absolute top-6 left-6 w-8 h-8 bg-blue-200/30 rounded-full animate-pulse [animation-delay:1300ms]" />
              <div className="absolute bottom-6 right-6 w-6 h-6 bg-indigo-200/30 rounded-full animate-pulse [animation-delay:1500ms]" />
              
              <div className="flex justify-center mb-8">
                <div className="relative">
                  <div className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white p-5 rounded-full shadow-lg animate-bounce [animation-delay:1200ms]">
                    <MessageCircle className="h-10 w-10" />
                  </div>
                  <div className="absolute -top-2 -right-2 bg-green-400 text-white p-1 rounded-full animate-pulse [animation-delay:1400ms]">
                    <PenTool className="h-4 w-4" />
                  </div>
                </div>
              </div>
              
              <h2 className="text-3xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Share Your Experience
              </h2>
              <p className="text-gray-700 mb-8 max-w-2xl mx-auto text-lg leading-relaxed">
                We&apos;d love to hear about your experience with Caring Compass Home Care. 
                Your feedback helps us improve our services and helps other families make 
                informed decisions about their care needs.
              </p>
              
              {!isWritingReview ? (
                <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
                  <Button 
                    size="lg" 
                    onClick={handleWriteReview}
                    className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white flex-1 hover:from-blue-600 hover:to-indigo-600 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    <Star className="mr-2 h-5 w-5" />
                    Write a Review
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline" 
                    onClick={handleShareStory}
                    disabled={isSubmitting}
                    className="border-2 border-blue-500 text-blue-600 hover:bg-blue-50 flex-1 transform hover:scale-105 transition-all duration-300 shadow-md hover:shadow-lg"
                  >
                    <Heart className="mr-2 h-5 w-5" />
                    {isSubmitting ? 'Submitting...' : 'Share Story'}
                  </Button>
                </div>
              ) : (
                /* Review Form */
                <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      placeholder="Your Name"
                      value={newReview.name}
                      onChange={(e) => setNewReview({...newReview, name: e.target.value})}
                      className="border-2 border-gray-200 focus:border-blue-500 rounded-lg"
                    />
                    <Input
                      type="email"
                      placeholder="Your Email"
                      value={newReview.email}
                      onChange={(e) => setNewReview({...newReview, email: e.target.value})}
                      className="border-2 border-gray-200 focus:border-blue-500 rounded-lg"
                    />
                  </div>
                  
                  <Input
                    placeholder="Review Title"
                    value={newReview.title}
                    onChange={(e) => setNewReview({...newReview, title: e.target.value})}
                    className="border-2 border-gray-200 focus:border-blue-500 rounded-lg"
                  />
                  
                  <div className="text-left">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                    <div className="flex space-x-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setNewReview({...newReview, rating: star})}
                          className="p-1 hover:scale-110 transition-transform duration-200"
                          aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
                          title={`Rate ${star} star${star > 1 ? 's' : ''}`}
                        >
                          <Star
                            className={`h-8 w-8 ${
                              star <= newReview.rating 
                                ? 'text-yellow-400 fill-current' 
                                : 'text-gray-300'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <Textarea
                    placeholder="Share your experience with our care services..."
                    value={newReview.review}
                    onChange={(e) => setNewReview({...newReview, review: e.target.value})}
                    rows={4}
                    className="border-2 border-gray-200 focus:border-blue-500 rounded-lg resize-none"
                  />
                  
                  <div className="flex gap-3 justify-center">
                    <Button
                      onClick={handleSubmitReview}
                      className="bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600 transform hover:scale-105 transition-all duration-300"
                    >
                      <Send className="mr-2 h-4 w-4" />
                      Submit Review
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setIsWritingReview(false)}
                      className="border-gray-300 text-gray-600 hover:bg-gray-50"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
              
              <p className="text-gray-600 mt-6 text-sm bg-white/70 backdrop-blur-sm px-4 py-2 rounded-full inline-block">
                Reviews are verified • Help other families • Make a difference
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Contact CTA */}
        <div className="max-w-4xl mx-auto">
          <Card className="border-0 shadow-2xl bg-gradient-to-br from-amber-600 via-orange-600 to-amber-700 text-white overflow-hidden animate-fade-in [animation-delay:1200ms]">
            {/* Animated Background */}
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-0 left-0 w-32 h-32 bg-white/20 rounded-full -translate-x-16 -translate-y-16 animate-pulse [animation-delay:1400ms]" />
              <div className="absolute bottom-0 right-0 w-24 h-24 bg-white/20 rounded-full translate-x-12 translate-y-12 animate-pulse [animation-delay:1600ms]" />
              <div className="absolute top-1/2 left-1/2 w-40 h-40 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2 animate-pulse [animation-delay:1800ms]" />
            </div>

            <CardContent className="p-10 text-center relative">
              {/* Floating Hearts */}
              <div className="absolute top-8 left-8 animate-bounce [animation-delay:2000ms]">
                <Heart className="h-6 w-6 text-pink-300/60" />
              </div>
              <div className="absolute top-12 right-12 animate-bounce [animation-delay:2200ms]">
                <Heart className="h-4 w-4 text-pink-300/40" />
              </div>
              
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <div className="bg-white/20 p-4 rounded-full backdrop-blur-sm animate-pulse [animation-delay:1400ms]">
                    <Phone className="h-12 w-12" />
                  </div>
                  <div className="absolute -top-2 -right-2 bg-green-400 text-white p-2 rounded-full animate-bounce [animation-delay:1600ms]">
                    <CheckCircle className="h-4 w-4" />
                  </div>
                </div>
              </div>
              
              <h2 className="text-3xl md:text-4xl font-bold mb-4 animate-fade-in [animation-delay:1500ms]">
                Ready to Experience Exceptional Care?
              </h2>
              <p className="text-xl md:text-2xl mb-10 text-amber-100 leading-relaxed animate-fade-in [animation-delay:1700ms]">
                Join the families who trust Caring Compass with their most precious relationships
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6 justify-center max-w-md mx-auto mb-8 animate-fade-in [animation-delay:1900ms]">
                <Button 
                  size="lg" 
                  onClick={handleContactCall}
                  className="bg-white text-amber-600 hover:bg-amber-50 flex-1 font-bold text-lg py-4 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  <Phone className="mr-3 h-6 w-6" />
                  Call (757) 555-CARE
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  onClick={handleGetConsultation}
                  disabled={isSubmitting}
                  className="border-2 border-white text-white hover:bg-white/10 flex-1 font-bold text-lg py-4 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl backdrop-blur-sm"
                >
                  <Mail className="mr-3 h-6 w-6" />
                  {isSubmitting ? 'Scheduling...' : 'Free Consultation'}
                </Button>
              </div>
              
              {/* Enhanced Trust Indicators */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center animate-fade-in [animation-delay:2100ms]">
                <div className="bg-white/10 backdrop-blur-sm px-4 py-3 rounded-lg">
                  <div className="font-bold text-lg">Free consultation</div>
                  <div className="text-amber-100 text-sm">No obligation assessment</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm px-4 py-3 rounded-lg">
                  <div className="font-bold text-lg">Same-day response</div>
                  <div className="text-amber-100 text-sm">Quick care coordination</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm px-4 py-3 rounded-lg">
                  <div className="font-bold text-lg">Licensed & insured</div>
                  <div className="text-amber-100 text-sm">Fully bonded caregivers</div>
                </div>
              </div>
            </CardContent>

            {/* Decorative Bottom Wave */}
            <div className="absolute bottom-0 left-0 w-full">
              <svg className="relative block w-full h-8" viewBox="0 0 1200 120" preserveAspectRatio="none">
                <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
                      opacity=".3" fill="currentColor"></path>
              </svg>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}