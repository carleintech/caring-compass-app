'use client'

import * as React from 'react'
import { Toaster } from 'react-hot-toast'
import { useTheme } from 'next-themes'

interface ToastProviderProps {
  readonly children?: React.ReactNode
}

const ToastProvider = ({ children }: ToastProviderProps) => {
  const { theme } = useTheme()

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: theme === 'dark' ? '#1f2937' : '#ffffff',
            color: theme === 'dark' ? '#f9fafb' : '#111827',
            border: theme === 'dark' ? '1px solid #374151' : '1px solid #e5e7eb',
            borderRadius: '0.5rem',
            fontSize: '14px',
            maxWidth: '500px'
          }
        }}
      />
      {children}
    </>
  )
}

export default ToastProvider