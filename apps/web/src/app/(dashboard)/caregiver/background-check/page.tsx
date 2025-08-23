'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { toast } from '@/hooks/use-toast'
import { 
  Shield, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  FileText, 
  Download,
  RefreshCw,
  Phone,
  Mail,
  Calendar,
  User,
  Building,
  Eye,
  ExternalLink
} from 'lucide-react'

// Mock data for background check status
const mockBackgroundCheck = {
  id: '1',
  status: 'in_progress', // pending, in_progress, completed, requires_action, failed
  submittedDate: '2025-01-15T10:00:00Z',
  completedDate: null,
  estimatedCompletion: '2025-01-20T17:00:00Z',
  provider: 'SecureCheck Solutions',
  referenceNumber: 'SC-2025-BC-001234',
  progress: 65,
  components: [
    {
      id: '1',
      name: 'Identity Verification',
      status: 'completed',
      completedDate: '2025-01-16T09:30:00Z',
      description: 'Verification of identity documents and personal information'
    },
    {
      id: '2',
      name: 'Criminal History Check',
      status: 'in_progress',
      completedDate: null,
      description: 'National and state criminal background search'
    },
    {
      id: '3',
      name: 'Employment Verification',
      status: 'completed',
      completedDate: '2025-01-17T14:20:00Z',
      description: 'Verification of previous employment history'
    },
    {
      id: '4',
      name: 'Professional References',
      status: 'completed',
      completedDate: '2025-01-17T16:45:00Z',
      description: 'Contact and verification of professional references'
    },
    {
      id: '5',
      name: 'Motor Vehicle Record',
      status: 'pending',
      completedDate: null,
      description: 'Driving record check for transportation roles'
    },
    {
      id: '6',
      name: 'Drug Screening',
      status: 'requires_action',
      completedDate: null,
      description: 'Pre-employment drug test at certified facility'
    }
  ]
}

const mockDrugTest = {
  id: '1',
  status: 'scheduled',
  scheduledDate: '2025-01-19T10:00:00Z',
  location: {
    name: 'LabCorp - Virginia Beach',
    address: '4869 Princess Anne Rd, Virginia Beach, VA 23462',
    phone: '(757) 518-8100'
  },
  instructions: [
    'Bring a valid photo ID',
    'Arrive 15 minutes early',
    'Fast for 8 hours prior to test',
    'Bring confirmation number: DT-789456'
  ],
  confirmationNumber: 'DT-789456'
}

const mockCredentials = [
  {
    id: '1',
    name: 'CNA License',
    status: 'verified',
    expirationDate: '2025-12-31',
    issuingAuthority: 'Virginia Board of Nursing',
    verificationDate: '2025-01-16'
  },
  {
    id: '2',
    name: 'CPR Certification',
    status: 'verified',
    expirationDate: '2025-06-15',
    issuingAuthority: 'American Heart Association',
    verificationDate: '2025-01-16'
  },
  {
    id: '3',
    name: 'First Aid Certification',
    status: 'expired',
    expirationDate: '2024-11-30',
    issuingAuthority: 'Red Cross',
    verificationDate: '2025-01-16'
  }
]

