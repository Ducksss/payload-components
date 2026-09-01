# Post Components Install Strategy — Master Plan

> **For agentic workers:** This is the master plan for the posts suite. Each task below is one PR into `dev`, landed in order. Tasks 1–2 are directly executable from this document; Tasks 3–5 each carry their contracts and bundle checklist here and may spawn their own detailed implementation plan (in this directory) at pickup. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship the eight in-development post components as a second install class — registry-only editorial UI that receives normalized post data — without forking the CLI, registry, state system, or quality bar, and without a post component ever touching a consumer's Posts collection, routes, or generated Payload files.

**Architecture:** Page blocks stay `payload-wired` (files + Payload fragments + generation). Post components become `registry-only`: files and public shadcn dependencies copy in, nothing else is patched. The split is carried by a `kind` discriminator on the manifest (`'page-block' | 'post-component'`), enforced by JSON Schema conditionals, and honored conditionally by `add` and `doctor`. Post components are data-in/UI-out: they consume `PostSummary`/`PostDetail` view models produced by a shipped, editable adapter (`mapPost.ts`) written against the official Payload website template's Posts shape. A new generic `payload-next-shadcn` target admits Payload + Next + shadcn projects that lack the starter's Pages/RenderBlocks anchors.

**Tech Stack:** Payload CMS 3, Next.js 15/16, React, TypeScript, Tailwind CSS 4, shadcn/ui, Ajv 2020, Vitest, Playwright, Fumadocs MDX.

---

## Decisions locked

1. **Two install classes, one pipeline.** `kind: 'page-block'` keeps `payloadFragments`, `postInstall`, `recovery`, and `sampleContent`; `kind: 'post-component'` forbids all four. One CLI, one registry, one install-state file.
2. **Optional-then-required `kind`.** Task 1 introduces `kind` as optional (loader normalizes absent → `'page-block'`); Task 2 stamps it into every existing manifest and flips it to required. Safe to sequence because the schema and manifests ship together inside the npm package ([manifest.ts](../../../tools/payload-components/manifest.ts) reads bundled paths) — there is no old-CLI/new-manifest skew.
3. **Generic target is one support-matrix entry, not a hierarchy.** `detectProject` walks [support-matrix.json](../../../payload-components/support-matrix.json) targets in order and returns the first match ([project.ts:527](../../../tools/payload-components/project.ts)), so most-specific-wins already exists. `payload-next-shadcn` is appended after `payload-website-starter`, requiring only `components.json` and `src/payload.config.ts`, with no anchors. Because a starter project still detects as the starter, **post-component manifests list both target ids** in `supportedTargets`.
4. **Ship the adapter, not just the contract.** `shared/mapPost.ts` (`toPostSummary`, `toPostDetail`) installs with every post component and is the documented editable seam. Consumers with customized Posts schemas edit one mapper; the visual components never import an app's generated `Post` type, call the Local API, or decide draft/access behavior.
5. **Shared code travels in `files[]`.** Every registry item that uses a shared post file lists it directly in `files[]` — never `registryDependencies` (those only resolve public shadcn UI).
6. **No npm `dependencies` on post manifests.** Declaring deps churns the consumer lockfile and breaks the install-state `patchedFiles` assertion. Date formatting uses `Intl`, not date-fns; icons rely on starter-provided `lucide-react` only where already available.
7. **One shared demo fixture.** All eight demo twins consume a single posts fixture (sample `PostSummary[]` + authors) added to [demo-content.ts](../../../src/lib/demo-content.ts). Image-only classes park in `imgClassName` so twins render `bg-muted` placeholders and the class-mirror test passes.
8. **Structural suffixes before anything links to the slugs.** The upcoming entries rename to `post-card-basic`, `post-archive-grid`, `post-hero-basic`, `featured-post-split`, `post-list-compact`, `author-card-basic`, `newsletter-callout-inline`, `related-posts-grid` while still "coming soon".
9. **Newsletter stays dumb and lands last.** Plain same-origin HTML form, heading/copy via props, no endpoint, no client component.
10. **Server-first everywhere.** No post component requires `'use client'`.

## Global constraints

