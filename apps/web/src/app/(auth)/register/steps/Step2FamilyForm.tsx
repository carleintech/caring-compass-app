'use client'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { SectionCard } from '../components/SectionCard'
import { Heart, User, MapPin, FileText } from 'lucide-react'

interface FamilyFormData {
  // Family member info
  firstName: string
  lastName: string
  phone: string
  relationship: string
  
  // Patient info
  patientFirstName: string
  patientLastName: string
  patientDateOfBirth: string
  
  // Location
  address: string
  city: string
  state: string
  zipCode: string
  
  // Care details
  careReason: string
  emergencyContact: string
}

interface Step2FamilyFormProps {
  formData: FamilyFormData
  onChange: (field: string, value: string) => void
}

export function Step2FamilyForm({ formData, onChange }: Step2FamilyFormProps) {
  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 animate-fade-in">
      {/* Page Header */}
      <div className="text-center mb-8">
        <h2 className="text-4xl font-serif font-bold text-slate-900 mb-3">
          Family Member Information
        </h2>
        <p className="text-lg text-slate-600">
          Help us arrange care for your loved one
        </p>
      </div>

      {/* Your Information */}
      <SectionCard
        title="Your Information"
        description="Tell us about yourself as the care coordinator"
        icon={<Heart className="h-5 w-5 text-amber-400" />}
      >
        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <Label htmlFor="firstName" className="text-sm font-medium text-slate-700 mb-2 block">
              Your First Name *
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
              Your Last Name *
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
            <Label htmlFor="phone" className="text-sm font-medium text-slate-700 mb-2 block">
              Your Phone Number *
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
          <div>
            <Label htmlFor="relationship" className="text-sm font-medium text-slate-700 mb-2 block">
              Relationship to Patient *
            </Label>
            <Select value={formData.relationship} onValueChange={(v) => onChange('relationship', v)}>
              <SelectTrigger className="h-12 border-2 border-slate-300 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 rounded-lg shadow-sm hover:border-amber-400 transition-all bg-white">
                <SelectValue placeholder="Select relationship" />
              </SelectTrigger>
              <SelectContent className="border-slate-200 shadow-xl">
                <SelectItem value="spouse">Spouse</SelectItem>
                <SelectItem value="child">Child</SelectItem>
                <SelectItem value="parent">Parent</SelectItem>
                <SelectItem value="sibling">Sibling</SelectItem>
                <SelectItem value="relative">Other Relative</SelectItem>
                <SelectItem value="friend">Friend</SelectItem>
                <SelectItem value="guardian">Legal Guardian</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </SectionCard>

      {/* Patient Information */}
      <SectionCard
        title="Patient Information"
        description="Details about the person receiving care"
        icon={<User className="h-5 w-5 text-amber-400" />}
      >
        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <Label htmlFor="patientFirstName" className="text-sm font-medium text-slate-700 mb-2 block">
              Patient's First Name *
            </Label>
            <Input
              id="patientFirstName"
              value={formData.patientFirstName}
              onChange={(e) => onChange('patientFirstName', e.target.value)}
              className="h-12 border-2 border-slate-300 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 rounded-lg shadow-sm hover:border-slate-400 transition-all bg-white"
              required
            />
          </div>
          <div>
            <Label htmlFor="patientLastName" className="text-sm font-medium text-slate-700 mb-2 block">
              Patient's Last Name *
            </Label>
            <Input
              id="patientLastName"
              value={formData.patientLastName}
              onChange={(e) => onChange('patientLastName', e.target.value)}
              className="h-12 border-2 border-slate-300 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 rounded-lg shadow-sm hover:border-slate-400 transition-all bg-white"
              required
            />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <Label htmlFor="patientDateOfBirth" className="text-sm font-medium text-slate-700 mb-2 block">
              Patient's Date of Birth *
            </Label>
            <Input
              id="patientDateOfBirth"
              type="date"
              value={formData.patientDateOfBirth}
              onChange={(e) => onChange('patientDateOfBirth', e.target.value)}
              className="h-12 border-2 border-slate-300 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 rounded-lg shadow-sm hover:border-slate-400 transition-all bg-white"
              required
            />
          </div>
        </div>
      </SectionCard>

      {/* Location */}
      <SectionCard
        title="Care Location"
        description="Where care will be provided"
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

      {/* Care Details */}
      <SectionCard
        title="Care Details"
        icon={<FileText className="h-5 w-5 text-amber-400" />}
      >
        <div>
          <Label htmlFor="careReason" className="text-sm font-medium text-slate-700 mb-2 block">
            Why is Care Needed? *
          </Label>
          <Textarea
            id="careReason"
            placeholder="Describe the patient's condition, care requirements, medical needs, daily assistance needed..."
            value={formData.careReason}
            onChange={(e) => onChange('careReason', e.target.value)}
            className="min-h-[120px] resize-y border-2 border-slate-300 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 rounded-lg shadow-sm hover:border-slate-400 transition-all bg-white"
            required
          />
        </div>

        <div>
          <Label htmlFor="emergencyContact" className="text-sm font-medium text-slate-700 mb-2 block">
            Emergency Contact Information *
          </Label>
          <Textarea
            id="emergencyContact"
            placeholder="Name, relationship, phone number of emergency contact..."
            value={formData.emergencyContact}
            onChange={(e) => onChange('emergencyContact', e.target.value)}
            className="min-h-[100px] resize-y border-2 border-slate-300 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 rounded-lg shadow-sm hover:border-slate-400 transition-all bg-white"
            required
          />
        </div>
      </SectionCard>
    </div>
  )
}
