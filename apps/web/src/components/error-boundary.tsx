'use client'

import * as React from 'react'

interface ErrorBoundaryFallbackProps {
  error: unknown
  componentStack?: string
  eventId?: string
  resetError: () => void
}

export function ErrorBoundaryFallback({ error, resetError }: ErrorBoundaryFallbackProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6">
        <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full">
          <svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.996-.833-2.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" 
            />
          </svg>
        </div>
        <div className="mt-3 text-center">
          <h3 className="text-lg font-medium text-gray-900">Something went wrong</h3>
          <div className="mt-2">
            <p className="text-sm text-gray-500">
              We&apos;ve been notified of this error and are working to fix it.
            </p>
          </div>
          <div className="mt-4">
            <button
              type="button"
              className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              onClick={resetError}
            >
              Try again
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
