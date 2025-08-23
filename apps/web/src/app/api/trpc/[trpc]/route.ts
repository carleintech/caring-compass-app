import { fetchRequestHandler } from '@trpc/server/adapters/fetch'
import { appRouter, createTRPCContext } from '@caring-compass/api'
import { NextRequest } from 'next/server'

const createContext = async ({ req }: { req: NextRequest }) => {
  return createTRPCContext({ req })
}

export async function GET(request: NextRequest) {
  return fetchRequestHandler({
    endpoint: '/api/trpc',
    req: request,
    router: appRouter,
    createContext: () => createContext({ req: request }),
    onError: ({ path, error }) => {
      if (process.env.NODE_ENV === 'development') {
        console.error(
          `❌ tRPC failed on ${path ?? '<no-path>'}: ${error.message}`
        )
      }
    },
  })
}

export async function POST(request: NextRequest) {
  return fetchRequestHandler({
    endpoint: '/api/trpc',
    req: request,
    router: appRouter,
    createContext: () => createContext({ req: request }),
    onError: ({ path, error }) => {
      if (process.env.NODE_ENV === 'development') {
        console.error(
          `❌ tRPC failed on ${path ?? '<no-path>'}: ${error.message}`
        )
      }
    },
  })
}
