'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  ArrowLeft,
  Mail,
  Phone,
  Award,
  Briefcase,
  GraduationCap,
  Heart,
  Star,
  Target,
  Users
} from 'lucide-react'

// Team member data
const teamMembers: Record<string, any> = {
  'erickharlein-pierre': {
    name: "Erickharlein Pierre",
    role: "Chief Executive Officer (CEO)",
    email: "erickharlein@caringcompasshomescare.com",
    phone: "(757) 555-CARE",
    image: "/api/placeholder/300/300",
    bio: "Erickharlein Pierre is the visionary founder and CEO of Caring Compass Home Care LLC. With over 15 years of experience in healthcare management, Erickharlein's journey into home care was deeply personal. After losing his grandmother following a move to a care facility—witnessing her repeated pleas to 'take me home'—he understood the profound importance of allowing seniors to age with dignity in their own homes. This experience became the catalyst for founding Caring Compass, where he leads with empathy, innovation, and an unwavering commitment to honoring each client's desire to remain in the comfort of their home.",
    education: [
      "MBA, Healthcare Administration - University of Florida",
      "Bachelor's in Business Management"
    ],
    experience: [
      "15+ years in healthcare management and operations",
      "Former Director of Operations at regional healthcare network",
      "Certified Healthcare Executive (CHE)"
    ],
    achievements: [
      "Founded Caring Compass Home Care LLC in 2023",
      "Established Compass Care Philosophy™",
      "Led company to serve 500+ families in first year",
      "Built team of 1,200+ qualified caregivers"
    ],
    specialties: [
      "Healthcare Operations Management",
      "Strategic Business Planning",
      "Quality Assurance & Compliance",
      "Team Leadership & Development"
    ],
    passion: "Transforming elder care by keeping families together and seniors in the homes they love"
  },
  'geralbert-jacques': {
    name: "Geralbert Jacques",
    role: "Chief Operating Officer (COO)",
    email: "geralbert@caringcompasshomescare.com",
    phone: "(757) 555-CARE",
    image: "/api/placeholder/300/300",
    bio: "Geralbert Jacques serves as the Chief Operating Officer, bringing extensive expertise in logistics, operations, and human resources to Caring Compass Home Care. With a background in optimizing complex operational systems, Geralbert ensures that our care delivery runs seamlessly while maintaining the highest standards of quality. His commitment to creating positive work environments has been instrumental in building our exceptional team of caregivers who share our passion for compassionate care.",
    education: [
      "Master's in Business Administration - Operations Management",
      "Bachelor's in Industrial Engineering"
    ],
    experience: [
      "12+ years in operations and logistics management",
      "Expert in process optimization and quality control",
      "Certified Six Sigma Black Belt"
    ],
    achievements: [
      "Streamlined operations to serve multiple Virginia cities",
      "Developed caregiver scheduling system with 98% efficiency",
      "Created comprehensive onboarding program for new caregivers",
      "Implemented quality assurance protocols exceeding state standards"
    ],
    specialties: [
      "Operations Management",
      "Human Resources Strategy",
      "Process Optimization",
      "Supply Chain Management"
    ],
    passion: "Creating environments where caregivers thrive so they can provide exceptional care"
  },
  'mitchela-begin': {
    name: "Mitchela Begin",
    role: "Chief Human Resources Officer (CHRO)",
    email: "mitchela@caringcompasshomescare.com",
    phone: "(757) 555-CARE",
    image: "/api/placeholder/300/300",
    bio: "Mitchela Begin leads our human resources functions with a focus on building and nurturing a skilled, compassionate workforce. With deep expertise in healthcare HR and employee development, Mitchela ensures that every caregiver on our team receives world-class training and ongoing support. Her innovative approach to recruitment, training, and retention has helped us build one of the most qualified caregiver networks in Virginia, ensuring our clients receive care from professionals who are not just skilled, but truly passionate about making a difference.",
    education: [
      "Master's in Human Resources Management",
      "Bachelor's in Psychology",
      "SHRM Senior Certified Professional (SHRM-SCP)"
    ],
    experience: [
      "10+ years in healthcare human resources",
      "Expert in talent acquisition and development",
      "Specialized in caregiver training programs"
    ],
    achievements: [
      "Built recruitment program attracting top caregiver talent",
      "Developed comprehensive 160-hour training curriculum",
      "Achieved 95% caregiver retention rate",
      "Created mentorship program for new caregivers"
    ],
    specialties: [
      "Healthcare HR Management",
      "Talent Development & Training",
      "Employee Engagement",
      "Performance Management"
    ],
    passion: "Empowering caregivers with the skills and support they need to excel in their calling"
  },
  'jean-pierre': {
    name: "Jean Pierre",
    role: "Chief Financial Officer (CFO)",
    email: "jean@caringcompasshomescare.com",
    phone: "(757) 555-CARE",
    image: "/api/placeholder/300/300",
    bio: "Jean Pierre serves as Chief Financial Officer, overseeing all financial operations and ensuring the fiscal health of Caring Compass Home Care. With expertise in healthcare finance and accounting, Jean manages budgets, financial planning, and ensures we maintain the resources necessary to provide exceptional care while remaining accessible to families. His strategic financial management has enabled us to invest in quality training, competitive caregiver compensation, and continuous service improvements.",
    education: [
      "Master's in Finance and Accounting",
      "Bachelor's in Business Administration",
      "Certified Public Accountant (CPA)"
    ],
    experience: [
      "15+ years in financial management",
      "Former CFO of regional healthcare organization",
      "Expert in healthcare financial operations"
    ],
    achievements: [
      "Implemented financial systems supporting rapid growth",
      "Secured funding for business expansion",
      "Developed pricing models balancing quality and affordability",
      "Achieved strong financial performance metrics"
    ],
    specialties: [
      "Financial Planning & Analysis",
      "Healthcare Finance",
      "Budget Management",
      "Strategic Investment"
    ],
    passion: "Ensuring financial stability enables us to invest in exceptional care delivery"
  },
  'emmanuela-nicolas': {
    name: "Emmanuela Nicolas",
    role: "Chief Marketing Officer (CMO)",
    email: "emmanuela@caringcompasshomescare.com",
    phone: "(757) 555-CARE",
    image: "/api/placeholder/300/300",
    bio: "Emmanuela Nicolas leads our marketing and community outreach efforts as Chief Marketing Officer. With innovative marketing strategies and a deep understanding of the home care industry, Emmanuela helps families discover how Caring Compass can support their loved ones. Her creative approach to storytelling and community engagement has made us a trusted name in Virginia home care, connecting us with families who value compassionate, personalized care.",
    education: [
      "Master's in Marketing and Communications",
      "Bachelor's in Business Administration"
    ],
    experience: [
      "12+ years in healthcare marketing",
      "Expert in digital marketing and brand development",
      "Community engagement specialist"
    ],
    achievements: [
      "Developed brand identity reflecting our care philosophy",
      "Created digital presence reaching thousands of families",
      "Established partnerships with senior centers and healthcare providers",
      "Won regional awards for healthcare marketing campaigns"
    ],
    specialties: [
      "Healthcare Marketing",
      "Brand Development",
      "Digital Marketing Strategy",
      "Community Relations"
    ],
    passion: "Connecting families with the compassionate care their loved ones deserve"
  },
  'denise-colas': {
    name: "Denise Colas",
    role: "Director of Client Services",
    email: "denise@caringcompasshomescare.com",
    phone: "(757) 555-CARE",
    image: "/api/placeholder/300/300",
    bio: "Denise Colas serves as Director of Client Services, ensuring every client receives personalized, high-quality care. With her background in patient advocacy and care coordination, Denise oversees care plan development, client relationships, and continuous quality improvement. She works closely with families to understand their unique needs and coordinates with our caregivers to deliver exceptional service that honors each client's dignity and independence.",
    education: [
      "Master's in Healthcare Administration",
      "Bachelor's in Social Work",
      "Licensed Clinical Social Worker (LCSW)"
    ],
    experience: [
      "15+ years in patient advocacy and care coordination",
      "Expert in geriatric care management",
      "Specialized in family support services"
    ],
    achievements: [
      "Achieved 98% client satisfaction rating",
      "Developed personalized care assessment process",
      "Created family communication system ensuring transparency",
      "Implemented continuous quality improvement protocols"
    ],
    specialties: [
      "Care Plan Development",
      "Client Relationship Management",
      "Quality Assurance",
      "Family Support Services"
    ],
    passion: "Ensuring every client receives care that honors their unique needs and preferences"
  }
}

