'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { BackToHomeButton } from '@/components/ui/back-to-home-button'
import { 
  Heart, 
  Shield, 
  Users, 
  Home,
  Star,
  Compass,
  Award,
  TrendingUp,
  MessageCircle,
  CheckCircle,
  ArrowRight,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Quote,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Clock
} from 'lucide-react'

const AboutPage = () => {
  const router = useRouter()
  const [expandedMember, setExpandedMember] = useState<number | null>(null)
  const [isVisible, setIsVisible] = useState(false)

  React.useEffect(() => {
    setIsVisible(true)
  }, [])
  const coreValues = [
    {
      title: "Compassionate Dignity",
  description: "We approach every interaction with genuine care, empathy, and unwavering respect for each client&apos;s life story and wishes.",
      icon: Heart
    },
    {
      title: "Home-Centered Care", 
  description: "We honor the profound importance of home in our clients&apos; lives, striving to maintain their connection to familiar surroundings.",
      icon: Home
    },
    {
      title: "Family Partnership",
  description: "We collaborate closely with families, recognizing their vital role in our clients&apos; wellbeing and incorporating their insights.",
      icon: Users
    },
    {
      title: "Personalized Independence",
  description: "We tailor our services to support each client&apos;s unique needs, preferences, and desired level of autonomy.",
      icon: Star
    },
    {
      title: "Ethical Integrity",
  description: "We uphold the highest ethical standards, ensuring transparency in our operations and always prioritizing our clients&apos; best interests.",
      icon: Shield
    },
    {
      title: "Empathetic Listening",
  description: "We commit to truly hearing and understanding our clients&apos; wants and needs, adjusting our care approach accordingly.",
      icon: MessageCircle
    }
  ]

  const leadershipTeam = [
    {
      name: "Erickharlein Pierre",
      title: "Chief Executive Officer (CEO)",
      description: "With over 15 years of experience in healthcare management, Erickharlein brings a wealth of knowledge in operational excellence and client-centered care. His personal experience with family caregiving drives his passion for improving senior care services.",
      image: "/api/placeholder/150/150"
    },
    {
      name: "Jean Pierre", 
      title: "Chief Operating Officer (COO)",
      description: "Jean oversees our day-to-day operations, ensuring that our services are delivered smoothly and efficiently. His experience in operational management helps us maintain high standards and streamline our processes.",
      image: "/api/placeholder/150/150"
    },
    {
      name: "Jacques Geralbert",
      title: "Chief Financial Officer (CFO)", 
      description: "Jacques manages our financial strategies and ensures the fiscal health of our organization. His expertise in finance and accounting guarantees that we remain financially stable.",
      image: "/api/placeholder/150/150"
    },
    {
      name: "Emmanuela Nicolas",
      title: "Chief Marketing Officer (CMO)",
      description: "Emmanuela is responsible for our marketing and outreach efforts. Her innovative approach to marketing helps us connect with the community and communicate the value of our services effectively.",
      image: "/api/placeholder/150/150"
    },
    {
      name: "Mitchela R. Begin",
      title: "Chief Human Resources Officer (CHRO)",
      description: "Mitchela oversees our human resources functions, ensuring that our team is well-supported and trained. Her role is crucial in maintaining a motivated and skilled workforce.",
      image: "/api/placeholder/150/150"
    },
    {
      name: "Denise Colas",
      title: "Director of Client Services",
      description: "Denise is dedicated to managing client relationships and ensuring that our services meet the highest standards of quality. Her role involves coordinating care plans and addressing client concerns.",
      image: "/api/placeholder/150/150"
    }
  ]

  const achievements = [
    { number: "500+", label: "Families Served", icon: Heart },
    { number: "1,200+", label: "Qualified Caregivers", icon: Users },
    { number: "98%", label: "Client Satisfaction", icon: Star },
    { number: "6", label: "Cities Served", icon: Home }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-300/10 rounded-full blur-3xl animate-pulse [animation-delay:0ms]" />
        <div className="absolute top-40 right-20 w-96 h-96 bg-purple-300/10 rounded-full blur-3xl animate-pulse [animation-delay:2000ms]" />
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-pink-300/10 rounded-full blur-3xl animate-pulse [animation-delay:4000ms]" />
        <div className="absolute top-1/2 right-1/4 w-64 h-64 bg-teal-300/10 rounded-full blur-3xl animate-pulse [animation-delay:1000ms]" />
      </div>

      {/* Back Button */}
      <div className="relative z-10 container mx-auto px-4 pt-6">
        <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'}`}>
          <BackToHomeButton />
        </div>
      </div>
      
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-white/30 to-teal-50/50 backdrop-blur-sm" />
        
        <div className="relative z-10 container mx-auto px-4">
          <div className={`text-center max-w-5xl mx-auto transition-all duration-1500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="relative mb-8">
              <Badge className="mb-6 bg-gradient-to-r from-blue-100 to-teal-100 text-blue-700 border-blue-200/50 shadow-lg backdrop-blur-sm hover:scale-105 transition-transform duration-300">
                <Compass className="w-3 h-3 mr-1 animate-spin [animation-duration:8s]" />
                <MapPin className="w-3 h-3 mr-1" />
                Founded in 2024 • Hampton Roads, Virginia
                <Calendar className="w-3 h-3 ml-1" />
              </Badge>
              
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <Sparkles className="w-6 h-6 text-blue-400 animate-pulse" />
              </div>
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-bold text-slate-900 mb-8 leading-tight">
              <span className="inline-block animate-fade-in [animation-delay:300ms]">About</span>
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-teal-500 inline-block animate-fade-in [animation-delay:600ms]"> 
                Caring Compass 
              </span>
              <br />
              <span className="text-3xl lg:text-5xl text-slate-700 inline-block animate-fade-in [animation-delay:900ms]">
                Home Care
              </span>
            </h1>
            
            <div className="relative">
              <p className="text-xl lg:text-2xl text-slate-600 mb-10 leading-relaxed max-w-4xl mx-auto animate-fade-in [animation-delay:1200ms]">
                Born from a deeply personal experience, we&apos;re dedicated to ensuring that no senior feels displaced or loses their sense of belonging. We provide the kind of care that allows our clients to age gracefully in place.
              </p>
              
              {/* Floating icons */}
              <div className="absolute -left-8 top-4 hidden lg:block">
                <Heart className="w-8 h-8 text-pink-400 animate-bounce [animation-delay:2000ms]" />
              </div>
              <div className="absolute -right-8 bottom-4 hidden lg:block">
                <Home className="w-8 h-8 text-blue-400 animate-bounce [animation-delay:3000ms]" />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in [animation-delay:1500ms]">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-blue-600 via-purple-600 to-teal-500 text-white px-8 py-6 text-lg shadow-2xl hover:shadow-3xl hover:scale-105 transition-all duration-300 group"
                onClick={() => router.push('/our-story')}
              >
                <Heart className="mr-2 w-5 h-5 group-hover:animate-pulse" />
                Our Story
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              
              <Button 
                variant="outline" 
                size="lg"
                className="px-8 py-6 text-lg border-slate-300 hover:bg-gradient-to-r hover:from-blue-50 hover:to-teal-50 hover:border-blue-300 transition-all duration-300 backdrop-blur-sm shadow-lg"
                onClick={() => router.push('/team')}
              >
                <Users className="mr-2 w-5 h-5" />
                Meet Our Team
              </Button>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-20 left-20 w-2 h-2 bg-blue-400 rounded-full animate-ping [animation-delay:1000ms]" />
        <div className="absolute bottom-20 right-20 w-3 h-3 bg-teal-400 rounded-full animate-ping [animation-delay:2000ms]" />
        <div className="absolute top-1/2 left-10 w-1 h-1 bg-purple-400 rounded-full animate-ping [animation-delay:3000ms]" />
      </section>

      {/* Our Story Section */}
      <section className="py-24 bg-white/80 backdrop-blur-sm relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50/30 to-teal-50/30" />
        
        <div className="relative z-10 container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1">
              <div className="relative">
                <div className="absolute -top-4 -left-4 w-8 h-8 bg-gradient-to-r from-blue-400 to-teal-400 rounded-full opacity-20" />
                <h2 className="text-5xl font-bold text-slate-900 mb-8">
                  Our 
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-500"> Story</span>
                </h2>
              </div>
              
              <div className="prose prose-lg text-slate-600 space-y-6">
                <p className="text-xl leading-relaxed">
                  Caring Compass Home Care LLC was born from a deeply personal and heartbreaking experience. Our CEO, Erickharlein Pierre, shares the story that ignited the passion behind our mission:
                </p>
                
                <div className="relative">
                  <Quote className="absolute -top-2 -left-2 w-8 h-8 text-blue-400 opacity-30" />
                  <blockquote className="relative bg-gradient-to-r from-blue-50 to-teal-50 border-l-4 border-blue-500 pl-8 pr-6 py-6 italic text-slate-700 rounded-r-2xl shadow-lg">
                    <p className="text-lg leading-relaxed">
                      &quot;I lost my grandmother in a way that forever changed my perspective on elder care. In what we thought was a decision made for her benefit, we moved her from her lifelong home to a care facility. Every time I visited, her plea was always the same: &apos;Take me home.&apos;&quot;
                    </p>
                    <footer className="mt-4 text-sm text-slate-600 not-italic">
                      — Erickharlein Pierre, CEO & Founder
                    </footer>
                  </blockquote>
                </div>
                
                <p className="text-lg leading-relaxed">
                  Days after the move, his grandmother passed away. The realization hit hard – she had died with a broken heart, filled with sorrow and longing for the home she had been taken from. This experience led to a profound conclusion: they had failed to honor her dignity and her deep human need for familiarity and comfort.
                </p>
                
                <div className="bg-gradient-to-r from-blue-600 to-teal-500 rounded-2xl p-6 text-white shadow-xl">
                  <p className="text-lg leading-relaxed">
                    This personal tragedy became the catalyst for Caring Compass Home Care LLC. We recognized an urgent need to create a service that truly puts the needs, wishes, and dignity of seniors first.
                  </p>
                </div>
              </div>
            </div>

            <div className="order-1 lg:order-2 relative">
              <div className="relative group">
                {/* Main image container with enhanced styling */}
                <div className="bg-gradient-to-br from-blue-100 via-purple-50 to-teal-100 rounded-3xl p-8 shadow-2xl group-hover:shadow-3xl transition-all duration-500 group-hover:scale-105">
                  <div className="relative overflow-hidden rounded-2xl">
                    <Image 
                      src="/api/placeholder/600/500" 
                      alt="Caring for seniors at home"
                      width={600}
                      height={500}
                      className="w-full h-96 object-cover shadow-lg group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                    
                    {/* Overlay content */}
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-lg">
                        <p className="text-sm font-medium text-slate-800">
                          💙 Home is where the heart belongs
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Floating elements */}
                <div className="absolute -top-6 -right-6 w-12 h-12 bg-gradient-to-r from-pink-400 to-rose-400 rounded-full flex items-center justify-center shadow-lg animate-bounce [animation-delay:1000ms]">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                
                <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-gradient-to-r from-blue-400 to-teal-400 rounded-2xl flex items-center justify-center shadow-lg animate-pulse">
                  <Home className="w-8 h-8 text-white" />
                </div>
                
                {/* Background decoration */}
                <div className="absolute top-8 right-8 w-32 h-32 bg-gradient-to-r from-purple-200/30 to-pink-200/30 rounded-full blur-2xl -z-10" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission, Vision, Values */}
      <section className="py-24 bg-gradient-to-br from-slate-50 via-blue-50/50 to-purple-50/30 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-20 left-20 w-96 h-96 bg-blue-200/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-80 h-80 bg-purple-200/10 rounded-full blur-3xl" />
        </div>
        
        <div className="relative z-10 container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-slate-900 mb-6">
              Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-500">Foundation</span>
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              Three pillars that guide our commitment to exceptional care
            </p>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-8 mb-16">
            {/* Mission */}
            <Card className="group border-slate-200 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 bg-white/80 backdrop-blur-sm overflow-hidden relative">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-teal-500" />
              <CardHeader className="text-center relative">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-teal-500 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:rotate-12 transition-transform duration-500 shadow-lg">
                  <Compass className="w-10 h-10 text-white group-hover:animate-spin [animation-duration:2s]" />
                </div>
                <CardTitle className="text-2xl text-slate-900 group-hover:text-blue-600 transition-colors">Our Mission</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 text-center leading-relaxed">
                  To provide exceptional non-medical home care services that honor our clients&apos; desire to age in place, enhancing their quality of life by promoting independence, preserving dignity, and nurturing wellbeing.
                </p>
              </CardContent>
            </Card>

            {/* Vision */}
            <Card className="group border-slate-200 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 bg-white/80 backdrop-blur-sm overflow-hidden relative">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-600 to-pink-500" />
              <CardHeader className="text-center relative">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-pink-500 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:rotate-12 transition-transform duration-500 shadow-lg">
                  <TrendingUp className="w-10 h-10 text-white group-hover:animate-pulse" />
                </div>
                <CardTitle className="text-2xl text-slate-900 group-hover:text-purple-600 transition-colors">Our Vision</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 text-center leading-relaxed">
                  To be recognized as the most trusted and respected in-home care provider in Virginia, known for our unwavering commitment to keeping seniors connected to their homes and communities.
                </p>
              </CardContent>
            </Card>

            {/* Philosophy */}
            <Card className="group border-slate-200 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 bg-white/80 backdrop-blur-sm overflow-hidden relative">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-teal-600 to-emerald-500" />
              <CardHeader className="text-center relative">
                <div className="w-20 h-20 bg-gradient-to-br from-teal-600 to-emerald-500 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:rotate-12 transition-transform duration-500 shadow-lg">
                  <Award className="w-10 h-10 text-white group-hover:animate-bounce" />
                </div>
                <CardTitle className="text-2xl text-slate-900 group-hover:text-teal-600 transition-colors">Our Philosophy</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 text-center leading-relaxed">
                  The Compass Care Philosophy™ - a comprehensive method that honors the sanctity of home, respects each client&apos;s unique life journey, and provides personalized, non-medical care.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-24 bg-white/90 backdrop-blur-sm relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50/30 via-transparent to-teal-50/30" />
        
        <div className="relative z-10 container mx-auto px-4">
          <div className="text-center mb-20">
            <div className="relative inline-block">
              <h2 className="text-5xl font-bold text-slate-900 mb-6">
                Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-teal-500">Core Values</span>
              </h2>
              <div className="absolute -top-2 -right-2">
                <div className="w-4 h-4 bg-gradient-to-r from-blue-400 to-teal-400 rounded-full animate-ping" />
              </div>
            </div>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              These values guide every interaction we have and every decision we make in service of our clients and their families.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {coreValues.map((value, index) => (
              <Card 
                key={index} 
                className="group hover:shadow-2xl transition-all duration-500 border-slate-200 bg-white/80 backdrop-blur-sm hover:scale-105 hover:-translate-y-2 relative overflow-hidden"
              >
                {/* Animated background gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-purple-50/30 to-teal-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <CardHeader className="relative z-10">
                  <div className="relative">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-teal-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 shadow-lg group-hover:shadow-xl">
                      <value.icon className="w-8 h-8 text-blue-600 group-hover:text-teal-600 transition-colors duration-300" />
                    </div>
                    
                    {/* Floating badge */}
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-pink-400 to-rose-400 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      <CheckCircle className="w-3 h-3 text-white" />
                    </div>
                  </div>
                  
                  <CardTitle className="text-xl group-hover:text-blue-600 transition-colors duration-300">
                    {value.title}
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="relative z-10">
                  <p className="text-slate-600 leading-relaxed group-hover:text-slate-700 transition-colors duration-300">
                    {value.description}
                  </p>
                </CardContent>
                
                {/* Corner decoration */}
                <div className="absolute bottom-0 right-0 w-20 h-20 bg-gradient-to-tl from-blue-100/20 to-transparent rounded-tl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership Team */}
      <section className="py-24 bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20 relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-64 h-64 bg-blue-200/10 rounded-full blur-3xl animate-pulse [animation-delay:0ms]" />
          <div className="absolute bottom-20 right-10 w-80 h-80 bg-purple-200/10 rounded-full blur-3xl animate-pulse [animation-delay:2000ms]" />
        </div>
        
        <div className="relative z-10 container mx-auto px-4">
          <div className="text-center mb-20">
            <div className="relative inline-block">
              <h2 className="text-5xl font-bold text-slate-900 mb-6">
                Meet Our 
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-teal-500"> Leadership Team</span>
              </h2>
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-blue-600 to-teal-500 rounded-full" />
            </div>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed mt-8">
              Our diverse leadership team brings together decades of experience in healthcare, operations, finance, and client care to ensure the highest quality service.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {leadershipTeam.map((member, index) => (
              <Card 
                key={index} 
                className="group border-slate-200 shadow-xl hover:shadow-2xl transition-all duration-500 bg-white/90 backdrop-blur-sm hover:scale-105 hover:-translate-y-2 overflow-hidden relative"
              >
                {/* Gradient background overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/0 via-purple-50/0 to-teal-50/0 group-hover:from-blue-50/50 group-hover:via-purple-50/30 group-hover:to-teal-50/50 transition-all duration-500" />
                
                <CardHeader className="text-center relative z-10">
                  <div className="relative mx-auto mb-6">
                    {/* Profile image with enhanced styling */}
                    <div className="relative">
                      <Image 
                        src={member.image} 
                        alt={member.name}
                        width={120}
                        height={120}
                        className="w-28 h-28 rounded-full object-cover mx-auto border-4 border-white shadow-lg group-hover:shadow-xl transition-all duration-500 group-hover:scale-110"
                      />
                      
                      {/* Animated ring */}
                      <div className="absolute inset-0 rounded-full border-2 border-blue-400 opacity-0 group-hover:opacity-100 animate-ping group-hover:animate-pulse transition-opacity duration-500" />
                      
                      {/* Status indicator */}
                      <div className="absolute bottom-1 right-1 w-6 h-6 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full border-2 border-white flex items-center justify-center">
                        <CheckCircle className="w-3 h-3 text-white" />
                      </div>
                    </div>
                  </div>
                  
                  <CardTitle className="text-xl text-slate-900 group-hover:text-blue-600 transition-colors duration-300 mb-2">
                    {member.name}
                  </CardTitle>
                  <p className="text-blue-600 font-medium mb-4 group-hover:text-purple-600 transition-colors duration-300">
                    {member.title}
                  </p>
                </CardHeader>
                
                <CardContent className="relative z-10">
                  <div className="relative">
                    <p className={`text-slate-600 text-sm leading-relaxed transition-all duration-500 ${
                      expandedMember === index ? 'max-h-none' : 'max-h-20 overflow-hidden'
                    }`}>
                      {member.description}
                    </p>
                    
                    {/* Gradient fade for collapsed text */}
                    {expandedMember !== index && (
                      <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white/90 to-transparent pointer-events-none" />
                    )}
                  </div>
                  
                  {/* Read more/less button */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setExpandedMember(expandedMember === index ? null : index)}
                    className="mt-4 p-0 h-auto text-blue-600 hover:text-purple-600 transition-colors duration-300"
                  >
                    {expandedMember === index ? (
                      <>
                        Read Less <ChevronUp className="ml-1 w-4 h-4" />
                      </>
                    ) : (
                      <>
                        Read More <ChevronDown className="ml-1 w-4 h-4" />
                      </>
                    )}
                  </Button>
                </CardContent>
                
                {/* Corner decoration */}
                <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-blue-100/20 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Achievements */}
      <section className="py-20 bg-gradient-to-r from-blue-600 via-purple-600 to-teal-500 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full animate-pulse [animation-delay:0ms]" />
          <div className="absolute top-20 right-20 w-24 h-24 bg-white/10 rounded-full animate-pulse [animation-delay:1000ms]" />
          <div className="absolute bottom-10 left-1/3 w-40 h-40 bg-white/10 rounded-full animate-pulse [animation-delay:2000ms]" />
          <div className="absolute bottom-20 right-10 w-20 h-20 bg-white/10 rounded-full animate-pulse [animation-delay:1500ms]" />
        </div>
        
        <div className="relative z-10 container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Our <span className="text-blue-100">Impact</span>
            </h2>
            <p className="text-blue-100 text-xl leading-relaxed max-w-2xl mx-auto">
              Making a meaningful difference in the Hampton Roads community, one family at a time
            </p>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {achievements.map((achievement, index) => (
              <div 
                key={index} 
                className="text-center text-white group hover:scale-110 transition-all duration-500 cursor-pointer"
              >
                <div className="relative mb-6">
                  <div className="w-20 h-20 mx-auto bg-white/20 rounded-2xl flex items-center justify-center group-hover:bg-white/30 transition-colors duration-300 backdrop-blur-sm group-hover:rotate-12">
                    <achievement.icon className="w-10 h-10 text-blue-100 group-hover:text-white transition-colors duration-300" />
                  </div>
                  
                  {/* Floating sparkles */}
                  <div className="absolute -top-2 -right-2 w-4 h-4 bg-yellow-300 rounded-full animate-ping opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                
                <div className="text-4xl lg:text-5xl font-bold mb-3 group-hover:scale-110 transition-transform duration-300">
                  {achievement.number}
                </div>
                <div className="text-blue-100 text-lg font-medium group-hover:text-white transition-colors duration-300">
                  {achievement.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-24 bg-white/90 backdrop-blur-sm relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-50/30 via-transparent to-teal-50/30" />
          <div className="absolute top-20 right-20 w-64 h-64 bg-blue-200/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-20 w-80 h-80 bg-purple-200/10 rounded-full blur-3xl" />
        </div>
        
        <div className="relative z-10 container mx-auto px-4">
          <div className="max-w-5xl mx-auto text-center">
            <div className="relative">
              <h2 className="text-4xl lg:text-6xl font-bold text-slate-900 mb-8 leading-tight">
                Ready to Learn More About Our 
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-teal-500"> Care?</span>
              </h2>
              
              {/* Floating decorative elements */}
              <div className="absolute -top-4 left-10 hidden lg:block">
                <Heart className="w-8 h-8 text-pink-400 animate-bounce [animation-delay:1000ms]" />
              </div>
              <div className="absolute -top-2 right-10 hidden lg:block">
                <Sparkles className="w-6 h-6 text-blue-400 animate-pulse [animation-delay:2000ms]" />
              </div>
            </div>
            
            <p className="text-xl lg:text-2xl text-slate-600 mb-12 leading-relaxed max-w-4xl mx-auto">
              We understand that choosing a home care provider is an important decision. Our team is here to answer your questions and support you through every step of your care journey.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-blue-600 via-purple-600 to-teal-500 text-white px-10 py-6 text-lg shadow-2xl hover:shadow-3xl hover:scale-105 transition-all duration-300 group"
                onClick={() => window.location.href = 'tel:+17575552273'}
              >
                <Phone className="mr-3 w-6 h-6 group-hover:animate-pulse" />
                Call (757) 555-CARE
                <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </Button>
              
              <Button 
                variant="outline" 
                size="lg"
                className="px-10 py-6 text-lg border-slate-300 hover:bg-gradient-to-r hover:from-blue-50 hover:to-teal-50 hover:border-blue-300 transition-all duration-300 backdrop-blur-sm shadow-lg group"
                onClick={() => router.push('/contact')}
              >
                <Mail className="mr-3 w-6 h-6 group-hover:animate-bounce" />
                Contact Us Online
                <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
            
            {/* Additional contact info */}
            <div className="mt-12 flex flex-col sm:flex-row gap-8 justify-center items-center text-slate-600">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-blue-500" />
                <span>Hampton Roads, Virginia</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-teal-500" />
                <span>24/7 Care Available</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default AboutPage