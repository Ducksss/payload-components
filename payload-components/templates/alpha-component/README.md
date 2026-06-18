# Alpha Component Template

Copy this template when starting a new in-repo alpha component. It is the internal source of truth for naming, file layout, and the minimal block/component shape that future components should follow.

## Naming Map

- Install slug: `example-basic`
- Block folder and config export: `ExampleBasic`
- Payload block slug: `exampleBasic`
- Interface and component export: `ExampleBasicBlock`

## Expected Files

- `manifest.json` → `payload-components/manifests/<slug>.json`
- `config.ts` → `payload-components/source/blocks/<Component>/config.ts`
- `Component.tsx` → `payload-components/source/blocks/<Component>/Component.tsx`
- `doc-page.mdx` → `content/docs/components/<slug>.mdx` (the fixed component doc-page format)

## Authoring Rules

- Keep block configs explicit: `slug`, `interfaceName`, `labels.singular`, and `labels.plural`.
- Prefer shared field helpers like `linkGroup` before inventing component-specific primitives.
- Keep the block component server-first.
- Replace the temporary scaffold prop type in `Component.tsx` with the generated `@/payload-types` block type after wiring the block and running `generate:types`.
- Preserve the optional wrapper props surface:
  - `id?: string`
  - `className?: string`
  - `disableInnerContainer?: boolean`
- Update the manifest file list, Payload fragments, and `recovery.patchedFiles` so install metadata stays aligned with the real block source.

## Accessibility

Every component ships into real sites, so bake these in — they are part of the bar, not a follow-up:

- **Images** render through `Media`, which resolves `alt` from the upload. When an image is a link's only
  child (e.g. a logo wall), put the human label on the link itself — `aria-label={item.name}` — instead of
  relying on the editor to fill `alt`. Keep an editable name/`alt` field on each image item.
- **Motion**: any auto-playing or looping animation (marquees, carousels) must honor
  `prefers-reduced-motion` via `useReducedMotion()` from `motion/react` (skip/freeze the motion when it's
  set). Never strip visible focus — keep `:focus-visible` styling on interactive elements.
- **Headings & landmarks**: blocks start at `<h2>` (the page owns the `<h1>`); don't skip levels. Wrap the
  block in a `<section>` and use real landmarks/`<figure>`/`<blockquote>` where they fit.
- **Forms / inputs** (required when the family is a form component):
  - A real `<label htmlFor>` paired with each control's `id`. Placeholders are **not** labels.
  - Email fields: `type="email"` + `inputMode="email"` + `autoComplete="email"`. Set the correct
    [`autocomplete` token](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/autocomplete) on
    every field (`name`, `organization`, `tel`, …) so password managers and mobile autofill work.
  - Mark `required` fields, and surface validation with `aria-invalid` plus an error message linked by
    `aria-describedby` (the shadcn `Input` already styles the `aria-invalid` state).
  - Buttons inside a form that don't submit need `type="button"`; the submit control is `type="submit"`.
  - An optional spam honeypot stays `aria-hidden` + `tabIndex={-1}` + `autoComplete="off"`.

## Variants and Shared Fields

A structural variant is its own component, not a CLI flag. Name variants by family with a suffix — `hero-basic`, `hero-video`, `hero-dramatic` — and never ship a bare family name. Choosing a variant happens in the catalog, not an install prompt.

Share a family's common fields through a real source file every variant ships:

- Put the shared fields in `payload-components/source/blocks/shared/<family>Fields.ts`, exporting a `Field[]`.
- List that file in each variant's registry item `files[]` (target `~/src/blocks/shared/<family>Fields.ts`) and the manifest `files[]`.
- Compose it in the config: `fields: [...<family>Fields, /* variant-specific fields */]`.

Do not wire internal shared modules through `registryDependencies` — that resolves only public shadcn UI components. Editing the shared file updates every installed variant at once, and re-running `payload-components add` never overwrites a consumer's edited copy.

## Doc page

`doc-page.mdx` is the **fixed component doc-page format** (mirrors the shadcn component docs). Copy it to
`content/docs/components/<slug>.mdx`. The page header — title, description, at-a-glance chips, prev/next
arrows, Copy Page — is rendered automatically for `/docs/components/*` by `ComponentDocHeader`
(`src/app/docs/[[...slug]]/page.tsx`), so the MDX has **no `<h1>` and no repeated description**.
Body order is fixed and nothing precedes the preview:

1. `<ComponentPreview slug="<slug>" />` — live Preview / Code tabs (Code = every installed file:
   `config.ts`, `Component.tsx`, shared `*Fields.ts`).
