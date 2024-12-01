import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/auth-api': {
        target: 'http://api-auth:3001',
        changeOrigin: true,
        rewrite: (path) => path.replace('/auth-api', ''),
        secure: false,
      },
      '/post-api': {
        target: 'http://api-node:3002/api',
        changeOrigin: true,
        rewrite: (path) => path.replace('/post-api', ''),
        secure: false,
      },
    },
  }
})
