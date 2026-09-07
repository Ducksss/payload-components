import { execFileSync } from 'node:child_process'
import { appendFileSync } from 'node:fs'
import { pathToFileURL } from 'node:url'

// Only skip known site/documentation changes. Unknown paths fail conservatively
// into consumer coverage, including tooling, manifests, workflows and lockfiles.
export const needsConsumerChecks = (files) =>
  files.some((file) => {
    if (/^(src\/|content\/|messages\/|public\/|docs\/|tests\/e2e\/)/.test(file)) return false
    return !/^(README\.md|CONTRIBUTING\.md|AGENTS\.md|CLAUDE\.md|LICENSE)$/.test(file)
  })

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
