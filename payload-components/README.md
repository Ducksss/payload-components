# Payload Components Workspace

This directory holds the in-repo registry, manifests, support matrix, and internal authoring scaffolds for `payload-components`.

## Goal

Prove that real shadcn-compatible registry items can be wrapped by `payload-components add`, then wired into Payload and regenerated successfully. The shipped set now covers hero, feature, embed, content, logo-cloud, integration, call-to-action, and team page blocks.

## Viability Gate

The POC passes only if all of the following are true:

- Every installable page block installs through a real shadcn-compatible registry flow.
- The install adds the block source files to the target project.
- The install wires the block into `src/blocks/RenderBlocks.tsx`.
- The install wires the block into `src/collections/Pages/index.ts`.
- The install runs `generate:types` and `generate:importmap` successfully.
- A second install is idempotent.

If any of those fail because of brittle repo patching or unreliable generation, we should stop and reconsider the product shape before building private registries, auth, or a larger component catalog.

Workspace reality: `payload-components add` installs components, `payload-components doctor` diagnoses target projects without changing files, and `payload-components init` delegates to `shadcn init` to create the `components.json` baseline for targets missing it. `payload-components add` expects that baseline and does not run init automatically as a side effect.

## Public Registry Contract

The source registry is `payload-components/registry.json`. Its file entries read Payload-target source from `payload-components/source` and still install into target projects under `~/src/blocks/...`. The publishable registry is generated into ignored build output under `public/r`:

- `public/r/registry.json`: flat registry index for namespace and directory consumers
- `public/r/<component>.json`: generated registry item with embedded file content

Build and validate it with:

```bash
pnpm registry:build
pnpm registry:check
```

Production builds run `registry:build` automatically through the package `prebuild` script. `registry:check` builds the registry into a temp directory and verifies the generated output against `payload-components/registry.json` and the source block files.

Direct public installs use the generated item URLs:

```bash
pnpm dlx shadcn@latest add https://www.payload-components.xyz/r/hero-basic.json
pnpm dlx shadcn@latest add https://www.payload-components.xyz/r/feature-grid-basic.json
pnpm dlx shadcn@latest add https://www.payload-components.xyz/r/content-columns.json
pnpm dlx shadcn@latest add https://www.payload-components.xyz/r/logo-cloud-grid.json
pnpm dlx shadcn@latest add https://www.payload-components.xyz/r/integration-grid.json
```

For a complete install, use `payload-components add`. The shadcn registry delivers files and shadcn UI dependencies; the wrapper adds the Payload-specific registration layer and post-install generation.

Namespace consumers can configure:

```json
{
  "registries": {
    "@payload-components": "https://www.payload-components.xyz/r/{name}.json"
  }
}
```

Then install with `pnpm dlx shadcn@latest add @payload-components/hero-basic` or any other registry item.

## Verification Suite

Use both verification tiers:

- `pnpm test:registry`: checks that the public registry can be reproduced from source.
- `pnpm test:install`: runs the fast wrapper fixture suite against generated minimal Payload targets.
- `pnpm test:fresh`: runs the slower fresh Payload website smoke test for nightly and pre-release confidence.
- `pnpm test:release`: runs lint, source generation, TypeScript, registry checks, integration tests, Playwright E2E, and production build.

The fast fixture suite remains the normal PR gate because it is deterministic and proves the wrapper contract without making this repository itself a Payload app:

- every manifest maps to registry source, docs, and recovery targets
- representative components install into a supported target
- multi-component install order avoids duplicate wiring
- repeated installs are idempotent
- `RenderBlocks.tsx` and `Pages/index.ts` are wired exactly once
- `.payload-components/state.json` records success and partial failure stages correctly
- the wrapper installs missing public `registryDependencies`, then strips them from its temporary shadcn item before installing the block files

The fresh smoke lives at `../tools/payload-components/smoke/fresh-payload-repo.ts` and accepts:

```bash
pnpm test:fresh -- --components hero-basic,feature-grid-basic,content-columns,logo-cloud-grid,integration-grid
pnpm test:fresh -- --registry-url https://www.payload-components.xyz/r/{name}.json
pnpm test:fresh -- --keep-temp --timeout 1200000
```

Without `--registry-url`, the runner serves `../public/r` locally and direct-installs each item URL with shadcn. With `--registry-url`, it uses the deployed registry URL template, which is the pre-release path. Direct shadcn verification only proves file delivery and shadcn UI dependency delivery; Payload wiring is verified through `payload-components add`.

## Current Contract

Manifests now define:

- component identity and version
- supported Payload and Next.js majors
- `dependencies` and `peerDependencies`
- owned installed files
- Payload-specific fragments to register
- `recovery.patchedFiles` for target-file patch tracking
- post-install tasks
- preview metadata and sample content

## Component Template

The reusable starter for future components lives in `templates/component-template/`.

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

Normalized component blocks should:

- declare explicit `labels.singular` and `labels.plural`
- stay server-first unless interactivity is required
- type their real shipped component props from generated `@/payload-types`
- preserve optional wrapper props for `id`, `className`, and `disableInnerContainer`

## Files

- `registry.json`: shadcn-compatible local registry definition
- `source/`: Payload-target component source consumed by registry generation
- `../public/r/`: ignored, generated public shadcn registry artifacts
- `manifests/`: component manifests for the shipped and in-progress components
- `schema/poc-manifest.schema.json`: manifest validation schema
- `support-matrix.json`: supported repo-shape contract for the POC
- `templates/component-template/`: internal scaffolds for future component authoring

## Manual Smoke Test

```bash
pnpm payload-components add hero-basic
pnpm payload-components add feature-grid-basic
pnpm payload-components add content-columns
pnpm payload-components add logo-cloud-grid
pnpm payload-components add integration-grid
pnpm payload-components doctor
```

`payload-components doctor` checks the supported project shape, required post-install scripts, and recorded install state. It exits non-zero when a recorded component is partial or drifted from disk.

## Partial install recovery

When a stage fails, the entry stays `partial` in `.payload-components/state.json` with
`lastError.stage` and `lastError.message`. The `add` output names the component, the failed
stage, the safest retry command, the owned component files, and the patched host files.

Use this sequence to debug recovery:

```bash
pnpm payload-components doctor
pnpm payload-components add hero-basic
pnpm payload-components doctor
```

Owned component files are the files the wrapper installs, such as
`src/blocks/HeroBasic/config.ts` and `src/blocks/HeroBasic/Component.tsx`. Patched host files
are target-project files the wrapper edits, such as `src/blocks/RenderBlocks.tsx`,
`src/collections/Pages/index.ts`, `package.json`, and the active lockfile. Do not delete patched
host files to recover. Review the git diff, fix the reported root cause, and rerun the same `add`
command so the idempotent file, dependency, fragment, and post-install checks can finish.
