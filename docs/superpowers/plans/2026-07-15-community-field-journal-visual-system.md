# Community Field Journal Visual System Implementation Plan

> **For Codex:** REQUIRED EXECUTION SKILL: Use `superpowers:subagent-driven-development` for delegated execution or `superpowers:executing-plans` for inline execution. Apply `superpowers:test-driven-development` to each implementation task and `superpowers:verification-before-completion` before claiming completion.

**Goal:** Replace all 32 blog covers and all 35 inline figures with the approved C1 Designed Field Journal system, using honest repository evidence, real local UI captures, deterministic rendering, accurate accessibility copy, and a reproducible release gate.

**Architecture:** Add one typed editorial-visual catalog as the source of truth for every cover and figure. A source-artifact resolver will validate and extract code, manifests, commands, routes, and workflow evidence from the repository. A Playwright/Sharp cover renderer and capture renderer will consume that catalog; a shared SVG renderer will produce the 27 diagrams. Existing public paths remain stable, and tests will enforce catalog coverage, evidence integrity, dimensions, file limits, accessibility copy, and deterministic regeneration.

**Tech Stack:** TypeScript, Vitest, Playwright Chromium, Sharp, SVG, MDX, Next.js 16, existing vendored Geist/Geist Mono/Instrument Serif fonts.

**Global Constraints:**

- Preserve all 32 slugs, dates, `publicationOrder` values, routes, RSS entries, OG endpoints, canonical URLs, and structured data.
- Preserve the exact 67 public asset paths under `public/blog/`; replace their bytes, not their URLs.
- Use only white, graphite, muted zinc, warm paper, and emerald. Do not add a second accent.
- Do not fabricate contributors, avatars, issue numbers, activity counts, testimonials, terminal outcomes, GitHub UI, or project behavior.
- Every cover must combine one primary artifact with a different secondary evidence type and one concrete community invitation.
- Covers: 1200×630 WebP, at most 250 KiB. UI figures: 1600×900 WebP, at most 350 KiB. Diagram figures: `viewBox="0 0 1200 675"`, at most 150 KiB.
- Embedded text is supplementary; article prose, alt text, and visible captions must carry the meaning.
- Do not change Payload registry, manifest, component, or CLI behavior while sourcing evidence from those files.
- The worktree already contains the 32-post editorial implementation. Stage exact files for every commit; never use `git add -A` in this mixed tree.

---

## Canonical Visual Catalog

Implement the following rows verbatim in `tools/blog/visual-system/catalog.ts`. The source resolver must fail when a listed file, anchor, registry item, route declaration, or figure path is missing.

