# Payload Kits Workspace

This directory holds the in-repo registry, manifests, support matrix, and internal authoring scaffolds for `payload-kit`.

## Goal

Prove that a real shadcn-compatible registry item can be wrapped by `payload-kit add hero-basic`, then wired into Payload and regenerated successfully.

## Viability Gate

The POC passes only if all of the following are true:

- `payload-kit add hero-basic` installs the kit through a real shadcn-compatible registry flow.
- The install adds the block source files to the target project.
- The install wires the block into `src/blocks/RenderBlocks.tsx`.
- The install wires the block into `src/collections/Pages/index.ts`.
- The install runs `generate:types` and `generate:importmap` successfully.
- A second install is idempotent.

If any of those fail because of brittle repo patching or unreliable generation, we should stop and reconsider the product shape before building private registries, auth, or a larger kit catalog.

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
- `manifests/hero-basic.json`: golden kit manifest
- `schema/poc-manifest.schema.json`: manifest validation schema
- `support-matrix.json`: supported repo-shape contract for the POC
- `templates/alpha-kit/`: internal scaffolds for future alpha-kit authoring

## Manual Smoke Test

```bash
pnpm payload-kit add hero-basic
pnpm payload-kit doctor
```
