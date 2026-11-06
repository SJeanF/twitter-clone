import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ command }) => ({
  plugins: [react()],
  // No build, os arquivos são servidos em /static/; no dev, continua na raiz
  base: command === 'build' ? '/static/' : '/',
  build: {
    outDir: '../backend/frontend_dist',
    emptyOutDir: true,
  },
  server: {
    proxy: {
      '/api': 'http://127.0.0.1:8000',
      '/media': 'http://127.0.0.1:8000',
    },
  },
}))