import { readdir, readFile } from 'node:fs/promises'
import path from 'node:path'

import { describe, expect, it } from 'vitest'

import { loadManifest } from '../../tools/payload-components/manifest'

const repoRoot = process.cwd()
const demoRegistryPath = path.join(repoRoot, 'src', 'components', 'site', 'demos', 'registry.ts')

/* The landing demo twins copy component markup verbatim (see the header
 * comment in each twin). This guard catches silent drift: every
 * Tailwind class inside every plain className="..." literal in the component
 * source must still appear in its twin. The component root's cn('container')
 * and inner-container conditionals are deliberate substitutions and use
 * cn(), so the literal regex skips them by construction. */

type DemoPair = {
  component: string
  slug: string
  twin: string
}

const manifestNames = async () =>
  (await readdir(path.join(repoRoot, 'payload-components', 'manifests')))
    .filter((entry) => entry.endsWith('.json'))
    .map((entry) => entry.replace(/\.json$/, ''))
    .sort()

const demoPairs = async (): Promise<DemoPair[]> => {
  const registrySource = await readFile(demoRegistryPath, 'utf8')
  const imports = new Map(
    [...registrySource.matchAll(/import \{ (\w+) \} from '\.\/([^']+)'/g)].map((match) => [
      match[1],
      `src/components/site/demos/${match[2]}.tsx`,
    ]),
  )

  const entries = [...registrySource.matchAll(/^\s+'([a-z0-9-]+)':\s*(\w+),/gm)]
    .sort((left, right) => left[1].localeCompare(right[1]))

  return Promise.all(
    entries.map(async (match) => {
      const [, slug, demoName] = match
      const manifest = await loadManifest(slug)
      const component = manifest.files.find((file) => file.endsWith('/Component.tsx'))
      const twin = imports.get(demoName)

      if (!component || !twin) {
        throw new Error(`Unable to resolve demo twin pair for ${slug}.`)
      }

      return { component: `payload-components/source/${component.replace(/^src\//, '')}`, slug, twin }
    }),
  )
}

const classLiterals = (source: string): string[] =>
  [...source.matchAll(/className="([^"]+)"/g)].map((match) => match[1])

describe('Landing demo twins', () => {
  it('registers one demo twin for every manifest', async () => {
    const pairs = await demoPairs()

    expect(pairs.map((pair) => pair.slug).sort()).toEqual(await manifestNames())
  })

  it('mirrors every component class string', async () => {
    for (const { component, slug, twin } of await demoPairs()) {
      const [componentSource, twinSource] = await Promise.all([
        readFile(path.join(repoRoot, component), 'utf8'),
        readFile(path.join(repoRoot, twin), 'utf8'),
      ])

      const literals = classLiterals(componentSource)
      expect(literals.length).toBeGreaterThan(0)

      const missing = literals.flatMap((literal) =>
        literal
          .split(/\s+/)
          .filter((token) => token && !twinSource.includes(token))
          .map((token) => `${token} (from "${literal}")`),
      )

      expect(missing, `Twin ${twin} drifted from ${component} (${slug})`).toEqual([])
    }
  })

  it('keeps the twins presentational: aria-hidden roots, no focusable elements', async () => {
    for (const { twin } of await demoPairs()) {
      const twinSource = await readFile(path.join(repoRoot, twin), 'utf8')
      /* The header comments document tag substitutions like <h2> -> <div>;
         strip them so only real JSX is checked. */
      const jsxOnly = twinSource.replace(/\/\*[\s\S]*?\*\//g, '')

      expect(jsxOnly).toContain('aria-hidden="true"')
      expect(jsxOnly).not.toMatch(/<(a|button)[\s>]/)
      /* Headings would collide with the landing's h2 outline. */
      expect(jsxOnly).not.toMatch(/<h[1-6][\s>]/)
    }
  })
})
