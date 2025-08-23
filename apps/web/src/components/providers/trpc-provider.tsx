'use client'

import * as React from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { trpc } from '@/lib/trpc'
import { useState } from 'react'
import { httpBatchLink } from '@trpc/client'
import superjson from 'superjson'

interface TRPCProviderProps {
  readonly children?: React.ReactNode
}

const getBaseUrl = () => {
  if (typeof window !== 'undefined') return window.location.origin // browser should use current origin
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}` // SSR should use vercel url
  return process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000' // dev SSR should use environment variable or localhost
}

const TRPCProvider = ({ children }: TRPCProviderProps) => {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 1000, // 5 seconds
        retry: false,
      },
    },
  }))

  const [trpcClient] = useState(() => {
    return trpc.createClient({
      transformer: superjson,
      links: [
        httpBatchLink({
          url: `${getBaseUrl()}/api/trpc`,
          // You can pass any HTTP headers you wish here
          headers() {
            return {
              // authorization: getAuthCookie(),
            }
          },
        }),
      ],
    })
  })

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </trpc.Provider>
  )
}

export default TRPCProvider
