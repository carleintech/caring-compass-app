'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { BackToHomeButton } from '@/components/ui/back-to-home-button'
import { trpc } from '@/lib/trpc'
import { Mail, ArrowLeft, CheckCircle, Shield, AlertCircle, Loader2 } from 'lucide-react'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)

  const resetMutation = (trpc as any).auth.requestPasswordReset.useMutation({
    onSuccess: () => {
      setIsSubmitted(true)
    },
    onError: (error: { message: string }) => {
      setError(error.message || 'Failed to send reset email. Please try again.')
    }
  })

  const handleSubmit = async (e: React.FormEvent) => {
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

    resetMutation.mutate({ email })
  }

  const handleTryAgain = () => {
    setIsSubmitted(false)
    setEmail('')
    setError('')
  }

  if (isSubmitted) {
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
                  <div className="bg-emerald-100 p-4 rounded-full">
                    <CheckCircle className="w-12 h-12 text-emerald-600" />
                  </div>
                </div>
                <h1 className="text-2xl font-serif font-bold text-slate-900 mb-2">
                  Check Your Email
                </h1>
                <p className="text-sm text-slate-600">
                  We've sent password reset instructions to
                </p>
                <p className="text-sm font-medium text-slate-900 mt-1">
                  {email}
                </p>
              </div>

              {/* Content */}
              <div className="px-8 pb-8 space-y-6">
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                  <p className="text-sm text-slate-600 text-center">
                    Click the link in the email to reset your password. The link will expire in 1 hour.
                  </p>
                </div>

                <div className="text-center text-sm text-slate-600">
                  <p>Didn't receive the email?</p>
                  <p className="mt-1">Check your spam folder or</p>
                  <Button 
                    variant="link" 
                    onClick={handleTryAgain}
                    className="p-0 h-auto text-slate-900 font-medium hover:underline mt-1"
                  >
                    try again
                  </Button>
                </div>

                <Link href="/login">
                  <Button 
                    variant="outline" 
                    className="w-full h-12 border-slate-300 hover:bg-slate-50"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Sign In
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
                  <Mail className="w-7 h-7 text-slate-700" />
                </div>
              </div>
              <h1 className="text-2xl font-serif font-bold text-slate-900 mb-2">
                Reset Your Password
              </h1>
              <p className="text-sm text-slate-600">
                Enter your email and we'll send you a reset link
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
                disabled={resetMutation.isPending}
              >
                {resetMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  'Send Reset Link'
                )}
              </Button>

              <div className="text-center">
                <Link 
                  href="/login" 
                  className="inline-flex items-center text-sm text-slate-600 hover:text-slate-900 font-medium"
                >
                  <ArrowLeft className="mr-1 h-3 w-3" />
                  Back to Sign In
                </Link>
              </div>
            </form>

            {/* Footer - Trust Indicators */}
            <div className="px-8 py-6 bg-slate-50 border-t border-slate-100">
              <div className="flex items-center justify-center gap-2">
                <Shield className="h-4 w-4 text-slate-500" />
                <span className="text-xs text-slate-600 font-medium">
                  Secure password reset process
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
