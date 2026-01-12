'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  Scale, 
  FileText, 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  Phone,
  Mail,
  Calendar,
  Gavel,
  Users,
  CreditCard,
  Clock,
  Home,
  AlertCircle
} from 'lucide-react'

export default function TermsOfServicePage() {
  const router = useRouter()
  const lastUpdated = "August 20, 2025"

  const termsSection = [
    {
      id: "acceptance",
      title: "Acceptance of Terms",
      icon: <CheckCircle className="h-6 w-6" />,
      content: "By using our services or website, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services. These terms apply to all users of our services, including clients, family members, and website visitors."
    },
    {
      id: "services",
      title: "Description of Services",
      icon: <Home className="h-6 w-6" />,
      content: "Caring Compass Home Care LLC provides non-medical home care services including personal care assistance, companionship, household support, and related services. We do not provide medical care, nursing services, or administer medications. All services are provided by trained, licensed caregivers under the supervision of our care coordinators."
    },
    {
      id: "eligibility",
      title: "Eligibility Requirements",
      icon: <Users className="h-6 w-6" />,
      content: "Our services are available to adults who require assistance with activities of daily living. Clients must be able to provide informed consent or have a legally authorized representative. We reserve the right to determine if our services are appropriate for your specific needs during the initial assessment."
    },
    {
      id: "care-agreement",
      title: "Care Service Agreement",
      icon: <FileText className="h-6 w-6" />,
      content: "All care services are provided under a written Care Service Agreement that outlines the specific services, schedule, rates, and terms. This agreement must be signed before services begin and may be modified only with written consent from both parties."
    }
  ]

  const responsibilities = [
    {
      title: "Client Responsibilities",
      items: [
        "Provide accurate information about health conditions and care needs",
        "Maintain a safe home environment for caregivers",
        "Treat caregivers with respect and courtesy",
        "Provide necessary supplies and equipment for care",
        "Pay for services as agreed in the Care Service Agreement",
        "Notify us immediately of any changes in condition or needs",
        "Follow the established care plan and schedule"
      ]
    },
    {
      title: "Our Responsibilities",
      items: [
        "Provide qualified, trained caregivers",
        "Conduct background checks on all employees",
        "Maintain appropriate insurance and licensing",
        "Provide supervision and quality assurance",
        "Respond promptly to concerns or emergencies",
        "Maintain confidentiality of client information",
        "Comply with all applicable laws and regulations"
      ]
    }
  ]

  const paymentTerms = [
    {
      title: "Service Rates",
      description: "All rates are clearly outlined in your Care Service Agreement and may vary based on the level of care, time of service, and special requirements."
    },
    {
      title: "Payment Methods",
      description: "We accept cash, check, credit cards, and ACH transfers. Automatic payment options are available for your convenience."
    },
    {
      title: "Billing Cycle",
      description: "Services are typically billed weekly or bi-weekly as specified in your agreement. Invoices are due within 30 days of receipt."
    },
    {
      title: "Late Payments",
      description: "Late payment fees may apply to overdue accounts. Continued non-payment may result in suspension or termination of services."
    }
  ]

  const limitations = [
    "We are not liable for injuries or damages resulting from client's failure to follow care instructions",
    "We are not responsible for pre-existing medical conditions or natural progression of illness",
    "Our liability is limited to the cost of services provided",
    "We are not liable for actions of clients or family members",
    "Weather, natural disasters, or emergencies may affect service availability",
    "We reserve the right to terminate services if the home environment becomes unsafe"
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-600 to-gray-600 text-white">
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
                <Scale className="h-12 w-12" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Terms of Service
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-slate-100">
              Important terms and conditions for using our home care services
            </p>
            <Badge className="bg-white/20 text-white text-lg px-4 py-2">
              <Calendar className="mr-2 h-4 w-4" />
              Last Updated: {lastUpdated}
            </Badge>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16">
        {/* Introduction */}
        <div className="max-w-4xl mx-auto mb-16">
          <Card className="border-0 shadow-lg">
            <CardContent className="p-8">
              <div className="flex items-start mb-6">
                <div className="bg-slate-100 p-3 rounded-full mr-4">
                  <Gavel className="h-6 w-6 text-slate-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    Welcome to Caring Compass Home Care
                  </h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    These Terms of Service (&quot;Terms&quot;) govern your use of our home care services and website. 
                    By engaging our services, you agree to these terms and conditions. Please read them 
                    carefully as they contain important information about your rights and responsibilities.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    These terms are designed to ensure a clear understanding between Caring Compass Home Care LLC 
                    and our clients, promoting a safe, respectful, and professional care environment.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Key Terms Sections */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="space-y-8">
            {termsSection.map((section, index) => (
              <Card key={index} className="border-0 shadow-lg">
                <CardHeader>
                  <div className="flex items-center">
                    <div className="bg-gradient-to-r from-slate-500 to-gray-500 text-white p-3 rounded-full mr-4">
                      {section.icon}
                    </div>
                    <CardTitle className="text-2xl font-bold text-gray-900">
                      {section.title}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 leading-relaxed">
                    {section.content}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Responsibilities */}
        <div className="max-w-4xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Rights and Responsibilities
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {responsibilities.map((section, index) => (
              <Card key={index} className="border-0 shadow-lg h-full">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-gray-900 flex items-center">
                    <div className="bg-slate-100 p-2 rounded-full mr-3">
                      <Users className="h-5 w-5 text-slate-600" />
                    </div>
                    {section.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {section.items.map((item, idx) => (
                      <li key={idx} className="flex items-start">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-1 flex-shrink-0" />
                        <span className="text-gray-700 text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Payment Terms */}
        <div className="max-w-4xl mx-auto mb-16">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <div className="flex items-center">
                <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white p-3 rounded-full mr-4">
                  <CreditCard className="h-6 w-6" />
                </div>
                <CardTitle className="text-2xl font-bold text-gray-900">
                  Payment Terms and Billing
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                {paymentTerms.map((term, index) => (
                  <div key={index} className="border-l-2 border-green-200 pl-4">
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">
                      {term.title}
                    </h4>
                    <p className="text-gray-700 text-sm">
                      {term.description}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Cancellation and Termination */}
        <div className="max-w-4xl mx-auto mb-16">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <div className="flex items-center">
                <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-3 rounded-full mr-4">
                  <Clock className="h-6 w-6" />
                </div>
                <CardTitle className="text-2xl font-bold text-gray-900">
                  Cancellation and Termination
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">
                    Cancellation Policy
                  </h4>
                  <p className="text-gray-700 mb-2">
                    We require 24 hours&apos; notice for cancellations when possible. Same-day cancellations 
                    may result in charges. Emergency cancellations are handled on a case-by-case basis.
                  </p>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">
                    Service Termination
                  </h4>
                  <p className="text-gray-700 mb-2">
                    Either party may terminate services with written notice. We reserve the right to 
                    terminate services immediately if:
                  </p>
                  <ul className="space-y-1 text-gray-700 text-sm ml-4">
                    <li>• The home environment becomes unsafe for caregivers</li>
                    <li>• Client or family members engage in inappropriate behavior</li>
                    <li>• Payment obligations are not met</li>
                    <li>• Our services are no longer appropriate for client needs</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">
                    Final Billing
                  </h4>
                  <p className="text-gray-700">
                    Final invoices will be issued for all services provided through the termination date. 
                    Payment is due within 30 days of the final invoice.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Limitations and Disclaimers */}
        <div className="max-w-4xl mx-auto mb-16">
          <Card className="border-0 shadow-lg border-l-4 border-yellow-500">
            <CardHeader>
              <div className="flex items-center">
                <AlertTriangle className="h-6 w-6 text-yellow-600 mr-3" />
                <CardTitle className="text-2xl font-bold text-gray-900">
                  Limitations of Liability
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4">
                While we strive to provide the highest quality care, certain limitations apply:
              </p>
              <ul className="space-y-2">
                {limitations.map((limitation, index) => (
                  <li key={index} className="flex items-start">
                    <AlertCircle className="h-4 w-4 text-yellow-500 mr-2 mt-1 flex-shrink-0" />
                    <span className="text-gray-700 text-sm">{limitation}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Emergency Procedures */}
        <div className="max-w-4xl mx-auto mb-16">
          <Card className="border-0 shadow-lg bg-red-50">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-gray-900 flex items-center">
                <div className="bg-red-100 p-2 rounded-full mr-3">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
                Emergency Procedures
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-gray-700">
                  In case of emergencies, our caregivers are trained to:
                </p>
                <ol className="space-y-2 text-gray-700">
                  <li className="flex items-start">
                    <span className="bg-red-100 text-red-800 rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold mr-3 mt-0.5">1</span>
                    Call 911 for immediate medical emergencies
                  </li>
                  <li className="flex items-start">
                    <span className="bg-red-100 text-red-800 rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold mr-3 mt-0.5">2</span>
                    Contact designated emergency contacts
                  </li>
                  <li className="flex items-start">
                    <span className="bg-red-100 text-red-800 rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold mr-3 mt-0.5">3</span>
                    Notify our office immediately
                  </li>
                  <li className="flex items-start">
                    <span className="bg-red-100 text-red-800 rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold mr-3 mt-0.5">4</span>
                    Provide necessary assistance until help arrives
                  </li>
                </ol>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Privacy and Confidentiality */}
        <div className="max-w-4xl mx-auto mb-16">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <div className="flex items-center">
                <div className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white p-3 rounded-full mr-4">
                  <Shield className="h-6 w-6" />
                </div>
                <CardTitle className="text-2xl font-bold text-gray-900">
                  Privacy and Confidentiality
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4">
                We are committed to protecting your privacy and maintaining the confidentiality of your 
                personal and health information. Our privacy practices are detailed in our 
                <a href="/privacy" className="text-blue-600 hover:underline mx-1">Privacy Policy</a>
                and comply with all applicable laws including HIPAA.
              </p>
              <p className="text-gray-700">
                All caregivers and staff sign confidentiality agreements and receive training on 
                privacy protection. We share information only as necessary for your care or as 
                required by law.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Governing Law */}
        <div className="max-w-4xl mx-auto mb-16">
          <Card className="border-0 shadow-lg bg-slate-50">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                <Scale className="h-5 w-5 text-slate-600 mr-2" />
                Governing Law and Dispute Resolution
              </h3>
              <p className="text-gray-700 mb-4">
                These Terms of Service are governed by the laws of the Commonwealth of Virginia. 
                Any disputes arising from these terms or our services will be resolved in the 
                appropriate courts of Virginia Beach, Virginia.
              </p>
              <p className="text-gray-700">
                We encourage resolving disputes through direct communication. If formal resolution 
                is necessary, both parties agree to attempt mediation before pursuing litigation.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Contact Information */}
        <div className="max-w-4xl mx-auto">
          <Card className="border-0 shadow-lg bg-gradient-to-r from-slate-50 to-gray-50">
            <CardContent className="p-8 text-center">
              <div className="flex justify-center mb-6">
                <div className="bg-gradient-to-r from-slate-500 to-gray-500 text-white p-4 rounded-full">
                  <Phone className="h-8 w-8" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Questions About These Terms?
              </h2>
              <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
                If you have questions about these Terms of Service or need clarification about 
                any aspect of our services, please don&apos;t hesitate to contact us.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-slate-500 to-gray-500 text-white flex-1"
                  onClick={() => window.location.href = 'tel:+17575552273'}
                >
                  <Phone className="mr-2 h-5 w-5" />
                  Call (757) 555-CARE
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-slate-500 text-slate-600 hover:bg-slate-50 flex-1"
                  onClick={() => window.location.href = 'mailto:info@caringcompasshomecare.com'}
                >
                  <Mail className="mr-2 h-5 w-5" />
                  Email Us
                </Button>
              </div>
              
              <p className="text-gray-600 mt-4 text-sm">
                Available 24/7 • Licensed & insured • HIPAA compliant
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}