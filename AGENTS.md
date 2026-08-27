# Payload Components — Agent Guide

Read this first. It's the single source of truth for agents working in this repo. `CLAUDE.md` points here. Humans: see also `README.md` and `CONTRIBUTING.md` (this file links, it doesn't repeat setup).

## What this is

Payload Components is an **open-source, community-first** registry + CLI that installs Payload CMS blocks into consumer **Payload v3 + Next.js** projects — _wired, not pasted_. A plain `shadcn add` only copies files; `payload-components add` also does the Payload wiring (registers the block in the collection, maps the renderer, regenerates types + the admin import map) and lands it as a reviewable git diff.

This repository is **two things at once**:

1. The **Fumadocs-powered Next.js site** — the marketing landing, docs, and component catalog (this is what's deployed).
2. The **`payload-components` registry + CLI** — the tooling that distributes components into _other_ people's repos.

It is **not** a Payload CMS runtime app: no admin, no database, no `PAYLOAD_SECRET` for the site.

## Project positioning — community-first

The North Star is **open-source, MIT, community-first**. No pricing, no license keys, no gated tiers, no sales funnel. Success is adoption and contributions, not revenue — the catalog grows from real installs and PRs. Keep all copy, docs, and issue templates aligned to that. If you find commercial / "sellable" framing (pricing hedges, "design partner" or "early access" funnels, paid-tier roadmaps), treat it as stale residue and reframe it community-first.

## The mental model (internalize this one split)

|          | Site runtime              | Component distribution                                  |
| -------- | ------------------------- | ------------------------------------------------------- |
| Lives in | `src/`, `content/docs/`   | `payload-components/`, `tools/payload-components/`      |
| Runs     | here (Fumadocs / Next.js) | in the _consumer's_ repo, after install                 |
| Payload? | none (docs site only)     | the installed component code **is** Payload target code |

The Payload block code under `payload-components/source/` is **target code** — shipped into consumer repos, never executed by this site. Don't import it into the site, and don't run the site against a database.

## Repo map

| Path                                                       | Purpose                                                                                                                                                                                                            |
| ---------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `src/app/`                                                 | Routes: `/` (landing), `/docs/[[...slug]]` (Fumadocs), `/components` (catalog), `/about`, `/api/search`, `llms.txt` · `llms-full.txt` · `llms.mdx` (AI surfaces), `og/` + `opengraph-image`                        |
| `src/components/site/`                                     | Site UI: `SiteHeader`/`SiteFooter`, `HeroProductFrame` + `HeroInstallReplay` (the install replay), `WiringLedger`, `ComponentSpecimen`/`ComponentCard`/`ComponentGrid`, `Faq`, `CommandCopyButton`, `section.tsx`  |
| `src/components/site/sections/`                            | Landing sections (Hero, StackBand, Tax, Workflow, Wiring, Catalog, Faq, CommunityCta). `src/app/page.tsx` just orchestrates these                                                                                  |
| `src/components/site/demos/`                               | **Demo twins** — live previews that mirror component source class-for-class (see Core flows)                                                                                                                       |
| `src/lib/site.ts`                                          | **Single source of truth for all site copy/data** (hero text, FAQ, component entries, landing-section headings, terminal demo lines). Tests import from here                                                       |
| `content/docs/`                                            | Fumadocs MDX (index, architecture, installation, registry, contributing, `components/*`); page tree via `meta.json`                                                                                                |
| `payload-components/`                                      | `registry.json` (source shadcn registry), `source/` (component target code), `manifests/*.json` (wiring contract), `schema/`, `support-matrix.json`, `templates/*.json` (**generated** template install contracts) |
| `tools/payload-components/` + `bin/payload-components.mjs` | The CLI: `add`, `add-template`, `templates`, `list`, `diff`, `update`, `remove`, `seed`, `init`, `doctor`, `mcp`, `new`; project detection, fragment patching, install state, registry build/check                 |
| `tests/`                                                   | `e2e/` (Playwright) + `int/` (Vitest) — the contract (below)                                                                                                                                                       |
| `public/r/`                                                | Generated public registry — **gitignored build output**, never hand-edit                                                                                                                                           |

## Core flows

**`payload-components add <component>` pipeline** (`tools/payload-components/commands/add.ts`) — five idempotent stages; install state is recorded in the consumer's `.payload-components/state.json`:

`registry-build` → `registry-add` → `dependency-install` → `fragment-apply` → `post-install` (`generate:types`, `generate:importmap`)

**Optional demo seeding:** `add <component> --demo` writes a generated seed only
after installed state is recorded; `seed <component>` performs the same step for
an existing install. The CLI never opens a database. It rejects recorded partial
installs, verifies every manifest file and wiring fragment, derives the Payload
config path, and atomically writes only a version-marked script under
`payload-components/` plus a private high-entropy ownership record under
`.payload-components/demo-state/`. Generated scripts must require Pages drafts,
match the private record's exact Page and Media IDs plus tokenized markers,
journal a unique operation token before each create, reconcile only its exact
document after an interruption, update owned Pages with `overrideLock: false`,
and never delete media. Keep all Local API access in the explicit operator-run
script, with failures surfaced.

Fragment patching is **text-anchor based** — it finds anchors like `const blockComponents = {` and `name: 'layout'` in the consumer repo and inserts imports/registrations with dedup checks. Fragile by design for now; keep the anchors and dedup logic intact.

**Install lifecycle:** `add` is not the only verb. `list` joins the catalog with `.payload-components/state.json`; `diff` compares recorded installs against the registry (content-normalized, so line endings are not drift) and exits non-zero on any drift; `update` deletes a component's files so the registry install rewrites them, refusing any component with local edits unless `--force`; `remove` is the exact inverse of `fragment-apply` plus deletion of the files no other recorded component ships (see `partitionOwnedFiles`). `remove` skips the generators when nothing actually changed. Shared logic lives in `inventory.ts` (catalog × state) and `component-files.ts` (canonical content + file ownership).

**Install targets are path-resolved.** `support-matrix.json` declares, per target, candidate paths and required anchors for each host file role (`renderBlocks`, `pagesLayout`); `detectProject` resolves them into `DetectedProject.hostFiles`, and `applyPayloadFragments` / `removePayloadFragments` / `verifyInstalledPayloadFragments` patch **those** paths. Manifests still declare the canonical starter paths in `recovery.patchedFiles`; `resolveRecoveryPatchedFiles` maps them onto the resolved ones. `payload-website-starter` is matched first; `payload-blocks-app` covers the same shape at non-starter paths (flat `Pages.ts`, no `src/`). A truly bare `create-payload-app` is still unsupported: the block components import starter primitives (`@/components/Media`, `@/components/Link`, `@/fields/linkGroup`) that would have to ship as their own base bundle first.

**Localization:** `add <component> --localized` copies `payload-components/source/blocks/shared/localizeFields.ts` into the project and wraps the installed block config's top-level `fields` array in `localizeFields(...)`, which marks prose leaves (`text`, `textarea`, `richText`) localized and recurses containers without localizing them. The wrap sits outside the shared-base spread, so one call covers shared and variant fields. The choice is recorded in install state so `update` re-applies it.

**Templates:** `payload-components/templates/*.json` is **generated** from `src/lib/templates` by `pnpm templates:build` and committed; `tests/int/template-install-manifests.int.spec.ts` is the drift gate. It carries the install contract only (which blocks each template and page needs) — curated section copy stays site-side. `add-template <slug>` installs the union and prints the page plan; it does not seed content.

**MCP:** `payload-components mcp` is a hand-rolled JSON-RPC 2.0 stdio MCP server (`tools/payload-components/mcp/server.ts`) — no SDK, because the published CLI ships only `ajv` and `semver` at runtime. Every tool is read-only: stdout _is_ the transport, and the install pipeline both prints to stdout and spawns children that inherit it. Tool handlers that call reporting commands swap `process.stdout.write` and return the captured text.

**Two install modes:**

- _payload-components-required_ page blocks (`hero-basic`, `feature-grid-basic`) — need the full wiring above.
- _shadcn-native_ post components (in development) — file-only `shadcn add`, no Payload wiring.

**Registry generation:** `payload-components/registry.json` → `public/r` via `shadcn build` (`pnpm registry:build`); `pnpm test:registry` checks the generated output is reproducible.

**Demo twins:** the landing renders _real_ component components as live previews. Each twin in `src/components/site/demos/` must **mirror its component source's `className` literals verbatim** (enforced by `tests/int/demo-twins.int.spec.ts`), stay `aria-hidden`, and contain no interactive elements or headings. Edit a component's source → update its twin in the same change.

## Where to change things

| Task                     | Touch                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| ------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Add a component          | Run `pnpm payload-components new <slug>` — it writes the source, manifest, registry item, doc page, demo twin, demos registry entry, docs sidebar entry, CLI help line, and README inventory row, then prints the curated decisions it refuses to guess (`componentEntries` placement, `dbName`, Content model prose, demo sample content). `payload-components/templates/component-template/README.md` remains the canonical workflow |
| Site copy / messaging    | `src/lib/site.ts`                                                                                                                                                                                                                                                                                                                                                                                                                      |
| Landing layout / visuals | `src/components/site/sections/` + `src/app/globals.css`                                                                                                                                                                                                                                                                                                                                                                                |
| Docs content             | `content/docs/`                                                                                                                                                                                                                                                                                                                                                                                                                        |
| CLI behavior             | `tools/payload-components/`                                                                                                                                                                                                                                                                                                                                                                                                            |

## The contract you must not break

Any change must keep these green:

- **`tests/e2e/frontend.e2e.spec.ts`** — H1 === `heroHeadline`; every `landingSections` heading renders as an `<h2>`; the first `<code>` is `primaryInstallCommand` and the first **Copy** button copies it; forced-light (no `.dark`, light background); **no horizontal overflow** on `/`, `/docs`, `/docs/architecture`, `/components`, `/about`, and component pages; under reduced-motion the terminal replay still shows its final transcript line.
- **`tests/e2e/geo.e2e.spec.ts`** — `llms.txt` / `llms-full.txt` / `/api/search` / per-page markdown / OG images.
- **`tests/e2e/components-visual.e2e.spec.ts`** — each component's demo twin matches its committed per-platform visual baseline (rendered chrome-free at `/components/preview/<slug>`). Refactors should stay visually inert; only regenerate baselines for intended visual changes with `pnpm test:e2e components-visual --update-snapshots`, or mint them in the CI renderer with the `visual-baselines` workflow (CI is linux — the linux `*-chromium-linux.png` baselines must be minted there or the suite skips on the gate, so run the workflow once and merge the PR it opens). A case skips when its current-platform baseline is missing; once the platform has any baseline, a coverage guard fails the gate if a component is missing one.
- **`tests/int/`** — demo-twin class-mirror fidelity; **component visual standards** (`visual-standards.int.spec.ts`: token-only colours, named radius/letter-spacing tokens, no arbitrary colour/radius/tracking/spacing/font values — add a token in `globals.css` rather than an arbitrary value); registry reproducible; install idempotent and recoverable.

Adding a CLI command also means updating `usage` in `tools/payload-components/cli.ts`, the `CliCommands` type, the `allowedFlags` map, and `tests/int/payload-components-cli.int.spec.ts` — the flag guard rejects any flag a command does not list, so a new flag is inert until it is added there. The `Current components:` list in that same `usage` string must stay in registry order (`tests/int/inventory-sync.int.spec.ts`), and the blog figures in `tools/blog/visual-system/catalog.ts` excerpt live CLI source by anchor, so reshaping an excerpted function means `pnpm blog:visuals:figures`.

If you add a `landingSections` key, render its `<h2>` in the same change. The copy strings tests rely on (`heroHeadline`, `primaryInstallCommand`, `landingSections.*`, `componentEntries`, `terminalDemoLines`, `catalogTitle`) live in `src/lib/site.ts` — don't rename or retext them casually.

## Architecture Boundary

- Keep the public site in `src/app`, `src/components`, `src/lib`, and `content/docs`.
- Keep installable Payload target code in `payload-components/source`.
- Keep wrapper metadata in `payload-components/manifests`, `payload-components/schema`, and `payload-components/support-matrix.json`.
- Keep CLI behavior in `tools/payload-components` and `bin/payload-components.mjs`.
- Do not reintroduce Payload admin routes, collections, globals, database adapters, seed endpoints, waitlist APIs, preview routes, or `PAYLOAD_SECRET` requirements for the docs site.

## Registry Contract

- `payload-components/registry.json` is the source shadcn registry.
- Generated registry output belongs in ignored `public/r`.
- Registry file entries may read from `payload-components/source`, but their `target` paths must install into consumer repos under `~/src/...`.
- New components must include source files, manifest metadata, docs, and installer tests together.
- Direct shadcn installs only deliver files and public shadcn dependencies. `payload-components add` owns Payload-specific wiring, post-install scripts, and install state.

## shadcn registry directory listing

**Status: listed.** The registry is published under the `@payload-components` namespace and is live in
the [official shadcn registry directory](https://ui.shadcn.com/docs/directory) — merged upstream in
[shadcn-ui/ui#11006](https://github.com/shadcn-ui/ui/pull/11006) (2026-06-24), so people can discover it
and run `shadcn add @payload-components/<item>`. `pnpm registry:validate` schema-checks every item
against the vendored shadcn schemas (`tools/payload-components/schemas/`) and runs inside the release gate.

The live entry in `apps/v4/registry/directory.json` upstream:

```json
{
  "name": "@payload-components",
  "homepage": "https://www.payload-components.xyz",
  "url": "https://www.payload-components.xyz/r/{name}.json",
  "description": "MIT registry of typed Payload CMS blocks for Payload v3 + Next.js. Each block installs as reviewable source; the companion CLI also wires collection config, RenderBlocks, types, and the admin import map.",
  "logo": "<svg …/>"
}
```

**This entry is a copy, not a feed** — upstream stores those five fields verbatim, so nothing here
propagates. Changing the homepage, the description, or the logomark means another PR to `shadcn-ui/ui`.

**Known drift:** the `logo` upstream is still the retired `P` mark. The logomark became two keyed blocks
on 2026-07-31 (`public/favicon.svg` is canonical), after the directory PR merged. Worth a follow-up PR;
it is cosmetic and only visible on their directory page.

The URLs must resolve before any such PR — their CI runs `validate:registries` against the live site:

```bash
curl -fsSL https://www.payload-components.xyz/r/registry.json    # 200
curl -fsSL https://www.payload-components.xyz/r/hero-basic.json   # 200, embeds file content
```

Entries are a flat JSON array sorted alphabetically by `name`; keep the literal `{name}` placeholder in
`url`. `logo` is not schema-required but every entry carries one, so treat it as required in practice.

## Variants and Shared Code

This is the canonical model for every component family. `content/docs/architecture.mdx` carries the narrative version.

- A structural variant is its own registry item and manifest — `hero-basic`, `hero-video`, `hero-dramatic`. Never an interactive variant prompt. Suffix every variant; do not ship a bare family name. Selection happens in the catalog, not the CLI.
- Content-level variation (optional or extra editor fields) belongs in the Payload block config, not a new component.
- Share code across a family with a real source file every variant ships: add it under `payload-components/source/blocks/shared`, list it in the variant's registry item `files[]` (with a `~/src/...` target) and the manifest `files[]`, and compose it in the config — e.g. `payload-components/source/blocks/shared/heroFields.ts` → `~/src/blocks/shared/heroFields.ts`, used as `fields: [...heroFields, /* variant-specific */]`.
- Do NOT use `registryDependencies` for internal shared modules. That path resolves only public shadcn UI components (it checks `components/ui/<name>.tsx` and runs `shadcn add <name>`); an internal name will 404.
- When a component's installed file set changes, sync the hand-maintained landing ledgers in `src/lib/site.ts` (`terminalDemoLines`, `frameInstalledFiles`, `wiringLedger`) and the component's `content/docs/components/<name>.mdx` page.

## Component doc page format

Every component doc page (`content/docs/components/<slug>.mdx`) follows one fixed shape — a shadcn-style
component page. Match it exactly when adding or editing a component; do not invent per-component layouts.

- **Header is automatic.** `src/app/docs/[[...slug]]/page.tsx` detects `/docs/components/*` and renders
  `ComponentDocHeader` — title + description + at-a-glance chips (`v{version} · Page block · {Family}
family · {target}`, from `componentEntries`) on the left; Copy Page + prev/next arrows (catalog order)
  on the right. The component **must** be in `componentEntries` (`src/lib/site.ts`). Do **not** add an `<h1>` or
  repeat the description in the MDX body — frontmatter drives both.
- **Frontmatter:** `title` (must equal the component's `componentEntries` title — the e2e component-page loop asserts
  `H1 === component.title`), `description`, `icon` (any Lucide name).
- **The rich sections are data-driven from the manifest/registry** (via `src/lib/component-manifest.ts`),
  so the MDX stays thin and the sections can't drift from what installs. Body order, nothing above
  the preview:
  1. `<ComponentPreview slug="<slug>" />` — **Preview** (demo twin from
     `src/components/site/demos/registry.ts`) + **Code** (every installed source file — `config.ts`,
     `Component.tsx`, shared `*Fields.ts` — read at build via `getComponentSources` in
     `src/lib/component-source.ts`) tabs. A new component **must** register a demo twin, or the preview is empty.
  2. `## Installation` — `<Tabs items={['Command', 'Manual']}>`: Command = `npx payload-components add
<slug>`; Manual = the direct `pnpm dlx shadcn@latest add …/r/<slug>.json` URL.
  3. `## What it installs` — `<ComponentWiring slug="<slug>" />`: the copied files + a factual table of the
     edits the install makes (register the block, map the renderer, regenerate types + import map) +
     shared-base callout + idempotency note, all from the manifest. State facts — **not** a
     shadcn comparison; that pitch belongs on the landing, not the reference. Do **not**
     hand-write the file tree or fragment list.
  4. `## Content model` — `<TypeTable>` of the block fields (+ a second table for array-item fields).
     The one hand-authored section; note which fields come from the shared family base vs the variant.
  5. `## Usage` — `<ComponentUsage slug="<slug>" />`: the admin steps (add the block to a Page → fill → publish).
  6. `## Requirements` — `<ComponentRequirements slug="<slug>" />`: target, Payload/Next majors, shadcn deps.
  7. `## In this family` — `<ComponentFamily slug="<slug>" />`: sibling variants. Include this section
     **only when the family has 2+ variants** (it renders nothing for a lone variant — omit the
     heading too, e.g. `hero-basic` has none yet).
- **Keep the install command and Content-model prose in MDX**, never in page chrome — the `/llms*`
  and per-page markdown surfaces serialize MDX, and `tests/e2e/geo.e2e.spec.ts` pins exact
  install-command substrings. Data-driven sections must scroll/stack inside their cards (no page
  overflow; the ledger stacks under `md`).

## Payload Target Safety

Payload code in this repo is target code for consumer projects. When editing it:

- Use TypeScript and real Payload types.
- Keep block configs explicit: `slug`, `interfaceName`, `labels.singular`, and `labels.plural`.
- Preserve optional wrapper props such as `id`, `className`, and `disableInnerContainer` on frontend blocks.
- If adding Local API examples that pass `user`, set `overrideAccess: false`.
- If adding hooks with nested Payload operations, pass `req` to nested operations.
- Use context flags for hook-driven updates that could otherwise trigger loops.
- When inspecting or transforming Payload fields, use Payload's exported field type guards instead of unsafe casts.

## Validation

Run the smallest useful check while iterating, then run the release gate before shipping:

```bash
pnpm lint
pnpm source:build
pnpm exec tsc --noEmit
pnpm templates:build   # only after editing src/lib/templates
pnpm test:registry
pnpm run test:int
pnpm run test:e2e
pnpm build
```

`pnpm test:release` runs the full local gate. `pnpm test:fresh` is the slower external Payload smoke test for pre-release or nightly confidence; it runs two scenarios and `--scenario bare|website|all` selects between them. The **bare** scenario compiles the starter base inside a real Payload app — this repo excludes `payload-components/source` from tsc and has no `payload` dependency — so run it after touching `source/base` or the fragment patcher. It caught three shipped bugs the moment it first ran.

**Shipped target code must be compile-checked, not just reviewed.** v1.3.0 shipped a starter base that could not compile: `source/` is excluded from tsc, so no gate ever looked at the bytes being installed. `tests/int/payload-components-source-compiles.int.spec.ts` closes the fast half of that — it walks `source/base` (enumerated, so new files are covered on sight), parses every file, applies real manifest fragments to the shipped `RenderBlocks.tsx` and `Pages/index.ts` and re-parses the result, and typechecks the renderer with a populated block map. It runs in the normal gate and reproduces two of those three bugs in milliseconds. When you add target code that a real project would compile, extend it rather than relying on review or on the network-and-database smoke alone.

**Gotchas:**

- Fresh worktree/clone: run `pnpm install` then **`pnpm source:build`** before `dev`/`tsc` (Fumadocs compiles `content/docs` → `.source/`; otherwise types fail on missing `.source/`).
- e2e uses `E2E_PORT` (default `3100`) to avoid common local `3000` contention.
- The site is **forced light** (`forcedTheme: 'light'`); there is no dark mode. The terminal/maintainer cards are intentionally dark surfaces via `--terminal-*` / `bg-foreground` tokens, not `dark:` variants.
- Fonts (Geist Sans/Mono + Instrument Serif accent) load via `next/font` with their CSS variables on `<html>`. Keep them on `<html>` or the Tailwind v4 `@theme` font tokens silently break.

## Branch & release flow

- **`dev`** = integration branch; **`main`** = production (protected, gated by the `pr-gate` check). Work on a feature branch → open a PR into `dev` → promote `dev → main` via PR. Direct pushes to `main` are blocked.
- **Put closing keywords in the promote PR body, not the feature PR.** GitHub fires `Closes #123` only when the commit carrying it lands on the default branch. Feature work is squashed onto `dev` and squashed again on promote, so a keyword written on a feature PR never reaches `main` and the issue silently stays open. The promote PR is the only one that merges into `main`, so its body is the one place a keyword works. v1.4.0 is the worked example: #473 wrote `(closes #108)` in its table and #108 closed on merge, while #100, #101, and #121 shipped in the same release without a keyword on the promote and had to be closed by hand. When writing the promote body, add a keyword for every issue the cycle resolves. The `Promote Closing Keywords` workflow enforces the _presence_ of one: a `base: main` PR whose body carries neither a closing keyword nor the line `No issues closed this cycle.` fails, and editing the description re-runs the check without a new commit. It cannot tell whether the list is complete — #473 carried one keyword and still leaked three issues — so presence passing is not evidence that nothing was missed.

## Deeper docs

- `README.md` — quickstart and what-lives-where.
- `CONTRIBUTING.md` — local setup, good first contributions, PR checklist.
- `payload-components/README.md` — the registry/manifest contract in depth.
- `content/docs/{architecture,installation,registry}.mdx` — the user-facing system docs.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
