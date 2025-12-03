import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

const CACHE_VERSION = Date.now().toString()

export default defineConfig({
  plugins: [react()],
  base: './',
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
