'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  ChevronDown, 
  ChevronUp, 
  Search, 
  HelpCircle, 
  Heart, 
  Shield, 
  Clock, 
  DollarSign,
  Users,
  Phone,
  Mail,
  Home,
  CheckCircle,
  AlertCircle
} from 'lucide-react'

export default function FAQPage() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState('')
  const [activeCategory, setActiveCategory] = useState('all')
  const [expandedItems, setExpandedItems] = useState<number[]>([])

  const categories = [
    { id: 'all', name: 'All Questions', icon: <HelpCircle className="h-4 w-4" /> },
    { id: 'services', name: 'Our Services', icon: <Heart className="h-4 w-4" /> },
    { id: 'cost', name: 'Cost & Payment', icon: <DollarSign className="h-4 w-4" /> },
    { id: 'caregivers', name: 'Caregivers', icon: <Users className="h-4 w-4" /> },
    { id: 'safety', name: 'Safety & Security', icon: <Shield className="h-4 w-4" /> },
    { id: 'scheduling', name: 'Scheduling', icon: <Clock className="h-4 w-4" /> },
    { id: 'getting-started', name: 'Getting Started', icon: <Home className="h-4 w-4" /> }
  ]

  const faqData = [
    // Getting Started
    {
      category: 'getting-started',
      question: 'How do I get started with Caring Compass home care services?',
      answer: 'Getting started is simple! First, call us at (757) 555-CARE or fill out our online form for a free consultation. We\'ll schedule a home assessment where we\'ll discuss your needs, preferences, and create a personalized care plan. Once we match you with the perfect caregiver, care can begin as soon as the next day.'
    },
    {
      category: 'getting-started',
      question: 'Do you serve my area in Hampton Roads?',
      answer: 'We proudly serve Virginia Beach, Norfolk, Newport News, Portsmouth, Chesapeake, and Suffolk. If you\'re unsure whether we serve your specific neighborhood, please call us and we\'ll be happy to confirm coverage in your area.'
    },
    {
      category: 'getting-started',
      question: 'What happens during the initial assessment?',
      answer: 'During our free home assessment, a care coordinator will visit your home to understand your specific needs, daily routines, preferences, and home environment. We\'ll discuss your medical history, mobility needs, personal preferences, and family dynamics. This typically takes 60-90 minutes and helps us create a comprehensive care plan tailored just for you.'
    },

    // Services
    {
      category: 'services',
      question: 'What types of care services do you provide?',
      answer: 'We provide comprehensive non-medical home care including personal care assistance (bathing, dressing, grooming), companionship, meal preparation, light housekeeping, medication reminders, transportation, and specialized care for conditions like dementia and Alzheimer\'s. We also offer respite care for family caregivers.'
    },
    {
      category: 'services',
      question: 'What is the difference between medical and non-medical care?',
      answer: 'Non-medical care focuses on activities of daily living, companionship, and household support without providing medical treatments. We don\'t administer medications, provide wound care, or perform medical procedures. However, we can provide medication reminders, assist with mobility, and monitor general well-being, reporting any concerns to family or healthcare providers.'
    },
    {
      category: 'services',
      question: 'Do you provide 24/7 care?',
      answer: 'Yes! We offer flexible scheduling including hourly care (minimum 4 hours), half-day, full-day, overnight, and 24/7 live-in care. Our scheduling is completely customizable to meet your specific needs and preferences.'
    },
    {
      category: 'services',
      question: 'Can you help with dementia and Alzheimer\'s care?',
      answer: 'Absolutely. Our caregivers receive specialized training in dementia and Alzheimer\'s care. We provide memory stimulation activities, routine establishment, behavioral management, safety monitoring, and family education. We understand the unique challenges and approach each client with patience, compassion, and expertise.'
    },

    // Cost & Payment
    {
      category: 'cost',
      question: 'How much do your services cost?',
      answer: 'Our rates vary based on the level of care needed, scheduling requirements, and services provided. We offer competitive rates starting at $25/hour for basic companionship care. Specialized care rates may be higher. We provide transparent pricing with no hidden fees during your free consultation.'
    },
    {
      category: 'cost',
      question: 'Do you accept insurance or Medicare?',
      answer: 'We accept long-term care insurance and Veterans Administration benefits. While Medicare typically doesn\'t cover non-medical home care, we can help you explore payment options including long-term care insurance claims. We also offer private pay options and can discuss flexible payment arrangements.'
    },
    {
      category: 'cost',
      question: 'Are there any additional fees or hidden costs?',
      answer: 'No hidden fees! Our pricing is completely transparent. You pay only for the care hours provided. There are no agency fees, setup fees, or administrative costs. We believe in honest, straightforward pricing so you know exactly what to expect.'
    },
    {
      category: 'cost',
      question: 'What forms of payment do you accept?',
      answer: 'We accept cash, check, credit cards, and ACH bank transfers. For your convenience, we can set up automatic payments. We also assist with insurance claims and provide detailed invoices for reimbursement purposes.'
    },

    // Caregivers
    {
      category: 'caregivers',
      question: 'How do you screen and train your caregivers?',
      answer: 'All caregivers undergo comprehensive background checks, reference verification, and drug screening. They must be certified CNAs, PCAs, or HHAs with a minimum of 2 years\' experience. Our 40-hour training program covers personal care techniques, safety, communication, and our Compass Care Philosophy™. We also provide ongoing education and specialized training.'
    },
    {
      category: 'caregivers',
      question: 'Can I choose my caregiver?',
      answer: 'Yes! We believe the right caregiver-client match is crucial. We carefully match caregivers based on your needs, personality, preferences, and shared interests. We encourage meet-and-greet sessions before care begins, and if for any reason the match isn\'t perfect, we\'ll find you a different caregiver at no charge.'
    },
    {
      category: 'caregivers',
      question: 'What if my regular caregiver is sick or unavailable?',
      answer: 'We maintain a team of qualified backup caregivers who are familiar with your care plan. If your regular caregiver is unavailable, we\'ll send a trained substitute to ensure continuity of care. We strive to give you as much notice as possible and will only send caregivers who meet our high standards.'
    },
    {
      category: 'caregivers',
      question: 'Are your caregivers bonded and insured?',
      answer: 'Yes! All our caregivers are fully bonded and insured. We carry comprehensive general liability insurance, professional liability insurance, and workers\' compensation. This protects both you and our caregivers, giving you complete peace of mind.'
    },

    // Safety & Security
    {
      category: 'safety',
      question: 'How do you ensure my safety and security?',
      answer: 'Safety is our top priority. All caregivers undergo thorough background checks and are trained in safety protocols. We conduct home safety assessments, provide emergency response procedures, and maintain 24/7 on-call support. Our caregivers are trained in fall prevention, emergency response, and recognizing health changes.'
    },
    {
      category: 'safety',
      question: 'What happens in case of an emergency?',
      answer: 'Our caregivers are trained in emergency response and CPR/First Aid. They have immediate access to emergency contacts, medical information, and our 24/7 on-call support line. In case of emergency, they\'ll call 911 first, then immediately notify family members and our office. We maintain detailed emergency protocols for each client.'
    },
    {
      category: 'safety',
      question: 'How do you protect my privacy and personal information?',
      answer: 'We take privacy seriously and comply with all HIPAA regulations. All personal and medical information is kept strictly confidential and stored securely. Our caregivers sign confidentiality agreements, and we have strict protocols for handling and sharing information. Only authorized family members and healthcare providers have access to your information.'
    },

    // Scheduling
    {
      category: 'scheduling',
      question: 'How flexible is your scheduling?',
      answer: 'Very flexible! We offer care 7 days a week, 365 days a year, including holidays. You can schedule regular recurring visits or arrange care as needed. We can accommodate last-minute requests when possible and offer both short-term and long-term care arrangements.'
    },
    {
      category: 'scheduling',
      question: 'What is your minimum care requirement?',
      answer: 'Our minimum visit is 4 hours for regular care appointments. However, we can discuss shorter emergency visits on a case-by-case basis. This minimum ensures our caregivers can provide meaningful care and complete necessary tasks effectively.'
    },
    {
      category: 'scheduling',
      question: 'Can I change or cancel my care schedule?',
      answer: 'Yes, we understand that needs change. We ask for 24 hours\' notice for schedule changes when possible, though we\'ll work with you on shorter notice for emergencies. There are no cancellation fees for changes made with proper notice. We want to be as accommodating as possible to meet your changing needs.'
    },
    {
      category: 'scheduling',
      question: 'Do you provide care on holidays?',
      answer: 'Yes! We provide care 365 days a year, including all holidays. Holiday rates may apply for major holidays like Christmas, New Year\'s Day, and Thanksgiving. We understand that care needs don\'t take breaks, and we\'re committed to being there when you need us most.'
    }
  ]

  const toggleExpanded = (index: number) => {
    setExpandedItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    )
  }

  const filteredFAQs = faqData.filter(faq => {
    const matchesCategory = activeCategory === 'all' || faq.category === activeCategory
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-teal-600 text-white">
        <div className="container mx-auto px-4 py-16">
          <Button
            variant="outline"
            onClick={() => router.push('/')}
            className="mb-6 border-white text-white hover:bg-white/10"
          >
            ← Back to Home
          </Button>

          <div className="text-center max-w-4xl mx-auto">
            <div className="flex justify-center mb-6">
              <div className="bg-white/20 p-4 rounded-full">
                <HelpCircle className="h-12 w-12" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Frequently Asked Questions
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              Find answers to common questions about our home care services
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16">
        {/* Search and Filter */}
        <div className="max-w-4xl mx-auto mb-12">
          {/* Search Bar */}
          <div className="relative mb-8">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              type="text"
              placeholder="Search questions..."
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
                variant={activeCategory === category.id ? "default" : "outline"}
                onClick={() => setActiveCategory(category.id)}
                className={`${
                  activeCategory === category.id 
                    ? "bg-gradient-to-r from-blue-500 to-teal-500 text-white" 
                    : "hover:bg-blue-50"
                }`}
              >
                {category.icon}
                <span className="ml-2">{category.name}</span>
              </Button>
            ))}
          </div>
        </div>

        {/* FAQ Items */}
        <div className="max-w-4xl mx-auto">
          {filteredFAQs.length === 0 ? (
            <Card className="text-center p-8">
              <CardContent>
                <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No questions found</h3>
                <p className="text-gray-600">
                  Try adjusting your search terms or selecting a different category.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredFAQs.map((faq, index) => (
                <Card key={index} className="border-0 shadow-md hover:shadow-lg transition-all duration-300">
                  <CardHeader 
                    className="cursor-pointer"
                    onClick={() => toggleExpanded(index)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-start flex-1">
                        <div className="bg-gradient-to-r from-blue-500 to-teal-500 text-white p-2 rounded-full mr-4 mt-1">
                          <HelpCircle className="h-4 w-4" />
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-lg font-semibold text-gray-900 text-left pr-4">
                            {faq.question}
                          </CardTitle>
                          <Badge variant="secondary" className="mt-2">
                            {categories.find(c => c.id === faq.category)?.name}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex-shrink-0">
                        {expandedItems.includes(index) ? (
                          <ChevronUp className="h-5 w-5 text-gray-500" />
                        ) : (
                          <ChevronDown className="h-5 w-5 text-gray-500" />
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  
                  {expandedItems.includes(index) && (
                    <CardContent className="pt-0">
                      <div className="ml-12 border-l-2 border-blue-200 pl-6">
                        <p className="text-gray-700 leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Quick Stats */}
        <div className="max-w-4xl mx-auto mt-16 mb-16">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="bg-white rounded-lg p-6 shadow-md">
              <div className="text-3xl font-bold text-blue-600 mb-2">24/7</div>
              <div className="text-gray-700">Available Support</div>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-md">
              <div className="text-3xl font-bold text-teal-600 mb-2">Free</div>
              <div className="text-gray-700">Initial Consultation</div>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-md">
              <div className="text-3xl font-bold text-purple-600 mb-2">Same Day</div>
              <div className="text-gray-700">Care Available</div>
            </div>
          </div>
        </div>

        {/* Still Have Questions */}
        <div className="max-w-4xl mx-auto">
          <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-50 to-teal-50">
            <CardContent className="p-8 text-center">
              <div className="flex justify-center mb-6">
                <div className="bg-gradient-to-r from-blue-500 to-teal-500 text-white p-4 rounded-full">
                  <Phone className="h-8 w-8" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Still Have Questions?
              </h2>
              <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
                We&apos;re here to help! Our friendly care coordinators are available 24/7 to answer 
                any questions and help you understand how our services can benefit you and your family.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
                <Button size="lg" className="bg-gradient-to-r from-blue-500 to-teal-500 text-white flex-1" onClick={() => window.location.href = 'tel:+17575552273'}>
                  <Phone className="mr-2 h-5 w-5" />
                  Call (757) 555-CARE
                </Button>
                <Button size="lg" variant="outline" className="border-blue-500 text-blue-600 hover:bg-blue-50 flex-1" onClick={() => window.location.href = 'mailto:info@caringcompasshomescare.com'}>
                  <Mail className="mr-2 h-5 w-5" />
                  Email Us
                </Button>
              </div>
              <p className="text-gray-600 mt-4 text-sm">
                Free consultation • No obligation • Licensed & insured
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Popular Topics */}
        <div className="max-w-4xl mx-auto mt-16">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">
            Popular Topics
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { title: "Getting Started", count: "8 questions", color: "bg-blue-100 text-blue-800" },
              { title: "Our Services", count: "12 questions", color: "bg-green-100 text-green-800" },
              { title: "Cost & Payment", count: "6 questions", color: "bg-purple-100 text-purple-800" },
              { title: "Safety & Security", count: "5 questions", color: "bg-red-100 text-red-800" }
            ].map((topic, index) => (
              <div key={index} className="bg-white rounded-lg p-4 shadow-sm text-center">
                <div className="text-lg font-semibold text-gray-900 mb-1">{topic.title}</div>
                <Badge className={topic.color}>{topic.count}</Badge>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}