# Rivermouth Trust — asset provenance

FOUNDATION SKELETON. The nonprofit-cause concept currently declares `assets: []` and
ships **no runtime raster assets**: every plate, glow, and placeholder in its
pages is derived from the concept's scoped theme tokens via CSS gradients, so
the whole site re-tints from `theme.css` alone.

The art-direction track owns this file. If it introduces any real asset, record
each one here with its path, source or generation method, licence, creator where
applicable, and human-readable alt text — `tests/int/template-showcases.int.spec.ts`
requires every declared asset to exist under `public/templates/nonprofit-cause/` with
provenance, licence, dimensions, and alt text.

Poster images under `posters/` are generated build artefacts, captured
deterministically by `tools/templates/capture.ts` (`pnpm templates:capture`) from
the concept's own preview routes. They are not third-party assets.
