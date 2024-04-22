import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/src',
    }
  },
  "server": {
    "proxy": {
      "/api": {
        "target": "http://localhost:2111",
        "changeOrigin": true,
        "secure": false
      }
    }
  }
})
