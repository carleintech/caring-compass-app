// Main router export
export { appRouter, type AppRouter } from './routers'

// Individual routers for testing/modularity
export {
  authRouter,
  clientsRouter,
  caregiversRouter,
  visitsRouter,
  billingRouter,
  messagingRouter,
  documentsRouter,
  adminRouter
} from './routers'

// tRPC configuration
export { createTRPCContext } from './trpc/context'
export type { BaseContext, ProtectedContext, AuditContext } from './trpc/context'
export { 
  createTRPCRouter as router,
  publicProcedure, 
  protectedProcedure,
  adminProcedure,
  staffProcedure,
  caregiverProcedure,
  clientProcedure,
  createPermissionProcedure,
  createAuditedProcedure,
  createRateLimitedProcedure,
  createCRUDProcedures,
  handleDatabaseError,
  createPaginationQuery,
  createPaginatedResponse,
  checkResourceAccess,
  t
} from './trpc/trpc'

// Schemas for client-side validation
export * from './schemas'
