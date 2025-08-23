'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { 
  UserIcon,
  EditIcon,
  SaveIcon,
  CameraIcon,
  PhoneIcon,
  MailIcon,
  MapPinIcon,
  CalendarIcon,
  HeartIcon,
  AlertCircleIcon,
  CheckCircleIcon,
  KeyIcon,
  ShieldIcon,
  BellIcon,
  EyeIcon,
  EyeOffIcon,
  InfoIcon
} from 'lucide-react'

// Mock data - in real app, this would come from API
const mockProfile = {
  personal: {
    firstName: 'Robert',
    lastName: 'Johnson',
    dateOfBirth: '1943-05-15',
    gender: 'male',
    email: 'robert.johnson@email.com',
    phone: '(757) 555-0123',
    avatar: null,
    preferredName: 'Bob',
    maritalStatus: 'widowed'
  },
  address: {
    street: '123 Oak Street',
    unit: 'Apt 2B',
    city: 'Virginia Beach',
    state: 'VA',
    zipCode: '23451',
    country: 'United States'
  },
  emergency: {
    primaryContact: {
      name: 'Emily Johnson',
      relationship: 'Daughter',
      phone: '(757) 555-0167',
      email: 'emily.johnson@email.com'
    },
    secondaryContact: {
      name: 'Michael Johnson',
      relationship: 'Son',
      phone: '(757) 555-0198',
      email: 'michael.johnson@email.com'
    },
    medicalInfo: {
      allergies: 'Penicillin, Shellfish',
      medications: 'Lisinopril 10mg daily, Metformin 500mg twice daily',
      conditions: ['Diabetes Type 2', 'Hypertension', 'Arthritis'],
      physician: 'Dr. Sarah Smith - Virginia Beach Medical Center',
      insurance: 'Medicare + Supplemental Plan G'
    }
  },
  preferences: {
    communication: ['email', 'phone'],
    language: 'English',
    timezone: 'America/New_York',
    carePreferences: {
      genderPreference: 'female',
      languagePreference: 'English',
      personalityTraits: ['patient', 'cheerful', 'organized'],
      specialRequests: 'Please knock loudly as I am hard of hearing'
    }
  },
  account: {
    memberSince: '2024-01-15',
    accountStatus: 'active',
    lastLogin: '2024-01-19T14:30:00Z',
    securityLevel: 'standard',
    twoFactorEnabled: false
  }
}