- Existing page-block behavior must be byte-for-byte unchanged through Tasks 1–2: every current int/e2e suite passes without edits except where a test explicitly gains new cases.
- Post-component installs must never touch `src/collections/Posts`, any route, `src/payload-types.ts`, or the admin import map, and reinstalls must be idempotent.
- Catalog ordering is curated: the posts families insert at a deliberate ranked position in `componentCategories`, `FAMILIES` ([component-page-tree.tsx](../../../src/lib/component-page-tree.tsx)), and `componentEntries` — never appended.
- Literal component-count pins live in the fumadocs-site int spec and frontend e2e spec (SEO copy gates) plus spelled-out prose; update every pin in the same PR that changes the catalog size.
- Preserve the exact `/llms.txt` substrings pinned by `tests/e2e/geo.e2e.spec.ts`.
- Each catalog-changing PR commits Darwin visual baselines; Linux baselines are minted post-merge via the `visual-baselines.yml` dispatch with `spec="components-visual frontend"` (both — new families shift landing/catalog page height).
- Branch flow: worktrees branch from `main` but PRs target `dev` — rebase/cherry-pick onto `origin/dev`, land via `gh pr create --base dev` + auto-squash.

## Slice / PR map

| PR | Task | Ships |
| --- | --- | --- |
| 1 | Task 1 (Slice 1a) | Manifest union, schema conditionals, generic target, conditional `add`/`doctor` |
| 2 | Task 2 (Slice 1b) | `kind` stamped into every manifest, field required, slug renames, stale prose fixes |
| 3 | Task 3 (Slice 2) | Shared post contracts + adapter + fixtures, `post-card-basic`, `post-archive-grid`, docs conditionals, install proof |
| 4 | Task 4 (Slice 3) | `post-hero-basic`, `featured-post-split`, `post-list-compact` |
| 5 | Task 5 (Slice 4) | `author-card-basic`, `related-posts-grid`, `newsletter-callout-inline`, catalog closeout |

---

## File map

### Installer foundation (Tasks 1–2)

- `tools/payload-components/types.ts` — `ComponentManifest` becomes a `kind`-discriminated union; loader-normalized manifest type.
- `payload-components/schema/poc-manifest.schema.json` — `kind` enum + if/then conditionals per kind.
- `payload-components/support-matrix.json` — appended `payload-next-shadcn` target.
- `tools/payload-components/constants.ts` — `GENERIC_TARGET_ID`.
- `tools/payload-components/manifest.ts` — normalize absent `kind`; kind-aware `getExpectedPatchedFiles`.
- `tools/payload-components/install-plan.ts` — plan carries `kind`; empty fragments/postInstall for post components.
- `tools/payload-components/commands/add.ts` — skip `fragment-apply` and `post-install` stages for post components; kind-aware success summary and next steps.
- `tools/payload-components/commands/doctor.ts` — aggregate `postInstall`/anchor expectations from page-block manifests only; handle block-only, post-only, and mixed installs.
- `tools/payload-components/validate-registry.ts` — enforce `kind` presence (Task 2) and per-kind invariants.
- `payload-components/manifests/*.json` — every existing manifest gains `kind: "page-block"` (Task 2).
- `tests/int/manifest-factory.ts`, `payload-components-manifest.int.spec.ts`, `payload-components-project.int.spec.ts`, `payload-components-add-command.int.spec.ts`, `payload-components-doctor-*.int.spec.ts` — new kind/target cases.

### Post suite (Tasks 3–5)

- `payload-components/source/posts/shared/{types.ts,mapPost.ts,PostMedia.tsx,PostMeta.tsx,PostCardBase.tsx}` — data contract, adapter, shared primitives.
- `payload-components/source/posts/<ComponentName>/Component.tsx` — one directory per registry item.
- `payload-components/manifests/<slug>.json` — eight `kind: "post-component"` manifests, `supportedTargets: ["payload-website-starter", "payload-next-shadcn"]`, empty `dependencies`.
- `payload-components/registry.json` — eight new public registry items.
- `content/docs/components/<slug>.mdx` + `meta.json` — docs pages with post-component variants of the wiring/usage/requirements sections.
- `src/components/site/{ComponentWiring,ComponentUsage,ComponentRequirements}.tsx` — conditional rendering per kind ("Data contract" replaces "Content model"; explicit "no host files modified" wiring state; query + `mapPost` usage example; generic-target requirements).
- `src/components/site/demos/<ComponentName>Demo.tsx` + `demos/registry.ts` — demo twins and registrations.
- `src/lib/demo-content.ts` — shared posts fixture.
- `src/lib/site.ts` — ranked insertion into `componentCategories`/`componentEntries`; entries removed from `upcomingComponents` as they ship.
- `src/lib/component-page-tree.tsx` — posts families in docs nav.
- `tools/payload-components/cli.ts` — help list.
- `tests/int/` — public-registry allowlist additions, install-proof cases against both fixtures; demo-twins and component-docs specs pick items up data-driven.
- Count pins: fumadocs-site int spec, frontend e2e spec, and spelled-out prose surfaces.

