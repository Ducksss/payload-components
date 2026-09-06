import { newCommand } from './commands/new'
import { withProjectMutationLock } from './project-lock'
import { repoRoot } from './utils'

/* Repository-only tooling lives outside the published command router. The
 * local bin dispatches `pnpm payload-components new ...` here, while dist/cli.js
 * exposes only commands that make sense in a consumer project. */
const run = async () => {
  const [componentSlug, ...extra] = process.argv.slice(2)

  if (!componentSlug) {
    throw new Error(
      'payload-components new requires a component name. Try "payload-components new hero-split".',
    )
  }

  if (extra.length > 0) {
    throw new Error('payload-components new accepts exactly one component name.')
  }

  await withProjectMutationLock({
    cwd: repoRoot,
    operation: `new ${componentSlug}`,
    run: () => newCommand({ componentSlug }),
  })
}

run().catch((error) => {
  const message = error instanceof Error ? error.message : 'Unknown error'
  process.stderr.write(`payload-components: ${message}\n`)
  process.exitCode = 1
})
