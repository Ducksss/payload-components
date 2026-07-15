# Curated Tailark Ports Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship seven carefully selected Tailark-derived layouts as fully wired, documented, tested Payload Components.

**Architecture:** Each layout is an independent Payload page block delivered through the existing registry, manifest, fragment, and post-install pipeline. Hero and Feature variants reuse their existing family field bases; Feature variants also share one icon map, while Contact owns a separate channel-URL helper so an older consumer-owned `safeUrls.ts` cannot break a later install.

**Tech Stack:** Payload CMS 3, Next.js 15/16, React, TypeScript, Tailwind CSS 4, shadcn/ui, motion 12, Vitest, Playwright, Fumadocs MDX.

## Global Constraints

- Upstream source is `tailark/blocks` commit `8eadeb3389ccccc4bfc4a10bca959c1b39e47b71`.
- Ship exactly `hero-video`, `hero-product-tilt`, `feature-accordion`, `feature-cards-media`, `feature-icon-grid`, `stats-proof`, and `contact-routing-form`.
- Target only `payload-website-starter`, Payload `^3.0.0`, and Next.js `^15.0.0 || ^16.0.0`.
- Re-implement the structural layout; do not copy Tailark headers, navigation, logo strips, external assets, brand SVGs, or app copy.
- Every block exports explicit `slug`, `dbName`, `interfaceName`, singular/plural labels, and preserves `id`, `className`, and `disableInnerContainer` props.
- Block headings start at `<h2>`; the page owns `<h1>`.
- Use only portable semantic colors and named radius/tracking/spacing/font tokens accepted by `visual-standards.int.spec.ts`.
- Every derived `Component.tsx` carries `// Layout adapted from tailark/blocks (MIT) — re-implemented as a Payload block.` and every doc page carries the standard Tailark attribution footer before the final family navigator.
- Every registry item includes all shared/helper files it imports and targets them under `~/src/...`; internal shared files are never `registryDependencies`.
- Every manifest runs `generate:types` and `generate:importmap`, patches Pages layout plus `RenderBlocks`, supports Payload 3 and Next 15/16, and records both patched files for recovery.
- Every block gets a registered `aria-hidden` demo twin with no headings, links, buttons, or form controls and with every literal component class mirrored.
- Follow TDD: add a focused failing assertion, verify the failure, implement the smallest complete vertical slice, rerun focused tests, then commit.

When a task says to run the focused component suite, use this exact command:

```bash
pnpm exec vitest run --config ./vitest.config.mts \
  tests/int/curated-tailark-ports.int.spec.ts \
  tests/int/demo-twins.int.spec.ts \
  tests/int/public-registry.int.spec.ts \
  tests/int/visual-standards.int.spec.ts \
  tests/int/payload-components-manifest.int.spec.ts \
  tests/int/component-docs.int.spec.ts \
  tests/int/fumadocs-site.int.spec.ts
```

---

## File map

### New installable source

- `payload-components/source/blocks/HeroVideo/config.ts` — Payload schema for the video hero.
- `payload-components/source/blocks/HeroVideo/Component.tsx` — server wrapper and hero markup.
- `payload-components/source/blocks/HeroVideo/Video.tsx` — reduced-motion-aware client video player.
- `payload-components/source/blocks/HeroProductTilt/config.ts` — Payload schema for the product hero.
- `payload-components/source/blocks/HeroProductTilt/Component.tsx` — static perspective hero markup.
- `payload-components/source/blocks/shared/featureIcons.ts` — shared Feature icon options, field, and Lucide map.
- `payload-components/source/blocks/FeatureAccordion/config.ts` — synchronized accordion/media schema.
- `payload-components/source/blocks/FeatureAccordion/Component.tsx` — stateful accordion/media renderer.
- `payload-components/source/blocks/FeatureCardsMedia/config.ts` — image-card array schema.
- `payload-components/source/blocks/FeatureCardsMedia/Component.tsx` — two-column media-card renderer.
- `payload-components/source/blocks/FeatureIconGrid/config.ts` — icon-grid item schema.
- `payload-components/source/blocks/FeatureIconGrid/Component.tsx` — masked-grid icon-card renderer.
- `payload-components/source/blocks/StatsProof/config.ts` — narrative, metrics, and quote schema.
- `payload-components/source/blocks/StatsProof/Component.tsx` — semantic metrics and proof renderer.
- `payload-components/source/blocks/shared/contactUrls.ts` — typed contact-channel validation and safe href construction.
- `payload-components/source/blocks/ContactRoutingForm/config.ts` — channel and fixed form schema.
- `payload-components/source/blocks/ContactRoutingForm/Component.tsx` — safe channel list and same-origin POST form.

### New distribution, docs, and preview files

- `payload-components/manifests/{hero-video,hero-product-tilt,feature-accordion,feature-cards-media,feature-icon-grid,stats-proof,contact-routing-form}.json`
- `content/docs/components/{hero-video,hero-product-tilt,feature-accordion,feature-cards-media,feature-icon-grid,stats-proof,contact-routing-form}.mdx`
- `src/components/site/demos/{HeroVideo,HeroProductTilt,FeatureAccordion,FeatureCardsMedia,FeatureIconGrid,StatsProof,ContactRoutingForm}Demo.tsx`
- `tests/int/curated-tailark-ports.int.spec.ts` — distinctive behavior and provenance contract.