export default function TeamMemberBioPage({ params }: { params: { slug: string } }) {
  const router = useRouter()
  const member = teamMembers[params.slug]

  if (!member) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
        <Card className="max-w-md">
          <CardContent className="p-8 text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Team Member Not Found</h1>
            <p className="text-gray-600 mb-6">The team member you're looking for doesn't exist.</p>
            <Button onClick={() => router.push('/team')}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Team
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-teal-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-teal-600 text-white py-12">
        <div className="container mx-auto px-4">
          <Button 
            variant="ghost" 
            onClick={() => router.push('/our-story')}
            className="text-white hover:bg-white/20 mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Our Story
          </Button>
          <h1 className="text-4xl md:text-5xl font-bold">Leadership Biography</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto">
          {/* Profile Card */}
          <Card className="mb-8 border-0 shadow-2xl">
            <CardContent className="p-8">
              <div className="grid md:grid-cols-3 gap-8">
                {/* Profile Image */}
                <div className="text-center">
                  <div className="bg-gradient-to-r from-blue-500 to-teal-500 text-white w-48 h-48 rounded-full flex items-center justify-center text-6xl font-bold mx-auto mb-4 shadow-xl">
                    {member.name.split(' ').map((n: string) => n[0]).join('')}
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">{member.name}</h2>
                  <Badge className="bg-gradient-to-r from-blue-500 to-teal-500 text-white text-sm px-4 py-1">
                    {member.role}
                  </Badge>
                </div>

                {/* Contact & Quick Info */}
                <div className="md:col-span-2 space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                      <Heart className="mr-2 h-5 w-5 text-red-500" />
                      Passion & Purpose
                    </h3>
                    <p className="text-gray-700 italic">&quot;{member.passion}&quot;</p>
                  </div>

                  <Separator />

                  <div className="flex flex-col space-y-3">
                    <a 
                      href={`mailto:${member.email}`}
                      className="flex items-center text-blue-600 hover:text-blue-700 transition-colors"
                    >
                      <Mail className="mr-2 h-5 w-5" />
                      {member.email}
                    </a>
                    <a 
                      href={`tel:${member.phone}`}
                      className="flex items-center text-blue-600 hover:text-blue-700 transition-colors"
                    >
                      <Phone className="mr-2 h-5 w-5" />
                      {member.phone}
                    </a>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Biography */}
          <Card className="mb-8 border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center">
                <Users className="mr-2 h-6 w-6 text-blue-600" />
                Professional Biography
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed text-lg">{member.bio}</p>
            </CardContent>
          </Card>

          {/* Education & Experience Grid */}
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            {/* Education */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <GraduationCap className="mr-2 h-5 w-5 text-blue-600" />
                  Education
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {member.education.map((item: string, index: number) => (
                    <li key={index} className="flex items-start">
                      <Star className="mr-2 h-4 w-4 text-amber-500 mt-1 flex-shrink-0" />
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Experience */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Briefcase className="mr-2 h-5 w-5 text-blue-600" />
                  Experience
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {member.experience.map((item: string, index: number) => (
                    <li key={index} className="flex items-start">
                      <Star className="mr-2 h-4 w-4 text-amber-500 mt-1 flex-shrink-0" />
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Achievements & Specialties Grid */}
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            {/* Achievements */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Award className="mr-2 h-5 w-5 text-blue-600" />
                  Key Achievements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {member.achievements.map((item: string, index: number) => (
                    <li key={index} className="flex items-start">
                      <Target className="mr-2 h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Specialties */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Star className="mr-2 h-5 w-5 text-blue-600" />
                  Areas of Expertise
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {member.specialties.map((item: string, index: number) => (
                    <Badge 
                      key={index} 
                      variant="outline"
                      className="bg-blue-50 text-blue-700 border-blue-200 px-3 py-1"
                    >
                      {item}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* CTA Section */}
          <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-500 to-teal-500 text-white">
            <CardContent className="p-8 text-center">
              <h3 className="text-2xl font-bold mb-4">Connect with Our Team</h3>
              <p className="text-blue-50 mb-6">
                Have questions about our services or want to learn more about our approach to care?
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg"
                  variant="secondary"
                  onClick={() => router.push('/contact')}
                  className="bg-white text-blue-600 hover:bg-blue-50"
                >
                  <Mail className="mr-2 h-5 w-5" />
                  Contact Us
                </Button>
                <Button 
                  size="lg"
                  variant="outline"
                  onClick={() => router.push('/our-story')}
                  className="border-white text-white hover:bg-white/10"
                >
                  <ArrowLeft className="mr-2 h-5 w-5" />
                  Back to Our Story
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
