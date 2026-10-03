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

Workspace reality: `payload-components add` installs components, `payload-components add --dry-run` validates and prints the same file, wiring, dependency, command, and state plan without mutating the target, `payload-components seed` writes an opt-in demo script for a fully installed component, `payload-components doctor` diagnoses target projects without changing files, and `payload-components init` delegates to `shadcn init` to create the `components.json` baseline for targets missing it. `payload-components add` expects that baseline and does not run init automatically as a side effect; `init --scaffold` additionally lays down the managed starter base a bare Payload app needs. `list`, `diff`, `update`, `remove`, `localize`, `templates`, `add-template`, and `mcp` complete the lifecycle — the [CLI reference](https://www.payload-components.xyz/docs/cli) covers every command and flag.

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

### shadcn directory listing

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

## Installed Source and Database Migrations

`payload-components add` does not overwrite installed component source. Registry changes reach an
existing install only through `payload-components update` — which refuses locally edited files
unless `--force` — or when a maintainer ports a source diff by hand. That ownership boundary keeps
repeat installs idempotent and preserves consumer customizations.

When an adopted source change adds or changes a persisted database identifier such as `dbName`,
the SQL-backed consumer project must own the migration. The registry cannot safely infer the app's
collection slug, block-field path, database adapter, schema, existing table names, or migration
history. After updating or porting the source change, run `pnpm payload migrate:create <migration-name>` in the
consumer app. Review the generated DDL to ensure it will rename rather than drop and recreate the
existing tables, indexes, or enums; replace destructive DDL with an explicit rename or backfill.
Test the migration against a backup or staging database, then run it before deploying the updated
config. Existing installs that do not take the source change keep their installed config and require
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
passes only when `quick-checks` and `test:release` succeed. For any change that can affect
consumers it also requires the Node 20 compatibility check and every fresh shard. Site- and
docs-only changes skip those jobs (`tools/ci/classify-changes.mjs` decides), and the gate fails
whenever their result does not match that classification.

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

The reusable starter for future components lives in `component-template/`.
`pnpm payload-components new <slug>` scaffolds a component from it; its README is the full
add-a-component workflow. It is repository-only tooling and is not part of the npm package.

Use it to keep these conventions consistent:

- install slug: kebab-case, e.g. `feature-grid-basic`
- block folder and config export: PascalCase, e.g. `FeatureGridBasic`
- Payload block slug: camelCase, e.g. `featureGridBasic`
- interface and component export: PascalCase + `Block`, e.g. `FeatureGridBasicBlock`

The template includes:

- `manifest.json`
- `config.ts`
- `Component.tsx`
- `doc-page.mdx`, the fixed component doc-page format
- `README.md`, the authoring, accessibility, and add-a-component workflow notes

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
- `install-baselines.json`: immutable per-version source hashes, appended by `pnpm registry:snapshot`
- `schema/poc-manifest.schema.json`: manifest validation schema
- `support-matrix.json`: the supported repo-shape contract
- `templates/*.json`: generated full-site template install contracts (`pnpm templates:build`)
- `component-template/`: internal scaffold for future component authoring (not published)
- `PROVENANCE.md`: upstream layout provenance and the tailark/blocks drift ledger

## Manual Smoke Test

Run the in-repo CLI against a separate supported Payload project with the global `--cwd` flag.
Without it, the CLI targets the current directory — this repository, which is not a Payload app.

```bash
pnpm payload-components add hero-basic --cwd ../my-payload-app
pnpm payload-components add feature-grid-basic --cwd ../my-payload-app
pnpm payload-components add content-columns --cwd ../my-payload-app
pnpm payload-components add logo-cloud-grid --cwd ../my-payload-app
pnpm payload-components add integration-grid --cwd ../my-payload-app
pnpm payload-components doctor --cwd ../my-payload-app
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

Use this sequence from the consumer project root to debug recovery:

```bash
npx payload-components doctor
npx payload-components add hero-basic
npx payload-components doctor
```

Owned component files are the files the wrapper installs, such as
`src/blocks/HeroBasic/config.ts` and `src/blocks/HeroBasic/Component.tsx`. Patched host files
are target-project files the wrapper edits, such as `src/blocks/RenderBlocks.tsx`,
`src/collections/Pages/index.ts`, `package.json`, and the active lockfile. Do not delete patched
host files to recover. Review the git diff, fix the reported root cause, and rerun the same `add`
command so the idempotent file, dependency, fragment, and post-install checks can finish.
