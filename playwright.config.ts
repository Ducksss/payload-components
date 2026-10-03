import { defineConfig, devices } from '@playwright/test'

import { googleTagDomains } from './tests/e2e/support/consent'

const e2ePort = process.env.E2E_PORT ?? '3100'
const webServerCommand =
  process.env.PLAYWRIGHT_SERVER_MODE === 'production' ? 'pnpm start' : 'pnpm dev'
/* A backstop behind the GA4 gate and the stubs in tests/e2e/support/consent.ts: Chromium
   resolves Google's analytics hosts to nothing, so even a spec that mounted the
   real tag could not send a hit to the production property. A route fulfilled
   locally never needs DNS, so the stubs keep working. */
const unresolvedGoogleTagHosts = googleTagDomains
  .flatMap((domain) => [`MAP ${domain} ~NOTFOUND`, `MAP *.${domain} ~NOTFOUND`])
  .join(', ')

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
      use: {
        ...devices['Desktop Chrome'],
        channel: 'chromium',
        launchOptions: { args: [`--host-resolver-rules=${unresolvedGoogleTagHosts}`] },
      },
    },
    /* WebKit runs ONLY the `webkit-*` guards, never the whole suite. The visual
       baselines are per-project, so a full second engine would mean a second
       committed baseline set on both platforms and a materially longer gate.
       These guards deliberately assert measurable invariants instead of pixels,
       so they need no baselines and cost one page load — enough to catch the
       class of bug that reaches iOS while every Chromium baseline stays green.
       The chromium project intentionally does NOT ignore them: running the same
       assertions in both engines is what proves they track real drift. */
    {
      name: 'webkit',
      testMatch: /webkit-[^/\\]*\.e2e\.spec\.ts$/,
      use: { ...devices['Desktop Safari'] },
    },
  ],
  webServer: {
    command: webServerCommand,
    env: {
      NEXT_PUBLIC_SITE_URL: `http://localhost:${e2ePort}`,
      NODE_ENV: 'development',
      PORT: e2ePort,
    },
    reuseExistingServer: false,
    url: `http://localhost:${e2ePort}`,
  },
})
