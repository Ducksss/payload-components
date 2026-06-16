import { readFile } from 'node:fs/promises'
import path from 'node:path'

import { describe, expect, it } from 'vitest'

const repoRoot = process.cwd()

/* The landing demo twins copy kit markup verbatim (see the header
 * comment in each twin). This guard catches silent drift: every
 * Tailwind class inside every plain className="..." literal in the kit
 * source must still appear in its twin. The kit root's cn('container')
 * and inner-container conditionals are deliberate substitutions and use
 * cn(), so the literal regex skips them by construction. */

const pairs = [
  {
    kit: 'payload-components/source/blocks/HeroBasic/Component.tsx',
    twin: 'src/components/site/demos/HeroBasicDemo.tsx',
  },
  {
    kit: 'payload-components/source/blocks/FeatureGridBasic/Component.tsx',
    twin: 'src/components/site/demos/FeatureGridBasicDemo.tsx',
  },
] as const

const classLiterals = (source: string): string[] =>
  [...source.matchAll(/className="([^"]+)"/g)].map((match) => match[1])

describe('Landing demo twins', () => {
  it.each(pairs)('mirrors every kit class string in %s', async ({ kit, twin }) => {
    const [kitSource, twinSource] = await Promise.all([
      readFile(path.join(repoRoot, kit), 'utf8'),
      readFile(path.join(repoRoot, twin), 'utf8'),
    ])

    const literals = classLiterals(kitSource)
    expect(literals.length).toBeGreaterThan(0)

    const missing = literals.flatMap((literal) =>
      literal
        .split(/\s+/)
        .filter((token) => token && !twinSource.includes(token))
        .map((token) => `${token} (from "${literal}")`),
    )

    expect(missing, `Twin ${twin} drifted from ${kit}`).toEqual([])
  })

  it('keeps the twins presentational: aria-hidden roots, no focusable elements', async () => {
    for (const { twin } of pairs) {
      const twinSource = await readFile(path.join(repoRoot, twin), 'utf8')
      /* The header comments document tag substitutions like <h2> → <div>;
         strip them so only real JSX is checked. */
      const jsxOnly = twinSource.replace(/\/\*[\s\S]*?\*\//g, '')

      expect(jsxOnly).toContain('aria-hidden="true"')
      expect(jsxOnly).not.toMatch(/<(a|button)[\s>]/)
      /* Headings would collide with the landing's h2 outline. */
      expect(jsxOnly).not.toMatch(/<h[1-6][\s>]/)
    }
  })
})
