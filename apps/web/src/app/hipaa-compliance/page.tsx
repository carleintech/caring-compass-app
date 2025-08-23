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
  UserCheck,
  Key,
  FileCheck,
  Building,
  Award
} from 'lucide-react'

export default function HIPAACompliancePage() {
  const lastUpdated = "August 20, 2025"

  const patientRights = [
    {
      title: "Right to Access Your Health Information",
      description: "You have the right to inspect and obtain copies of your health information that we maintain about you.",
      icon: <Eye className="h-5 w-5 text-blue-500" />
    },
    {
      title: "Right to Request Amendment",
      description: "You have the right to request that we amend health information about you that you believe is incorrect or incomplete.",
      icon: <FileText className="h-5 w-5 text-green-500" />
    },
    {
      title: "Right to Request Restrictions",
      description: "You have the right to request restrictions on how we use and disclose your health information for treatment, payment, or healthcare operations.",
      icon: <Lock className="h-5 w-5 text-purple-500" />
    },
    {
      title: "Right to Request Confidential Communications",
      description: "You have the right to request that we communicate with you about your health information in a certain way or at a certain location.",
      icon: <Shield className="h-5 w-5 text-red-500" />
    },
    {
      title: "Right to an Accounting of Disclosures",
      description: "You have the right to request a list of disclosures we have made of your health information.",
      icon: <FileCheck className="h-5 w-5 text-orange-500" />
    },
    {
      title: "Right to File a Complaint",
      description: "You have the right to file a complaint if you believe your privacy rights have been violated.",
      icon: <AlertCircle className="h-5 w-5 text-yellow-500" />
    }
  ]

  const ourDuties = [
    {
      title: "Maintain Privacy",
      description: "We are required by law to maintain the privacy of your health information and provide you with notice of our legal duties and privacy practices.",
      icon: <Lock className="h-6 w-6 text-blue-600" />
    },
    {
      title: "Follow Current Notice",
      description: "We are required to follow the terms of the privacy notice currently in effect.",
      icon: <FileText className="h-6 w-6 text-green-600" />
    },
    {
      title: "Notify of Breaches",
      description: "We are required to notify you if your unsecured health information has been breached.",
      icon: <AlertCircle className="h-6 w-6 text-red-600" />
    },
    {
      title: "Secure Information",
      description: "We implement appropriate safeguards to protect your health information.",
      icon: <Shield className="h-6 w-6 text-purple-600" />
    }
  ]

  const permittedUses = [
    {
      category: "Treatment",
      description: "We may use and disclose your health information for your treatment and care coordination.",
      examples: [
        "Communicating with your healthcare providers about your care",
        "Coordinating services between different caregivers",
        "Emergency medical information sharing"
      ]
    },
    {
      category: "Payment",
      description: "We may use and disclose your health information for payment and billing purposes.",
      examples: [
        "Billing for services provided",
        "Processing insurance claims",
        "Collecting payment for services"
      ]
    },
    {
      category: "Healthcare Operations",
      description: "We may use and disclose your health information for our healthcare operations.",
      examples: [
        "Quality assessment and improvement",
        "Training and education of staff",
        "Business planning and development"
      ]
    }
  ]

  const securityMeasures = [
    {
      title: "Physical Safeguards",
      measures: [
        "Secure facilities with restricted access",
        "Locked storage for physical records",
        "Clean desk policies for workstations",
        "Secure disposal of confidential documents"
      ]
    },
    {
      title: "Administrative Safeguards",
      measures: [
        "Designated HIPAA Privacy Officer",
        "Employee training and certification",
        "Access controls and user authentication",
        "Regular security risk assessments"
      ]
    },
    {
      title: "Technical Safeguards",
      measures: [
        "Encryption of electronic health information",
        "Secure transmission of data",
        "Audit logs and access monitoring",
        "Regular software updates and patches"
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center max-w-4xl mx-auto">
            <div className="flex justify-center mb-6">
              <div className="bg-white/20 p-4 rounded-full">
                <Shield className="h-12 w-12" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              HIPAA Compliance
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              Protecting your health information privacy and security
            </p>
            <div className="flex justify-center space-x-4">
              <Badge className="bg-white/20 text-white text-lg px-4 py-2">
                <Calendar className="mr-2 h-4 w-4" />
                Effective: {lastUpdated}
              </Badge>
              <Badge className="bg-green-500/80 text-white text-lg px-4 py-2">
                <Award className="mr-2 h-4 w-4" />
                HIPAA Compliant
              </Badge>
            </div>
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
                  <Building className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    Notice of Privacy Practices
                  </h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    This notice describes how medical information about you may be used and disclosed 
                    and how you can get access to this information. Please review it carefully.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    Caring Compass Home Care LLC is committed to protecting your health information. 
                    We are required by the Health Insurance Portability and Accountability Act (HIPAA) 
                    to maintain the privacy of your health information and to provide you with notice 
                    of our legal duties and privacy practices.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Key Definitions */}
        <div className="max-w-4xl mx-auto mb-16">
          <Card className="border-0 shadow-lg bg-indigo-50">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-gray-900">
                Important Definitions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">
                    Protected Health Information (PHI)
                  </h4>
                  <p className="text-gray-700 text-sm">
                    Information about you, including demographic information, that may identify you 
                    and relates to your past, present, or future physical or mental health condition 
                    and care you receive.
                  </p>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">
                    Uses and Disclosures
                  </h4>
                  <p className="text-gray-700 text-sm">
                    The sharing, employing, applying, utilizing, examining, or analyzing of health 
                    information within our organization or releasing it to others outside our organization.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Your Rights */}
        <div className="max-w-4xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Your Rights Under HIPAA
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {patientRights.map((right, index) => (
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

        {/* Our Duties */}
        <div className="max-w-4xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Our Duties and Responsibilities
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {ourDuties.map((duty, index) => (
              <Card key={index} className="border-0 shadow-md">
                <CardContent className="p-6">
                  <div className="flex items-start">
                    <div className="bg-blue-50 p-3 rounded-full mr-4 mt-1">
                      {duty.icon}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {duty.title}
                      </h3>
                      <p className="text-gray-700 text-sm">
                        {duty.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Permitted Uses and Disclosures */}
        <div className="max-w-4xl mx-auto mb-16">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <div className="flex items-center">
                <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white p-3 rounded-full mr-4">
                  <UserCheck className="h-6 w-6" />
                </div>
                <CardTitle className="text-2xl font-bold text-gray-900">
                  How We May Use and Disclose Your Health Information
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-6">
                We may use and disclose your health information for the following purposes without your written authorization:
              </p>
              <div className="space-y-6">
                {permittedUses.map((use, index) => (
                  <div key={index} className="border-l-4 border-green-300 pl-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">
                      {use.category}
                    </h4>
                    <p className="text-gray-700 mb-3">
                      {use.description}
                    </p>
                    <div className="text-sm text-gray-600">
                      <strong>Examples:</strong>
                      <ul className="mt-1 space-y-1">
                        {use.examples.map((example, idx) => (
                          <li key={idx} className="flex items-start">
                            <span className="mr-2">•</span>
                            <span>{example}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Other Uses */}
        <div className="max-w-4xl mx-auto mb-16">
          <Card className="border-0 shadow-lg border-l-4 border-yellow-500">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <AlertCircle className="h-5 w-5 text-yellow-600 mr-2" />
                Other Uses and Disclosures
              </h3>
              <p className="text-gray-700 mb-4">
                We may also use and disclose your health information without your authorization for:
              </p>
              <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-700">
                <ul className="space-y-1">
                  <li>• Required by law</li>
                  <li>• Public health activities</li>
                  <li>• Health oversight activities</li>
                  <li>• Judicial and administrative proceedings</li>
                </ul>
                <ul className="space-y-1">
                  <li>• Law enforcement purposes</li>
                  <li>• Emergency circumstances</li>
                  <li>• Worker&apos;s compensation</li>
                  <li>• Coroners, medical examiners, and funeral directors</li>
                </ul>
              </div>
              <p className="text-gray-700 mt-4 text-sm">
                <strong>Important:</strong> Any other uses and disclosures will be made only with your written authorization. 
                You may revoke such authorization at any time by writing to our Privacy Officer.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Security Measures */}
        <div className="max-w-4xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            How We Protect Your Information
          </h2>
          <div className="grid lg:grid-cols-3 gap-8">
            {securityMeasures.map((category, index) => (
              <Card key={index} className="border-0 shadow-lg h-full">
                <CardHeader className="text-center">
                  <div className="flex justify-center mb-4">
                    <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-3 rounded-full">
                      <Lock className="h-6 w-6" />
                    </div>
                  </div>
                  <CardTitle className="text-lg font-bold text-gray-900">
                    {category.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {category.measures.map((measure, idx) => (
                      <li key={idx} className="flex items-start">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700 text-sm">{measure}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* How to Exercise Your Rights */}
        <div className="max-w-4xl mx-auto mb-16">
          <Card className="border-0 shadow-lg bg-blue-50">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-gray-900">
                How to Exercise Your Rights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-gray-700">
                  To exercise any of your rights under HIPAA, please contact our Privacy Officer in writing:
                </p>
                <div className="bg-white rounded-lg p-4 border-l-4 border-blue-500">
                  <div className="grid md:grid-cols-3 gap-4 text-center">
                    <div>
                      <Mail className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                      <div className="font-semibold text-gray-900">Email</div>
                      <div className="text-gray-700 text-sm">privacy@caringcompass.com</div>
                    </div>
                    <div>
                      <Phone className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                      <div className="font-semibold text-gray-900">Phone</div>
                      <div className="text-gray-700 text-sm">(757) 555-CARE</div>
                    </div>
                    <div>
                      <FileText className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                      <div className="font-semibold text-gray-900">Mail</div>
                      <div className="text-gray-700 text-sm">HIPAA Privacy Officer<br />Caring Compass Home Care LLC</div>
                    </div>
                  </div>
                </div>
                <p className="text-gray-700 text-sm">
                  We will respond to your request within 30 days (60 days for access requests). 
                  Some requests may require additional time or may incur reasonable fees.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Complaints */}
        <div className="max-w-4xl mx-auto mb-16">
          <Card className="border-0 shadow-lg border-l-4 border-red-500">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
                Filing a Complaint
              </h3>
              <p className="text-gray-700 mb-4">
                If you believe your privacy rights have been violated, you may file a complaint with us or with the U.S. Department of Health and Human Services:
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">With Our Organization:</h4>
                  <p className="text-gray-700 text-sm">
                    Contact our Privacy Officer using the information above.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">With HHS:</h4>
                  <p className="text-gray-700 text-sm">
                    Visit www.hhs.gov/ocr/privacy or call 1-877-696-6775
                  </p>
                </div>
              </div>
              <p className="text-red-600 text-sm mt-4 font-medium">
                You will not be retaliated against for filing a complaint.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Contact Information */}
        <div className="max-w-4xl mx-auto">
          <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-50 to-indigo-50">
            <CardContent className="p-8 text-center">
              <div className="flex justify-center mb-6">
                <div className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white p-4 rounded-full">
                  <Shield className="h-8 w-8" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Questions About HIPAA?
              </h2>
              <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
                Our Privacy Officer is available to answer any questions about your rights under HIPAA 
                or our privacy practices. We&apos;re committed to protecting your health information.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
                <Button size="lg" className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white flex-1">
                  <Phone className="mr-2 h-5 w-5" />
                  Call Privacy Officer
                </Button>
                <Button size="lg" variant="outline" className="border-blue-500 text-blue-600 hover:bg-blue-50 flex-1">
                  <Mail className="mr-2 h-5 w-5" />
                  Email Privacy Officer
                </Button>
              </div>
              
              <p className="text-gray-600 mt-4 text-sm">
                Response within 30 days • No retaliation for complaints • Full HIPAA compliance
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}