### Shared files modified throughout the tasks

- `payload-components/registry.json` — seven new public registry items.
- `payload-components/PROVENANCE.md` — exact source mappings and the new audit date.
- `src/lib/site.ts` — catalog categories and seven component entries.
- `src/lib/demo-content.ts` — typed Acme specimen data for all new demos.
- `src/components/site/demos/registry.ts` — seven import/slug registrations.
- `src/lib/component-page-tree.tsx` — ordered Stats and Contact documentation families.
- `content/docs/components/meta.json` — ordered component pages.
- `tools/payload-components/cli.ts` — current-component help list.
- `tests/int/public-registry.int.spec.ts` — allowlisted shadcn dependencies.
- `tests/int/payload-components.int.spec.ts` — representative and shared-family installs.
- `tests/int/payload-components-security.int.spec.ts` — contact URL and form fallback checks.
- `tests/e2e/components-visual.e2e.spec.ts-snapshots/` — intended Darwin baselines; Linux baselines are minted by the visual-baselines workflow.

---

### Task 1: Add `hero-video`

**Files:**
- Create: `payload-components/source/blocks/HeroVideo/config.ts`
- Create: `payload-components/source/blocks/HeroVideo/Component.tsx`
- Create: `payload-components/source/blocks/HeroVideo/Video.tsx`
- Create: `payload-components/manifests/hero-video.json`
- Create: `src/components/site/demos/HeroVideoDemo.tsx`
- Create: `content/docs/components/hero-video.mdx`
- Create: `tests/int/curated-tailark-ports.int.spec.ts`
- Modify: `payload-components/registry.json`
- Modify: `src/lib/site.ts`
- Modify: `src/lib/demo-content.ts`
- Modify: `src/components/site/demos/registry.ts`
- Modify: `content/docs/components/meta.json`
- Modify: `tools/payload-components/cli.ts`

**Interfaces:**
- Consumes: `heroFields: Field[]`, generated `HeroVideoBlock`, `CMSLink`, `Media`, and `useReducedMotion(): boolean | null`.
- Produces: `HeroVideo: Block`, `HeroVideoBlock: React.FC<Props>`, and `HeroVideoPlayer({ poster, videoUrl }: { poster: HeroVideoBlockData['poster']; videoUrl?: string }): JSX.Element`.

- [ ] **Step 1: Write the failing vertical-slice test**

Create `tests/int/curated-tailark-ports.int.spec.ts` with reusable readers and the first contract:

```ts
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
})
```

- [ ] **Step 2: Run the test to verify the missing-source failure**

Run: `pnpm exec vitest run --config ./vitest.config.mts tests/int/curated-tailark-ports.int.spec.ts`

Expected: FAIL with `ENOENT` for `HeroVideo/config.ts`.

- [ ] **Step 3: Implement the config and motion-safe player**

Use this config contract exactly:

```ts
export const HeroVideo: Block = {
  slug: 'heroVideo',
  // Existing apps must migrate stored data before adopting this identifier:
  // https://www.payload-components.xyz/docs/registry#installed-source-and-migrations
  dbName: 'pc_hero_vid',
  interfaceName: 'HeroVideoBlock',
  fields: [
    ...heroFields,
    { name: 'video', type: 'upload', relationTo: 'media', required: true },
    { name: 'poster', type: 'upload', relationTo: 'media', required: true },
    {
      name: 'proofItems',
      type: 'array',
      maxRows: 4,
      fields: [{ name: 'label', type: 'text', required: true }],
    },
  ],
  labels: { plural: 'Hero Video Blocks', singular: 'Hero Video' },
}
```

Implement `Video.tsx` with `const canAutoPlay = shouldReduceMotion === false`, so SSR and the hook's
initial `null` state default to no autoplay and only an explicit non-reduced preference enables it.
Keep the poster visible whenever playback is disabled. The component must set `muted`, `loop`, and
`playsInline`, must omit `<video>` when `videoUrl` is undefined, and must not start playback from an
effect.

- [ ] **Step 4: Implement the server component**

Resolve the video defensively:

```ts
const resolvedVideo =
  typeof video === 'object' &&
  video !== null &&
  typeof video.mimeType === 'string' &&
  video.mimeType.startsWith('video/') &&
  typeof video.url === 'string'
    ? video.url
    : undefined
```

Render one tokenized full-bleed card: poster/video as the absolute background, a semantic overlay,
eyebrow, `<h2>`, description, `CMSLink` row, and optional proof badges. Preserve wrapper props and
put the attribution comment above the exported component.

- [ ] **Step 5: Add the manifest and registry item**

Set manifest version `0.1.0`, dependency `motion: ^12.0.0`, files in the test order, render import
`HeroVideoBlock` from `@/blocks/HeroVideo/Component`, Pages import `HeroVideo` from
`../../blocks/HeroVideo/config`, block slug `heroVideo`, and sample content with Acme copy, two links,
three proof labels, and no fake Media IDs. Add the registry item with `dependencies: ['motion']`,
`registryDependencies: ['badge']`, the same four file targets, and canonical command/manual docs
strings. `CMSLink` owns its Button dependency, so this item declares only the shadcn modules it
imports directly.

