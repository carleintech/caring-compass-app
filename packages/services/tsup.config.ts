import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: false, // Temporarily disable DTS generation
  splitting: false,
  sourcemap: true,
  clean: true,
  external: [
    '@caring-compass/database',
    '@caring-compass/auth',
    '@caring-compass/api',
    '@prisma/client',
    '@supabase/supabase-js',
    'bullmq',
    'ioredis',
    'stripe',
    'twilio',
    '@sendgrid/mail',
    'resend',
    'sharp',
    'pdf-lib',
    'node-cron',
    'dotenv'
  ],
  outDir: 'dist',
  target: 'node18',
  platform: 'node'
})
