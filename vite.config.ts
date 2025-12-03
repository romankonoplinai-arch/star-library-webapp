import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { execSync } from 'child_process'

// Use git commit hash + timestamp for cache busting
const getGitHash = () => {
  try {
    return execSync('git rev-parse --short HEAD').toString().trim()
  } catch {
    return 'dev'
  }
}

const CACHE_VERSION = `${getGitHash()}-${Date.now()}`

export default defineConfig({
  plugins: [react()],
  base: '/star-library-webapp/',
  define: {
    '__CACHE_VERSION__': JSON.stringify(CACHE_VERSION)
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'esbuild',
    target: 'es2020',
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'animation': ['framer-motion'],
        }
      }
    },
    chunkSizeWarningLimit: 200
  },
  server: { port: 5173, host: true }
})