- [ ] **Step 6: Add the demo, catalog entry, CLI entry, and MDX page**

Add `HeroVideoDemoContent` with title, description, eyebrow, links, and proof labels. The demo uses a
static gradient/media stand-in, contains `aria-hidden="true"`, substitutes headings and buttons with
`div`/`DemoLink`, and copies every plain class literal from the source. Register `hero-video` beside
`hero-basic` in all ordered lists.

The doc frontmatter is:

```mdx
---
title: Hero Video
description: A full-bleed video hero with editor-managed media, CTA links, proof labels, and a reduced-motion poster fallback.
icon: Video
---
```

Use the fixed Preview → Installation → Wiring → Content model → Usage → Requirements → Family order.
The content model documents `heroFields`, `video`, `poster`, and `proofItems`; put the Tailark footer
immediately before `## In this family`.

- [ ] **Step 7: Run the focused component suite**

Run the focused component suite defined above. Expected: PASS for the new hero plus all existing
components.

- [ ] **Step 8: Commit the vertical slice**

```bash
git add payload-components/source/blocks/HeroVideo \
  payload-components/manifests/hero-video.json payload-components/registry.json \
  src/components/site/demos/HeroVideoDemo.tsx src/components/site/demos/registry.ts \
  src/lib/demo-content.ts src/lib/site.ts content/docs/components/hero-video.mdx \
  content/docs/components/meta.json tools/payload-components/cli.ts \
  tests/int/curated-tailark-ports.int.spec.ts
git commit -F - <<'EOF'
components(feat): add reduced-motion video hero

Summary:
- add the Hero Video source, manifest, registry item, preview, and docs
- enforce a poster-first reduced-motion playback contract

Rationale:
- provide a distinctive cinematic hero without sacrificing accessibility

Tests:
- curated Tailark, demo twin, and public registry integration specs
EOF
```

---

### Task 2: Add `hero-product-tilt`

**Files:**
- Create: `payload-components/source/blocks/HeroProductTilt/config.ts`
- Create: `payload-components/source/blocks/HeroProductTilt/Component.tsx`
- Create: `payload-components/manifests/hero-product-tilt.json`
- Create: `src/components/site/demos/HeroProductTiltDemo.tsx`
- Create: `content/docs/components/hero-product-tilt.mdx`
- Modify: the same registry, catalog, demo-content, demo-registry, metadata, CLI, and curated-contract files from Task 1.

**Interfaces:**
- Consumes: `heroFields`, generated `HeroProductTiltBlock`, `CMSLink`, and `Media`.
- Produces: `HeroProductTilt: Block` and `HeroProductTiltBlock: React.FC<Props>`.

- [ ] **Step 1: Extend the failing contract**

Add a test that requires `slug: 'heroProductTilt'`, `dbName: 'pc_hero_prod_tilt'`, `...heroFields`,
the attribution comment, a `<figure>`, `<figcaption>`, `perspective`, `rotate-x`, the exact manifest
files `heroFields.ts`, config, and component, plus command and Tailark credit in the docs.

- [ ] **Step 2: Run the focused test and verify `ENOENT`**

Run: `pnpm exec vitest run --config ./vitest.config.mts tests/int/curated-tailark-ports.int.spec.ts`

Expected: FAIL for `HeroProductTilt/config.ts`.

- [ ] **Step 3: Implement the config**

Use block slug `heroProductTilt`, database name `pc_hero_prod_tilt`, interface
`HeroProductTiltBlock`, `...heroFields`, required `productImage` upload, optional `imageCaption` text,
and optional `proofItems` array capped at four required labels.

- [ ] **Step 4: Implement the static perspective component**

Render centered copy and CTA/proof rows above a `<figure>`. Use a normal bordered media card on mobile
and apply named perspective/transform utilities from the large breakpoint only. Keep the image inside
the page width, preserve upload alt through `Media`, conditionally emit `<figcaption>`, and include no
client state or motion dependency.

- [ ] **Step 5: Complete its distribution and product surfaces**

Create a `0.1.0` manifest with `heroFields.ts`, config, and component; add registry dependency
`badge`; add Acme sample content; register a still product-dashboard demo; insert the
catalog/CLI/meta entries after `hero-video`; and create the fixed MDX page with icon `PanelsTopLeft`.

- [ ] **Step 6: Run focused tests**

Run the focused component suite defined above. Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add payload-components/source/blocks/HeroProductTilt \
  payload-components/manifests/hero-product-tilt.json payload-components/registry.json \
  src/components/site/demos/HeroProductTiltDemo.tsx src/components/site/demos/registry.ts \
  src/lib/demo-content.ts src/lib/site.ts content/docs/components/hero-product-tilt.mdx \
  content/docs/components/meta.json tools/payload-components/cli.ts \
  tests/int/curated-tailark-ports.int.spec.ts
git commit -F - <<'EOF'
components(feat): add product tilt hero

Summary:
- add the Product Tilt Hero source and complete registry surfaces
- add its static preview, catalog entry, and component reference page

Rationale:
- offer a product-led hero that stays useful without client-side motion

