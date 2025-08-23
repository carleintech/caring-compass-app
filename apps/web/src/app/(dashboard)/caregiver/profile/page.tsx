'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Award, 
  Star,
  Upload,
  Edit,
  Save,
  X,
  CheckCircle,
  Clock,
  FileText,
  Camera
} from 'lucide-react'

interface CaregiverProfile {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  zipCode: string
  dateOfBirth: string
  emergencyContact: {
    name: string
    phone: string
    relationship: string
  }
  bio: string
  experience: string
  specialties: string[]
  languages: string[]
  availability: string[]
  hourlyRate: number
  rating: number
  totalHours: number
  completedVisits: number
}

interface Certification {
  id: string
  name: string
  issuer: string
  issueDate: string
  expiryDate: string
  status: 'active' | 'expiring' | 'expired'
}

export default function CaregiverProfile() {
  const [isEditing, setIsEditing] = useState(false)
  const [profile, setProfile] = useState<CaregiverProfile>({
    id: '1',
    firstName: 'Sarah',
    lastName: 'Johnson',
    email: 'sarah.johnson@email.com',
    phone: '(555) 123-4567',
    address: '123 Main Street',
    city: 'Springfield',
    state: 'IL',
    zipCode: '62701',
    dateOfBirth: '1985-03-15',
    emergencyContact: {
      name: 'John Johnson',
      phone: '(555) 987-6543',
      relationship: 'Spouse'
    },
    bio: 'Compassionate and experienced home care aide with over 8 years of experience providing quality care to elderly and disabled clients. Specialized in personal care, medication management, and companionship services.',
    experience: '8 years',
    specialties: ['Personal Care', 'Medication Management', 'Dementia Care', 'Companionship'],
    languages: ['English', 'Spanish'],
    availability: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    hourlyRate: 25,
    rating: 4.9,
    totalHours: 2840,
    completedVisits: 456
  })

  const [certifications] = useState<Certification[]>([
    {
      id: '1',
      name: 'Certified Nursing Assistant (CNA)',
      issuer: 'Illinois Department of Public Health',
      issueDate: '2020-01-15',
      expiryDate: '2024-01-15',
      status: 'active'
    },
    {
      id: '2',
      name: 'CPR Certification',
      issuer: 'American Red Cross',
      issueDate: '2023-06-01',
      expiryDate: '2025-06-01',
      status: 'active'
    },
    {
      id: '3',
      name: 'First Aid Certification',
      issuer: 'American Red Cross',
      issueDate: '2023-06-01',
      expiryDate: '2025-06-01',
      status: 'active'
    },
    {
      id: '4',
      name: 'Dementia Care Specialist',
      issuer: 'Alzheimer\'s Association',
      issueDate: '2022-09-15',
      expiryDate: '2024-09-15',
      status: 'expiring'
    }
  ])

  const handleSave = () => {
    // Save profile changes
    setIsEditing(false)
  }

  const handleCancel = () => {
    // Reset changes
    setIsEditing(false)
  }

  const getCertificationStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'expiring': return 'bg-yellow-100 text-yellow-800'
      case 'expired': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const profileCompleteness = 85 // Calculate based on filled fields

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Profile</h1>
          <p className="text-muted-foreground">
            Manage your professional profile and credentials
          </p>
        </div>
        <div className="flex items-center space-x-4">
          {isEditing ? (
            <>
              <Button onClick={handleSave}>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
              <Button variant="outline" onClick={handleCancel}>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)}>
              <Edit className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          )}
        </div>
      </div>

      {/* Profile Completeness */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
            Profile Completeness
          </CardTitle>
          <CardDescription>
            Complete your profile to increase your visibility to clients
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Profile completion</span>
              <span>{profileCompleteness}%</span>
            </div>
            <Progress value={profileCompleteness} className="h-2" />
            <p className="text-xs text-muted-foreground">
              Add more certifications and update your bio to reach 100%
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <Tabs defaultValue="personal" className="space-y-4">
        <TabsList>
          <TabsTrigger value="personal">Personal Info</TabsTrigger>
          <TabsTrigger value="professional">Professional</TabsTrigger>
          <TabsTrigger value="certifications">Certifications</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="personal" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Profile Photo & Basic Info */}
            <Card>
              <CardHeader>
                <CardTitle>Profile Photo</CardTitle>
                <CardDescription>
                  Upload a professional photo to help clients recognize you
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src="/placeholder-avatar.jpg" />
                    <AvatarFallback className="text-lg">
                      {profile.firstName[0]}{profile.lastName[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-2">
                    <Button size="sm" variant="outline">
                      <Camera className="h-4 w-4 mr-2" />
                      Change Photo
                    </Button>
                    <p className="text-xs text-muted-foreground">
                      JPG, PNG up to 5MB
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={profile.firstName}
                      disabled={!isEditing}
                      onChange={(e) => setProfile({...profile, firstName: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={profile.lastName}
                      disabled={!isEditing}
                      onChange={(e) => setProfile({...profile, lastName: e.target.value})}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profile.email}
                    disabled={!isEditing}
                    onChange={(e) => setProfile({...profile, email: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={profile.phone}
                    disabled={!isEditing}
                    onChange={(e) => setProfile({...profile, phone: e.target.value})}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Address */}
          <Card>
            <CardHeader>
              <CardTitle>Address</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="address">Street Address</Label>
                <Input
                  id="address"
                  value={profile.address}
                  disabled={!isEditing}
                  onChange={(e) => setProfile({...profile, address: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={profile.city}
                    disabled={!isEditing}
                    onChange={(e) => setProfile({...profile, city: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    value={profile.state}
                    disabled={!isEditing}
                    onChange={(e) => setProfile({...profile, state: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="zipCode">ZIP Code</Label>
                  <Input
                    id="zipCode"
                    value={profile.zipCode}
                    disabled={!isEditing}
                    onChange={(e) => setProfile({...profile, zipCode: e.target.value})}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Emergency Contact */}
          <Card>
            <CardHeader>
              <CardTitle>Emergency Contact</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="emergencyName">Name</Label>
                  <Input
                    id="emergencyName"
                    value={profile.emergencyContact.name}
                    disabled={!isEditing}
                    onChange={(e) => setProfile({
                      ...profile,
                      emergencyContact: {...profile.emergencyContact, name: e.target.value}
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="emergencyPhone">Phone</Label>
                  <Input
                    id="emergencyPhone"
                    value={profile.emergencyContact.phone}
                    disabled={!isEditing}
                    onChange={(e) => setProfile({
                      ...profile,
                      emergencyContact: {...profile.emergencyContact, phone: e.target.value}
                    })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="emergencyRelationship">Relationship</Label>
                <Input
                  id="emergencyRelationship"
                  value={profile.emergencyContact.relationship}
                  disabled={!isEditing}
                  onChange={(e) => setProfile({
                    ...profile,
                    emergencyContact: {...profile.emergencyContact, relationship: e.target.value}
                  })}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="professional" className="space-y-4">
          {/* Bio */}
          <Card>
            <CardHeader>
              <CardTitle>Professional Bio</CardTitle>
              <CardDescription>
                Tell clients about your experience and approach to care
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                value={profile.bio}
                disabled={!isEditing}
                onChange={(e) => setProfile({...profile, bio: e.target.value})}
                rows={4}
                placeholder="Describe your experience, specialties, and approach to caregiving..."
              />
            </CardContent>
          </Card>

          {/* Experience & Specialties */}
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Experience</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="experience">Years of Experience</Label>
                  <Input
                    id="experience"
                    value={profile.experience}
                    disabled={!isEditing}
                    onChange={(e) => setProfile({...profile, experience: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hourlyRate">Hourly Rate ($)</Label>
                  <Input
                    id="hourlyRate"
                    type="number"
                    value={profile.hourlyRate}
                    disabled={!isEditing}
                    onChange={(e) => setProfile({...profile, hourlyRate: Number(e.target.value)})}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Specialties</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {profile.specialties.map((specialty, index) => (
                    <Badge key={index} variant="secondary">
                      {specialty}
                    </Badge>
                  ))}
                </div>
                {isEditing && (
                  <Button variant="outline" size="sm" className="mt-2">
                    Add Specialty
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Languages & Availability */}
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Languages</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {profile.languages.map((language, index) => (
                    <Badge key={index} variant="outline">
                      {language}
                    </Badge>
                  ))}
                </div>
                {isEditing && (
                  <Button variant="outline" size="sm" className="mt-2">
                    Add Language
                  </Button>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Availability</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {profile.availability.map((day, index) => (
                    <Badge key={index} variant="outline">
                      {day}
                    </Badge>
                  ))}
                </div>
                {isEditing && (
                  <Button variant="outline" size="sm" className="mt-2">
                    Update Schedule
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="certifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Certifications & Licenses</CardTitle>
              <CardDescription>
                Keep your certifications up to date to maintain your eligibility
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {certifications.map((cert) => (
                  <div key={cert.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-1">
                      <p className="font-medium">{cert.name}</p>
                      <p className="text-sm text-muted-foreground">{cert.issuer}</p>
                      <p className="text-xs text-muted-foreground">
                        Issued: {formatDate(cert.issueDate)} • Expires: {formatDate(cert.expiryDate)}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getCertificationStatusColor(cert.status)}>
                        {cert.status}
                      </Badge>
                      <Button size="sm" variant="outline">
                        <FileText className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                <Button variant="outline" className="w-full">
                  <Upload className="h-4 w-4 mr-2" />
                  Add New Certification
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          {/* Performance Stats */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Overall Rating</CardTitle>
                <Star className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{profile.rating}</div>
                <p className="text-xs text-muted-foreground">
                  Based on client reviews
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Hours</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{profile.totalHours.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  Hours of care provided
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Completed Visits</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{profile.completedVisits}</div>
                <p className="text-xs text-muted-foreground">
                  Successful visits
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Reviews */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Client Reviews</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    client: 'Margaret S.',
                    rating: 5,
                    comment: 'Sarah is wonderful! Very caring and professional. My mother loves her visits.',
                    date: '2 days ago'
                  },
                  {
                    client: 'Robert T.',
                    rating: 5,
                    comment: 'Excellent caregiver. Always on time and very attentive to my needs.',
                    date: '1 week ago'
                  },
                  {
                    client: 'Helen M.',
                    rating: 4,
                    comment: 'Great companion and helper. Very reliable and kind.',
                    date: '2 weeks ago'
                  }
                ].map((review, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">{review.client}</span>
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground">{review.date}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{review.comment}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
