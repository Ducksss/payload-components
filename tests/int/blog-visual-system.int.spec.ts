import { readFile, readdir } from 'node:fs/promises'
import path from 'node:path'

import { describe, expect, it } from 'vitest'

import { blogVisualCatalog } from '../../tools/blog/visual-system/catalog'
import { resolveArtifact, validateBlogVisualCatalog } from '../../tools/blog/visual-system/artifacts'

const repoRoot = path.resolve(import.meta.dirname, '../..')
const blogRoot = path.join(repoRoot, 'content', 'blog')
const registryPath = path.join(repoRoot, 'payload-components', 'registry.json')

const forbiddenEvidence =
  /\b(?:avatars?|likes?|reactions?|stars?)\b|merged by|issue\s*#|\b(?:mock|fictional|invented) contributors?\b|\b(?:contributor|maintainer|author)\s*(?:name)?\s*[:=]\s*(?!Ducksss\b)[A-Z][\p{L}'-]+(?:\s+[A-Z][\p{L}'-]+)*/iu

function scalar(frontmatter: string, name: string) {
  return frontmatter.match(new RegExp(`^${name}:\\s*(.+)$`, 'm'))?.[1]?.trim().replace(/^['"]|['"]$/g, '')
}

function figureSources(source: string) {
  return [...source.matchAll(/<BlogFigure\s+([\s\S]*?)\/>/g)].map((match) => {
    const figureSource = match[1].match(/\bsrc="([^"]+)"/)?.[1]
    expect(figureSource).toBeTruthy()
    return String(figureSource)
  })
}

async function getMdxVisualContract() {
  const filenames = (await readdir(blogRoot)).filter((filename) => filename.endsWith('.mdx'))

  return Promise.all(
    filenames.map(async (filename) => {
      const source = await readFile(path.join(blogRoot, filename), 'utf8')
      const frontmatter = source.match(/^---\r?\n([\s\S]*?)\r?\n---/)?.[1] ?? ''

      return {
        figures: figureSources(source),
        order: Number(scalar(frontmatter, 'publicationOrder')),
        slug: filename.replace(/\.mdx$/, ''),
      }
    }),
  )
}

function isKnownLocalRoute(route: string) {
  return /^(?:\/blog(?:\/[a-z0-9-]+)?|\/components(?:\?[^#\s]+|\/preview\/[a-z0-9-]+)?|\/docs\/components\/[a-z0-9-]+)$/.test(
    route,
  )
}

describe('Community Field Journal visual catalog', () => {
  it('covers every post and figure exactly once with the approved teaching modes', async () => {
    const mdxEntries = await getMdxVisualContract()
    const slugs = blogVisualCatalog.map((entry) => entry.slug)
    const orders = blogVisualCatalog.map((entry) => entry.order)

    expect(blogVisualCatalog).toHaveLength(32)
    expect(new Set(slugs).size).toBe(32)
    expect(new Set(orders).size).toBe(32)
    expect([...orders].sort((left, right) => left - right)).toEqual(
      Array.from({ length: 32 }, (_, index) => index + 1),
    )
    expect(
      blogVisualCatalog
        .map(({ order, slug }) => ({ order, slug }))
        .sort((left, right) => left.order - right.order),
    ).toEqual(
      mdxEntries
        .map(({ order, slug }) => ({ order, slug }))
        .sort((left, right) => left.order - right.order),
    )

    for (const entry of blogVisualCatalog) {
      expect(entry.thesis.trim(), entry.slug).not.toBe('')
      expect(entry.prompt.trim(), entry.slug).not.toBe('')
      expect(entry.primary.kind, entry.slug).not.toBe(entry.secondary.kind)
      expect(entry.figures.length, entry.slug).toBeGreaterThanOrEqual(1)
    }

    const figures = blogVisualCatalog.flatMap((entry) => entry.figures)
    const catalogFigurePaths = figures.map((figure) => figure.path)
    const mdxFigurePaths = mdxEntries.flatMap((entry) => entry.figures)
    const modeCounts = figures.reduce<Record<string, number>>((counts, figure) => {
      counts[figure.mode] = (counts[figure.mode] ?? 0) + 1
      return counts
    }, {})

    expect(catalogFigurePaths).toHaveLength(35)
    expect([...catalogFigurePaths].sort()).toEqual([...mdxFigurePaths].sort())
    expect(modeCounts).toEqual({ inspect: 7, join: 3, see: 8, trace: 17 })
  })

  it('resolves every artifact from repository-backed evidence without fabricated social proof', async () => {
    await expect(validateBlogVisualCatalog()).resolves.toBeUndefined()

    const registry = JSON.parse(await readFile(registryPath, 'utf8')) as {
      items: Array<{ name: string }>
    }
    const registryItems = new Set(registry.items.map((item) => item.name))

    for (const entry of blogVisualCatalog) {
      for (const artifact of [entry.primary, entry.secondary]) {
        if (artifact.kind === 'source' || artifact.kind === 'diff') {
          const source = await readFile(path.join(repoRoot, artifact.path), 'utf8')
          expect(source, `${entry.slug}: ${artifact.path}`).toContain(artifact.anchor)
        }

        if (artifact.kind === 'registry-item') {
          expect(registryItems.has(artifact.name), `${entry.slug}: ${artifact.name}`).toBe(true)
        }

        if (artifact.kind === 'command') {
          for (const item of artifact.registryItems ?? []) {
            expect(registryItems.has(item), `${entry.slug}: ${artifact.command} -> ${item}`).toBe(true)
          }
        }

        if (artifact.kind === 'route') {
          expect(isKnownLocalRoute(artifact.route), `${entry.slug}: ${artifact.route}`).toBe(true)
        }

        const resolved = await resolveArtifact(artifact)
        expect(resolved.evidence.trim(), entry.slug).not.toBe('')
        expect(resolved.provenance.trim(), entry.slug).not.toBe('')
        expect(resolved.evidence, entry.slug).not.toMatch(forbiddenEvidence)
      }
    }
  })
})
