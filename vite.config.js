import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import Dotenv from 'dotenv';

Dotenv.config();

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
})
