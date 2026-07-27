# Northfield School — asset provenance

The education-course concept declares `assets: []` and ships **no runtime raster
assets**. Every plate, panel, portrait well, and placeholder across its five pages
is derived from the concept's scoped theme tokens
(`src/components/site/templates/education-course/theme.css`) via CSS gradients and
inset shadows, so the whole site re-tints from that one file.

## What stands in for artwork

| Surface | Composition | Built from |
| --- | --- | --- |
| Hero prospectus panel (`prospectus`) | Ruled contents column, a four-line type specimen waterfall with one line marked, a baseline-grid plate, and a marked-up proof swatch | layered `linear-gradient` / `repeating-linear-gradient` over `--nf-sheet`, `--nf-chalk-deep`, `--nf-ink`, `--nf-highlight` |
| Lesson handout plates (`lessons`) | Portrait ruled sheet with a heading block and one highlighted line | as above |
| Coursework wall (`what-you-make`) | A twelve-cell grid of pinned sheets with one cell marked | `repeating-linear-gradient` on both axes plus one positioned wash |
| Archive hang (`student-work`) | Four final sheets of differing widths hung from a rail | four positioned gradient bars plus one rail rule |
| Principal's portrait plate (`teaching-philosophy`) | Studio vignette over a ruled field with a warm corner wash | `radial-gradient` + `linear-gradient` + rules |
| Faculty contact sheet (`faculty`) | 4:5 portrait wells with a vignette and a fine ruled field | `radial-gradient` + `repeating-linear-gradient` |
| Northfield mark (shell chrome) | A ruled page with a marker stroke laid across the middle rule and running past the page edge | inline SVG in `NorthfieldMark.tsx`, filled from `--nf-highlight` |

No third-party artwork, photography, or trademark is used. The employer wordmarks
on the home page come from the shared, invented
`src/components/site/demos/DemoLogos` set that every concept uses; this theme hides
their icon marks and sets the names as a typeset colophon run.

Typefaces are the site's own, loaded once by the root layout and shared with every
other concept: Geist and Geist Mono (SIL OFL 1.1, via `geist/font`) and Instrument
Serif italic (SIL OFL 1.1, via `next/font/google`). This concept loads no
additional fonts.

If the art direction ever introduces a real asset, record it here with its path,
source or generation method, licence, creator where applicable, and human-readable
alt text — `tests/int/template-showcases.int.spec.ts` requires every declared asset
to exist under `public/templates/education-course/` with provenance, licence,
dimensions, and alt text.

Poster images under `posters/` are generated build artefacts, captured
deterministically by `tools/templates/capture.ts` (`pnpm templates:capture`) from
the concept's own preview routes. They are not third-party assets.
