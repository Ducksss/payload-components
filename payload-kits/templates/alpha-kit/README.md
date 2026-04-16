# Alpha Kit Template

Copy this template when starting a new in-repo alpha kit. It is the internal source of truth for naming, file layout, and the minimal block/component shape that future kits should follow.

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
- Prefer shared field helpers like `linkGroup` before inventing kit-specific primitives.
- Keep the block component server-first.
- Replace the temporary scaffold prop type in `Component.tsx` with the generated `@/payload-types` block type after wiring the block and running `generate:types`.
- Preserve the optional wrapper props surface:
  - `id?: string`
  - `className?: string`
  - `disableInnerContainer?: boolean`
- Update the manifest file list, Payload fragments, and `recovery.patchedFiles` so install metadata stays aligned with the real block source.

## Copy Checklist

1. Rename `ExampleBasic` / `exampleBasic` / `example-basic` everywhere.
2. Update the manifest metadata and sample content.
3. Update the block fields to match the new kit.
4. Replace the scaffold component prop type with the generated payload type import.
5. Wire the block into the registry and install flow in the relevant PR.
