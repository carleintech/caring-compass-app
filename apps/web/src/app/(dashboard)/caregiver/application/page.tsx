'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { toast } from '@/hooks/use-toast'
import { 
  User, 
  FileText, 
  Upload, 
  CheckCircle, 
  AlertCircle, 
  Clock,
  Phone,
  Mail,
  MapPin,
  GraduationCap,
  Award,
  Heart,
  Shield,
  ChevronRight,
  ChevronLeft
} from 'lucide-react'

const applicationSteps = [
  { id: 1, title: 'Personal Information', icon: User },
  { id: 2, title: 'Experience & Skills', icon: GraduationCap },
  { id: 3, title: 'Credentials & Documents', icon: FileText },
  { id: 4, title: 'References', icon: Heart },
  { id: 5, title: 'Background Check', icon: Shield },
  { id: 6, title: 'Review & Submit', icon: CheckCircle }
]

const skillsOptions = [
  'Personal Care Assistance',
  'Medication Reminders',
  'Mobility Assistance',
  'Dementia Care',
  'Alzheimer\'s Care',
  'Post-Surgical Care',
  'Diabetic Care',
  'Meal Preparation',
  'Light Housekeeping',
  'Transportation',
  'Companionship',
  'Respite Care'
]

const certificationOptions = [
  'CNA (Certified Nursing Assistant)',
  'HHA (Home Health Aide)',
  'PCA (Personal Care Assistant)',
  'CPR Certification',
  'First Aid Certification',
  'Dementia Care Certification',
  'Alzheimer\'s Care Certification',
  'Medication Administration'
]

