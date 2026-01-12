'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { CheckCircleIcon, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export function Step5Success() {
  const router = useRouter()

  useEffect(() => {
    // Auto-redirect after 5 seconds
    const timer = setTimeout(() => {
      router.push('/login?message=Registration successful. Please sign in.')
    }, 5000)

    return () => clearTimeout(timer)
  }, [router])

  return (
    <div className="w-full max-w-2xl mx-auto animate-fade-in">
      <div className="bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 rounded-3xl shadow-2xl border-2 border-green-200 overflow-hidden">
        {/* Success Icon */}
        <div className="pt-12 pb-8 flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full blur-2xl opacity-30 animate-pulse"></div>
            <div className="relative bg-gradient-to-r from-green-600 to-emerald-600 p-6 rounded-full shadow-xl">
              <CheckCircleIcon className="h-16 w-16 text-white" />
            </div>
          </div>
        </div>

        {/* Success Message */}
        <div className="text-center px-8 pb-10">
          <h1 className="text-5xl font-serif font-bold text-slate-900 mb-4">
            Welcome to Caring Compass!
          </h1>
          <p className="text-xl text-slate-700 mb-8 leading-relaxed">
            Your registration has been submitted successfully.
          </p>

          {/* Info Cards */}
          <div className="space-y-4 mb-8 text-left">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-5 border border-green-200">
              <h3 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-green-600 text-white text-sm flex items-center justify-center">1</span>
                Check Your Email
              </h3>
              <p className="text-sm text-slate-600 pl-8">
                We've sent a verification email to confirm your account. Please check your inbox.
              </p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-5 border border-green-200">
              <h3 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-green-600 text-white text-sm flex items-center justify-center">2</span>
                Account Review
              </h3>
              <p className="text-sm text-slate-600 pl-8">
                Our team will review your registration. You'll receive a notification once approved.
              </p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-5 border border-green-200">
              <h3 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-green-600 text-white text-sm flex items-center justify-center">3</span>
                Get Started
              </h3>
              <p className="text-sm text-slate-600 pl-8">
                Once approved, you can sign in and access your personalized dashboard.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4">
            <Button
              onClick={() => router.push('/login')}
              className="w-full h-14 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 hover:from-slate-800 hover:via-slate-700 hover:to-slate-800 text-white font-bold shadow-xl transition-all border-2 border-amber-500/20 hover:border-amber-500/40 text-lg rounded-xl"
            >
              <span className="font-serif">Go to Sign In</span>
              <ArrowRight className="ml-3 h-5 w-5" />
            </Button>

            <Link href="/" className="block text-center">
              <Button
                variant="outline"
                className="w-full h-12 border-2 border-slate-300 hover:border-slate-400 hover:bg-slate-50 transition-all"
              >
                Return to Home
              </Button>
            </Link>
          </div>

          {/* Auto-redirect notice */}
          <p className="text-sm text-slate-500 mt-6">
            Redirecting to sign in page in 5 seconds...
          </p>
        </div>
      </div>
    </div>
  )
}
