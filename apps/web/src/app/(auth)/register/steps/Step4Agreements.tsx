'use client'

import Link from 'next/link'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { SectionCard } from '../components/SectionCard'
import { FileText, Shield, CheckCircle2 } from 'lucide-react'

interface AgreementsData {
  agreeToTerms: boolean
  agreeToPrivacy: boolean
  agreeToBackground: boolean
}

interface Step4AgreementsProps {
  formData: AgreementsData
  onChange: (field: string, value: boolean) => void
  role: string
}

export function Step4Agreements({ formData, onChange, role }: Step4AgreementsProps) {
  const allAgreed = formData.agreeToTerms && formData.agreeToPrivacy && (role !== 'CAREGIVER' || formData.agreeToBackground)

  return (
    <div className="w-full max-w-3xl mx-auto space-y-8 animate-fade-in">
      {/* Page Header */}
      <div className="text-center mb-8">
        <h2 className="text-4xl font-serif font-bold text-slate-900 mb-3">
          Review & Accept
        </h2>
        <p className="text-lg text-slate-600">
          Please review and accept our policies to continue
        </p>
      </div>

      {/* Agreements Section */}
      <SectionCard
        title="Legal Agreements"
        description="Required to create your account"
        icon={<FileText className="h-5 w-5 text-amber-400" />}
      >
        <div className="space-y-5">
          {/* Terms of Service */}
          <div className="p-5 rounded-xl border-2 border-slate-200 hover:border-amber-400 transition-all bg-white">
            <div className="flex items-start space-x-4">
              <Checkbox
                id="agreeToTerms"
                checked={formData.agreeToTerms}
                onCheckedChange={(checked) => onChange('agreeToTerms', !!checked)}
                className="h-6 w-6 mt-1 border-slate-400"
              />
              <div className="flex-1">
                <Label htmlFor="agreeToTerms" className="text-base font-medium cursor-pointer text-slate-900 leading-relaxed block mb-2">
                  I agree to the Terms of Service *
                </Label>
                <p className="text-sm text-slate-600 leading-relaxed">
                  By checking this box, you agree to our{' '}
                  <Link href="/terms" className="text-amber-600 hover:text-amber-700 hover:underline font-semibold">
                    Terms of Service
                  </Link>
                  , including user responsibilities, acceptable use policies, and service limitations.
                </p>
              </div>
            </div>
          </div>

          {/* Privacy Policy */}
          <div className="p-5 rounded-xl border-2 border-slate-200 hover:border-amber-400 transition-all bg-white">
            <div className="flex items-start space-x-4">
              <Checkbox
                id="agreeToPrivacy"
                checked={formData.agreeToPrivacy}
                onCheckedChange={(checked) => onChange('agreeToPrivacy', !!checked)}
                className="h-6 w-6 mt-1 border-slate-400"
              />
              <div className="flex-1">
                <Label htmlFor="agreeToPrivacy" className="text-base font-medium cursor-pointer text-slate-900 leading-relaxed block mb-2">
                  I agree to the Privacy Policy & HIPAA Notice *
                </Label>
                <p className="text-sm text-slate-600 leading-relaxed">
                  You acknowledge our{' '}
                  <Link href="/privacy" className="text-amber-600 hover:text-amber-700 hover:underline font-semibold">
                    Privacy Policy
                  </Link>
                  {' '}and understand how we collect, use, and protect your personal health information under HIPAA regulations.
                </p>
              </div>
            </div>
          </div>

          {/* Background Check (Caregivers Only) */}
          {role === 'CAREGIVER' && (
            <div className="p-5 rounded-xl border-2 border-slate-200 hover:border-amber-400 transition-all bg-white">
              <div className="flex items-start space-x-4">
                <Checkbox
                  id="agreeToBackground"
                  checked={formData.agreeToBackground}
                  onCheckedChange={(checked) => onChange('agreeToBackground', !!checked)}
                  className="h-6 w-6 mt-1 border-slate-400"
                />
                <div className="flex-1">
                  <Label htmlFor="agreeToBackground" className="text-base font-medium cursor-pointer text-slate-900 leading-relaxed block mb-2">
                    I consent to a background check *
                  </Label>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    As a caregiver, you consent to comprehensive background verification including criminal history, employment verification, and reference checks. Employment is contingent upon satisfactory results.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </SectionCard>

      {/* Security Badge */}
      <div className="p-6 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-green-600 flex items-center justify-center flex-shrink-0">
            <Shield className="h-6 w-6 text-white" />
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
              Your Data is Protected
              <CheckCircle2 className="h-5 w-5 text-green-600" />
            </h4>
            <p className="text-sm text-slate-700 leading-relaxed">
              Caring Compass uses bank-level encryption to protect your personal information. All data is stored securely and handled in strict compliance with HIPAA and healthcare privacy regulations.
            </p>
          </div>
        </div>
      </div>

      {/* Status Message */}
      {allAgreed && (
        <div className="text-center p-4 rounded-lg bg-green-50 border border-green-200 animate-fade-in">
          <p className="text-sm font-medium text-green-800">
            ✓ All required agreements accepted. Click "Continue" to submit your registration.
          </p>
        </div>
      )}
    </div>
  )
}
