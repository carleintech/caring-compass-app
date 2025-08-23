'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { 
  ChevronLeftIcon, 
  ChevronRightIcon, 
  UserIcon, 
  HomeIcon, 
  HeartIcon, 
  CalendarIcon,
  FileTextIcon,
  CheckCircleIcon,
  AlertCircleIcon
} from 'lucide-react'

interface OnboardingData {
  // Step 1: Personal Information
  personalInfo: {
    firstName: string
    lastName: string
    dateOfBirth: string
    gender: string
    phone: string
    emergencyContact: {
      name: string
      relationship: string
      phone: string
    }
  }
  
  // Step 2: Address & Living Situation
  address: {
    street: string
    city: string
    state: string
    zipCode: string
    livingArrangement: string
    accessInstructions: string
    hasKeyBox: boolean
    keyBoxCode: string
    hasPets: boolean
    petDetails: string
  }
  
  // Step 3: Health & Care Needs
  healthInfo: {
    primaryPhysician: string
    medicalConditions: string[]
    medications: string
    allergies: string
    mobilityAids: string[]
    cognitiveConcerns: string
    fallRisk: boolean
  }
  
  // Step 4: Daily Living & Preferences
  dailyLiving: {
    adlNeeds: string[]
    iadlNeeds: string[]
    mealPreferences: string
    schedulePreferences: string
    communicationPreferences: string[]
    culturalConsiderations: string
  }
  
  // Step 5: Caregiver Preferences
  caregiverPrefs: {
    genderPreference: string
    languagePreference: string[]
    experienceLevel: string
    personalityTraits: string[]
    specialRequests: string
  }
}

const initialData: OnboardingData = {
  personalInfo: {
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: '',
    phone: '',
    emergencyContact: {
      name: '',
      relationship: '',
      phone: ''
    }
  },
  address: {
    street: '',
    city: '',
    state: 'VA',
    zipCode: '',
    livingArrangement: '',
    accessInstructions: '',
    hasKeyBox: false,
    keyBoxCode: '',
    hasPets: false,
    petDetails: ''
  },
  healthInfo: {
    primaryPhysician: '',
    medicalConditions: [],
    medications: '',
    allergies: '',
    mobilityAids: [],
    cognitiveConcerns: '',
    fallRisk: false
  },
  dailyLiving: {
    adlNeeds: [],
    iadlNeeds: [],
    mealPreferences: '',
    schedulePreferences: '',
    communicationPreferences: [],
    culturalConsiderations: ''
  },
  caregiverPrefs: {
    genderPreference: '',
    languagePreference: [],
    experienceLevel: '',
    personalityTraits: [],
    specialRequests: ''
  }
}

const steps = [
  { id: 1, name: 'Personal Info', icon: UserIcon },
  { id: 2, name: 'Address & Home', icon: HomeIcon },
  { id: 3, name: 'Health & Care', icon: HeartIcon },
  { id: 4, name: 'Daily Living', icon: CalendarIcon },
  { id: 5, name: 'Caregiver Prefs', icon: FileTextIcon },
]

const medicalConditions = [
  'Diabetes', 'Hypertension', 'Heart Disease', 'Arthritis', 'Dementia/Alzheimer\'s',
  'Stroke', 'COPD', 'Depression', 'Anxiety', 'Parkinson\'s Disease', 'Cancer', 'Other'
]

const adlOptions = [
  'Bathing', 'Dressing', 'Grooming', 'Toileting', 'Transferring', 'Eating'
]

const iadlOptions = [
  'Light Housekeeping', 'Meal Preparation', 'Medication Reminders', 'Transportation',
  'Shopping', 'Laundry', 'Money Management', 'Phone/Communication'
]

const mobilityAids = [
  'Walker', 'Wheelchair', 'Cane', 'Rollator', 'Lift Chair', 'Hospital Bed', 'None'
]

