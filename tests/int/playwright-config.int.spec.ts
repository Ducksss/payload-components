import { afterEach, describe, expect, it, vi } from 'vitest'

const loadConfig = async () => {
  vi.resetModules()
  const configModule = await import('../../playwright.config')

  return configModule.default as { webServer?: unknown }
}

const getWebServer = (config: { webServer?: unknown }) => {
  expect(config.webServer).toBeTruthy()
  expect(Array.isArray(config.webServer)).toBe(false)

  return config.webServer as { reuseExistingServer?: boolean }
}

describe('playwright config', () => {
  afterEach(() => {
    vi.unstubAllEnvs()
    vi.resetModules()
  })

  it('starts its own e2e server by default', async () => {
    vi.stubEnv('PLAYWRIGHT_REUSE_SERVER', undefined)

    const config = await loadConfig()

    expect(getWebServer(config).reuseExistingServer).toBe(false)
  })

  it('allows explicit local server reuse', async () => {
    vi.stubEnv('PLAYWRIGHT_REUSE_SERVER', '1')

    const config = await loadConfig()

    expect(getWebServer(config).reuseExistingServer).toBe(true)
  })
})
