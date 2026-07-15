import { readFile } from 'node:fs/promises'
import path from 'node:path'

import { describe, expect, it } from 'vitest'

const repoRoot = process.cwd()
const read = (relative: string) => readFile(path.join(repoRoot, relative), 'utf8')

describe('curated Tailark ports', () => {
  it('ships hero-video as a reduced-motion-safe Payload block', async () => {
    const [config, component, player, manifest, docs] = await Promise.all([
      read('payload-components/source/blocks/HeroVideo/config.ts'),
      read('payload-components/source/blocks/HeroVideo/Component.tsx'),
      read('payload-components/source/blocks/HeroVideo/Video.tsx'),
      read('payload-components/manifests/hero-video.json'),
      read('content/docs/components/hero-video.mdx'),
    ])

    expect(config).toContain("slug: 'heroVideo'")
    expect(config).toContain("dbName: 'pc_hero_vid'")
    expect(config).toContain('...heroFields')
    expect(component).toContain('Layout adapted from tailark/blocks (MIT)')
    expect(component).toContain("video.mimeType.startsWith('video/')")
    expect(player).toContain("'use client'")
    expect(player).toContain('useReducedMotion()')
    expect(player).toContain('const canAutoPlay = shouldReduceMotion === false')
    expect(player).toContain('autoPlay={canAutoPlay}')
    expect(JSON.parse(manifest).files).toEqual([
      'src/blocks/shared/heroFields.ts',
      'src/blocks/HeroVideo/Video.tsx',
      'src/blocks/HeroVideo/config.ts',
      'src/blocks/HeroVideo/Component.tsx',
    ])
    expect(docs).toContain('npx payload-components add hero-video')
    expect(docs).toContain('tailark/blocks')
  })

  it('adds the family navigator to the existing hero variant', async () => {
    const heroBasicDocs = await read('content/docs/components/hero-basic.mdx')

    expect(heroBasicDocs).toContain('<ComponentFamily slug="hero-basic" />')
  })

  it('ships hero-product-tilt as a static perspective Payload block', async () => {
    const [config, component, manifest, docs] = await Promise.all([
      read('payload-components/source/blocks/HeroProductTilt/config.ts'),
      read('payload-components/source/blocks/HeroProductTilt/Component.tsx'),
      read('payload-components/manifests/hero-product-tilt.json'),
      read('content/docs/components/hero-product-tilt.mdx'),
    ])

    expect(config).toContain("slug: 'heroProductTilt'")
    expect(config).toContain("dbName: 'pc_hero_prod_tilt'")
    expect(config).toContain('...heroFields')
    expect(component).toContain('Layout adapted from tailark/blocks (MIT)')
    expect(component).toContain('<figure')
    expect(component).toContain('<figcaption')
    expect(component).toContain('perspective')
    expect(component).toContain('rotate-x')
    expect(JSON.parse(manifest).files).toEqual([
      'src/blocks/shared/heroFields.ts',
      'src/blocks/HeroProductTilt/config.ts',
      'src/blocks/HeroProductTilt/Component.tsx',
    ])
    expect(docs).toContain('npx payload-components add hero-product-tilt')
    expect(docs).toContain('tailark/blocks')
  })
})
