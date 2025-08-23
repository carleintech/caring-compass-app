'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { 
  Star, 
  Heart, 
  Quote, 
  Users, 
  Award, 
  ThumbsUp,
  MessageCircle,
  Filter,
  Search,
  Phone,
  Mail,
  MapPin,
  Calendar,
  CheckCircle
} from 'lucide-react'

export default function ReviewsPage() {
  const [selectedFilter, setSelectedFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

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
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-600 to-orange-600 text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center max-w-4xl mx-auto">
            <div className="flex justify-center mb-6">
              <div className="bg-white/20 p-4 rounded-full">
                <Star className="h-12 w-12" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Client Reviews & Testimonials
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-amber-100">
              Real stories from families we&apos;ve had the privilege to serve
            </p>
            <div className="flex justify-center items-center space-x-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-8 w-8 text-yellow-300 fill-current" />
              ))}
              <span className="text-2xl font-bold ml-4">{overallStats.averageRating}/5</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16">
        {/* Overview Stats */}
        <div className="max-w-6xl mx-auto mb-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <Card className="text-center border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="text-3xl font-bold text-amber-600 mb-2">{overallStats.averageRating}</div>
                <div className="text-gray-700 text-sm">Average Rating</div>
                <div className="flex justify-center mt-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card className="text-center border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="text-3xl font-bold text-blue-600 mb-2">{overallStats.totalReviews}</div>
                <div className="text-gray-700 text-sm">Total Reviews</div>
                <div className="text-green-600 text-xs mt-1">All Verified</div>
              </CardContent>
            </Card>
            <Card className="text-center border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="text-3xl font-bold text-green-600 mb-2">{overallStats.satisfaction}%</div>
                <div className="text-gray-700 text-sm">Client Satisfaction</div>
                <div className="text-green-600 text-xs mt-1">Exceeded Expectations</div>
              </CardContent>
            </Card>
            <Card className="text-center border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="text-3xl font-bold text-purple-600 mb-2">{overallStats.recommendation}%</div>
                <div className="text-gray-700 text-sm">Would Recommend</div>
                <div className="text-purple-600 text-xs mt-1">To Family & Friends</div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Rating Breakdown */}
        <div className="max-w-4xl mx-auto mb-16">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-gray-900 text-center">
                Rating Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {ratingBreakdown.map((rating, index) => (
                  <div key={index} className="flex items-center">
                    <div className="flex items-center w-20">
                      <span className="text-sm font-medium mr-2">{rating.stars}</span>
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    </div>
                    <div className="flex-1 mx-4">
                      <div className="bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-amber-500 to-orange-500 h-2 rounded-full"
                          style={{ width: `${rating.percentage}%` }}
                        />
                      </div>
                    </div>
                    <div className="text-sm text-gray-600 w-16 text-right">
                      {rating.count} reviews
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter */}
        <div className="max-w-6xl mx-auto mb-12">
          {/* Search Bar */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              type="text"
              placeholder="Search reviews by service, name, or keyword..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-3 text-lg"
            />
          </div>

          {/* Service Filter */}
          <div className="flex flex-wrap gap-2 justify-center">
            {filters.map((filter) => (
              <Button
                key={filter.id}
                variant={selectedFilter === filter.id ? "default" : "outline"}
                onClick={() => setSelectedFilter(filter.id)}
                className={`${
                  selectedFilter === filter.id 
                    ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white" 
                    : "hover:bg-amber-50"
                }`}
              >
                <Filter className="mr-2 h-4 w-4" />
                {filter.name}
                <Badge variant="secondary" className="ml-2">
                  {filter.count}
                </Badge>
              </Button>
            ))}
          </div>
        </div>

        {/* Reviews Grid */}
        <div className="max-w-6xl mx-auto mb-16">
          <div className="grid lg:grid-cols-2 gap-8">
            {filteredReviews.map((review) => (
              <Card key={review.id} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white w-12 h-12 rounded-full flex items-center justify-center font-semibold text-lg">
                        {review.name.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="font-semibold text-gray-900">{review.name}</h3>
                          {review.verified && (
                            <Badge className="bg-green-100 text-green-800 text-xs">
                              <CheckCircle className="mr-1 h-3 w-3" />
                              Verified
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center space-x-2 mt-1">
                          <MapPin className="h-3 w-3 text-gray-500" />
                          <span className="text-gray-600 text-sm">{review.location}</span>
                        </div>
                        <div className="flex items-center space-x-2 mt-1">
                          <Calendar className="h-3 w-3 text-gray-500" />
                          <span className="text-gray-600 text-sm">{new Date(review.date).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {review.serviceLabel}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center space-x-2 mt-3">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`h-4 w-4 ${
                            i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                          }`} 
                        />
                      ))}
                    </div>
                    <span className="text-sm font-medium text-gray-700">{review.rating}/5</span>
                  </div>
                  
                  <CardTitle className="text-lg font-bold text-gray-900 mt-2">
                    {review.title}
                  </CardTitle>
                </CardHeader>
                
                <CardContent>
                  <div className="relative">
                    <Quote className="absolute top-0 left-0 h-6 w-6 text-amber-300 opacity-50" />
                    <p className="text-gray-700 leading-relaxed pl-8 italic">
                      {review.review}
                    </p>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-600">
                        <span className="font-medium">Caregiver:</span> {review.caregiver}
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <ThumbsUp className="h-4 w-4" />
                        <span>{review.helpful} found helpful</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Awards and Recognition */}
        <div className="max-w-4xl mx-auto mb-16">
          <Card className="border-0 shadow-lg bg-gradient-to-r from-amber-50 to-orange-50">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white p-3 rounded-full">
                  <Award className="h-8 w-8" />
                </div>
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900">
                Awards & Recognition
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6 text-center">
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-amber-600">2024</div>
                  <div className="font-semibold text-gray-900">Best New Home Care Agency</div>
                  <div className="text-sm text-gray-600">Hampton Roads Health Awards</div>
                </div>
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-orange-600">4.8/5</div>
                  <div className="font-semibold text-gray-900">Google Reviews Rating</div>
                  <div className="text-sm text-gray-600">Based on 100+ reviews</div>
                </div>
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-purple-600">98%</div>
                  <div className="font-semibold text-gray-900">Client Satisfaction</div>
                  <div className="text-sm text-gray-600">2024 Client Survey</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Write a Review CTA */}
        <div className="max-w-4xl mx-auto mb-16">
          <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-50 to-indigo-50">
            <CardContent className="p-8 text-center">
              <div className="flex justify-center mb-6">
                <div className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white p-4 rounded-full">
                  <MessageCircle className="h-8 w-8" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Share Your Experience
              </h2>
              <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
                We&apos;d love to hear about your experience with Caring Compass Home Care. 
                Your feedback helps us improve our services and helps other families make 
                informed decisions about their care needs.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
                <Button size="lg" className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white flex-1">
                  <Star className="mr-2 h-5 w-5" />
                  Write a Review
                </Button>
                <Button size="lg" variant="outline" className="border-blue-500 text-blue-600 hover:bg-blue-50 flex-1">
                  <Heart className="mr-2 h-5 w-5" />
                  Share Story
                </Button>
              </div>
              
              <p className="text-gray-600 mt-4 text-sm">
                Reviews are verified • Help other families • Make a difference
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Contact CTA */}
        <div className="max-w-4xl mx-auto">
          <Card className="border-0 shadow-lg bg-gradient-to-r from-amber-600 to-orange-600 text-white">
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold mb-4">
                Ready to Experience Exceptional Care?
              </h2>
              <p className="text-xl mb-8 text-amber-100">
                Join the families who trust Caring Compass with their most precious relationships
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
                <Button size="lg" className="bg-white text-amber-600 hover:bg-amber-50 flex-1">
                  <Phone className="mr-2 h-5 w-5" />
                  Call (757) 555-CARE
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 flex-1">
                  <Mail className="mr-2 h-5 w-5" />
                  Get Free Consultation
                </Button>
              </div>
              <p className="text-amber-100 mt-4 text-sm">
                Free consultation • Same-day response • Licensed & insured
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}