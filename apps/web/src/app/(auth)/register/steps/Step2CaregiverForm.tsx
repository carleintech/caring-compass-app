'use client'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { SectionCard } from '../components/SectionCard'
import { Heart, MapPin, Car, Award } from 'lucide-react'

interface CaregiverFormData {
  firstName: string
  lastName: string
  dateOfBirth: string
  phone: string
  address: string
  city: string
  state: string
  zipCode: string
  hasTransportation: boolean
  hasCertification: boolean
  certificationDetails: string
  experience: string
  availability: string
}

interface Step2CaregiverFormProps {
  formData: CaregiverFormData
  onChange: (field: string, value: string | boolean) => void
}

export function Step2CaregiverForm({ formData, onChange }: Step2CaregiverFormProps) {
  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 animate-fade-in">
      {/* Page Header */}
      <div className="text-center mb-8">
        <h2 className="text-4xl font-serif font-bold text-slate-900 mb-3">
          Caregiver Information
        </h2>
        <p className="text-lg text-slate-600">
          Tell us about yourself and your caregiving experience
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

      {/* Transportation & Certification */}
      <SectionCard
        title="Qualifications"
        icon={<Award className="h-5 w-5 text-amber-400" />}
      >
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="flex items-center space-x-3 p-4 rounded-lg border-2 border-slate-300 hover:border-amber-400 hover:bg-amber-50/50 transition-all cursor-pointer shadow-sm">
            <Checkbox
              id="hasTransportation"
              checked={formData.hasTransportation}
              onCheckedChange={(checked) => onChange('hasTransportation', !!checked)}
              className="h-5 w-5 border-slate-400"
            />
            <Label htmlFor="hasTransportation" className="text-sm font-medium cursor-pointer text-slate-700 flex items-center gap-2">
              <Car className="h-4 w-4" />
              Reliable transportation
            </Label>
          </div>

          <div className="flex items-center space-x-3 p-4 rounded-lg border-2 border-slate-300 hover:border-amber-400 hover:bg-amber-50/50 transition-all cursor-pointer shadow-sm">
            <Checkbox
              id="hasCertification"
              checked={formData.hasCertification}
              onCheckedChange={(checked) => onChange('hasCertification', !!checked)}
              className="h-5 w-5 border-slate-400"
            />
            <Label htmlFor="hasCertification" className="text-sm font-medium cursor-pointer text-slate-700">
              CNA/PCA/HHA certified
            </Label>
          </div>
        </div>

        {formData.hasCertification && (
          <div className="animate-fade-in">
            <Label htmlFor="certificationDetails" className="text-sm font-medium text-slate-700 mb-2 block">
              Certification Details
            </Label>
            <Textarea
              id="certificationDetails"
              placeholder="Certification type, issuing organization, expiration date..."
              value={formData.certificationDetails}
              onChange={(e) => onChange('certificationDetails', e.target.value)}
              className="min-h-[90px] resize-y border-2 border-slate-300 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 rounded-lg shadow-sm hover:border-slate-400 transition-all bg-white"
            />
          </div>
        )}

        <div>
          <Label htmlFor="experience" className="text-sm font-medium text-slate-700 mb-2 block">
            Caregiving Experience *
          </Label>
          <Textarea
            id="experience"
            placeholder="Describe your caregiving experience, years of service, types of care provided..."
            value={formData.experience}
            onChange={(e) => onChange('experience', e.target.value)}
            className="min-h-[100px] resize-y border-2 border-slate-300 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 rounded-lg shadow-sm hover:border-slate-400 transition-all bg-white"
            required
          />
        </div>

        <div>
          <Label htmlFor="availability" className="text-sm font-medium text-slate-700 mb-2 block">
            Availability *
          </Label>
          <Textarea
            id="availability"
            placeholder="Days of week, preferred hours, shift preferences..."
            value={formData.availability}
            onChange={(e) => onChange('availability', e.target.value)}
            className="min-h-[100px] resize-y border-2 border-slate-300 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 rounded-lg shadow-sm hover:border-slate-400 transition-all bg-white"
            required
          />
        </div>
      </SectionCard>
    </div>
  )
}
