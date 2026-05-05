import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    hmr: {
      clientPort: 8080
    },
    proxy: {
      '/api': {
        target: 'https://lalachievements.com',
        changeOrigin: true,
        secure: true,
      }
    }
  }
})
