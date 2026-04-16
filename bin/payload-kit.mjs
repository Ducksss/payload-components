#!/usr/bin/env node

import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const cliPath = fileURLToPath(new URL('../tools/payload-kit/cli.ts', import.meta.url))

const result = spawnSync(process.execPath, ['--import', 'tsx/esm', cliPath, ...process.argv.slice(2)], {
  env: process.env,
  stdio: 'inherit',
})

if (result.error) {
  throw result.error
}

process.exit(result.status ?? 1)