---

### Task 1 (PR 1): Manifest union, generic target, conditional installer

- [ ] **Step 1: Schema.** Add `kind` (`enum: ["page-block", "post-component"]`, optional) to the manifest schema. Add if/then conditionals: when `kind` is `"post-component"`, `payloadFragments`, `postInstall`, `recovery`, and `sampleContent` must be absent; otherwise the current required set stands unchanged.
- [ ] **Step 2: Types + loader.** Model the raw manifest as a discriminated union in `types.ts`. In `manifest.ts`, normalize after validation (`kind: manifest.kind ?? 'page-block'`) so all downstream code switches on a required field; make `getExpectedPatchedFiles` return `[]` for post components.
- [ ] **Step 3: Generic target.** Append `payload-next-shadcn` to `support-matrix.json` (`requiredFiles: ["components.json", "src/payload.config.ts"]`, no anchors, Payload 3, Next 15/16). Add `GENERIC_TARGET_ID` to constants. No detection-loop changes — first match wins.
- [ ] **Step 4: Conditional `add`.** Thread `kind` through `install-plan.ts`. In `add.ts`, skip the `fragment-apply` stage and `postInstall` scripts for post components; make the success summary state that no host files were patched and replace the layout-fragment next-steps with a pointer to the component's usage docs.
- [ ] **Step 5: Conditional `doctor`.** Aggregate expected generation scripts and anchor checks only from installed page-block manifests. A post-only project on the generic target reports healthy; mixed installs check each component against its own contract.
- [ ] **Step 6: Tests.** Extend `manifest-factory.ts` to mint post-component manifests. Add cases: schema accepts/rejects per-kind shapes; a bare payload+next+shadcn fixture (no `RenderBlocks.tsx`/`Pages/index.ts`) detects `payload-next-shadcn` while the starter fixture still detects `payload-website-starter`; post-component add skips wiring stages, records state, and reinstalls idempotently; doctor passes block-only/post-only/mixed. Run the full existing int suite plus `pnpm test:pack` untouched — that is the "existing behavior unchanged" proof.

### Task 2 (PR 2): Manifest migration and mechanical renames

