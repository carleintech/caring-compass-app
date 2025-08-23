// Export all schema collections
export * from './shared'
export * from './auth'
export * from './clients'
export * from './caregivers'
export * from './visits'
export * from './billing'
export * from './messaging'
export * from './documents'

// Re-export specific schema objects for convenience
export { schemas } from './shared'
export { authSchemas } from './auth'
export { clientSchemas } from './clients'
export { caregiverSchemas } from './caregivers'
export { visitSchemas } from './visits'
export { billingSchemas } from './billing'
export { messagingSchemas } from './messaging'
export { documentSchemas } from './documents'