export default function BackgroundCheckPage() {
  const [isRefreshing, setIsRefreshing] = useState(false)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
      case 'verified': return 'success'
      case 'in_progress': return 'default'
      case 'pending': return 'secondary'
      case 'requires_action': return 'destructive'
      case 'failed':
      case 'expired': return 'destructive'
      default: return 'outline'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
      case 'verified': return <CheckCircle className="h-4 w-4" />
      case 'in_progress': return <RefreshCw className="h-4 w-4 animate-spin" />
      case 'pending': return <Clock className="h-4 w-4" />
      case 'requires_action':
      case 'failed':
      case 'expired': return <AlertCircle className="h-4 w-4" />
      default: return <Clock className="h-4 w-4" />
    }
  }

  const handleRefresh = async () => {
    setIsRefreshing(true)
    // Simulate API call
    setTimeout(() => {
      setIsRefreshing(false)
      toast({
        title: "Status Updated",
        description: "Background check status has been refreshed.",
      })
    }, 2000)
  }

  const handleScheduleDrugTest = () => {
    toast({
      title: "Drug Test Scheduled",
      description: "You will receive confirmation details via email and SMS.",
    })
  }

  const completedComponents = mockBackgroundCheck.components.filter(c => c.status === 'completed').length
  const totalComponents = mockBackgroundCheck.components.length

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Background Check Status</h1>
          <p className="text-muted-foreground">
            Track the progress of your background check and clearances
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh Status
          </Button>
        </div>
      </div>

      {/* Overall Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Background Check Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Badge variant={getStatusColor(mockBackgroundCheck.status) as any} className="flex items-center gap-1">
                  {getStatusIcon(mockBackgroundCheck.status)}
                  {mockBackgroundCheck.status.replace('_', ' ').toUpperCase()}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  Reference: {mockBackgroundCheck.referenceNumber}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                Submitted: {new Date(mockBackgroundCheck.submittedDate).toLocaleString()}
              </p>
              {mockBackgroundCheck.estimatedCompletion && (
                <p className="text-sm text-muted-foreground">
                  Estimated completion: {new Date(mockBackgroundCheck.estimatedCompletion).toLocaleString()}
                </p>
              )}
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">{mockBackgroundCheck.progress}%</div>
              <div className="text-sm text-muted-foreground">Complete</div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span>{completedComponents} of {totalComponents} components complete</span>
            </div>
            <Progress value={mockBackgroundCheck.progress} className="h-2" />
          </div>

          <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center gap-3">
              <Building className="h-8 w-8 text-blue-600" />
              <div>
                <p className="font-medium text-blue-900">Background Check Provider</p>
                <p className="text-sm text-blue-700">{mockBackgroundCheck.provider}</p>
              </div>
            </div>
            <Button variant="outline" size="sm">
              <ExternalLink className="h-4 w-4 mr-2" />
              View Portal
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Component Details */}
      <Card>
        <CardHeader>
          <CardTitle>Background Check Components</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {mockBackgroundCheck.components.map((component) => (
            <div key={component.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  component.status === 'completed' ? 'bg-green-100 text-green-600' :
                  component.status === 'in_progress' ? 'bg-blue-100 text-blue-600' :
                  component.status === 'requires_action' ? 'bg-red-100 text-red-600' :
                  'bg-gray-100 text-gray-400'
                }`}>
                  {getStatusIcon(component.status)}
                </div>
                <div>
                  <h4 className="font-medium">{component.name}</h4>
                  <p className="text-sm text-muted-foreground">{component.description}</p>
                  {component.completedDate && (
                    <p className="text-xs text-muted-foreground">
                      Completed: {new Date(component.completedDate).toLocaleString()}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={getStatusColor(component.status) as any}>
                  {component.status.replace('_', ' ')}
                </Badge>
                {component.status === 'requires_action' && component.name === 'Drug Screening' && (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button size="sm">
                        Schedule Now
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Schedule Drug Test</DialogTitle>
                        <DialogDescription>
                          Complete your pre-employment drug screening at an approved facility
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="p-4 border rounded-lg">
                          <h4 className="font-medium mb-2">Scheduled Appointment</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4" />
                              <span>{new Date(mockDrugTest.scheduledDate).toLocaleString()}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Building className="h-4 w-4" />
                              <span>{mockDrugTest.location.name}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Phone className="h-4 w-4" />
                              <span>{mockDrugTest.location.phone}</span>
                            </div>
                            <p className="text-muted-foreground mt-2">
                              {mockDrugTest.location.address}
                            </p>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <h4 className="font-medium">Important Instructions:</h4>
                          <ul className="text-sm space-y-1">
                            {mockDrugTest.instructions.map((instruction, index) => (
                              <li key={index} className="flex items-start gap-2">
                                <span className="text-blue-600">•</span>
                                <span>{instruction}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="flex gap-2">
                          <Button onClick={handleScheduleDrugTest} className="flex-1">
                            Confirm Appointment
                          </Button>
                          <Button variant="outline" className="flex-1">
                            Reschedule
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Credential Verification */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Credential Verification
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {mockCredentials.map((credential) => (
            <div key={credential.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-medium">{credential.name}</h4>
                  <Badge variant={getStatusColor(credential.status) as any}>
                    {credential.status}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {credential.issuingAuthority}
                </p>
                <div className="text-xs text-muted-foreground">
                  <span>Expires: {new Date(credential.expirationDate).toLocaleDateString()}</span>
                  {credential.status !== 'expired' && (
                    <span className="ml-4">
                      Verified: {new Date(credential.verificationDate).toLocaleDateString()}
                    </span>
                  )}
                </div>
                {credential.status === 'expired' && (
                  <p className="text-sm text-red-600">
                    This credential has expired and needs to be renewed
                  </p>
                )}
              </div>
              <div className="flex gap-2">
                {credential.status === 'expired' && (
                  <Button size="sm" variant="outline">
                    Upload Renewal
                  </Button>
                )}
                <Button variant="outline" size="sm">
                  <Eye className="h-4 w-4 mr-2" />
                  View
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Action Items */}
      {mockBackgroundCheck.components.some(c => c.status === 'requires_action') && (
        <Card className="border-red-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-900">
              <AlertCircle className="h-5 w-5" />
              Action Required
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-red-50 rounded-lg">
              <h4 className="font-medium text-red-900 mb-2">Outstanding Items</h4>
              <ul className="space-y-2">
                {mockBackgroundCheck.components
                  .filter(c => c.status === 'requires_action')
                  .map((component) => (
                    <li key={component.id} className="flex items-center gap-2 text-sm text-red-800">
                      <AlertCircle className="h-4 w-4" />
                      <span>{component.name}: {component.description}</span>
                    </li>
                  ))}
              </ul>
              <p className="text-sm text-red-700 mt-3">
                Please complete these items as soon as possible to continue with your onboarding process.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Help & Support */}
      <Card>
        <CardHeader>
          <CardTitle>Need Help?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-4 border rounded-lg">
              <Phone className="h-6 w-6 text-blue-600" />
              <div>
                <p className="font-medium">HR Support</p>
                <p className="text-sm text-muted-foreground">(757) 555-HR01</p>
                <p className="text-xs text-muted-foreground">Mon-Fri, 9 AM - 5 PM</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 border rounded-lg">
              <Mail className="h-6 w-6 text-blue-600" />
              <div>
                <p className="font-medium">Email Support</p>
                <p className="text-sm text-muted-foreground">hr@caringcompass.com</p>
                <p className="text-xs text-muted-foreground">Response within 24 hours</p>
              </div>
            </div>
          </div>
          
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Frequently Asked Questions</h4>
            <div className="space-y-2 text-sm text-blue-800">
              <details className="cursor-pointer">
                <summary className="font-medium">How long does the background check take?</summary>
                <p className="mt-1 ml-4">Most background checks are completed within 3-5 business days, depending on the complexity and response time from previous employers and references.</p>
              </details>
              <details className="cursor-pointer">
                <summary className="font-medium">What if I have a criminal record?</summary>
                <p className="mt-1 ml-4">Having a criminal record doesn&apos;t automatically disqualify you. We evaluate each case individually, considering factors like the nature of the offense, how long ago it occurred, and its relevance to the caregiving role.</p>
              </details>
              <details className="cursor-pointer">
                <summary className="font-medium">Can I start working before my background check is complete?</summary>
                <p className="mt-1 ml-4">For the safety of our clients, you cannot begin providing care services until your background check is fully completed and approved.</p>
              </details>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}