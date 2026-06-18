import { detectPackageManager, getShadcnCommand, printHeader, runCommand } from '../utils'

// Thin wrapper over `shadcn init` so a consumer can create the `components.json`
// that `payload-components add` requires. We intentionally do NOT run this from
// inside `add` — scaffolding shadcn/Tailwind as a side effect of installing one
// block would be a surprising, hard-to-review change. stdio is inherited so the
// user answers shadcn's prompts directly.
export const initCommand = async ({ cwd }: { cwd: string }) => {
  const packageManager = await detectPackageManager(cwd)
  const shadcn = getShadcnCommand(packageManager)

  printHeader(`payload-components: initializing shadcn in ${cwd}`)

  await runCommand({
    args: [...shadcn.args, 'init', '--cwd', cwd],
    command: shadcn.command,
    cwd,
  })

  printHeader('payload-components: shadcn initialized. Run "payload-components add <component>" next.')
}
