# Payload Components Workspace

This directory holds the in-repo registry, manifests, support matrix, and internal authoring scaffolds for `payload-components`.

## Goal

Wrap real shadcn-compatible registry items with `payload-components add`, wire them into Payload, and regenerate types and the admin import map — landing every install as one reviewable diff. The shipped catalog spans the major landing-page families — hero through pricing, testimonials, stats, and footer; the root `README.md` carries the full inventory, kept in sync with `registry.json` by test.

## Install contract

Every installable page block must keep all of the following true — the release gate enforces them on every change:

- Every installable page block installs through a real shadcn-compatible registry flow.
- The install adds the block source files to the target project.
- The install wires the block into `src/blocks/RenderBlocks.tsx`.
- The install wires the block into `src/collections/Pages/index.ts`.
- The install runs `generate:types` and `generate:importmap` successfully.
- A second install is idempotent.

Brittle repo patching or unreliable generation is a release blocker, not a rough edge: fixes to the install contract land before catalog growth.

Workspace reality: `payload-components add` installs components, `payload-components add --dry-run` validates and prints the same file, wiring, dependency, command, and state plan without mutating the target, `payload-components seed` writes an opt-in demo script for a fully installed component, `payload-components doctor` diagnoses target projects without changing files, and `payload-components init` delegates to `shadcn init` to create the `components.json` baseline for targets missing it. `payload-components add` expects that baseline and does not run init automatically as a side effect.

## Demo seed contract

`payload-components seed <component>` requires a current installed-state record
and verifies compatible dependencies, all manifest-owned and
registry-dependency files, and both Payload wiring fragments. It then writes
`payload-components/seed-<component>.ts`. `add <component> --demo` performs the
same generation only after the normal install has recorded success. Generation
does not open a database or add a runtime dependency.

The CLI derives the Payload config import from the detected target. It writes
through an atomic rename, marks generated scripts with a versioned header, and
refuses unowned files, pre-existing symlinks, non-files, and paths outside the
consumer repo.
It also creates a private high-entropy ownership record under
`.payload-components/demo-state/`, separate from the database-visible demo
fields.
The operator explicitly runs the script with the project's Payload CLI.

The generated script requires Pages drafts and never publishes implicitly. It
creates a Page only when the slug is free, records the returned Page and Media
IDs, and reruns only against those exact IDs after checking a private tokenized
marker. Each create gets a write-ahead operation token in the private record, so
an interrupted run can reconcile only the single database document carrying
that exact token before persisting its ID. Updates use `overrideLock: false`.
Upload placeholders use a unique OS temporary directory; a failed Media ID save
or Page write remains safe to retry. Generated scripts never delete Media, and
all Local API failures propagate.

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

## Installed Source and Database Migrations

`payload-components add` does not overwrite installed component source. Registry changes affect
new installs only unless a maintainer explicitly ports a source diff into an existing Payload app.
That ownership boundary keeps repeat installs idempotent and preserves consumer customizations.

When an adopted source change adds or changes a persisted database identifier such as `dbName`,
the SQL-backed consumer project must own the migration. The registry cannot safely infer the app's
collection slug, block-field path, database adapter, schema, existing table names, or migration
history. After porting the source diff, run `pnpm payload migrate:create <migration-name>` in the
consumer app. Review the generated DDL to ensure it will rename rather than drop and recreate the
existing tables, indexes, or enums; replace destructive DDL with an explicit rename or backfill.
Test the migration against a backup or staging database, then run it before deploying the updated
config. Existing installs that do not port the source change keep their installed config and require
no registry-driven migration.

## Verification Suite

Use all three verification layers. They prove different properties and are not substitutes for
one another.

### Deterministic fixture checks

- `pnpm test:registry`: checks that the public registry can be reproduced from source.
- `pnpm test:install`: runs the fast wrapper fixture suite against generated minimal Payload targets.

These checks stay network-free and prove the wrapper contract without making this repository itself
a Payload app:

- every manifest maps to registry source, docs, and recovery targets
- representative components install into a supported target
- multi-component install order avoids duplicate wiring
- repeated installs are idempotent
- `RenderBlocks.tsx` and `Pages/index.ts` are wired exactly once
- `.payload-components/state.json` records success, partial failure stages, and successful-install source hashes correctly
- the wrapper installs missing public `registryDependencies`, then strips them from its temporary shadcn item before installing the block files

### Fresh-consumer smoke validation

`pnpm test:fresh` creates real Payload website targets and installs every matching registry and
manifest slug. CI splits the catalog into four required shards; run all four for local CI parity:

```bash
pnpm test:fresh -- --shard-index 0
pnpm test:fresh -- --shard-index 1
pnpm test:fresh -- --shard-index 2
pnpm test:fresh -- --shard-index 3
```

The runner lives at `../tools/payload-components/smoke/fresh-payload-repo.ts` and also accepts:

```bash
pnpm test:fresh -- --components hero-basic,feature-grid-basic,content-columns,logo-cloud-grid,integration-grid
pnpm test:fresh -- --registry-url https://www.payload-components.xyz/r/{name}.json
pnpm test:fresh -- --keep-temp --timeout 1200000
```

With no component override, the runner derives the complete sorted slug list from every `registry:block`
item with a matching manifest and renderable `sampleContent.blockType`. Every registry item is classified as
covered or intentionally excluded because it is not a page block, and focused tests fail if that contract
drifts. `--shard-index` accepts `0` through `3` and selects sorted indexes modulo four. Without
`--registry-url`, the runner serves `../public/r` locally and direct-installs each item URL with shadcn. With
`--registry-url`, it uses the deployed registry URL template, which is the pre-release path. Direct shadcn
verification only proves file delivery and shadcn UI dependency delivery; Payload wiring is verified through
`payload-components add`.

### Release gate

`pnpm test:release` runs lint, source generation, TypeScript, registry checks, integration tests, a
production build, and Playwright against `next start`. It is the deterministic site and registry
release gate; it does not run or replace the four fresh-consumer shards. The required PR `pr-gate`
passes only when `quick-checks`, `test:release`, compatibility checks, and every fresh shard
succeed.

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
- `support-matrix.json`: the supported repo-shape contract
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

After a successful install, `fileHashes` records normalized SHA-256 hashes for every owned
source file. Lifecycle commands compare against that install-time baseline rather than today's
registry source, so a registry upgrade is not mistaken for a consumer edit. State from older
CLI releases migrates in memory; unknown legacy baselines are protected unless the operator
explicitly accepts the overwrite or removal with `--force`.

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
