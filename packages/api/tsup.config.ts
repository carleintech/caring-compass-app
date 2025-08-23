import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  noExternal: ['@caring-compass/database', '@caring-compass/auth'],
  format: ['cjs', 'esm'],
  dts: false,
  splitting: false,
  sourcemap: true,
  clean: true,
  external: [
    '@prisma/client',
    '@supabase/supabase-js',
    'react',
    'next/server'
  ],
  outDir: 'dist',
  target: 'node18',
  platform: 'node'
})