# Rivermouth Trust — asset provenance

The nonprofit-cause concept declares `assets: []` and ships **no runtime raster
assets**. Every photographic surface across its five pages is derived from the
concept's scoped theme tokens in
`src/components/site/templates/nonprofit-cause/theme.css`, so the whole site
re-tints from that one file.

## Token-derived art in this concept

- **Stratified landscape plates.** Every backend-free upload placeholder
  (`bg-muted`) is painted as a river still: a mist gradient, a dark treeline, a
  lit waterline, water deepening toward the viewer, and a faint ripple field over
  the water only — stacked CSS gradients keyed to two custom properties,
  `--rv-horizon` and `--rv-shore`. Sections override those two values to change
  the composition, so the three "reach" rows on Our Work and the estuary plate on
  Home read as different views of the same river.
- **The letterbox hero plate** (`hero-video` on Home) is the same recipe with a
  lower horizon, plus a vertical scrim replacing the twin's flat photograph veil.
- **Portrait vignettes.** Team and volunteer avatar circles take a
  shoulders-and-sky vignette rather than a landscape, which reads as noise at
  56–80px.
- **Mount board, bank study, and gauge chrome** — the framed-plate mat, the
  four-block illustration inside the giving cards, and the staff-gauge mark in
  the header — are likewise mixed from the named `--rv-*` tokens.

No third-party imagery, typeface, or icon set is introduced by this concept. The
lucide marks in the partner marquee and the icon grids come from the shared demo
twins, not from this template.

If the concept ever introduces a real asset, record it here with its path,
source or generation method, licence, creator where applicable, and
human-readable alt text — `tests/int/template-showcases.int.spec.ts` requires
every declared asset to exist under `public/templates/nonprofit-cause/` with
provenance, licence, dimensions, and alt text.

Poster images under `posters/` are generated build artefacts, captured
deterministically by `tools/templates/capture.ts` (`pnpm templates:capture`) from
the concept's own preview routes. They are not third-party assets.