Tests:
- curated Tailark, demo, registry, visual, and manifest specs
EOF
```

---

### Task 3: Add the Feature icon foundation and `feature-accordion`

**Files:**
- Create: `payload-components/source/blocks/shared/featureIcons.ts`
- Create: `payload-components/source/blocks/FeatureAccordion/config.ts`
- Create: `payload-components/source/blocks/FeatureAccordion/Component.tsx`
- Create: `payload-components/manifests/feature-accordion.json`
- Create: `src/components/site/demos/FeatureAccordionDemo.tsx`
- Create: `content/docs/components/feature-accordion.mdx`
- Modify: registry/catalog/demo/meta/CLI/curated-contract files.

**Interfaces:**
- Produces: `featureIconOptions`, `FeatureIconName`,
  `createFeatureIconField(required?: boolean): Field`, and
  `featureIcons: Record<FeatureIconName, LucideIcon>` with keys `chart`, `database`, `fingerprint`,
  `id-card`, `shield`, and `zap`.
- Produces: `FeatureAccordion: Block` and the client `FeatureAccordionBlock`.

- [ ] **Step 1: Add the failing icon and accordion assertions**

Require the option/map key sets to match, config slug `featureAccordion`, dbName
`pc_feat_accordion`, `...featureFields`, array bounds 2–6, `'use client'`, shadcn Accordion imports,
controlled `value`, `onValueChange`, active Media selection, Tailark credit, and a manifest containing
`featureFields.ts`, `featureIcons.ts`, config, and component.

- [ ] **Step 2: Run the test and verify missing files**

Run: `pnpm exec vitest run --config ./vitest.config.mts tests/int/curated-tailark-ports.int.spec.ts`

Expected: FAIL for `shared/featureIcons.ts`.

- [ ] **Step 3: Implement the shared icon map**

Follow the existing `contentIcons.ts` option/map contract, but expose a small
`createFeatureIconField(required = false): Field` factory so the option list remains shared while
each block preserves its approved requiredness. Map keys to `ChartBarIncreasing`, `Database`,
`Fingerprint`, `IdCard`, `Shield`, and `Zap`.

- [ ] **Step 4: Implement config and client component**

The config spreads `featureFields`, then adds `items` with 2–6 rows of required title, required
description, optional `createFeatureIconField()`, optional Media image, followed by a `linkGroup`
capped at two rows. Use dbName `pc_feat_accordion`.

The component initializes active value to `'0'`, treats missing/invalid selections as index zero,
uses shadcn Accordion `type="single"` and `collapsible={false}`, keeps the media panel at a fixed 4:3
ratio, and displays the active icon or a neutral stable placeholder when no image resolves.

- [ ] **Step 5: Complete manifest, registry, demo, catalog, CLI, and docs**

Declare `lucide-react: ^0.563.0`, registry dependencies `accordion` and `badge`, and the four installed
files. Use a static first-row-open demo with no interactive tags. Add typed feature demo content
including icon keys and image-presence flags. The MDX icon is `ListCollapse` and documents both the
section fields and item fields.

- [ ] **Step 6: Run focused tests**

Run the focused component suite defined above. Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add payload-components/source/blocks/shared/featureIcons.ts \
  payload-components/source/blocks/FeatureAccordion \
  payload-components/manifests/feature-accordion.json payload-components/registry.json \
  src/components/site/demos/FeatureAccordionDemo.tsx src/components/site/demos/registry.ts \
  src/lib/demo-content.ts src/lib/site.ts content/docs/components/feature-accordion.mdx \
  content/docs/components/meta.json tools/payload-components/cli.ts \
  tests/int/curated-tailark-ports.int.spec.ts
git commit -F - <<'EOF'
components(feat): add media accordion feature

Summary:
- add the shared Feature icon contract and Feature Accordion block
- add distribution metadata, demo content, catalog entry, and docs

Rationale:
- support synchronized feature explanation and visual context

Tests:
- curated Tailark, demo, registry, visual, and manifest specs
EOF
```

---

### Task 4: Add `feature-cards-media`

**Files:**
- Create: `payload-components/source/blocks/FeatureCardsMedia/config.ts`
- Create: `payload-components/source/blocks/FeatureCardsMedia/Component.tsx`
- Create: `payload-components/manifests/feature-cards-media.json`
- Create: `src/components/site/demos/FeatureCardsMediaDemo.tsx`
- Create: `content/docs/components/feature-cards-media.mdx`
- Modify: registry/catalog/demo/meta/CLI/curated-contract files.

**Interfaces:**
- Consumes: `featureFields`, `createFeatureIconField`, `featureIcons`, `CMSLink`, and `Media`.
- Produces: `FeatureCardsMedia: Block` and `FeatureCardsMediaBlock`.

- [ ] **Step 1: Add the failing contract**

Require slug `featureCardsMedia`, dbName `pc_feat_card_med`, 2–4 items, required image per item,
two-column card markup, Media rendering, attribution, and manifest file reuse of both shared Feature
files.

- [ ] **Step 2: Verify the missing-file failure**

Run: `pnpm exec vitest run --config ./vitest.config.mts tests/int/curated-tailark-ports.int.spec.ts`

Expected: FAIL for `FeatureCardsMedia/config.ts`.

- [ ] **Step 3: Implement source**

