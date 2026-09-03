import type { BlogVisualEntry } from './types'

const catalogEntries: readonly BlogVisualEntry[] = [
  {
    slug: 'hello',
    order: 1,
    series: 'project-notes',
    thesis: 'Source becomes useful when the wiring lands.',
    prompt: 'Leave a clearer map for the next builder.',
    primary: {
      kind: 'source',
      label: 'Hero block contract',
      path: 'payload-components/source/blocks/HeroBasic/config.ts',
      anchor: "dbName: 'pc_her_bas'",
      take: 12,
    },
    secondary: {
      kind: 'sequence',
      label: 'Installer contract',
      items: ['register', 'map', 'generate'],
    },
    figures: [{ path: '/blog/hello/figure-01-origin-story.svg', mode: 'join' }],
  },
  {
    slug: 'anatomy-of-an-install',
    order: 2,
    series: 'project-notes',
    thesis: 'Five stages make one reviewable install.',
    prompt: 'Show the failed stage when you report an install.',
    primary: {
      kind: 'source',
      label: 'Five install stages',
      path: 'tools/payload-components/constants.ts',
      anchor: 'INSTALL_STAGES',
      take: 8,
    },
    secondary: {
      kind: 'command',
      label: 'Hero install command',
      command: 'npx payload-components add hero-basic',
      registryItems: ['hero-basic'],
    },
    figures: [
      {
        path: '/blog/anatomy-of-an-install/figure-01-five-stage-pipeline.svg',
        mode: 'inspect',
      },
    ],
  },
  {
    slug: 'what-is-a-payload-cms-block',
    order: 3,
    series: 'foundations',
    thesis: 'Editor choices become typed React output.',
    prompt: 'Start with one block and trace it end to end.',
    primary: {
      kind: 'source',
      label: 'Payload block slug',
      path: 'payload-components/source/blocks/HeroBasic/config.ts',
      anchor: "slug: 'heroBasic'",
      take: 12,
    },
    secondary: {
      kind: 'sequence',
      label: 'Runtime and compile-time block paths',
      items: [
        'config → editor → stored data',
        'config → generated type → compile check',
        'stored data → renderer → React',
      ],
    },
    figures: [
      {
        path: '/blog/what-is-a-payload-cms-block/figure-01-block-lifecycle.svg',
        mode: 'trace',
      },
    ],
  },
  {
    slug: 'build-first-payload-v3-landing-page',
    order: 4,
    series: 'foundations',
    thesis: 'Compose the argument before decorating the page.',
    prompt: 'Build the smallest useful page, then share the diff.',
    primary: {
      kind: 'registry-item',
      label: 'Hero Basic registry files',
      name: 'hero-basic',
    },
    secondary: {
      kind: 'command',
      label: 'Landing page install sequence',
      command:
        'for b in hero-basic logo-cloud-grid feature-bento faq-accordion call-to-action-centered; do npx payload-components add "$b" || exit 1; done',
      registryItems: [
        'hero-basic',
        'logo-cloud-grid',
        'feature-bento',
        'faq-accordion',
        'call-to-action-centered',
      ],
    },
    figures: [
      {
        path: '/blog/build-first-payload-v3-landing-page/figure-01-page-composition.webp',
        mode: 'see',
      },
    ],
  },
  {
    slug: 'production-ready-payload-block-config',
    order: 5,
    series: 'foundations',
    thesis: 'Explicit contracts survive handoffs.',
    prompt: "Make the next maintainer's assumptions visible.",
    primary: {
      kind: 'source',
      label: 'Explicit block config',
      path: 'payload-components/source/blocks/HeroBasic/config.ts',
      anchor: 'export const HeroBasic',
      take: 10,
    },
    secondary: {
      kind: 'sequence',
      label: 'Config contract map',
      items: ['slug', 'interfaceName', 'labels', 'fields'],
    },
    figures: [
      {
        path: '/blog/production-ready-payload-block-config/figure-01-config-anatomy.svg',
        mode: 'inspect',
      },
    ],
  },
  {
    slug: 'how-renderblocks-works',
    order: 6,
    series: 'foundations',
    thesis: 'One discriminator chooses one component.',
    prompt: 'Keep the map boring enough to review.',
    primary: {
      kind: 'source',
      label: 'Renderer map insertion',
      path: 'tools/payload-components/project.ts',
      anchor: 'const propertyLine',
      take: 11,
    },
    secondary: {
      kind: 'sequence',
      label: 'Renderer dispatch',
      items: ['layout[]', 'renderer map', 'component', 'page'],
    },
    figures: [
      {
        path: '/blog/how-renderblocks-works/figure-01-renderer-dispatch.svg',
        mode: 'trace',
      },
    ],
  },
  {
    slug: 'payload-types-and-import-map',
    order: 7,
    series: 'foundations',
    thesis: 'Two generators protect two different consumers.',
    prompt: 'Regenerate both, then report which boundary failed.',
    primary: {
      kind: 'source',
      label: 'Post-install generators',
      path: 'payload-components/manifests/hero-basic.json',
      anchor: '"postInstall"',
      take: 4,
    },
    secondary: {
      kind: 'sequence',
      label: 'Generation branches',
      items: ['Config → types → frontend', 'Config → import map → admin'],
    },
    figures: [
      {
        path: '/blog/payload-types-and-import-map/figure-01-generation-pipelines.svg',
        mode: 'trace',
      },
    ],
  },
  {
    slug: 'payload-block-not-rendering',
    order: 8,
    series: 'foundations',
    thesis: 'Inspect the first broken contract.',
    prompt: 'Bring evidence, not guesses, to the issue.',
    primary: {
      kind: 'source',
      label: 'Doctor command',
      path: 'tools/payload-components/commands/doctor.ts',
      anchor: 'export const doctorCommand',
      take: 11,
    },
    secondary: {
      kind: 'sequence',
      label: 'Rendering checklist',
      items: ['data', 'registration', 'map', 'props', 'generated output'],
    },
    figures: [
      {
        path: '/blog/payload-block-not-rendering/figure-01-debug-tree.svg',
        mode: 'trace',
      },
    ],
  },
  {
    slug: 'copying-is-not-installing',
    order: 9,
    series: 'installer-internals',
    thesis: 'Files are the start; wiring completes the install.',
    prompt: 'Inspect the diff before you call it installed.',
    primary: {
      kind: 'registry-item',
      label: 'Hero registry item',
      name: 'hero-basic',
    },
    secondary: {
      kind: 'sequence',
      label: 'Files and wiring',
      items: ['copied files', 'manifest fragments', 'generators', 'install state'],
    },
    figures: [
      {
        path: '/blog/copying-is-not-installing/figure-01-copy-vs-install.svg',
        mode: 'trace',
      },
    ],
  },
  {
    slug: 'shadcn-registry-for-payload-cms',
    order: 10,
    series: 'installer-internals',
    thesis: 'Portable JSON delivers reviewable source.',
    prompt: 'Verify the public item from a clean checkout.',
    primary: {
      kind: 'registry-item',
      label: 'Hero registry item',
      name: 'hero-basic',
    },
    secondary: {
      kind: 'sequence',
      label: 'Registry delivery',
      items: ['registry source', 'build', '/r/hero-basic.json', 'consumer repository'],
    },
    figures: [
      {
        path: '/blog/shadcn-registry-for-payload-cms/figure-01-registry-delivery.svg',
        mode: 'trace',
      },
    ],
  },
  {
    slug: 'manifest-wiring-contract',
    order: 11,
    series: 'installer-internals',
    thesis: 'The manifest makes installation promises executable.',
    prompt: 'If a promise is missing, improve the manifest.',
    primary: {
      kind: 'source',
      label: 'Payload fragments',
      path: 'payload-components/manifests/hero-basic.json',
      anchor: '"payloadFragments"',
      take: 12,
    },
    secondary: {
      kind: 'sequence',
      label: 'Manifest layers',
      items: ['files', 'dependencies', 'fragments', 'post-install', 'state'],
    },
    figures: [
      {
        path: '/blog/manifest-wiring-contract/figure-01-manifest-layers.svg',
        mode: 'inspect',
      },
    ],
  },
  {
    slug: 'text-anchors-vs-ast',
    order: 12,
    series: 'installer-internals',
    thesis: 'A smaller patch is easier to trust.',
    prompt: 'Share the host shape that broke the anchor.',
    primary: {
      kind: 'source',
      label: 'Scoped text patcher',
      path: 'tools/payload-components/project.ts',
      anchor: 'applyRenderBlocksFragment',
      take: 11,
    },
    secondary: {
      kind: 'diff',
      label: 'Tested renderer map insertion',
      path: 'tests/int/payload-components-fragment.int.spec.ts',
      anchor: 'heroBasic: HeroBasicBlock,',
      before: ['const blockComponents = {', '}'],
      after: ['const blockComponents = {', '  heroBasic: HeroBasicBlock,', '}'],
    },
    figures: [
      {
        path: '/blog/text-anchors-vs-ast/figure-01-scoped-diff.svg',
        mode: 'inspect',
      },
    ],
  },
  {
    slug: 'idempotent-code-installer',
    order: 13,
    series: 'installer-internals',
    thesis: 'Every retry should converge.',
    prompt: 'Turn the failure into a fixture.',
    primary: {
      kind: 'source',
      label: 'Installed state recorder',
      path: 'tools/payload-components/state.ts',
      anchor: 'state.components[manifest.name] = upsertEntry',
      take: 11,
    },
    secondary: {
      kind: 'sequence',
      label: 'Convergent retry flow',
      items: ['new', 'partial', 'retry', 'complete', 'unchanged rerun'],
    },
    figures: [
      {
        path: '/blog/idempotent-code-installer/figure-01-convergence-state.svg',
        mode: 'trace',
      },
    ],
  },
  {
    slug: 'payload-components-doctor',
    order: 14,
    series: 'installer-internals',
    thesis: 'Diagnosis should preserve the evidence.',
    prompt: 'Paste the smallest sanitized report that reproduces the drift.',
    primary: {
      kind: 'source',
      label: 'Doctor command',
      path: 'tools/payload-components/commands/doctor.ts',
      anchor: 'export const doctorCommand',
      take: 11,
    },
    secondary: {
      kind: 'sequence',
      label: 'Doctor report labels',
      items: [
        'project + scripts',
        'state + peer deps',
        'package deps + files',
        'registry deps + fragments',
      ],
    },
    figures: [
      {
        path: '/blog/payload-components-doctor/figure-01-doctor-report.svg',
        mode: 'inspect',
      },
    ],
  },
  {
    slug: 'component-variants-without-prop-explosion',
    order: 15,
    series: 'component-design',
    thesis: 'Name structures instead of multiplying props.',
    prompt: 'Request the structure your editors actually need.',
    primary: {
      kind: 'route',
      label: 'Feature family catalog results',
      route: '/components?category=features',
      capture: {
        columns: 2,
        position: 'bottom',
        selectors: ['#feature-bento', '#feature-split', '#feature-steps', '#feature-grid-basic'],
      },
    },
    secondary: {
      kind: 'sequence',
      label: 'Explicit feature family',
      items: [
        'prop explosion',
        'feature-bento',
        'feature-split',
        'feature-steps',
        'feature-grid-basic',
      ],
    },
    figures: [
      {
        path: '/blog/component-variants-without-prop-explosion/figure-01-family-vs-matrix.svg',
        mode: 'trace',
      },
    ],
  },
  {
    slug: 'shared-fields-across-component-families',
    order: 16,
    series: 'component-design',
    thesis: 'Share the vocabulary; keep structures explicit.',
    prompt: 'Change the shared rule once and test every consumer.',
    primary: {
      kind: 'source',
      label: 'Shared feature fields',
      path: 'payload-components/source/blocks/shared/featureFields.ts',
      anchor: 'export const featureFields',
      take: 14,
    },
    secondary: {
      kind: 'command',
      label: 'Feature family registry consumers',
      command:
        'for b in feature-grid-basic feature-split feature-bento feature-steps; do npx payload-components add "$b" || exit 1; done',
      registryItems: ['feature-grid-basic', 'feature-split', 'feature-bento', 'feature-steps'],
    },
    figures: [
      {
        path: '/blog/shared-fields-across-component-families/figure-01-shared-fields.svg',
        mode: 'trace',
      },
    ],
  },
  {
    slug: 'choosing-payload-hero',
    order: 17,
    series: 'component-design',
    thesis: 'Choose the smallest hero that carries the decision.',
    prompt: 'What proof did your page truly need?',
    primary: {
      kind: 'source',
      label: 'Hero description and CTA constraints',
      path: 'payload-components/source/blocks/shared/heroFields.ts',
      anchor: "name: 'description'",
      take: 11,
    },
    secondary: {
      kind: 'sequence',
      label: 'Article hero-selection checklist',
      items: ['message', 'media', 'action', 'editor limits'],
    },
    figures: [
      {
        path: '/blog/choosing-payload-hero/figure-01-hero-preview.webp',
        mode: 'see',
      },
    ],
  },
  {
    slug: 'editor-friendly-feature-sections',
    order: 18,
    series: 'component-design',
    thesis: 'Model the reading rhythm, not the mockup.',
    prompt: 'Pressure-test the model with uneven real content.',
    primary: {
      kind: 'route',
      label: 'Feature Bento preview',
      route: '/components/preview/feature-bento',
    },
    secondary: {
      kind: 'sequence',
      label: 'Feature preview comparison',
      items: ['feature-bento', 'feature-split', 'feature-steps', 'feature-grid-basic'],
    },
    figures: [
      {
        path: '/blog/editor-friendly-feature-sections/figure-01-feature-comparison.webp',
        mode: 'see',
      },
    ],
  },
  {
    slug: 'modeling-pricing-pages',
    order: 19,
    series: 'component-design',
    thesis: 'Pricing content is a product model.',
    prompt: 'Make the comparison honest before making it polished.',
    primary: {
      kind: 'route',
      label: 'Pricing Cards preview',
      route: '/components/preview/pricing-cards',
    },
    secondary: {
      kind: 'sequence',
      label: 'Pricing field and preview comparison',
      items: ['pricing-cards', 'pricing-cards-muted', 'pricing-split', 'pricing-enterprise'],
    },
    figures: [
      {
        path: '/blog/modeling-pricing-pages/figure-01-pricing-montage.webp',
        mode: 'see',
      },
    ],
  },
  {
    slug: 'social-proof-sections',
    order: 20,
    series: 'component-design',
    thesis: 'Credibility needs context, not decoration.',
    prompt: 'Name the claim each proof element supports.',
    primary: {
      kind: 'source',
      label: 'Testimonials array contract',
      path: 'payload-components/source/blocks/TestimonialsGrid/config.ts',
      anchor: "name: 'testimonials'",
      take: 10,
    },
    secondary: {
      kind: 'sequence',
      label: 'Registry structure choices',
      items: ['logo-cloud-grid', 'testimonials-grid', 'testimonials-rating', 'testimonials-quote'],
    },
    figures: [
      {
        path: '/blog/social-proof-sections/figure-01-social-proof-montage.webp',
        mode: 'see',
      },
    ],
  },
  {
    slug: 'build-saas-homepage',
    order: 21,
    series: 'production-guides',
    thesis: 'A homepage is an argument.',
    prompt: "Map the smallest sequence that makes the page's argument clear.",
    primary: {
      kind: 'route',
      label: 'Homepage component inventory',
      route: '/components',
      capture: {
        columns: 2,
        position: 'bottom',
        selectors: ['#hero-basic', '#logo-cloud-grid', '#feature-bento', '#pricing-cards'],
      },
    },
    secondary: {
      kind: 'sequence',
      label: 'Homepage blueprint',
      items: ['Promise', 'proof', 'explanation', 'trust', 'action'],
    },
    figures: [
      {
        path: '/blog/build-saas-homepage/figure-01-page-blueprint.svg',
        mode: 'trace',
      },
      {
        path: '/blog/build-saas-homepage/figure-02-component-montage.webp',
        mode: 'see',
      },
    ],
  },
  {
    slug: 'build-payload-blog-frontend',
    order: 22,
    series: 'production-guides',
    thesis: 'One post contract feeds every surface.',
    prompt: 'Fix drift at the source, then contribute the guardrail.',
    primary: {
      kind: 'route',
      label: 'Blog index and article',
      route: '/blog',
    },
    secondary: {
      kind: 'sequence',
      label: 'Post projections',
      items: ['validated MDX entry', '/blog + article', 'related posts', 'RSS + OG + sitemap'],
    },
    figures: [
      {
        path: '/blog/build-payload-blog-frontend/figure-01-editorial-architecture.svg',
        mode: 'trace',
      },
      {
        path: '/blog/build-payload-blog-frontend/figure-02-post-component-montage.webp',
        mode: 'see',
      },
    ],
  },
  {
    slug: 'accessible-faq-blocks',
    order: 23,
    series: 'production-guides',
    thesis: 'Disclosure state must tell one truth.',
    prompt: 'Test it with a keyboard before you call it accessible.',
    primary: {
      kind: 'source',
      label: 'FAQ accordion component',
      path: 'payload-components/source/blocks/FaqAccordion/Component.tsx',
      anchor: '<Accordion type="single"',
      take: 10,
    },
    secondary: {
      kind: 'sequence',
      label: 'Article accessibility checklist',
      items: ['button', 'expanded state', 'answer panel', 'keyboard', 'reduced motion'],
    },
    figures: [
      {
        path: '/blog/accessible-faq-blocks/figure-01-faq-anatomy.svg',
        mode: 'trace',
      },
    ],
  },
  {
    slug: 'safe-links-forms-embeds',
    order: 24,
    series: 'production-guides',
    thesis: 'Editable does not mean executable.',
    prompt: 'Contribute the narrowest safe policy you can explain.',
    primary: {
      kind: 'source',
      label: 'Safe embed URL policy',
      path: 'payload-components/source/blocks/shared/safeUrls.ts',
      anchor: "if (parsed.protocol !== 'https:'",
      take: 11,
    },
    secondary: {
      kind: 'sequence',
      label: 'Editable trust boundaries',
      items: ['link', 'form action', 'embed'],
    },
    figures: [
      {
        path: '/blog/safe-links-forms-embeds/figure-01-trust-boundary.svg',
        mode: 'trace',
      },
    ],
  },
  {
    slug: 'motion-without-performance-cost',
    order: 25,
    series: 'production-guides',
    thesis: 'Motion changes the journey, not the destination.',
    prompt: 'Verify the same content survives reduced motion.',
    primary: {
      kind: 'source',
      label: 'Reduced-motion branch',
      path: 'payload-components/source/components/ui/infinite-slider.tsx',
      anchor: 'useReducedMotion',
      take: 14,
    },
    secondary: {
      kind: 'sequence',
      label: 'Motion branches',
      items: ['default motion', 'reduced motion', 'same content'],
    },
    figures: [
      {
        path: '/blog/motion-without-performance-cost/figure-01-motion-timeline.svg',
        mode: 'trace',
      },
    ],
  },
  {
    slug: 'type-safe-block-rendering',
    order: 26,
    series: 'production-guides',
    thesis: 'Narrow content before adding wrappers.',
    prompt: 'Make impossible render states fail at typecheck.',
    primary: {
      kind: 'source',
      label: 'Hero render props',
      path: 'payload-components/source/blocks/HeroBasic/Component.tsx',
      anchor: 'type Props',
      take: 12,
    },
    secondary: {
      kind: 'sequence',
      label: 'Type-safe rendering path',
      items: ['union', 'blockType', 'renderer map', 'wrapper props', 'output'],
    },
    figures: [
      {
        path: '/blog/type-safe-block-rendering/figure-01-type-safe-rendering.svg',
        mode: 'trace',
      },
    ],
  },
  {
    slug: 'demo-twins',
    order: 27,
    series: 'open-source',
    thesis: 'Two runtimes share one visual contract.',
    prompt: 'When source changes, update the twin in the same contribution.',
    primary: {
      kind: 'source',
      label: 'Per-element class fidelity assertion',
      path: 'tests/int/demo-twins.int.spec.ts',
      anchor: 'const missing = literals.filter',
      take: 8,
    },
    secondary: {
      kind: 'sequence',
      label: 'Presentational twin guard',
      items: ['aria-hidden roots', 'no links', 'no buttons', 'no headings'],
    },
    figures: [
      {
        path: '/blog/demo-twins/figure-01-architecture-mirror.svg',
        mode: 'trace',
      },
      {
        path: '/blog/demo-twins/figure-02-source-preview.webp',
        mode: 'see',
      },
    ],
  },
  {
    slug: 'visual-regression-component-registry',
    order: 28,
    series: 'open-source',
    thesis: 'A screenshot becomes a contract through review.',
    prompt: 'Mint the baseline where CI renders it.',
    primary: {
      kind: 'source',
      label: 'Component visual snapshots',
      path: 'tests/e2e/components-visual.e2e.spec.ts',
      anchor: 'Component visual snapshots',
      take: 14,
    },
    secondary: {
      kind: 'sequence',
      label: 'Visual regression gate',
      items: ['capture', 'compare', 'baseline', 'platform coverage gate'],
    },
    figures: [
      {
        path: '/blog/visual-regression-component-registry/figure-01-regression-pipeline.svg',
        mode: 'trace',
      },
    ],
  },
  {
    slug: 'contribute-payload-component',
    order: 29,
    series: 'open-source',
    thesis: 'A component ships as one connected bundle.',
    prompt: 'Leave the contribution easier than you found it.',
    primary: {
      kind: 'source',
      label: 'Add-a-component workflow',
      path: 'payload-components/templates/component-template/README.md',
      anchor: 'Every component ships as one bundle',
      take: 5,
    },
    secondary: {
      kind: 'sequence',
      label: 'Seven contribution surfaces',
      items: ['source', 'manifest', 'registry', 'demo twin', 'catalog + ledgers', 'docs', 'tests'],
    },
    figures: [
      {
        path: '/blog/contribute-payload-component/figure-01-contribution-workflow.svg',
        mode: 'join',
      },
    ],
  },
  {
    slug: 'reproducible-shadcn-registry',
    order: 30,
    series: 'open-source',
    thesis: 'Clean checkouts should produce identical registry JSON.',
    prompt: 'Turn nondeterminism into a failing check.',
    primary: {
      kind: 'source',
      label: 'Generated registry comparison check',
      path: 'tools/payload-components/check-public-registry.ts',
      anchor: 'assertEqual(publicRegistry, sourceRegistry',
      take: 3,
    },
    secondary: {
      kind: 'sequence',
      label: 'Broader registry pipeline',
      items: ['checkout', 'build', 'validate', 'compare'],
    },
    figures: [
      {
        path: '/blog/reproducible-shadcn-registry/figure-01-deterministic-build.svg',
        mode: 'inspect',
      },
    ],
  },
  {
    slug: 'open-source-provenance',
    order: 31,
    series: 'open-source',
    thesis: 'Permission is one link in the chain.',
    prompt: 'Record enough lineage for the next maintainer.',
    primary: {
      kind: 'source',
      label: 'MIT license',
      path: 'LICENSE',
      anchor: 'MIT License',
      take: 12,
    },
    secondary: {
      kind: 'sequence',
      label: 'Provenance chain',
      items: ['source rev', 'license', 'changes + notice', 'publish'],
    },
    figures: [
      {
        path: '/blog/open-source-provenance/figure-01-provenance-chain.svg',
        mode: 'inspect',
      },
    ],
  },
  {
    slug: 'community-driven-roadmap',
    order: 32,
    series: 'open-source',
    thesis: 'Real installs are the roadmap signal.',
    prompt: 'Bring a reproducible need, not a screenshot wishlist.',
    primary: {
      kind: 'source',
      label: 'Install support triage',
      path: 'content/docs/operations.mdx',
      anchor: 'Sort every support report into one lane first.',
      take: 1,
    },
    secondary: {
      kind: 'sequence',
      label: 'Community feedback loop',
      items: ['install', 'evidence', 'issue', 'contribution', 'release'],
    },
    figures: [
      {
        path: '/blog/community-driven-roadmap/figure-01-feedback-loop.svg',
        mode: 'join',
      },
    ],
  },
  {
    slug: 'templates-are-here',
    order: 33,
    series: 'project-notes',
    thesis: 'Complete concepts turn isolated blocks into inspectable site systems.',
    prompt: 'Explore one concept, install one block, and share what a real project still needs.',
    primary: {
      kind: 'route',
      label: 'Six-concept Templates gallery',
      route: '/templates',
      capture: {
        columns: 3,
        position: 'top',
        selectors: ['main'],
      },
    },
    secondary: {
      kind: 'sequence',
      label: 'Community learning loop',
      items: ['explore', 'inspect recipe', 'install one block', 'share evidence'],
    },
    figures: [
      {
        path: '/blog/templates-are-here/figure-01-template-gallery.webp',
        mode: 'see',
      },
    ],
  },
]

export const blogVisualCatalog = catalogEntries satisfies readonly BlogVisualEntry[]

export const getBlogVisualEntry = (slug: string): BlogVisualEntry => {
  const entry = blogVisualCatalog.find((candidate) => candidate.slug === slug)

  if (!entry) {
    throw new Error(`Unknown blog visual entry "${slug}".`)
  }

  return entry
}
