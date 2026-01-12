'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { SectionCard } from '../components/SectionCard'
import { Lock, Mail, Phone, EyeIcon, EyeOffIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface AccountData {
  email: string
  phone: string
  password: string
  confirmPassword: string
}

interface Step3AccountProps {
  formData: AccountData
  onChange: (field: string, value: string) => void
}

export function Step3Account({ formData, onChange }: Step3AccountProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const passwordsMatch = formData.password === formData.confirmPassword && formData.confirmPassword.length > 0
  const passwordLongEnough = formData.password.length >= 8

  return (
    <div className="w-full max-w-3xl mx-auto space-y-8 animate-fade-in">
      {/* Page Header */}
      <div className="text-center mb-8">
        <h2 className="text-4xl font-serif font-bold text-slate-900 mb-3">
          Create Your Account
        </h2>
        <p className="text-lg text-slate-600">
          Set up your login credentials
        </p>
      </div>

      {/* Contact Information */}
      <SectionCard
        title="Contact & Login"
        icon={<Mail className="h-5 w-5 text-amber-400" />}
      >
        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <Label htmlFor="email" className="text-sm font-medium text-slate-700 mb-2 block">
              Email Address *
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => onChange('email', e.target.value)}
                className="h-12 pl-11 border-2 border-slate-300 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 rounded-lg shadow-sm hover:border-slate-400 transition-all bg-white"
                placeholder="your.email@example.com"
                required
              />
            </div>
            <p className="text-xs text-slate-500 mt-1.5">We'll use this for account login</p>
          </div>
          <div>
            <Label htmlFor="phoneAccount" className="text-sm font-medium text-slate-700 mb-2 block">
              Phone Number *
            </Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <Input
                id="phoneAccount"
                type="tel"
                value={formData.phone}
                onChange={(e) => onChange('phone', e.target.value)}
                className="h-12 pl-11 border-2 border-slate-300 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 rounded-lg shadow-sm hover:border-slate-400 transition-all bg-white"
                placeholder="(555) 123-4567"
                required
              />
            </div>
            <p className="text-xs text-slate-500 mt-1.5">For account verification</p>
          </div>
        </div>
      </SectionCard>

      {/* Password Setup */}
      <SectionCard
        title="Password Security"
        icon={<Lock className="h-5 w-5 text-amber-400" />}
      >
        <div className="space-y-5">
          <div>
            <Label htmlFor="password" className="text-sm font-medium text-slate-700 mb-2 block">
              Password *
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => onChange('password', e.target.value)}
                className="h-12 pl-11 pr-12 border-2 border-slate-300 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 rounded-lg shadow-sm hover:border-slate-400 transition-all bg-white"
                placeholder="Create a strong password"
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-12 px-3 hover:bg-slate-100 rounded-r-lg transition-colors"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOffIcon className="h-4 w-4 text-slate-600" />
                ) : (
                  <EyeIcon className="h-4 w-4 text-slate-600" />
                )}
              </Button>
            </div>
            <div className="mt-2 space-y-1">
              <div className={`flex items-center gap-2 text-xs ${passwordLongEnough ? 'text-green-600' : 'text-slate-500'}`}>
                <div className={`w-1.5 h-1.5 rounded-full ${passwordLongEnough ? 'bg-green-600' : 'bg-slate-300'}`} />
                At least 8 characters
              </div>
            </div>
          </div>

          <div>
            <Label htmlFor="confirmPassword" className="text-sm font-medium text-slate-700 mb-2 block">
              Confirm Password *
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={(e) => onChange('confirmPassword', e.target.value)}
                className={`h-12 pl-11 pr-12 border-2 rounded-lg shadow-sm transition-all bg-white ${
                  formData.confirmPassword.length > 0
                    ? passwordsMatch
                      ? 'border-green-500 focus:border-green-500 focus:ring-4 focus:ring-green-500/10'
                      : 'border-red-500 focus:border-red-500 focus:ring-4 focus:ring-red-500/10'
                    : 'border-slate-300 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 hover:border-slate-400'
                }`}
                placeholder="Re-enter your password"
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-12 px-3 hover:bg-slate-100 rounded-r-lg transition-colors"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <EyeOffIcon className="h-4 w-4 text-slate-600" />
                ) : (
                  <EyeIcon className="h-4 w-4 text-slate-600" />
                )}
              </Button>
            </div>
            {formData.confirmPassword.length > 0 && (
              <div className={`mt-2 flex items-center gap-2 text-xs ${passwordsMatch ? 'text-green-600' : 'text-red-600'}`}>
                <div className={`w-1.5 h-1.5 rounded-full ${passwordsMatch ? 'bg-green-600' : 'bg-red-600'}`} />
                {passwordsMatch ? 'Passwords match' : 'Passwords do not match'}
              </div>
            )}
          </div>
        </div>
      </SectionCard>

      {/* HIPAA Notice */}
      <div className="p-6 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center flex-shrink-0">
            <Lock className="h-5 w-5 text-white" />
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-slate-900 mb-1">HIPAA Privacy & Security</h4>
            <p className="text-sm text-slate-700 leading-relaxed">
              Your account is protected with industry-standard encryption. All personal health information is handled in compliance with HIPAA regulations.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
