import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  // GitHub Pages serves this project from a repository subpath. Keep the
  // development server at the domain root unless a base path is supplied.
  base: process.env.VITE_BASE_PATH || '/',
  plugins: [react()],
  server: {
    open: true,
  }
})
