# Payload Kits — Agent Guide

Read this first. It's the single source of truth for agents working in this repo. `CLAUDE.md` points here. Humans: see also `README.md` and `CONTRIBUTING.md` (this file links, it doesn't repeat setup).

## What this is

Payload Kits is an **open-source, community-first** registry + CLI that installs Payload CMS block kits into consumer **Payload v3 + Next.js** projects — _wired, not pasted_. A plain `shadcn add` only copies files; `payload-kit add` also does the Payload wiring (registers the block in the collection, maps the renderer, regenerates types + the admin import map) and lands it as a reviewable git diff.

This repository is **two things at once**:

1. The **Fumadocs-powered Next.js site** — the marketing landing, docs, and kit catalog (this is what's deployed).
2. The **`payload-kit` registry + CLI** — the tooling that distributes kits into _other_ people's repos.

It is **not** a Payload CMS runtime app: no admin, no database, no `PAYLOAD_SECRET` for the site.

## Project positioning — community-first

The North Star is **open-source, MIT, community-first**. No pricing, no license keys, no gated tiers, no sales funnel. Success is adoption and contributions, not revenue — the catalog grows from real installs and PRs. Keep all copy, docs, and issue templates aligned to that. If you find commercial / "sellable" framing (pricing hedges, "design partner" or "early access" funnels, paid-tier roadmaps), treat it as stale residue and reframe it community-first.

## The mental model (internalize this one split)

|            | Site runtime                  | Kit distribution                              |
| ---------- | ----------------------------- | --------------------------------------------- |
| Lives in   | `src/`, `content/docs/`       | `payload-kits/`, `tools/payload-kit/`         |
| Runs       | here (Fumadocs / Next.js)     | in the _consumer's_ repo, after install       |
| Payload?   | none (docs site only)         | the installed kit code **is** Payload target code |

The Payload block code under `payload-kits/source/` is **target code** — shipped into consumer repos, never executed by this site. Don't import it into the site, and don't run the site against a database.

## Repo map

| Path | Purpose |
| --- | --- |
| `src/app/` | Routes: `/` (landing), `/docs/[[...slug]]` (Fumadocs), `/components` (catalog), `/about`, `/api/search`, `llms.txt` · `llms-full.txt` · `llms.mdx` (AI surfaces), `og/` + `opengraph-image` |
| `src/components/site/` | Site UI: `SiteHeader`/`SiteFooter`, `HeroProductFrame` + `HeroInstallReplay` (the install replay), `WiringLedger`, `KitSpecimen`/`KitCard`/`KitGrid`, `Faq`, `CommandCopyButton`, `section.tsx` |
| `src/components/site/sections/` | Landing sections (Hero, StackBand, Tax, Workflow, Wiring, Catalog, Faq, CommunityCta). `src/app/page.tsx` just orchestrates these |
| `src/components/site/demos/` | **Demo twins** — live previews that mirror kit source class-for-class (see Core flows) |
| `src/lib/site.ts` | **Single source of truth for all site copy/data** (hero text, FAQ, kit entries, landing-section headings, terminal demo lines). Tests import from here |
| `content/docs/` | Fumadocs MDX (index, architecture, installation, registry, contributing, `kits/*`); page tree via `meta.json` |
| `payload-kits/` | `registry.json` (source shadcn registry), `source/` (kit target code), `manifests/*.json` (wiring contract), `schema/`, `support-matrix.json` |
| `tools/payload-kit/` + `bin/payload-kit.mjs` | The CLI: `add` command, project detection, fragment patching, install state, registry build/check |
| `tests/` | `e2e/` (Playwright) + `int/` (Vitest) — the contract (below) |
| `public/r/` | Generated public registry — **gitignored build output**, never hand-edit |

## Core flows

**`payload-kit add <kit>` pipeline** (`tools/payload-kit/commands/add.ts`) — five idempotent stages; install state is recorded in the consumer's `.payload-kit/state.json`:

`registry-build` → `registry-add` → `dependency-install` → `fragment-apply` → `post-install` (`generate:types`, `generate:importmap`)

Fragment patching is **text-anchor based** — it finds anchors like `const blockComponents = {` and `name: 'layout'` in the consumer repo and inserts imports/registrations with dedup checks. Fragile by design for alpha; keep the anchors and dedup logic intact.

**Two install modes:**

- _payload-kit-required_ page blocks (`hero-basic`, `feature-grid-basic`) — need the full wiring above.
- _shadcn-native_ post components (in development) — file-only `shadcn add`, no Payload wiring.

**Registry generation:** `payload-kits/registry.json` → `public/r` via `shadcn build` (`pnpm registry:build`); `pnpm test:registry` checks the generated output is reproducible.

**Demo twins:** the landing renders _real_ kit components as live previews. Each twin in `src/components/site/demos/` must **mirror its kit source's `className` literals verbatim** (enforced by `tests/int/demo-twins.int.spec.ts`), stay `aria-hidden`, and contain no interactive elements or headings. Edit a kit's source → update its twin in the same change.

## Where to change things

| Task | Touch |
| --- | --- |
| Add a kit | `payload-kits/source/` + `manifests/<kit>.json` + `registry.json` + `content/docs/kits/<kit>.mdx` + installer tests — **all together** (incomplete kits don't ship) |
| Site copy / messaging | `src/lib/site.ts` |
| Landing layout / visuals | `src/components/site/sections/` + `src/app/globals.css` |
| Docs content | `content/docs/` |
| CLI behavior | `tools/payload-kit/` |

## The contract you must not break

Any change must keep these green:

- **`tests/e2e/frontend.e2e.spec.ts`** — H1 === `heroHeadline`; every `landingSections` heading renders as an `<h2>`; the first `<code>` is `primaryInstallCommand` and the first **Copy** button copies it; forced-light (no `.dark`, light background); **no horizontal overflow** on `/`, `/docs`, `/docs/architecture`, `/components`, `/about`, and kit pages; under reduced-motion the terminal replay still shows its final transcript line.
- **`tests/e2e/geo.e2e.spec.ts`** — `llms.txt` / `llms-full.txt` / `/api/search` / per-page markdown / OG images.
- **`tests/int/`** — demo-twin class-mirror fidelity; registry reproducible; install idempotent and recoverable.

If you add a `landingSections` key, render its `<h2>` in the same change. The copy strings tests rely on (`heroHeadline`, `primaryInstallCommand`, `landingSections.*`, `kitEntries`, `terminalDemoLines`, `catalogTitle`) live in `src/lib/site.ts` — don't rename or retext them casually.

## Architecture Boundary

- Keep the public site in `src/app`, `src/components`, `src/lib`, and `content/docs`.
- Keep installable Payload target code in `payload-kits/source`.
- Keep wrapper metadata in `payload-kits/manifests`, `payload-kits/schema`, and `payload-kits/support-matrix.json`.
- Keep CLI behavior in `tools/payload-kit` and `bin/payload-kit.mjs`.
- Do not reintroduce Payload admin routes, collections, globals, database adapters, seed endpoints, waitlist APIs, preview routes, or `PAYLOAD_SECRET` requirements for the docs site.

## Registry Contract

- `payload-kits/registry.json` is the source shadcn registry.
- Generated registry output belongs in ignored `public/r`.
- Registry file entries may read from `payload-kits/source`, but their `target` paths must install into consumer repos under `~/src/...`.
- New kits must include source files, manifest metadata, docs, and installer tests together.
- Direct shadcn installs only deliver files and public shadcn dependencies. `payload-kit add` owns Payload-specific wiring, post-install scripts, and install state.

## Payload Target Safety

Payload code in this repo is target code for consumer projects. When editing it:

- Use TypeScript and real Payload types.
- Keep block configs explicit: `slug`, `interfaceName`, `labels.singular`, and `labels.plural`.
- Preserve optional wrapper props such as `id`, `className`, and `disableInnerContainer` on frontend blocks.
- If adding Local API examples that pass `user`, set `overrideAccess: false`.
- If adding hooks with nested Payload operations, pass `req` to nested operations.
- Use context flags for hook-driven updates that could otherwise trigger loops.

## Validation

Run the smallest useful check while iterating, then run the release gate before shipping:

```bash
pnpm lint
pnpm source:build
pnpm exec tsc --noEmit
pnpm test:registry
pnpm run test:int
pnpm run test:e2e
pnpm build
```

`pnpm test:release` runs the full local gate. `pnpm test:fresh` is the slower external Payload smoke test for pre-release or nightly confidence.

**Gotchas:**

- Fresh worktree/clone: run `pnpm install` then **`pnpm source:build`** before `dev`/`tsc` (Fumadocs compiles `content/docs` → `.source/`; otherwise types fail on missing `.source/`).
- e2e uses `E2E_PORT` (default `3000`). Port `3000` is often contended by other local servers — run e2e with **`E2E_PORT=3100`**.
- The site is **forced light** (`forcedTheme: 'light'`); there is no dark mode. The terminal/maintainer cards are intentionally dark surfaces via `--terminal-*` / `bg-foreground` tokens, not `dark:` variants.
- Fonts (Geist Sans/Mono + Instrument Serif accent) load via `next/font` with their CSS variables on `<html>`. Keep them on `<html>` or the Tailwind v4 `@theme` font tokens silently break.

## Branch & release flow

- **`dev`** = integration branch; **`main`** = production (protected, gated by the `pr-gate` check). Work on a feature branch → open a PR into `dev` → promote `dev → main` via PR. Direct pushes to `main` are blocked.

## Deeper docs

- `README.md` — quickstart and what-lives-where.
- `CONTRIBUTING.md` — local setup, good first contributions, PR checklist.
- `payload-kits/README.md` — the registry/manifest contract in depth.
- `content/docs/{architecture,installation,registry}.mdx` — the user-facing system docs.
