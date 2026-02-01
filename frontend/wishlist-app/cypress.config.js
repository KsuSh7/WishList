import { defineConfig } from 'cypress'
import react from '@vitejs/plugin-react'
import codeCoverageTask from '@cypress/code-coverage/task'

export default defineConfig({
  component: {
    devServer: {
      framework: 'react',
      bundler: 'vite',
      viteConfig: {
        plugins: [react()]
      },
    },
    setupNodeEvents(on, config) {
      codeCoverageTask(on, config)
      return config
    },
  },

  e2e: {
    baseUrl: 'http://localhost:5173',
    supportFile: 'cypress/support/e2e.js',
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    setupNodeEvents(on, config) {
      codeCoverageTask(on, config)
      return config
    },
  },
})
