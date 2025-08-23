'use client'

import * as React from 'react'
import ThemeProvider from './theme-provider'
import TRPCProvider from './trpc-provider'
import ToastProvider from './toast-provider'

interface ProvidersProps {
  readonly children?: React.ReactNode
}

const Providers = ({ children }: ProvidersProps) => {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <TRPCProvider>
        <ToastProvider>{children}</ToastProvider>
      </TRPCProvider>
    </ThemeProvider>
  )
}

export default Providers
