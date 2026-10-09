import { newCommand } from './commands/new'
import { withProjectMutationLock } from './project-lock'
import { repoRoot } from './utils'

/* Repository-only tooling lives outside the published command router. The
 * local bin dispatches `pnpm payload-components new ...` here, while dist/cli.js
 * exposes only commands that make sense in a consumer project. */
/* `--file-only` scaffolds an article template component (installMode 'file-only',
 * like post-hero or related-posts) instead of the default Pages block. */
const FILE_ONLY_FLAG = '--file-only'

const run = async () => {
  const args = process.argv.slice(2)
  const fileOnly = args.includes(FILE_ONLY_FLAG)
  const positional = args.filter((arg) => arg !== FILE_ONLY_FLAG)
  const unknownFlag = positional.find((arg) => arg.startsWith('-'))

  if (unknownFlag) {
    throw new Error(
      `payload-components new does not accept "${unknownFlag}". Its only option is ${FILE_ONLY_FLAG}.`,
    )
  }

  const [componentSlug, ...extra] = positional

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
    operation: `new ${componentSlug}${fileOnly ? ` ${FILE_ONLY_FLAG}` : ''}`,
    run: () => newCommand({ componentSlug, fileOnly }),
  })
}

run().catch((error) => {
  const message = error instanceof Error ? error.message : 'Unknown error'
  process.stderr.write(`payload-components: ${message}\n`)
  process.exitCode = 1
})
