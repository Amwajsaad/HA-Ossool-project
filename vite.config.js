import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import Dotenv from 'dotenv';

Dotenv.config();

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    strictPort: true
  },
})