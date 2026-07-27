# Alder Practice — asset provenance

The healthcare-clinic concept declares `assets: []` and ships **no runtime raster
assets**. Every plate, glow, arch and avatar well on its five pages is derived
from the concept's scoped theme tokens
(`src/components/site/templates/healthcare-clinic/theme.css`) via CSS gradients,
so the whole site re-tints from that one file.

Two token-derived motifs are worth recording, because they replace what would
otherwise be photography:

- **The arch of daylight** — every backend-free upload placeholder (`bg-muted`)
  is painted as a crisp pale-sky arch cut into a warm wall, with light spilling
  across the wall and a soft pool on the floor. Built from four stacked
  `radial-gradient` / `linear-gradient` layers over `--al-wall`, mixed from
  `--al-sky-pale`, `--al-green` and `--al-ink`. Percentage-sized, so it stays a
  well-proportioned arch in a 16/7 letterbox, a 4/3 row and a tall portrait
  alike.
- **The sunlit disc** — round wells (team-roster staff avatars, the
  content-community team row) are too small for the arch silhouette, so they take
  a two-layer sky-to-wall gradient instead.

The shell wordmark (`AlderHeader.tsx`) is an inline two-path SVG of the same arch,
authored for this concept. It carries no external source and needs no licence.

There is nothing third-party here: no photographs, no icon sets beyond the
`lucide-react` marks the demo twins already import, no fonts beyond the site's own
`next/font` stack, and no copied CSS. If the concept ever does introduce a real
asset, record each one here with its path, source or generation method, licence,
creator where applicable, and human-readable alt text —
`tests/int/template-showcases.int.spec.ts` requires every declared asset to exist
under `public/templates/healthcare-clinic/` with provenance, licence, dimensions
and alt text.

Poster images under `posters/` are generated build artefacts, captured
deterministically by `tools/templates/capture.ts` (`pnpm templates:capture`) from
the concept's own preview routes at the current `revision`. They are not
third-party assets.