| # | Slug | Thesis | Primary artifact | Secondary evidence | Community invitation |
| ---: | --- | --- | --- | --- | --- |
| 1 | `hello` | Source becomes useful when the wiring lands. | `payload-components/source/blocks/HeroBasic/config.ts`, anchored at `export const HeroBasic` | The register → map → generate sequence from the installer contract | Leave a clearer map for the next builder. |
| 2 | `anatomy-of-an-install` | Five stages make one reviewable install. | `tools/payload-components/constants.ts`, anchored at `INSTALL_STAGES` | `npx payload-components add hero-basic` plus the five stage names | Show the failed stage when you report an install. |
| 3 | `what-is-a-payload-cms-block` | Editor choices become typed React output. | `payload-components/source/blocks/HeroBasic/config.ts`, anchored at `slug: 'heroBasic'` | Editor → stored data → generated type → renderer → React sequence | Start with one block and trace it end to end. |
| 4 | `build-first-payload-v3-landing-page` | Compose the argument before decorating the page. | `/components/preview/hero-basic` | Install sequence for `hero-basic`, `logo-cloud-grid`, `feature-bento`, `faq-accordion`, and `call-to-action-centered` | Build the smallest useful page, then share the diff. |
| 5 | `production-ready-payload-block-config` | Explicit contracts survive handoffs. | `payload-components/source/blocks/HeroBasic/config.ts`, anchored at `export const HeroBasic` | `slug`, `interfaceName`, `labels`, and `fields` contract map | Make the next maintainer's assumptions visible. |
| 6 | `how-renderblocks-works` | One discriminator chooses one component. | `tools/payload-components/project.ts`, anchored at `const propertyLine` | `layout[]` → renderer map → component → page sequence | Keep the map boring enough to review. |
| 7 | `payload-types-and-import-map` | Two generators protect two different consumers. | `payload-components/manifests/hero-basic.json`, anchored at `"postInstall"` | Config → types → frontend and config → import map → admin branches | Regenerate both, then report which boundary failed. |
| 8 | `payload-block-not-rendering` | Inspect the first broken contract. | `tools/payload-components/commands/doctor.ts`, anchored at `export const doctorCommand` | Data → registration → map → props → generated output checklist | Bring evidence, not guesses, to the issue. |
| 9 | `copying-is-not-installing` | Files are the start; wiring completes the install. | `payload-components/registry.json`, item `hero-basic` | Copied files versus manifest fragments, generators, and state | Inspect the diff before you call it installed. |
| 10 | `shadcn-registry-for-payload-cms` | Portable JSON delivers reviewable source. | `payload-components/registry.json`, item `hero-basic` | Registry source → build → `/r/hero-basic.json` → consumer repository | Verify the public item from a clean checkout. |
| 11 | `manifest-wiring-contract` | The manifest makes installation promises executable. | `payload-components/manifests/hero-basic.json`, anchored at `"payloadFragments"` | Files, dependencies, fragments, post-install, and state layers | If a promise is missing, improve the manifest. |
| 12 | `text-anchors-vs-ast` | A smaller patch is easier to trust. | `tools/payload-components/project.ts`, anchored at `applyRenderBlocksFragment` | Before/after insertion around `const blockComponents = {` | Share the host shape that broke the anchor. |
| 13 | `idempotent-code-installer` | Every retry should converge. | `tools/payload-components/state.ts`, anchored at `recordInstalledState` | New → partial → retry → complete → unchanged rerun state flow | Turn the failure into a fixture. |
| 14 | `payload-components-doctor` | Diagnosis should preserve the evidence. | `tools/payload-components/commands/doctor.ts`, anchored at `export const doctorCommand` | Representative report labels sourced from the doctor's actual log branches | Paste the smallest sanitized report that reproduces the drift. |
| 15 | `component-variants-without-prop-explosion` | Name structures instead of multiplying props. | `/components?q=feature` | Overloaded prop matrix versus explicit family tree | Request the structure your editors actually need. |
| 16 | `shared-fields-across-component-families` | Share the vocabulary; keep structures explicit. | `payload-components/source/blocks/shared/featureFields.ts`, anchored at `export const featureFields` | Shared field source feeding the feature variants present in `registry.json` | Change the shared rule once and test every consumer. |
| 17 | `choosing-payload-hero` | Choose the smallest hero that carries the decision. | `/components/preview/hero-basic` | Desktop, mobile, catalog, and documentation contexts | What proof did your page truly need? |
| 18 | `editor-friendly-feature-sections` | Model the reading rhythm, not the mockup. | `/components/preview/feature-bento` | Bento, split, steps, and grid preview comparison | Pressure-test the model with uneven real content. |
| 19 | `modeling-pricing-pages` | Pricing content is a product model. | `/components/preview/pricing-cards` | Cards, muted, split, and enterprise field/preview comparison | Make the comparison honest before making it polished. |
| 20 | `social-proof-sections` | Credibility needs context, not decoration. | `/components/preview/testimonials-grid` | Logo, testimonial, rating, and quote composition | Name the claim each proof element supports. |
| 21 | `build-saas-homepage` | A homepage is an argument. | Real hero, logo-cloud, feature, and pricing preview montage | Promise → proof → explain → trust → action blueprint | Share the smallest sequence that persuaded a real reader. |
| 22 | `build-payload-blog-frontend` | One post contract feeds every surface. | `/blog` and `/blog/what-is-a-payload-cms-block` | Post → index, article, RSS, OG, and search projections | Fix drift at the source, then contribute the guardrail. |
| 23 | `accessible-faq-blocks` | Disclosure state must tell one truth. | `payload-components/source/blocks/FaqAccordion/Component.tsx`, anchored at `export const FaqAccordionBlock` | Button, expanded state, content region, keyboard, and reduced-motion anatomy | Test it with a keyboard before you call it accessible. |
| 24 | `safe-links-forms-embeds` | Editable does not mean executable. | `payload-components/source/blocks/shared/safeUrls.ts`, anchored at `getSafeEmbedUrl` | Link, form-action, and embed trust boundaries | Contribute the narrowest safe policy you can explain. |
| 25 | `motion-without-performance-cost` | Motion changes the journey, not the destination. | `payload-components/source/components/ui/infinite-slider.tsx`, anchored at `useReducedMotion` | Default-motion and reduced-motion branches converging on the same content | Verify the same content survives reduced motion. |
| 26 | `type-safe-block-rendering` | Narrow content before adding wrappers. | `payload-components/source/blocks/HeroBasic/Component.tsx`, anchored at `type Props` | Union → `blockType` → renderer map → wrapper props → output | Make impossible render states fail at typecheck. |
| 27 | `demo-twins` | Two runtimes share one visual contract. | `/components/preview/hero-basic` | `tests/int/demo-twins.int.spec.ts`, anchored at `className` fidelity assertions | When source changes, update the twin in the same contribution. |
| 28 | `visual-regression-component-registry` | A screenshot becomes a contract through review. | `tests/e2e/components-visual.e2e.spec.ts`, anchored at `Component visual snapshots` | Capture → compare → baseline → platform coverage gate | Mint the baseline where CI renders it. |
| 29 | `contribute-payload-component` | A component ships across six surfaces. | `payload-components/templates/component-template/README.md`, anchored at `## Add-a-component workflow` | Source → manifest → registry → docs → demo → tests workflow | Leave the contribution easier than you found it. |
| 30 | `reproducible-shadcn-registry` | Clean checkouts should produce identical registry JSON. | `tools/payload-components/check-public-registry.ts`, anchored at `assertGeneratedRegistryMatchesSource` | Checkout → build → validate → compare pipeline | Turn nondeterminism into a failing check. |
| 31 | `open-source-provenance` | Permission is one link in the chain. | `LICENSE`, anchored at `MIT License` | Upstream → revision → license → adaptation → notice → distribution chain | Record enough lineage for the next maintainer. |
| 32 | `community-driven-roadmap` | Real installs are the roadmap signal. | `content/docs/operations.mdx`, anchored at `## Install support triage` | Install → evidence → issue → contribution → release loop | Bring a reproducible need, not a screenshot wishlist. |

Use these figure modes for the 35 existing figure paths:

- `see`: the eight `.webp` figures already listed in `tools/blog/capture-figures.ts`.
- `inspect`: `anatomy-of-an-install/figure-01-five-stage-pipeline.svg`, `production-ready-payload-block-config/figure-01-config-anatomy.svg`, `manifest-wiring-contract/figure-01-manifest-layers.svg`, `text-anchors-vs-ast/figure-01-scoped-diff.svg`, `payload-components-doctor/figure-01-doctor-report.svg`, `reproducible-shadcn-registry/figure-01-deterministic-build.svg`, and `open-source-provenance/figure-01-provenance-chain.svg`.
- `join`: `hello/figure-01-origin-story.svg`, `contribute-payload-component/figure-01-contribution-workflow.svg`, and `community-driven-roadmap/figure-01-feedback-loop.svg`.
- `trace`: all remaining SVG figures.