- [ ] **Step 1:** Stamp `kind: "page-block"` into every existing manifest under `payload-components/manifests/` (67 on `dev` at time of writing — enumerate at execution, don't trust this count).
- [ ] **Step 2:** Flip `kind` to required in the schema and raw type; add a `validate-registry` check that every manifest declares it and satisfies its kind's invariants.
- [ ] **Step 3:** Rename the eight `upcomingComponents` slugs/titles in `site.ts` to the suffixed names (decision 8), and sweep any references (structured data, e2e).
- [ ] **Step 4:** Fix stale prose while touching mechanical surfaces: ROADMAP.md "Current State" still says 58 installable page blocks — reword to avoid a hard-coded count (issue #131 direction).
- [ ] **Step 5:** Full int suite + registry validation green; zero runtime behavior change.

### Task 3 (PR 3): Shared contracts + golden vertical

- [ ] **Step 1: Data contract.** `shared/types.ts`: `PostSummary` (`title`, `href`, optional `excerpt`, `image`, `categories`, `publishedAt`, `author`), `PostDetail extends PostSummary` (+ `heroImage`), `PostImage` (plain `url`/`alt`/dimensions — not Payload's Media type), `PostCategory`, `AuthorSummary`. Server-first, zero imports from consumer code.
- [ ] **Step 2: Adapter.** `shared/mapPost.ts` with `toPostSummary(doc)` / `toPostDetail(doc)` written against the official website template's Posts shape, accepting loosely-typed docs. Docs present it as the editable seam; consumer routes query with explicit `select`/`depth`/`overrideAccess: false` and map through it.
- [ ] **Step 3: Shared primitives.** `PostMedia.tsx`, `PostMeta.tsx` (Intl date formatting), `PostCardBase.tsx`.
- [ ] **Step 4: Components.** `post-card-basic` (PostSummary → card) and `post-archive-grid` (PostSummary[] → grid composing the card base), each shipping the shared files in `files[]`.
- [ ] **Step 5: Docs conditionals.** Make `ComponentWiring`, `ComponentUsage`, and `ComponentRequirements` render per-kind; update the "What is a Payload component?" concept page so "component" is the umbrella term over page blocks and post components.
- [ ] **Step 6: Demos + catalog.** Shared posts fixture in `demo-content.ts`; two demo twins (image classes in `imgClassName`); ranked insertion into `componentCategories`/`FAMILIES`/`componentEntries`; remove the two entries from `upcomingComponents`; CLI help; count pins.
- [ ] **Step 7: Install proof.** Int coverage: install into the bare generic-target fixture AND the website-starter fixture; assert no writes to Posts collection, routes, `payload-types.ts`, or import map; assert reinstall idempotence; a consumer fixture route proves query → `mapPost` → render typechecks.
- [ ] **Step 8: Baselines.** Darwin snapshots in-PR; post-merge Linux mint (`spec="components-visual frontend"`).

### Task 4 (PR 4): Editorial collection surfaces

- [ ] `post-hero-basic` (PostDetail: categories, title, author, date, hero media), `featured-post-split` (PostSummary spotlight), `post-list-compact` (PostSummary[] dense index) — each following the bundle checklist below, reusing shared contracts/fixtures from Task 3 unchanged. Baseline mint after merge.

### Task 5 (PR 5): Article completion and closeout

- [ ] `author-card-basic` (AuthorSummary), `related-posts-grid` (PostSummary[] composing the card base), `newsletter-callout-inline` (props-only, plain same-origin form, no endpoint).
- [ ] Empty `upcomingComponents` and retire the "coming soon" catalog state (verify the catalog page and structured data handle the empty array).
- [ ] Final count pins; check off the ROADMAP "Land the eight in-development post components" item.
- [ ] Run the release proof gates below.

---

## Per-component bundle checklist

Every item in Tasks 3–5 ships all of the following in one PR — a component moves from `upcomingComponents` to `componentEntries` only when the whole bundle lands:

1. Source under `payload-components/source/posts/`, manifest, `registry.json` entry.
2. Docs page (`content/docs/components/<slug>.mdx` + `meta.json` + `component-page-tree.tsx`).
3. Demo twin + `demos/registry.ts` registration + fixture usage.
4. `site.ts` catalog entry at its ranked position; removal from `upcomingComponents`.
5. CLI help list.
6. Test updates: public-registry allowlist, install proof where applicable; demo-twins/component-docs specs are data-driven and must pass without special-casing.
7. Count pins across all pinned surfaces.
8. Darwin baselines in-PR; Linux mint dispatched after merge.

## Proof gates before release

- Wrapper (`payload-components add`) and direct `shadcn add @payload-components/<slug>` installs both work for post components.
- A post component installs into a Payload project without `Pages/index.ts` or `RenderBlocks.tsx`; installation touches no Posts collection, route, `payload-types.ts`, or admin import map; reinstall is idempotent and preserves consumer edits.
- `doctor` is correct for block-only, post-only, and mixed installs.
- A fresh official website-template fixture typechecks and builds with all eight components installed.
- Every component has a real demo twin and Linux visual baseline; mobile/tablet/desktop, reduced-motion, a11y (axe), and overflow checks pass.
- Docs, search, `/llms.txt` (pinned substrings intact), structured data, and catalog navigation include all eight; zero post items remain "in development".
- `pnpm test:release` green; packed-CLI smoke (`test:pack`) green.

## Known traps (fold of repo memory — check before each PR)

- Manifest npm deps churn the consumer lockfile → install-state assertion failure (decision 6).
- Demo class-mirror ignores `imgClassName` only — image-only classes must live there.
- Frontend e2e route-walk grows with the catalog; preview iframes are blocked since PR #249, but pre-warm and use the long timeout locally.
- Promote-to-main PRs will re-show the known CodeQL URL-substring false positive on the big diff.
- `pnpm source:build` after fresh install or tsc fails on missing `.source/`.
