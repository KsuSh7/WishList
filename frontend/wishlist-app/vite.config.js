import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import istanbul from 'vite-plugin-istanbul'

export default defineConfig({
  plugins: [
    react(),
    istanbul({
      include: 'src/**/*.{js,jsx}',
      exclude: ['node_modules', 'cypress'],
      extension: ['.js', '.jsx'],
      cypress: true,
      requireEnv: false,
    }),
  ],
})