## Shared Interfaces

Add these exact public types to `tools/blog/visual-system/types.ts` and import them everywhere else:

```ts
export type BlogVisualSeries =
  | 'project-notes'
  | 'foundations'
  | 'installer-internals'
  | 'component-design'
  | 'production-guides'
  | 'open-source'

export type FigureMode = 'see' | 'trace' | 'inspect' | 'join'

export type Artifact =
  | { kind: 'source'; label: string; path: string; anchor: string; take: number }
  | { kind: 'registry-item'; label: string; name: string }
  | { kind: 'route'; label: string; route: string }
  | { kind: 'sequence'; label: string; items: readonly string[] }
  | { kind: 'command'; label: string; command: string; registryItems?: readonly string[] }
  | { kind: 'diff'; label: string; path: string; anchor: string; before: readonly string[]; after: readonly string[] }

export type BlogFigureVisual = {
  path: string
  mode: FigureMode
}

export type BlogVisualEntry = {
  slug: string
  order: number
  series: BlogVisualSeries
  thesis: string
  prompt: string
  primary: Artifact
  secondary: Artifact
  figures: readonly BlogFigureVisual[]
}

export type ResolvedArtifact = Artifact & {
  evidence: string
  provenance: string
}
```

The catalog exports must be:

```ts
export const blogVisualCatalog = catalogEntries satisfies readonly BlogVisualEntry[]
export const getBlogVisualEntry = (slug: string): BlogVisualEntry
```

The resolver exports must be:

```ts
export const resolveArtifact = async (artifact: Artifact): Promise<ResolvedArtifact>
export const validateBlogVisualCatalog = async (
  entries?: readonly BlogVisualEntry[],
): Promise<void>
```

---

### Task 0: Put the approved work on an implementation branch

**Files:**

- Preserve: every existing modified/untracked editorial file
- Preserve commit: `856d028 docs(docs): define community field journal system`

- [ ] **Step 1: Confirm the current commit and dirty tree**

Run:

```bash
git rev-parse --short HEAD
git status --short
```

Expected: `856d028` and the existing 32-post editorial worktree; no generated `output/` files are tracked. The implementation plan is the only new file under `docs/superpowers/plans/`.

- [ ] **Step 2: Create the feature branch without altering the dirty tree**

Run:

```bash
git switch -c PinZheng/community-field-journal
git status --short
```

Expected: branch creation succeeds and the same dirty files remain.

- [ ] **Step 3: Commit this reviewed implementation plan**

```bash
git add docs/superpowers/plans/2026-07-15-community-field-journal-visual-system.md
git commit -F - <<'EOF'
docs(docs): add field journal implementation plan

Summary:
- define the source-backed rendering architecture and visual catalog
- specify test-driven delivery for all 67 editorial assets

Rationale:
- preserve the approved community-first design decisions during execution
- make evidence, accessibility, and release requirements reproducible

Tests:
- not run (documentation-only planning change)
EOF
```

- [ ] **Step 4: Commit the already-verified 32-post editorial baseline**

Stage only the existing editorial implementation:

```bash
git add .github/workflows/visual-baselines.yml content/blog public/blog package.json pnpm-lock.yaml source.config.ts src/app/blog src/app/globals.css src/app/llms.txt/route.ts src/app/og/blog src/app/sitemap.ts src/components/blog src/components/mdx.tsx src/lib/blog.ts src/lib/structured-data.ts tests/e2e/a11y.e2e.spec.ts tests/e2e/blog-visual.e2e.spec.ts tests/e2e/blog-visual.e2e.spec.ts-snapshots tests/e2e/blog.e2e.spec.ts tests/int/blog-content.int.spec.ts tests/int/blog-platform.int.spec.ts tools/blog
git diff --staged --check
git status --short
```

Expected: the staged set contains only the 32-post library, blog platform, current 67 assets, render helpers, and their tests. The working tree contains no unrelated staged files.

```bash
git commit -F - <<'EOF'
docs(feat): publish community editorial library

Summary:
- add thirty community-first articles and upgrade the two project notes
- add blog discovery, RSS, social images, structured data, and visual tests

Rationale:
- turn repository knowledge into a complete learning and contribution path
- keep the editorial archive deterministic, accessible, and source-linked

Tests:
- pnpm test:release
EOF
```

---

### Task 1: Add failing contracts for the visual catalog

**Files:**

- Create: `tests/int/blog-visual-system.int.spec.ts`
- Read: `tests/int/blog-content.int.spec.ts`
- Read: `content/blog/*.mdx`

- [ ] **Step 1: Write the catalog coverage test before implementation**

Test that:

- `blogVisualCatalog` has exactly 32 unique slugs and orders 1–32.
- Its slugs and order match the MDX frontmatter.
- Every entry has nonempty thesis/prompt, different primary/secondary `kind` values, and at least one figure.
- The flattened figure list is exactly the 35 paths referenced by `BlogFigure`.
- Modes total 8 `see`, 7 `inspect`, 3 `join`, and 17 `trace`.

- [ ] **Step 2: Write the evidence-integrity test**