const ProfileHeader = ({ profile, onAvatarChange }: any) => {
  const age = new Date().getFullYear() - new Date(profile.personal.dateOfBirth).getFullYear()

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start space-x-6">
          <div className="relative">
            <Avatar className="h-24 w-24">
              <AvatarImage src={profile.personal.avatar || undefined} />
              <AvatarFallback className="text-2xl">
                {profile.personal.firstName[0]}{profile.personal.lastName[0]}
              </AvatarFallback>
            </Avatar>
            <Button
              size="sm"
              className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full"
              onClick={onAvatarChange}
            >
              <CameraIcon className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <h1 className="text-2xl font-bold">
                {profile.personal.firstName} {profile.personal.lastName}
              </h1>
              <Badge className="bg-green-100 text-green-800">
                <CheckCircleIcon className="h-3 w-3 mr-1" />
                {profile.account.accountStatus}
              </Badge>
            </div>
            
            <div className="space-y-1 text-sm text-gray-600">
              <div className="flex items-center">
                <CalendarIcon className="h-4 w-4 mr-2" />
                Age {age} • Born {new Date(profile.personal.dateOfBirth).toLocaleDateString()}
              </div>
              <div className="flex items-center">
                <MailIcon className="h-4 w-4 mr-2" />
                {profile.personal.email}
              </div>
              <div className="flex items-center">
                <PhoneIcon className="h-4 w-4 mr-2" />
                {profile.personal.phone}
              </div>
              <div className="flex items-center">
                <MapPinIcon className="h-4 w-4 mr-2" />
                {profile.address.city}, {profile.address.state}
              </div>
            </div>
            
            <div className="mt-4 flex items-center space-x-2 text-xs text-gray-500">
              <UserIcon className="h-3 w-3" />
              <span>Member since {new Date(profile.account.memberSince).toLocaleDateString()}</span>
              <span>•</span>
              <span>Last login {new Date(profile.account.lastLogin).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

const PersonalInfoTab = ({ profile, onSave }: any) => {
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState(profile.personal)

  const handleSave = () => {
    onSave('personal', formData)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setFormData(profile.personal)
    setIsEditing(false)
  }

  if (!isEditing) {
    return (
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Personal Information</CardTitle>
            <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
              <EditIcon className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <Label className="text-sm font-medium text-gray-500">First Name</Label>
              <p className="mt-1">{profile.personal.firstName}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-500">Last Name</Label>
              <p className="mt-1">{profile.personal.lastName}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-500">Preferred Name</Label>
              <p className="mt-1">{profile.personal.preferredName || 'Not specified'}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-500">Date of Birth</Label>
              <p className="mt-1">{new Date(profile.personal.dateOfBirth).toLocaleDateString()}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-500">Gender</Label>
              <p className="mt-1 capitalize">{profile.personal.gender}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-500">Marital Status</Label>
              <p className="mt-1 capitalize">{profile.personal.maritalStatus}</p>
            </div>
          </div>
          
          <div className="pt-4 border-t">
            <h3 className="font-medium mb-3">Contact Information</h3>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <Label className="text-sm font-medium text-gray-500">Email</Label>
                <p className="mt-1">{profile.personal.email}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-500">Phone</Label>
                <p className="mt-1">{profile.personal.phone}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Personal Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              value={formData.firstName}
              onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              value={formData.lastName}
              onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="preferredName">Preferred Name</Label>
            <Input
              id="preferredName"
              value={formData.preferredName}
              onChange={(e) => setFormData(prev => ({ ...prev, preferredName: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="dateOfBirth">Date of Birth</Label>
            <Input
              id="dateOfBirth"
              type="date"
              value={formData.dateOfBirth}
              onChange={(e) => setFormData(prev => ({ ...prev, dateOfBirth: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="gender">Gender</Label>
            <Select value={formData.gender} onValueChange={(value) => setFormData(prev => ({ ...prev, gender: value }))}>
              <SelectTrigger>
                <SelectValue />
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
            <Label htmlFor="maritalStatus">Marital Status</Label>
            <Select value={formData.maritalStatus} onValueChange={(value) => setFormData(prev => ({ ...prev, maritalStatus: value }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="single">Single</SelectItem>
                <SelectItem value="married">Married</SelectItem>
                <SelectItem value="divorced">Divorced</SelectItem>
                <SelectItem value="widowed">Widowed</SelectItem>
                <SelectItem value="separated">Separated</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="pt-4 border-t">
          <h3 className="font-medium mb-3">Contact Information</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              />
            </div>
          </div>
        </div>
        
        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            <SaveIcon className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

const AddressTab = ({ profile, onSave }: any) => {
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState(profile.address)

  const handleSave = () => {
    onSave('address', formData)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setFormData(profile.address)
    setIsEditing(false)
  }

  if (!isEditing) {
    return (
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Address Information</CardTitle>
            <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
              <EditIcon className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-start">
              <MapPinIcon className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
              <div>
                <p className="font-medium">
                  {profile.address.street}
                  {profile.address.unit && `, ${profile.address.unit}`}
                </p>
                <p className="text-gray-600">
                  {profile.address.city}, {profile.address.state} {profile.address.zipCode}
                </p>
                <p className="text-gray-600">{profile.address.country}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Address</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="street">Street Address</Label>
          <Input
            id="street"
            value={formData.street}
            onChange={(e) => setFormData(prev => ({ ...prev, street: e.target.value }))}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="unit">Unit/Apartment (Optional)</Label>
          <Input
            id="unit"
            value={formData.unit}
            onChange={(e) => setFormData(prev => ({ ...prev, unit: e.target.value }))}
          />
        </div>
        
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              value={formData.city}
              onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="state">State</Label>
            <Select value={formData.state} onValueChange={(value) => setFormData(prev => ({ ...prev, state: value }))}>
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
            <Label htmlFor="zipCode">ZIP Code</Label>
            <Input
              id="zipCode"
              value={formData.zipCode}
              onChange={(e) => setFormData(prev => ({ ...prev, zipCode: e.target.value }))}
            />
          </div>
        </div>
        
        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            <SaveIcon className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

const EmergencyContactsTab = ({ profile, onSave }: any) => {
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState(profile.emergency)

  const handleSave = () => {
    onSave('emergency', formData)
    setIsEditing(false)
  }

  if (!isEditing) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Emergency Contacts</CardTitle>
              <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                <EditIcon className="h-4 w-4 mr-2" />
                Edit
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-medium mb-3">Primary Contact</h3>
              <div className="space-y-2">
                <p className="font-medium">{profile.emergency.primaryContact.name}</p>
                <p className="text-sm text-gray-600">{profile.emergency.primaryContact.relationship}</p>
                <div className="flex items-center space-x-4 text-sm">
                  <div className="flex items-center">
                    <PhoneIcon className="h-4 w-4 mr-1" />
                    {profile.emergency.primaryContact.phone}
                  </div>
                  <div className="flex items-center">
                    <MailIcon className="h-4 w-4 mr-1" />
                    {profile.emergency.primaryContact.email}
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="font-medium mb-3">Secondary Contact</h3>
              <div className="space-y-2">
                <p className="font-medium">{profile.emergency.secondaryContact.name}</p>
                <p className="text-sm text-gray-600">{profile.emergency.secondaryContact.relationship}</p>
                <div className="flex items-center space-x-4 text-sm">
                  <div className="flex items-center">
                    <PhoneIcon className="h-4 w-4 mr-1" />
                    {profile.emergency.secondaryContact.phone}
                  </div>
                  <div className="flex items-center">
                    <MailIcon className="h-4 w-4 mr-1" />
                    {profile.emergency.secondaryContact.email}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <HeartIcon className="h-5 w-5 mr-2 text-red-500" />
              Medical Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-sm font-medium text-gray-500">Primary Physician</Label>
              <p className="mt-1">{profile.emergency.medicalInfo.physician}</p>
            </div>
            
            <div>
              <Label className="text-sm font-medium text-gray-500">Insurance</Label>
              <p className="mt-1">{profile.emergency.medicalInfo.insurance}</p>
            </div>
            
            <div>
              <Label className="text-sm font-medium text-gray-500">Medical Conditions</Label>
              <div className="mt-1 flex flex-wrap gap-1">
                {profile.emergency.medicalInfo.conditions.map((condition: string, index: number) => (
                  <Badge key={index} variant="outline">{condition}</Badge>
                ))}
              </div>
            </div>
            
            <div>
              <Label className="text-sm font-medium text-gray-500">Allergies</Label>
              <p className="mt-1 text-red-600 font-medium">{profile.emergency.medicalInfo.allergies}</p>
            </div>
            
            <div>
              <Label className="text-sm font-medium text-gray-500">Current Medications</Label>
              <p className="mt-1">{profile.emergency.medicalInfo.medications}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Editing form would go here - simplified for brevity
  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Emergency Information</CardTitle>
      </CardHeader>
      <CardContent>
        <Alert>
          <InfoIcon className="h-4 w-4" />
          <AlertDescription>
            Emergency contact and medical information editing is handled through your care coordinator for security purposes.
            Please contact your care team to make changes.
          </AlertDescription>
        </Alert>
        <div className="mt-4">
          <Button variant="outline" onClick={() => setIsEditing(false)}>
            Back to View
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

const SecurityTab = ({ profile }: any) => {
  const [showChangePassword, setShowChangePassword] = useState(false)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const handleChangePassword = () => {
    // Implement password change logic
    console.log('Change password')
    setShowChangePassword(false)
    setCurrentPassword('')
    setNewPassword('')
    setConfirmPassword('')
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <ShieldIcon className="h-5 w-5 mr-2" />
            Account Security
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <h3 className="font-medium">Password</h3>
              <p className="text-sm text-gray-600">Last updated 30 days ago</p>
            </div>
            <Button variant="outline" size="sm" onClick={() => setShowChangePassword(true)}>
              <KeyIcon className="h-4 w-4 mr-2" />
              Change Password
            </Button>
          </div>
          
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <h3 className="font-medium">Two-Factor Authentication</h3>
              <p className="text-sm text-gray-600">
                {profile.account.twoFactorEnabled ? 'Enabled' : 'Add an extra layer of security'}
              </p>
            </div>
            <Button variant={profile.account.twoFactorEnabled ? "outline" : "default"} size="sm">
              {profile.account.twoFactorEnabled ? 'Disable 2FA' : 'Enable 2FA'}
            </Button>
          </div>
          
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <h3 className="font-medium">Login History</h3>
              <p className="text-sm text-gray-600">View recent account activity</p>
            </div>
            <Button variant="outline" size="sm">
              <EyeIcon className="h-4 w-4 mr-2" />
              View History
            </Button>
          </div>
        </CardContent>
      </Card>

      {showChangePassword && (
        <Card>
          <CardHeader>
            <CardTitle>Change Password</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <Input
                id="currentPassword"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            
            <Alert>
              <AlertCircleIcon className="h-4 w-4" />
              <AlertDescription>
                Password must be at least 8 characters long and include uppercase, lowercase, numbers, and special characters.
              </AlertDescription>
            </Alert>
            
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowChangePassword(false)}>
                Cancel
              </Button>
              <Button onClick={handleChangePassword}>
                Update Password
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default function ClientProfilePage() {
  const [profile, setProfile] = useState(mockProfile)
  const [activeTab, setActiveTab] = useState('personal')

  const handleSave = (section: string, data: any) => {
    setProfile(prev => ({
      ...prev,
      [section]: data
    }))
    
    // Here you would make an API call to save the data
    console.log('Saving profile section:', section, data)
  }

  const handleAvatarChange = () => {
    console.log('Change avatar')
    // Implement avatar change logic
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
        <p className="text-gray-600 mt-1">
          Manage your personal information and account settings
        </p>
      </div>

      {/* Profile Header */}
      <ProfileHeader profile={profile} onAvatarChange={handleAvatarChange} />

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="personal">Personal Info</TabsTrigger>
          <TabsTrigger value="address">Address</TabsTrigger>
          <TabsTrigger value="emergency">Emergency & Medical</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="personal" className="space-y-6">
          <PersonalInfoTab profile={profile} onSave={handleSave} />
        </TabsContent>

        <TabsContent value="address" className="space-y-6">
          <AddressTab profile={profile} onSave={handleSave} />
        </TabsContent>

        <TabsContent value="emergency" className="space-y-6">
          <EmergencyContactsTab profile={profile} onSave={handleSave} />
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <SecurityTab profile={profile} />
        </TabsContent>
      </Tabs>
    </div>
  )
}