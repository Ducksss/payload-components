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
opening a pull request when practical.

### Focused checks

Start with the row that matches what you touched. These are the smallest checks
that still cover the change:

| Change type                                            | Run                                                                             |
| ------------------------------------------------------ | ------------------------------------------------------------------------------- |
| Docs or content only (`content/docs`, `*.md`)          | `pnpm source:build`, `pnpm run test:int`                                        |
| Site UI (`src/app`, `src/components`, `src/lib`)       | `pnpm lint`, `pnpm exec tsc --noEmit`, `pnpm run test:int`, `pnpm run test:e2e` |
| Registry or component metadata (`payload-components/`) | `pnpm test:registry`, `pnpm run test:int`                                       |
| CLI or tooling (`tools/payload-components`, `bin/`)    | `pnpm lint`, `pnpm exec tsc --noEmit`, `pnpm run test:int`                      |

`pnpm run test:int` is in every one of those rows because the integration suite
reaches further than its name suggests: it renders site components directly, and
most of its specs import the CLI. `pnpm test:install` is a fast subset of four
specs — useful while iterating, but it is not enough on its own to clear a CLI
change.

Two rules apply to every row. CI runs `pnpm format:check`, so run `pnpm format`
before pushing whatever you changed. And any change that alters what a page
renders also needs new visual baselines — see [Visual baselines](#visual-baselines).

### Full suite

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

`components-visual`, `templates-visual`, `blog-visual`, and the landing screenshots
compare against committed `*-chromium-linux.png` files. Linux CI is the canonical
renderer. macOS and Windows run browser behavior and accessibility checks but skip
screenshot comparisons, avoiding duplicate platform images and paired updates.

For intended visual changes, run the `visual-baselines` workflow against your
branch. It opens a PR containing the Linux PNGs. Review the images before merging;
only keep changes the implementation explains. Use its `update: all` option when
an intended change is smaller than the usual screenshot comparison tolerance.

The coverage guard fails Linux CI if any component or template lacks its baseline.
A local non-Linux release gate is therefore incomplete visual validation; the PR
must also pass the Linux gate.

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
- Linux `*-chromium-linux.png` updates for any
  change that alters rendering (see [Visual baselines](#visual-baselines)).
- The tests/checks you ran.
- Notes about registry output, target project wiring, or fresh Payload smoke
  coverage when relevant.

By contributing, you agree that your contributions are licensed under the MIT
license used by this repository.
