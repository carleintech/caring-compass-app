'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  Heart, 
  DollarSign, 
  Clock, 
  Award, 
  Users, 
  Star,
  CheckCircle,
  ArrowRight,
  Phone,
  Mail,
  Upload,
  Briefcase,
  GraduationCap,
  Shield,
  TrendingUp,
  Home,
  Calendar,
  Target,
  Sparkles
} from 'lucide-react'

const CareersPage = () => {
  const [applicationData, setApplicationData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    zipCode: '',
    position: '',
    experience: '',
    availability: '',
    transportation: '',
    certifications: '',
    message: ''
  })

  const handleSubmit = () => {
    if (!applicationData.firstName || !applicationData.lastName || !applicationData.email || !applicationData.phone) {
      alert('Please fill in all required fields.')
      return
    }
    
    alert('Thank you for your application! We\'ll contact you within 24 hours to schedule an interview.')
    setApplicationData({ 
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      zipCode: '',
      position: '',
      experience: '',
      availability: '',
      transportation: '',
      certifications: '',
      message: ''
    })
  }

  const benefits = [
    {
      icon: DollarSign,
      title: "Competitive Pay",
      description: "$18 - $25 per hour",
      details: ["Weekly pay with direct deposit", "Performance bonuses", "Mileage reimbursement", "Holiday pay rates"]
    },
    {
      icon: Clock,
      title: "Flexible Scheduling",
      description: "Work when it fits your life",
      details: ["Choose your own hours", "Part-time and full-time options", "Weekend availability optional", "No mandatory overtime"]
    },
    {
      icon: Award,
      title: "Professional Growth",
      description: "Advance your career",
      details: ["40 hours paid training", "Continuing education opportunities", "Leadership development programs", "Tuition assistance available"]
    },
    {
      icon: Heart,
      title: "Meaningful Work",
      description: "Make a real difference",
      details: ["Help seniors age in place", "Build lasting relationships", "Supportive team environment", "Recognition programs"]
    }
  ]

  const positions = [
    {
      title: "Certified Nursing Assistant (CNA)",
      type: "Full-time / Part-time",
      pay: "$20 - $25/hour",
      requirements: ["Current CNA certification", "2+ years experience preferred", "Reliable transportation", "CPR certification"],
      description: "Provide personal care assistance including bathing, dressing, mobility support, and medication reminders."
    },
    {
      title: "Personal Care Aide (PCA)",
      type: "Full-time / Part-time", 
      pay: "$18 - $22/hour",
      requirements: ["PCA certification or equivalent", "1+ years experience", "Reliable transportation", "First Aid certification"],
      description: "Assist with activities of daily living, companionship, and light housekeeping tasks."
    },
    {
      title: "Home Health Aide (HHA)",
      type: "Full-time / Part-time",
      pay: "$19 - $24/hour",
      requirements: ["HHA certification", "2+ years experience", "Reliable transportation", "Background check"],
      description: "Provide comprehensive non-medical care including personal care, medication reminders, and health monitoring."
    },
    {
      title: "Companion Caregiver",
      type: "Part-time / Full-time",
      pay: "$16 - $20/hour",
      requirements: ["High school diploma", "Compassionate personality", "Reliable transportation", "Clean driving record"],
      description: "Provide companionship, light housekeeping, meal preparation, and transportation assistance."
    }
  ]

  const whyChooseUs = [
    {
      icon: Users,
      title: "Supportive Team",
      description: "Join a caring team that supports each other and celebrates successes together."
    },
    {
      icon: GraduationCap,
      title: "Comprehensive Training",
      description: "Receive thorough training in our Compass Care Philosophy™ and ongoing professional development."
    },
    {
      icon: Shield,
      title: "Job Security",
      description: "Growing demand for home care means stable employment in a recession-proof industry."
    },
    {
      icon: TrendingUp,
      title: "Career Growth",
      description: "Clear advancement opportunities from caregiver to supervisor to management roles."
    }
  ]

  const requirements = [
    "High school diploma or equivalent",
    "Current certification (CNA, PCA, or HHA)",
    "Minimum 1-2 years experience in senior care",
    "Clear background check and drug screening",
    "CPR and First Aid certification",
    "Reliable transportation and valid driver's license",
    "Excellent communication and interpersonal skills",
    "Compassionate, patient, and professional demeanor"
  ]

  const testimonials = [
    {
      name: "Sarah Mitchell",
      position: "CNA, 3 years with Caring Compass",
      text: "I love the flexibility to choose my schedule while making a real difference in people's lives. The training here is excellent and the support from management is outstanding.",
      image: "/api/placeholder/60/60"
    },
    {
      name: "Marcus Johnson", 
      position: "PCA, 2 years with Caring Compass",
      text: "This is more than just a job - it's a calling. The families I work with have become like family to me. The pay is competitive and the benefits are great.",
      image: "/api/placeholder/60/60"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-teal-50" />
        
        <div className="relative container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-6 bg-blue-100 text-blue-700 border-blue-200">
                <Sparkles className="w-3 h-3 mr-1" />
                Now Hiring Compassionate Caregivers
              </Badge>
              
              <h1 className="text-4xl lg:text-6xl font-bold text-slate-900 mb-6 leading-tight">
                Join Our 
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-500"> Caring Team </span>
              </h1>
              
              <p className="text-xl text-slate-600 mb-8 leading-relaxed">
                Make a meaningful difference in seniors&apos; lives while building a rewarding career. We offer competitive pay, flexible schedules, and comprehensive benefits in the growing field of home care.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-blue-600 to-teal-500 text-white px-8"
                  onClick={() => document.getElementById('application-form').scrollIntoView({ behavior: 'smooth' })}
                >
                  Apply Now
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                
                <Button 
                  variant="outline" 
                  size="lg"
                  className="px-8 border-slate-300 hover:bg-slate-50"
                  onClick={() => window.location.href = 'tel:+18508610959'}
                >
                  <Phone className="mr-2 w-5 h-5" />
                  Call (850) 861-0959
                </Button>
              </div>

              <div className="flex items-center space-x-6 text-sm text-slate-600">
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  $18-$25/hour
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Flexible Schedule
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Paid Training
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="bg-white rounded-2xl shadow-2xl p-8 border border-slate-200">
                <h3 className="text-2xl font-bold text-slate-900 mb-6">Why Our Caregivers Love Working Here</h3>
                
                <div className="space-y-4 mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <DollarSign className="w-4 h-4 text-blue-600" />
                    </div>
                    <p className="text-slate-700">Competitive wages with weekly pay</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <Clock className="w-4 h-4 text-blue-600" />
                    </div>
                    <p className="text-slate-700">Choose your own schedule and clients</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <Heart className="w-4 h-4 text-blue-600" />
                    </div>
                    <p className="text-slate-700">Make a real difference in people&apos;s lives</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <Award className="w-4 h-4 text-blue-600" />
                    </div>
                    <p className="text-slate-700">40 hours of paid training provided</p>
                  </div>
                </div>

                <Button 
                  className="w-full bg-gradient-to-r from-blue-600 to-teal-500 text-white"
                  size="lg"
                  onClick={() => document.getElementById('application-form').scrollIntoView({ behavior: 'smooth' })}
                >
                  Start Your Application
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Exceptional Benefits & Compensation
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              We value our caregivers and offer competitive compensation along with benefits that support your personal and professional growth.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <Card key={index} className="group hover:shadow-lg transition-all duration-300 border-slate-200">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-teal-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <benefit.icon className="w-8 h-8 text-blue-600" />
                  </div>
                  <CardTitle className="text-xl">{benefit.title}</CardTitle>
                  <p className="text-blue-600 font-semibold">{benefit.description}</p>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {benefit.details.map((detail, detailIndex) => (
                      <li key={detailIndex} className="flex items-center text-sm text-slate-600">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                        {detail}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Current Open Positions
            </h2>
            <p className="text-xl text-slate-600">
              Find the perfect role that matches your skills and availability
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {positions.map((position, index) => (
              <Card key={index} className="border-slate-200 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <CardTitle className="text-xl text-slate-900">{position.title}</CardTitle>
                      <p className="text-slate-600">{position.type}</p>
                    </div>
                    <Badge className="bg-green-100 text-green-700 border-green-200">
                      {position.pay}
                    </Badge>
                  </div>
                  <p className="text-slate-600">{position.description}</p>
                </CardHeader>
                <CardContent>
                  <h4 className="font-semibold text-slate-900 mb-3">Requirements:</h4>
                  <ul className="space-y-2 mb-6">
                    {position.requirements.map((req, reqIndex) => (
                      <li key={reqIndex} className="flex items-start space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-slate-600">{req}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className="w-full bg-gradient-to-r from-blue-600 to-teal-500 text-white"
                    onClick={() => {
                      setApplicationData({...applicationData, position: position.title})
                      document.getElementById('application-form').scrollIntoView({ behavior: 'smooth' })
                    }}
                  >
                    Apply for This Position
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Why Choose Caring Compass as Your Employer?
            </h2>
            <p className="text-xl text-slate-600">
              More than just a job - it&apos;s a chance to be part of something meaningful
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {whyChooseUs.map((reason, index) => (
              <Card key={index} className="border-slate-200 shadow-lg text-center">
                <CardHeader>
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <reason.icon className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-xl">{reason.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600">{reason.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Requirements */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-slate-900 mb-6">
                General Requirements
              </h2>
              <p className="text-xl text-slate-600 mb-8">
                We&apos;re looking for compassionate, reliable individuals who are committed to providing exceptional care to seniors in their homes.
              </p>

              <div className="space-y-4">
                {requirements.map((requirement, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                    <span className="text-slate-700">{requirement}</span>
                  </div>
                ))}
              </div>

              <div className="mt-8 bg-blue-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-blue-900 mb-3">Don&apos;t Meet All Requirements?</h3>
                <p className="text-blue-800 text-sm">
                  We encourage applications from candidates who are passionate about senior care, even if you don&apos;t meet every requirement. We provide comprehensive training and support for the right candidates.
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-teal-50 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-slate-900 mb-6">Our Training Program</h3>
              
              <div className="space-y-6">
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <h4 className="font-semibold text-slate-900 mb-2">40-Hour Initial Training</h4>
                  <p className="text-sm text-slate-600">Comprehensive classroom and hands-on training covering all aspects of home care</p>
                </div>
                
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <h4 className="font-semibold text-slate-900 mb-2">Compass Care Philosophy™</h4>
                  <p className="text-sm text-slate-600">Learn our unique approach to dignity-preserving, home-centered care</p>
                </div>
                
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <h4 className="font-semibold text-slate-900 mb-2">Ongoing Education</h4>
                  <p className="text-sm text-slate-600">12 hours of continuing education annually plus specialized training opportunities</p>
                </div>
                
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <h4 className="font-semibold text-slate-900 mb-2">Mentorship Program</h4>
                  <p className="text-sm text-slate-600">Paired with experienced caregivers for guidance and support</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Hear From Our Team
            </h2>
            <p className="text-xl text-slate-600">
              Real stories from caregivers who&apos;ve found their calling with us
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-slate-200 shadow-lg">
                <CardHeader>
                  <div className="flex justify-center mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                </CardHeader>
                <CardContent>
                  <blockquote className="text-slate-700 mb-4 italic">
                    &quot;{testimonial.text}&quot;
                  </blockquote>
                  <div className="flex items-center space-x-4">
                    {/* TODO: Replace <img> with <Image /> from next/image for optimization. See: https://nextjs.org/docs/messages/no-img-element */}
                    <Image 
                      src={testimonial.image} 
                      alt={testimonial.name}
                      width={48}
                      height={48}
                      className="w-12 h-12 rounded-full object-cover border-2 border-blue-100"
                    />
                    <div>
                      <div className="font-semibold text-slate-900">{testimonial.name}</div>
                      <div className="text-slate-600 text-sm">{testimonial.position}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section id="application-form" className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-slate-900 mb-4">
                Ready to Join Our Team?
              </h2>
              <p className="text-xl text-slate-600">
                Start your application today - we&apos;ll contact you within 24 hours
              </p>
            </div>

            <Card className="border-slate-200 shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl">Caregiver Application</CardTitle>
                <p className="text-slate-600">
                  Please fill out this application completely. All fields marked with * are required.
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-slate-700 mb-2 block">
                      First Name *
                    </label>
                    <Input
                      placeholder="Enter your first name"
                      value={applicationData.firstName}
                      onChange={(e) => setApplicationData({...applicationData, firstName: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700 mb-2 block">
                      Last Name *
                    </label>
                    <Input
                      placeholder="Enter your last name"
                      value={applicationData.lastName}
                      onChange={(e) => setApplicationData({...applicationData, lastName: e.target.value})}
                      required
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-slate-700 mb-2 block">
                      Email Address *
                    </label>
                    <Input
                      type="email"
                      placeholder="your@email.com"
                      value={applicationData.email}
                      onChange={(e) => setApplicationData({...applicationData, email: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700 mb-2 block">
                      Phone Number *
                    </label>
                    <Input
                      type="tel"
                      placeholder="(555) 123-4567"
                      value={applicationData.phone}
                      onChange={(e) => setApplicationData({...applicationData, phone: e.target.value})}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-slate-700 mb-2 block">
                      Position of Interest
                    </label>
                    <select 
                      className="w-full p-3 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={applicationData.position}
                      onChange={(e) => setApplicationData({...applicationData, position: e.target.value})}
                      title="Position of Interest"
                    >
                      <option value="">Select position</option>
                      <option value="Certified Nursing Assistant (CNA)">Certified Nursing Assistant (CNA)</option>
                      <option value="Personal Care Aide (PCA)">Personal Care Aide (PCA)</option>
                      <option value="Home Health Aide (HHA)">Home Health Aide (HHA)</option>
                      <option value="Companion Caregiver">Companion Caregiver</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700 mb-2 block">
                      Zip Code
                    </label>
                    <Input
                      placeholder="23456"
                      value={applicationData.zipCode}
                      onChange={(e) => setApplicationData({...applicationData, zipCode: e.target.value})}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-slate-700 mb-2 block">
                      Years of Experience
                    </label>
                    <select 
                      className="w-full p-3 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={applicationData.experience}
                      onChange={(e) => setApplicationData({...applicationData, experience: e.target.value})}
                      title="Years of Experience"
                    >
                      <option value="">Select experience level</option>
                      <option value="Less than 1 year">Less than 1 year</option>
                      <option value="1-2 years">1-2 years</option>
                      <option value="3-5 years">3-5 years</option>
                      <option value="5+ years">5+ years</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700 mb-2 block">
                      Availability
                    </label>
                    <select 
                      className="w-full p-3 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={applicationData.availability}
                      onChange={(e) => setApplicationData({...applicationData, availability: e.target.value})}
                      title="Availability"
                    >
                      <option value="">Select availability</option>
                      <option value="Full-time (40+ hours/week)">Full-time (40+ hours/week)</option>
                      <option value="Part-time (20-39 hours/week)">Part-time (20-39 hours/week)</option>
                      <option value="PRN/As needed">PRN/As needed</option>
                      <option value="Weekends only">Weekends only</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">
                    Current Certifications
                  </label>
                  <Textarea
                    placeholder="List your current certifications (CNA, PCA, HHA, CPR, First Aid, etc.) and expiration dates..."
                    value={applicationData.certifications}
                    onChange={(e) => setApplicationData({...applicationData, certifications: e.target.value})}
                    rows={3}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">
                    Why do you want to work in home care?
                  </label>
                  <Textarea
                    placeholder="Tell us about your passion for senior care and what motivates you to help others..."
                    value={applicationData.message}
                    onChange={(e) => setApplicationData({...applicationData, message: e.target.value})}
                    rows={4}
                  />
                </div>

                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="font-medium text-blue-900 mb-2">Next Steps After Applying:</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• We&apos;ll contact you within 24 hours to schedule an interview</li>
                    <li>• Background check and reference verification</li>
                    <li>• Skills assessment and orientation</li>
                    <li>• Start earning while you complete our paid training program</li>
                  </ul>
                </div>

                <Button 
                  onClick={handleSubmit}
                  className="w-full bg-gradient-to-r from-blue-600 to-teal-500 text-white"
                  size="lg"
                >
                  <Briefcase className="mr-2 w-5 h-5" />
                  Submit Application
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-teal-500">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h2 className="text-4xl font-bold mb-6">
              Questions About Working With Us?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Our HR team is here to answer any questions about positions, benefits, or the application process.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-white text-blue-600 hover:bg-blue-50 px-8"
                onClick={() => window.location.href = 'tel:+18508610959'}
              >
                <Phone className="mr-2 w-5 h-5" />
                Call HR: (850) 861-0959
              </Button>
              
              <Button 
                variant="outline" 
                size="lg"
                className="px-8 border-white text-white hover:bg-white hover:text-blue-600"
                onClick={() => window.location.href = 'mailto:admin@caringcompasshomecare.com'}
              >
                <Mail className="mr-2 w-5 h-5" />
                Email HR Team
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default CareersPage