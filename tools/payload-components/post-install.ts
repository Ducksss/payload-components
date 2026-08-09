import type { PackageManager } from './types'

import { getRunScriptCommand, runCommand } from './utils'

/* Payload's generate:types / generate:importmap boot the config, which reads
 * required env even though nothing here touches a database. Supply inert
 * placeholders so a consumer without a populated .env still regenerates, while
 * letting real values win when they are already set. */
export const getPostInstallEnv = (): NodeJS.ProcessEnv => ({
  ...process.env,
  CRON_SECRET: process.env.CRON_SECRET ?? 'payload-components-poc-cron-secret',
  NEXT_PUBLIC_SERVER_URL: process.env.NEXT_PUBLIC_SERVER_URL ?? 'http://localhost:3000',
  PAYLOAD_SECRET: process.env.PAYLOAD_SECRET ?? 'payload-components-poc-secret',
  POSTGRES_URL: process.env.POSTGRES_URL ?? 'postgres://127.0.0.1:5432/payload-components-poc',
  PREVIEW_SECRET: process.env.PREVIEW_SECRET ?? 'payload-components-poc-preview-secret',
})

export const runPostInstallScript = async ({
  cwd,
  packageManager,
  script,
}: {
  cwd: string
  packageManager: PackageManager
  script: string
}) => {
  const command = getRunScriptCommand(packageManager, script)

  await runCommand({
    args: command.args,
    command: command.command,
    cwd,
    env: getPostInstallEnv(),
  })
}
