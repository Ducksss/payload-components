import { defineConfig, devices } from '@playwright/test'

const e2ePort = process.env.E2E_PORT ?? '3100'

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests/e2e',
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Keep one Fumadocs app server for deterministic route and copy-button checks. */
  workers: 1,
  timeout: 180000,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'], channel: 'chromium' },
    },
  ],
  webServer: {
    command: 'pnpm dev',
    env: {
      NEXT_PUBLIC_SITE_URL: `http://localhost:${e2ePort}`,
      PORT: e2ePort,
    },
    reuseExistingServer: false,
    url: `http://localhost:${e2ePort}`,
  },
})
