# Onboarding: building a Payload Kit component

Payload Kits is a catalog + CLI that installs Payload CMS block kits into supported Payload v3 + Next.js projects. This is the canonical reference for adding a component. It captures the model we locked while building the Hero family, so every future component follows the same shape.

## The mental model: three layers of variation

Before adding anything, decide which layer a change belongs to. Getting this right is the whole game.

| Layer | Lives in | Decided by | Example |
| --- | --- | --- | --- |
| **Content** variation | Payload block fields (runtime, in the admin) | Editor, per page | eyebrow on/off, 0–4 proof items, with/without CTA |
| **Structural** variation | A separate kit *name* in the registry | Developer, at install time | `hero-basic` vs `hero-video` vs `hero-dramatic` |
| **Project** invariants | Detected target / project config | Developer, once per repo | src alias, target shape, auto-wiring |

Decision rule — **does the change alter the code the user owns, or just the content they type?**

- Content shown → a Payload field. No new kit.
- Different markup/layout → a new kit, named by family with a suffix.
- Project-wide setting → config, set once.

Never put variant selection behind an interactive prompt. The catalog is the menu; the install command stays copy-paste, CI-, and agent-friendly.

## Naming

- One installable kit per structural variant: `hero-basic`, `hero-video`, `hero-dramatic`.
- Suffix every variant. Do not ship a bare `hero`.
- A family is just the shared prefix (`hero-*`); the catalog groups by it.

## Sharing code across a family

Variants in a family share most of their fields and some markup. Share them through a real source file every variant ships — **not** through `registryDependencies`.

1. Author the shared module under `payload-kits/source/blocks/shared`, e.g. `heroFields.ts`, exporting a Payload `Field[]`.
2. List it in each variant's registry item `files[]` (target `~/src/blocks/shared/heroFields.ts`) and in the manifest `files[]`.
3. Compose it in the variant config:

   ```ts
   import { heroFields } from '@/blocks/shared/heroFields'

   export const HeroVideo: Block = {
     slug: 'heroVideo',
     interfaceName: 'HeroVideoBlock',
     fields: [
       ...heroFields, // shared core: eyebrow, title, description, CTA links
       { name: 'videoUrl', type: 'text', required: true }, // variant-specific
     ],
     labels: { singular: 'Hero Video', plural: 'Hero Video Blocks' },
   }
   ```

**Why not `registryDependencies`?** The wrapper CLI only resolves *public shadcn UI components* there — it looks for `components/ui/<name>.tsx` and runs `shadcn add <name>`. An internal name like `hero-fields` would 404. Shared kit code is always a file in `files[]`.

The payoff: editing the shared file updates every installed variant at once, and re-running `payload-kit add` never overwrites a consumer's edited copy (the installer declines overwrite prompts).

## Steps to add a component

1. Copy `payload-kits/templates/alpha-kit` and rename `ExampleBasic` / `exampleBasic` / `example-basic`.
2. Write the block `config.ts` (compose shared family fields if it joins a family) and `Component.tsx` (server-first; swap the scaffold prop type for the generated `@/payload-types` type after wiring).
3. Add the source files plus a registry item in `payload-kits/registry.json` (targets install under `~/src/...`).
4. Add the manifest under `payload-kits/manifests` (`files`, `payloadFragments`, `recovery.patchedFiles`, `postInstall`).
5. Add a docs page under `content/docs/kits` and installer coverage.
6. If the installed file set differs from existing kits, sync the landing ledgers in `src/lib/site.ts` (`terminalDemoLines`, `frameInstalledFiles`, `wiringLedger`).

## Validate

```bash
pnpm test:registry   # registry builds + is reproducible against source
pnpm test:install    # real install into a fixture: files land, fragments wire once, state records
pnpm test:release    # full local gate before shipping
```

## Reference

- `AGENTS.md` → Registry Contract + Variants and Shared Code
- `content/docs/architecture.mdx` → runtime split + kit families and shared code
- `payload-kits/templates/alpha-kit/README.md` → authoring rules
- First applied in: `payload-kits/source/blocks/shared/heroFields.ts` (the Hero family core)
