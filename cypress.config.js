const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: "https://serverest.dev",
    setupNodeEvents(on, config) {
      // Configure o plugin grep
      require('@cypress/grep/src/plugin')(config)
      return config
    },
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: 'cypress/support/e2e.js',
    env: {
      grepFilterSpecs: true,
      grepOmitFiltered: true
    }
  },
});
