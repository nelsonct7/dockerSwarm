import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/auth-api': {
        target: 'http://api-auth:3001',  // Changed to match docker-compose service name
        changeOrigin: true,
        rewrite: (path) => path.replace('/auth-api', ''),
        secure: false,
      },
      '/post-api': {
        target: 'http://api-post:3002',  // Changed to match docker-compose service name, removed /api
        changeOrigin: true,
        rewrite: (path) => path.replace('/post-api', '/api'),
        secure: false,
      },
    },
  }
})
