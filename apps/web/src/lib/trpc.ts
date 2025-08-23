import { createTRPCReact } from '@trpc/react-query'
import type { AppRouter } from '@caring-compass/api'
import { type inferRouterInputs, type inferRouterOutputs } from '@trpc/server'

export const trpc = createTRPCReact<AppRouter>()

export type RouterInputs = inferRouterInputs<AppRouter>
export type RouterOutputs = inferRouterOutputs<AppRouter>
