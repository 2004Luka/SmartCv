import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file from the parent directory
  const env = loadEnv(mode, path.resolve(__dirname, '..'), '')
  
  return {
    plugins: [react()],
    define: {
      // Define all environment variables that should be available in the frontend
      'process.env': {
        VITE_API_URL: JSON.stringify(env.VITE_API_URL?.replace(/"/g, '')),
        NODE_ENV: JSON.stringify(mode)
      }
    },
    server: {
      port: 5173,
      proxy: {
        '/api': {
          target: env.VITE_API_URL?.replace(/"/g, ''),
          changeOrigin: true,
          secure: false
        }
      }
    }
  }
})
