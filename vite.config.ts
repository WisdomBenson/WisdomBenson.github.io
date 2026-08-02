import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import { fileURLToPath } from 'node:url'

// https://vite.dev/config/
const projectRoot = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  base: '/',
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(projectRoot, 'index.html'),
        blog: path.resolve(projectRoot, 'blog/index.html'),
      },
    },
  },
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(projectRoot, './src'),
    },
  },
})