Spread `featureFields`; add 2–4 items containing required title and description, optional
`createFeatureIconField()`, and required Media image; append a maximum-two-row `linkGroup`. Render one
column below `md` and two columns at `md`, a fixed 16:9 media frame, an optional icon/title row,
description, and optional CTA row. Use semantic Card, Media, and CMSLink primitives without client
state.

- [ ] **Step 4: Complete all distribution and documentation surfaces**

Create the `0.1.0` manifest with shared Feature files first; declare `lucide-react`, registry
dependencies `badge` and `card`; add a two-card Acme sample; register the demo; insert the
ordered entries after `feature-accordion`; and create MDX with icon `GalleryHorizontalEnd` and exact
section/item field tables.

- [ ] **Step 5: Run focused checks and commit**

Run the focused component suite defined above. Expected: PASS.

```bash
git add payload-components/source/blocks/FeatureCardsMedia \
  payload-components/manifests/feature-cards-media.json payload-components/registry.json \
  src/components/site/demos/FeatureCardsMediaDemo.tsx src/components/site/demos/registry.ts \
  src/lib/demo-content.ts src/lib/site.ts content/docs/components/feature-cards-media.mdx \
  content/docs/components/meta.json tools/payload-components/cli.ts \
  tests/int/curated-tailark-ports.int.spec.ts
git commit -F - <<'EOF'
components(feat): add media card features

Summary:
- add the Feature Cards Media block and its complete install contract
- add the preview, catalog specimen, and component documentation

Rationale:
- provide a compact visual comparison layout for core product features

Tests:
- curated Tailark, demo, registry, visual, and manifest specs
EOF
```

---

### Task 5: Add `feature-icon-grid`

**Files:**
- Create: `payload-components/source/blocks/FeatureIconGrid/config.ts`
- Create: `payload-components/source/blocks/FeatureIconGrid/Component.tsx`
- Create: `payload-components/manifests/feature-icon-grid.json`
- Create: `src/components/site/demos/FeatureIconGridDemo.tsx`
- Create: `content/docs/components/feature-icon-grid.mdx`
- Modify: registry/catalog/demo/meta/CLI/curated-contract files.

**Interfaces:**
- Consumes: the same Feature shared exports as Task 4.
- Produces: `FeatureIconGrid: Block` and `FeatureIconGridBlock`.

- [ ] **Step 1: Add the failing contract**

Require slug `featureIconGrid`, dbName `pc_feat_icon_grid`, 3–6 required icon items, an `aria-hidden`
decorator, a `mask-image:radial-gradient` class, token-derived grid-line color via CSS variable, and
the shared Feature file list.

- [ ] **Step 2: Verify failure**

Run: `pnpm exec vitest run --config ./vitest.config.mts tests/int/curated-tailark-ports.int.spec.ts`

Expected: FAIL for `FeatureIconGrid/config.ts`.

- [ ] **Step 3: Implement source**

Spread `featureFields`; define 3–6 items with required title, description, and
`createFeatureIconField(true)`, plus up to two links. Extract a local `IconDecorator` whose grid lines
use `var(--border)`/semantic tokens, whose radial mask is layout geometry rather than a hardcoded
color, and whose root is `aria-hidden="true"`. Render the cards in one, two, then three columns and
keep the real item title outside the decorator.

- [ ] **Step 4: Complete its vertical slice**

Create manifest and registry entries with `lucide-react`, `badge`, and `card`; add six Acme features;
add the static demo; insert ordered entries after `feature-cards-media`; and create MDX with icon
`Grid2X2Plus` and both content-model tables.

- [ ] **Step 5: Run checks and commit**

Run the focused component suite defined above. Expected: PASS.

```bash
git add payload-components/source/blocks/FeatureIconGrid \
  payload-components/manifests/feature-icon-grid.json payload-components/registry.json \
  src/components/site/demos/FeatureIconGridDemo.tsx src/components/site/demos/registry.ts \
  src/lib/demo-content.ts src/lib/site.ts content/docs/components/feature-icon-grid.mdx \
  content/docs/components/meta.json tools/payload-components/cli.ts \
  tests/int/curated-tailark-ports.int.spec.ts
git commit -F - <<'EOF'
components(feat): add decorated icon feature grid

Summary:
- add the Feature Icon Grid block and complete registry surfaces
- add its token-safe decorator, preview, catalog entry, and docs

Rationale:
- offer a high-density feature overview with a distinctive visual system

Tests:
- curated Tailark, demo, registry, visual, and manifest specs
EOF
```

---

### Task 6: Add `stats-proof` and the Stats family

**Files:**
- Create: `payload-components/source/blocks/StatsProof/config.ts`
- Create: `payload-components/source/blocks/StatsProof/Component.tsx`
- Create: `payload-components/manifests/stats-proof.json`
- Create: `src/components/site/demos/StatsProofDemo.tsx`
- Create: `content/docs/components/stats-proof.mdx`
- Modify: registry/catalog/demo/meta/CLI/curated-contract files.
- Modify: `src/lib/component-page-tree.tsx`

**Interfaces:**
- Produces: `StatsProof: Block` and `StatsProofBlock`.
- Adds category `{ stats: { family: 'pages', label: 'Stats' } }` and docs family `{ key: 'stats', label: 'Stats', icon: <ChartNoAxesCombined /> }` after Testimonials.

