import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: 'localhost'
  },
  root: '.',
  // Remove esbuild loader override, not needed if all JSX is in .jsx files
})