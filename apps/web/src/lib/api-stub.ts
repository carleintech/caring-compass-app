// Stub for @caring-compass/api
export const api = {
  // Add minimal API exports here
}

export const appRouter = {
  // Mock TRPC router
  _def: {
    procedures: {},
  },
}

export function createTRPCContext(opts: any) {
  return {
    // Mock context
    req: opts.req,
    res: opts.res,
  }
}

export default api