- [ ] **Step 1: Add failing Stats assertions**

Require slug `statsProof`, dbName `pc_stats_proof`, metric bounds 2–4, `<figure>`, `<blockquote>`,
`<cite>`, Media logo rendering, attribution, `stats` catalog category, and matching docs family.

- [ ] **Step 2: Verify failure**

Run: `pnpm exec vitest run --config ./vitest.config.mts tests/int/curated-tailark-ports.int.spec.ts`

Expected: FAIL for `StatsProof/config.ts`.

- [ ] **Step 3: Implement config and component**

Define optional eyebrow, required title/description, optional body, required metrics array with 2–4
required value/label rows, required quote and author, optional role and Media logo. Render title/body,
large string metrics, and a semantic proof figure. Never parse or animate metric values. Preserve
Media alt and omit empty role/logo wrappers.

- [ ] **Step 4: Add family/product surfaces**

Insert Stats after Testimonials in both catalog and docs navigation. Create a dependency-free
manifest except for peer dependencies, registry dependency `badge`, four-metric Acme sample content,
the still demo, CLI/meta entry, and MDX with icon `ChartNoAxesCombined`. Omit `## In this family`
because only one Stats variant exists; keep the Tailark footer as the final MDX content.

- [ ] **Step 5: Run checks and commit**

Run the focused component suite defined above. Expected: PASS.

```bash
git add payload-components/source/blocks/StatsProof \
  payload-components/manifests/stats-proof.json payload-components/registry.json \
  src/components/site/demos/StatsProofDemo.tsx src/components/site/demos/registry.ts \
  src/lib/demo-content.ts src/lib/site.ts src/lib/component-page-tree.tsx \
  content/docs/components/stats-proof.mdx content/docs/components/meta.json \
  tools/payload-components/cli.ts tests/int/curated-tailark-ports.int.spec.ts
git commit -F - <<'EOF'
components(feat): add stats proof block

Summary:
- add the Stats Proof block and a first-class Stats catalog family
- add its registry contract, preview, specimen data, and docs page

Rationale:
- combine measurable outcomes with compact narrative proof

Tests:
- curated Tailark, demo, registry, visual, manifest, and docs specs
EOF
```

---

### Task 7: Add `contact-routing-form` and the Contact family

**Files:**
- Create: `payload-components/source/blocks/shared/contactUrls.ts`
- Create: `payload-components/source/blocks/ContactRoutingForm/config.ts`
- Create: `payload-components/source/blocks/ContactRoutingForm/Component.tsx`
- Create: `payload-components/manifests/contact-routing-form.json`
- Create: `src/components/site/demos/ContactRoutingFormDemo.tsx`
- Create: `content/docs/components/contact-routing-form.mdx`
- Modify: registry/catalog/demo/meta/CLI/curated-contract files.
- Modify: `src/lib/component-page-tree.tsx`
- Modify: `tests/int/payload-components-security.int.spec.ts`
- Modify: `tests/int/public-registry.int.spec.ts`

**Interfaces:**
- Produces: `contactChannelTypeOptions`, `ContactChannelType`, `getSafeContactHref(type, value): string | undefined`, and `validateContactValue(value, { siblingData }): true | string`.
- Consumes: `getSafeFormAction` and `validateSameOriginFormAction` from the unchanged `safeUrls.ts`.
- Produces: `ContactRoutingForm: Block` and `ContactRoutingFormBlock`.

- [ ] **Step 1: Write helper behavior tests first**

Import the new helpers in `payload-components-security.int.spec.ts` and assert:

```ts
expect(getSafeContactHref('email', 'hello@example.com')).toBe('mailto:hello@example.com')
expect(getSafeContactHref('phone', '+1 (555) 010-1000')).toBe('tel:+15550101000')
expect(getSafeContactHref('url', '/support')).toBe('/support')
expect(getSafeContactHref('url', 'https://example.com/contact')).toBe('https://example.com/contact')
expect(getSafeContactHref('url', 'javascript:alert(1)')).toBeUndefined()
expect(getSafeContactHref('email', 'not-an-email')).toBeUndefined()
expect(getSafeContactHref('phone', 'abc')).toBeUndefined()
```

Add curated assertions for slug `contactRoutingForm`, dbName `pc_contact_route`, required same-origin
action, honeypot attributes, visible labels, disabled unsafe-action fallback, attribution, and
separate `safeUrls.ts`/`contactUrls.ts` manifest entries.

- [ ] **Step 2: Run tests and verify missing-module failure**

Run:

```bash
pnpm exec vitest run --config ./vitest.config.mts \
  tests/int/payload-components-security.int.spec.ts \
  tests/int/curated-tailark-ports.int.spec.ts
```

Expected: FAIL resolving `contactUrls.ts`.

- [ ] **Step 3: Implement contact URL parsing**

Use a discriminated type list `['email', 'phone', 'url'] as const`. Trim all values; reject CR/LF.
Email accepts a conservative `^[^\s@]+@[^\s@]+\.[^\s@]+$` shape and returns `mailto:` plus the
validated, trimmed address.
Phone strips spaces, parentheses, dots, and hyphens, then requires `^\+?\d{7,15}$` and returns `tel:`.
URL accepts a single-slash same-origin path or an `https:` URL without username/password. The Payload
validator reads `siblingData.type` and returns a type-specific error string.

