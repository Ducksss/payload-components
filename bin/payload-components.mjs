#!/usr/bin/env node

import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const isContributorCommand = process.argv[2] === 'new'
const cliPath = fileURLToPath(
  new URL(
    isContributorCommand
      ? '../tools/payload-components/contributor-cli.ts'
      : '../tools/payload-components/cli.ts',
    import.meta.url,
  ),
)
const tsxLoader = import.meta.resolve('tsx/esm')
const forwardedArgs = isContributorCommand ? process.argv.slice(3) : process.argv.slice(2)

const result = spawnSync(process.execPath, ['--import', tsxLoader, cliPath, ...forwardedArgs], {
  env: process.env,
  stdio: 'inherit',
})

if (result.error) {
  throw result.error
}

process.exit(result.status ?? 1)
