import { readdir, readFile } from 'node:fs/promises'
import path from 'node:path'

import ts from 'typescript'
import { describe, expect, it } from 'vitest'

import { loadManifest } from '../../tools/payload-components/manifest'

const repoRoot = process.cwd()
const demoRegistryPath = path.join(repoRoot, 'src', 'components', 'site', 'demos', 'registry.ts')

/* Demo twins are backend-free visual specimens, not the installed components.
 * This guard catches styling drift: every Tailwind class inside every plain
 * className literal in the component source must still belong to one class
 * expression on a twin element. This is stronger than the old file-wide
 * token-presence check, which could pass after classes
 * were scattered across unrelated elements. The root container is the one
 * documented layout substitution. */

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

  const entries = [...registrySource.matchAll(/^\s+'([a-z0-9-]+)':\s*(\w+),/gm)].sort(
    (left, right) => left[1].localeCompare(right[1]),
  )

  return Promise.all(
    entries.map(async (match) => {
      const [, slug, demoName] = match
      const manifest = await loadManifest(slug)
      const component = manifest.files.find((file) => file.endsWith('/Component.tsx'))
      const twin = imports.get(demoName)

      if (!component || !twin) {
        throw new Error(`Unable to resolve demo twin pair for ${slug}.`)
      }

      return {
        component: `payload-components/source/${component.replace(/^src\//, '')}`,
        slug,
        twin,
      }
    }),
  )
}

const classStringGroups = (source: string, filePath: string): string[][] => {
  const sourceFile = ts.createSourceFile(
    filePath,
    source,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX,
  )
  const groups: string[][] = []

  const visit = (node: ts.Node) => {
    if (
      ts.isJsxAttribute(node) &&
      node.name.getText(sourceFile) === 'className' &&
      node.initializer
    ) {
      const literals: string[] = []
      const collectStrings = (classNode: ts.Node) => {
        if (ts.isStringLiteral(classNode) || ts.isNoSubstitutionTemplateLiteral(classNode)) {
          literals.push(classNode.text)
          return
        }

        if (
          ts.isTemplateHead(classNode) ||
          ts.isTemplateMiddle(classNode) ||
          ts.isTemplateTail(classNode)
        ) {
          if (classNode.text.trim()) literals.push(classNode.text)
          return
        }

        ts.forEachChild(classNode, collectStrings)
      }

      collectStrings(node.initializer)
      groups.push(literals)
      return
    }

    ts.forEachChild(node, visit)
  }

  visit(sourceFile)
  return groups
}

const tokenizeClasses = (literal: string) => literal.split(/\s+/).filter(Boolean)

const containsClassGroup = (candidate: string[], expected: string[]) =>
  expected.every((token) => candidate.includes(token))

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

      /* The consumer root uses `container`; preview routes own their viewport
       * and deliberately replace that one layout boundary. */
      const literals = classStringGroups(componentSource, component)
        .flat()
        .filter((literal) => literal !== 'container')
      const twinExpressions = classStringGroups(twinSource, twin).map((group) =>
        group.flatMap(tokenizeClasses),
      )
      expect(literals.length).toBeGreaterThan(0)

      const missing = literals.filter((literal) => {
        const expected = tokenizeClasses(literal)

        return !twinExpressions.some((candidate) => containsClassGroup(candidate, expected))
      })

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
