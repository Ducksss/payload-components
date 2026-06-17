import { readFile } from 'node:fs/promises'
import path from 'node:path'

import { describe, expect, it } from 'vitest'

const repoRoot = process.cwd()

/* The landing demo twins copy component markup verbatim (see the header
 * comment in each twin). This guard catches silent drift: every
 * Tailwind class inside every plain className="..." literal in the component
 * source must still appear in its twin. The component root's cn('container')
 * and inner-container conditionals are deliberate substitutions and use
 * cn(), so the literal regex skips them by construction. */

const pairs = [
  {
    component: 'payload-components/source/blocks/HeroBasic/Component.tsx',
    twin: 'src/components/site/demos/HeroBasicDemo.tsx',
  },
  {
    component: 'payload-components/source/blocks/FeatureGridBasic/Component.tsx',
    twin: 'src/components/site/demos/FeatureGridBasicDemo.tsx',
  },
  {
    component: 'payload-components/source/blocks/FeatureSplit/Component.tsx',
    twin: 'src/components/site/demos/FeatureSplitDemo.tsx',
  },
  {
    component: 'payload-components/source/blocks/FeatureBento/Component.tsx',
    twin: 'src/components/site/demos/FeatureBentoDemo.tsx',
  },
  {
    component: 'payload-components/source/blocks/FeatureSteps/Component.tsx',
    twin: 'src/components/site/demos/FeatureStepsDemo.tsx',
  },
  {
    component: 'payload-components/source/blocks/EmbedBasic/Component.tsx',
    twin: 'src/components/site/demos/EmbedBasicDemo.tsx',
  },
  {
    component: 'payload-components/source/blocks/LogoCloudGrid/Component.tsx',
    twin: 'src/components/site/demos/LogoCloudGridDemo.tsx',
  },
  {
    component: 'payload-components/source/blocks/LogoCloudHover/Component.tsx',
    twin: 'src/components/site/demos/LogoCloudHoverDemo.tsx',
  },
  {
    component: 'payload-components/source/blocks/LogoCloudMarquee/Component.tsx',
    twin: 'src/components/site/demos/LogoCloudMarqueeDemo.tsx',
  },
  {
    component: 'payload-components/source/blocks/LogoCloudInline/Component.tsx',
    twin: 'src/components/site/demos/LogoCloudInlineDemo.tsx',
  },
  {
    component: 'payload-components/source/blocks/LogoCloudInlineWrap/Component.tsx',
    twin: 'src/components/site/demos/LogoCloudInlineWrapDemo.tsx',
  },
  {
    component: 'payload-components/source/blocks/ContentColumns/Component.tsx',
    twin: 'src/components/site/demos/ContentColumnsDemo.tsx',
  },
  {
    component: 'payload-components/source/blocks/ContentImageLead/Component.tsx',
    twin: 'src/components/site/demos/ContentImageLeadDemo.tsx',
  },
  {
    component: 'payload-components/source/blocks/ContentFeatureMedia/Component.tsx',
    twin: 'src/components/site/demos/ContentFeatureMediaDemo.tsx',
  },
  {
    component: 'payload-components/source/blocks/ContentFeatureSplit/Component.tsx',
    twin: 'src/components/site/demos/ContentFeatureSplitDemo.tsx',
  },
  {
    component: 'payload-components/source/blocks/ContentShowcase/Component.tsx',
    twin: 'src/components/site/demos/ContentShowcaseDemo.tsx',
  },
  {
    component: 'payload-components/source/blocks/ContentQuote/Component.tsx',
    twin: 'src/components/site/demos/ContentQuoteDemo.tsx',
  },
  {
    component: 'payload-components/source/blocks/ContentCommunity/Component.tsx',
    twin: 'src/components/site/demos/ContentCommunityDemo.tsx',
  },
  {
    component: 'payload-components/source/blocks/IntegrationGrid/Component.tsx',
    twin: 'src/components/site/demos/IntegrationGridDemo.tsx',
  },
  {
    component: 'payload-components/source/blocks/IntegrationCluster/Component.tsx',
    twin: 'src/components/site/demos/IntegrationClusterDemo.tsx',
  },
  {
    component: 'payload-components/source/blocks/IntegrationSplit/Component.tsx',
    twin: 'src/components/site/demos/IntegrationSplitDemo.tsx',
  },
  {
    component: 'payload-components/source/blocks/IntegrationConnect/Component.tsx',
    twin: 'src/components/site/demos/IntegrationConnectDemo.tsx',
  },
  {
    component: 'payload-components/source/blocks/IntegrationOrbit/Component.tsx',
    twin: 'src/components/site/demos/IntegrationOrbitDemo.tsx',
  },
  {
    component: 'payload-components/source/blocks/IntegrationList/Component.tsx',
    twin: 'src/components/site/demos/IntegrationListDemo.tsx',
  },
  {
    component: 'payload-components/source/blocks/IntegrationMarquee/Component.tsx',
    twin: 'src/components/site/demos/IntegrationMarqueeDemo.tsx',
  },
  {
    component: 'payload-components/source/blocks/IntegrationTestimonial/Component.tsx',
    twin: 'src/components/site/demos/IntegrationTestimonialDemo.tsx',
  },
] as const

const classLiterals = (source: string): string[] =>
  [...source.matchAll(/className="([^"]+)"/g)].map((match) => match[1])

describe('Landing demo twins', () => {
  it.each(pairs)('mirrors every component class string in %s', async ({ component, twin }) => {
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

    expect(missing, `Twin ${twin} drifted from ${component}`).toEqual([])
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
