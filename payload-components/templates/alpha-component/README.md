# Alpha Component Template

Copy this template when starting a new in-repo alpha component. It is the internal source of truth for naming, file layout, and the minimal block/component shape that future components should follow.

## Naming Map

- Install slug: `example-basic`
- Block folder and config export: `ExampleBasic`
- Payload block slug: `exampleBasic`
- Interface and component export: `ExampleBasicBlock`

## Expected Files

- `manifest.json`
- `config.ts`
- `Component.tsx`

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

## Variants and Shared Fields

A structural variant is its own component, not a CLI flag. Name variants by family with a suffix — `hero-basic`, `hero-video`, `hero-dramatic` — and never ship a bare family name. Choosing a variant happens in the catalog, not an install prompt.

Share a family's common fields through a real source file every variant ships:

- Put the shared fields in `payload-components/source/blocks/shared/<family>Fields.ts`, exporting a `Field[]`.
- List that file in each variant's registry item `files[]` (target `~/src/blocks/shared/<family>Fields.ts`) and the manifest `files[]`.
- Compose it in the config: `fields: [...<family>Fields, /* variant-specific fields */]`.

Do not wire internal shared modules through `registryDependencies` — that resolves only public shadcn UI components. Editing the shared file updates every installed variant at once, and re-running `payload-components add` never overwrites a consumer's edited copy.

## Copy Checklist

1. Rename `ExampleBasic` / `exampleBasic` / `example-basic` everywhere.
2. Update the manifest metadata and sample content.
3. Update the block fields to match the new component.
4. Replace the scaffold component prop type with the generated payload type import.
5. Wire the block into the registry and install flow in the relevant PR.
