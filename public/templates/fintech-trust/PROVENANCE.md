# Ledgerline (fintech-trust) — asset provenance

Ledgerline is a fictional money-movement infrastructure platform built as a
**Concept preview**. It is not a real company; its name, copy, customers, and any
metrics or compliance claims are invented and illustrative.

## Runtime assets

This concept renders no hotlinked or raster runtime assets. All imagery is
token-derived (CSS gradients/composition from the scoped theme), so `assets: []`
in `src/lib/templates/fintech-trust.ts` and the demo twins fall back to their own
`bg-muted` placeholders. No real customer logos are used.

## Generated posters

`public/templates/fintech-trust/posters/*.jpg` are deterministic screenshots
produced by `tools/templates/capture.ts` (`pnpm templates:capture`) against the
running preview at the template's current `revision`. Regenerate them whenever the
concept's visual direction changes and bump `revision` in the same change.
