'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { useToast } from '@/components/ui/use-toast'
import { useServices } from '@/hooks/use-services'
import { 
  BookOpen, 
  Calendar, 
  User, 
  Clock, 
  Search, 
  Filter,
  Heart,
  Home,
  Shield,
  Users,
  Brain,
  Stethoscope,
  Phone,
  Mail,
  ArrowRight,
  Tag,
  TrendingUp,
  MessageCircle,
  Sparkles,
  Star,
  Award,
  Send,
  Bookmark,
  Share2,
  Eye,
  ThumbsUp,
  Download,
  Bell,
  CheckCircle,
  Crown,
  HeartHandshake
} from 'lucide-react'

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [email, setEmail] = useState('')
  const [bookmarkedPosts, setBookmarkedPosts] = useState(new Set())

  const { toast } = useToast()
  const { 
    speakWithCoordinator,
    scheduleConsultation,
    isSubmitting 
  } = useServices()

  const handleContactCall = () => {
    window.location.href = 'tel:+17575552273'
    toast({
      title: "Calling Caring Compass! 📞",
      description: "You're being connected to our care coordinators."
    })
  }

  const handleEmailContact = async () => {
    try {
      await speakWithCoordinator({
        name: 'Blog Visitor',
        email: '',
        phone: '',
        reason: 'I have questions about care services after reading your blog',
        urgency: 'low'
      })
    } catch (error) {
      console.error('Error submitting contact request:', error)
    }
  }

  const handleNewsletterSignup = () => {
    if (!email) {
      toast({
        title: "Please enter your email",
        description: "We need your email address to send you updates."
      })
      return
    }

    toast({
      title: "Successfully Subscribed! 🎉",
      description: "You'll receive our latest caregiving tips and insights."
    })
    setEmail('')
  }

  const handleReadArticle = (postId: number, title: string) => {
    toast({
      title: `Opening: ${title} 📖`,
      description: "Redirecting you to the full article..."
    })
    // Here you would typically navigate to the full article
  }

  const handleBookmarkPost = (postId: number) => {
    const newBookmarks = new Set(bookmarkedPosts)
    if (newBookmarks.has(postId)) {
      newBookmarks.delete(postId)
      toast({
        title: "Bookmark Removed 📌",
        description: "Article removed from your reading list."
      })
    } else {
      newBookmarks.add(postId)
      toast({
        title: "Article Bookmarked! 🔖",
        description: "Added to your reading list for later."
      })
    }
    setBookmarkedPosts(newBookmarks)
  }

  const handleSharePost = (title: string) => {
    if (navigator.share) {
      navigator.share({
        title: title,
        text: 'Check out this helpful article from Caring Compass',
        url: window.location.href
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast({
        title: "Link Copied! 🔗",
        description: "Article link copied to clipboard for sharing."
      })
    }
  }

  const categories = [
    { id: 'all', name: 'All Posts', count: 24, icon: <BookOpen className="h-4 w-4" /> },
    { id: 'caregiving-tips', name: 'Caregiving Tips', count: 8, icon: <Heart className="h-4 w-4" /> },
    { id: 'aging-in-place', name: 'Aging in Place', count: 6, icon: <Home className="h-4 w-4" /> },
    { id: 'health-wellness', name: 'Health & Wellness', count: 5, icon: <Stethoscope className="h-4 w-4" /> },
    { id: 'family-support', name: 'Family Support', count: 3, icon: <Users className="h-4 w-4" /> },
    { id: 'safety', name: 'Safety & Security', count: 2, icon: <Shield className="h-4 w-4" /> }
  ]

  const featuredPost = {
    id: 1,
    title: "The Ultimate Guide to Aging in Place: Making Your Home Safe and Comfortable",
    excerpt: "Discover practical tips and modifications that can help your loved one stay in their home safely and comfortably for years to come.",
    category: "aging-in-place",
    categoryLabel: "Aging in Place",
    author: "Dr. Sarah Mitchell",
    authorRole: "Geriatrician & Home Care Consultant",
    date: "2024-08-15",
    readTime: "8 min read",
    image: "/api/placeholder/600/300",
    tags: ["Home Safety", "Modifications", "Independence", "Senior Living"],
    featured: true,
    views: 2847,
    likes: 142,
    shares: 38
  }

  const blogPosts = [
    {
      id: 2,
      title: "10 Warning Signs Your Parent May Need Home Care",
      excerpt: "Learn to recognize the subtle signs that indicate your aging parent might benefit from professional home care assistance.",
      category: "caregiving-tips",
      categoryLabel: "Caregiving Tips",
      author: "Lisa Thompson, RN",
      authorRole: "Care Coordinator",
      date: "2024-08-12",
      readTime: "6 min read",
      image: "/api/placeholder/400/250",
      tags: ["Warning Signs", "Assessment", "Family Caregiving"],
      popular: true,
      views: 1924,
      likes: 89,
      shares: 24
    },
    {
      id: 3,
      title: "Creating a Dementia-Friendly Home Environment",
      excerpt: "Simple modifications and strategies to create a safe, comfortable environment for someone living with dementia or Alzheimer's.",
      category: "health-wellness",
      categoryLabel: "Health & Wellness",
      author: "Michael Rodriguez",
      authorRole: "Dementia Care Specialist",
      date: "2024-08-08",
      readTime: "7 min read",
      image: "/api/placeholder/400/250", 
      tags: ["Dementia", "Home Environment", "Safety", "Memory Care"],
      views: 1567,
      likes: 73,
      shares: 19
    },
    {
      id: 4,
      title: "How to Choose the Right Home Care Agency",
      excerpt: "A comprehensive checklist to help you evaluate and select the best home care provider for your family's unique needs.",
      category: "family-support",
      categoryLabel: "Family Support",
      author: "Patricia Williams",
      authorRole: "Family Care Advocate",
      date: "2024-08-05",
      readTime: "10 min read",
      image: "/api/placeholder/400/250",
      tags: ["Choosing Care", "Quality Assessment", "Questions to Ask"],
      views: 2103,
      likes: 156,
      shares: 45
    },
    {
      id: 5,
      title: "Preventing Falls at Home: A Comprehensive Safety Guide",
      excerpt: "Essential fall prevention strategies and home modifications to keep your loved one safe and independent.",
      category: "safety",
      categoryLabel: "Safety & Security",
      author: "Dr. Jennifer Clark",
      authorRole: "Physical Therapist",
      date: "2024-08-01",
      readTime: "9 min read",
      image: "/api/placeholder/400/250",
      tags: ["Fall Prevention", "Home Safety", "Mobility", "Independence"],
      views: 1834,
      likes: 97,
      shares: 31
    },
    {
      id: 6,
      title: "Nutrition for Seniors: Meal Planning and Preparation Tips",
      excerpt: "Practical advice for ensuring proper nutrition and hydration for seniors, including easy meal ideas and preparation tips.",
      category: "health-wellness",
      categoryLabel: "Health & Wellness",
      author: "Amanda Foster, RD",
      authorRole: "Registered Dietitian",
      date: "2024-07-28",
      readTime: "8 min read",
      image: "/api/placeholder/400/250",
      tags: ["Nutrition", "Meal Planning", "Senior Health", "Cooking Tips"],
      views: 1456,
      likes: 68,
      shares: 22
    },
    {
      id: 7,
      title: "Managing Caregiver Stress and Burnout",
      excerpt: "Recognize the signs of caregiver burnout and learn practical strategies for maintaining your own health and wellbeing.",
      category: "caregiving-tips",
      categoryLabel: "Caregiving Tips", 
      author: "Robert Chen, LCSW",
      authorRole: "Licensed Clinical Social Worker",
      date: "2024-07-25",
      readTime: "7 min read",
      image: "/api/placeholder/400/250",
      tags: ["Caregiver Stress", "Self-Care", "Mental Health", "Support"],
      views: 1789,
      likes: 124,
      shares: 36
    },
    {
      id: 8,
      title: "Technology Tools for Aging in Place",
      excerpt: "Explore helpful technology solutions that can enhance safety, communication, and independence for seniors at home.",
      category: "aging-in-place",
      categoryLabel: "Aging in Place",
      author: "David Thompson",
      authorRole: "Senior Technology Specialist",
      date: "2024-07-22",
      readTime: "6 min read",
      image: "/api/placeholder/400/250",
      tags: ["Technology", "Smart Home", "Safety Devices", "Communication"],
      views: 1345,
      likes: 58,
      shares: 17
    },
    {
      id: 9,
      title: "Understanding Medicare and Home Care Coverage",
      excerpt: "Navigate the complexities of Medicare coverage for home care services and learn about alternative payment options.",
      category: "family-support",
      categoryLabel: "Family Support",
      author: "Susan Martinez",
      authorRole: "Healthcare Finance Advisor",
      date: "2024-07-18",
      readTime: "12 min read",
      image: "/api/placeholder/400/250",
      tags: ["Medicare", "Insurance", "Payment Options", "Healthcare Costs"],
      views: 2234,
      likes: 178,
      shares: 52
    }
  ]

  const filteredPosts = blogPosts.filter(post => {
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    return matchesCategory && matchesSearch
  })

  const popularTags = [
    "Home Safety", "Caregiving", "Aging in Place", "Dementia Care", "Fall Prevention",
    "Family Support", "Medicare", "Technology", "Nutrition", "Independence"
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 relative overflow-hidden">
      {/* Floating Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-40 h-40 bg-gradient-to-br from-emerald-200/30 to-blue-200/30 rounded-full blur-xl animate-pulse [animation-delay:0ms]" />
        <div className="absolute top-60 right-20 w-32 h-32 bg-gradient-to-br from-purple-200/30 to-pink-200/30 rounded-full blur-xl animate-pulse [animation-delay:400ms]" />
        <div className="absolute bottom-40 left-1/4 w-48 h-48 bg-gradient-to-br from-yellow-200/30 to-orange-200/30 rounded-full blur-xl animate-pulse [animation-delay:800ms]" />
        <div className="absolute bottom-20 right-1/3 w-36 h-36 bg-gradient-to-br from-indigo-200/30 to-cyan-200/30 rounded-full blur-xl animate-pulse [animation-delay:1200ms]" />
      </div>

      {/* Navigation Header */}
      <div className="relative z-10 bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link 
              href="/" 
              className="group flex items-center space-x-3 text-emerald-700 hover:text-emerald-600 transition-all duration-300"
            >
              <div className="bg-gradient-to-r from-emerald-500 to-blue-500 text-white p-3 rounded-full group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Home className="h-6 w-6" />
              </div>
              <span className="font-bold text-xl group-hover:translate-x-1 transition-transform duration-300">
                Back to Home
              </span>
            </Link>

            <div className="flex items-center space-x-4">
              <Button
                onClick={handleContactCall}
                className="bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <Phone className="mr-2 h-5 w-5" />
                Call Now
              </Button>
              <Button
                onClick={handleEmailContact}
                disabled={isSubmitting}
                className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:from-blue-600 hover:to-indigo-600 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <Mail className="mr-2 h-5 w-5" />
                {isSubmitting ? 'Connecting...' : 'Contact Us'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Header */}
      <div className="relative z-10 bg-gradient-to-r from-emerald-600 via-blue-600 to-emerald-700 text-white overflow-hidden">
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1)_0%,transparent_50%)] animate-pulse" />
          <div className="absolute top-0 left-0 w-full h-full bg-[conic-gradient(from_0deg_at_50%_50%,transparent_0deg,rgba(255,255,255,0.1)_45deg,transparent_90deg,rgba(255,255,255,0.1)_135deg,transparent_180deg)] animate-spin [animation-duration:25s]" />
        </div>
        
        <div className="container mx-auto px-4 py-20 relative">
          <div className="text-center max-w-4xl mx-auto">
            {/* Animated Icon with floating elements */}
            <div className="flex justify-center mb-8">
              <div className="relative">
                <div className="bg-white/20 p-6 rounded-full backdrop-blur-sm animate-bounce [animation-delay:200ms] shadow-2xl">
                  <BookOpen className="h-16 w-16" />
                </div>
                <div className="absolute -top-3 -right-3 bg-yellow-400 text-emerald-900 p-2 rounded-full animate-pulse [animation-delay:600ms]">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div className="absolute -bottom-2 -left-2 bg-pink-400 text-white p-2 rounded-full animate-pulse [animation-delay:800ms]">
                  <Award className="h-4 w-4" />
                </div>
              </div>
            </div>

            {/* Animated Title */}
            <h1 className="text-5xl md:text-7xl font-bold mb-8 bg-gradient-to-r from-white via-emerald-100 to-blue-100 bg-clip-text text-transparent animate-fade-in [animation-delay:300ms]">
              Blog & Resources
            </h1>
            
            {/* Animated Subtitle */}
            <p className="text-xl md:text-3xl mb-10 text-emerald-100 animate-fade-in [animation-delay:600ms] leading-relaxed">
              Expert insights, practical tips, and guidance for families navigating home care
            </p>

            {/* Enhanced Stats Display */}
            <div className="flex justify-center items-center space-x-6 mb-8 animate-fade-in [animation-delay:900ms]">
              <div className="flex items-center bg-white/20 px-4 py-2 rounded-full backdrop-blur-sm">
                <BookOpen className="h-5 w-5 mr-2" />
                <span className="font-semibold">24+ Articles</span>
              </div>
              <div className="flex items-center bg-white/20 px-4 py-2 rounded-full backdrop-blur-sm">
                <Users className="h-5 w-5 mr-2" />
                <span className="font-semibold">Expert Authors</span>
              </div>
              <div className="flex items-center bg-white/20 px-4 py-2 rounded-full backdrop-blur-sm">
                <TrendingUp className="h-5 w-5 mr-2" />
                <span className="font-semibold">Weekly Updates</span>
              </div>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center gap-4 animate-fade-in [animation-delay:1200ms]">
              <Badge className="bg-white/20 text-white border-white/30 px-4 py-2 text-sm backdrop-blur-sm hover:bg-white/30 transition-all duration-300">
                <Heart className="mr-2 h-4 w-4" />
                Family-Focused Content
              </Badge>
              <Badge className="bg-white/20 text-white border-white/30 px-4 py-2 text-sm backdrop-blur-sm hover:bg-white/30 transition-all duration-300">
                <Stethoscope className="mr-2 h-4 w-4" />
                Medically Reviewed
              </Badge>
              <Badge className="bg-white/20 text-white border-white/30 px-4 py-2 text-sm backdrop-blur-sm hover:bg-white/30 transition-all duration-300">
                <Shield className="mr-2 h-4 w-4" />
                Evidence-Based
              </Badge>
            </div>
          </div>
        </div>

        {/* Decorative Wave */}
        <div className="absolute bottom-0 left-0 w-full">
          <svg className="relative block w-full h-16" viewBox="0 0 1200 120" preserveAspectRatio="none">
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
        {/* Enhanced Featured Post */}
        <div className="max-w-6xl mx-auto mb-20">
          <div className="text-center mb-12 animate-fade-in [animation-delay:100ms]">
            <Badge className="bg-gradient-to-r from-emerald-500 to-blue-500 text-white text-lg px-6 py-3 mb-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <TrendingUp className="mr-2 h-5 w-5" />
              Featured Article of the Week
            </Badge>
            <h2 className="text-2xl font-bold text-gray-700 mb-2">Most Popular This Week</h2>
            <p className="text-gray-600">Our top-rated article helping families nationwide</p>
          </div>
          
          <Card className="group border-0 shadow-2xl overflow-hidden bg-white/90 backdrop-blur-sm hover:shadow-3xl transition-all duration-500 animate-fade-in [animation-delay:200ms]">
            <div className="grid lg:grid-cols-2 gap-0">
              {/* Content Side */}
              <div className="bg-gradient-to-br from-emerald-50 via-white to-blue-50 p-12 flex items-center relative overflow-hidden">
                {/* Floating elements */}
                <div className="absolute top-6 right-6 w-12 h-12 bg-emerald-200/30 rounded-full animate-pulse [animation-delay:1000ms]" />
                <div className="absolute bottom-8 left-8 w-8 h-8 bg-blue-200/30 rounded-full animate-pulse [animation-delay:1200ms]" />
                
                <div className="relative z-10">
                  <div className="flex items-center space-x-4 mb-6">
                    <Badge className="bg-emerald-100 text-emerald-800 px-3 py-1 animate-pulse">
                      {featuredPost.categoryLabel}
                    </Badge>
                    <div className="flex items-center space-x-3 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <Eye className="h-4 w-4" />
                        <span className="font-medium">{featuredPost.views.toLocaleString()} views</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <ThumbsUp className="h-4 w-4" />
                        <span className="font-medium">{featuredPost.likes} likes</span>
                      </div>
                    </div>
                  </div>

                  <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6 leading-tight group-hover:text-emerald-700 transition-colors duration-300">
                    {featuredPost.title}
                  </h2>
                  
                  <p className="text-gray-700 mb-8 text-lg leading-relaxed">
                    {featuredPost.excerpt}
                  </p>
                  
                  {/* Author and Meta Info */}
                  <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="flex items-center space-x-3">
                      <div className="bg-gradient-to-r from-emerald-500 to-blue-500 text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg">
                        {featuredPost.author.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">{featuredPost.author}</div>
                        <div className="text-sm text-gray-600">{featuredPost.authorRole}</div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(featuredPost.date).toLocaleDateString('en-US', { 
                          year: 'numeric', month: 'long', day: 'numeric' 
                        })}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Clock className="h-4 w-4" />
                        <span>{featuredPost.readTime}</span>
                      </div>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-8">
                    {featuredPost.tags.map((tag, index) => (
                      <Badge 
                        key={index} 
                        variant="secondary" 
                        className="text-xs bg-gradient-to-r from-emerald-100 to-blue-100 text-gray-700 hover:from-emerald-200 hover:to-blue-200 transition-all duration-300 cursor-pointer"
                      >
                        <Tag className="mr-1 h-3 w-3" />
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-3">
                    <Button 
                      onClick={() => handleReadArticle(featuredPost.id, featuredPost.title)}
                      className="bg-gradient-to-r from-emerald-500 to-blue-500 text-white hover:from-emerald-600 hover:to-blue-600 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                      Read Full Article
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                    
                    <Button 
                      variant="outline"
                      onClick={() => handleBookmarkPost(featuredPost.id)}
                      className={`border-2 transform hover:scale-105 transition-all duration-300 ${
                        bookmarkedPosts.has(featuredPost.id)
                          ? 'border-emerald-500 text-emerald-600 bg-emerald-50'
                          : 'border-gray-300 hover:border-emerald-300'
                      }`}
                    >
                      <Bookmark className={`mr-2 h-4 w-4 ${bookmarkedPosts.has(featuredPost.id) ? 'fill-current' : ''}`} />
                      {bookmarkedPosts.has(featuredPost.id) ? 'Bookmarked' : 'Bookmark'}
                    </Button>
                    
                    <Button 
                      variant="outline"
                      onClick={() => handleSharePost(featuredPost.title)}
                      className="border-2 border-gray-300 hover:border-blue-300 transform hover:scale-105 transition-all duration-300"
                    >
                      <Share2 className="mr-2 h-4 w-4" />
                      Share
                    </Button>
                  </div>
                </div>
              </div>
              
              {/* Image Side */}
              <div className="bg-gradient-to-br from-emerald-100 to-blue-100 min-h-[500px] flex items-center justify-center relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-blue-500/20 group-hover:from-emerald-500/30 group-hover:to-blue-500/30 transition-all duration-500" />
                <div className="text-center text-emerald-700 relative z-10">
                  <BookOpen className="h-32 w-32 mx-auto mb-6 opacity-60 group-hover:opacity-80 transform group-hover:scale-110 transition-all duration-500" />
                  <div className="bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full">
                    <p className="font-semibold">Featured Article Visual</p>
                  </div>
                </div>
                
                {/* Floating engagement indicators */}
                <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 flex items-center space-x-2 shadow-lg animate-fade-in [animation-delay:1500ms]">
                  <Star className="h-4 w-4 text-yellow-500 fill-current" />
                  <span className="text-sm font-medium">4.9/5 Rating</span>
                </div>
                
                <div className="absolute bottom-6 right-6 bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 flex items-center space-x-2 shadow-lg animate-fade-in [animation-delay:1700ms]">
                  <MessageCircle className="h-4 w-4 text-blue-500" />
                  <span className="text-sm font-medium">89 Comments</span>
                </div>
              </div>
            </div>

            {/* Hover Effect Border */}
            <div className="absolute inset-0 border-3 border-transparent group-hover:border-emerald-200 rounded-lg transition-colors duration-500 pointer-events-none" />
          </Card>
        </div>

        {/* Enhanced Search and Filter */}
        <div className="max-w-6xl mx-auto mb-16">
          {/* Search Bar */}
          <div className="relative mb-10 animate-fade-in [animation-delay:300ms]">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Find Your Perfect Article</h3>
              <p className="text-gray-600">Search through our extensive library of caregiving resources</p>
            </div>
            
            <div className="relative group max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-6 w-6 group-hover:text-emerald-500 transition-colors duration-300" />
              <Input
                type="text"
                placeholder="Search articles by title, content, author, or tags..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 pr-6 py-4 text-lg border-2 border-gray-200 rounded-xl shadow-lg focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 transition-all duration-300 bg-white/90 backdrop-blur-sm hover:shadow-xl"
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

          {/* Enhanced Category Filter */}
          <div className="animate-fade-in [animation-delay:400ms]">
            <div className="text-center mb-8">
              <h4 className="text-xl font-semibold text-gray-900 mb-3">Browse by Category</h4>
              <p className="text-gray-600">Discover articles tailored to your specific care needs</p>
            </div>
            
            <div className="flex flex-wrap gap-4 justify-center">
              {categories.map((category, index) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`group relative overflow-hidden transition-all duration-300 transform hover:scale-105 ${
                    selectedCategory === category.id 
                      ? "bg-gradient-to-r from-emerald-500 to-blue-500 text-white shadow-lg hover:shadow-xl" 
                      : "bg-white/90 backdrop-blur-sm border-2 border-gray-200 hover:border-emerald-300 hover:bg-emerald-50 text-gray-700 hover:text-emerald-700 shadow-md hover:shadow-lg"
                  }`}
                  style={{ animationDelay: `${index * 100 + 500}ms` }}
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-1">
                      {category.icon}
                    </div>
                    <span className="font-medium">{category.name}</span>
                    <Badge 
                      variant={selectedCategory === category.id ? "secondary" : "outline"}
                      className={`transition-all duration-300 ${
                        selectedCategory === category.id 
                          ? "bg-white/20 text-white border-white/30" 
                          : "bg-emerald-50 text-emerald-700 border-emerald-200"
                      }`}
                    >
                      {category.count}
                    </Badge>
                  </div>
                  
                  {/* Animated Background */}
                  <div className={`absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-blue-500/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left ${
                    selectedCategory === category.id ? 'scale-x-100' : ''
                  }`} />
                </Button>
              ))}
            </div>
            
            {/* Results Summary */}
            <div className="text-center mt-8">
              <div className="inline-flex items-center bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg">
                <BookOpen className="h-5 w-5 mr-2 text-emerald-600" />
                <span className="text-gray-700">
                  Showing <span className="font-bold text-emerald-600">{filteredPosts.length}</span> of{' '}
                  <span className="font-bold">{blogPosts.length}</span> articles
                  {searchTerm && (
                    <span className="ml-2">
                      matching &quot;<span className="font-semibold text-emerald-700">{searchTerm}</span>&quot;
                    </span>
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Blog Grid */}
        <div className="max-w-6xl mx-auto mb-20">
          <div className="text-center mb-12 animate-fade-in [animation-delay:500ms]">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Latest Articles & Insights</h3>
            <p className="text-gray-600 text-lg">Stay informed with our expert-written content</p>
          </div>

          {filteredPosts.length > 0 ? (
            <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-8">
              {filteredPosts.map((post, index) => (
                <Card 
                  key={post.id} 
                  className="group border-0 shadow-xl bg-white/90 backdrop-blur-sm hover:shadow-2xl transition-all duration-500 h-full flex flex-col animate-fade-in overflow-hidden hover:scale-[1.02]"
                  style={{ animationDelay: `${index * 100 + 600}ms` }}
                >
                  {/* Enhanced Image Section */}
                  <div className="relative bg-gradient-to-br from-emerald-100 to-blue-100 h-56 flex items-center justify-center overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-blue-500/20 group-hover:from-emerald-500/30 group-hover:to-blue-500/30 transition-all duration-500" />
                    
                    {/* Category Badge */}
                    <div className="absolute top-4 left-4 z-10">
                      <Badge variant="outline" className="bg-white/90 backdrop-blur-sm text-emerald-700 border-emerald-200 shadow-sm">
                        {post.categoryLabel}
                      </Badge>
                    </div>

                    {/* Popular Badge */}
                    {post.popular && (
                      <div className="absolute top-4 right-4 z-10">
                        <Badge className="bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg animate-pulse">
                          <TrendingUp className="mr-1 h-3 w-3" />
                          Popular
                        </Badge>
                      </div>
                    )}

                    {/* Main Visual */}
                    <div className="text-center text-emerald-700 relative z-10">
                      <BookOpen className="h-20 w-20 mx-auto mb-3 opacity-60 group-hover:opacity-80 transform group-hover:scale-110 transition-all duration-500" />
                      <div className="bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full">
                        <p className="text-sm font-medium">Article Visual</p>
                      </div>
                    </div>

                    {/* Engagement Stats */}
                    <div className="absolute bottom-4 left-4 right-4 flex justify-between">
                      <div className="bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center space-x-1 text-xs shadow-sm">
                        <Eye className="h-3 w-3 text-gray-600" />
                        <span className="font-medium text-gray-700">{post.views.toLocaleString()}</span>
                      </div>
                      <div className="bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center space-x-1 text-xs shadow-sm">
                        <ThumbsUp className="h-3 w-3 text-gray-600" />
                        <span className="font-medium text-gray-700">{post.likes}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Content Section */}
                  <CardHeader className="flex-grow pb-4">
                    <CardTitle className="text-xl font-bold text-gray-900 leading-tight mb-3 group-hover:text-emerald-700 transition-colors duration-300 line-clamp-2">
                      {post.title}
                    </CardTitle>
                    
                    <CardDescription className="text-gray-600 text-sm leading-relaxed line-clamp-3 mb-4">
                      {post.excerpt}
                    </CardDescription>

                    {/* Author Info */}
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="bg-gradient-to-r from-emerald-500 to-blue-500 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm">
                        {post.author.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900 text-sm">{post.author}</div>
                        <div className="text-xs text-gray-600">{post.authorRole}</div>
                      </div>
                    </div>
                  </CardHeader>
                  
                  {/* Footer Section */}
                  <CardContent className="pt-0">
                    {/* Meta Information */}
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-3 w-3" />
                        <span>{new Date(post.date).toLocaleDateString('en-US', { 
                          month: 'short', day: 'numeric' 
                        })}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-3 w-3" />
                        <span>{post.readTime}</span>
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1 mb-4">
                      {post.tags.slice(0, 2).map((tag, tagIndex) => (
                        <Badge 
                          key={tagIndex} 
                          variant="secondary" 
                          className="text-xs bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors duration-200 cursor-pointer"
                        >
                          {tag}
                        </Badge>
                      ))}
                      {post.tags.length > 2 && (
                        <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-600">
                          +{post.tags.length - 2} more
                        </Badge>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleReadArticle(post.id, post.title)}
                        className="flex-1 border-emerald-200 text-emerald-700 hover:bg-emerald-50 hover:border-emerald-300 transform hover:scale-105 transition-all duration-300"
                      >
                        Read Article
                        <ArrowRight className="ml-2 h-3 w-3" />
                      </Button>
                      
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleBookmarkPost(post.id)}
                        className={`p-2 transform hover:scale-110 transition-all duration-300 ${
                          bookmarkedPosts.has(post.id) 
                            ? 'text-emerald-600 bg-emerald-50 hover:bg-emerald-100' 
                            : 'text-gray-500 hover:text-emerald-600 hover:bg-emerald-50'
                        }`}
                      >
                        <Bookmark className={`h-4 w-4 ${bookmarkedPosts.has(post.id) ? 'fill-current' : ''}`} />
                      </Button>
                      
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleSharePost(post.title)}
                        className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 transform hover:scale-110 transition-all duration-300"
                      >
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>

                  {/* Hover Effect Border */}
                  <div className="absolute inset-0 border-2 border-transparent group-hover:border-emerald-200 rounded-lg transition-colors duration-300 pointer-events-none" />
                </Card>
              ))}
            </div>
          ) : (
            /* No Results Message */
            <div className="text-center py-20 animate-fade-in">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-12 shadow-lg max-w-md mx-auto">
                <Search className="h-16 w-16 text-gray-400 mx-auto mb-6" />
                <h3 className="text-2xl font-bold text-gray-900 mb-4">No Articles Found</h3>
                <p className="text-gray-600 mb-6">
                  No articles match your search criteria. Try adjusting your filters or search terms.
                </p>
                <Button 
                  onClick={() => {
                    setSearchTerm('')
                    setSelectedCategory('all')
                  }}
                  className="bg-gradient-to-r from-emerald-500 to-blue-500 text-white transform hover:scale-105 transition-all duration-300"
                >
                  Clear All Filters
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Enhanced Sidebar Content */}
        <div className="max-w-6xl mx-auto mb-20">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Enhanced Popular Tags */}
            <Card className="group border-0 shadow-xl bg-white/90 backdrop-blur-sm hover:shadow-2xl transition-all duration-500 animate-fade-in [animation-delay:700ms]">
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-3 rounded-full animate-pulse [animation-delay:900ms]">
                    <Tag className="h-6 w-6" />
                  </div>
                </div>
                <CardTitle className="text-xl font-bold text-gray-900 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Popular Topics
                </CardTitle>
                <p className="text-gray-600 text-sm mt-2">Trending care topics this month</p>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {popularTags.map((tag, index) => (
                    <Badge 
                      key={index} 
                      variant="outline" 
                      className="text-xs hover:bg-purple-50 hover:border-purple-300 hover:text-purple-700 cursor-pointer transform hover:scale-105 transition-all duration-300 group/tag"
                      style={{ animationDelay: `${index * 50 + 1000}ms` }}
                      onClick={() => setSearchTerm(tag)}
                    >
                      <Tag className="mr-1 h-3 w-3 group-hover/tag:rotate-12 transition-transform duration-300" />
                      {tag}
                    </Badge>
                  ))}
                </div>
                <div className="mt-6 text-center">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setSearchTerm('')}
                    className="text-purple-600 hover:text-purple-700 hover:bg-purple-50"
                  >
                    View All Topics
                    <ArrowRight className="ml-2 h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Enhanced Newsletter Signup */}
            <Card className="group border-0 shadow-xl bg-gradient-to-br from-emerald-50 via-white to-blue-50 hover:shadow-2xl transition-all duration-500 animate-fade-in [animation-delay:800ms] overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-blue-500/5" />
              
              <CardHeader className="text-center relative">
                <div className="flex justify-center mb-4">
                  <div className="relative">
                    <div className="bg-gradient-to-r from-emerald-500 to-blue-500 text-white p-4 rounded-full animate-bounce [animation-delay:1000ms] shadow-lg">
                      <Bell className="h-6 w-6" />
                    </div>
                    <div className="absolute -top-2 -right-2 bg-yellow-400 text-emerald-900 p-1 rounded-full animate-pulse [animation-delay:1200ms]">
                      <Sparkles className="h-3 w-3" />
                    </div>
                  </div>
                </div>
                <CardTitle className="text-xl font-bold text-gray-900 bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
                  Stay Updated
                </CardTitle>
                <CardDescription className="text-gray-700 mt-2">
                  Get the latest caregiving tips and insights delivered weekly to your inbox.
                </CardDescription>
              </CardHeader>
              
              <CardContent className="relative">
                <div className="space-y-4">
                  <Input 
                    placeholder="Enter your email address" 
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border-2 border-gray-200 focus:border-emerald-400 rounded-lg transition-all duration-300"
                  />
                  <Button 
                    onClick={handleNewsletterSignup}
                    className="w-full bg-gradient-to-r from-emerald-500 to-blue-500 text-white hover:from-emerald-600 hover:to-blue-600 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    <Send className="mr-2 h-4 w-4" />
                    Subscribe to Newsletter
                  </Button>
                  
                  {/* Benefits */}
                  <div className="bg-white/70 backdrop-blur-sm rounded-lg p-4 space-y-2">
                    <div className="flex items-center text-sm text-gray-700">
                      <Star className="h-4 w-4 text-yellow-500 mr-2 fill-current" />
                      <span>Weekly expert insights</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-700">
                      <Download className="h-4 w-4 text-blue-500 mr-2" />
                      <span>Free care guides & checklists</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-700">
                      <Shield className="h-4 w-4 text-green-500 mr-2" />
                      <span>Privacy protected • Unsubscribe anytime</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Enhanced Contact CTA */}
            <Card className="group border-0 shadow-xl bg-white/90 backdrop-blur-sm hover:shadow-2xl transition-all duration-500 animate-fade-in [animation-delay:900ms] overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-200/30 to-indigo-200/30 rounded-full blur-xl -translate-y-16 translate-x-16" />
              
              <CardHeader className="text-center relative">
                <div className="flex justify-center mb-4">
                  <div className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white p-3 rounded-full group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <MessageCircle className="h-6 w-6" />
                  </div>
                </div>
                <CardTitle className="text-xl font-bold text-gray-900 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Need Personalized Guidance?
                </CardTitle>
                <CardDescription className="text-gray-700 mt-2">
                  Our care coordinators are here to help answer your questions and guide your family.
                </CardDescription>
              </CardHeader>
              
              <CardContent className="relative">
                <div className="space-y-3">
                  <Button 
                    onClick={handleContactCall}
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    <Phone className="mr-2 h-5 w-5" />
                    Call (757) 555-CARE
                  </Button>
                  
                  <Button 
                    onClick={handleEmailContact}
                    disabled={isSubmitting}
                    variant="outline"
                    className="w-full border-2 border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-300 transform hover:scale-105 transition-all duration-300"
                  >
                    <Mail className="mr-2 h-4 w-4" />
                    {isSubmitting ? 'Connecting...' : 'Email Our Team'}
                  </Button>
                  
                  {/* Response Time Indicator */}
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-3 mt-4">
                    <div className="flex items-center justify-center text-sm text-blue-700">
                      <Clock className="h-4 w-4 mr-2" />
                      <span className="font-medium">Typical response: Within 2 hours</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Enhanced Expert Contributors Section */}
        <div className="max-w-6xl mx-auto mb-20">
          <div className="text-center mb-12 animate-fade-in [animation-delay:800ms]">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="bg-gradient-to-r from-amber-400 via-yellow-400 to-orange-400 text-white p-4 rounded-full animate-bounce [animation-delay:1000ms] shadow-xl">
                  <Users className="h-8 w-8" />
                </div>
                <div className="absolute -top-2 -right-2 bg-purple-500 text-white p-1 rounded-full animate-pulse [animation-delay:1200ms]">
                  <Crown className="h-4 w-4" />
                </div>
              </div>
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-amber-600 via-orange-600 to-pink-600 bg-clip-text text-transparent">
              Meet Our Expert Contributors
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
              Learn from licensed professionals and experienced caregivers who share their knowledge to support your family's journey.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Dr. Sarah Martinez",
                role: "Geriatrician & Care Specialist",
                expertise: "Senior Health, Medical Care Planning",
                image: "/api/placeholder/120/120",
                articles: 47,
                rating: 4.9,
                specialties: ["Memory Care", "Medication Management", "Health Assessments"],
                credentials: "MD, Board Certified in Geriatric Medicine"
              },
              {
                name: "Jennifer Chen, RN",
                role: "Registered Nurse & Family Advocate",
                expertise: "Home Care, Family Support",
                image: "/api/placeholder/120/120",
                articles: 32,
                rating: 4.8,
                specialties: ["Home Nursing", "Care Transitions", "Family Education"],
                credentials: "BSN, RN, 15+ years experience"
              },
              {
                name: "Michael Thompson, LCSW",
                role: "Licensed Clinical Social Worker",
                expertise: "Mental Health, Support Resources",
                image: "/api/placeholder/120/120",
                articles: 28,
                rating: 4.9,
                specialties: ["Caregiver Support", "Mental Health", "Resource Navigation"],
                credentials: "LCSW, MSW, Certified Care Manager"
              }
            ].map((expert, index) => (
              <Card 
                key={index} 
                className="group border-0 shadow-xl bg-white/95 backdrop-blur-sm hover:shadow-2xl transition-all duration-500 animate-fade-in overflow-hidden"
                style={{ animationDelay: `${index * 200 + 1000}ms` }}
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-amber-200/20 to-orange-200/20 rounded-full blur-lg -translate-y-12 translate-x-12" />
                
                <CardContent className="p-6 text-center relative">
                  {/* Profile Image & Rating */}
                  <div className="relative mb-6">
                    <div className="w-24 h-24 mx-auto mb-4 relative">
                      <img 
                        src={expert.image} 
                        alt={expert.name}
                        className="w-full h-full rounded-full object-cover border-4 border-white shadow-lg group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute -bottom-2 -right-2 bg-green-500 text-white p-1 rounded-full shadow-lg">
                        <CheckCircle className="h-4 w-4" />
                      </div>
                    </div>
                    
                    {/* Expert Rating */}
                    <div className="flex items-center justify-center gap-1 mb-3">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`h-4 w-4 ${i < Math.floor(expert.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                        />
                      ))}
                      <span className="text-sm font-medium text-gray-700 ml-2">{expert.rating}</span>
                    </div>
                  </div>

                  {/* Expert Info */}
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-amber-600 transition-colors duration-300">
                    {expert.name}
                  </h3>
                  <p className="text-amber-600 font-semibold mb-2">{expert.role}</p>
                  <p className="text-gray-600 text-sm mb-4">{expert.credentials}</p>
                  
                  {/* Specialties */}
                  <div className="space-y-2 mb-6">
                    {expert.specialties.map((specialty, i) => (
                      <Badge 
                        key={i} 
                        variant="outline" 
                        className="text-xs mx-1 hover:bg-amber-50 hover:border-amber-300 transition-colors duration-300"
                      >
                        {specialty}
                      </Badge>
                    ))}
                  </div>

                  {/* Stats */}
                  <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg p-4 mb-6">
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold text-amber-600">{expert.articles}</div>
                        <div className="text-xs text-gray-600">Articles Published</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-orange-600">10k+</div>
                        <div className="text-xs text-gray-600">Families Helped</div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    <Button 
                      onClick={() => setSearchTerm(expert.name.split(' ')[1])}
                      className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                      <BookOpen className="mr-2 h-4 w-4" />
                      View Articles
                    </Button>
                    
                    <Button 
                      onClick={handleContactCall}
                      variant="outline"
                      className="w-full border-2 border-amber-200 text-amber-700 hover:bg-amber-50 hover:border-amber-300 transform hover:scale-105 transition-all duration-300"
                    >
                      <MessageCircle className="mr-2 h-4 w-4" />
                      Schedule Consultation
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Call-to-Action for Expert Network */}
          <div className="text-center mt-12 animate-fade-in [animation-delay:1400ms]">
            <Card className="max-w-2xl mx-auto border-0 shadow-xl bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 to-orange-500/5" />
              
              <CardContent className="p-8 relative">
                <div className="flex justify-center mb-6">
                  <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white p-4 rounded-full animate-pulse [animation-delay:1600ms] shadow-lg">
                    <HeartHandshake className="h-8 w-8" />
                  </div>
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                  Join Our Expert Network
                </h3>
                <p className="text-gray-700 mb-6 leading-relaxed">
                  Are you a healthcare professional or experienced caregiver? Share your expertise with families who need guidance and support.
                </p>
                
                <div className="space-y-4">
                  <Button 
                    onClick={handleContactCall}
                    className="bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    <Users className="mr-2 h-5 w-5" />
                    Become a Contributor
                  </Button>
                  
                  <div className="flex items-center justify-center gap-6 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Award className="h-4 w-4 text-amber-500 mr-2" />
                      <span>Expert Recognition</span>
                    </div>
                    <div className="flex items-center">
                      <TrendingUp className="h-4 w-4 text-green-500 mr-2" />
                      <span>Help Thousands</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}