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
import {
  getPayloadMajorSupport,
  pairedNextMajors,
} from '../../tools/payload-components/support-matrix'
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

/* Payload and Next.js majors are not a cross product. Payload 4 needs Next.js
 * 16.2.6 or newer and dropped Next.js 15, so each target narrows its Next.js
 * majors per Payload major through payloadMajorSupport, which detection,
 * assertManifestSupport, doctor, and the docs all read. The lists stay
 * internally consistent: a pairing may only name majors its target allows, and
 * every allowed Next.js major must pair with some Payload major. */
const pairingProblems = (matrix: SupportMatrix) => {
  const problems: string[] = []

  for (const target of matrix.targets) {
    for (const [key, support] of Object.entries(target.payloadMajorSupport ?? {})) {
      const where = `${target.id}: Payload ${key}`

      if (!target.allowedPayloadMajors.includes(Number(key))) {
        problems.push(`${where} is not in allowedPayloadMajors`)
      }

      if (support.nextMajors.length === 0) {
        problems.push(`${where} pairs with no Next.js major`)
      }

      for (const nextMajor of support.nextMajors) {
        if (!target.allowedNextMajors.includes(nextMajor)) {
          problems.push(`${where} pairs with Next.js ${nextMajor}, which allowedNextMajors omits`)
        }
      }

      const { next, node } = support.minimumVersions ?? {}

      if (
        next !== undefined &&
        !(semver.valid(next) && support.nextMajors.includes(semver.major(next)))
      ) {
        problems.push(`${where} sets minimum Next.js ${next}, outside its paired majors`)
      }

      if (node !== undefined && !semver.valid(node)) {
        problems.push(`${where} sets minimum Node.js ${node}, which is not a version`)
      }
    }

    const paired = sortedMajors(
      target.allowedPayloadMajors.map((major) => pairedNextMajors(target, major)),
    )

    if (JSON.stringify(paired) !== JSON.stringify(sortedMajors([target.allowedNextMajors]))) {
      problems.push(
        `${target.id}: allowedNextMajors is ${JSON.stringify(target.allowedNextMajors)}, but its Payload majors pair with ${JSON.stringify(paired)}`,
      )
    }
  }

  return problems
}

describe('Payload and Next.js majors pair per Payload major', () => {
  it('keeps every pairing inside the majors its target allows', async () => {
    expect(pairingProblems(await readSupportMatrix())).toEqual([])
  })

  it('pairs Payload 4 with Next.js 16 only and keeps Next.js 15 and 16 for Payload 3', async () => {
    /* The Payload 4 spike's findings. Changing them is a support decision, so it
       has to show up here. */
    for (const target of (await readSupportMatrix()).targets) {
      expect({ 3: pairedNextMajors(target, 3), 4: pairedNextMajors(target, 4) }, target.id).toEqual(
        { 3: [15, 16], 4: [16] },
      )
      expect(getPayloadMajorSupport(target, 3)?.experimental, target.id).toBeFalsy()
      expect(getPayloadMajorSupport(target, 4), target.id).toMatchObject({
        experimental: true,
        minimumVersions: { next: '16.2.6', node: '24.15.0' },
      })
    }
  })

  it('admits each Payload major’s minimum Next.js version in every manifest peer range', async () => {
    const matrix = await readSupportMatrix()
    const problems: string[] = []

    for (const name of await listComponentNames()) {
      const manifest = await loadManifest(name)
      const targets = matrix.targets.filter(({ id }) => manifest.supportedTargets.includes(id))

      for (const target of targets) {
        for (const payloadMajor of target.allowedPayloadMajors) {
          const minimum = getPayloadMajorSupport(target, payloadMajor)?.minimumVersions?.next

          if (minimum && !semver.satisfies(minimum, manifest.peerDependencies.next ?? '')) {
            problems.push(
              `${name}: peerDependencies.next "${manifest.peerDependencies.next}" excludes Next.js ${minimum}, the Payload ${payloadMajor} minimum`,
            )
          }
        }
      }
    }

    expect(problems).toEqual([])
  })

  it('reads a target without payloadMajorSupport as the cross product', () => {
    /* A matrix written before the field existed keeps its meaning. */
    const target = {
      allowedNextMajors: [15, 16],
      allowedPayloadMajors: [3, 4],
      description: 'v2 matrix',
      hostFiles: {
        pagesLayout: { anchors: [], candidates: [] },
        renderBlocks: { anchors: [], candidates: [] },
      },
      id: 'v2-target',
      requiredFiles: [],
    }

    expect(pairedNextMajors(target, 3)).toEqual([15, 16])
    expect(pairedNextMajors(target, 4)).toEqual([15, 16])
    expect(pairedNextMajors(target, 5)).toEqual([])
    expect(pairingProblems({ targets: [target], version: 2 })).toEqual([])
  })

  it('flags a pairing that names majors its target does not allow', async () => {
    /* Kept as a fixture so the pairing guard above can never pass vacuously. */
    const [target] = (await readSupportMatrix()).targets

    expect(
      pairingProblems({
        targets: [
          {
            ...target,
            payloadMajorSupport: {
              '3': { nextMajors: [16] },
              '4': { minimumVersions: { next: '15.5.0' }, nextMajors: [16, 17] },
              '5': { nextMajors: [] },
            },
          },
        ],
        version: 2,
      }),
    ).toEqual(
      expect.arrayContaining([
        expect.stringContaining('Payload 4 pairs with Next.js 17, which allowedNextMajors omits'),
        expect.stringContaining('Payload 4 sets minimum Next.js 15.5.0, outside its paired majors'),
        expect.stringContaining('Payload 5 is not in allowedPayloadMajors'),
        expect.stringContaining('Payload 5 pairs with no Next.js major'),
        expect.stringContaining('but its Payload majors pair with [16]'),
      ]),
    )
  })
})
