import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // server: {
  //   host: 'localhost.cadent.tv',
  //   allowedHosts: [".cadent.tv"],
  //   port: 3000
  // }
})
