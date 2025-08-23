'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
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
  MessageCircle
} from 'lucide-react'

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

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
    featured: true
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
      popular: true
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
      tags: ["Dementia", "Home Environment", "Safety", "Memory Care"]
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
      tags: ["Choosing Care", "Quality Assessment", "Questions to Ask"]
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
      tags: ["Fall Prevention", "Home Safety", "Mobility", "Independence"]
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
      tags: ["Nutrition", "Meal Planning", "Senior Health", "Cooking Tips"]
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
      tags: ["Caregiver Stress", "Self-Care", "Mental Health", "Support"]
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
      tags: ["Technology", "Smart Home", "Safety Devices", "Communication"]
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
      tags: ["Medicare", "Insurance", "Payment Options", "Healthcare Costs"]
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
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-blue-600 text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center max-w-4xl mx-auto">
            <div className="flex justify-center mb-6">
              <div className="bg-white/20 p-4 rounded-full">
                <BookOpen className="h-12 w-12" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Blog & Resources
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-emerald-100">
              Expert insights, practical tips, and guidance for families navigating home care
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16">
        {/* Featured Post */}
        <div className="max-w-6xl mx-auto mb-16">
          <div className="text-center mb-8">
            <Badge className="bg-gradient-to-r from-emerald-500 to-blue-500 text-white text-lg px-4 py-2 mb-4">
              <TrendingUp className="mr-2 h-4 w-4" />
              Featured Article
            </Badge>
          </div>
          
          <Card className="border-0 shadow-2xl overflow-hidden">
            <div className="grid lg:grid-cols-2 gap-0">
              <div className="bg-gradient-to-br from-emerald-100 to-blue-100 p-12 flex items-center">
                <div>
                  <Badge className="bg-emerald-100 text-emerald-800 mb-4">
                    {featuredPost.categoryLabel}
                  </Badge>
                  <h2 className="text-3xl font-bold text-gray-900 mb-4 leading-tight">
                    {featuredPost.title}
                  </h2>
                  <p className="text-gray-700 mb-6 text-lg leading-relaxed">
                    {featuredPost.excerpt}
                  </p>
                  
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">{featuredPost.author}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">
                        {new Date(featuredPost.date).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">{featuredPost.readTime}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {featuredPost.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        <Tag className="mr-1 h-3 w-3" />
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <Button className="bg-gradient-to-r from-emerald-500 to-blue-500 text-white">
                    Read Full Article
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="bg-gray-200 min-h-[400px] flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <BookOpen className="h-24 w-24 mx-auto mb-4 opacity-50" />
                  <p>Featured Article Image</p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Search and Filter */}
        <div className="max-w-6xl mx-auto mb-12">
          {/* Search Bar */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              type="text"
              placeholder="Search articles by title, content, or tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-3 text-lg"
            />
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                onClick={() => setSelectedCategory(category.id)}
                className={`${
                  selectedCategory === category.id 
                    ? "bg-gradient-to-r from-emerald-500 to-blue-500 text-white" 
                    : "hover:bg-emerald-50"
                }`}
              >
                {category.icon}
                <span className="ml-2">{category.name}</span>
                <Badge variant="secondary" className="ml-2">
                  {category.count}
                </Badge>
              </Button>
            ))}
          </div>
        </div>

        {/* Blog Grid */}
        <div className="max-w-6xl mx-auto mb-16">
          <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-8">
            {filteredPosts.map((post) => (
              <Card key={post.id} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 h-full flex flex-col">
                {/* Image Placeholder */}
                <div className="bg-gradient-to-br from-gray-100 to-gray-200 h-48 flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <BookOpen className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Article Image</p>
                  </div>
                </div>
                
                <CardHeader className="flex-grow">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="outline" className="text-xs">
                      {post.categoryLabel}
                    </Badge>
                    {post.popular && (
                      <Badge className="bg-red-100 text-red-800 text-xs">
                        <TrendingUp className="mr-1 h-3 w-3" />
                        Popular
                      </Badge>
                    )}
                  </div>
                  
                  <CardTitle className="text-lg font-bold text-gray-900 leading-tight mb-2">
                    {post.title}
                  </CardTitle>
                  
                  <CardDescription className="text-gray-600 text-sm leading-relaxed">
                    {post.excerpt}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <div className="flex items-center space-x-3 text-xs text-gray-500 mb-4">
                    <div className="flex items-center space-x-1">
                      <User className="h-3 w-3" />
                      <span>{post.author}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-3 w-3" />
                      <span>{new Date(post.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-3 w-3" />
                      <span>{post.readTime}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1 mb-4">
                    {post.tags.slice(0, 2).map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {post.tags.length > 2 && (
                      <Badge variant="secondary" className="text-xs">
                        +{post.tags.length - 2} more
                      </Badge>
                    )}
                  </div>

                  <Button variant="outline" className="w-full">
                    Read Article
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Sidebar Content */}
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Popular Tags */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-gray-900">
                  Popular Topics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {popularTags.map((tag, index) => (
                    <Badge 
                      key={index} 
                      variant="outline" 
                      className="text-xs hover:bg-emerald-50 cursor-pointer"
                    >
                      <Tag className="mr-1 h-3 w-3" />
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Newsletter Signup */}
            <Card className="border-0 shadow-lg bg-gradient-to-br from-emerald-50 to-blue-50">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-gray-900">
                  Stay Updated
                </CardTitle>
                <CardDescription>
                  Get the latest caregiving tips and insights delivered to your inbox.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Input placeholder="Your email address" type="email" />
                  <Button className="w-full bg-gradient-to-r from-emerald-500 to-blue-500 text-white">
                    Subscribe to Newsletter
                  </Button>
                  <p className="text-xs text-gray-600 text-center">
                    Unsubscribe anytime. Privacy policy applies.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Contact CTA */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-gray-900">
                  Need Personalized Guidance?
                </CardTitle>
                <CardDescription>
                  Our care coordinators are here to help answer your questions.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button className="w-full" variant="outline">
                    <Phone className="mr-2 h-4 w-4" />
                    Call (757) 555-CARE
                  </Button>
                  <Button className="w-full" variant="outline">
                    <Mail className="mr-2 h-4 w-4" />
                    Email Us
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Expert Contributors */}
        <div className="max-w-6xl mx-auto mt-16">
          <Card className="border-0 shadow-lg">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold text-gray-900">
                Our Expert Contributors
              </CardTitle>
              <CardDescription>
                Articles written by healthcare professionals and care specialists
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
                <div className="space-y-2">
                  <div className="bg-gradient-to-r from-emerald-500 to-blue-500 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto">
                    DM
                  </div>
                  <div className="font-semibold text-gray-900">Dr. Sarah Mitchell</div>
                  <div className="text-sm text-gray-600">Geriatrician</div>
                </div>
                <div className="space-y-2">
                  <div className="bg-gradient-to-r from-emerald-500 to-blue-500 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto">
                    LT
                  </div>
                  <div className="font-semibold text-gray-900">Lisa Thompson, RN</div>
                  <div className="text-sm text-gray-600">Care Coordinator</div>
                </div>
                <div className="space-y-2">
                  <div className="bg-gradient-to-r from-emerald-500 to-blue-500 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto">
                    MR
                  </div>
                  <div className="font-semibold text-gray-900">Michael Rodriguez</div>
                  <div className="text-sm text-gray-600">Dementia Specialist</div>
                </div>
                <div className="space-y-2">
                  <div className="bg-gradient-to-r from-emerald-500 to-blue-500 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto">
                    JC
                  </div>
                  <div className="font-semibold text-gray-900">Dr. Jennifer Clark</div>
                  <div className="text-sm text-gray-600">Physical Therapist</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}