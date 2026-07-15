import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'

type Node = { body: string; id: string; title: string }
type Edge = { from: string; label?: string; to: string }
type Figure = {
  edges?: Edge[]
  file: string
  kicker: string
  rows: Node[][]
  title: string
}

const figures: Figure[] = [
  {
    file: 'hello/figure-01-origin-story.svg',
    kicker: 'THE ORIGIN STORY',
    title: 'A block only becomes useful when the wiring lands too',
    rows: [[
      { id: 'copy', title: 'Copy source', body: 'Config + React component' },
      { id: 'register', title: 'Register block', body: 'Pages.layout.blocks' },
      { id: 'render', title: 'Map renderer', body: 'blockType → component' },
      { id: 'generate', title: 'Regenerate', body: 'Types + admin import map' },
    ]],
  },
  {
    file: 'anatomy-of-an-install/figure-01-five-stage-pipeline.svg',
    kicker: 'PAYLOAD-COMPONENTS ADD',
    title: 'The five-stage installer pipeline',
    rows: [[
      { id: 'build', title: '1 · registry-build', body: 'Resolve item and manifest' },
      { id: 'add', title: '2 · registry-add', body: 'Copy reviewable source' },
      { id: 'deps', title: '3 · dependencies', body: 'Install public packages' },
      { id: 'patch', title: '4 · fragment-apply', body: 'Register and render' },
      { id: 'post', title: '5 · post-install', body: 'Generate + record state' },
    ]],
  },
  {
    file: 'what-is-a-payload-cms-block/figure-01-block-lifecycle.svg',
    kicker: 'BLOCK LIFECYCLE',
    title: 'Editor data travels through a typed rendering pipeline',
    rows: [[
      { id: 'editor', title: 'Payload editor', body: 'Chooses a block and fills fields' },
      { id: 'data', title: 'Stored document', body: 'layout[] with blockType' },
      { id: 'types', title: 'Generated type', body: 'Discriminated TypeScript union' },
      { id: 'renderer', title: 'RenderBlocks', body: 'Dispatches by blockType' },
      { id: 'react', title: 'React output', body: 'Accessible page section' },
    ]],
  },
  {
    file: 'production-ready-payload-block-config/figure-01-config-anatomy.svg',
    kicker: 'CONFIG ANATOMY',
    title: 'Four explicit contracts make a block production-ready',
    rows: [
      [
        { id: 'slug', title: 'slug', body: 'Stable stored discriminator' },
        { id: 'interface', title: 'interfaceName', body: 'Readable generated type' },
        { id: 'labels', title: 'labels', body: 'Editor-facing singular + plural' },
        { id: 'fields', title: 'fields', body: 'Content model and validation' },
      ],
      [{ id: 'contract', title: 'One explicit block contract', body: 'Predictable data, admin UI, types, and rendering' }],
    ],
    edges: [
      { from: 'slug', to: 'contract' }, { from: 'interface', to: 'contract' },
      { from: 'labels', to: 'contract' }, { from: 'fields', to: 'contract' },
    ],
  },
  {
    file: 'how-renderblocks-works/figure-01-renderer-dispatch.svg',
    kicker: 'RENDERER DISPATCH',
    title: 'A typed map turns blockType into the right component',
    rows: [
      [{ id: 'layout', title: 'Page.layout[]', body: 'Ordered block data from Payload' }],
      [
        { id: 'hero', title: 'heroBasic', body: 'HeroBasicComponent' },
        { id: 'features', title: 'featureBento', body: 'FeatureBentoComponent' },
        { id: 'quote', title: 'contentQuote', body: 'ContentQuoteComponent' },
      ],
      [{ id: 'page', title: 'Next.js page', body: 'Sections preserve the editor’s order' }],
    ],
    edges: [
      { from: 'layout', to: 'hero' }, { from: 'layout', to: 'features' }, { from: 'layout', to: 'quote' },
      { from: 'hero', to: 'page' }, { from: 'features', to: 'page' }, { from: 'quote', to: 'page' },
    ],
  },
  {
    file: 'payload-types-and-import-map/figure-01-generation-pipelines.svg',
    kicker: 'TWO GENERATED CONTRACTS',
    title: 'Frontend types and admin components must move together',
    rows: [
      [
        { id: 'config-a', title: 'Payload config', body: 'Schema changes' },
        { id: 'config-b', title: 'Payload config', body: 'Component paths change' },
      ],
      [
        { id: 'types', title: 'generate:types', body: 'Refresh payload-types.ts' },
        { id: 'map', title: 'generate:importmap', body: 'Refresh admin importMap.js' },
      ],
      [
        { id: 'frontend', title: 'Typed frontend', body: 'Fields match runtime data' },
        { id: 'admin', title: 'Working admin', body: 'Custom UI modules resolve' },
      ],
    ],
    edges: [
      { from: 'config-a', to: 'types' }, { from: 'types', to: 'frontend' },
      { from: 'config-b', to: 'map' }, { from: 'map', to: 'admin' },
    ],
  },
  {
    file: 'payload-block-not-rendering/figure-01-debug-tree.svg',
    kicker: 'DEBUGGING CHECKLIST',
    title: 'Find the first broken contract instead of guessing',
    rows: [
      [{ id: 'start', title: 'Block not visible', body: 'Start with the stored page document' }],
      [
        { id: 'data', title: 'Data present?', body: 'Check layout[] and blockType' },
        { id: 'registered', title: 'Registered?', body: 'Check Pages layout blocks' },
        { id: 'mapped', title: 'Mapped?', body: 'Check blockComponents key' },
      ],
      [
        { id: 'props', title: 'Props valid?', body: 'Match generated union member' },
        { id: 'cache', title: 'Fresh output?', body: 'Regenerate types and import map' },
        { id: 'fixed', title: 'Render restored', body: 'Verify editor and frontend' },
      ],
    ],
  },
  {
    file: 'copying-is-not-installing/figure-01-copy-vs-install.svg',
    kicker: 'FILES ARE ONLY HALF THE JOB',
    title: 'Copying stops where a wired install begins',
    rows: [
      [
        { id: 'copy', title: 'Copied files', body: 'config.ts + Component.tsx' },
        { id: 'install', title: 'Installed component', body: 'The same reviewable source' },
      ],
      [
        { id: 'manual', title: 'Manual follow-up', body: 'Register · map · generate · verify' },
        { id: 'wired', title: 'Installer-owned wiring', body: 'Fragments · generators · state' },
      ],
    ],
    edges: [{ from: 'copy', to: 'manual' }, { from: 'install', to: 'wired' }],
  },
  {
    file: 'shadcn-registry-for-payload-cms/figure-01-registry-delivery.svg',
    kicker: 'REGISTRY DELIVERY',
    title: 'Source becomes public JSON, then reviewable consumer files',
    rows: [[
      { id: 'source', title: 'Registry source', body: 'registry.json + source files' },
      { id: 'build', title: 'shadcn build', body: 'Resolve file contents' },
      { id: 'public', title: 'Public /r JSON', body: 'Portable registry items' },
      { id: 'consumer', title: 'Consumer repo', body: 'Files land under src/' },
    ]],
  },
  {
    file: 'manifest-wiring-contract/figure-01-manifest-layers.svg',
    kicker: 'EXECUTABLE CONTRACT',
    title: 'The manifest describes installation beyond file delivery',
    rows: [
      [
        { id: 'files', title: 'Files', body: 'Owned paths and targets' },
        { id: 'deps', title: 'Dependencies', body: 'Public packages' },
        { id: 'fragments', title: 'Fragments', body: 'Anchored host-file edits' },
        { id: 'post', title: 'Post-install', body: 'Types + import map' },
      ],
      [{ id: 'state', title: 'Install state', body: 'Version, stage, files, patches, recovery status' }],
    ],
    edges: [
      { from: 'files', to: 'state' }, { from: 'deps', to: 'state' },
      { from: 'fragments', to: 'state' }, { from: 'post', to: 'state' },
    ],
  },
  {
    file: 'text-anchors-vs-ast/figure-01-scoped-diff.svg',
    kicker: 'SCOPED SOURCE PATCH',
    title: 'Text anchors preserve the code around a deliberate insertion',
    rows: [
      [{ id: 'before', title: 'Before', body: "const blockComponents = {\n  ExistingBlock,\n}" }],
      [{ id: 'anchor', title: 'Anchor + dedup check', body: 'Find exact insertion point; refuse ambiguity' }],
      [{ id: 'after', title: 'After', body: "const blockComponents = {\n  ExistingBlock,\n  HeroBasic,\n}" }],
    ],
  },
  {
    file: 'idempotent-code-installer/figure-01-convergence-state.svg',
    kicker: 'CONVERGENCE',
    title: 'Install, retry, and rerun all settle on one state',
    rows: [
      [
        { id: 'new', title: 'Not installed', body: 'No files or state entry' },
        { id: 'partial', title: 'Partial install', body: 'Failed stage is recorded' },
        { id: 'complete', title: 'Complete install', body: 'Files + wiring + generators' },
      ],
      [{ id: 'same', title: 'Converged rerun', body: 'Dedup checks leave the repository unchanged' }],
    ],
    edges: [
      { from: 'new', label: 'add', to: 'complete' }, { from: 'new', label: 'failure', to: 'partial' },
      { from: 'partial', label: 'retry', to: 'complete' }, { from: 'complete', label: 'rerun', to: 'same' },
    ],
  },
  {
    file: 'payload-components-doctor/figure-01-doctor-report.svg',
    kicker: 'REPRESENTATIVE TERMINAL REPORT',
    title: 'doctor separates readiness, integrity, and recovery advice',
    rows: [[
      { id: 'terminal', title: '$ npx payload-components doctor', body: '[ok] project: Payload v3 + Next.js detected\n[ok] hero-basic: owned files present\n[ok] hero-basic: Payload fragments present\n[ok] generators: types and import map configured\n\nSummary: 1 healthy install · 0 errors' },
    ]],
  },
  {
    file: 'component-variants-without-prop-explosion/figure-01-family-vs-matrix.svg',
    kicker: 'STRUCTURE OVER SWITCHES',
    title: 'Separate variants keep intent visible',
    rows: [
      [
        { id: 'overloaded', title: 'One overloaded component', body: 'media? · layout? · theme? · density? · motion?' },
        { id: 'family', title: 'Hero family', body: 'Shared content vocabulary' },
      ],
      [
        { id: 'matrix', title: 'Prop combination matrix', body: 'Hidden invalid states multiply' },
        { id: 'basic', title: 'hero-basic', body: 'Focused structural contract' },
        { id: 'video', title: 'hero-video', body: 'Focused structural contract' },
        { id: 'dramatic', title: 'hero-dramatic', body: 'Focused structural contract' },
      ],
    ],
    edges: [
      { from: 'overloaded', to: 'matrix' }, { from: 'family', to: 'basic' },
      { from: 'family', to: 'video' }, { from: 'family', to: 'dramatic' },
    ],
  },
  {
    file: 'shared-fields-across-component-families/figure-01-shared-fields.svg',
    kicker: 'SHARED CONTENT MODEL',
    title: 'One real source file feeds every structural variant',
    rows: [
      [{ id: 'shared', title: 'shared/heroFields.ts', body: 'eyebrow · heading · copy · links' }],
      [
        { id: 'basic', title: 'hero-basic config', body: '...heroFields + alignment' },
        { id: 'video', title: 'hero-video config', body: '...heroFields + video' },
        { id: 'dramatic', title: 'hero-dramatic config', body: '...heroFields + media treatment' },
      ],
    ],
    edges: [{ from: 'shared', to: 'basic' }, { from: 'shared', to: 'video' }, { from: 'shared', to: 'dramatic' }],
  },
  {
    file: 'build-saas-homepage/figure-01-page-blueprint.svg',
    kicker: 'PAGE BLUEPRINT',
    title: 'A complete SaaS homepage is a sequence of editorial jobs',
    rows: [[
      { id: 'hero', title: '1 · Promise', body: 'Hero establishes value' },
      { id: 'proof', title: '2 · Proof', body: 'Logos and outcomes' },
      { id: 'explain', title: '3 · Explain', body: 'Features and workflow' },
      { id: 'trust', title: '4 · Trust', body: 'Testimonials + FAQ' },
      { id: 'action', title: '5 · Action', body: 'Focused final CTA' },
    ]],
  },
  {
    file: 'build-payload-blog-frontend/figure-01-editorial-architecture.svg',
    kicker: 'EDITORIAL ARCHITECTURE',
    title: 'A post model feeds index, article, discovery, and syndication',
    rows: [
      [{ id: 'posts', title: 'Payload Posts', body: 'Title · dek · author · body · media · SEO' }],
      [
        { id: 'index', title: 'Blog index', body: 'Cards + pagination' },
        { id: 'article', title: 'Article route', body: 'Rich text + related posts' },
        { id: 'search', title: 'Discovery', body: 'Tags + internal links' },
        { id: 'rss', title: 'RSS + social', body: 'Feeds + OG metadata' },
      ],
    ],
    edges: [
      { from: 'posts', to: 'index' }, { from: 'posts', to: 'article' },
      { from: 'posts', to: 'search' }, { from: 'posts', to: 'rss' },
    ],
  },
  {
    file: 'accessible-faq-blocks/figure-01-faq-anatomy.svg',
    kicker: 'ACCESSIBLE DISCLOSURE',
    title: 'Semantics, state, and keyboard behavior are one contract',
    rows: [
      [
        { id: 'button', title: '<button>', body: 'Focusable question control' },
        { id: 'aria', title: 'aria-expanded', body: 'Announces open or closed' },
        { id: 'panel', title: 'Answer region', body: 'Stable id and relationship' },
      ],
      [
        { id: 'keyboard', title: 'Keyboard', body: 'Tab focuses · Enter/Space toggles' },
        { id: 'motion', title: 'Motion', body: 'Never hides state or traps focus' },
      ],
    ],
    edges: [{ from: 'button', to: 'aria' }, { from: 'aria', to: 'panel' }, { from: 'keyboard', to: 'button' }, { from: 'motion', to: 'panel' }],
  },
  {
    file: 'safe-links-forms-embeds/figure-01-trust-boundary.svg',
    kicker: 'TRUST BOUNDARY',
    title: 'CMS-managed input must be validated at the edge',
    rows: [
      [{ id: 'input', title: 'Editor-controlled values', body: 'URLs · form actions · embed identifiers' }],
      [
        { id: 'link', title: 'Link policy', body: 'Allow known protocols and destinations' },
        { id: 'form', title: 'Server validation', body: 'Schema · CSRF · rate limit · access' },
        { id: 'embed', title: 'Embed allowlist', body: 'Provider + identifier, not raw HTML' },
      ],
      [{ id: 'output', title: 'Safe rendered boundary', body: 'Escaped output with explicit capabilities' }],
    ],
    edges: [
      { from: 'input', to: 'link' }, { from: 'input', to: 'form' }, { from: 'input', to: 'embed' },
      { from: 'link', to: 'output' }, { from: 'form', to: 'output' }, { from: 'embed', to: 'output' },
    ],
  },
  {
    file: 'motion-without-performance-cost/figure-01-motion-timeline.svg',
    kicker: 'PROGRESSIVE MOTION',
    title: 'The content path stays complete with or without animation',
    rows: [
      [{ id: 'content', title: 'Meaningful content', body: 'Rendered immediately in document order' }],
      [
        { id: 'full', title: 'Motion allowed', body: 'Transform + opacity on compositor-friendly layers' },
        { id: 'reduced', title: 'prefers-reduced-motion', body: 'Skip travel; preserve final state' },
      ],
      [{ id: 'stable', title: 'Same readable result', body: 'No layout shift, blocked input, or missing transcript' }],
    ],
    edges: [{ from: 'content', to: 'full' }, { from: 'content', to: 'reduced' }, { from: 'full', to: 'stable' }, { from: 'reduced', to: 'stable' }],
  },
  {
    file: 'type-safe-block-rendering/figure-01-type-safe-rendering.svg',
    kicker: 'TYPE-SAFE RENDERING',
    title: 'The discriminator narrows data before wrapper props are added',
    rows: [[
      { id: 'union', title: 'Layout union', body: 'Hero | Features | Quote' },
      { id: 'discriminator', title: 'blockType', body: 'Narrows the union member' },
      { id: 'map', title: 'Renderer map', body: 'Typed component lookup' },
      { id: 'wrapper', title: 'Wrapper contract', body: 'id · className · container option' },
      { id: 'output', title: 'Rendered section', body: 'Typed props, stable layout' },
    ]],
  },
  {
    file: 'demo-twins/figure-01-architecture-mirror.svg',
    kicker: 'SOURCE / PREVIEW MIRROR',
    title: 'A demo twin mirrors visual classes without importing target code',
    rows: [
      [
        { id: 'source', title: 'Installable source', body: 'payload-components/source' },
        { id: 'demo', title: 'Site demo twin', body: 'src/components/site/demos' },
      ],
      [
        { id: 'consumer', title: 'Consumer runtime', body: 'Payload data + real links' },
        { id: 'preview', title: 'Preview runtime', body: 'Static data · aria-hidden · no controls' },
      ],
      [{ id: 'test', title: 'Class-mirror contract test', body: 'Shared className literals stay visually aligned' }],
    ],
    edges: [
      { from: 'source', to: 'consumer' }, { from: 'demo', to: 'preview' },
      { from: 'source', to: 'test' }, { from: 'demo', to: 'test' },
    ],
  },
  {
    file: 'visual-regression-component-registry/figure-01-regression-pipeline.svg',
    kicker: 'VISUAL REGRESSION GATE',
    title: 'Every component moves through capture, comparison, and coverage',
    rows: [[
      { id: 'route', title: 'Preview route', body: 'Chrome-free component twin' },
      { id: 'capture', title: 'Capture', body: 'Stable viewport + browser' },
      { id: 'compare', title: 'Pixel compare', body: 'Current image vs baseline' },
      { id: 'baseline', title: 'Baseline decision', body: 'Fix regression or approve change' },
      { id: 'coverage', title: 'Coverage gate', body: 'No component silently skips' },
    ]],
  },
  {
    file: 'contribute-payload-component/figure-01-contribution-workflow.svg',
    kicker: 'END-TO-END CONTRIBUTION',
    title: 'A component is complete only when every surface agrees',
    rows: [[
      { id: 'source', title: 'Source', body: 'Config + Component' },
      { id: 'manifest', title: 'Manifest', body: 'Wiring contract' },
      { id: 'registry', title: 'Registry', body: 'Public file delivery' },
      { id: 'docs', title: 'Docs', body: 'Install + content model' },
      { id: 'demo', title: 'Demo twin', body: 'Live preview' },
      { id: 'tests', title: 'Tests', body: 'Install + visual + contracts' },
    ]],
  },
  {
    file: 'reproducible-shadcn-registry/figure-01-deterministic-build.svg',
    kicker: 'REPRODUCIBLE OUTPUT',
    title: 'The same source must produce byte-for-byte registry output',
    rows: [
      [
        { id: 'source-a', title: 'Clean checkout A', body: 'registry.json + source' },
        { id: 'source-b', title: 'Clean checkout B', body: 'registry.json + source' },
      ],
      [
        { id: 'build-a', title: 'shadcn build', body: 'Deterministic resolution' },
        { id: 'build-b', title: 'shadcn build', body: 'Deterministic resolution' },
      ],
      [{ id: 'equal', title: 'Identical public/r output', body: 'Schema-valid JSON with embedded file content' }],
    ],
    edges: [
      { from: 'source-a', to: 'build-a' }, { from: 'source-b', to: 'build-b' },
      { from: 'build-a', to: 'equal' }, { from: 'build-b', to: 'equal' },
    ],
  },
  {
    file: 'open-source-provenance/figure-01-provenance-chain.svg',
    kicker: 'PROVENANCE CHAIN',
    title: 'A license answers permission; provenance records lineage',
    rows: [[
      { id: 'upstream', title: 'Upstream source', body: 'Author · project · commit' },
      { id: 'license', title: 'License review', body: 'Permission and obligations' },
      { id: 'adapt', title: 'Adaptation', body: 'What changed and why' },
      { id: 'attribute', title: 'Attribution', body: 'Notices stay discoverable' },
      { id: 'distribute', title: 'Distribution', body: 'Users receive source + context' },
    ]],
  },
  {
    file: 'community-driven-roadmap/figure-01-feedback-loop.svg',
    kicker: 'EVIDENCE-DRIVEN ROADMAP',
    title: 'Real installs turn observations into shared improvements',
    rows: [
      [
        { id: 'install', title: 'Install', body: 'A component meets a real project' },
        { id: 'feedback', title: 'Feedback', body: 'Specific friction and context' },
        { id: 'issue', title: 'Issue', body: 'Reproducible public problem' },
      ],
      [
        { id: 'release', title: 'Release', body: 'Improvement reaches everyone' },
        { id: 'contribution', title: 'Contribution', body: 'Code, docs, design, or test' },
      ],
    ],
    edges: [
      { from: 'install', to: 'feedback' }, { from: 'feedback', to: 'issue' },
      { from: 'issue', to: 'contribution' }, { from: 'contribution', to: 'release' },
      { from: 'release', label: 'next install', to: 'install' },
    ],
  },
]