Call `validateBlogVisualCatalog()` and assert that every source path/anchor exists, every registry item resolves in `payload-components/registry.json`, every command item exists in the registry, every route matches a known local route family, and no evidence contains fake social markers such as `stars`, `likes`, `merged by`, `issue #`, avatars, or invented contributor names.

- [ ] **Step 3: Run the new test and confirm the intended failure**

Run:

```bash
pnpm exec vitest run --config ./vitest.config.mts tests/int/blog-visual-system.int.spec.ts
```

Expected: FAIL because `tools/blog/visual-system/catalog.ts` and its exports do not exist.

- [ ] **Step 4: Commit only the failing contract**

```bash
git add tests/int/blog-visual-system.int.spec.ts
git commit -F - <<'EOF'
tests(test): define field journal visual contracts

Summary:
- require exact cover, figure, mode, and catalog coverage
- validate every visual against repository-backed evidence

Rationale:
- make fabricated or stale editorial artifacts fail before rendering

Tests:
- expected failure: missing visual-system implementation
EOF
```

---

### Task 2: Implement the typed source-of-truth catalog and evidence resolver

**Files:**

- Create: `tools/blog/visual-system/types.ts`
- Create: `tools/blog/visual-system/catalog.ts`
- Create: `tools/blog/visual-system/artifacts.ts`
- Modify: `tests/int/blog-visual-system.int.spec.ts`

- [ ] **Step 1: Add the shared interfaces exactly as specified above**

Keep all arrays readonly and use discriminated unions; do not use `any` or unchecked casts.

- [ ] **Step 2: Encode all 32 canonical catalog rows**

Use the table in this plan, the exact 35 existing asset paths, and the approved mode totals. Import no application runtime code; this tooling must run directly under `tsx` and Vitest.

- [ ] **Step 3: Implement source, registry, route, command, sequence, and diff resolution**

Rules:

- Source excerpts start at the exact anchor and take the requested number of lines.
- Registry excerpts are formatted from the matching real item and include its real file targets.
- Route artifacts retain only local paths and are captured later; accept `/blog`, `/blog/<slug>`, `/components`, `/components?<query>`, `/components/preview/<slug>`, and `/docs/components/<slug>`.
- Command artifacts validate every `registryItems` entry before returning evidence.
- Diff artifacts must include the anchor in both the declared context and resolved source file.
- `provenance` must be a repository path, registry item, or route—not a human-sounding attribution.

- [ ] **Step 4: Make failures identify the post and broken evidence**

Wrap catalog errors as `Visual evidence for <slug> is invalid: <reason>` so a stale source anchor is actionable.

- [ ] **Step 5: Run the focused test**

```bash
pnpm exec vitest run --config ./vitest.config.mts tests/int/blog-visual-system.int.spec.ts
```

Expected: PASS.

- [ ] **Step 6: Typecheck the tooling**

```bash
pnpm exec tsc --noEmit
```

Expected: PASS.

- [ ] **Step 7: Commit the catalog and resolver**

```bash
git add tools/blog/visual-system/types.ts tools/blog/visual-system/catalog.ts tools/blog/visual-system/artifacts.ts tests/int/blog-visual-system.int.spec.ts
git commit -F - <<'EOF'
docs(feat): add source-backed blog visual catalog

Summary:
- encode all post visuals in one typed editorial catalog
- resolve code, registry, route, command, sequence, and diff evidence

Rationale:
- keep every generated artifact traceable to repository truth

Tests:
- pnpm exec vitest run --config ./vitest.config.mts tests/int/blog-visual-system.int.spec.ts
- pnpm exec tsc --noEmit
EOF
```

---

### Task 3: Build the C1 theme and cover template as a vertical slice

**Files:**

- Create: `tools/blog/visual-system/theme.ts`
- Create: `tools/blog/visual-system/cover-template.ts`
- Create: `tools/blog/render-covers.ts`
- Modify: `tests/int/blog-visual-system.int.spec.ts`
- Replace: `public/blog/hello/cover.webp`
- Replace: `public/blog/anatomy-of-an-install/cover.webp`

- [ ] **Step 1: Add failing template assertions**

Assert the rendered HTML contains:

- one masthead, issue number, thesis, primary evidence region, secondary evidence region, prompt, folio, and provenance label;
- inline `@font-face` declarations referencing `src/app/_fonts/Geist-Regular.ttf`, `Geist-Bold.ttf`, `GeistMono-Regular.ttf`, and `InstrumentSerif-Italic.ttf` through base64 data URLs;
- only the approved palette tokens;
- `data-artifact-kind` for both evidence regions and different kind values;
- no external URLs, remote fonts, `<img>` without alt, or social-proof language.

Run the focused test and expect failure because the template does not exist.

- [ ] **Step 2: Implement `theme.ts`**

Export `journalTheme` with these literal tokens:

```ts
export const journalTheme = {
  graphite: '#18181b',
  inkMuted: '#52525b',
  zinc: '#d4d4d8',
  zincSoft: '#e4e4e7',
  paper: '#f7f5ef',
  white: '#ffffff',
  emerald: '#059669',
  emeraldDark: '#047857',
} as const
```

Add deterministic grid, crop-mark, folio, paper-edge, stamp, and annotation styles. Do not add random rotation, noise, or timestamps.

- [ ] **Step 3: Implement `renderCoverHtml(entry, artifacts, fontData)`**

Layout: 1200×630; 48 px outer margin; 12-column grid; masthead/issue top; thesis left; primary artifact dominant center/right; secondary evidence overlaps at most 12% of the primary region; prompt and folio bottom. Alternate among three deterministic layouts using `order % 3`, while retaining the same hierarchy.

- [ ] **Step 4: Implement the Playwright/Sharp cover renderer**

`render-covers.ts` must:

