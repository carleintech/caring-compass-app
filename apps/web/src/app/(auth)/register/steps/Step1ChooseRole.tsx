'use client'

import { RoleCard } from '../components/RoleCard'

interface Step1ChooseRoleProps {
  selectedRole: string
  onRoleSelect: (role: 'CAREGIVER' | 'CLIENT' | 'FAMILY') => void
}

export function Step1ChooseRole({ selectedRole, onRoleSelect }: Step1ChooseRoleProps) {
  return (
    <div className="w-full max-w-5xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-5xl font-serif font-bold text-slate-900 mb-4">
          Welcome to Caring Compass
        </h1>
        <p className="text-xl text-slate-600 font-light">
          Let's get started by selecting your role
        </p>
      </div>

      {/* Role Selection Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        <RoleCard
          icon="🩺"
          title="Caregiver"
          description="I want to provide professional home care services to clients in need"
          value="CAREGIVER"
          selected={selectedRole === 'CAREGIVER'}
          onClick={() => onRoleSelect('CAREGIVER')}
        />

        <RoleCard
          icon="👤"
          title="Client"
          description="I need home care services for myself or want to explore available options"
          value="CLIENT"
          selected={selectedRole === 'CLIENT'}
          onClick={() => onRoleSelect('CLIENT')}
        />

        <RoleCard
          icon="👨‍👩‍👧"
          title="Family Member"
          description="I'm arranging home care services for a loved one or family member"
          value="FAMILY"
          selected={selectedRole === 'FAMILY'}
          onClick={() => onRoleSelect('FAMILY')}
        />
      </div>

      {/* Helper Text */}
      {selectedRole && (
        <div className="mt-8 text-center animate-fade-in">
          <p className="text-sm text-slate-600">
            Click <span className="font-semibold text-amber-600">"Continue"</span> below to proceed with your {selectedRole.toLowerCase()} registration
          </p>
        </div>
      )}
    </div>
  )
}
