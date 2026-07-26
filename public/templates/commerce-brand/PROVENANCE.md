# Fieldnote (commerce-brand) — asset provenance

Fieldnote is a fictional specialty-coffee roastery built as a **Concept preview**.
It is not a real company. Its name, coffees, farms, growers, people, testimonials,
café stockists, and every number are invented and illustrative; contact addresses
use the reserved `fieldnote.example` domain. There are no prices anywhere in the
concept — standing orders are expressed as a cadence and a weight.

## Runtime assets

This concept ships **no raster or hotlinked runtime assets**, so
`src/lib/templates/commerce-brand.ts` declares `assets: []`.

Everything visual is rendered live from repository code:

- **Imagery** is token-derived. The demo twins render backend-free `bg-muted`
  placeholders, and the scoped theme
  (`src/components/site/templates/commerce-brand/theme.css`) repaints every one of
  them as a layered CSS "product plate" — a warm key light, an ember pool, and
  espresso shade mixed from the Fieldnote tokens with `color-mix()`. The
  `hero-kinetic` film still, the logo-cloud wordmarks, the avatar and portrait
  placeholders, and the feature-card still lifes are all CSS/SVG from
  `src/components/site/demos/`.
- **The Fieldnote bean mark** is an inline SVG authored for this concept in
  `src/components/site/templates/commerce-brand/FieldnoteCounter.tsx`.
- **Typography** uses only the fonts the root layout already loads via
  `next/font` (Geist Sans, Geist Mono, and the Instrument Serif accent used for
  the hero's closing word, the proof quote, and the footer sign-off). This
  template adds no font files.
- **Colour** is entirely scoped CSS variables; no third-party palette or theme is
  vendored.

The `stats-proof` twin renders a static stockist wordmark ("NORTHWIND") that is
part of the shared demo twin, not a Fieldnote asset; the theme restyles it as a
café lockup and the quote is attributed to that fictional café.

## Generated posters

`public/templates/commerce-brand/posters/*.jpg` are deterministic screenshots
produced by `tools/templates/capture.ts` (`pnpm templates:capture`) against the
running preview at the template's current `revision`. They are screenshots of
this repository's own rendered output and introduce no third-party material.
Regenerate them whenever the concept's visual direction changes, and bump
`revision` in the same change.