- accept `--slug <slug>` zero or more times and default to all 32;
- accept `BLOG_CAPTURE_BASE_URL`, defaulting to `http://127.0.0.1:3100`;
- resolve evidence before opening Chromium;
- render at 1200×630 with device scale factor 1;
- wait for `document.fonts.ready` and all route-preview images;
- capture lossless PNG in memory, then encode WebP with Sharp quality 88, smart subsampling, and six encoding passes;
- fail if output is not 1200×630 or exceeds 250 KiB;
- write only to `public/blog/<slug>/cover.webp`.

- [ ] **Step 5: Render the two project-note covers**

With the production server already running on port 3100, run:

```bash
BLOG_CAPTURE_BASE_URL=http://127.0.0.1:3100 pnpm exec tsx tools/blog/render-covers.ts --slug hello --slug anatomy-of-an-install
```

Expected: two rendered-cover lines, one for each slug; each report includes dimensions and byte size under 256000.

- [ ] **Step 6: Inspect both images at full resolution**

Use the local image viewer and verify readable code, non-overlapping layers, distinct layouts, accurate source evidence, no clipping, and a visible but restrained invitation.

- [ ] **Step 7: Run focused contracts**

```bash
pnpm exec vitest run --config ./vitest.config.mts tests/int/blog-visual-system.int.spec.ts tests/int/blog-content.int.spec.ts
```

Expected: PASS.

- [ ] **Step 8: Commit the renderer and vertical slice**

```bash
git add tools/blog/visual-system/theme.ts tools/blog/visual-system/cover-template.ts tools/blog/render-covers.ts tests/int/blog-visual-system.int.spec.ts public/blog/hello/cover.webp public/blog/anatomy-of-an-install/cover.webp
git commit -F - <<'EOF'
docs(feat): establish field journal cover renderer

Summary:
- add the C1 journal theme and deterministic Playwright renderer
- replace both project-note covers with source-backed vertical slices

Rationale:
- prove hierarchy, evidence, typography, and file budgets before batch work

Tests:
- pnpm exec vitest run --config ./vitest.config.mts tests/int/blog-visual-system.int.spec.ts tests/int/blog-content.int.spec.ts
EOF
```

---

### Task 4: Render and review all 32 source-backed covers

**Files:**

- Replace: `public/blog/*/cover.webp` (all 32)
- Modify when semantics require it: `content/blog/*.mdx` cover `alt` fields

- [ ] **Step 1: Start a production site for route artifacts**

Run in one terminal:

```bash
pnpm source:build
pnpm build:e2e
PORT=3100 pnpm start
```

Expected: the local production server responds at `http://127.0.0.1:3100`.

- [ ] **Step 2: Render Foundations covers (orders 3–8)**

```bash
BLOG_CAPTURE_BASE_URL=http://127.0.0.1:3100 pnpm exec tsx tools/blog/render-covers.ts --series foundations
```

Expected: six covers pass dimension and size checks.

- [ ] **Step 3: Render Installer Internals covers (orders 9–14)**

```bash
BLOG_CAPTURE_BASE_URL=http://127.0.0.1:3100 pnpm exec tsx tools/blog/render-covers.ts --series installer-internals
```

Expected: six covers pass dimension and size checks.

- [ ] **Step 4: Render Component Design covers (orders 15–20)**

```bash
BLOG_CAPTURE_BASE_URL=http://127.0.0.1:3100 pnpm exec tsx tools/blog/render-covers.ts --series component-design
```

Expected: six covers pass dimension and size checks.

- [ ] **Step 5: Render Production Guides covers (orders 21–26)**

```bash
BLOG_CAPTURE_BASE_URL=http://127.0.0.1:3100 pnpm exec tsx tools/blog/render-covers.ts --series production-guides
```

Expected: six covers pass dimension and size checks.

- [ ] **Step 6: Render Open Source covers (orders 27–32)**

```bash
BLOG_CAPTURE_BASE_URL=http://127.0.0.1:3100 pnpm exec tsx tools/blog/render-covers.ts --series open-source
```

Expected: six covers pass dimension and size checks.

- [ ] **Step 7: Update cover alt text only where the new artifact changes meaning**

Each alt must identify the actual primary artifact and relationship, for example: `Hero Basic block config beside the registration, renderer, and generation steps that complete an install.` Do not describe paper texture, colors, or “a graphic.”

- [ ] **Step 8: Run cover contracts**

```bash
pnpm exec vitest run --config ./vitest.config.mts tests/int/blog-visual-system.int.spec.ts tests/int/blog-content.int.spec.ts
```

Expected: PASS with 32 cover files, exact dimensions, size limits, and matching frontmatter.

- [ ] **Step 9: Commit exact cover and MDX paths**

```bash
git add public/blog/*/cover.webp content/blog/*.mdx
git commit -F - <<'EOF'
docs(feat): publish source-backed field journal covers

Summary:
- replace all thirty-two covers with the approved C1 journal system
- align cover alternatives with the real artifacts shown

Rationale:
- make every article entry point useful, specific, and community-inviting

Tests:
- pnpm exec vitest run --config ./vitest.config.mts tests/int/blog-visual-system.int.spec.ts tests/int/blog-content.int.spec.ts
EOF
```

---

### Task 5: Refactor and restyle the 27 deterministic SVG figures

**Files:**

- Create: `tools/blog/visual-system/diagram-data.ts`
- Create: `tools/blog/visual-system/diagram-template.ts`
- Modify: `tools/blog/generate-figures.ts`
- Modify: `tests/int/blog-visual-system.int.spec.ts`
- Replace: the 27 existing `public/blog/*/figure-*.svg` files