- [ ] **Step 4: Implement the config**

Use slug `contactRoutingForm`, dbName `pc_contact_route`, interface `ContactRoutingFormBlock`, optional
eyebrow/description, required title, 1–4 channels containing label/type/value/description, required
formTitle, optional formDescription, a `formLabels` group with defaults `Name`, `Email`, `Organization`,
`Phone`, `Message`, required submitLabel default `Send inquiry`, and required action validated with
`validateSameOriginFormAction`.

- [ ] **Step 5: Implement the safe server-rendered form**

Compute `const formAction = getSafeFormAction(action)` once. Render channel values as links only when
`getSafeContactHref` returns a value. Render visible `<label htmlFor>` elements and native/shadcn
Input/Textarea controls with names `name`, `email`, `organization`, `phone`, `message`; use correct
types, input modes, autocomplete, and required attributes. Add a honeypot named `website` with
`aria-hidden`, `tabIndex={-1}`, and `autoComplete="off"`. Submit with `method="post"` only to
`formAction`. When it is undefined, omit the form action, disable the submit button, and render
`Configure a valid same-origin form action before publishing.` with `role="status"`.

- [ ] **Step 6: Finish distribution, family navigation, and docs**

Add Contact after Call to action in `componentCategories` and docs FAMILIES using `ContactRound`.
Declare registry dependencies `badge`, `button`, `input`, and `textarea`, and add `input`/`textarea`
to `publicShadcnDependencies`. The manifest lists `safeUrls.ts`, `contactUrls.ts`, config, component;
its sample action is `/api/contact`. Add two sample channels and accessible static form stand-ins in
the demo. Create MDX with icon `ContactRound`, channel and form-label tables, no Family section, and
Tailark attribution last.

- [ ] **Step 7: Run focused checks and commit**

Run the focused component suite defined above, then run:

```bash
pnpm exec vitest run --config ./vitest.config.mts \
  tests/int/payload-components-security.int.spec.ts
```

Expected: both commands PASS.

```bash
git add payload-components/source/blocks/shared/contactUrls.ts \
  payload-components/source/blocks/ContactRoutingForm \
  payload-components/manifests/contact-routing-form.json payload-components/registry.json \
  src/components/site/demos/ContactRoutingFormDemo.tsx src/components/site/demos/registry.ts \
  src/lib/demo-content.ts src/lib/site.ts src/lib/component-page-tree.tsx \
  content/docs/components/contact-routing-form.mdx content/docs/components/meta.json \
  tools/payload-components/cli.ts tests/int/curated-tailark-ports.int.spec.ts \
  tests/int/payload-components-security.int.spec.ts tests/int/public-registry.int.spec.ts
git commit -F - <<'EOF'
components(feat): add safe contact routing form

Summary:
- add validated contact channels and a same-origin POST form block
- add the Contact family, preview, registry contract, and docs page

Rationale:
- provide a useful contact surface with safe publishing defaults

Tests:
- security, curated, demo, registry, visual, manifest, and docs specs
EOF
```

---

### Task 8: Lock provenance and multi-component installation behavior

**Files:**
- Modify: `payload-components/PROVENANCE.md`
- Modify: `tests/int/payload-components.int.spec.ts`
- Modify: `tests/int/curated-tailark-ports.int.spec.ts`

**Interfaces:**
- Consumes all seven completed manifests and registry items.
- Produces an auditable upstream map and a deterministic shared-file install test.

- [ ] **Step 1: Add failing provenance assertions**

Extend the curated spec with this exact map and require each pair in `PROVENANCE.md`:

```ts
const upstream = {
  'hero-video': 'hero-section-5',
  'hero-product-tilt': 'hero-section-9',
  'feature-accordion': 'features-12',
  'feature-cards-media': 'features-10',
  'feature-icon-grid': 'features-1',
  'stats-proof': 'stats-4',
  'contact-routing-form': 'contact-2',
} as const
```

Require `Last audited | 2026-07-15` and remove the statement that all `feature-*` blocks are original.

- [ ] **Step 2: Verify the provenance test fails**

Run: `pnpm exec vitest run --config ./vitest.config.mts tests/int/curated-tailark-ports.int.spec.ts`

Expected: FAIL because the seven mappings are absent.

- [ ] **Step 3: Update the ledger accurately**

Add all seven rows under Derived components, retain the pinned SHA, update the audit date, and narrow
the Original paragraph so it names only genuinely independent current components. Keep the intentional
divergence and declined-reskin rationale.

- [ ] **Step 4: Add representative install coverage**

Append all seven slugs to `representativeInstallComponents`. Add one multi-install test for:

```ts
const componentNames = [
  'hero-video',
  'hero-product-tilt',
  'feature-accordion',
  'feature-cards-media',
  'feature-icon-grid',
  'stats-proof',
  'contact-routing-form',
]
```

Preseed source, run each add command, call `expectInstalledComponents`, then assert one import and one
registration per block plus the presence of one shared `heroFields.ts`, `featureFields.ts`, and
`featureIcons.ts`. This proves shared-file reuse without weakening idempotency.

- [ ] **Step 5: Run install tests**

Run:

