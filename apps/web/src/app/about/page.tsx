'use client'

import React from 'react'
import Image from 'next/image'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
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
  Mail
} from 'lucide-react'

const AboutPage = () => {
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
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-teal-50" />
        
        <div className="relative container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <Badge className="mb-6 bg-blue-100 text-blue-700 border-blue-200">
              <Compass className="w-3 h-3 mr-1" />
              Founded in 2024 • Hampton Roads, Virginia
            </Badge>
            
            <h1 className="text-4xl lg:text-6xl font-bold text-slate-900 mb-6 leading-tight">
              About 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-500"> Caring Compass </span>
              Home Care
            </h1>
            
            <p className="text-xl text-slate-600 mb-8 leading-relaxed">
              Born from a deeply personal experience, we&apos;re dedicated to ensuring that no senior feels displaced or loses their sense of belonging. We provide the kind of care that allows our clients to age gracefully in place.
            </p>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-slate-900 mb-6">Our Story</h2>
              <div className="prose prose-lg text-slate-600">
                <p className="mb-6">
                  Caring Compass Home Care LLC was born from a deeply personal and heartbreaking experience. Our CEO, Erickharlein Pierre, shares the story that ignited the passion behind our mission:
                </p>
                
                <blockquote className="border-l-4 border-blue-500 pl-6 italic text-slate-700 mb-6">
                  &quot;I lost my grandmother in a way that forever changed my perspective on elder care. In what we thought was a decision made for her benefit, we moved her from her lifelong home to a care facility. Every time I visited, her plea was always the same: &apos;Take me home.&apos;&quot;
                </blockquote>
                
                <p className="mb-6">
                  Days after the move, his grandmother passed away. The realization hit hard – she had died with a broken heart, filled with sorrow and longing for the home she had been taken from. This experience led to a profound conclusion: they had failed to honor her dignity and her deep human need for familiarity and comfort.
                </p>
                
                <p>
                  This personal tragedy became the catalyst for Caring Compass Home Care LLC. We recognized an urgent need to create a service that truly puts the needs, wishes, and dignity of seniors first.
                </p>
              </div>
            </div>

            <div className="relative">
              <div className="bg-gradient-to-br from-blue-100 to-teal-100 rounded-2xl p-8">
                {/* TODO: Replace <img> with <Image /> from next/image for optimization. See: https://nextjs.org/docs/messages/no-img-element */}
                <Image 
                  src="/api/placeholder/500/400" 
                  alt="Caring for seniors at home"
                  width={500}
                  height={400}
                  className="w-full h-80 object-cover rounded-xl shadow-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission, Vision, Values */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8 mb-16">
            {/* Mission */}
            <Card className="border-slate-200 shadow-lg">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Compass className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl text-slate-900">Our Mission</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 text-center">
                  To provide exceptional non-medical home care services that honor our clients&apos; desire to age in place, enhancing their quality of life by promoting independence, preserving dignity, and nurturing wellbeing.
                </p>
              </CardContent>
            </Card>

            {/* Vision */}
            <Card className="border-slate-200 shadow-lg">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl text-slate-900">Our Vision</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 text-center">
                  To be recognized as the most trusted and respected in-home care provider in Virginia, known for our unwavering commitment to keeping seniors connected to their homes and communities.
                </p>
              </CardContent>
            </Card>

            {/* Philosophy */}
            <Card className="border-slate-200 shadow-lg">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Award className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl text-slate-900">Our Philosophy</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 text-center">
                  The Compass Care Philosophy™ - a comprehensive method that honors the sanctity of home, respects each client&apos;s unique life journey, and provides personalized, non-medical care.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Our Core Values</h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              These values guide every interaction we have and every decision we make in service of our clients and their families.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {coreValues.map((value, index) => (
              <Card key={index} className="group hover:shadow-lg transition-all duration-300 border-slate-200">
                <CardHeader>
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-teal-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <value.icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <CardTitle className="text-xl">{value.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership Team */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Meet Our Leadership Team</h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Our diverse leadership team brings together decades of experience in healthcare, operations, finance, and client care to ensure the highest quality service.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {leadershipTeam.map((member, index) => (
              <Card key={index} className="border-slate-200 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader className="text-center">
                  {/* TODO: Replace <img> with <Image /> from next/image for optimization. See: https://nextjs.org/docs/messages/no-img-element */}
                  <Image 
                    src={member.image} 
                    alt={member.name}
                    width={96}
                    height={96}
                    className="w-24 h-24 rounded-full object-cover mx-auto mb-4 border-4 border-blue-100"
                  />
                  <CardTitle className="text-xl text-slate-900">{member.name}</CardTitle>
                  <p className="text-blue-600 font-medium">{member.title}</p>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 text-sm leading-relaxed">{member.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Achievements */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-teal-500">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Our Impact</h2>
            <p className="text-blue-100 text-lg">Making a difference in the Hampton Roads community</p>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {achievements.map((achievement, index) => (
              <div key={index} className="text-center text-white">
                <achievement.icon className="w-12 h-12 mx-auto mb-4 text-blue-100" />
                <div className="text-3xl lg:text-4xl font-bold mb-2">{achievement.number}</div>
                <div className="text-blue-100">{achievement.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-slate-900 mb-6">
              Ready to Learn More About Our Care?
            </h2>
            <p className="text-xl text-slate-600 mb-8">
              We understand that choosing a home care provider is an important decision. Our team is here to answer your questions and support you through every step of your care journey.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-blue-600 to-teal-500 text-white px-8"
              >
                <Phone className="mr-2 w-5 h-5" />
                Call (850) 861-0959
              </Button>
              
              <Button 
                variant="outline" 
                size="lg"
                className="px-8 border-slate-300 hover:bg-slate-50"
              >
                <Mail className="mr-2 w-5 h-5" />
                Contact Us Online
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default AboutPage