import { execFileSync } from 'node:child_process'
import { appendFileSync } from 'node:fs'
import { pathToFileURL } from 'node:url'

// Only skip known site/documentation changes. Unknown paths fail conservatively
// into consumer coverage, including tooling, manifests, workflows and lockfiles.
// Add a path only when neither the published CLI nor the fresh-Payload smoke reads it.
const siteOnlyPrefix = /^(src|content|messages|public|docs|rfcs|tests\/e2e)\//
const siteOnlyRootFile =
  /^((README|CONTRIBUTING|AGENTS|CLAUDE|ROADMAP|DESIGN|SECURITY|CODE_OF_CONDUCT)\.md|LICENSE)$/

export const needsConsumerChecks = (files) =>
  files.some((file) => !siteOnlyPrefix.test(file) && !siteOnlyRootFile.test(file))

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const files = execFileSync(
    'git',
    ['diff', '--name-only', '--no-renames', '-z', process.env.BASE_SHA, process.env.HEAD_SHA],
    { encoding: 'utf8' },
  )
    .split('\0')
    .filter(Boolean)
  appendFileSync(process.env.GITHUB_OUTPUT, `consumer=${needsConsumerChecks(files)}\n`)
}
