import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  // Set base path to root for custom domain deployment
  base: '/', 
  plugins: [react()],
})