2. `## Installation` — `<Tabs items={['Command', 'Manual']}>`.
3. `## What it installs` — `<ComponentWiring slug="<slug>" />`: copied files + a factual table of the edits
   the install makes (register / map / regenerate) + the shared-base callout + idempotency, all from
   the manifest. State facts, not a shadcn comparison (that lives on the landing).
4. `## Content model` — `<TypeTable>` of the fields (+ a second table for array-item fields). The one
   hand-authored section; note shared-base vs variant fields.
5. `## Usage` — `<ComponentUsage slug="<slug>" />`: the admin steps (add the block to a Page → fill → publish).
6. `## Requirements` — `<ComponentRequirements slug="<slug>" />`: target, Payload/Next majors, shadcn deps.
7. `## In this family` — `<ComponentFamily slug="<slug>" />`: sibling variants. Include **only when the
   family has 2+ variants** (renders nothing for a lone one; omit the heading too).

`<ComponentWiring>`/`<ComponentUsage>`/`<ComponentRequirements>`/`<ComponentFamily>` are **data-driven** from the
manifest/registry (`src/lib/component-manifest.ts`), so the MDX stays thin and the sections never drift.
Full spec: `AGENTS.md` → "Component doc page format".

## Add-a-component workflow

Every component ships as one bundle — source, manifest, registry entry, demo twin, catalog/ledger sync,
doc page, and installer tests, together. Work in this order:

1. **Source** — copy `config.ts` + `Component.tsx` to `payload-components/source/blocks/<Component>/`; rename
   `ExampleBasic`/`exampleBasic`/`ExampleBasicBlock`/`example-basic`. Compose the shared family base
   (`fields: [...<family>Fields, /* variant-specific */]`); extract
   `payload-components/source/blocks/shared/<family>Fields.ts` if the family shares fields. Keep wrapper
   props (`id`/`className`/`disableInnerContainer`). Use only consumer-safe shadcn tokens (no
   site-only `brand`); write content classes as plain `className="…"` literals (so the demo twin can
   mirror them token-for-token) and reserve `cn()` for the root + `disableInnerContainer` conditionals.
2. **Manifest** — copy `manifest.json` to `payload-components/manifests/<slug>.json`; update name, title,
   description, `registryItemName`, `files[]` (shared file first), `payloadFragments`,
   `recovery.patchedFiles`, `preview.summary`, and `sampleContent`.
3. **Registry** — add an item to `payload-components/registry.json`: `files[]` (shared → config →
   Component), `registryDependencies` (only the public shadcn UI it imports, e.g. `badge`, `card`),
   the `docs` string (must contain `payload-components add <slug>` and `/r/<slug>.json`), and
   `meta.payloadComponent`.
4. **Demo twin** — add `src/components/site/demos/<Component>Demo.tsx` mirroring the component's
   `className="…"` literals verbatim (aria-hidden root, no `<a>`/`<button>`/`<h1-6>`; `<h2>`→`<div>`,
   `CMSLink`→`<DemoLink>`, payload types → demo-content types). Add sample content to
   `src/lib/demo-content.ts` and register the slug in `src/components/site/demos/registry.ts`.
5. **Catalog & ledgers** — add the component to `componentEntries` (`src/lib/site.ts`); update the installable
   counts (`componentsIntro`, `componentFamilies.pages.countLabel`, `src/app/about/page.tsx`) and the component lists
   in `src/app/not-found.tsx`, `tools/payload-components/cli.ts`, and the smoke `DEFAULT_SMOKE_COMPONENTS`. Sync
   the hero ledgers (`terminalDemoLines`/`frameInstalledFiles`/`wiringLedger`) only if a hero component's
   file set changed.
6. **Doc page** — copy `doc-page.mdx` to `content/docs/components/<slug>.mdx` (see "Doc page" above); add
   the slug to `content/docs/components/meta.json`; optionally add a Card to `content/docs/index.mdx`.
   Sidebar grouping is automatic (`src/lib/component-page-tree.tsx`).
7. **Tests** — add the `(component, twin)` pair to `tests/int/demo-twins.int.spec.ts`; add the name +
   `registryDependencies` to `tests/int/public-registry.int.spec.ts`; add an install+state spec to
   `tests/int/payload-components.int.spec.ts`.
8. **Verify** — `pnpm registry:build`, then the gate: `pnpm lint && pnpm source:build && pnpm exec
   tsc --noEmit && pnpm test:registry && pnpm run test:int && pnpm run test:e2e && pnpm build`
   (run e2e with a free `E2E_PORT`, e.g. `E2E_PORT=3142`).
