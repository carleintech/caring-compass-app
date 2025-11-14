'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  Heart, 
  Home, 
  Users, 
  Award, 
  Compass, 
  Star,
  CheckCircle,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Target,
  Eye,
  Lightbulb
} from 'lucide-react'

export default function OurStoryPage() {
  const router = useRouter()
  
  const founders = [
    {
      name: "Erickharlein Pierre",
      role: "CEO & Co-Founder",
      ownership: "20%",
      background: "15+ years healthcare management experience",
      passion: "Improving senior care services through personal experience"
    },
    {
      name: "Geralbert Jacques", 
      role: "COO & Co-Founder",
      ownership: "16%",
      background: "Logistics and human resources expertise",
      passion: "Creating positive work environments for caregivers"
    },
    {
      name: "Mitchela Begin",
      role: "Director of Care Services",
      ownership: "16%",
      background: "Registered nurse with gerontology specialization",
      passion: "Ensuring highest standards of senior care"
    },
    {
      name: "Jean Pierre",
      role: "Director of Training & Development", 
      ownership: "16%",
      background: "Adult education and healthcare training",
      passion: "Advancing caregiver skills and best practices"
    },
    {
      name: "Colas Marie Denise",
      role: "Director of Client Relations",
      ownership: "16%",
      background: "Customer service and social work",
      passion: "Advocating for clients and their families"
    },
    {
      name: "Emmanuella Nicolas",
      role: "Director of Community Outreach",
      ownership: "16%",
      background: "Public relations and community organizing",
      passion: "Building strong community partnerships"
    }
  ]

  const timeline = [
    {
      year: "The Experience",
      title: "A Personal Loss That Changed Everything",
      description: "CEO Erickharlein Pierre's grandmother was moved from her lifelong home to a care facility. Her constant plea was 'Take me home.' Days after the move, she passed away with a broken heart, longing for the comfort of familiar surroundings."
    },
    {
      year: "2024",
      title: "The Vision is Born",
      description: "Driven by this profound loss, Erickharlein founded Caring Compass Home Care LLC with a clear mission: to ensure no senior feels displaced or loses their sense of belonging."
    },
    {
      year: "Early 2024",
      title: "Building the Foundation",
      description: "The founding team comes together, each bringing unique expertise and shared commitment to revolutionizing home care in Hampton Roads."
    },
    {
      year: "Present",
      title: "Serving Hampton Roads",
      description: "Today, we serve Virginia Beach, Norfolk, Newport News, Portsmouth, Chesapeake, and Suffolk with compassionate, personalized care that honors our clients' desire to age in place."
    }
  ]

  const values = [
    {
      icon: <Heart className="h-8 w-8" />,
      title: "Compassionate Dignity",
      description: "We approach every interaction with genuine care, empathy, and unwavering respect for each client's life story and wishes."
    },
    {
      icon: <Home className="h-8 w-8" />,
      title: "Home-Centered Care",
      description: "We honor the profound importance of home in our clients' lives, striving to maintain their connection to familiar surroundings and cherished memories."
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Family Partnership",
      description: "We collaborate closely with families, recognizing their vital role in our clients' wellbeing and incorporating their insights into our care plans."
    },
    {
      icon: <Target className="h-8 w-8" />,
      title: "Personalized Independence",
      description: "We tailor our services to support each client's unique needs, preferences, and desired level of autonomy, promoting independence wherever possible."
    },
    {
      icon: <CheckCircle className="h-8 w-8" />,
      title: "Ethical Integrity",
      description: "We uphold the highest ethical standards, ensuring transparency in our operations and always prioritizing our clients' best interests."
    },
    {
      icon: <Lightbulb className="h-8 w-8" />,
      title: "Continuous Growth",
      description: "We dedicate ourselves to ongoing learning and improvement, staying attuned to the latest best practices in non-medical home care."
    }
  ]

  const philosophy = [
    {
      title: "Home-Centered Care Planning",
      description: "We begin with a thorough assessment of each client's physical, emotional, and social needs, as well as their personal preferences and life history, all within the context of their home environment."
    },
    {
      title: "Holistic Wellbeing in Familiar Surroundings", 
      description: "Our care goes beyond basic physical needs to address emotional, social, and cognitive aspects of wellbeing, all while leveraging the comfort and familiarity of the client's home."
    },
    {
      title: "Empathetic Caregiver Matching",
      description: "We carefully match caregivers with clients based on needs, personalities, and shared interests, fostering meaningful connections that help our clients feel comfortable and understood."
    },
    {
      title: "Continuous Staff Development",
      description: "Our caregivers receive ongoing training in the latest non-medical care techniques, communication skills, and specialized areas such as dementia care or companionship."
    },
    {
      title: "Family Integration",
      description: "We view family members as essential partners in care, maintaining open lines of communication and providing support and education to help them participate in their loved one's care journey."
    },
    {
      title: "Preserving Dignity Through Familiarity",
      description: "All our care practices are designed to maximize client independence and preserve dignity by respecting personal choices and preferences, and by supporting daily routines in the comfort of their own homes."
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-teal-600 text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center max-w-4xl mx-auto">
            <div className="flex justify-center mb-6">
              <div className="bg-white/20 p-4 rounded-full">
                <Compass className="h-12 w-12" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Our Story
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              Born from a personal tragedy, driven by a mission to honor dignity
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16">
        {/* The Origin Story */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              The Story That Started It All
            </h2>
            <p className="text-lg text-gray-600">
              Every great mission begins with a moment of truth. Ours began with a profound loss.
            </p>
          </div>
          
          <Card className="border-0 shadow-2xl">
            <CardContent className="p-8">
              <div className="prose prose-lg max-w-none">
                <blockquote className="text-xl italic text-gray-700 border-l-4 border-blue-500 pl-6 mb-6">
                  &quot;I lost my grandmother in a way that forever changed my perspective on elder care. In what we thought was a decision made for her benefit, we moved her from her lifelong home to a care facility. Every time I visited, her plea was always the same: &lsquo;Take me home.&rsquo;&quot;
                </blockquote>
                
                <p className="text-gray-700 mb-4">
                  At the time, CEO Erickharlein Pierre couldn&apos;t fully grasp the depth of his grandmother&apos;s anguish – the pain of being uprooted from the comfort of familiar surroundings, from the home where she had built a lifetime of memories.
                </p>
                
                <p className="text-gray-700 mb-4">
                  Days after the move, his grandmother passed away. The realization hit hard – she had died with a broken heart, filled with sorrow and longing for the home she had been taken from. This experience led to a profound conclusion: they had failed to honor her dignity and her deep human need for familiarity and comfort in her final days.
                </p>
                
                <div className="bg-blue-50 p-6 rounded-lg mt-6">
                  <p className="text-gray-800 font-medium text-center">
                    &quot;This personal tragedy became the catalyst for Caring Compass Home Care LLC. We recognized an urgent need to create a service that truly puts the needs, wishes, and dignity of seniors first.&quot;
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Mission & Vision */}
        <div className="mb-16">
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="border-0 shadow-lg">
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="bg-gradient-to-r from-blue-500 to-teal-500 text-white p-3 rounded-full">
                    <Target className="h-8 w-8" />
                  </div>
                </div>
                <CardTitle className="text-2xl font-bold text-gray-900">Our Mission</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 text-center">
                  To provide exceptional non-medical home care services that honor our clients&apos; desire to age in place, enhancing their quality of life by promoting independence, preserving dignity, and nurturing wellbeing through compassionate, personalized support in the familiar comfort of their own homes.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="bg-gradient-to-r from-blue-500 to-teal-500 text-white p-3 rounded-full">
                    <Eye className="h-8 w-8" />
                  </div>
                </div>
                <CardTitle className="text-2xl font-bold text-gray-900">Our Vision</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 text-center">
                  To be recognized as the most trusted and respected in-home care provider in Virginia, known for our unwavering commitment to keeping seniors connected to their homes and communities, while delivering excellence in personalized, compassionate care that celebrates each client&apos;s unique life story.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Timeline */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Our Journey
          </h2>
          <div className="max-w-4xl mx-auto">
            {timeline.map((item, index) => (
              <div key={index} className="flex items-start mb-8 last:mb-0">
                <div className="flex-shrink-0 mr-6">
                  <div className="bg-gradient-to-r from-blue-500 to-teal-500 text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm">
                    {index + 1}
                  </div>
                </div>
                <div className="flex-grow">
                  <div className="bg-white rounded-lg p-6 shadow-md">
                    <Badge className="mb-2 bg-blue-100 text-blue-800">{item.year}</Badge>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                    <p className="text-gray-700">{item.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Core Values */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Our Core Values
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="h-full hover:shadow-lg transition-all duration-300 border-0 shadow-md">
                <CardHeader className="text-center pb-4">
                  <div className="flex justify-center mb-4">
                    <div className="bg-gradient-to-r from-blue-500 to-teal-500 text-white p-3 rounded-full">
                      {value.icon}
                    </div>
                  </div>
                  <CardTitle className="text-lg font-bold text-gray-900">
                    {value.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm text-center">
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* The Compass Care Philosophy */}
        <div className="mb-16 bg-gradient-to-r from-blue-50 to-teal-50 rounded-2xl p-8">
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <div className="bg-gradient-to-r from-blue-500 to-teal-500 text-white p-4 rounded-full">
                <Compass className="h-12 w-12" />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              The Compass Care Philosophy™
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              At the heart of our approach is the Compass Care Philosophy™, a comprehensive method that honors the sanctity of home, respects each client&apos;s unique life journey, and provides personalized, non-medical care.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {philosophy.map((item, index) => (
              <div key={index} className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  {item.title}
                </h3>
                <p className="text-gray-700 text-sm">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Leadership Team */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Our Leadership Team
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {founders.map((founder, index) => (
              <Card key={index} className="h-full hover:shadow-lg transition-all duration-300 border-0 shadow-md">
                <CardHeader className="text-center">
                  <div className="bg-gradient-to-r from-blue-500 to-teal-500 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                    {founder.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <CardTitle className="text-lg font-bold text-gray-900">
                    {founder.name}
                  </CardTitle>
                  <CardDescription className="text-blue-600 font-medium">
                    {founder.role}
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                  <p className="text-gray-600 text-sm mb-3">
                    {founder.background}
                  </p>
                  <p className="text-gray-700 text-sm italic">
                    &quot;{founder.passion}&quot;
                  </p>
                  <Button 
                    onClick={() => router.push(`/team/${founder.name.toLowerCase().replace(/\s+/g, '-')}`)}
                    className="bg-gradient-to-r from-blue-500 to-teal-500 text-white hover:from-blue-600 hover:to-teal-600 w-full mt-3"
                  >
                    View Full Bio
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Service Area */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Serving Hampton Roads
          </h2>
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                  Our Community
                </h3>
                <p className="text-gray-700 mb-6">
                  We&apos;re proud to serve the Hampton Roads region, bringing compassionate home care to families across Virginia Beach, Norfolk, Newport News, Portsmouth, Chesapeake, and Suffolk. Our deep understanding of the local community helps us provide care that truly feels like home.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  {['Virginia Beach', 'Norfolk', 'Newport News', 'Portsmouth', 'Chesapeake', 'Suffolk'].map((city, index) => (
                    <div key={index} className="flex items-center">
                      <MapPin className="h-4 w-4 text-blue-500 mr-2" />
                      <span className="text-gray-700 text-sm">{city}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-gradient-to-br from-blue-100 to-teal-100 rounded-xl p-6 text-center">
                <Calendar className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Founded in 2024
                </h3>
                <p className="text-gray-700 mb-4">
                  A new company with a timeless mission: keeping families together at home.
                </p>
                <div className="flex justify-center space-x-4 text-sm text-gray-600">
                  <div className="text-center">
                    <div className="font-semibold text-blue-600">6</div>
                    <div>Founders</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-blue-600">6</div>
                    <div>Cities Served</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-blue-600">1</div>
                    <div>Mission</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-blue-600 to-teal-600 text-white rounded-2xl p-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Be Part of Our Story
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Let us help you or your loved one stay home, stay comfortable, and stay connected
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 flex-1">
              <Phone className="mr-2 h-5 w-5" />
              Call Today
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 flex-1">
              <Mail className="mr-2 h-5 w-5" />
              Get Started
            </Button>
          </div>
          <p className="text-blue-100 mt-4 text-sm">
            Free consultation • Licensed & insured • Available 24/7
          </p>
        </div>
      </div>
    </div>
  )
}