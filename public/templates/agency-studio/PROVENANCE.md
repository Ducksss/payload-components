# Northline (agency-studio) — asset provenance

This concept ships **no runtime raster assets**. The template definition
(`src/lib/templates/agency-studio.ts`) declares `assets: []`.

- All imagery on the preview pages is presentational: the demo twins render
  backend-free placeholder surfaces (gradient posters, `bg-muted` plates,
  monogram avatars), tinted by the scoped theme in
  `src/components/site/templates/agency-studio/theme.css`.
- Typography uses only the fonts the root layout already loads via
  `next/font` (Geist Sans, Geist Mono, Instrument Serif). No new font files
  are added by this template.
- All copy, client names, people, metrics, and testimonials are original
  fiction written for this concept. Any resemblance to real companies or
  people is coincidental.
- Poster images under `public/templates/agency-studio/posters/` are **build
  artifacts** generated later by `tools/templates/capture.ts` from the
  template's own preview routes; they are screenshots of this repository's
  rendered output and carry the repository license.
