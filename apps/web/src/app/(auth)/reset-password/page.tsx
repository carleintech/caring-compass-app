'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { BackToHomeButton } from '@/components/ui/back-to-home-button'
import { Lock, EyeIcon, EyeOffIcon, CheckCircle, Shield, AlertCircle, Loader2, Key } from 'lucide-react'

export default function ResetPasswordPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  // Validate token on mount
  useEffect(() => {
    if (!token) {
      setError('Invalid or missing reset token. Please request a new password reset link.')
    }
  }, [token])

  const validatePassword = () => {
    if (password.length < 8) {
      setError('Password must be at least 8 characters long')
      return false
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return false
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!token) {
      setError('Invalid reset token')
      return
    }

    if (!validatePassword()) {
      return
    }

    setIsLoading(true)

    try {
      // TODO: Implement actual password reset with tRPC/Supabase
      // For now, simulate the API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Mock success
      setIsSuccess(true)
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        router.push('/login?message=Password reset successful. Please sign in.')
      }, 3000)
    } catch (err) {
      setError('Failed to reset password. Please try again or request a new reset link.')
      setIsLoading(false)
    }
  }

  if (isSuccess) {
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
            {/* Success Card */}
            <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden animate-fade-in">
              {/* Success Icon */}
              <div className="px-8 pt-12 pb-6 text-center">
                <div className="flex justify-center mb-6">
                  <div className="bg-emerald-100 p-4 rounded-full animate-pulse">
                    <CheckCircle className="w-12 h-12 text-emerald-600" />
                  </div>
                </div>
                <h1 className="text-2xl font-serif font-bold text-slate-900 mb-2">
                  Password Reset Complete!
                </h1>
                <p className="text-sm text-slate-600">
                  Your password has been successfully changed
                </p>
              </div>

              {/* Content */}
              <div className="px-8 pb-8 space-y-6">
                <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-200">
                  <p className="text-sm text-emerald-800 text-center">
                    Redirecting you to sign in...
                  </p>
                </div>

                <Link href="/login">
                  <Button 
                    className="w-full h-12 bg-gradient-to-r from-slate-900 to-slate-800 hover:from-slate-800 hover:to-slate-700 text-white"
                  >
                    Sign In Now
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

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
                <div className="bg-slate-100 p-3 rounded-xl">
                  <Key className="w-7 h-7 text-slate-700" />
                </div>
              </div>
              <h1 className="text-2xl font-serif font-bold text-slate-900 mb-2">
                Set New Password
              </h1>
              <p className="text-sm text-slate-600">
                Choose a strong password for your account
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mx-8 mt-6">
                <Alert variant="destructive" className="animate-fade-in">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="ml-2 text-sm">{error}</AlertDescription>
                </Alert>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              {/* New Password */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-slate-700">
                  New Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter new password"
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
                
                {/* Password Requirements */}
                <div className="flex items-center gap-2 text-xs">
                  <div className={`w-2 h-2 rounded-full ${password.length >= 8 ? 'bg-emerald-500' : 'bg-slate-300'}`}></div>
                  <span className={password.length >= 8 ? 'text-emerald-600' : 'text-slate-500'}>
                    At least 8 characters
                  </span>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-sm font-medium text-slate-700">
                  Confirm New Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={`h-12 pl-11 pr-11 border-slate-300 text-base ${
                      confirmPassword && password !== confirmPassword
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                        : confirmPassword && password === confirmPassword
                        ? 'border-emerald-500 focus:border-emerald-500 focus:ring-emerald-500'
                        : 'focus:border-slate-900 focus:ring-slate-900'
                    }`}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-10 px-3 hover:bg-slate-100"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOffIcon className="h-4 w-4 text-slate-500" />
                    ) : (
                      <EyeIcon className="h-4 w-4 text-slate-500" />
                    )}
                  </Button>
                </div>

                {/* Password Match Indicator */}
                {confirmPassword && (
                  <div className="flex items-center gap-2 text-xs animate-fade-in">
                    <div className={`w-2 h-2 rounded-full ${
                      password === confirmPassword ? 'bg-emerald-500' : 'bg-red-500'
                    }`}></div>
                    <span className={password === confirmPassword ? 'text-emerald-600' : 'text-red-600'}>
                      {password === confirmPassword ? 'Passwords match' : 'Passwords do not match'}
                    </span>
                  </div>
                )}
              </div>

              <Button 
                type="submit" 
                className="w-full h-12 bg-gradient-to-r from-slate-900 to-slate-800 hover:from-slate-800 hover:to-slate-700 text-white font-medium shadow-md transition-all"
                disabled={isLoading || !token}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Resetting Password...
                  </>
                ) : (
                  <>
                    <Shield className="mr-2 h-4 w-4" />
                    Reset Password
                  </>
                )}
              </Button>

              <div className="text-center">
                <Link 
                  href="/login" 
                  className="text-sm text-slate-600 hover:text-slate-900 font-medium hover:underline"
                >
                  Cancel and return to sign in
                </Link>
              </div>
            </form>

            {/* Footer - Trust Indicators */}
            <div className="px-8 py-6 bg-slate-50 border-t border-slate-100">
              <div className="flex items-center justify-center gap-2">
                <Shield className="h-4 w-4 text-slate-500" />
                <span className="text-xs text-slate-600 font-medium">
                  Your password is encrypted and secure
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