```bash
pnpm exec vitest run --config ./vitest.config.mts \
  tests/int/curated-tailark-ports.int.spec.ts \
  tests/int/payload-components.int.spec.ts
```

Expected: PASS; each representative install records state version 2 and the combined install has no
duplicate fragments.

- [ ] **Step 6: Commit**

```bash
git add payload-components/PROVENANCE.md \
  tests/int/curated-tailark-ports.int.spec.ts tests/int/payload-components.int.spec.ts
git commit -F - <<'EOF'
tests(test): lock curated Tailark port coverage

Summary:
- record exact upstream mappings and license provenance
- cover shared-family and combined multi-component installs

Rationale:
- keep attribution auditable and installation behavior idempotent

Tests:
- curated Tailark and payload-components integration specs
EOF
```

---

### Task 9: Verify docs, builds, visuals, and clean consumers

**Files:**
- Create: `tests/e2e/components-visual.e2e.spec.ts-snapshots/component-{hero-video,hero-product-tilt,feature-accordion,feature-cards-media,feature-icon-grid,stats-proof,contact-routing-form}-chromium-darwin.png`
- Generated/ignored: `public/r/**`
- If verification exposes a defect, return to the owning task, add a focused regression assertion,
  fix it, and commit that repair separately before restarting this task.

**Interfaces:**
- Consumes the complete seven-block implementation.
- Produces a release-gate-clean branch with local visual baselines and a recorded Linux-baseline follow-up workflow run.

- [ ] **Step 1: Run lint and static integrity checks**

Run:

```bash
git diff --check
pnpm lint
```

Expected: both commands exit 0.

- [ ] **Step 2: Build the source and registry**

Run:

```bash
pnpm source:build
pnpm registry:build
pnpm test:registry
pnpm exec tsc --noEmit
```

Expected: all exit 0 and ignored `public/r` exactly reproduces the source registry.

- [ ] **Step 3: Run integration and production build gates**

Run:

```bash
pnpm run test:int
pnpm build
```

Expected: all exit 0 with no visual-standard, demo-twin, manifest, security, or docs-family failures.

- [ ] **Step 4: Run end-to-end behavior**

Choose a free port and run:

```bash
E2E_PORT=3142 pnpm run test:e2e
```

Expected: every component page, preview, GEO route, accessibility surface, reduced-motion surface,
and overflow contract passes. Missing new visual baselines may be the only skipped cases before the
next step.

- [ ] **Step 5: Mint and verify Darwin visual baselines**

Run:

```bash
E2E_PORT=3142 pnpm test:e2e components-visual --update-snapshots
E2E_PORT=3142 pnpm test:e2e components-visual
```

Expected: seven new `*-chromium-darwin.png` files are created and the second command passes. Inspect
all seven images for clipping, empty media frames, unreadable overlays, malformed form stand-ins,
and horizontal overflow before staging them.

- [ ] **Step 6: Run all fresh-consumer shards**

Run:

```bash
pnpm test:fresh -- --shard-index 0
pnpm test:fresh -- --shard-index 1
pnpm test:fresh -- --shard-index 2
pnpm test:fresh -- --shard-index 3
```

Expected: all four supported clean-room shards install, generate types/import maps, build, and render
the newly discovered manifest slugs.

- [ ] **Step 7: Run the consolidated release gate**

Run: `E2E_PORT=3142 pnpm test:release`

Expected: exit 0. If a failure required a code change, rerun that command's focused predecessor and
then rerun `test:release` from the beginning.

- [ ] **Step 8: Commit verification artifacts**

Inspect `git status --short`, confirm only the seven intended Darwin images are uncommitted, then run:

```bash
git add tests/e2e/components-visual.e2e.spec.ts-snapshots/component-{hero-video,hero-product-tilt,feature-accordion,feature-cards-media,feature-icon-grid,stats-proof,contact-routing-form}-chromium-darwin.png
git commit -F - <<'EOF'
tests(test): add curated Tailark visual baselines

Summary:
- add Darwin preview baselines for the seven curated component ports

Rationale:
- lock the approved layouts into the component visual regression gate

Tests:
- E2E_PORT=3142 pnpm test:release
EOF
```

- [ ] **Step 9: Mint Linux baselines in CI before merge**

Push the branch, run the repository's `visual-baselines` workflow for this branch, and merge the PR
opened by that workflow so all seven `*-chromium-linux.png` files exist. Rerun the PR gate after the
baseline commit; the coverage guard must report no missing Linux component baselines.

---

## Completion audit

Before declaring the work complete, verify all of the following from repository state rather than
memory:

- Seven new source folders, manifests, docs pages, demo twins, demo registrations, catalog entries,
  CLI entries, and registry items exist.
- `hero-video` is the only new block with a `motion` dependency and does not autoplay under reduced
  motion.
- All three Feature blocks install the same `featureFields.ts` and `featureIcons.ts` targets.
- Contact channel validation is in `contactUrls.ts`; existing `safeUrls.ts` behavior remains backward
  compatible.
- Stats and Contact families appear in both catalog and docs navigation at the approved positions.
- Every component carries source and docs attribution and the provenance ledger names the exact
  upstream item.
- The working tree is clean after the final commit, every local gate is green, Darwin baselines were
  visually inspected, and the Linux baseline workflow has completed successfully.
