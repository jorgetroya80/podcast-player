import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'
import tailwindcss from '@tailwindcss/vite'

const PORT = 3000

// https://vite.dev/config/
export default defineConfig({
  base: '/podcast-player/',  // For GitHub Pages
  plugins: [react(), tailwindcss()],
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
})
