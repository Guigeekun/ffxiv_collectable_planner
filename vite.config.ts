import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    hmr: {
      clientPort: 8080
    },
    proxy: {
      // FFXIV Collect character search is an HTML site endpoint (no CORS),
      // so it goes through the same-origin proxy. The JSON API is called
      // directly (CORS is open there).
      '/characters': {
        target: 'https://ffxivcollect.com',
        changeOrigin: true,
        secure: true,
      }
    }
  }
})
