import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const backendURL = process.env.VITE_BACKEND_URL || "http://localhost:5000"
// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),tailwindcss()],
  server:{
    proxy:{
      '/api':{
        target: backendURL ,
        changeOrigin: true,
        secure:false
      }
    }
  }
})
