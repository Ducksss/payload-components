# Contributing to Payload Kits

Thanks for helping improve Payload Kits. This repository contains a
Fumadocs-powered Next.js site plus registry tooling for installing Payload CMS
block kits into supported Payload v3 projects. The website itself is not a
Payload CMS runtime app.

## Good First Contributions

Useful contributions usually fit one of these tracks:

- Improve or add installable kit source files under `payload-kits/source`.
- Add or update kit manifests, docs, support metadata, and installer tests
  together.
- Tighten `payload-kit` CLI behavior in `tools/payload-kit`.
- Improve the Fumadocs site, catalog pages, search, LLM text surfaces, or
  registry checks.
- Fix Payload target code, Next.js, TypeScript, accessibility, or test issues.

Open an issue before large architectural changes so we can keep the registry,
CLI, and Payload integration direction coherent.

## Local Setup

Use Node.js `^18.20.2 || >=20.9.0` and pnpm `^9 || ^10`.

```sh
pnpm install --frozen-lockfile --ignore-workspace
pnpm dev
```

Open `http://localhost:3000`.

The docs site does not require Postgres, Payload admin routes, collections,
globals, a database adapter, or `PAYLOAD_SECRET`. Copy `.env.example` to `.env`
only when you need to override `NEXT_PUBLIC_SITE_URL` or run Payload target
smoke tests.

## Development Rules

- Keep changes TypeScript-first and follow the existing project patterns.
- Keep public site code in `src/app`, `src/components`, `src/lib`, and
  `content/docs`.
- Keep installable Payload target code in `payload-kits/source`.
- Keep wrapper metadata in `payload-kits/manifests`,
  `payload-kits/schema`, and `payload-kits/support-matrix.json`.
- Keep CLI behavior in `tools/payload-kit` and `bin/payload-kit.mjs`.
- Do not reintroduce Payload runtime routes, database adapters, waitlist APIs,
  or `PAYLOAD_SECRET` requirements for the docs site.
- Generated registry output belongs in ignored `public/r`.

When editing Payload target code, use real Payload types, keep block configs
explicit, preserve optional wrapper props, pass `req` to nested Payload
operations, and set `overrideAccess: false` when examples pass `user` to the
Local API.

## Branches

- `prod` is the production release line.
- `dev` is the staging line where stable feature branches are collected.
- Feature branches, including `v2`, should target `dev` first.
- Promote from `dev` to `prod` only after the release gate passes.

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

`pnpm test:fresh` is available for slower smoke coverage against a fresh
external Payload app.

## Pull Requests

Pull requests should include:

- A clear description of what changed and why.
- Screenshots or short notes for visible UI changes.
- The tests/checks you ran.
- Notes about registry output, target project wiring, or fresh Payload smoke
  coverage when relevant.

By contributing, you agree that your contributions are licensed under the MIT
license used by this repository.
