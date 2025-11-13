export { PrismaClient } from '@prisma/client'
export * from '@prisma/client'

// Re-export utils
export * from './utils'

// Re-export Supabase client
import { createClient } from '@supabase/supabase-js'
export { createClient }

// Database configuration
export const databaseConfig = {
  url: process.env.DATABASE_URL!,
  supabase: {
    url: process.env.SUPABASE_URL!,
    anonKey: process.env.SUPABASE_ANON_KEY!,
    serviceKey: process.env.SUPABASE_SERVICE_KEY!,
  }
}

// Create Supabase client instances
export const supabaseClient = createClient(
  databaseConfig.supabase.url,
  databaseConfig.supabase.anonKey
)

export const supabaseAdmin = createClient(
  databaseConfig.supabase.url,
  databaseConfig.supabase.serviceKey
)
