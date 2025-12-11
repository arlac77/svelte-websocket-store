// @ts-check
import { defineConfig, devices } from "@playwright/test";

const BASE="http://localhost:5173/";

export default defineConfig({
  testDir: "./tests/playwright",
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: "html",
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    baseURL: BASE,
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: "on-first-retry"
  },

  projects: [
    /*{
      name: "chromium",
      use: { ...devices["Desktop Chrome"] }
    },
    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] }
    },*/
    {
      name: "webkit",
      use: { ...devices["Desktop Safari"] }
    }
  ],

  webServer: {
    command: "npx vite",
    url: BASE,
    reuseExistingServer: !process.env.CI
  }
});
