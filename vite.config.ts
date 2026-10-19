import babel from '@rolldown/plugin-babel'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

const PORT = 3000

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  base: '/podcast-player/', // For GitHub Pages
  // React Compiler only outside Vitest: its memo cache adds branches that a single render never
  // takes, which would make V8 branch coverage measure the generated code instead of ours.
  plugins: [react(), ...(mode === 'test' ? [] : [babel({ presets: [reactCompilerPreset()] })])],
  server: {
    port: PORT,
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    coverage: {
      thresholds: {
        statements: 85,
        branches: 85,
        functions: 85,
        lines: 85,
      },
    },
  },
}))
