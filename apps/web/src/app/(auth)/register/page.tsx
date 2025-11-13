'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { BackToHomeButton } from '@/components/ui/back-to-home-button'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { trpc } from '@/lib/trpc'
import { EyeIcon, EyeOffIcon, CheckCircleIcon } from 'lucide-react'

export default function RegisterPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'CAREGIVER', // Add role selection
    dateOfBirth: '',
    address: '',
    city: '',
    state: 'VA',
    zipCode: '',
    hasTransportation: false,
    hasCertification: false,
    certificationDetails: '',
    experience: '',
    availability: '',
    agreeToTerms: false,
    agreeToBackground: false
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const registerMutation = trpc.auth.register.useMutation({
    onSuccess: () => {
      setSuccess(true)
      // Redirect to login after 3 seconds
      setTimeout(() => {
        router.push('/login?message=Registration successful. Please sign in.')
      }, 3000)
    },
    onError: (error) => {
      setError(error.message)
    }
  })

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Validation
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone || !formData.password) {
      setError('Please fill in all required fields')
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long')
      return
    }

    if (!formData.agreeToTerms || !formData.agreeToBackground) {
      setError('Please accept the terms and background check consent')
      return
    }

    registerMutation.mutate({
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      password: formData.password,
      role: formData.role as 'CAREGIVER' | 'CLIENT' | 'FAMILY' // Use selected role
    })
  }

  if (success) {
    return (
      <Card className="w-full">
        <CardHeader className="text-center">
          <CheckCircleIcon className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <CardTitle className="text-green-600">Registration Successful!</CardTitle>
          <CardDescription>
            Your account has been created successfully. Redirecting you to sign in...
          </CardDescription>
        </CardHeader>
        <CardFooter className="flex flex-col gap-4">
          <div className="w-full text-center">
            <LoadingSpinner size="sm" className="mx-auto mb-2" />
            <p className="text-sm text-gray-600">Redirecting in 3 seconds...</p>
          </div>
          <Button 
            onClick={() => router.push('/login')}
            className="w-full"
          >
            Go to Sign In Now
          </Button>
          <Link href="/" className="text-blue-600 hover:underline text-center">
            Return to Home
          </Link>
        </CardFooter>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-start">
        <BackToHomeButton />
      </div>
      
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Join Our Caregiving Team</CardTitle>
        <CardDescription>
          Apply to become a certified caregiver with Caring Compass
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {/* Account Type Selection */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Account Type</h3>
            <div className="space-y-2">
              <Label htmlFor="role">I am registering as a:</Label>
              <Select value={formData.role} onValueChange={(value) => handleInputChange('role', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CAREGIVER">Caregiver - I want to provide care services</SelectItem>
                  <SelectItem value="CLIENT">Client - I need care services for myself</SelectItem>
                  <SelectItem value="FAMILY">Family Member - I'm arranging care for a family member</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {/* Personal Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Personal Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  disabled={registerMutation.isPending}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  disabled={registerMutation.isPending}
                  required
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  disabled={registerMutation.isPending}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  disabled={registerMutation.isPending}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dateOfBirth">Date of Birth</Label>
              <Input
                id="dateOfBirth"
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                disabled={registerMutation.isPending}
              />
            </div>
          </div>

          {/* Address */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Address</h3>
            <div className="space-y-2">
              <Label htmlFor="address">Street Address</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                disabled={registerMutation.isPending}
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  disabled={registerMutation.isPending}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Select value={formData.state} onValueChange={(value) => handleInputChange('state', value)}>
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
                  onChange={(e) => handleInputChange('zipCode', e.target.value)}
                  disabled={registerMutation.isPending}
                />
              </div>
            </div>
          </div>

          {/* Password */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Account Security</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="password">Password *</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    disabled={registerMutation.isPending}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password *</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    disabled={registerMutation.isPending}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Experience & Qualifications */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Experience & Qualifications</h3>
            
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="hasTransportation"
                  checked={formData.hasTransportation}
                  onCheckedChange={(checked) => handleInputChange('hasTransportation', !!checked)}
                />
                <Label htmlFor="hasTransportation">I have reliable transportation</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="hasCertification"
                  checked={formData.hasCertification}
                  onCheckedChange={(checked) => handleInputChange('hasCertification', !!checked)}
                />
                <Label htmlFor="hasCertification">I have CNA, PCA, or HHA certification</Label>
              </div>
            </div>

            {formData.hasCertification && (
              <div className="space-y-2">
                <Label htmlFor="certificationDetails">Certification Details</Label>
                <Textarea
                  id="certificationDetails"
                  placeholder="Please specify your certification type, issuing organization, and expiration date"
                  value={formData.certificationDetails}
                  onChange={(e) => handleInputChange('certificationDetails', e.target.value)}
                  disabled={registerMutation.isPending}
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="experience">Caregiving Experience</Label>
              <Textarea
                id="experience"
                placeholder="Please describe your experience in caregiving, including years of experience and types of care provided"
                value={formData.experience}
                onChange={(e) => handleInputChange('experience', e.target.value)}
                disabled={registerMutation.isPending}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="availability">Availability</Label>
              <Textarea
                id="availability"
                placeholder="Please describe your availability (days of week, preferred hours, etc.)"
                value={formData.availability}
                onChange={(e) => handleInputChange('availability', e.target.value)}
                disabled={registerMutation.isPending}
              />
            </div>
          </div>

          {/* Agreements */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Agreements</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onCheckedChange={(checked) => handleInputChange('agreeToTerms', !!checked)}
                />
                <Label htmlFor="agreeToTerms" className="text-sm leading-relaxed">
                  I agree to the <Link href={"/terms" as any} className="text-blue-600 hover:underline">Terms of Service</Link> and <Link href={"/privacy" as any} className="text-blue-600 hover:underline">Privacy Policy</Link>
                </Label>
              </div>
              
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="agreeToBackground"
                  checked={formData.agreeToBackground}
                  onCheckedChange={(checked) => handleInputChange('agreeToBackground', !!checked)}
                />
                <Label htmlFor="agreeToBackground" className="text-sm leading-relaxed">
                  I consent to a background check and understand that employment is contingent upon satisfactory results
                </Label>
              </div>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="flex flex-col space-y-4">
          <Button 
            type="submit" 
            className="w-full"
            disabled={registerMutation.isPending}
          >
            {registerMutation.isPending ? (
              <>
                <LoadingSpinner className="mr-2 h-4 w-4" />
                Submitting Application...
              </>
            ) : (
              'Submit Application'
            )}
          </Button>
          
          <div className="text-center">
            <Link href="/login" className="text-sm text-blue-600 hover:underline">
              Already have an account? Sign in
            </Link>
          </div>
        </CardFooter>
      </form>
    </Card>
    </div>
  )
}
