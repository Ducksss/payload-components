import { readFile } from 'node:fs/promises'
import path from 'node:path'

import { describe, expect, it } from 'vitest'

import { demosBySlug } from '../../src/components/site/demos/registry'
import {
  exampleStateParams,
  exampleStatesBySlug,
  getExampleState,
} from '../../src/components/site/demos/states'

const repoRoot = process.cwd()
const demoRegistryPath = path.join(repoRoot, 'src', 'components', 'site', 'demos', 'registry.ts')

/* Example states (src/components/site/demos/states.ts) feed two surfaces that
 * must agree: the static /components/preview/<slug>/<state> route and the
 * <ComponentExample slug state /> MDX component. This pins the registry's
 * shape so a typo in either tag 404s at build rather than silently rendering
 * nothing. */

const slugs = Object.keys(exampleStatesBySlug)
const kebabCase = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

describe('component example states', () => {
  it('describes at least the pilot component', () => {
    expect(slugs).toContain('faq-accordion')
    expect(exampleStatesBySlug['faq-accordion'].map((state) => state.id)).toEqual([
      'minimal',
      'with-cta',
      'long-form',
      'single',
    ])
  })

  it('only describes slugs that have a demo twin', () => {
    const missing = slugs.filter((slug) => !(slug in demosBySlug))
    expect(missing, 'states for slugs without a twin in demos/registry.ts').toEqual([])
  })

  it('only describes slugs whose twin takes a content prop', async () => {
    /* The route renders <Demo content={state.content} />; a twin that only
       defaults its own content would ignore the state. Resolve each twin the
       way demo-twins.int.spec.ts does (the registry's `'slug': Demo,` lines). */
    const registrySource = await readFile(demoRegistryPath, 'utf8')
    const twinFiles = new Map(
      [...registrySource.matchAll(/import \{ (\w+) \} from '\.\/([^']+)'/g)].map((match) => [
        match[1],
        path.join(repoRoot, 'src', 'components', 'site', 'demos', `${match[2]}.tsx`),
      ]),
    )
    const twinBySlug = new Map(
      [...registrySource.matchAll(/^\s+'([a-z0-9-]+)':\s*(\w+),/gm)].map((match) => [
        match[1],
        match[2],
      ]),
    )

    for (const slug of slugs) {
      const twinFile = twinFiles.get(twinBySlug.get(slug) ?? '')
      expect(twinFile, `${slug}: twin file`).toBeDefined()
      const twinSource = await readFile(twinFile as string, 'utf8')
      expect(twinSource, `${slug}: twin must accept a content prop`).toMatch(/\bcontent\?: /)
    }
  })

  it('gives every state a unique kebab-case id per slug', () => {
    for (const slug of slugs) {
      const ids = exampleStatesBySlug[slug].map((state) => state.id)
      expect(ids.length, `${slug}: at least one state`).toBeGreaterThan(0)
      expect(new Set(ids).size, `${slug}: duplicate state ids`).toBe(ids.length)
      for (const id of ids) {
        expect(id, `${slug}/${id}: kebab-case id`).toMatch(kebabCase)
      }
    }
  })

  it('gives every state a title, a summary sentence, and object content', () => {
    for (const slug of slugs) {
      for (const state of exampleStatesBySlug[slug]) {
        const label = `${slug}/${state.id}`
        expect(state.title.trim(), `${label}: title`).not.toBe('')
        expect(state.summary.trim(), `${label}: summary`).not.toBe('')
        expect(state.summary.trim(), `${label}: summary ends as a sentence`).toMatch(/[.!?]$/)
        /* The example JSON is `{ blockType, ...content }`, so content must spread. */
        expect(state.content, `${label}: content is an object`).toBeTypeOf('object')
        expect(state.content, `${label}: content is not null`).not.toBeNull()
        expect(Array.isArray(state.content), `${label}: content is not an array`).toBe(false)
      }
    }
  })

  it('lists every slug/state pair for static generation', () => {
    const expected = slugs.flatMap((slug) =>
      exampleStatesBySlug[slug].map((state) => ({ slug, state: state.id })),
    )
    expect(exampleStateParams()).toEqual(expected)
  })

  it('resolves states by slug and id, and nothing else', () => {
    for (const { slug, state } of exampleStateParams()) {
      expect(getExampleState(slug, state)?.id).toBe(state)
    }
    expect(getExampleState('faq-accordion', 'nope')).toBeUndefined()
    expect(getExampleState('not-a-component', 'minimal')).toBeUndefined()
  })
})
