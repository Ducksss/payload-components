import { readFile, readdir } from 'node:fs/promises'
import path from 'node:path'

import { describe, expect, it } from 'vitest'

import { blogVisualCatalog } from '../../tools/blog/visual-system/catalog'
import { resolveArtifact, validateBlogVisualCatalog } from '../../tools/blog/visual-system/artifacts'
import type { Artifact, ResolvedArtifact } from '../../tools/blog/visual-system/types'

const repoRoot = path.resolve(import.meta.dirname, '../..')
const blogRoot = path.join(repoRoot, 'content', 'blog')
const registryPath = path.join(repoRoot, 'payload-components', 'registry.json')

const fabricatedPresentationMarkers = [
  {
    category: 'invented contributor identity',
    pattern:
      /\b(?:mock|fictional|invented) contributors?\b|\b(?:contributor|maintainer|author)\s*(?:name)?\s*[:=]\s*(?!Ducksss\b)["']?[A-Z][\p{L}'-]+(?:\s+[A-Z][\p{L}'-]+)+["']?/iu,
  },
  {
    category: 'avatar presentation',
    pattern: /\bavatar(?:url|_url|-url|src|source)?\s*[:=]\s*["'][^"']+["']/iu,
  },
  { category: 'invented issue number', pattern: /\b(?:issue|pull request)\s*#\d+\b/iu },
  {
    category: 'fabricated activity count',
    pattern: /\b\d[\d,]*\+?\s+(?:stars?|likes?|reactions?|forks?|commits?|contributors?)\b/iu,
  },
  {
    category: 'invented testimonial attribution',
    pattern: /\btestimonial\s+(?:by|from)\s+["']?[A-Z]|\b(?:customer|user)\s+testimonial\s*[:=]/iu,
  },
  {
    category: 'fabricated terminal outcome',
    pattern:
      /\b(?:fake|mock|invented|simulated)\s+(?:terminal|command|install)\s+(?:outcome|output|result|success)\b|\b(?:terminal|command|install)\s+(?:outcome|result)\s*[:=]\s*(?:success|passed|complete)\b/iu,
  },
  {
    category: 'fabricated GitHub UI',
    pattern:
      /\bgithub\s+(?:activity|avatar|issue|merge|profile|pull request|reaction|stars?)\s+(?:badge|button|card|panel|timeline|ui)\b|\bmerged by\b/iu,
  },
  {
    category: 'fabricated project behavior',
    pattern:
      /\b(?:fake|mock|invented|simulated)\s+(?:project\s+)?(?:behavior|behaviour|outcome|result)\b|\bproject\s+(?:behavior|behaviour|outcome|result)\s*[:=]/iu,
  },
] as const

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

function expectResolvedArtifactBinding(artifact: Artifact, resolved: ResolvedArtifact, context: string) {
  expect(resolved.kind, context).toBe(artifact.kind)
  expect(resolved.label, context).toBe(artifact.label)

  switch (artifact.kind) {
    case 'source':
    case 'diff':
      expect(resolved.provenance, context).toContain(artifact.path)
      expect(resolved.evidence, context).toContain(artifact.anchor)
      break
    case 'registry-item':
      expect(resolved.provenance, context).toContain(artifact.name)
      expect(resolved.evidence, context).toContain(artifact.name)
      break
    case 'route':
      expect(resolved.provenance, context).toContain(artifact.route)
      expect(resolved.evidence, context).toContain(artifact.route)
      break
    case 'command':
      expect(resolved.evidence, context).toContain(artifact.command)
      for (const item of artifact.registryItems ?? []) {
        expect(resolved.evidence, `${context}: registry item ${item}`).toContain(item)
      }
      expect(resolved.provenance, context).toContain(
        artifact.registryItems?.length ? 'payload-components/registry.json' : 'tools/blog/visual-system/catalog.ts',
      )
      break
    case 'sequence':
      for (const item of artifact.items) {
        expect(resolved.evidence, `${context}: sequence item ${item}`).toContain(item)
      }
      expect(resolved.provenance, context).toContain('tools/blog/visual-system/catalog.ts')
      break
  }
}

function expectNoFabricatedPresentation(value: string, context: string) {
  for (const marker of fabricatedPresentationMarkers) {
    expect(value, `${context}: ${marker.category}`).not.toMatch(marker.pattern)
  }
}

describe('Community Field Journal visual catalog', () => {
  it('covers every post and figure exactly once with the approved teaching modes', async () => {
    const mdxEntries = await getMdxVisualContract()
    const mdxEntriesBySlug = new Map(mdxEntries.map((entry) => [entry.slug, entry]))
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
      expect(
        entry.figures.map((figure) => figure.path),
        `${entry.slug}: figure paths`,
      ).toEqual(mdxEntriesBySlug.get(entry.slug)?.figures)
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
          expect(artifact.anchor.trim(), `${entry.slug}: ${artifact.path} anchor`).not.toBe('')
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
        const context = `${entry.slug}: ${artifact.kind} ${artifact.label}`
        expectResolvedArtifactBinding(artifact, resolved, context)
        expectNoFabricatedPresentation(resolved.evidence, `${context} evidence`)
        expectNoFabricatedPresentation(resolved.provenance, `${context} provenance`)
      }
    }
  })
})
