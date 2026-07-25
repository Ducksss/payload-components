# Ilse Renko (portfolio-solo) — asset provenance

This concept is a fictional solo designer-developer's personal site, published as
a **Concept preview**. "Ilse Renko" is not a real person. The maker, her clients
(Kaskad, Lume Type, Icefield Institute, Nordsund Rail, Plainform), her
collaborators, the quotes, the essay titles, the address, the email address, the
telephone number, and every metric are invented for this concept. Any resemblance
to real people or companies is coincidental.

## Runtime assets

This concept ships **no runtime raster assets**. The template definition
(`src/lib/templates/portfolio-solo.ts`) declares `assets: []`, and nothing on the
preview pages is hotlinked.

- Every image well on the pages is **token-derived art**: the demo twins render
  backend-free `bg-muted` placeholders, and the scoped theme in
  `src/components/site/templates/portfolio-solo/theme.css` paints them as a paper
  stock using only `color-mix()` over this template's own tokens (a faint
  diagonal sheen over a repeating 1px rule field, plus an inset hairline). No
  images, SVGs, or data URIs are involved.
- The hero's "film still" is likewise built entirely from tokens by the
  `hero-kinetic` block itself (CSS gradients mixed from `--background`,
  `--foreground`, and `--brand`); this template only re-points `--brand` to a
  lifted slate inside the ink plate so the bloom registers against near-black.
- No client logos, wordmarks, or likenesses appear anywhere. The stand-in
  customer wordmark and logo blocks that the quote twins render for a Media
  upload are deliberately hidden by the theme — a one-person site does not badge
  other people's words with their employer's mark.
- Typography uses only the fonts the root layout already loads via `next/font`
  (Geist Sans, Geist Mono, and Instrument Serif for the single italic word in
  the home headline). This template adds no font files.

## Generated posters

`public/templates/portfolio-solo/posters/*.jpg` are **build artifacts**:
deterministic screenshots produced by `tools/templates/capture.ts`
(`pnpm templates:capture`) from this template's own preview routes at the
current `revision`. They are screenshots of this repository's rendered output and
carry the repository license. Regenerate them whenever the concept's visual
direction changes, and bump `revision` in the same change.
