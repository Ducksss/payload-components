import { readFile } from 'node:fs/promises'
import path from 'node:path'

import { describe, expect, it } from 'vitest'

const repoRoot = process.cwd()
const read = (relative: string) => readFile(path.join(repoRoot, relative), 'utf8')

const upstreamItems = {
  'contact-routing-form': 'contact-2',
  'feature-accordion': 'features-12',
  'feature-cards-media': 'features-10',
  'feature-icon-grid': 'features-1',
  'hero-product-tilt': 'hero-section-9',
  'hero-video': 'hero-section-5',
  'stats-proof': 'stats-4',
} as const

describe('curated Tailark ports', () => {
  it('records the exact upstream item and audit date for every curated port', async () => {
    const provenance = await read('payload-components/PROVENANCE.md')

    expect(provenance).toContain('| Last audited | 2026-07-15 |')

    for (const [component, upstreamItem] of Object.entries(upstreamItems)) {
      expect(provenance).toContain(`| \`${component}\` | \`${upstreamItem}\` |`)
    }

    expect(provenance).not.toContain('all `feature-*`')
  })

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
    expect(player).toContain('useRef<HTMLVideoElement>(null)')
    expect(player).toContain('if (shouldReduceMotion === false)')
    expect(player).toContain('video.play().catch(() => undefined)')
    expect(player).toContain('video.pause()')
    expect(player).toContain('}, [shouldReduceMotion, videoUrl])')
    expect(player).toContain('preload="none"')
    expect(player).toContain('ref={videoRef}')
    expect(player).not.toContain('return null')
    expect(player).not.toContain('autoPlay')
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

  it('ships feature-accordion with shared icons and synchronized media', async () => {
    const [icons, config, component, manifest, docs] = await Promise.all([
      read('payload-components/source/blocks/shared/featureIcons.ts'),
      read('payload-components/source/blocks/FeatureAccordion/config.ts'),
      read('payload-components/source/blocks/FeatureAccordion/Component.tsx'),
      read('payload-components/manifests/feature-accordion.json'),
      read('content/docs/components/feature-accordion.mdx'),
    ])

    for (const icon of ['chart', 'database', 'fingerprint', 'id-card', 'shield', 'zap']) {
      expect(icons).toContain(`'${icon}'`)
    }
    expect(icons).toContain('createFeatureIconField(required = false)')
    expect(config).toContain("slug: 'featureAccordion'")
    expect(config).toContain("dbName: 'pc_feat_accordion'")
    expect(config).toContain('...featureFields')
    expect(config).toContain('createFeatureIconField()')
    expect(config).toContain('minRows: 2')
    expect(config).toContain('maxRows: 6')
    expect(component).toContain("'use client'")
    expect(component).toContain("@/components/ui/accordion")
    expect(component).toContain('value={activeValue}')
    expect(component).toContain('onValueChange={setActiveValue}')
    expect(component).toContain('Layout adapted from tailark/blocks (MIT)')
    expect(JSON.parse(manifest).files).toEqual([
      'src/blocks/shared/featureFields.ts',
      'src/blocks/shared/featureIcons.ts',
      'src/blocks/FeatureAccordion/config.ts',
      'src/blocks/FeatureAccordion/Component.tsx',
    ])
    expect(docs).toContain('npx payload-components add feature-accordion')
    expect(docs).toContain('tailark/blocks')
  })

  it('ships feature-cards-media as independent visual feature stories', async () => {
    const [config, component, manifest, docs] = await Promise.all([
      read('payload-components/source/blocks/FeatureCardsMedia/config.ts'),
      read('payload-components/source/blocks/FeatureCardsMedia/Component.tsx'),
      read('payload-components/manifests/feature-cards-media.json'),
      read('content/docs/components/feature-cards-media.mdx'),
    ])

    expect(config).toContain("slug: 'featureCardsMedia'")
    expect(config).toContain("dbName: 'pc_feat_card_med'")
    expect(config).toContain('...featureFields')
    expect(config).toContain('createFeatureIconField()')
    expect(config).toContain('minRows: 2')
    expect(config).toContain('maxRows: 4')
    expect(component).toContain('md:grid-cols-2')
    expect(component).toContain('aspect-video')
    expect(component).toContain('<Media')
    expect(component).toContain('Layout adapted from tailark/blocks (MIT)')
    expect(JSON.parse(manifest).files).toEqual([
      'src/blocks/shared/featureFields.ts',
      'src/blocks/shared/featureIcons.ts',
      'src/blocks/FeatureCardsMedia/config.ts',
      'src/blocks/FeatureCardsMedia/Component.tsx',
    ])
    expect(docs).toContain('npx payload-components add feature-cards-media')
    expect(docs).toContain('tailark/blocks')
  })

  it('ships feature-icon-grid with a tokenized masked-grid decorator', async () => {
    const [config, component, manifest, docs] = await Promise.all([
      read('payload-components/source/blocks/FeatureIconGrid/config.ts'),
      read('payload-components/source/blocks/FeatureIconGrid/Component.tsx'),
      read('payload-components/manifests/feature-icon-grid.json'),
      read('content/docs/components/feature-icon-grid.mdx'),
    ])

    expect(config).toContain("slug: 'featureIconGrid'")
    expect(config).toContain("dbName: 'pc_feat_icon_grid'")
    expect(config).toContain('createFeatureIconField(true)')
    expect(config).toContain('minRows: 3')
    expect(config).toContain('maxRows: 6')
    expect(component).toContain('aria-hidden="true"')
    expect(component).toContain('mask-image:radial-gradient')
    expect(component).toContain('var(--border)')
    expect(component).toContain('md:grid-cols-2')
    expect(component).toContain('xl:grid-cols-3')
    expect(component).toContain('Layout adapted from tailark/blocks (MIT)')
    expect(JSON.parse(manifest).files).toEqual([
      'src/blocks/shared/featureFields.ts',
      'src/blocks/shared/featureIcons.ts',
      'src/blocks/FeatureIconGrid/config.ts',
      'src/blocks/FeatureIconGrid/Component.tsx',
    ])
    expect(docs).toContain('npx payload-components add feature-icon-grid')
    expect(docs).toContain('tailark/blocks')
  })

  it('ships stats-proof as a semantic first-class Stats family block', async () => {
    const [config, component, demo, manifest, docs, site, pageTree] = await Promise.all([
      read('payload-components/source/blocks/StatsProof/config.ts'),
      read('payload-components/source/blocks/StatsProof/Component.tsx'),
      read('src/components/site/demos/StatsProofDemo.tsx'),
      read('payload-components/manifests/stats-proof.json'),
      read('content/docs/components/stats-proof.mdx'),
      read('src/lib/site.ts'),
      read('src/lib/component-page-tree.tsx'),
    ])

    expect(config).toContain("slug: 'statsProof'")
    expect(config).toContain("dbName: 'pc_stats_proof'")
    expect(config).toContain('minRows: 2')
    expect(config).toContain('maxRows: 4')
    expect(component).toContain('<figure')
    expect(component).toContain('<blockquote')
    expect(component).toContain('<cite')
    expect(component).toContain('<Media')
    expect(component).toContain('Layout adapted from tailark/blocks (MIT)')
    expect(component).toMatch(
      /<dt[^>]*>\s*\{metric\.label\}\s*<\/dt>\s*<dd[^>]*>\s*\{metric\.value\}\s*<\/dd>/,
    )
    expect(demo).toMatch(
      /<dt[^>]*>\s*\{metric\.label\}\s*<\/dt>\s*<dd[^>]*>\s*\{metric\.value\}\s*<\/dd>/,
    )
    expect(site).toContain("stats: { family: 'pages', label: 'Stats' }")
    expect(pageTree).toContain("key: 'stats', label: 'Stats'")
    expect(JSON.parse(manifest).files).toEqual([
      'src/blocks/StatsProof/config.ts',
      'src/blocks/StatsProof/Component.tsx',
    ])
    expect(docs).toContain('npx payload-components add stats-proof')
    expect(docs).toContain('tailark/blocks')
    expect(docs).not.toContain('## In this family')
  })

  it('ships contact-routing-form with safe channels and form fallbacks', async () => {
    const [config, component, manifest, docs, site, pageTree] = await Promise.all([
      read('payload-components/source/blocks/ContactRoutingForm/config.ts'),
      read('payload-components/source/blocks/ContactRoutingForm/Component.tsx'),
      read('payload-components/manifests/contact-routing-form.json'),
      read('content/docs/components/contact-routing-form.mdx'),
      read('src/lib/site.ts'),
      read('src/lib/component-page-tree.tsx'),
    ])

    expect(config).toContain("slug: 'contactRoutingForm'")
    expect(config).toContain("dbName: 'pc_contact_route'")
    expect(config).toContain('validateSameOriginFormAction')
    expect(config).toContain('validateContactValue')
    expect(component).toContain('const formAction = getSafeFormAction(action)')
    expect(component).toContain('getSafeContactHref')
    expect(component).toContain('method="post"')
    expect(component).toContain('name="website"')
    expect(component).toContain('tabIndex={-1}')
    expect(component).toContain('React.useId()')
    expect(component).toContain('<label')
    expect(component).toContain('disabled={!formAction}')
    expect(component).toContain('Configure a valid same-origin form action before publishing.')
    expect(component).toContain('Layout adapted from tailark/blocks (MIT)')
    expect(site).toContain("contact: { family: 'pages', label: 'Contact' }")
    expect(pageTree).toContain("key: 'contact', label: 'Contact'")
    expect(JSON.parse(manifest).files).toEqual([
      'src/blocks/shared/safeUrls.ts',
      'src/blocks/shared/contactUrls.ts',
      'src/blocks/ContactRoutingForm/config.ts',
      'src/blocks/ContactRoutingForm/Component.tsx',
    ])
    expect(docs).toContain('npx payload-components add contact-routing-form')
    expect(docs).toContain('tailark/blocks')
    expect(docs).not.toContain('## In this family')
  })
})