- [ ] **Step 1: Add failing diagram-system assertions**

For every SVG figure, assert:

- exact `viewBox="0 0 1200 675"`;
- `<title>` and `<desc>`;
- a `data-mode="trace|inspect|join"` root attribute matching the catalog;
- journal masthead, folio, grid pattern, provenance label, and community prompt;
- no script, external image, remote font, unapproved hex value, or text smaller than 13 px;
- all edge endpoints reference existing node IDs.

Run the focused test and expect failure against the old SVGs.

- [ ] **Step 2: Move the current 27 semantic definitions unchanged into `diagram-data.ts`**

Preserve titles, nodes, edges, labels, and exact public paths. Add `mode`, `provenance`, `prompt`, and one optional `evidenceExcerpt` field sourced through the visual catalog.

- [ ] **Step 3: Implement the Field Journal SVG template**

Reuse `journalTheme`. Add the paper grid, issue/series label, mode marker (`SEE`, `TRACE`, `INSPECT`, or `JOIN`), provenance footer, restrained emerald path, and annotation prompt. Keep code/terminal blocks monospace. Use a maximum of 68 characters per body line and wrap deterministically.

- [ ] **Step 4: Simplify `generate-figures.ts` into an orchestrator**

It imports the diagram data and template, resolves evidence, writes all 27 SVGs, validates size, and prints one result per file plus a final count. No semantic figure definition remains in this file.

- [ ] **Step 5: Regenerate all diagrams**

```bash
pnpm exec tsx tools/blog/generate-figures.ts
```

Expected: `Generated 27 deterministic Field Journal blog figures.` and every file remains below 153600 bytes.

- [ ] **Step 6: Inspect representative modes**

View at original size:

- `hello/figure-01-origin-story.svg` (`join`)
- `what-is-a-payload-cms-block/figure-01-block-lifecycle.svg` (`trace`)
- `text-anchors-vs-ast/figure-01-scoped-diff.svg` (`inspect`)
- `accessible-faq-blocks/figure-01-faq-anatomy.svg` (`trace`)
- `community-driven-roadmap/figure-01-feedback-loop.svg` (`join`)

Verify legibility at article width, arrow clearance, honest labels, no clipping, and distinct mode treatments.

- [ ] **Step 7: Run focused tests**

```bash
pnpm exec vitest run --config ./vitest.config.mts tests/int/blog-visual-system.int.spec.ts tests/int/blog-content.int.spec.ts
```

Expected: PASS.

- [ ] **Step 8: Commit the renderer and 27 SVGs**

```bash
git add tools/blog/generate-figures.ts tools/blog/visual-system/diagram-data.ts tools/blog/visual-system/diagram-template.ts tests/int/blog-visual-system.int.spec.ts public/blog/*/figure-*.svg
git commit -F - <<'EOF'
docs(feat): redraw blog diagrams as field notes

Summary:
- move diagram semantics into typed data and add a shared journal renderer
- regenerate all twenty-seven SVG explanations with evidence and prompts

Rationale:
- preserve technical accuracy while making each diagram teach and invite

Tests:
- pnpm exec vitest run --config ./vitest.config.mts tests/int/blog-visual-system.int.spec.ts tests/int/blog-content.int.spec.ts
EOF
```

---

### Task 6: Restyle and regenerate the eight real UI montages

**Files:**

- Modify: `tools/blog/capture-figures.ts`
- Modify: `tests/int/blog-visual-system.int.spec.ts`
- Replace: the eight existing `public/blog/*/figure-*.webp` files

- [ ] **Step 1: Add failing capture-contract assertions**

Export `captures` and `renderCaptureHtml`. Test exactly eight captures, unique output paths, existing catalog entries, local-only panel routes, 1600×900 canvas, mode `see`, route labels, folio, source/provenance footer, and no invented UI chrome.

- [ ] **Step 2: Change output paths to the committed assets**

Each capture writes directly to its current `public/blog/<slug>/figure-*.webp` path. Remove the intermediate PNG/output naming convention.

- [ ] **Step 3: Apply the journal frame without altering captured content**

Use the shared theme, 96 px masthead, route labels, numbered callouts outside the iframe content, warm paper frame, square/low-radius artifact windows, emerald registration marks, and bottom provenance strip. Preserve the exact existing route list and responsive mobile capture.

- [ ] **Step 4: Add deterministic Sharp encoding and validation**

Capture a 1600×900 PNG buffer, encode WebP quality 86 with six effort passes, then assert dimensions and size ≤358400 bytes before writing.

- [ ] **Step 5: Run the production capture**

With the production server on port 3100:

```bash
BLOG_CAPTURE_BASE_URL=http://127.0.0.1:3100 pnpm exec tsx tools/blog/capture-figures.ts
```

Expected: eight success lines with route count and byte size; no network request leaves localhost.

- [ ] **Step 6: Inspect all eight montages at original size**

Verify every iframe loaded, mobile content is not stretched, labels match routes, code/UI remains readable, no cookie/dev overlays appear, and panels are not cropped at important content.

- [ ] **Step 7: Run focused contracts**

```bash
pnpm exec vitest run --config ./vitest.config.mts tests/int/blog-visual-system.int.spec.ts tests/int/blog-content.int.spec.ts
```

Expected: PASS.

- [ ] **Step 8: Commit capture tooling and eight WebPs**

