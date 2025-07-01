import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: '0.0.0.0',
    port: 5173,
    allowedHosts: [
      '23e009ab-c82d-4a67-bb54-6fb5fb947bf1-00-3lrhwp5re8loc.pike.replit.dev',
      '.replit.dev'
    ]
  }, 
  base:'weiguo-personal-website'
})

