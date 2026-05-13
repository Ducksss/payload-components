# Payload Kits Workspace

This directory holds the in-repo registry, manifests, support matrix, and internal authoring scaffolds for the current `payload-kit` alpha.

## Goal

Prove that real shadcn-compatible registry items can be wrapped by `payload-kit add`, then wired into Payload and regenerated successfully. In this tranche, the shipped alpha kits are `hero-basic` and `feature-grid-basic`.

## Viability Gate

The POC passes only if all of the following are true:

- `payload-kit add hero-basic` and `payload-kit add feature-grid-basic` install through a real shadcn-compatible registry flow.
- The install adds the block source files to the target project.
- The install wires the block into `src/blocks/RenderBlocks.tsx`.
- The install wires the block into `src/collections/Pages/index.ts`.
- The install runs `generate:types` and `generate:importmap` successfully.
- A second install is idempotent.

If any of those fail because of brittle repo patching or unreliable generation, we should stop and reconsider the product shape before building private registries, auth, or a larger kit catalog.

Alpha reality in this workspace: `payload-kit add` is real, while `payload-kit init` and `payload-kit doctor` remain placeholders.

## Public Registry Contract

The source registry is `payload-kits/registry.json`. The publishable registry is generated into ignored build output under `public/r`:

- `public/r/registry.json`: flat registry index for namespace and directory consumers
- `public/r/hero-basic.json`: generated registry item with embedded file content
- `public/r/feature-grid-basic.json`: generated registry item with embedded file content

Build and validate it with:

```bash
pnpm registry:build
pnpm registry:check
```

Production builds run `registry:build` automatically through the package `prebuild` script. `registry:check` builds the registry into a temp directory and verifies the generated output against `payload-kits/registry.json` and the source block files.

Direct public installs use the generated item URLs:

```bash
pnpm dlx shadcn@latest add https://<your-domain>/r/hero-basic.json
pnpm dlx shadcn@latest add https://<your-domain>/r/feature-grid-basic.json
```

For a complete install, use `payload-kit add`. The shadcn registry delivers files and shadcn UI dependencies; the wrapper adds the Payload-specific registration layer and post-install generation.

Namespace consumers can configure:

```json
{
  "registries": {
    "@payload-kits": "https://<your-domain>/r/{name}.json"
  }
}
```

Then install with `pnpm dlx shadcn@latest add @payload-kits/hero-basic`.

## Verification Suite

Use both verification tiers:

- `pnpm test:registry`: checks that the public registry can be reproduced from source.
- `pnpm test:install`: runs the fast wrapper fixture suite against temp-copy Payload website targets.
- `pnpm test:fresh`: runs the slower fresh Payload website smoke test for nightly and pre-release confidence.
- `pnpm test:release`: runs lint, TypeScript, registry checks, integration tests, Playwright E2E, build, and the fresh smoke.

The fast fixture suite remains the normal PR gate because it is deterministic and proves the wrapper contract:

- both kits install into a supported target
- install order works both ways
- repeated installs are idempotent
- `RenderBlocks.tsx` and `Pages/index.ts` are wired exactly once
- `.payload-kit/state.json` records success and partial failure stages correctly
- the wrapper installs missing public `registryDependencies`, then strips them from its temporary shadcn item before installing the block files

The fresh smoke lives at `../tools/payload-kit/smoke/fresh-payload-repo.ts` and accepts:

```bash
pnpm test:fresh -- --kits hero-basic,feature-grid-basic
pnpm test:fresh -- --registry-url https://<your-domain>/r/{name}.json
pnpm test:fresh -- --keep-temp --timeout 1200000
```

Without `--registry-url`, the runner serves `../public/r` locally and direct-installs each item URL with shadcn. With `--registry-url`, it uses the deployed registry URL template, which is the pre-release path. Direct shadcn verification only proves file delivery and shadcn UI dependency delivery; Payload wiring is verified through `payload-kit add`.

## Current Contract

Alpha manifests now define:

- kit identity and version
- supported Payload and Next.js majors
- `dependencies` and `peerDependencies`
- owned installed files
- Payload-specific fragments to register
- `recovery.patchedFiles` for target-file patch tracking
- post-install tasks
- preview metadata and sample content

## Alpha Kit Template

The reusable starter for future alpha kits lives in `templates/alpha-kit/`.

Use it to keep these conventions consistent:

- install slug: kebab-case, e.g. `feature-grid-basic`
- block folder and config export: PascalCase, e.g. `FeatureGridBasic`
- Payload block slug: camelCase, e.g. `featureGridBasic`
- interface and component export: PascalCase + `Block`, e.g. `FeatureGridBasicBlock`

The template includes:

- `manifest.json`
- `config.ts`
- `Component.tsx`
- an internal authoring note

Normalized alpha-kit blocks should:

- declare explicit `labels.singular` and `labels.plural`
- stay server-first unless interactivity is required
- type their real shipped component props from generated `@/payload-types`
- preserve optional wrapper props for `id`, `className`, and `disableInnerContainer`

## Files

- `registry.json`: shadcn-compatible local registry definition
- `../public/r/`: ignored, generated public shadcn registry artifacts
- `manifests/`: alpha kit manifests for the shipped and in-progress kits
- `schema/poc-manifest.schema.json`: manifest validation schema
- `support-matrix.json`: supported repo-shape contract for the POC
- `templates/alpha-kit/`: internal scaffolds for future alpha-kit authoring

## Manual Smoke Test

```bash
pnpm payload-kit add hero-basic
pnpm payload-kit add feature-grid-basic
```

`payload-kit init` and `payload-kit doctor` remain placeholder commands in this alpha tranche.