const escapeXml = (value: string) =>
  value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;')

function textLines(value: string, x: number, y: number, lineHeight: number, className: string) {
  return value.split('\n').map((line, index) =>
    `<text class="${className}" x="${x}" y="${y + index * lineHeight}">${escapeXml(line)}</text>`,
  ).join('\n')
}

function renderFigure(figure: Figure) {
  const headerHeight = 160
  const footerSpace = 40
  const rowGap = 34
  const contentHeight = 675 - headerHeight - footerSpace
  const rowHeight = (contentHeight - rowGap * (figure.rows.length - 1)) / figure.rows.length
  const positions = new Map<string, { height: number; width: number; x: number; y: number }>()
  const cards: string[] = []

  for (const [rowIndex, row] of figure.rows.entries()) {
    const gap = row.length > 4 ? 14 : 24
    const maxWidth = row.length === 1 ? 720 : 1080
    const width = (maxWidth - gap * (row.length - 1)) / row.length
    const xStart = (1200 - maxWidth) / 2
    const height = Math.min(rowHeight, row.length === 1 ? 178 : 156)
    const y = headerHeight + rowIndex * (rowHeight + rowGap) + (rowHeight - height) / 2

    row.forEach((node, columnIndex) => {
      const x = xStart + columnIndex * (width + gap)
      positions.set(node.id, { height, width, x, y })
      const bodyLines = node.body.split('\n')
      const isTerminal = node.id === 'terminal'
      cards.push(`
        <g>
          <rect class="${isTerminal ? 'terminal' : 'card'}" x="${x}" y="${y}" width="${width}" height="${height}" rx="18" />
          <circle class="dot" cx="${x + 26}" cy="${y + 29}" r="6" />
          ${textLines(node.title, x + 44, y + 35, 22, isTerminal ? 'terminal-title' : 'node-title')}
          ${textLines(bodyLines.join('\n'), x + 26, y + 70, 21, isTerminal ? 'terminal-body' : 'node-body')}
        </g>`)
    })
  }

  const defaultEdges: Edge[] = []
  if (!figure.edges) {
    const flat = figure.rows.flat()
    for (let index = 0; index < flat.length - 1; index += 1) {
      defaultEdges.push({ from: flat[index].id, to: flat[index + 1].id })
    }
  }

  const arrows = (figure.edges ?? defaultEdges).map((edge) => {
    const from = positions.get(edge.from)
    const to = positions.get(edge.to)
    if (!from || !to) throw new Error(`Unknown edge ${edge.from} → ${edge.to}`)
    const fromCenter = { x: from.x + from.width / 2, y: from.y + from.height / 2 }
    const toCenter = { x: to.x + to.width / 2, y: to.y + to.height / 2 }
    const horizontal = Math.abs(toCenter.x - fromCenter.x) > Math.abs(toCenter.y - fromCenter.y)
    const start = horizontal
      ? { x: fromCenter.x + Math.sign(toCenter.x - fromCenter.x) * from.width / 2, y: fromCenter.y }
      : { x: fromCenter.x, y: fromCenter.y + Math.sign(toCenter.y - fromCenter.y) * from.height / 2 }
    const end = horizontal
      ? { x: toCenter.x - Math.sign(toCenter.x - fromCenter.x) * to.width / 2, y: toCenter.y }
      : { x: toCenter.x, y: toCenter.y - Math.sign(toCenter.y - fromCenter.y) * to.height / 2 }
    const midX = (start.x + end.x) / 2
    const midY = (start.y + end.y) / 2
    return `<g><path class="arrow" d="M ${start.x} ${start.y} C ${midX} ${start.y}, ${midX} ${end.y}, ${end.x} ${end.y}" marker-end="url(#arrowhead)" />${edge.label ? `<text class="edge-label" x="${midX}" y="${midY - 8}" text-anchor="middle">${escapeXml(edge.label)}</text>` : ''}</g>`
  })

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 675" role="img" aria-labelledby="title description">
  <title id="title">${escapeXml(figure.title)}</title>
  <desc id="description">${escapeXml(figure.kicker)} diagram for the Payload Components editorial library.</desc>
  <defs>
    <linearGradient id="background" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#ffffff"/><stop offset="1" stop-color="#f4f4f5"/></linearGradient>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="160%"><feDropShadow dx="0" dy="10" stdDeviation="12" flood-color="#18181b" flood-opacity="0.08"/></filter>
    <marker id="arrowhead" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#059669"/></marker>
    <style>
      .kicker{font:700 15px ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:2.4px;fill:#059669}
      .headline{font:650 34px ui-sans-serif,system-ui,-apple-system,sans-serif;fill:#18181b}
      .card{fill:#fff;stroke:#d4d4d8;stroke-width:1.5;filter:url(#shadow)}
      .terminal{fill:#18181b;stroke:#3f3f46;stroke-width:1.5;filter:url(#shadow)}
      .dot{fill:#059669}
      .node-title{font:650 18px ui-sans-serif,system-ui,-apple-system,sans-serif;fill:#18181b}
      .node-body{font:450 14px ui-sans-serif,system-ui,-apple-system,sans-serif;fill:#52525b}
      .terminal-title{font:650 17px ui-monospace,SFMono-Regular,Menlo,monospace;fill:#f4f4f5}
      .terminal-body{font:450 14px ui-monospace,SFMono-Regular,Menlo,monospace;fill:#d4d4d8}
      .arrow{fill:none;stroke:#059669;stroke-width:2.5;stroke-linecap:round;opacity:.85}
      .edge-label{font:650 12px ui-monospace,SFMono-Regular,Menlo,monospace;fill:#047857;paint-order:stroke;stroke:#fafafa;stroke-width:5px}
    </style>
  </defs>
  <rect width="1200" height="675" fill="url(#background)"/>
  <circle cx="1110" cy="70" r="62" fill="#059669" opacity=".06"/>
  <circle cx="1110" cy="70" r="31" fill="#059669" opacity=".08"/>
  <text class="kicker" x="60" y="55">${escapeXml(figure.kicker)}</text>
  <text class="headline" x="60" y="104">${escapeXml(figure.title)}</text>
  <g>${arrows.join('\n')}</g>
  <g>${cards.join('\n')}</g>
</svg>
`
}

const publicBlog = path.resolve(import.meta.dirname, '../../public/blog')

for (const figure of figures) {
  const output = path.join(publicBlog, figure.file)
  await mkdir(path.dirname(output), { recursive: true })
  await writeFile(output, renderFigure(figure), 'utf8')
}

console.log(`Generated ${figures.length} deterministic blog figures.`)
