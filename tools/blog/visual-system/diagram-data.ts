import { resolveArtifact } from './artifacts'
import { blogVisualCatalog } from './catalog'

import type { BlogVisualSeries, FigureMode } from './types'

export type DiagramNodeKind = 'code' | 'standard' | 'terminal'

export type DiagramNode = {
  body: string
  id: string
  kind?: DiagramNodeKind
  title: string
}

export type DiagramEdge = {
  from: string
  label?: string
  to: string
}

export type DiagramDefinition = {
  description: string
  edges?: readonly DiagramEdge[]
  evidenceLines?: number
  evidenceRole?: 'primary' | 'secondary'
  kicker: string
  path: string
  rows: readonly (readonly DiagramNode[])[]
  title: string
}

export type HydratedDiagram = DiagramDefinition & {
  evidenceExcerpt?: string
  mode: Exclude<FigureMode, 'see'>
  order: number
  prompt: string
  provenance: string
  series: BlogVisualSeries
  slug: string
}

export const diagramDefinitions: readonly DiagramDefinition[] = [
  {
    path: '/blog/hello/figure-01-origin-story.svg',
    kicker: 'WHY THE PROJECT STARTED',
    title: 'Useful source includes the field model and the wiring around it',
    description:
      'The Hero Basic shared fields, block source, host wiring, and generated application contracts join as one install.',
    evidenceLines: 8,
    rows: [
      [
        {
          id: 'shared-fields',
          title: 'Shared field source',
          body: 'src/blocks/shared/heroFields.ts\nships with Hero Basic',
          kind: 'code',
        },
        {
          id: 'block-source',
          title: 'Owned block source',
          body: 'config.ts + Component.tsx\ncontent contract + rendered section',
          kind: 'code',
        },
      ],
      [
        {
          id: 'host-wiring',
          title: 'Payload host wiring',
          body: 'Pages layout + RenderBlocks\nregister + map',
        },
        {
          id: 'generated-contracts',
          title: 'Application contracts',
          body: 'generate:types + generate:importmap\nrefresh after wiring',
          kind: 'code',
        },
      ],
    ],
    edges: [
      { from: 'shared-fields', to: 'block-source' },
      { from: 'block-source', to: 'host-wiring' },
      { from: 'host-wiring', to: 'generated-contracts' },
    ],
  },
  {
    path: '/blog/anatomy-of-an-install/figure-01-five-stage-pipeline.svg',
    kicker: 'PAYLOAD-COMPONENTS ADD',
    title: 'Five conditional stage boundaries make failures reviewable',
    description:
      'Planning and preflight happen before the five named installer stages; installed state is written only after every required stage succeeds.',
    evidenceLines: 7,
    rows: [
      [
        {
          id: 'plan',
          title: 'Plan + preflight',
          body: 'load manifest · detect target · resolve plan\ncheck files · deps · fragments · state',
        },
      ],
      [
        {
          id: 'registry-build',
          title: '1 · registry-build',
          body: 'Build temporary\nregistry output',
          kind: 'code',
        },
        {
          id: 'registry-add',
          title: '2 · registry-add',
          body: 'Install missing source\n+ registry deps',
          kind: 'code',
        },
        {
          id: 'dependency-install',
          title: '3 · dependency-install',
          body: 'Install missing\nmanifest packages',
          kind: 'code',
        },
        {
          id: 'fragment-apply',
          title: '4 · fragment-apply',
          body: 'Patch Pages\n+ RenderBlocks',
          kind: 'code',
        },
        {
          id: 'post-install',
          title: '5 · post-install',
          body: 'Run types\n+ import map',
          kind: 'code',
        },
      ],
      [
        {
          id: 'state-outcome',
          title: 'State records attempt, failure, or success',
          body: 'failure → lastError { stage, message }\nsuccess → installed after all required stages',
          kind: 'code',
        },
      ],
    ],
    edges: [
      { from: 'plan', to: 'registry-build' },
      { from: 'registry-build', to: 'registry-add' },
      { from: 'registry-add', to: 'dependency-install' },
      { from: 'dependency-install', to: 'fragment-apply' },
      { from: 'fragment-apply', to: 'post-install' },
      { from: 'post-install', to: 'state-outcome' },
    ],
  },
  {
    path: '/blog/what-is-a-payload-cms-block/figure-01-block-lifecycle.svg',
    kicker: 'BLOCK LIFECYCLE',
    title: 'Runtime data and compile-time types meet at RenderBlocks',
    description:
      'Payload config drives the editor and generated types, while stored layout data moves at runtime through RenderBlocks into React.',
    evidenceLines: 8,
    rows: [
      [
        {
          id: 'config',
          title: 'Block config',
          body: "slug: 'heroBasic'\nfields define editor data",
          kind: 'code',
        },
      ],
      [
        {
          id: 'editor',
          title: 'Payload editor',
          body: 'Choose the block\nfill fields · save',
        },
        {
          id: 'types',
          title: 'Compile-time guard',
          body: "Page['layout'] union\nchecks source; no runtime transform",
          kind: 'code',
        },
      ],
      [
        {
          id: 'stored',
          title: 'Stored layout data',
          body: "layout[] carries\nblockType: 'heroBasic'",
          kind: 'code',
        },
        {
          id: 'renderer',
          title: 'RenderBlocks',
          body: 'Runtime lookup by blockType',
          kind: 'code',
        },
        {
          id: 'component',
          title: 'HeroBasicBlock',
          body: 'Generated fields + wrapper props',
          kind: 'code',
        },
        {
          id: 'react',
          title: 'React output',
          body: 'The section joins the page order',
        },
      ],
    ],
    edges: [
      { from: 'config', to: 'editor' },
      { from: 'config', to: 'types' },
      { from: 'editor', to: 'stored' },
      { from: 'types', to: 'renderer' },
      { from: 'stored', to: 'renderer' },
      { from: 'renderer', to: 'component' },
      { from: 'component', to: 'react' },
    ],
  },
  {
    path: '/blog/production-ready-payload-block-config/figure-01-config-anatomy.svg',
    kicker: 'CONFIG ANATOMY',
    title: 'Four explicit properties create a reviewable block contract',
    description:
      'Slug, interface name, labels, and fields serve different consumers without claiming to prove production readiness on their own.',
    evidenceLines: 9,
    rows: [
      [
        { id: 'slug', title: 'slug', body: 'Stable stored discriminator', kind: 'code' },
        {
          id: 'interface',
          title: 'interfaceName',
          body: 'Readable generated type name',
          kind: 'code',
        },
        {
          id: 'labels',
          title: 'labels',
          body: 'Editor-facing singular + plural',
          kind: 'code',
        },
        {
          id: 'fields',
          title: 'fields',
          body: 'Content shape + validation',
          kind: 'code',
        },
      ],
      [
        {
          id: 'contract',
          title: 'Reviewable block contract',
          body: 'Clear stored data · editor language · generated type expectations',
        },
      ],
    ],
    edges: [
      { from: 'slug', to: 'contract' },
      { from: 'interface', to: 'contract' },
      { from: 'labels', to: 'contract' },
      { from: 'fields', to: 'contract' },
    ],
  },
  {
    path: '/blog/how-renderblocks-works/figure-01-renderer-dispatch.svg',
    kicker: 'RENDERER DISPATCH',
    title: 'Each stored blockType selects one real exported component',
    description:
      'Ordered Page layout data dispatches through explicit renderer keys to the repository’s actual named block exports.',
    evidenceLines: 8,
    rows: [
      [
        {
          id: 'layout',
          title: "Page['layout']",
          body: 'Ordered runtime block records',
          kind: 'code',
        },
      ],
      [
        {
          id: 'hero',
          title: 'heroBasic',
          body: 'HeroBasicBlock',
          kind: 'code',
        },
        {
          id: 'feature',
          title: 'featureBento',
          body: 'FeatureBentoBlock',
          kind: 'code',
        },
        {
          id: 'quote',
          title: 'contentQuote',
          body: 'ContentQuoteBlock',
          kind: 'code',
        },
      ],
      [
        {
          id: 'page',
          title: 'Next.js page',
          body: 'Sections keep the editor’s order',
        },
      ],
    ],
    edges: [
      { from: 'layout', to: 'hero' },
      { from: 'layout', to: 'feature' },
      { from: 'layout', to: 'quote' },
      { from: 'hero', to: 'page' },
      { from: 'feature', to: 'page' },
      { from: 'quote', to: 'page' },
    ],
  },
  {
    path: '/blog/payload-types-and-import-map/figure-01-generation-pipelines.svg',
    kicker: 'TWO GENERATED BOUNDARIES',
    title: 'Types guard source at compile time; the import map resolves admin modules',
    description:
      'The two generators derive different artifacts from Payload config and protect different consumers.',
    evidenceLines: 4,
    rows: [
      [
        {
          id: 'schema-config',
          title: 'Schema changes',
          body: 'Block fields + interface names',
          kind: 'code',
        },
        {
          id: 'admin-config',
          title: 'Admin paths change',
          body: 'Custom component module paths',
          kind: 'code',
        },
      ],
      [
        {
          id: 'generate-types',
          title: 'generate:types',
          body: 'Refresh payload-types.ts',
          kind: 'code',
        },
        {
          id: 'generate-map',
          title: 'generate:importmap',
          body: 'Refresh admin importMap.js',
          kind: 'code',
        },
      ],
      [
        {
          id: 'compile',
          title: 'TypeScript boundary',
          body: 'Compile-time field and union guard',
        },
        {
          id: 'admin',
          title: 'Payload admin runtime',
          body: 'Module specifiers resolve to components',
        },
      ],
    ],
    edges: [
      { from: 'schema-config', to: 'generate-types' },
      { from: 'generate-types', to: 'compile' },
      { from: 'admin-config', to: 'generate-map' },
      { from: 'generate-map', to: 'admin' },
    ],
  },
  {
    path: '/blog/payload-block-not-rendering/figure-01-debug-tree.svg',
    kicker: 'EVIDENCE-FIRST DEBUGGING',
    title: 'Walk from route identity to rendered output; clear caches last',
    description:
      'The checklist follows the article’s actual diagnostic order instead of grouping unrelated failures into one browser symptom.',
    evidenceLines: 7,
    rows: [
      [
        {
          id: 'document',
          title: '1 · Route + document',
          body: 'Confirm slug · locale · draft · access\ninspect saved layout[]',
        },
      ],
      [
        {
          id: 'registration',
          title: '2 · Registration',
          body: 'If data is absent, inspect\nPages layout blocks',
        },
        {
          id: 'dispatch',
          title: '3–4 · Dispatch',
          body: 'Match blockType exactly\ncheck import + named export',
        },
        {
          id: 'generated',
          title: '5–6 · Generated files',
          body: 'types first\nimport map when paths changed',
        },
      ],
      [
        {
          id: 'props',
          title: '7 · Real props',
          body: 'Narrow relationships + optional data',
        },
        {
          id: 'dom',
          title: '8 · DOM + CSS',
          body: 'Prove the section is present and visible',
        },
        {
          id: 'runtime',
          title: '9 · Runtime boundary',
          body: 'Separate server error from hydration',
        },
        {
          id: 'cache',
          title: '10 · Caches last',
          body: 'Clear only with stale-output evidence',
        },
      ],
    ],
    edges: [
      { from: 'document', to: 'registration' },
      { from: 'document', to: 'dispatch' },
      { from: 'registration', to: 'dispatch' },
      { from: 'dispatch', to: 'generated' },
      { from: 'generated', to: 'props' },
      { from: 'props', to: 'dom' },
      { from: 'dom', to: 'runtime' },
      { from: 'runtime', to: 'cache' },
    ],
  },
  {
    path: '/blog/copying-is-not-installing/figure-01-copy-vs-install.svg',
    kicker: 'FILES ARE THE START',
    title: 'Direct registry delivery and a wired install stop at different boundaries',
    description:
      'Both paths deliver reviewable source, while the companion installer also handles Payload integration and recorded recovery state.',
    rows: [
      [
        {
          id: 'direct',
          title: 'Direct shadcn delivery',
          body: 'shared fields · config · component\npublic registry dependencies',
        },
        {
          id: 'wrapper',
          title: 'payload-components add',
          body: 'the same owned source\n+ manifest-backed install plan',
          kind: 'code',
        },
      ],
      [
        {
          id: 'manual',
          title: 'Application completes',
          body: 'register · map · run generators · verify',
        },
        {
          id: 'wired',
          title: 'Installer-owned integration',
          body: 'manifest deps · fragments · generators · state',
        },
      ],
    ],
    edges: [
      { from: 'direct', to: 'manual' },
      { from: 'wrapper', to: 'wired' },
    ],
  },
  {
    path: '/blog/shadcn-registry-for-payload-cms/figure-01-registry-delivery.svg',
    kicker: 'REGISTRY DELIVERY',
    title: 'Source paths become portable JSON, then consumer-owned files',
    description:
      'The shadcn build resolves source content into public registry artifacts for direct file delivery.',
    rows: [
      [
        {
          id: 'source',
          title: 'Source registry',
          body: 'registry.json · item paths\n~/src consumer targets',
          kind: 'code',
        },
        {
          id: 'build',
          title: 'shadcn build',
          body: 'Resolve + embed source content',
          kind: 'code',
        },
        {
          id: 'public',
          title: 'Public artifacts',
          body: '/r/registry.json\n/r/hero-basic.json',
          kind: 'code',
        },
        {
          id: 'consumer',
          title: 'Direct shadcn add',
          body: 'Files land under the consumer src tree',
        },
      ],
    ],
  },
  {
    path: '/blog/manifest-wiring-contract/figure-01-manifest-layers.svg',
    kicker: 'EXECUTABLE WIRING CONTRACT',
    title: 'Manifest declarations drive the plan; state records the outcome',
    description:
      'Files, dependencies, fragments, and post-install scripts feed CLI execution rather than being copied verbatim into install state.',
    evidenceLines: 10,
    rows: [
      [
        {
          id: 'files',
          title: 'files',
          body: 'Expected consumer paths',
          kind: 'code',
        },
        {
          id: 'dependencies',
          title: 'dependencies',
          body: 'packages + peer requirements',
          kind: 'code',
        },
        {
          id: 'fragments',
          title: 'payloadFragments',
          body: 'Pages + RenderBlocks edits',
          kind: 'code',
        },
        {
          id: 'post',
          title: 'postInstall',
          body: 'types + import map scripts',
          kind: 'code',
        },
      ],
      [
        {
          id: 'cli',
          title: 'CLI contract',
          body: 'resolve plan · execute missing work · doctor checks expectations',
        },
      ],
      [
        {
          id: 'state',
          title: 'Install state',
          body: 'manifestVersion · registryItemName · targetId · status\ninstalledAt · lastAttemptAt · lastError · patchedFiles',
          kind: 'code',
        },
      ],
    ],
    edges: [
      { from: 'files', to: 'cli' },
      { from: 'dependencies', to: 'cli' },
      { from: 'fragments', to: 'cli' },
      { from: 'post', to: 'cli' },
      { from: 'cli', to: 'state' },
    ],
  },
  {
    path: '/blog/text-anchors-vs-ast/figure-01-scoped-diff.svg',
    kicker: 'TESTED SCOPED PATCH',
    title: 'Locate the supported object, deduplicate, then insert one exact mapping',
    description:
      'The renderer patch masks comments and strings, checks the named import and direct map entry, and preserves surrounding source.',
    evidenceRole: 'secondary',
    evidenceLines: 8,
    rows: [
      [
        {
          id: 'before',
          title: 'Before',
          body: 'const blockComponents = {\n}',
          kind: 'code',
        },
      ],
      [
        {
          id: 'patch',
          title: 'Supported top-level object',
          body: 'ignore comments + strings\ndedupe named import + direct key',
          kind: 'code',
        },
      ],
      [
        {
          id: 'after',
          title: 'After',
          body: 'const blockComponents = {\n  heroBasic: HeroBasicBlock,\n}',
          kind: 'code',
        },
      ],
    ],
    edges: [
      { from: 'before', to: 'patch', label: 'locate' },
      { from: 'patch', to: 'after', label: 'insert once' },
    ],
  },
  {
    path: '/blog/idempotent-code-installer/figure-01-convergence-state.svg',
    kicker: 'CONVERGENCE BY RECHECKING',
    title: 'Retries re-observe the repository instead of resuming a stored cursor',
    description:
      'Every staged attempt begins partial, failures record the last failed stage, and valid installed work returns before mutation.',
    evidenceLines: 9,
    rows: [
      [
        {
          id: 'preflight',
          title: 'Preflight observations',
          body: 'state + files + deps + fragments',
        },
      ],
      [
        {
          id: 'attempt',
          title: 'partial attempt',
          body: 'recorded before staged mutation',
          kind: 'code',
        },
      ],
      [
        {
          id: 'failure',
          title: 'partial failure',
          body: 'lastError: { stage, message }\nnext add rechecks preflight',
          kind: 'code',
        },
        {
          id: 'installed',
          title: 'installed',
          body: 'all missing work + post-install passed',
          kind: 'code',
        },
        {
          id: 'unchanged',
          title: 'Unchanged early return',
          body: 'matching state + valid disk → no stages replayed',
          kind: 'code',
        },
      ],
    ],
    edges: [
      { from: 'preflight', to: 'attempt' },
      { from: 'attempt', to: 'failure' },
      { from: 'attempt', to: 'installed' },
      { from: 'installed', to: 'unchanged' },
    ],
  },
  {
    path: '/blog/payload-components-doctor/figure-01-doctor-report.svg',
    kicker: 'HEALTHY FIXTURE EXCERPT',
    title: 'doctor prints concrete checks, not an invented health summary',
    description:
      'A representative healthy fixture report uses the exact strings emitted by the read-only doctor command.',
    evidenceLines: 8,
    rows: [
      [
        {
          id: 'terminal',
          title: '$ npx payload-components doctor',
          body: [
            '[ok] project: payload-website-starter (Payload 3, Next 16, pnpm)',
            '[ok] scripts: generate:importmap',
            '[ok] scripts: generate:types',
            '[ok] state: 1 recorded component',
            '[ok] hero-basic: peer dependencies',
            '[ok] hero-basic: dependencies',
            '[ok] hero-basic: files',
            '[ok] hero-basic: registry dependencies',
            '[ok] hero-basic: Payload fragments',
          ].join('\n'),
          kind: 'terminal',
        },
      ],
    ],
  },
  {
    path: '/blog/component-variants-without-prop-explosion/figure-01-family-vs-matrix.svg',
    kicker: 'STRUCTURE OVER SWITCHES',
    title: 'Four shipped Feature variants replace one hidden prop matrix',
    description:
      'The real Feature family keeps structural choices in separate registry items while sharing editorial vocabulary.',
    rows: [
      [
        {
          id: 'overloaded',
          title: 'One overloaded component',
          body: 'layout? · emphasis? · sequence? · density?',
          kind: 'code',
        },
        {
          id: 'family',
          title: 'Feature family',
          body: 'Shared section fields\nexplicit structural items',
        },
      ],
      [
        {
          id: 'matrix',
          title: 'Prop matrix',
          body: 'Implicit combinations multiply',
        },
        {
          id: 'grid',
          title: 'feature-grid-basic',
          body: 'Even card grid',
          kind: 'code',
        },
        {
          id: 'split',
          title: 'feature-split',
          body: 'Heading + CTA beside list',
          kind: 'code',
        },
        {
          id: 'bento',
          title: 'feature-bento',
          body: 'Featured first cell',
          kind: 'code',
        },
        {
          id: 'steps',
          title: 'feature-steps',
          body: 'Ordered numbered flow',
          kind: 'code',
        },
      ],
    ],
    edges: [
      { from: 'overloaded', to: 'matrix' },
      { from: 'family', to: 'grid' },
      { from: 'family', to: 'split' },
      { from: 'family', to: 'bento' },
      { from: 'family', to: 'steps' },
    ],
  },
  {
    path: '/blog/shared-fields-across-component-families/figure-01-shared-fields.svg',
    kicker: 'SHARED FEATURE CONTENT',
    title: 'One shipped featureFields module feeds four structural variants',
    description:
      'Each Feature config spreads the shared eyebrow, title, and description fields before adding its own item and CTA constraints.',
    evidenceLines: 12,
    rows: [
      [
        {
          id: 'shared',
          title: 'shared/featureFields.ts',
          body: 'eyebrow · title · description',
          kind: 'code',
        },
      ],
      [
        {
          id: 'grid',
          title: 'feature-grid-basic',
          body: 'items 3–6 · links max 1',
          kind: 'code',
        },
        {
          id: 'split',
          title: 'feature-split',
          body: 'items 2–6 · links max 2',
          kind: 'code',
        },
        {
          id: 'bento',
          title: 'feature-bento',
          body: 'items 3–6 · first item leads',
          kind: 'code',
        },
        {
          id: 'steps',
          title: 'feature-steps',
          body: 'items 2–6 · array order numbers',
          kind: 'code',
        },
      ],
    ],
    edges: [
      { from: 'shared', to: 'grid' },
      { from: 'shared', to: 'split' },
      { from: 'shared', to: 'bento' },
      { from: 'shared', to: 'steps' },
    ],
  },
  {
    path: '/blog/build-saas-homepage/figure-01-page-blueprint.svg',
    kicker: 'PAGE BLUEPRINT',
    title: 'A complete homepage is a sequence of editorial jobs',
    description:
      'Promise, proof, explanation, trust, and action give each installed block one clear role.',
    rows: [
      [
        { id: 'promise', title: '1 · Promise', body: 'Hero names the useful change' },
        { id: 'proof', title: '2 · Proof', body: 'Logos + evidence reduce doubt' },
        { id: 'explain', title: '3 · Explain', body: 'Features show how it works' },
        { id: 'trust', title: '4 · Trust', body: 'FAQ addresses remaining risk' },
        { id: 'action', title: '5 · Action', body: 'One focused next step' },
      ],
    ],
  },
  {
    path: '/blog/build-payload-blog-frontend/figure-01-editorial-architecture.svg',
    kicker: 'EDITORIAL ARCHITECTURE',
    title: 'One validated MDX entry feeds every shipped blog surface',
    description:
      'The repository blog is MDX-backed; consumers can substitute a selected Payload Post without changing the projection boundaries.',
    rows: [
      [
        {
          id: 'mdx',
          title: 'content/blog/<slug>.mdx',
          body: 'Frontmatter + MDX body',
          kind: 'code',
        },
        {
          id: 'schema',
          title: 'source.config',
          body: 'Validates cover · date · order · series · tags',
          kind: 'code',
        },
        {
          id: 'source',
          title: 'blogSource',
          body: 'Flat Fumadocs page source',
          kind: 'code',
        },
      ],
      [
        {
          id: 'index',
          title: 'Blog index',
          body: 'Image-led cards + ordered archive',
        },
        {
          id: 'article',
          title: 'Article route',
          body: 'Body + table of contents + related posts',
        },
        {
          id: 'discovery',
          title: 'Article discovery',
          body: 'Tags + related posts + internal links',
        },
        {
          id: 'feed',
          title: 'RSS + OG + sitemap',
          body: 'Canonical URLs · dates · cover metadata',
        },
      ],
    ],
    edges: [
      { from: 'mdx', to: 'schema' },
      { from: 'schema', to: 'source' },
      { from: 'source', to: 'index' },
      { from: 'source', to: 'article' },
      { from: 'source', to: 'discovery' },
      { from: 'source', to: 'feed' },
    ],
  },
  {
    path: '/blog/accessible-faq-blocks/figure-01-faq-anatomy.svg',
    kicker: 'ACCESSIBLE DISCLOSURE',
    title: 'The block delegates disclosure behavior to the accordion primitive',
    description:
      'FaqAccordionBlock composes the installed accordion primitive; keyboard, expanded state, focus, and panel semantics remain behaviors to verify.',
    evidenceLines: 8,
    rows: [
      [
        {
          id: 'block',
          title: 'FaqAccordionBlock',
          body: 'Maps editor items into one accordion',
          kind: 'code',
        },
        {
          id: 'accordion',
          title: 'Accordion',
          body: 'type="single" · collapsible',
          kind: 'code',
        },
        {
          id: 'item',
          title: 'AccordionItem',
          body: 'value = item.id ?? item-N',
          kind: 'code',
        },
      ],
      [
        {
          id: 'trigger',
          title: 'AccordionTrigger',
          body: 'Question control delegates state + keyboard',
          kind: 'code',
        },
        {
          id: 'panel',
          title: 'AccordionContent',
          body: 'Answer panel · Region only when useful',
          kind: 'code',
        },
      ],
      [
        {
          id: 'verify',
          title: 'Consumer verification',
          body: 'Keyboard · expanded state · focus · reduced motion',
        },
      ],
    ],
    edges: [
      { from: 'block', to: 'accordion' },
      { from: 'accordion', to: 'item' },
      { from: 'item', to: 'trigger' },
      { from: 'item', to: 'panel' },
      { from: 'trigger', to: 'verify' },
      { from: 'panel', to: 'verify' },
    ],
  },
  {
    path: '/blog/safe-links-forms-embeds/figure-01-trust-boundary.svg',
    kicker: 'SHIPPED GUARDS / APPLICATION POLICY',
    title: 'The registry narrows URLs; the application owns consequential policy',
    description:
      'Shipped embed and form-action guards are separated from application-owned link, submission, CSP, privacy, and access decisions.',
    evidenceLines: 10,
    rows: [
      [
        {
          id: 'input',
          title: 'Editor-managed values',
          body: 'link destination · form action · embed URL',
        },
      ],
      [
        {
          id: 'embed',
          title: 'Shipped guard · embed',
          body: 'HTTPS + approved host\nsafeUrls.ts',
          kind: 'code',
        },
        {
          id: 'form-action',
          title: 'Shipped guard · action',
          body: 'Same-origin relative path\nsafeUrls.ts',
          kind: 'code',
        },
        {
          id: 'link-policy',
          title: 'Application policy · links',
          body: 'Allowed protocols + destinations',
        },
        {
          id: 'handler',
          title: 'Application policy · forms',
          body: 'Schema · access · CSRF · rate limit',
        },
        {
          id: 'browser-policy',
          title: 'Application policy · embeds',
          body: 'CSP · privacy · consent · providers',
        },
      ],
      [
        {
          id: 'output',
          title: 'Explicit capabilities',
          body: 'navigation · submission · third-party media',
        },
      ],
    ],
    edges: [
      { from: 'input', to: 'embed' },
      { from: 'input', to: 'form-action' },
      { from: 'input', to: 'link-policy' },
      { from: 'input', to: 'handler' },
      { from: 'input', to: 'browser-policy' },
      { from: 'embed', to: 'output' },
      { from: 'form-action', to: 'output' },
      { from: 'link-policy', to: 'output' },
      { from: 'handler', to: 'output' },
      { from: 'browser-policy', to: 'output' },
    ],
  },
  {
    path: '/blog/motion-without-performance-cost/figure-01-motion-timeline.svg',
    kicker: 'REAL REDUCED-MOTION BRANCH',
    title: 'The same duplicated row either translates on x or stays static',
    description:
      'InfiniteSlider renders the content first, then branches between an x-axis loop and an early reduced-motion return.',
    evidenceLines: 12,
    rows: [
      [
        {
          id: 'content',
          title: 'Rendered row',
          body: 'children + children\ntranslation starts at 0',
          kind: 'code',
        },
      ],
      [
        {
          id: 'motion',
          title: 'Motion allowed',
          body: 'x: 0 → -contentSize / 2\nlinear · repeat Infinity',
          kind: 'code',
        },
        {
          id: 'reduced',
          title: 'Reduced motion',
          body: 'effect returns; row stays static\nhover speed handlers omitted',
          kind: 'code',
        },
      ],
      [
        {
          id: 'result',
          title: 'Same content remains',
          body: 'Preference changes movement, not the rendered children',
        },
      ],
    ],
    edges: [
      { from: 'content', to: 'motion' },
      { from: 'content', to: 'reduced' },
      { from: 'motion', to: 'result' },
      { from: 'reduced', to: 'result' },
    ],
  },
  {
    path: '/blog/type-safe-block-rendering/figure-01-type-safe-rendering.svg',
    kicker: 'TYPE-SAFE RENDERING',
    title: 'Generated data narrows before application wrapper props are added',
    description:
      'The actual Hero Basic component intersects its generated block data with id, className, and container-control wrapper props.',
    evidenceLines: 10,
    rows: [
      [
        {
          id: 'union',
          title: "Page['layout']",
          body: 'Generated discriminated union',
          kind: 'code',
        },
        {
          id: 'block-type',
          title: 'blockType',
          body: 'Selects one union member',
          kind: 'code',
        },
        {
          id: 'map',
          title: 'Renderer map',
          body: 'heroBasic → HeroBasicBlock',
          kind: 'code',
        },
        {
          id: 'props',
          title: 'Props intersection',
          body: 'HeroBasicBlockData\n+ id · className · disableInnerContainer',
          kind: 'code',
        },
        {
          id: 'output',
          title: 'HeroBasicBlock',
          body: 'Typed fields render one section',
          kind: 'code',
        },
      ],
    ],
  },
  {
    path: '/blog/demo-twins/figure-01-architecture-mirror.svg',
    kicker: 'SOURCE / PREVIEW MIRROR',
    title: 'Separate runtimes share a one-way visual token guard',
    description:
      'Installable target code and site demo twins stay separate while the test requires every plain source class token to appear in its twin.',
    evidenceLines: 8,
    rows: [
      [
        {
          id: 'source',
          title: 'Installable source',
          body: 'payload-components/source',
          kind: 'code',
        },
        {
          id: 'twin',
          title: 'Site demo twin',
          body: 'src/components/site/demos',
          kind: 'code',
        },
      ],
      [
        {
          id: 'consumer',
          title: 'Consumer runtime',
          body: 'Payload types + real CMSLink',
        },
        {
          id: 'preview',
          title: 'Preview route',
          body: 'static fixtures · aria-hidden\nno a · button · h1–h6',
        },
      ],
      [
        {
          id: 'test',
          title: 'Class-token guard',
          body: 'Every source className token appears in its twin\none-way token presence, not runtime reuse',
          kind: 'code',
        },
      ],
    ],
    edges: [
      { from: 'source', to: 'consumer' },
      { from: 'twin', to: 'preview' },
      { from: 'source', to: 'test' },
      { from: 'twin', to: 'test' },
    ],
  },
  {
    path: '/blog/visual-regression-component-registry/figure-01-regression-pipeline.svg',
    kicker: 'PER-PLATFORM VISUAL GATE',
    title: 'Baseline coverage becomes strict after a platform is minted',
    description:
      'Preview capture and pixel comparison include an explicit bootstrap exception for platforms with zero committed baselines.',
    evidenceLines: 12,
    rows: [
      [
        {
          id: 'route',
          title: 'Preview route',
          body: '/components/preview/<slug>',
          kind: 'code',
        },
        {
          id: 'capture',
          title: 'Playwright capture',
          body: '1280×800 · fonts ready\nreduced motion · full page',
        },
      ],
      [
        {
          id: 'bootstrap',
          title: 'Zero baselines: bootstrap skip',
          body: 'Mint in the platform renderer\nthrough visual-baselines workflow',
        },
        {
          id: 'coverage',
          title: 'Minted-platform coverage',
          body: 'Once any baseline exists,\nevery demo slug needs one',
        },
        {
          id: 'compare',
          title: 'Pixel comparison',
          body: 'animations disabled\nmaxDiffPixelRatio 0.01',
          kind: 'code',
        },
      ],
      [
        {
          id: 'decision',
          title: 'Review decision',
          body: 'Fix drift or intentionally update this platform',
        },
      ],
    ],
    edges: [
      { from: 'route', to: 'capture' },
      { from: 'capture', to: 'bootstrap' },
      { from: 'bootstrap', to: 'coverage' },
      { from: 'capture', to: 'coverage' },
      { from: 'coverage', to: 'compare' },
      { from: 'compare', to: 'decision' },
    ],
  },
  {
    path: '/blog/contribute-payload-component/figure-01-contribution-workflow.svg',
    kicker: 'SEVEN CONTRIBUTION SURFACES',
    title: 'A complete component contribution keeps seven surfaces in agreement',
    description:
      'The canonical template workflow joins source, manifest, registry, demo twin, catalog and ledgers, docs, and tests.',
    evidenceLines: 5,
    rows: [
      [
        {
          id: 'source',
          title: '1 · Source',
          body: 'shared fields · config · component',
        },
        {
          id: 'manifest',
          title: '2 · Manifest',
          body: 'files · fragments · deps · recovery',
        },
        {
          id: 'registry',
          title: '3 · Registry',
          body: 'source paths · targets · public deps',
        },
        {
          id: 'demo',
          title: '4 · Demo twin',
          body: 'fixtures · inert preview · registry entry',
        },
      ],
      [
        {
          id: 'catalog',
          title: '5 · Catalog + ledgers',
          body: 'componentEntries · counts · component lists',
        },
        {
          id: 'docs',
          title: '6 · Docs',
          body: 'fixed page shape + meta order',
        },
        {
          id: 'tests',
          title: '7 · Tests',
          body: 'mirror · registry · install/state',
        },
      ],
    ],
    edges: [
      { from: 'source', to: 'manifest' },
      { from: 'manifest', to: 'registry' },
      { from: 'registry', to: 'demo' },
      { from: 'demo', to: 'catalog' },
      { from: 'catalog', to: 'docs' },
      { from: 'docs', to: 'tests' },
    ],
  },
  {
    path: '/blog/reproducible-shadcn-registry/figure-01-deterministic-build.svg',
    kicker: 'ACTUAL REGISTRY:CHECK',
    title: 'One temporary build is compared with canonical source in three ways',
    description:
      'The reproducibility helper creates one fresh shadcn build, then checks index JSON, item metadata, and exact embedded file content.',
    evidenceLines: 3,
    rows: [
      [
        {
          id: 'inputs',
          title: 'Canonical inputs',
          body: 'registry.json + component source',
          kind: 'code',
        },
        {
          id: 'build',
          title: 'One temporary build',
          body: 'mkdtemp + shadcn build',
          kind: 'code',
        },
      ],
      [
        {
          id: 'index',
          title: 'Index agreement',
          body: 'Parsed registry.json equals source',
        },
        {
          id: 'metadata',
          title: 'Item agreement',
          body: 'Generated metadata equals registry entry',
        },
        {
          id: 'content',
          title: 'Content agreement',
          body: 'Exact embedded content equals source text',
        },
      ],
      [
        {
          id: 'pass',
          title: 'registry:check passes',
          body: 'Temporary output is removed',
          kind: 'code',
        },
        {
          id: 'schema',
          title: 'Separate schema gate',
          body: 'registry:validate runs beside this check',
          kind: 'code',
        },
      ],
    ],
    edges: [
      { from: 'inputs', to: 'build' },
      { from: 'build', to: 'index' },
      { from: 'build', to: 'metadata' },
      { from: 'build', to: 'content' },
      { from: 'index', to: 'pass' },
      { from: 'metadata', to: 'pass' },
      { from: 'content', to: 'pass' },
    ],
  },
  {
    path: '/blog/open-source-provenance/figure-01-provenance-chain.svg',
    kicker: 'PROVENANCE CHAIN',
    title: 'Permission and lineage travel through different records',
    description:
      'Pinned upstream source, license review, adaptation notes, attribution surfaces, and shipped source comments preserve context.',
    evidenceLines: 10,
    rows: [
      [
        {
          id: 'upstream',
          title: 'Upstream source',
          body: 'repository · item · pinned commit',
        },
        {
          id: 'license',
          title: 'License review',
          body: 'MIT · permission + notice duties',
        },
        {
          id: 'adaptation',
          title: 'Adaptation',
          body: 'retokenization · Payload fields · divergence',
        },
        {
          id: 'attribution',
          title: 'Attribution',
          body: 'source comment · docs footer · provenance ledger',
        },
        {
          id: 'distribution',
          title: 'Distribution',
          body: 'Source comment ships in registry file content',
        },
      ],
    ],
  },
  {
    path: '/blog/community-driven-roadmap/figure-01-feedback-loop.svg',
    kicker: 'EVIDENCE-DRIVEN ROADMAP',
    title: 'Real installs become routed evidence, reviewed work, and future releases',
    description:
      'The loop preserves a private route for security reports and describes releases as available to install rather than automatically adopted.',
    evidenceLines: 1,
    rows: [
      [
        {
          id: 'install',
          title: 'Real install',
          body: 'Source meets a supported project',
        },
        {
          id: 'evidence',
          title: 'Evidence',
          body: 'exact command · versions · sanitized context',
        },
        {
          id: 'route',
          title: 'Routed work',
          body: 'Public issue or private advisory\nscoped proposal when appropriate',
        },
      ],
      [
        {
          id: 'release',
          title: 'Release',
          body: 'Reviewed change is\nAvailable to future installs',
        },
        {
          id: 'contribution',
          title: 'Contribution',
          body: 'code · docs · design · fixture · test',
        },
      ],
    ],
    edges: [
      { from: 'install', to: 'evidence' },
      { from: 'evidence', to: 'route' },
      { from: 'route', to: 'contribution' },
      { from: 'contribution', to: 'release' },
      { from: 'release', to: 'install' },
    ],
  },
] as const