```bash
git add tools/blog/capture-figures.ts tests/int/blog-visual-system.int.spec.ts public/blog/*/figure-*.webp
git commit -F - <<'EOF'
docs(feat): frame real previews as field journal evidence

Summary:
- restyle the eight real route montages with journal framing
- write optimized WebP captures directly to their committed paths

Rationale:
- mix actual product surfaces into the editorial system without fake UI

Tests:
- pnpm exec vitest run --config ./vitest.config.mts tests/int/blog-visual-system.int.spec.ts tests/int/blog-content.int.spec.ts
EOF
```

---

### Task 7: Audit accessibility copy and cover/figure teaching pairs

**Files:**

- Modify as needed: `content/blog/*.mdx`
- Modify: `tests/int/blog-visual-system.int.spec.ts`

- [ ] **Step 1: Add failing semantic-pair assertions**

Parse each cover alt and each `BlogFigure` alt/caption. Require:

- cover alt and first figure alt are not identical;
- captions contain an action/attention verb such as `shows`, `traces`, `compares`, `follows`, `maps`, `highlights`, or `separates`;
- no alt describes style-only attributes (`green graphic`, `paper texture`, `decorative illustration`);
- no caption claims community activity that is absent from repository evidence;
- every catalog prompt is either present in its article CTA or is an accurate, unattributed invitation consistent with that CTA.

- [ ] **Step 2: Review all 32 cover/figure pairs manually**

For each article, confirm the cover frames the tension, the first figure resolves it, and the caption tells the reader what to notice. Keep established article arguments and publication metadata intact.

- [ ] **Step 3: Rewrite only inaccurate or repetitive alts/captions**

Use concrete object/relationship language. Preserve every `src` path and every `BlogFigure` count.

- [ ] **Step 4: Run editorial and visual contracts**

```bash
pnpm exec vitest run --config ./vitest.config.mts tests/int/blog-content.int.spec.ts tests/int/blog-visual-system.int.spec.ts tests/int/blog-platform.int.spec.ts
```

Expected: PASS; 32 posts, 35 figures, and all internal links remain intact.

- [ ] **Step 5: Commit the accessibility audit**

```bash
git add content/blog/*.mdx tests/int/blog-visual-system.int.spec.ts
git commit -F - <<'EOF'
docs(fix): align blog visuals with accessible teaching copy

Summary:
- make cover alternatives and figure captions describe real relationships
- enforce distinct cover and inline teaching roles for every post

Rationale:
- keep image text supplementary and the editorial meaning accessible

Tests:
- pnpm exec vitest run --config ./vitest.config.mts tests/int/blog-content.int.spec.ts tests/int/blog-visual-system.int.spec.ts tests/int/blog-platform.int.spec.ts
EOF
```

---

### Task 8: Add one-command reproduction and contact sheets

**Files:**

- Create: `tools/blog/render-contact-sheets.ts`
- Create: `tools/blog/render-visuals.ts`
- Modify: `package.json`
- Modify if dependency metadata changes: `pnpm-lock.yaml`
- Modify: `tests/int/blog-visual-system.int.spec.ts`

- [ ] **Step 1: Add failing script and deterministic-output tests**

Require package scripts:

```json
"blog:visuals": "cross-env NODE_OPTIONS=--no-deprecation tsx tools/blog/render-visuals.ts",
"blog:visuals:covers": "cross-env NODE_OPTIONS=--no-deprecation tsx tools/blog/render-covers.ts",
"blog:visuals:figures": "cross-env NODE_OPTIONS=--no-deprecation tsx tools/blog/generate-figures.ts",
"blog:visuals:captures": "cross-env NODE_OPTIONS=--no-deprecation tsx tools/blog/capture-figures.ts",
"blog:visuals:review": "cross-env NODE_OPTIONS=--no-deprecation tsx tools/blog/render-contact-sheets.ts"
```

The test must hash a representative generated SVG twice and compare bytes. It must render a representative cover twice and compare its Sharp pixel hash; do not require byte-identical WebP metadata.

- [ ] **Step 2: Implement `render-visuals.ts`**

Run catalog validation, covers, SVGs, captures, asset validation, and contact sheets in that order. Forward `--slug` and `--series` filters to covers/diagrams when present. Exit nonzero on the first failure.

- [ ] **Step 3: Implement contact sheets**

Write ignored review artifacts to:

- `output/blog-visual-review/covers.webp` — 4 columns × 8 rows, ordered 1–32, labeled with order and slug.
- `output/blog-visual-review/figures.webp` — 4 columns, ordered by post then figure number, labeled with mode and path.

Rasterize SVG thumbnails through Sharp. Maintain aspect ratio; never crop. Add only labels outside the visual thumbnails.

- [ ] **Step 4: Run the one-command renderer**

With the production server on port 3100:

```bash
BLOG_CAPTURE_BASE_URL=http://127.0.0.1:3100 pnpm blog:visuals
```

Expected: 32 covers, 27 SVGs, 8 UI figures, two contact sheets, and a final `Validated 67 Field Journal assets.` line.

- [ ] **Step 5: Review both contact sheets**

Check repeated compositions, weak hierarchy, tiny code, clipping, empty areas, accidental fake claims, incorrect paths, monotonous series treatment, and overly dominant annotations. Fix the generator data/template—not individual generated files—and rerun.

- [ ] **Step 6: Run focused tests**

```bash
pnpm exec vitest run --config ./vitest.config.mts tests/int/blog-visual-system.int.spec.ts tests/int/blog-content.int.spec.ts
```

Expected: PASS.

- [ ] **Step 7: Commit reproducibility tooling**

