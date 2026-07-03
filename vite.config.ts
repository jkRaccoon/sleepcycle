import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const SUBDIR = process.env.BUILD_TARGET === 'subdir';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: SUBDIR ? '/tools/sleepcycle/' : '/',
})
