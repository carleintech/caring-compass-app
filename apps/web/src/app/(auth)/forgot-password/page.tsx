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
import { ArrowLeft, Mail, CheckCircle } from 'lucide-react'

export default function ForgotPasswordPage() {
  const router = useRouter()
  
  const [formState, setFormState] = useState({
    email: '',
    isSubmitted: false,
    isLoading: false,
    error: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formState.email) {
      setFormState(prev => ({ ...prev, error: 'Email is required' }))
      return
    }

    setFormState(prev => ({ ...prev, isLoading: true, error: '' }))

    try {
      // TODO: Implement password reset with Supabase
      // For now, we'll simulate the request
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Mock success - in real implementation, this would call Supabase auth.resetPasswordForEmail
      setFormState(prev => ({ 
        ...prev, 
        isSubmitted: true, 
        isLoading: false 
      }))
    } catch (error) {
      setFormState(prev => ({ 
        ...prev, 
        error: 'Failed to send reset email. Please try again.',
        isLoading: false 
      }))
    }
  }

  const handleChange = (field: string, value: string) => {
    setFormState(prev => ({ ...prev, [field]: value, error: '' }))
  }

  if (formState.isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <CardTitle className="text-2xl">Check Your Email</CardTitle>
            <CardDescription>
              We&apos;ve sent password reset instructions to {formState.email}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center text-sm text-gray-600">
              <p>Didn&apos;t receive the email? Check your spam folder or</p>
              <Button 
                variant="link" 
                onClick={() => setFormState(prev => ({ ...prev, isSubmitted: false }))}
                className="p-0 h-auto text-blue-600"
              >
                try again
              </Button>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Link href="/login">
              <Button variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Sign In
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
      <div className="w-full max-w-md space-y-6">
        <BackToHomeButton />
        
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Mail className="h-6 w-6 text-blue-600" />
            </div>
            <CardTitle className="text-2xl">Reset Your Password</CardTitle>
            <CardDescription>
              Enter your email address and we&apos;ll send you a link to reset your password
            </CardDescription>
          </CardHeader>
          
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {formState.error && (
                <Alert variant="destructive">
                  <AlertDescription>{formState.error}</AlertDescription>
                </Alert>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email address"
                  value={formState.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  required
                  disabled={formState.isLoading}
                />
              </div>
            </CardContent>
            
            <CardFooter className="flex flex-col space-y-4">
              <Button 
                type="submit" 
                className="w-full"
                disabled={formState.isLoading}
              >
                {formState.isLoading ? (
                  <>
                    <LoadingSpinner className="mr-2 h-4 w-4" />
                    Sending Reset Link...
                  </>
                ) : (
                  'Send Reset Link'
                )}
              </Button>
              
              <div className="text-center">
                <Link href="/login" className="text-sm text-blue-600 hover:underline">
                  <ArrowLeft className="inline mr-1 h-3 w-3" />
                  Back to Sign In
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}
