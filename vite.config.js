import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'node:url'

const cachedElements = fileURLToPath(new URL('./vendor/harbor-elements/', import.meta.url))

// https://vite.dev/config/
export default defineConfig({
  // GitHub Pages serves this project from a repository subpath. Keep the
  // development server at the domain root unless a base path is supplied.
  base: process.env.VITE_BASE_PATH || '/',
  plugins: [react()],
  resolve: {
    // Keep the documented Elements imports while using the committed snapshot.
    alias: [
      { find: /^@harbor\/elements$/, replacement: `${cachedElements}dist/harbor-elements/index.esm.js` },
      { find: /^@harbor\/elements\/(utils|icons)$/, replacement: `${cachedElements}$1/index.js` },
      { find: /^@harbor\/elements\/styles\.css$/, replacement: `${cachedElements}dist/harbor-elements/harbor-elements.css` },
      { find: /^@harbor\/elements\/styles\//, replacement: `${cachedElements}dist/harbor-elements/styles/` },
      { find: /^@harbor\/elements\/(utils|icons|dist)\//, replacement: `${cachedElements}$1/` },
      { find: /^@harbor\/elements\/(.+)$/, replacement: `${cachedElements}dist/components/define/$1` },
    ],
  },
  server: {
    open: true,
  }
})
