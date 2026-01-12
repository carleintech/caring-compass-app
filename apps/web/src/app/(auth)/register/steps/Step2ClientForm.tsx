'use client'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { SectionCard } from '../components/SectionCard'
import { Heart, MapPin, ClipboardList } from 'lucide-react'

interface ClientFormData {
  firstName: string
  lastName: string
  dateOfBirth: string
  phone: string
  address: string
  city: string
  state: string
  zipCode: string
  careType: string
  hoursPerWeek: string
  preferredGender: string
  mobilityLimitations: string
  householdInfo: string
}

interface Step2ClientFormProps {
  formData: ClientFormData
  onChange: (field: string, value: string) => void
}

export function Step2ClientForm({ formData, onChange }: Step2ClientFormProps) {
  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 animate-fade-in">
      {/* Page Header */}
      <div className="text-center mb-8">
        <h2 className="text-4xl font-serif font-bold text-slate-900 mb-3">
          Client Information
        </h2>
        <p className="text-lg text-slate-600">
          Help us understand your care needs
        </p>
      </div>

      {/* Personal Information */}
      <SectionCard
        title="Personal Information"
        icon={<Heart className="h-5 w-5 text-amber-400" />}
      >
        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <Label htmlFor="firstName" className="text-sm font-medium text-slate-700 mb-2 block">
              First Name *
            </Label>
            <Input
              id="firstName"
              value={formData.firstName}
              onChange={(e) => onChange('firstName', e.target.value)}
              className="h-12 border-2 border-slate-300 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 rounded-lg shadow-sm hover:border-slate-400 transition-all bg-white"
              required
            />
          </div>
          <div>
            <Label htmlFor="lastName" className="text-sm font-medium text-slate-700 mb-2 block">
              Last Name *
            </Label>
            <Input
              id="lastName"
              value={formData.lastName}
              onChange={(e) => onChange('lastName', e.target.value)}
              className="h-12 border-2 border-slate-300 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 rounded-lg shadow-sm hover:border-slate-400 transition-all bg-white"
              required
            />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <Label htmlFor="dateOfBirth" className="text-sm font-medium text-slate-700 mb-2 block">
              Date of Birth *
            </Label>
            <Input
              id="dateOfBirth"
              type="date"
              value={formData.dateOfBirth}
              onChange={(e) => onChange('dateOfBirth', e.target.value)}
              className="h-12 border-2 border-slate-300 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 rounded-lg shadow-sm hover:border-slate-400 transition-all bg-white"
              required
            />
          </div>
          <div>
            <Label htmlFor="phone" className="text-sm font-medium text-slate-700 mb-2 block">
              Phone Number *
            </Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => onChange('phone', e.target.value)}
              className="h-12 border-2 border-slate-300 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 rounded-lg shadow-sm hover:border-slate-400 transition-all bg-white"
              required
            />
          </div>
        </div>
      </SectionCard>

      {/* Location */}
      <SectionCard
        title="Location"
        icon={<MapPin className="h-5 w-5 text-amber-400" />}
      >
        <div>
          <Label htmlFor="address" className="text-sm font-medium text-slate-700 mb-2 block">
            Street Address *
          </Label>
          <Input
            id="address"
            value={formData.address}
            onChange={(e) => onChange('address', e.target.value)}
            className="h-12 border-2 border-slate-300 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 rounded-lg shadow-sm hover:border-slate-400 transition-all bg-white"
            required
          />
        </div>

        <div className="grid grid-cols-6 gap-5">
          <div className="col-span-3">
            <Label htmlFor="city" className="text-sm font-medium text-slate-700 mb-2 block">
              City *
            </Label>
            <Input
              id="city"
              value={formData.city}
              onChange={(e) => onChange('city', e.target.value)}
              className="h-12 border-2 border-slate-300 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 rounded-lg shadow-sm hover:border-slate-400 transition-all bg-white"
              required
            />
          </div>
          <div className="col-span-1">
            <Label htmlFor="state" className="text-sm font-medium text-slate-700 mb-2 block">
              State *
            </Label>
            <Select value={formData.state} onValueChange={(v) => onChange('state', v)}>
              <SelectTrigger className="h-12 border-2 border-slate-300 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 rounded-lg shadow-sm hover:border-amber-400 transition-all bg-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="border-slate-200 shadow-xl">
                <SelectItem value="VA">VA</SelectItem>
                <SelectItem value="NC">NC</SelectItem>
                <SelectItem value="MD">MD</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="col-span-2">
            <Label htmlFor="zipCode" className="text-sm font-medium text-slate-700 mb-2 block">
              ZIP Code *
            </Label>
            <Input
              id="zipCode"
              value={formData.zipCode}
              onChange={(e) => onChange('zipCode', e.target.value)}
              className="h-12 border-2 border-slate-300 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 rounded-lg shadow-sm hover:border-slate-400 transition-all bg-white"
              required
            />
          </div>
        </div>
      </SectionCard>

      {/* Care Needs */}
      <SectionCard
        title="Care Requirements"
        description="Tell us about your care needs"
        icon={<ClipboardList className="h-5 w-5 text-amber-400" />}
      >
        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <Label htmlFor="careType" className="text-sm font-medium text-slate-700 mb-2 block">
              Type of Care Needed *
            </Label>
            <Select value={formData.careType} onValueChange={(v) => onChange('careType', v)}>
              <SelectTrigger className="h-12 border-2 border-slate-300 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 rounded-lg shadow-sm hover:border-amber-400 transition-all bg-white">
                <SelectValue placeholder="Select care type" />
              </SelectTrigger>
              <SelectContent className="border-slate-200 shadow-xl">
                <SelectItem value="personal">Personal Care</SelectItem>
                <SelectItem value="companion">Companion Care</SelectItem>
                <SelectItem value="medical">Medical Care</SelectItem>
                <SelectItem value="specialized">Specialized Care</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="hoursPerWeek" className="text-sm font-medium text-slate-700 mb-2 block">
              Hours Per Week *
            </Label>
            <Select value={formData.hoursPerWeek} onValueChange={(v) => onChange('hoursPerWeek', v)}>
              <SelectTrigger className="h-12 border-2 border-slate-300 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 rounded-lg shadow-sm hover:border-amber-400 transition-all bg-white">
                <SelectValue placeholder="Select hours" />
              </SelectTrigger>
              <SelectContent className="border-slate-200 shadow-xl">
                <SelectItem value="1-10">1-10 hours</SelectItem>
                <SelectItem value="11-20">11-20 hours</SelectItem>
                <SelectItem value="21-30">21-30 hours</SelectItem>
                <SelectItem value="31-40">31-40 hours</SelectItem>
                <SelectItem value="40+">40+ hours (Full-time)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label htmlFor="preferredGender" className="text-sm font-medium text-slate-700 mb-2 block">
            Preferred Caregiver Gender (Optional)
          </Label>
          <Select value={formData.preferredGender} onValueChange={(v) => onChange('preferredGender', v)}>
            <SelectTrigger className="h-12 border-2 border-slate-300 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 rounded-lg shadow-sm hover:border-amber-400 transition-all bg-white">
              <SelectValue placeholder="No preference" />
            </SelectTrigger>
            <SelectContent className="border-slate-200 shadow-xl">
              <SelectItem value="no-preference">No Preference</SelectItem>
              <SelectItem value="female">Female</SelectItem>
              <SelectItem value="male">Male</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="mobilityLimitations" className="text-sm font-medium text-slate-700 mb-2 block">
            Mobility Limitations or Special Needs
          </Label>
          <Textarea
            id="mobilityLimitations"
            placeholder="Describe any mobility limitations, medical conditions, or special requirements..."
            value={formData.mobilityLimitations}
            onChange={(e) => onChange('mobilityLimitations', e.target.value)}
            className="min-h-[100px] resize-y border-2 border-slate-300 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 rounded-lg shadow-sm hover:border-slate-400 transition-all bg-white"
          />
        </div>

        <div>
          <Label htmlFor="householdInfo" className="text-sm font-medium text-slate-700 mb-2 block">
            Household Information
          </Label>
          <Textarea
            id="householdInfo"
            placeholder="Number of people in household, pets, accessibility features..."
            value={formData.householdInfo}
            onChange={(e) => onChange('householdInfo', e.target.value)}
            className="min-h-[100px] resize-y border-2 border-slate-300 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 rounded-lg shadow-sm hover:border-slate-400 transition-all bg-white"
          />
        </div>
      </SectionCard>
    </div>
  )
}
