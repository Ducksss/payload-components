import { readFile } from 'node:fs/promises'

import { describe, expect, it } from 'vitest'

import { componentEntries, upcomingComponents } from '../../src/lib/component-catalog'

import {
  createSiteCatalog,
  siteCatalogPath,
} from '../../tools/payload-components/build-site-catalog'

describe('generated site component catalog', () => {
  it('separates installed article surfaces from the remaining public roadmap', () => {
    const articles = componentEntries.filter((component) => component.family === 'posts')
    expect(articles.map((component) => component.slug)).toEqual([
      'post-hero',
      'author-card',
      'newsletter-callout',
    ])
    expect(componentEntries.filter((component) => component.family === 'pages')).toHaveLength(79)
    expect(upcomingComponents.map((component) => component.slug)).toEqual(['related-posts'])
    expect(
      componentEntries.find((component) => component.slug === 'collection-query')?.category,
    ).toBe('query')
    expect(
      componentEntries.find((component) => component.slug === 'contact-form-basic')?.category,
    ).toBe('contact')
  })

  it('is the current client-safe projection of registry manifests', async () => {
    const committed = JSON.parse(await readFile(siteCatalogPath, 'utf8'))

    expect(committed).toEqual(await createSiteCatalog())
  })
})
