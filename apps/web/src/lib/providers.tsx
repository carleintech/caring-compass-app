'use client'

import { ReactNode } from 'react'
import { httpBatchLink } from '@trpc/client'
import { trpc } from './trpc'
import superjson from 'superjson'

export function TRPCProvider({ children }: { children: ReactNode }) {
  return (
    <trpc.Provider
      client={trpc.createClient({
        links: [
          httpBatchLink({
            url: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/trpc',
          }),
        ],
        transformer: superjson,
      })}
    >
      {children}
    </trpc.Provider>
  )
}
