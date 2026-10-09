import { readFile } from 'node:fs/promises'
import path from 'node:path'

import semver from 'semver'
import { describe, expect, it } from 'vitest'

import {
  buildFileOnlyManifest,
  buildManifest,
  deriveComponentNames,
} from '../../tools/payload-components/commands/new'
import { listComponentNames, loadManifest } from '../../tools/payload-components/manifest'
import { repoRoot } from '../../tools/payload-components/utils'

import type { ComponentManifest, SupportMatrix } from '../../tools/payload-components/types'

/* Detection admits a project by the majors support-matrix.json allows. Each
 * component is then admitted by what its own manifest declares, through
 * assertManifestSupport and the peer check. A manifest that declares less than
 * its targets allow is refused in projects the CLI otherwise supports:
 * related-posts landed declaring Payload 3 only while every other component
 * accepted Payload 4. A manifest that declares more advertises support that
 * detection refuses. So every manifest, and everything that writes manifests,
 * must name exactly its targets' majors, with peer ranges that admit them. */

type ManifestSupport = Pick<
  ComponentManifest,
  'name' | 'peerDependencies' | 'supportedTargets' | 'supports'
>

const readJson = async <T>(...segments: string[]) =>
  JSON.parse(await readFile(path.join(repoRoot, ...segments), 'utf8')) as T

const readSupportMatrix = () => readJson<SupportMatrix>('payload-components', 'support-matrix.json')

const sortedMajors = (lists: number[][]) =>
  [...new Set(lists.flat())].sort((left, right) => left - right)

const supportProblems = (matrix: SupportMatrix, manifest: ManifestSupport) => {
  const problems: string[] = []
  const targets = manifest.supportedTargets.flatMap((id) => {
    const target = matrix.targets.find((entry) => entry.id === id)

    if (!target) problems.push(`names unknown target "${id}"`)

    return target ? [target] : []
  })
  const allowed = {
    next: sortedMajors(targets.map((target) => target.allowedNextMajors)),
    payload: sortedMajors(targets.map((target) => target.allowedPayloadMajors)),
  }
  const declared = {
    next: sortedMajors([manifest.supports.nextMajors]),
    payload: sortedMajors([manifest.supports.payloadMajors]),
  }

  for (const dependency of ['payload', 'next'] as const) {
    const label = dependency === 'payload' ? 'payloadMajors' : 'nextMajors'

    if (JSON.stringify(declared[dependency]) !== JSON.stringify(allowed[dependency])) {
      problems.push(
        `supports.${label} is ${JSON.stringify(declared[dependency])}, but its targets allow ${JSON.stringify(allowed[dependency])}`,
      )
    }

    const range = manifest.peerDependencies[dependency]

    if (!range) {
      problems.push(`peerDependencies.${dependency} is missing`)
      continue
    }

    /* Admitting a major means covering its whole stable line. */
    for (const major of allowed[dependency]) {
      if (!semver.subset(`^${major}.0.0`, range)) {
        problems.push(
          `peerDependencies.${dependency} "${range}" does not admit ${dependency} ${major}`,
        )
      }
    }
  }

  /* The newest Payload major must also admit its prereleases: create-payload-app
   * pins exact canaries and betas, and the CLI's peer check accepts them. */
  const newest = allowed.payload.at(-1)
  const payloadRange = manifest.peerDependencies.payload

  if (
    newest !== undefined &&
    payloadRange &&
    !semver.subset(`^${newest}.0.0-0`, payloadRange, { includePrerelease: true })
  ) {
    problems.push(
      `peerDependencies.payload "${payloadRange}" does not admit Payload ${newest} prereleases`,
    )
  }

  return problems
}

describe('manifests agree with the support matrix', () => {
  it('every manifest supports exactly the Payload and Next.js majors its targets allow', async () => {
    const matrix = await readSupportMatrix()
    const problems: Record<string, string[]> = {}

    for (const name of await listComponentNames()) {
      const found = supportProblems(matrix, await loadManifest(name))

      if (found.length) problems[name] = found
    }

    expect(problems).toEqual({})
  })

  it('the component template agrees with the support matrix', async () => {
    const template = await readJson<ManifestSupport>(
      'payload-components',
      'component-template',
      'manifest.json',
    )

    expect(supportProblems(await readSupportMatrix(), template)).toEqual([])
  })

  it('manifests written by `new` agree with the support matrix', async () => {
    const scaffolded = JSON.parse(
      buildManifest(deriveComponentNames('support-matrix-guard')),
    ) as ManifestSupport

    expect(supportProblems(await readSupportMatrix(), scaffolded)).toEqual([])
  })

  it('manifests written by `new --file-only` agree with the support matrix', async () => {
    const matrix = await readSupportMatrix()
    const scaffolded = JSON.parse(
      buildFileOnlyManifest(deriveComponentNames('support-matrix-guard'), matrix),
    ) as ManifestSupport

    expect(supportProblems(matrix, scaffolded)).toEqual([])
  })

  it('flags a manifest that stops short of a major its targets allow', async () => {
    /* The shape related-posts landed with. Kept as a fixture so the guard
       above can never pass vacuously. */
    const problems = supportProblems(await readSupportMatrix(), {
      name: 'v3-only',
      peerDependencies: { next: '^15.0.0 || ^16.0.0', payload: '^3.0.0' },
      supportedTargets: ['payload-website-starter', 'payload-blocks-app'],
      supports: { nextMajors: [15, 16], payloadMajors: [3] },
    })

    expect(problems).toEqual(
      expect.arrayContaining([
        expect.stringContaining('supports.payloadMajors is [3], but its targets allow [3,4]'),
        expect.stringContaining('peerDependencies.payload "^3.0.0" does not admit payload 4'),
        expect.stringContaining('does not admit Payload 4 prereleases'),
      ]),
    )
  })
})
