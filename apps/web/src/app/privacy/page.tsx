'use client'

import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  Shield, 
  Lock, 
  Eye, 
  FileText, 
  Users, 
  Phone,
  Mail,
  Calendar,
  AlertCircle,
  CheckCircle,
  Database,
  Globe,
  UserCheck
} from 'lucide-react'

export default function PrivacyPolicyPage() {
  const lastUpdated = "August 20, 2025"

  const privacySections = [
    {
      id: "information-we-collect",
      title: "Information We Collect",
      icon: <Database className="h-6 w-6" />,
      content: [
        {
          subtitle: "Personal Information",
          details: "We collect personal information including your name, address, phone number, email address, emergency contacts, and family member information necessary for providing care services."
        },
        {
          subtitle: "Health Information", 
          details: "We collect health-related information including medical conditions, medications, mobility needs, dietary restrictions, and other information necessary to provide safe, effective care."
        },
        {
          subtitle: "Financial Information",
          details: "We collect payment information including billing addresses, insurance information, and payment methods necessary for processing payments for our services."
        },
        {
          subtitle: "Service Information",
          details: "We collect information about the services provided, care plans, visit notes, and other documentation related to your care."
        }
      ]
    },
    {
      id: "how-we-use-information",
      title: "How We Use Your Information",
      icon: <UserCheck className="h-6 w-6" />,
      content: [
        {
          subtitle: "Providing Care Services",
          details: "We use your information to provide, coordinate, and improve our home care services, including creating care plans, scheduling visits, and communicating with caregivers."
        },
        {
          subtitle: "Communication",
          details: "We use your contact information to communicate with you about services, appointments, billing, and other important matters related to your care."
        },
        {
          subtitle: "Safety and Quality",
          details: "We use information to ensure the safety and quality of our services, including emergency response, quality assurance, and compliance with regulations."
        },
        {
          subtitle: "Legal Compliance",
          details: "We use information as necessary to comply with applicable laws, regulations, and legal proceedings."
        }
      ]
    },
    {
      id: "information-sharing",
      title: "How We Share Your Information",
      icon: <Users className="h-6 w-6" />,
      content: [
        {
          subtitle: "Healthcare Providers",
          details: "We may share relevant health information with your healthcare providers, physicians, and other medical professionals involved in your care with your consent."
        },
        {
          subtitle: "Emergency Situations",
          details: "In emergency situations, we may share necessary information with emergency responders, hospitals, or other healthcare facilities to ensure your safety."
        },
        {
          subtitle: "Legal Requirements",
          details: "We may disclose information when required by law, court order, or other legal process, or to protect the rights, property, or safety of individuals."
        },
        {
          subtitle: "Service Providers",
          details: "We may share information with trusted third-party service providers who assist us in providing services, such as billing companies or technology providers, under strict confidentiality agreements."
        }
      ]
    },
    {
      id: "data-security",
      title: "Data Security",
      icon: <Lock className="h-6 w-6" />,
      content: [
        {
          subtitle: "Physical Security",
          details: "We maintain secure facilities with restricted access, locked filing cabinets for physical documents, and secure disposal of confidential information."
        },
        {
          subtitle: "Digital Security",
          details: "We use encryption, secure servers, password protection, and other technical safeguards to protect electronic information from unauthorized access."
        },
        {
          subtitle: "Employee Training",
          details: "All employees receive training on privacy and security practices and sign confidentiality agreements. Access to information is limited to those who need it for their job responsibilities."
        },
        {
          subtitle: "Regular Audits",
          details: "We conduct regular security audits and reviews to ensure our security measures remain effective and up-to-date."
        }
      ]
    }
  ]

  const rights = [
    {
      title: "Access Your Information",
      description: "You have the right to request access to the personal information we maintain about you.",
      icon: <Eye className="h-5 w-5 text-blue-500" />
    },
    {
      title: "Correct Information",
      description: "You have the right to request correction of any inaccurate or incomplete information.",
      icon: <FileText className="h-5 w-5 text-green-500" />
    },
    {
      title: "Restrict Use",
      description: "You have the right to request restrictions on how we use or disclose your information.",
      icon: <Shield className="h-5 w-5 text-purple-500" />
    },
    {
      title: "Request Deletion",
      description: "You have the right to request deletion of your personal information, subject to legal requirements.",
      icon: <AlertCircle className="h-5 w-5 text-red-500" />
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center max-w-4xl mx-auto">
            <div className="flex justify-center mb-6">
              <div className="bg-white/20 p-4 rounded-full">
                <Shield className="h-12 w-12" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Privacy Policy
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              Your privacy and the security of your information are our highest priorities
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
                <div className="bg-blue-100 p-3 rounded-full mr-4">
                  <AlertCircle className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    Our Commitment to Your Privacy
                  </h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    At Caring Compass Home Care LLC (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;), we understand that your personal 
                    and health information is sensitive and private. This Privacy Policy explains how we collect, 
                    use, disclose, and protect your information when you use our home care services.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    We are committed to maintaining the highest standards of privacy and security, complying 
                    with all applicable laws including HIPAA (Health Insurance Portability and Accountability Act) 
                    and Virginia state privacy regulations.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* HIPAA Notice */}
        <div className="max-w-4xl mx-auto mb-16">
          <Card className="border-l-4 border-green-500 bg-green-50">
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                <CheckCircle className="h-6 w-6 text-green-600 mr-3" />
                <h3 className="text-lg font-semibold text-gray-900">HIPAA Compliance</h3>
              </div>
              <p className="text-gray-700">
                As a healthcare service provider, we comply with HIPAA regulations to protect your health 
                information. You have specific rights under HIPAA regarding your health information, 
                and we have legal duties to protect your privacy. For detailed information about your 
                HIPAA rights, please see our <a href="/hipaa-compliance" className="text-blue-600 hover:underline">HIPAA Compliance page</a>.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Privacy Sections */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="space-y-8">
            {privacySections.map((section, index) => (
              <Card key={index} className="border-0 shadow-lg">
                <CardHeader>
                  <div className="flex items-center">
                    <div className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white p-3 rounded-full mr-4">
                      {section.icon}
                    </div>
                    <CardTitle className="text-2xl font-bold text-gray-900">
                      {section.title}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6">
                    {section.content.map((item, idx) => (
                      <div key={idx} className="border-l-2 border-blue-200 pl-6">
                        <h4 className="text-lg font-semibold text-gray-900 mb-2">
                          {item.subtitle}
                        </h4>
                        <p className="text-gray-700 leading-relaxed">
                          {item.details}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Your Rights */}
        <div className="max-w-4xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Your Privacy Rights
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {rights.map((right, index) => (
              <Card key={index} className="border-0 shadow-md hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-start">
                    <div className="bg-gray-100 p-3 rounded-full mr-4 mt-1">
                      {right.icon}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {right.title}
                      </h3>
                      <p className="text-gray-700 text-sm">
                        {right.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Cookies and Website */}
        <div className="max-w-4xl mx-auto mb-16">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <div className="flex items-center">
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-3 rounded-full mr-4">
                  <Globe className="h-6 w-6" />
                </div>
                <CardTitle className="text-2xl font-bold text-gray-900">
                  Website and Cookies
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">
                    Website Information
                  </h4>
                  <p className="text-gray-700">
                    When you visit our website, we may collect information such as your IP address, 
                    browser type, pages visited, and time spent on our site. This information helps 
                    us improve our website and services.
                  </p>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">
                    Cookies
                  </h4>
                  <p className="text-gray-700">
                    We use cookies and similar technologies to enhance your browsing experience, 
                    remember your preferences, and analyze website traffic. You can control cookie 
                    settings through your browser preferences.
                  </p>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">
                    Third-Party Services
                  </h4>
                  <p className="text-gray-700">
                    Our website may contain links to third-party websites or use third-party services. 
                    We are not responsible for the privacy practices of these third parties.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Data Retention */}
        <div className="max-w-4xl mx-auto mb-16">
          <Card className="border-0 shadow-lg bg-gray-50">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-gray-900">
                Data Retention
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-gray-700">
                  We retain your personal and health information for as long as necessary to provide 
                  services and comply with legal requirements. Generally, we retain:
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">
                      <strong>Active care records:</strong> For the duration of services plus 7 years
                    </span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">
                      <strong>Financial records:</strong> 7 years from the date of last transaction
                    </span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">
                      <strong>Employment records:</strong> As required by state and federal law
                    </span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Changes to Policy */}
        <div className="max-w-4xl mx-auto mb-16">
          <Card className="border-0 shadow-lg border-l-4 border-yellow-500">
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                <AlertCircle className="h-6 w-6 text-yellow-600 mr-3" />
                <h3 className="text-lg font-semibold text-gray-900">Changes to This Policy</h3>
              </div>
              <p className="text-gray-700 mb-4">
                We may update this Privacy Policy from time to time to reflect changes in our practices 
                or applicable laws. We will notify you of any material changes by:
              </p>
              <ul className="space-y-2 text-gray-700">
                <li>• Posting the updated policy on our website</li>
                <li>• Sending written notice to your last known address</li>
                <li>• Providing notice during your next service visit</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Contact Information */}
        <div className="max-w-4xl mx-auto">
          <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-50 to-indigo-50">
            <CardContent className="p-8 text-center">
              <div className="flex justify-center mb-6">
                <div className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white p-4 rounded-full">
                  <Phone className="h-8 w-8" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Questions About Your Privacy?
              </h2>
              <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
                If you have questions about this Privacy Policy, want to exercise your privacy rights, 
                or have concerns about how we handle your information, please contact us.
              </p>
              
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="text-center">
                  <Phone className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                  <div className="font-semibold text-gray-900">Phone</div>
                  <div className="text-gray-700">(757) 555-CARE</div>
                </div>
                <div className="text-center">
                  <Mail className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                  <div className="font-semibold text-gray-900">Email</div>
                  <div className="text-gray-700">privacy@caringcompass.com</div>
                </div>
                <div className="text-center">
                  <FileText className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                  <div className="font-semibold text-gray-900">Mail</div>
                  <div className="text-gray-700">Privacy Officer<br />Caring Compass Home Care LLC</div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
                <Button size="lg" className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white flex-1" onClick={() => window.location.href = 'tel:+17575552273'}>
                  <Phone className="mr-2 h-5 w-5" />
                  Call Us
                </Button>
                <Button size="lg" variant="outline" className="border-blue-500 text-blue-600 hover:bg-blue-50 flex-1" onClick={() => window.location.href = 'mailto:info@caringcompasshomescare.com'}>
                  <Mail className="mr-2 h-5 w-5" />
                  Email Us
                </Button>
              </div>
              
              <p className="text-gray-600 mt-4 text-sm">
                We will respond to your privacy inquiries within 30 days
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}