# Portfolio (portfolio-solo) — asset provenance

This is a fictional solo designer-developer's personal site built as a **Concept
preview**. It does not represent a real person; the maker, copy, projects,
clients, and any metrics are invented and illustrative.

## Runtime assets

This concept renders no hotlinked or raster runtime assets. All imagery is
token-derived (CSS gradients/composition from the scoped theme), so `assets: []`
in `src/lib/templates/portfolio-solo.ts` and the demo twins fall back to their own
`bg-muted` placeholders. No real client logos or likenesses are used.

## Generated posters

`public/templates/portfolio-solo/posters/*.jpg` are deterministic screenshots
produced by `tools/templates/capture.ts` (`pnpm templates:capture`) against the
running preview at the template's current `revision`. Regenerate them whenever the
concept's visual direction changes and bump `revision` in the same change.
