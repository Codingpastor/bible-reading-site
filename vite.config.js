import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  // Set base path based on environment variable or default to root for custom domain
  base: process.env.VITE_BASE || '/', 
  plugins: [react()],
})