const catalogDiagramBindings = () =>
  blogVisualCatalog.flatMap((entry) =>
    entry.figures
      .filter(
        (
          figure,
        ): figure is typeof figure & {
          mode: Exclude<FigureMode, 'see'>
        } => figure.path.endsWith('.svg') && figure.mode !== 'see',
      )
      .map((figure) => ({ entry, figure })),
  )

export const hydrateDiagramDefinitions = async (
  definitions: readonly DiagramDefinition[] = diagramDefinitions,
  {
    requireCompleteCatalog = definitions.length === diagramDefinitions.length,
  }: { requireCompleteCatalog?: boolean } = {},
): Promise<readonly HydratedDiagram[]> => {
  const bindings = catalogDiagramBindings()
  const expectedPaths = bindings.map(({ figure }) => figure.path)
  const definitionPaths = definitions.map((definition) => definition.path)

  if (requireCompleteCatalog && JSON.stringify(definitionPaths) !== JSON.stringify(expectedPaths)) {
    throw new Error(
      'Diagram definitions must match the ordered SVG paths in the blog visual catalog exactly.',
    )
  }

  const bindingsByPath = new Map(bindings.map((binding) => [binding.figure.path, binding] as const))

  return await Promise.all(
    definitions.map(async (definition) => {
      const binding = bindingsByPath.get(definition.path)
      if (!binding) {
        throw new Error(
          `Diagram definition is not bound to an SVG figure in the blog visual catalog: ${definition.path}`,
        )
      }
      const evidenceRole = definition.evidenceRole ?? 'primary'
      const resolved = await resolveArtifact(binding.entry[evidenceRole])
      const evidenceExcerpt = definition.evidenceLines
        ? resolved.evidence.split(/\r?\n/).slice(0, definition.evidenceLines).join('\n')
        : undefined

      return {
        ...definition,
        evidenceExcerpt,
        mode: binding.figure.mode,
        order: binding.entry.order,
        prompt: binding.entry.prompt,
        provenance: resolved.provenance,
        series: binding.entry.series,
        slug: binding.entry.slug,
      }
    }),
  )
}
