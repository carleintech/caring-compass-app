import { createTRPCRouter } from '../trpc/trpc'
import type { RouterTypes } from '../trpc/types'
import { authRouter } from './auth'
import { clientsRouter } from './clients'
import { caregiversRouter } from './caregivers'
import { visitsRouter } from './visits'
import { billingRouter } from './billing'
import { messagingRouter } from './messaging'
import { documentsRouter } from './documents'
import { adminRouter } from './admin'
import { coordinatorRouter } from './coordinator'
import { servicesRouter } from './services'

/**
 * Main application router that combines all feature routers
 * This is the single entry point for all tRPC API endpoints
 */
export const appRouter: RouterTypes['AppRouter'] = createTRPCRouter({
  // Authentication and user management
  auth: authRouter,
  
  // Core business entities
  clients: clientsRouter,
  caregivers: caregiversRouter,
  visits: visitsRouter,
  
  // Financial operations
  billing: billingRouter,
  
  // Communication systems
  messaging: messagingRouter,
  documents: documentsRouter,
  
  // Administrative functions
  admin: adminRouter,
  coordinator: coordinatorRouter,
  
  // Services and availability
  services: servicesRouter,
})

// Export the router type for client-side usage
export type AppRouter = typeof appRouter

// Export individual routers for testing purposes
export {
  authRouter,
  clientsRouter,
  caregiversRouter,
  visitsRouter,
  billingRouter,
  messagingRouter,
  documentsRouter,
  adminRouter,
  coordinatorRouter,
  servicesRouter,
}