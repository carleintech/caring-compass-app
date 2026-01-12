'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { BackToHomeButton } from '@/components/ui/back-to-home-button'
import { trpc } from '@/lib/trpc'
import { EyeIcon, EyeOffIcon, Shield, Lock, Heart, Mail, Loader2, AlertCircle } from 'lucide-react'

// Role configuration with colors and labels
const ROLE_CONFIG = {
  CAREGIVER: {
    label: 'Caregiver',
    color: 'indigo',
    redirect: '/caregiver/dashboard',
    bgColor: 'bg-indigo-50',
    borderColor: 'border-indigo-200',
    textColor: 'text-indigo-700',
    gradient: 'from-indigo-600 to-indigo-700'
  },
  CLIENT: {
    label: 'Client',
    color: 'emerald',
    redirect: '/client/dashboard',
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-200',
    textColor: 'text-emerald-700',
    gradient: 'from-emerald-600 to-emerald-700'
  },
  FAMILY: {
    label: 'Family Member',
    color: 'purple',
    redirect: '/client/dashboard',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    textColor: 'text-purple-700',
    gradient: 'from-purple-600 to-purple-700'
  },
  ADMIN: {
    label: 'Administrator',
    color: 'red',
    redirect: '/admin/dashboard',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    textColor: 'text-red-700',
    gradient: 'from-red-600 to-red-700'
  },
  COORDINATOR: {
    label: 'Coordinator',
    color: 'red',
    redirect: '/admin/dashboard',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    textColor: 'text-red-700',
    gradient: 'from-red-600 to-red-700'
  }
}

