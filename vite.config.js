import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'esbuild',
  },
  define: {
    'process.env': process.env,
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.js',
    css: false,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'text-summary'],
      include: ['src/**/*.{js,jsx}'],
      exclude: ['src/main.jsx', 'src/test/**'],
      thresholds: {
        lines: 99,
        statements: 99,
        functions: 99,
        branches: 99,
        // KosmoScoutPage's data fetch is still a hardcoded placeholder
        // (see its source comments) -- its catch/error branch is
        // genuinely unreachable until a real API call replaces it.
        'src/pages/KosmoScoutPage.jsx': {
          lines: 90,
          statements: 90,
          functions: 99,
          branches: 60,
        },
      },
    },
  },
})
