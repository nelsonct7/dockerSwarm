import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/auth-api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        rewrite: (path) => path.replace('/auth-api', ''),
        secure: false,
      },
      '/post-api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        rewrite: (path) => path.replace('/post-api', ''),
        secure: false,
      },
    },
  }
})