type UserRole = keyof typeof ROLE_CONFIG

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const successMessage = searchParams.get('message')
  
  const [step, setStep] = useState<'email' | 'password'>('email')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [detectedRole, setDetectedRole] = useState<UserRole | null>(null)
  const [error, setError] = useState('')

  // Email check mutation
  const checkEmailMutation = (trpc as any).auth.checkEmail.useMutation({
    onSuccess: (data: any) => {
      if (data.exists && data.role) {
        setDetectedRole(data.role as UserRole)
        setStep('password')
      } else {
        setError('This email is not registered. Please contact your coordinator to create an account.')
      }
    },
    onError: (error: { message: string }) => {
      setError('Unable to verify email. Please try again.')
    }
  })

  // Login mutation
  const loginMutation = (trpc as any).auth.signIn.useMutation({
    onSuccess: (data: any) => {
      // Store auth token in cookie (for middleware) and localStorage (for client-side)
      if (data.data?.accessToken) {
        // Set cookie that middleware can read
        document.cookie = `auth-token=${data.data.accessToken}; path=/; max-age=2592000; SameSite=Lax`
        // Also store in localStorage as backup
        localStorage.setItem('auth-token', data.data.accessToken)
      }
      
      // Redirect based on detected role or response role
      const role = detectedRole || data.data?.user?.role
      if (role && ROLE_CONFIG[role as UserRole]) {
        router.push(ROLE_CONFIG[role as UserRole].redirect)
      } else {
        // Default to admin dashboard if role is unknown
        router.push('/admin/dashboard')
      }
    },
    onError: (error: { message: string }) => {
      setError(error.message || 'Incorrect email or password')
    }
  })

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!email) {
      setError('Please enter your email address')
      return
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address')
      return
    }

    checkEmailMutation.mutate({ email })
  }

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!password) {
      setError('Please enter your password')
      return
    }

    loginMutation.mutate({
      email,
      password
    })
  }

  const handleBackToEmail = () => {
    setStep('email')
    setPassword('')
    setError('')
    setDetectedRole(null)
  }

  const roleConfig = detectedRole ? ROLE_CONFIG[detectedRole] : null

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-gradient-to-br from-slate-50 via-white to-slate-50 relative">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-[0.015]">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, slate 1px, transparent 0)`,
          backgroundSize: '32px 32px'
        }}></div>
      </div>

      <div className="relative min-h-screen flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Back to Home */}
          <div className="mb-8 animate-fade-in">
            <BackToHomeButton />
          </div>

          {/* Main Card */}
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden animate-fade-in">
            {/* Header */}
            <div className="px-8 pt-8 pb-6 text-center border-b border-slate-100">
              <div className="flex justify-center mb-4">
                <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-3 rounded-xl">
                  <Heart className="w-7 h-7 text-white" />
                </div>
              </div>
              <h1 className="text-2xl font-serif font-bold text-slate-900 mb-2">
                Sign in to continue
              </h1>
              <p className="text-sm text-slate-600">
                Access your Caring Compass account
              </p>
            </div>

            {/* Success Message */}
            {successMessage && (
              <div className="mx-8 mt-6">
                <Alert className="border-emerald-200 bg-emerald-50 animate-fade-in">
                  <AlertCircle className="h-4 w-4 text-emerald-600" />
                  <AlertDescription className="text-emerald-800 ml-2 text-sm">
                    {successMessage}
                  </AlertDescription>
                </Alert>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="mx-8 mt-6">
                <Alert variant="destructive" className="animate-fade-in">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="ml-2 text-sm">{error}</AlertDescription>
                </Alert>
              </div>
            )}

            {/* Email Step */}
            {step === 'email' && (
              <form onSubmit={handleEmailSubmit} className="p-8 space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-slate-700">
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="your.email@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-12 pl-11 border-slate-300 focus:border-slate-900 focus:ring-slate-900 text-base"
                      autoFocus
                      required
                    />
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full h-12 bg-gradient-to-r from-slate-900 to-slate-800 hover:from-slate-800 hover:to-slate-700 text-white font-medium shadow-md transition-all"
                  disabled={checkEmailMutation.isPending}
                >
                  {checkEmailMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Checking...
                    </>
                  ) : (
                    'Continue'
                  )}
                </Button>

                <div className="text-center pt-2">
                  <p className="text-sm text-slate-600">
                    Need an account?{' '}
                    <Link 
                      href="/register" 
                      className="text-slate-900 font-medium hover:underline"
                    >
                      Contact your coordinator
                    </Link>
                  </p>
                </div>
              </form>
            )}

            {/* Password Step */}
            {step === 'password' && roleConfig && (
              <form onSubmit={handlePasswordSubmit} className="p-8 space-y-6">
                {/* Role Display */}
                <div className={`p-4 rounded-xl ${roleConfig.bgColor} border-2 ${roleConfig.borderColor} animate-fade-in`}>
                  <p className="text-sm text-slate-600 mb-1">Logging in as</p>
                  <p className={`text-lg font-semibold ${roleConfig.textColor}`}>
                    {roleConfig.label}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">{email}</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium text-slate-700">
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-12 pl-11 pr-11 border-slate-300 focus:border-slate-900 focus:ring-slate-900 text-base"
                      autoFocus
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-1 top-1/2 -translate-y-1/2 h-10 px-3 hover:bg-slate-100"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOffIcon className="h-4 w-4 text-slate-500" />
                      ) : (
                        <EyeIcon className="h-4 w-4 text-slate-500" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <button
                    type="button"
                    onClick={handleBackToEmail}
                    className="text-slate-600 hover:text-slate-900 font-medium"
                  >
                    ← Back
                  </button>
                  <Link 
                    href="/forgot-password" 
                    className="text-slate-600 hover:text-slate-900 font-medium hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>

                <Button 
                  type="submit" 
                  className={`w-full h-12 bg-gradient-to-r ${roleConfig.gradient} text-white font-medium shadow-md transition-all`}
                  disabled={loginMutation.isPending}
                >
                  {loginMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    <>
                      <Shield className="mr-2 h-4 w-4" />
                      Sign In Securely
                    </>
                  )}
                </Button>
              </form>
            )}

            {/* Footer - Trust Indicators */}
            <div className="px-8 py-6 bg-slate-50 border-t border-slate-100">
              <div className="flex items-center justify-center gap-8">
                <div className="flex items-center gap-2 text-xs text-slate-600">
                  <Shield className="h-4 w-4 text-slate-500" />
                  <span className="font-medium">Secure Login</span>
                </div>
                <div className="w-px h-4 bg-slate-300"></div>
                <div className="flex items-center gap-2 text-xs text-slate-600">
                  <Lock className="h-4 w-4 text-slate-500" />
                  <span className="font-medium">HIPAA Compliant</span>
                </div>
              </div>
              <p className="text-center text-xs text-slate-500 mt-3">
                Need help? Contact your coordinator
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
