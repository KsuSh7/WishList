import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import istanbul from 'vite-plugin-istanbul'


// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    istanbul({
      include: 'src/**/*',
      exclude: ['node_modules', 'cypress'],
      extension: ['.js', '.jsx'],
    }),
  ],
  resolve: {
    alias: {
      '../hooks/useAuth': '/cypress/mocks/useAuth.jsx',
      '../hooks/useFetchData': '/cypress/mocks/useFetchData.jsx',
    },
  },

})

