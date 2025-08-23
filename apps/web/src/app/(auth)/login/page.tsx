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
import { trpc } from '@/lib/trpc'
import { EyeIcon, EyeOffIcon } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [formState, setFormState] = useState({
    email: '',
    password: '',
    showPassword: false,
    error: ''
  })

  const loginMutation = trpc.auth.signIn.useMutation({
    onSuccess: (data) => {
      // Store auth token if needed and available
      if (data.data?.accessToken) {
        localStorage.setItem('auth-token', data.data.accessToken)
      }
      
      // Redirect based on user role
      if (data.data?.user?.role) {
        switch (data.data.user.role) {
          case 'ADMIN':
          case 'COORDINATOR':
            router.push('/admin/dashboard')
            break
          case 'CAREGIVER':
            router.push('/caregiver/dashboard')
            break
          case 'CLIENT':
          case 'FAMILY':
            router.push('/client/dashboard')
            break
          default:
            router.push('/dashboard')
        }
      } else {
        router.push('/dashboard')
      }
    },
    onError: (error) => {
      setFormState(prev => ({ ...prev, error: error.message }))
    }
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormState(prev => ({ ...prev, error: '' }))

    if (!formState.email || !formState.password) {
      setFormState(prev => ({ ...prev, error: 'Please fill in all fields' }))
      return
    }

    loginMutation.mutate({
      email: formState.email,
      password: formState.password
    })
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Sign In</CardTitle>
        <CardDescription>
          Enter your credentials to access your account
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
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={formState.email}
              onChange={(e) => setFormState(prev => ({ ...prev, email: e.target.value }))}
              disabled={loginMutation.isPending}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={formState.showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={formState.password}
                onChange={(e) => setFormState(prev => ({ ...prev, password: e.target.value }))}
                disabled={loginMutation.isPending}
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setFormState(prev => ({ ...prev, showPassword: !prev.showPassword }))}
                disabled={loginMutation.isPending}
              >
                {formState.showPassword ? (
                  <EyeOffIcon className="h-4 w-4" />
                ) : (
                  <EyeIcon className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button 
            type="submit" 
            className="w-full"
            disabled={loginMutation.isPending}
          >
            {loginMutation.isPending ? (
              <>
                <LoadingSpinner className="mr-2 h-4 w-4" />
                Signing In...
              </>
            ) : (
              'Sign In'
            )}
          </Button>
          
          <div className="text-center space-y-2">
            <div className="text-sm text-blue-600 hover:underline cursor-pointer">
              Forgot your password?
            </div>
            <div className="text-sm text-gray-600">
              Don&apos;t have an account?{' '}
              <Link href="/register" className="text-blue-600 hover:underline">
                Contact your coordinator
              </Link>
            </div>
          </div>
        </CardFooter>
      </form>
    </Card>
  )
}
