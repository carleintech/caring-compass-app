'use client'

import React, { useState } from 'react'
import { X, ChevronLeft, ChevronRight, FileText, Users, Shield, CheckCircle, Briefcase, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { useToast } from '@/components/ui/use-toast'

interface ApplicationModalProps {
  isOpen: boolean
  onClose: () => void
  selectedPosition?: string
}

const ApplicationModal: React.FC<ApplicationModalProps> = ({
  isOpen,
  onClose,
  selectedPosition = ''
}) => {
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const [applicationData, setApplicationData] = useState({
    // Personal Information
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    
    // Address Information
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: ''
    },
    
    // Application Details
    position: selectedPosition,
    experience: '',
    availability: '',
    certifications: [] as string[],
    skills: [] as string[],
    
    // Additional Information
    message: '',
    whyCaregiver: '',
    transportation: '',
    
    // References
    references: [
      { name: '', relationship: '', phone: '', email: '', yearsKnown: '' },
      { name: '', relationship: '', phone: '', email: '', yearsKnown: '' },
      { name: '', relationship: '', phone: '', email: '', yearsKnown: '' }
    ],

    // Emergency Contact
    emergencyContact: {
      name: '',
      relationship: '',
      phone: ''
    },

    // Consent
    backgroundCheckConsent: false,
    drugTestConsent: false
  })

  const skillsOptions = [
    'Personal Care Assistance',
    'Medication Reminders',
    'Meal Preparation',
    'Light Housekeeping',
    'Transportation',
    'Companionship',
    'Dementia/Alzheimer\'s Care',
    'Mobility Assistance',
    'Medical Equipment Operation',
    'Emergency Response',
    'Physical Therapy Support',
    'Wound Care',
    'Vital Signs Monitoring',
    'End-of-Life Care'
  ]

  const certificationOptions = [
    'Certified Nursing Assistant (CNA)',
    'Personal Care Aide (PCA)',
    'Home Health Aide (HHA)',
    'CPR Certification',
    'First Aid Certification',
    'Dementia Care Specialist',
    'Medication Administration',
    'Physical Therapy Assistant'
  ]

  const applicationSteps = [
    { number: 1, title: 'Personal Info', icon: FileText },
    { number: 2, title: 'Experience', icon: Briefcase },
    { number: 3, title: 'References', icon: Users },
    { number: 4, title: 'Consent', icon: Shield },
    { number: 5, title: 'Review', icon: CheckCircle }
  ]

  const updateApplicationData = (field: string, value: any) => {
    setApplicationData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const updateNestedData = (path: string[], value: any) => {
    setApplicationData(prev => {
      const newData = { ...prev }
      let current = newData
      for (let i = 0; i < path.length - 1; i++) {
        current = current[path[i]]
      }
      current[path[path.length - 1]] = value
      return newData
    })
  }

  const toggleSkill = (skill: string) => {
    setApplicationData(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill]
    }))
  }

  const toggleCertification = (cert: string) => {
    setApplicationData(prev => ({
      ...prev,
      certifications: prev.certifications.includes(cert)
        ? prev.certifications.filter(c => c !== cert)
        : [...prev.certifications, cert]
    }))
  }

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(applicationData.firstName && applicationData.lastName && 
                 applicationData.email && applicationData.phone &&
                 applicationData.address.street && applicationData.address.city &&
                 applicationData.address.state && applicationData.address.zipCode)
      case 2:
        return !!(applicationData.position && applicationData.experience && 
                 applicationData.availability && applicationData.skills.length > 0)
      case 3:
        return applicationData.references.filter(ref => ref.name && ref.phone).length >= 2 &&
               applicationData.emergencyContact.name && applicationData.emergencyContact.phone
      case 4:
        return applicationData.backgroundCheckConsent && applicationData.drugTestConsent
      default:
        return true
    }
  }

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 5))
    } else {
      toast({
        title: "Incomplete Information",
        description: "Please fill in all required fields before proceeding.",
        variant: "destructive"
      })
    }
  }

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1))
  }

  const handleSubmit = async () => {
    if (!validateStep(4)) {
      toast({
        title: "Incomplete Application",
        description: "Please complete all required fields.",
        variant: "destructive"
      })
      return
    }

    setIsSubmitting(true)
    
    try {
      const response = await fetch('/api/career-application', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(applicationData),
      })

      const result = await response.json()

      if (result.success) {
        toast({
          title: "Application Submitted Successfully! 🎉",
          description: "We'll review your application and contact you within 24-48 hours."
        })
        
        // Reset form and close modal
        onClose()
        setCurrentStep(1)
        setApplicationData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          address: { street: '', city: '', state: '', zipCode: '' },
          position: '',
          experience: '',
          availability: '',
          certifications: [],
          skills: [],
          message: '',
          whyCaregiver: '',
          transportation: '',
          references: [
            { name: '', relationship: '', phone: '', email: '', yearsKnown: '' },
            { name: '', relationship: '', phone: '', email: '', yearsKnown: '' },
            { name: '', relationship: '', phone: '', email: '', yearsKnown: '' }
          ],
          emergencyContact: { name: '', relationship: '', phone: '' },
          backgroundCheckConsent: false,
          drugTestConsent: false
        })
      } else {
        toast({
          title: "Submission Error",
          description: result.message || "Please try again or contact us directly.",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error('Application submission error:', error)
      toast({
        title: "Network Error",
        description: "Please check your connection and try again.",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  const progressPercentage = ((currentStep - 1) / (applicationSteps.length - 1)) * 100

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-violet-600 to-purple-600 px-6 py-4 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Sparkles className="w-6 h-6" />
              <div>
                <h2 className="text-xl font-bold">Join Our Caring Team</h2>
                <p className="text-violet-100 text-sm">Complete your application in just a few steps</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-white hover:bg-white/20"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
          
          {/* Progress Steps */}
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              {applicationSteps.map((step, index) => (
                <div key={step.number} className="flex items-center">
                  <div className={`
                    flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold
                    ${currentStep >= step.number 
                      ? 'bg-white text-violet-600' 
                      : 'bg-violet-500 text-white border-2 border-violet-300'
                    }
                  `}>
                    {currentStep > step.number ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      <step.icon className="w-4 h-4" />
                    )}
                  </div>
                  {index < applicationSteps.length - 1 && (
                    <div className={`
                      w-12 h-1 mx-2 rounded
                      ${currentStep > step.number ? 'bg-white' : 'bg-violet-500'}
                    `} />
                  )}
                </div>
              ))}
            </div>
            <div className="text-violet-100 text-sm">
              Step {currentStep} of {applicationSteps.length}: {applicationSteps[currentStep - 1]?.title}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {/* Step 1: Personal Information */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      value={applicationData.firstName}
                      onChange={(e) => updateApplicationData('firstName', e.target.value)}
                      placeholder="Enter your first name"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      value={applicationData.lastName}
                      onChange={(e) => updateApplicationData('lastName', e.target.value)}
                      placeholder="Enter your last name"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={applicationData.email}
                      onChange={(e) => updateApplicationData('email', e.target.value)}
                      placeholder="your@email.com"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={applicationData.phone}
                      onChange={(e) => updateApplicationData('phone', e.target.value)}
                      placeholder="(555) 123-4567"
                      required
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-semibold text-gray-900 mb-4">Home Address *</h4>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="street">Street Address</Label>
                    <Input
                      id="street"
                      value={applicationData.address.street}
                      onChange={(e) => updateNestedData(['address', 'street'], e.target.value)}
                      placeholder="123 Main Street"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        value={applicationData.address.city}
                        onChange={(e) => updateNestedData(['address', 'city'], e.target.value)}
                        placeholder="Norfolk"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state">State</Label>
                      <Input
                        id="state"
                        value={applicationData.address.state}
                        onChange={(e) => updateNestedData(['address', 'state'], e.target.value)}
                        placeholder="VA"
                        maxLength={2}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="zipCode">ZIP Code</Label>
                      <Input
                        id="zipCode"
                        value={applicationData.address.zipCode}
                        onChange={(e) => updateNestedData(['address', 'zipCode'], e.target.value)}
                        placeholder="23456"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Experience & Skills */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Experience & Position</h3>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="position">Position of Interest *</Label>
                    <select 
                      id="position"
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
                      value={applicationData.position}
                      onChange={(e) => updateApplicationData('position', e.target.value)}
                      required
                    >
                      <option value="">Select a position</option>
                      <option value="Certified Nursing Assistant (CNA)">Certified Nursing Assistant (CNA)</option>
                      <option value="Personal Care Aide (PCA)">Personal Care Aide (PCA)</option>
                      <option value="Home Health Aide (HHA)">Home Health Aide (HHA)</option>
                      <option value="Companion Caregiver">Companion Caregiver</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="experience">Caregiving Experience *</Label>
                    <Textarea
                      id="experience"
                      value={applicationData.experience}
                      onChange={(e) => updateApplicationData('experience', e.target.value)}
                      placeholder="Describe your experience in caregiving, including years of experience, types of clients you've worked with, and relevant accomplishments..."
                      rows={4}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="availability">Availability *</Label>
                    <select 
                      id="availability"
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
                      value={applicationData.availability}
                      onChange={(e) => updateApplicationData('availability', e.target.value)}
                      required
                    >
                      <option value="">Select availability</option>
                      <option value="Full-time (40+ hours/week)">Full-time (40+ hours/week)</option>
                      <option value="Part-time (20-39 hours/week)">Part-time (20-39 hours/week)</option>
                      <option value="PRN/As needed">PRN/As needed</option>
                      <option value="Weekends only">Weekends only</option>
                      <option value="Flexible schedule">Flexible schedule</option>
                    </select>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-semibold text-gray-900 mb-4">Skills & Certifications</h4>
                
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium mb-3 block">
                      Professional Skills * (Select all that apply)
                    </Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-40 overflow-y-auto border rounded-lg p-3">
                      {skillsOptions.map((skill) => (
                        <div key={skill} className="flex items-center space-x-2">
                          <Checkbox
                            id={skill}
                            checked={applicationData.skills.includes(skill)}
                            onCheckedChange={() => toggleSkill(skill)}
                          />
                          <Label htmlFor={skill} className="text-sm cursor-pointer">
                            {skill}
                          </Label>
                        </div>
                      ))}
                    </div>
                    {applicationData.skills.length > 0 && (
                      <div className="mt-2">
                        <p className="text-sm text-gray-600 mb-2">Selected skills:</p>
                        <div className="flex flex-wrap gap-1">
                          {applicationData.skills.map((skill) => (
                            <Badge key={skill} variant="secondary" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div>
                    <Label className="text-sm font-medium mb-3 block">
                      Current Certifications (Select all that apply)
                    </Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-32 overflow-y-auto border rounded-lg p-3">
                      {certificationOptions.map((cert) => (
                        <div key={cert} className="flex items-center space-x-2">
                          <Checkbox
                            id={cert}
                            checked={applicationData.certifications.includes(cert)}
                            onCheckedChange={() => toggleCertification(cert)}
                          />
                          <Label htmlFor={cert} className="text-sm cursor-pointer">
                            {cert}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="whyCaregiver">Why do you want to be a caregiver? *</Label>
                    <Textarea
                      id="whyCaregiver"
                      value={applicationData.whyCaregiver}
                      onChange={(e) => updateApplicationData('whyCaregiver', e.target.value)}
                      placeholder="Tell us about your passion for senior care and what motivates you to help others..."
                      rows={3}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: References & Emergency Contact */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Professional References</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Please provide at least 2 professional references who can speak to your caregiving abilities
                </p>
                
                {applicationData.references.map((reference, index) => (
                  <Card key={index} className="p-4 border-gray-200">
                    <h4 className="font-medium mb-3">Reference {index + 1} {index < 2 && '*'}</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor={`ref-name-${index}`}>Full Name {index < 2 && '*'}</Label>
                        <Input
                          id={`ref-name-${index}`}
                          value={reference.name}
                          onChange={(e) => {
                            const newRefs = [...applicationData.references]
                            newRefs[index].name = e.target.value
                            updateApplicationData('references', newRefs)
                          }}
                          placeholder="Reference full name"
                          required={index < 2}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`ref-relationship-${index}`}>Relationship {index < 2 && '*'}</Label>
                        <Input
                          id={`ref-relationship-${index}`}
                          value={reference.relationship}
                          onChange={(e) => {
                            const newRefs = [...applicationData.references]
                            newRefs[index].relationship = e.target.value
                            updateApplicationData('references', newRefs)
                          }}
                          placeholder="e.g., Supervisor, Client, Colleague"
                          required={index < 2}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`ref-phone-${index}`}>Phone Number {index < 2 && '*'}</Label>
                        <Input
                          id={`ref-phone-${index}`}
                          type="tel"
                          value={reference.phone}
                          onChange={(e) => {
                            const newRefs = [...applicationData.references]
                            newRefs[index].phone = e.target.value
                            updateApplicationData('references', newRefs)
                          }}
                          placeholder="(555) 123-4567"
                          required={index < 2}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`ref-email-${index}`}>Email Address</Label>
                        <Input
                          id={`ref-email-${index}`}
                          type="email"
                          value={reference.email}
                          onChange={(e) => {
                            const newRefs = [...applicationData.references]
                            newRefs[index].email = e.target.value
                            updateApplicationData('references', newRefs)
                          }}
                          placeholder="reference@email.com"
                        />
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              <Separator />

              <div>
                <h4 className="font-semibold text-gray-900 mb-4">Emergency Contact *</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="emergencyName">Full Name *</Label>
                    <Input
                      id="emergencyName"
                      value={applicationData.emergencyContact.name}
                      onChange={(e) => updateNestedData(['emergencyContact', 'name'], e.target.value)}
                      placeholder="Emergency contact name"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="emergencyRelationship">Relationship *</Label>
                    <Input
                      id="emergencyRelationship"
                      value={applicationData.emergencyContact.relationship}
                      onChange={(e) => updateNestedData(['emergencyContact', 'relationship'], e.target.value)}
                      placeholder="e.g., Spouse, Parent, Sibling"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="emergencyPhone">Phone Number *</Label>
                    <Input
                      id="emergencyPhone"
                      type="tel"
                      value={applicationData.emergencyContact.phone}
                      onChange={(e) => updateNestedData(['emergencyContact', 'phone'], e.target.value)}
                      placeholder="(555) 123-4567"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Background Check Consent */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Background Check Authorization</h3>
                <p className="text-sm text-gray-600 mb-6">
                  As part of our commitment to client safety, all caregivers must complete background checks and drug testing.
                </p>
                
                <div className="space-y-6">
                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="backgroundCheck"
                      checked={applicationData.backgroundCheckConsent}
                      onCheckedChange={(checked) => updateApplicationData('backgroundCheckConsent', checked)}
                      required
                    />
                    <div className="space-y-1">
                      <Label htmlFor="backgroundCheck" className="text-sm font-medium">
                        Background Check Consent *
                      </Label>
                      <p className="text-sm text-gray-600">
                        I authorize Caring Compass to conduct a comprehensive background check including criminal history, 
                        employment verification, and reference checks. I understand this is required for employment.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="drugTest"
                      checked={applicationData.drugTestConsent}
                      onCheckedChange={(checked) => updateApplicationData('drugTestConsent', checked)}
                      required
                    />
                    <div className="space-y-1">
                      <Label htmlFor="drugTest" className="text-sm font-medium">
                        Drug Test Consent *
                      </Label>
                      <p className="text-sm text-gray-600">
                        I consent to pre-employment drug testing and random drug testing as required by company policy. 
                        I understand that failing to consent or pass drug testing will disqualify me from employment.
                      </p>
                    </div>
                  </div>

                  <div className="bg-violet-50 rounded-lg p-4">
                    <h4 className="font-medium text-violet-900 mb-2">Important Information</h4>
                    <ul className="text-sm text-violet-800 space-y-1">
                      <li>• Background checks typically take 3-5 business days</li>
                      <li>• Drug testing will be scheduled after background check approval</li>
                      <li>• You will be notified of results within 24 hours</li>
                      <li>• All information is kept strictly confidential</li>
                    </ul>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-semibold text-gray-900 mb-4">Additional Information</h4>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="transportation">Reliable Transportation</Label>
                    <select 
                      id="transportation"
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
                      value={applicationData.transportation}
                      onChange={(e) => updateApplicationData('transportation', e.target.value)}
                    >
                      <option value="">Select transportation status</option>
                      <option value="Own vehicle with insurance">Own vehicle with insurance</option>
                      <option value="Own vehicle, need insurance verification">Own vehicle, need insurance verification</option>
                      <option value="Reliable alternative transportation">Reliable alternative transportation</option>
                      <option value="No reliable transportation">No reliable transportation</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Additional Comments</Label>
                    <Textarea
                      id="message"
                      value={applicationData.message}
                      onChange={(e) => updateApplicationData('message', e.target.value)}
                      placeholder="Is there anything else you'd like us to know about your application or experience?"
                      rows={3}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Review & Submit */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Application Review</h3>
                <p className="text-sm text-gray-600 mb-6">
                  Please review your application before submitting. You can go back to make changes if needed.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="p-4 border-gray-200">
                    <h4 className="font-medium mb-2">Personal Information</h4>
                    <div className="space-y-1 text-sm">
                      <p><strong>Name:</strong> {applicationData.firstName} {applicationData.lastName}</p>
                      <p><strong>Email:</strong> {applicationData.email}</p>
                      <p><strong>Phone:</strong> {applicationData.phone}</p>
                      <p><strong>Address:</strong> {applicationData.address.street}, {applicationData.address.city}, {applicationData.address.state} {applicationData.address.zipCode}</p>
                    </div>
                  </Card>

                  <Card className="p-4 border-gray-200">
                    <h4 className="font-medium mb-2">Position & Experience</h4>
                    <div className="space-y-1 text-sm">
                      <p><strong>Position:</strong> {applicationData.position}</p>
                      <p><strong>Availability:</strong> {applicationData.availability}</p>
                      <p><strong>Skills:</strong> {applicationData.skills.length} selected</p>
                      <p><strong>Certifications:</strong> {applicationData.certifications.length} selected</p>
                    </div>
                  </Card>

                  <Card className="p-4 border-gray-200">
                    <h4 className="font-medium mb-2">References</h4>
                    <div className="space-y-1 text-sm">
                      <p><strong>References:</strong> {applicationData.references.filter(ref => ref.name).length} provided</p>
                      <p><strong>Emergency Contact:</strong> {applicationData.emergencyContact.name}</p>
                    </div>
                  </Card>

                  <Card className="p-4 border-gray-200">
                    <h4 className="font-medium mb-2">Consent Status</h4>
                    <div className="space-y-1 text-sm">
                      <p><strong>Background Check:</strong> {applicationData.backgroundCheckConsent ? '✅ Authorized' : '❌ Not authorized'}</p>
                      <p><strong>Drug Testing:</strong> {applicationData.drugTestConsent ? '✅ Authorized' : '❌ Not authorized'}</p>
                    </div>
                  </Card>
                </div>

                <div className="bg-green-50 rounded-lg p-4 mt-6">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="font-medium text-green-900">Ready to Submit</p>
                      <p className="text-sm text-green-800">
                        Your application is complete. After submission, we'll review it and contact you within 24-48 hours.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 flex justify-between items-center">
          <Button 
            variant="outline" 
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className="flex items-center space-x-2"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </Button>
          
          <div className="text-sm text-gray-500">
            Step {currentStep} of {applicationSteps.length}
          </div>
          
          {currentStep < 5 ? (
            <Button 
              onClick={handleNext}
              className="bg-violet-600 hover:bg-violet-700 text-white flex items-center space-x-2"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button 
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="bg-green-600 hover:bg-green-700 text-white flex items-center space-x-2"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <span>Submit Application</span>
                  <CheckCircle className="w-4 h-4" />
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

export default ApplicationModal