export default function ClientOnboardingPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<OnboardingData>(initialData)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const updateFormData = (section: keyof OnboardingData, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }))
    // Clear errors when user starts typing
    if (errors[`${section}.${field}`]) {
      setErrors(prev => ({ ...prev, [`${section}.${field}`]: '' }))
    }
  }

  const updateNestedFormData = (section: keyof OnboardingData, subsection: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [subsection]: {
          ...prev[section][subsection],
          [field]: value
        }
      }
    }))
  }

  const toggleArrayValue = (section: keyof OnboardingData, field: string, value: string) => {
    setFormData(prev => {
      const currentArray = prev[section][field] as string[]
      const newArray = currentArray.includes(value)
        ? currentArray.filter(item => item !== value)
        : [...currentArray, value]
      
      return {
        ...prev,
        [section]: {
          ...prev[section],
          [field]: newArray
        }
      }
    })
  }

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {}

    switch (step) {
      case 1:
        if (!formData.personalInfo.firstName) newErrors['personalInfo.firstName'] = 'First name is required'
        if (!formData.personalInfo.lastName) newErrors['personalInfo.lastName'] = 'Last name is required'
        if (!formData.personalInfo.dateOfBirth) newErrors['personalInfo.dateOfBirth'] = 'Date of birth is required'
        if (!formData.personalInfo.phone) newErrors['personalInfo.phone'] = 'Phone number is required'
        break
      
      case 2:
        if (!formData.address.street) newErrors['address.street'] = 'Street address is required'
        if (!formData.address.city) newErrors['address.city'] = 'City is required'
        if (!formData.address.zipCode) newErrors['address.zipCode'] = 'ZIP code is required'
        break
      
      case 3:
        if (!formData.healthInfo.primaryPhysician) newErrors['healthInfo.primaryPhysician'] = 'Primary physician is required'
        break
      
      case 4:
        if (formData.dailyLiving.adlNeeds.length === 0 && formData.dailyLiving.iadlNeeds.length === 0) {
          newErrors['dailyLiving.needs'] = 'Please select at least one care need'
        }
        break
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, steps.length))
    }
  }

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1))
  }

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return

    setIsSubmitting(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Redirect to care plan creation
      router.push('/client/care-plan?setup=true')
    } catch (error) {
      console.error('Error submitting onboarding:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const progress = (currentStep / steps.length) * 100

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900">Welcome to Caring Compass</h1>
        <p className="text-gray-600 mt-2">
          Let&apos;s get to know you better so we can provide the best possible care
        </p>
      </div>

      {/* Progress Bar */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium">Step {currentStep} of {steps.length}</span>
            <span className="text-sm text-gray-600">{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="w-full" />
          
          {/* Step Indicators */}
          <div className="flex justify-between mt-6">
            {steps.map((step) => {
              const Icon = step.icon
              const isActive = currentStep === step.id
              const isComplete = currentStep > step.id
              
              return (
                <div key={step.id} className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                    isComplete 
                      ? 'bg-green-500 border-green-500 text-white' 
                      : isActive 
                        ? 'bg-blue-500 border-blue-500 text-white' 
                        : 'border-gray-300 text-gray-400'
                  }`}>
                    {isComplete ? (
                      <CheckCircleIcon className="h-5 w-5" />
                    ) : (
                      <Icon className="h-5 w-5" />
                    )}
                  </div>
                  <span className={`text-xs mt-2 ${isActive ? 'text-blue-600 font-medium' : 'text-gray-500'}`}>
                    {step.name}
                  </span>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Step Content */}
      <Card>
        <CardContent className="p-8">
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">Personal Information</h2>
                <p className="text-gray-600">Tell us about yourself and your emergency contact</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    value={formData.personalInfo.firstName}
                    onChange={(e) => updateFormData('personalInfo', 'firstName', e.target.value)}
                    className={errors['personalInfo.firstName'] ? 'border-red-500' : ''}
                  />
                  {errors['personalInfo.firstName'] && (
                    <p className="text-sm text-red-500">{errors['personalInfo.firstName']}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    value={formData.personalInfo.lastName}
                    onChange={(e) => updateFormData('personalInfo', 'lastName', e.target.value)}
                    className={errors['personalInfo.lastName'] ? 'border-red-500' : ''}
                  />
                  {errors['personalInfo.lastName'] && (
                    <p className="text-sm text-red-500">{errors['personalInfo.lastName']}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={formData.personalInfo.dateOfBirth}
                    onChange={(e) => updateFormData('personalInfo', 'dateOfBirth', e.target.value)}
                    className={errors['personalInfo.dateOfBirth'] ? 'border-red-500' : ''}
                  />
                  {errors['personalInfo.dateOfBirth'] && (
                    <p className="text-sm text-red-500">{errors['personalInfo.dateOfBirth']}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="gender">Gender</Label>
                  <Select value={formData.personalInfo.gender} onValueChange={(value) => updateFormData('personalInfo', 'gender', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                      <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.personalInfo.phone}
                    onChange={(e) => updateFormData('personalInfo', 'phone', e.target.value)}
                    className={errors['personalInfo.phone'] ? 'border-red-500' : ''}
                  />
                  {errors['personalInfo.phone'] && (
                    <p className="text-sm text-red-500">{errors['personalInfo.phone']}</p>
                  )}
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-semibold mb-4">Emergency Contact</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="emergencyName">Name</Label>
                    <Input
                      id="emergencyName"
                      value={formData.personalInfo.emergencyContact.name}
                      onChange={(e) => updateNestedFormData('personalInfo', 'emergencyContact', 'name', e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="emergencyRelationship">Relationship</Label>
                    <Input
                      id="emergencyRelationship"
                      value={formData.personalInfo.emergencyContact.relationship}
                      onChange={(e) => updateNestedFormData('personalInfo', 'emergencyContact', 'relationship', e.target.value)}
                      placeholder="e.g., Daughter, Son, Friend"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="emergencyPhone">Phone</Label>
                    <Input
                      id="emergencyPhone"
                      type="tel"
                      value={formData.personalInfo.emergencyContact.phone}
                      onChange={(e) => updateNestedFormData('personalInfo', 'emergencyContact', 'phone', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">Address & Living Situation</h2>
                <p className="text-gray-600">Help us understand your home environment</p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="street">Street Address *</Label>
                  <Input
                    id="street"
                    value={formData.address.street}
                    onChange={(e) => updateFormData('address', 'street', e.target.value)}
                    className={errors['address.street'] ? 'border-red-500' : ''}
                  />
                  {errors['address.street'] && (
                    <p className="text-sm text-red-500">{errors['address.street']}</p>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      value={formData.address.city}
                      onChange={(e) => updateFormData('address', 'city', e.target.value)}
                      className={errors['address.city'] ? 'border-red-500' : ''}
                    />
                    {errors['address.city'] && (
                      <p className="text-sm text-red-500">{errors['address.city']}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Select value={formData.address.state} onValueChange={(value) => updateFormData('address', 'state', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="VA">Virginia</SelectItem>
                        <SelectItem value="NC">North Carolina</SelectItem>
                        <SelectItem value="MD">Maryland</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="zipCode">ZIP Code *</Label>
                    <Input
                      id="zipCode"
                      value={formData.address.zipCode}
                      onChange={(e) => updateFormData('address', 'zipCode', e.target.value)}
                      className={errors['address.zipCode'] ? 'border-red-500' : ''}
                    />
                    {errors['address.zipCode'] && (
                      <p className="text-sm text-red-500">{errors['address.zipCode']}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="livingArrangement">Living Arrangement</Label>
                  <Select value={formData.address.livingArrangement} onValueChange={(value) => updateFormData('address', 'livingArrangement', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select living arrangement" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="alone">Live alone</SelectItem>
                      <SelectItem value="spouse">Live with spouse/partner</SelectItem>
                      <SelectItem value="family">Live with family members</SelectItem>
                      <SelectItem value="assisted-living">Assisted living facility</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="accessInstructions">Access Instructions</Label>
                  <Textarea
                    id="accessInstructions"
                    value={formData.address.accessInstructions}
                    onChange={(e) => updateFormData('address', 'accessInstructions', e.target.value)}
                    placeholder="Special instructions for caregivers to access your home (e.g., use side door, ring doorbell twice, etc.)"
                    rows={3}
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="hasKeyBox"
                      checked={formData.address.hasKeyBox}
                      onCheckedChange={(checked) => updateFormData('address', 'hasKeyBox', checked)}
                    />
                    <Label htmlFor="hasKeyBox">I have a key box/lockbox</Label>
                  </div>

                  {formData.address.hasKeyBox && (
                    <div className="space-y-2 ml-6">
                      <Label htmlFor="keyBoxCode">Key Box Code</Label>
                      <Input
                        id="keyBoxCode"
                        value={formData.address.keyBoxCode}
                        onChange={(e) => updateFormData('address', 'keyBoxCode', e.target.value)}
                        placeholder="Enter code"
                      />
                    </div>
                  )}

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="hasPets"
                      checked={formData.address.hasPets}
                      onCheckedChange={(checked) => updateFormData('address', 'hasPets', checked)}
                    />
                    <Label htmlFor="hasPets">I have pets</Label>
                  </div>

                  {formData.address.hasPets && (
                    <div className="space-y-2 ml-6">
                      <Label htmlFor="petDetails">Pet Details</Label>
                      <Textarea
                        id="petDetails"
                        value={formData.address.petDetails}
                        onChange={(e) => updateFormData('address', 'petDetails', e.target.value)}
                        placeholder="Tell us about your pets (type, behavior, special considerations)"
                        rows={3}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">Health & Care Information</h2>
                <p className="text-gray-600">Help us understand your health and medical needs</p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="primaryPhysician">Primary Physician *</Label>
                  <Input
                    id="primaryPhysician"
                    value={formData.healthInfo.primaryPhysician}
                    onChange={(e) => updateFormData('healthInfo', 'primaryPhysician', e.target.value)}
                    placeholder="Dr. Smith at Virginia Beach Medical Center"
                    className={errors['healthInfo.primaryPhysician'] ? 'border-red-500' : ''}
                  />
                  {errors['healthInfo.primaryPhysician'] && (
                    <p className="text-sm text-red-500">{errors['healthInfo.primaryPhysician']}</p>
                  )}
                </div>

                <div className="space-y-3">
                  <Label>Medical Conditions</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {medicalConditions.map((condition) => (
                      <div key={condition} className="flex items-center space-x-2">
                        <Checkbox
                          id={condition}
                          checked={formData.healthInfo.medicalConditions.includes(condition)}
                          onCheckedChange={() => toggleArrayValue('healthInfo', 'medicalConditions', condition)}
                        />
                        <Label htmlFor={condition} className="text-sm">{condition}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="medications">Current Medications</Label>
                  <Textarea
                    id="medications"
                    value={formData.healthInfo.medications}
                    onChange={(e) => updateFormData('healthInfo', 'medications', e.target.value)}
                    placeholder="List all current medications, dosages, and frequency"
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="allergies">Allergies</Label>
                  <Textarea
                    id="allergies"
                    value={formData.healthInfo.allergies}
                    onChange={(e) => updateFormData('healthInfo', 'allergies', e.target.value)}
                    placeholder="Food allergies, medication allergies, environmental allergies"
                    rows={3}
                  />
                </div>

                <div className="space-y-3">
                  <Label>Mobility Aids Used</Label>
                  <div className="grid grid-cols-4 gap-2">
                    {mobilityAids.map((aid) => (
                      <div key={aid} className="flex items-center space-x-2">
                        <Checkbox
                          id={aid}
                          checked={formData.healthInfo.mobilityAids.includes(aid)}
                          onCheckedChange={() => toggleArrayValue('healthInfo', 'mobilityAids', aid)}
                        />
                        <Label htmlFor={aid} className="text-sm">{aid}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cognitiveConcerns">Cognitive or Memory Concerns</Label>
                  <Textarea
                    id="cognitiveConcerns"
                    value={formData.healthInfo.cognitiveConcerns}
                    onChange={(e) => updateFormData('healthInfo', 'cognitiveConcerns', e.target.value)}
                    placeholder="Any memory issues, confusion, or cognitive changes we should be aware of"
                    rows={3}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="fallRisk"
                    checked={formData.healthInfo.fallRisk}
                    onCheckedChange={(checked) => updateFormData('healthInfo', 'fallRisk', checked)}
                  />
                  <Label htmlFor="fallRisk">I am at risk for falls</Label>
                </div>
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">Daily Living & Preferences</h2>
                <p className="text-gray-600">Tell us about your daily routines and care preferences</p>
              </div>

              {errors['dailyLiving.needs'] && (
                <Alert variant="destructive">
                  <AlertCircleIcon className="h-4 w-4" />
                  <AlertDescription>{errors['dailyLiving.needs']}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-6">
                <div className="space-y-3">
                  <Label>Activities of Daily Living (ADL) - Personal Care Assistance Needed</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {adlOptions.map((adl) => (
                      <div key={adl} className="flex items-center space-x-2">
                        <Checkbox
                          id={adl}
                          checked={formData.dailyLiving.adlNeeds.includes(adl)}
                          onCheckedChange={() => toggleArrayValue('dailyLiving', 'adlNeeds', adl)}
                        />
                        <Label htmlFor={adl} className="text-sm">{adl}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <Label>Instrumental Activities of Daily Living (IADL) - Assistance Needed</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {iadlOptions.map((iadl) => (
                      <div key={iadl} className="flex items-center space-x-2">
                        <Checkbox
                          id={iadl}
                          checked={formData.dailyLiving.iadlNeeds.includes(iadl)}
                          onCheckedChange={() => toggleArrayValue('dailyLiving', 'iadlNeeds', iadl)}
                        />
                        <Label htmlFor={iadl} className="text-sm">{iadl}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="mealPreferences">Meal Preferences & Dietary Restrictions</Label>
                  <Textarea
                    id="mealPreferences"
                    value={formData.dailyLiving.mealPreferences}
                    onChange={(e) => updateFormData('dailyLiving', 'mealPreferences', e.target.value)}
                    placeholder="Favorite foods, foods to avoid, diabetic diet, low-sodium, etc."
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="schedulePreferences">Schedule Preferences</Label>
                  <Textarea
                    id="schedulePreferences"
                    value={formData.dailyLiving.schedulePreferences}
                    onChange={(e) => updateFormData('dailyLiving', 'schedulePreferences', e.target.value)}
                    placeholder="Preferred times for care, daily routines, sleep schedule"
                    rows={3}
                  />
                </div>

                <div className="space-y-3">
                  <Label>Communication Preferences</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {['Phone calls', 'Text messages', 'Email', 'In-person only'].map((pref) => (
                      <div key={pref} className="flex items-center space-x-2">
                        <Checkbox
                          id={pref}
                          checked={formData.dailyLiving.communicationPreferences.includes(pref)}
                          onCheckedChange={() => toggleArrayValue('dailyLiving', 'communicationPreferences', pref)}
                        />
                        <Label htmlFor={pref} className="text-sm">{pref}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="culturalConsiderations">Cultural or Religious Considerations</Label>
                  <Textarea
                    id="culturalConsiderations"
                    value={formData.dailyLiving.culturalConsiderations}
                    onChange={(e) => updateFormData('dailyLiving', 'culturalConsiderations', e.target.value)}
                    placeholder="Any cultural, religious, or personal preferences we should respect"
                    rows={3}
                  />
                </div>
              </div>
            </div>
          )}

          {currentStep === 5 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">Caregiver Preferences</h2>
                <p className="text-gray-600">Help us match you with the perfect caregiver</p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="genderPreference">Gender Preference</Label>
                  <Select value={formData.caregiverPrefs.genderPreference} onValueChange={(value) => updateFormData('caregiverPrefs', 'genderPreference', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select preference" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="no-preference">No preference</SelectItem>
                      <SelectItem value="female">Female caregiver preferred</SelectItem>
                      <SelectItem value="male">Male caregiver preferred</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <Label>Language Preferences</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {['English', 'Spanish', 'Haitian Creole', 'French', 'Other'].map((lang) => (
                      <div key={lang} className="flex items-center space-x-2">
                        <Checkbox
                          id={lang}
                          checked={formData.caregiverPrefs.languagePreference.includes(lang)}
                          onCheckedChange={() => toggleArrayValue('caregiverPrefs', 'languagePreference', lang)}
                        />
                        <Label htmlFor={lang} className="text-sm">{lang}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="experienceLevel">Experience Level Preference</Label>
                  <Select value={formData.caregiverPrefs.experienceLevel} onValueChange={(value) => updateFormData('caregiverPrefs', 'experienceLevel', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select experience level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Any experience level</SelectItem>
                      <SelectItem value="new">New caregivers welcome</SelectItem>
                      <SelectItem value="experienced">Experienced caregivers (2+ years)</SelectItem>
                      <SelectItem value="senior">Senior caregivers (5+ years)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <Label>Desired Personality Traits</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {['Patient', 'Cheerful', 'Quiet', 'Talkative', 'Energetic', 'Calm', 'Organized', 'Flexible', 'Compassionate'].map((trait) => (
                      <div key={trait} className="flex items-center space-x-2">
                        <Checkbox
                          id={trait}
                          checked={formData.caregiverPrefs.personalityTraits.includes(trait)}
                          onCheckedChange={() => toggleArrayValue('caregiverPrefs', 'personalityTraits', trait)}
                        />
                        <Label htmlFor={trait} className="text-sm">{trait}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="specialRequests">Special Requests or Additional Information</Label>
                  <Textarea
                    id="specialRequests"
                    value={formData.caregiverPrefs.specialRequests}
                    onChange={(e) => updateFormData('caregiverPrefs', 'specialRequests', e.target.value)}
                    placeholder="Any other preferences, concerns, or information that would help us provide better care"
                    rows={4}
                  />
                </div>

                <Alert>
                  <CheckCircleIcon className="h-4 w-4" />
                  <AlertDescription>
                    Once you complete this form, our care coordinator will review your information and contact you within 24 hours to discuss your care plan and caregiver matching.
                  </AlertDescription>
                </Alert>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={prevStep}
          disabled={currentStep === 1}
        >
          <ChevronLeftIcon className="h-4 w-4 mr-2" />
          Previous
        </Button>

        {currentStep < steps.length ? (
          <Button onClick={nextStep}>
            Next
            <ChevronRightIcon className="h-4 w-4 ml-2" />
          </Button>
        ) : (
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <LoadingSpinner className="mr-2 h-4 w-4" />
                Submitting...
              </>
            ) : (
              'Complete Onboarding'
            )}
          </Button>
        )}
      </div>
    </div>
  )
}