# Contributing to Payload Components

Thanks for helping improve Payload Components. This repository contains a
Fumadocs-powered Next.js site plus registry tooling for installing Payload CMS
blocks into supported Payload v3 projects. The website itself is not a
Payload CMS runtime app.

## Good First Contributions

Useful contributions usually fit one of these tracks:

- Improve or add installable component source files under `payload-components/source`.
- Add or update component manifests, docs, support metadata, and installer tests
  together.
- Tighten `payload-components` CLI behavior in `tools/payload-components`.
- Improve the Fumadocs site, catalog pages, search, LLM text surfaces, or
  registry checks.
- Fix Payload target code, Next.js, TypeScript, accessibility, or test issues.

Open an issue before large architectural changes so we can keep the registry,
CLI, and Payload integration direction coherent.

## Local Setup

Use Node.js `^20.19.0 || >=22.12.0` and pnpm `^9 || ^10`.
TypeScript stays on 5.x until `vite-tsconfig-paths` stops pulling `tsconfck`
with a `typescript@^5.0.0` peer range.

```sh
pnpm install --frozen-lockfile --ignore-workspace
pnpm dev
```

Open `http://localhost:3000`.

The docs site does not require Postgres, Payload admin routes, collections,
globals, a database adapter, or `PAYLOAD_SECRET`. Copy `.env.example` to `.env`
only when you need to override site metadata URLs or the GitHub content branch.

## Development Rules

- Keep changes TypeScript-first and follow the existing project patterns.
- Keep public site code in `src/app`, `src/components`, `src/lib`, and
  `content/docs`.
- Keep installable Payload target code in `payload-components/source`.
- Keep wrapper metadata in `payload-components/manifests`,
  `payload-components/schema`, and `payload-components/support-matrix.json`.
- Keep CLI behavior in `tools/payload-components` and `bin/payload-components.mjs`.
- Do not reintroduce Payload runtime routes, database adapters, waitlist APIs,
  or `PAYLOAD_SECRET` requirements for the docs site.
- Generated registry output belongs in ignored `public/r`.
- New or edited components must meet the accessibility checklist in
  `payload-components/templates/component-template/README.md` (label association,
  `autocomplete` tokens, reduced-motion, and accessible link/image names).

When editing Payload target code, use real Payload types, keep block configs
explicit, preserve optional wrapper props, pass `req` to nested Payload
operations, and set `overrideAccess: false` when examples pass `user` to the
Local API.

## Branches

- `main` is the production release line.
- `dev` is the staging line where stable feature branches are collected.
- Fork the repository before contributing.
- Create feature branches from `dev`.
- Open pull requests into `dev`.
- Maintainers promote from `dev` to `main` only after the release gate passes.

## Verification

Run the focused checks that match your change, then run the broader suite before
opening a pull request when practical:

```sh
pnpm lint
pnpm source:build
pnpm exec tsc --noEmit
pnpm test:registry
pnpm run test:int
pnpm run test:e2e
pnpm build
```

For release-sensitive work, run:

```sh
pnpm test:release
```

CI requires `pnpm test:fresh` across four fresh-consumer shards; run an individual
shard locally with `pnpm test:fresh -- --shard-index 0`.

### Visual baselines

`components-visual`, `templates-visual`, `blog-visual`, and the `frontend`
landing snapshot compare against committed PNGs. Rendering differs per platform,
so each baseline is committed twice — `*-chromium-darwin.png` (a macOS dev box)
and `*-chromium-linux.png` (the CI renderer) — and a platform's images can only
be generated on that platform.

**Any change that alters what a page renders must update both platforms in the
same pull request.** Mint darwin locally, then mint linux with the
`visual-baselines` workflow (`workflow_dispatch`; it opens a PR with the changed
PNGs against your branch):

```sh
E2E_PORT=3100 pnpm test:e2e <spec> --update-snapshots
```

This matters because nothing in CI can catch a half-mint. The specs' coverage
guard fails on a _missing_ baseline, never a stale one, and `pr-gate` only ever
renders linux — so a linux-only mint leaves the darwin image showing the old
design, green on every PR, failing only for whoever next runs the gate on a Mac.

Reviewer checklist: **a diff that touches `*-chromium-linux.png` without the
matching `*-chromium-darwin.png` (or vice versa) is suspect** — either the other
platform is now stale, or the change wasn't visual and the PNGs shouldn't be
there at all. The paired-mint history is auditable with:

```sh
git log --format='COMMIT %h %s' --name-only -20 -- 'tests/e2e/*-snapshots/*'
```

Two follow-up commits (a local darwin mint, then the workflow's linux PR) are
fine and normal; one platform alone, permanently, is the bug.

### Template accessibility sweep

`templates-a11y` runs axe (WCAG 2.1 A/AA) over the `/templates` gallery and over
every concept's detail page and full preview at 1280 and 390. It is its own
Playwright batch and is data-driven from `src/lib/templates/registry`, so
registering a concept is all it takes to cover it. Two things about it are easy
to get wrong when extending it:

- **It runs under reduced motion, on purpose.** Straight after `goto`, in-view
  sections are mid-fade and axe reads ~13%-opacity ink as a _serious_ contrast
  violation. `reducedMotion: 'reduce'` lets the CSS nets pin the final frame
  before hydration, and the suite then asserts that every
  `[data-template-section]` and every `data-*-reveal` element really is settled.
  A new per-concept reveal attribute needs its own
  `@media (prefers-reduced-motion: reduce)` net in that concept's `theme.css`,
  or the sweep fails naming the element.
- **A green axe run does not clear the gradient plates.** axe cannot resolve a
  gradient or image background, so it reports text over one as `incomplete`,
  never as a violation — 13-72 nodes per page here, including the hero plates.
  The preview sweeps hand that list to `tests/e2e/support/painted-contrast.ts`,
  which captures the page with and without ink, treats the differing pixels as
  the glyphs, and scores the authored colour against the worst background
  actually painted under them. Every run logs how many pairings it scored and
  what it could not, so "green" is never mistaken for "everything was checked".

### Packed CLI smoke

`pnpm test:pack` installs the built tarball and runs the CLI exactly as a
published consumer would, checking the shipped-files whitelist, runtime
dependencies, and plain Node execution. It is not part of the default
`pnpm test:int` path because packing is slow, so it runs on the
release-sensitive `package-publish` workflow rather than on every PR.

Run it locally before any release-sensitive change, specifically when you touch:

- packaging (`package.json` `files`/`bin`/`exports`, `tsup` config, published dependencies);
- the CLI entrypoint (`bin/payload-components.mjs`, `tools/payload-components/cli.ts`);
- anything that affects what ships in the npm tarball.

```sh
pnpm test:pack
```

## Pull Requests

Pull requests should include:

- A clear description of what changed and why.
- Screenshots or short notes for visible UI changes.
- Paired `*-chromium-darwin.png` and `*-chromium-linux.png` updates for any
  change that alters rendering (see [Visual baselines](#visual-baselines)).
- The tests/checks you ran.
- Notes about registry output, target project wiring, or fresh Payload smoke
  coverage when relevant.

By contributing, you agree that your contributions are licensed under the MIT
license used by this repository.
