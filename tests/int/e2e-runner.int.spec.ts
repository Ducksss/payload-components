import path from 'node:path'

import { describe, expect, it, vi } from 'vitest'

import playwrightConfig from '../../playwright.config'
import {
  buildE2eBatches,
  buildE2eInvocation,
  discoverE2eSpecs,
  runE2e,
} from '../../tools/run-e2e'

describe('e2e runner batches', () => {
  it('starts Next in an explicit development environment', () => {
    expect(playwrightConfig.webServer).toMatchObject({
      env: {
        NODE_ENV: 'development',
      },
    })
  })

  it('isolates the memory-heavy frontend and visual route walks', () => {
    expect(
      buildE2eBatches([], [
        'tests/e2e/a11y.e2e.spec.ts',
        'tests/e2e/components-visual.e2e.spec.ts',
        'tests/e2e/frontend.e2e.spec.ts',
        'tests/e2e/future-regression.e2e.spec.ts',
        'tests/e2e/geo.e2e.spec.ts',
      ]),
    ).toEqual([
      {
        args: ['tests/e2e/frontend.e2e.spec.ts'],
        name: 'frontend',
      },
      {
        args: ['tests/e2e/components-visual.e2e.spec.ts'],
        name: 'visual',
      },
      {
        args: [
          'tests/e2e/a11y.e2e.spec.ts',
          'tests/e2e/future-regression.e2e.spec.ts',
          'tests/e2e/geo.e2e.spec.ts',
        ],
        name: 'remaining',
      },
    ])
  })

  it('discovers every e2e spec in the repository test directory', async () => {
    await expect(discoverE2eSpecs(process.cwd())).resolves.toEqual([
      'tests/e2e/a11y.e2e.spec.ts',
      'tests/e2e/components-visual.e2e.spec.ts',
      'tests/e2e/frontend.e2e.spec.ts',
      'tests/e2e/geo.e2e.spec.ts',
    ])
  })

  it('keeps caller filters and snapshot flags in one Playwright invocation', () => {
    expect(buildE2eBatches(['components-visual', '--update-snapshots'], [])).toEqual([
      {
        args: ['components-visual', '--update-snapshots'],
        name: 'requested',
      },
    ])
  })

  it('invokes the resolved local Playwright CLI without a shell', () => {
    const invocation = buildE2eInvocation(
      {
        args: ['components-visual', '--update-snapshots'],
        name: 'requested',
      },
      {
        NODE_ENV: 'test',
        NODE_OPTIONS: '--trace-warnings',
        PLAYWRIGHT_HTML_OUTPUT_DIR: 'custom-report',
      },
      '/workspace/node_modules/@playwright/test/cli.js',
    )

    expect(invocation).toMatchObject({
      args: [
        '/workspace/node_modules/@playwright/test/cli.js',
        'test',
        '--config=playwright.config.ts',
        'components-visual',
        '--update-snapshots',
      ],
      command: process.execPath,
      options: {
        env: {
          NODE_OPTIONS: '--trace-warnings --no-deprecation',
          PLAYWRIGHT_HTML_OPEN: 'never',
          PLAYWRIGHT_HTML_OUTPUT_DIR: 'custom-report',
        },
        shell: false,
        stdio: 'inherit',
      },
    })
  })

  it('stops after the first failed batch and surfaces its exit code', async () => {
    const runInvocation = vi
      .fn()
      .mockResolvedValueOnce(undefined)
      .mockRejectedValueOnce(new Error('Playwright batch "visual" exited with code 2.'))

    await expect(
      runE2e([], {
        playwrightCli: path.join('/workspace', 'playwright-cli.js'),
        runInvocation,
        specFiles: [
          'tests/e2e/a11y.e2e.spec.ts',
          'tests/e2e/components-visual.e2e.spec.ts',
          'tests/e2e/frontend.e2e.spec.ts',
          'tests/e2e/geo.e2e.spec.ts',
        ],
      }),
    ).rejects.toThrow('Playwright batch "visual" exited with code 2.')

    expect(runInvocation).toHaveBeenCalledTimes(2)
  })
})
