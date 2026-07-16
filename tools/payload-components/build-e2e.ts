import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { repoRoot, runCommand } from './utils'

export const getE2ESiteUrl = (port = process.env.E2E_PORT ?? '3100') =>
  `http://localhost:${port}`

export const buildForProductionE2E = async () => {
  const siteUrl = getE2ESiteUrl()

  process.stdout.write(`Building production E2E site for ${siteUrl}.\n`)
  await runCommand({
    args: ['build'],
    command: 'pnpm',
    cwd: repoRoot,
    env: {
      ...process.env,
      NEXT_PUBLIC_SITE_URL: siteUrl,
    },
    timeoutMs: 20 * 60 * 1000,
  })
}

const isMain = () =>
  process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)

if (isMain()) {
  buildForProductionE2E().catch((error) => {
    console.error(error)
    process.exitCode = 1
  })
}
