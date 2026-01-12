'use client'

import { useState } from 'react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { BackToHomeButton } from '@/components/ui/back-to-home-button'
import { trpc } from '@/lib/trpc'

// Import wizard components
import { ProgressBar } from './components/ProgressBar'
import { WizardButtons } from './components/WizardButtons'
import { Step1ChooseRole } from './steps/Step1ChooseRole'
import { Step2CaregiverForm } from './steps/Step2CaregiverForm'
import { Step2ClientForm } from './steps/Step2ClientForm'
import { Step2FamilyForm } from './steps/Step2FamilyForm'
import { Step3Account } from './steps/Step3Account'
import { Step4Agreements } from './steps/Step4Agreements'
import { Step5Success } from './steps/Step5Success'

export default function RegisterPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [error, setError] = useState('')
  const totalSteps = 5

  // Form data state
  const [formData, setFormData] = useState({
    role: '',
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    phone: '',
    address: '',
    city: '',
    state: 'VA',
    zipCode: '',
    hasTransportation: false,
    hasCertification: false,
    certificationDetails: '',
    experience: '',
    availability: '',
    careType: '',
    hoursPerWeek: '',
    preferredGender: '',
    mobilityLimitations: '',
    householdInfo: '',
    relationship: '',
    patientFirstName: '',
    patientLastName: '',
    patientDateOfBirth: '',
    careReason: '',
    emergencyContact: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
    agreeToPrivacy: false,
    agreeToBackground: false
  })

  const registerMutation = (trpc as any).auth.register.useMutation({
    onSuccess: () => {
      setCurrentStep(5)
    },
    onError: (error: { message: string }) => {
      setError(error.message)
    }
  })

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setError('')
  }

  const handleRoleSelect = (role: 'CAREGIVER' | 'CLIENT' | 'FAMILY') => {
    setFormData(prev => ({ ...prev, role }))
    setError('')
  }

  const validateStep = (step: number): boolean => {
    if (step === 1) {
      if (!formData.role) {
        setError('Please select your role')
        return false
      }
      return true
    }
    
    if (step === 2) {
      if (!formData.firstName || !formData.lastName || !formData.phone) {
        setError('Please fill in all required fields')
        return false
      }
      if (formData.role === 'CAREGIVER' && !formData.experience) {
        setError('Please describe your caregiving experience')
        return false
      }
      return true
    }
    
    if (step === 3) {
      if (!formData.email || !formData.password || !formData.confirmPassword) {
        setError('Please fill in all account fields')
        return false
      }
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match')
        return false
      }
      if (formData.password.length < 8) {
        setError('Password must be at least 8 characters long')
        return false
      }
      return true
    }
    
    if (step === 4) {
      if (!formData.agreeToTerms || !formData.agreeToPrivacy) {
        setError('Please accept the required agreements')
        return false
      }
      if (formData.role === 'CAREGIVER' && !formData.agreeToBackground) {
        setError('Caregivers must consent to background check')
        return false
      }
      return true
    }
    
    return true
  }

  const handleNext = () => {
    setError('')
    
    if (!validateStep(currentStep)) {
      return
    }

    if (currentStep === 4) {
      registerMutation.mutate({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        role: formData.role as 'CAREGIVER' | 'CLIENT' | 'FAMILY'
      })
      return
    }

    setCurrentStep(prev => Math.min(prev + 1, totalSteps))
  }

  const handleBack = () => {
    setError('')
    setCurrentStep(prev => Math.max(prev - 1, 1))
  }

  const canProceed = (): boolean => {
    if (currentStep === 1) return !!formData.role
    if (currentStep === 2) return !!(formData.firstName && formData.lastName && formData.phone)
    if (currentStep === 3) return !!(formData.email && formData.password && formData.confirmPassword && 
             formData.password === formData.confirmPassword && formData.password.length >= 8)
    if (currentStep === 4) return formData.agreeToTerms && formData.agreeToPrivacy && 
           (formData.role !== 'CAREGIVER' || formData.agreeToBackground)
    return true
  }

  const renderStep = () => {
    if (currentStep === 1) {
      return <Step1ChooseRole selectedRole={formData.role} onRoleSelect={handleRoleSelect} />
    }
    
    if (currentStep === 2) {
      if (formData.role === 'CAREGIVER') {
        return (
          <Step2CaregiverForm
            formData={{
              firstName: formData.firstName,
              lastName: formData.lastName,
              dateOfBirth: formData.dateOfBirth,
              phone: formData.phone,
              address: formData.address,
              city: formData.city,
              state: formData.state,
              zipCode: formData.zipCode,
              hasTransportation: formData.hasTransportation,
              hasCertification: formData.hasCertification,
              certificationDetails: formData.certificationDetails,
              experience: formData.experience,
              availability: formData.availability
            }}
            onChange={handleInputChange}
          />
        )
      }
      if (formData.role === 'CLIENT') {
        return (
          <Step2ClientForm
            formData={{
              firstName: formData.firstName,
              lastName: formData.lastName,
              dateOfBirth: formData.dateOfBirth,
              phone: formData.phone,
              address: formData.address,
              city: formData.city,
              state: formData.state,
              zipCode: formData.zipCode,
              careType: formData.careType,
              hoursPerWeek: formData.hoursPerWeek,
              preferredGender: formData.preferredGender,
              mobilityLimitations: formData.mobilityLimitations,
              householdInfo: formData.householdInfo
            }}
            onChange={handleInputChange}
          />
        )
      }
      if (formData.role === 'FAMILY') {
        return (
          <Step2FamilyForm
            formData={{
              firstName: formData.firstName,
              lastName: formData.lastName,
              phone: formData.phone,
              relationship: formData.relationship,
              patientFirstName: formData.patientFirstName,
              patientLastName: formData.patientLastName,
              patientDateOfBirth: formData.patientDateOfBirth,
              address: formData.address,
              city: formData.city,
              state: formData.state,
              zipCode: formData.zipCode,
              careReason: formData.careReason,
              emergencyContact: formData.emergencyContact
            }}
            onChange={handleInputChange}
          />
        )
      }
      return null
    }
    
    if (currentStep === 3) {
      return (
        <Step3Account
          formData={{
            email: formData.email,
            phone: formData.phone,
            password: formData.password,
            confirmPassword: formData.confirmPassword
          }}
          onChange={handleInputChange}
        />
      )
    }
    
    if (currentStep === 4) {
      return (
        <Step4Agreements
          formData={{
            agreeToTerms: formData.agreeToTerms,
            agreeToPrivacy: formData.agreeToPrivacy,
            agreeToBackground: formData.agreeToBackground
          }}
          onChange={handleInputChange}
          role={formData.role}
        />
      )
    }
    
    if (currentStep === 5) {
      return <Step5Success />
    }
    
    return null
  }

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }}></div>
      </div>

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-[120px]"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-slate-500/5 rounded-full blur-[100px]"></div>
      </div>

      <div className="relative min-h-screen w-full py-12">
        <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {currentStep < 5 && (
            <div className="mb-8 animate-fade-in">
              <BackToHomeButton />
            </div>
          )}

          {currentStep < 5 && (
            <ProgressBar currentStep={currentStep} totalSteps={totalSteps} />
          )}

          {error && currentStep < 5 && (
            <div className="max-w-3xl mx-auto mb-6 animate-fade-in">
              <Alert variant="destructive" className="border-red-200 bg-red-50">
                <AlertDescription className="text-red-800">{error}</AlertDescription>
              </Alert>
            </div>
          )}

          <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden animate-fade-in">
            <div className="p-8 sm:p-12">
              {renderStep()}
              
              {currentStep < 5 && (
                <div className="mt-8">
                  <WizardButtons
                    currentStep={currentStep}
                    onBack={handleBack}
                    onNext={handleNext}
                    isLoading={registerMutation.isPending}
                    canProceed={canProceed()}
                    nextLabel={currentStep === 4 ? 'Submit Registration' : 'Continue'}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
