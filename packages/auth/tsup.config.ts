import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: false,
  splitting: false,
  sourcemap: true,
  clean: true,
  external: ['@caring-compass/database', 'react', 'next'],
  esbuildOptions(options) {
    options.jsx = 'transform'
    options.jsxFactory = 'React.createElement'
    options.jsxFragment = 'React.Fragment'
    options.loader = {
      ...options.loader,
      '.tsx': 'tsx',
      '.ts': 'ts'
    }
  }
})
