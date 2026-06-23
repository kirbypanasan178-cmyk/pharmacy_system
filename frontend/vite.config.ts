import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['leaflet'],
  },
  server: {
  proxy: {
    "/api": "http://localhost:2000"  // your PORT from .env
  }
}

})
