# Payload Kits Development Rules

This repository is a Fumadocs-powered Next.js site plus `payload-kit` registry tooling. It is not a Payload CMS runtime app.

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