export default function JobApplicationPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [applicationData, setApplicationData] = useState({
    // Personal Information
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: ''
    },
    dateOfBirth: '',
    ssn: '',
    emergencyContact: {
      name: '',
      relationship: '',
      phone: ''
    },
    // Experience & Skills
    experience: {
      yearsInCaregiving: '',
      previousEmployer: '',
      reasonForLeaving: '',
      specialties: [] as string[]
    },
    availability: {
      fullTime: false,
      partTime: false,
      weekends: false,
      evenings: false,
      overnights: false,
      maxHoursPerWeek: ''
    },
    skills: [] as string[],
    // Credentials
    certifications: [] as string[],
    documents: {
      resume: null,
      certifications: null,
      references: null,
      driverLicense: null
    },
    // References
    references: [
      { name: '', relationship: '', phone: '', email: '', yearsKnown: '' },
      { name: '', relationship: '', phone: '', email: '', yearsKnown: '' },
      { name: '', relationship: '', phone: '', email: '', yearsKnown: '' }
    ],
    // Background Check Consent
    backgroundCheckConsent: false,
    drugTestConsent: false,
    // Additional
    whyCaregiver: '',
    additionalInfo: ''
  })

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
        current = current[path[i] as keyof typeof current] as any
      }
      current[path[path.length - 1] as keyof typeof current] = value
      return newData
    })
  }

  const toggleSkill = (skill: string) => {
    const currentSkills = applicationData.skills
    if (currentSkills.includes(skill)) {
      updateApplicationData('skills', currentSkills.filter(s => s !== skill))
    } else {
      updateApplicationData('skills', [...currentSkills, skill])
    }
  }

  const toggleCertification = (certification: string) => {
    const currentCerts = applicationData.certifications
    if (currentCerts.includes(certification)) {
      updateApplicationData('certifications', currentCerts.filter(c => c !== certification))
    } else {
      updateApplicationData('certifications', [...currentCerts, certification])
    }
  }

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(applicationData.firstName && applicationData.lastName && 
                 applicationData.email && applicationData.phone)
      case 2:
        return !!(applicationData.experience.yearsInCaregiving && 
                 applicationData.skills.length > 0)
      case 3:
        return applicationData.certifications.length > 0
      case 4:
        return applicationData.references.filter(ref => ref.name && ref.phone).length >= 2
      case 5:
        return applicationData.backgroundCheckConsent && applicationData.drugTestConsent
      default:
        return true
    }
  }

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 6))
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

  const handleSubmit = () => {
    toast({
      title: "Application Submitted",
      description: "Thank you for your application! We'll review it and get back to you within 3-5 business days.",
    })
  }

  const completedSteps = Array.from({ length: currentStep - 1 }, (_, i) => i + 1)
  const progressPercentage = ((currentStep - 1) / (applicationSteps.length - 1)) * 100

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Caregiver Application</h1>
          <p className="text-muted-foreground">
            Join our team of compassionate caregivers
          </p>
        </div>
        <Badge variant="outline" className="text-sm">
          Step {currentStep} of {applicationSteps.length}
        </Badge>
      </div>

      {/* Progress Indicator */}
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex justify-between text-sm">
              <span>Application Progress</span>
              <span>{Math.round(progressPercentage)}% Complete</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
            
            <div className="flex justify-between items-center">
              {applicationSteps.map((step, index) => {
                const Icon = step.icon
                const isCompleted = completedSteps.includes(step.id)
                const isCurrent = currentStep === step.id
                
                return (
                  <div 
                    key={step.id} 
                    className={`flex flex-col items-center space-y-2 ${
                      index < applicationSteps.length - 1 ? 'flex-1' : ''
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      isCompleted ? 'bg-green-100 text-green-600' :
                      isCurrent ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400'
                    }`}>
                      {isCompleted ? <CheckCircle className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
                    </div>
                    <span className={`text-xs text-center ${
                      isCurrent ? 'font-medium' : 'text-muted-foreground'
                    }`}>
                      {step.title}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Step Content */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {React.createElement(applicationSteps[currentStep - 1].icon, { className: "h-5 w-5" })}
            {applicationSteps[currentStep - 1].title}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Step 1: Personal Information */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    value={applicationData.firstName}
                    onChange={(e) => updateApplicationData('firstName', e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    value={applicationData.lastName}
                    onChange={(e) => updateApplicationData('lastName', e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={applicationData.email}
                    onChange={(e) => updateApplicationData('email', e.target.value)}
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
                    required
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="font-medium">Home Address</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="street">Street Address</Label>
                    <Input
                      id="street"
                      value={applicationData.address.street}
                      onChange={(e) => updateNestedData(['address', 'street'], e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        value={applicationData.address.city}
                        onChange={(e) => updateNestedData(['address', 'city'], e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state">State</Label>
                      <Select
                        value={applicationData.address.state}
                        onValueChange={(value) => updateNestedData(['address', 'state'], value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select state" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="VA">Virginia</SelectItem>
                          <SelectItem value="NC">North Carolina</SelectItem>
                          <SelectItem value="MD">Maryland</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="zipCode">ZIP Code</Label>
                      <Input
                        id="zipCode"
                        value={applicationData.address.zipCode}
                        onChange={(e) => updateNestedData(['address', 'zipCode'], e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="font-medium">Emergency Contact</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="emergencyName">Full Name</Label>
                    <Input
                      id="emergencyName"
                      value={applicationData.emergencyContact.name}
                      onChange={(e) => updateNestedData(['emergencyContact', 'name'], e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="emergencyRelationship">Relationship</Label>
                    <Input
                      id="emergencyRelationship"
                      value={applicationData.emergencyContact.relationship}
                      onChange={(e) => updateNestedData(['emergencyContact', 'relationship'], e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="emergencyPhone">Phone Number</Label>
                    <Input
                      id="emergencyPhone"
                      type="tel"
                      value={applicationData.emergencyContact.phone}
                      onChange={(e) => updateNestedData(['emergencyContact', 'phone'], e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Experience & Skills */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-medium">Caregiving Experience</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="yearsInCaregiving">Years of Caregiving Experience *</Label>
                    <Select
                      value={applicationData.experience.yearsInCaregiving}
                      onValueChange={(value) => updateNestedData(['experience', 'yearsInCaregiving'], value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select experience level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0-1">Less than 1 year</SelectItem>
                        <SelectItem value="1-2">1-2 years</SelectItem>
                        <SelectItem value="3-5">3-5 years</SelectItem>
                        <SelectItem value="5-10">5-10 years</SelectItem>
                        <SelectItem value="10+">10+ years</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="maxHours">Maximum Hours Per Week</Label>
                    <Select
                      value={applicationData.availability.maxHoursPerWeek}
                      onValueChange={(value) => updateNestedData(['availability', 'maxHoursPerWeek'], value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select max hours" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="20">Up to 20 hours</SelectItem>
                        <SelectItem value="30">Up to 30 hours</SelectItem>
                        <SelectItem value="40">Up to 40 hours</SelectItem>
                        <SelectItem value="50">50+ hours</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="previousEmployer">Most Recent Caregiving Employer</Label>
                  <Input
                    id="previousEmployer"
                    value={applicationData.experience.previousEmployer}
                    onChange={(e) => updateNestedData(['experience', 'previousEmployer'], e.target.value)}
                    placeholder="Company name or private client"
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="font-medium">Availability *</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {[
                    { key: 'fullTime', label: 'Full-time (30+ hours/week)' },
                    { key: 'partTime', label: 'Part-time (< 30 hours/week)' },
                    { key: 'weekends', label: 'Weekend shifts' },
                    { key: 'evenings', label: 'Evening shifts (6 PM - 11 PM)' },
                    { key: 'overnights', label: 'Overnight shifts (11 PM - 7 AM)' }
                  ].map((option) => (
                    <div key={option.key} className="flex items-center space-x-2">
                      <Checkbox
                        id={option.key}
                        checked={applicationData.availability[option.key as keyof typeof applicationData.availability] as boolean}
                        onCheckedChange={(checked) => updateNestedData(['availability', option.key], checked)}
                      />
                      <Label htmlFor={option.key} className="text-sm">
                        {option.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="font-medium">Care Skills & Specialties *</h3>
                <p className="text-sm text-muted-foreground">
                  Select all areas where you have experience or training
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {skillsOptions.map((skill) => (
                    <div key={skill} className="flex items-center space-x-2">
                      <Checkbox
                        id={skill}
                        checked={applicationData.skills.includes(skill)}
                        onCheckedChange={() => toggleSkill(skill)}
                      />
                      <Label htmlFor={skill} className="text-sm">
                        {skill}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="whyCaregiver">Why do you want to be a caregiver?</Label>
                <Textarea
                  id="whyCaregiver"
                  value={applicationData.whyCaregiver}
                  onChange={(e) => updateApplicationData('whyCaregiver', e.target.value)}
                  placeholder="Tell us about your passion for caregiving..."
                  rows={4}
                />
              </div>
            </div>
          )}

          {/* Step 3: Credentials & Documents */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-medium">Professional Certifications *</h3>
                <p className="text-sm text-muted-foreground">
                  Select all certifications you currently hold
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {certificationOptions.map((cert) => (
                    <div key={cert} className="flex items-center space-x-2">
                      <Checkbox
                        id={cert}
                        checked={applicationData.certifications.includes(cert)}
                        onCheckedChange={() => toggleCertification(cert)}
                      />
                      <Label htmlFor={cert} className="text-sm">
                        {cert}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="font-medium">Document Upload</h3>
                <p className="text-sm text-muted-foreground">
                  Please upload the following documents. All files should be in PDF format.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    { key: 'resume', label: 'Resume/CV', required: true },
                    { key: 'certifications', label: 'Certification Documents', required: true },
                    { key: 'driverLicense', label: 'Driver\'s License', required: false },
                    { key: 'references', label: 'Reference Letters', required: false }
                  ].map((doc) => (
                    <div key={doc.key} className="space-y-2">
                      <Label className="flex items-center gap-2">
                        {doc.label}
                        {doc.required && <span className="text-red-500">*</span>}
                      </Label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                        <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                        <p className="text-sm text-gray-600 mb-2">
                          Drop your file here or click to browse
                        </p>
                        <Button variant="outline" size="sm">
                          Choose File
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-blue-900">Document Requirements</p>
                    <ul className="text-sm text-blue-800 mt-1 space-y-1">
                      <li>• All documents must be current and valid</li>
                      <li>• Files should be clear and readable</li>
                      <li>• Maximum file size: 10MB per document</li>
                      <li>• Accepted formats: PDF, JPG, PNG</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: References */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-medium">Professional References</h3>
                <p className="text-sm text-muted-foreground">
                  Please provide at least 2 professional references who can speak to your caregiving abilities
                </p>
                
                {applicationData.references.map((reference, index) => (
                  <Card key={index} className="p-4">
                    <h4 className="font-medium mb-4">Reference {index + 1}</h4>
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
                        />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor={`ref-years-${index}`}>How long have they known you professionally?</Label>
                        <Select
                          value={reference.yearsKnown}
                          onValueChange={(value) => {
                            const newRefs = [...applicationData.references]
                            newRefs[index].yearsKnown = value
                            updateApplicationData('references', newRefs)
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select duration" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="6-months">6 months - 1 year</SelectItem>
                            <SelectItem value="1-2-years">1-2 years</SelectItem>
                            <SelectItem value="2-5-years">2-5 years</SelectItem>
                            <SelectItem value="5+-years">5+ years</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Step 5: Background Check */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-medium">Background Check Authorization</h3>
                <p className="text-sm text-muted-foreground">
                  As part of our commitment to client safety, all caregivers must complete background checks and drug testing.
                </p>
                
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="backgroundCheck"
                      checked={applicationData.backgroundCheckConsent}
                      onCheckedChange={(checked) => updateApplicationData('backgroundCheckConsent', checked)}
                      required
                    />
                    <div className="space-y-1">
                      <Label htmlFor="backgroundCheck" className="font-medium">
                        Background Check Consent *
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        I authorize Caring Compass Home Care to conduct a comprehensive background check, 
                        including criminal history, employment verification, and reference checks.
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
                      <Label htmlFor="drugTest" className="font-medium">
                        Drug Test Consent *
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        I consent to pre-employment drug testing and understand that a negative result 
                        is required for employment.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-yellow-900">Important Information</p>
                      <ul className="text-sm text-yellow-800 mt-1 space-y-1">
                        <li>• Background checks typically take 3-5 business days</li>
                        <li>• You will receive detailed instructions via email</li>
                        <li>• Some criminal history may not disqualify you from employment</li>
                        <li>• All information is kept strictly confidential</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="additionalInfo">Additional Information</Label>
                <Textarea
                  id="additionalInfo"
                  value={applicationData.additionalInfo}
                  onChange={(e) => updateApplicationData('additionalInfo', e.target.value)}
                  placeholder="Is there anything else you'd like us to know about your application?"
                  rows={4}
                />
              </div>
            </div>
          )}

          {/* Step 6: Review & Submit */}
          {currentStep === 6 && (
            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-medium">Application Review</h3>
                <p className="text-sm text-muted-foreground">
                  Please review your application before submitting. You can go back to make changes if needed.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="p-4">
                    <h4 className="font-medium mb-2">Personal Information</h4>
                    <div className="space-y-1 text-sm">
                      <p><strong>Name:</strong> {applicationData.firstName} {applicationData.lastName}</p>
                      <p><strong>Email:</strong> {applicationData.email}</p>
                      <p><strong>Phone:</strong> {applicationData.phone}</p>
                    </div>
                  </Card>

                  <Card className="p-4">
                    <h4 className="font-medium mb-2">Experience</h4>
                    <div className="space-y-1 text-sm">
                      <p><strong>Years:</strong> {applicationData.experience.yearsInCaregiving}</p>
                      <p><strong>Skills:</strong> {applicationData.skills.length} selected</p>
                      <p><strong>Certifications:</strong> {applicationData.certifications.length} selected</p>
                    </div>
                  </Card>

                  <Card className="p-4">
                    <h4 className="font-medium mb-2">References</h4>
                    <div className="space-y-1 text-sm">
                      <p><strong>Provided:</strong> {applicationData.references.filter(ref => ref.name).length} references</p>
                    </div>
                  </Card>

                  <Card className="p-4">
                    <h4 className="font-medium mb-2">Background Check</h4>
                    <div className="space-y-1 text-sm">
                      <p><strong>Consents:</strong> {applicationData.backgroundCheckConsent && applicationData.drugTestConsent ? 'All provided' : 'Pending'}</p>
                    </div>
                  </Card>
                </div>

                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-green-900">Ready to Submit</p>
                      <p className="text-sm text-green-800">
                        Your application appears complete. After submission, we&apos;ll review your application and contact you within 3-5 business days.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={handlePrevious}
          disabled={currentStep === 1}
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Previous
        </Button>
        
        {currentStep < 6 ? (
          <Button onClick={handleNext}>
            Next
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        ) : (
          <Button onClick={handleSubmit} className="bg-green-600 hover:bg-green-700">
            Submit Application
            <CheckCircle className="h-4 w-4 ml-2" />
          </Button>
        )}
      </div>
    </div>
  )
}