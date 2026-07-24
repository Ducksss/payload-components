# Fieldnote (commerce-brand) — asset provenance

Fieldnote is a fictional specialty-coffee brand built as a **Concept preview**. It
is not a real company; its name, copy, products, and any metrics are invented and
illustrative.

## Runtime assets

This concept renders no hotlinked or raster runtime assets. All imagery is
token-derived (CSS gradients/composition from the scoped theme), so `assets: []`
in `src/lib/templates/commerce-brand.ts` and the demo twins fall back to their
own `bg-muted` placeholders.

## Generated posters

`public/templates/commerce-brand/posters/*.jpg` are deterministic screenshots
produced by `tools/templates/capture.ts` (`pnpm templates:capture`) against the
running preview at the template's current `revision`. Regenerate them whenever the
concept's visual direction changes and bump `revision` in the same change.