```bash
git add package.json pnpm-lock.yaml tools/blog/render-contact-sheets.ts tools/blog/render-visuals.ts tests/int/blog-visual-system.int.spec.ts
git commit -F - <<'EOF'
build(feat): make blog visuals reproducible

Summary:
- add one-command rendering and labeled cover and figure contact sheets
- test evidence validation and deterministic representative output

Rationale:
- make future editorial changes reviewable and repeatable from clean source

Tests:
- pnpm exec vitest run --config ./vitest.config.mts tests/int/blog-visual-system.int.spec.ts tests/int/blog-content.int.spec.ts
EOF
```

---

### Task 9: Regenerate and review blog visual baselines

**Files:**

- Modify: `tests/e2e/blog-visual.e2e.spec.ts-snapshots/*.png`
- Verify: `.github/workflows/visual-baselines.yml`
- Verify: `tests/e2e/blog-visual.e2e.spec.ts`

- [ ] **Step 0: Stop the standalone production server used for asset capture**

The Playwright configuration starts its own production server with `reuseExistingServer: false`. Stop the `PORT=3100 pnpm start` process from Tasks 4–8 before running this task.

- [ ] **Step 1: Run the representative blog pages before updating snapshots**

```bash
E2E_PORT=3100 PLAYWRIGHT_SERVER_MODE=production pnpm test:e2e tests/e2e/blog-visual.e2e.spec.ts
```

Expected: existing baselines fail because the cover art changed; inspect the diff to confirm change is limited to intentional blog visuals and resulting card/hero pixels.

- [ ] **Step 2: Update current-platform snapshots intentionally**

```bash
E2E_PORT=3100 PLAYWRIGHT_SERVER_MODE=production pnpm test:e2e tests/e2e/blog-visual.e2e.spec.ts --update-snapshots
```

Expected: desktop/mobile index and representative article snapshots are rewritten.

- [ ] **Step 3: Review all four snapshots**

Confirm no horizontal overflow, clipped cover, illegible overlay, broken aspect ratio, or mobile hierarchy regression.

- [ ] **Step 4: Run blog e2e and axe coverage**

```bash
E2E_PORT=3100 PLAYWRIGHT_SERVER_MODE=production pnpm test:e2e tests/e2e/blog.e2e.spec.ts tests/e2e/blog-visual.e2e.spec.ts tests/e2e/a11y.e2e.spec.ts
```

Expected: PASS.

- [ ] **Step 5: Commit the reviewed baseline update**

```bash
git add tests/e2e/blog-visual.e2e.spec.ts-snapshots .github/workflows/visual-baselines.yml
git commit -F - <<'EOF'
tests(test): refresh field journal blog baselines

Summary:
- update desktop and mobile blog snapshots for the new visual system
- retain platform-specific coverage in the visual baseline workflow

Rationale:
- make intentional journal artwork changes visible to future reviewers

Tests:
- E2E_PORT=3100 PLAYWRIGHT_SERVER_MODE=production pnpm test:e2e tests/e2e/blog.e2e.spec.ts tests/e2e/blog-visual.e2e.spec.ts tests/e2e/a11y.e2e.spec.ts
EOF
```

If `.github/workflows/visual-baselines.yml` is unchanged after verification, omit it from `git add`.

---

### Task 10: Run the complete release gate and final authenticity audit

**Files:**

- Verify: all changed files
- Fix only evidence-backed failures in their owning source/template/test

- [ ] **Step 1: Inspect the final asset inventory**

```bash
find public/blog -type f \( -name '*.webp' -o -name '*.svg' \) | sort | wc -l
find public/blog -name cover.webp | wc -l
find public/blog -name 'figure-*' | wc -l
```

Expected: `67`, `32`, `35`.

- [ ] **Step 2: Search for forbidden placeholders and fabricated social proof**

```bash
rg -n -i "TBD|TODO|placeholder|lorem|fake|mock contributor|issue #[0-9]+|[0-9]+ stars|merged by|likes|reactions" tools/blog content/blog public/blog
```

Expected: no unreviewed matches. Legitimate prose uses of “placeholder” or testing terms must be inspected, not blanket-deleted.

- [ ] **Step 3: Run static and integration gates**

```bash
pnpm lint
pnpm source:build
pnpm exec tsc --noEmit
pnpm test:registry
pnpm run test:int
```

Expected: all PASS.

- [ ] **Step 4: Run production build and complete e2e**

```bash
pnpm build:e2e
PLAYWRIGHT_SERVER_MODE=production pnpm run test:e2e
```

Expected: all Playwright projects PASS, including blog routes, OG images, RSS, axe, overflow, and visual baselines.

- [ ] **Step 5: Run the single-command release gate from a clean server state**

```bash
pnpm test:release
```

Expected: PASS with no skipped current-platform blog visual baselines.

- [ ] **Step 6: Review the final diff and generated-asset scope**

```bash
git status --short
git diff --stat HEAD
git diff --check
```

Expected: no `output/`, `.superpowers/`, build artifacts, registry output, or unrelated files staged/tracked; `git diff --check` prints nothing.

- [ ] **Step 7: Create the final integration commit if verification fixes remain**

Stage only the exact files changed by verification, then:

```bash
git commit -F - <<'EOF'
docs(feat): complete community field journal visuals

Summary:
- replace all blog covers and figures with source-backed journal artwork
- add deterministic rendering, evidence validation, and review tooling

Rationale:
- make the editorial library teach from real project artifacts
- invite community participation without fabricating social proof

Tests:
- pnpm test:release
EOF
```

Skip this commit if the worktree is already fully committed after Step 6.

- [ ] **Step 8: Apply completion verification**

Use `superpowers:verification-before-completion`, cite the fresh `pnpm test:release` result, report the exact 32/35/67 asset counts, and link the design spec, implementation plan, renderer entry point, catalog, and contact sheets (contact sheets remain ignored review artifacts).
